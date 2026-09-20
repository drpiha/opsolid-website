"""Synthetic local command/guard tests. No Docker, SSH, database or HTTP calls."""
import copy
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
import types
import unittest
from unittest.mock import patch
from test_opsolid_backup_restore_proof import expected, owned as database_fixture

SPEC = importlib.util.spec_from_file_location("candidate_runtime", Path(__file__).parents[1] / "ops" / "opsolid-candidate-runtime.py")
candidate = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(candidate)
IMAGE = "sha256:" + "a"*64
COMMIT = "c"*40
DB = "c"*64
CONTAINER = "e"*64
TOKEN = "f"*24
NAME = "opsolid-candidate-proof-" + TOKEN


def image():
    return {"Id": IMAGE, "Config": {"Labels": {"org.opencontainers.image.revision": COMMIT}, "Env": ["NODE_ENV=production", "PATH=/usr/local/bin:/usr/bin:/bin"], "Volumes": None}}


def owned():
    return {"Id": CONTAINER, "Name": "/" + NAME, "Image": IMAGE,
            "Config": {"Labels": {"de.opsolid.candidate-proof": TOKEN}, "User": "1001:1001"},
            "Mounts": [], "HostConfig": {"NetworkMode": "container:" + DB,
            "PortBindings": {}, "Binds": None, "Mounts": None, "VolumesFrom": None,
            "Privileged": False, "ReadonlyRootfs": True, "LogConfig": {"Type": "none"},
            "CapDrop": ["ALL"], "CapAdd": None, "SecurityOpt": ["no-new-privileges:true"],
            "Memory": 805306368, "MemorySwap": 805306368, "PidsLimit": 128,
            "NanoCpus": 1000000000, "PidMode": "", "IpcMode": "private",
            "Tmpfs": {"/tmp": "rw", "/app/.next/cache": "rw"}}}


class CandidateGuards(unittest.TestCase):
    def test_image_requires_exact_digest_full_commit_and_no_provider_configuration(self):
        candidate.validate_image(image(), IMAGE, COMMIT)
        invalid = []
        for field, value in (("Id", "sha256:"+"b"*64),):
            item = image(); item[field] = value; invalid.append(item)
        item = image(); item["Config"]["Labels"] = {}; invalid.append(item)
        item = image(); item["Config"]["Env"].append("SMTP_PASS=synthetic-only"); invalid.append(item)
        item = image(); item["Config"]["Volumes"] = {"/data": {}}; invalid.append(item)
        for actual in invalid:
            with self.subTest(actual=actual), self.assertRaises(Exception):
                candidate.validate_image(actual, IMAGE, COMMIT)

    def test_command_has_only_shared_isolated_namespace_and_bounded_tmpfs(self):
        args = candidate.create_command(NAME, TOKEN, IMAGE, DB, Path("/var/backups/opsolid/candidate/env"))
        self.assertEqual(args[args.index("--network")+1], "container:" + DB)
        for value in ("never", "none", "--read-only", "--cap-drop", "ALL", "no-new-privileges:true", "1001:1001", "--no-healthcheck"):
            self.assertIn(value, args)
        for value in ("--publish", "--privileged", "--volume", "-v", "--mount", "--volumes-from"):
            self.assertNotIn(value, args)
        self.assertEqual(args[-2:], [IMAGE, "server.js"])
        self.assertNotIn("DATABASE_URL", " ".join(args))

    def test_cleanup_guard_rejects_any_production_mount_namespace_or_privilege_drift(self):
        candidate.validate_candidate(owned(), CONTAINER, NAME, TOKEN, IMAGE, DB)
        invalid = []
        for field, value in (("NetworkMode", "bridge"), ("Privileged", True), ("Binds", ["/prod:/data"]),
                             ("PortBindings", {"3000/tcp": []}), ("ReadonlyRootfs", False), ("CapAdd", ["SYS_ADMIN"]),
                             ("MemorySwap", -1), ("PidMode", "host")):
            item = owned(); item["HostConfig"][field] = value; invalid.append(item)
        item = owned(); item["Config"]["Labels"]["com.docker.compose.project"] = "production"; invalid.append(item)
        item = owned(); item["Id"] = DB; invalid.append(item)
        item = owned(); item["Mounts"] = [{"Type": "volume"}]; invalid.append(item)
        for actual in invalid:
            with self.subTest(actual=actual), self.assertRaises(Exception):
                candidate.validate_candidate(actual, CONTAINER, NAME, TOKEN, IMAGE, DB)

    def test_node_output_accepts_only_complete_finite_checks(self):
        proof = {"ok": True, "password_authentication_verified": True, "application_smoke_verified": True,
                 "prisma_rollback_verified": True, "prisma_discovery_filter_verified": True, "http_checks": 13}
        self.assertEqual(candidate.parse_node_proof(json.dumps(proof).encode()), proof)
        invalid = [b"PRIVATE unexpected output", json.dumps({**proof, "private": "data"}).encode(),
                   json.dumps({**proof, "password_authentication_verified": 1}).encode(),
                   json.dumps({**proof, "http_checks": 12}).encode()]
        for output in invalid:
            with self.subTest(output=output), self.assertRaises(Exception):
                candidate.parse_node_proof(output)

    def test_scram_reloads_existing_exact_file_instead_of_postmaster_only_hba_setting(self):
        with patch.object(candidate, "private_exec", return_value=b"") as execute, \
             patch.object(candidate.role, "sql", return_value="t") as sql, \
             patch.object(candidate.backup, "query", side_effect=["t", "f", "t"]), patch.object(candidate.time, "sleep"):
            candidate.configure_scram(DB, "opsolid_runtime_test")
        args, kwargs = execute.call_args
        self.assertEqual(args[0], DB)
        self.assertIn("test -f "+candidate.HBA_PATH, args[-1])
        self.assertIn("test ! -L "+candidate.HBA_PATH, args[-1])
        self.assertIn("umask 077; set -C; cat > "+candidate.HBA_PATH+".runtime-proof", args[-1])
        self.assertIn("mv -f "+candidate.HBA_PATH+".runtime-proof "+candidate.HBA_PATH, args[-1])
        self.assertNotIn("ALTER SYSTEM", str(sql.call_args_list))
        self.assertIn("SELECT pg_reload_conf()", str(sql.call_args_list))
        self.assertIn(b"local all all reject", kwargs["payload"])
        self.assertIn(b"127.0.0.1/32 scram-sha-256", kwargs["payload"])
        self.assertNotIn(b"host all all all trust", kwargs["payload"])
        self.assertEqual(sql.call_count, 2)

    def test_production_identity_cannot_reach_hba_configuration(self):
        with patch.object(candidate.backup, "inspect", return_value=database_fixture()), patch.object(candidate, "configure_scram") as configure:
            with self.assertRaisesRegex(candidate.backup.ProofError, "^cleanup_id_invalid$"):
                candidate.check_candidate(IMAGE, COMMIT, expected(), expected()["database"]["id"], {"role":"opsolid_runtime_test", "password":"x"*48})
            configure.assert_not_called()

    def test_hba_path_drift_cannot_write_any_file(self):
        with patch.object(candidate.backup, "query", return_value="f"), patch.object(candidate, "private_exec") as execute:
            with self.assertRaisesRegex(candidate.backup.ProofError, "^isolated_hba_path_unreviewed$"):
                candidate.configure_scram(DB, "opsolid_runtime_test")
            execute.assert_not_called()

    def test_nonzero_node_exit_reports_only_allowlisted_finite_stage(self):
        for output, code in ((b'{"ok":false,"stage":"prisma_crud"}', "candidate_prisma_crud_failed"),
                             (b'{"ok":false,"stage":"PRIVATE"}', "candidate_exec_failed"),
                             (b'{"ok":false,"stage":"prisma_crud","error":"PRIVATE"}', "candidate_exec_failed")):
            with patch.object(candidate.subprocess, "run", return_value=types.SimpleNamespace(returncode=1, stdout=output)):
                with self.assertRaisesRegex(candidate.backup.ProofError, "^"+code+"$"):
                    candidate.private_exec(CONTAINER, "node", payload=b"synthetic", node_diagnostics=True)

    def run_callback(self, failure=False, boundary_drift=False):
        calls = []
        runtime_env = {}
        proof = {"ok": True, "password_authentication_verified": True, "application_smoke_verified": True,
                 "prisma_rollback_verified": True, "prisma_discovery_filter_verified": True, "http_checks": 13}
        def run(args, **_):
            calls.append(args)
            if args[:2] == ["image", "inspect"]:
                return json.dumps([image()]).encode()
            if args[0] == "create":
                content = Path(args[args.index("--env-file")+1]).read_text()
                runtime_env.update(candidate.environment_map(content.splitlines()))
                return CONTAINER.encode()
            return b""
        inspections = 0
        def inspect(target):
            nonlocal inspections
            if target == DB:
                return database_fixture()
            inspections += 1
            item = owned()
            item["Config"]["Env"] = [key+"="+value for key, value in {**candidate.environment_map(image()["Config"]["Env"]), **runtime_env}.items()]
            if boundary_drift and inspections > 1:
                item["HostConfig"]["NetworkMode"] = "bridge"
            return item
        with tempfile.TemporaryDirectory() as directory:
            with patch.object(candidate.backup, "BASE", Path(directory)), patch.object(candidate.backup, "secure_path"), \
                 patch.object(candidate.backup, "run", side_effect=run), patch.object(candidate.backup, "inspect", side_effect=inspect), \
                 patch.object(candidate, "configure_scram"), patch.object(candidate.uuid, "uuid4", return_value=types.SimpleNamespace(hex=TOKEN+"0"*8)), \
                 patch.object(candidate, "private_exec", side_effect=candidate.backup.ProofError("candidate_exec_failed") if failure else None, return_value=json.dumps(proof).encode()):
                result = None
                error = None
                try:
                    result = candidate.check_candidate(IMAGE, COMMIT, expected(), DB, {"role": "opsolid_runtime_test", "password": "x"*48})
                except candidate.backup.ProofError as caught:
                    error = str(caught)
                if not boundary_drift:
                    self.assertFalse(list(Path(directory).rglob("candidate.env")))
                return result, error, calls, runtime_env

    def test_callback_removes_exact_app_before_returning_provisionable_flags(self):
        result, error, calls, env = self.run_callback()
        self.assertIsNone(error)
        self.assertTrue(result["candidate_container_removed"])
        self.assertIn(["rm", "--force", CONTAINER], calls)
        self.assertNotIn("x"*48, json.dumps(calls))
        self.assertEqual(set(env), {"DATABASE_URL", "JWT_SECRET", "NEXT_PUBLIC_SITE_URL", "GIT_COMMIT", "NODE_ENV", "NEXT_TELEMETRY_DISABLED", "HOSTNAME", "PORT"})
        self.assertIn("@127.0.0.1:5432/proof_restore", env["DATABASE_URL"])

    def test_callback_failed_checks_still_remove_app_and_never_return_success(self):
        result, error, calls, _ = self.run_callback(failure=True)
        self.assertIsNone(result)
        self.assertEqual(error, "candidate_exec_failed")
        self.assertIn(["rm", "--force", CONTAINER], calls)

    def test_callback_cleanup_refuses_changed_boundary(self):
        result, error, calls, _ = self.run_callback(boundary_drift=True)
        self.assertIsNone(result)
        self.assertEqual(error, "candidate_boundary_violation")
        self.assertNotIn(["rm", "--force", CONTAINER], calls)


class EmbeddedNodeContract(unittest.TestCase):
    PRELUDE = r"""
const Module = require('module');
const originalLoad = Module._load;
const mode = process.env.SYNTHETIC_CASE;
const id = 'runtime_prisma_fixed';
const tx = {};
for (const model of ['user','session','cardOrder','orderStatusHistory','cardLink','savedCard']) {
  tx[model] = {create: async ({data}) => ({id: data.id || model, ...data}), update: async () => ({}), delete: async () => ({})};
}
tx.cardTemplate = {findFirst: async () => ({id: 1})};
tx.cardOrder.findUnique = async () => ({user: {id}, links: [{}], statusHistory: [{}], savedByUsers: [{}]});
tx.cardOrder.findMany = async () => (mode==='discovery_leak' ? ['missing','null','empty','locked'] : ['missing','null','empty']).map(suffix=>({id:id+'_'+suffix}));
class MockPrisma {
  constructor(options) {this.bad = !!options.datasources; this.user = {count: async()=>mode==='persisted' ? 1 : 0}; this.session = {count: async()=>0};}
  async $connect() {if(this.bad && mode!=='password_bypass') throw {errorCode:'P1000'};}
  async $disconnect() {}
  async $queryRawUnsafe() {return [{current_user:'opsolid_runtime_test',session_user:'opsolid_runtime_test'}];}
  async $transaction(callback) {return callback(tx);}
}
Module._load = function(name, ...args) {
  if (name==='./src/generated/prisma') return {PrismaClient:MockPrisma,Prisma:{AnyNull:{}}};
  if (name==='node:crypto') return {randomUUID:()=> 'fixed'};
  return originalLoad.call(this,name,...args);
};
global.fetch = async (url, options) => {
  if(!url.startsWith('http://127.0.0.1:3000/') || options.redirect!=='manual') throw new Error('unsafe_request');
  const path = new URL(url).pathname;
  const status = path==='/_next/image' ? 404 : path.startsWith('/api/') && path!=='/api/health' ? (mode==='auth_open' ? 200 : 401) : 200;
  return {status,headers:{get:()=> 'text/html'},body:{cancel:async()=>{},getReader:()=>{let done=false;return {
    read:async()=>{if(done)return {done:true};done=true;return {done:false,value:Buffer.from(mode==='google_without_config' ? '<a href="/api/auth/google?locale=de">Google</a>' : '<main>Account - Google is mentioned without a link</main>')};},cancel:async()=>{}
  };}},json:async()=>({ok:true,dbOk:true,commit:process.env.GIT_COMMIT})};
};
"""

    def run_node(self, mode):
        env = {**os.environ, "SYNTHETIC_CASE": mode, "DATABASE_URL": "postgresql://opsolid_runtime_test:synthetic@127.0.0.1:5432/proof_restore", "GIT_COMMIT": COMMIT}
        return subprocess.run(["node", "-"], input=(self.PRELUDE + candidate.NODE_PROOF).encode(), stdout=subprocess.PIPE, stderr=subprocess.PIPE, env=env, timeout=10)

    def test_actual_embedded_program_passes_with_synthetic_prisma_and_http_contracts(self):
        result = self.run_node("good")
        self.assertEqual(result.returncode, 0)
        self.assertEqual(candidate.parse_node_proof(result.stdout)["http_checks"], 13)
        self.assertEqual(result.stderr, b"")

    def test_password_bypass_persisted_rows_and_open_auth_each_fail(self):
        for mode, stage in (("password_bypass", "password_auth"), ("persisted", "prisma_discovery"), ("auth_open", "http_guards"), ("discovery_leak", "prisma_discovery"), ("google_without_config", "http_pages")):
            with self.subTest(mode=mode):
                result = self.run_node(mode)
                self.assertEqual(result.returncode, 1)
                self.assertEqual(json.loads(result.stdout), {"ok":False,"stage":stage})
                self.assertEqual(result.stderr, b"")


if __name__ == "__main__":
    unittest.main()
