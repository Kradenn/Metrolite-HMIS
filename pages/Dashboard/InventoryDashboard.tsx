
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

const MovementChart: React.FC<{ incoming: number[]; outgoing: number[]; labels: string[] }> = ({ incoming, outgoing, labels }) => {
    const max = Math.max(...incoming, ...outgoing) * 1.2 || 10;
    
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

                {/* Incoming Layer */}
                <path d={`M0,100 ${makePoints(incoming)} 100,100 Z`} fill="url(#gradIn)" className="transition-all duration-500" />
                <polyline points={makePoints(incoming)} fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />

                {/* Outgoing Layer */}
                <path d={`M0,100 ${makePoints(outgoing)} 100,100 Z`} fill="url(#gradOut)" className="transition-all duration-500" />
                <polyline points={makePoints(outgoing)} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />

                <defs>
                    <linearGradient id="gradIn" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="gradOut" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between text-[8px] text-gray-400 font-bold uppercase pt-2">
                {labels.map((l, i) => <span key={i} className="hidden sm:inline">{l}</span>)}
            </div>
            <div className="absolute top-0 right-0 flex space-x-3 bg-white/90 p-1.5 rounded border border-gray-100 shadow-sm backdrop-blur-sm">
                 <div className="flex items-center text-[9px] font-bold text-gray-600"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> Received</div>
                 <div className="flex items-center text-[9px] font-bold text-gray-600"><span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span> Consumed</div>
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
                 <span className="text-[8px] text-gray-400 font-bold uppercase">Valuation</span>
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

const InventoryDashboard: React.FC = () => {
    const [period, setPeriod] = useState('This Month');
    const [store, setStore] = useState('All Stores');
    const [dateRange, setDateRange] = useState({
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [aiInsight, setAiInsight] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    // --- Dynamic Data State ---
    const [metrics, setMetrics] = useState({
        stockValue: { value: 'KES 0', sub: 'Total Assets', trend: '0%', data: [0] },
        lowStock: { value: '0', sub: 'Below Reorder', trend: '0%', data: [0] },
        stockOut: { value: '0', sub: 'Critical', trend: '0%', data: [0] },
        expiring: { value: '0', sub: 'Next 30 Days', trend: '0%', data: [0] },
        chart: { incoming: [0], outgoing: [0], labels: [''] },
        categorySplit: [{ label: '', value: 0, color: '' }],
        fastMoving: [{ name: '', qty: 0 }]
    });

    const generateData = () => {
        // Modifiers
        const isMainPharma = store === 'Main Pharmacy';
        const mult = isMainPharma ? 0.6 : 1;
        
        let labels: string[] = [];
        let incoming: number[] = [];
        let outgoing: number[] = [];
        
        // Mock Chart Data
        if (period === 'This Week') {
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            incoming = [50, 20, 80, 40, 60, 10, 5].map(v => Math.floor(v * mult));
            outgoing = [45, 55, 60, 70, 80, 40, 30].map(v => Math.floor(v * mult));
        } else if (period === 'This Month') {
            labels = ['W1', 'W2', 'W3', 'W4'];
            incoming = [200, 350, 150, 400].map(v => Math.floor(v * mult));
            outgoing = [220, 280, 250, 300].map(v => Math.floor(v * mult));
        } else {
             labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
             incoming = [1200, 1500, 1100, 1800, 1600, 1900].map(v => Math.floor(v * mult));
             outgoing = [1100, 1300, 1250, 1400, 1550, 1600].map(v => Math.floor(v * mult));
        }

        const totalVal = 4500000 * mult;
        
        setMetrics({
            stockValue: { 
                value: `KES ${(totalVal/1000000).toFixed(2)}M`, 
                sub: 'Current Valuation', 
                trend: '+2.4%', 
                data: incoming.map(v => v * 1000) 
            },
            lowStock: { 
                value: Math.floor(24 * mult).toString(), 
                sub: 'Items Needs Reorder', 
                trend: '+5%', 
                data: [10, 15, 12, 18, 24] 
            },
            stockOut: { 
                value: Math.floor(5 * mult).toString(), 
                sub: 'Zero Quantity', 
                trend: '-20%', 
                data: [8, 7, 5, 6, 5] 
            },
            expiring: { 
                value: Math.floor(12 * mult).toString(), 
                sub: 'Expiry < 30 Days', 
                trend: '+0%', 
                data: [10, 11, 12, 12, 12] 
            },
            chart: { incoming, outgoing, labels },
            categorySplit: [
                { label: 'Pharma', value: 65, color: '#3b82f6' },
                { label: 'Consumables', value: 25, color: '#10b981' },
                { label: 'Equipment', value: 10, color: '#f59e0b' }
            ],
            fastMoving: [
                { name: 'Paracetamol 500mg', qty: 1200 },
                { name: 'Surgical Gloves', qty: 850 },
                { name: 'Amoxicillin', qty: 600 },
                { name: 'Syringes 5ml', qty: 540 },
                { name: 'Cotton Wool', qty: 300 }
            ]
        });
        setAiInsight('');
    };

    useEffect(() => {
        generateData();
    }, [period, store, dateRange]);

    const handleGenerateInsight = async () => {
        setIsAiLoading(true);
        try {
            // Fixed: Directly use process.env.API_KEY as per coding guidelines.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `As an Inventory Manager, analyze this data for ${store} (${period}):
            - Stock Value: ${metrics.stockValue.value}
            - Low Stock Items: ${metrics.lowStock.value}
            - Stock Outs: ${metrics.stockOut.value}
            - Expiring Soon: ${metrics.expiring.value}
            - Top Mover: ${metrics.fastMoving[0].name} (${metrics.fastMoving[0].qty} units)
            
            Provide 1 actionable insight on restocking and 1 recommendation to reduce waste/expiry.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { systemInstruction: "Be concise, professional, and supply-chain focused." }
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
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xl">
               <i className="fa fa-boxes"></i>
            </div>
            <div>
               <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Inventory Control</h2>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Supply Chain Analytics</p>
            </div>
         </div>
         
         <div className="flex flex-wrap items-center gap-3">
             <select 
                value={store} 
                onChange={(e) => setStore(e.target.value)} 
                className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500"
             >
                <option>All Stores</option>
                <option>Main Pharmacy</option>
                <option>Central Store</option>
                <option>Lab Store</option>
             </select>
             
             <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2 focus-within:ring-1 focus-within:ring-indigo-500 transition-shadow">
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

             <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-black uppercase shadow hover:bg-indigo-700 transition">
                <i className="fa fa-download mr-1"></i> Report
             </button>
         </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <KPICard 
            title="Total Stock Value" 
            value={metrics.stockValue.value} 
            subValue={metrics.stockValue.sub} 
            trend={metrics.stockValue.trend} 
            isPos={true} 
            icon="fa-coins" 
            colorClass="bg-blue-500" 
            data={metrics.stockValue.data}
         />
         <KPICard 
            title="Low Stock Items" 
            value={metrics.lowStock.value} 
            subValue={metrics.lowStock.sub} 
            trend={metrics.lowStock.trend} 
            isPos={false} 
            icon="fa-battery-quarter" 
            colorClass="bg-orange-500" 
            data={metrics.lowStock.data}
         />
         <KPICard 
            title="Stock Out Items" 
            value={metrics.stockOut.value} 
            subValue={metrics.stockOut.sub} 
            trend={metrics.stockOut.trend} 
            isPos={false} 
            icon="fa-times-circle" 
            colorClass="bg-red-500" 
            data={metrics.stockOut.data}
         />
         <KPICard 
            title="Expiring Soon" 
            value={metrics.expiring.value} 
            subValue={metrics.expiring.sub} 
            trend={metrics.expiring.trend} 
            isPos={false} 
            icon="fa-hourglass-half" 
            colorClass="bg-yellow-500" 
            data={metrics.expiring.data}
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Main Chart */}
         <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
               <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest">Stock Movement (In vs Out)</h6>
               <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">{period}</span>
            </div>
            <MovementChart incoming={metrics.chart.incoming} outgoing={metrics.chart.outgoing} labels={metrics.chart.labels} />
         </div>

         {/* Breakdown & Fast Moving */}
         <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
               <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-2 text-center">Value By Category</h6>
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
               <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-4">Fast Moving Items</h6>
               <div className="space-y-3">
                  {metrics.fastMoving.map((item, i) => (
                     <div key={i}>
                        <div className="flex justify-between text-[10px] font-bold text-gray-600 mb-1">
                           <span className="truncate">{item.name}</span>
                           <span>{item.qty} units</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                           <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(item.qty / metrics.fastMoving[0].qty) * 100}%` }}></div>
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
                 <h5 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-2 flex items-center">
                    <i className="fa fa-robot mr-2"></i> Supply Chain Intelligence
                 </h5>
                 {isAiLoading ? (
                    <div className="flex items-center space-x-2 text-xs text-gray-400 py-4">
                        <i className="fa fa-circle-notch fa-spin"></i>
                        <span>Analyzing inventory patterns...</span>
                    </div>
                 ) : aiInsight ? (
                    <div className="prose prose-sm prose-invert max-w-none text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {aiInsight}
                    </div>
                 ) : (
                    <p className="text-xs text-gray-400 leading-relaxed max-w-lg">
                       Get AI-powered recommendations on reorder points, identify dead stock risks, and optimize your procurement strategy based on consumption trends.
                    </p>
                 )}
             </div>
             <button 
                onClick={handleGenerateInsight}
                disabled={isAiLoading}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
             >
                {isAiLoading ? 'Thinking...' : 'Analyze Stock'}
             </button>
         </div>
         <i className="fa fa-box-open absolute -right-6 -bottom-6 text-9xl text-white/5 rotate-12"></i>
      </div>
    </div>
  );
};

export default InventoryDashboard;
