'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { validateDispatch, REPOSITORY, REPOSITORY_ID } = require('./runtime-image-eligibility.cjs');
const MAX_ARCHIVE = 2 * 1024 ** 3;
const MAX_UNCOMPRESSED = 4 * 1024 ** 3;
function need(value, code) { if (!value) throw new Error(code); }
function imageMetadata(value, commit) {
  need(/^sha256:[a-f0-9]{64}$/.test(value.Id), 'image_id_invalid');
  need(value.Os === 'linux' && value.Architecture === 'amd64', 'image_platform_invalid');
  need(value.Config?.Labels?.['org.opencontainers.image.revision'] === commit, 'image_revision_invalid');
  need(value.Config.User === 'nextjs' && value.Config.WorkingDir === '/app' && JSON.stringify(value.Config.Cmd) === '["node","server.js"]', 'image_startup_invalid');
  need(Number.isSafeInteger(value.Size) && value.Size > 0 && value.Size <= MAX_UNCOMPRESSED, 'image_size_invalid');
  return { id: value.Id, tag: `opsolid-runtime:${commit}`, os: value.Os, architecture: value.Architecture, sizeBytes: value.Size };
}
async function digest(file) {
  const hash = crypto.createHash('sha256');
  for await (const block of fs.createReadStream(file)) hash.update(block);
  return hash.digest('hex');
}
async function main() {
  process.umask(0o077);
  const e = process.env;
  const commit = validateDispatch({ eventName: e.GITHUB_EVENT_NAME, ref: e.GITHUB_REF, sha: e.GITHUB_SHA,
    repository: e.GITHUB_REPOSITORY, repositoryId: e.GITHUB_REPOSITORY_ID, actor: e.GITHUB_ACTOR,
    triggeringActor: e.GITHUB_TRIGGERING_ACTOR, commit: e.TARGET_COMMIT });
  need(e.RUNNER_ENVIRONMENT === 'github-hosted' && process.platform === 'linux', 'hosted_linux_required');
  for (const name of ['GITHUB_RUN_ID', 'GITHUB_RUN_ATTEMPT', 'VERIFIED_RUN_ID', 'VERIFIED_RUN_ATTEMPT']) need(/^[1-9][0-9]{0,15}$/.test(e[name] || ''), 'run_identity_invalid');
  const work = path.resolve('runtime-build-private');
  const output = path.resolve('runtime-artifact');
  fs.mkdirSync(work, { mode: 0o700 }); fs.mkdirSync(output, { mode: 0o700 });
  // Neither the GitHub API token nor runner credentials enter child env or Docker context.
  const cleanEnv = { PATH: e.PATH, HOME: work, DOCKER_BUILDKIT: '0' };
  function run(command, args, options = {}) {
    const result = spawnSync(command, args, { env: cleanEnv, encoding: 'utf8', timeout: 120000, maxBuffer: 4 * 1024 ** 2, ...options });
    need(!result.error && result.status === 0, 'build_command_failed'); return result.stdout;
  }
  need(run('git', ['rev-parse', 'HEAD']).trim() === commit, 'checkout_changed');
  need(run('git', ['status', '--porcelain', '--untracked-files=no']).trim() === '', 'tracked_source_dirty');
  const tracked = run('git', ['ls-tree', '-rz', '--name-only', commit]).split('\0').filter(Boolean);
  need(!tracked.some(name => /(^|\/)\.env($|\.)/.test(name) && !/\.env\.(example|sample)$/.test(name)), 'tracked_runtime_env_forbidden');
  const context = path.join(work, 'source.tar');
  run('git', ['-c', 'core.autocrlf=false', 'archive', '--format=tar', `--output=${context}`, commit]);
  need(fs.statSync(context).size <= 256 * 1024 ** 2, 'source_context_too_large');
  const tag = `opsolid-runtime:${commit}`;
  const sourceFd = fs.openSync(context, 'r');
  try {
    run('timeout', ['--signal=TERM', '--kill-after=30s', '1800s', 'docker', 'build', '--platform', 'linux/amd64',
      '--memory=6g', '--memory-swap=6g', '--cpu-period=100000', '--cpu-quota=200000',
      '--label', `org.opencontainers.image.revision=${commit}`, '--tag', tag, '-'],
    { timeout: 1840000, stdio: [sourceFd, 'inherit', 'inherit'] });
  } finally { fs.closeSync(sourceFd); }
  const image = imageMetadata(JSON.parse(run('docker', ['image', 'inspect', tag]))[0], commit);
  const raw = path.join(work, 'image.tar');
  run('prlimit', [`--fsize=${MAX_UNCOMPRESSED}`, '--', 'docker', 'image', 'save', '--output', raw, tag], { timeout: 180000 });
  need(fs.statSync(raw).size > 0 && fs.statSync(raw).size <= MAX_UNCOMPRESSED, 'image_archive_size_invalid');
  const archive = path.join(output, 'image.tar.gz');
  const archiveFd = fs.openSync(archive, 'wx', 0o600);
  try { run('prlimit', [`--fsize=${MAX_ARCHIVE}`, '--', 'gzip', '-n', '-c', raw], { timeout: 180000, stdio: ['ignore', archiveFd, 'inherit'] }); }
  finally { fs.closeSync(archiveFd); }
  const sizeBytes = fs.statSync(archive).size;
  need(sizeBytes > 0 && sizeBytes <= MAX_ARCHIVE, 'compressed_archive_size_invalid');
  const archiveHash = await digest(archive);
  const artifactName = `opsolid-image-${commit}-${e.GITHUB_RUN_ID}-${e.GITHUB_RUN_ATTEMPT}`;
  const metadata = { schemaVersion: 1, repository: REPOSITORY, repositoryId: REPOSITORY_ID, artifactName,
    source: { commit, dockerfileSha256: crypto.createHash('sha256').update(run('git', ['show', `${commit}:Dockerfile`])).digest('hex'), contextSha256: await digest(context) },
    build: { workflow: '.github/workflows/build-runtime-image.yml', runId: e.GITHUB_RUN_ID, runAttempt: Number(e.GITHUB_RUN_ATTEMPT), verificationRunId: e.VERIFIED_RUN_ID, verificationRunAttempt: Number(e.VERIFIED_RUN_ATTEMPT) },
    image, archive: { name: 'image.tar.gz', sha256: archiveHash, sizeBytes } };
  const metadataFile = path.join(output, 'metadata.json');
  const text = JSON.stringify(metadata, null, 2) + '\n'; need(Buffer.byteLength(text) <= 8192, 'metadata_too_large');
  fs.writeFileSync(metadataFile, text, { flag: 'wx', mode: 0o600 });
  fs.writeFileSync(path.join(output, 'SHA256SUMS'), `${archiveHash}  image.tar.gz\n${await digest(metadataFile)}  metadata.json\n`, { flag: 'wx', mode: 0o600 });
  process.stdout.write(JSON.stringify(metadata) + '\n');
}
module.exports = { imageMetadata, MAX_ARCHIVE, MAX_UNCOMPRESSED };
if (require.main === module) main().catch(error => { console.error(/^[a-z_]+$/.test(error.message) ? error.message : 'runtime_image_build_failed'); process.exitCode = 1; });
