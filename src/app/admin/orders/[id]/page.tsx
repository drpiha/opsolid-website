import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatEuro, getTemplateById } from "@/config/card-templates";
import { CardDataSchema } from "@/lib/validation";
import { PublishAction } from "./PublishAction";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Order detail",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function OrderDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { token = "" } = await searchParams;
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || token !== expected) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-display-sm text-ink">401</h1>
        <p className="mt-4 text-ink/60">
          Append <code>?token=…</code> to the URL.
        </p>
      </main>
    );
  }

  const order = await prisma.cardOrder.findUnique({
    where: { id },
    include: {
      template: true,
      subscription: true,
      statusHistory: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!order) notFound();

  const template = getTemplateById(order.templateId);
  const cardData = CardDataSchema.safeParse(order.cardData);
  const card = cardData.success ? cardData.data : null;

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 md:py-16">
      <div className="mx-auto max-w-4xl">
        <a
          href={`/admin/orders?token=${encodeURIComponent(token)}`}
          className="text-sm text-ink/50 hover:text-ink"
        >
          ← All orders
        </a>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="font-display text-display-sm text-ink">
            Order #{String(order.orderNumber).padStart(4, "0")}
          </h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-mono uppercase tracking-wider ${
              order.status === "PUBLISHED"
                ? "bg-brand/10 text-brand"
                : order.status === "AWAITING_DESIGN"
                ? "bg-amber/20 text-ink"
                : order.status === "PENDING_PAYMENT"
                ? "bg-neutral-200 text-ink/70"
                : "bg-ink/10 text-ink"
            }`}
          >
            {order.status}
          </span>
        </div>

        {order.status === "AWAITING_DESIGN" && (
          <PublishAction orderId={order.id} token={token} />
        )}

        <p className="mt-2 text-ink/50">
          {new Date(order.createdAt).toLocaleString("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
          {order.callMeBack && (
            <span className="ml-3 inline-block rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
              Call me back
            </span>
          )}
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Panel title="Customer">
            <Row label="Name" value={order.contactName} />
            <Row
              label="Email"
              value={
                <a href={`mailto:${order.contactEmail}`} className="underline">
                  {order.contactEmail}
                </a>
              }
            />
            <Row
              label="Phone"
              value={
                <a
                  href={`tel:${order.contactPhone.replace(/\s/g, "")}`}
                  className="underline"
                >
                  {order.contactPhone}
                </a>
              }
            />
            <Row
              label="Contacted?"
              value={
                order.contactedAt
                  ? new Date(order.contactedAt).toLocaleString("de-DE")
                  : "—"
              }
            />
            {order.contactedByNote && (
              <Row label="Contact note" value={order.contactedByNote} />
            )}
          </Panel>

          <Panel title="Template + Billing">
            <Row label="Template" value={`#${String(order.templateId).padStart(2, "0")} ${template?.name ?? ""}`} />
            <Row label="Billing mode" value={order.billingMode} />
            <Row label="Amount" value={`${formatEuro(order.amountCents)} ${order.currency}`} />
            <Row label="Locale" value={order.locale} />
            <Row
              label="Stripe session"
              value={
                <code className="break-all text-xs">
                  {order.stripeSessionId ?? "—"}
                </code>
              }
            />
            {order.stripePaymentIntentId && (
              <Row
                label="Payment Intent"
                value={<code className="break-all text-xs">{order.stripePaymentIntentId}</code>}
              />
            )}
            {order.stripeSubscriptionId && (
              <Row
                label="Subscription"
                value={<code className="break-all text-xs">{order.stripeSubscriptionId}</code>}
              />
            )}
          </Panel>

          <Panel title="Public card" span>
            {order.slug ? (
              <>
                <Row
                  label="URL"
                  value={
                    <a
                      href={`/c/${order.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all underline"
                    >
                      https://opsolid.de/c/{order.slug}
                    </a>
                  }
                />
              </>
            ) : (
              <p className="text-ink/50">Not yet published.</p>
            )}
          </Panel>

          <Panel title="Card content (what appears on the card)" span>
            {card ? (
              <div className="grid gap-1 md:grid-cols-2">
                <Row label="Name" value={card.name} />
                {card.title && <Row label="Title" value={card.title} />}
                {card.company && <Row label="Company" value={card.company} />}
                {card.phone && <Row label="Phone" value={card.phone} />}
                {card.whatsapp && <Row label="WhatsApp" value={card.whatsapp} />}
                {card.email && <Row label="Email" value={card.email} />}
                {card.website && <Row label="Website" value={card.website} />}
                {card.address && <Row label="Address" value={card.address} />}
                {card.bio && <Row label="Bio" value={card.bio} />}
                {card.designNotes && (
                  <Row label="Design notes" value={card.designNotes} />
                )}
                {card.socials && Object.entries(card.socials).filter(([, v]) => v).length > 0 && (
                  <Row
                    label="Socials"
                    value={
                      <div className="flex flex-col gap-1">
                        {Object.entries(card.socials)
                          .filter(([, v]) => v)
                          .map(([k, v]) => (
                            <a
                              key={k}
                              href={v as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate underline"
                            >
                              {k}: {v as string}
                            </a>
                          ))}
                      </div>
                    }
                  />
                )}
              </div>
            ) : (
              <p className="text-ink/50">Card data could not be parsed.</p>
            )}
          </Panel>

          <Panel title="Branding + media" span>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-eyebrow uppercase text-ink/50">Primary</p>
                {order.brandPrimaryHex ? (
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="h-5 w-5 rounded"
                      style={{ backgroundColor: order.brandPrimaryHex }}
                    />
                    <code>{order.brandPrimaryHex}</code>
                  </div>
                ) : (
                  <p className="mt-1 text-ink/40">—</p>
                )}
              </div>
              <div>
                <p className="text-eyebrow uppercase text-ink/50">Accent</p>
                {order.brandAccentHex ? (
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="h-5 w-5 rounded"
                      style={{ backgroundColor: order.brandAccentHex }}
                    />
                    <code>{order.brandAccentHex}</code>
                  </div>
                ) : (
                  <p className="mt-1 text-ink/40">—</p>
                )}
              </div>
              <div>
                <p className="text-eyebrow uppercase text-ink/50">Files</p>
                <div className="mt-1 flex flex-col gap-1 text-xs">
                  {order.photoPath ? (
                    <a
                      href={order.photoPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      photo
                    </a>
                  ) : (
                    <span className="text-ink/40">no photo</span>
                  )}
                  {order.logoPath ? (
                    <a
                      href={order.logoPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      logo
                    </a>
                  ) : (
                    <span className="text-ink/40">no logo</span>
                  )}
                </div>
              </div>
            </div>
          </Panel>

          {order.subscription && (
            <Panel title="Subscription" span>
              <Row label="Status" value={order.subscription.status} />
              <Row
                label="Current period end"
                value={new Date(order.subscription.currentPeriodEnd).toLocaleString("de-DE")}
              />
              {order.subscription.cancelAt && (
                <Row
                  label="Cancels at"
                  value={new Date(order.subscription.cancelAt).toLocaleString("de-DE")}
                />
              )}
            </Panel>
          )}

          {order.designNotes && (
            <Panel title="Designer notes (internal)" span>
              <p className="whitespace-pre-wrap text-sm text-ink/80">
                {order.designNotes}
              </p>
            </Panel>
          )}

          <Panel title="Status history" span>
            <ol className="space-y-2">
              {order.statusHistory.map((h) => (
                <li key={h.id} className="rounded-xl bg-neutral-50 p-3 text-sm">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-mono text-xs text-ink/70">
                      {h.fromStatus ? `${h.fromStatus} → ` : ""}
                      <strong className="text-ink">{h.toStatus}</strong>
                    </span>
                    <span className="text-xs text-ink/50">
                      {new Date(h.createdAt).toLocaleString("de-DE")} · {h.actor}
                    </span>
                  </div>
                  {h.note && <p className="mt-1 text-xs text-ink/70">{h.note}</p>}
                </li>
              ))}
            </ol>
          </Panel>
        </div>
      </div>
    </main>
  );
}

function Panel({
  title,
  span = false,
  children,
}: {
  title: string;
  span?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-3xl border border-neutral-200 bg-white p-6 ${
        span ? "md:col-span-2" : ""
      }`}
    >
      <h2 className="mb-4 text-heading-sm text-ink">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-start gap-3 border-b border-neutral-100 py-2 last:border-b-0">
      <dt className="text-xs font-semibold uppercase tracking-wider text-ink/50">
        {label}
      </dt>
      <dd className="text-sm text-ink">{value}</dd>
    </div>
  );
}
