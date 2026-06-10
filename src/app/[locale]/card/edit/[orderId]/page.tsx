// =============================================================================
// Customer self-service edit page
//   /:locale/card/edit/:orderId?t=:editToken [#cancel]
//
// Server component: loads the order, constant-time-checks the token, then
// hands off to CardEditClient. The `#cancel` anchor is honoured client-side
// to auto-open the cancel modal.
// =============================================================================

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CardDataSchema, OrderStatus } from "@/lib/validation";
import { getTemplateById } from "@/config/card-templates";
import { CardEditClient } from "./CardEditClient";
import { ResendLinkButton } from "./ResendLinkButton";
import { EditTokenError, requireEditToken } from "@/lib/auth/edit-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PageProps {
  params: { locale: string; orderId: string };
  searchParams: { t?: string };
}

const NON_EDITABLE_STATUSES = new Set<string>([
  OrderStatus.PENDING_PAYMENT,
  OrderStatus.CANCELLED,
  OrderStatus.REFUNDED,
]);

export default async function CardEditPage({ params, searchParams }: PageProps) {
  const { orderId } = params;
  const token = searchParams.t ?? "";

  const buttonLocale = (["en", "de", "tr"].includes(params.locale)
    ? params.locale
    : "en") as "en" | "de" | "tr";

  let order;
  try {
    order = await requireEditToken(token, orderId);
  } catch (err) {
    if (err instanceof EditTokenError) {
      return (
        <EditRejectedView
          reason={err.code}
          orderId={orderId}
          locale={buttonLocale}
        />
      );
    }
    throw err;
  }

  if (NON_EDITABLE_STATUSES.has(order.status)) {
    return (
      <EditRejectedView
        reason="not_editable"
        status={order.status}
        orderId={orderId}
        locale={buttonLocale}
      />
    );
  }

  const template = getTemplateById(order.templateId);
  if (!template) notFound();

  const parsedCard = CardDataSchema.safeParse(order.cardData);
  const cardData = parsedCard.success
    ? parsedCard.data
    : { name: order.contactName }; // defensive fallback — should not happen for paid orders

  const subscription = await prisma.subscription.findUnique({
    where: { orderId: order.id },
  });

  return (
    <CardEditClient
      orderId={order.id}
      editToken={token}
      version={order.updatedAt.toISOString()}
      status={order.status}
      templateComponentKey={template.componentKey}
      templateName={template.name}
      templateId={template.id}
      contactName={order.contactName}
      contactEmail={order.contactEmail}
      contactPhone={order.contactPhone}
      billingMode={order.billingMode}
      slug={order.slug}
      cardData={cardData}
      brandPrimaryHex={order.brandPrimaryHex}
      brandAccentHex={order.brandAccentHex}
      photoPath={order.photoPath}
      logoPath={order.logoPath}
      hasSubscription={!!subscription}
      subscriptionCancelAt={subscription?.cancelAt?.toISOString() ?? null}
      subscriptionPeriodEnd={subscription?.currentPeriodEnd?.toISOString() ?? null}
      visibility={
        (["public", "unlisted", "private"].includes(
          (order as { visibility?: string }).visibility ?? "",
        )
          ? (order as { visibility?: string }).visibility
          : "unlisted") as "public" | "unlisted" | "private"
      }
      openToNetworking={(order as { openToNetworking?: boolean }).openToNetworking ?? false}
      acceptingClients={(order as { acceptingClients?: boolean }).acceptingClients ?? false}
    />
  );
}

// -----------------------------------------------------------------------------
// Rejection view — token missing / bad / order archived.
// Kept inline because it's a one-off terminal page with zero interactivity.
// Copy is deliberately short: the customer should contact support, not retry.
// -----------------------------------------------------------------------------
function EditRejectedView({
  reason,
  status,
  orderId,
  locale,
}: {
  reason: "missing_token" | "not_found" | "bad_token" | "not_editable";
  status?: string;
  orderId: string;
  locale: "en" | "de" | "tr";
}) {
  const titleByReason: Record<string, string> = {
    missing_token: "Link incomplete",
    not_found: "Order not found",
    bad_token: "This edit link is not valid",
    not_editable: "This order can no longer be edited here",
  };

  const bodyByReason: Record<string, string> = {
    missing_token:
      "The edit link you opened is missing its security token. Please re-open the link from your OpSolid order email.",
    not_found:
      "We could not find an order with that ID. Please check the link in your order email.",
    bad_token:
      "This link is expired or has been regenerated. Please reply to your order email and we will send you a fresh edit link.",
    not_editable:
      status === OrderStatus.PENDING_PAYMENT
        ? "This order has not been paid yet. Please complete payment first — the edit link becomes active afterwards."
        : "This order has been archived (cancelled or refunded). Reply to your order email if you need help.",
  };

  return (
    <main className="editor-light min-h-screen bg-neutral-50 px-4 py-16">
      <div className="mx-auto max-w-xl rounded-3xl border border-neutral-200 bg-white p-8">
        <p className="text-eyebrow uppercase tracking-wider text-ink-300">
          OpSolid · Digital Card
        </p>
        <h1 className="mt-3 font-display text-3xl text-ink">
          {titleByReason[reason] ?? "Unable to load this edit link"}
        </h1>
        <p className="mt-4 text-body text-ink-200">{bodyByReason[reason]}</p>
        {/* Self-service recovery: emails the edit link to the order's stored
            contact email. Only useful where a valid order might exist. */}
        {(reason === "missing_token" ||
          reason === "bad_token" ||
          reason === "not_found") && (
          <ResendLinkButton orderId={orderId} locale={locale} />
        )}
        <p className="mt-6 text-sm text-ink-300">
          Need help?{" "}
          <a href="/contact" className="underline underline-offset-4">
            Use the contact form
          </a>
          .
        </p>
      </div>
    </main>
  );
}
