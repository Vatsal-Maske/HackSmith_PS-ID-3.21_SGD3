import { kpis, aqiTrend7d, riskByArea, alerts, apiInfo } from '../data/mock.js'
import AlertsPanel from '../components/AlertsPanel.jsx'
import ApiPanel from '../components/ApiPanel.jsx'
import AqiTrendChart from '../components/AqiTrendChart.jsx'
import MapPanel from '../components/MapPanel.jsx'
import RiskBarChart from '../components/RiskBarChart.jsx'
import StatCard from '../components/StatCard.jsx'

export default function DashboardPage({ city }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <StatCard
          title={kpis.aqi.label}
          value={kpis.aqi.value}
          unit={kpis.aqi.unit}
          status={kpis.aqi.status}
          hint={`City: ${city || '—'}`}
        />
        <StatCard title={kpis.pm25.label} value={kpis.pm25.value} unit={kpis.pm25.unit} status={kpis.pm25.status} />
        <StatCard title={kpis.pm10.label} value={kpis.pm10.value} unit={kpis.pm10.unit} status={kpis.pm10.status} />
        <StatCard title={kpis.risk.label} value={kpis.risk.value} unit={kpis.risk.unit} status={kpis.risk.value} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MapPanel />
        </div>
        <div className="xl:col-span-1">
          <AlertsPanel items={alerts} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AqiTrendChart data={aqiTrend7d} />
        </div>
        <div className="xl:col-span-1">
          <RiskBarChart data={riskByArea} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ApiPanel endpoint={apiInfo.endpoint} />
        </div>
        <div className="lg:col-span-1" />
      </div>
    </div>
  )
}
