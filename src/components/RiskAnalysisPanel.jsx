import Card from './Card.jsx';
import { Activity, Heart, Wind, Info, ShieldAlert } from 'lucide-react';

export default function RiskAnalysisPanel() {
    return (
        <Card className="flex flex-col h-full bg-white shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-start gap-4">
                <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600 shrink-0">
                    <Activity size={22} />
                </div>
                <div>
                    <h3 className="text-base font-bold text-slate-800">Disease Risk Analysis</h3>
                    <p className="text-xs text-slate-500 mt-1">Shows estimated respiratory health risk based on AQI data</p>
                </div>
            </div>

            <div className="p-6 flex flex-col gap-6">

                {/* Info Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Card 1: Asthma Risk */}
                    <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-4">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Wind size={48} className="text-amber-500" />
                        </div>
                        <div className="flex flex-col h-full">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Asthma Risk</span>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg font-bold text-slate-800">Medium</span>
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold border border-amber-200">
                                    ALERT
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-auto pt-2">Increased sensitivity expected</p>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-400"></div>
                    </div>

                    {/* Card 2: Heart Risk */}
                    <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-4">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Heart size={48} className="text-emerald-500" />
                        </div>
                        <div className="flex flex-col h-full">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Heart Risk</span>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg font-bold text-slate-800">Low</span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                                    SAFE
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-auto pt-2">No significant impact detected</p>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-500"></div>
                    </div>

                    {/* Card 3: Overall Health Index */}
                    <div className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 p-4">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldAlert size={48} className="text-orange-500" />
                        </div>
                        <div className="flex flex-col h-full">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Health Index</span>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg font-bold text-slate-800">Moderate</span>
                                <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold border border-orange-200">
                                    CAUTION
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-auto pt-2">General population likely safe</p>
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500"></div>
                    </div>

                </div>

                {/* Description Panel */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex gap-3">
                    <Info size={18} className="text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600 leading-relaxed">
                        This section analyzes real-time AQI constituents (PM2.5, PM10, NO2) to estimate potential health impacts.
                        Vulnerable groups such as children, the elderly, and those with pre-existing conditions should monitor these levels closely.
                    </p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 pt-2 border-t border-slate-50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Risk Levels</div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm"></span>
                            <span className="text-xs font-medium text-slate-600">Low</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm"></span>
                            <span className="text-xs font-medium text-slate-600">Medium</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm"></span>
                            <span className="text-xs font-medium text-slate-600">High</span>
                        </div>
                    </div>
                </div>

            </div>
        </Card>
    );
    {/* Updated Layout */ }
}
