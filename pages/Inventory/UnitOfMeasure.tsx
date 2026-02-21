
import React from 'react';
import * as Lucide from 'lucide-react';

const UnitOfMeasure: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F4F5F7] p-6 font-sans text-slate-900">
       
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
             <h1 className="text-3xl font-light tracking-tight text-slate-900">Units of Measure</h1>
             <p className="text-sm text-slate-500 mt-1 font-mono">Configure packaging units and conversion rules.</p>
          </div>
          <button className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2">
             <Lucide.PlusCircle className="w-4 h-4" />
             <span>New Unit</span>
          </button>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Base Units Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Lucide.Scale className="w-4 h-4 text-slate-400" />
                <h6 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Base Units</h6>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
             <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 border-b border-slate-200">
                 <tr>
                   <th className="px-6 py-3 font-semibold text-slate-500">Unit Name</th>
                   <th className="px-6 py-3 font-semibold text-slate-500">Type</th>
                   <th className="px-6 py-3 font-semibold text-slate-500 text-center">Base Qty</th>
                   <th className="px-6 py-3 font-semibold text-slate-500 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {[
                    { name: 'Tablet', type: 'Smallest', qty: 1 },
                    { name: 'Capsule', type: 'Smallest', qty: 1 },
                    { name: 'Bottle', type: 'Smallest', qty: 1 },
                    { name: 'Box (100)', type: 'Package', qty: 100 },
                 ].map((u, i) => (
                   <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="px-6 py-4 font-medium text-slate-900">{u.name}</td>
                     <td className="px-6 py-4 text-slate-500">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${u.type === 'Smallest' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                            {u.type}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-center font-mono text-slate-600">{u.qty}</td>
                     <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-red-500 transition-colors p-1">
                            <Lucide.Trash2 className="w-4 h-4" />
                        </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>

        {/* Conversions Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Lucide.ArrowRightLeft className="w-4 h-4 text-slate-400" />
                <h6 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Conversion Rules</h6>
            </div>
            <button className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-1.5">
                <Lucide.Plus className="w-3 h-3" /> Add Rule
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {[
                { from: 'Box (100)', to: 'Tablet', factor: 100 },
                { from: 'Pack (30)', to: 'Capsule', factor: 30 },
             ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl group hover:border-blue-300 hover:shadow-sm transition-all">
                   <div className="flex items-center gap-4">
                      <div className="text-sm font-medium text-slate-900">1 {c.from}</div>
                      <Lucide.ArrowRight className="w-4 h-4 text-slate-400" />
                      <div className="text-sm font-medium text-blue-600">{c.factor} {c.to}s</div>
                   </div>
                   <button className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1">
                        <Lucide.Trash2 className="w-4 h-4" />
                   </button>
                </div>
             ))}
             <div className="p-8 text-center">
                <div className="inline-flex p-3 bg-slate-50 rounded-full mb-3">
                    <Lucide.Info className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    Define how larger packaging units break down into sellable units for accurate stock tracking.
                </p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UnitOfMeasure;
