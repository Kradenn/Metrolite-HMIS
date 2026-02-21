
import React, { useState, useMemo } from 'react';

// --- Interfaces ---
interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

interface Transfer {
  id: string;
  date: string;
  from: string;
  to: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Rejected';
  ref: string;
  user: string;
}

// --- Mock Data ---
const ACCOUNTS: Account[] = [
  { id: '1', name: 'Main Safe (Vault)', balance: 1500000, currency: 'KES' },
  { id: '2', name: 'Front Desk Till 1', balance: 45000, currency: 'KES' },
  { id: '3', name: 'Pharmacy Cash Point', balance: 120500, currency: 'KES' },
  { id: '4', name: 'Petty Cash', balance: 5000, currency: 'KES' },
];

const TRANSFERS: Transfer[] = [
  { id: 'TRF-1001', date: '2023-10-24 08:30', from: 'Main Safe (Vault)', to: 'Front Desk Till 1', amount: 20000, status: 'Completed', ref: 'FLOAT-01', user: 'Admin' },
  { id: 'TRF-1002', date: '2023-10-24 10:15', from: 'Front Desk Till 1', to: 'Main Safe (Vault)', amount: 50000, status: 'Pending', ref: 'SWEEP-01', user: 'John Doe' },
  { id: 'TRF-1003', date: '2023-10-23 16:00', from: 'Pharmacy Cash Point', to: 'Main Safe (Vault)', amount: 110000, status: 'Completed', ref: 'EOD-PHARM', user: 'Sarah K.' },
];

const CashTransfers: React.FC = () => {
  const [transfers, setTransfers] = useState<Transfer[]>(TRANSFERS);
  const [sourceId, setSourceId] = useState('');
  const [destId, setDestinationId] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [reference, setReference] = useState('');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const sourceAccount = ACCOUNTS.find(a => a.id === sourceId);
  const destAccount = ACCOUNTS.find(a => a.id === destId);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceAccount || !destAccount || !amount) return;

    const newTransfer: Transfer = {
      id: `TRF-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleString(),
      from: sourceAccount.name,
      to: destAccount.name,
      amount: Number(amount),
      status: 'Pending', // Default to pending for approval
      ref: reference || 'MANUAL',
      user: 'Current User'
    };

    setTransfers([newTransfer, ...transfers]);
    // Reset
    setAmount('');
    setReference('');
    setDescription('');
  };

  const filteredTransfers = useMemo(() => {
    return transfers.filter(t => 
      t.from.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ref.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transfers, searchTerm]);

  return (
    <div className="animate-bottom space-y-6">
       
       {/* Stats Header */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
             <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Today's Volume</h6>
             <div className="flex items-center justify-between mt-2">
                <h3 className="text-2xl font-black text-gray-800">KES 180,000</h3>
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><i className="fa fa-exchange-alt"></i></div>
             </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
             <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Approval</h6>
             <div className="flex items-center justify-between mt-2">
                <h3 className="text-2xl font-black text-orange-500">1</h3>
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center"><i className="fa fa-clock"></i></div>
             </div>
          </div>
          <div className="bg-blue-600 rounded-xl p-5 shadow-lg text-white flex flex-col justify-center items-start cursor-pointer hover:bg-blue-700 transition">
              <div className="flex items-center space-x-3">
                 <i className="fa fa-history text-2xl"></i>
                 <div>
                    <h3 className="text-lg font-black uppercase tracking-tight">Audit Log</h3>
                    <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">View All Movements</p>
                 </div>
              </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-280px)]">
          
          {/* Left: Transfer Form */}
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest">New Internal Transfer</h5>
             </div>
             
             <div className="p-8 flex-1 overflow-y-auto">
                <form onSubmit={handleTransfer} className="space-y-8">
                   
                   {/* Flow Visualization */}
                   <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                      <div className="flex-1 space-y-2">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">From (Source)</label>
                          <select 
                             value={sourceId} 
                             onChange={e => setSourceId(e.target.value)}
                             className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-bold shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                             required
                          >
                             <option value="">Select Account</option>
                             {ACCOUNTS.filter(a => a.id !== destId).map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                             ))}
                          </select>
                          {sourceAccount && (
                             <p className="text-[10px] font-bold text-green-600 text-right">Bal: {sourceAccount.currency} {sourceAccount.balance.toLocaleString()}</p>
                          )}
                      </div>

                      <div className="px-6 flex flex-col items-center justify-center text-gray-300">
                          <i className="fa fa-arrow-right text-xl"></i>
                      </div>

                      <div className="flex-1 space-y-2">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">To (Destination)</label>
                          <select 
                             value={destId} 
                             onChange={e => setDestinationId(e.target.value)}
                             className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-bold shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
                             required
                          >
                             <option value="">Select Account</option>
                             {ACCOUNTS.filter(a => a.id !== sourceId).map(a => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                             ))}
                          </select>
                          {destAccount && (
                             <p className="text-[10px] font-bold text-blue-600 text-right">Bal: {destAccount.currency} {destAccount.balance.toLocaleString()}</p>
                          )}
                      </div>
                   </div>

                   {/* Details */}
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Amount</label>
                            <div className="relative">
                               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold">KES</span>
                               <input 
                                  type="number" 
                                  min="1"
                                  value={amount}
                                  onChange={e => setAmount(Number(e.target.value))}
                                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-lg font-black text-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="0.00"
                                  required
                               />
                            </div>
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Reference No.</label>
                            <input 
                               type="text" 
                               value={reference}
                               onChange={e => setReference(e.target.value)}
                               className="w-full p-3 bg-white border border-gray-300 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
                               placeholder="e.g. SLIP-1029"
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Description / Notes</label>
                         <textarea 
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-xs font-medium outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                            placeholder="Reason for transfer..."
                            required
                         ></textarea>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                      <button type="button" className="px-6 py-2.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 uppercase hover:bg-gray-50">Cancel</button>
                      <button type="submit" className="bg-blue-600 text-white px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition transform active:scale-95">
                         Confirm Transfer
                      </button>
                   </div>
                </form>
             </div>
          </div>

          {/* Right: History List */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                   <h5 className="text-xs font-black text-gray-700 uppercase tracking-widest">Recent Activity</h5>
                </div>
                <div className="relative">
                   <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                   <input 
                      type="text" 
                      placeholder="Search transfers..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                   />
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
                {filteredTransfers.map(t => (
                   <div key={t.id} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-[10px] font-black text-gray-400">{t.date}</span>
                         <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            t.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                            t.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                         }`}>{t.status}</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <div className="flex-1">
                             <p className="text-xs font-bold text-gray-700 truncate">{t.from}</p>
                             <i className="fa fa-arrow-down text-[10px] text-gray-300 my-1"></i>
                             <p className="text-xs font-bold text-blue-600 truncate">{t.to}</p>
                         </div>
                         <div className="text-right pl-4">
                             <p className="text-sm font-black text-gray-800">KES {t.amount.toLocaleString()}</p>
                             <p className="text-[10px] text-gray-400 font-mono">{t.ref}</p>
                         </div>
                      </div>
                   </div>
                ))}
                {filteredTransfers.length === 0 && (
                   <div className="text-center py-10 text-gray-400 italic text-xs">No transfers found</div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default CashTransfers;
