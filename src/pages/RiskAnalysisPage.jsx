import { useEffect, useState } from 'react';
import RiskAnalysisPanel from '../components/RiskAnalysisPanel.jsx';
import { fetchAQI } from '../api/client.js';

export default function RiskAnalysisPage({ city }) {
    const [aqi, setAqi] = useState(0);

    useEffect(() => {
        fetchAQI(city || 'New Delhi').then(data => setAqi(data.aqi));
    }, [city]);

    return (
        <div className="h-full w-full p-6">
            <RiskAnalysisPanel aqi={aqi} />
        </div>
    );
}
