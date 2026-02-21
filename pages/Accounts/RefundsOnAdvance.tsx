
import React, { useState } from 'react';

interface Refund {
  id: string;
  date: string;
  patientName: string;
  amount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Processed' | 'Rejected';
  mode: string;
  requestedBy: string;
}

const RefundsOnAdvance: React.FC = () => {
  const [refunds, setRefunds] = useState<Refund[]>([
    { id: 'REF-001', date: '2023-10-24', patientName: 'Jane Doe', amount: 5000, reason: 'Overpayment on admission', status: 'Pending', mode: 'M-Pesa', requestedBy: 'Cashier 1' },
    { id: 'REF-002', date: '2023-10-23', patientName: 'John Smith', amount: 1500, reason: 'Service unavailable', status: 'Approved', mode: 'Cash', requestedBy: 'Admin' },
    { id: 'REF-003', date: '2023-10-20', patientName: 'Baby Ryan', amount: 2000, reason: 'Duplicate billing', status: 'Processed', mode: 'Bank Transfer', requestedBy: 'Nurse Joy' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Approved': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Processed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const filteredRefunds = refunds.filter(r => filter === 'All' || r.status === filter);

  return (
    <div className="animate-bottom space-y-6">
       
       {/* Dashboard Stats */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
             <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Refunded (Today)</h6>
             <h3 className="text-2xl font-black text-gray-800 mt-1">KES 0.00</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
             <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Approval</h6>
             <h3 className="text-2xl font-black text-orange-500 mt-1">
                KES {refunds.filter(r => r.status === 'Pending').reduce((a,b) => a + b.amount, 0).toLocaleString()}
             </h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
             <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Processed Count</h6>
             <h3 className="text-2xl font-black text-green-600 mt-1">{refunds.filter(r => r.status === 'Processed').length}</h3>
          </div>
          <button 
             onClick={() => setShowModal(true)}
             className="bg-blue-600 text-white rounded-xl p-5 shadow-lg flex flex-col justify-center items-start hover:bg-blue-700 transition"
          >
             <div className="flex items-center space-x-3">
                <i className="fa fa-plus-circle text-2xl"></i>
                <div>
                   <h3 className="text-lg font-black uppercase tracking-tight">New Request</h3>
                   <p className="text-[10px] text-blue-200 font-bold uppercase tracking-widest">Initiate Refund</p>
                </div>
             </div>
          </button>
       </div>

       {/* List Section */}
       <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
             <h5 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Refund History</h5>
             <div className="flex space-x-2">
                {['All', 'Pending', 'Approved', 'Processed'].map(f => (
                   <button 
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full border transition-all ${
                         filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                      }`}
                   >
                      {f}
                   </button>
                ))}
             </div>
          </div>
          
          <div className="overflow-x-auto">
             <table className="w-full text-left text-[11px]">
                <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 font-black uppercase tracking-tight">
                   <tr>
                      <th className="px-6 py-3">Refund ID</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Patient / Payee</th>
                      <th className="px-6 py-3">Reason</th>
                      <th className="px-6 py-3">Method</th>
                      <th className="px-6 py-3 text-right">Amount</th>
                      <th className="px-6 py-3 text-center">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                   {filteredRefunds.map(r => (
                      <tr key={r.id} className="hover:bg-blue-50 transition-colors">
                         <td className="px-6 py-3 font-bold text-blue-600">{r.id}</td>
                         <td className="px-6 py-3">{r.date}</td>
                         <td className="px-6 py-3 font-bold uppercase text-gray-800">{r.patientName}</td>
                         <td className="px-6 py-3 truncate max-w-[200px]">{r.reason}</td>
                         <td className="px-6 py-3">{r.mode}</td>
                         <td className="px-6 py-3 text-right font-black">KES {r.amount.toLocaleString()}</td>
                         <td className="px-6 py-3 text-center">
                            <span className={`px-2 py-1 rounded text-[9px] font-black uppercase border ${getStatusColor(r.status)}`}>
                               {r.status}
                            </span>
                         </td>
                         <td className="px-6 py-3 text-right">
                            <button className="text-gray-400 hover:text-blue-600"><i className="fa fa-ellipsis-v"></i></button>
                         </td>
                      </tr>
                   ))}
                   {filteredRefunds.length === 0 && (
                      <tr><td colSpan={8} className="px-6 py-8 text-center italic text-gray-400">No records found.</td></tr>
                   )}
                </tbody>
             </table>
          </div>
       </div>

       {/* Create Modal */}
       {showModal && (
          <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                   <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest">Create Refund Request</h5>
                   <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa fa-times text-lg"></i></button>
                </div>
                <div className="p-6">
                   <form className="space-y-4">
                      <div>
                         <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Select Patient / Receipt</label>
                         <input type="text" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500" placeholder="Search receipt number..." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Amount</label>
                            <input type="number" className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500" placeholder="0.00" />
                         </div>
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Payment Mode</label>
                            <select className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs outline-none">
                               <option>Cash</option>
                               <option>M-Pesa</option>
                               <option>Bank Transfer</option>
                            </select>
                         </div>
                      </div>
                      <div>
                         <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Reason for Refund</label>
                         <textarea className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs outline-none h-24 resize-none" placeholder="Explain why the refund is being issued..."></textarea>
                      </div>
                      <div className="pt-4 flex justify-end gap-2 border-t border-gray-50 mt-2">
                         <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 rounded text-xs font-bold uppercase text-gray-600 hover:bg-gray-50">Cancel</button>
                         <button type="button" className="bg-blue-600 text-white px-6 py-2 rounded text-xs font-black uppercase shadow hover:bg-blue-700">Submit Request</button>
                      </div>
                   </form>
                </div>
             </div>
          </div>
       )}
    </div>
  );
};

export default RefundsOnAdvance;
