# =============================================================================
# OpSolid Website — Multi-stage build for Next.js 14 (standalone output).
# Mirrors the /opt/kutasia pattern on the same VPS, adapted to npm + Prisma 6.
# =============================================================================

# --- Stage 1: deps -----------------------------------------------------------
FROM node:22-alpine AS deps
# python3 + make + g++ are required to compile argon2's native addon during
# `npm ci`. Without them the node-pre-gyp fallback source build fails and
# argon2 is silently absent, causing password hash/verify to throw 500 at
# runtime. These tools are only needed in the build stage — the compiled
# .node binary is copied forward into the runner via the standalone trace,
# so the final image stays minimal.
RUN apk add --no-cache libc6-compat openssl python3 make g++
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# --- Stage 2: builder --------------------------------------------------------
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# --- Stage 3: runner (minimal) -----------------------------------------------
FROM node:22-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Next.js standalone output includes a minimal server + only the deps it uses.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# The generated Prisma client is required at runtime (imported from
# @/generated/prisma). Standalone output *usually* picks it up via the trace,
# but we copy it explicitly to be safe.
COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated

# Ship the raw SQL files alongside the app so the host-side db-bootstrap.sh
# can `docker cp` them into the db container at deploy time (no Prisma CLI
# in the runtime image → no `effect` module crash on boot).
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Ship operational scripts (seed-admin, seed-templates, etc.) so operators
# can run them via `docker exec opsolid-app npx tsx scripts/<name>.ts`.
# These are not on the request path; they're tools for granting admin,
# seeding fixtures, anonymising PII, etc.
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=nextjs:nodejs /app/src/lib ./src/lib

USER nextjs
EXPOSE 3000

# Pure Next.js start. Schema bootstrap + seed is now a one-shot host step
# (see deploy/hostinger/db-bootstrap.sh) rather than on every container boot,
# which (a) eliminates the `Cannot find module 'effect'` crash from Prisma's
# CLI runtime, (b) speeds up restart, and (c) keeps schema changes auditable
# instead of magically running on reboot.
CMD ["node", "server.js"]
