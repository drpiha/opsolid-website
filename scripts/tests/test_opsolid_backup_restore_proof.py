"""Deterministic safety contracts; no Docker daemon, network or production data."""
import copy
import importlib.util
import json
import os
from pathlib import Path
import stat
import subprocess
import sys
import tempfile
import types
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location("proof", Path(__file__).parents[1] / "ops" / "opsolid-backup-restore-proof.py")
proof = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(proof)
TOKEN = "f" * 24
NAME = "opsolid-restore-proof-" + TOKEN
OWNED = "c" * 64
LIMITS = {"data": 512 * proof.MIB, "memory": 768 * proof.MIB, "dump_limit": 256 * proof.MIB}
CATALOG = {"tables": 2, "columns": 4, "constraints": 2, "indexes": 2, "sequences": 0, "invalid_constraints": 0}


def expected():
    return {
        "app": {"name": "opsolid-app", "id": "a" * 64, "image": "sha256:" + "b" * 64,
                "project": "opsolid-website", "service": "opsolid", "running": True,
                "mounts": [{"type": "bind", "name": None, "source": "/var/www/opsolid/uploads", "destination": "/app/public/uploads", "rw": True}]},
        "database": {"name": "opsolid-db", "id": "d" * 64, "image": proof.PG_IMAGE,
                     "project": "opsolid-website", "service": "opsolid-db", "running": True,
                     "mounts": [{"type": "volume", "name": "opsolid-website_opsolid_pgdata", "source": "/var/lib/docker/volumes/opsolid-website_opsolid_pgdata/_data", "destination": "/var/lib/postgresql/data", "rw": True}]},
    }


def production(item):
    return {"Id": item["id"], "Name": "/" + item["name"], "Image": item["image"],
            "Config": {"Labels": {"com.docker.compose.project": item["project"], "com.docker.compose.service": item["service"]}, "Env": ["SYNTHETIC_PRIVATE=never-export"]},
            "HostConfig": {"Privileged": False}, "NetworkSettings": {"Networks": {"internal": {"IPAddress": "192.0.2.1"}}},
            "State": {"Running": True, "Restarting": False, "Paused": False, "StartedAt": "fixed-time", "Health": {"Status": "healthy"}},
            "Mounts": [{"Type": m["type"], "Name": m["name"], "Source": m["source"], "Destination": m["destination"], "RW": m["rw"]} for m in item["mounts"]]}


def owned():
    return {"Id": OWNED, "Name": "/" + NAME, "Image": proof.PG_IMAGE,
            "Config": {"Labels": {proof.LABEL: TOKEN}, "User": "70:70"}, "Mounts": [],
            "HostConfig": {"NetworkMode": "none", "PortBindings": {}, "Binds": None, "Mounts": None, "VolumesFrom": None,
                           "Tmpfs": {"/var/lib/postgresql/data": "size=536870912", "/var/run/postgresql": "size=16777216", "/tmp": "size=16777216"},
                           "ReadonlyRootfs": True, "Privileged": False, "LogConfig": {"Type": "none"},
                           "Memory": LIMITS["memory"], "MemorySwap": LIMITS["memory"], "PidsLimit": 128, "NanoCpus": 1_000_000_000,
                           "CapDrop": ["ALL"], "CapAdd": None, "SecurityOpt": ["no-new-privileges:true"]}}


class Preconditions(unittest.TestCase):
    def test_gexec_generator_is_not_flushed_before_execution(self):
        # Captured from PostgreSQL16 psql -X -qAt with read-only constant SQL:
        # SELECT 'SELECT count(*) FROM (VALUES (1),(2)) AS synthetic(v);';
        # \gexec prints the generated statement AND its numeric result.
        legacy_stdout = b"SELECT count(*) FROM (VALUES (1),(2)) AS synthetic(v);\n2\n"
        fixed_stdout = b"2\n"  # Same query without the outer terminating ';'.
        with self.assertRaises(ValueError):
            [int(value) for value in legacy_stdout.splitlines()]
        self.assertEqual([int(value) for value in fixed_stdout.splitlines()], [2])
        self.assertEqual(proof.parse_count_output(fixed_stdout, 1), [2])
        with self.assertRaisesRegex(proof.ProofError, "^restored_count_output_invalid$"):
            proof.parse_count_output(legacy_stdout, 1)
        generator, executor = proof.COUNT_SQL.rstrip().rsplit("\n", 1)
        self.assertEqual(executor, r"\gexec")
        self.assertFalse(generator.rstrip().endswith(";"), "psql must execute the generator only through gexec")

    def test_count_output_rejects_non_numeric_or_incomplete_rows_without_raw_errors(self):
        for output in (b"2\n", b"-1\n2\n", b"PRIVATE_ERROR\n2\n", b"1\n2\n3\n"):
            with self.assertRaisesRegex(proof.ProofError, "^restored_count_output_invalid$"):
                proof.parse_count_output(output, 2)

    def test_reviewed_inventory_and_exact_production_state(self):
        snapshot = expected()
        proof.validate_expected(snapshot)
        for item in snapshot.values():
            proof.validate_production(production(item), item)

    def test_expected_identity_or_mount_expansion_is_rejected(self):
        for key, field, value in [("app", "id", "short"), ("app", "service", "other"), ("app", "mounts", []),
                                  ("database", "image", "postgres:16-alpine"), ("database", "mounts", [])]:
            with self.subTest(field=field):
                value_expected = expected()
                value_expected[key][field] = value
                with self.assertRaises(proof.ProofError):
                    proof.validate_expected(value_expected)

    def test_live_identity_labels_mounts_health_and_privilege_drift_fail(self):
        expected_app = expected()["app"]
        mutations = [lambda c: c.update(Id="e"*64), lambda c: c.update(Image="sha256:"+"e"*64), lambda c: c.update(Name="/other"),
                     lambda c: c["Config"]["Labels"].update({"com.docker.compose.project": "other"}),
                     lambda c: c["Mounts"][0].update(Source="/other"), lambda c: c["Mounts"][0].update(RW=False),
                     lambda c: c["State"].update(Restarting=True), lambda c: c["State"]["Health"].update(Status="unhealthy"),
                     lambda c: c["HostConfig"].update(Privileged=True)]
        for mutate in mutations:
            container = production(expected_app)
            mutate(container)
            with self.assertRaises(proof.ProofError):
                proof.validate_production(container, expected_app)

    def test_fingerprint_detects_env_network_and_restart_drift_without_exporting_values(self):
        original = production(expected()["app"])
        initial = proof.fingerprint(original)
        for mutate in [lambda c: c["Config"]["Env"].append("SYNTHETIC_PRIVATE=changed"),
                       lambda c: c["NetworkSettings"].update(Networks={}), lambda c: c["State"].update(StartedAt="new-time")]:
            changed = copy.deepcopy(original)
            mutate(changed)
            self.assertNotEqual(initial, proof.fingerprint(changed))
        self.assertEqual(len(initial), 32)

    def test_space_memory_and_size_limits_fail_closed(self):
        self.assertEqual(proof.resources(10 * proof.MIB, 5 * proof.GIB, 4 * proof.GIB), LIMITS)
        for values in [(0, 10*proof.GIB, 10*proof.GIB), (proof.MIB, proof.GIB, 10*proof.GIB),
                       (proof.MIB, 10*proof.GIB, proof.GIB), (proof.GIB, 10*proof.GIB, 10*proof.GIB)]:
            with self.assertRaises(proof.ProofError):
                proof.resources(*values)

    def test_secure_path_rejects_links_permissions_owner_and_hardlinks(self):
        target = Path("C:/synthetic/reviewed.json") if os.name == "nt" else Path("/synthetic/reviewed.json")
        def info(path):
            return types.SimpleNamespace(st_mode=(stat.S_IFREG | 0o600) if path == target else (stat.S_IFDIR | 0o755), st_uid=0, st_nlink=1)
        with patch.object(Path, "lstat", info):
            proof.secure_path(target, private=True, file=True)
        for values in [{"st_mode": stat.S_IFLNK | 0o700}, {"st_mode": stat.S_IFREG | 0o644}, {"st_uid": 1000}, {"st_nlink": 2}]:
            def unsafe(path):
                result = info(path)
                if path == target:
                    for key, value in values.items():
                        setattr(result, key, value)
                return result
            with patch.object(Path, "lstat", unsafe), self.assertRaises(proof.ProofError):
                proof.secure_path(target, private=True, file=True)

    def test_plan_has_no_production_mounts_network_ports_or_image_pull(self):
        command = proof.restore_command(NAME, TOKEN, LIMITS, 70, 70)
        self.assertEqual(command[:3], ["create", "--name", NAME])
        self.assertEqual(command[command.index("--pull")+1], "never")
        self.assertEqual(command[command.index("--network")+1], "none")
        self.assertEqual(command[command.index("--user")+1], "70:70")
        self.assertEqual(command.count("--tmpfs"), 3)
        self.assertIn(proof.PG_IMAGE, command)
        self.assertIn("listen_addresses=", command)
        for forbidden in ["--mount", "--volume", "-v", "--publish", "-p", "--privileged", "--env-file", "--volumes-from", "/var/lib/docker/volumes", "POSTGRES_PASSWORD"]:
            self.assertNotIn(forbidden, " ".join(command) if "/" in forbidden or forbidden == "POSTGRES_PASSWORD" else command)
        with self.assertRaises(proof.ProofError):
            proof.restore_command("opsolid-db", TOKEN, LIMITS, 70, 70)

    def test_cleanup_only_uses_exact_owned_id_and_never_removes_volumes(self):
        with patch.object(proof, "inspect", return_value=owned()), patch.object(proof, "run") as runner:
            proof.cleanup(OWNED, NAME, TOKEN, {"a"*64, "d"*64})
            runner.assert_called_once_with(["rm", "--force", OWNED])

    def test_cleanup_refuses_mismatched_identity_labels_and_boundaries(self):
        mutations = [lambda c: c.update(Id="a"*64), lambda c: c.update(Name="/opsolid-db"),
                     lambda c: c["Config"]["Labels"].update({proof.LABEL: "other"}),
                     lambda c: c["Config"]["Labels"].update({"com.docker.compose.project": "opsolid-website"}),
                     lambda c: c.update(Mounts=[{"Type": "volume"}]), lambda c: c["HostConfig"].update(NetworkMode="host"),
                     lambda c: c["HostConfig"].update(Privileged=True), lambda c: c["HostConfig"].update(Memory=0)]
        for mutate in mutations:
            value = owned()
            mutate(value)
            with patch.object(proof, "inspect", return_value=value), patch.object(proof, "run") as runner:
                with self.assertRaises(proof.ProofError):
                    proof.cleanup(OWNED, NAME, TOKEN, {"a"*64, "d"*64})
                runner.assert_not_called()

    def test_run_forces_local_socket_and_suppresses_command_errors(self):
        with patch.object(proof.subprocess, "run", return_value=types.SimpleNamespace(returncode=1, stdout=b"PRIVATE_PAYLOAD")) as runner:
            with self.assertRaisesRegex(proof.ProofError, "^docker_command_failed$"):
                proof.run(["inspect", "synthetic"])
            args, kwargs = runner.call_args
            self.assertEqual(args[0][:3], ["docker", "--host", "unix:///var/run/docker.sock"])
            self.assertEqual(kwargs["stderr"], subprocess.DEVNULL)
            self.assertNotIn("shell", kwargs)


class Orchestration(unittest.TestCase):
    def exercise(self, fail_restore=False, mismatch_cleanup=False):
        commands = []
        def runner(args, **kwargs):
            commands.append((args, kwargs))
            if "pg_dump" in args:
                kwargs["stdout"].write(b"PGDMP" + b"synthetic" * 200)
                self.assertIn("--format=custom", args)
                self.assertIn("--no-owner", args)
                self.assertIn("--no-privileges", args)
                self.assertTrue(any("default_transaction_read_only=on" in value for value in args))
                self.assertEqual(kwargs["file_limit"], LIMITS["dump_limit"])
                return None
            if args[0] == "create":
                return OWNED.encode()
            if "pg_restore" in args:
                self.assertIn(OWNED, args)
                if "--list" in args:
                    return b"1; catalog-entry\n"
                self.assertIn("--exit-on-error", args)
                self.assertIn("--single-transaction", args)
                if fail_restore:
                    raise proof.ProofError("docker_command_failed")
            if "psql" in args:
                return b"1\n2\n"
            return b""
        inspections = 0
        def inspector(_):
            nonlocal inspections
            inspections += 1
            value = owned()
            if mismatch_cleanup and inspections > 1:
                value["Config"]["Labels"][proof.LABEL] = "wrong-owner"
            return value
        def query(_container, _db, _user, sql):
            return "1" if sql == "SELECT 1" else json.dumps(CATALOG)
        fake_fcntl = types.SimpleNamespace(LOCK_EX=1, LOCK_NB=2, flock=lambda *_: None)
        with tempfile.TemporaryDirectory() as directory:
            base = Path(directory) / "backups"
            with patch.object(proof, "BASE", base), patch.object(proof, "secure_path"), patch.object(proof, "unchanged"), \
                 patch.object(proof, "run", side_effect=runner), patch.object(proof, "inspect", side_effect=inspector), \
                 patch.object(proof, "query", side_effect=query), patch.object(proof.uuid, "uuid4", return_value=types.SimpleNamespace(hex=TOKEN+"0"*8)), \
                 patch.object(proof.time, "strftime", return_value="20260916T120000Z"), \
                 patch.object(proof.os, "O_NOFOLLOW", getattr(os, "O_NOFOLLOW", 0), create=True), \
                 patch.dict(sys.modules, {"fcntl": fake_fcntl}):
                result = proof.execute(expected(), {}, LIMITS, CATALOG, 70, 70)
            files = list(base.glob("*/opsolid.dump"))
            self.assertEqual(len(files), 1, "backup must be retained after success OR failure")
            self.assertEqual(files[0].read_bytes()[:5], b"PGDMP")
            self.assertEqual(len(list(base.glob("*/proof.json"))), 1)
        self.assertFalse(any(args[0] in ("pull", "build", "compose", "stop", "restart", "kill") for args, _ in commands))
        self.assertFalse(any("pg_restore" in args and expected()["database"]["id"] in args for args, _ in commands))
        return result, commands

    def test_success_retains_dump_and_only_exports_counts(self):
        result, commands = self.exercise()
        self.assertTrue(result["ok"])
        self.assertTrue(result["temporary_container_removed"])
        self.assertEqual(result["restored_rows"], 3)
        self.assertEqual(result["counted_tables"], 2)
        self.assertNotIn("synthetic", json.dumps(result))
        self.assertEqual([args for args, _ in commands if args[0] == "rm"], [["rm", "--force", OWNED]])

    def test_restore_error_still_cleans_owned_container_and_retains_dump(self):
        result, commands = self.exercise(fail_restore=True)
        self.assertFalse(result["ok"])
        self.assertEqual(result["stage"], "isolated_restore")
        self.assertTrue(result["temporary_container_removed"])
        self.assertTrue(result["production_unchanged"])

    def test_cleanup_identity_drift_stops_deletion_and_returns_failure(self):
        result, commands = self.exercise(mismatch_cleanup=True)
        self.assertFalse(result["ok"])
        self.assertEqual(result["code"], "owned_container_cleanup_requires_review")
        self.assertFalse(any(args[0] == "rm" for args, _ in commands))


if __name__ == "__main__":
    unittest.main()
