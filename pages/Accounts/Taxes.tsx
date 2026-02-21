
import React, { useState } from 'react';

const Taxes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'vat' | 'other'>('vat');
  const [showModal, setShowModal] = useState(false);

  const vatTaxes = [
     { id: 1, name: 'Standard Rate', rate: 16.0, account: '2001-05 VAT Liability', active: true },
     { id: 2, name: 'Zero Rated', rate: 0.0, account: '2001-05 VAT Liability', active: true },
     { id: 3, name: 'Exempt', rate: 0.0, account: '-', active: true },
  ];

  const otherTaxes = [
     { id: 1, name: 'Withholding Tax (Professional)', rate: 5.0, account: '2005-01 WHT Payable', active: true },
     { id: 2, name: 'Catering Levy', rate: 2.0, account: '2005-02 Catering Levy', active: false },
  ];

  const currentList = activeTab === 'vat' ? vatTaxes : otherTaxes;

  return (
    <div className="animate-bottom space-y-6">
       
       <div className="flex justify-between items-center">
          <div>
             <h2 className="text-xl font-bold text-gray-800">Tax Configuration</h2>
             <p className="text-xs text-gray-500 font-medium">Manage VAT, Withholding, and Levies.</p>
          </div>
          <button 
             onClick={() => setShowModal(true)}
             className="bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow hover:bg-blue-700 transition"
          >
             <i className="fa fa-plus mr-2"></i> Add New Tax
          </button>
       </div>

       <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[500px]">
          <div className="flex border-b border-gray-100">
             <button 
                onClick={() => setActiveTab('vat')}
                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'vat' ? 'border-blue-600 text-blue-600 bg-blue-50/20' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
             >
                Value Added Tax (VAT)
             </button>
             <button 
                onClick={() => setActiveTab('other')}
                className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'other' ? 'border-blue-600 text-blue-600 bg-blue-50/20' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
             >
                Withholding & Other Levies
             </button>
          </div>

          <div className="p-0">
             <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase font-black border-b border-gray-200">
                   <tr>
                      <th className="px-6 py-4">Tax Name</th>
                      <th className="px-6 py-4">Rate (%)</th>
                      <th className="px-6 py-4">Linked Account</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                   {currentList.map(tax => (
                      <tr key={tax.id} className="hover:bg-blue-50 transition-colors group">
                         <td className="px-6 py-4 font-bold text-gray-800">{tax.name}</td>
                         <td className="px-6 py-4 font-black text-blue-600 text-lg">{tax.rate}%</td>
                         <td className="px-6 py-4 font-mono text-gray-500">{tax.account}</td>
                         <td className="px-6 py-4 text-center">
                            {tax.active ? (
                               <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-black uppercase">Active</span>
                            ) : (
                               <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-black uppercase">Inactive</span>
                            )}
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button className="text-gray-400 hover:text-blue-600 transition p-2"><i className="fa fa-pencil-alt"></i></button>
                            <button className="text-gray-400 hover:text-red-600 transition p-2"><i className="fa fa-trash"></i></button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>

       {/* Add Tax Modal */}
       {showModal && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                   <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest">Configure New Tax</h5>
                   <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa fa-times text-lg"></i></button>
                </div>
                <div className="p-6 space-y-4">
                   <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Tax Type</label>
                      <select 
                         className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold outline-none"
                         value={activeTab === 'vat' ? 'VAT' : 'Other'}
                         disabled
                      >
                         <option value="VAT">Value Added Tax (VAT)</option>
                         <option value="Other">Other Levy / WHT</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Name / Description</label>
                      <input type="text" className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500" placeholder="e.g. Catering Levy" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Percentage Rate</label>
                      <input type="number" step="0.1" className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500" placeholder="0.0" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Linked Liability Account</label>
                      <select className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-medium outline-none">
                         <option>Select GL Account...</option>
                         <option>2001-05 VAT Liability</option>
                         <option>2005-01 WHT Payable</option>
                      </select>
                   </div>
                   <div className="pt-4 border-t border-gray-50 flex justify-end">
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow hover:bg-blue-700 transition">Save Tax</button>
                   </div>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

export default Taxes;
