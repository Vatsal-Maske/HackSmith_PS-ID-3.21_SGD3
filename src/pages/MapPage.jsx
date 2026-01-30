import { useEffect, useState } from 'react';
import { fetchAQI, fetchHeatmap } from '../api/client.js';
import MapPanel from '../components/MapPanel.jsx';

export default function MapPage({ city }) {
    const [aqiData, setAqiData] = useState(null);
    const [heatmapData, setHeatmapData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError(null);
                // Fetch data for the map
                const [aqi, heatmap] = await Promise.all([
                    fetchAQI(city || 'New Delhi'),
                    fetchHeatmap(),
                ]);
                setAqiData(aqi);
                setHeatmapData(heatmap);
            } catch (err) {
                setError('Failed to load map data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [city]);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center text-slate-500">
                Loading map data...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full items-center justify-center text-rose-600">
                {error}
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-140px)] min-h-[500px] w-full">
            <MapPanel heatmapData={heatmapData} activeCity={aqiData} />
        </div>
    );
}
