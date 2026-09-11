# OpSolid release security transition, 11 September 2026

## Exact current target and authority

The user requested publishing OpSolid and continuing the release work. The
prepared photo showcase is PR37/head3bfe7f17. A fresh read-only audit confirms
the live application is still image
`sha256:107624f39a593005f1666db10a4d85a5034baf37e9ecd6186415d70b829df246`,
running healthy as nextjs, not privileged. Its live GIT_COMMIT is unknown.
Compose identity is project `opsolid-website`, service `opsolid`.

The real app-connected database role remains superuser, role/database creator,
bypasses RLS, owns all46 public tables and can TRUNCATE all46. No table enables
RLS. `/var/backups/opsolid` is absent. These facts were refreshed on the VPS;
they are not inferred from old documentation. Only finite metadata is saved
at `output/release-20260911/preflight.json`.

Publishing the site is authorized. Production credentials/permission changes,
copying production records for restore proof and reviewed RLS migrations need
their separately explicit approval. None has been performed in this slice.

## Recovery operation to authorize first

1. Revalidate exact app/database container IDs, image IDs, Compose labels,
   named mounts, free space and database size. Refuse concurrent changes,
   symlinked destinations, a reused test-container name or insufficient space.
2. Create a fresh root-only directory below `/var/backups/opsolid` with umask077.
   Make a custom-format `pg_dump` of only the `opsolid` database using its
   existing local owner connection, with no owner/ACL restoration payload.
   Do not change database objects, application env, roles, cron or old backups.
   Keep dump bytes exclusively on the VPS and validate size/checksum/catalog.
3. Use the already-present exact PostgreSQL16 image
   `sha256:4e6e670bb069649261c9c18031f0aded7bb249a5b6664ddec29c013a89310d50`
   to create one fresh, labelled restore-proof container: network none, no
   ports, no production bind/named volumes, bounded temporary storage and
   explicit resource limits. Disable TCP listening; use only docker-exec/local
   Unix access. No application, mailer, webhook or provider configuration.
4. Restore that dump transactionally with errors stopping the operation.
   Verify schema/constraints and representative read queries inside the
   isolated target. Export only verification results, never record contents.
5. Verify production IDs/configuration stayed unchanged. Remove only the
   owned labelled verification container after exact ID/label checks. Retain
   the protected backup and finite proof. No retention cleanup is included.

This is a concrete operation boundary, not a completed or tested restore.
The local Docker daemon is currently unavailable. No backup/restore operation
has been executed and no current restore evidence is claimed.

## Runtime role transition

Create a separate non-owner application login, not a demotion of the existing
owner. It must have no SUPERUSER, CREATEDB, CREATEROLE, REPLICATION, BYPASSRLS,
owner membership, schema CREATE, DDL or TRUNCATE authority. Keep the existing
owner exclusively for reviewed maintenance. Resolve exact table/sequence
grants from actual route operations and test them against the isolated target
before switching the application's secret reference and restarting only its
service. Generate/store the new credential only in the approved private
server configuration, never in source, terminal output or this document.
Rollback restores the original app reference/image; it must not delete data.

Role separation reduces destructive privileges but does not satisfy row-level
isolation by itself. It is not permission to deploy while the RLS gate is open.

## Row-level access transition

The application uses a global Prisma pool imported by189 files, with no
transaction-local validated identity. Enabling owner-only policies now would
break session bootstrap, public cards, anonymous legacy edit tokens, admin,
Stripe/machine credentials and maintenance jobs. Do not use blanket
`USING(true)` policies or BYPASSRLS as a substitute.

First define those access capabilities and introduce transaction-scoped access.
All protected queries must use the same transaction client that receives the
validated identity. Public card projections must omit edit/account secrets;
authentication bootstrap and trusted service paths need narrowly scoped
entry points. Roll out reviewed policy groups only after two-user denial,
missing-context, pool-reuse/concurrency, legacy-token, unpublished/locked-card,
admin/service and account-lifecycle tests pass. Each production policy revision
requires its exact forward/rollback SQL and explicit approval.

This is cross-cutting access-control work, not a safe website-only toggle.
Current design evidence: `src/lib/prisma.ts`, `src/lib/auth/session.ts`,
`src/lib/auth/require-user.ts`, `src/lib/auth/edit-token.ts`,
`src/lib/auth/require-admin.ts`, `src/app/c/[slug]/page.tsx` and webhook/job routes.

## Application-only publication after the gates

Package only the reviewed committed source with git archive. Build and verify
the image without runtime credentials; no admin/seed/SQL tools in the runner.
Keep the existing Compose env, mounts, network and labels. Use a separate
override changing only the application image and revision and target only
`opsolid` with `--no-deps --no-build --pull never`. Never run the existing
chown/rsync--delete/bootstrap workflow or merge to its automatic deploy branch.
Keep the exact previous image/configuration for rollback. Postflight must
verify image/revision, body `dbOk:true`, DE/EN/TR pages/images/legacy routes,
authentication guards and blocked source-map/optimizer endpoints.

The independent current full-image verdict is NO-GO until these real gates
are satisfied. Local source fixes and photo evidence remain separate.
