import { useEffect, useState } from 'react';
import { fetchAQI, fetchHeatmap } from '../api/client.js';
import AlertsPanel from '../components/AlertsPanel.jsx';
import ApiPanel from '../components/ApiPanel.jsx';
import AqiTrendChart from '../components/AqiTrendChart.jsx';
import MapPanel from '../components/MapPanel.jsx';
import RiskBarChart from '../components/RiskBarChart.jsx';
import StatCard from '../components/StatCard.jsx';

// Dummy alerts and API info (can be made dynamic later)
const alerts = [
  {
    id: 'a1',
    title: 'High pollution detected in Zone B',
    detail: 'PM2.5 spiked above recommended limits over the last 2 hours.',
    severity: 'high',
    time: '10 min ago',
  },
  {
    id: 'a2',
    title: 'Asthma risk increased by 30%',
    detail: 'Respiratory risk index trending upward in high-traffic corridors.',
    severity: 'medium',
    time: '1 hr ago',
  },
  {
    id: 'a3',
    title: 'Air quality improving in Zone D',
    detail: 'AQI moved from Unhealthy to Moderate after rainfall.',
    severity: 'low',
    time: 'Today',
  },
];

const apiInfo = {
  endpoint: 'http://localhost:5000/api/aqi?city={CITY_NAME}',
};

export default function DashboardPage({ city }) {
  const [aqiData, setAqiData] = useState(null);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [aqi, heatmap] = await Promise.all([
          fetchAQI(city || 'New Delhi'),
          fetchHeatmap(),
        ]);
        setAqiData(aqi);
        setHeatmapData(heatmap);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [city]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-600">
        Loading dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center text-rose-600">
        {error}
      </div>
    );
  }

  if (!aqiData) return null;

  // Prepare chart data (mock 7-day trend for now; replace with historical API later)
  const aqiTrend7d = [
    { day: 'Mon', aqi: aqiData.aqi - 20 },
    { day: 'Tue', aqi: aqiData.aqi - 10 },
    { day: 'Wed', aqi: aqiData.aqi - 5 },
    { day: 'Thu', aqi: aqiData.aqi },
    { day: 'Fri', aqi: aqiData.aqi + 5 },
    { day: 'Sat', aqi: aqiData.aqi + 2 },
    { day: 'Sun', aqi: aqiData.aqi },
  ];

  // Prepare risk comparison by area (use heatmap data)
  const riskByArea = heatmapData
    .filter(d => d.aqi != null)
    .map(d => ({
      area: d.city,
      risk: d.aqi > 200 ? 80 : d.aqi > 100 ? 50 : 20,
    }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <StatCard
          title="Current AQI"
          value={aqiData.aqi}
          unit=""
          status={aqiData.risk}
          hint={`City: ${aqiData.city || city || '—'}`}
        />
        <StatCard
          title="PM2.5"
          value={aqiData.pm2_5}
          unit="µg/m³"
          status={aqiData.risk}
        />
        <StatCard
          title="PM10"
          value={aqiData.pm10}
          unit="µg/m³"
          status={aqiData.risk}
        />
        <StatCard
          title="Respiratory Risk"
          value={aqiData.risk}
          unit=""
          status={aqiData.risk}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MapPanel heatmapData={heatmapData} />
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
  );
}
