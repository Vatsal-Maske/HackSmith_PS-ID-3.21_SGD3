import { Search, UserCircle2 } from 'lucide-react'

export default function Header({ city, onCityChange }) {
  return (
    <header className="flex flex-col gap-3 border-b border-slate-200/70 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold text-slate-900 md:text-xl">
          Air Quality Health Impact Dashboard
        </h1>
        <div className="mt-1 text-xs text-slate-600">
          Monitoring air pollution and respiratory risk for urban planning • Last updated: {new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full max-w-[420px]">
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="Search city name"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
          />
        </div>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
          aria-label="User Profile"
        >
          <UserCircle2 size={22} />
        </button>
      </div>
    </header>
  )
}
