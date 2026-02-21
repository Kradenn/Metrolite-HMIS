
import React from 'react';

const PayrollParameters: React.FC = () => {
  return (
    <div className="animate-bottom space-y-6">
       <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Payroll Configuration</h2>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow hover:bg-blue-700 transition">
             <i className="fa fa-plus mr-2"></i> New Parameter
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earnings */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h5 className="text-xs font-black text-green-700 uppercase tracking-widest">Earnings / Allowances</h5>
             </div>
             <div className="divide-y divide-gray-50">
                {['Basic Salary', 'House Allowance', 'Commuter Allowance', 'Overtime', 'Bonus'].map((item, i) => (
                   <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div>
                         <h6 className="text-xs font-bold text-gray-800">{item}</h6>
                         <p className="text-[10px] text-gray-500">Taxable: Yes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" className="sr-only peer" defaultChecked />
                         <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                   </div>
                ))}
             </div>
          </div>

          {/* Deductions */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h5 className="text-xs font-black text-red-700 uppercase tracking-widest">Deductions</h5>
             </div>
             <div className="divide-y divide-gray-50">
                {['PAYE (Tax)', 'NSSF', 'NHIF', 'Housing Levy', 'Salary Advance', 'Absenteeism'].map((item, i) => (
                   <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div>
                         <h6 className="text-xs font-bold text-gray-800">{item}</h6>
                         <p className="text-[10px] text-gray-500">Statutory: {i < 4 ? 'Yes' : 'No'}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" className="sr-only peer" defaultChecked />
                         <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

export default PayrollParameters;
