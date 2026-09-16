"""Synthetic cutover contracts; no production, Docker daemon or HTTP calls."""
import copy
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
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
    def run_apply(self, execute=False, failure=None, initial="old", direction="forward", rollback_failure=None, guard_drift=None):
        before = app()
        env = cutover.next_environment(before, {"role": ROLE, "password": "y"*48}, COMMIT)
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


if __name__ == "__main__":
    unittest.main()
