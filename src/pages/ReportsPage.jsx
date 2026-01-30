import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { FileText, Download, History, Clock } from 'lucide-react';
import { fetchAQI } from '../api/client.js';
import Card from '../components/Card.jsx';

export default function ReportsPage({ city }) {
    const [aqiData, setAqiData] = useState(null);
    const [recentReports, setRecentReports] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('recentReports');
        if (saved) {
            try {
                setRecentReports(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse recent reports", e);
            }
        }
    }, []);

    useEffect(() => {
        async function load() {
            if (!city) return;
            try {
                const data = await fetchAQI(city);
                setAqiData(data);
            } catch (e) {
                console.error(e);
            }
        }
        load();
    }, [city]);

    const generatePDF = (dataToPrint = null) => {
        const data = dataToPrint || aqiData;
        if (!data) return;

        const doc = new jsPDF();
        const timestamp = new Date().toLocaleString();

        // 1. Calculate derivatives
        let riskLevel = 'Low';
        let category = 'Good';
        let pollutionStatus = 'Low';
        let precautionLevel = 'Low';
        let healthImpact = 'Air quality is satisfactory.';

        if (data.aqi > 300) {
            riskLevel = 'Severe';
            category = 'Hazardous';
            pollutionStatus = 'High';
            precautionLevel = 'Severe';
            healthImpact = 'Health warning of emergency conditions. The entire population is more likely to be affected.';
        } else if (data.aqi > 200) {
            riskLevel = 'High';
            category = 'Very Unhealthy';
            pollutionStatus = 'High';
            precautionLevel = 'High';
            healthImpact = 'High risk of respiratory diseases. Increased aggravation of heart or lung disease and premature mortality in persons with cardiopulmonary disease and the elderly.';
        } else if (data.aqi > 100) {
            riskLevel = 'Moderate';
            category = 'Unhealthy for Sensitive Groups';
            pollutionStatus = 'Moderate';
            precautionLevel = 'Moderate';
            healthImpact = 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.';
        }

        // 2. Build PDF Content
        // Title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text("Air Quality & Disease Risk Report", 20, 20);

        // Header Info
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Location: ${data.city || city || 'Unknown'}`, 20, 35);
        doc.text(`Date & Time: ${timestamp}`, 20, 42);

        // Section 1: Air Quality Summary
        doc.setFont('helvetica', 'bold');
        doc.text("Air Quality Summary", 20, 55);
        doc.setFont('helvetica', 'normal');
        doc.text(`- AQI Value: ${data.aqi}`, 25, 63);
        doc.text(`- Category: ${category}`, 25, 70);
        doc.text(`- Pollution Status: ${pollutionStatus}`, 25, 77);
        doc.text(`- Recommended Precaution Level: ${precautionLevel}`, 25, 84);

        // Section 2: Disease Risk Analysis
        doc.setFont('helvetica', 'bold');
        doc.text("Disease Risk Analysis", 20, 97);
        doc.setFont('helvetica', 'normal');
        doc.text(`- Overall Risk Level: ${riskLevel}`, 25, 105);
        doc.text(`- Likely Affected Respiratory Diseases: Asthma, Bronchitis, COPD`, 25, 112);

        // Wrap text for health impact
        const splitImpact = doc.splitTextToSize(`- Health Impact: ${healthImpact}`, 170);
        doc.text(splitImpact, 25, 119);

        // Section 3: Health Advisory
        let currentY = 119 + (splitImpact.length * 5) + 8;
        doc.setFont('helvetica', 'bold');
        doc.text("Health Advisory", 20, currentY);
        doc.setFont('helvetica', 'normal');
        currentY += 8;
        doc.text("- Limit outdoor activities", 25, currentY);
        doc.text("- Wear protective masks when outside", 25, currentY + 7);
        doc.text("- Stay indoors during peak pollution hours", 25, currentY + 14);
        doc.text("- Use air purifiers if available", 25, currentY + 21);
        doc.text("- Maintain hydration and healthy nutrition", 25, currentY + 28);

        // Section 4: Data & Source
        currentY += 42;
        doc.setFont('helvetica', 'bold');
        doc.text("Data & Source", 20, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text("- Dashboard heatmap / AQI API", 25, currentY + 7);
        doc.text("- Risk levels determined using AQI thresholds", 25, currentY + 14);

        // Footer / Disclaimer
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100);
        doc.text("Disclaimer: This report is for awareness purposes only and is not a medical diagnosis or advice.", 20, 280);

        const fileName = `Air_Quality_Report_${(data.city || city || 'City').replace(' ', '_')}_${Date.now()}.pdf`;
        doc.save(fileName);

        // Save to Recent IF generating NEW report
        if (!dataToPrint) {
            const newReport = {
                city: data.city || city || 'Unknown',
                aqi: data.aqi,
                date: timestamp,
                id: Date.now()
            };
            const updated = [newReport, ...recentReports].slice(0, 10);
            setRecentReports(updated);
            localStorage.setItem('recentReports', JSON.stringify(updated));
        }
    };

    return (
        <div className="space-y-6 p-6">
            <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Generate Report</h2>
                        <p className="text-sm text-slate-500">Download current air quality status for {city}</p>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="text-sm font-semibold text-slate-700 mb-1">Current Status Overview</p>
                        <p className="text-xs text-slate-500">Includes latest sensors readings and calculated risk analysis.</p>
                    </div>
                    <button
                        onClick={() => generatePDF(null)}
                        disabled={!aqiData}
                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                        <Download size={18} />
                        {aqiData ? 'Download Enhanced Short Report' : 'Loading Data...'}
                    </button>
                </div>
            </Card>

            {recentReports.length > 0 && (
                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <History size={20} className="text-slate-400" />
                        <h3 className="text-lg font-bold text-slate-800">Recently Generated Reports</h3>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {recentReports.map(report => (
                            <div key={report.id} className="py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded text-slate-500">
                                        <FileText size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">{report.city}</p>
                                        <div className="flex items-center gap-1 text-xs text-slate-400">
                                            <Clock size={12} />
                                            <span>{report.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => generatePDF(report)}
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
                                >
                                    Download Again
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
