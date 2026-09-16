#!/usr/bin/env python3
"""Prepare/test one fresh runtime login; production provisioning is a separate opt-in.

Modes: plan (read-only), validate (restore protected dump into an isolated target,
create/test new login, rollback synthetic CRUD, destroy target), provision (only
CREATE ROLE+explicit GRANT in one transaction after matching validation proof).
No application cutover, PUBLIC revokes, default grants, owner changes or RLS SQL.
Credentials stay in a fresh root-only server state directory, never argv/stdout.
The reviewed candidate wrapper may call validate_isolated with a callback to run
Prisma/HTTP smoke in the same isolated namespace before cleanup. SQL-only CLI
validation cannot authorize production provisioning.
"""
import argparse
import hashlib
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
import uuid

spec = importlib.util.spec_from_file_location("backup_proof", Path(__file__).with_name("opsolid-backup-restore-proof.py"))
backup = importlib.util.module_from_spec(spec)
spec.loader.exec_module(backup)
require = backup.require

TABLES = tuple(sorted("""users sessions magic_link_tokens card_templates card_orders subscriptions card_views card_leads card_links scan_events card_connections messages card_album_photos saved_cards card_feedback card_actions card_webhooks order_status_history events event_attendees referrals referral_redemptions share_events push_devices user_subscriptions domain_requests voice_billing_plans voice_tenants voice_agents voice_phone_numbers voice_calls voice_call_events voice_business_hours voice_handoff_rules voice_knowledge_base_items voice_appointment_rules voice_integrations voice_notification_configs voice_usage_records voice_test_runs inbox_channels inbox_threads inbox_messages inbox_suggestions inbox_playbooks marketing_consents""".split()))
READ_ONLY = {"card_templates", "voice_billing_plans"}
NO_UPDATE = READ_ONLY | {"domain_requests", "event_attendees", "inbox_suggestions", "order_status_history", "referral_redemptions", "share_events", "voice_call_events"}
DELETE = set("""card_album_photos card_webhooks event_attendees inbox_channels inbox_messages inbox_playbooks magic_link_tokens push_devices saved_cards voice_agents voice_appointment_rules voice_business_hours voice_handoff_rules voice_integrations voice_knowledge_base_items voice_notification_configs voice_tenants""".split())
MATRIX = {table: ["SELECT"] + ([] if table in READ_ONLY else ["INSERT"]) + ([] if table in NO_UPDATE else ["UPDATE"]) + (["DELETE"] if table in DELETE else []) for table in TABLES}
SEQUENCE = "public.card_orders_order_number_seq"


def role_name(value):
    require(bool(re.fullmatch(r"opsolid_runtime_[a-z0-9_]{1,30}", value)), "runtime_role_name_invalid")
    return value


def ident(value):
    require(bool(re.fullmatch(r"[a-z_][a-z0-9_]*", value)), "sql_identifier_invalid")
    return '"' + value + '"'


def literal(value):
    return "'" + value.replace("'", "''") + "'"


def assertion(condition, code):
    return "DO $proof$ BEGIN IF (" + condition + ") IS DISTINCT FROM TRUE THEN RAISE EXCEPTION '" + code + "'; END IF; END $proof$;"


def catalog_guard_sql():
    tables = "ARRAY[" + ",".join(literal(t) for t in TABLES) + "]::text[]"
    return assertion("(SELECT array_agg(relname::text ORDER BY relname) FROM pg_class WHERE relnamespace='public'::regnamespace AND relkind IN ('r','p')) = " + tables, "unreviewed_table_catalog") + "\n" + assertion(
        "pg_get_serial_sequence('public.card_orders','order_number') = " + literal(SEQUENCE) + " AND (SELECT count(*) FROM pg_class WHERE relnamespace='public'::regnamespace AND relkind='S') = 1", "unreviewed_sequence_catalog")


def privilege_guard_sql(role):
    role_name(role)
    r = literal(role)
    checks = [
        assertion(f"EXISTS(SELECT 1 FROM pg_roles WHERE rolname={r} AND NOT (rolsuper OR rolcreatedb OR rolcreaterole OR rolinherit OR rolreplication OR rolbypassrls))", "role_flags_invalid"),
        assertion(f"NOT EXISTS(SELECT 1 FROM pg_auth_members WHERE member={r}::regrole OR roleid={r}::regrole)", "role_membership_invalid"),
        assertion(f"NOT EXISTS(SELECT 1 FROM pg_class WHERE relowner={r}::regrole) AND NOT EXISTS(SELECT 1 FROM pg_namespace WHERE nspowner={r}::regrole) AND NOT EXISTS(SELECT 1 FROM pg_database WHERE datdba={r}::regrole)", "role_ownership_invalid"),
        assertion(f"has_database_privilege({r},current_database(),'CONNECT') AND NOT has_database_privilege({r},current_database(),'CREATE')", "database_privileges_invalid"),
        assertion(f"has_schema_privilege({r},'public','USAGE') AND NOT EXISTS(SELECT 1 FROM pg_namespace WHERE has_schema_privilege({r},oid,'CREATE'))", "schema_create_inherited"),
        assertion(f"NOT EXISTS(SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE p.prosecdef AND n.nspname !~ '^pg_' AND n.nspname<>'information_schema' AND has_function_privilege({r},p.oid,'EXECUTE'))", "security_definer_reachable"),
    ]
    for table, allowed in MATRIX.items():
        for privilege in ("SELECT", "INSERT", "UPDATE", "DELETE", "TRUNCATE", "REFERENCES", "TRIGGER"):
            expected = "true" if privilege in allowed else "false"
            checks.append(assertion(f"has_table_privilege({r},'public.{table}','{privilege}') = {expected} AND NOT has_table_privilege({r},'public.{table}','{privilege} WITH GRANT OPTION')", "effective_table_privilege_mismatch"))
    checks += [assertion(f"has_sequence_privilege({r},'{SEQUENCE}','USAGE') AND NOT has_sequence_privilege({r},'{SEQUENCE}','SELECT') AND NOT has_sequence_privilege({r},'{SEQUENCE}','UPDATE') AND NOT has_sequence_privilege({r},'{SEQUENCE}','USAGE WITH GRANT OPTION')", "effective_sequence_privilege_mismatch")]
    return "\n".join(checks)


def provision_sql(role, password, database):
    role_name(role)
    require(bool(re.fullmatch(r"[A-Za-z0-9_-]{40,100}", password)), "credential_shape_invalid")
    require(database in ("opsolid", "proof_restore"), "database_target_invalid")
    statements = ["BEGIN;", "SET LOCAL log_statement='none';", "SET LOCAL log_duration=off;",
                  "SET LOCAL log_min_duration_statement=-1;", "SET LOCAL log_min_duration_sample=-1;",
                  "SET LOCAL log_min_error_statement='panic';", "SET LOCAL password_encryption='scram-sha-256';",
                  "SET LOCAL statement_timeout='30s';", "SET LOCAL lock_timeout='5s';", catalog_guard_sql(),
                  f"CREATE ROLE {ident(role)} NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS PASSWORD {literal(password)};",
                  f"GRANT CONNECT ON DATABASE {ident(database)} TO {ident(role)};",
                  f"GRANT USAGE ON SCHEMA public TO {ident(role)};"]
    for table, grants in MATRIX.items():
        statements.append(f"GRANT {', '.join(grants)} ON TABLE public.{ident(table)} TO {ident(role)};")
    statements += [f"GRANT USAGE ON SEQUENCE {SEQUENCE} TO {ident(role)};", privilege_guard_sql(role),
                   f"ALTER ROLE {ident(role)} LOGIN;", "COMMIT;"]
    return "\n".join(statements)


def direct_login_test_sql(role):
    role_name(role)
    statements = ["BEGIN;", "SET LOCAL statement_timeout='30s';", "SET LOCAL lock_timeout='5s';",
                  assertion(f"session_user={literal(role)} AND current_user={literal(role)}", "not_direct_runtime_login"), privilege_guard_sql(role)]
    statements += [f"SELECT 1 FROM public.{ident(table)} LIMIT 0;" for table in TABLES]
    statements += [
        "INSERT INTO public.users(id,email,updated_at) VALUES ('runtime_proof_user','runtime-proof@example.invalid',now());",
        "INSERT INTO public.sessions(id,user_id,token_hash,expires_at) VALUES ('runtime_proof_session','runtime_proof_user','runtime_proof_token',now()+interval '1 hour');",
        "INSERT INTO public.card_orders(id,template_id,user_id,contact_name,contact_email,contact_phone,card_data,billing_mode,amount_cents,status,updated_at) SELECT 'runtime_proof_order',id,'runtime_proof_user','Synthetic','runtime-proof@example.invalid','', '{}'::jsonb,'one_time',0,'DRAFT',now() FROM public.card_templates ORDER BY id LIMIT 1;",
        assertion("EXISTS(SELECT 1 FROM public.card_orders WHERE id='runtime_proof_order')", "synthetic_template_missing"),
        "INSERT INTO public.order_status_history(id,order_id,to_status,actor) VALUES ('runtime_proof_history','runtime_proof_order','DRAFT','runtime-proof');",
        "INSERT INTO public.card_links(id,order_id,code,updated_at) VALUES ('runtime_proof_link','runtime_proof_order','runtime_proof_code',now());",
        "INSERT INTO public.saved_cards(id,user_id,card_order_id,updated_at) VALUES ('runtime_proof_saved','runtime_proof_user','runtime_proof_order',now());",
        "UPDATE public.users SET name='Synthetic updated',updated_at=now() WHERE id='runtime_proof_user';",
        "UPDATE public.card_orders SET contact_name='Synthetic updated',updated_at=now() WHERE id='runtime_proof_order';",
        "UPDATE public.sessions SET revoked_at=now() WHERE id='runtime_proof_session';",
        "INSERT INTO public.sessions(id,user_id,token_hash,expires_at) VALUES ('runtime_proof_session_rotated','runtime_proof_user','runtime_proof_token_rotated',now()+interval '1 hour');",
        assertion("(SELECT count(*) FROM public.users u JOIN public.card_orders o ON o.user_id=u.id JOIN public.card_links l ON l.order_id=o.id JOIN public.order_status_history h ON h.order_id=o.id WHERE u.id='runtime_proof_user')=1", "synthetic_relation_read_failed"),
        "DELETE FROM public.saved_cards WHERE id='runtime_proof_saved';",
    ]
    denied = ["CREATE SCHEMA runtime_proof_denied", "CREATE TABLE public.runtime_proof_denied(id int)",
              "CREATE ROLE runtime_proof_denied", "ALTER TABLE public.users ADD COLUMN runtime_proof_denied int",
              "DROP TABLE public.users CASCADE", "TRUNCATE public.users CASCADE",
              "UPDATE public.card_templates SET name=name WHERE false", "UPDATE public.voice_billing_plans SET display_name=display_name WHERE false",
              "INSERT INTO public.card_templates DEFAULT VALUES", "INSERT INTO public.voice_billing_plans DEFAULT VALUES",
              f"SELECT setval('{SEQUENCE}',1)", "SET ROLE proof_owner"]
    for command in denied:
        statements.append("DO $denial$ BEGIN BEGIN EXECUTE " + literal(command) + "; RAISE EXCEPTION 'unexpected_permission'; EXCEPTION WHEN insufficient_privilege THEN NULL; END; END $denial$;")
    statements += ["SELECT 'runtime_sql_proof_ok';", "ROLLBACK;"]
    return "\n".join(statements)


def sql(container, database, user, statement):
    # SQL (including a generated password during provisioning) travels only via
    # stdin, never process arguments, console output or retained SQL files.
    command = backup.DOCKER + backup.pg_exec(container, "psql", "-X", "-qAt", "--no-password", "-v", "ON_ERROR_STOP=1", "-h", "/var/run/postgresql", "-U", user, "-d", database, interactive=True)
    try:
        result = subprocess.run(command, input=statement.encode(), stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, timeout=120)
    except (OSError, subprocess.TimeoutExpired):
        raise backup.ProofError("role_sql_failed") from None
    require(result.returncode == 0, "role_sql_failed")
    return result.stdout.decode().strip()


def digest_file(path):
    value = hashlib.sha256()
    with path.open("rb") as handle:
        for block in iter(lambda: handle.read(backup.MIB), b""):
            value.update(block)
    return value.hexdigest()


def write_private(path, content):
    with path.open("x", encoding="utf-8") as handle:
        json.dump(content, handle, sort_keys=True, indent=2)
    backup.secure_path(path, private=True, file=True)


def candidate_proof(value, image):
    """Accept only finite, successful proof from the reviewed local callback."""
    require(isinstance(value, dict) and set(value) == {"candidate_image", "password_authentication_verified", "application_smoke_verified", "candidate_container_removed"}, "candidate_proof_shape_invalid")
    require(value["candidate_image"] == image and bool(re.fullmatch(r"sha256:[a-f0-9]{64}", image)), "candidate_image_mismatch")
    require(all(value[key] is True for key in ("password_authentication_verified", "application_smoke_verified", "candidate_container_removed")), "candidate_proof_incomplete")
    return dict(value)


def validate_isolated(expected, baseline, backup_report, role, candidate_check=None, candidate_image=None):
    """Restore/test/clean one owned clone; never modify production.

    Optional candidate_check(container_id, credential) runs after rollback SQL.
    credential is an in-memory copy with role/password only. Fixed database and
    local admin are proof_restore/proof_owner. The callback owns isolated SCRAM
    HBA setup and its candidate container, including guarded cleanup on failure.
    It must use the reviewed immutable candidate_image, the clone's network
    namespace, no ports/egress/provider credentials, and return exactly the four
    fields accepted by candidate_proof. It must never print credentials or rows.
    No callback means SQL-only proof with both application/password flags false.
    """
    role_name(role)
    require((candidate_check is None and candidate_image is None) or (callable(candidate_check) and isinstance(candidate_image, str) and bool(re.fullmatch(r"sha256:[a-f0-9]{64}", candidate_image))), "candidate_arguments_invalid")
    report = json.loads(backup_report.read_text())
    require(report.get("ok") and report.get("code") == "verified", "backup_not_verified")
    dump = Path(report["backup"])
    require(dump.is_absolute() and dump.resolve() == dump and dump.is_relative_to(backup.BASE) and dump.name == "opsolid.dump", "backup_path_invalid")
    backup.secure_path(dump, private=True, file=True)
    require(digest_file(dump) == report["sha256"], "backup_checksum_mismatch")
    require(report.get("temporary_container_removed") and report.get("production_unchanged"), "backup_postflight_incomplete")
    token = uuid.uuid4().hex[:24]
    name = "opsolid-restore-proof-" + token
    state = backup.BASE / ("runtime-role-" + token)
    state.mkdir(mode=0o700)
    backup.secure_path(state, private=True)
    credential = {"role": role, "password": secrets.token_urlsafe(48)}
    write_private(state / "credential.json", credential)
    candidate_id = None
    result = {"ok": False, "stage": "isolated_create", "application_smoke_verified": False, "password_authentication_verified": False}
    try:
        db = expected["database"]["id"]
        size = int(backup.query(db, "opsolid", "opsolid", "SELECT pg_database_size(current_database())"))
        import shutil
        available = next(int(line.split()[1])*1024 for line in Path("/proc/meminfo").read_text().splitlines() if line.startswith("MemAvailable:"))
        limits = backup.resources(size, shutil.disk_usage(backup.BASE).free, available)
        uid = int(backup.run(["exec", db, "id", "-u", "postgres"]))
        gid = int(backup.run(["exec", db, "id", "-g", "postgres"]))
        backup.unchanged(expected, baseline)
        create = backup.restore_command(name, token, limits, uid, gid)
        if candidate_check is not None:
            # Command-line -c overrides ALTER SYSTEM. Allow only loopback inside
            # the network-none namespace; host authentication remains reject
            # until the reviewed callback installs its exact SCRAM HBA file.
            require(create.count("listen_addresses=") == 1, "isolated_listen_contract_changed")
            create[create.index("listen_addresses=")] = "listen_addresses=127.0.0.1"
        candidate_id = backup.run(create).decode().strip()
        backup.validate_owned(backup.inspect(candidate_id), candidate_id, name, token, {expected[k]["id"] for k in expected})
        backup.run(["start", candidate_id])
        ready = False
        for _ in range(30):
            try:
                if backup.query(candidate_id, "proof_restore", "proof_owner", "SELECT 1") == "1":
                    ready = True
                    break
            except backup.ProofError:
                pass
            time.sleep(1)
        require(ready, "isolated_database_not_ready")
        result["stage"] = "isolated_restore"
        with dump.open("rb") as handle:
            backup.run(backup.pg_exec(candidate_id, "pg_restore", "--no-password", "-h", "/var/run/postgresql", "-U", "proof_owner", "-d", "proof_restore", "--exit-on-error", "--single-transaction", "--no-owner", "--no-privileges", "--no-tablespaces", interactive=True), stdin=handle, stdout=subprocess.DEVNULL, timeout=660)
        result["stage"] = "isolated_role"
        sql(candidate_id, "proof_restore", "proof_owner", provision_sql(role, credential["password"], "proof_restore"))
        result["stage"] = "direct_login_sql_proof"
        require(sql(candidate_id, "proof_restore", role, direct_login_test_sql(role)) == "runtime_sql_proof_ok", "runtime_proof_output_invalid")
        require(backup.query(candidate_id, "proof_restore", "proof_owner", "SELECT count(*) FROM public.users WHERE id='runtime_proof_user'") == "0", "synthetic_rollback_failed")
        temporary = backup.query(candidate_id, "proof_restore", "proof_owner", f"SELECT has_database_privilege({literal(role)},current_database(),'TEMP')") == "t"
        if candidate_check is not None:
            result["stage"] = "candidate_application_proof"
            backup.validate_owned(backup.inspect(candidate_id), candidate_id, name, token, {expected[k]["id"] for k in expected})
            try:
                proof = candidate_check(candidate_id, dict(credential))
            except BaseException:
                raise backup.ProofError("candidate_application_failed") from None
            result.update(candidate_proof(proof, candidate_image))
        backup.unchanged(expected, baseline)
        result.update(ok=True, stage="validated", direct_login_verified=True, inherited_temp=temporary,
                      backup_sha256=report["sha256"], credential_sha256=digest_file(state / "credential.json"),
                      script_sha256=digest_file(Path(__file__)), expected=expected, role=role)
    except backup.ProofError as error:
        result["code"] = str(error)
    except BaseException:
        result["code"] = "isolated_validation_failed"
    finally:
        if candidate_id:
            try:
                backup.cleanup(candidate_id, name, token, {expected[k]["id"] for k in expected})
                result["temporary_container_removed"] = True
            except BaseException:
                result.update(ok=False, code="owned_container_cleanup_requires_review")
        try:
            backup.unchanged(expected, baseline)
            result["production_unchanged"] = True
        except BaseException:
            result.update(ok=False, code="production_postflight_failed")
        write_private(state / "validation.json", result)
    return state, result


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mode", choices=("plan", "validate", "provision"), default="plan")
    parser.add_argument("--expected", type=Path, required=True)
    parser.add_argument("--role", required=True)
    parser.add_argument("--backup-proof", type=Path)
    parser.add_argument("--state", type=Path)
    parser.add_argument("--candidate-image", help="Required immutable image match for provision; validation callback is supplied by the reviewed Python wrapper")
    args = parser.parse_args()
    require(sys.platform == "linux" and os.geteuid() == 0, "vps_root_required")
    def interrupt(_number, _frame):
        raise backup.ProofError("interrupted")
    signal.signal(signal.SIGTERM, interrupt)
    os.umask(0o077)
    role = role_name(args.role)
    backup.secure_path(args.expected, private=True, file=True)
    expected = json.loads(args.expected.read_text())
    backup.validate_expected(expected)
    baseline = backup.production_snapshot(expected)
    if args.mode == "plan":
        print(json.dumps({"ok": True, "mode": "read_only_plan", "tables": len(TABLES),
                          "granted_select": 46, "granted_insert": 44, "granted_update": 37, "granted_delete": 17,
                          "sequence_usage": 1, "public_revokes": False, "rls_changes": False, "application_cutover": False}))
        return
    if args.mode == "validate":
        require(args.candidate_image is None, "candidate_wrapper_required")
        require(args.backup_proof is not None, "backup_proof_required")
        backup.secure_path(args.backup_proof, private=True, file=True)
        state, result = validate_isolated(expected, baseline, args.backup_proof, role)
        print(json.dumps({"ok": result["ok"], "stage": result["stage"], "code": result.get("code"), "state": str(state), "inherited_temp": result.get("inherited_temp")}))
        raise SystemExit(0 if result["ok"] else 1)
    require(args.state is not None and args.state.is_absolute() and args.state.resolve() == args.state and args.state.is_relative_to(backup.BASE), "validated_state_required")
    backup.secure_path(args.state, private=True)
    for filename in ("validation.json", "credential.json"):
        backup.secure_path(args.state / filename, private=True, file=True)
    validation = json.loads((args.state / "validation.json").read_text())
    credential = json.loads((args.state / "credential.json").read_text())
    require(validation.get("ok") is True and validation.get("direct_login_verified") is True and validation.get("temporary_container_removed") is True and validation.get("production_unchanged") is True, "isolated_proof_required")
    require(isinstance(args.candidate_image, str) and bool(re.fullmatch(r"sha256:[a-f0-9]{64}", args.candidate_image)), "candidate_image_required")
    candidate_proof({key: validation.get(key) for key in ("candidate_image", "password_authentication_verified", "application_smoke_verified", "candidate_container_removed")}, args.candidate_image)
    require(validation["expected"] == expected and validation["role"] == role and credential["role"] == role, "validation_identity_mismatch")
    require(validation["script_sha256"] == digest_file(Path(__file__)) and validation["credential_sha256"] == digest_file(args.state / "credential.json"), "validation_artifact_changed")
    # Fresh role only: CREATE ROLE intentionally fails if it already exists.
    # Root must review/authorize this mode separately; no app/env cutover here.
    sql(expected["database"]["id"], "opsolid", "opsolid", provision_sql(role, credential["password"], "opsolid"))
    backup.unchanged(expected, baseline)
    write_private(args.state / "provisioned.json", {"ok": True, "role": role, "application_cutover": False})
    print(json.dumps({"ok": True, "stage": "role_provisioned", "credential_file": str(args.state / "credential.json"), "application_cutover": False}))


if __name__ == "__main__":
    try:
        main()
    except backup.ProofError as error:
        print(json.dumps({"ok": False, "code": str(error)}))
        raise SystemExit(1) from None
    except (Exception, KeyboardInterrupt):
        print(json.dumps({"ok": False, "code": "role_operation_failed"}))
        raise SystemExit(1) from None
