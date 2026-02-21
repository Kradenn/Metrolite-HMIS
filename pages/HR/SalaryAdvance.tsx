
import React from 'react';

const SalaryAdvance: React.FC = () => {
  return (
    <div className="animate-bottom space-y-6">
       
       {/* Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
             <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Outstanding</h6>
             <h3 className="text-2xl font-black text-red-500 mt-1">KES 450,000</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
             <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Requests</h6>
             <h3 className="text-2xl font-black text-orange-500 mt-1">5</h3>
          </div>
          <div className="bg-blue-600 p-5 rounded-xl shadow-lg text-white flex flex-col justify-center items-start cursor-pointer hover:bg-blue-700 transition">
             <h3 className="text-lg font-black uppercase tracking-tight">New Request</h3>
             <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Initiate Advance</p>
          </div>
       </div>

       <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
             <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest">Advance Requests & Active Loans</h5>
             <input type="text" placeholder="Search employee..." className="border border-gray-300 rounded px-3 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500" />
          </div>
          
          <div className="overflow-x-auto">
             <table className="w-full text-left text-[11px]">
                <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 font-black uppercase tracking-tight">
                   <tr>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Reason</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      <th className="px-6 py-4">Repayment Progress</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                   {[
                      { emp: 'Jane Doe', date: '20 Oct 2023', reason: 'Medical Emergency', amount: 15000, paid: 5000, status: 'Active' },
                      { emp: 'John Smith', date: '22 Oct 2023', reason: 'School Fees', amount: 30000, paid: 0, status: 'Pending' },
                   ].map((item, i) => (
                      <tr key={i} className="hover:bg-blue-50 transition-colors">
                         <td className="px-6 py-4 font-bold text-gray-800">{item.emp}</td>
                         <td className="px-6 py-4">{item.date}</td>
                         <td className="px-6 py-4 italic text-gray-500">{item.reason}</td>
                         <td className="px-6 py-4 text-right font-black">KES {item.amount.toLocaleString()}</td>
                         <td className="px-6 py-4 w-48">
                            <div className="flex justify-between text-[9px] mb-1 font-bold text-gray-500">
                               <span>{Math.round((item.paid/item.amount)*100)}% Paid</span>
                               <span>Bal: {(item.amount - item.paid).toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                               <div className="bg-green-500 h-1.5 rounded-full" style={{width: `${(item.paid/item.amount)*100}%`}}></div>
                            </div>
                         </td>
                         <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                               item.status === 'Active' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-orange-100 text-orange-700 border-orange-200'
                            }`}>{item.status}</span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button className="text-gray-400 hover:text-blue-600"><i className="fa fa-ellipsis-v"></i></button>
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

export default SalaryAdvance;
