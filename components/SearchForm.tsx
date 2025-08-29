// components/SearchForm.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { stations } from "../utils/stations";

export type SearchFormValues = {
  from: string;
  to: string;
  date: string;
  maxPrice: string;
  maxDuration: string;
};

type Props = {
  initialValues?: SearchFormValues;
  loading?: boolean;
  onSearch: (values: SearchFormValues) => void;
};

export default function SearchForm({ initialValues, loading = false, onSearch }: Props) {
  const [from, setFrom] = useState(initialValues?.from ?? "");
  const [to, setTo] = useState(initialValues?.to ?? "");
  const [date, setDate] = useState(initialValues?.date ?? "");
  const [maxPrice, setMaxPrice] = useState(initialValues?.maxPrice ?? "");
  const [maxDuration, setMaxDuration] = useState(initialValues?.maxDuration ?? "");
  const [error, setError] = useState<string | null>(null);

  const stationSet = useMemo(() => new Set(stations.map((s) => s.toLowerCase())), []);

  useEffect(() => {
    if (!initialValues) return;
    setFrom(initialValues.from ?? "");
    setTo(initialValues.to ?? "");
    setDate(initialValues.date ?? "");
    setMaxPrice(initialValues.maxPrice ?? "");
    setMaxDuration(initialValues.maxDuration ?? "");
  }, [initialValues]);

  const baseInput =
    "h-12 w-full rounded-lg border border-slate-300 bg-white px-3 text-[15px] " +
    "placeholder:text-slate-400 outline-none transition " +
    "focus:border-blue-600 focus:ring-2 focus:ring-blue-600/25";

  const filterOpts = (q: string) =>
    !q.trim()
      ? stations.slice(0, 20)
      : stations.filter((s) => s.toLowerCase().includes(q.toLowerCase())).slice(0, 20);

  const requiredOk = from.trim() !== "" && to.trim() !== "";

  function validate(): boolean {
    const f = from.trim();
    const t = to.trim();

    if (!f || !t) {
      setError("Please enter both ‘From’ and ‘To’.");
      return false;
    }
    if (f.toLowerCase() === t.toLowerCase()) {
      setError("‘From’ and ‘To’ must be different.");
      return false;
    }
    if (!stationSet.has(f.toLowerCase()) || !stationSet.has(t.toLowerCase())) {
      setError("Select stations from the suggestions list.");
      return false;
    }
    if (maxPrice && Number.isNaN(Number(maxPrice))) {
      setError("‘Max price’ must be a number.");
      return false;
    }
    if (maxDuration && Number.isNaN(Number(maxDuration))) {
      setError("‘Max duration’ must be a number.");
      return false;
    }
    setError(null);
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSearch({ from, to, date, maxPrice, maxDuration });
  }

  function swap() {
    setFrom(to);
    setTo(from);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full">
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr_auto_auto_auto] md:items-end">
          {/* FROM */}
          <div>
            <label className="mb-1 block text-xs text-slate-600">From</label>
            <input
              className={baseInput}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Start typing…"
              list="from-stations"
              autoComplete="off"
              aria-invalid={!!error && !requiredOk ? "true" : "false"}
            />
            <datalist id="from-stations">
              {filterOpts(from).map((s) => (
                <option key={`f-${s}`} value={s} />
              ))}
            </datalist>
          </div>

          {/* SWAP */}
          <div className="flex items-end justify-center">
            <button
              type="button"
              onClick={swap}
              className="h-12 min-w-[46px] rounded-full border border-slate-300 bg-white px-3 shadow-sm
                         hover:bg-slate-50 active:scale-[0.98] transition
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40"
              aria-label="Swap From/To"
              title="Swap From/To"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700" aria-hidden="true">
                <path d="M7 7h10m0 0l-3-3m3 3l-3 3M17 17H7m0 0l3 3m-3-3l3-3"
                      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* TO */}
          <div>
            <label className="mb-1 block text-xs text-slate-600">To</label>
            <input
              className={baseInput}
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Start typing…"
              list="to-stations"
              autoComplete="off"
            />
            <datalist id="to-stations">
              {filterOpts(to).map((s) => (
                <option key={`t-${s}`} value={s} />
              ))}
            </datalist>
          </div>

          {/* DATE */}
          <div>
            <label className="mb-1 block text-xs text-slate-600">Date</label>
            <input
              type="date"
              className={baseInput}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* MAX PRICE */}
          <div>
            <label className="mb-1 block text-xs text-slate-600">Max price (€)</label>
            <input
              inputMode="numeric"
              className={baseInput}
              placeholder="e.g. 120"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value.replace(/[^\d.]/g, ""))}
            />
          </div>

          {/* MAX DURATION */}
          <div>
            <label className="mb-1 block text-xs text-slate-600">Max duration (h)</label>
            <input
              inputMode="numeric"
              className={baseInput}
              placeholder="e.g. 6"
              value={maxDuration}
              onChange={(e) => setMaxDuration(e.target.value.replace(/[^\d.]/g, ""))}
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            disabled={loading || !requiredOk}
            className={`h-12 rounded-lg px-6 font-medium text-white transition
                        will-change-transform
                        ${loading || !requiredOk
                          ? "bg-slate-300 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-sm"
                        }`}
          >
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </div>
    </form>
  );
}