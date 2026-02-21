
import React, { useState } from 'react';

interface PaymentMode {
  id: number;
  name: string;
  type: 'Cash' | 'Mobile' | 'Card' | 'Insurance' | 'Cheque';
  subAccount: string;
  active: boolean;
  isDefault: boolean;
  integration?: string;
}

const PaymentModes: React.FC = () => {
  const [modes, setModes] = useState<PaymentMode[]>([
    { id: 1, name: 'Cash (KES)', type: 'Cash', subAccount: '1001-01 Cash Main', active: true, isDefault: true },
    { id: 2, name: 'M-Pesa (Buy Goods)', type: 'Mobile', subAccount: '1002-01 M-Pesa Till', active: true, isDefault: false, integration: 'Safaricom API' },
    { id: 3, name: 'Visa / Mastercard', type: 'Card', subAccount: '1003-01 Equity Bank', active: true, isDefault: false, integration: 'IPay Africa' },
    { id: 4, name: 'Insurance (Credit)', type: 'Insurance', subAccount: '1200-01 Accounts Receivable', active: true, isDefault: false },
    { id: 5, name: 'Bank Cheque', type: 'Cheque', subAccount: '1003-01 Equity Bank', active: false, isDefault: false },
  ]);

  const [showModal, setShowModal] = useState(false);

  const getIcon = (type: string) => {
      switch(type) {
          case 'Cash': return 'fa-money-bill-wave text-green-600 bg-green-100';
          case 'Mobile': return 'fa-mobile-alt text-green-500 bg-green-50';
          case 'Card': return 'fa-credit-card text-blue-600 bg-blue-100';
          case 'Insurance': return 'fa-file-medical text-purple-600 bg-purple-100';
          default: return 'fa-money-check text-gray-600 bg-gray-100';
      }
  };

  const handleToggle = (id: number) => {
      setModes(prev => prev.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  return (
    <div className="animate-bottom space-y-6">
       
       <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div>
             <h2 className="text-2xl font-bold text-gray-800">Payment Configuration</h2>
             <p className="text-sm text-gray-500">Manage accepted payment methods and integrations.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition">
             <i className="fa fa-plus mr-2"></i> Add Payment Mode
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modes.map(mode => (
             <div key={mode.id} className={`bg-white border rounded-xl p-6 transition-all duration-200 hover:shadow-lg relative overflow-hidden group ${mode.active ? 'border-gray-200' : 'border-gray-200 opacity-60 bg-gray-50'}`}>
                {mode.isDefault && (
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] px-3 py-1 rounded-bl-lg font-bold uppercase">Default</div>
                )}
                
                <div className="flex items-start justify-between mb-4">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${getIcon(mode.type)}`}>
                      <i className={`fa ${getIcon(mode.type).split(' ')[0]}`}></i>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={mode.active} onChange={() => handleToggle(mode.id)} />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                   </label>
                </div>

                <h3 className="text-lg font-black text-gray-800">{mode.name}</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mt-1">{mode.type} Payment</p>

                <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                   <div className="flex justify-between text-xs">
                      <span className="text-gray-400 font-bold">Ledger Account:</span>
                      <span className="text-gray-700 font-medium truncate max-w-[120px]">{mode.subAccount}</span>
                   </div>
                   {mode.integration && (
                      <div className="flex justify-between text-xs">
                         <span className="text-gray-400 font-bold">Integration:</span>
                         <span className="text-blue-600 font-bold bg-blue-50 px-2 rounded">{mode.integration}</span>
                      </div>
                   )}
                </div>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-full shadow-sm"><i className="fa fa-pencil-alt"></i></button>
                </div>
             </div>
          ))}
       </div>

       {/* Add Modal */}
       {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                   <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest">New Payment Method</h5>
                   <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa fa-times text-lg"></i></button>
                </div>
                <div className="p-6 space-y-4">
                   <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Method Name</label>
                      <input type="text" className="w-full p-2.5 border border-gray-200 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500" placeholder="e.g. Airtel Money" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Type</label>
                         <select className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs outline-none">
                            <option>Cash</option>
                            <option>Mobile Money</option>
                            <option>Card</option>
                            <option>Insurance</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Integration</label>
                         <select className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs outline-none">
                            <option>None</option>
                            <option>M-Pesa API</option>
                            <option>IPay Africa</option>
                         </select>
                      </div>
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Linked Sub-Account</label>
                      <select className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs outline-none">
                         <option>Select Ledger Account...</option>
                      </select>
                   </div>
                   <div className="pt-4 flex justify-end">
                      <button className="bg-blue-600 text-white px-6 py-2 rounded text-xs font-black uppercase tracking-widest shadow hover:bg-blue-700">Save Mode</button>
                   </div>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

export default PaymentModes;
