import { createHash } from "node:crypto";
import { z } from "zod";
import { objectValue, opsoDraft, opsoLocale, opsoNewCard, type OpsoCard, type OpsoIdentity, type OpsoTerms } from "./contracts";
import { anonymousSession, csrfMatches, openSession, readSessionCookie, sealSession, sessionCookie, SESSION_SECONDS, type OpsoSession } from "./session";
import { appendedClientIp, authClientIpHeaders } from "./auth-ip-proof";

// This is deliberately a fixed contract adapter, never a general-purpose proxy.
export const OPSO_API = "https://card.opsolid.de/api";
const idSchema = z.string().regex(/^[A-Za-z0-9_-]{1,128}$/);
const emailSchema = z.string().trim().toLowerCase().email().max(254);
const identitySchema = z.object({ id: idSchema, email: emailSchema, name: z.string().max(300).nullable().optional(), workspaceId: idSchema });
const tokenSchema = z.object({ access: z.string().min(1).max(1800), refresh: z.string().min(1).max(1800), user: identitySchema });
type Auth = NonNullable<OpsoSession["auth"]>;
type Config = { key: Buffer; clientIpSecret: Buffer; browserOrigin: string; fetch?: typeof fetch; now?: () => number };
class Failure extends Error { constructor(readonly status: number, readonly code: string, readonly details: Record<string, unknown> = {}, readonly retryAfter?: number) { super(code); } }
const knownErrors = new Set(["card_limit", "published_card_limit", "onboarding_card_exists", "draft_revision_conflict", "card_changed_elsewhere", "terms_acceptance_required", "invalid_card_localization", "invalid_page_document", "page_document_downgrade_not_allowed", "invalid_localized_page_document", "page_blocks_not_ready", "page_pages_not_ready", "onboarding_locale_conflict"]);

async function limitedJson(response: Response | Request, limit: number): Promise<unknown> {
  const size = response.headers.get("content-length");
  if (size && Number(size) > limit) throw new Failure(413, "request_too_large");
  const reader = response.body?.getReader();
  if (!reader) throw new Failure(400, "invalid_request");
  const chunks: Uint8Array[] = []; let total = 0;
  // A reader deadline also covers a chunked request which never finishes.
  let expired = false;
  const timeout = setTimeout(() => { expired = true; void reader.cancel().catch(() => {}); }, 10_000);
  try {
    for (;;) {
      const next = await reader.read(); if (next.done) break;
      total += next.value.length;
      if (total > limit) { await reader.cancel(); throw new Failure(413, "request_too_large"); }
      chunks.push(next.value);
    }
    if (expired) throw new Failure(408, "request_timeout");
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch (error) { if (error instanceof Failure) throw error; throw new Failure(400, "invalid_request"); }
  finally { clearTimeout(timeout); reader.releaseLock(); }
}
function parse<T>(schema: z.ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body); if (!result.success) throw new Failure(400, "invalid_request"); return result.data;
}
function text(value: unknown, max: number): string { return typeof value === "string" ? value.slice(0, max) : ""; }
function json(body: unknown, status = 200, cookie?: string, retryAfter?: number): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store, max-age=0", "Pragma": "no-cache", "Vary": "Cookie, Origin", "X-Content-Type-Options": "nosniff", ...(cookie ? { "Set-Cookie": cookie } : {}), ...(status === 429 ? { "Retry-After": String(retryAfter ?? 900) } : {}) } });
}
function errorDetails(code: string, value: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const numeric = code === "draft_revision_conflict" ? ["expectedRevision", "actualRevision"] : ["card_limit", "published_card_limit"].includes(code) ? ["current", "limit"] : [];
  for (const key of numeric) if (Number.isSafeInteger(value[key]) && (value[key] as number) >= 0) result[key] = value[key];
  if (code === "onboarding_card_exists" && value.action === "open_studio") result.action = "open_studio";
  if (code === "terms_acceptance_required" && typeof value.version === "string" && /^[A-Za-z0-9._-]{1,40}$/.test(value.version)) {
    result.version = value.version; result.documentUrl = `https://card.opsolid.de/legal/ugc-terms-community-rules/${encodeURIComponent(value.version)}.txt`;
  }
  const field = ({ page_blocks_not_ready: "blocks", page_pages_not_ready: "pages", invalid_localized_page_document: "documents" } as Record<string, string>)[code];
  if (field && Array.isArray(value[field])) result[field] = (value[field] as unknown[]).slice(0, 30).map((item) => {
    const row = objectValue(item); const entry: Record<string, string> = {};
    for (const key of ["id", "kind", "missing", "locale", "pageId", "pageSlug", "breakpoint", "reason", "fieldPath"]) if (typeof row[key] === "string") entry[key] = (row[key] as string).slice(0, 160);
    return entry;
  });
  return result;
}
function projectIdentity(value: unknown): OpsoIdentity {
  const user = parse(identitySchema, value); return { ...user, name: user.name ?? null };
}
function projectCard(value: unknown, user: OpsoIdentity): OpsoCard {
  const row = objectValue(value);
  const valid = z.object({ id: idSchema, workspaceId: idSchema, slug: z.string().regex(/^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/), status: z.enum(["draft", "live", "archived"]), visibility: z.enum(["public", "unlisted", "private", "event_only"]), publishedVisibility: z.enum(["public", "unlisted", "private", "event_only"]), draftRevision: z.number().int().nonnegative().safe(), publishedRevision: z.number().int().nonnegative().safe(), discoverable: z.boolean(), indexable: z.boolean(), templateId: idSchema.nullable(), updatedAt: z.string().datetime() }).safeParse(row);
  if (!valid.success || row.workspaceId !== user.workspaceId) throw new Failure(502, "invalid_upstream_response");
  const content = objectValue(row.content);
  const locale = opsoLocale.safeParse(content.defaultLocale);
  const visibility = text(row.visibility, 30);
  return {
    id: row.id as string, slug: text(row.slug, 128), status: row.status === "live" ? "published" : text(row.status, 30), visibility,
    draftRevision: row.draftRevision as number, publishedRevision: typeof row.publishedRevision === "number" ? row.publishedRevision : 0,
    url: row.status === "live" && ["public", "unlisted"].includes(visibility) && ["public", "unlisted"].includes(String(row.publishedVisibility)) ? `https://opso.cc/${encodeURIComponent(String(row.slug))}` : null,
    profile: { name: text(content.name, 120), role: text(content.role, 120), company: text(content.company, 160), email: text(content.email, 254), phone: text(content.phone, 40), location: text(content.location, 160) },
    cardLocale: locale.success ? locale.data : "en",
    privacy: { discoverable: row.discoverable === true, indexable: row.indexable === true, showEmail: content.showEmail === true, showPhone: content.showPhone === true },
    templateId: typeof row.templateId === "string" ? row.templateId : null, updatedAt: typeof row.updatedAt === "string" ? row.updatedAt : null,
  };
}
function projectTerms(value: unknown): OpsoTerms {
  const terms = objectValue(value);
  if (typeof terms.accepted !== "boolean" || typeof terms.version !== "string" || !/^[A-Za-z0-9._-]{1,40}$/.test(terms.version)) throw new Failure(502, "invalid_upstream_response");
  return { accepted: terms.accepted, version: terms.version, documentUrl: `https://card.opsolid.de/legal/ugc-terms-community-rules/${encodeURIComponent(terms.version)}.txt` };
}

export function createOpsoWebGateway(config: Config) {
  const fetcher = config.fetch ?? fetch; const now = config.now ?? Date.now;
  const origin = new URL(config.browserOrigin).origin;
  const buckets = new Map<string, { count: number; expires: number }>();
  const refreshes = new Map<string, { promise: Promise<Auth>; expires: number }>();
  function rate(key: string, max: number, period = 60_000) {
    const time = now();
    buckets.forEach((bucket, k) => { if (bucket.expires <= time) buckets.delete(k); });
    let bucket = buckets.get(key);
    if (!bucket) { if (buckets.size >= 10_000) throw new Failure(429, "rate_limited"); bucket = { count: 0, expires: time + period }; buckets.set(key, bucket); }
    if (++bucket.count > max) throw new Failure(429, "rate_limited");
  }
  async function upstream(path: string, method = "GET", body?: unknown, access?: string, clientIp?: string): Promise<unknown> {
    let response: Response;
    try {
      const proof = path.startsWith("/auth/") ? authClientIpHeaders(config.clientIpSecret, clientIp ?? "", method, `/api${path}`, now()) : {};
      response = await fetcher(`${OPSO_API}${path}`, { method, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10_000), headers: { Accept: "application/json", "User-Agent": "OpSo-Web/1", ...proof, ...(body === undefined ? {} : { "Content-Type": "application/json" }), ...(access ? { Authorization: `Bearer ${access}` } : {}) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    } catch { throw new Failure(503, "upstream_unavailable"); }
    let result: unknown;
    try { result = await limitedJson(response, 2 * 1024 * 1024); } catch { throw new Failure(502, "invalid_upstream_response"); }
    if (!response.ok) {
      const error = objectValue(result); const code = error.code ?? error.error;
      const safeCode = typeof code === "string" && knownErrors.has(code) ? code : ({ 400: "invalid_request", 401: "authentication_required", 403: "access_denied", 404: "not_found", 409: "conflict", 429: "rate_limited" }[response.status] ?? "upstream_unavailable");
      const retry = Number(response.headers.get("retry-after"));
      throw new Failure([400, 401, 403, 404, 409, 429].includes(response.status) ? response.status : 503, safeCode, errorDetails(safeCode, error), retry > 0 && retry <= 3600 ? Math.ceil(retry) : undefined);
    }
    return result;
  }
  function authResult(value: unknown): Auth {
    const result = tokenSchema.safeParse(value);
    if (!result.success) throw new Failure(502, "invalid_upstream_response");
    const auth = { access: result.data.access, refresh: result.data.refresh, user: projectIdentity(result.data.user) };
    try { sealSession({ ...anonymousSession(now()), auth }, config.key); } catch { throw new Failure(502, "invalid_upstream_response"); }
    return auth;
  }
  async function refresh(old: Auth, clientIp: string): Promise<Auth> {
    const key = createHash("sha256").update(old.refresh).digest("hex");
    refreshes.forEach((entry, k) => { if (entry.expires <= now()) refreshes.delete(k); });
    let entry = refreshes.get(key);
    if (!entry) {
      if (refreshes.size >= 1000) throw new Failure(503, "upstream_unavailable");
      const promise = upstream("/auth/passwordless/refresh", "POST", { refresh: old.refresh }, undefined, clientIp).then((value) => {
        const updated = authResult(value);
        if (updated.user.id !== old.user.id || updated.user.email !== old.user.email || updated.user.workspaceId !== old.user.workspaceId) throw new Failure(401, "authentication_required");
        return updated;
      });
      entry = { promise, expires: now() + 15_000 }; refreshes.set(key, entry);
      // A transient outage must not poison retries for the lifetime of the memo.
      void promise.catch((error) => { if (!(error instanceof Failure && error.status === 401)) refreshes.delete(key); });
    }
    return entry.promise;
  }
  return async function handle(request: Request, action: string): Promise<Response> {
    let session = openSession(readSessionCookie(request), config.key, now()); let changed = false;
    let clear = false;
    const cookie = () => {
      if (clear) return sessionCookie("", 0);
      if (!changed || !session) return undefined;
      try { return sessionCookie(sealSession(session, config.key), (session.expires - now()) / 1000); }
      catch { clear = true; throw new Failure(500, "request_failed"); }
    };
    const respond = (body: unknown, status = 200, retryAfter?: number) => {
      // Cookie serialization can fail while reporting another error. Never re-enter
      // the same serializer from the error response or expose a partial session.
      let header: string | undefined;
      try { header = cookie(); }
      catch { return json({ error: "request_failed" }, 500, sessionCookie("", 0)); }
      return json(body, status, header, retryAfter);
    };
    try {
      const site = request.headers.get("sec-fetch-site"); const requestOrigin = request.headers.get("origin");
      if (site === "cross-site" || (requestOrigin && requestOrigin !== origin)) throw new Failure(403, "same_origin_required");
      if (!["GET", "POST"].includes(request.method)) throw new Failure(405, "method_not_allowed");
      if (request.method === "GET" && !["session", "templates", "cards", "terms"].includes(action)) throw new Failure(404, "not_found");
      if (request.method === "POST" && !["start", "verify", "logout", "refresh", "slug", "create", "save", "preview", "publish", "accept-terms"].includes(action)) throw new Failure(404, "not_found");
      if (request.method === "POST") {
        if (requestOrigin !== origin) throw new Failure(403, "same_origin_required");
        if (!session || !csrfMatches(request.headers.get("x-opso-csrf"), session.csrf)) throw new Failure(403, "csrf_required");
        if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") throw new Failure(415, "json_required");
      }
      const clientIp = appendedClientIp(request.headers);
      if (!clientIp || config.clientIpSecret.length !== 32 || config.clientIpSecret.equals(config.key)) throw new Failure(503, "web_account_unavailable");
      // Global, bounded process guard plus session/email budgets. Upstream keeps its own limits.
      rate("global", 1200);
      if (!session) { session = anonymousSession(now()); changed = true; }
      rate(`client:${session.clientId}`, 120);
      const body = request.method === "POST" ? await limitedJson(request, 16_384) : undefined;
      const authCall = async (path: string, method = "GET", payload?: unknown): Promise<unknown> => {
        if (!session?.auth) throw new Failure(401, "authentication_required");
        try { return await upstream(path, method, payload, session.auth.access); }
        catch (error) {
          if (!(error instanceof Failure && error.status === 401)) throw error;
          session.auth = await refresh(session.auth, clientIp); changed = true;
          return upstream(path, method, payload, session.auth.access);
        }
      };
      let result: unknown;
      if (action === "session") {
        if (session.auth) await authCall("/cards");
        result = { csrf: session.csrf, user: session.auth?.user ?? null };
      } else if (action === "start") {
        if (session.auth) throw new Failure(409, "already_authenticated");
        const input = parse(z.object({ email: emailSchema }).strict(), body);
        rate(`start:${session.clientId}`, 5, 15 * 60_000);
        rate(`email:${createHash("sha256").update(input.email).digest("hex")}`, 5, 15 * 60_000);
        await upstream("/auth/passwordless/start", "POST", input, undefined, clientIp);
        session.challenge = { email: input.email, expires: now() + 15 * 60_000 }; session.expires = session.challenge.expires; changed = true;
        result = { ok: true };
      } else if (action === "verify") {
        const input = parse(z.object({ code: z.string().regex(/^\d{6}$/) }).strict(), body);
        rate(`verify:${session.clientId}`, 10, 15 * 60_000);
        if (!session.challenge || session.challenge.expires <= now() || session.auth) throw new Failure(400, "challenge_expired");
        const auth = authResult(await upstream("/auth/passwordless/verify", "POST", { email: session.challenge.email, code: input.code }, undefined, clientIp));
        if (auth.user.email !== session.challenge.email) throw new Failure(502, "invalid_upstream_response");
        session = { ...anonymousSession(now()), auth, expires: now() + SESSION_SECONDS * 1000 }; changed = true;
        result = { user: auth.user, csrf: session.csrf };
      } else if (action === "logout") {
        parse(z.object({}).strict(), body); let revoked = true;
        if (session.auth) { try { await upstream("/auth/logout", "POST", { refresh: session.auth.refresh, access: session.auth.access }, undefined, clientIp); } catch { revoked = false; } }
        clear = true; result = { ok: true, revoked };
      } else if (action === "refresh") {
        parse(z.object({}).strict(), body);
        if (!session.auth) throw new Failure(401, "authentication_required");
        session.auth = await refresh(session.auth, clientIp); changed = true; result = { user: session.auth.user };
      } else if (action === "templates") {
        const value = objectValue(await upstream("/templates"));
        if (!Array.isArray(value.items)) throw new Failure(502, "invalid_upstream_response");
        result = { items: value.items.slice(0, 100).map((item) => { const row = objectValue(item); const theme = objectValue(row.theme); return { id: text(row.id, 128), name: text(row.name, 160), description: text(row.description, 500), canCreate: row.canCreate === true && row.website !== true, website: row.website === true, accent: /^#[a-f\d]{6}$/i.test(String(theme.accentColor)) ? theme.accentColor : "#286558" }; }) };
      } else if (action === "cards") {
        const value = objectValue(await authCall("/cards"));
        if (!Array.isArray(value.items)) throw new Failure(502, "invalid_upstream_response");
        result = { items: value.items.map((card) => projectCard(card, session!.auth!.user)) };
      } else if (action === "terms") {
        result = projectTerms(await authCall("/safety/terms-acceptance"));
      } else if (action === "accept-terms") {
        const input = parse(z.object({ version: z.string().min(1).max(40), language: opsoLocale, accepted: z.literal(true) }).strict(), body);
        result = projectTerms(await authCall("/safety/terms-acceptance", "POST", { version: input.version, language: input.language, surface: "protected_ugc_action", clientRelease: "opsolid-web-1" }));
      } else if (action === "slug") {
        const input = parse(z.object({ slug: opsoNewCard.shape.slug }).strict(), body);
        const value = objectValue(await authCall(`/onboarding/slug-availability?slug=${encodeURIComponent(input.slug)}`));
        result = { slug: input.slug, available: value.available === true };
      } else if (action === "create") {
        const input = parse(opsoNewCard, body);
        // Website starters contain additional pages; they need the mobile studio to finish.
        const templates = objectValue(await upstream("/templates"));
        if (!Array.isArray(templates.items) || !templates.items.some((item) => { const row = objectValue(item); return row.id === input.templateId && row.canCreate === true && row.website !== true; })) throw new Failure(400, "template_unavailable");
        const value = objectValue(await authCall("/users/me/onboarding", "POST", input));
        if (!idSchema.safeParse(value.cardId).success) throw new Failure(502, "invalid_upstream_response");
        result = { card: projectCard(await authCall(`/cards/${value.cardId}`), session.auth!.user) };
      } else if (action === "publish") {
        const input = parse(z.object({ id: idSchema, expectedRevision: z.number().int().min(0) }).strict(), body);
        const row = await authCall(`/cards/${input.id}`); projectCard(row, session.auth!.user);
        result = { card: projectCard(await authCall(`/cards/${input.id}/publish`, "POST", { expectedRevision: input.expectedRevision }), session.auth!.user) };
      } else if (action === "save" || action === "preview") {
        const input = parse(opsoDraft, body);
        const row = objectValue(await authCall(`/cards/${input.id}`)); projectCard(row, session.auth!.user);
        const content = objectValue(row.content);
        const enabled = Array.isArray(content.enabledLocales) ? content.enabledLocales.filter((locale) => opsoLocale.safeParse(locale).success) : [];
        const payload = { expectedRevision: input.expectedRevision, visibility: input.visibility, discoverable: input.privacy.discoverable, indexable: input.privacy.indexable,
          content: { ...input.profile, defaultLocale: input.cardLocale, enabledLocales: Array.from(new Set([...enabled, input.cardLocale])), showEmail: input.privacy.showEmail, showPhone: input.privacy.showPhone } };
        if (action === "save") result = { card: projectCard(await authCall(`/cards/${input.id}`, "PATCH", payload), session.auth!.user) };
        else {
          const preview = objectValue(await authCall(`/cards/${input.id}/preview?lang=${input.cardLocale}`, "POST", payload));
          result = { preview: { name: text(preview.displayName, 120), role: text(preview.role, 120), company: text(preview.company, 160), email: preview.showEmail === true ? text(preview.email, 254) : "", phone: preview.showPhone === true ? text(preview.phone, 40) : "" } };
        }
      }
      return respond(result);
    } catch (error) {
      const failure = error instanceof Failure ? error : new Failure(500, "request_failed");
      if (failure.status === 401 && session?.auth) clear = true;
      return respond({ error: failure.code, ...failure.details }, failure.status, failure.retryAfter);
    }
  };
}
