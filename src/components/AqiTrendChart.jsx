import Card from './Card.jsx'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function AqiTrendChart({ data }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-900">AQI Trend</div>
          <div className="mt-1 text-xs text-slate-600">Last 7 days</div>
        </div>
      </div>

      <div className="mt-4 h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid rgba(226,232,240,0.9)',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.10)',
              }}
              labelStyle={{ fontWeight: 600, color: '#0f172a' }}
              cursor={{ stroke: '#94a3b8', strokeDasharray: '4 4' }}
            />
            <Line
              type="monotone"
              dataKey="aqi"
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={{ r: 3, stroke: '#0ea5e9', strokeWidth: 2, fill: 'white' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
