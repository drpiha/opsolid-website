#!/usr/bin/env python3
"""VPS-only candidate proof, no production provisioning or application cutover.

Requires a verified protected backup and already-local immutable candidate image.
Creates one isolated PostgreSQL clone through opsolid-runtime-role.py and one
nonroot candidate app sharing ONLY that clone's network-none namespace. No host
ports, persistent mounts, provider credentials, image pulls or external network.
Only fixed checks/counts are reported. All synthetic CRUD is rolled back; both
temporary containers are ID/label guarded before removal. Backup is retained.
"""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import re
import secrets
import signal
import subprocess
import sys
import time
from urllib.parse import quote
import uuid

spec = importlib.util.spec_from_file_location("runtime_role", Path(__file__).with_name("opsolid-runtime-role.py"))
role = importlib.util.module_from_spec(spec)
spec.loader.exec_module(role)
backup = role.backup
require = backup.require
LABEL = "de.opsolid.candidate-proof"
IMAGE_ENV = {"PATH", "NODE_VERSION", "YARN_VERSION", "NODE_ENV", "NEXT_TELEMETRY_DISABLED", "PORT", "HOSTNAME", "GIT_COMMIT"}
MEMORY = 768 * backup.MIB
NODE_STAGES = {"password_auth", "prisma_crud", "prisma_discovery", "http_readiness", "http_pages", "http_guards", "http_optimizer"}
HBA_PATH = "/var/lib/postgresql/data/pgdata/pg_hba.conf"


def environment_map(values):
    result = {}
    for entry in values or []:
        key, separator, value = entry.partition("=")
        require(separator and key not in result, "candidate_environment_invalid")
        result[key] = value
    return result

def validate_image(actual, image, commit):
    require(bool(re.fullmatch(r"sha256:[a-f0-9]{64}", image)) and bool(re.fullmatch(r"[a-f0-9]{40}", commit)), "candidate_revision_invalid")
    require(actual["Id"] == image, "candidate_image_mismatch")
    config = actual["Config"]
    require((config.get("Labels") or {}).get("org.opencontainers.image.revision") == commit, "candidate_revision_label_mismatch")
    require(not config.get("Volumes"), "candidate_image_volume_unreviewed")
    env = environment_map(config.get("Env"))
    require(set(env) <= IMAGE_ENV, "candidate_image_environment_unreviewed")
    require("GIT_COMMIT" not in env or env["GIT_COMMIT"] == commit, "candidate_commit_environment_mismatch")

def create_command(name, token, image, database_id, env_file):
    require(bool(re.fullmatch(r"[a-f0-9]{24}", token)) and name == "opsolid-candidate-proof-" + token, "candidate_name_invalid")
    require(bool(re.fullmatch(r"[a-f0-9]{64}", database_id)) and bool(re.fullmatch(r"sha256:[a-f0-9]{64}", image)), "candidate_target_invalid")
    return ["create", "--name", name, "--pull", "never", "--label", LABEL+"="+token,
            "--network", "container:"+database_id, "--restart", "no", "--log-driver", "none",
            "--read-only", "--cap-drop", "ALL", "--security-opt", "no-new-privileges:true",
            "--user", "1001:1001", "--cpus", "1", "--pids-limit", "128", "--memory", str(MEMORY),
            "--memory-swap", str(MEMORY), "--ipc", "private", "--no-healthcheck",
            "--tmpfs", f"/tmp:rw,noexec,nosuid,nodev,size={64*backup.MIB},mode=1777",
            "--tmpfs", f"/app/.next/cache:rw,noexec,nosuid,nodev,size={64*backup.MIB},mode=0700,uid=1001,gid=1001",
            "--env-file", str(env_file), "--workdir", "/app", "--entrypoint", "node", image, "server.js"]

def validate_candidate(actual, container_id, name, token, image, database_id):
    require(bool(re.fullmatch(r"[a-f0-9]{64}", container_id)) and container_id != database_id, "candidate_cleanup_id_invalid")
    require(actual["Id"] == container_id and actual["Name"] == "/"+name and actual["Image"] == image, "candidate_cleanup_identity_mismatch")
    config = actual["Config"]
    labels = config.get("Labels") or {}
    require(labels.get(LABEL) == token and not any(key.startswith("com.docker.compose.") for key in labels), "candidate_cleanup_labels_mismatch")
    host = actual["HostConfig"]
    require(host.get("NetworkMode") == "container:"+database_id and not host.get("PortBindings") and not host.get("Binds") and not host.get("Mounts") and not host.get("VolumesFrom"), "candidate_boundary_violation")
    require(not actual["Mounts"] or all(m["Type"] == "tmpfs" for m in actual["Mounts"]), "candidate_persistent_mount")
    require(set(host.get("Tmpfs", {})) == {"/tmp", "/app/.next/cache"}, "candidate_tmpfs_mismatch")
    require(host.get("ReadonlyRootfs") and not host.get("Privileged") and host.get("LogConfig", {}).get("Type") == "none", "candidate_security_mismatch")
    require(host.get("Memory") == MEMORY and host.get("MemorySwap") == MEMORY and host.get("PidsLimit") == 128 and host.get("NanoCpus") == 1_000_000_000, "candidate_resource_mismatch")
    require("ALL" in host.get("CapDrop", []) and not host.get("CapAdd") and "no-new-privileges:true" in host.get("SecurityOpt", []), "candidate_capabilities_mismatch")
    require(config.get("User") == "1001:1001" and not host.get("PidMode") and host.get("IpcMode") == "private", "candidate_namespace_or_user_invalid")

def parse_node_proof(output):
    require(len(output) <= 512, "candidate_proof_output_invalid")
    try:
        value = json.loads(output)
    except (ValueError, UnicodeError):
        raise backup.ProofError("candidate_proof_output_invalid") from None
    keys = {"ok", "password_authentication_verified", "application_smoke_verified", "prisma_rollback_verified", "prisma_discovery_filter_verified", "http_checks"}
    require(isinstance(value, dict) and set(value) == keys, "candidate_proof_output_invalid")
    require(all(value[key] is True for key in keys - {"http_checks"}) and type(value["http_checks"]) is int and value["http_checks"] == 13, "candidate_checks_incomplete")
    return value


def private_exec(container, program, *args, payload, timeout=60, node_diagnostics=False):
    try:
        result = subprocess.run(backup.DOCKER + ["exec", "-i", container, program, *args], input=payload,
                                stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, timeout=timeout)
    except (OSError, subprocess.TimeoutExpired):
        raise backup.ProofError("candidate_exec_failed") from None
    if result.returncode != 0 and node_diagnostics:
        try:
            diagnostic = json.loads(result.stdout) if len(result.stdout) <= 128 else None
        except (ValueError, UnicodeError):
            diagnostic = None
        if isinstance(diagnostic, dict) and set(diagnostic) == {"ok", "stage"} and diagnostic["ok"] is False and isinstance(diagnostic["stage"], str) and diagnostic["stage"] in NODE_STAGES:
            raise backup.ProofError("candidate_"+diagnostic["stage"]+"_failed")
    require(result.returncode == 0, "candidate_exec_failed")
    return result.stdout


def configure_scram(database_id, runtime_role):
    role.role_name(runtime_role)
    # hba_file is a postmaster-only setting. Change the contents of the exact
    # existing HBA file in the owned clone's PGDATA tmpfs, then reload. The
    # callback is invoked only after role.validate_isolated validated its ID.
    hba = ("local all proof_owner trust\nlocal all all reject\n"
           f"host proof_restore {runtime_role} 127.0.0.1/32 scram-sha-256\n"
           "host all all 0.0.0.0/0 reject\nhost all all ::0/0 reject\n")
    require(backup.query(database_id, "proof_restore", "proof_owner", "SELECT current_setting('hba_file')="+role.literal(HBA_PATH)) == "t", "isolated_hba_path_unreviewed")
    # docker exec inherits the clone's explicit postgres UID/GID. New file is
    # private and on the same tmpfs; rename replaces the contents atomically.
    replacement = HBA_PATH+".runtime-proof"
    command = "set -eu; test -f "+HBA_PATH+"; test ! -L "+HBA_PATH+"; umask 077; set -C; cat > "+replacement+"; mv -f "+replacement+" "+HBA_PATH
    private_exec(database_id, "sh", "-c", command, payload=hba.encode())
    require(role.sql(database_id, "proof_restore", "proof_owner", "SELECT pg_reload_conf();") == "t", "isolated_hba_reload_failed")
    ready_sql = "SELECT current_setting('listen_addresses')='127.0.0.1' AND current_setting('hba_file')="+role.literal(HBA_PATH)+" AND NOT EXISTS(SELECT 1 FROM pg_hba_file_rules WHERE error IS NOT NULL)"
    for _ in range(20):
        if backup.query(database_id, "proof_restore", "proof_owner", ready_sql) == "t":
            break
        time.sleep(0.1)
    else:
        raise backup.ProofError("isolated_hba_invalid")
    check = role.assertion(f"EXISTS(SELECT 1 FROM pg_authid WHERE rolname={role.literal(runtime_role)} AND rolpassword LIKE 'SCRAM-SHA-256$%')", "isolated_scram_password_missing")
    role.sql(database_id, "proof_restore", "proof_owner", check)


NODE_PROOF = r"""
const { PrismaClient, Prisma } = require('./src/generated/prisma');
const { randomUUID } = require('node:crypto');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const assert = value => { if (!value) throw new Error('candidate_assertion'); };
const client = new PrismaClient({ log: [] });
let bad;
let stage = 'password_auth';
async function request(path, expected, html = false, noGoogleAnchor = false) {
  const res = await fetch('http://127.0.0.1:3000' + path, { redirect: 'manual', signal: AbortSignal.timeout(5000) });
  assert(res.status === expected);
  if (html) assert((res.headers.get('content-type') || '').includes('text/html'));
  if (noGoogleAnchor) {
    const reader = res.body.getReader();
    const chunks = []; let size = 0;
    try {
      for (;;) {
        const {done, value} = await reader.read();
        if (done) break;
        size += value.byteLength; assert(size <= 2*1024*1024); chunks.push(value);
      }
    } finally { await reader.cancel(); }
    const markup = Buffer.concat(chunks).toString('utf8');
    assert(!/<a\b[^>]*\bhref\s*=\s*["']\/api\/auth\/google\?/i.test(markup));
  } else { await res.body?.cancel(); }
}
async function run() {
  const wrong = new URL(process.env.DATABASE_URL);
  wrong.password = 'deliberately_invalid_synthetic_password';
  bad = new PrismaClient({ datasources: { db: { url: wrong.toString() } }, log: [] });
  let denied = false;
  try { await bad.$connect(); } catch (error) { denied = error?.errorCode === 'P1000' || error?.code === 'P1000'; }
  assert(denied);
  await bad.$disconnect();
  await client.$connect();
  const identity = await client.$queryRawUnsafe('SELECT current_user::text AS current_user, session_user::text AS session_user');
  const expectedRole = decodeURIComponent(new URL(process.env.DATABASE_URL).username);
  assert(identity.length === 1 && identity[0].current_user === expectedRole && identity[0].session_user === expectedRole);
  stage = 'prisma_crud';
  const id = 'runtime_prisma_' + randomUUID().replaceAll('-', '');
  const rollback = new Error('expected_synthetic_rollback');
  let rolledBack = false;
  try {
    await client.$transaction(async tx => {
      const template = await tx.cardTemplate.findFirst({ select: { id: true }, orderBy: { id: 'asc' } });
      assert(template);
      const user = await tx.user.create({ data: { id, email: id+'@example.invalid', name: 'Synthetic runtime proof', emailVerifiedAt: new Date() } });
      const session = await tx.session.create({ data: { userId: user.id, tokenHash: id+'_session', expiresAt: new Date(Date.now()+60000) } });
      const card = await tx.cardOrder.create({ data: { userId: user.id, templateId: template.id, contactName: 'Synthetic', contactEmail: id+'@example.invalid', contactPhone: '', cardData: {}, billingMode: 'one_time', amountCents: 0, status: 'DRAFT' } });
      await tx.orderStatusHistory.create({ data: { orderId: card.id, toStatus: 'DRAFT', actor: 'runtime-proof' } });
      await tx.cardLink.create({ data: { orderId: card.id, code: id } });
      const saved = await tx.savedCard.create({ data: { userId: user.id, cardOrderId: card.id } });
      await tx.cardOrder.update({ where: { id: card.id }, data: { contactName: 'Synthetic updated' } });
      await tx.user.update({ where: { id: user.id }, data: { name: 'Synthetic updated' } });
      const relation = await tx.cardOrder.findUnique({ where: { id: card.id }, include: { user: true, template: true, links: true, statusHistory: true, savedByUsers: true } });
      assert(relation?.user?.id === user.id && relation.links.length === 1 && relation.statusHistory.length === 1 && relation.savedByUsers.length === 1);
      await tx.session.update({ where: { id: session.id }, data: { revokedAt: new Date() } });
      await tx.session.create({ data: { userId: user.id, tokenHash: id+'_rotated', expiresAt: new Date(Date.now()+60000) } });
      await tx.savedCard.delete({ where: { id: saved.id } });
      stage = 'prisma_discovery';
      const discoveryCases = [
        ['missing', {}, 'public'], ['null', {password:null}, 'public'], ['empty', {password:''}, 'public'],
        ['locked', {password:'synthetic-only'}, 'public'], ['private', {}, 'private']
      ];
      for (const [suffix, cardData, visibility] of discoveryCases) await tx.cardOrder.create({ data: {
        id:id+'_'+suffix, userId:user.id, templateId:template.id, contactName:'Synthetic', contactEmail:id+'@example.invalid',
        contactPhone:'', cardData, visibility, billingMode:'one_time', amountCents:0, status:'PUBLISHED'
      } });
      // Exact no-search handler predicate; only synthetic IDs are eligible.
      const visible = await tx.cardOrder.findMany({ where: {
        id:{in:discoveryCases.map(([suffix])=>id+'_'+suffix)}, status:'PUBLISHED', visibility:'public',
        AND:[{OR:[{cardData:{path:['password'],equals:Prisma.AnyNull}},{cardData:{path:['password'],equals:''}}]}]
      }, select:{id:true}, take:10, orderBy:{publishedAt:'desc'} });
      assert(JSON.stringify(visible.map(row=>row.id).sort())===JSON.stringify(['missing','null','empty'].map(suffix=>id+'_'+suffix).sort()));
      throw rollback;
    }, { maxWait: 5000, timeout: 20000 });
  } catch (error) { if (error !== rollback) throw error; rolledBack = true; }
  assert(rolledBack && await client.user.count({ where: { id } }) === 0);
  assert(await client.session.count({ where: { tokenHash: { in: [id+'_session', id+'_rotated'] } } }) === 0);
  stage = 'http_readiness';
  let healthy = false;
  for (let attempt=0; attempt<30; attempt++) {
    try {
      const res = await fetch('http://127.0.0.1:3000/api/health', { redirect: 'manual', signal: AbortSignal.timeout(2000) });
      if (res.status === 200) {
        const body = await res.json();
        healthy = body.ok === true && body.dbOk === true && body.commit === process.env.GIT_COMMIT;
      } else { await res.body?.cancel(); }
      if (healthy) break;
    } catch {}
    await pause(500);
  }
  assert(healthy);
  stage = 'http_pages';
  for (const locale of ['de','en','tr']) for (const page of ['opso','login','signup']) await request('/'+locale+'/'+page, 200, true, page!=='opso');
  stage = 'http_guards';
  await request('/api/v1/cards', 401);
  await request('/api/account/saved-cards', 401);
  stage = 'http_optimizer';
  await request('/_next/image?url=%2Ffavicon.ico&w=64&q=75', 404);
  return { ok: true, password_authentication_verified: true, application_smoke_verified: true, prisma_rollback_verified: true, prisma_discovery_filter_verified: true, http_checks: 13 };
}
run().then(async proof => { await client.$disconnect(); process.stdout.write(JSON.stringify(proof)); })
 .catch(async () => { try { await client.$disconnect(); await bad?.$disconnect(); } catch {} process.stdout.write(JSON.stringify({ok:false,stage})); process.exitCode=1; });
"""


def check_candidate(image, commit, expected, database_id, credential):
    clone = backup.inspect(database_id)
    token = (clone["Config"].get("Labels") or {}).get(backup.LABEL, "")
    backup.validate_owned(clone, database_id, clone["Name"].lstrip("/"), token, {item["id"] for item in expected.values()})
    actual_image = json.loads(backup.run(["image", "inspect", image]))[0]
    validate_image(actual_image, image, commit)
    role.role_name(credential["role"])
    require(bool(re.fullmatch(r"[A-Za-z0-9_-]{40,100}", credential["password"])), "candidate_credential_invalid")
    configure_scram(database_id, credential["role"])
    app_token = uuid.uuid4().hex[:24]
    name = "opsolid-candidate-proof-" + app_token
    folder = backup.BASE / ("candidate-runtime-" + app_token)
    folder.mkdir(mode=0o700)
    backup.secure_path(folder, private=True)
    env_file = folder / "candidate.env"
    env = {"DATABASE_URL": "postgresql://"+quote(credential["role"], safe="")+":"+quote(credential["password"], safe="")+"@127.0.0.1:5432/proof_restore?schema=public&connection_limit=2&pool_timeout=5&connect_timeout=5",
           "JWT_SECRET": secrets.token_urlsafe(48), "NEXT_PUBLIC_SITE_URL": "http://127.0.0.1:3000",
           "GIT_COMMIT": commit, "NODE_ENV": "production", "NEXT_TELEMETRY_DISABLED": "1", "HOSTNAME": "127.0.0.1", "PORT": "3000"}
    with env_file.open("x", encoding="utf-8") as handle:
        handle.write("".join(key+"="+value+"\n" for key, value in env.items()))
    backup.secure_path(env_file, private=True, file=True)
    container_id = None
    proof = None
    try:
        container_id = backup.run(create_command(name, app_token, image, database_id, env_file)).decode().strip()
        actual = backup.inspect(container_id)
        validate_candidate(actual, container_id, name, app_token, image, database_id)
        inherited = environment_map(actual_image["Config"].get("Env"))
        require(environment_map(actual["Config"].get("Env")) == {**inherited, **env}, "candidate_effective_environment_mismatch")
        backup.run(["start", container_id])
        proof = parse_node_proof(private_exec(container_id, "node", payload=NODE_PROOF.encode(), timeout=180, node_diagnostics=True))
    finally:
        if container_id:
            validate_candidate(backup.inspect(container_id), container_id, name, app_token, image, database_id)
            backup.run(["rm", "--force", container_id])
            require(not backup.run(["container", "ls", "-a", "--filter", "id="+container_id, "--format", "{{.ID}}"]), "candidate_cleanup_incomplete")
        backup.secure_path(env_file, private=True, file=True)
        env_file.unlink()
    require(proof is not None, "candidate_proof_missing")
    role.write_private(folder / "proof.json", {**proof, "candidate_image": image, "commit": commit, "candidate_container_removed": True})
    return {"candidate_image": image, "password_authentication_verified": True,
            "application_smoke_verified": True, "candidate_container_removed": True}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--expected", required=True, type=Path)
    parser.add_argument("--backup-proof", required=True, type=Path)
    parser.add_argument("--role", required=True)
    parser.add_argument("--candidate-image", required=True)
    parser.add_argument("--commit", required=True)
    parser.add_argument("--execute", action="store_true", help="Without this flag, validate only read-only preconditions")
    args = parser.parse_args()
    require(sys.platform == "linux" and os.geteuid() == 0, "vps_root_required")
    def interrupted(_number, _frame):
        raise backup.ProofError("interrupted")
    signal.signal(signal.SIGTERM, interrupted)
    os.umask(0o077)
    for path in (args.expected, args.backup_proof):
        backup.secure_path(path, private=True, file=True)
    expected = json.loads(args.expected.read_text())
    backup.validate_expected(expected)
    runtime_role = role.role_name(args.role)
    baseline = backup.production_snapshot(expected)
    validate_image(json.loads(backup.run(["image", "inspect", args.candidate_image]))[0], args.candidate_image, args.commit)
    if not args.execute:
        print(json.dumps({"ok": True, "mode": "read_only_plan", "http_checks": 13, "password_authentication": "scram-sha-256", "isolated_prisma_rollback": True, "production_role_writes": False}))
        return
    callback = lambda container, credential: check_candidate(args.candidate_image, args.commit, expected, container, credential)
    state, result = role.validate_isolated(expected, baseline, args.backup_proof, runtime_role, callback, args.candidate_image)
    print(json.dumps({"ok": result["ok"], "stage": result["stage"], "code": result.get("code"), "state": str(state),
                      "password_authentication_verified": result["password_authentication_verified"], "application_smoke_verified": result["application_smoke_verified"],
                      "candidate_container_removed": result.get("candidate_container_removed", False), "temporary_database_removed": result.get("temporary_container_removed", False)}))
    raise SystemExit(0 if result["ok"] else 1)


if __name__ == "__main__":
    try:
        main()
    except backup.ProofError as error:
        print(json.dumps({"ok": False, "code": str(error)}))
        raise SystemExit(1) from None
    except (Exception, KeyboardInterrupt):
        print(json.dumps({"ok": False, "code": "candidate_operation_failed"}))
        raise SystemExit(1) from None
