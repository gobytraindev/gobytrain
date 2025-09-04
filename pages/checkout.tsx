// pages/checkout.tsx
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";

type Q = string | string[] | undefined;
const val = (x: Q) => (Array.isArray(x) ? x[0] ?? "" : x ?? "");

export default function CheckoutPage() {
  const router = useRouter();

  const from = val(router.query.from);
  const to = val(router.query.to);
  const date = val(router.query.date);
  const departure = val(router.query.departure);
  const duration = val(router.query.duration);
  const transfers = val(router.query.transfers);
  const price = val(router.query.price);
  const partner = (val(router.query.partner) || "").toLowerCase(); // "omio" | "trainline" | "sj" | etc.
  const rid = val(router.query.rid);

  const affiliateUrl = buildAffiliateUrl({
    partner,
    from,
    to,
    date,
    departure,
    duration,
    transfers,
    price,
    rid,
  });

  return (
    <>
      <Head>
        <title>Checkout | GoByTrain</title>
        <meta
          name="description"
          content="Review your route details and continue to a trusted booking partner."
        />
      </Head>

      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-10">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
            <p className="mt-1 text-slate-600">
              Review your selection and continue to our booking partner.
            </p>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 text-sm text-slate-500">Selected route</div>

            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-lg font-semibold text-slate-900">
                {from || "From"} <span className="mx-2 text-slate-400">→</span> {to || "To"}
              </div>

              <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-slate-700 sm:grid-cols-2">
                <div>
                  <span className="text-slate-500">Date:</span> {date || "—"}
                </div>
                <div>
                  <span className="text-slate-500">Departure:</span> {departure || "—"}
                </div>
                <div>
                  <span className="text-slate-500">Duration:</span> {duration || "—"}
                </div>
                <div>
                  <span className="text-slate-500">Transfers:</span> {transfers || "—"}
                </div>
                <div>
                  <span className="text-slate-500">Price:</span> {price ? `€${price}` : "—"}
                </div>
                <div>
                  <span className="text-slate-500">Partner:</span>{" "}
                  {partner ? partnerLabel(partner) : "—"}
                </div>
              </div>

              {rid && (
                <div className="mt-2 text-xs text-slate-500">
                  Route ID: <span className="font-mono">{rid}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-between">
              <Link
                href={{ pathname: "/", query: { from, to, date } }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                ← Back
              </Link>

              <a
                href={affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Continue to booking
              </a>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              You’ll complete your purchase on a trusted partner site. We may earn a commission — at no extra cost to you.
            </p>
          </div>

          {/* Minimal debug info if something saknas */}
          {!affiliateUrl && (
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Missing data for partner link. Try searching again.
            </div>
          )}
        </div>
      </main>
    </>
  );
}

// ------- Helpers -------

function partnerLabel(p: string) {
  switch (p) {
    case "omio":
      return "Omio";
    case "trainline":
      return "Trainline";
    case "sj":
      return "SJ";
    default:
      return p || "Partner";
  }
}

/**
 * Enkel affiliate-mappning (placeholder-URLs)
 * Byt "AFF_ID_*" mot dina riktiga ID:n när du får dem.
 */
function buildAffiliateUrl(params: {
  partner: string;
  from: string;
  to: string;
  date?: string;
  departure?: string;
  duration?: string;
  transfers?: string;
  price?: string;
  rid?: string;
}): string {
  const { partner, from, to, date, departure, duration, transfers, price, rid } = params;
  const utm = new URLSearchParams({
    utm_source: "gobytrain",
    utm_medium: "affiliate",
    utm_campaign: "checkout",
  });

  // Normalisera städer för länkar
  const f = encodeURIComponent(from || "");
  const t = encodeURIComponent(to || "");
  const d = encodeURIComponent(date || "");

  if (partner === "omio") {
    // Placeholder-struktur — byt domän och aff-param.
    const q = new URLSearchParams({
      departure: f,
      arrival: t,
      date: d,
      affiliate_id: "AFF_ID_OMIO",
    });
    return `https://www.omio.com/search?${q.toString()}&${utm.toString()}`;
  }

  if (partner === "trainline") {
    const q = new URLSearchParams({
      from: f,
      to: t,
      date: d,
      aff: "AFF_ID_TRAINLINE",
    });
    return `https://www.thetrainline.com/search?${q.toString()}&${utm.toString()}`;
  }

  if (partner === "sj") {
    // SJ har ofta enkel sök-URL; aff-spårning sätts när vi får ID.
    const q = new URLSearchParams({
      from: f,
      to: t,
      date: d,
    });
    return `https://www.sj.se/en/search?${q.toString()}&${utm.toString()}`;
  }

  // Fallback: om inget partnerfält skickas -> skicka till vår generiska partnersida (byt senare)
  const q = new URLSearchParams({
    from: f,
    to: t,
    date: d,
    rid: rid || "",
    price: price || "",
    duration: duration || "",
    transfers: transfers || "",
  });
  return `https://partner.example.com/search?${q.toString()}&${utm.toString()}`;
}