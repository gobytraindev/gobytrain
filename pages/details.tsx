// pages/details.tsx
import Head from "next/head";
import { useRouter } from "next/router";

function val(x: string | string[] | undefined): string {
  if (Array.isArray(x)) return x[0] ?? "";
  return x ?? "";
}

export default function DetailsPage() {
  const router = useRouter();
  const { from, to, date, departure, duration, transfers, price, partner } = router.query;

  // Bygg vidare samma query för Book/Back
  const qs = new URLSearchParams();
  (["from", "to", "date", "departure", "duration", "transfers", "price", "partner"] as const).forEach(
    (k) => {
      const v = router.query[k];
      if (typeof v === "string" && v) qs.set(k, v);
    }
  );

  const goBook = () => router.push(`/checkout?${qs.toString()}`);
  const goBack = () => router.push(`/?${qs.toString()}`);

  return (
    <>
      <Head>
        <title>{`Details ${val(from)} → ${val(to)} | GoByTrain`}</title>
      </Head>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <button
          onClick={goBack}
          className="mb-4 text-sm text-indigo-600 hover:underline"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-semibold text-slate-900">Trip details</h1>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-slate-400">From</dt>
              <dd className="text-slate-900">{val(from) || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">To</dt>
              <dd className="text-slate-900">{val(to) || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Date</dt>
              <dd>{val(date) || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Departure</dt>
              <dd>{val(departure) || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Duration</dt>
              <dd>{val(duration) || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Transfers</dt>
              <dd>{val(transfers) || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Price</dt>
              <dd>{val(price) ? `€${val(price)}` : "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Partner</dt>
              <dd>{val(partner) || "—"}</dd>
            </div>
          </dl>

          <div className="mt-6 flex gap-2">
            <button
              onClick={goBook}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Book
            </button>
            <button
              onClick={goBack}
              className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50"
            >
              Back
            </button>
          </div>
        </div>
      </main>
    </>
  );
}