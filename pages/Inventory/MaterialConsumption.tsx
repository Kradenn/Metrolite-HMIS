
import React, { useState } from 'react';
import * as Lucide from 'lucide-react';

const MaterialConsumption: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');

  return (
    <div className="min-h-screen bg-[#F4F5F7] p-6 font-sans text-slate-900">
       
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
             <h1 className="text-3xl font-light tracking-tight text-slate-900">Internal Consumption</h1>
             <p className="text-sm text-slate-500 mt-1 font-mono">Record items used internally (not sold to patients).</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg">
             <button 
                onClick={() => setActiveTab('new')}
                className={`px-4 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'new' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
             >
                <Lucide.PlusCircle className="w-3.5 h-3.5" />
                Record Usage
             </button>
             <button 
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
                    activeTab === 'history' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
             >
                <Lucide.History className="w-3.5 h-3.5" />
                View History
             </button>
          </div>
       </div>

       {activeTab === 'new' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden max-w-4xl mx-auto">
             <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Lucide.FileMinus className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">New Consumption Entry</h2>
                    <p className="text-sm text-slate-500">Log items removed from inventory for internal use.</p>
                </div>
             </div>
             <div className="p-8">
                <form className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-5">
                         <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Source Store</label>
                            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                               <option>Main Pharmacy</option>
                               <option>Laboratory Store</option>
                               <option>Central Store</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Item to Consume</label>
                            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                               <option>Select Item...</option>
                               <option>Gloves (Pair)</option>
                               <option>Cotton Wool</option>
                            </select>
                            <div className="flex justify-end mt-1.5">
                                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                    Available Stock: 500
                                </span>
                            </div>
                         </div>
                         <div className="grid grid-cols-2 gap-5">
                            <div>
                               <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Quantity</label>
                               <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="0" />
                            </div>
                            <div>
                               <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Batch (Optional)</label>
                               <input type="text" className="w-full p-3 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed" placeholder="Auto-FIFO" readOnly />
                            </div>
                         </div>
                      </div>

                      <div className="space-y-5">
                         <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Reason / Description</label>
                            <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none h-32 resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="e.g. Spillage, Staff Use, Expired..."></textarea>
                         </div>
                         <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Date Time</label>
                            <input type="datetime-local" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" defaultValue={new Date().toISOString().slice(0,16)} />
                         </div>
                         <div className="pt-4 flex justify-end">
                            <button className="bg-slate-900 text-white px-8 py-3 rounded-lg text-sm font-medium shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2">
                               <Lucide.Check className="w-4 h-4" />
                               Confirm Consumption
                            </button>
                         </div>
                      </div>
                   </div>
                </form>
             </div>
          </div>
       )}

       {activeTab === 'history' && (
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
             <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <Lucide.List className="w-4 h-4 text-slate-400" />
                    <h5 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Consumption Log</h5>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                   <div className="relative flex-1 sm:flex-none">
                        <Lucide.Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="date" className="pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs outline-none bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full" />
                   </div>
                   <button className="bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
                        <Lucide.Filter className="w-3.5 h-3.5" /> Filter
                   </button>
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                         <th className="px-6 py-4 font-semibold text-slate-500">Date</th>
                         <th className="px-6 py-4 font-semibold text-slate-500">Item Name</th>
                         <th className="px-6 py-4 font-semibold text-slate-500">Store</th>
                         <th className="px-6 py-4 font-semibold text-slate-500 text-right">Quantity</th>
                         <th className="px-6 py-4 font-semibold text-slate-500">Reason</th>
                         <th className="px-6 py-4 font-semibold text-slate-500">User</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50/50 transition-colors group">
                         <td className="px-6 py-4 text-slate-500 font-mono text-xs">2023-10-24 10:30</td>
                         <td className="px-6 py-4 font-medium text-slate-900">Surgical Gloves</td>
                         <td className="px-6 py-4 text-slate-600">Main Pharmacy</td>
                         <td className="px-6 py-4 text-right">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                -2 Pairs
                            </span>
                         </td>
                         <td className="px-6 py-4 text-slate-500 italic">Ward Usage</td>
                         <td className="px-6 py-4 text-xs text-slate-400 uppercase font-medium">Admin</td>
                      </tr>
                   </tbody>
                </table>
             </div>
          </div>
       )}
    </div>
  );
};

export default MaterialConsumption;
