
import React from 'react';

const Scheduling: React.FC = () => {
  const days = ['Mon 23', 'Tue 24', 'Wed 25', 'Thu 26', 'Fri 27', 'Sat 28', 'Sun 29'];
  const staff = [
     { name: 'Dr. Wilson', role: 'Doctor' },
     { name: 'Nurse Sarah', role: 'Nurse' },
     { name: 'Peter (Tech)', role: 'Lab' },
  ];

  return (
    <div className="animate-bottom space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
         <div>
            <h2 className="text-xl font-bold text-gray-800">Shift Scheduling</h2>
            <p className="text-xs text-gray-500 font-medium">Manage staff roster for Oct 23 - Oct 29.</p>
         </div>
         <div className="flex space-x-2">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 shadow-sm">
               <i className="fa fa-print mr-2"></i> Publish
            </button>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow hover:bg-blue-700 transition">
               <i className="fa fa-plus-circle mr-2"></i> Auto-Fill
            </button>
         </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] border-collapse">
               <thead>
                  <tr>
                     <th className="p-4 border-b border-r border-gray-200 bg-gray-50 w-48 font-black text-gray-500 uppercase tracking-widest sticky left-0 z-10">Employee</th>
                     {days.map(day => (
                        <th key={day} className="p-4 border-b border-gray-200 bg-gray-50 text-center font-bold text-gray-700 min-w-[120px] uppercase">
                           {day}
                        </th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                  {staff.map((s, i) => (
                     <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-4 border-r border-gray-200 font-bold text-gray-800 sticky left-0 bg-white">
                           {s.name}
                           <span className="block text-[9px] text-gray-400 uppercase font-medium">{s.role}</span>
                        </td>
                        {days.map((_, dIndex) => (
                           <td key={dIndex} className="p-2 border-r border-gray-100 text-center relative h-16 group cursor-pointer hover:bg-gray-50">
                              {/* Logic for mock shifts */}
                              {(i + dIndex) % 3 === 0 ? (
                                 <div className="bg-blue-100 text-blue-700 border border-blue-200 rounded p-1 text-[9px] font-black uppercase shadow-sm">
                                    08:00 - 17:00
                                 </div>
                              ) : (i + dIndex) % 4 === 0 ? (
                                 <div className="bg-purple-100 text-purple-700 border border-purple-200 rounded p-1 text-[9px] font-black uppercase shadow-sm">
                                    19:00 - 07:00
                                 </div>
                              ) : (
                                 <div className="text-gray-300 text-xs font-bold opacity-0 group-hover:opacity-50">+ Add</div>
                              )}
                           </td>
                        ))}
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default Scheduling;
