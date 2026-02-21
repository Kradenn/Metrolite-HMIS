
import React, { useState } from 'react';
import * as Lucide from 'lucide-react';

interface StockTakeSession {
   id: string;
   date: string;
   store: string;
   status: 'Pending' | 'Committed';
   initiatedBy: string;
   itemsCount: number;
}

interface StockTakeItem {
   id: number;
   name: string;
   batch: string;
   systemQty: number;
   physicalQty: number;
   cost: number;
}

const StockTake: React.FC = () => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Mock Data
  const [sessions] = useState<StockTakeSession[]>([
     { id: 'ST-2023-001', date: '2023-10-24', store: 'Main Pharmacy', status: 'Pending', initiatedBy: 'Admin', itemsCount: 45 },
     { id: 'ST-2023-002', date: '2023-09-30', store: 'Central Store', status: 'Committed', initiatedBy: 'Store Manager', itemsCount: 120 },
  ]);

  const [items, setItems] = useState<StockTakeItem[]>([
     { id: 1, name: 'Paracetamol 500mg', batch: 'B101', systemQty: 500, physicalQty: 500, cost: 2.5 },
     { id: 2, name: 'Amoxicillin 250mg', batch: 'B102', systemQty: 200, physicalQty: 195, cost: 8.0 },
     { id: 3, name: 'Surgical Gloves', batch: 'G-09', systemQty: 1000, physicalQty: 1000, cost: 15.0 },
  ]);

  const handleQtyChange = (id: number, val: number) => {
     setItems(prev => prev.map(i => i.id === id ? { ...i, physicalQty: val } : i));
  };

  const selectedSession = sessions.find(s => s.id === activeSessionId);

  const totalVarianceValue = items.reduce((acc, item) => acc + ((item.physicalQty - item.systemQty) * item.cost), 0);

  return (
    <div className="min-h-screen bg-[#F4F5F7] p-6 font-sans text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
         <div>
            <h1 className="text-3xl font-light tracking-tight text-slate-900">Stock Reconciliation</h1>
            <p className="text-sm text-slate-500 mt-1 font-mono">Audit physical inventory against system records.</p>
         </div>
         <button className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2">
            <Lucide.PlusCircle className="w-4 h-4" />
            <span>New Count Session</span>
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         {/* Left: Sessions List */}
         <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between px-1">
                <h6 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sessions</h6>
                <button className="text-slate-400 hover:text-slate-600"><Lucide.Filter className="w-3 h-3" /></button>
            </div>
            <div className="space-y-3">
               {sessions.map(s => (
                  <div 
                     key={s.id} 
                     onClick={() => setActiveSessionId(s.id)}
                     className={`p-4 rounded-xl cursor-pointer transition-all border group ${
                        activeSessionId === s.id 
                        ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-100' 
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                     }`}
                  >
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-mono font-medium text-slate-500">{s.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                            s.status === 'Pending' 
                            ? 'bg-orange-50 text-orange-600 border border-orange-100' 
                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                           {s.status}
                        </span>
                     </div>
                     <h5 className="text-sm font-semibold text-slate-900 mb-1">{s.store}</h5>
                     <div className="flex justify-between items-center text-xs text-slate-500 mt-3">
                        <span className="flex items-center gap-1"><Lucide.Calendar className="w-3 h-3" /> {s.date}</span>
                        <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-600">{s.itemsCount} Items</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Right: Worksheet Details */}
         <div className="lg:col-span-9">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[600px] flex flex-col">
               {selectedSession ? (
                  <>
                     <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
                        <div>
                           <div className="flex items-center gap-3">
                                <h2 className="text-lg font-semibold text-slate-900">{selectedSession.store}</h2>
                                <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-mono rounded">{selectedSession.id}</span>
                           </div>
                           <p className="text-sm text-slate-500 mt-1">Initiated by <span className="font-medium text-slate-700">{selectedSession.initiatedBy}</span> on {selectedSession.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                           <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
                              <Lucide.Printer className="w-4 h-4" /> Variance Report
                           </button>
                           {selectedSession.status === 'Pending' && (
                              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-emerald-700 transition flex items-center gap-2">
                                 <Lucide.CheckCircle className="w-4 h-4" /> Commit Adjustments
                              </button>
                           )}
                        </div>
                     </div>
                     
                     <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left">
                           <thead className="bg-slate-50 border-b border-slate-200">
                              <tr>
                                 <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Item Name</th>
                                 <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Batch Info</th>
                                 <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">System Qty</th>
                                 <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right w-40">Physical Qty</th>
                                 <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Variance</th>
                                 <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Value Diff</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {items.map(item => {
                                 const variance = item.physicalQty - item.systemQty;
                                 const valDiff = variance * item.cost;
                                 return (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                       <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                                       <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.batch}</td>
                                       <td className="px-6 py-4 text-right font-mono text-slate-600">{item.systemQty}</td>
                                       <td className="px-6 py-4 text-right">
                                          <input 
                                             type="number" 
                                             value={item.physicalQty}
                                             onChange={(e) => handleQtyChange(item.id, Number(e.target.value))}
                                             className={`w-24 text-right px-3 py-1.5 border rounded-lg text-sm font-mono font-medium outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                                                variance !== 0 
                                                ? 'bg-yellow-50 border-yellow-300 text-yellow-800 focus:border-yellow-500' 
                                                : 'bg-white border-slate-200 focus:border-blue-500'
                                             }`}
                                             disabled={selectedSession.status === 'Committed'}
                                          />
                                       </td>
                                       <td className="px-6 py-4 text-right">
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                              variance < 0 ? 'bg-red-50 text-red-700' : 
                                              variance > 0 ? 'bg-emerald-50 text-emerald-700' : 
                                              'text-slate-400'
                                          }`}>
                                              {variance > 0 ? '+' : ''}{variance}
                                          </span>
                                       </td>
                                       <td className={`px-6 py-4 text-right font-mono text-sm ${valDiff !== 0 ? 'font-medium text-slate-900' : 'text-slate-400'}`}>
                                          {valDiff.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                       </td>
                                    </tr>
                                 );
                              })}
                           </tbody>
                        </table>
                     </div>
                     <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end items-center gap-4">
                        <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Variance Value</span>
                        <span className={`text-2xl font-mono font-bold ${totalVarianceValue < 0 ? 'text-red-600' : totalVarianceValue > 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
                            KES {totalVarianceValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                     </div>
                  </>
               ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300 min-h-[400px]">
                     <div className="p-6 bg-slate-50 rounded-full mb-4">
                        <Lucide.ClipboardCheck className="w-12 h-12 text-slate-400" />
                     </div>
                     <p className="text-sm font-medium uppercase tracking-widest text-slate-500">Select a session to start counting</p>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

export default StockTake;
