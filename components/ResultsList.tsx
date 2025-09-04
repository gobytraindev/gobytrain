import React from "react";

type Train = {
  id: string;
  from: string;
  to: string;
  date: string;
  departure: string;
  arrival: string;
  duration: string;
  price: string;
  operator: string;
  changes: number;
};

interface ResultsListProps {
  results: Train[];
  loading: boolean;
}

export default function ResultsList({ results, loading }: ResultsListProps) {
  if (loading) {
    return <p className="text-center text-gray-600">Loading results...</p>;
  }

  if (!results || results.length === 0) {
    return <p className="text-center text-gray-600">No train routes found.</p>;
  }

  return (
    <div className="space-y-6">
      {results.map((train) => (
        <div
          key={train.id}
          className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              {train.from} → {train.to}
            </h3>
            <p className="text-sm text-gray-500">{train.date}</p>
          </div>

          <div className="mt-2 flex justify-between items-center">
            <div>
              <p className="text-gray-700">
                Departure: <span className="font-medium">{train.departure}</span>
              </p>
              <p className="text-gray-700">
                Arrival: <span className="font-medium">{train.arrival}</span>
              </p>
              <p className="text-gray-700">
                Duration: <span className="font-medium">{train.duration}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-600">{train.price}</p>
              <p className="text-gray-500">{train.operator}</p>
              <p className="text-gray-500">{train.changes} changes</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}