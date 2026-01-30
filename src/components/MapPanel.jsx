import { useEffect, useRef } from 'react'
import { Map as MapIcon, Navigation } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import Card from './Card.jsx'

export default function MapPanel({ heatmapData = [], activeCity }) {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    // Prevent double initialization
    if (mapInstanceRef.current) return

    try {
      const map = L.map(mapContainerRef.current, {
        center: [20.5937, 78.9629], // India
        zoom: 5,
        zoomControl: false,
        attributionControl: false
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      mapInstanceRef.current = map
    } catch (error) {
      console.error("Map initialization failed:", error);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Update Markers & View
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Clear existing markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    // Add Heatmap Dots
    heatmapData.forEach(d => {
      if (d.lat && d.lon && d.aqi) {
        const color = d.aqi < 100 ? '#10b981' : d.aqi <= 200 ? '#f59e0b' : '#ef4444'
        const marker = L.circleMarker([d.lat, d.lon], {
          radius: 5,
          fillColor: color,
          color: '#fff',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(map);
        marker.bindPopup(`<b>${d.city}</b><br>AQI: ${d.aqi}`)
        markersRef.current.push(marker)
      }
    })

    // Focus Active City
    if (activeCity?.latitude && activeCity?.longitude) {
      const { latitude, longitude, city, aqi } = activeCity

      // Fly to location
      map.flyTo([latitude, longitude], 12, { duration: 1.5 })

      // Add Pulse Marker (Custom HTML Icon)
      const pulseIcon = L.divIcon({
        className: 'custom-pulse-icon',
        html: `<div style="
            position: relative;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="
               position: absolute;
               width: 100%;
               height: 100%;
               background-color: ${aqi > 200 ? '#ef4444' : aqi > 100 ? '#f59e0b' : '#10b981'};
               border-radius: 50%;
               opacity: 0.75;
               animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></span>
            <span style="
               position: relative;
               width: 10px;
               height: 10px;
               background-color: ${aqi > 200 ? '#ef4444' : aqi > 100 ? '#f59e0b' : '#10b981'};
               border-radius: 50%;
               border: 2px solid white;
            "></span>
          </div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      })

      const mainMarker = L.marker([latitude, longitude], { icon: pulseIcon }).addTo(map)
      mainMarker.bindPopup(`
          <div style="text-align: center;">
            <div style="font-weight: bold; margin-bottom: 2px;">${city}</div>
            <div style="font-size: 10px; color: #64748b;">AQI ${aqi}</div>
          </div>
       `).openPopup()

      markersRef.current.push(mainMarker)
    }

  }, [activeCity, heatmapData])

  return (
    <Card className="flex flex-col h-full bg-white shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <MapIcon size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 leading-none">Air Quality Map</h3>
            <p className="text-xs text-slate-500 mt-1">Live coverage across India</p>
          </div>
        </div>
        {activeCity?.city && (
          <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600 border border-slate-200">
            {activeCity.city}
          </div>
        )}
      </div>

      <div className="flex-1 relative w-full h-[400px] bg-slate-50">
        <div ref={mapContainerRef} className="absolute inset-0 z-0" style={{ minHeight: '400px', width: '100%' }} />
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </Card>
  )
}
