
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- Reusable SVG Chart Components ---

const Sparkline: React.FC<{ data: number[]; color: string; isArea?: boolean }> = ({ data, color, isArea }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
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
        <path
          d={`M0,${height} ${points} ${width},${height} Z`}
          fill="currentColor"
          className="opacity-10"
          style={{ color }}
        />
      )}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const RevenueChart: React.FC<{ revenueData: number[]; expenseData: number[]; labels: string[] }> = ({ revenueData, expenseData, labels }) => {
    const max = Math.max(...revenueData, ...expenseData) * 1.1 || 100; 
    
    const makePoints = (data: number[]) => data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (val / max) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="relative h-64 w-full group">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                {/* Grid Lines */}
                <line x1="0" y1="25" x2="100" y2="25" stroke="#f3f4f6" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#f3f4f6" strokeWidth="0.5" />
                <line x1="0" y1="75" x2="100" y2="75" stroke="#f3f4f6" strokeWidth="0.5" />
                
                {/* Revenue Area */}
                <path d={`M0,100 ${makePoints(revenueData)} 100,100 Z`} fill="url(#gradRevenue)" className="opacity-20 transition-all duration-700 ease-in-out" />
                <polyline points={makePoints(revenueData)} fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="transition-all duration-700 ease-in-out" />
                
                {/* Expense Line */}
                <polyline points={makePoints(expenseData)} fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="transition-all duration-700 ease-in-out" />

                <defs>
                    <linearGradient id="gradRevenue" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#059669" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between text-[8px] text-gray-400 font-bold uppercase pt-2">
                {labels.map((l, i) => <span key={i} className="hidden md:inline">{l}</span>)}
            </div>
            {/* Legend Overlay */}
            <div className="absolute top-0 right-0 flex space-x-4 text-[10px] font-bold uppercase bg-white/80 p-2 rounded border border-gray-100 backdrop-blur-sm shadow-sm">
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-600 mr-2"></span> Income</div>
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> Expense</div>
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
        <div className="flex items-center justify-center h-full relative">
            <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)' }} className="w-32 h-32 overflow-visible">
                {data.map((slice, i) => {
                    const startPercent = cumulativePercent;
                    const slicePercent = slice.value / total;
                    cumulativePercent += slicePercent;
                    const endPercent = cumulativePercent;

                    const [startX, startY] = getCoordinatesForPercent(startPercent);
                    const [endX, endY] = getCoordinatesForPercent(endPercent);
                    const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

                    const pathData = `
                        M 0 0
                        L ${startX} ${startY}
                        A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}
                        Z
                    `;
                    return (
                        <path key={i} d={pathData} fill={slice.color} stroke="white" strokeWidth="0.05" className="transition-all duration-500 hover:opacity-80" />
                    );
                })}
                <circle cx="0" cy="0" r="0.6" fill="white" />
            </svg>
            <div className="absolute text-center">
                 <span className="block text-xl font-black text-gray-800">100%</span>
                 <span className="text-[9px] text-gray-400 font-bold uppercase">Mix</span>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: string; trend: string; isPositive: boolean; icon: string; colorClass: string; chartData: number[] }> = ({ title, value, trend, isPositive, icon, colorClass, chartData }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 group">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-2xl font-black text-gray-800 tracking-tight">{value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass} shadow-sm group-hover:scale-110 transition-transform`}>
                <i className={`fa ${icon} text-white`}></i>
            </div>
        </div>
        <div className="flex justify-between items-end">
            <div className={`text-xs font-bold flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                <i className={`fa ${isPositive ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>
                {trend}
                <span className="text-gray-400 font-medium ml-1 text-[10px] uppercase">vs last period</span>
            </div>
            <div className="w-20 h-10 text-gray-300">
                <Sparkline data={chartData} color={isPositive ? '#059669' : '#dc2626'} isArea />
            </div>
        </div>
    </div>
);


const FinancialDashboard: React.FC = () => {
    // --- APP STATE ---
    const [period, setPeriod] = useState('This Year');
    const [branch, setBranch] = useState('Main Branch');
    const [dateRange, setDateRange] = useState({
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [aiInsight, setAiInsight] = useState<string>('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    
    // --- DYNAMIC DATA STATES ---
    const [kpiData, setKpiData] = useState({
        revenue: { value: 'KES 0', trend: '0%', isPos: true, data: [0,0,0,0,0] },
        expenses: { value: 'KES 0', trend: '0%', isPos: false, data: [0,0,0,0,0] },
        profit: { value: 'KES 0', trend: '0%', isPos: true, data: [0,0,0,0,0] },
        ar: { value: 'KES 0', trend: '0%', isPos: true, data: [0,0,0,0,0] }
    });

    const [chartData, setChartData] = useState({
        revenue: [0],
        expenses: [0],
        labels: ['']
    });

    const [donutData, setDonutData] = useState([
        { label: 'Insurance', value: 1, color: '#3b82f6', percent: '0%' },
        { label: 'Cash', value: 1, color: '#10b981', percent: '0%' },
        { label: 'Corporate', value: 1, color: '#f59e0b', percent: '0%' }
    ]);

    const [liquidityData, setLiquidityData] = useState({
        currentRatio: 2.4,
        dso: 45,
        margin: 22
    });

    const [transactions, setTransactions] = useState([
        { id: 'INV-001', entity: 'Loading...', date: '-', type: '-', amount: 0, status: '-' },
    ]);

    // --- DATA GENERATION LOGIC ---
    const generateDashboardData = () => {
        // Base modifiers
        const isCityCenter = branch === 'City Center';
        const multiplier = isCityCenter ? 0.65 : 1.0;
        
        // 1. CHART & KPI GENERATION
        let newChartLabels: string[] = [];
        let newRevenueSeries: number[] = [];
        let newExpenseSeries: number[] = [];
        let totalRev = 0;
        let totalExp = 0;

        if (period === 'This Month') {
            newChartLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            newRevenueSeries = [1.5, 2.2, 1.8, 2.5].map(v => v * multiplier); // Millions
            newExpenseSeries = [0.8, 1.0, 0.9, 1.1].map(v => v * multiplier);
        } else if (period === 'This Quarter') {
            newChartLabels = ['Month 1', 'Month 2', 'Month 3'];
            newRevenueSeries = [6.5, 7.2, 8.1].map(v => v * multiplier);
            newExpenseSeries = [4.0, 4.5, 5.0].map(v => v * multiplier);
        } else {
            // This Year or Custom Range defaults to a yearly-like trend for demo
            newChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            newRevenueSeries = [4.5, 5.2, 4.8, 6.1, 5.9, 6.5, 7.2, 6.8, 7.5, 8.2, 8.8, 9.5].map(v => v * multiplier);
            newExpenseSeries = [3.0, 3.2, 3.5, 3.8, 3.6, 4.0, 4.2, 4.5, 4.8, 5.0, 5.2, 5.5].map(v => v * multiplier);
        }

        totalRev = newRevenueSeries.reduce((a, b) => a + b, 0);
        totalExp = newExpenseSeries.reduce((a, b) => a + b, 0);
        const netProfit = totalRev - totalExp;
        const arValue = totalRev * 0.15; // Assume 15% outstanding

        // 2. DONUT DATA (PAYER MIX)
        const mix = isCityCenter 
            ? { ins: 35, cash: 50, corp: 15 } 
            : { ins: 60, cash: 25, corp: 15 };
        
        const newDonutData = [
            { label: 'Insurance', value: mix.ins, color: '#3b82f6', percent: `${mix.ins}%` },
            { label: 'Cash / Self', value: mix.cash, color: '#10b981', percent: `${mix.cash}%` },
            { label: 'Corporate', value: mix.corp, color: '#f59e0b', percent: `${mix.corp}%` }
        ];

        // 3. TRANSACTIONS GENERATION
        const entities = isCityCenter 
            ? ['Walk-in Patient', 'Local Pharmacy', 'City Council', 'Equity Bank', 'AON Minet']
            : ['Jubilee Insurance', 'NHIF', 'MedSurg Supplies', 'Kenya Power', 'Britam'];
        
        const newTransactions = Array.from({ length: 5 }).map((_, i) => ({
            id: `${isCityCenter ? 'CC' : 'MB'}-${Math.floor(Math.random() * 10000)}`,
            entity: entities[Math.floor(Math.random() * entities.length)],
            // Use random date between start and end or just current for mock
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }), 
            type: Math.random() > 0.5 ? 'Invoice' : 'Payment',
            amount: Math.floor(Math.random() * 50000) * (Math.random() > 0.7 ? -1 : 1), // Expenses negative
            status: Math.random() > 0.2 ? 'Completed' : 'Pending'
        }));

        // 4. LIQUIDITY RATIOS
        const newLiquidity = {
            currentRatio: isCityCenter ? 1.8 : 2.4, // City center slightly tighter liquidity
            dso: isCityCenter ? 30 : 45, // City center collects faster (cash)
            margin: Math.round((netProfit / totalRev) * 100)
        };

        // UPDATE STATES
        setKpiData({
            revenue: { value: `KES ${totalRev.toFixed(1)}M`, trend: isCityCenter ? '+5.4%' : '+12.5%', isPos: true, data: newRevenueSeries },
            expenses: { value: `KES ${totalExp.toFixed(1)}M`, trend: '+2.1%', isPos: false, data: newExpenseSeries },
            profit: { value: `KES ${netProfit.toFixed(1)}M`, trend: '+8.4%', isPos: true, data: newRevenueSeries.map((r, i) => r - newExpenseSeries[i]) },
            ar: { value: `KES ${arValue.toFixed(1)}M`, trend: '-1.2%', isPos: true, data: newRevenueSeries.map(r => r * 0.15) }
        });
        
        setChartData({ revenue: newRevenueSeries, expenses: newExpenseSeries, labels: newChartLabels });
        setDonutData(newDonutData);
        setTransactions(newTransactions);
        setLiquidityData(newLiquidity);
        
        // Clear old AI insight as context changed
        setAiInsight('');
    };

    useEffect(() => {
        generateDashboardData();
    }, [period, branch, dateRange]);

    const handleGenerateInsight = async () => {
        setIsAiLoading(true);
        try {
            // Fixed: Directly use process.env.API_KEY as per coding guidelines.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Act as a hospital CFO. Analyze this data for ${branch} (${period}):
            - Revenue: ${kpiData.revenue.value} (Trend: ${kpiData.revenue.trend})
            - Expenses: ${kpiData.expenses.value}
            - Net Profit Margin: ${liquidityData.margin}%
            - Payer Mix: Insurance ${donutData[0].value}%, Cash ${donutData[1].value}%
            - Current Ratio: ${liquidityData.currentRatio}
            - Debtor Days: ${liquidityData.dso} days.
            
            Provide a concise executive summary and 2 actionable recommendations to improve cash flow.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    systemInstruction: "You are a financial analyst for a hospital. Be concise, professional, and actionable. Use bullet points."
                }
            });
            
            setAiInsight(response.text || "Insight generation incomplete.");
        } catch (error) {
            setAiInsight("Unable to generate insight. Please check your API key or connection.");
        } finally {
            setIsAiLoading(false);
        }
    };

  return (
    <div className="animate-bottom space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center shadow-lg">
                <i className="fa fa-chart-pie"></i>
            </div>
            <div>
                <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">Financial Overview</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Executive Summary</p>
            </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={branch} 
            onChange={(e) => setBranch(e.target.value)} 
            className="bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
          >
             <option>Main Branch</option>
             <option>City Center</option>
          </select>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-2 focus-within:ring-1 focus-within:ring-blue-500 transition-shadow">
             <i className="fa fa-calendar text-gray-400 text-xs mr-2"></i>
             <select 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)} 
                className="bg-transparent text-gray-700 text-xs font-bold py-2 outline-none"
             >
                <option>This Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
                <option>Custom Range</option>
             </select>
          </div>
          {/* Calendar Range Selection - Only visible when Custom Range is selected */}
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
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-black uppercase shadow hover:bg-blue-700 transition">
             <i className="fa fa-download mr-1"></i> Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard 
            title="Total Revenue" 
            value={kpiData.revenue.value}
            trend={kpiData.revenue.trend} 
            isPositive={kpiData.revenue.isPos} 
            icon="fa-money-bill-wave" 
            colorClass="bg-emerald-500"
            chartData={kpiData.revenue.data}
         />
         <StatCard 
            title="Total Expenses" 
            value={kpiData.expenses.value}
            trend={kpiData.expenses.trend}
            isPositive={!kpiData.expenses.isPos} 
            icon="fa-file-invoice-dollar" 
            colorClass="bg-red-500"
            chartData={kpiData.expenses.data}
         />
         <StatCard 
            title="Net Profit" 
            value={kpiData.profit.value}
            trend={kpiData.profit.trend}
            isPositive={kpiData.profit.isPos} 
            icon="fa-piggy-bank" 
            colorClass="bg-blue-600"
            chartData={kpiData.profit.data}
         />
         <StatCard 
            title="Outstanding AR" 
            value={kpiData.ar.value}
            trend={kpiData.ar.trend}
            isPositive={kpiData.ar.isPos} 
            icon="fa-hand-holding-usd" 
            colorClass="bg-orange-500"
            chartData={kpiData.ar.data}
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Main Chart */}
         <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
               <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest">Revenue vs Expenses ({period})</h6>
               <button className="text-[10px] font-bold text-blue-600 hover:underline uppercase">View Full Report</button>
            </div>
            <RevenueChart revenueData={chartData.revenue} expenseData={chartData.expenses} labels={chartData.labels} />
         </div>

         {/* Breakdown Chart */}
         <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col">
            <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Revenue by Payer ({branch})</h6>
            <div className="flex-1">
               <DonutChart data={donutData} />
            </div>
            <div className="mt-4 space-y-3">
               {donutData.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                     <div className="flex items-center">
                        <span className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                        <span className="font-bold text-gray-600">{item.label}</span>
                     </div>
                     <span className="font-black text-gray-800">{item.percent}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Recent Transactions */}
         <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                 <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest">Recent Transactions</h6>
                 <button className="text-gray-400 hover:text-blue-600"><i className="fa fa-external-link-alt"></i></button>
             </div>
             <div className="overflow-x-auto">
                 <table className="w-full text-left text-[11px]">
                     <thead className="bg-white text-gray-500 font-bold uppercase border-b border-gray-100">
                         <tr>
                             <th className="px-6 py-3">Txn ID</th>
                             <th className="px-6 py-3">Entity / Payer</th>
                             <th className="px-6 py-3">Date</th>
                             <th className="px-6 py-3">Type</th>
                             <th className="px-6 py-3 text-right">Amount</th>
                             <th className="px-6 py-3 text-center">Status</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50 text-gray-600">
                         {transactions.map((t) => (
                             <tr key={t.id} className="hover:bg-blue-50/50 transition-colors">
                                 <td className="px-6 py-3 font-mono text-blue-600 font-bold">{t.id}</td>
                                 <td className="px-6 py-3 font-bold text-gray-800">{t.entity}</td>
                                 <td className="px-6 py-3">{t.date}</td>
                                 <td className="px-6 py-3 uppercase text-[10px] font-bold tracking-wider">{t.type}</td>
                                 <td className={`px-6 py-3 text-right font-black ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                     {t.amount > 0 ? '+' : ''}{Math.abs(t.amount).toLocaleString()}
                                 </td>
                                 <td className="px-6 py-3 text-center">
                                     <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                         t.status === 'Completed' || t.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                     }`}>{t.status}</span>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
         </div>

         {/* AI Insight & Health */}
         <div className="lg:col-span-4 space-y-6">
             {/* AI Insight Card */}
             <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 relative overflow-hidden">
                 <div className="relative z-10">
                     <div className="flex justify-between items-start mb-3">
                         <h6 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest flex items-center">
                             <i className="fa fa-robot mr-2"></i> AI Financial Analyst
                         </h6>
                         {!aiInsight && !isAiLoading && (
                             <button 
                                onClick={handleGenerateInsight} 
                                className="bg-white text-indigo-600 px-3 py-1 rounded text-[9px] font-bold shadow-sm hover:bg-indigo-100 transition uppercase"
                             >
                                Generate
                             </button>
                         )}
                     </div>
                     
                     {isAiLoading ? (
                        <div className="flex items-center space-x-2 text-indigo-400 text-xs py-4">
                            <i className="fa fa-circle-notch fa-spin"></i>
                            <span>Analyzing {branch} data...</span>
                        </div>
                     ) : aiInsight ? (
                        <div className="prose prose-sm text-[11px] text-indigo-800 font-medium leading-relaxed max-h-40 overflow-y-auto custom-scrollbar whitespace-pre-line">
                           {aiInsight}
                        </div>
                     ) : (
                        <p className="text-[11px] text-indigo-400 leading-relaxed font-medium">
                            Click 'Generate' to get AI-powered insights on revenue trends, expense anomalies, and profitability recommendations for {branch}.
                        </p>
                     )}
                 </div>
                 {/* Decorative background icon */}
                 <i className="fa fa-brain absolute -bottom-4 -right-4 text-6xl text-indigo-200/50 rotate-12"></i>
             </div>

             {/* Cash Flow Health */}
             <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                 <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-6">Branch Health Ratios</h6>
                 <div className="space-y-6">
                     <div>
                         <div className="flex justify-between text-xs font-bold mb-1">
                             <span className="text-gray-500">Current Ratio</span>
                             <span className="text-blue-600">{liquidityData.currentRatio}</span>
                         </div>
                         <div className="w-full bg-gray-100 rounded-full h-2">
                             <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min((liquidityData.currentRatio / 3) * 100, 100)}%` }}></div>
                         </div>
                         <p className="text-[10px] text-gray-400 mt-1">Target: &gt; 2.0</p>
                     </div>
                     <div>
                         <div className="flex justify-between text-xs font-bold mb-1">
                             <span className="text-gray-500">Debtor Days (DSO)</span>
                             <span className="text-orange-500">{liquidityData.dso} Days</span>
                         </div>
                         <div className="w-full bg-gray-100 rounded-full h-2">
                             <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min((liquidityData.dso / 60) * 100, 100)}%` }}></div>
                         </div>
                         <p className="text-[10px] text-gray-400 mt-1">Target: &lt; 30 Days</p>
                     </div>
                     <div>
                         <div className="flex justify-between text-xs font-bold mb-1">
                             <span className="text-gray-500">Profit Margin</span>
                             <span className="text-emerald-600">{liquidityData.margin}%</span>
                         </div>
                         <div className="w-full bg-gray-100 rounded-full h-2">
                             <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min(liquidityData.margin * 2, 100)}%` }}></div>
                         </div>
                     </div>
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
