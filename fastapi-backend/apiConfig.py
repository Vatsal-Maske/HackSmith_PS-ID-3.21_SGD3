# Air Quality & Respiratory Risk Dashboard — API Configuration
# Replace YOUR_API_KEY with real keys before production use

# OpenWeatherMap Air Pollution API
# Provides current AQI, PM2.5, PM10, and other pollutants for a given lat/lon
OPENWEATHER_AQI_API = "https://api.openweathermap.org/data/2.5/air_pollution?lat={LAT}&lon={LON}&appid=1c9af2c6e806bc86f0e90c170e1b890e"

# AQICN (World Air Quality Index) API
# Backup AQI source; returns city-level AQI and pollutant breakdown
AQICN_API = "https://api.waqi.info/feed/{CITY}/?token=65f9f59a5d7beb62e2317fbdd6e802ec9a2a02b4"

# OpenCage Geocoding API
# Converts city name to latitude/longitude for AQI lookups
GEOCODE_API = "https://api.opencagedata.com/geocode/v1/json?q={CITY}&key=3fe2d35affa34fc9bc50c85f3e5fdcf0"

# OpenWeatherMap Historical Air Pollution API
# Used for charts: fetch past AQI values for a date range (UNIX timestamps)
HISTORICAL_AQI_API = "https://api.openweathermap.org/data/2.5/air_pollution/history?lat={LAT}&lon={LON}&start={START}&end={END}&appid=f141e726474e491a84990c4ca692fee6"

# Optional Health / Respiratory Risk API
# Returns risk assessment or health guidance based on AQI value
HEALTH_RISK_API = "https://example-health-api.com/risk?aqi={AQI}"
