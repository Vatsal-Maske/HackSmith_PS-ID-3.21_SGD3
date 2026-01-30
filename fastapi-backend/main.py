from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
from datetime import datetime
from apiConfig import (
    OPENWEATHER_AQI_API,
    AQICN_API,
    GEOCODE_API,
    HISTORICAL_AQI_API,
    HEALTH_RISK_API
)

app = FastAPI(title="Air Quality & Respiratory Risk Dashboard API")

# Enable CORS for frontend (React UI)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_risk_level(aqi: int) -> dict:
    """Calculate respiratory risk based on AQI."""
    if aqi < 100:
        return {"level": "Low", "message": "Air quality is satisfactory; little to no risk."}
    if aqi <= 200:
        return {"level": "Medium", "message": "Sensitive individuals may experience minor issues."}
    return {"level": "High", "message": "Everyone may begin to experience health effects."}

def format_timestamp() -> str:
    """Return current timestamp as DD/MM/YYYY HH:MM."""
    return datetime.now().strftime("%d/%m/%Y %H:%M")

async def geocode_city(city: str) -> dict:
    """Convert city/area name to latitude/longitude using OpenCage."""
    url = GEOCODE_API.replace("{CITY}", requests.utils.quote(city))
    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        if data.get("results"):
            lat = data["results"][0]["geometry"]["lat"]
            lon = data["results"][0]["geometry"]["lng"]
            return {"lat": lat, "lon": lon}
        raise ValueError("City not found")
    except Exception as e:
        print(f"Geocoding error: {e}")
        raise ValueError("City not found")

async def fetch_aqi_openweather(lat: float, lon: float) -> dict:
    """Fetch AQI from OpenWeatherMap."""
    url = OPENWEATHER_AQI_API.replace("{LAT}", str(lat)).replace("{LON}", str(lon))
    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        if "list" in data and data["list"]:
            comp = data["list"][0].get("components", {})
            return {
                "aqi": data["list"][0]["main"]["aqi"],
                "pm2_5": comp.get("pm2_5", 0),
                "pm10": comp.get("pm10", 0),
            }
        raise ValueError("No AQI data")
    except Exception as e:
        print(f"OpenWeather AQI error: {e}")
        raise

async def fetch_aqi_aqicn(city: str) -> dict:
    """Fetch AQI from AQICN (backup)."""
    url = AQICN_API.replace("{CITY}", requests.utils.quote(city))
    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        if data.get("status") == "ok" and "data" in data:
            iaqi = data["data"].get("iaqi", {})
            return {
                "aqi": data["data"]["aqi"],
                "pm2_5": iaqi.get("pm25", {}).get("v", 0),
                "pm10": iaqi.get("pm10", {}).get("v", 0),
            }
        raise ValueError("AQICN API error")
    except Exception as e:
        print(f"AQICN AQI error: {e}")
        raise

@app.get("/api/aqi")
async def get_aqi(city: str):
    """Get AQI data for a given city or area."""
    if not city:
        raise HTTPException(status_code=400, detail="City query parameter is required")
    try:
        # Geocode city to lat/lon
        coords = await geocode_city(city)
        lat, lon = coords["lat"], coords["lon"]
        # Try OpenWeather first, fallback to AQICN
        try:
            aqi_data = await fetch_aqi_openweather(lat, lon)
        except Exception:
            print("Falling back to AQICN API")
            aqi_data = await fetch_aqi_aqicn(city)
        risk = get_risk_level(aqi_data["aqi"])
        response = {
            "city": city,
            "latitude": lat,
            "longitude": lon,
            "aqi": aqi_data["aqi"],
            "pm2_5": aqi_data["pm2_5"],
            "pm10": aqi_data["pm10"],
            "risk": risk["level"],
            "message": risk["message"],
            "last_updated": format_timestamp(),
        }
        return response
    except ValueError as ve:
        if str(ve) == "City not found":
            raise HTTPException(status_code=404, detail="City not found")
        raise HTTPException(status_code=500, detail="Unable to fetch AQI data")
    except Exception as e:
        print(f"AQI endpoint error: {e}")
        raise HTTPException(status_code=500, detail="Unable to fetch AQI data")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
