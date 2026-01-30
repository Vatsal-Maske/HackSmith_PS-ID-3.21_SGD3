import Card from './Card.jsx'

function badgeTone(status) {
  const s = String(status || '').toLowerCase()
  if (s === 'low' || s.includes('good') || s.includes('improv')) return 'bg-emerald-50 text-emerald-700 ring-emerald-100'
  if (s === 'medium' || s.includes('moderate') || s.includes('watch')) return 'bg-amber-50 text-amber-700 ring-amber-100'
  if (s === 'high' || s.includes('unhealthy') || s.includes('elevated')) return 'bg-rose-50 text-rose-700 ring-rose-100'
  return 'bg-slate-50 text-slate-700 ring-slate-100'
}

export default function StatCard({ title, value, unit, status, hint }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium text-slate-600">{title}</div>
          <div className="mt-2 flex items-end gap-2">
            <div className="truncate text-2xl font-semibold text-slate-900">{value}</div>
            {unit ? <div className="pb-1 text-xs font-medium text-slate-500">{unit}</div> : null}
          </div>
          {hint ? <div className="mt-2 text-xs text-slate-500">{hint}</div> : null}
        </div>

        <div
          className={
            'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ' + badgeTone(status)
          }
        >
          {status}
        </div>
      </div>
    </Card>
  )
}
