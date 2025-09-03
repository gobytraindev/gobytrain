import React, { useState } from "react";
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
    // Placeholder-data tills riktigt API kopplas på
    const fakeResults = [
      { id: 1, from: values.from, to: values.to, date: values.date, price: "120 EUR" },
      { id: 2, from: values.from, to: values.to, date: values.date, price: "95 EUR" },
    ];
    setResults(fakeResults);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto px-4 pt-16 pb-24">
        {/* H1 + intro (ingen grön header) */}
        <h1 className="text-2xl md:text-3xl font-semibold text-center text-gray-900">
          Find the best train routes in Europe
        </h1>
        <p className="mt-2 text-center text-gray-600">
          Fast, reliable results. Book with trusted partners.
        </p>

        {/* Sökformulär */}
        <section className="mt-8">
          <SearchForm
            initialValues={{ from: "", to: "", date: "" }}
            onSearch={handleSearch}
          />
        </section>

        {/* Resultatlista (placeholder) */}
        <section className="mt-10">
          {results.length > 0 ? (
            <ul className="space-y-4">
              {results.map((trip) => (
                <li
                  key={trip.id}
                  className="border rounded-lg p-4 shadow-sm bg-white"
                >
                  <p><span className="font-semibold">From:</span> {trip.from}</p>
                  <p><span className="font-semibold">To:</span> {trip.to}</p>
                  <p><span className="font-semibold">Date:</span> {trip.date}</p>
                  <p><span className="font-semibold">Price:</span> {trip.price}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">
              No results yet. Try searching above.
            </p>
          )}
        </section>

        {/* Populära rutter (internlänkar) */}
        <section className="mt-12 bg-white border rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900">Popular routes</h2>
          <p className="mt-1 text-gray-600">
            Explore some of the most searched connections:
          </p>
          <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
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
  );
}