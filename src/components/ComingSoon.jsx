import Card from './Card.jsx'

export default function ComingSoon({ title }) {
  return (
    <Card className="p-6">
      <div className="text-lg font-semibold text-slate-900">{title}</div>
      <div className="mt-2 max-w-2xl text-sm text-slate-600">
        This section is a placeholder. You can wire it to live sensors, GIS layers, and epidemiological models next.
      </div>
    </Card>
  )
}
