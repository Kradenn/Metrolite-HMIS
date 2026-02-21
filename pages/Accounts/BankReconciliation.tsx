
import React, { useState, useMemo } from 'react';

// --- Interfaces ---
interface ReconciliationSession {
  id: number;
  bankName: string;
  accountNumber: string;
  period: string; // e.g., "October 2023"
  statementBalance: number;
  openingBalance: number;
  status: 'Draft' | 'Reconciled' | 'Pending Approval';
  lastUpdated: string;
}

interface Transaction {
  id: number;
  date: string;
  ref: string;
  description: string;
  type: 'Debit' | 'Credit';
  amount: number;
  cleared: boolean;
}

// --- Mock Data ---
const MOCK_SESSIONS: ReconciliationSession[] = [
  { 
    id: 1, 
    bankName: 'KCB Bank', 
    accountNumber: '1102938475', 
    period: 'October 2023', 
    statementBalance: 1540000.00, 
    openingBalance: 1200000.00, 
    status: 'Draft', 
    lastUpdated: '2023-10-24 10:30' 
  },
  { 
    id: 2, 
    bankName: 'Equity Bank', 
    accountNumber: '0810293847291', 
    period: 'September 2023', 
    statementBalance: 850000.50, 
    openingBalance: 850000.50, 
    status: 'Reconciled', 
    lastUpdated: '2023-10-05 14:00' 
  },
  { 
    id: 3, 
    bankName: 'Standard Chartered', 
    accountNumber: '87293019283', 
    period: 'October 2023', 
    statementBalance: 45000.00, 
    openingBalance: 40000.00, 
    status: 'Draft', 
    lastUpdated: '2023-10-24 09:15' 
  }
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 101, date: '2023-10-01', ref: 'DEP-001', description: 'Opening Balance fwd', type: 'Credit', amount: 1200000.00, cleared: true },
  { id: 102, date: '2023-10-02', ref: 'CHQ-098', description: 'Payment to MedSurg Supplies', type: 'Debit', amount: 45000.00, cleared: true },
  { id: 103, date: '2023-10-05', ref: 'TRF-102', description: 'Transfer from Cash Till 1', type: 'Credit', amount: 125000.00, cleared: true },
  { id: 104, date: '2023-10-10', ref: 'CHQ-099', description: 'Electricity Bill', type: 'Debit', amount: 15000.00, cleared: false },
  { id: 105, date: '2023-10-12', ref: 'TRF-103', description: 'Insurance Claim Payment (Jubilee)', type: 'Credit', amount: 300000.00, cleared: false },
  { id: 106, date: '2023-10-15', ref: 'BANK-CHG', description: 'Monthly Ledger Fees', type: 'Debit', amount: 1200.00, cleared: true },
  { id: 107, date: '2023-10-20', ref: 'CHQ-100', description: 'Staff Salaries (Batch 1)', type: 'Debit', amount: 850000.00, cleared: false },
];

const BankReconciliation: React.FC = () => {
  const [sessions, setSessions] = useState<ReconciliationSession[]>(MOCK_SESSIONS);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [txnFilter, setTxnFilter] = useState<'All' | 'Debit' | 'Credit'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Cleared' | 'Uncleared'>('All');

  // Derived State
  const selectedSession = useMemo(() => 
    sessions.find(s => s.id === selectedSessionId) || null, 
  [sessions, selectedSessionId]);

  const filteredSessions = useMemo(() => 
    sessions.filter(s => 
      s.bankName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.period.toLowerCase().includes(searchTerm.toLowerCase())
    ), 
  [sessions, searchTerm]);

  // Reconciliation Logic
  const calculation = useMemo(() => {
    if (!selectedSession) return { clearedBalance: 0, difference: 0, clearedCount: 0 };
    
    // In a real app, transactions would be filtered by session ID. 
    // Using simple mock list for demonstration.
    
    const clearedCredits = transactions
        .filter(t => t.cleared && t.type === 'Credit')
        .reduce((sum, t) => sum + t.amount, 0);
        
    const clearedDebits = transactions
        .filter(t => t.cleared && t.type === 'Debit')
        .reduce((sum, t) => sum + t.amount, 0);

    // Cleared Balance = (Opening Balance is assumed part of transactions or added here)
    // For this mock, assume transaction 101 is opening balance included in list if cleared
    // Alternatively, use openingBalance from session + net movement.
    // Let's use simpler logic: Cleared Balance = Sum of all cleared credits - Sum of all cleared debits
    // (Assuming opening balance is Transaction 101)
    
    // BUT usually formula is: Adjusted Bank Balance = Adjusted Book Balance
    // Let's stick to: Difference = Statement Balance - Cleared Book Balance
    
    // Assuming transactions represent book entries.
    const clearedBalance = clearedCredits - clearedDebits;
    
    // Discrepancy
    const difference = selectedSession.statementBalance - clearedBalance;

    return { 
        clearedBalance, 
        difference,
        clearedDebits,
        clearedCredits,
        clearedCount: transactions.filter(t => t.cleared).length
    };
  }, [selectedSession, transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
        const matchesType = txnFilter === 'All' || t.type === txnFilter;
        const matchesStatus = statusFilter === 'All' || (statusFilter === 'Cleared' ? t.cleared : !t.cleared);
        return matchesType && matchesStatus;
    });
  }, [transactions, txnFilter, statusFilter]);

  // Handlers
  const toggleCleared = (id: number) => {
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, cleared: !t.cleared } : t));
  };

  const handleCreateNew = () => {
      alert("Functionality to create new reconciliation period would open modal here.");
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Reconciled': return 'bg-green-100 text-green-700 border-green-200';
          case 'Draft': return 'bg-blue-100 text-blue-700 border-blue-200';
          default: return 'bg-orange-100 text-orange-700 border-orange-200';
      }
  };

  return (
    <div className="animate-bottom space-y-6">
       
       {/* 1. Dashboard Header */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Sessions</p>
                <h3 className="text-2xl font-black text-gray-800 mt-1">{sessions.filter(s => s.status !== 'Reconciled').length}</h3>
             </div>
             <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl shadow-sm">
                <i className="fa fa-folder-open"></i>
             </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Reconciled</p>
                <h3 className="text-lg font-black text-gray-800 mt-1">Oct 5, 2023</h3>
                <p className="text-[10px] text-green-600 font-bold">Equity Bank</p>
             </div>
             <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl shadow-sm">
                <i className="fa fa-check-circle"></i>
             </div>
          </div>
          <button 
             onClick={handleCreateNew}
             className="bg-blue-600 rounded-xl p-5 shadow-lg text-white flex flex-col justify-center items-start cursor-pointer hover:bg-blue-700 transition"
          >
              <div className="flex items-center space-x-3">
                 <i className="fa fa-plus-circle text-2xl"></i>
                 <div>
                    <h3 className="text-lg font-black uppercase tracking-tight">New Session</h3>
                    <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">Start Reconciliation</p>
                 </div>
              </div>
          </button>
       </div>

       {/* 2. Main Workspace Split */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-240px)]">
          
          {/* Left: History List */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                   <h5 className="text-xs font-black text-gray-700 uppercase tracking-widest">Reconciliation History</h5>
                </div>
                <div className="relative">
                   <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                   <input 
                      type="text" 
                      placeholder="Search bank or period..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                   />
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
                {filteredSessions.map(session => (
                   <div 
                      key={session.id}
                      onClick={() => setSelectedSessionId(session.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all group ${
                         selectedSessionId === session.id 
                         ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-100' 
                         : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                      }`}
                   >
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-[10px] font-black uppercase text-gray-500">{session.bankName}</span>
                         <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase border ${getStatusColor(session.status)}`}>
                            {session.status}
                         </span>
                      </div>
                      <h6 className="text-sm font-black text-gray-800 mb-1">{session.period}</h6>
                      <div className="flex justify-between items-end border-t border-gray-50 pt-2">
                         <span className="text-[10px] text-gray-400 font-mono">Last: {session.lastUpdated.split(' ')[0]}</span>
                         <span className="text-[10px] font-bold text-gray-600">Stmt: {session.statementBalance.toLocaleString()}</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Right: Workspace */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             {selectedSession ? (
                <>
                   {/* Session Header & Balancing Math */}
                   <div className="p-4 border-b border-gray-100 bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <h5 className="text-lg font-black text-gray-800 uppercase tracking-tight">{selectedSession.bankName}</h5>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{selectedSession.period} • Acc: {selectedSession.accountNumber}</p>
                         </div>
                         <div className="flex space-x-2">
                            <button className="bg-white border border-gray-300 text-gray-600 px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-gray-50 transition shadow-sm">
                               <i className="fa fa-file-alt mr-1"></i> Report
                            </button>
                            <button className="bg-white border border-gray-300 text-gray-600 px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-gray-50 transition shadow-sm">
                               <i className="fa fa-save mr-1"></i> Save Draft
                            </button>
                            {Math.abs(calculation.difference) < 0.01 && (
                                <button className="bg-green-600 text-white px-4 py-1.5 rounded text-[10px] font-black uppercase shadow hover:bg-green-700 transition">
                                   <i className="fa fa-check-circle mr-1"></i> Finalize
                                </button>
                            )}
                         </div>
                      </div>

                      {/* Balancing Widget */}
                      <div className="grid grid-cols-3 gap-4">
                          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-center">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Statement Balance</p>
                              <p className="text-sm font-black text-blue-600 mt-1">KES {selectedSession.statementBalance.toLocaleString()}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm text-center">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Cleared Balance</p>
                              <p className="text-sm font-black text-gray-800 mt-1">KES {calculation.clearedBalance.toLocaleString()}</p>
                          </div>
                          <div className={`p-3 rounded-lg border shadow-sm text-center ${Math.abs(calculation.difference) < 0.01 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                              <p className={`text-[9px] font-black uppercase tracking-widest ${Math.abs(calculation.difference) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>Difference</p>
                              <p className={`text-lg font-black mt-1 ${Math.abs(calculation.difference) < 0.01 ? 'text-green-700' : 'text-red-700'}`}>
                                 KES {Math.abs(calculation.difference).toLocaleString()}
                              </p>
                          </div>
                      </div>
                   </div>

                   {/* Filters & Actions */}
                   <div className="p-2 border-b border-gray-100 flex justify-between items-center bg-white px-4">
                       <div className="flex space-x-2">
                           {['All', 'Debit', 'Credit'].map(f => (
                               <button 
                                  key={f}
                                  onClick={() => setTxnFilter(f as any)}
                                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition ${txnFilter === f ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                               >
                                  {f}s
                               </button>
                           ))}
                       </div>
                       <div className="flex items-center space-x-2">
                           <span className="text-[10px] font-bold text-gray-400 uppercase">Status:</span>
                           <select 
                              value={statusFilter} 
                              onChange={(e) => setStatusFilter(e.target.value as any)}
                              className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-[10px] font-bold outline-none"
                           >
                              <option value="All">All</option>
                              <option value="Uncleared">Uncleared</option>
                              <option value="Cleared">Cleared</option>
                           </select>
                       </div>
                   </div>

                   {/* Transaction List */}
                   <div className="flex-1 overflow-y-auto">
                       <table className="w-full text-left text-[11px]">
                           <thead className="bg-gray-50 text-gray-500 font-bold uppercase sticky top-0 z-10">
                               <tr>
                                   <th className="px-4 py-2 border-b border-gray-200 w-10 text-center">
                                       <i className="fa fa-check-circle"></i>
                                   </th>
                                   <th className="px-4 py-2 border-b border-gray-200">Date</th>
                                   <th className="px-4 py-2 border-b border-gray-200">Ref</th>
                                   <th className="px-4 py-2 border-b border-gray-200">Description</th>
                                   <th className="px-4 py-2 border-b border-gray-200 text-right">Debit</th>
                                   <th className="px-4 py-2 border-b border-gray-200 text-right">Credit</th>
                               </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100 text-gray-700">
                               {filteredTransactions.map(t => (
                                   <tr key={t.id} className={`hover:bg-blue-50 transition-colors ${t.cleared ? 'bg-green-50/30' : ''}`}>
                                       <td className="px-4 py-3 text-center">
                                           <input 
                                              type="checkbox" 
                                              checked={t.cleared} 
                                              onChange={() => toggleCleared(t.id)}
                                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                                           />
                                       </td>
                                       <td className="px-4 py-3 font-medium">{t.date}</td>
                                       <td className="px-4 py-3 text-blue-600 font-mono">{t.ref}</td>
                                       <td className="px-4 py-3 font-bold text-gray-800">{t.description}</td>
                                       <td className="px-4 py-3 text-right font-medium text-red-500">
                                           {t.type === 'Debit' ? t.amount.toLocaleString() : '-'}
                                       </td>
                                       <td className="px-4 py-3 text-right font-medium text-green-600">
                                           {t.type === 'Credit' ? t.amount.toLocaleString() : '-'}
                                       </td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </div>

                   {/* Footer Totals */}
                   <div className="p-3 bg-gray-50 border-t border-gray-200 grid grid-cols-2 gap-4 text-xs">
                       <div className="flex justify-between font-bold text-red-600">
                          <span>Total Cleared Debits:</span>
                          <span>{calculation.clearedDebits.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between font-bold text-green-600">
                          <span>Total Cleared Credits:</span>
                          <span>{calculation.clearedCredits.toLocaleString()}</span>
                       </div>
                   </div>
                </>
             ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-300">
                   <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <i className="fa fa-scale-balanced text-4xl opacity-20"></i>
                   </div>
                   <p className="text-sm font-bold uppercase tracking-widest">Select a Session</p>
                   <p className="text-xs mt-1">Select a period from the left to start reconciling.</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default BankReconciliation;
