// components/RouteCard.tsx
type Train = {
  id: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  price: string;
};

export default function RouteCard({ train }: { train: Train }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-baseline justify-between">
        <h3 className="text-slate-900 font-semibold">
          {train.from} <span className="text-slate-400">→</span> {train.to}
        </h3>
        <div className="text-right font-semibold">{train.price}</div>
      </div>

      <div className="mt-1 text-sm text-slate-600">
        {train.departure} — {train.arrival}
      </div>
    </article>
  );
}