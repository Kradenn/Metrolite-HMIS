
import React from 'react';

const SupplierBills: React.FC = () => {
  return (
    <div className="animate-bottom space-y-6">
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Payable</p>
             <h3 className="text-2xl font-black text-gray-800 mt-1">KES 1,250,000</h3>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Overdue Bills</p>
             <h3 className="text-2xl font-black text-red-500 mt-1">KES 450,000</h3>
          </div>
          <button className="bg-blue-600 text-white rounded-xl p-5 shadow-lg flex flex-col justify-center items-start hover:bg-blue-700 transition">
             <div className="flex items-center space-x-2">
                <i className="fa fa-plus-circle text-xl"></i>
                <span className="font-black text-xs uppercase tracking-widest">Record Bill</span>
             </div>
             <p className="text-[9px] text-blue-200 mt-1">Manual Entry or Consultant</p>
          </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h5 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">Accounts Payable</h5>
          <div className="flex space-x-2">
             <input type="text" placeholder="Search supplier..." className="bg-white border border-gray-300 rounded px-3 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500" />
             <select className="bg-white border border-gray-300 rounded px-2 py-1 text-xs outline-none">
                <option>All Status</option>
                <option>Pending</option>
                <option>Overdue</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left text-[11px]">
              <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 font-black uppercase tracking-tight">
                 <tr>
                    <th className="px-6 py-3">Bill No</th>
                    <th className="px-6 py-3">Supplier</th>
                    <th className="px-6 py-3">Due Date</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                    <th className="px-6 py-3 text-right">Paid</th>
                    <th className="px-6 py-3 text-right">Balance</th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                 {[
                    { id: 'BILL-001', supplier: 'MedSurg Supplies', due: '2023-11-01', amount: 45000, paid: 0, status: 'Pending' },
                    { id: 'BILL-002', supplier: 'Kenya Power', due: '2023-10-15', amount: 15000, paid: 5000, status: 'Overdue' }
                 ].map((bill, i) => (
                    <tr key={i} className="hover:bg-blue-50 transition-colors cursor-pointer">
                       <td className="px-6 py-3 font-bold text-blue-600">{bill.id}</td>
                       <td className="px-6 py-3 uppercase font-medium">{bill.supplier}</td>
                       <td className="px-6 py-3">{bill.due}</td>
                       <td className="px-6 py-3 text-right">{bill.amount.toLocaleString()}</td>
                       <td className="px-6 py-3 text-right text-green-600">{bill.paid.toLocaleString()}</td>
                       <td className="px-6 py-3 text-right font-black text-gray-800">{(bill.amount - bill.paid).toLocaleString()}</td>
                       <td className="px-6 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${bill.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                             {bill.status}
                          </span>
                       </td>
                       <td className="px-6 py-3 text-right">
                          <button className="text-blue-600 hover:underline font-bold text-[10px] uppercase">Pay</button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default SupplierBills;
