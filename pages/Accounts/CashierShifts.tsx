
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const PrintableShiftReport = React.forwardRef<HTMLDivElement, { shift: any }>((props, ref) => {
    const { shift } = props;
    return (
        <div ref={ref} className="bg-white p-12 max-w-[21cm] mx-auto text-slate-800 hidden print:block print:w-full print:h-full">
            <div className="text-center border-b-2 border-slate-900 pb-6 mb-8">
                <h1 className="text-2xl font-black uppercase tracking-tighter leading-none">UltraHub Hospital</h1>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Cashier Shift Reconciliation Report</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-10">
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shift Identity</p>
                    <p className="text-lg font-black text-slate-800 uppercase">Shift #{shift.id}</p>
                    <p className="text-xs font-bold text-slate-500">User: {shift.user}</p>
                </div>
                <div className="text-right space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporal Context</p>
                    <p className="text-xs font-bold">Started: {shift.start}</p>
                    <p className="text-xs font-bold">Printed: {new Date().toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12">
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">Opening Position</h3>
                    <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-400">Float Amount</span>
                        <span className="font-black text-slate-800">KES {shift.openingBal.toLocaleString()}.00</span>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">Collections Summary</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-slate-400">Cash Collection</span>
                            <span className="font-black text-slate-800">KES 12,500.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-slate-400">Digital Collection</span>
                            <span className="font-black text-slate-800">KES 32,500.00</span>
                        </div>
                        <div className="flex justify-between text-lg font-black border-t-2 border-slate-900 pt-3">
                            <span className="uppercase text-xs self-center">Total Collection</span>
                            <span className="tracking-tighter">KES {shift.currentCollection.toLocaleString()}.00</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-20 pt-12 border-t border-slate-200 flex justify-between items-end opacity-60">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Cashier Signature</p>
                    <div className="mt-8 w-48 h-0.5 bg-slate-900"></div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Finance Auditor</p>
                    <div className="mt-8 w-48 h-0.5 bg-slate-900"></div>
                </div>
            </div>
        </div>
    );
});

const CashierShifts: React.FC = () => {
  const activeShift = {
    id: 5692,
    user: 'admin@admin.com',
    start: '2023-10-24 08:00 AM',
    openingBal: 2500,
    currentCollection: 45000,
    status: 'Active'
  };

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
      contentRef: printRef,
  });

  const shiftHistory = [
     { id: 5691, user: 'John Doe', start: '2023-10-23 08:00', end: '2023-10-23 17:00', collection: 120500, variance: 0, status: 'Closed' },
     { id: 5690, user: 'Jane Smith', start: '2023-10-23 17:00', end: '2023-10-24 08:00', collection: 34000, variance: -500, status: 'Closed' },
     { id: 5689, user: 'Admin', start: '2023-10-22 08:00', end: '2023-10-22 18:00', collection: 89000, variance: 200, status: 'Closed' },
  ];

  return (
    <div className="animate-bottom space-y-8">
       {/* Active Shift Dashboard */}
       <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden relative">
          <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
          <div className="p-6 md:p-8">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                   <h2 className="text-2xl font-black text-gray-800 tracking-tight uppercase">Current Shift #{activeShift.id}</h2>
                   <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
                      Started: {activeShift.start} • User: <span className="text-blue-600">{activeShift.user}</span>
                   </p>
                </div>
                <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest border border-green-200 animate-pulse">
                   Active Now
                </span>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Opening Balance</p>
                   <p className="text-xl font-black text-gray-700 mt-1">KES {activeShift.openingBal.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                   <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Cash Collection</p>
                   <p className="text-xl font-black text-blue-700 mt-1">KES 12,500</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                   <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Digital (Mpesa/Card)</p>
                   <p className="text-xl font-black text-green-700 mt-1">KES 32,500</p>
                </div>
                <div className="p-4 bg-gray-800 rounded-xl border border-gray-700 text-white">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Est. Collection</p>
                   <p className="text-xl font-black text-white mt-1">KES {activeShift.currentCollection.toLocaleString()}</p>
                </div>
             </div>

             <div className="flex flex-wrap gap-3">
                <button className="bg-red-600 text-white px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:bg-red-700 transition transform active:scale-95">
                   <i className="fa fa-stop-circle mr-2"></i> End Shift & Reconcile
                </button>
                <button onClick={handlePrint} className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition shadow-sm">
                   <i className="fa fa-print mr-2"></i> X-Read (Interim Report)
                </button>
                <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition shadow-sm">
                   <i className="fa fa-pause mr-2"></i> Pause / Break
                </button>
             </div>
          </div>
       </div>

       {/* Recent Shifts History */}
       <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
             <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest">Shift History</h5>
             <div className="flex items-center space-x-2">
                 <select className="text-xs border border-gray-300 rounded px-2 py-1 bg-white outline-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                 </select>
                 <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded text-xs font-bold"><i className="fa fa-download"></i></button>
             </div>
          </div>
          
          <div className="overflow-x-auto">
             <table className="w-full text-left text-[11px]">
                <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 font-black uppercase tracking-tight">
                   <tr>
                      <th className="px-6 py-4">Shift ID</th>
                      <th className="px-6 py-4">Cashier</th>
                      <th className="px-6 py-4">Start Time</th>
                      <th className="px-6 py-4">End Time</th>
                      <th className="px-6 py-4 text-right">Total Collection</th>
                      <th className="px-6 py-4 text-right">Variance</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                   {shiftHistory.map(shift => (
                      <tr key={shift.id} className="hover:bg-blue-50 transition-colors">
                         <td className="px-6 py-4 font-bold text-blue-600">#{shift.id}</td>
                         <td className="px-6 py-4 uppercase">{shift.user}</td>
                         <td className="px-6 py-4 text-gray-500">{shift.start}</td>
                         <td className="px-6 py-4 text-gray-500">{shift.end}</td>
                         <td className="px-6 py-4 text-right font-black">KES {shift.collection.toLocaleString()}</td>
                         <td className={`px-6 py-4 text-right font-bold ${shift.variance < 0 ? 'text-red-500' : shift.variance > 0 ? 'text-blue-500' : 'text-gray-300'}`}>
                            {shift.variance === 0 ? '-' : `KES ${shift.variance}`}
                         </td>
                         <td className="px-6 py-4 text-center">
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[9px] font-black uppercase">Closed</span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button className="text-gray-400 hover:text-blue-600"><i className="fa fa-file-alt"></i></button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
       
       <div className="hidden">
           <PrintableShiftReport ref={printRef} shift={activeShift} />
       </div>
    </div>
  );
};

export default CashierShifts;
