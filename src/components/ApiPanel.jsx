import { Check, Copy, Link2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import Card from './Card.jsx'

export default function ApiPanel({ endpoint }) {
  const [copied, setCopied] = useState(false)

  const prettyEndpoint = useMemo(() => endpoint, [endpoint])

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(prettyEndpoint)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Link2 size={18} className="text-brand-700" />
          API Access
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="text-xs font-semibold text-slate-600">Endpoint</div>
        <div className="mt-2 break-all font-mono text-xs text-slate-900">{prettyEndpoint}</div>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:bg-brand-800"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          Copy API Link
        </button>
      </div>
    </Card>
  )
}
