#!/usr/bin/env python3
"""VPS-only, opt-in backup and isolated restore. Never run through a local Docker context.

python3 opsolid-backup-restore-proof.py --expected /root/reviewed-inventory.json
python3 opsolid-backup-restore-proof.py --expected /root/reviewed-inventory.json --execute

Default mode performs read-only preconditions and prints a finite command plan.
Execution retains its dump/proof in /var/backups/opsolid, and always attempts
ID+label-guarded cleanup of its ONE temporary container. No retention cleanup.
Errors are fixed codes; command stderr/restore logs and rows are never emitted.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import signal
import shutil
import stat
import subprocess
import sys
import time
import uuid

PG_IMAGE = "sha256:4e6e670bb069649261c9c18031f0aded7bb249a5b6664ddec29c013a89310d50"
BASE = Path("/var/backups/opsolid")
DOCKER = ["docker", "--host", "unix:///var/run/docker.sock"]
LABEL = "de.opsolid.restore-proof"
MIB = 1024 ** 2
GIB = 1024 ** 3
READ_OPTIONS = "-c default_transaction_read_only=on -c statement_timeout=600000 -c lock_timeout=5000"
CATALOG_SQL = """SELECT json_build_object(
 'tables', (SELECT count(*) FROM pg_class WHERE relnamespace='public'::regnamespace AND relkind IN ('r','p')),
 'columns', (SELECT count(*) FROM pg_attribute a JOIN pg_class c ON c.oid=a.attrelid WHERE c.relnamespace='public'::regnamespace AND c.relkind IN ('r','p') AND a.attnum>0 AND NOT a.attisdropped),
 'constraints', (SELECT count(*) FROM pg_constraint WHERE connamespace='public'::regnamespace),
 'indexes', (SELECT count(*) FROM pg_class WHERE relnamespace='public'::regnamespace AND relkind='i'),
 'sequences', (SELECT count(*) FROM pg_class WHERE relnamespace='public'::regnamespace AND relkind='S'),
 'invalid_constraints', (SELECT count(*) FROM pg_constraint WHERE connamespace='public'::regnamespace AND NOT convalidated)
)"""
COUNT_SQL = r"""SELECT format('SELECT count(*) FROM %I.%I;', n.nspname, c.relname)
FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relkind IN ('r','p') ORDER BY c.relname
\gexec
"""


class ProofError(Exception):
    pass


def require(condition, code):
    if not condition:
        raise ProofError(code)


def parse_count_output(output, expected_tables):
    values = output.splitlines()
    require(len(values) == expected_tables and all(re.fullmatch(rb"[0-9]+", value) for value in values), "restored_count_output_invalid")
    return [int(value) for value in values]


def run(args, *, stdin=None, stdout=subprocess.PIPE, timeout=60, file_limit=None):
    """No shell; never include command/output in exceptions or diagnostics."""
    kwargs = {}
    if file_limit is not None:
        import resource
        kwargs["preexec_fn"] = lambda: resource.setrlimit(resource.RLIMIT_FSIZE, (file_limit, file_limit))
    try:
        result = subprocess.run(DOCKER + args, stdin=stdin, stdout=stdout,
                                stderr=subprocess.DEVNULL, timeout=timeout, check=False, **kwargs)
    except (OSError, subprocess.TimeoutExpired):
        raise ProofError("docker_command_failed") from None
    require(result.returncode == 0, "docker_command_failed")
    return result.stdout


def inspect(target):
    return json.loads(run(["inspect", "--type", "container", target]))[0]


def mounts(container):
    return sorted([{"type": m["Type"], "name": m.get("Name"), "source": m["Source"],
                    "destination": m["Destination"], "rw": m["RW"]}
                   for m in container["Mounts"]], key=lambda m: m["destination"])


def validate_expected(expected):
    require(set(expected) == {"app", "database"}, "expected_shape_invalid")
    for key, name, service in [("app", "opsolid-app", "opsolid"), ("database", "opsolid-db", "opsolid-db")]:
        item = expected[key]
        require(re.fullmatch(r"[0-9a-f]{64}", item["id"]), "expected_id_invalid")
        require(re.fullmatch(r"sha256:[0-9a-f]{64}", item["image"]), "expected_image_invalid")
        require(item["name"] == name and item["project"] == "opsolid-website" and item["service"] == service, "expected_identity_invalid")
    require(expected["database"]["image"] == PG_IMAGE, "postgres_image_unreviewed")
    require(expected["app"]["id"] != expected["database"]["id"], "production_ids_overlap")
    require(expected["database"]["mounts"] == [{"type": "volume", "name": "opsolid-website_opsolid_pgdata", "source": "/var/lib/docker/volumes/opsolid-website_opsolid_pgdata/_data", "destination": "/var/lib/postgresql/data", "rw": True}], "expected_database_mount_invalid")
    require(expected["app"]["mounts"] == [{"type": "bind", "name": None, "source": "/var/www/opsolid/uploads", "destination": "/app/public/uploads", "rw": True}], "expected_app_mount_invalid")


def validate_production(actual, expected):
    labels = actual["Config"].get("Labels") or {}
    require(actual["Id"] == expected["id"] and actual["Name"] == "/" + expected["name"] and actual["Image"] == expected["image"], "production_identity_drift")
    require(labels.get("com.docker.compose.project") == expected["project"] and labels.get("com.docker.compose.service") == expected["service"], "production_labels_drift")
    state = actual["State"]
    require(state["Running"] and not state.get("Restarting") and not state.get("Paused") and state.get("Health", {}).get("Status") == "healthy", "production_not_healthy")
    require(not actual["HostConfig"].get("Privileged"), "production_privileged")
    require(mounts(actual) == sorted(expected["mounts"], key=lambda m: m["destination"]), "production_mount_drift")


def fingerprint(container):
    # Contains env/config only transiently in process memory. Export no hash or values.
    value = {k: container[k] for k in ("Id", "Image", "Config", "HostConfig", "Mounts")}
    value["networks"] = container["NetworkSettings"]["Networks"]
    value["started"] = container["State"]["StartedAt"]
    return hashlib.sha256(json.dumps(value, sort_keys=True).encode()).digest()


def production_snapshot(expected):
    result = {}
    for key in ("app", "database"):
        actual = inspect(expected[key]["id"])
        validate_production(actual, expected[key])
        result[key] = actual
    return result


def unchanged(expected, baseline):
    current = production_snapshot(expected)
    require(all(fingerprint(current[k]) == fingerprint(baseline[k]) for k in baseline), "production_configuration_changed")


def secure_path(path, *, private=False, file=False):
    require(path.is_absolute(), "path_not_absolute")
    for parent in reversed([path, *path.parents]):
        info = parent.lstat()
        require(not stat.S_ISLNK(info.st_mode) and info.st_uid == 0, "unsafe_path_owner_or_symlink")
        require(not (stat.S_IMODE(info.st_mode) & (0o077 if private and parent == path else 0o022)), "unsafe_path_permissions")
        require(stat.S_ISREG(info.st_mode) if file and parent == path else stat.S_ISDIR(info.st_mode), "unsafe_path_type")
        if file and parent == path:
            require(info.st_nlink == 1, "unsafe_file_links")


def resources(database_bytes, free_bytes, available_memory):
    require(database_bytes > 0, "database_size_invalid")
    data_bytes = max(512 * MIB, ((3 * database_bytes + 64 * MIB + MIB - 1) // MIB) * MIB)
    require(data_bytes <= 2 * GIB, "database_exceeds_proof_limit")
    memory_bytes = data_bytes + 256 * MIB
    require(free_bytes >= max(2 * GIB, 3 * database_bytes + GIB), "insufficient_disk_space")
    require(available_memory >= memory_bytes + GIB, "insufficient_memory")
    return {"data": data_bytes, "memory": memory_bytes, "dump_limit": max(256 * MIB, 2 * database_bytes)}


def pg_exec(container, program, *args, readonly=False, interactive=False):
    command = ["exec"] + (["-i"] if interactive else [])
    command += ["--env", "PGCONNECT_TIMEOUT=5"]
    if readonly:
        command += ["--env", "PGOPTIONS=" + READ_OPTIONS]
    return command + [container, program, *args]


def query(container, database, user, sql):
    command = pg_exec(container, "psql", "-X", "-qAt", "--no-password", "-v", "ON_ERROR_STOP=1", "-h", "/var/run/postgresql", "-U", user, "-d", database, "-c", sql, readonly=True)
    return run(command, timeout=660).decode().strip()


def restore_command(name, token, limits, uid, gid):
    require(re.fullmatch(r"opsolid-restore-proof-[a-f0-9]{24}", name) and name.endswith(token), "restore_name_invalid")
    require(isinstance(uid, int) and isinstance(gid, int) and uid > 0 and gid > 0, "restore_uid_invalid")
    return ["create", "--name", name, "--pull", "never", "--label", LABEL + "=" + token,
            "--network", "none", "--restart", "no", "--log-driver", "none", "--read-only",
            "--cap-drop", "ALL", "--security-opt", "no-new-privileges:true", "--user", f"{uid}:{gid}",
            "--cpus", "1", "--pids-limit", "128", "--memory", str(limits["memory"]),
            "--memory-swap", str(limits["memory"]), "--shm-size", str(64 * MIB),
            "--tmpfs", f"/var/lib/postgresql/data:rw,noexec,nosuid,nodev,size={limits['data']},mode=0700,uid={uid},gid={gid}",
            "--tmpfs", f"/var/run/postgresql:rw,noexec,nosuid,nodev,size={16*MIB},mode=0700,uid={uid},gid={gid}",
            "--tmpfs", f"/tmp:rw,noexec,nosuid,nodev,size={16*MIB},mode=1777",
            "--env", "PGDATA=/var/lib/postgresql/data/pgdata", "--env", "POSTGRES_USER=proof_owner",
            "--env", "POSTGRES_DB=proof_restore", "--env", "POSTGRES_HOST_AUTH_METHOD=trust",
            "--env", "POSTGRES_INITDB_ARGS=--auth-local=trust --auth-host=reject",
            PG_IMAGE, "postgres", "-c", "listen_addresses=", "-c", "unix_socket_directories=/var/run/postgresql",
            "-c", "max_connections=10", "-c", "shared_buffers=64MB", "-c", "maintenance_work_mem=64MB",
            "-c", "log_statement=none", "-c", "log_min_messages=panic", "-c", "log_min_error_statement=panic"]


def validate_owned(container, owned_id, name, token, production_ids):
    require(owned_id not in production_ids and re.fullmatch(r"[a-f0-9]{64}", owned_id), "cleanup_id_invalid")
    require(container["Id"] == owned_id and container["Name"] == "/" + name and container["Image"] == PG_IMAGE, "cleanup_identity_mismatch")
    labels = container["Config"].get("Labels") or {}
    require(labels.get(LABEL) == token and not any(k.startswith("com.docker.compose.") for k in labels), "cleanup_labels_mismatch")
    host = container["HostConfig"]
    require(host.get("NetworkMode") == "none" and not host.get("PortBindings") and not host.get("Binds") and not host.get("Mounts") and not host.get("VolumesFrom"), "restore_boundary_violation")
    require(not container["Mounts"] or all(m["Type"] == "tmpfs" for m in container["Mounts"]), "restore_has_persistent_mount")
    require(set(host.get("Tmpfs", {})) == {"/var/lib/postgresql/data", "/var/run/postgresql", "/tmp"}, "restore_tmpfs_mismatch")
    require(host.get("ReadonlyRootfs") and not host.get("Privileged") and host.get("LogConfig", {}).get("Type") == "none", "restore_security_mismatch")
    require(host.get("Memory", 0) > 0 and host.get("MemorySwap") == host["Memory"] and host.get("PidsLimit") == 128 and host.get("NanoCpus") == 1_000_000_000, "restore_resource_mismatch")
    require("ALL" in host.get("CapDrop", []) and not host.get("CapAdd") and "no-new-privileges:true" in host.get("SecurityOpt", []), "restore_capabilities_mismatch")
    require(re.fullmatch(r"[1-9][0-9]*:[1-9][0-9]*", container["Config"].get("User", "")), "restore_user_invalid")


def cleanup(owned_id, name, token, production_ids):
    validate_owned(inspect(owned_id), owned_id, name, token, production_ids)
    run(["rm", "--force", owned_id])


def execute(expected, baseline, limits, catalog, uid, gid):
    import fcntl
    require(BASE.parent.is_dir(), "backup_parent_missing")
    secure_path(BASE.parent)
    if not BASE.exists():
        BASE.mkdir(mode=0o700)
    secure_path(BASE, private=True)
    lock_fd = os.open(BASE / ".restore-proof.lock", os.O_WRONLY | os.O_CREAT | os.O_NOFOLLOW, 0o600)
    lock = os.fdopen(lock_fd, "wb")
    secure_path(BASE / ".restore-proof.lock", private=True, file=True)
    try:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except BlockingIOError:
        lock.close()
        raise ProofError("another_restore_proof_running") from None
    token = uuid.uuid4().hex[:24]
    name = "opsolid-restore-proof-" + token
    folder = BASE / (time.strftime("%Y%m%dT%H%M%SZ", time.gmtime()) + "-" + token)
    owned_id = None
    proof = {"ok": False, "code": "not_completed", "stage": "pre_dump", "production_unchanged": False, "temporary_container_removed": False}
    try:
        require(not run(["container", "ls", "-a", "--filter", "name=^/" + name + "$", "--format", "{{.ID}}"]), "restore_name_exists")
        folder.mkdir(mode=0o700)
        secure_path(folder, private=True)
        unchanged(expected, baseline)
        dump = folder / "opsolid.dump"
        fd = os.open(dump, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600)
        proof["stage"] = "dump"
        with os.fdopen(fd, "wb") as output:
            run(pg_exec(expected["database"]["id"], "pg_dump", "--no-password", "-h", "/var/run/postgresql", "-U", "opsolid", "-d", "opsolid", "--format=custom", "--no-owner", "--no-privileges", "--no-tablespaces", "--lock-wait-timeout=5s", readonly=True), stdout=output, timeout=660, file_limit=limits["dump_limit"])
            output.flush()
            os.fsync(output.fileno())
        secure_path(dump, private=True, file=True)
        require(1024 <= dump.stat().st_size <= limits["dump_limit"], "dump_size_invalid")
        with dump.open("rb") as data:
            require(data.read(5) == b"PGDMP", "dump_format_invalid")
            data.seek(0)
            checksum = hashlib.sha256()
            for block in iter(lambda: data.read(MIB), b""):
                checksum.update(block)
            digest = checksum.hexdigest()
        proof.update(backup=str(dump), dump_bytes=dump.stat().st_size, sha256=digest)
        unchanged(expected, baseline)
        proof["stage"] = "isolated_create"
        owned_id = run(restore_command(name, token, limits, uid, gid)).decode().strip()
        validate_owned(inspect(owned_id), owned_id, name, token, {expected[k]["id"] for k in ("app", "database")})
        run(["start", owned_id])
        ready = False
        for _ in range(30):
            try:
                if query(owned_id, "proof_restore", "proof_owner", "SELECT 1") == "1":
                    ready = True
                    break
            except ProofError:
                pass
            time.sleep(1)
        require(ready, "restore_database_not_ready")
        with dump.open("rb") as data:
            listing = run(pg_exec(owned_id, "pg_restore", "--list", interactive=True), stdin=data, timeout=60)
        entries = sum(1 for line in listing.splitlines() if line and not line.startswith(b";"))
        require(entries > 0, "dump_catalog_empty")
        del listing
        proof["stage"] = "isolated_restore"
        with dump.open("rb") as data:
            run(pg_exec(owned_id, "pg_restore", "--no-password", "-h", "/var/run/postgresql", "-U", "proof_owner", "-d", "proof_restore", "--exit-on-error", "--single-transaction", "--no-owner", "--no-privileges", "--no-tablespaces", interactive=True), stdin=data, stdout=subprocess.DEVNULL, timeout=660)
        restored = json.loads(query(owned_id, "proof_restore", "proof_owner", CATALOG_SQL))
        require(restored == catalog and restored["tables"] > 0, "restored_catalog_mismatch")
        # Only COUNT(*) outputs leave the isolated target. No names/rows/logs.
        command = pg_exec(owned_id, "psql", "-X", "-qAt", "--no-password", "-v", "ON_ERROR_STOP=1", "-h", "/var/run/postgresql", "-U", "proof_owner", "-d", "proof_restore", readonly=True, interactive=True)
        # subprocess stdin needs a real descriptor; the small fixed SQL is a
        # root-only local file, distinct from data and retained with the proof.
        sql_file = folder / "count-proof.sql"
        with sql_file.open("x", encoding="utf-8") as handle:
            handle.write(COUNT_SQL)
        with sql_file.open("rb") as handle:
            proof["stage"] = "isolated_counts"
            counts = parse_count_output(run(command, stdin=handle, timeout=660), catalog["tables"])
        require(len(counts) == catalog["tables"] and all(value >= 0 for value in counts), "restored_counts_invalid")
        unchanged(expected, baseline)
        require(json.loads(query(expected["database"]["id"], "opsolid", "opsolid", CATALOG_SQL)) == catalog, "production_catalog_changed")
        proof.update(ok=True, code="verified", catalog=catalog, archive_entries=entries,
                     counted_tables=len(counts), restored_rows=sum(counts), production_unchanged=True, stage="verified")
    except ProofError as error:
        proof["code"] = str(error)
    except BaseException:
        proof["code"] = "operation_interrupted_or_failed"
    finally:
        if owned_id:
            try:
                cleanup(owned_id, name, token, {expected[k]["id"] for k in ("app", "database")})
                proof["temporary_container_removed"] = True
            except BaseException:
                proof.update(ok=False, code="owned_container_cleanup_requires_review")
        try:
            unchanged(expected, baseline)
            proof["production_unchanged"] = True
        except BaseException:
            proof.update(ok=False, code="production_postflight_failed", production_unchanged=False)
        if folder.is_dir():
            with (folder / "proof.json").open("x", encoding="utf-8") as handle:
                json.dump(proof, handle, sort_keys=True, indent=2)
        lock.close()
    return proof


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--expected", type=Path, required=True)
    parser.add_argument("--execute", action="store_true")
    args = parser.parse_args()
    require(sys.platform == "linux" and os.geteuid() == 0, "vps_root_required")
    def interrupted(_signum, _frame):
        raise ProofError("interrupted")
    signal.signal(signal.SIGTERM, interrupted)
    os.umask(0o077)
    secure_path(args.expected, private=True, file=True)
    expected = json.loads(args.expected.read_text())
    validate_expected(expected)
    baseline = production_snapshot(expected)
    db = baseline["database"]
    env = dict(item.split("=", 1) for item in db["Config"].get("Env", []) if "=" in item)
    require(env.get("POSTGRES_USER") == "opsolid" and env.get("POSTGRES_DB") == "opsolid", "database_local_identity_mismatch")
    require(json.loads(run(["image", "inspect", PG_IMAGE]))[0]["Id"] == PG_IMAGE, "local_image_mismatch")
    version = int(query(db["Id"], "opsolid", "opsolid", "SHOW server_version_num"))
    require(160000 <= version < 170000, "postgres_version_mismatch")
    size = int(query(db["Id"], "opsolid", "opsolid", "SELECT pg_database_size(current_database())"))
    catalog = json.loads(query(db["Id"], "opsolid", "opsolid", CATALOG_SQL))
    available = next(int(line.split()[1]) * 1024 for line in Path("/proc/meminfo").read_text().splitlines() if line.startswith("MemAvailable:"))
    secure_path(BASE.parent)
    limits = resources(size, shutil.disk_usage(BASE.parent).free, available)
    uid = int(run(["exec", db["Id"], "id", "-u", "postgres"]))
    gid = int(run(["exec", db["Id"], "id", "-g", "postgres"]))
    if not args.execute:
        print(json.dumps({"ok": True, "mode": "read_only_plan", "database_bytes": size, "catalog": catalog,
                          "resources": limits, "restore_create": DOCKER + restore_command("opsolid-restore-proof-" + "0"*24, "0"*24, limits, uid, gid),
                          "backup_root": str(BASE), "retains_backup": True, "cleans_owned_container": True}))
        return
    proof = execute(expected, baseline, limits, catalog, uid, gid)
    print(json.dumps(proof, sort_keys=True))
    if not proof["ok"]:
        raise SystemExit(1)


if __name__ == "__main__":
    try:
        main()
    except ProofError as error:
        print(json.dumps({"ok": False, "code": str(error)}))
        raise SystemExit(1) from None
    except KeyboardInterrupt:
        print(json.dumps({"ok": False, "code": "interrupted"}))
        raise SystemExit(1) from None
    except Exception:
        print(json.dumps({"ok": False, "code": "preflight_failed"}))
        raise SystemExit(1) from None
