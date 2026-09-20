#!/usr/bin/env python3
"""Prepare an immutable private app-only cutover/rollback packet; opt in to apply.

No build, pull, database writes, role changes, permission changes or source sync.
The existing Compose/.env stay untouched. Snapshots contain secrets and remain
root-only on the VPS. The original prepare mode changes the runtime DB login;
prepare-existing preserves the complete live environment except GIT_COMMIT.
An independent release GO is required before the operator uses --execute.
"""
import argparse
import copy
from decimal import Decimal
import importlib.util
import json
import os
from pathlib import Path
import re
import signal
import stat
import subprocess
import sys
from urllib.parse import parse_qs, quote, unquote, urlsplit, urlunsplit
import uuid

spec = importlib.util.spec_from_file_location("candidate_runtime", Path(__file__).with_name("opsolid-candidate-runtime.py"))
candidate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(candidate)
role = candidate.role
backup = role.backup
require = backup.require
PROJECT = Path("/opt/opsolid-website")
COMPOSE = PROJECT / "docker-compose.yml"
ENV = PROJECT / ".env"
FILES = ("base.json", "forward.json", "rollback.json", "snapshot.json", "empty.env")
# Read-only predecessor compatibility for the one reviewed September17 cutover.
# This does not authorize applying an old packet with the updated executable.
LEGACY_STATE = backup.BASE / "app-cutover-1a6a38b57fda46b6b8c39eac"
LEGACY_SCRIPT_SHA256 = "ba7ca4ffffe1c9edb97f2b56c14a0ba6bb51982e1c5c17fd9d7fde92d7932e67"


def run(args, timeout=60):
    """Explicit local daemon; no inherited Compose overrides, stderr or logs."""
    try:
        result = subprocess.run(backup.DOCKER+args, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
                                env={"PATH": os.defpath, "HOME": "/root"}, timeout=timeout)
    except (OSError, subprocess.TimeoutExpired):
        raise backup.ProofError("cutover_command_failed") from None
    require(result.returncode == 0, "cutover_command_failed")
    return result.stdout

def literal_compose(value):
    # Compose's config JSON re-escapes literal dollars. Use this only on raw
    # inspect values, never twice on already rendered `compose config` output.
    if isinstance(value, str):
        return value.replace("$", "$$")
    if isinstance(value, dict):
        return {key: literal_compose(item) for key, item in value.items()}
    if isinstance(value, list):
        return [literal_compose(item) for item in value]
    return value


def next_environment(app, credential, commit):
    env = candidate.environment_map(app["Config"]["Env"])
    require(len(env.get("JWT_SECRET", "")) >= 32, "runtime_jwt_missing_or_short")
    role.role_name(credential["role"])
    require(bool(re.fullmatch(r"[A-Za-z0-9_-]{40,100}", credential["password"])), "runtime_credential_invalid")
    current = urlsplit(env.get("DATABASE_URL", ""))
    require(current.scheme in ("postgres", "postgresql") and current.hostname == "opsolid-db" and current.port in (None, 5432) and current.path == "/opsolid" and current.username and current.password and not current.fragment, "runtime_database_destination_unreviewed")
    options = parse_qs(current.query, keep_blank_values=True)
    require(set(options) <= {"schema", "connection_limit", "pool_timeout", "connect_timeout", "sslmode", "pgbouncer", "statement_cache_size"} and options.get("schema", ["public"]) == ["public"], "runtime_database_options_unreviewed")
    authority = quote(credential["role"], safe="")+":"+quote(credential["password"], safe="")+"@opsolid-db"+(":5432" if current.port else "")
    return {**env, "GIT_COMMIT": commit, "DATABASE_URL": urlunsplit((current.scheme, authority, current.path, current.query, ""))}


def duration_ns(value):
    if value in (None, 0, "0"):
        return 0
    units = {"ns": 1, "us": 1000, "µs": 1000, "ms": 1000000, "s": 1000000000, "m": 60000000000, "h": 3600000000000}
    require(isinstance(value, str) and bool(re.fullmatch(r"(?:[0-9]+(?:\.[0-9]+)?(?:ns|us|µs|ms|s|m|h))+", value)), "compose_healthcheck_duration_invalid")
    result = sum(Decimal(number)*units[unit] for number, unit in re.findall(r"([0-9]+(?:\.[0-9]+)?)(ns|us|µs|ms|s|m|h)", value))
    require(result == int(result), "compose_healthcheck_duration_invalid")
    return int(result)


def verify_healthcheck(service, app):
    health, live = service.get("healthcheck", {}), app["Config"].get("Healthcheck", {})
    fields = {"interval": "Interval", "timeout": "Timeout", "start_period": "StartPeriod", "start_interval": "StartInterval"}
    require(set(health) <= {*fields, "test", "retries", "disable"} and set(live) <= {*fields.values(), "Test", "Retries"}, "compose_healthcheck_shape_unreviewed")
    require(health.get("test") == literal_compose(live.get("Test")) and bool(health.get("disable", False)) == (live.get("Test") == ["NONE"]), "compose_healthcheck_mismatch")
    require(type(health.get("retries", 0)) is int and health.get("retries", 0) == live.get("Retries", 0), "compose_healthcheck_mismatch")
    require(all(duration_ns(health.get(key)) == live.get(field, 0) for key, field in fields.items()), "compose_healthcheck_mismatch")


def make_packet(config, app, credential, image, commit):
    env = next_environment(app, credential, commit)
    return packet_with_environment(config, app, env, image, commit)


def packet_with_environment(config, app, env, image, commit):
    require(bool(re.fullmatch(r"sha256:[a-f0-9]{64}", image)) and bool(re.fullmatch(r"[a-f0-9]{40}", commit)), "candidate_revision_invalid")
    old_env = candidate.environment_map(app["Config"]["Env"])
    require(app["Config"]["Cmd"] == ["node", "server.js"] and app["Config"]["Entrypoint"] == ["docker-entrypoint.sh"], "live_startup_unreviewed")
    require(app["Config"]["User"] == "nextjs" and app["Config"]["WorkingDir"] == "/app", "live_execution_identity_unreviewed")
    base = copy.deepcopy(config)
    service = base["services"]["opsolid"]
    verify_healthcheck(service, app)
    service.pop("build", None)
    service.update(image=app["Image"], command=literal_compose(app["Config"]["Cmd"]), entrypoint=literal_compose(app["Config"]["Entrypoint"]),
                   user=app["Config"]["User"], working_dir=app["Config"]["WorkingDir"], environment=literal_compose(old_env))
    forward = {"services": {"opsolid": {"image": image, "environment": literal_compose({key: env[key] for key in ("DATABASE_URL", "GIT_COMMIT")})}}}
    rollback = {"services": {"opsolid": {"image": app["Image"], "environment": literal_compose(old_env)}}}
    return base, forward, rollback

def compose_command(state, direction, action):
    require(direction in ("forward", "rollback") and action in ("config", "up"), "compose_action_invalid")
    command = ["compose", "--project-name", "opsolid-website", "--project-directory", str(PROJECT),
               "--env-file", str(state/"empty.env"), "-f", str(state/"base.json"), "-f", str(state/(direction+".json"))]
    return command + (["config", "--format", "json"] if action == "config" else ["up", "-d", "--no-deps", "--no-build", "--pull", "never", "--wait", "--wait-timeout", "180"] + (["--force-recreate"] if direction == "rollback" else []) + ["opsolid"])


def normalize(value):
    if isinstance(value, dict):
        return {key: normalize(item) for key, item in value.items() if item not in (None, {}, [])}
    if isinstance(value, list):
        return [normalize(item) for item in value]
    return value

def stable_runtime(container):
    config = {key: value for key, value in container["Config"].items() if key not in {"Env", "Image", "Hostname", "Labels"}}
    networks = {}
    for name, net in container["NetworkSettings"]["Networks"].items():
        networks[name] = {key: value for key, value in net.items() if key not in {"EndpointID", "IPAddress", "IPPrefixLen", "Gateway", "GlobalIPv6Address", "GlobalIPv6PrefixLen", "IPv6Gateway", "MacAddress", "Aliases", "DNSNames"}}
        for key in ("Aliases", "DNSNames"):
            networks[name][key] = sorted(value for value in net.get(key) or [] if value not in (container["Id"], container["Id"][:12]))
    return normalize({"Config": config, "HostConfig": container["HostConfig"], "Mounts": backup.mounts(container), "Networks": networks})

def verify_app(before, after, image, env, image_labels, explicit_labels):
    require(after["Name"] == "/opsolid-app" and after["Image"] == image, "app_identity_mismatch")
    labels = after["Config"].get("Labels") or {}
    require(labels.get("com.docker.compose.project") == "opsolid-website" and labels.get("com.docker.compose.service") == "opsolid", "app_compose_identity_mismatch")
    require(stable_runtime(after) == stable_runtime(before), "app_runtime_setting_drift")
    require(candidate.environment_map(after["Config"]["Env"]) == env, "app_environment_drift")
    expected_labels = {**(image_labels or {}), **explicit_labels}
    require({key: value for key, value in labels.items() if not key.startswith("com.docker.compose.")} == expected_labels, "app_routing_or_image_labels_drift")


def original_hashes():
    result = {}
    for path in (COMPOSE, ENV):
        require(path.resolve() == path and path.is_file() and not path.is_symlink(), "original_source_path_invalid")
        info = path.stat()
        require(stat.S_ISREG(info.st_mode) and info.st_nlink == 1 and not info.st_mode & 0o002, "original_source_world_writable")
        result[str(path)] = role.digest_file(path)
    return result


def other_containers(excluded_id):
    ids = run(["container", "ls", "-aq", "--no-trunc"]).decode().splitlines()
    require(len(ids) <= 100 and all(re.fullmatch(r"[a-f0-9]{64}", item) for item in ids), "container_inventory_unreviewed")
    ids = [item for item in ids if item != excluded_id]
    if not ids:
        return []
    output = run(["inspect", "--type", "container", "--format", "[{{json .Id}},{{json .Image}},{{json .State.StartedAt}},{{json .State.Running}}]", *ids])
    return sorted(json.loads(line) for line in output.splitlines())


def current_app():
    # A successful empty listing proves absence; a daemon/inspect error does not.
    ids = run(["container", "ls", "-aq", "--no-trunc", "--filter", "name=^/opsolid-app$"]).decode().splitlines()
    require(len(ids) <= 1 and all(re.fullmatch(r"[a-f0-9]{64}", item) for item in ids), "app_lookup_invalid")
    return backup.inspect(ids[0]) if ids else None


def recoverable_app(app, snapshot):
    if app is None:
        return
    require(app["Name"] == "/opsolid-app" and app["Image"] in (snapshot["candidate_image"], snapshot["expected"]["app"]["image"]), "rollback_app_identity_mismatch")
    labels = app["Config"].get("Labels") or {}
    require(labels.get("com.docker.compose.project") == "opsolid-website" and labels.get("com.docker.compose.service") == "opsolid", "rollback_app_compose_identity_mismatch")


def verify_surroundings(snapshot, current):
    require(original_hashes() == snapshot["originals"], "original_compose_or_env_changed")
    database = backup.inspect(snapshot["expected"]["database"]["id"])
    backup.validate_production(database, snapshot["expected"]["database"])
    require(backup.fingerprint(database) == backup.fingerprint(snapshot["baseline"]["database"]), "database_runtime_changed")
    require(other_containers(current["Id"] if current else None) == snapshot["others"], "other_container_changed")


def validate_source(config, app):
    labels = app["Config"]["Labels"]
    require(labels.get("com.docker.compose.project.config_files") == str(COMPOSE) and labels.get("com.docker.compose.project.working_dir") == str(PROJECT), "live_compose_source_mismatch")
    require(config.get("name") == "opsolid-website" and set(config["services"]) == {"opsolid", "opsolid-db"}, "compose_service_set_unreviewed")
    service = config["services"]["opsolid"]
    allowed = {"build", "command", "container_name", "depends_on", "entrypoint", "environment", "healthcheck", "labels", "networks", "restart", "volumes"}
    require(set(service) <= allowed and service["container_name"] == "opsolid-app", "compose_service_shape_unreviewed")
    require(service.get("restart") == app["HostConfig"]["RestartPolicy"]["Name"], "compose_restart_mismatch")
    live_env = literal_compose(candidate.environment_map(app["Config"]["Env"]))
    require(all(live_env.get(key) == value for key, value in service.get("environment", {}).items()), "compose_environment_mismatch")
    live_labels = literal_compose(app["Config"]["Labels"])
    require(all(live_labels.get(key) == value for key, value in service.get("labels", {}).items()), "compose_routing_mismatch")
    verify_healthcheck(service, app)
    networks = {config["networks"][key]["name"] for key in service["networks"]}
    require(networks == set(app["NetworkSettings"]["Networks"]), "compose_network_mismatch")
    volumes = service["volumes"]
    require(len(volumes) == 1 and volumes[0].get("type") == "bind" and volumes[0].get("source") == "/var/www/opsolid/uploads" and volumes[0].get("target") == "/app/public/uploads" and not volumes[0].get("read_only", False), "compose_volume_mismatch")


def load_role_state(state, expected, image):
    require(state.is_absolute() and state.resolve() == state and state.is_relative_to(backup.BASE), "runtime_state_path_invalid")
    backup.secure_path(state, private=True)
    for filename in ("validation.json", "credential.json", "provisioned.json"):
        backup.secure_path(state/filename, private=True, file=True)
    validation = json.loads((state/"validation.json").read_text())
    credential = json.loads((state/"credential.json").read_text())
    provisioned = json.loads((state/"provisioned.json").read_text())
    require(all(validation.get(key) is True for key in ("ok", "direct_login_verified", "temporary_container_removed", "production_unchanged")), "runtime_validation_incomplete")
    role.candidate_proof({key: validation.get(key) for key in ("candidate_image", "password_authentication_verified", "application_smoke_verified", "candidate_container_removed")}, image)
    require(validation["expected"] == expected and validation["role"] == credential["role"] and provisioned.get("ok") is True and provisioned.get("role") == credential["role"], "runtime_role_identity_mismatch")
    require(validation["script_sha256"] == role.digest_file(Path(role.__file__)) and validation["credential_sha256"] == role.digest_file(state/"credential.json"), "runtime_role_artifact_changed")
    return credential


def prepare(args):
    backup.secure_path(args.expected, private=True, file=True)
    expected = json.loads(args.expected.read_text())
    backup.validate_expected(expected)
    baseline = backup.production_snapshot(expected)
    originals = original_hashes()
    image = json.loads(run(["image", "inspect", args.candidate_image]))[0]
    candidate.validate_image(image, args.candidate_image, args.commit)
    # Zero/omitted Compose health timings inherit image defaults. The reviewed
    # image has none; reject new defaults rather than changing the live check.
    require(not image["Config"].get("Healthcheck"), "candidate_image_healthcheck_unreviewed")
    credential = load_role_state(args.role_state, expected, args.candidate_image)
    config = json.loads(run(["compose", "--project-name", "opsolid-website", "--project-directory", str(PROJECT), "--env-file", str(ENV), "-f", str(COMPOSE), "config", "--format", "json"]))
    validate_source(config, baseline["app"])
    env = next_environment(baseline["app"], credential, args.commit)
    metadata = {"role_state": str(args.role_state), "role_state_hashes": {key: role.digest_file(args.role_state/key) for key in ("validation.json", "credential.json", "provisioned.json")}}
    return save_packet(args, expected, baseline, originals, image, config, env, metadata)


def save_packet(args, expected, baseline, originals, image, config, env, metadata):
    require(set(candidate.environment_map(image["Config"].get("Env"))) <= set(env), "candidate_additional_environment_unreviewed")
    base, forward, rollback = packet_with_environment(config, baseline["app"], env, args.candidate_image, args.commit)
    backup.secure_path(backup.BASE, private=True)
    state = backup.BASE / ("app-cutover-"+uuid.uuid4().hex[:24])
    state.mkdir(mode=0o700)
    backup.secure_path(state, private=True)
    for filename, value in (("base.json", base), ("forward.json", forward), ("rollback.json", rollback)):
        role.write_private(state/filename, value)
    with (state/"empty.env").open("x"):
        pass
    backup.secure_path(state/"empty.env", private=True, file=True)
    effective_rollback = json.loads(run(compose_command(state, "rollback", "config")))
    effective_forward = json.loads(run(compose_command(state, "forward", "config")))
    require(effective_rollback == base, "private_compose_replay_changed")
    target = copy.deepcopy(base)
    target["services"]["opsolid"]["image"] = args.candidate_image
    target["services"]["opsolid"]["environment"] = literal_compose(env)
    require(effective_forward == target, "forward_compose_scope_expanded")
    snapshot = {"baseline": baseline, "expected": expected, "others": other_containers(expected["app"]["id"]),
                "originals": originals, "forward_env": env, "rollback_env": candidate.environment_map(baseline["app"]["Config"]["Env"]),
                "candidate_image": args.candidate_image, "commit": args.commit, "candidate_image_labels": image["Config"].get("Labels") or {},
                "explicit_labels": {key: baseline["app"]["Config"]["Labels"][key] for key in config["services"]["opsolid"].get("labels", {})}, **metadata}
    require(original_hashes() == originals, "compose_source_changed_during_prepare")
    backup.unchanged(expected, baseline)
    role.write_private(state/"snapshot.json", snapshot)
    role.write_private(state/"manifest.json", {"script_sha256": role.digest_file(Path(__file__)), "files": {key: role.digest_file(state/key) for key in FILES}})
    return state


def load_packet(state, *, predecessor=False):
    require(state.is_absolute() and state.resolve() == state and state.parent == backup.BASE and bool(re.fullmatch(r"app-cutover-[a-f0-9]{24}", state.name)), "cutover_state_invalid")
    backup.secure_path(state, private=True)
    for filename in (*FILES, "manifest.json"):
        backup.secure_path(state/filename, private=True, file=True)
    manifest = json.loads((state/"manifest.json").read_text())
    accepted_script = manifest["script_sha256"] == role.digest_file(Path(__file__))
    accepted_script |= predecessor and state == LEGACY_STATE and manifest["script_sha256"] == LEGACY_SCRIPT_SHA256
    require(accepted_script and set(manifest["files"]) == set(FILES), "cutover_manifest_invalid")
    require(all(role.digest_file(state/key) == value for key, value in manifest["files"].items()), "cutover_packet_changed")
    return json.loads((state/"snapshot.json").read_text())


def existing_environment(app, commit):
    env = candidate.environment_map(app["Config"]["Env"])
    current = urlsplit(env.get("DATABASE_URL", ""))
    require(current.scheme in ("postgres", "postgresql") and current.hostname == "opsolid-db" and current.port in (None, 5432) and current.path == "/opsolid" and current.username and current.password and not current.fragment, "runtime_database_destination_unreviewed")
    runtime_role = role.role_name(unquote(current.username))
    require(len(env.get("JWT_SECRET", "")) >= 32, "runtime_jwt_missing_or_short")
    require(env.get("OPSO_WEB_ENABLED", "") in ("", "false"), "existing_bff_activation_unreviewed")
    require(bool(re.fullmatch(r"[a-f0-9]{40}", commit)), "candidate_revision_invalid")
    # Never decode/reconstruct the URL or rotate a credential in this mode.
    return {**env, "GIT_COMMIT": commit}, runtime_role


def verify_existing_role(app, runtime_role):
    role.role_name(runtime_role)
    statements = ["SET TRANSACTION READ ONLY", "SET LOCAL statement_timeout='5s'", "SET LOCAL lock_timeout='2s'",
                  role.assertion(f"session_user={role.literal(runtime_role)} AND current_user={role.literal(runtime_role)} AND EXISTS(SELECT 1 FROM pg_roles WHERE rolname=current_user AND rolcanlogin AND (rolvaliduntil IS NULL OR rolvaliduntil>now()))", "existing_runtime_identity_invalid"),
                  *role.catalog_guard_sql().splitlines(), *role.privilege_guard_sql(runtime_role).splitlines()]
    # Use the app's current connection, never a new credential or superuser.
    # The transaction contains fixed catalog/privilege assertions only.
    payload = """const {PrismaClient}=require('./src/generated/prisma');
const client=new PrismaClient({log:[]});
async function main(){
 await client.$transaction(async(tx)=>{for(const sql of STATEMENTS) await tx.$executeRawUnsafe(sql);},{timeout:30000});
 await client.$disconnect();process.stdout.write('existing_runtime_read_only_ok');
}
main().catch(async()=>{try{await client.$disconnect();}catch{}process.exitCode=1;});
""".replace("STATEMENTS", json.dumps(statements))
    require(candidate.private_exec(app["Id"], "node", payload=payload.encode(), timeout=40) == b"existing_runtime_read_only_ok", "existing_runtime_read_only_proof_failed")


def predecessor_config(reference, app, database):
    require(set(reference) == {"state", "manifest_sha256"} and bool(re.fullmatch(r"[a-f0-9]{64}", reference["manifest_sha256"])), "predecessor_reference_invalid")
    state = Path(reference["state"])
    previous = load_packet(state, predecessor=True)
    require(role.digest_file(state/"manifest.json") == reference["manifest_sha256"], "predecessor_manifest_changed")
    require(original_hashes() == previous["originals"], "original_compose_or_env_changed")
    require(backup.fingerprint(database) == backup.fingerprint(previous["baseline"]["database"]), "predecessor_database_drift")
    labels = app["Config"].get("Labels") or {}
    directions = {f"{state}/base.json,{state}/{direction}.json": direction for direction in ("forward", "rollback")}
    direction = directions.get(labels.get("com.docker.compose.project.config_files"))
    require(direction is not None and labels.get("com.docker.compose.project.working_dir") == str(PROJECT), "private_compose_source_mismatch")
    before = previous["baseline"]["app"]
    target = json.loads((state/"base.json").read_text())
    if direction == "forward":
        image, env, image_labels = previous["candidate_image"], previous["forward_env"], previous["candidate_image_labels"]
        target["services"]["opsolid"].update(image=image, environment=literal_compose(env))
    else:
        image, env = previous["expected"]["app"]["image"], previous["rollback_env"]
        require(image == before["Image"] and env == candidate.environment_map(before["Config"]["Env"]), "predecessor_rollback_identity_mismatch")
        image_labels = {key: value for key, value in before["Config"]["Labels"].items() if not key.startswith("com.docker.compose.")}
    verify_app(before, app, image, env, image_labels, previous["explicit_labels"])
    config = json.loads(run(compose_command(state, direction, "config")))
    require(config == target, "predecessor_compose_replay_changed")
    load_packet(state, predecessor=True)
    require(role.digest_file(state/"manifest.json") == reference["manifest_sha256"], "predecessor_manifest_changed")
    return config


def prepare_existing(args):
    backup.secure_path(args.expected, private=True, file=True)
    expected = json.loads(args.expected.read_text())
    backup.validate_expected(expected)
    baseline = backup.production_snapshot(expected)
    originals = original_hashes()
    reference = {"state": str(args.current_state), "manifest_sha256": args.current_manifest_sha256}
    config = predecessor_config(reference, baseline["app"], baseline["database"])
    env, runtime_role = existing_environment(baseline["app"], args.commit)
    image = json.loads(run(["image", "inspect", args.candidate_image]))[0]
    candidate.validate_image(image, args.candidate_image, args.commit)
    require(not image["Config"].get("Healthcheck"), "candidate_image_healthcheck_unreviewed")
    verify_existing_role(baseline["app"], runtime_role)
    # No access to the predecessor's candidate-bound role-state artifacts.
    metadata = {"preparation": "existing-runtime-v1", "predecessor": reference, "runtime_role": runtime_role}
    return save_packet(args, expected, baseline, originals, image, config, env, metadata)


READ_PROOF = r"""
const {PrismaClient}=require('./src/generated/prisma');
const client=new PrismaClient({log:[]});
async function run(){
 const response=await fetch('http://127.0.0.1:3000/api/health',{redirect:'manual',signal:AbortSignal.timeout(5000)});
 const body=await response.json();
 if(response.status!==200||body.ok!==true||body.dbOk!==true||body.commit!==(process.env.GIT_COMMIT||'unknown'))throw Error('health');
 const rows=await client.$queryRawUnsafe('SELECT current_user::text AS current_user,session_user::text AS session_user');
 const expected=decodeURIComponent(new URL(process.env.DATABASE_URL).username);
 if(rows.length!==1||rows[0].current_user!==expected||rows[0].session_user!==expected)throw Error('identity');
 await client.$disconnect();process.stdout.write('read_only_app_proof_ok');
}
run().catch(async()=>{try{await client.$disconnect();}catch{}process.exitCode=1;});
"""


def execute_direction(state, snapshot, direction):
    baseline = snapshot["baseline"]
    image = snapshot["candidate_image"] if direction == "forward" else snapshot["expected"]["app"]["image"]
    result = {"ok": False, "stage": "compose_app_only", "direction": direction, "rollback_state": str(state)}
    try:
        run(compose_command(state, direction, "up"), timeout=240)
        result["stage"] = "postflight"
        actual = current_app()
        require(actual is not None, "app_missing_after_compose")
        target_env = snapshot["forward_env"] if direction == "forward" else snapshot["rollback_env"]
        target_labels = snapshot["candidate_image_labels"] if direction == "forward" else {key: value for key, value in baseline["app"]["Config"]["Labels"].items() if not key.startswith("com.docker.compose.")}
        verify_app(baseline["app"], actual, image, target_env, target_labels, snapshot["explicit_labels"])
        require(actual["State"]["Running"] and not actual["State"].get("Restarting") and not actual["State"].get("Paused") and actual["State"].get("Health", {}).get("Status") == "healthy", "app_not_healthy")
        require(candidate.private_exec(actual["Id"], "node", payload=READ_PROOF.encode(), timeout=30) == b"read_only_app_proof_ok", "app_database_read_proof_failed")
        result.update(ok=True, stage="verified", application_recreated=True, app_id=actual["Id"])
    except backup.ProofError as error:
        result["code"] = str(error)
    except BaseException:
        result["code"] = "cutover_interrupted_or_failed"
    try:
        verify_surroundings(snapshot, current_app())
        result.update(database_unchanged=True, other_containers_unchanged=True, original_files_unchanged=True)
    except BaseException as error:
        code = str(error) if isinstance(error, backup.ProofError) else "cutover_postflight_drift"
        if result["ok"]:
            result.update(ok=False, stage="postflight", code=code)
        else:
            result["postflight_code"] = code
    return result


def rollback_preflight(snapshot):
    current = current_app()
    recoverable_app(current, snapshot)
    verify_surroundings(snapshot, current)
    image = snapshot["expected"]["app"]["image"]
    require(json.loads(run(["image", "inspect", image]))[0]["Id"] == image, "rollback_image_missing")


def apply_packet(state, direction, execute):
    require(direction in ("forward", "rollback"), "compose_action_invalid")
    snapshot = load_packet(state)
    if direction == "forward":
        current = current_app()
        verify_surroundings(snapshot, current)
        backup.unchanged(snapshot["expected"], snapshot["baseline"])
        if snapshot.get("preparation") == "existing-runtime-v1":
            predecessor_config(snapshot["predecessor"], current, snapshot["baseline"]["database"])
            environment, runtime_role = existing_environment(current, snapshot["commit"])
            require(environment == snapshot["forward_env"] and runtime_role == snapshot["runtime_role"], "existing_runtime_environment_drift")
            verify_existing_role(current, runtime_role)
        else:
            require("preparation" not in snapshot, "cutover_preparation_unreviewed")
            role_state = Path(snapshot["role_state"])
            for key, digest in snapshot["role_state_hashes"].items():
                backup.secure_path(role_state/key, private=True, file=True)
                require(role.digest_file(role_state/key) == digest, "provisioned_role_state_changed")
        image = snapshot["candidate_image"]
        candidate.validate_image(json.loads(run(["image", "inspect", image]))[0], image, snapshot["commit"])
        old_image = snapshot["expected"]["app"]["image"]
        require(json.loads(run(["image", "inspect", old_image]))[0]["Id"] == old_image, "rollback_image_missing")
    else:
        rollback_preflight(snapshot)
    if not execute:
        return {"ok": True, "stage": "reviewed_packet_ready", "direction": direction, "application_recreated": False}
    result = execute_direction(state, snapshot, direction)
    if direction == "forward" and not result["ok"]:
        rollback = {"ok": False, "stage": "preflight"}
        try:
            rollback_preflight(snapshot)
            rollback = execute_direction(state, snapshot, "rollback")
        except BaseException as error:
            rollback["code"] = str(error) if isinstance(error, backup.ProofError) else "rollback_interrupted_or_failed"
        result.update(rollback_attempted=True, rollback_ok=rollback["ok"], rollback_stage=rollback["stage"],
                      rollback_code=rollback.get("code"), manual_review_required=not rollback["ok"])
    elif direction == "rollback" and not result["ok"]:
        result["manual_review_required"] = True
    record = state/(direction+"-attempt-"+uuid.uuid4().hex[:12]+".json")
    role.write_private(record, result)
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mode", choices=("prepare", "prepare-existing", "apply", "rollback"), default="prepare")
    parser.add_argument("--expected", type=Path)
    parser.add_argument("--role-state", type=Path)
    parser.add_argument("--candidate-image")
    parser.add_argument("--commit")
    parser.add_argument("--state", type=Path)
    parser.add_argument("--current-state", type=Path)
    parser.add_argument("--current-manifest-sha256")
    parser.add_argument("--execute", action="store_true")
    args = parser.parse_args()
    require(sys.platform == "linux" and os.geteuid() == 0, "vps_root_required")
    os.umask(0o077)
    def interrupted(_number, _frame):
        raise backup.ProofError("interrupted")
    signal.signal(signal.SIGTERM, interrupted)
    if args.mode in ("prepare", "prepare-existing"):
        required = (args.expected, args.candidate_image, args.commit)
        required += (args.current_state, args.current_manifest_sha256) if args.mode == "prepare-existing" else (args.role_state,)
        require(all(value is not None for value in required) and not args.execute and args.state is None, "prepare_arguments_invalid")
        require(args.role_state is None if args.mode == "prepare-existing" else args.current_state is None and args.current_manifest_sha256 is None, "prepare_modes_mixed")
        state = prepare_existing(args) if args.mode == "prepare-existing" else prepare(args)
        print(json.dumps({"ok": True, "stage": "private_packet_prepared", "state": str(state), "production_changed": False}))
        return
    require(args.state is not None, "cutover_state_required")
    result = apply_packet(args.state, "forward" if args.mode == "apply" else "rollback", args.execute)
    print(json.dumps(result))
    raise SystemExit(0 if result["ok"] else 1)


if __name__ == "__main__":
    try:
        main()
    except backup.ProofError as error:
        print(json.dumps({"ok": False, "code": str(error)}))
        raise SystemExit(1) from None
    except (Exception, KeyboardInterrupt):
        print(json.dumps({"ok": False, "code": "cutover_operation_failed"}))
        raise SystemExit(1) from None
