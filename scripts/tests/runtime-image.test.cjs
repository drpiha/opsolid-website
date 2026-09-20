'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const { validateDispatch, validateEvidence } = require('../ops/runtime-image-eligibility.cjs');
const { imageMetadata, MAX_ARCHIVE, MAX_UNCOMPRESSED } = require('../ops/build-runtime-image.cjs');
const sha = 'a'.repeat(40);
const repository = { full_name: 'drpiha/opsolid-website', id: 1196607461 };
const request = { eventName: 'workflow_dispatch', ref: 'refs/heads/main', sha, commit: sha, repository: repository.full_name, repositoryId: String(repository.id), actor: 'drpiha', triggeringActor: 'drpiha' };
const main = { ref: 'refs/heads/main', object: { type: 'commit', sha } };
const run = { id: 123, run_number: 7, run_attempt: 1, path: '.github/workflows/deploy.yml', event: 'push', head_branch: 'main', head_sha: sha, repository, head_repository: repository, status: 'completed', conclusion: 'success' };
function proof(runs = [run]) { return { total_count: runs.length, workflow_runs: runs }; }
test('exact owner dispatch and newest green main push are accepted', () => {
  assert.equal(validateDispatch(request), sha);
  assert.deepEqual(validateEvidence(request, main, proof()), { runId: '123', runAttempt: 1 });
});
for (const [field, value] of Object.entries({ eventName: 'push', ref: 'refs/heads/feature', sha: 'b'.repeat(40), commit: 'main', repository: 'attacker/opsolid-website', repositoryId: '1', actor: 'attacker', triggeringActor: 'attacker' })) {
  test(`dispatch rejects ${field} mismatch before build`, () => assert.throws(() => validateDispatch({ ...request, [field]: value })));
}
test('advanced main is rejected', () => assert.throws(() => validateEvidence(request, { ...main, object: { type: 'commit', sha: 'b'.repeat(40) } }, proof()), /main_changed/));
test('newer failed or incomplete verification blocks older success', () => {
  for (const state of [{ status: 'completed', conclusion: 'failure' }, { status: 'in_progress', conclusion: null }]) {
    assert.throws(() => validateEvidence(request, main, proof([run, { ...run, id: 124, run_number: 8, ...state }])), /ci_not_successful/);
  }
});
for (const [field, value] of Object.entries({ event: 'pull_request', head_branch: 'feature', head_sha: 'b'.repeat(40), path: '.github/workflows/other.yml', head_repository: { ...repository, id: 1 }, repository: { ...repository, full_name: 'attacker/repo' } })) {
  test(`verification rejects ${field} mismatch`, () => assert.throws(() => validateEvidence(request, main, proof([{ ...run, [field]: value }]))));
}
test('missing, truncated or excessive CI inventory is rejected', () => {
  for (const value of [proof([]), { ...proof(), total_count: 2 }, proof(Array(21).fill(run))]) assert.throws(() => validateEvidence(request, main, value), /ci_inventory_incomplete/);
});
const image = { Id: 'sha256:' + 'b'.repeat(64), Os: 'linux', Architecture: 'amd64', Size: 1000,
  Config: { User: 'nextjs', WorkingDir: '/app', Cmd: ['node', 'server.js'], Labels: { 'org.opencontainers.image.revision': sha } } };
test('image provenance and finite size accepted', () => assert.equal(imageMetadata(image, sha).tag, `opsolid-runtime:${sha}`));
test('wrong image identity/platform/revision/startup/size rejected', () => {
  for (const value of [{ ...image, Id: 'tag:latest' }, { ...image, Architecture: 'arm64' }, { ...image, Size: MAX_UNCOMPRESSED + 1 }, { ...image, Config: { ...image.Config, User: 'root' } }, { ...image, Config: { ...image.Config, Labels: {} } }]) assert.throws(() => imageMetadata(value, sha));
});
test('workflow has no automatic production execution or elevated permissions', () => {
  const text = fs.readFileSync(path.join(__dirname, '../../.github/workflows/build-runtime-image.yml'), 'utf8');
  assert.match(text, /on:\s*\n  pull_request:/); assert.match(text, /^  push:\n    branches: \[main\]/m);
  assert.match(text, /^  workflow_dispatch:/m); assert.doesNotMatch(text, /^  (schedule|workflow_run):/m);
  assert.match(text, /permissions:\n  contents: read\n/);
  assert.match(text, /image:\n    if: \$\{\{ github\.event_name == 'workflow_dispatch'/);
  assert.match(text, /github\.actor == github\.repository_owner && github\.triggering_actor == github\.repository_owner/);
  assert.match(text, /ref: \$\{\{ github\.sha \}\}\n          persist-credentials: false/);
  assert.doesNotMatch(text, /self-hosted|secrets\.|id-token:|packages:|ssh |rsync|--execute|docker push|environment:/);
  const actions = [...text.matchAll(/uses: (\S+)/g)].map(match => match[1]);
  assert.equal(actions.length, 6); assert.ok(actions.every(action => /^actions\/[a-z-]+@[a-f0-9]{40}$/.test(action)));
  const contracts = text.split('  contracts:\n')[1].split('  image:\n')[0];
  assert.match(contracts, /github\.event_name != 'workflow_dispatch'/);
  assert.match(contracts, /run: node --test scripts\/tests\/runtime-image\.test\.cjs/);
  assert.doesNotMatch(contracts, /docker|upload-artifact|download-artifact|github-script|actions:|secrets\.|environment:|permissions:/);
  assert.match(text, /path: \|\n            runtime-artifact\/image\.tar\.gz\n            runtime-artifact\/metadata\.json\n            runtime-artifact\/SHA256SUMS\n/);
  assert.match(text, /if-no-files-found: error/); assert.match(text, /retention-days: 3/);
});
test('builder is bounded and never sends runner credentials as build arguments', () => {
  const text = fs.readFileSync(path.join(__dirname, '../ops/build-runtime-image.cjs'), 'utf8');
  assert.equal(MAX_ARCHIVE, 2147483648); assert.equal(MAX_UNCOMPRESSED, 4294967296);
  assert.match(text, /'core\.autocrlf=false', 'archive'/); assert.match(text, /'--memory=6g', '--memory-swap=6g'/);
  assert.match(text, /'1800s', 'docker', 'build'/); assert.match(text, /PATH: e\.PATH, HOME: work, DOCKER_BUILDKIT: '0'/);
  assert.doesNotMatch(text, /--build-arg|--secret|--ssh|docker.*push/);
});
test('direct unauthorised builder fails before creating artifact directory', () => {
  const result = spawnSync(process.execPath, [path.join(__dirname, '../ops/build-runtime-image.cjs')], { env: { PATH: process.env.PATH }, encoding: 'utf8' });
  assert.equal(result.status, 1); assert.match(result.stderr, /manual_main_required/);
});
