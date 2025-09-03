// pages/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import SearchForm from "../components/SearchForm";
import ResultsList from "../components/ResultsList";
import { searchRoutes } from "../utils/searchRoutes";

// ---- Formvärden (lokalt) ----
type SearchFormValues = {
  from: string;
  to: string;
  date: string;
  maxPrice?: string;
  maxDuration?: string;
};

// ---- Train-typ anpassad till ResultsList (id = string) ----
type Train = {
  id: string;            // <- ändrat till string
  from: string;
  to: string;
  date: string;
  departure: string;
  arrival: string;
  duration: string;
  price: string;
  changes: string;
  operator: string;
  train: string;
};

// ---- SEO ----
const metaTitle = "GoByTrain — Find the best train routes in Europe";
const metaDesc =
  "Search, compare and book train journeys across Europe with GoByTrain. Fast, reliable results from trusted partners.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GoByTrain",
  url: "https://gobytrain.co/",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://gobytrain.co/details?from={from}&to={to}&date={date}",
    "query-input": "required name=from required name=to optional name=date",
  },
};

export default function Home() {
  const router = useRouter();
  const [results, setResults] = useState<Train[]>([]);
  const [loading, setLoading] = useState(false);

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
  }, [initialValues.from, initialValues.to, initialValues.date]);

  async function handleSearch(values: SearchFormValues) {
    setLoading(true);

    const found = searchRoutes(values.from, values.to, values.date).filter((r) => {
      if (values.maxDuration && values.maxDuration.trim()) {
        const m = (r.duration || "").match(/(\d+)h.*?(\d+)\s*m?/i);
        const mins =
          (m ? parseInt(m[1] || "0", 10) * 60 + parseInt(m[2] || "0", 10) : 99999);
        const maxMins = parseInt(values.maxDuration, 10) * 60;
        if (mins > maxMins) return false;
      }
      if (values.maxPrice && values.maxPrice.trim()) {
        const priceNum = parseInt((r.price || "").replace(/[^0-9]/g, ""), 10) || 0;
        const max = parseInt(values.maxPrice, 10);
        if (priceNum > max) return false;
      }
      return true;
    });

    setTimeout(() => {
      const data: Train[] = found.map((r, i) => ({
        id: String(i + 1),   // <- string, inte number
        from: r.from,
        to: r.to,
        date: values.date || "",
        departure: r.departure,
        arrival: r.arrival,
        duration: r.duration,
        price: r.price,
        changes: String(r.changes ?? ""),
        operator: r.operator,
        train: r.train,
      }));
      setResults(data);
      setLoading(false);
    }, 400);
  }

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href="https://gobytrain.co/" />
        <meta name="robots" content="index,follow" />

        {/* Open Graph */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gobytrain.co/" />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          // @ts-ignore
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

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

      <section className="mx-auto w-full max-w-5xl px-4 pb-16 -mt-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-8 text-slate-500">
              <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
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
            <ResultsList results={results} />
          )}
        </div>
      </section>
    </>
  );
}