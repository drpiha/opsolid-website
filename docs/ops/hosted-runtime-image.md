# Hosted runtime image artifact

The manual **Build runtime image (artifact only)** workflow builds the committed
Dockerfile away from the production VPS. It cannot deploy, connect over SSH,
publish to a registry, read production credentials, or change a database.
The existing source-verification workflow keeps production execution disabled.
Relevant pull requests and main pushes run a separate source-only contract job
in this workflow. That job has no Docker, artifact or Actions API access.

After the exact main push passes **Verify web source (production disabled)**,
the repository owner dispatches `build-runtime-image.yml` on `main`, with the
full current main SHA as `commit`. Both actor and rerun actor must be the owner.
The dispatch SHA, requested SHA and read-only GitHub main ref must agree. The
newest canonical verification push run for that same SHA must be complete and
successful; an older green run cannot override a newer failure or running job.

The hosted Linux build uses a deterministic LF `git archive`, the unchanged
Dockerfile, linux/amd64, an exact OCI revision label, a 30-minute build limit,
6 GiB memory without swap and two CPUs. No API token enters the Docker context,
build arguments or child environment. The image is saved without registry push.

The three-day artifact is named
`opsolid-image-<commit>-<run-id>-<attempt>` and contains exactly:

- `image.tar.gz`: at most 2 GiB, decompressing to at most 4 GiB
- `metadata.json`: schemaVersion 1, at most 8,192 bytes; source/context/Dockerfile
  hashes, repository identity, build and verification run identities, immutable
  image ID/platform/size and compressed archive hash/size
- `SHA256SUMS`: hashes of those two files only

Receiving is a separate reviewed operation. Before Docker load, authenticate
the exact successful owner workflow run/attempt and artifact ID; hard-fail on
any GitHub outer artifact digest, ZIP shape, inner hash, source or image metadata
mismatch. Recompute the context hash with
`git -c core.autocrlf=false archive --format=tar <commit>` and the Dockerfile hash
from its raw Git blob. Bound decompression and validate Docker archive contents.
After loading, verify the image ID, platform and OCI revision again, then run
the existing image hygiene and private `prepare-existing`/dry-run checks.
Only a separately reviewed app-only cutover can activate the resulting packet.

The failed VPS build evidence remains private and unchanged. This workflow does
not reuse the failed build or convert hosted source tests into deployment proof.
