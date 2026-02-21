
import React, { useState, useMemo } from 'react';

// --- Interfaces ---
interface BudgetLineItem {
  id: number;
  category: string; // e.g., "Staff Salaries", "Medical Supplies"
  glAccount: string;
  budgetedAmount: number;
  actualAmount: number;
}

interface Budget {
  id: number;
  no: string;
  name: string;
  fiscalYear: string;
  interval: 'Monthly' | 'Quarterly' | 'Yearly';
  startDate: string;
  endDate: string;
  status: 'Active' | 'Draft' | 'Closed';
  items: BudgetLineItem[];
}

// --- Mock Data ---
const MOCK_BUDGETS: Budget[] = [
  {
    id: 1,
    no: 'BUD-2024-FY',
    name: 'FY 2024 Master Operating Budget',
    fiscalYear: '2024',
    interval: 'Yearly',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'Active',
    items: [
      { id: 101, category: 'Staff Salaries', glAccount: '6001-00 (Payroll)', budgetedAmount: 12000000, actualAmount: 3500000 },
      { id: 102, category: 'Medical Supplies', glAccount: '5001-00 (Inventory)', budgetedAmount: 4500000, actualAmount: 1200000 },
      { id: 103, category: 'Utilities', glAccount: '6020-00 (Opex)', budgetedAmount: 800000, actualAmount: 150000 },
      { id: 104, category: 'Facility Maintenance', glAccount: '6030-00 (Opex)', budgetedAmount: 500000, actualAmount: 480000 },
      { id: 105, category: 'Marketing', glAccount: '6050-00 (Opex)', budgetedAmount: 200000, actualAmount: 25000 },
    ]
  },
  {
    id: 2,
    no: 'BUD-2024-Q1-PHARM',
    name: 'Q1 Pharmacy Procurement',
    fiscalYear: '2024',
    interval: 'Quarterly',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    status: 'Closed',
    items: [
      { id: 201, category: 'Antibiotics', glAccount: '5005-01', budgetedAmount: 1500000, actualAmount: 1450000 },
      { id: 202, category: 'Analgesics', glAccount: '5005-02', budgetedAmount: 500000, actualAmount: 520000 },
      { id: 203, category: 'Consumables', glAccount: '5005-03', budgetedAmount: 300000, actualAmount: 280000 },
    ]
  },
  {
    id: 3,
    no: 'BUD-2025-DRAFT',
    name: 'FY 2025 Proposed Budget',
    fiscalYear: '2025',
    interval: 'Yearly',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    status: 'Draft',
    items: [
      { id: 301, category: 'Staff Salaries', glAccount: '6001-00', budgetedAmount: 13500000, actualAmount: 0 },
      { id: 302, category: 'Expansion Project', glAccount: '1500-00 (Capex)', budgetedAmount: 5000000, actualAmount: 0 },
    ]
  }
];

const Budgeting: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>(MOCK_BUDGETS);
  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(MOCK_BUDGETS[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Create Form State
  const [newBudgetForm, setNewBudgetForm] = useState({
      name: '',
      fiscalYear: new Date().getFullYear().toString(),
      interval: 'Yearly' as 'Yearly' | 'Quarterly' | 'Monthly',
      startDate: '',
      endDate: ''
  });

  // Derived Data
  const filteredBudgets = useMemo(() => {
    return budgets.filter(b => 
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.no.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [budgets, searchTerm]);

  const selectedBudget = useMemo(() => 
    budgets.find(b => b.id === selectedBudgetId) || null
  , [budgets, selectedBudgetId]);

  const stats = useMemo(() => {
     // Calculate stats for Active budgets only
     const activeBudgets = budgets.filter(b => b.status === 'Active');
     const totalBudgeted = activeBudgets.reduce((acc, b) => acc + b.items.reduce((s, i) => s + i.budgetedAmount, 0), 0);
     const totalActual = activeBudgets.reduce((acc, b) => acc + b.items.reduce((s, i) => s + i.actualAmount, 0), 0);
     const utilization = totalBudgeted > 0 ? (totalActual / totalBudgeted) * 100 : 0;
     
     return { totalBudgeted, totalActual, utilization, count: activeBudgets.length };
  }, [budgets]);

  const selectedBudgetSummary = useMemo(() => {
      if (!selectedBudget) return { total: 0, actual: 0, percent: 0 };
      const total = selectedBudget.items.reduce((sum, item) => sum + item.budgetedAmount, 0);
      const actual = selectedBudget.items.reduce((sum, item) => sum + item.actualAmount, 0);
      return { total, actual, percent: total > 0 ? (actual / total) * 100 : 0 };
  }, [selectedBudget]);

  // Handlers
  const handleCreate = (e: React.FormEvent) => {
      e.preventDefault();
      const newBudget: Budget = {
          id: Date.now(),
          no: `BUD-${newBudgetForm.fiscalYear}-${Math.floor(Math.random() * 100)}`,
          name: newBudgetForm.name,
          fiscalYear: newBudgetForm.fiscalYear,
          interval: newBudgetForm.interval,
          startDate: newBudgetForm.startDate,
          endDate: newBudgetForm.endDate,
          status: 'Draft',
          items: []
      };
      setBudgets([...budgets, newBudget]);
      setSelectedBudgetId(newBudget.id);
      setShowCreateModal(false);
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Active': return 'bg-green-100 text-green-700 border-green-200';
          case 'Draft': return 'bg-blue-100 text-blue-700 border-blue-200';
          case 'Closed': return 'bg-gray-100 text-gray-600 border-gray-200';
          default: return 'bg-gray-100 text-gray-600';
      }
  };

  const getUtilizationColor = (percent: number) => {
      if (percent >= 100) return 'bg-red-500';
      if (percent >= 85) return 'bg-orange-500';
      return 'bg-blue-600';
  };

  return (
    <div className="animate-bottom space-y-6">
      
      {/* 1. Top Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Active Budget</h6>
              <h3 className="text-2xl font-black text-gray-800 mt-1">KES {(stats.totalBudgeted / 1000000).toFixed(2)}M</h3>
              <p className="text-[10px] text-green-600 font-bold mt-1">Allocated Funds</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Spend</h6>
              <h3 className="text-2xl font-black text-blue-600 mt-1">KES {(stats.totalActual / 1000000).toFixed(2)}M</h3>
              <p className="text-[10px] text-gray-400 font-bold mt-1">Actual Utilization</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Overall Variance</h6>
              <h3 className={`text-2xl font-black mt-1 ${stats.utilization > 100 ? 'text-red-500' : 'text-green-600'}`}>
                  {stats.utilization.toFixed(1)}%
              </h3>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                  <div className={`h-1.5 rounded-full ${getUtilizationColor(stats.utilization)}`} style={{ width: `${Math.min(stats.utilization, 100)}%` }}></div>
              </div>
          </div>
          <button 
             onClick={() => setShowCreateModal(true)}
             className="bg-blue-600 rounded-xl p-5 shadow-lg text-white flex flex-col justify-center items-start cursor-pointer hover:bg-blue-700 transition"
          >
              <div className="flex items-center space-x-3">
                 <i className="fa fa-plus-circle text-2xl"></i>
                 <div>
                    <h3 className="text-lg font-black uppercase tracking-tight">Create Budget</h3>
                    <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">New Fiscal Plan</p>
                 </div>
              </div>
          </button>
      </div>

      {/* 2. Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-280px)]">
         
         {/* LEFT: Budget List */}
         <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col gap-3">
               <div className="flex justify-between items-center">
                  <h5 className="text-xs font-black text-gray-700 uppercase tracking-widest">Budgets List</h5>
               </div>
               <div className="relative">
                  <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <input 
                     type="text" 
                     placeholder="Search budgets..." 
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                  />
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
               {filteredBudgets.map(b => (
                   <div 
                      key={b.id}
                      onClick={() => setSelectedBudgetId(b.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all group ${
                         selectedBudgetId === b.id 
                         ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-100' 
                         : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                      }`}
                   >
                      <div className="flex justify-between items-start mb-2">
                         <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase border ${getStatusColor(b.status)}`}>
                            {b.status}
                         </span>
                         <span className="text-[10px] font-bold text-gray-400">{b.fiscalYear}</span>
                      </div>
                      <h6 className="text-xs font-black text-gray-800 uppercase leading-snug mb-1">{b.name}</h6>
                      <div className="flex justify-between items-end border-t border-gray-50 pt-2">
                         <span className="text-[10px] text-gray-500 font-medium">{b.interval}</span>
                         <span className="text-[9px] text-gray-400 font-mono">{b.no}</span>
                      </div>
                   </div>
               ))}
            </div>
         </div>

         {/* RIGHT: Budget Details */}
         <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             {selectedBudget ? (
                 <>
                    {/* Header Details */}
                    <div className="p-5 border-b border-gray-100 bg-gray-50">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                             <h4 className="text-lg font-black text-gray-800 uppercase tracking-tight">{selectedBudget.name}</h4>
                             <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-500 mt-1">
                                <span>{selectedBudget.no}</span>
                                <span className="text-gray-300">•</span>
                                <span>FY {selectedBudget.fiscalYear}</span>
                                <span className="text-gray-300">•</span>
                                <span>{selectedBudget.startDate} to {selectedBudget.endDate}</span>
                             </div>
                          </div>
                          <div className="flex space-x-2">
                             <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-[10px] font-black uppercase hover:bg-gray-50 shadow-sm">
                                <i className="fa fa-print mr-2"></i> Report
                             </button>
                             {selectedBudget.status === 'Draft' ? (
                                 <button className="bg-green-600 text-white px-4 py-1.5 rounded text-[10px] font-black uppercase hover:bg-green-700 shadow shadow-green-200">
                                    Activate Budget
                                 </button>
                             ) : (
                                 <button className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded text-[10px] font-black uppercase hover:bg-gray-200">
                                    Edit Budget
                                 </button>
                             )}
                          </div>
                       </div>
                       
                       {/* Mini Summary Dashboard */}
                       <div className="grid grid-cols-3 gap-4">
                           <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Allocated</p>
                               <p className="text-sm font-black text-gray-800 mt-1">KES {selectedBudgetSummary.total.toLocaleString()}</p>
                           </div>
                           <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Spent</p>
                               <p className="text-sm font-black text-blue-600 mt-1">KES {selectedBudgetSummary.actual.toLocaleString()}</p>
                           </div>
                           <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-center">
                               <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                                   <span>Utilization</span>
                                   <span className={selectedBudgetSummary.percent > 100 ? 'text-red-600' : 'text-green-600'}>
                                      {selectedBudgetSummary.percent.toFixed(1)}%
                                   </span>
                               </div>
                               <div className="w-full bg-gray-100 rounded-full h-1.5">
                                   <div className={`h-1.5 rounded-full ${getUtilizationColor(selectedBudgetSummary.percent)}`} style={{ width: `${Math.min(selectedBudgetSummary.percent, 100)}%` }}></div>
                               </div>
                           </div>
                       </div>
                    </div>

                    {/* Budget Lines */}
                    <div className="flex-1 overflow-y-auto p-0">
                       <table className="w-full text-left text-[11px]">
                          <thead className="bg-gray-100 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-tight sticky top-0 z-10">
                             <tr>
                                <th className="px-6 py-3">Category / Line Item</th>
                                <th className="px-6 py-3">GL Account</th>
                                <th className="px-6 py-3 text-right">Budgeted</th>
                                <th className="px-6 py-3 text-right">Actual Spend</th>
                                <th className="px-6 py-3 text-right">Variance</th>
                                <th className="px-6 py-3 text-center">Usage</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-gray-700">
                             {selectedBudget.items.map(item => {
                                 const variance = item.budgetedAmount - item.actualAmount;
                                 const percent = item.budgetedAmount > 0 ? (item.actualAmount / item.budgetedAmount) * 100 : 0;
                                 
                                 return (
                                     <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                                         <td className="px-6 py-3 font-bold text-gray-800">{item.category}</td>
                                         <td className="px-6 py-3 text-gray-500 font-mono">{item.glAccount}</td>
                                         <td className="px-6 py-3 text-right font-medium">{item.budgetedAmount.toLocaleString()}</td>
                                         <td className="px-6 py-3 text-right font-medium">{item.actualAmount.toLocaleString()}</td>
                                         <td className={`px-6 py-3 text-right font-bold ${variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {variance.toLocaleString()}
                                         </td>
                                         <td className="px-6 py-3">
                                             <div className="flex items-center space-x-2">
                                                <div className="flex-1 bg-gray-100 rounded-full h-1.5 min-w-[60px]">
                                                    <div className={`h-1.5 rounded-full ${getUtilizationColor(percent)}`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
                                                </div>
                                                <span className="text-[9px] font-bold text-gray-500 w-8 text-right">{percent.toFixed(0)}%</span>
                                             </div>
                                         </td>
                                     </tr>
                                 );
                             })}
                          </tbody>
                       </table>
                       {selectedBudget.items.length === 0 && (
                          <div className="text-center py-10 text-gray-400 italic text-xs">
                             No line items added to this budget yet.
                          </div>
                       )}
                    </div>
                 </>
             ) : (
                 <div className="flex flex-col items-center justify-center h-full text-gray-300">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                       <i className="fa fa-chart-pie text-4xl opacity-20"></i>
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest">Select a Budget</p>
                    <p className="text-xs mt-1 text-gray-400">View performance or manage allocations.</p>
                 </div>
             )}
         </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                   <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest">Create New Budget</h5>
                   <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa fa-times text-lg"></i></button>
                </div>
                <div className="p-6">
                   <form onSubmit={handleCreate} className="space-y-4">
                      <div>
                         <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Budget Name / Title</label>
                         <input 
                            type="text" required
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                            value={newBudgetForm.name}
                            onChange={e => setNewBudgetForm({...newBudgetForm, name: e.target.value})}
                         />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Fiscal Year</label>
                            <input 
                               type="number" required
                               className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                               value={newBudgetForm.fiscalYear}
                               onChange={e => setNewBudgetForm({...newBudgetForm, fiscalYear: e.target.value})}
                            />
                         </div>
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Interval</label>
                            <select 
                               className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                               value={newBudgetForm.interval}
                               onChange={e => setNewBudgetForm({...newBudgetForm, interval: e.target.value as any})}
                            >
                               <option value="Yearly">Yearly</option>
                               <option value="Quarterly">Quarterly</option>
                               <option value="Monthly">Monthly</option>
                            </select>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Start Date</label>
                            <input 
                               type="date" required
                               className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                               value={newBudgetForm.startDate}
                               onChange={e => setNewBudgetForm({...newBudgetForm, startDate: e.target.value})}
                            />
                         </div>
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">End Date</label>
                            <input 
                               type="date" required
                               className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                               value={newBudgetForm.endDate}
                               onChange={e => setNewBudgetForm({...newBudgetForm, endDate: e.target.value})}
                            />
                         </div>
                      </div>
                      <div className="pt-4 flex justify-end gap-2">
                         <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-gray-200 rounded text-xs font-bold uppercase text-gray-600 hover:bg-gray-50">Cancel</button>
                         <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded text-xs font-black uppercase shadow hover:bg-blue-700">Initialize</button>
                      </div>
                   </form>
                </div>
             </div>
          </div>
      )}

    </div>
  );
};

export default Budgeting;
