import { createHmac } from "node:crypto";
import { isIP } from "node:net";

const AUTH_PATHS = new Set(["/api/auth/passwordless/start", "/api/auth/passwordless/verify", "/api/auth/passwordless/refresh", "/api/auth/logout"]);
export function canonicalClientIp(raw: string): string | null {
  if (raw.length > 45 || raw !== raw.trim() || /[\s%,[\]]/.test(raw)) return null;
  const family = isIP(raw);
  if (family === 4) return raw;
  if (family !== 6) return null;
  try { return new URL(`http://[${raw}]/`).hostname.slice(1, -1); } catch { return null; }
}
export function appendedClientIp(headers: Headers): string | null {
  // Valid only behind the reviewed Traefik hop with no public direct Node ingress.
  // Never trust the browser-controlled leftmost value or another IP header.
  const forwarded = headers.get("x-forwarded-for");
  if (!forwarded || forwarded.length > 2048) return null;
  const chain = forwarded.split(","); if (chain.length > 32) return null;
  return canonicalClientIp(chain[chain.length - 1].trim());
}
export function authClientIpHeaders(key: Buffer, ip: string, method: string, path: string, now: number): Record<string, string> {
  if (method !== "POST" || !AUTH_PATHS.has(path)) return {};
  if (key.length !== 32 || canonicalClientIp(ip) !== ip) throw new Error("invalid_client_ip_proof_configuration");
  const timestamp = String(Math.floor(now / 1000));
  const payload = JSON.stringify(["opso-web-client-ip", 1, "opsolid-web", "verso-auth", method, path, ip, timestamp]);
  return { "x-opso-bff-client-ip": ip, "x-opso-bff-timestamp": timestamp, "x-opso-bff-signature": `v1=${createHmac("sha256", key).update(payload).digest("hex")}` };
}
