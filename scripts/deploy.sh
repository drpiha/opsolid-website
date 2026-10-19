#!/usr/bin/env bash
# RETIRED. This script used to tar the local working tree, unpack it into
# /opt/opsolid-website on the VPS and run `docker compose up -d --build`
# there. That path is no longer allowed: the live app runs from a reviewed,
# private app-only cutover packet, and the cutover script refuses to continue
# once /opt/opsolid-website/docker-compose.yml or .env differ from the
# originals recorded in that packet. A rebuild on the VPS would also break the
# rollback chain.
#
# Release path: README.md "Deployment" and docs/ops/hosted-runtime-image.md.

echo "scripts/deploy.sh is retired: no source sync and no rebuild on the VPS." >&2
echo "Release via the owner-dispatched build-runtime-image.yml artifact and the" >&2
echo "reviewed app-only cutover (scripts/ops/opsolid-app-cutover.py)." >&2
echo "See README.md (Deployment) and docs/ops/hosted-runtime-image.md." >&2
exit 1
