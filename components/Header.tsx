// components/Header.tsx
import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  const isSearch = router.pathname === "/" || router.pathname === "/index";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <nav
          className="flex h-14 items-center justify-between"
          aria-label="Primary"
        >
          {/* Brand */}
          <div className="min-w-0">
            <Link
              href="/"
              className="block select-none text-lg font-semibold tracking-tight text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 rounded"
              aria-label="Go to home"
            >
              <span className="align-middle">GoByTrain</span>
            </Link>
          </div>

          {/* Right actions (kept minimal for now) */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={`rounded px-3 py-1.5 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 ${
                isSearch
                  ? "text-slate-900"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              aria-current={isSearch ? "page" : undefined}
            >
              Search
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}