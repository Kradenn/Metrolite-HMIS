
import React, { useState } from 'react';

const OpeningBalances: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'General' | 'Customer' | 'Supplier' | 'Inventory'>('General');

  return (
    <div className="animate-bottom space-y-6">
       
       <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          {/* Header & Tabs */}
          <div className="p-0 border-b border-gray-100 bg-gray-50">
             <div className="p-6 pb-0">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Opening Balances</h2>
                <p className="text-xs text-gray-500 font-medium mb-6">Initialize system balances for accounts, customers, suppliers, and inventory.</p>
                
                <div className="flex space-x-1">
                   {['General', 'Customer', 'Supplier', 'Inventory'].map(tab => (
                      <button 
                         key={tab}
                         onClick={() => setActiveTab(tab as any)}
                         className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-t-lg transition-all border-t border-l border-r ${
                            activeTab === tab 
                            ? 'bg-white border-gray-200 border-b-white text-blue-600 relative top-[1px]' 
                            : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'
                         }`}
                      >
                         {tab} Balances
                      </button>
                   ))}
                </div>
             </div>
          </div>
          
          {/* Main Content Area */}
          <div className="p-8 flex-1 bg-white">
             {activeTab === 'General' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in">
                   <div className="space-y-6">
                      <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2">New GL Balance</h5>
                      <form className="space-y-4">
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Select Account</label>
                            <select className="w-full p-3 bg-white border border-gray-300 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500">
                               <option>1001 - Cash on Hand</option>
                               <option>1002 - Bank (KCB)</option>
                               <option>3000 - Retained Earnings</option>
                            </select>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Balance Date</label>
                               <input type="date" className="w-full p-3 bg-white border border-gray-300 rounded-lg text-xs font-medium outline-none" />
                            </div>
                            <div>
                               <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Amount</label>
                               <input type="number" className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm font-black text-blue-800 outline-none" placeholder="0.00" />
                            </div>
                         </div>
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Description / Ref</label>
                            <textarea className="w-full p-3 bg-white border border-gray-300 rounded-lg text-xs outline-none h-20 resize-none" placeholder="Opening balance details..."></textarea>
                         </div>
                         <button className="w-full bg-blue-600 text-white py-3 rounded-lg text-xs font-black uppercase tracking-widest shadow hover:bg-blue-700 transition">Save Balance</button>
                      </form>
                   </div>

                   <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                      <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-4">Recent Entries</h5>
                      <div className="space-y-3">
                         {[
                            { acc: 'Cash on Hand', amount: 50000, date: '2023-01-01' },
                            { acc: 'Equity Bank', amount: 1200000, date: '2023-01-01' },
                            { acc: 'Petty Cash', amount: 15000, date: '2023-01-01' },
                         ].map((entry, i) => (
                            <div key={i} className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                               <div>
                                  <p className="text-xs font-bold text-gray-800">{entry.acc}</p>
                                  <p className="text-[10px] text-gray-400">{entry.date}</p>
                               </div>
                               <span className="text-sm font-black text-green-600">KES {entry.amount.toLocaleString()}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             )}

             {activeTab === 'Customer' && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-in fade-in">
                   <i className="fa fa-users text-5xl mb-4 opacity-20"></i>
                   <p className="font-bold uppercase tracking-widest text-xs">Customer Opening Balances Module</p>
                   <p className="text-[10px] mt-1">Import or manually enter outstanding invoices from legacy system.</p>
                   <button className="mt-4 bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded text-[10px] font-black uppercase hover:bg-gray-50">Open Wizard</button>
                </div>
             )}

             {activeTab === 'Supplier' && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-in fade-in">
                   <i className="fa fa-truck text-5xl mb-4 opacity-20"></i>
                   <p className="font-bold uppercase tracking-widest text-xs">Supplier Opening Balances Module</p>
                   <p className="text-[10px] mt-1">Record pending bills and credits for vendors.</p>
                </div>
             )}

             {activeTab === 'Inventory' && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400 animate-in fade-in">
                   <i className="fa fa-boxes text-5xl mb-4 opacity-20"></i>
                   <p className="font-bold uppercase tracking-widest text-xs">Stock Opening Balances</p>
                   <p className="text-[10px] mt-1">Use the "Stock Take" module to initialize inventory counts.</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default OpeningBalances;
