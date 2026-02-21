
import React from 'react';

const PaymentVouchers: React.FC = () => {
  return (
    <div className="animate-bottom space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
         <div>
            <h2 className="text-xl font-bold text-gray-800">Payment Vouchers</h2>
            <p className="text-xs text-gray-500 font-medium">Authorize and track outgoing payments.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
         {/* List */}
         <div className="lg:col-span-5 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50">
                <input type="text" placeholder="Search voucher ID..." className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" />
             </div>
             <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
                {[
                   { id: 'PV-2023-101', payee: 'MedSurg Supplies', amount: 45000, status: 'Pending Approval', date: '24 Oct' },
                   { id: 'PV-2023-100', payee: 'Cleaning Services Co', amount: 12000, status: 'Approved', date: '23 Oct' },
                ].map((pv, i) => (
                   <div key={i} className="p-4 rounded-xl bg-white border border-gray-200 hover:border-blue-300 shadow-sm cursor-pointer transition-all">
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-xs font-black text-gray-800">{pv.id}</span>
                         <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${pv.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{pv.status}</span>
                      </div>
                      <h6 className="text-sm font-bold text-gray-700 uppercase mb-1">{pv.payee}</h6>
                      <div className="flex justify-between items-end">
                         <span className="text-[10px] text-gray-400">{pv.date}</span>
                         <span className="font-black text-gray-800">KES {pv.amount.toLocaleString()}</span>
                      </div>
                   </div>
                ))}
             </div>
         </div>

         {/* Details Placeholder */}
         <div className="lg:col-span-7 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col items-center justify-center text-gray-300">
             <i className="fa fa-file-invoice-dollar text-6xl mb-4 opacity-20"></i>
             <p className="text-sm font-bold uppercase tracking-widest">Select a voucher to view details</p>
         </div>
      </div>
    </div>
  );
};

export default PaymentVouchers;
