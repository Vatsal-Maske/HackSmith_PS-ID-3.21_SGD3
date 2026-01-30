const express = require('express');
const cors = require('cors');
const axios = require('axios');
const {
  OPENWEATHER_AQI_API,
  AQICN_API,
  GEOCODE_API,
  HISTORICAL_AQI_API,
  HEALTH_RISK_API
} = require('./apiConfig');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Risk logic based on AQI
function getRiskLevel(aqi) {
  if (aqi < 100) return { level: 'Low', message: 'Air quality is satisfactory; little to no risk.' };
  if (aqi <= 200) return { level: 'Medium', message: 'Sensitive individuals may experience minor issues.' };
  return { level: 'High', message: 'Everyone may begin to experience health effects.' };
}

// Format timestamp as DD/MM/YYYY HH:MM
function formatTimestamp() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Geocode city/area name to lat/lon using OpenCage
async function geocodeCity(city) {
  const url = GEOCODE_API.replace('{CITY}', encodeURIComponent(city));
  try {
    const res = await axios.get(url);
    if (res.data.results && res.data.results.length > 0) {
      const { lat, lng } = res.data.results[0].geometry;
      return { lat, lon: lng };
    }
    throw new Error('City not found');
  } catch (err) {
    console.error('Geocoding error:', err.message);
    throw new Error('City not found');
  }
}

// Fetch AQI from OpenWeatherMap
async function fetchAQIOpenWeather(lat, lon) {
  const url = OPENWEATHER_AQI_API.replace('{LAT}', lat).replace('{LON}', lon);
  try {
    const res = await axios.get(url);
    const list = res.data.list?.[0];
    if (!list) throw new Error('No AQI data');
    const components = list.components;
    return {
      aqi: list.main.aqi,
      pm2_5: components.pm2_5 || 0,
      pm10: components.pm10 || 0,
    };
  } catch (err) {
    console.error('OpenWeather AQI error:', err.message);
    throw err;
  }
}

// Fetch AQI from AQICN (backup)
async function fetchAQIAQICN(city) {
  const url = AQICN_API.replace('{CITY}', encodeURIComponent(city));
  try {
    const res = await axios.get(url);
    if (res.data.status !== 'ok') throw new Error('AQICN API error');
    const data = res.data.data;
    const iaqi = data.iaqi || {};
    return {
      aqi: data.aqi,
      pm2_5: iaqi.pm25?.v || 0,
      pm10: iaqi.pm10?.v || 0,
    };
  } catch (err) {
    console.error('AQICN AQI error:', err.message);
    throw err;
  }
}

// GET /api/aqi?city=<city_or_area_name>
app.get('/api/aqi', async (req, res) => {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ error: 'City query parameter is required' });
  }
  try {
    const { lat, lon } = await geocodeCity(city);
    let aqiData;
    try {
      aqiData = await fetchAQIOpenWeather(lat, lon);
    } catch {
      console.log('Falling back to AQICN API');
      aqiData = await fetchAQIAQICN(city);
    }
    const risk = getRiskLevel(aqiData.aqi);
    const response = {
      city,
      latitude: lat,
      longitude: lon,
      aqi: aqiData.aqi,
      pm2_5: aqiData.pm2_5,
      pm10: aqiData.pm10,
      risk: risk.level,
      message: risk.message,
      last_updated: formatTimestamp(),
    };
    res.json(response);
  } catch (err) {
    console.error('AQI endpoint error:', err.message);
    if (err.message === 'City not found') {
      return res.status(404).json({ error: 'City not found' });
    }
    res.status(500).json({ error: 'Unable to fetch AQI data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
