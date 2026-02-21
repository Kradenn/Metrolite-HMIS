
import React from 'react';

const PayPeriods: React.FC = () => {
  return (
    <div className="animate-bottom space-y-6">
       <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div>
             <h2 className="text-xl font-bold text-gray-800">Payroll Periods</h2>
             <p className="text-xs text-gray-500 font-medium">Manage fiscal months for salary processing.</p>
          </div>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow hover:bg-blue-700 transition">
             <i className="fa fa-calendar-plus mr-2"></i> Open New Period
          </button>
       </div>

       <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
             {['October 2023', 'September 2023', 'August 2023'].map((period, i) => (
                <div key={i} className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors ${i === 0 ? 'bg-blue-50/20' : ''}`}>
                   <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black ${
                         i === 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                         {i === 0 ? <i className="fa fa-lock-open"></i> : <i className="fa fa-lock"></i>}
                      </div>
                      <div>
                         <h4 className="text-lg font-black text-gray-800 uppercase">{period}</h4>
                         <p className="text-xs text-gray-500 font-medium">01 {period.split(' ')[0]} - 30 {period}</p>
                      </div>
                   </div>
                   
                   <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                         i === 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                         {i === 0 ? 'Open' : 'Closed'}
                      </span>
                      {i === 0 && (
                         <button className="text-red-600 font-bold text-[10px] uppercase hover:underline border border-red-200 px-3 py-1 rounded bg-red-50">
                            Close Period
                         </button>
                      )}
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default PayPeriods;
