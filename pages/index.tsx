import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import SearchForm from "../components/SearchForm";

interface SearchFormValues {
  from: string;
  to: string;
  date: string;
}

export default function HomePage() {
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (values: SearchFormValues) => {
    const fakeResults = [
      { id: 1, from: values.from, to: values.to, date: values.date, price: "120 EUR" },
      { id: 2, from: values.from, to: values.to, date: values.date, price: "95 EUR" },
    ];
    setResults(fakeResults);
  };

  const metaTitle = "GoByTrain — Find the best train routes in Europe";
  const metaDesc =
    "Search, compare and book train journeys across Europe with GoByTrain. Fast, reliable results from trusted partners.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GoByTrain",
    "url": "https://gobytrain.co/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://gobytrain.co/details?from={from}&to={to}&date={date}",
      "query-input": "required name=from required name=to optional name=date"
    }
  };

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href="https://gobytrain.co/" />
        <meta name="robots" content="index,follow" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://gobytrain.co/" />
        <script
          type="application/ld+json"
          // @ts-ignore
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      {/* Tunn toppbar i vitt (ingen grön list) */}
      <div className="min-h-screen bg-gray-50">
        <header className="w-full border-b bg-white">
          <div className="mx-auto max-w-5xl px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-800">GoByTrain</div>
              <nav className="text-sm text-gray-500">Search</nav>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4">
          {/* Hero (grå designen) */}
          <section className="pt-12 text-center">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
              Find the best train routes in Europe
            </h1>
            <p className="mt-2 text-gray-600">
              Fast, reliable results. Book with trusted partners.
            </p>

            <div className="mx-auto mt-6 max-w-2xl">
              <SearchForm
                initialValues={{ from: "", to: "", date: "" }}
                onSearch={handleSearch}
              />
            </div>

            <div className="mx-auto mt-8 max-w-3xl">
              {results.length > 0 ? (
                <ul className="space-y-4">
                  {results.map((trip) => (
                    <li
                      key={trip.id}
                      className="rounded-lg border bg-white p-4 shadow-sm text-left"
                    >
                      <p>
                        <span className="font-semibold">From:</span> {trip.from}
                      </p>
                      <p>
                        <span className="font-semibold">To:</span> {trip.to}
                      </p>
                      <p>
                        <span className="font-semibold">Date:</span> {trip.date}
                      </p>
                      <p>
                        <span className="font-semibold">Price:</span> {trip.price}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No results yet. Try searching above.</p>
              )}
            </div>
          </section>

          {/* Popular routes (neutral vit låda, passar grå layout) */}
          <section className="mx-auto mt-10 max-w-3xl rounded-lg border bg-white p-4">
            <h2 className="text-lg font-semibold text-gray-800">Popular routes</h2>
            <p className="mt-1 text-gray-600">
              Explore some of the most searched connections:
            </p>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-left">
              <li>
                <Link className="text-blue-600 hover:underline" href="/details?from=Stockholm&to=Berlin">
                  Stockholm → Berlin
                </Link>
              </li>
              <li>
                <Link className="text-blue-600 hover:underline" href="/details?from=Paris&to=Rome">
                  Paris → Rome
                </Link>
              </li>
              <li>
                <Link className="text-blue-600 hover:underline" href="/details?from=Madrid&to=Amsterdam">
                  Madrid → Amsterdam
                </Link>
              </li>
              <li>
                <Link className="text-blue-600 hover:underline" href="/details?from=Oslo&to=Copenhagen">
                  Oslo → Copenhagen
                </Link>
              </li>
            </ul>
            <p className="mt-4 text-sm text-gray-500">
              GoByTrain helps you compare duration, price and operators across Europe so you can book with confidence.
            </p>
          </section>
        </main>
      </div>
    </>
  );
}