
import React, { useState } from 'react';

interface RequisitionItem {
  id: number;
  name: string;
  qty: number;
  unit: string;
  reason: string;
}

interface Requisition {
  id: string;
  date: string;
  department: string;
  requestedBy: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Ordered';
  items: RequisitionItem[];
}

const RequisitionNote: React.FC = () => {
  const [requisitions, setRequisitions] = useState<Requisition[]>([
    { 
      id: 'PRN-2023-001', date: '2023-10-24', department: 'Pharmacy', requestedBy: 'Dr. Wilson', status: 'Pending',
      items: [
         { id: 1, name: 'Paracetamol 500mg', qty: 5000, unit: 'Tabs', reason: 'Low Stock' },
         { id: 2, name: 'Surgical Gloves', qty: 200, unit: 'Pairs', reason: 'Restock' }
      ]
    },
    { 
      id: 'PRN-2023-002', date: '2023-10-23', department: 'Laboratory', requestedBy: 'Lab Tech Jane', status: 'Approved',
      items: [
         { id: 3, name: 'Malaria Test Kits', qty: 100, unit: 'Pcs', reason: 'Critical' }
      ]
    }
  ]);
  
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
  const [showCreateMode, setShowCreateMode] = useState(false);

  const selectedRequisition = requisitions.find(r => r.id === selectedReqId);

  const getStatusColor = (status: string) => {
     switch(status) {
        case 'Approved': return 'bg-green-100 text-green-700 border-green-200';
        case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
        case 'Ordered': return 'bg-blue-100 text-blue-700 border-blue-200';
        default: return 'bg-gray-100 text-gray-700';
     }
  };

  return (
    <div className="animate-bottom space-y-6">
       
       <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div>
             <h2 className="text-xl font-bold text-gray-800">Purchase Requisitions</h2>
             <p className="text-xs text-gray-500 font-medium">Internal requests for goods and services.</p>
          </div>
          <button onClick={() => { setShowCreateMode(true); setSelectedReqId(null); }} className="bg-teal-600 text-white px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow hover:bg-teal-700 transition">
             <i className="fa fa-plus-circle mr-2"></i> New Request
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)]">
          
          {/* Left: List */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50">
                <input type="text" placeholder="Search requisitions..." className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-teal-500" />
             </div>
             <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
                {requisitions.map(req => (
                   <div 
                      key={req.id} 
                      onClick={() => { setSelectedReqId(req.id); setShowCreateMode(false); }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md group ${selectedReqId === req.id ? 'bg-white border-teal-500 ring-1 ring-teal-100 shadow-md' : 'bg-white border-gray-200'}`}
                   >
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-black text-gray-800">{req.id}</span>
                         <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getStatusColor(req.status)}`}>{req.status}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium">
                         <span>{req.department}</span>
                         <span>{req.date}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">By: {req.requestedBy}</p>
                   </div>
                ))}
             </div>
          </div>

          {/* Right: Details / Create */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             {showCreateMode ? (
                <div className="p-8">
                   <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-4 mb-6">Create New Requisition</h5>
                   <form className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Department</label>
                            <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none">
                               <option>Pharmacy</option>
                               <option>Laboratory</option>
                               <option>Administration</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Required By Date</label>
                            <input type="date" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none" />
                         </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                         <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Add Items</h6>
                         <div className="grid grid-cols-12 gap-3 mb-3">
                            <div className="col-span-6"><input type="text" placeholder="Item Name" className="w-full p-2 border rounded text-xs" /></div>
                            <div className="col-span-2"><input type="number" placeholder="Qty" className="w-full p-2 border rounded text-xs" /></div>
                            <div className="col-span-3"><input type="text" placeholder="Reason" className="w-full p-2 border rounded text-xs" /></div>
                            <div className="col-span-1"><button type="button" className="w-full p-2 bg-teal-600 text-white rounded text-xs"><i className="fa fa-plus"></i></button></div>
                         </div>
                         {/* Mock List */}
                         <div className="text-center text-gray-400 text-xs py-4 italic">No items added yet.</div>
                      </div>

                      <div className="flex justify-end pt-4">
                         <button className="bg-teal-600 text-white px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:bg-teal-700">Submit Request</button>
                      </div>
                   </form>
                </div>
             ) : selectedRequisition ? (
                <div className="flex flex-col h-full">
                   <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                      <div>
                         <h4 className="text-xl font-black text-gray-800 tracking-tight">{selectedRequisition.id}</h4>
                         <p className="text-xs text-gray-500 font-bold mt-1 uppercase tracking-widest">
                            {selectedRequisition.department} • {selectedRequisition.date}
                         </p>
                      </div>
                      <div className="text-right">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(selectedRequisition.status)}`}>{selectedRequisition.status}</span>
                         <p className="text-[10px] text-gray-400 mt-2">Req By: {selectedRequisition.requestedBy}</p>
                      </div>
                   </div>
                   
                   <div className="flex-1 p-6 overflow-y-auto">
                      <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Requested Items</h6>
                      <table className="w-full text-left text-[11px] border border-gray-100 rounded-lg overflow-hidden">
                         <thead className="bg-gray-50 text-gray-500 font-black uppercase tracking-tight">
                            <tr>
                               <th className="px-4 py-3">Item Description</th>
                               <th className="px-4 py-3 text-right">Quantity</th>
                               <th className="px-4 py-3">Justification</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-50 text-gray-700">
                            {selectedRequisition.items.map(item => (
                               <tr key={item.id}>
                                  <td className="px-4 py-3 font-bold">{item.name}</td>
                                  <td className="px-4 py-3 text-right">{item.qty} {item.unit}</td>
                                  <td className="px-4 py-3 text-gray-500 italic">{item.reason}</td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>

                   <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                      <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg text-xs font-black uppercase hover:bg-gray-100">Print</button>
                      {selectedRequisition.status === 'Pending' && (
                         <>
                            <button className="bg-red-50 text-red-600 border border-red-200 px-6 py-2 rounded-lg text-xs font-black uppercase hover:bg-red-100">Reject</button>
                            <button className="bg-green-600 text-white px-6 py-2 rounded-lg text-xs font-black uppercase shadow hover:bg-green-700">Approve</button>
                         </>
                      )}
                      {selectedRequisition.status === 'Approved' && (
                          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-xs font-black uppercase shadow hover:bg-blue-700">Generate LPO</button>
                      )}
                   </div>
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-300">
                   <i className="fa fa-file-invoice text-6xl mb-4 opacity-20"></i>
                   <p className="text-sm font-bold uppercase tracking-widest">Select a requisition to view details</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default RequisitionNote;
