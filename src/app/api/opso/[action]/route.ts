import { createOpsoWebGateway } from "@/lib/opso-web/gateway";
import { sessionKey } from "@/lib/opso-web/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
let gateway: ReturnType<typeof createOpsoWebGateway> | undefined;
function handle(request: Request, context: { params: { action: string } }) {
  const key = sessionKey(process.env.OPSO_WEB_SESSION_KEY);
  const clientIpSecret = sessionKey(process.env.OPSO_WEB_CLIENT_IP_SECRET);
  // Enable only with the matching API verifier and reviewed one-hop ingress.
  // Missing or reused secrets never fall back to unverified client IPs/plaintext.
  if (process.env.OPSO_WEB_ENABLED !== "true" || process.env.OPSO_WEB_TRUSTED_PROXY !== "traefik-one-hop" || !key || !clientIpSecret || key.equals(clientIpSecret)) return Response.json({ error: "web_account_unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  gateway ??= createOpsoWebGateway({ key, clientIpSecret, browserOrigin: "https://opsolid.de" });
  return gateway(request, context.params.action);
}
export const GET = handle;
export const POST = handle;
