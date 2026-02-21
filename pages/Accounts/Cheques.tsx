
import React, { useState } from 'react';

const Cheques: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');

  const chequeHistory = [
      { id: 'CHQ-0089', date: '2023-10-20', payee: 'MedSurg Supplies Ltd', amount: 45000, bank: 'KCB Bank', status: 'Cleared' },
      { id: 'CHQ-0090', date: '2023-10-22', payee: 'Kenya Power', amount: 12500, bank: 'Equity Bank', status: 'Issued' },
      { id: 'CHQ-0091', date: '2023-10-24', payee: 'Nairobi Water Co.', amount: 5000, bank: 'KCB Bank', status: 'Draft' },
  ];

  return (
    <div className="animate-bottom space-y-6">
       
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Cheque Management</h2>
          <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
             <button 
                onClick={() => setActiveTab('new')}
                className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'new' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
             >
                Write Cheque
             </button>
             <button 
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
             >
                Cheque Register
             </button>
          </div>
       </div>

       {activeTab === 'new' && (
           <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                 <h5 className="text-sm font-black text-gray-700 uppercase tracking-widest">New Cheque Details</h5>
                 <div className="text-xs text-gray-500">
                    Bank Balance: <span className="font-bold text-green-600">KES 1,450,000.00</span>
                 </div>
              </div>
              
              {/* Visual Cheque Layout */}
              <div className="p-8 bg-[#fdfbf7]">
                 <div className="border border-blue-200 bg-blue-50/20 p-6 rounded-lg relative shadow-inner">
                    {/* Top Row */}
                    <div className="flex justify-between items-start mb-8">
                       <div className="w-1/3">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Bank Account</label>
                          <select className="w-full bg-transparent border-b border-gray-300 text-sm font-bold text-gray-800 outline-none pb-1 focus:border-blue-500">
                             <option>KCB Bank - Main Operations</option>
                             <option>Equity Bank</option>
                          </select>
                       </div>
                       <div className="text-right">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Date</label>
                          <input type="date" className="bg-transparent border-b border-gray-300 text-sm font-bold text-gray-800 outline-none pb-1 text-right focus:border-blue-500" />
                       </div>
                    </div>

                    {/* Payee Row */}
                    <div className="flex items-end space-x-4 mb-6">
                       <span className="text-sm font-bold text-gray-600 uppercase whitespace-nowrap">Pay To The Order Of</span>
                       <input type="text" className="flex-1 bg-transparent border-b border-gray-300 text-lg font-serif italic text-gray-900 outline-none pb-1 focus:border-blue-500" placeholder="Payee Name" />
                       <div className="w-48 relative">
                          <span className="absolute left-0 bottom-2 font-bold text-gray-600">KES</span>
                          <input type="number" className="w-full bg-white border border-gray-300 rounded p-2 pl-10 text-lg font-black text-gray-900 outline-none focus:ring-1 focus:ring-blue-500 shadow-inner" placeholder="0.00" />
                       </div>
                    </div>

                    {/* Amount Words Row */}
                    <div className="flex items-end space-x-4 mb-8">
                       <span className="text-sm font-bold text-gray-600 uppercase">The Sum Of</span>
                       <input type="text" className="flex-1 bg-transparent border-b border-gray-300 text-sm font-medium text-gray-800 outline-none pb-1 focus:border-blue-500" placeholder="Amount in words..." />
                    </div>

                    {/* Footer Row */}
                    <div className="flex justify-between items-end">
                       <div className="w-1/2">
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Memo / Reference</label>
                          <input type="text" className="w-full bg-transparent border-b border-gray-300 text-xs text-gray-600 outline-none pb-1 focus:border-blue-500" placeholder="Payment for..." />
                       </div>
                       <div className="w-1/3 text-center">
                          <div className="border-b border-gray-300 h-8 mb-1"></div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Authorized Signature</span>
                       </div>
                    </div>
                 </div>

                 {/* Action Buttons */}
                 <div className="mt-8 flex justify-end gap-3">
                    <button className="px-6 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 uppercase hover:bg-gray-50">Save Draft</button>
                    <button className="bg-blue-600 text-white px-8 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition">Issue Cheque</button>
                 </div>
              </div>
           </div>
       )}

       {activeTab === 'history' && (
           <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
               <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                   <h5 className="text-xs font-black text-gray-500 uppercase tracking-widest">Cheque Register</h5>
                   <input type="text" placeholder="Search cheque no..." className="border border-gray-200 rounded-lg px-3 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500" />
               </div>
               <div className="overflow-x-auto">
                   <table className="w-full text-left text-[11px]">
                       <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-tight">
                           <tr>
                               <th className="px-6 py-3">Cheque No</th>
                               <th className="px-6 py-3">Date</th>
                               <th className="px-6 py-3">Payee</th>
                               <th className="px-6 py-3">Bank</th>
                               <th className="px-6 py-3 text-right">Amount</th>
                               <th className="px-6 py-3 text-center">Status</th>
                               <th className="px-6 py-3 text-right">Action</th>
                           </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 text-gray-700">
                           {chequeHistory.map(chq => (
                               <tr key={chq.id} className="hover:bg-blue-50 transition-colors">
                                   <td className="px-6 py-4 font-mono font-bold text-blue-600">{chq.id}</td>
                                   <td className="px-6 py-4">{chq.date}</td>
                                   <td className="px-6 py-4 uppercase font-bold">{chq.payee}</td>
                                   <td className="px-6 py-4 text-gray-500">{chq.bank}</td>
                                   <td className="px-6 py-4 text-right font-black">KES {chq.amount.toLocaleString()}</td>
                                   <td className="px-6 py-4 text-center">
                                       <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                                           chq.status === 'Cleared' ? 'bg-green-100 text-green-700 border-green-200' :
                                           chq.status === 'Issued' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                           'bg-gray-100 text-gray-600 border-gray-200'
                                       }`}>{chq.status}</span>
                                   </td>
                                   <td className="px-6 py-4 text-right">
                                       <button className="text-gray-400 hover:text-blue-600"><i className="fa fa-ellipsis-v"></i></button>
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
           </div>
       )}
    </div>
  );
};

export default Cheques;
