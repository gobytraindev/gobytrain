// pages/checkout.tsx
import { useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { buildPartnerUrl, type Partner } from "../lib/partners";

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value || "—"}</span>
    </div>
  );
}

export default function Checkout() {
  const router = useRouter();
  const q = router.query;

  const price = typeof q.price === "string" ? q.price : "";
  const from = typeof q.from === "string" ? q.from : "";
  const to = typeof q.to === "string" ? q.to : "";
  const dep = typeof q.departure === "string" ? q.departure : "";
  const arr = typeof q.arrival === "string" ? q.arrival : "";
  const duration = typeof q.duration === "string" ? q.duration : "";
  const changes = typeof q.changes === "string" ? q.changes : "";
  const operator = typeof q.operator === "string" ? q.operator : "";
  const train = typeof q.train === "string" ? q.train : "";
  const date = typeof q.date === "string" ? q.date : ""; // om vi börjar skicka med

  // Välj partner här (snabbt att byta vid test)
  const partner: Partner = "omio"; // "raileurope" för att testa Rail Europe-URL

  const partnerUrl = useMemo(() => {
    return buildPartnerUrl(partner, {
      from,
      to,
      date,
      currency: "EUR",
      adults: 1,
      price,
    });
  }, [partner, from, to, date, price]);

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="mt-1 text-slate-500">
          This is a placeholder summary before redirecting to partner booking.
        </p>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <div className="text-sm text-slate-500">
              {from} → {to}
            </div>
            <div className="text-lg font-semibold text-slate-900">
              {dep} — {arr}
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            <Row label="Duration" value={duration} />
            <Row label="Changes" value={changes || "—"} />
            <Row
              label="Operator / Train"
              value={[operator, train].filter(Boolean).join(" · ") || "—"}
            />
            <Row
              label="Price"
              value={
                price
                  ? price.startsWith("€")
                    ? price
                    : `€${price}`
                  : "—"
              }
            />
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Link
              href="/"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
            >
              ← Back
            </Link>

            {partnerUrl ? (
              <a
                href={partnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Continue to booking
              </a>
            ) : (
              <button
                disabled
                className="rounded-md bg-slate-300 px-4 py-2 text-sm font-medium text-white cursor-not-allowed"
                title="Missing partner link"
              >
                Continue to booking
              </button>
            )}
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Prices and schedules shown here are demo data. Real booking flow will open a partner
            checkout with live inventory. Affiliate parameters will be added once available.
          </p>
        </div>
      </div>
    </main>
  );
}