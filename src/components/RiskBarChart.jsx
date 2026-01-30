import Card from './Card.jsx'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function RiskBarChart({ data }) {
  return (
    <Card className="p-4">
      <div>
        <div className="text-sm font-semibold text-slate-900">Respiratory Disease Risk</div>
        <div className="mt-1 text-xs text-slate-600">Comparison by area (dummy index)</div>
      </div>

      <div className="mt-4 h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis dataKey="area" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid rgba(226,232,240,0.9)',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.10)',
              }}
              labelStyle={{ fontWeight: 600, color: '#0f172a' }}
              cursor={{ fill: 'rgba(148, 163, 184, 0.15)' }}
            />
            <Bar dataKey="risk" fill="#14b8a6" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
