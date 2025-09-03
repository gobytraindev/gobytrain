// pages/index.tsx
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import SearchForm, { type SearchFormValues } from "../components/SearchForm";
import ResultsList, { type Train } from "../components/ResultsList";
import { searchRoutes } from "../utils/searchRoutes";

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
    const hasQuery = initialValues.from || initialValues.to || initialValues.date;
    if (!hasQuery) return;
    handleSearch(initialValues, { pushToUrl: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues.from, initialValues.to, initialValues.date]);

  function handleSearch(
    values: SearchFormValues,
    opts: { pushToUrl?: boolean } = { pushToUrl: true }
  ) {
    setLoading(true);

    if (opts.pushToUrl) {
      const query: Record<string, string> = {};
      if (values.from) query.from = values.from;
      if (values.to) query.to = values.to;
      if (values.date) query.date = values.date;
      if (values.maxPrice) query.maxPrice = values.maxPrice;
      if (values.maxDuration) query.maxDuration = values.maxDuration;
      router.push({ pathname: "/", query }, undefined, { shallow: true });
    }

    const found = searchRoutes(values.from, values.to, values.date).filter((r) => {
      if (values.maxPrice && +values.maxPrice > 0) {
        if (parseInt(r.price.replace(/\D/g, ""), 10) > +values.maxPrice) return false;
      }
      if (values.maxDuration && +values.maxDuration > 0) {
        const m = (r.duration || "").match(/(\d+)\s*h.*?(\d+)\s*m/i);
        const mins = m ? parseInt(m[1], 10) * 60 + parseInt(m[2], 10) : 99999;
        if (mins > +values.maxDuration * 60) return false;
      }
      return true;
    });

    setTimeout(() => {
      const data: Train[] = found.map((r) => ({
        id: r.id,
        from: r.from,
        to: r.to,
        departure: r.departure,
        arrival: r.arrival,
        duration: r.duration,
        price: r.price,
        changes: r.changes,
        operator: r.operator,
        train: r.train,
      }));
      setResults(data);
      setLoading(false);
    }, 400);
  }
<Head>
  <title>GoByTrain — Find the best train routes in Europe</title>
  <meta
    name="description"
    content="Search, compare and book train journeys across Europe with GoByTrain. Fast, reliable results from trusted partners."
  />
  <link rel="canonical" href="https://gobytrain.co/" />
  <meta name="robots" content="index,follow" />

  {/* Open Graph */}
  <meta property="og:title" content="GoByTrain — Find the best train routes in Europe" />
  <meta
    property="og:description"
    content="Search, compare and book train journeys across Europe with GoByTrain. Fast, reliable results from trusted partners."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://gobytrain.co/" />

  {/* JSON-LD */}
  <script
    type="application/ld+json"
    // @ts-ignore
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "GoByTrain",
        url: "https://gobytrain.co/",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://gobytrain.co/details?from={from}&to={to}&date={date}",
          "query-input": "required name=from required name=to optional name=date",
        },
      }),
    }}
  />
</Head>
  return (
    <>
      <Head>
        <title>GoByTrain — Find the best train routes in Europe</title>
        <meta
          name="description"
          content="Fast, reliable train route search across Europe. Compare prices and durations, then book with trusted partners."
        />
        <meta property="og:title" content="GoByTrain — European train search" />
        <meta
          property="og:description"
          content="Find fast, affordable routes across Europe and book with trusted partners."
        />
      </Head>

      {/* HERO */}
      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
          <h1 className="text-center text-3xl sm:text-4xl font-semibold text-slate-900">
            Find the best train routes in Europe
          </h1>
          <p className="mt-2 text-center text-slate-500">
            Fast, reliable results. Book with trusted partners.
          </p>

          <div className="mt-8">
            <div className="mx-auto max-w-5xl">
              <SearchForm
                initialValues={initialValues}
                loading={loading}
                onSearch={(vals) => handleSearch(vals)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-16 -mt-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-8 text-slate-500">
              <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
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