
import React from 'react';

const Consultants: React.FC = () => {
  const consultants = [
     { id: 1, name: 'Dr. James Wilson', role: 'Cardiologist', phone: '0722000000', patients: 12, status: 'Available' },
     { id: 2, name: 'Dr. Sarah Jane', role: 'Pediatrician', phone: '0733111222', patients: 5, status: 'In Consultation' },
  ];

  return (
    <div className="animate-bottom space-y-6">
       <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div>
             <h2 className="text-xl font-bold text-gray-800">Consultant Directory</h2>
             <p className="text-xs text-gray-500 font-medium">External and Visiting Specialists.</p>
          </div>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow hover:bg-blue-700 transition">
             <i className="fa fa-user-md mr-2"></i> Add Consultant
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultants.map(doc => (
             <div key={doc.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                   <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-lg">
                      {doc.name.split(' ')[1].charAt(0)}
                   </div>
                   <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${doc.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {doc.status}
                   </span>
                </div>
                
                <h5 className="text-sm font-black text-gray-800 uppercase">{doc.name}</h5>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-4">{doc.role}</p>
                
                <div className="space-y-2 text-[11px] text-gray-600 border-t border-gray-50 pt-3">
                   <div className="flex justify-between">
                      <span className="font-bold text-gray-400 uppercase">Contact:</span>
                      <span className="font-mono">{doc.phone}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="font-bold text-gray-400 uppercase">Active Patients:</span>
                      <span className="font-black text-blue-600">{doc.patients}</span>
                   </div>
                </div>
             </div>
          ))}
       </div>
    </div>
  );
};

export default Consultants;
