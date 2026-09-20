"""Synthetic cutover contracts; no production, Docker daemon or HTTP calls."""
import copy
import importlib.util
import json
from pathlib import Path
import re
import subprocess
import tempfile
from types import SimpleNamespace
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location("cutover", Path(__file__).parents[1] / "ops" / "opsolid-app-cutover.py")
cutover = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(cutover)
OLD = "sha256:"+"a"*64
NEW = "sha256:"+"b"*64
COMMIT = "c"*40
ROLE = "opsolid_runtime_cutover"
STATE = Path("/var/backups/opsolid/app-cutover-"+"d"*24)


def app():
    return {"Id": "e"*64, "Name": "/opsolid-app", "Image": OLD,
            "Config": {"Image": "legacy-tag", "Hostname": "e"*12, "Env": ["DATABASE_URL=postgresql://owner:synthetic@opsolid-db:5432/opsolid?schema=public", "JWT_SECRET="+"x"*48, "GIT_COMMIT=old", "LITERAL=$nonsecret"],
                       "Cmd": ["node", "server.js"], "Entrypoint": ["docker-entrypoint.sh"], "User": "nextjs", "WorkingDir": "/app", "Healthcheck": {"Test": ["CMD", "node", "health"]},
                       "Labels": {"com.docker.compose.project": "opsolid-website", "com.docker.compose.service": "opsolid", "com.docker.compose.config-hash": "old", "traefik.enable": "true"}},
            "HostConfig": {"NetworkMode": "opsolid-website_internal", "Privileged": False, "Binds": ["/var/www/opsolid/uploads:/app/public/uploads:rw"], "RestartPolicy": {"Name": "unless-stopped"}},
            "Mounts": [{"Type": "bind", "Name": None, "Source": "/var/www/opsolid/uploads", "Destination": "/app/public/uploads", "RW": True}],
            "NetworkSettings": {"Networks": {"opsolid-website_internal": {"NetworkID": "internal", "Aliases": ["opsolid-app", "opsolid", "e"*12], "DNSNames": ["opsolid-app", "e"*12], "IPAddress": "192.0.2.1", "EndpointID": "old"}}},
            "State": {"Running": True, "Health": {"Status": "healthy"}, "StartedAt": "old"}}


def config():
    return {"name": "opsolid-website", "services": {"opsolid": {"build": {"context": "/opt/opsolid-website"}, "container_name": "opsolid-app", "entrypoint": [], "command": ["unreviewed-on-disk-command"], "environment": {"LITERAL": "$$nonsecret"}, "healthcheck": {"test": ["CMD", "node", "health"]}, "labels": {"traefik.enable": "true"}}, "opsolid-db": {"image": "postgres:16-alpine", "environment": {"POSTGRES_PASSWORD": "synthetic"}}}, "networks": {}, "volumes": {}}


class PacketContracts(unittest.TestCase):
    def test_app_absence_requires_successful_exact_name_lookup(self):
        with patch.object(cutover, "run", return_value=b"") as query, patch.object(cutover.backup, "inspect") as inspect:
            self.assertIsNone(cutover.current_app())
            self.assertIn("name=^/opsolid-app$", query.call_args.args[0])
            inspect.assert_not_called()
        with patch.object(cutover, "run", side_effect=cutover.backup.ProofError("cutover_command_failed")):
            with self.assertRaises(cutover.backup.ProofError):
                cutover.current_app()
        with patch.object(cutover, "run", return_value=b"invalid\n"):
            with self.assertRaises(cutover.backup.ProofError):
                cutover.current_app()
        current = app()
        with patch.object(cutover, "run", return_value=(current["Id"]+"\n").encode()), patch.object(cutover.backup, "inspect", return_value=current) as inspect:
            self.assertEqual(cutover.current_app(), current)
            inspect.assert_called_once_with(current["Id"])

    def test_complete_healthcheck_is_preserved_or_rejected_before_packet(self):
        current, source = app(), config()
        current["Config"]["Healthcheck"].update(Interval=30_000_000_000, Timeout=10_000_000_000, Retries=5, StartPeriod=60_000_000_000, StartInterval=1_000_000_000)
        source["services"]["opsolid"]["healthcheck"].update(interval="30s", timeout="10s", retries=5, start_period="1m0s", start_interval="1s")
        base, _, _ = cutover.make_packet(source, current, {"role": ROLE, "password": "y"*48}, NEW, COMMIT)
        self.assertEqual(base["services"]["opsolid"]["healthcheck"], source["services"]["opsolid"]["healthcheck"])
        for field, bad in (("interval", "20s"), ("timeout", "1s"), ("retries", 1), ("start_period", "0s"), ("start_interval", "2s"), ("disable", True)):
            changed = copy.deepcopy(source)
            changed["services"]["opsolid"]["healthcheck"][field] = bad
            with self.subTest(field=field), self.assertRaises(cutover.backup.ProofError):
                cutover.make_packet(changed, current, {"role": ROLE, "password": "y"*48}, NEW, COMMIT)

    def test_all_explicit_labels_override_candidate_image_labels(self):
        before, after = app(), app()
        before["Config"]["Labels"]["custom.owner"] = "compose"
        before["Config"]["Labels"]["old.image.only"] = "old"
        after["Image"] = NEW
        after["Config"]["Labels"]["custom.owner"] = "compose"
        after["Config"]["Labels"]["new.image.only"] = "new"
        cutover.verify_app(before, after, NEW, cutover.candidate.environment_map(after["Config"]["Env"]),
                           {"custom.owner": "image", "new.image.only": "new"}, {"custom.owner": "compose", "traefik.enable": "true"})

    def test_packet_preserves_live_startup_and_all_but_three_runtime_fields(self):
        base, forward, rollback = cutover.make_packet(config(), app(), {"role": ROLE, "password": "y"*48}, NEW, COMMIT)
        service = base["services"]["opsolid"]
        self.assertEqual(service["command"], ["node", "server.js"])
        self.assertEqual(service["entrypoint"], ["docker-entrypoint.sh"])
        self.assertEqual(service["environment"]["LITERAL"], "$$nonsecret")
        self.assertNotIn("build", service)
        self.assertEqual(base["services"]["opsolid-db"], config()["services"]["opsolid-db"])
        self.assertEqual(set(forward["services"]), {"opsolid"})
        changed = forward["services"]["opsolid"]
        self.assertEqual(set(changed), {"image", "environment"})
        self.assertEqual(set(changed["environment"]), {"DATABASE_URL", "GIT_COMMIT"})
        self.assertIn("@opsolid-db:5432/opsolid?schema=public", changed["environment"]["DATABASE_URL"])
        self.assertEqual(rollback["services"]["opsolid"]["image"], OLD)

    def test_short_jwt_or_unexpected_database_destination_fails_before_packet(self):
        for env in (["JWT_SECRET=short", "DATABASE_URL=postgresql://owner:pw@opsolid-db:5432/opsolid"], ["JWT_SECRET="+"x"*48, "DATABASE_URL=postgresql://owner:pw@elsewhere:5432/opsolid"]):
            current = app(); current["Config"]["Env"] = env
            with self.assertRaises(Exception):
                cutover.make_packet(config(), current, {"role": ROLE, "password": "y"*48}, NEW, COMMIT)

    def test_up_command_only_targets_app_and_never_builds_pulls_or_dependencies(self):
        command = cutover.compose_command(STATE, "forward", "up")
        self.assertEqual(command[-1], "opsolid")
        for required in ("--no-deps", "--no-build", "--pull", "never", "--wait"):
            self.assertIn(required, command)
        for forbidden in ("down", "build", "pull", "--remove-orphans", "-v"):
            self.assertNotIn(forbidden, command)
        self.assertIn(str(STATE/"base.json"), command)
        self.assertIn(str(STATE/"forward.json"), command)

    def test_runtime_comparison_ignores_only_new_identity_and_network_addresses(self):
        before = app(); after = copy.deepcopy(before)
        after.update(Id="f"*64, Image=NEW)
        after["Config"].update(Image=NEW, Hostname="f"*12)
        after["Config"]["Labels"]["com.docker.compose.config-hash"] = "new"
        after["Config"]["Labels"]["org.opencontainers.image.revision"] = COMMIT
        after["Config"]["Env"] = [item.replace("GIT_COMMIT=old", "GIT_COMMIT="+COMMIT) for item in before["Config"]["Env"]]
        network = after["NetworkSettings"]["Networks"]["opsolid-website_internal"]
        network.update(IPAddress="192.0.2.2", EndpointID="new", Aliases=["opsolid-app", "opsolid", "f"*12], DNSNames=["opsolid-app", "f"*12])
        env = dict(item.split("=",1) for item in after["Config"]["Env"])
        cutover.verify_app(before, after, NEW, env, {"org.opencontainers.image.revision": COMMIT}, {"traefik.enable": "true"})
        for field in ("Cmd", "User", "WorkingDir", "Healthcheck"):
            drift = copy.deepcopy(after); drift["Config"][field] = "unexpected"
            with self.subTest(field=field), self.assertRaises(Exception):
                cutover.verify_app(before, drift, NEW, env, {"org.opencontainers.image.revision": COMMIT}, {"traefik.enable": "true"})
        drift = copy.deepcopy(after); drift["HostConfig"]["Privileged"] = True
        with self.assertRaises(Exception):
            cutover.verify_app(before, drift, NEW, env, {"org.opencontainers.image.revision": COMMIT}, {"traefik.enable": "true"})

    def test_literal_compose_preserves_dollars_through_real_config_parser(self):
        literal = "literal$one ${UNTRUSTED} two$$three"
        value = {"services": {"opsolid": {"image": "synthetic:never-run", "environment": {"VALUE": literal}}}}
        encoded = cutover.literal_compose(value)
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder); (path/"empty.env").write_text(""); (path/"compose.json").write_text(json.dumps(encoded))
            result = subprocess.run(["docker", "compose", "--project-name", "opsolid-synthetic", "--env-file", str(path/"empty.env"), "-f", str(path/"compose.json"), "config", "--format", "json"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=20)
            self.assertEqual(result.returncode, 0)
            rendered = json.loads(result.stdout)["services"]["opsolid"]["environment"]["VALUE"]
            self.assertEqual(rendered, literal.replace("$", "$$"))


class ApplicationOrchestration(unittest.TestCase):
    def run_apply(self, execute=False, failure=None, initial="old", direction="forward", rollback_failure=None, guard_drift=None, existing=False):
        before = app()
        if existing:
            before["Config"]["Env"][0] = f"DATABASE_URL=postgresql://{ROLE}:synthetic%24value@opsolid-db:5432/opsolid?schema=public"
        env = cutover.existing_environment(before, COMMIT)[0] if existing else cutover.next_environment(before, {"role": ROLE, "password": "y"*48}, COMMIT)
        def recreated(image, identity, environment):
            value = copy.deepcopy(before)
            value.update(Id=identity*64, Image=image)
            value["Config"].update(Image=image, Hostname=identity*12, Env=[key+"="+item for key,item in environment.items()])
            network = value["NetworkSettings"]["Networks"]["opsolid-website_internal"]
            network.update(Aliases=["opsolid-app", "opsolid", identity*12], DNSNames=["opsolid-app", identity*12])
            if image == NEW:
                value["Config"]["Labels"]["org.opencontainers.image.revision"] = COMMIT
            return value
        after = recreated(NEW, "f", env)
        restored = recreated(OLD, "9", cutover.candidate.environment_map(before["Config"]["Env"]))
        db = {"Id": "database"}
        snapshot = {"baseline": {"app": before, "database": db}, "expected": {"app": {"id": before["Id"], "image": OLD}, "database": {"id": "database"}},
                    "originals": {"source": "old"}, "others": [["database", "image", "started", True]],
                    "forward_env": env, "rollback_env": dict(item.split("=",1) for item in before["Config"]["Env"]),
                    "candidate_image": NEW, "commit": COMMIT, "candidate_image_labels": {"org.opencontainers.image.revision": COMMIT},
                    "explicit_labels": {"traefik.enable": "true"},
                    "role_state": "/var/backups/opsolid/runtime-role-synthetic", "role_state_hashes": {"validation.json": "hash", "credential.json": "hash", "provisioned.json": "hash"}}
        if existing:
            del snapshot["role_state"]
            del snapshot["role_state_hashes"]
            snapshot.update(preparation="existing-runtime-v1", runtime_role=ROLE,
                            predecessor={"state": str(STATE), "manifest_sha256": "d"*64})
        calls = []
        current = None if initial == "absent" else copy.deepcopy(after if initial != "old" else before)
        if initial == "old-drift":
            current = copy.deepcopy(restored)
            current["State"]["Running"] = False
            current["Config"]["Cmd"] = ["drift"]
        if initial == "candidate-drift":
            current["Config"]["Env"] = ["unreviewed=drift"]
            current["Config"]["Cmd"] = ["drift"]
            current["State"]["Running"] = False
        if initial in ("wrong-image", "wrong-name", "wrong-project", "wrong-service"):
            if initial == "wrong-image": current["Image"] = "sha256:"+"8"*64
            elif initial == "wrong-name": current["Name"] = "/unrelated"
            else: current["Config"]["Labels"]["com.docker.compose."+initial.removeprefix("wrong-")] = "unrelated"
        phase = None
        def run(args, **_):
            nonlocal current, phase
            calls.append(args)
            if args[:2] == ["image", "inspect"]:
                return json.dumps([{"Id": args[2], "Config": {"Labels": {"org.opencontainers.image.revision": COMMIT}, "Env": []}}]).encode()
            phase = "rollback" if str(STATE/"rollback.json") in args else "forward"
            current = copy.deepcopy(restored if phase == "rollback" else after)
            fault = rollback_failure if phase == "rollback" else failure
            if fault in ("absent", "missing-after-up"): current = None
            elif fault == "health": current["State"]["Health"]["Status"] = "unhealthy"
            elif fault == "runtime": current["Config"]["Cmd"] = ["drift"]
            if fault in ("compose", "absent"):
                raise cutover.backup.ProofError("cutover_command_failed")
            return b""
        def read(*_, **__):
            return b"failed" if (rollback_failure if phase == "rollback" else failure) == "read" else b"read_only_app_proof_ok"
        def hashes():
            return {"source": "changed" if guard_drift == "source" or (phase and failure == "source") else "old"}
        def others(excluded):
            self.assertEqual(excluded, current["Id"] if current else None)
            return [] if guard_drift == "others" or (phase and failure == "others") else snapshot["others"]
        with patch.object(cutover, "load_packet", return_value=snapshot), \
             patch.object(cutover, "original_hashes", side_effect=hashes), patch.object(cutover, "current_app", side_effect=lambda: current), \
             patch.object(cutover.backup, "inspect", side_effect=lambda _: {"Id": "changed"} if guard_drift == "database" or (phase and failure == "database") else db), patch.object(cutover.backup, "validate_production"), \
             patch.object(cutover.backup, "fingerprint", side_effect=lambda value: value["Id"]), patch.object(cutover.backup, "unchanged"), \
             patch.object(cutover, "other_containers", side_effect=others), patch.object(cutover.role, "digest_file", return_value="hash"), \
             patch.object(cutover.backup, "secure_path"), patch.object(cutover, "run", side_effect=run), \
             patch.object(cutover.candidate, "private_exec", side_effect=read) as read_proof, \
             patch.object(cutover.role, "write_private") as persist:
            result, error = None, None
            try:
                result = cutover.apply_packet(STATE, direction, execute)
            except cutover.backup.ProofError as caught:
                error = str(caught)
        return result, error, calls, read_proof, persist

    def test_dry_run_never_calls_up_or_database_probes(self):
        result, error, calls, read_proof, persist = self.run_apply()
        self.assertIsNone(error)
        self.assertEqual(result["stage"], "reviewed_packet_ready")
        self.assertFalse(any("up" in call for call in calls))
        read_proof.assert_not_called()
        persist.assert_not_called()

    def test_apply_verifies_read_only_runtime_and_non_target_invariants(self):
        result, error, calls, read_proof, persist = self.run_apply(execute=True)
        self.assertIsNone(error)
        self.assertTrue(result["ok"], result)
        self.assertTrue(result["database_unchanged"])
        self.assertTrue(result["other_containers_unchanged"])
        self.assertTrue(result["original_files_unchanged"])
        self.assertEqual(sum("up" in call for call in calls), 1)
        read_proof.assert_called_once()
        persist.assert_called_once()
        self.assertNotIn("y"*48, json.dumps(result))
        self.assertNotIn("y"*48, json.dumps(calls))

    def test_each_forward_failure_automatically_restores_and_retains_original_error(self):
        for failure, code in (("compose", "cutover_command_failed"), ("absent", "cutover_command_failed"), ("missing-after-up", "app_missing_after_compose"), ("health", "app_not_healthy"), ("runtime", "app_runtime_setting_drift"), ("read", "app_database_read_proof_failed")):
            with self.subTest(failure=failure):
                result, error, calls, _, persist = self.run_apply(execute=True, failure=failure)
                self.assertIsNone(error)
                self.assertFalse(result["ok"])
                self.assertEqual(result["code"], code)
                self.assertTrue(result["rollback_attempted"])
                self.assertTrue(result["rollback_ok"], result)
                self.assertEqual(result["rollback_stage"], "verified")
                self.assertEqual(sum("up" in call for call in calls), 2)
                self.assertIn("--force-recreate", [call for call in calls if "up" in call][-1])
                persist.assert_called_once()

    def test_explicit_rollback_recovers_absent_candidate_drift_and_old_drift(self):
        for initial in ("absent", "candidate-drift", "old-drift"):
            with self.subTest(initial=initial):
                result, error, calls, read_proof, _ = self.run_apply(execute=True, direction="rollback", initial=initial)
                self.assertIsNone(error)
                self.assertTrue(result["ok"], result)
                self.assertEqual(sum("up" in call for call in calls), 1)
                read_proof.assert_called_once()

    def test_unrelated_app_identity_refuses_recovery_before_compose(self):
        for initial in ("wrong-image", "wrong-name", "wrong-project", "wrong-service"):
            with self.subTest(initial=initial):
                result, error, calls, read_proof, persist = self.run_apply(execute=True, direction="rollback", initial=initial)
                self.assertIsNone(result)
                self.assertIsNotNone(error)
                self.assertFalse(any("up" in call for call in calls))
                read_proof.assert_not_called()
                persist.assert_not_called()

    def test_rollback_failure_never_claims_restoration_or_overwrites_forward_error(self):
        for failure in ("compose", "health", "read", "runtime", "absent"):
            with self.subTest(failure=failure):
                result, error, calls, _, _ = self.run_apply(execute=True, failure="health", rollback_failure=failure)
                self.assertIsNone(error)
                self.assertEqual(result["code"], "app_not_healthy")
                self.assertFalse(result["ok"])
                self.assertFalse(result["rollback_ok"])
                self.assertTrue(result["manual_review_required"])
                self.assertTrue(result["rollback_code"])
                self.assertEqual(sum("up" in call for call in calls), 2)

    def test_explicit_rollback_failure_requires_manual_review(self):
        result, error, calls, _, _ = self.run_apply(execute=True, direction="rollback", initial="candidate-drift", rollback_failure="health")
        self.assertIsNone(error)
        self.assertFalse(result["ok"])
        self.assertTrue(result["manual_review_required"])
        self.assertEqual(result["code"], "app_not_healthy")
        self.assertEqual(sum("up" in call for call in calls), 1)

    def test_non_target_drift_blocks_forward_and_explicit_recovery(self):
        for direction in ("forward", "rollback"):
            for drift in ("source", "database", "others"):
                with self.subTest(direction=direction, drift=drift):
                    result, error, calls, read_proof, persist = self.run_apply(execute=True, direction=direction, guard_drift=drift)
                    self.assertIsNone(result)
                    self.assertIsNotNone(error)
                    self.assertFalse(any("up" in call for call in calls))
                    read_proof.assert_not_called()
                    persist.assert_not_called()

    def test_postflight_non_target_drift_reports_guarded_rollback_failure(self):
        for drift in ("source", "database", "others"):
            with self.subTest(drift=drift):
                result, error, calls, _, _ = self.run_apply(execute=True, failure=drift)
                self.assertIsNone(error)
                self.assertFalse(result["ok"])
                self.assertTrue(result["rollback_attempted"])
                self.assertFalse(result["rollback_ok"])
                self.assertEqual(result["rollback_stage"], "preflight")
                self.assertEqual(sum("up" in call for call in calls), 1)

    def test_existing_runtime_is_revalidated_before_apply_and_forward_failures_rollback(self):
        for failure in (None, "compose", "health", "read"):
            with self.subTest(failure=failure), patch.object(cutover, "predecessor_config") as predecessor, patch.object(cutover, "verify_existing_role") as role_probe:
                result, error, calls, _, _ = self.run_apply(execute=True, existing=True, failure=failure)
                self.assertIsNone(error)
                predecessor.assert_called_once()
                role_probe.assert_called_once()
                self.assertEqual(result["ok"], failure is None)
                self.assertEqual(sum("up" in call for call in calls), 1 if failure is None else 2)
                if failure:
                    self.assertTrue(result["rollback_ok"])

    def test_failed_existing_role_or_predecessor_check_never_recreates_app(self):
        for guard in ("predecessor_config", "verify_existing_role"):
            with self.subTest(guard=guard), patch.object(cutover, "predecessor_config"), patch.object(cutover, "verify_existing_role"), patch.object(cutover, guard, side_effect=cutover.backup.ProofError("guard_failed")):
                result, error, calls, _, persist = self.run_apply(execute=True, existing=True)
                self.assertIsNone(result)
                self.assertEqual(error, "guard_failed")
                self.assertFalse(any("up" in call for call in calls))
                persist.assert_not_called()

    def test_existing_rollback_does_not_depend_on_predecessor_or_role_provisioning_files(self):
        with patch.object(cutover, "predecessor_config", side_effect=AssertionError("not needed for recovery")), patch.object(cutover, "verify_existing_role", side_effect=AssertionError("no forward probe in rollback")):
            result, error, calls, _, _ = self.run_apply(execute=True, direction="rollback", initial="candidate-drift", existing=True)
            self.assertIsNone(error)
            self.assertTrue(result["ok"])
            self.assertEqual(sum("up" in call for call in calls), 1)


class ExistingRuntimeContracts(unittest.TestCase):
    def fixture(self, folder):
        state = folder / ("app-cutover-"+"1"*24)
        state.mkdir()
        current = app()
        current["Config"]["Env"][0] = f"DATABASE_URL=postgresql://{ROLE}:synthetic%24value@opsolid-db:5432/opsolid?schema=public&connection_limit=5"
        current["Config"]["Labels"].update({"com.docker.compose.project.config_files": f"{state}/base.json,{state}/forward.json", "com.docker.compose.project.working_dir": str(cutover.PROJECT)})
        database = copy.deepcopy(current)
        database.update(Id="7"*64, Name="/opsolid-db", Image=cutover.backup.PG_IMAGE)
        env = cutover.candidate.environment_map(current["Config"]["Env"])
        base = config()
        base["services"]["opsolid"].update(image=OLD, environment=cutover.literal_compose(env))
        previous = {"baseline": {"app": current, "database": database}, "originals": {"source": "unchanged"},
                    "expected": {"app": {"image": OLD}}, "rollback_env": env,
                    "candidate_image": OLD, "forward_env": env, "candidate_image_labels": {}, "explicit_labels": {"traefik.enable": "true"}}
        values = {"base.json": base, "forward.json": {"services": {"opsolid": {"image": OLD, "environment": {}}}}, "rollback.json": {}, "snapshot.json": previous}
        for name, value in values.items():
            (state/name).write_text(json.dumps(value), encoding="utf-8")
        (state/"empty.env").write_text("")
        self.manifest(state)
        reference = {"state": str(state), "manifest_sha256": cutover.role.digest_file(state/"manifest.json")}
        return state, reference, current, database, base

    def manifest(self, state, script=None):
        (state/"manifest.json").write_text(json.dumps({"script_sha256": script or cutover.role.digest_file(Path(cutover.__file__)), "files": {key: cutover.role.digest_file(state/key) for key in cutover.FILES}}), encoding="utf-8")

    def test_environment_and_packet_preserve_database_url_bytes_and_default_off(self):
        current = app()
        url = f"postgresql://{ROLE}:synthetic%24value@opsolid-db:5432/opsolid?connection_limit=5&schema=public"
        current["Config"]["Env"][0] = "DATABASE_URL="+url
        before = cutover.candidate.environment_map(current["Config"]["Env"])
        env, name = cutover.existing_environment(current, COMMIT)
        self.assertEqual(name, ROLE)
        self.assertEqual(env, {**before, "GIT_COMMIT": COMMIT})
        base, forward, rollback = cutover.packet_with_environment(config(), current, env, NEW, COMMIT)
        self.assertEqual(env["DATABASE_URL"], url)
        self.assertEqual(forward["services"]["opsolid"]["environment"]["DATABASE_URL"], cutover.literal_compose(url))
        self.assertEqual(rollback["services"]["opsolid"]["environment"], cutover.literal_compose(before))
        for value in ("true", "TRUE", "1"):
            changed = copy.deepcopy(current); changed["Config"]["Env"].append("OPSO_WEB_ENABLED="+value)
            with self.subTest(value=value), self.assertRaisesRegex(cutover.backup.ProofError, "activation_unreviewed"):
                cutover.existing_environment(changed, COMMIT)
        current["Config"]["Env"][0] = "DATABASE_URL=postgresql://owner:synthetic@opsolid-db/opsolid"
        with self.assertRaisesRegex(cutover.backup.ProofError, "role_name_invalid"):
            cutover.existing_environment(current, COMMIT)

    def test_role_proof_uses_only_existing_connection_and_read_only_catalog_assertions(self):
        with patch.object(cutover.candidate, "private_exec", return_value=b"existing_runtime_read_only_ok") as execute, patch.object(cutover.role, "sql", side_effect=AssertionError("no admin SQL")):
            cutover.verify_existing_role(app(), ROLE)
        self.assertEqual(execute.call_args.args, (app()["Id"], "node"))
        payload = execute.call_args.kwargs["payload"].decode()
        self.assertIn('SET TRANSACTION READ ONLY', payload)
        self.assertIn('session_user=', payload)
        self.assertIn('role_flags_invalid', payload)
        self.assertIn('effective_table_privilege_mismatch', payload)
        self.assertNotIn('DATABASE_URL', payload)
        statements, _ = json.JSONDecoder().raw_decode(payload.split('for(const sql of ', 1)[1])
        self.assertEqual(statements[0], 'SET TRANSACTION READ ONLY')
        self.assertEqual(statements[1:3], ["SET LOCAL statement_timeout='5s'", "SET LOCAL lock_timeout='2s'"])
        self.assertTrue(all(sql.startswith('DO $proof$ ') and sql.count('DO $proof$') == 1 for sql in statements[3:]))
        executable = re.sub(r"'(?:''|[^'])*'", "''", '\n'.join(statements))
        for mutation in ('CREATE ROLE', 'GRANT ', 'REVOKE ', 'ALTER ', 'INSERT ', 'UPDATE ', 'DELETE ', 'TRUNCATE ', 'provision_sql'):
            self.assertTrue(mutation not in executable, f'unexpected SQL mutation: {mutation}')
        with patch.object(cutover.candidate, "private_exec", return_value=b"untrusted output"), self.assertRaisesRegex(cutover.backup.ProofError, "read_only_proof_failed"):
            cutover.verify_existing_role(app(), ROLE)

    def test_predecessor_binds_manifest_private_compose_live_runtime_and_database(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder).resolve()
            state, reference, current, database, config_value = self.fixture(root)
            with patch.object(cutover.backup, "BASE", root), patch.object(cutover.backup, "secure_path"), patch.object(cutover, "original_hashes", return_value={"source": "unchanged"}), patch.object(cutover, "run", return_value=json.dumps(config_value).encode()) as run:
                self.assertEqual(cutover.predecessor_config(reference, current, database), config_value)
                self.assertTrue(all('up' not in item.args[0] for item in run.call_args_list))
                for drift in ("manifest", "source-label", "environment", "image", "database"):
                    changed_ref, changed_app, changed_db = copy.deepcopy(reference), copy.deepcopy(current), copy.deepcopy(database)
                    if drift == "manifest": changed_ref["manifest_sha256"] = "0"*64
                    elif drift == "source-label": changed_app["Config"]["Labels"]["com.docker.compose.project.config_files"] = str(cutover.COMPOSE)
                    elif drift == "environment": changed_app["Config"]["Env"].append("UNREVIEWED=yes")
                    elif drift == "image": changed_app["Image"] = NEW
                    else: changed_db["Id"] = "9"*64
                    with self.subTest(drift=drift), self.assertRaises(cutover.backup.ProofError):
                        cutover.predecessor_config(changed_ref, changed_app, changed_db)
                (state/"forward.json").write_text("{}")
                with self.assertRaisesRegex(cutover.backup.ProofError, "packet_changed"):
                    cutover.predecessor_config(reference, current, database)

    def test_legacy_script_hash_is_accepted_only_for_exact_predecessor_not_apply(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder).resolve()
            state, _, _, _, _ = self.fixture(root)
            self.manifest(state, cutover.LEGACY_SCRIPT_SHA256)
            with patch.object(cutover.backup, "BASE", root), patch.object(cutover.backup, "secure_path"):
                with self.assertRaisesRegex(cutover.backup.ProofError, "manifest_invalid"):
                    cutover.load_packet(state, predecessor=True)
                with patch.object(cutover, "LEGACY_STATE", state):
                    self.assertIsInstance(cutover.load_packet(state, predecessor=True), dict)
                    with self.assertRaisesRegex(cutover.backup.ProofError, "manifest_invalid"):
                        cutover.load_packet(state)

    def test_prepare_existing_and_post_rollback_next_release_preserve_existing_role_and_packets(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder).resolve()
            state, reference, current, database, _ = self.fixture(root)
            old_hashes = {name: cutover.role.digest_file(state/name) for name in (*cutover.FILES, "manifest.json")}
            expected = {"app": {"id": current["Id"], "image": OLD}, "database": {"id": database["Id"]}}
            path = root/"expected.json"; path.write_text(json.dumps(expected))
            args = SimpleNamespace(expected=path, current_state=state, current_manifest_sha256=reference["manifest_sha256"], candidate_image=NEW, commit=COMMIT)
            def run(command, **_):
                if command[:2] == ["image", "inspect"]:
                    return json.dumps([{"Id": NEW, "Config": {"Labels": {"org.opencontainers.image.revision": COMMIT}, "Env": []}}]).encode()
                self.assertIn("config", command); self.assertNotIn("up", command)
                paths = [Path(command[index+1]) for index, value in enumerate(command) if value == "-f"]
                value = json.loads(paths[0].read_text()); overlay = json.loads(paths[1].read_text())
                for key, item in overlay.get("services", {}).get("opsolid", {}).items():
                    if key == "environment": value["services"]["opsolid"][key].update(item)
                    else: value["services"]["opsolid"][key] = item
                return json.dumps(value).encode()
            with patch.object(cutover.backup, "BASE", root), patch.object(cutover.backup, "secure_path"), patch.object(cutover.backup, "validate_expected"), patch.object(cutover.backup, "production_snapshot", return_value={"app": current, "database": database}), patch.object(cutover.backup, "unchanged"), patch.object(cutover, "original_hashes", return_value={"source": "unchanged"}), patch.object(cutover, "other_containers", return_value=[]), patch.object(cutover, "run", side_effect=run), patch.object(cutover, "verify_existing_role") as probe, patch.object(cutover, "load_role_state", side_effect=AssertionError("no old role proof")), patch.object(cutover.role, "sql", side_effect=AssertionError("no provisioning")):
                fresh = cutover.prepare_existing(args)
                snapshot = cutover.load_packet(fresh)
                probe.assert_called_once_with(current, ROLE)
                # A failed forward followed by successful rollback uses the NEW
                # packet's rollback overlay, while restoring the old image/env.
                restored = copy.deepcopy(current)
                restored["Config"]["Labels"]["com.docker.compose.project.config_files"] = f"{fresh}/base.json,{fresh}/rollback.json"
                restored_ref = {"state": str(fresh), "manifest_sha256": cutover.role.digest_file(fresh/"manifest.json")}
                restored_config = cutover.predecessor_config(restored_ref, restored, database)
                self.assertEqual(restored_config["services"]["opsolid"]["image"], OLD)
                for drift in ("forward-label", "candidate-image", "candidate-environment"):
                    invalid = copy.deepcopy(restored)
                    if drift == "forward-label": invalid["Config"]["Labels"]["com.docker.compose.project.config_files"] = f"{fresh}/base.json,{fresh}/forward.json"
                    elif drift == "candidate-image": invalid["Image"] = NEW
                    else: invalid["Config"]["Env"] = [key+"="+value for key, value in snapshot["forward_env"].items()]
                    with self.subTest(drift=drift), self.assertRaises(cutover.backup.ProofError):
                        cutover.predecessor_config(restored_ref, invalid, database)
                next_args = SimpleNamespace(**{**vars(args), "current_state": fresh, "current_manifest_sha256": restored_ref["manifest_sha256"]})
                with patch.object(cutover.backup, "production_snapshot", return_value={"app": restored, "database": database}):
                    next_state = cutover.prepare_existing(next_args)
                self.assertNotEqual(next_state, fresh)
                self.assertEqual(cutover.load_packet(next_state)["rollback_env"]["DATABASE_URL"], snapshot["rollback_env"]["DATABASE_URL"])
            self.assertNotEqual(fresh, state)
            self.assertEqual(snapshot["preparation"], "existing-runtime-v1")
            self.assertEqual(snapshot["predecessor"], reference)
            self.assertNotIn("role_state", snapshot)
            self.assertEqual(snapshot["forward_env"]["DATABASE_URL"], snapshot["rollback_env"]["DATABASE_URL"])
            self.assertEqual(snapshot["forward_env"], {**snapshot["rollback_env"], "GIT_COMMIT": COMMIT})
            self.assertEqual(old_hashes, {name: cutover.role.digest_file(state/name) for name in old_hashes})


if __name__ == "__main__":
    unittest.main()
