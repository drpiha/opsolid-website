# =============================================================================
# OpSolid Website — Multi-stage build for Next.js 14 (standalone output).
# Mirrors the /opt/kutasia pattern on the same VPS, adapted to npm + Prisma 6.
# =============================================================================

# --- Stage 1: deps -----------------------------------------------------------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
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

# Prisma needs its CLI + schema at runtime to run migrate-deploy on boot.
# Standalone doesn't include devDependencies, so copy the CLI binary too.
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated

USER nextjs
EXPOSE 3000

# Run pending migrations (no-op if already applied), seed templates,
# then start the Next.js server.
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy || node_modules/.bin/prisma db push --accept-data-loss; node_modules/.bin/prisma db seed || true; node server.js"]
