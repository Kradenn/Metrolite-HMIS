
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

const SpendTrendChart: React.FC<{ lpoData: number[]; paymentData: number[]; labels: string[] }> = ({ lpoData, paymentData, labels }) => {
    const max = Math.max(...lpoData, ...paymentData) * 1.2 || 10;
    
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

                {/* LPO Layer */}
                <path d={`M0,100 ${makePoints(lpoData)} 100,100 Z`} fill="url(#gradLpo)" className="transition-all duration-500" />
                <polyline points={makePoints(lpoData)} fill="none" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />

                {/* Payment Layer */}
                <polyline points={makePoints(paymentData)} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4" vectorEffect="non-scaling-stroke" />

                <defs>
                    <linearGradient id="gradLpo" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0d9488" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between text-[8px] text-gray-400 font-bold uppercase pt-2">
                {labels.map((l, i) => <span key={i} className="hidden sm:inline">{l}</span>)}
            </div>
            <div className="absolute top-0 right-0 flex space-x-3 bg-white/90 p-1.5 rounded border border-gray-100 shadow-sm backdrop-blur-sm">
                 <div className="flex items-center text-[9px] font-bold text-gray-600"><span className="w-2 h-2 rounded-full bg-teal-600 mr-1"></span> LPO Issued</div>
                 <div className="flex items-center text-[9px] font-bold text-gray-600"><span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span> Paid</div>
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
                 <span className="block text-xl font-black text-gray-800">100%</span>
                 <span className="text-[8px] text-gray-400 font-bold uppercase">Spend</span>
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

const ProcurementDashboard: React.FC = () => {
    const [period, setPeriod] = useState('This Month');
    const [category, setCategory] = useState('All Categories');
    const [dateRange, setDateRange] = useState({
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [aiInsight, setAiInsight] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    // --- Dynamic Data State ---
    const [metrics, setMetrics] = useState({
        totalSpend: { value: 'KES 0', sub: 'Committed LPOs', trend: '0%', data: [0] },
        openOrders: { value: '0', sub: 'Pending Delivery', trend: '0%', data: [0] },
        suppliers: { value: '0', sub: 'Active Vendors', trend: '0%', data: [0] },
        leadTime: { value: '0 Days', sub: 'Order to GRN', trend: '0%', data: [0] },
        chart: { lpo: [0], payment: [0], labels: [''] },
        categorySplit: [{ label: '', value: 0, color: '' }],
        topSuppliers: [{ name: '', value: 0 }]
    });

    const generateData = () => {
        // Modifiers
        const isPharma = category === 'Pharmaceuticals';
        const mult = isPharma ? 0.7 : 1;
        
        let labels: string[] = [];
        let lpo: number[] = [];
        let payment: number[] = [];
        
        // Mock Chart Data
        if (period === 'This Week') {
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            lpo = [50, 80, 45, 90, 60, 20, 10].map(v => Math.floor(v * mult * 1000));
            payment = [40, 60, 50, 70, 55, 10, 5].map(v => Math.floor(v * mult * 1000));
        } else if (period === 'This Month') {
            labels = ['W1', 'W2', 'W3', 'W4'];
            lpo = [350, 420, 280, 500].map(v => Math.floor(v * mult * 1000));
            payment = [300, 380, 250, 450].map(v => Math.floor(v * mult * 1000));
        } else {
             labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
             lpo = [1.2, 1.5, 1.1, 1.8, 1.6, 1.9].map(v => Math.floor(v * mult * 1000000));
             payment = [1.1, 1.3, 1.0, 1.6, 1.5, 1.7].map(v => Math.floor(v * mult * 1000000));
        }

        const totalSpend = lpo.reduce((a, b) => a + b, 0);
        
        setMetrics({
            totalSpend: { 
                value: `KES ${(totalSpend/1000).toLocaleString()}K`, 
                sub: 'Total LPO Value', 
                trend: '+8.2%', 
                data: lpo 
            },
            openOrders: { 
                value: Math.floor(14 * mult).toString(), 
                sub: 'Awaiting Delivery', 
                trend: '-2%', 
                data: [12, 15, 13, 14, 14] 
            },
            suppliers: { 
                value: Math.floor(28 * mult).toString(), 
                sub: 'Vendors Engaged', 
                trend: '+5%', 
                data: [20, 22, 25, 26, 28] 
            },
            leadTime: { 
                value: '4.2 Days', 
                sub: 'Avg Delivery Time', 
                trend: '-10%', 
                data: [5, 4.8, 4.5, 4.3, 4.2] 
            },
            chart: { lpo, payment, labels },
            categorySplit: [
                { label: 'Pharma', value: 55, color: '#0d9488' },
                { label: 'Medical', value: 25, color: '#3b82f6' },
                { label: 'General', value: 15, color: '#f59e0b' },
                { label: 'IT/Assets', value: 5, color: '#6366f1' }
            ],
            topSuppliers: [
                { name: 'MedSurg Supplies', value: 1200000 },
                { name: 'Harleys Ltd', value: 850000 },
                { name: 'Phillips Pharma', value: 620000 },
                { name: 'Crown Healthcare', value: 450000 }
            ]
        });
        setAiInsight('');
    };

    useEffect(() => {
        generateData();
    }, [period, category, dateRange]);

    const handleGenerateInsight = async () => {
        setIsAiLoading(true);
        try {
            // Fixed: Directly use process.env.API_KEY as per coding guidelines.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `As a Procurement Officer, analyze this data for ${category} (${period}):
            - Total Spend: ${metrics.totalSpend.value}
            - Open Orders: ${metrics.openOrders.value}
            - Avg Lead Time: ${metrics.leadTime.value}
            - Top Supplier: ${metrics.topSuppliers[0].name} (Value: ${metrics.topSuppliers[0].value})
            
            Provide 1 insight on spending efficiency and 1 recommendation for supplier negotiation or inventory optimization.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { systemInstruction: "Be professional, concise, and business-oriented." }
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
      {/* Filters Bar */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center text-xl">
               <i className="fa fa-shopping-cart"></i>
            </div>
            <div>
               <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Procurement Hub</h2>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Spend & Supplier Analytics</p>
            </div>
         </div>
         
         <div className="flex flex-wrap items-center gap-3">
             <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-teal-500"
             >
                <option>All Categories</option>
                <option>Pharmaceuticals</option>
                <option>Medical Equipment</option>
                <option>General Supplies</option>
             </select>
             
             <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2 focus-within:ring-1 focus-within:ring-teal-500 transition-shadow">
                <select 
                   value={period} 
                   onChange={(e) => setPeriod(e.target.value)} 
                   className="bg-transparent text-gray-700 text-xs font-bold py-2 outline-none uppercase"
                >
                   <option>This Week</option>
                   <option>This Month</option>
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

             <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-xs font-black uppercase shadow hover:bg-teal-700 transition">
                <i className="fa fa-download mr-1"></i> Report
             </button>
         </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <KPICard 
            title="Total Spend (LPO)" 
            value={metrics.totalSpend.value} 
            subValue={metrics.totalSpend.sub} 
            trend={metrics.totalSpend.trend} 
            isPos={true} 
            icon="fa-file-invoice-dollar" 
            colorClass="bg-teal-500" 
            data={metrics.totalSpend.data}
         />
         <KPICard 
            title="Open Orders" 
            value={metrics.openOrders.value} 
            subValue={metrics.openOrders.sub} 
            trend={metrics.openOrders.trend} 
            isPos={false} 
            icon="fa-clock" 
            colorClass="bg-orange-500" 
            data={metrics.openOrders.data}
         />
         <KPICard 
            title="Active Suppliers" 
            value={metrics.suppliers.value} 
            subValue={metrics.suppliers.sub} 
            trend={metrics.suppliers.trend} 
            isPos={true} 
            icon="fa-truck" 
            colorClass="bg-blue-500" 
            data={metrics.suppliers.data}
         />
         <KPICard 
            title="Avg Lead Time" 
            value={metrics.leadTime.value} 
            subValue={metrics.leadTime.sub} 
            trend={metrics.leadTime.trend} 
            isPos={false} 
            icon="fa-stopwatch" 
            colorClass="bg-purple-500" 
            data={metrics.leadTime.data}
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Main Chart */}
         <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
               <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest">Spend Trend (LPO vs Payments)</h6>
               <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">{period}</span>
            </div>
            <SpendTrendChart lpoData={metrics.chart.lpo} paymentData={metrics.chart.payment} labels={metrics.chart.labels} />
         </div>

         {/* Breakdown & Top Suppliers */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
               <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-2 text-center">Spend By Category</h6>
               <DonutChart data={metrics.categorySplit} />
               <div className="mt-4 space-y-2">
                   {metrics.categorySplit.map((d, i) => (
                       <div key={i} className="flex justify-between text-[10px] font-bold text-gray-600">
                           <div className="flex items-center">
                               <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: d.color }}></span>
                               <span>{d.label}</span>
                           </div>
                           <span>{d.value}%</span>
                       </div>
                   ))}
               </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
               <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-4">Top Suppliers (Spend)</h6>
               <div className="space-y-3">
                  {metrics.topSuppliers.map((item, i) => (
                     <div key={i}>
                        <div className="flex justify-between text-[10px] font-bold text-gray-600 mb-1">
                           <span className="truncate">{item.name}</span>
                           <span className="text-teal-600">{(item.value / 1000).toFixed(0)}k</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                           <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${(item.value / metrics.topSuppliers[0].value) * 100}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* AI Analyst */}
      <div className="bg-[#1e293b] rounded-xl shadow-lg p-6 relative overflow-hidden text-white">
         <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
             <div className="flex-1">
                 <h5 className="text-sm font-black uppercase tracking-widest text-teal-400 mb-2 flex items-center">
                    <i className="fa fa-robot mr-2"></i> Procurement Strategy AI
                 </h5>
                 {isAiLoading ? (
                    <div className="flex items-center space-x-2 text-xs text-gray-400 py-4">
                        <i className="fa fa-circle-notch fa-spin"></i>
                        <span>Analyzing spend patterns...</span>
                    </div>
                 ) : aiInsight ? (
                    <div className="prose prose-sm prose-invert max-w-none text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {aiInsight}
                    </div>
                 ) : (
                    <p className="text-xs text-gray-400 leading-relaxed max-lg">
                       Identify cost-saving opportunities, analyze supplier performance risks, and optimize your procurement cycles with AI-driven insights.
                    </p>
                 )}
             </div>
             <button 
                onClick={handleGenerateInsight}
                disabled={isAiLoading}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
             >
                {isAiLoading ? 'Thinking...' : 'Analyze Spend'}
             </button>
         </div>
         <i className="fa fa-dolly-flatbed absolute -right-6 -bottom-6 text-9xl text-white/5 rotate-12"></i>
      </div>
    </div>
  );
};

export default ProcurementDashboard;
