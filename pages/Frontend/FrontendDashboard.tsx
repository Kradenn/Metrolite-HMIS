
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

// --- Reusable Dashboard Components ---

const MiniTrend: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${40 - ((v - min) / range) * 40}`).join(' ');
    return (
        <svg width="60" height="40" className="overflow-visible">
            <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};

const PerformanceChart: React.FC<{ data: number[]; labels: string[] }> = ({ data, labels }) => {
    const max = Math.max(...data) * 1.2 || 100;
    const makePoints = (d: number[]) => d.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - (val / max) * 100}`).join(' ');

    return (
        <div className="relative h-64 w-full">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="gradVisitors" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <line x1="0" y1="25" x2="100" y2="25" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="#f1f5f9" strokeWidth="0.5" />
                <path d={`M0,100 ${makePoints(data)} 100,100 Z`} fill="url(#gradVisitors)" />
                <polyline points={makePoints(data)} fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between text-[8px] text-gray-400 font-bold uppercase pt-2">
                {labels.map((l, i) => <span key={i}>{l}</span>)}
            </div>
        </div>
    );
};

const FrontendDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [timeframe, setTimeframe] = useState('Last 7 Days');

    const stats = [
        { label: 'Total Sessions', value: '45.2k', trend: '+12.4%', color: '#4f46e5', data: [30, 45, 32, 50, 48, 65, 55] },
        { label: 'Avg. Duration', value: '4m 12s', trend: '+2.1%', color: '#0d9488', data: [10, 15, 12, 18, 24, 22, 28] },
        { label: 'Bounce Rate', value: '32.4%', trend: '-4.2%', color: '#ef4444', data: [40, 35, 38, 30, 32, 28, 32] },
        { label: 'Conversions', value: '842', trend: '+15.8%', color: '#8b5cf6', data: [5, 12, 8, 15, 14, 20, 18] },
    ];

    const quickLinks = [
        { title: 'Page Content', path: '/frontend/content', icon: 'fa-edit', color: 'bg-blue-500', desc: 'Edit home & landing pages' },
        { id: 'blog', title: 'Blog Manager', path: '/frontend/blog', icon: 'fa-pen-nib', color: 'bg-emerald-500', desc: 'Articles & health tips' },
        { title: 'Event Manager', path: '/frontend/events', icon: 'fa-calendar-star', color: 'bg-purple-500', desc: 'Public camps & webinars' },
        { title: 'Site Settings', path: '/frontend/config', icon: 'fa-cog', color: 'bg-slate-700', desc: 'SEO & Brand Identity' },
    ];

    const generateAiReport = async () => {
        setIsAiLoading(true);
        try {
            // Fixed: Directly use process.env.API_KEY as per coding guidelines.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Analyze these website metrics for UltraHub Hospital:
            - Traffic: 45,200 sessions (+12% growth)
            - Bounce Rate: 32%
            - Top Conversion: "Book Appointment" (68% of conversions)
            
            Provide 2 professional clinical marketing recommendations.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { systemInstruction: "You are a Digital Marketing Strategist for a Hospital." }
            });
            setAiInsight(response.text || "Report generated.");
        } catch (e) {
            setAiInsight("AI Engine offline.");
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="animate-bottom space-y-6">
            {/* Header / Global Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm gap-4">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl shadow-lg">
                        <i className="fa fa-chart-network"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Public Website Dashboard</h2>
                        <p className="text-xs text-gray-500 font-medium tracking-wide">Manage your digital patient experience</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <select 
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option>Today</option>
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </select>
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition">
                        <i className="fa fa-sync-alt mr-2"></i> Real-time Refresh
                    </button>
                </div>
            </div>

            {/* Quick Access Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickLinks.map((link) => (
                    <Link key={link.path} to={link.path} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-xl transition-all group hover:-translate-y-1">
                        <div className={`w-10 h-10 ${link.color} text-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                            <i className={`fa ${link.icon}`}></i>
                        </div>
                        <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{link.title}</h4>
                        <p className="text-[10px] text-gray-400 font-medium mt-1 leading-tight">{link.desc}</p>
                    </Link>
                ))}
            </div>

            {/* KPI Sparkline Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                                <h3 className="text-2xl font-black text-gray-800">{s.value}</h3>
                            </div>
                            <MiniTrend data={s.data} color={s.color} />
                        </div>
                        <div className={`mt-4 text-[10px] font-bold flex items-center ${s.trend.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                            <i className={`fa fa-arrow-${s.trend.startsWith('+') ? 'up' : 'down'} mr-1`}></i>
                            {s.trend}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Performance Graph */}
                <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-8">
                        <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest">Traffic Flow Analytics</h6>
                    </div>
                    <PerformanceChart data={[45, 52, 48, 61, 59, 72, 68]} labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} />
                </div>

                {/* AI Consult Card */}
                <div className="lg:col-span-4 bg-[#1e293b] text-white rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10">
                        <h5 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4 flex items-center">
                            <i className="fa fa-robot mr-2"></i> AI Marketing Assistant
                        </h5>
                        
                        {isAiLoading ? (
                             <div className="py-8 text-center text-indigo-300">
                                <i className="fa fa-circle-notch fa-spin text-2xl mb-2"></i>
                                <p className="text-[10px] font-bold uppercase tracking-widest">Analyzing engagement...</p>
                             </div>
                        ) : aiInsight ? (
                            <div className="bg-white/5 rounded-xl p-4 text-[11px] text-gray-300 font-medium leading-relaxed mb-4 animate-in fade-in">
                                {aiInsight}
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 mb-6">Ask Gemini to analyze your current traffic patterns and suggest content improvements.</p>
                        )}
                        
                        <button 
                            onClick={generateAiReport}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition"
                        >
                            Get Strategy Insight
                        </button>
                    </div>
                    <i className="fa fa-chart-pie absolute -right-6 -bottom-6 text-9xl text-white/5 rotate-12"></i>
                </div>
            </div>
        </div>
    );
};

export default FrontendDashboard;
