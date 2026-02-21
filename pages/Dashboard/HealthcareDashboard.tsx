
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

const PatientFlowChart: React.FC<{ opdData: number[]; ipdData: number[]; labels: string[] }> = ({ opdData, ipdData, labels }) => {
    const max = Math.max(...opdData, ...ipdData) * 1.2 || 10;
    
    const makePoints = (data: number[]) => data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (val / max) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="relative h-64 w-full">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="gradOPD" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="gradIPD" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                </defs>
                
                {/* Grid */}
                <line x1="0" y1="25" x2="100" y2="25" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="#f1f5f9" strokeWidth="0.5" />

                {/* OPD Layer */}
                <path d={`M0,100 ${makePoints(opdData)} 100,100 Z`} fill="url(#gradOPD)" className="transition-all duration-500" />
                <polyline points={makePoints(opdData)} fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />

                {/* IPD Layer */}
                <path d={`M0,100 ${makePoints(ipdData)} 100,100 Z`} fill="url(#gradIPD)" className="transition-all duration-500" />
                <polyline points={makePoints(ipdData)} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between text-[8px] text-gray-400 font-bold uppercase pt-2">
                {labels.map((l, i) => <span key={i} className="hidden sm:inline">{l}</span>)}
            </div>
            <div className="absolute top-0 right-0 flex space-x-3 bg-white/90 p-1.5 rounded border border-gray-100 shadow-sm backdrop-blur-sm">
                 <div className="flex items-center text-[9px] font-bold text-gray-600"><span className="w-2 h-2 rounded-full bg-sky-500 mr-1"></span> Outpatient</div>
                 <div className="flex items-center text-[9px] font-bold text-gray-600"><span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span> Admissions</div>
            </div>
        </div>
    );
};

const OccupancyGauge: React.FC<{ value: number }> = ({ value }) => {
    // Semi-circle gauge logic
    const radius = 40;
    const circumference = Math.PI * radius; // Half circle
    const progress = (value / 100) * circumference;
    
    // Color logic
    let color = "#10b981"; // Green
    if (value > 70) color = "#f59e0b"; // Orange
    if (value > 90) color = "#ef4444"; // Red

    return (
        <div className="relative w-full h-32 flex items-end justify-center overflow-hidden">
             <svg viewBox="0 0 100 55" className="w-full h-full overflow-visible">
                 <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
                 <path 
                    d="M 10 50 A 40 40 0 0 1 90 50" 
                    fill="none" 
                    stroke={color} 
                    strokeWidth="10" 
                    strokeLinecap="round" 
                    strokeDasharray={`${progress} ${circumference}`}
                    className="transition-all duration-1000 ease-out"
                 />
             </svg>
             <div className="absolute bottom-0 text-center mb-1">
                 <span className="text-3xl font-black text-gray-800 block leading-none">{value}%</span>
                 <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Occupancy</span>
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

const HealthcareDashboard: React.FC = () => {
  const [period, setPeriod] = useState('This Week');
  const [department, setDepartment] = useState('All Departments');
  const [dateRange, setDateRange] = useState({
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
  });
  const [aiInsight, setAiInsight] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // --- Dynamic Data State ---
  const [metrics, setMetrics] = useState({
      patients: { value: '0', sub: '0 vs last period', trend: '0%', data: [0,0,0] },
      admissions: { value: '0', sub: 'Rate: 0%', trend: '0%', data: [0,0,0] },
      waitTime: { value: '0m', sub: 'Target: <30m', trend: '0%', data: [0,0,0] },
      occupancy: 0,
      readmission: 0,
      chart: { opd: [0], ipd: [0], labels: [''] },
      deptSplit: [{ label: '', value: 0, color: '' }]
  });

  const generateData = () => {
      // Modifiers based on selection
      const deptMult = department === 'All Departments' ? 1 : 0.4;
      const isDaily = period === 'Today';
      
      // 1. Patient Flow Chart Data
      let labels: string[] = [];
      let opd: number[] = [];
      let ipd: number[] = [];
      let totalPts = 0;
      let totalAdm = 0;

      if (isDaily) {
          labels = ['8am', '10am', '12pm', '2pm', '4pm', '6pm'];
          opd = [12, 45, 38, 50, 42, 15].map(v => Math.floor(v * deptMult));
          ipd = [2, 5, 4, 8, 3, 1].map(v => Math.floor(v * deptMult));
      } else if (period === 'This Week') {
          labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          opd = [140, 165, 150, 180, 190, 110, 80].map(v => Math.floor(v * deptMult));
          ipd = [12, 15, 10, 18, 14, 8, 5].map(v => Math.floor(v * deptMult));
      } else {
          labels = ['W1', 'W2', 'W3', 'W4'];
          opd = [600, 650, 580, 700].map(v => Math.floor(v * deptMult));
          ipd = [50, 55, 48, 60].map(v => Math.floor(v * deptMult));
      }

      totalPts = opd.reduce((a, b) => a + b, 0) + ipd.reduce((a, b) => a + b, 0);
      totalAdm = ipd.reduce((a, b) => a + b, 0);
      
      // 2. Metrics Calculation
      const avgWait = isDaily ? 15 : 28; // minutes
      const occ = department === 'Pediatrics' ? 85 : 64; // %
      const readm = department === 'General' ? 4.2 : 2.5; // %
      
      setMetrics({
          patients: { 
              value: totalPts.toLocaleString(), 
              sub: `${isDaily ? '+12' : '+150'} vs prev`, 
              trend: '+5.4%', 
              data: opd 
          },
          admissions: { 
              value: totalAdm.toLocaleString(), 
              sub: `Admission Rate: ${((totalAdm/totalPts)*100).toFixed(1)}%`, 
              trend: '-2.1%', 
              data: ipd 
          },
          waitTime: { 
              value: `${avgWait}m`, 
              sub: 'Target: < 30m', 
              trend: avgWait > 30 ? '+5%' : '-10%', 
              data: [30, 28, 32, 25, avgWait] 
          },
          occupancy: occ,
          readmission: readm,
          chart: { opd, ipd, labels },
          deptSplit: [
              { label: 'General', value: 45, color: 'bg-blue-500' },
              { label: 'Dental', value: 15, color: 'bg-teal-500' },
              { label: 'Pediatrics', value: 25, color: 'bg-pink-500' },
              { label: 'Other', value: 15, color: 'bg-gray-400' }
          ]
      });

      setAiInsight(''); // Reset AI when data changes
  };

  useEffect(() => {
      generateData();
  }, [period, department, dateRange]);

  const handleGenerateAiInsight = async () => {
    setIsAiLoading(true);
    try {
        // Fixed: Directly use process.env.API_KEY as per coding guidelines.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `As a Hospital Operations Manager, analyze these metrics for ${department} (${period}):
        - Total Patients: ${metrics.patients.value}
        - Avg Wait Time: ${metrics.waitTime.value}
        - Bed Occupancy: ${metrics.occupancy}%
        - Readmission Rate: ${metrics.readmission}%
        - Admission Rate: ${metrics.admissions.sub}
        
        Provide a concise operational assessment and 1 key recommendation to improve patient flow or care quality.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { systemInstruction: "Be professional, concise, and healthcare-focused." }
        });
        
        setAiInsight(response.text || "Analysis complete.");
    } catch (error) {
        setAiInsight("AI Service currently unavailable.");
    } finally {
        setIsAiLoading(false);
    }
  };

  return (
    <div className="animate-bottom space-y-6">
      {/* Filters Bar */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center text-xl">
               <i className="fa fa-heartbeat"></i>
            </div>
            <div>
               <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Clinical Operations</h2>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Real-time Analytics</p>
            </div>
         </div>
         
         <div className="flex flex-wrap items-center gap-3">
             <select 
                value={department} 
                onChange={(e) => setDepartment(e.target.value)} 
                className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-cyan-500"
             >
                <option>All Departments</option>
                <option>General</option>
                <option>Pediatrics</option>
                <option>Dental</option>
             </select>
             
             <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2 focus-within:ring-1 focus-within:ring-cyan-500 transition-shadow">
                <select 
                   value={period} 
                   onChange={(e) => setPeriod(e.target.value)} 
                   className="bg-transparent text-gray-700 text-xs font-bold py-2 outline-none uppercase"
                >
                   <option>Today</option>
                   <option>This Week</option>
                   <option>This Month</option>
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

             <button className="bg-cyan-600 text-white px-4 py-2 rounded-lg text-xs font-black uppercase shadow hover:bg-cyan-700 transition">
                <i className="fa fa-download mr-1"></i> Export
             </button>
         </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <KPICard 
            title="Total Patient Visits" 
            value={metrics.patients.value} 
            subValue={metrics.patients.sub} 
            trend={metrics.patients.trend} 
            isPos={true} 
            icon="fa-users" 
            colorClass="bg-cyan-500" 
            data={metrics.patients.data}
         />
         <KPICard 
            title="Avg Wait Time" 
            value={metrics.waitTime.value} 
            subValue={metrics.waitTime.sub} 
            trend={metrics.waitTime.trend} 
            isPos={Number(metrics.waitTime.value.replace('m', '')) < 30} 
            icon="fa-clock" 
            colorClass="bg-orange-500" 
            data={metrics.waitTime.data}
         />
         <KPICard 
            title="Total Admissions" 
            value={metrics.admissions.value} 
            subValue={metrics.admissions.sub} 
            trend={metrics.admissions.trend} 
            isPos={true} 
            icon="fa-procedures" 
            colorClass="bg-blue-500" 
            data={metrics.admissions.data}
         />
         <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-2xl font-black text-gray-800">{metrics.readmission}%</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Readmission Rate</p>
               </div>
               <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-100 text-red-600 text-xl">
                  <i className="fa fa-notes-medical"></i>
               </div>
            </div>
            <div className="mt-4">
               <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                  <div className="bg-red-500 h-1.5 rounded-full" style={{ width: `${Math.min(metrics.readmission * 10, 100)}%` }}></div>
               </div>
               <p className="text-[9px] text-gray-400 font-bold uppercase text-right">Target: &lt; 5%</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Main Chart */}
         <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
               <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest">Patient Flow (OPD vs IPD)</h6>
               <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">{period}</span>
            </div>
            <PatientFlowChart opdData={metrics.chart.opd} ipdData={metrics.chart.ipd} labels={metrics.chart.labels} />
         </div>

         {/* Occupancy & Dept Split */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
               <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-4 text-center">Ward Bed Occupancy</h6>
               <OccupancyGauge value={metrics.occupancy} />
               <div className="flex justify-between text-[10px] font-bold text-gray-500 mt-4 border-t border-gray-100 pt-3">
                  <p>Available: <span className="text-green-600">{100 - metrics.occupancy}%</span></p>
                  <p>Capacity: <span className="text-gray-800">120 Beds</span></p>
               </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
               <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-4">Departmental Split</h6>
               <div className="space-y-3">
                  {metrics.deptSplit.map((d, i) => (
                     <div key={i}>
                        <div className="flex justify-between text-[10px] font-bold text-gray-600 mb-1">
                           <span>{d.label}</span>
                           <span>{d.value}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                           <div className={`h-1.5 rounded-full ${d.color}`} style={{ width: `${d.value}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* AI Operations Analyst */}
      <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 relative overflow-hidden text-white">
         <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
             <div className="flex-1">
                 <h5 className="text-sm font-black uppercase tracking-widest text-cyan-400 mb-2 flex items-center">
                    <i className="fa fa-robot mr-2"></i> AI Operations Analyst
                 </h5>
                 {isAiLoading ? (
                    <div className="flex items-center space-x-2 text-xs text-gray-400 py-4">
                        <i className="fa fa-circle-notch fa-spin"></i>
                        <span>Analyzing {department} operational data...</span>
                    </div>
                 ) : aiInsight ? (
                    <div className="prose prose-sm prose-invert max-w-none text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {aiInsight}
                    </div>
                 ) : (
                    <p className="text-xs text-gray-400 leading-relaxed max-w-lg">
                       Get real-time insights into wait times, occupancy bottlenecks, and readmission risks. The AI analyzes current patterns to suggest resource allocation improvements.
                    </p>
                 )}
             </div>
             <button 
                onClick={handleGenerateAiInsight}
                disabled={isAiLoading}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
             >
                {isAiLoading ? 'Analyzing...' : 'Generate Insights'}
             </button>
         </div>
         <i className="fa fa-chart-network absolute -right-6 -bottom-6 text-9xl text-white/5 rotate-12"></i>
      </div>
    </div>
  );
};

export default HealthcareDashboard;
