
import React, { useState } from 'react';

const CurrencyUnit: React.FC = () => {
  const [denominations, setDenominations] = useState([
     {id: 1, name: '1000 Note', val: 1000, type: 'Note'},
     {id: 2, name: '500 Note', val: 500, type: 'Note'},
     {id: 3, name: '200 Note', val: 200, type: 'Note'},
     {id: 4, name: '100 Note', val: 100, type: 'Note'},
     {id: 5, name: '50 Note', val: 50, type: 'Note'},
     {id: 6, name: '40 Coin', val: 40, type: 'Coin'},
     {id: 7, name: '20 Coin', val: 20, type: 'Coin'},
     {id: 8, name: '10 Coin', val: 10, type: 'Coin'},
     {id: 9, name: '5 Coin', val: 5, type: 'Coin'},
     {id: 10, name: '1 Coin', val: 1, type: 'Coin'},
  ]);

  // Calculator State
  const [counts, setCounts] = useState<Record<number, number>>({});

  const handleCountChange = (val: number, count: string) => {
     setCounts(prev => ({ ...prev, [val]: Number(count) }));
  };

  const totalCalculated = Object.entries(counts).reduce((sum, [val, count]) => sum + (Number(val) * Number(count)), 0);

  return (
    <div className="animate-bottom space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Config List */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h5 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Active Denominations</h5>
                <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-[10px] font-black uppercase shadow hover:bg-blue-700 transition">
                   Add Unit
                </button>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px]">
                   <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-tight">
                      <tr>
                         <th className="px-6 py-3 text-center w-16">Type</th>
                         <th className="px-6 py-3">Name</th>
                         <th className="px-6 py-3 text-right">Value (KES)</th>
                         <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                      {denominations.map(d => (
                         <tr key={d.id} className="hover:bg-blue-50 transition-colors">
                            <td className="px-6 py-3 text-center text-gray-400 text-lg">
                               <i className={`fa ${d.type === 'Note' ? 'fa-money-bill' : 'fa-coins'}`}></i>
                            </td>
                            <td className="px-6 py-3 font-bold uppercase">{d.name}</td>
                            <td className="px-6 py-3 text-right font-mono">{d.val.toLocaleString()}</td>
                            <td className="px-6 py-3 text-right">
                               <button className="text-red-400 hover:text-red-600"><i className="fa fa-trash"></i></button>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          {/* Playground / Calculator */}
          <div className="lg:col-span-4">
             <div className="bg-gray-800 text-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full border border-gray-700">
                <div className="p-4 border-b border-gray-700 bg-gray-900">
                   <h5 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Cash Count Preview</h5>
                   <p className="text-sm text-gray-500">Test your denominations configuration</p>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-800/50">
                   {denominations.map(d => (
                      <div key={d.id} className="flex items-center space-x-3">
                         <span className="text-[10px] font-bold text-gray-400 w-16 text-right uppercase">{d.name}</span>
                         <input 
                            type="number" 
                            min="0"
                            className="flex-1 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white text-right outline-none focus:border-blue-500"
                            placeholder="0"
                            onChange={(e) => handleCountChange(d.val, e.target.value)}
                         />
                         <span className="text-xs font-mono w-20 text-right text-gray-300">
                            {((counts[d.val] || 0) * d.val).toLocaleString()}
                         </span>
                      </div>
                   ))}
                </div>

                <div className="p-4 bg-gray-900 border-t border-gray-700">
                   <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Count</span>
                      <span className="text-2xl font-black text-green-500">KES {totalCalculated.toLocaleString()}</span>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default CurrencyUnit;
