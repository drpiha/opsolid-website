import { createCipheriv, createDecipheriv, randomBytes, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import type { OpsoIdentity } from "./contracts";

export const OPSO_COOKIE = "__Host-opso-web";
export const SESSION_SECONDS = 8 * 60 * 60;
export type OpsoSession = {
  v: 1; clientId: string; csrf: string; expires: number;
  challenge?: { email: string; expires: number };
  auth?: { access: string; refresh: string; user: OpsoIdentity };
};
const AAD = Buffer.from(`${OPSO_COOKIE}:v1`);
const id = z.string().regex(/^[A-Za-z0-9_-]{1,128}$/);
const sessionSchema = z.object({
  v: z.literal(1), clientId: z.string().regex(/^[A-Za-z0-9_-]{32}$/), csrf: z.string().regex(/^[A-Za-z0-9_-]{43}$/), expires: z.number().int().safe(),
  challenge: z.object({ email: z.string().email().max(254), expires: z.number().int().safe() }).strict().optional(),
  auth: z.object({ access: z.string().min(1).max(1800), refresh: z.string().min(1).max(1800), user: z.object({ id, email: z.string().email().max(254), name: z.string().max(300).nullable(), workspaceId: id }).strict() }).strict().optional(),
}).strict().refine((value) => !(value.auth && value.challenge));
export function anonymousSession(now: number): OpsoSession {
  return { v: 1, clientId: randomBytes(24).toString("base64url"), csrf: randomBytes(32).toString("base64url"), expires: now + 15 * 60_000 };
}
export function sessionKey(raw: string | undefined): Buffer | null {
  if (!raw || !/^[A-Za-z0-9+/]{43}=$/.test(raw)) return null;
  const key = Buffer.from(raw, "base64");
  return key.length === 32 && key.toString("base64") === raw ? key : null;
}
export function sealSession(session: OpsoSession, key: Buffer): string {
  if (key.length !== 32 || !sessionSchema.safeParse(session).success) throw new Error("invalid_session");
  const nonce = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, nonce);
  cipher.setAAD(AAD);
  const bytes = Buffer.concat([cipher.update(JSON.stringify(session), "utf8"), cipher.final()]);
  const sealed = Buffer.concat([nonce, cipher.getAuthTag(), bytes]).toString("base64url");
  if (sealed.length > 3800) throw new Error("session_payload_too_large");
  return sealed;
}
export function openSession(value: string | null, key: Buffer, now: number): OpsoSession | null {
  if (key.length !== 32 || !value || value.length > 3800 || !/^[A-Za-z0-9_-]+$/.test(value)) return null;
  try {
    const bytes = Buffer.from(value, "base64url");
    if (bytes.length < 29) return null;
    const decipher = createDecipheriv("aes-256-gcm", key, bytes.subarray(0, 12));
    decipher.setAAD(AAD); decipher.setAuthTag(bytes.subarray(12, 28));
    const parsed = sessionSchema.safeParse(JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)), decipher.final()]).toString("utf8")));
    if (!parsed.success) return null;
    const session = parsed.data;
    if (session.expires <= now
      || session.expires > now + SESSION_SECONDS * 1000 + 60_000
      || (session.challenge && (session.challenge.expires > session.expires || session.challenge.expires <= now))) return null;
    return session;
  } catch { return null; }
}
export function readSessionCookie(req: Request): string | null {
  const values = (req.headers.get("cookie") ?? "").split(";").map((part) => part.trim()).filter((part) => part.startsWith(`${OPSO_COOKIE}=`));
  return values.length === 1 ? values[0].slice(OPSO_COOKIE.length + 1) : null;
}
export function csrfMatches(actual: string | null, expected: string): boolean {
  if (!actual || !/^[A-Za-z0-9_-]{43}$/.test(actual) || actual.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}
export function sessionCookie(value: string, maxAge: number): string {
  return `${OPSO_COOKIE}=${value}; Path=/; Max-Age=${Math.max(0, Math.floor(maxAge))}; Secure; HttpOnly; SameSite=Strict`;
}
