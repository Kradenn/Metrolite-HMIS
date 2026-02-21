
import React, { useState } from 'react';

interface FiscalPeriod {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'Open' | 'Closed' | 'Future';
  active: boolean;
}

const MOCK_PERIODS: FiscalPeriod[] = [
  { id: 'FY23-P01', name: 'January 2023', startDate: '2023-01-01', endDate: '2023-01-31', status: 'Closed', active: false },
  { id: 'FY23-P02', name: 'February 2023', startDate: '2023-02-01', endDate: '2023-02-28', status: 'Closed', active: false },
  { id: 'FY23-P03', name: 'March 2023', startDate: '2023-03-01', endDate: '2023-03-31', status: 'Closed', active: false },
  { id: 'FY23-P04', name: 'April 2023', startDate: '2023-04-01', endDate: '2023-04-30', status: 'Closed', active: false },
  { id: 'FY23-P05', name: 'May 2023', startDate: '2023-05-01', endDate: '2023-05-31', status: 'Closed', active: false },
  { id: 'FY23-P06', name: 'June 2023', startDate: '2023-06-01', endDate: '2023-06-30', status: 'Closed', active: false },
  { id: 'FY23-P07', name: 'July 2023', startDate: '2023-07-01', endDate: '2023-07-31', status: 'Closed', active: false },
  { id: 'FY23-P08', name: 'August 2023', startDate: '2023-08-01', endDate: '2023-08-31', status: 'Closed', active: false },
  { id: 'FY23-P09', name: 'September 2023', startDate: '2023-09-01', endDate: '2023-09-30', status: 'Closed', active: false },
  { id: 'FY23-P10', name: 'October 2023', startDate: '2023-10-01', endDate: '2023-10-31', status: 'Open', active: true },
  { id: 'FY23-P11', name: 'November 2023', startDate: '2023-11-01', endDate: '2023-11-30', status: 'Future', active: false },
  { id: 'FY23-P12', name: 'December 2023', startDate: '2023-12-01', endDate: '2023-12-31', status: 'Future', active: false },
];

const FiscalPeriods: React.FC = () => {
  const [periods, setPeriods] = useState<FiscalPeriod[]>(MOCK_PERIODS);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusColor = (status: string) => {
     switch(status) {
        case 'Open': return 'bg-green-100 text-green-700 border-green-200';
        case 'Closed': return 'bg-gray-100 text-gray-500 border-gray-200';
        case 'Future': return 'bg-blue-50 text-blue-600 border-blue-100';
        default: return 'bg-gray-50 text-gray-500';
     }
  };

  return (
    <div className="animate-bottom space-y-6">
       
       <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div>
             <h2 className="text-2xl font-bold text-gray-800">Fiscal Calendar 2023</h2>
             <p className="text-sm text-gray-500">Manage financial periods and closing dates.</p>
          </div>
          <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition">
             <i className="fa fa-calendar-plus mr-2"></i> New Fiscal Year
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Status Card */}
          <div className="lg:col-span-1 bg-green-50 border border-green-100 rounded-xl p-6 flex flex-col justify-between">
             <div>
                <h6 className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Active Period</h6>
                <h3 className="text-2xl font-black text-green-800">October 2023</h3>
                <p className="text-xs font-bold text-green-700 mt-2">Closes in 7 Days</p>
             </div>
             <div className="w-full bg-white rounded-full h-2 mt-6">
                 <div className="bg-green-500 h-2 rounded-full" style={{ width: '76%' }}></div>
             </div>
          </div>
          
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
             <h6 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Period Overview</h6>
             <div className="flex items-center space-x-1">
                {periods.map(p => (
                   <div key={p.id} className="flex-1 group relative">
                      <div className={`h-12 rounded-md mb-2 transition-all ${
                         p.status === 'Open' ? 'bg-green-500 shadow-md transform -translate-y-1' :
                         p.status === 'Closed' ? 'bg-gray-300' : 'bg-blue-50 border border-blue-100'
                      }`}></div>
                      <span className="text-[9px] font-bold text-gray-400 block text-center truncate">{p.name.split(' ')[0].substring(0,3)}</span>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-gray-800 text-white text-[10px] p-2 rounded hidden group-hover:block z-10 text-center">
                         <p className="font-bold">{p.name}</p>
                         <p>{p.status}</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>

       <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
             <h5 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">Detailed Period List</h5>
             <div className="flex space-x-2">
                 <button className="bg-white border border-gray-300 text-gray-600 px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-gray-100 transition shadow-sm">Close Current Period</button>
             </div>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left text-[11px]">
                <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-tight">
                   <tr>
                      <th className="px-6 py-4">Period Name</th>
                      <th className="px-6 py-4">Start Date</th>
                      <th className="px-6 py-4">End Date</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                   {periods.map(p => (
                      <tr key={p.id} className={`hover:bg-blue-50 transition-colors ${p.active ? 'bg-green-50/30' : ''}`}>
                         <td className="px-6 py-4 font-bold">
                            {p.name} 
                            {p.active && <span className="ml-2 text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-black uppercase">Active</span>}
                         </td>
                         <td className="px-6 py-4 font-mono text-gray-500">{p.startDate}</td>
                         <td className="px-6 py-4 font-mono text-gray-500">{p.endDate}</td>
                         <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-1 rounded text-[9px] font-black uppercase border ${getStatusColor(p.status)}`}>{p.status}</span>
                         </td>
                         <td className="px-6 py-4 text-right">
                            {p.status === 'Open' ? (
                                <button className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase">Close</button>
                            ) : p.status === 'Future' ? (
                                <button className="text-gray-400 hover:text-gray-600 text-xs font-bold uppercase">Edit</button>
                            ) : (
                                <button className="text-gray-400 hover:text-blue-600 text-xs font-bold uppercase">Re-open</button>
                            )}
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

export default FiscalPeriods;
