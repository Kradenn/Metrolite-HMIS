
import React, { useState } from 'react';

// Interfaces
interface LeaveRequest {
  id: number;
  employeeName: string;
  department: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const Leaves: React.FC = () => {
  const [activeView, setActiveView] = useState<'list' | 'calendar'>('list');

  const [requests, setRequests] = useState<LeaveRequest[]>([
    { id: 1, employeeName: 'Jane Smith', department: 'Nursing', type: 'Annual Leave', startDate: '2023-11-01', endDate: '2023-11-05', days: 5, reason: 'Family vacation', status: 'Pending' },
    { id: 2, employeeName: 'Peter Kamau', department: 'Admin', type: 'Sick Leave', startDate: '2023-10-24', endDate: '2023-10-26', days: 3, reason: 'Flu', status: 'Approved' },
  ]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Mock Calendar Days
  const days = Array.from({length: 30}, (_, i) => i + 1);

  return (
    <div className="animate-bottom space-y-6">
      {/* Header & Controls */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
         <div>
            <h2 className="text-xl font-bold text-gray-800">Leave Management</h2>
            <p className="text-xs text-gray-500 font-medium">Track and approve staff time off.</p>
         </div>
         <div className="flex space-x-2">
            <button 
               onClick={() => setActiveView('list')}
               className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'list' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
               <i className="fa fa-list mr-2"></i> List
            </button>
            <button 
               onClick={() => setActiveView('calendar')}
               className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'calendar' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
               <i className="fa fa-calendar-alt mr-2"></i> Timeline
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 shadow-sm ml-2">
               <i className="fa fa-plus mr-2"></i> New Request
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {/* Stats */}
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Requests</p>
            <h3 className="text-2xl font-black text-orange-500 mt-1">{requests.filter(r => r.status === 'Pending').length}</h3>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">On Leave Today</p>
            <h3 className="text-2xl font-black text-blue-600 mt-1">2</h3>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Returning This Week</p>
            <h3 className="text-2xl font-black text-green-600 mt-1">1</h3>
         </div>
         <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upcoming (Next 7 Days)</p>
            <h3 className="text-2xl font-black text-gray-800 mt-1">4</h3>
         </div>
      </div>

      {activeView === 'list' && (
         <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
               <table className="w-full text-left text-[11px]">
                  <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 font-black uppercase tracking-tight">
                     <tr>
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Dates</th>
                        <th className="px-6 py-4 text-center">Duration</th>
                        <th className="px-6 py-4">Reason</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                     {requests.map(req => (
                        <tr key={req.id} className="hover:bg-blue-50 transition-colors">
                           <td className="px-6 py-4">
                              <div className="font-bold text-gray-800 uppercase">{req.employeeName}</div>
                              <div className="text-[9px] text-gray-500">{req.department}</div>
                           </td>
                           <td className="px-6 py-4">{req.type}</td>
                           <td className="px-6 py-4">
                              <div className="font-bold">{req.startDate}</div>
                              <div className="text-[9px] text-gray-400">to {req.endDate}</div>
                           </td>
                           <td className="px-6 py-4 text-center font-bold">{req.days} Days</td>
                           <td className="px-6 py-4 truncate max-w-[200px] italic">{req.reason}</td>
                           <td className="px-6 py-4 text-center">
                              <span className={`px-2 py-1 rounded text-[9px] font-black uppercase border ${getStatusColor(req.status)}`}>{req.status}</span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              {req.status === 'Pending' && (
                                 <div className="flex justify-end space-x-2">
                                    <button className="text-green-600 hover:text-green-800 bg-green-50 p-1.5 rounded"><i className="fa fa-check"></i></button>
                                    <button className="text-red-600 hover:text-red-800 bg-red-50 p-1.5 rounded"><i className="fa fa-times"></i></button>
                                 </div>
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      )}

      {activeView === 'calendar' && (
         <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-6">
            <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">October 2023 Timeline</h5>
            <div className="overflow-x-auto">
               <div className="min-w-[800px]">
                  <div className="grid grid-cols-[150px_1fr] gap-4 mb-2">
                     <div className="text-right pr-4 font-bold text-xs text-gray-400 uppercase">Employee</div>
                     <div className="grid grid-cols-30 gap-1 text-[9px] text-center font-bold text-gray-400">
                        {days.map(d => <div key={d}>{d}</div>)}
                     </div>
                  </div>
                  {/* Mock Rows */}
                  {['Jane Smith', 'Peter Kamau', 'John Doe'].map((emp, i) => (
                     <div key={i} className="grid grid-cols-[150px_1fr] gap-4 mb-2 items-center hover:bg-gray-50 py-1">
                        <div className="text-right pr-4 font-bold text-xs text-gray-700">{emp}</div>
                        <div className="grid grid-cols-30 gap-1 h-6 bg-gray-100 rounded overflow-hidden relative">
                           {/* Simulated bars */}
                           {i === 0 && <div className="absolute left-[10%] w-[15%] h-full bg-blue-500 rounded text-[9px] text-white flex items-center justify-center font-bold">Annual</div>}
                           {i === 1 && <div className="absolute left-[40%] w-[10%] h-full bg-orange-500 rounded text-[9px] text-white flex items-center justify-center font-bold">Sick</div>}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default Leaves;
