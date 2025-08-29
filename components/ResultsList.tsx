// components/ResultsList.tsx
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import DetailsModal from "./DetailsModal";

export type Train = {
  id: string;
  from: string;
  to: string;
  departure: string;   // "HH:MM"
  arrival: string;     // "HH:MM"
  duration?: string;   // "7h 20m"
  price: string;       // "€123" eller "123"
  changes?: number;    // 0..3
  operator?: string;   // t.ex. "DB"
  train?: string;      // t.ex. "ICE 612"
};

type Props = {
  results: Train[];
};

type SortBy = "price" | "duration" | "departure";

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map((x) => parseInt(x, 10));
  return h * 60 + m;
}
function durationMinutes(dep: string, arr: string, fallback?: string): number {
  if (dep && arr) {
    let d = timeToMinutes(arr) - timeToMinutes(dep);
    if (d < 0) d += 24 * 60;
    return d;
  }
  if (fallback) {
    const m = fallback.match(/(\d+)\s*h.*?(\d+)\s*m/i);
    if (m) return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  }
  return 0;
}
function fmtDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}
function parsePrice(p: string): number {
  const n = parseFloat(p.replace(/[^\d.]/g, ""));
  return Number.isNaN(n) ? 0 : n;
}

export default function ResultsList({ results }: Props) {
  const router = useRouter();

  const [sortBy, setSortBy] = useState<SortBy>("departure");
  const [dir, setDir] = useState<"asc" | "desc">("asc");
  const [nonstopOnly, setNonstopOnly] = useState(false);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Train | null>(null);

  const processed = useMemo(() => {
    let list = results.map((r) => ({
      ...r,
      _price: parsePrice(r.price),
      _dur: durationMinutes(r.departure, r.arrival, r.duration),
      _dep: timeToMinutes(r.departure),
      _changes: typeof r.changes === "number" ? r.changes : 0,
    }));

    if (nonstopOnly) list = list.filter((r) => r._changes === 0);

    list.sort((a, b) => {
      let A = 0, B = 0;
      if (sortBy === "price")      { A = a._price; B = b._price; }
      else if (sortBy === "duration"){ A = a._dur;   B = b._dur; }
      else                         { A = a._dep;   B = b._dep; }
      return dir === "asc" ? A - B : B - A;
    });

    return list;
  }, [results, sortBy, dir, nonstopOnly]);

  function toggleSort(s: SortBy) {
    if (s === sortBy) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(s); setDir("asc"); }
  }

  function showDetails(r: Train) {
    setSelected(r);
    setOpen(true);
  }

  function goToCheckout(r: Train) {
    console.log("click_book", { id: r.id, from: r.from, to: r.to, price: r.price });
    const q: Record<string, string> = {
      id: r.id,
      from: r.from,
      to: r.to,
      departure: r.departure,
      arrival: r.arrival,
      price: r.price.startsWith("€") ? r.price : `€${r.price}`,
    };
    if (r.duration) q.duration = r.duration;
    if (typeof r.changes === "number") q.changes = String(r.changes);
    if (r.operator) q.operator = r.operator;
    if (r.train) q.train = r.train;

    router.push({ pathname: "/checkout", query: q });
  }

  if (!results?.length) return null;

  return (
    <div className="space-y-4">
      {/* Filter + sortering */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-500">
            {processed.length}/{results.length} result{processed.length !== 1 ? "s" : ""}
          </div>

          {/* Custom checkbox */}
          <button
            type="button"
            onClick={() => setNonstopOnly((v) => !v)}
            className={`group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition
                        ${nonstopOnly
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-slate-300 text-slate-700 hover:bg-slate-50"
                        } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40`}
            aria-pressed={nonstopOnly}
          >
            <span
              className={`inline-block h-4 w-4 rounded border transition
                          ${nonstopOnly ? "border-blue-600 bg-blue-600" : "border-slate-300 bg-white group-hover:border-slate-400"}`}
              aria-hidden="true"
            />
            Nonstop only
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSort("price")}
            className={`rounded-md border px-3 py-1.5 text-sm transition ${
              sortBy === "price" ? "border-blue-600 text-blue-700 bg-blue-50" : "border-slate-300 hover:bg-slate-50"
            }`}
            aria-pressed={sortBy === "price"}
          >
            Price {sortBy === "price" ? (dir === "asc" ? "↑" : "↓") : ""}
          </button>
          <button
            onClick={() => toggleSort("duration")}
            className={`rounded-md border px-3 py-1.5 text-sm transition ${
              sortBy === "duration" ? "border-blue-600 text-blue-700 bg-blue-50" : "border-slate-300 hover:bg-slate-50"
            }`}
            aria-pressed={sortBy === "duration"}
          >
            Duration {sortBy === "duration" ? (dir === "asc" ? "↑" : "↓") : ""}
          </button>
          <button
            onClick={() => toggleSort("departure")}
            className={`rounded-md border px-3 py-1.5 text-sm transition ${
              sortBy === "departure" ? "border-blue-600 text-blue-700 bg-blue-50" : "border-slate-300 hover:bg-slate-50"
            }`}
            aria-pressed={sortBy === "departure"}
          >
            Departure {sortBy === "departure" ? (dir === "asc" ? "↑" : "↓") : ""}
          </button>
        </div>
      </div>

      {/* Lista */}
      <ul className="grid gap-4">
        {processed.map((r) => {
          const mins = durationMinutes(r.departure, r.arrival, r.duration);
          const dur = r.duration || fmtDuration(mins);
          const changes = typeof r.changes === "number" ? r.changes : 0;

          return (
            <li
              key={r.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Vänster */}
                <div>
                  <div className="text-sm text-slate-500">{r.from} → {r.to}</div>
                  <div className="mt-0.5 text-xl font-semibold text-slate-900">
                    {r.departure} — {r.arrival}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-slate-300 px-2.5 py-1 text-xs text-slate-700">
                      Duration: {dur}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-slate-300 px-2.5 py-1 text-xs text-slate-700">
                      {changes === 0 ? "Nonstop" : changes === 1 ? "1 change" : `${changes} changes`}
                    </span>
                    {(r.operator || r.train) && (
                      <span className="inline-flex items-center rounded-full border border-slate-300 px-2.5 py-1 text-xs text-slate-700">
                        {r.operator ? r.operator : ""}{r.train ? ` · ${r.train}` : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Höger */}
                <div className="text-right sm:min-w-[220px]">
                  <div className="text-2xl font-bold text-slate-900">
                    {r.price.startsWith("€") ? r.price : `€${r.price}`}
                  </div>
                  <div className="mt-2 flex items-center gap-2 justify-end">
                    <button
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
                      type="button"
                      onClick={() => showDetails(r)}
                    >
                      Details
                    </button>
                    <button
                      className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 active:scale-[0.98] transition"
                      type="button"
                      onClick={() => goToCheckout(r)}
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Modal */}
      <DetailsModal open={open} onClose={() => setOpen(false)} train={selected} />
    </div>
  );
}