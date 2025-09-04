// pages/index.tsx
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import SearchForm from "../components/SearchForm";
import ResultsList from "../components/ResultsList";
import { searchRoutes } from "../utils/searchRoutes";
import SeoHead from "../components/SeoHead";

// ---- Formvärden (lokalt) ----
type SearchFormValues = {
  from: string;
  to: string;
  date: string;
  maxPrice?: string;
  maxDuration?: string;
};

// ---- Train-typ (matchar ResultsList) ----
type Train = {
  id: string;
  from: string;
  to: string;
  date: string;
  departure: string;
  arrival: string;
  duration: string;
  price: string;
  changes: number;
  operator: string;
  train: string;
};

export default function Home() {
  const router = useRouter();
  const [results, setResults] = useState<Train[]>([]);
  const [loading, setLoading] = useState(false);

  // Hämta initiala värden från URL:en
  const initialValues: SearchFormValues = useMemo(() => {
    const { from, to, date, maxPrice, maxDuration } = router.query;
    return {
      from: typeof from === "string" ? from : "",
      to: typeof to === "string" ? to : "",
      date: typeof date === "string" ? date : "",
      maxPrice: typeof maxPrice === "string" ? maxPrice : "",
      maxDuration: typeof maxDuration === "string" ? maxDuration : "",
    };
  }, [router.query]);

  // Håll URL:en i synk med formulärvärden (påverkar inte layouten)
  useEffect(() => {
    const hasQuery =
      !!initialValues.from || !!initialValues.to || !!initialValues.date;

    if (hasQuery) {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            from: initialValues.from,
            to: initialValues.to,
            date: initialValues.date,
            ...(initialValues.maxPrice ? { maxPrice: initialValues.maxPrice } : {}),
            ...(initialValues.maxDuration ? { maxDuration: initialValues.maxDuration } : {}),
          },
        },
        undefined,
        { shallow: true }
      );
    }
    // vi triggar bara när själva värdena ändras
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialValues.from,
    initialValues.to,
    initialValues.date,
    initialValues.maxPrice,
    initialValues.maxDuration,
  ]);

  // Sök + filtrera
  function handleSearch(values: SearchFormValues) {
    setLoading(true);

    const found = searchRoutes(values.from, values.to, values.date).filter((r) => {
      // maxDuration (i timmar) → jämför i minuter
      if (values.maxDuration && values.maxDuration.trim()) {
        const m = (r.duration || "").match(/(\d+)\s*h.*?(\d+)\s*m?/i);
        const mins =
          m ? parseInt(m[1] || "0", 10) * 60 + parseInt(m[2] || "0", 10) : 99999;
        const maxMins = parseInt(values.maxDuration, 10) * 60;
        if (mins > maxMins) return false;
      }

      // maxPrice (€)
      if (values.maxPrice && values.maxPrice.trim()) {
        const priceNum = parseInt((r.price || "").replace(/[^0-9]/g, ""), 10) || 0;
        const max = parseInt(values.maxPrice, 10);
        if (priceNum > max) return false;
      }

      return true;
    });

    // Imitera nätverk och mappa till Train (som ResultsList förväntar)
    setTimeout(() => {
      const data: Train[] = found.map((r, i) => ({
        id: String(i + 1),
        from: r.from,
        to: r.to,
        date: values.date || "",
        departure: r.departure,
        arrival: r.arrival,
        duration: r.duration,
        price: r.price,
        changes: Number(r.changes ?? 0),
        operator: r.operator,
        train: r.train,
      }));
      setResults(data);
      setLoading(false);
    }, 400);
  }

  return (
    <>
      {/* SEO (ingen layoutförändring) */}
      <SeoHead />

      {/* --- HERO (oförändrad layout) --- */}
      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="max-w-5xl px-4 py-12 sm:py-16 mx-auto">
          <h1 className="text-center text-3xl sm:text-4xl font-semibold text-slate-900">
            Find the best train routes in Europe
          </h1>
          <p className="mt-2 text-center text-slate-500">
            Fast, reliable results. Book with trusted partners.
          </p>

          <p className="mt-4 text-center text-gray-700 max-w-2xl mx-auto">
            GoByTrain helps you compare prices, durations and operators across
            Europe so you can book with confidence. Start by entering your
            route and date above.
          </p>

          <div className="mt-8 mx-auto max-w-xl">
            <SearchForm initialValues={initialValues} onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* --- RESULTS (oförändrad layout) --- */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-16 -mt-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-8 text-slate-500">
              <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span>Searching routes…</span>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center text-slate-500">
              <p className="mb-1 font-medium">No results yet.</p>
              <p className="text-sm">Try a search above or adjust your filters.</p>
            </div>
          ) : (
            <ResultsList results={results} loading={loading} />
          )}
        </div>
      </section>
    </>
  );
}