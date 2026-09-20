// Deployment boundary regression: parse the actual workflow without executing it.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const yaml = require('js-yaml');

const source = fs.readFileSync(path.join(__dirname, '../../.github/workflows/deploy.yml'), 'utf8');
const workflow = yaml.load(source);
const manualGuard = "${{ github.event_name != 'workflow_dispatch' || (github.ref == 'refs/heads/main' && github.actor == github.repository_owner && github.triggering_actor == github.repository_owner) }}";
const allowedRuns = [
  'npm ci --no-audit --no-fund',
  'node --test scripts/tests/deploy-workflow.test.cjs',
  'node node_modules/prisma/build/index.js generate',
  'npm run audit:cards',
  'npm run lint',
  'node node_modules/typescript/bin/tsc --noEmit --incremental false',
  'node --import tsx --test scripts/tests/opso-web-account.test.mts',
  'python3 -B scripts/tests/test_opsolid_app_cutover.py',
  'npm run build',
];

function assertValidationOnly(value) {
  assert.deepEqual(Object.keys(value.on).sort(), ['pull_request', 'push', 'workflow_dispatch']);
  assert.deepEqual(value.on.push, { branches: ['main'] });
  assert.equal(value.on.pull_request, null); // Includes stacked PRs, not only main-targeted PRs.
  assert.equal(value.on.workflow_dispatch, null); // No deployment inputs or hidden apply mode.
  assert.deepEqual(value.permissions, { contents: 'read' });
  assert.deepEqual(Object.keys(value.jobs), ['verify']);
  assert.equal(value.env, undefined);
  assert.equal(value.defaults, undefined);
  const job = value.jobs.verify;
  assert.equal(job['runs-on'], 'ubuntu-latest');
  assert.equal(job.if, manualGuard);
  assert.equal(job.environment, undefined);
  assert.equal(job.permissions, undefined);
  assert.equal(job.secrets, undefined);
  assert.deepEqual(job.env, { NEXT_TELEMETRY_DISABLED: '1' });
  assert.equal(job.defaults, undefined);
  assert.equal(job.services, undefined);
  assert.equal(job.container, undefined);
  assert.equal(job.uses, undefined);
  assert.equal(job.strategy, undefined);
  const actions = job.steps.filter(step => step.uses);
  assert.deepEqual(actions.map(step => step.uses), [
    'actions/checkout@11d5960a326750d5838078e36cf38b85af677262',
    'actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020',
  ]);
  assert.deepEqual(actions[0].with, { 'persist-credentials': false });
  assert.deepEqual(actions[1].with, { 'node-version': '22.23.2', cache: 'npm' });
  const commands = job.steps.filter(step => step.run).map(step => step.run);
  assert.deepEqual(commands, allowedRuns); // Generation must precede typecheck/build.
  for (const step of job.steps) {
    assert.equal(step.env, undefined);
    assert.equal(step['working-directory'], undefined);
    assert.equal(step.shell, undefined);
    assert.equal(step['continue-on-error'], undefined);
    assert.equal(step.if, undefined);
  }
  assert.doesNotMatch(JSON.stringify(value), /\bsecrets\s*\./i);
  assert.doesNotMatch(commands.join('\n'), /self-hosted|\b(?:ssh|scp|rsync|docker|sudo)\b|db-bootstrap|--execute|--delete|prisma\s+(?:migrate|db)/i);
}

test('PR, main and owner-manual validation cannot reach the VPS or deployment secrets', () => {
  assertValidationOnly(workflow);
});

test('the existing production build includes the fail-closed public source-map gate', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf8'));
  assert.equal(pkg.scripts.build, 'next build && npm run check:public-sourcemaps');
  assert.equal(pkg.scripts['check:public-sourcemaps'], 'node scripts/check-public-sourcemaps.mjs');
});

const regressions = {
  'restored deployment job': value => { value.jobs.deploy = { 'runs-on': ['self-hosted', 'linux', 'vps'] }; },
  'self-hosted validation runner': value => { value.jobs.verify['runs-on'] = ['self-hosted', 'linux', 'vps']; },
  'write-scoped GitHub token': value => { value.permissions.contents = 'write'; },
  'persisted checkout credentials': value => { value.jobs.verify.steps[0].with['persist-credentials'] = true; },
  'removed manual owner guard': value => { delete value.jobs.verify.if; },
  'untrusted privileged PR trigger': value => { value.on.pull_request_target = null; },
  'manual packet input': value => { value.on.workflow_dispatch = { inputs: { state: { type: 'string' } } }; },
  'production secret injection': value => { value.jobs.verify.env = { KEY: '${{ secrets.SSH_KEY }}' }; },
  'database bootstrap command': value => { value.jobs.verify.steps.push({ run: 'deploy/hostinger/db-bootstrap.sh' }); },
  'unlocked dependency installation': value => { value.jobs.verify.steps.find(step => step.run?.startsWith('npm ci')).run = 'npm install'; },
  'removed build gate': value => { value.jobs.verify.steps = value.jobs.verify.steps.filter(step => step.run !== 'npm run build'); },
  'missing Prisma generation': value => { value.jobs.verify.steps = value.jobs.verify.steps.filter(step => !step.run?.includes('prisma/build/index.js')); },
  'disabled regression check': value => { value.jobs.verify.steps.find(step => step.run?.startsWith('node --test')).if = 'false'; },
};

for (const [name, mutate] of Object.entries(regressions)) {
  test(`rejects ${name}`, () => {
    const changed = structuredClone(workflow);
    mutate(changed);
    assert.throws(() => assertValidationOnly(changed));
  });
}
