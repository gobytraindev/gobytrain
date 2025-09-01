import React, { useState } from "react";
import SearchForm from "../components/SearchForm";

interface SearchFormValues {
  from: string;
  to: string;
  date: string;
}

export default function HomePage() {
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (values: SearchFormValues) => {
    console.log("Searching with values:", values);

    // Här kan du lägga in riktig API-anrop senare
    const fakeResults = [
      {
        id: 1,
        from: values.from,
        to: values.to,
        date: values.date,
        price: "120 EUR",
      },
      {
        id: 2,
        from: values.from,
        to: values.to,
        date: values.date,
        price: "95 EUR",
      },
    ];
    setResults(fakeResults);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white p-6 text-center text-2xl font-bold">
        GoByTrain 🚆
      </header>

      <main className="max-w-3xl mx-auto mt-10 p-4">
        <SearchForm
          initialValues={{ from: "", to: "", date: "" }}
          onSearch={handleSearch}
        />

        <div className="mt-10">
          {results.length > 0 ? (
            <ul className="space-y-4">
              {results.map((trip) => (
                <li
                  key={trip.id}
                  className="border rounded-lg p-4 shadow-sm bg-white"
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
      </main>
    </div>
  );
}