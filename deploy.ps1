# Retired. Production is no longer deployed by copying the source to the VPS and rebuilding there.
# Release path: README.md "Deployment" and docs/ops/hosted-runtime-image.md (owner-dispatched runtime
# image built from the exact main SHA, then the reviewed app-only cutover).
Write-Error "deploy.ps1 is retired: use the reviewed runtime-image + app-only cutover path (README.md, docs/ops/hosted-runtime-image.md)"
exit 1
