# Canonical OpSo web account slice — 2026-09-17

## Scope and state

September20 release checkpoint: PR38 now targets `main` directly. Source `a75aea14afdd1ffbcc1b05344948b2e8fff1f703` passed fresh hosted validation in run35513654483: locked install, Prisma generation, audit, lint, typecheck, BFF/operations tests and production build. The former automatic VPS/database-bootstrap workflow is replaced by hosted validation only; a merge cannot deploy.

The next-release app-only helper now has a reviewed `prepare-existing` mode with25 passing cutover tests. It preserves the entire live environment and existing database connection except `GIT_COMMIT`, verifies the current restricted role in a bounded read-only transaction, and accepts only hash-bound forward or rollback provenance from the current private packet. It does not provision roles or change database permissions. Production BFF activation remains off. The existing live packet's manifest hash was freshly verified as `98fc21caaddbe10548c0621699d3adf189b7fdb21e8f7a05049de34fe1491284`; actual candidate preparation, server read-only role proof and cutover are still pending.

Implemented in isolated branch `cod/opso-canonical-web-account` from `e3936bb875c482620d9d5238b462bc3e8dcf5865`, with the later live OAuth fix `32075c8` and deployment/rollback proof `2e6a4ec` integrated as `a51c6c4` and `f3d6c59`. This implements steps 1–3 of the account contract for new canonical cards. It is not a migration of legacy website accounts/cards and is not evidence of production or two-client acceptance.

The DE/EN/TR page at `/<locale>/opso/account` signs in using the actual VERSO email-code endpoints. It lists that VERSO workspace's cards, creates the first profile card through canonical onboarding, edits profile/privacy fields without replacing existing pages/media, checks the public profile through the preview endpoint, accepts versioned terms explicitly, and publishes a saved revision. The existing mobile client reads the same `GET /cards` collection. No mobile copy job is introduced.

The live preview is explicitly a **profile preview**, not a replacement for the full public website renderer. Website starter templates and additional pages remain in the mobile studio. The web first-card form does not silently resume or replace an existing card, or offer paid capacity. Profile card templates remain constrained by `canCreate` and the canonical Free-card limit. Existing `event_only` visibility is preserved.

## Deployment gate

Default **off**. The OpSolid BFF route returns `503 web_account_unavailable` unless all of the following exist at runtime:

- `OPSO_WEB_ENABLED=true`, set only after release approval below.
- `OPSO_WEB_SESSION_KEY`: a fresh, independent 32-byte random key encoded as canonical base64. Provision through the existing server secret mechanism; never commit, expose in logs, or reuse the legacy auth key.
- `OPSO_WEB_CLIENT_IP_SECRET`: a different 32-byte canonical-base64 key, shared only with the canonical API's auth client-IP verifier. Never reuse the session/JWT/edge-host key.
- `OPSO_WEB_TRUSTED_PROXY=traefik-one-hop`: an explicit assertion that only the reviewed Traefik hop can reach the web process and that it appends the observed client address. Direct public Node ingress, additional proxies or changed forwarding rules require a new topology review before setting this value.

The OpSo marketing CTA is shown only when the same runtime gate is enabled. Both pages evaluate at request time; a secret-free Docker build must not freeze availability. The direct account page truthfully explains when sign-in is unavailable. No fabricated Play/download URL is used: the companion link still goes to the existing `/<locale>/opso#availability` section because the prior download hub returned 404.

**Public-launch gate:** deploy the matching VERSO auth client-IP verifier and configure its dedicated key before enabling this BFF. A centralized BFF otherwise shares the API's OTP IP budget across all users. The sender signs only POST requests to `/api/auth/passwordless/start`, `/api/auth/passwordless/verify`, `/api/auth/passwordless/refresh` and `/api/auth/logout`. Its HMAC payload is `JSON.stringify(['opso-web-client-ip', 1, 'opsolid-web', 'verso-auth', method, exactPath, canonicalIp, unixSeconds])`; the API accepts at most 30 seconds of age or five seconds of forward clock skew. The signature selects only the existing throttle/audit IP; it grants no authentication authority. No browser-supplied proof, authorization or forwarding headers are proxied. Both sides retain HTTPS, bounded requests and the existing auth limits.

The coordinator's sanitized VPS inspection on 2026-09-17 found no OpSolid app host port bindings, no Traefik forwarded-header trust/insecure override, no alternate static/file/proxy-protocol override and no app custom-header middleware. Under that topology, only the rightmost proxy-appended `X-Forwarded-For` address is eligible. This is historical topology evidence, not proof that the feature is enabled. Recheck before activation. Rotate either secret by restarting the web process; the gateway and refresh coalescer are process-local. Distributed deployment needs shared limiter/refresh coordination before scaling.

## Security and data boundary

- Fixed upstream `https://card.opsolid.de/api` and fixed browser origin `https://opsolid.de`. There is no arbitrary target URL/path/header proxy or browser-supplied workspace identity.
- OTP challenge email is bound into the authenticated cookie. Verify and refresh responses must match the expected identity; refresh also preserves workspace identity. A workspace change requires new sign-in.
- Access/refresh credentials are encrypted with AES-256-GCM in the `__Host-opso-web` cookie (Secure, HttpOnly, SameSite=Strict, Path=/, no Domain). Session lifetime is eight hours. Tokens never appear in browser JSON, local/session storage, links, or public previews.
- Every mutation requires the exact Origin, JSON body and session-bound CSRF header. Cross-site fetches are rejected. Unknown actions/methods and oversized or stalled bodies fail closed. Upstream requests reject redirects and use a deadline.
- One refresh and one retry on 401; concurrent refresh calls coalesce. Transient errors preserve the cookie; definitive auth failure clears it. Logout clears the browser session and attempts canonical revocation, reporting honestly if revocation could not be confirmed.
- Full owner rows never reach the browser. The adapter validates workspace/status/visibility/revisions/timestamps and projects a minimal card. Internal access fields, owner IDs and media capability URLs are omitted. Shared workspaces follow the canonical API's workspace membership authorization rather than inventing stricter per-owner semantics.
- Save and publish carry the last expected revision; conflicts remain 409 with bounded recovery details. No silent retry/overwrite on conflicts. Restrictive privacy changes apply on save according to the canonical API. Published links are shown only for live cards whose draft and published visibility allow link access.
- Terms URLs are constructed from the fixed canonical origin and a bounded server version, never navigated from an arbitrary upstream URL. Terms acceptance is a separate explicit action; publishing never auto-accepts.

## Validation

Run with the existing Node 22 runtime:

```text
node --import tsx --test scripts/tests/opso-web-account.test.mts
node node_modules/typescript/bin/tsc --noEmit --incremental false
node node_modules/next/dist/bin/next lint --file src/lib/opso-web/gateway.ts --file src/lib/opso-web/session.ts --file src/lib/opso-web/contracts.ts --file src/content/opso-account.ts --file src/app/api/opso/[action]/route.ts --file src/app/[locale]/opso/account/OpsoAccount.tsx --file src/app/[locale]/opso/account/page.tsx --file src/app/[locale]/opso/page.tsx
node node_modules/next/dist/bin/next build
```

On 2026-09-20 the focused suite passed all 28 tests under Node 22.23.2, covering encrypted/deep-invalid/expired/future/oversized/duplicate cookies, nonrecursive cookie failure, exact Origin/CSRF, OTP identity binding, fixed upstream, workspace isolation, rotating refresh and bounded retry, logout, Free capacity, conflicts, live-status sharing, bounded readiness/terms details, stalled request timeout, oversized response rejection, default-off runtime gate, exact HMAC payload, rightmost proxy-IP selection, forged-header replacement, independent keys and DE/EN/TR key parity. It calls the real adapter with simulated upstream responses; it does not send email or change production data. Scoped lint and full TypeScript checking passed. The independent auth contract/security review found no material code issue.

The local production build generated 397 pages and passed the public source-map check. Real Edge browser acceptance against the built app with synthetic browser API responses covered email-code form entry, first draft creation, contact visibility, public profile preview, explicit terms acceptance, publication/share link, revision-conflict text preservation and overwrite blocking, reload recovery, logout, DE/EN/TR rendering and 390px width without horizontal overflow. This browser fixture validates UI behavior separately from the real BFF adapter tests; it is not real email delivery or mobile synchronization proof. Screenshot inspection exposed inherited dark text in the dark preview card; scoped heading/paragraph colors were corrected for the final candidate. Local artifacts are in `output/playwright/account-finish-20260920/` and are not committed.

Final validation after integrating the live fixes: production build and public source-map check passed again; all 60 imported operations tests and scoped OAuth-page lint passed. Twelve local HTTP checks across DE/EN/TR login/signup pages verified Google-action absence without OAuth configuration and presence when synthetic flags were supplied only to the running server after a secret-free build. No Google provider request was made. Final desktop/mobile screenshots and computed colors confirmed the preview contrast correction, with 390px content width equal to the viewport. Build result, OAuth checks and screenshots are persisted beside the earlier local UI artifacts.

Remaining acceptance before feature enablement: actual email/OTP delivery, two separate accounts, browser cookie behavior on production HTTPS/proxy, real Free capacity and concurrent device editing, and web-created card visibility after ordinary mobile login to that same canonical account. Play availability, custom-domain setup, physical NFC provisioning and legacy-card transfer are separate release gates.
