import { AlertTriangle, Info, ShieldAlert } from 'lucide-react'
import Card from './Card.jsx'

function severityMeta(severity) {
  if (severity === 'high') {
    return {
      icon: ShieldAlert,
      tone: 'bg-rose-50 text-rose-800 ring-rose-100',
      dot: 'bg-rose-500',
      label: 'High',
    }
  }
  if (severity === 'medium') {
    return {
      icon: AlertTriangle,
      tone: 'bg-amber-50 text-amber-800 ring-amber-100',
      dot: 'bg-amber-400',
      label: 'Medium',
    }
  }
  return {
    icon: Info,
    tone: 'bg-emerald-50 text-emerald-800 ring-emerald-100',
    dot: 'bg-emerald-500',
    label: 'Low',
  }
}

export default function AlertsPanel({ items }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">Risk Alerts</div>
          <div className="mt-1 text-xs text-slate-600">Warnings and trend notifications</div>
        </div>
        <div className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-100">
          {items.length} alerts
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {items.map((a) => {
          const meta = severityMeta(a.severity)
          const Icon = meta.icon

          return (
            <div
              key={a.id}
              className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={'h-2.5 w-2.5 rounded-full ' + meta.dot} />
                    <div className="truncate text-sm font-semibold text-slate-900">{a.title}</div>
                  </div>
                  <div className="mt-1 text-xs text-slate-600">{a.detail}</div>
                  <div className="mt-2 text-xs font-medium text-slate-500">{a.time}</div>
                </div>

                <div className={'shrink-0 rounded-xl px-2.5 py-1 text-xs font-semibold ring-1 ' + meta.tone}>
                  <span className="inline-flex items-center gap-1.5">
                    <Icon size={14} />
                    {meta.label}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
