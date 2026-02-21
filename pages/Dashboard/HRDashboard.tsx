
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- Reusable SVG Components ---

const Sparkline: React.FC<{ data: number[]; color: string; isArea?: boolean }> = ({ data, color, isArea }) => {
  const max = Math.max(...data) || 1;
  const min = Math.min(...data) || 0;
  const range = max - min || 1;
  const height = 40;
  const width = 100;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
      {isArea && (
        <path d={`M0,${height} ${points} ${width},${height} Z`} fill="currentColor" className="opacity-10" style={{ color }} />
      )}
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const WorkforceTrendChart: React.FC<{ hires: number[]; exits: number[]; labels: string[] }> = ({ hires, exits, labels }) => {
    const max = Math.max(...hires, ...exits) * 1.2 || 10;
    
    const makePoints = (data: number[]) => data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (val / max) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="relative h-64 w-full">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                {/* Grid */}
                <line x1="0" y1="25" x2="100" y2="25" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="#f1f5f9" strokeWidth="0.5" />

                {/* Hires */}
                <path d={`M0,100 ${makePoints(hires)} 100,100 Z`} fill="url(#gradHires)" className="transition-all duration-500" />
                <polyline points={makePoints(hires)} fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />

                {/* Exits */}
                <polyline points={makePoints(exits)} fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4" vectorEffect="non-scaling-stroke" />

                <defs>
                    <linearGradient id="gradHires" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between text-[8px] text-gray-400 font-bold uppercase pt-2">
                {labels.map((l, i) => <span key={i} className="hidden sm:inline">{l}</span>)}
            </div>
             <div className="absolute top-0 right-0 flex space-x-3 bg-white/90 p-1.5 rounded border border-gray-100 shadow-sm backdrop-blur-sm">
                 <div className="flex items-center text-[9px] font-bold text-gray-600"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> New Hires</div>
                 <div className="flex items-center text-[9px] font-bold text-gray-600"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> Exits</div>
            </div>
        </div>
    );
};

const DonutChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
    const total = data.reduce((acc, cur) => acc + cur.value, 0);
    let cumulativePercent = 0;

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div className="flex items-center justify-center h-40 relative">
            <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }} className="w-32 h-32 overflow-visible">
                {data.map((slice, i) => {
                    const startPercent = cumulativePercent;
                    const slicePercent = slice.value / total;
                    cumulativePercent += slicePercent;
                    const endPercent = cumulativePercent;
                    const [startX, startY] = getCoordinatesForPercent(startPercent);
                    const [endX, endY] = getCoordinatesForPercent(endPercent);
                    const largeArcFlag = slicePercent > 0.5 ? 1 : 0;
                    const pathData = `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
                    return <path key={i} d={pathData} fill={slice.color} stroke="white" strokeWidth="0.05" className="transition-all duration-500 hover:opacity-80" />;
                })}
                <circle cx="0" cy="0" r="0.6" fill="white" />
            </svg>
            <div className="absolute text-center">
                 <span className="block text-xl font-black text-gray-800">{total}</span>
                 <span className="text-[8px] text-gray-400 font-bold uppercase">Staff</span>
            </div>
        </div>
    );
};

const KPICard: React.FC<{ title: string; value: string; subValue: string; trend: string; isPos: boolean; icon: string; colorClass: string; data: number[] }> = ({ title, value, subValue, trend, isPos, icon, colorClass, data }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex justify-between items-start mb-2">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass} bg-opacity-10 text-xl`}>
                <i className={`fa ${icon} ${colorClass.replace('bg-', 'text-')}`}></i>
            </div>
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center ${isPos ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                <i className={`fa ${isPos ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i> {trend}
            </div>
        </div>
        <h3 className="text-2xl font-black text-gray-800 tracking-tight mt-2">{value}</h3>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-3">{title}</p>
        <div className="h-10">
            <Sparkline data={data} color={isPos ? '#10b981' : '#f59e0b'} isArea />
        </div>
        <p className="text-[10px] text-gray-400 mt-2 font-medium border-t border-gray-50 pt-2">{subValue}</p>
    </div>
);

const HRDashboard: React.FC = () => {
    const [period, setPeriod] = useState('This Year');
    const [department, setDepartment] = useState('All Departments');
    const [dateRange, setDateRange] = useState({
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [aiInsight, setAiInsight] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    // --- Data State ---
    const [metrics, setMetrics] = useState({
        headcount: { value: '0', sub: 'Active Employees', trend: '0%', data: [0] },
        attrition: { value: '0%', sub: 'Turnover Rate', trend: '0%', data: [0] },
        absenteeism: { value: '0', sub: 'Avg Days / Emp', trend: '0%', data: [0] },
        cost: { value: 'KES 0', sub: 'Payroll', trend: '0%', data: [0] },
        chart: { hires: [0], exits: [0], labels: [''] },
        deptData: [{ label: '', value: 0, color: '' }],
        gender: { male: 0, female: 0 }
    });

    const generateData = () => {
        // Modifiers
        const isClinic = department === 'Clinical Services';
        const mult = isClinic ? 0.6 : 1;
        
        let labels: string[] = [];
        let hires: number[] = [];
        let exits: number[] = [];
        let totalHeadcount = 245;

        if (period === 'This Month') {
            labels = ['W1', 'W2', 'W3', 'W4'];
            hires = [2, 1, 3, 1].map(v => Math.floor(v * mult));
            exits = [0, 1, 0, 0].map(v => Math.floor(v * mult));
            totalHeadcount = Math.floor(245 * mult);
        } else if (period === 'This Quarter') {
            labels = ['M1', 'M2', 'M3'];
            hires = [5, 8, 4].map(v => Math.floor(v * mult));
            exits = [2, 1, 3].map(v => Math.floor(v * mult));
            totalHeadcount = Math.floor(240 * mult);
        } else {
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            hires = [5, 4, 6, 8, 5, 7, 4, 3, 5, 9, 6, 4].map(v => Math.floor(v * mult));
            exits = [1, 2, 1, 0, 1, 3, 2, 1, 0, 1, 2, 1].map(v => Math.floor(v * mult));
            totalHeadcount = Math.floor(230 * mult);
        }

        const attritionRate = ((exits.reduce((a, b) => a + b, 0) / totalHeadcount) * 100).toFixed(1);
        
        // Department Data
        const deptData = [
            { label: 'Clinical', value: Math.floor(120 * (isClinic ? 1 : 1)), color: '#3b82f6' },
            { label: 'Nursing', value: Math.floor(80 * (isClinic ? 1 : 1)), color: '#10b981' },
            { label: 'Admin', value: Math.floor(30 * (isClinic ? 0 : 1)), color: '#f59e0b' },
            { label: 'Support', value: Math.floor(15 * (isClinic ? 0 : 1)), color: '#6366f1' }
        ].filter(d => d.value > 0);

        setMetrics({
            headcount: { 
                value: totalHeadcount.toString(), 
                sub: 'Total Active Staff', 
                trend: '+4.5%', 
                data: hires.map((h, i) => totalHeadcount - 20 + h - (exits[i] || 0)) 
            },
            attrition: { 
                value: `${attritionRate}%`, 
                sub: 'Annualized Turnover', 
                trend: isClinic ? '+1.2%' : '-0.5%', 
                data: exits 
            },
            absenteeism: { 
                value: '2.4', 
                sub: 'Days / Employee', 
                trend: '-5%', 
                data: [3, 2.8, 2.5, 2.9, 2.4] 
            },
            cost: { 
                value: `KES ${(totalHeadcount * 45000 / 1000000).toFixed(1)}M`, 
                sub: 'Monthly Payroll', 
                trend: '+2.1%', 
                data: [4.2, 4.3, 4.1, 4.4, 4.5] 
            },
            chart: { hires, exits, labels },
            deptData,
            gender: { male: 45, female: 55 }
        });
        setAiInsight('');
    };

    useEffect(() => {
        generateData();
    }, [period, department, dateRange]);

    const handleGenerateInsight = async () => {
        setIsAiLoading(true);
        try {
            // Fixed: Directly use process.env.API_KEY as per coding guidelines.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `As an HR Analyst, review these metrics for ${department} (${period}):
            - Headcount: ${metrics.headcount.value}
            - Attrition Rate: ${metrics.attrition.value}
            - Absenteeism: ${metrics.absenteeism.value} days
            - Hiring: ${metrics.chart.hires.reduce((a,b)=>a+b,0)} new hires
            
            Provide 1 insight on retention and 1 suggestion for improving employee engagement. Keep it brief.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { systemInstruction: "Be professional, concise, and HR-focused." }
            });
            setAiInsight(response.text || "Analysis complete.");
        } catch (error) {
            setAiInsight("AI Service unavailable.");
        } finally {
            setIsAiLoading(false);
        }
    };

  return (
    <div className="animate-bottom space-y-6">
      {/* Header & Filter */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
            <div className="bg-orange-500 text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-lg">
                <i className="fa fa-users"></i>
            </div>
            <div>
                <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Workforce Analytics</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Human Resources</p>
            </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
             <select 
                value={department} 
                onChange={(e) => setDepartment(e.target.value)} 
                className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500"
             >
                <option>All Departments</option>
                <option>Clinical Services</option>
                <option>Administration</option>
                <option>Operations</option>
             </select>
             
             <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2 focus-within:ring-1 focus-within:ring-orange-500 transition-shadow">
                <select 
                   value={period} 
                   onChange={(e) => setPeriod(e.target.value)} 
                   className="bg-transparent text-gray-700 text-xs font-bold py-2 outline-none uppercase"
                >
                   <option>This Month</option>
                   <option>This Quarter</option>
                   <option>This Year</option>
                   <option>Custom Range</option>
                </select>
             </div>

             {/* Calendar Range Selection */}
             {period === 'Custom Range' && (
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2 p-1 gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">From:</span>
                    <input 
                        type="date" 
                        value={dateRange.start}
                        onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                        className="bg-transparent text-gray-700 text-xs font-bold outline-none w-24"
                    />
                    <span className="text-[10px] text-gray-500 font-bold uppercase">To:</span>
                    <input 
                        type="date" 
                        value={dateRange.end}
                        onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                        className="bg-transparent text-gray-700 text-xs font-bold outline-none w-24"
                    />
                </div>
             )}

             <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-xs font-black uppercase shadow hover:bg-orange-700 transition">
                <i className="fa fa-file-export mr-1"></i> Report
             </button>
         </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <KPICard 
            title="Total Headcount" 
            value={metrics.headcount.value} 
            subValue={metrics.headcount.sub} 
            trend={metrics.headcount.trend} 
            isPos={true} 
            icon="fa-id-card" 
            colorClass="bg-blue-600"
            data={metrics.headcount.data}
         />
         <KPICard 
            title="Attrition Rate" 
            value={metrics.attrition.value} 
            subValue={metrics.attrition.sub} 
            trend={metrics.attrition.trend} 
            isPos={false} 
            icon="fa-user-minus" 
            colorClass="bg-red-500"
            data={metrics.attrition.data}
         />
         <KPICard 
            title="Absenteeism" 
            value={metrics.absenteeism.value} 
            subValue={metrics.absenteeism.sub} 
            trend={metrics.absenteeism.trend} 
            isPos={false} 
            icon="fa-calendar-times" 
            colorClass="bg-blue-500"
            data={metrics.absenteeism.data}
         />
         <KPICard 
            title="Payroll Cost" 
            value={metrics.cost.value} 
            subValue={metrics.cost.sub} 
            trend={metrics.cost.trend} 
            isPos={true} 
            icon="fa-money-bill" 
            colorClass="bg-emerald-500"
            data={metrics.cost.data}
         />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
               <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest">Workforce Trends (Hires vs Exits)</h6>
               <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">{period}</span>
            </div>
            <WorkforceTrendChart hires={metrics.chart.hires} exits={metrics.chart.exits} labels={metrics.chart.labels} />
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
               <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-2 text-center">Department Distribution</h6>
               <DonutChart data={metrics.deptData} />
               <div className="mt-4 space-y-2">
                   {metrics.deptData.map((d, i) => (
                       <div key={i} className="flex justify-between text-[10px] font-bold text-gray-600">
                           <div className="flex items-center">
                               <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: d.color }}></span>
                               <span>{d.label}</span>
                           </div>
                           <span>{d.value}</span>
                       </div>
                   ))}
               </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
               <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-4">Gender Diversity</h6>
               <div className="flex items-center h-4 rounded-full overflow-hidden bg-gray-100">
                  <div className="h-full bg-blue-500" style={{ width: `${metrics.gender.male}%` }}></div>
                  <div className="h-full bg-pink-500" style={{ width: `${metrics.gender.female}%` }}></div>
               </div>
               <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-500">
                  <span>Male: {metrics.gender.male}%</span>
                  <span>Female: {metrics.gender.female}%</span>
               </div>
            </div>
         </div>
      </div>

      {/* AI Insight Section */}
      <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 relative overflow-hidden text-white">
         <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
             <div className="flex-1">
                 <h5 className="text-sm font-black uppercase tracking-widest text-orange-400 mb-2 flex items-center">
                    <i className="fa fa-robot mr-2"></i> HR Intelligence
                 </h5>
                 {isAiLoading ? (
                    <div className="flex items-center space-x-2 text-xs text-gray-400 py-4">
                        <i className="fa fa-circle-notch fa-spin"></i>
                        <span>Analyzing workforce patterns...</span>
                    </div>
                 ) : aiInsight ? (
                    <div className="prose prose-sm prose-invert max-w-none text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {aiInsight}
                    </div>
                 ) : (
                    <p className="text-xs text-gray-400 leading-relaxed max-w-lg">
                       Generate AI-driven insights on turnover risks, absenteeism patterns, and strategic recommendations to improve employee retention and engagement.
                    </p>
                 )}
             </div>
             <button 
                onClick={handleGenerateInsight}
                disabled={isAiLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
             >
                {isAiLoading ? 'Thinking...' : 'Analyze Data'}
             </button>
         </div>
         <i className="fa fa-users-cog absolute -right-6 -bottom-6 text-9xl text-white/5 rotate-12"></i>
      </div>
    </div>
  );
};

export default HRDashboard;
