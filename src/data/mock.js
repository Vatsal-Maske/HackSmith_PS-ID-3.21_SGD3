export const kpis = {
  aqi: { value: 82, label: 'Current AQI', unit: '', status: 'Moderate' },
  pm25: { value: 28, label: 'PM2.5', unit: 'µg/m³', status: 'Elevated' },
  pm10: { value: 56, label: 'PM10', unit: 'µg/m³', status: 'Moderate' },
  risk: { value: 'Medium', label: 'Respiratory Risk', unit: '', status: 'Watch' },
}

export const aqiTrend7d = [
  { day: 'Mon', aqi: 64 },
  { day: 'Tue', aqi: 71 },
  { day: 'Wed', aqi: 79 },
  { day: 'Thu', aqi: 88 },
  { day: 'Fri', aqi: 92 },
  { day: 'Sat', aqi: 86 },
  { day: 'Sun', aqi: 82 },
]

export const riskByArea = [
  { area: 'Zone A', risk: 22 },
  { area: 'Zone B', risk: 48 },
  { area: 'Zone C', risk: 31 },
  { area: 'Zone D', risk: 18 },
  { area: 'Zone E', risk: 36 },
]

export const alerts = [
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
]

export const apiInfo = {
  endpoint: 'https://api.example.com/v1/air-quality?city={CITY_NAME}',
}
