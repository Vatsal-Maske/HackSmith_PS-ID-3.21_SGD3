import Card from './Card.jsx';
import { Activity, Shield, ShieldAlert, Wind, CheckCircle } from 'lucide-react';

export default function RiskAnalysisPanel({ aqi }) {
    // Logic: Calculate Risk Level & Theme
    // Default: Low Risk (0-100)
    let riskLevel = 'Low Risk';
    let riskColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    let icon = <CheckCircle size={32} className="text-emerald-600" />;
    let message = 'Air quality is satisfactory. Safe for outdoor activities.';
    let precautions = ['Ventilate your home', 'Enjoy outdoor sports', 'No mask needed'];
    let progressColor = 'bg-emerald-500';

    if (aqi > 300) {
        riskLevel = 'Severe Risk';
        riskColor = 'text-rose-900 bg-rose-100 border-rose-300';
        icon = <ShieldAlert size={32} className="text-rose-600" />;
        message = 'Health warning: Emergency conditions. Serious risk of respiratory effects.';
        precautions = ['Avoid all outdoor exertion', 'Keep windows closed', 'Use air purifiers', 'Wear N95 masks if outside'];
        progressColor = 'bg-rose-600';
    } else if (aqi > 200) {
        riskLevel = 'High Risk';
        riskColor = 'text-purple-900 bg-purple-100 border-purple-300';
        icon = <ShieldAlert size={32} className="text-purple-600" />;
        message = 'Health alert: The risk of health effects is increased for everyone.';
        precautions = ['Limit outdoor exertion', 'Wear a mask outdoors', 'Run air purifier on high', 'Avoid heavy traffic areas'];
        progressColor = 'bg-purple-600';
    } else if (aqi > 100) {
        riskLevel = 'Moderate Risk';
        riskColor = 'text-amber-800 bg-amber-50 border-amber-200';
        icon = <Shield size={32} className="text-amber-500" />;
        message = 'Members of sensitive groups may experience health effects.';
        precautions = ['Sensitive groups: limit outdoor exertion', 'Monitor symptoms', 'Keep medicine handy if asthmatic'];
        progressColor = 'bg-amber-500';
    }

    // Calculate percentage for progress bar (cap at 100% for 500 AQI scale)
    const percentage = Math.min((aqi / 500) * 100, 100);

    return (
        <Card className="flex flex-col bg-white shadow-lg border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <Activity size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Disease Risk Analysis</h3>
                        <p className="text-xs text-slate-500 font-medium">Respiratory Health Impact Estimation</p>
                    </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                    Live Analysis
                </div>
            </div>

            <div className="p-6">
                {/* Main Alert Card */}
                <div className={`rounded-2xl border p-6 ${riskColor} relative overflow-hidden transition-all duration-300`}>
                    <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">

                        {/* Left: Icon & Level */}
                        <div className="flex-shrink-0 flex items-center gap-4">
                            <div className="bg-white/80 p-3 rounded-2xl shadow-sm backdrop-blur-sm">
                                {icon}
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider opacity-70 mb-1">Current Risk</p>
                                <h2 className="text-3xl font-black tracking-tight">{riskLevel}</h2>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden md:block w-px h-16 bg-current opacity-10 mx-2"></div>

                        {/* Right: Message & AQI */}
                        <div className="flex-grow w-full">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-semibold opacity-90 leading-relaxed max-w-lg">
                                        {message}
                                    </p>
                                </div>
                                <div className="text-right ml-4">
                                    <p className="text-[10px] font-bold uppercase opacity-60">AQI Index</p>
                                    <p className="text-4xl font-black leading-none tracking-tighter">{aqi}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background decoration */}
                    <Wind className="absolute -bottom-4 -right-4 w-32 h-32 opacity-5 pointer-events-none rotate-12" />
                </div>

                {/* Progress Bar */}
                <div className="mt-8 mb-6">
                    <div className="flex justify-between text-xs font-medium text-slate-400 mb-2">
                        <span>Good (0)</span>
                        <span>Severe (500+)</span>
                    </div>
                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner ring-1 ring-slate-200">
                        <div
                            className={`h-full ${progressColor} transition-all duration-1000 ease-out relative`}
                            style={{ width: `${percentage}%` }}
                        >
                            <div className="absolute top-0 right-0 h-full w-1 bg-white/30 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Precautions Grid */}
                <div className="mt-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Shield size={14} className="text-slate-400" />
                        Recommended Precautions
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {precautions.map((item, idx) => (
                            <div key={idx} className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${progressColor}`}></div>
                                <span className="text-sm font-medium text-slate-600 leading-tight">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
}
