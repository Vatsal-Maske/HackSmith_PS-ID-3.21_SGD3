import { Map, Navigation } from 'lucide-react'
import Card from './Card.jsx'

function legendDotClass(tone) {
  if (tone === 'good') return 'bg-emerald-500'
  if (tone === 'moderate') return 'bg-amber-400'
  if (tone === 'unhealthy') return 'bg-rose-500'
  return 'bg-slate-400'
}

export default function MapPanel() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Map size={18} className="text-brand-700" />
          Heat Map (AQI)
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Navigation size={16} />
          Center
        </button>
      </div>

      <div className="relative">
        <div className="grid h-[360px] w-full place-items-center bg-gradient-to-br from-sky-50 via-white to-emerald-50 md:h-[420px]">
          <div className="text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand-700 shadow-soft ring-1 ring-slate-100">
              <Map size={22} />
            </div>
            <div className="mt-3 text-sm font-semibold text-slate-900">Interactive map placeholder</div>
            <div className="mt-1 max-w-[520px] text-xs text-slate-600">
              Integrate Mapbox/Leaflet later. The heat overlay below demonstrates AQI color banding.
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[10%] top-[20%] h-24 w-28 rounded-full bg-emerald-400/30 blur-2xl" />
          <div className="absolute left-[45%] top-[35%] h-28 w-40 rounded-full bg-amber-300/35 blur-2xl" />
          <div className="absolute right-[12%] top-[25%] h-32 w-44 rounded-full bg-rose-400/30 blur-2xl" />
          <div className="absolute right-[26%] bottom-[18%] h-24 w-40 rounded-full bg-emerald-400/20 blur-2xl" />
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 rounded-2xl bg-white/90 p-3 shadow-soft ring-1 ring-white/40 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-700">
            <div className="flex items-center gap-2">
              <span className={'h-2.5 w-2.5 rounded-full ' + legendDotClass('good')} />
              Good
            </div>
            <div className="flex items-center gap-2">
              <span className={'h-2.5 w-2.5 rounded-full ' + legendDotClass('moderate')} />
              Moderate
            </div>
            <div className="flex items-center gap-2">
              <span className={'h-2.5 w-2.5 rounded-full ' + legendDotClass('unhealthy')} />
              Unhealthy
            </div>
          </div>
          <div className="text-xs text-slate-600">Green = good, Yellow = moderate, Red = unhealthy</div>
        </div>
      </div>
    </Card>
  )
}
