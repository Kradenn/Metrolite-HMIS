
import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

// --- Reusable Chart Components ---

const DualLineChart: React.FC<{ data1: number[]; data2: number[]; labels: string[] }> = ({ data1, data2, labels }) => {
    const max = Math.max(...data1, ...data2) * 1.1 || 100;
    
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

                {/* Line 1 (Revenue) */}
                <polyline points={makePoints(data1)} fill="none" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                {/* Line 2 (Expense) */}
                <polyline points={makePoints(data2)} fill="none" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="absolute bottom-0 w-full flex justify-between text-[8px] text-gray-400 font-bold uppercase pt-2">
                {labels.map((l, i) => <span key={i}>{l}</span>)}
            </div>
            <div className="absolute top-0 right-0 flex space-x-3 bg-white/90 p-1.5 rounded border border-gray-100 shadow-sm backdrop-blur-sm">
                 <div className="flex items-center text-[9px] font-bold text-gray-600"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> Revenue</div>
                 <div className="flex items-center text-[9px] font-bold text-gray-600"><span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> Expenses</div>
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
        <div className="flex items-center justify-center h-48 relative">
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
                    return <path key={i} d={pathData} fill={slice.color} stroke="white" strokeWidth="0.05" className="transition-all duration-500 hover:opacity-90" />;
                })}
                <circle cx="0" cy="0" r="0.6" fill="white" />
            </svg>
            <div className="absolute text-center pointer-events-none">
                 <span className="block text-xl font-black text-gray-800">100%</span>
                 <span className="text-[8px] text-gray-400 font-bold uppercase">Expenses</span>
            </div>
        </div>
    );
};

const KPICard: React.FC<{ title: string; value: string; trend: string; isPos: boolean; icon: string; color: string }> = ({ title, value, trend, isPos, icon, color }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{title}</p>
            <h3 className="text-xl font-black text-gray-800">{value}</h3>
            <span className={`text-[10px] font-bold ${isPos ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
                <i className={`fa ${isPos ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i> {trend}
            </span>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${color} shadow-md`}>
            <i className={`fa ${icon}`}></i>
        </div>
    </div>
);

const PrintableReportTable = React.forwardRef<HTMLDivElement, { reportType: string; branch: string; dateRange: { start: string; end: string } }>((props, ref) => {
    const { reportType, branch, dateRange } = props;
    
    return (
        <div ref={ref} className="bg-white p-12 max-w-[21cm] mx-auto text-slate-800 hidden print:block print:w-full print:h-full">
            <div className="text-center border-b-2 border-slate-900 pb-6 mb-8">
                <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">UltraHub Hospital</h1>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Financial Reporting System</p>
            </div>

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                        {reportType === '1' ? 'Detailed Trial Balance' : 
                         reportType === '2' ? 'Income Statement (P&L)' : 
                         reportType === '3' ? 'Balance Sheet' : 'Financial Report'}
                    </h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Branch: {branch}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Reporting Period</p>
                    <p className="text-xs font-black">{dateRange.start} TO {dateRange.end}</p>
                </div>
            </div>

            <table className="w-full text-left text-[10px] border-collapse">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase border-b border-slate-300">
                    <tr>
                        <th className="px-4 py-3">Account / Description</th>
                        <th className="px-4 py-3">Ref No</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-right">Debit</th>
                        <th className="px-4 py-3 text-right">Credit</th>
                        <th className="px-4 py-3 text-right">Balance</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                    {[1,2,3,4,5,6,7,8,9,10].map(i => (
                        <tr key={i}>
                            <td className="px-4 py-2 font-medium">Sales Revenue - Consultation</td>
                            <td className="px-4 py-2 text-blue-600">INV-00{i}</td>
                            <td className="px-4 py-2">2023-10-2{i}</td>
                            <td className="px-4 py-2 text-right">-</td>
                            <td className="px-4 py-2 text-right">1,500.00</td>
                            <td className="px-4 py-2 text-right font-bold">1,500.00</td>
                        </tr>
                    ))}
                    <tr className="bg-slate-50 font-black border-t-2 border-slate-900">
                        <td className="px-4 py-3 uppercase" colSpan={3}>Total</td>
                        <td className="px-4 py-3 text-right">0.00</td>
                        <td className="px-4 py-3 text-right">15,000.00</td>
                        <td className="px-4 py-3 text-right">15,000.00</td>
                    </tr>
                </tbody>
            </table>

            <div className="mt-20 pt-8 border-t border-slate-200 flex justify-between items-end opacity-60">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Generated By</p>
                    <p className="text-xs font-black text-slate-800 mt-1">System Administrator</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Print Date</p>
                    <p className="text-xs font-medium">{new Date().toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
});

const AccountsReports: React.FC = () => {
  const [reportType, setReportType] = useState('0');
  const [branch, setBranch] = useState('All Branches');
  const [dateRange, setDateRange] = useState({
      start: new Date().toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
  });
  const [isLoading, setIsLoading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
      contentRef: printRef,
  });

  const handleGenerate = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 800); // Mock load
  };

  // Mock Data for Charts
  const revenueData = [12000, 15000, 11000, 18000, 20000, 17000, 22000];
  const expenseData = [8000, 9000, 8500, 10000, 11000, 9500, 12000];
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const expenseBreakdown = [
      { label: 'Salaries', value: 45, color: '#3b82f6' },
      { label: 'Supplies', value: 30, color: '#ef4444' },
      { label: 'Utilities', value: 15, color: '#f59e0b' },
      { label: 'Maint.', value: 10, color: '#10b981' }
  ];

  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                <i className="fa fa-circle-notch fa-spin text-4xl mb-4 text-blue-500"></i>
                <p className="text-xs font-bold uppercase tracking-widest">Processing Financial Data...</p>
            </div>
        );
    }

    if (reportType === '0') {
        // Analytics Dashboard Mode
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* KPI Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <KPICard title="Total Revenue" value="KES 4.2M" trend="+12.5%" isPos={true} icon="fa-money-bill-wave" color="bg-emerald-500" />
                    <KPICard title="Total Expenses" value="KES 2.8M" trend="+5.2%" isPos={false} icon="fa-file-invoice-dollar" color="bg-red-500" />
                    <KPICard title="Net Income" value="KES 1.4M" trend="+8.4%" isPos={true} icon="fa-piggy-bank" color="bg-blue-600" />
                    <KPICard title="Accounts Receivable" value="KES 850k" trend="-2.1%" isPos={true} icon="fa-hand-holding-usd" color="bg-orange-500" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Trend Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest">Financial Performance (Rev vs Exp)</h6>
                            <select className="text-[10px] font-bold border border-gray-200 rounded px-2 py-1 outline-none">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        <DualLineChart data1={revenueData} data2={expenseData} labels={labels} />
                    </div>

                    {/* Breakdown Chart */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                        <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-2 text-center">Expense Allocation</h6>
                        <div className="flex-1 flex items-center justify-center">
                           <DonutChart data={expenseBreakdown} />
                        </div>
                        <div className="space-y-2 mt-4">
                            {expenseBreakdown.map((item, i) => (
                                <div key={i} className="flex justify-between text-[10px] font-bold text-gray-600">
                                    <div className="flex items-center">
                                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: item.color }}></span>
                                        {item.label}
                                    </div>
                                    <span>{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        // Tabular Report Mode
        return (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-300">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <h5 className="text-sm font-black text-gray-800 uppercase tracking-tight">Report Preview</h5>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">{branch} • {dateRange.start} to {dateRange.end}</p>
                    </div>
                    <div className="flex space-x-2">
                        <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-[10px] font-black uppercase shadow-sm hover:bg-gray-50">
                            <i className="fa fa-file-pdf mr-1 text-red-500"></i> PDF
                        </button>
                        <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-[10px] font-black uppercase shadow-sm hover:bg-gray-50">
                            <i className="fa fa-file-excel mr-1 text-green-600"></i> Excel
                        </button>
                        <button onClick={handlePrint} className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-[10px] font-black uppercase shadow-sm hover:bg-gray-50">
                            <i className="fa fa-print mr-1 text-gray-500"></i> Print
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                        <thead className="bg-gray-100 text-gray-600 font-bold uppercase border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">Account / Description</th>
                                <th className="px-6 py-3">Ref No</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3 text-right">Debit</th>
                                <th className="px-6 py-3 text-right">Credit</th>
                                <th className="px-6 py-3 text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-gray-700">
                            {[1,2,3,4,5].map(i => (
                                <tr key={i} className="hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-2 font-medium">Sales Revenue - Consultation</td>
                                    <td className="px-6 py-2 text-blue-600">INV-00{i}</td>
                                    <td className="px-6 py-2">2023-10-2{i}</td>
                                    <td className="px-6 py-2 text-right">-</td>
                                    <td className="px-6 py-2 text-right">1,500.00</td>
                                    <td className="px-6 py-2 text-right font-bold">1,500.00</td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50 font-black">
                                <td className="px-6 py-3 uppercase" colSpan={3}>Total</td>
                                <td className="px-6 py-3 text-right">0.00</td>
                                <td className="px-6 py-3 text-right">7,500.00</td>
                                <td className="px-6 py-3 text-right">7,500.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
  };

  return (
    <div className="animate-bottom space-y-6">
      {/* Configuration Panel */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b border-gray-100 pb-4">
           <div>
              <h5 className="text-sm font-black text-gray-800 uppercase tracking-tighter">Financial Reporting</h5>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Generate standard accounting reports and analytics</p>
           </div>
           <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-[10px] font-bold uppercase border border-blue-100">
              <i className="fa fa-calendar-alt mr-1"></i> FY 2023-2024
           </div>
        </div>
        
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="col-span-1 md:col-span-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Report Type</label>
                <select 
                    className="w-full p-2 border border-gray-300 rounded outline-none bg-white text-xs font-medium focus:ring-1 focus:ring-blue-500"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                >
                    <option value="0">📊 Financial Analytics Dashboard</option>
                    <option disabled>--- Standard Reports ---</option>
                    <option value="1">Trial Balance (Detailed)</option>
                    <option value="9">Trial Balance (Summary)</option>
                    <option value="2">Income Statement (P&L)</option>
                    <option value="3">Balance Sheet</option>
                    <option value="10">Cash Flow Statement</option>
                    <option value="4">General Ledger</option>
                    <option value="6">Expense Analysis</option>
                </select>
            </div>
            
            <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Branch Context</label>
                <select 
                    className="w-full p-2 border border-gray-300 rounded outline-none bg-white text-xs font-medium"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                >
                    <option>All Branches</option>
                    <option>Main Branch</option>
                    <option>City Center</option>
                </select>
            </div>

            {reportType !== '0' && (
                <div className="col-span-1 md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">From Date</label>
                        <input type="date" value={dateRange.start} onChange={e => setDateRange({...dateRange, start: e.target.value})} className="w-full p-2 border border-gray-300 rounded outline-none bg-white text-xs" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">To Date</label>
                        <input type="date" value={dateRange.end} onChange={e => setDateRange({...dateRange, end: e.target.value})} className="w-full p-2 border border-gray-300 rounded outline-none bg-white text-xs" />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                        <button type="submit" className="w-full bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition uppercase text-[10px] font-black tracking-widest flex items-center justify-center">
                            <i className="fa fa-sync mr-2"></i> Generate Report
                        </button>
                    </div>
                </div>
            )}
        </form>
      </div>

      {/* Main Content Area */}
      {renderContent()}

      <div className="hidden">
          <PrintableReportTable 
            ref={printRef} 
            reportType={reportType} 
            branch={branch} 
            dateRange={dateRange} 
          />
      </div>
    </div>
  );
};

export default AccountsReports;
