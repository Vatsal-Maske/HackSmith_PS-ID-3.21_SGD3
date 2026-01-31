import {
  Activity,
  BarChart3,
  FileText,
  LayoutDashboard,
  MapPinned,
} from 'lucide-react'

const nav = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'map', label: 'Live AQI Map', icon: MapPinned },
  { key: 'risk', label: 'Disease Risk Analysis', icon: Activity },
  { key: 'reports', label: 'Reports', icon: FileText },
]

export default function Sidebar({ activeKey, onChange }) {
  return (
    <aside className="hidden h-full w-[280px] shrink-0 border-r border-slate-200/70 bg-white md:flex">
      <div className="flex w-full flex-col p-5">
        <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-brand-50 to-sky-50 px-4 py-4 ring-1 ring-slate-100">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white shadow">
            <BarChart3 size={18} />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-900">Urban Health Monitor</div>
            <div className="truncate text-xs text-slate-600">Air quality & respiratory risk</div>
          </div>
        </div>

        <nav className="mt-6 flex flex-col gap-1">
          {nav.map((item) => {
            const Icon = item.icon
            const isActive = item.key === activeKey

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onChange(item.key)}
                className={
                  'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ' +
                  'transition ' +
                  (isActive
                    ? 'bg-brand-50 text-brand-800 ring-1 ring-brand-100'
                    : 'text-slate-700 hover:bg-slate-50')
                }
              >
                <span
                  className={
                    'grid h-9 w-9 place-items-center rounded-xl ring-1 transition ' +
                    (isActive
                      ? 'bg-white text-brand-700 ring-brand-100'
                      : 'bg-white text-slate-600 ring-slate-100 group-hover:text-slate-800')
                  }
                >
                  <Icon size={18} />
                </span>
                <span className="truncate font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="mt-auto rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
          <div className="text-xs font-semibold text-slate-700">System status</div>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live sensors connected
          </div>
        </div>
      </div>
    </aside>
  )
}
