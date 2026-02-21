
import React, { useState, useEffect } from 'react';

// --- Mock Components for Charts ---
// Note: In a real app, use a library like Recharts or Chart.js. 
// These are lightweight SVG implementations for the UI demo.

const KPICard: React.FC<{ title: string; value: string; trend: number; trendLabel?: string; icon: string; color: string }> = ({ title, value, trend, trendLabel = "vs last period", icon, color }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-2xl font-black text-gray-800">{value}</h3>
      <div className={`flex items-center mt-2 text-xs font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        <i className={`fa ${trend >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>
        <span>{Math.abs(trend)}%</span>
        <span className="text-gray-400 ml-1 font-medium">{trendLabel}</span>
      </div>
    </div>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${color} shadow-lg`}>
      <i className={`fa ${icon}`}></i>
    </div>
  </div>
);

const LineChart: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data) || 100;
  const min = Math.min(...data) || 0;
  const range = max - min || 1;
  
  // Normalize points to fit svg 0-100 height, allowing some padding
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - 0) / (max * 1.1)) * 100; // Scale relative to max with 10% top padding
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full h-full relative group">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        {/* Grid lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="#f3f4f6" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#f3f4f6" strokeWidth="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="#f3f4f6" strokeWidth="0.5" />
        
        {/* The Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          vectorEffect="non-scaling-stroke"
          className="drop-shadow-sm transition-all duration-500 ease-in-out"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Points */}
        {data.map((val, i) => {
           const x = (i / (data.length - 1)) * 100;
           const y = 100 - ((val - 0) / (max * 1.1)) * 100;
           return (
            <circle 
              key={i} 
              cx={x} 
              cy={y} 
              r="3" 
              fill="white"
              stroke={color}
              strokeWidth="1.5"
              className="hover:r-5 transition-all cursor-pointer"
              vectorEffect="non-scaling-stroke"
            >
              <title>{val.toLocaleString()}</title>
            </circle>
           );
        })}
      </svg>
    </div>
  );
};

const BarChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value)) || 100;
  return (
    <div className="h-full flex items-end justify-between space-x-2 pt-6">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end">
          <div className="relative w-full flex justify-center items-end h-full">
             <div 
                className={`w-full max-w-[30px] rounded-t-sm transition-all duration-500 ${d.color} opacity-80 group-hover:opacity-100 relative`} 
                style={{ height: `${(d.value / max) * 100}%` }}
             >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                   {d.value.toLocaleString()}
                </div>
             </div>
          </div>
          <span className="text-[9px] font-bold text-gray-400 mt-2 uppercase truncate w-full text-center" title={d.label}>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const ComparisonReports: React.FC = () => {
  const [reportType, setReportType] = useState('1'); 
  const [loading, setLoading] = useState(false);
  
  // Dynamic Data States
  const [chartTitle, setChartTitle] = useState('Revenue Trend');
  const [chartData, setChartData] = useState<number[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [kpiData, setKpiData] = useState<any[]>([]);
  const [breakdownData, setBreakdownData] = useState<any[]>([]);
  const [reportCategory, setReportCategory] = useState<'Revenue' | 'Clinical'>('Revenue');

  useEffect(() => {
    setLoading(true);
    
    // Simulate data fetch and processing based on selection
    setTimeout(() => {
        let newData: number[] = [];
        let newLabels: string[] = [];
        let newTitle = '';
        let newKpis: any[] = [];
        let newBreakdown: any[] = [];
        let category: 'Revenue' | 'Clinical' = 'Revenue';

        switch(reportType) {
            case '1': // Daily Revenue
                category = 'Revenue';
                newTitle = 'Daily Revenue Trend (Last 7 Days)';
                newData = [150000, 180000, 165000, 210000, 190000, 240000, 220000];
                newLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                newKpis = [
                    { title: 'Today Revenue', value: 'KES 220,000', trend: 12, icon: 'fa-money-bill-wave', color: 'bg-green-500' },
                    { title: 'Avg Daily', value: 'KES 195,000', trend: 5, icon: 'fa-chart-line', color: 'bg-blue-500' },
                    { title: 'Pending Bills', value: 'KES 45,000', trend: -2, icon: 'fa-clock', color: 'bg-orange-500' },
                    { title: 'Cash Ratio', value: '85%', trend: 1, icon: 'fa-percentage', color: 'bg-purple-500' }
                ];
                newBreakdown = [
                    { label: 'Consultation', value: 85000, color: 'bg-blue-500' },
                    { label: 'Pharmacy', value: 65000, color: 'bg-green-500' },
                    { label: 'Lab', value: 45000, color: 'bg-purple-500' },
                    { label: 'Procedures', value: 25000, color: 'bg-orange-500' },
                    { label: 'Other', value: 10000, color: 'bg-gray-400' },
                ];
                break;

            case '2': // Weekly Revenue
                category = 'Revenue';
                newTitle = 'Weekly Revenue Trend (Last 4 Weeks)';
                newData = [1200000, 1450000, 1300000, 1600000];
                newLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                newKpis = [
                    { title: 'This Week', value: 'KES 1.6M', trend: 15, icon: 'fa-calendar-week', color: 'bg-blue-600' },
                    { title: 'Last Week', value: 'KES 1.3M', trend: -5, icon: 'fa-history', color: 'bg-gray-500' },
                    { title: 'Monthly Proj', value: 'KES 6.5M', trend: 8, icon: 'fa-bullseye', color: 'bg-indigo-500' },
                    { title: 'Expenses', value: 'KES 900k', trend: 2, icon: 'fa-file-invoice-dollar', color: 'bg-red-500' }
                ];
                newBreakdown = [
                    { label: 'Inpatient', value: 800000, color: 'bg-teal-500' },
                    { label: 'Outpatient', value: 500000, color: 'bg-cyan-500' },
                    { label: 'Morgue', value: 100000, color: 'bg-slate-500' },
                    { label: 'Maternity', value: 200000, color: 'bg-pink-400' },
                ];
                break;

             case '3': // Monthly Revenue
                category = 'Revenue';
                newTitle = 'Monthly Revenue Trend (Year To Date)';
                newData = [4500000, 5200000, 4800000, 6100000, 5900000, 6500000, 7200000, 6800000, 7500000, 8100000];
                newLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
                newKpis = [
                    { title: 'YTD Revenue', value: 'KES 62.6M', trend: 22, icon: 'fa-globe-africa', color: 'bg-blue-700' },
                    { title: 'Best Month', value: 'Oct (8.1M)', trend: 0, icon: 'fa-trophy', color: 'bg-yellow-500' },
                    { title: 'AR Aging', value: '45 Days', trend: -5, icon: 'fa-hourglass-half', color: 'bg-orange-500' },
                    { title: 'Net Profit', value: '18%', trend: 2, icon: 'fa-chart-pie', color: 'bg-emerald-600' }
                ];
                newBreakdown = [
                    { label: 'NHIF', value: 25000000, color: 'bg-blue-600' },
                    { label: 'Private Ins', value: 20000000, color: 'bg-purple-600' },
                    { label: 'Cash', value: 17600000, color: 'bg-green-600' },
                ];
                break;
            
            case '4': // Yearly Revenue Growth
                category = 'Revenue';
                newTitle = 'Yearly Revenue Growth (Last 5 Years)';
                newData = [50, 65, 72, 85, 98]; // Millions
                newLabels = ['2019', '2020', '2021', '2022', '2023'];
                newKpis = [
                    { title: 'CAGR', value: '18.5%', trend: 2, icon: 'fa-seedling', color: 'bg-green-600' },
                    { title: 'Total Revenue', value: 'KES 98M', trend: 15, icon: 'fa-money-bill', color: 'bg-blue-600' },
                    { title: 'Expansion', value: '2 Branches', trend: 0, icon: 'fa-building', color: 'bg-indigo-600' },
                    { title: 'Staff Growth', value: '+45%', trend: 10, icon: 'fa-users', color: 'bg-orange-600' }
                ];
                newBreakdown = [
                    { label: 'Consultations', value: 30000000, color: 'bg-blue-500' },
                    { label: 'Pharmacy', value: 25000000, color: 'bg-green-500' },
                    { label: 'Lab', value: 20000000, color: 'bg-purple-500' },
                    { label: 'Bed Charges', value: 15000000, color: 'bg-orange-500' },
                ];
                break;
            
            case '5': // Revenue vs Expenses Daily
            case '6': // Revenue vs Expenses Monthly
                category = 'Revenue';
                newTitle = 'Revenue vs Operational Expenses';
                newData = [150, 160, 145, 180, 190, 175, 200]; // Revenue
                // For comparison charts we might handle differently, but here simplifying to one line for demo
                newLabels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
                newKpis = [
                    { title: 'Gross Profit', value: 'KES 250k', trend: 5, icon: 'fa-balance-scale', color: 'bg-blue-500' },
                    { title: 'Opex', value: 'KES 120k', trend: 2, icon: 'fa-file-invoice', color: 'bg-red-500' },
                    { title: 'Net Margin', value: '35%', trend: 1, icon: 'fa-percent', color: 'bg-green-500' },
                    { title: 'Cost Ratio', value: '45%', trend: -1, icon: 'fa-chart-pie', color: 'bg-orange-500' }
                ];
                 newBreakdown = [
                    { label: 'Salaries', value: 50000, color: 'bg-red-500' },
                    { label: 'Supplies', value: 40000, color: 'bg-orange-500' },
                    { label: 'Utilities', value: 15000, color: 'bg-yellow-500' },
                    { label: 'Maint.', value: 5000, color: 'bg-gray-500' },
                ];
                break;

            case '9': // Clinical: Daily OP Visits
                category = 'Clinical';
                newTitle = 'Daily Outpatient Visits';
                newData = [145, 160, 130, 180, 200, 110, 90];
                newLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                newKpis = [
                    { title: 'Total Visits', value: '1,015', trend: 5, icon: 'fa-users', color: 'bg-cyan-600' },
                    { title: 'Avg Wait', value: '25m', trend: -10, trendLabel: "improved", icon: 'fa-stopwatch', color: 'bg-orange-500' },
                    { title: 'New Patients', value: '150', trend: 12, icon: 'fa-user-plus', color: 'bg-green-500' },
                    { title: 'Referrals', value: '12', trend: 0, icon: 'fa-exchange-alt', color: 'bg-purple-500' }
                ];
                newBreakdown = [
                    { label: 'General', value: 450, color: 'bg-blue-500' },
                    { label: 'Dental', value: 120, color: 'bg-teal-500' },
                    { label: 'Eye', value: 80, color: 'bg-indigo-500' },
                    { label: 'MCH', value: 365, color: 'bg-pink-500' },
                ];
                break;
                
            case '10': // Daily Admissions
                category = 'Clinical';
                newTitle = 'Admissions vs Discharges (Daily)';
                newData = [12, 15, 10, 18, 14, 8, 5];
                newLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                newKpis = [
                    { title: 'Admissions', value: '82', trend: 2, icon: 'fa-bed', color: 'bg-blue-600' },
                    { title: 'Discharges', value: '78', trend: 5, icon: 'fa-walking', color: 'bg-green-600' },
                    { title: 'Occupancy', value: '85%', trend: 1, icon: 'fa-procudures', color: 'bg-orange-500' },
                    { title: 'Avg Stay', value: '3.5 Days', trend: -0.2, icon: 'fa-clock', color: 'bg-purple-500' }
                ];
                 newBreakdown = [
                    { label: 'General Male', value: 25, color: 'bg-blue-500' },
                    { label: 'General Female', value: 30, color: 'bg-pink-500' },
                    { label: 'Paeds', value: 15, color: 'bg-yellow-500' },
                    { label: 'Private', value: 12, color: 'bg-purple-500' },
                ];
                break;
                
            case '11': // Avg Length of Stay
                category = 'Clinical';
                newTitle = 'Average Length of Stay (Days)';
                newData = [3.5, 3.2, 3.8, 3.0, 3.1, 3.5];
                newLabels = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
                newKpis = [
                    { title: 'Current ALOS', value: '3.5 Days', trend: 0, icon: 'fa-calendar-day', color: 'bg-blue-600' },
                    { title: 'Target', value: '3.0 Days', trend: -0.5, trendLabel: "gap", icon: 'fa-bullseye', color: 'bg-green-600' },
                    { title: 'Long Stay', value: '5 Pts', trend: 1, icon: 'fa-exclamation-circle', color: 'bg-red-500' },
                    { title: 'Turnover', value: '48 Hrs', trend: 0, icon: 'fa-sync', color: 'bg-indigo-500' }
                ];
                newBreakdown = [
                    { label: 'Surgical', value: 4.5, color: 'bg-red-500' },
                    { label: 'Medical', value: 3.2, color: 'bg-blue-500' },
                    { label: 'Maternity', value: 2.1, color: 'bg-pink-500' },
                    { label: 'Paeds', value: 2.8, color: 'bg-yellow-500' },
                ];
                break;

             default:
                // Default fallback
                category = 'Revenue';
                newTitle = 'Revenue Analysis';
                newData = [100, 150, 120, 200, 180];
                newLabels = ['P1', 'P2', 'P3', 'P4', 'P5'];
                newKpis = [
                     { title: 'Metric 1', value: '-', trend: 0, icon: 'fa-circle', color: 'bg-gray-400' },
                     { title: 'Metric 2', value: '-', trend: 0, icon: 'fa-circle', color: 'bg-gray-400' },
                     { title: 'Metric 3', value: '-', trend: 0, icon: 'fa-circle', color: 'bg-gray-400' },
                     { title: 'Metric 4', value: '-', trend: 0, icon: 'fa-circle', color: 'bg-gray-400' }
                ];
                newBreakdown = [];
        }

        setChartData(newData);
        setChartLabels(newLabels);
        setChartTitle(newTitle);
        setKpiData(newKpis);
        setBreakdownData(newBreakdown);
        setReportCategory(category);
        setLoading(false);
    }, 600);
  }, [reportType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Re-trigger effect by momentarily clearing or just let the effect handle the state
    setLoading(true);
    setTimeout(() => setLoading(false), 500); 
  };

  return (
    <div className="animate-bottom space-y-6">
      {/* Header & Controls */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden sticky top-0 z-10">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h5 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">
            <i className="fa fa-chart-line mr-2 text-blue-600"></i>
            Comparison Reports & Analytics
          </h5>
        </div>
        
        <div className="p-4 bg-white">
            <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-gray-500 uppercase">
                <div className="flex-1 min-w-[250px]">
                    <label className="block mb-1 text-xs">Select Report Type</label>
                    <select 
                        className="w-full p-2.5 border border-gray-300 rounded-lg outline-none bg-gray-50 focus:ring-2 focus:ring-blue-500 transition-all text-gray-700 font-bold"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <optgroup label="Revenue Comparison Reports">
                            <option value="1">Daily Revenue Trend</option>
                            <option value="2">Weekly Revenue Trend</option>
                            <option value="3">Monthly Revenue Trend</option>
                            <option value="4">Yearly Revenue Growth</option>
                            <option value="5">Revenue vs Expenses (Daily)</option>
                            <option value="6">Revenue vs Expenses (Monthly)</option>
                        </optgroup>
                        <optgroup label="Clinical Comparison Reports">
                            <option value="9">Daily Outpatient Visits</option>
                            <option value="10">Daily Admissions vs Discharges</option>
                            <option value="11">Average Length of Stay</option>
                            <option value="12">Daily Bed Occupancy Rate</option>
                        </optgroup>
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <div>
                      <label className="block mb-1">From</label>
                      <input type="date" className="p-2 border border-gray-300 rounded-lg outline-none bg-white font-medium text-gray-700" />
                    </div>
                    <div>
                      <label className="block mb-1">To</label>
                      <input type="date" className="p-2 border border-gray-300 rounded-lg outline-none bg-white font-medium text-gray-700" />
                    </div>
                </div>
                <div className="self-end">
                  <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-2.5 rounded-lg shadow-lg hover:bg-blue-700 transition uppercase text-[10px] font-black tracking-widest flex items-center disabled:opacity-70">
                    {loading ? <i className="fa fa-spinner fa-spin mr-2"></i> : <i className="fa fa-sync mr-2"></i>}
                    Generate Analysis
                  </button>
                </div>
            </form>
        </div>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center text-gray-400">
           <i className="fa fa-circle-notch fa-spin text-4xl mb-4 text-blue-500"></i>
           <p className="text-xs font-bold uppercase tracking-widest">Processing Data...</p>
        </div>
      ) : (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpiData.map((kpi, idx) => (
                 <KPICard 
                    key={idx} 
                    title={kpi.title} 
                    value={kpi.value} 
                    trend={kpi.trend} 
                    trendLabel={kpi.trendLabel || "vs last period"} 
                    icon={kpi.icon} 
                    color={kpi.color} 
                 />
              ))}
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Trend Chart */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                       <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest">
                          {chartTitle}
                       </h6>
                       <div className="flex space-x-4 text-[10px] font-bold uppercase">
                          <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> {reportCategory === 'Revenue' ? 'Revenue' : 'Volume'}</div>
                       </div>
                    </div>
                    <div className="flex-1 min-h-[300px] relative px-4">
                       <div className="absolute inset-0">
                          <LineChart data={chartData} color="#3b82f6" />
                       </div>
                    </div>
                    <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-gray-400 uppercase">
                       {chartLabels.map((lbl, i) => (
                           <span key={i}>{lbl}</span>
                       ))}
                    </div>
                </div>

                {/* Secondary Breakdown Chart */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col">
                    <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-6">
                       Breakdown Analysis
                    </h6>
                    <div className="flex-1 min-h-[300px]">
                       {reportCategory === 'Revenue' ? (
                          <div className="space-y-6">
                             {breakdownData.map((d, i) => (
                                <div key={i}>
                                   <div className="flex justify-between text-[10px] font-bold text-gray-600 mb-1">
                                      <span className="uppercase">{d.label}</span>
                                      <span>{d.value.toLocaleString()}</span>
                                   </div>
                                   <div className="w-full bg-gray-100 rounded-full h-2">
                                      <div className={`h-2 rounded-full ${d.color}`} style={{ width: `${(d.value / (Math.max(...breakdownData.map(b=>b.value)) * 1.1)) * 100}%` }}></div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       ) : (
                          <BarChart data={breakdownData} />
                       )}
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                   <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest">Detailed Data Grid</h6>
                   <button className="text-[10px] font-bold text-blue-600 uppercase hover:underline"><i className="fa fa-download mr-1"></i> Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-[11px]">
                      <thead className="bg-gray-50 text-gray-500 uppercase font-black tracking-tight">
                         <tr>
                            <th className="px-6 py-3">Period</th>
                            <th className="px-6 py-3 text-right">Metric Value</th>
                            <th className="px-6 py-3 text-right">Target</th>
                            <th className="px-6 py-3 text-right">Performance</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                         {chartLabels.map((label, i) => (
                            <tr key={i} className="hover:bg-blue-50 transition-colors">
                               <td className="px-6 py-3 font-bold text-gray-800">{label}</td>
                               <td className="px-6 py-3 text-right font-black text-blue-600">
                                   {chartData[i] ? chartData[i].toLocaleString() : '-'}
                               </td>
                               <td className="px-6 py-3 text-right text-gray-400">
                                   {(chartData[i] * 0.9).toLocaleString(undefined, {maximumFractionDigits: 0})}
                               </td>
                               <td className="px-6 py-3 text-right text-green-600 font-bold">
                                   <i className="fa fa-arrow-up mr-1"></i> 10%
                               </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonReports;
