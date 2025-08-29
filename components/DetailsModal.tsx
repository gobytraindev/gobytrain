// components/DetailsModal.tsx
import React, { useEffect } from "react";

type TrainLike = {
  id: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration?: string;
  price: string;
  changes?: number;
  operator?: string;
  train?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  train: TrainLike | null;
};

export default function DetailsModal({ open, onClose, train }: Props) {
  // Stäng med ESC + lås body-scroll när modal är öppen
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !train) return null;

  const changes =
    typeof train.changes === "number"
      ? train.changes === 0
        ? "Nonstop"
        : train.changes === 1
        ? "1 change"
        : `${train.changes} changes`
      : "—";

  // Amenity-chips (placeholder – visar trygghet)
  const amenities = ["Wi-Fi", "Power outlets", "Seat reservation"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Route details"
    >
      {/* Backdrop */}
      <button
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      {/* Sheet / Panel */}
      <div className="relative z-10 w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl bg-white shadow-xl focus:outline-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h3 className="text-base font-semibold text-slate-900">
            Route details
          </h3>
          <button
            onClick={onClose}
            className="rounded p-2 text-slate-500 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          <div>
            <div className="text-sm text-slate-500">
              {train.from} → {train.to}
            </div>
            <div className="mt-0.5 text-lg font-semibold text-slate-900">
              {train.departure} — {train.arrival}
            </div>
          </div>

          {/* Chips-rad (amenities) */}
          <div className="flex flex-wrap gap-2">
            {amenities.map((a) => (
              <span
                key={a}
                className="inline-flex items-center rounded-full border border-slate-300 px-2.5 py-1 text-xs text-slate-700"
              >
                {a}
              </span>
            ))}
            {(train.operator || train.train) && (
              <span className="inline-flex items-center rounded-full border border-slate-300 px-2.5 py-1 text-xs text-slate-700">
                {train.operator ?? ""}{train.operator && train.train ? " · " : ""}{train.train ?? ""}
              </span>
            )}
          </div>

          {/* Grid med nyckeldata */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="text-slate-500">Duration</div>
              <div className="font-medium">{train.duration ?? "—"}</div>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="text-slate-500">Changes</div>
              <div className="font-medium">{changes}</div>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="text-slate-500">Operator / Train</div>
              <div className="font-medium">
                {train.operator ?? "—"}{train.operator && train.train ? " · " : ""}{train.train ?? ""}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-3">
              <div className="text-slate-500">Price</div>
              <div className="font-semibold">
                {train.price.startsWith("€") ? train.price : `€${train.price}`}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-lg border border-slate-200 p-3 text-sm">
            <div className="text-slate-500 mb-1">Notes</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Schedules and prices are demo data for now.</li>
              <li>Booking redirects to a trusted partner checkout.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
          >
            Close
          </button>
          <button
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-slate-300"
            disabled
            title="Continue in checkout page"
          >
            Book (use the checkout page)
          </button>
        </div>
      </div>
    </div>
  );
}