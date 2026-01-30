import { Map, Navigation } from 'lucide-react'
import Card from './Card.jsx'

function legendDotClass(tone) {
  if (tone === 'low' || tone === 'good') return 'bg-emerald-500'
  if (tone === 'medium' || tone === 'moderate') return 'bg-amber-400'
  if (tone === 'high' || tone === 'unhealthy') return 'bg-rose-500'
  return 'bg-slate-400'
}

function getRiskTone(aqi) {
  if (aqi < 100) return 'low'
  if (aqi <= 200) return 'medium'
  return 'high'
}

export default function MapPanel({ heatmapData = [] }) {
  // Simple projection: map lat/lon to % positions for India view
  const project = (lat, lon) => {
    const x = ((lon - 68) / (97 - 68)) * 100 // India lon range ~68-97
    const y = ((37 - lat) / (37 - 8)) * 100 // India lat range ~8-37
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
  }

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
            <div className="mt-3 text-sm font-semibold text-slate-900">Live AQI Map</div>
            <div className="mt-1 max-w-[520px] text-xs text-slate-600">
              Colored circles show real AQI for each city. Hover to see details.
            </div>
          </div>
        </div>

        {/* Real heatmap circles */}
        <div className="pointer-events-none absolute inset-0">
          {heatmapData
            .filter(d => d.lat != null && d.lon != null && d.aqi != null)
            .map(d => {
              const { x, y } = project(d.lat, d.lon)
              const tone = getRiskTone(d.aqi)
              return (
                <div
                  key={d.city}
                  className="group absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-125"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    backgroundColor: tone === 'low' ? '#10b981' : tone === 'medium' ? '#f59e0b' : '#ef4444',
                    opacity: 0.8,
                  }}
                >
                  <span className="hidden whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-xs text-white shadow-lg group-hover:absolute group-hover:-top-8 group-hover:block">
                    {d.city}: AQI {d.aqi}
                  </span>
                </div>
              )
            })}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 rounded-2xl bg-white/90 p-3 shadow-soft ring-1 ring-white/40 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-700">
            <div className="flex items-center gap-2">
              <span className={'h-2.5 w-2.5 rounded-full ' + legendDotClass('low')} />
              Low
            </div>
            <div className="flex items-center gap-2">
              <span className={'h-2.5 w-2.5 rounded-full ' + legendDotClass('medium')} />
              Medium
            </div>
            <div className="flex items-center gap-2">
              <span className={'h-2.5 w-2.5 rounded-full ' + legendDotClass('high')} />
              High
            </div>
          </div>
          <div className="text-xs text-slate-600">Green = Low, Yellow = Medium, Red = High AQI</div>
        </div>
      </div>
    </Card>
  )
}
