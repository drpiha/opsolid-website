"""No production operations: deterministic SQL plan and isolated orchestration tests."""
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import subprocess
import tempfile
import types
import unittest
from unittest.mock import patch
from test_opsolid_backup_restore_proof import expected, owned, OWNED, TOKEN

SPEC = importlib.util.spec_from_file_location("runtime_role", Path(__file__).parents[1] / "ops" / "opsolid-runtime-role.py")
role = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(role)
ROLE = "opsolid_runtime_reviewed_v1"
PASSWORD = "synthetic_only_" + "x" * 40
IMAGE = "sha256:" + "b" * 64


def complete_candidate_proof():
    return {"candidate_image": IMAGE, "password_authentication_verified": True,
            "application_smoke_verified": True, "candidate_container_removed": True}


class RolePlans(unittest.TestCase):
    def test_allowlist_matches_all_mapped_models_and_reviewed_matrix(self):
        schema = (Path(__file__).parents[2] / "prisma" / "schema.prisma").read_text(encoding="utf-8")
        self.assertEqual(set(re.findall(r'@@map\("([a-z_]+)"\)', schema)), set(role.TABLES))
        self.assertEqual(len(role.TABLES), 46)
        self.assertEqual({operation: sum(operation in grants for grants in role.MATRIX.values()) for operation in ("SELECT", "INSERT", "UPDATE", "DELETE")}, {"SELECT": 46, "INSERT": 44, "UPDATE": 37, "DELETE": 17})
        self.assertEqual(role.MATRIX["card_templates"], ["SELECT"])
        self.assertEqual(role.MATRIX["voice_billing_plans"], ["SELECT"])
        self.assertNotIn("DELETE", role.MATRIX["users"])
        self.assertNotIn("UPDATE", role.MATRIX["order_status_history"])

    def test_provision_is_transactional_fresh_role_only_and_has_no_global_changes(self):
        sql = role.provision_sql(ROLE, PASSWORD, "opsolid")
        self.assertTrue(sql.startswith("BEGIN;"))
        self.assertTrue(sql.endswith("COMMIT;"))
        self.assertIn(f'CREATE ROLE "{ROLE}" NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS', sql)
        self.assertLess(sql.index("effective_sequence_privilege_mismatch"), sql.index(f'ALTER ROLE "{ROLE}" LOGIN'))
        self.assertIn("GRANT USAGE ON SEQUENCE public.card_orders_order_number_seq", sql)
        for forbidden in ("REVOKE ", "ALTER DEFAULT PRIVILEGES", "OWNER TO", "ENABLE ROW LEVEL", "DISABLE ROW LEVEL", "GRANT ALL", "IF NOT EXISTS"):
            self.assertNotIn(forbidden, sql)
        self.assertLess(sql.index("SET LOCAL log_statement='none'"), sql.index("PASSWORD "))

    def test_unreviewed_role_and_database_identifiers_are_rejected(self):
        for candidate in ("opsolid", 'opsolid_runtime_bad";DROP ROLE opsolid;', "postgres", "opsolid_runtime_"):
            with self.assertRaises(role.backup.ProofError):
                role.provision_sql(candidate, PASSWORD, "opsolid")
        with self.assertRaises(role.backup.ProofError):
            role.provision_sql(ROLE, PASSWORD, "another_database")

    def test_guards_cover_effective_public_grants_membership_ownership_and_escalation(self):
        sql = role.privilege_guard_sql(ROLE)
        for required in ("pg_auth_members", "relowner", "nspowner", "datdba", "has_schema_privilege", "prosecdef", "has_function_privilege", "TRUNCATE", "REFERENCES", "TRIGGER", "WITH GRANT OPTION", "rolbypassrls", "rolreplication"):
            self.assertIn(required, sql)
        self.assertNotIn("'TEMP'", sql, "inherited TEMP is reported rather than globally revoked")

    def test_isolated_contract_is_actual_login_not_set_role_emulation(self):
        sql = role.direct_login_test_sql(ROLE)
        self.assertIn(f"session_user='{ROLE}' AND current_user='{ROLE}'", sql)
        self.assertEqual(sql.count("LIMIT 0;"), 46)
        self.assertIn("SET ROLE proof_owner", sql)
        self.assertIn("EXCEPTION WHEN insufficient_privilege THEN NULL", sql)
        self.assertIn("runtime_proof_session_rotated", sql)
        self.assertIn("DELETE FROM public.saved_cards", sql)
        self.assertTrue(sql.endswith("ROLLBACK;"))
        self.assertNotIn("COMMIT", sql)
        self.assertIn("UPDATE public.voice_billing_plans SET display_name=display_name", sql)

    def test_sql_stdin_never_places_credential_in_argv_and_discards_errors(self):
        statement = role.provision_sql(ROLE, PASSWORD, "opsolid")
        with patch.object(role.subprocess, "run", return_value=types.SimpleNamespace(returncode=0, stdout=b"")) as run:
            role.sql("a"*64, "opsolid", "opsolid", statement)
            args, kwargs = run.call_args
            self.assertNotIn(PASSWORD, " ".join(args[0]))
            self.assertIn(PASSWORD.encode(), kwargs["input"])
            self.assertEqual(kwargs["stderr"], subprocess.DEVNULL)
            self.assertNotIn("shell", kwargs)
        with patch.object(role.subprocess, "run", return_value=types.SimpleNamespace(returncode=1, stdout=b"PRIVATE_ERROR")):
            with self.assertRaisesRegex(role.backup.ProofError, "^role_sql_failed$"):
                role.sql("a"*64, "opsolid", "opsolid", statement)

    def test_default_mode_cannot_provision(self):
        source = Path(role.__file__).read_text(encoding="utf-8")
        self.assertIn('default="plan"', source)
        self.assertIn('validation["script_sha256"] == digest_file(Path(__file__))', source)
        self.assertIn('validation["credential_sha256"] == digest_file', source)
        self.assertIn('validation.get("direct_login_verified")', source)
        self.assertIn('"password_authentication_verified", "application_smoke_verified", "candidate_container_removed"', source)
        self.assertIn('"candidate_image_required"', source)

    def test_sql_assertions_fail_closed_when_catalog_query_is_null(self):
        self.assertIn("IF (NULL) IS DISTINCT FROM TRUE", role.assertion("NULL", "missing_catalog"))

    def test_candidate_proof_rejects_wrong_image_untrusted_fields_and_truthy_flags(self):
        self.assertEqual(role.candidate_proof(complete_candidate_proof(), IMAGE), complete_candidate_proof())
        invalid = [None, {**complete_candidate_proof(), "logs": "private"},
                   {**complete_candidate_proof(), "candidate_image": "sha256:" + "c"*64}]
        for key in ("password_authentication_verified", "application_smoke_verified", "candidate_container_removed"):
            invalid.extend({**complete_candidate_proof(), key: value} for value in (False, None, 1, "true"))
        for proof in invalid:
            with self.subTest(proof=proof), self.assertRaises(role.backup.ProofError):
                role.candidate_proof(proof, IMAGE)

    def test_callback_requires_immutable_image_before_any_clone_creation(self):
        for callback, image in ((lambda *_: {}, None), (None, IMAGE), (lambda *_: {}, "latest")):
            with self.assertRaisesRegex(role.backup.ProofError, "^candidate_arguments_invalid$"):
                role.validate_isolated({}, {}, Path("unused"), ROLE, callback, image)


class IsolatedFlow(unittest.TestCase):
    def run_flow(self, candidate_check=None, candidate_image=None):
        sql_calls = []
        create_commands = []
        def sql(container, database, user, statement):
            sql_calls.append((container, database, user, statement))
            return "runtime_sql_proof_ok" if user == ROLE else ""
        def run(args, **kwargs):
            if args[0] == "create":
                create_commands.append(args)
                return OWNED.encode()
            if "id" in args:
                return b"70"
            return b""
        def query(container, database, user, statement):
            if "pg_database_size" in statement:
                return str(10*role.backup.MIB)
            if statement == "SELECT 1":
                return "1"
            if "count(*)" in statement:
                return "0"
            if "has_database_privilege" in statement:
                return "t"
            raise AssertionError("Unexpected query")
        with tempfile.TemporaryDirectory() as directory:
            base = Path(directory).resolve()
            folder = base / "source-backup"
            folder.mkdir()
            dump = folder / "opsolid.dump"
            dump.write_bytes(b"PGDMP-synthetic")
            report = folder / "proof.json"
            report.write_text(json.dumps({"ok": True, "code": "verified", "backup": str(dump), "sha256": hashlib.sha256(dump.read_bytes()).hexdigest(), "temporary_container_removed": True, "production_unchanged": True}))
            real_read_text = Path.read_text
            def read_text(path, *args, **kwargs):
                return "MemAvailable: 8388608 kB\n" if str(path).replace("\\", "/") == "/proc/meminfo" else real_read_text(path, *args, **kwargs)
            with patch.object(role.backup, "BASE", base), patch.object(role.backup, "secure_path"), patch.object(role.backup, "unchanged"), \
                 patch.object(role.backup, "run", side_effect=run), patch.object(role.backup, "query", side_effect=query), \
                 patch.object(role.backup, "inspect", return_value=owned()), patch.object(role.backup, "cleanup") as cleanup, \
                 patch.object(role, "sql", side_effect=sql), patch.object(role.uuid, "uuid4", return_value=types.SimpleNamespace(hex=TOKEN+"0"*8)), \
                 patch.object(role.secrets, "token_urlsafe", return_value=PASSWORD), patch.object(Path, "read_text", read_text):
                state, result = role.validate_isolated(expected(), {}, report, ROLE, candidate_check, candidate_image)
            self.assertNotIn(PASSWORD, json.dumps(result))
            self.assertTrue(dump.exists())
            self.assertTrue((state / "credential.json").exists())
            cleanup.assert_called_once()
            self.assertTrue(result["temporary_container_removed"])
            self.assertTrue(result["production_unchanged"])
        self.assertEqual(len(sql_calls), 2)
        self.assertTrue(all(call[0] == OWNED and call[1] == "proof_restore" for call in sql_calls))
        self.assertEqual(sql_calls[1][2], ROLE)
        return result, create_commands

    def test_new_login_is_used_only_in_owned_target_and_backup_is_retained(self):
        result, commands = self.run_flow()
        self.assertTrue(result["ok"])
        self.assertTrue(result["direct_login_verified"])
        self.assertFalse(result["application_smoke_verified"])
        self.assertFalse(result["password_authentication_verified"])
        self.assertTrue(result["inherited_temp"])
        self.assertIn("listen_addresses=", commands[0])
        self.assertNotIn("listen_addresses=127.0.0.1", commands[0])

    def test_candidate_callback_runs_before_cleanup_and_binds_finite_proof(self):
        def callback(container, credential):
            self.assertEqual(container, OWNED)
            self.assertEqual(credential, {"role": ROLE, "password": PASSWORD})
            credential["password"] = "callback cannot change stored credential"
            return complete_candidate_proof()
        result, commands = self.run_flow(callback, IMAGE)
        self.assertTrue(result["ok"])
        self.assertEqual({key: result[key] for key in complete_candidate_proof()}, complete_candidate_proof())
        self.assertIn("listen_addresses=127.0.0.1", commands[0])
        self.assertNotIn("listen_addresses=", commands[0])
        self.assertIn("POSTGRES_INITDB_ARGS=--auth-local=trust --auth-host=reject", commands[0])
        self.assertEqual(commands[0][commands[0].index("--network")+1], "none")
        self.assertNotIn("--publish", commands[0])

    def test_failed_candidate_cannot_provision_and_still_cleans_clone(self):
        result, _ = self.run_flow(lambda *_: {**complete_candidate_proof(), "application_smoke_verified": False}, IMAGE)
        self.assertFalse(result["ok"])
        self.assertEqual(result["code"], "candidate_proof_incomplete")

    def test_callback_exception_is_sanitized_and_still_cleans_clone(self):
        def callback(*_):
            raise role.backup.ProofError("private callback failure " + PASSWORD)
        result, _ = self.run_flow(callback, IMAGE)
        self.assertFalse(result["ok"])
        self.assertEqual(result["code"], "candidate_application_failed")

    def test_finite_allowlisted_candidate_stage_is_retained_without_raw_errors(self):
        def callback(*_):
            raise role.backup.ProofError("candidate_prisma_discovery_failed")
        result, _ = self.run_flow(callback, IMAGE)
        self.assertFalse(result["ok"])
        self.assertEqual(result["code"], "candidate_prisma_discovery_failed")


if __name__ == "__main__":
    unittest.main()
