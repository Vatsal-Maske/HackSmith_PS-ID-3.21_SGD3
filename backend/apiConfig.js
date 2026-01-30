// Air Quality & Respiratory Risk Dashboard — API Configuration
// Base URLs only - keys are in .env file

module.exports = {
  OPENWEATHER_BASE: "https://api.openweathermap.org/data/2.5/air_pollution",
  OPENWEATHER_HISTORY: "https://api.openweathermap.org/data/2.5/air_pollution/history",
  AQICN_BASE: "https://api.waqi.info/feed",
  OPENCAGE_BASE: "https://api.opencagedata.com/geocode/v1/json",
  HEALTH_RISK_API: "https://example-health-api.com/risk?aqi={AQI}"
};
