
import React, { useState } from 'react';

const Payslips: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="animate-bottom space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Payroll Cost</h6>
            <h3 className="text-2xl font-black text-gray-800 mt-1">KES 1.2M</h3>
            <p className="text-[10px] text-green-600 font-bold mt-1">+2% from last month</p>
         </div>
         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Processing</h6>
            <h3 className="text-2xl font-black text-orange-500 mt-1">245 Staff</h3>
         </div>
         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-start">
            <button className="bg-blue-600 text-white w-full py-3 rounded-lg text-xs font-black uppercase tracking-widest shadow hover:bg-blue-700 transition">
               <i className="fa fa-play mr-2"></i> Run Payroll (Oct)
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
         {/* Left: Process Flow */}
         <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
               <h5 className="text-xs font-black text-gray-700 uppercase tracking-widest">Processing Steps</h5>
            </div>
            <div className="p-4 space-y-4">
               {[
                  { step: 1, label: 'Select Period', desc: 'Oct 2023' },
                  { step: 2, label: 'Manage Variations', desc: 'Bonuses & Deductions' },
                  { step: 3, label: 'Process & Validate', desc: 'Compute Calculations' },
                  { step: 4, label: 'Approval & Payslips', desc: 'Finalize & Send' },
               ].map((s) => (
                  <div 
                     key={s.step} 
                     onClick={() => setActiveStep(s.step)}
                     className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        activeStep === s.step ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-white border-gray-200 opacity-70'
                     }`}
                  >
                     <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                           activeStep === s.step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>{s.step}</div>
                        <div>
                           <h6 className="text-xs font-bold text-gray-800 uppercase">{s.label}</h6>
                           <p className="text-[10px] text-gray-500">{s.desc}</p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Right: Workspace */}
         <div className="lg:col-span-9 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
               <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest">Employee Payslip List</h5>
               <input type="text" placeholder="Search employee..." className="border border-gray-300 rounded px-3 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            
            <div className="flex-1 overflow-y-auto">
               <table className="w-full text-left text-[11px]">
                  <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 font-black uppercase tracking-tight sticky top-0">
                     <tr>
                        <th className="px-6 py-3">Staff</th>
                        <th className="px-6 py-3 text-right">Basic Pay</th>
                        <th className="px-6 py-3 text-right">Allowances</th>
                        <th className="px-6 py-3 text-right">Deductions</th>
                        <th className="px-6 py-3 text-right">Net Pay</th>
                        <th className="px-6 py-3 text-center">Status</th>
                        <th className="px-6 py-3 text-right">Action</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                     {[1, 2, 3, 4, 5].map(i => (
                        <tr key={i} className="hover:bg-blue-50 transition-colors">
                           <td className="px-6 py-3">
                              <div className="font-bold text-gray-800">John Doe</div>
                              <div className="text-[9px] text-gray-500">EMP-00{i}</div>
                           </td>
                           <td className="px-6 py-3 text-right">50,000.00</td>
                           <td className="px-6 py-3 text-right text-green-600">5,000.00</td>
                           <td className="px-6 py-3 text-right text-red-500">(2,500.00)</td>
                           <td className="px-6 py-3 text-right font-black">52,500.00</td>
                           <td className="px-6 py-3 text-center">
                              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[9px] font-black uppercase">Draft</span>
                           </td>
                           <td className="px-6 py-3 text-right">
                              <button className="text-blue-600 hover:underline text-[10px] font-bold uppercase">View</button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
               <button className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded text-xs font-bold uppercase hover:bg-gray-100">Export Report</button>
               <button className="bg-blue-600 text-white px-6 py-2 rounded text-xs font-black uppercase shadow hover:bg-blue-700">Approve Batch</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Payslips;
