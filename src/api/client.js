const API_BASE = 'http://localhost:5000/api';

export async function fetchAQI(city) {
  try {
    const res = await fetch(`${API_BASE}/aqi?city=${encodeURIComponent(city)}`);
    if (!res.ok) throw new Error('AQI fetch failed');
    return await res.json();
  } catch (err) {
    console.error('fetchAQI error:', err);
    throw err;
  }
}

export async function fetchCities() {
  try {
    const res = await fetch(`${API_BASE}/cities`);
    if (!res.ok) throw new Error('Cities fetch failed');
    return await res.json();
  } catch (err) {
    console.error('fetchCities error:', err);
    throw err;
  }
}

export async function fetchHeatmap() {
  try {
    const res = await fetch(`${API_BASE}/heatmap`);
    if (!res.ok) throw new Error('Heatmap fetch failed');
    return await res.json();
  } catch (err) {
    console.error('fetchHeatmap error:', err);
    throw err;
  }
}
