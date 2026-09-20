// Pure, fail-closed release-source checks. The caller supplies read-only API results.
'use strict';
const REPOSITORY = 'drpiha/opsolid-website';
const REPOSITORY_ID = '1196607461';
function requireValue(ok, code) { if (!ok) throw new Error(code); }
function validateDispatch(value) {
  requireValue(value.eventName === 'workflow_dispatch' && value.ref === 'refs/heads/main', 'manual_main_required');
  requireValue(value.repository === REPOSITORY && String(value.repositoryId) === REPOSITORY_ID, 'repository_mismatch');
  requireValue(value.actor === 'drpiha' && value.triggeringActor === 'drpiha', 'owner_required');
  requireValue(/^[a-f0-9]{40}$/.test(value.commit) && value.commit === value.sha, 'dispatch_commit_mismatch');
  return value.commit;
}
function validateEvidence(value, mainRef, response) {
  const commit = validateDispatch(value);
  requireValue(mainRef.ref === 'refs/heads/main' && mainRef.object?.type === 'commit' && mainRef.object.sha === commit, 'main_changed');
  const runs = response.workflow_runs;
  requireValue(Array.isArray(runs) && runs.length > 0 && response.total_count === runs.length && runs.length <= 20, 'ci_inventory_incomplete');
  // Do not filter for success: a newer failed/in-progress run must block an older green run.
  const latest = [...runs].sort((a, b) => b.run_number - a.run_number || b.run_attempt - a.run_attempt)[0];
  requireValue(runs.every(run => Number.isSafeInteger(run.run_number) && Number.isSafeInteger(run.run_attempt)), 'ci_order_invalid');
  requireValue(latest.path === '.github/workflows/deploy.yml' && latest.event === 'push' && latest.head_branch === 'main' && latest.head_sha === commit, 'ci_source_mismatch');
  requireValue(latest.repository?.full_name === REPOSITORY && String(latest.repository.id) === REPOSITORY_ID && latest.head_repository?.full_name === REPOSITORY && String(latest.head_repository.id) === REPOSITORY_ID, 'ci_repository_mismatch');
  requireValue(latest.status === 'completed' && latest.conclusion === 'success', 'ci_not_successful');
  requireValue(Number.isSafeInteger(latest.id) && latest.id > 0 && latest.run_attempt > 0, 'ci_identity_invalid');
  return { runId: String(latest.id), runAttempt: latest.run_attempt };
}
module.exports = { validateDispatch, validateEvidence, REPOSITORY, REPOSITORY_ID };
