
import React, { useState } from 'react';

interface PO {
  id: string;
  supplier: string;
  date: string;
  total: number;
  status: 'Draft' | 'Sent' | 'Partial' | 'Fulfilled' | 'Cancelled';
  items: { desc: string, qty: number, price: number, total: number }[];
}

const PurchaseOrder: React.FC = () => {
  const [pos, setPos] = useState<PO[]>([
     { 
       id: 'LPO-2023-001', supplier: 'MedSurg Supplies Ltd', date: '2023-10-20', total: 45000, status: 'Sent',
       items: [{ desc: 'Surgical Gloves (Box)', qty: 50, price: 900, total: 45000 }]
     },
     { 
       id: 'LPO-2023-002', supplier: 'Harleys Limited', date: '2023-10-22', total: 120500, status: 'Draft',
       items: [{ desc: 'Amoxicillin 500mg (Tin)', qty: 100, price: 1205, total: 120500 }]
     }
  ]);
  const [selectedPOId, setSelectedPOId] = useState<string | null>(null);

  const selectedPO = pos.find(p => p.id === selectedPOId);

  const getStatusColor = (status: string) => {
     switch(status) {
        case 'Draft': return 'bg-gray-200 text-gray-700';
        case 'Sent': return 'bg-blue-100 text-blue-700';
        case 'Fulfilled': return 'bg-green-100 text-green-700';
        default: return 'bg-orange-100 text-orange-700';
     }
  };

  return (
    <div className="animate-bottom space-y-6">
       <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div>
             <h2 className="text-xl font-bold text-gray-800">Local Purchase Orders (LPO)</h2>
             <p className="text-xs text-gray-500 font-medium">Manage procurement orders to suppliers.</p>
          </div>
          <button className="bg-teal-600 text-white px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow hover:bg-teal-700 transition">
             <i className="fa fa-file-contract mr-2"></i> Create LPO
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)]">
          {/* List */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             <div className="p-3 border-b border-gray-100 bg-gray-50">
                <input type="text" placeholder="Search orders..." className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-teal-500" />
             </div>
             <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
                {pos.map(po => (
                   <div 
                      key={po.id} 
                      onClick={() => setSelectedPOId(po.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md group ${selectedPOId === po.id ? 'bg-white border-teal-500 ring-1 ring-teal-100 shadow-md' : 'bg-white border-gray-200'}`}
                   >
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-black text-teal-700">{po.id}</span>
                         <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${getStatusColor(po.status)}`}>{po.status}</span>
                      </div>
                      <h6 className="text-xs font-bold text-gray-800 uppercase mb-1 truncate">{po.supplier}</h6>
                      <div className="flex justify-between items-end text-[10px] text-gray-500">
                         <span>{po.date}</span>
                         <span className="font-black text-gray-700">KES {po.total.toLocaleString()}</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Document Preview */}
          <div className="lg:col-span-8 bg-gray-100 rounded-xl shadow-inner p-6 overflow-y-auto flex justify-center">
             {selectedPO ? (
                <div className="bg-white w-full max-w-2xl min-h-[600px] shadow-lg rounded-sm p-8 flex flex-col relative">
                   {/* Watermark/Status */}
                   <div className="absolute top-4 right-4 text-xs font-bold text-gray-400 border border-gray-200 px-2 py-1 rounded uppercase tracking-widest">{selectedPO.status}</div>
                   
                   {/* Header */}
                   <div className="border-b-2 border-gray-800 pb-4 mb-6">
                      <div className="flex justify-between items-end">
                         <div>
                            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Purchase Order</h1>
                            <p className="text-xs text-gray-500 font-bold">UltraHub Hospital</p>
                         </div>
                         <div className="text-right">
                            <p className="text-lg font-mono font-bold text-gray-700">{selectedPO.id}</p>
                            <p className="text-xs text-gray-500">{selectedPO.date}</p>
                         </div>
                      </div>
                   </div>

                   {/* Vendor Info */}
                   <div className="mb-8 grid grid-cols-2 gap-8 text-xs">
                      <div>
                         <p className="font-bold text-gray-400 uppercase text-[9px] tracking-widest mb-1">Vendor</p>
                         <p className="font-bold text-gray-800 text-sm uppercase">{selectedPO.supplier}</p>
                         <p className="text-gray-500">P.O. Box 1234, Nairobi</p>
                         <p className="text-gray-500">Kenya</p>
                      </div>
                      <div className="text-right">
                         <p className="font-bold text-gray-400 uppercase text-[9px] tracking-widest mb-1">Ship To</p>
                         <p className="font-bold text-gray-800">Main Stores</p>
                         <p className="text-gray-500">UltraHub Hospital</p>
                      </div>
                   </div>

                   {/* Items Table */}
                   <table className="w-full text-left text-xs mb-8">
                      <thead className="border-b border-gray-300 font-black uppercase text-gray-600">
                         <tr>
                            <th className="py-2">Description</th>
                            <th className="py-2 text-right">Qty</th>
                            <th className="py-2 text-right">Unit Price</th>
                            <th className="py-2 text-right">Total</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                         {selectedPO.items.map((item, i) => (
                            <tr key={i}>
                               <td className="py-3 font-medium">{item.desc}</td>
                               <td className="py-3 text-right">{item.qty}</td>
                               <td className="py-3 text-right">{item.price.toLocaleString()}</td>
                               <td className="py-3 text-right font-bold">{item.total.toLocaleString()}</td>
                            </tr>
                         ))}
                      </tbody>
                   </table>

                   {/* Totals */}
                   <div className="flex justify-end mb-12">
                      <div className="w-48 space-y-2 border-t border-gray-300 pt-2">
                         <div className="flex justify-between text-sm font-black">
                            <span>Total</span>
                            <span>KES {selectedPO.total.toLocaleString()}</span>
                         </div>
                      </div>
                   </div>

                   {/* Footer Actions (Screen only) */}
                   <div className="mt-auto pt-6 border-t border-dashed border-gray-300 flex justify-between items-center">
                      <div className="text-[9px] text-gray-400 uppercase font-bold">Authorized Signature</div>
                      <div className="flex space-x-2">
                         <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-[10px] font-bold uppercase transition">Print</button>
                         {selectedPO.status === 'Draft' && (
                             <button className="bg-blue-600 text-white px-4 py-2 rounded text-[10px] font-bold uppercase shadow hover:bg-blue-700 transition">Approve & Send</button>
                         )}
                         {selectedPO.status === 'Sent' && (
                             <button className="bg-green-600 text-white px-4 py-2 rounded text-[10px] font-bold uppercase shadow hover:bg-green-700 transition">Receive Goods</button>
                         )}
                      </div>
                   </div>
                </div>
             ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                   <i className="fa fa-file-invoice text-5xl mb-4 opacity-20"></i>
                   <p className="text-sm font-bold uppercase tracking-widest">Select an LPO to view</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default PurchaseOrder;
