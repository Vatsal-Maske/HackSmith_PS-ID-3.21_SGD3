const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const {
  OPENWEATHER_BASE,
  OPENWEATHER_HISTORY,
  AQICN_BASE,
  OPENCAGE_BASE
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
  const url = `${OPENCAGE_BASE}?q=${encodeURIComponent(city)}&key=${process.env.OPENCAGE_API_KEY}`;
  try {
    console.log('Geocoding URL:', url);
    const res = await axios.get(url);
    console.log('Geocoding response:', res.data);
    if (res.data.results && res.data.results.length > 0) {
      const { lat, lng } = res.data.results[0].geometry;
      return { lat, lon: lng };
    }
    throw new Error('City not found');
  } catch (err) {
    console.error('Geocoding error:', err.message);
    console.error('Full error:', err);
    throw new Error('City not found');
  }
}

// Fetch AQI from OpenWeatherMap
async function fetchAQIOpenWeather(lat, lon) {
  const url = `${OPENWEATHER_BASE}?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}`;
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
  const url = `${AQICN_BASE}/${encodeURIComponent(city)}/?token=${process.env.AQICN_API_KEY}`;
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

// Heatmap endpoint
app.get('/api/heatmap', async (req, res) => {
  try {
    // Return mock heatmap data for major Indian cities
    const heatmapData = [
      { city: 'Delhi', lat: 28.7041, lon: 77.1025, aqi: 156, intensity: 0.8 },
      { city: 'Mumbai', lat: 19.0760, lon: 72.8777, aqi: 89, intensity: 0.4 },
      { city: 'Bangalore', lat: 12.9716, lon: 77.5946, aqi: 67, intensity: 0.3 },
      { city: 'Hyderabad', lat: 17.3850, lon: 78.4867, aqi: 95, intensity: 0.5 },
      { city: 'Chennai', lat: 13.0827, lon: 80.2707, aqi: 72, intensity: 0.3 },
      { city: 'Kolkata', lat: 22.5726, lon: 88.3639, aqi: 134, intensity: 0.7 },
      { city: 'Pune', lat: 18.5204, lon: 73.8567, aqi: 78, intensity: 0.4 },
      { city: 'Ahmedabad', lat: 23.0225, lon: 72.5714, aqi: 112, intensity: 0.6 }
    ];
    
    res.json(heatmapData);
  } catch (err) {
    console.error('Heatmap endpoint error:', err.message);
    res.status(500).json({ error: 'Unable to fetch heatmap data' });
  }
});

// Test endpoint
app.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Server is working!' });
});

// GET /api/aqi?city=<city_or_area_name>
app.get('/api/aqi', async (req, res) => {
  const { city } = req.query;
  console.log('Received request for city:', city);
  
  if (!city) {
    return res.status(400).json({ error: 'City query parameter is required' });
  }
  
  // Only allow Indian cities
  const indianCities = ['mumbai', 'delhi', 'new delhi', 'bangalore', 'hyderabad', 'chennai', 'kolkata', 'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam', 'pimpri-chinchwad', 'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut', 'rajkot', 'kalyan-dombivli', 'vasai-virar', 'varanasi', 'srinagar', 'aurangabad', 'dhanbad', 'amritsar', 'navi-mumbai', 'allahabad', 'ranchi', 'howrah', 'coimbatore', 'jabalpur', 'gwalior', 'vijayawada', 'jodhpur', 'madurai', 'raipur', 'kota', 'chandigarh', 'guwahati', 'solapur', 'hubli-dharwad', 'tiruchirappalli', 'bareilly', 'moradabad', 'mysore', 'tiruppur', 'gurgaon', 'aligarh', 'jalandhar', 'bhubaneswar', 'salem', 'mira-bhayandar', 'thiruvananthapuram', 'bhiwandi', 'saharanpur', 'gorakhpur', 'guntur', 'bikaner', 'rajkot', 'dhule', 'nanded', 'kollam', 'ajmer', 'akola', 'latur', 'kochi', 'bhavnagar', 'karnal', 'kochi'];
  
  const cityLower = city.toLowerCase();
  console.log('City lower:', cityLower);
  console.log('Is Indian city:', indianCities.includes(cityLower));
  
  if (!indianCities.includes(cityLower)) {
    return res.status(400).json({ error: 'Only Indian cities are supported. Please try cities like Mumbai, Delhi, Bangalore, etc.' });
  }
  
  try {
    // Use hardcoded coordinates for major Indian cities to avoid geocoding issues
    let lat, lon;
    const cityCoords = {
      'mumbai': { lat: 19.0760, lon: 72.8777 },
      'delhi': { lat: 28.7041, lon: 77.1025 },
      'new delhi': { lat: 28.6139, lon: 77.2090 },
      'bangalore': { lat: 12.9716, lon: 77.5946 },
      'hyderabad': { lat: 17.3850, lon: 78.4867 },
      'chennai': { lat: 13.0827, lon: 80.2707 },
      'kolkata': { lat: 22.5726, lon: 88.3639 },
      'pune': { lat: 18.5204, lon: 73.8567 },
      'ahmedabad': { lat: 23.0225, lon: 72.5714 },
      'jaipur': { lat: 26.9124, lon: 75.7873 },
      'lucknow': { lat: 26.8467, lon: 80.9462 }
    };
    
    if (cityCoords[cityLower]) {
      lat = cityCoords[cityLower].lat;
      lon = cityCoords[cityLower].lon;
      console.log('Using hardcoded coords:', lat, lon);
    } else {
      const coords = await geocodeCity(city);
      lat = coords.lat;
      lon = coords.lon;
      console.log('Using geocoded coords:', lat, lon);
    }
    
    let aqiData;
    try {
      console.log('Fetching OpenWeather AQI...');
      aqiData = await fetchAQIOpenWeather(lat, lon);
      console.log('OpenWeather AQI success:', aqiData);
    } catch (err) {
      console.log('Falling back to AQICN API:', err.message);
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
    console.log('Sending response:', response);
    res.json(response);
  } catch (err) {
    console.error('AQI endpoint error:', err.message);
    if (err.message === 'City not found') {
      return res.status(404).json({ error: 'City not found' });
    }
    res.status(500).json({ error: 'Unable to fetch AQI data' });
  }
});

// GET /api/cities
app.get('/api/cities', (req, res) => {
  // Return a list of supported cities (can be expanded)
  const cities = ['New Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Chennai', 'Pune', 'Hyderabad', 'Jaipur'];
  res.json(cities);
});

// GET /api/heatmap
app.get('/api/heatmap', async (req, res) => {
  const cities = ['New Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Chennai'];
  try {
    const heatmapData = await Promise.all(
      cities.map(async (city) => {
        try {
          const { lat, lon } = await geocodeCity(city);
          let aqiData;
          try {
            aqiData = await fetchAQIOpenWeather(lat, lon);
          } catch {
            aqiData = await fetchAQIAQICN(city);
          }
          return {
            city,
            lat,
            lon,
            aqi: aqiData.aqi,
          };
        } catch {
          return { city, lat: null, lon: null, aqi: null };
        }
      })
    );
    res.json(heatmapData);
  } catch (err) {
    console.error('Heatmap endpoint error:', err.message);
    res.status(500).json({ error: 'Unable to fetch heatmap data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
