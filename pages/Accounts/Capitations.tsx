
import React, { useState, useMemo } from 'react';

// --- Interfaces ---
interface ConsumptionEntry {
  id: number;
  date: string;
  patient: string;
  service: string;
  amount: number;
}

interface Capitation {
  id: number;
  refNo: string;
  title: string; // e.g. "Q4 2023 SHA/NHIF Allocation"
  scheme: string;
  periodStart: string;
  periodEnd: string;
  amountReceived: number;
  amountConsumed: number;
  paymentMode: string;
  paymentRef: string;
  dateReceived: string;
  status: 'Active' | 'Exhausted' | 'Expired';
  consumptionLog: ConsumptionEntry[];
}

// --- Mock Data ---
const MOCK_CAPITATIONS: Capitation[] = [
  {
    id: 1,
    refNo: 'CAP-2023-Q4',
    title: 'Q4 2023 SHA/NHIF Allocation',
    scheme: 'Social Health Authority (SHA)',
    periodStart: '2023-10-01',
    periodEnd: '2023-12-31',
    amountReceived: 2500000.00,
    amountConsumed: 1120450.00,
    paymentMode: 'Bank Transfer',
    paymentRef: 'EFT-0098221',
    dateReceived: '2023-10-05',
    status: 'Active',
    consumptionLog: [
       { id: 101, date: '2023-10-06', patient: 'John Doe', service: 'General OP', amount: 1500 },
       { id: 102, date: '2023-10-07', patient: 'Mary Jane', service: 'Maternity', amount: 5000 },
       { id: 103, date: '2023-10-08', patient: 'Peter Pan', service: 'Dental', amount: 2500 },
       { id: 104, date: '2023-10-10', patient: 'Alice W.', service: 'Lab Works', amount: 800 },
    ]
  },
  {
    id: 2,
    refNo: 'CAP-2023-Q3',
    title: 'Q3 2023 Linda Mama Grant',
    scheme: 'Linda Mama',
    periodStart: '2023-07-01',
    periodEnd: '2023-09-30',
    amountReceived: 1000000.00,
    amountConsumed: 985000.00,
    paymentMode: 'Cheque',
    paymentRef: 'CHQ-88291',
    dateReceived: '2023-07-10',
    status: 'Exhausted',
    consumptionLog: []
  },
  {
    id: 3,
    refNo: 'CAP-2023-Edu',
    title: 'Student Health Edu-Cover 2023',
    scheme: 'Edu-Afya',
    periodStart: '2023-01-01',
    periodEnd: '2023-12-31',
    amountReceived: 500000.00,
    amountConsumed: 120000.00,
    paymentMode: 'Bank Transfer',
    paymentRef: 'RTGS-11029',
    dateReceived: '2023-01-15',
    status: 'Active',
    consumptionLog: []
  }
];

const Capitations: React.FC = () => {
  const [capitations, setCapitations] = useState<Capitation[]>(MOCK_CAPITATIONS);
  const [selectedId, setSelectedId] = useState<number | null>(MOCK_CAPITATIONS[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'consumption'>('overview');

  // Form State
  const [newCapForm, setNewCapForm] = useState<Partial<Capitation>>({
      title: '', scheme: '', amountReceived: 0, periodStart: '', periodEnd: '', paymentMode: 'Bank Transfer'
  });

  // Derived Data
  const selectedCapitation = useMemo(() => 
    capitations.find(c => c.id === selectedId), 
  [capitations, selectedId]);

  const filteredList = useMemo(() => 
    capitations.filter(c => 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.scheme.toLowerCase().includes(searchTerm.toLowerCase())
    ), 
  [capitations, searchTerm]);

  const stats = useMemo(() => {
     const totalReceived = capitations.reduce((acc, c) => acc + c.amountReceived, 0);
     const totalConsumed = capitations.reduce((acc, c) => acc + c.amountConsumed, 0);
     const utilization = totalReceived > 0 ? (totalConsumed / totalReceived) * 100 : 0;
     const activeCount = capitations.filter(c => c.status === 'Active').length;
     return { totalReceived, totalConsumed, utilization, activeCount };
  }, [capitations]);

  // Handlers
  const handleCreate = (e: React.FormEvent) => {
      e.preventDefault();
      const newRec: Capitation = {
          id: Date.now(),
          refNo: `CAP-${new Date().getFullYear()}-${Math.floor(Math.random()*100)}`,
          title: newCapForm.title || 'New Allocation',
          scheme: newCapForm.scheme || 'General',
          periodStart: newCapForm.periodStart || '',
          periodEnd: newCapForm.periodEnd || '',
          amountReceived: Number(newCapForm.amountReceived),
          amountConsumed: 0,
          paymentMode: newCapForm.paymentMode || 'Cash',
          paymentRef: newCapForm.paymentRef || '-',
          dateReceived: new Date().toISOString().split('T')[0],
          status: 'Active',
          consumptionLog: []
      };
      setCapitations([newRec, ...capitations]);
      setSelectedId(newRec.id);
      setShowCreateModal(false);
  };

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'Active': return 'bg-green-100 text-green-700 border-green-200';
          case 'Exhausted': return 'bg-red-100 text-red-700 border-red-200';
          case 'Expired': return 'bg-gray-100 text-gray-600 border-gray-200';
          default: return 'bg-blue-100 text-blue-700';
      }
  };

  const getUtilizationColor = (percent: number) => {
      if (percent >= 90) return 'bg-red-500';
      if (percent >= 75) return 'bg-orange-500';
      return 'bg-blue-600';
  };

  return (
    <div className="animate-bottom space-y-6">
       
       {/* 1. Dashboard Statistics */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
             <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Funds Received</h6>
             <h3 className="text-2xl font-black text-gray-800 mt-1">KES {(stats.totalReceived / 1000000).toFixed(2)}M</h3>
             <p className="text-[10px] text-green-600 font-bold mt-1">Cumulative Allocations</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
             <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Consumed</h6>
             <h3 className="text-2xl font-black text-blue-600 mt-1">KES {(stats.totalConsumed / 1000000).toFixed(2)}M</h3>
             <p className="text-[10px] text-gray-500 font-bold mt-1">Utilized via Claims</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
             <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Utilization Rate</h6>
             <h3 className="text-2xl font-black text-gray-800 mt-1">{stats.utilization.toFixed(1)}%</h3>
             <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                 <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${Math.min(stats.utilization, 100)}%` }}></div>
             </div>
          </div>
          <button 
             onClick={() => setShowCreateModal(true)}
             className="bg-blue-600 rounded-xl p-5 shadow-lg text-white flex flex-col justify-center items-start cursor-pointer hover:bg-blue-700 transition"
          >
             <div className="flex items-center space-x-3">
                <i className="fa fa-plus-circle text-2xl"></i>
                <div>
                   <h3 className="text-lg font-black uppercase tracking-tight">Receive Funds</h3>
                   <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">New Capitation</p>
                </div>
             </div>
          </button>
       </div>

       {/* 2. Main Content Area */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-240px)]">
          
          {/* Left: Capitation List */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                   <h5 className="text-xs font-black text-gray-700 uppercase tracking-widest">Allocations</h5>
                   <span className="bg-blue-100 text-blue-700 text-[9px] px-2 py-0.5 rounded-full font-bold">{stats.activeCount} Active</span>
                </div>
                <div className="relative">
                   <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                   <input 
                      type="text" 
                      placeholder="Search schemes..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                   />
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
                {filteredList.map(cap => {
                   const percent = (cap.amountConsumed / cap.amountReceived) * 100;
                   return (
                      <div 
                         key={cap.id}
                         onClick={() => setSelectedId(cap.id)}
                         className={`p-3 rounded-xl border cursor-pointer transition-all group ${
                            selectedId === cap.id 
                            ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-100' 
                            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                         }`}
                      >
                         <div className="flex justify-between items-start mb-2">
                            <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase border ${getStatusBadge(cap.status)}`}>
                               {cap.status}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400">{cap.dateReceived}</span>
                         </div>
                         <h6 className="text-xs font-black text-gray-800 uppercase leading-snug mb-1">{cap.title}</h6>
                         <p className="text-[10px] text-gray-500 font-medium mb-2">{cap.scheme}</p>
                         
                         {/* Mini Progress */}
                         <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                            <div className={`h-1.5 rounded-full ${getUtilizationColor(percent)}`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
                         </div>
                         <div className="flex justify-between text-[9px] font-bold text-gray-400">
                            <span>{percent.toFixed(0)}% Used</span>
                            <span>Bal: {(cap.amountReceived - cap.amountConsumed).toLocaleString()}</span>
                         </div>
                      </div>
                   );
                })}
             </div>
          </div>

          {/* Right: Detail View */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             {selectedCapitation ? (
                <>
                   {/* Detail Header */}
                   <div className="p-6 border-b border-gray-100 bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <h4 className="text-lg font-black text-gray-800 uppercase tracking-tight">{selectedCapitation.title}</h4>
                            <div className="flex items-center space-x-3 text-[10px] font-bold text-gray-500 mt-1">
                               <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-700">{selectedCapitation.refNo}</span>
                               <span>•</span>
                               <span className="text-blue-600 uppercase">{selectedCapitation.scheme}</span>
                               <span>•</span>
                               <span>{selectedCapitation.periodStart} to {selectedCapitation.periodEnd}</span>
                            </div>
                         </div>
                         <div className="text-right">
                             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Allocation</p>
                             <p className="text-2xl font-black text-gray-800">KES {selectedCapitation.amountReceived.toLocaleString()}</p>
                         </div>
                      </div>

                      {/* Main Progress Bar */}
                      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                         <div className="flex justify-between text-xs font-bold mb-2">
                             <span className="text-blue-600">Consumed: KES {selectedCapitation.amountConsumed.toLocaleString()}</span>
                             <span className="text-green-600">Remaining: KES {(selectedCapitation.amountReceived - selectedCapitation.amountConsumed).toLocaleString()}</span>
                         </div>
                         <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden flex">
                             <div 
                                className="bg-blue-500 h-full" 
                                style={{ width: `${(selectedCapitation.amountConsumed / selectedCapitation.amountReceived) * 100}%` }}
                             ></div>
                         </div>
                      </div>
                   </div>

                   {/* Tabs */}
                   <div className="flex border-b border-gray-100 px-6">
                      <button 
                         onClick={() => setActiveTab('overview')}
                         className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                      >
                         Overview
                      </button>
                      <button 
                         onClick={() => setActiveTab('consumption')}
                         className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'consumption' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                      >
                         Consumption Log
                      </button>
                   </div>

                   {/* Content */}
                   <div className="flex-1 overflow-y-auto p-6">
                      {activeTab === 'overview' && (
                         <div className="grid grid-cols-2 gap-8 text-xs">
                             <div className="space-y-4">
                                <div>
                                   <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Payment Mode</label>
                                   <p className="font-bold text-gray-800 bg-gray-50 p-2 rounded border border-gray-100">{selectedCapitation.paymentMode}</p>
                                </div>
                                <div>
                                   <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Payment Reference</label>
                                   <p className="font-bold text-gray-800 bg-gray-50 p-2 rounded border border-gray-100">{selectedCapitation.paymentRef}</p>
                                </div>
                             </div>
                             <div className="space-y-4">
                                <div>
                                   <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Received Date</label>
                                   <p className="font-bold text-gray-800 bg-gray-50 p-2 rounded border border-gray-100">{selectedCapitation.dateReceived}</p>
                                </div>
                                <div>
                                   <label className="block text-[9px] font-black text-gray-400 uppercase mb-1">Status</label>
                                   <span className={`inline-block px-3 py-1 rounded text-[10px] font-black uppercase border ${getStatusBadge(selectedCapitation.status)}`}>{selectedCapitation.status}</span>
                                </div>
                             </div>
                         </div>
                      )}

                      {activeTab === 'consumption' && (
                         <div className="overflow-hidden border border-gray-200 rounded-lg">
                            <table className="w-full text-left text-[11px]">
                               <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-tighter">
                                  <tr>
                                     <th className="px-4 py-2">Date</th>
                                     <th className="px-4 py-2">Patient</th>
                                     <th className="px-4 py-2">Service Point</th>
                                     <th className="px-4 py-2 text-right">Amount</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-gray-100 text-gray-600">
                                  {selectedCapitation.consumptionLog.length > 0 ? (
                                      selectedCapitation.consumptionLog.map(log => (
                                         <tr key={log.id} className="hover:bg-blue-50">
                                            <td className="px-4 py-2">{log.date}</td>
                                            <td className="px-4 py-2 font-bold text-gray-800">{log.patient}</td>
                                            <td className="px-4 py-2">{log.service}</td>
                                            <td className="px-4 py-2 text-right font-mono text-red-500">-{log.amount.toLocaleString()}</td>
                                         </tr>
                                      ))
                                  ) : (
                                      <tr><td colSpan={4} className="px-4 py-8 text-center italic text-gray-400">No consumption records found for this period.</td></tr>
                                  )}
                               </tbody>
                            </table>
                         </div>
                      )}
                   </div>
                </>
             ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-300">
                   <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <i className="fa fa-hand-holding-usd text-4xl opacity-20"></i>
                   </div>
                   <p className="text-sm font-bold uppercase tracking-widest">No Allocation Selected</p>
                </div>
             )}
          </div>
       </div>

       {/* Create Modal */}
       {showCreateModal && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                   <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest">Receive Capitation Funds</h5>
                   <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa fa-times text-lg"></i></button>
                </div>
                <div className="p-6">
                   <form onSubmit={handleCreate} className="space-y-4">
                      <div>
                         <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Title / Description</label>
                         <input 
                            type="text" required
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g. Q1 2024 NHIF Allocation"
                            value={newCapForm.title}
                            onChange={e => setNewCapForm({...newCapForm, title: e.target.value})}
                         />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Scheme</label>
                            <select 
                               className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs outline-none"
                               value={newCapForm.scheme}
                               onChange={e => setNewCapForm({...newCapForm, scheme: e.target.value})}
                               required
                            >
                               <option value="">Select Scheme...</option>
                               <option value="NHIF">NHIF / SHA</option>
                               <option value="Linda Mama">Linda Mama</option>
                               <option value="Edu-Afya">Edu-Afya</option>
                               <option value="Private">Private Corporate</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Amount Received</label>
                            <input 
                               type="number" required
                               className="w-full p-2.5 bg-blue-50 border border-blue-100 text-blue-700 rounded text-xs font-black outline-none focus:ring-1 focus:ring-blue-500"
                               placeholder="0.00"
                               value={newCapForm.amountReceived}
                               onChange={e => setNewCapForm({...newCapForm, amountReceived: Number(e.target.value)})}
                            />
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Period Start</label>
                            <input 
                               type="date" required
                               className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs outline-none"
                               value={newCapForm.periodStart}
                               onChange={e => setNewCapForm({...newCapForm, periodStart: e.target.value})}
                            />
                         </div>
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Period End</label>
                            <input 
                               type="date" required
                               className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs outline-none"
                               value={newCapForm.periodEnd}
                               onChange={e => setNewCapForm({...newCapForm, periodEnd: e.target.value})}
                            />
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Payment Mode</label>
                            <select 
                               className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs outline-none"
                               value={newCapForm.paymentMode}
                               onChange={e => setNewCapForm({...newCapForm, paymentMode: e.target.value})}
                            >
                               <option>Bank Transfer</option>
                               <option>Cheque</option>
                               <option>Mobile Money</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Payment Ref</label>
                            <input 
                               type="text"
                               className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs outline-none"
                               placeholder="e.g. TRX-998822"
                               value={newCapForm.paymentRef}
                               onChange={e => setNewCapForm({...newCapForm, paymentRef: e.target.value})}
                            />
                         </div>
                      </div>
                      <div className="pt-4 flex justify-end gap-2 border-t border-gray-50 mt-2">
                         <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border border-gray-300 rounded text-xs font-bold uppercase text-gray-600 hover:bg-gray-50">Cancel</button>
                         <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded text-xs font-black uppercase shadow hover:bg-blue-700">Confirm Receipt</button>
                      </div>
                   </form>
                </div>
             </div>
          </div>
       )}

    </div>
  );
};

export default Capitations;
