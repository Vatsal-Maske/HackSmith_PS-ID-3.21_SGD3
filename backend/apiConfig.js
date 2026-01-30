// Air Quality & Respiratory Risk Dashboard — API Configuration
// Replace YOUR_API_KEY with real keys before production use

// OpenWeatherMap Air Pollution API
// Provides current AQI, PM2.5, PM10, and other pollutants for a given lat/lon
const OPENWEATHER_AQI_API = "https://api.openweathermap.org/data/2.5/air_pollution?lat={LAT}&lon={LON}&appid=YOUR_API_KEY";

// AQICN (World Air Quality Index) API
// Backup AQI source; returns city-level AQI and pollutant breakdown
const AQICN_API = "https://api.waqi.info/feed/{CITY}/?token=YOUR_API_KEY";

// OpenCage Geocoding API
// Converts city name to latitude/longitude for AQI lookups
const GEOCODE_API = "https://api.opencagedata.com/geocode/v1/json?q={CITY}&key=YOUR_API_KEY";

// OpenWeatherMap Historical Air Pollution API
// Used for charts: fetch past AQI values for a date range (UNIX timestamps)
const HISTORICAL_AQI_API = "https://api.openweathermap.org/data/2.5/air_pollution/history?lat={LAT}&lon={LON}&start={START}&end={END}&appid=YOUR_API_KEY";

// Optional Health / Respiratory Risk API
// Returns risk assessment or health guidance based on AQI value
const HEALTH_RISK_API = "https://example-health-api.com/risk?aqi={AQI}";

module.exports = {
  OPENWEATHER_AQI_API,
  AQICN_API,
  GEOCODE_API,
  HISTORICAL_AQI_API,
  HEALTH_RISK_API
};
