
import React from 'react';

const PatientPrescriptions: React.FC = () => {
  const prescriptions = [
    { id: 'RX-8821', date: '24-Oct-2023', medication: 'Amoxicillin 500mg', dosage: '1x3 for 5 days', doctor: 'Dr. James Wilson', status: 'Active' },
    { id: 'RX-7743', date: '10-Sep-2023', medication: 'Paracetamol', dosage: '2x2 for 3 days', doctor: 'Dr. Sarah', status: 'Completed' },
  ];

  return (
    <div className="animate-bottom space-y-6">
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h5 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">My Prescriptions</h5>
          <button className="bg-blue-600 text-white px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest shadow hover:bg-blue-700 transition">
             Request Refill
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 gap-4">
            {prescriptions.map((rx, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                            <i className="fa fa-pills"></i>
                        </div>
                        <div>
                            <h6 className="text-sm font-bold text-gray-800 uppercase">{rx.medication}</h6>
                            <p className="text-[10px] text-gray-500 font-medium">
                                <span className="font-bold text-blue-600">{rx.id}</span> • {rx.date} • <span className="uppercase">{rx.doctor}</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 w-full md:w-auto">
                        <div className="bg-gray-100 px-3 py-1 rounded text-xs font-mono text-gray-700 w-full md:w-auto text-center">
                            {rx.dosage}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border w-full md:w-auto text-center ${rx.status === 'Active' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                            {rx.status}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PatientPrescriptions;
