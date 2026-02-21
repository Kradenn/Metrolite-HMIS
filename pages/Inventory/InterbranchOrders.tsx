
import React, { useState } from 'react';
import * as Lucide from 'lucide-react';

interface Order {
   id: string;
   requestingBranch: string;
   issuingBranch: string;
   status: 'Draft' | 'Sent' | 'Dispatched' | 'Received' | 'Cancelled';
   date: string;
}

const InterbranchOrders: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const orders: Order[] = [
     { id: 'IB-ORD-001', requestingBranch: 'City Center', issuingBranch: 'Main Branch', status: 'Dispatched', date: '2023-10-24' },
  ];

  const getStatusColor = (status: string) => {
     switch(status) {
        case 'Draft': return 'bg-slate-100 text-slate-600 border-slate-200';
        case 'Sent': return 'bg-blue-50 text-blue-700 border-blue-100';
        case 'Dispatched': return 'bg-purple-50 text-purple-700 border-purple-100';
        case 'Received': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        default: return 'bg-red-50 text-red-700 border-red-100';
     }
  };

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  return (
    <div className="min-h-screen bg-[#F4F5F7] p-6 font-sans text-slate-900">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
             <h1 className="text-3xl font-light tracking-tight text-slate-900">Inter-Branch Transfers</h1>
             <p className="text-sm text-slate-500 mt-1 font-mono">Manage stock movement between hospital branches.</p>
          </div>
          <button 
            onClick={() => { setActiveTab('create'); setSelectedOrderId(null); }} 
            className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2"
          >
             <Lucide.PlusCircle className="w-4 h-4" />
             <span>New Transfer Request</span>
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
         
         {/* Left: Orders List */}
         <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <div className="relative">
                    <Lucide.Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                        type="text" 
                        placeholder="Search transfers..." 
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
                    />
                </div>
             </div>
             <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {orders.map(order => (
                   <div 
                      key={order.id} 
                      onClick={() => { setSelectedOrderId(order.id); setActiveTab('detail'); }}
                      className={`p-4 rounded-xl border cursor-pointer transition-all group ${
                        selectedOrderId === order.id 
                        ? 'bg-blue-50/50 border-blue-500 shadow-sm ring-1 ring-blue-100' 
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                      }`}
                   >
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-mono font-medium text-slate-500">{order.id}</span>
                         <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(order.status)}`}>{order.status}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900 mb-3">
                         <span>{order.requestingBranch}</span>
                         <Lucide.ArrowRight className="w-3 h-3 text-slate-400" />
                         <span>{order.issuingBranch}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-500">
                         <span className="flex items-center gap-1"><Lucide.Calendar className="w-3 h-3" /> {order.date}</span>
                      </div>
                   </div>
                ))}
             </div>
         </div>

         {/* Right: Detail / Create View */}
         <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            {activeTab === 'create' ? (
                <div className="p-8 flex-1 overflow-y-auto">
                   <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Lucide.Truck className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">New Transfer Request</h2>
                            <p className="text-sm text-slate-500">Initiate stock movement to another branch.</p>
                        </div>
                   </div>
                   
                   <form className="space-y-6 max-w-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Requesting Branch</label>
                            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                               <option>City Center Branch</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Issuing Branch</label>
                            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                               <option>Main Branch</option>
                            </select>
                         </div>
                      </div>
                      
                      <div>
                         <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Logistics / Transport Notes</label>
                         <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all h-32 resize-none" placeholder="Enter transport arrangements or special instructions..."></textarea>
                      </div>

                      <div className="pt-4 flex items-center gap-3">
                         <button type="button" onClick={() => setActiveTab('list')} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-all">Cancel</button>
                         <button type="button" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2">
                            <Lucide.Check className="w-4 h-4" /> Create Request
                         </button>
                      </div>
                   </form>
                </div>
            ) : selectedOrder ? (
                <div className="flex flex-col h-full">
                   <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                      <div className="flex items-start gap-4">
                         <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                            <Lucide.ArrowLeftRight className="w-6 h-6 text-slate-400" />
                         </div>
                         <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-semibold text-slate-900">{selectedOrder.id}</h2>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                <span className="font-medium text-slate-700">{selectedOrder.requestingBranch}</span>
                                <Lucide.ArrowRight className="w-3 h-3" />
                                <span className="font-medium text-slate-700">{selectedOrder.issuingBranch}</span>
                            </div>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-sm font-medium text-slate-900">{selectedOrder.date}</p>
                      </div>
                   </div>
                   
                   <div className="flex-1 p-6 overflow-y-auto">
                      {selectedOrder.status === 'Dispatched' && (
                        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6 flex items-center gap-3 text-sm text-purple-900">
                             <Lucide.Clock className="w-5 h-5 text-purple-600" />
                             <span className="font-medium">Items are currently in transit. Expected arrival: Today 4:00 PM.</span>
                        </div>
                      )}

                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                <th className="px-4 py-3 font-medium text-slate-500">Item Description</th>
                                <th className="px-4 py-3 font-medium text-slate-500 text-right">Requested</th>
                                <th className="px-4 py-3 font-medium text-slate-500 text-right">Dispatched</th>
                                <th className="px-4 py-3 font-medium text-slate-500 text-right">Received</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3 font-medium text-slate-900">Paracetamol 500mg</td>
                                <td className="px-4 py-3 text-right font-mono text-slate-600">500</td>
                                <td className="px-4 py-3 text-right font-mono text-slate-600">500</td>
                                <td className="px-4 py-3 text-right font-mono text-slate-400">0</td>
                                </tr>
                            </tbody>
                        </table>
                      </div>
                   </div>

                   <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                      {selectedOrder.status === 'Dispatched' && (
                          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow hover:bg-emerald-700 transition flex items-center gap-2">
                             <Lucide.PackageCheck className="w-4 h-4" /> Receive Items
                          </button>
                      )}
                      <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
                         <Lucide.Printer className="w-4 h-4" /> Print Waybill
                      </button>
                   </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300">
                   <div className="p-6 bg-slate-50 rounded-full mb-4">
                        <Lucide.ArrowLeftRight className="w-12 h-12 text-slate-400" />
                   </div>
                   <p className="text-sm font-medium uppercase tracking-widest text-slate-500">Select a transfer to view details</p>
                </div>
            )}
         </div>

      </div>
    </div>
  );
};

export default InterbranchOrders;
