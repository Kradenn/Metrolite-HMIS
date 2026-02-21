
import React, { useState, useMemo } from 'react';

// --- Interfaces ---
interface Deposit {
  id: number;
  date: string;
  sourceAccount: string;
  destinationBank: string;
  reference: string;
  amount: number;
  status: 'Pending' | 'Cleared' | 'Rejected';
  description: string;
  depositedBy: string;
  notes?: string;
}

// --- Mock Data ---
const MOCK_DEPOSITS: Deposit[] = [
  { 
    id: 1, 
    date: new Date().toISOString().split('T')[0], 
    sourceAccount: 'Main Cashier Till (Till 1)', 
    destinationBank: 'KCB Bank - 1102938475', 
    reference: 'DEP-2023-001', 
    amount: 45000.00, 
    status: 'Pending', 
    description: 'Morning shift sales collection', 
    depositedBy: 'Jane Doe' 
  },
  { 
    id: 2, 
    date: '2023-10-23', 
    sourceAccount: 'Pharmacy Cash Point', 
    destinationBank: 'Equity Bank - 0810293847291', 
    reference: 'DEP-2023-002', 
    amount: 12500.00, 
    status: 'Cleared', 
    description: 'Pharmacy daily revenue', 
    depositedBy: 'John Smith' 
  },
  { 
    id: 3, 
    date: '2023-10-22', 
    sourceAccount: 'Main Cashier Till (Till 2)', 
    destinationBank: 'KCB Bank - 1102938475', 
    reference: 'DEP-2023-003', 
    amount: 80200.00, 
    status: 'Cleared', 
    description: 'Weekend consolidation', 
    depositedBy: 'Jane Doe' 
  },
];

const BankDeposits: React.FC = () => {
  // State
  const [deposits, setDeposits] = useState<Deposit[]>(MOCK_DEPOSITS);
  const [selectedDepositId, setSelectedDepositId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState<Partial<Deposit>>({
    date: new Date().toISOString().split('T')[0],
    status: 'Pending',
    sourceAccount: 'Main Cashier Till (Till 1)',
    amount: 0
  });

  // Derived Data
  const selectedDeposit = useMemo(() => 
    deposits.find(d => d.id === selectedDepositId), 
  [deposits, selectedDepositId]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const pending = deposits.filter(d => d.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);
    const todayTotal = deposits.filter(d => d.date === today).reduce((acc, curr) => acc + curr.amount, 0);
    const totalDeposited = deposits.reduce((acc, curr) => acc + curr.amount, 0);
    return { pending, todayTotal, totalDeposited };
  }, [deposits]);

  const filteredDeposits = useMemo(() => {
    return deposits.filter(d => 
        d.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.destinationBank.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.sourceAccount.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [deposits, searchTerm]);

  // Handlers
  const handleCreateNew = () => {
    setSelectedDepositId(null);
    setFormData({
        date: new Date().toISOString().split('T')[0],
        status: 'Pending',
        sourceAccount: 'Main Cashier Till (Till 1)',
        destinationBank: '',
        amount: 0,
        description: '',
        reference: ''
    });
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newDeposit: Deposit = {
        ...formData,
        id: Date.now(),
        reference: formData.reference || `DEP-${Date.now().toString().slice(-6)}`,
        amount: Number(formData.amount),
        depositedBy: 'Administrator', // Mock user
        status: 'Pending'
    } as Deposit;
    
    setDeposits([newDeposit, ...deposits]);
    setIsCreating(false);
    setSelectedDepositId(newDeposit.id);
  };

  const handleMarkCleared = (id: number) => {
    setDeposits(prev => prev.map(d => d.id === id ? { ...d, status: 'Cleared' } : d));
  };

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'Cleared': return 'bg-green-100 text-green-700 border-green-200';
          case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
          case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
          default: return 'bg-gray-100 text-gray-600';
      }
  };

  return (
    <div className="animate-bottom space-y-6">
       
       {/* 1. Statistics Header */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Deposited Today</p>
                <h3 className="text-2xl font-black text-gray-800 mt-1">KES {stats.todayTotal.toLocaleString()}</h3>
             </div>
             <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shadow-sm">
                <i className="fa fa-calendar-day"></i>
             </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Clearance</p>
                <h3 className="text-2xl font-black text-orange-500 mt-1">KES {stats.pending.toLocaleString()}</h3>
             </div>
             <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl shadow-sm">
                <i className="fa fa-hourglass-half"></i>
             </div>
          </div>
          <button 
             onClick={handleCreateNew}
             className="bg-blue-600 rounded-xl p-5 shadow-lg text-white flex flex-col justify-center items-start cursor-pointer hover:bg-blue-700 transition"
          >
              <div className="flex items-center space-x-3">
                 <i className="fa fa-plus-circle text-2xl"></i>
                 <div>
                    <h3 className="text-lg font-black uppercase tracking-tight">Record Deposit</h3>
                    <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">Cash to Bank</p>
                 </div>
              </div>
          </button>
       </div>

       {/* 2. Main Content Split */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-240px)]">
          
          {/* Left: Recent Deposits List */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                   <h5 className="text-xs font-black text-gray-700 uppercase tracking-widest">Recent Activity</h5>
                </div>
                <div className="relative">
                   <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                   <input 
                      type="text" 
                      placeholder="Search ref or bank..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                   />
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
                {filteredDeposits.map(d => (
                   <div 
                      key={d.id}
                      onClick={() => { setSelectedDepositId(d.id); setIsCreating(false); }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all group ${
                         selectedDepositId === d.id 
                         ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-100' 
                         : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                      }`}
                   >
                      <div className="flex justify-between items-start mb-2">
                         <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase border ${getStatusBadge(d.status)}`}>
                            {d.status}
                         </span>
                         <span className="text-[10px] font-bold text-gray-400">{d.date}</span>
                      </div>
                      <h6 className="text-xs font-black text-gray-800 mb-1">{d.destinationBank}</h6>
                      <div className="flex justify-between items-end">
                         <div className="text-[10px] text-gray-500 font-medium">
                            <p>Ref: <span className="text-blue-600">{d.reference}</span></p>
                            <p className="truncate w-32">{d.sourceAccount}</p>
                         </div>
                         <p className="text-sm font-black text-gray-800">KES {d.amount.toLocaleString()}</p>
                      </div>
                   </div>
                ))}
                {filteredDeposits.length === 0 && (
                   <div className="text-center py-10 text-gray-400 italic text-xs">No deposits found</div>
                )}
             </div>
          </div>

          {/* Right: Workspace (Create or View) */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             
             {isCreating ? (
                // CREATE MODE
                <>
                   <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                      <h5 className="text-sm font-bold text-gray-800 uppercase tracking-tighter">New Bank Deposit</h5>
                   </div>
                   <div className="p-8 flex-1 overflow-y-auto">
                      <form id="depositForm" onSubmit={handleSave} className="max-w-2xl mx-auto space-y-6">
                         
                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Source Account (From)</label>
                                  <select 
                                     className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 outline-none focus:ring-1 focus:ring-blue-500"
                                     value={formData.sourceAccount}
                                     onChange={e => setFormData({...formData, sourceAccount: e.target.value})}
                                     required
                                  >
                                     <option>Main Cashier Till (Till 1)</option>
                                     <option>Pharmacy Cash Point</option>
                                     <option>Petty Cash Vault</option>
                                  </select>
                                  <p className="text-[9px] text-blue-600 font-bold mt-1 text-right">Available: KES 154,200.00</p>
                               </div>
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Deposit Date</label>
                                  <input 
                                     type="date" 
                                     className="w-full p-3 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-800 outline-none focus:ring-1 focus:ring-blue-500"
                                     value={formData.date}
                                     onChange={e => setFormData({...formData, date: e.target.value})}
                                     required
                                  />
                               </div>
                            </div>
                            <div className="space-y-4">
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Destination Bank (To)</label>
                                  <select 
                                     className="w-full p-3 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 outline-none focus:ring-1 focus:ring-blue-500"
                                     value={formData.destinationBank}
                                     onChange={e => setFormData({...formData, destinationBank: e.target.value})}
                                     required
                                  >
                                     <option value="">Select Bank Account...</option>
                                     <option value="KCB Bank - 1102938475">KCB Bank - 1102938475</option>
                                     <option value="Equity Bank - 0810293847291">Equity Bank - 0810293847291</option>
                                     <option value="Standard Chartered - 87293019283">Standard Chartered - 87293019283</option>
                                  </select>
                               </div>
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Deposit Amount</label>
                                  <div className="relative">
                                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">KES</span>
                                     <input 
                                        type="number" 
                                        className="w-full pl-10 pr-3 py-3 bg-blue-50 border border-blue-100 rounded-lg text-sm font-black text-blue-800 outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
                                        required
                                        min="1"
                                     />
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-6">
                            <div>
                               <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Reference / Slip No.</label>
                               <input 
                                  type="text" 
                                  className="w-full p-3 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-800 outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="e.g. SLIP-88291"
                                  value={formData.reference}
                                  onChange={e => setFormData({...formData, reference: e.target.value})}
                               />
                            </div>
                            <div>
                               <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Description / Notes</label>
                               <input 
                                  type="text" 
                                  className="w-full p-3 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-800 outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="Brief description..."
                                  value={formData.description}
                                  onChange={e => setFormData({...formData, description: e.target.value})}
                               />
                            </div>
                         </div>

                      </form>
                   </div>
                   <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
                      <button 
                         onClick={() => { setIsCreating(false); setSelectedDepositId(null); }}
                         className="px-6 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 uppercase hover:bg-white transition"
                      >
                         Cancel
                      </button>
                      <button 
                         onClick={handleSave}
                         className="bg-blue-600 text-white px-8 py-2 rounded-lg text-xs font-black uppercase shadow-lg hover:bg-blue-700 transition"
                      >
                         Save Deposit
                      </button>
                   </div>
                </>
             ) : selectedDeposit ? (
                // VIEW MODE
                <>
                   <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                      <h5 className="text-sm font-bold text-gray-800 uppercase tracking-tighter">
                         Deposit Details <span className="text-blue-600 ml-2">{selectedDeposit.reference}</span>
                      </h5>
                      <div className="flex space-x-2">
                         <button className="bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-gray-100 transition shadow-sm">
                            <i className="fa fa-print mr-1"></i> Print Slip
                         </button>
                         {selectedDeposit.status === 'Pending' && (
                             <button 
                                onClick={() => handleMarkCleared(selectedDeposit.id)}
                                className="bg-green-600 text-white px-4 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-green-700 transition shadow-sm"
                             >
                                <i className="fa fa-check mr-1"></i> Mark Cleared
                             </button>
                         )}
                      </div>
                   </div>

                   <div className="p-8 flex-1 overflow-y-auto">
                      {/* Digital Slip Representation */}
                      <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-0 overflow-hidden relative">
                         <div className="h-2 bg-blue-600 w-full"></div>
                         <div className="p-8">
                            <div className="flex justify-between items-start mb-8">
                               <div>
                                  <h2 className="text-lg font-black text-gray-800 uppercase tracking-tighter">Deposit Slip</h2>
                                  <p className="text-xs text-gray-500 font-bold">{selectedDeposit.date}</p>
                               </div>
                               <div className="text-right">
                                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusBadge(selectedDeposit.status)}`}>
                                     {selectedDeposit.status}
                                  </span>
                               </div>
                            </div>

                            <div className="space-y-6 text-sm">
                               <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                                  <div>
                                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">From Account</p>
                                     <p className="font-bold text-gray-800">{selectedDeposit.sourceAccount}</p>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">To Bank</p>
                                     <p className="font-bold text-gray-800">{selectedDeposit.destinationBank}</p>
                                  </div>
                               </div>

                               <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
                                  <div>
                                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Reference No.</p>
                                     <p className="font-medium text-gray-800 font-mono">{selectedDeposit.reference}</p>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Deposited By</p>
                                     <p className="font-medium text-gray-800">{selectedDeposit.depositedBy}</p>
                                  </div>
                               </div>
                               
                               <div className="pt-2">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Amount Deposited</p>
                                  <p className="text-3xl font-black text-blue-600 tracking-tight">KES {selectedDeposit.amount.toLocaleString()}</p>
                                  <p className="text-xs text-gray-500 italic mt-1">{selectedDeposit.description}</p>
                               </div>
                            </div>
                         </div>
                         <div className="bg-gray-50 p-4 border-t border-gray-100 text-center">
                            <p className="text-[10px] text-gray-400 font-bold uppercase">System Generated Record • ID: {selectedDeposit.id}</p>
                         </div>
                      </div>
                   </div>
                </>
             ) : (
                // EMPTY STATE
                <div className="flex flex-col items-center justify-center h-full text-gray-300">
                   <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <i className="fa fa-university text-4xl opacity-20"></i>
                   </div>
                   <p className="text-sm font-bold uppercase tracking-widest">No Deposit Selected</p>
                   <p className="text-xs mt-1">Select a record from the list or create a new deposit.</p>
                   <button onClick={handleCreateNew} className="mt-6 text-blue-600 text-xs font-bold hover:underline">Create New Deposit</button>
                </div>
             )}

          </div>
       </div>
    </div>
  );
};

export default BankDeposits;
