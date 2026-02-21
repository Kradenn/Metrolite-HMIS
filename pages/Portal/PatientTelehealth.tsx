import React from 'react';
import { Link } from 'react-router';

const PatientTelehealth: React.FC = () => {
  return (
    <div className="animate-bottom space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden">
         <div className="relative z-10">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Virtual Care Center</h2>
            <p className="text-blue-100 text-sm font-medium max-w-lg mb-6">Connect with your doctor from the comfort of your home. High-quality secure video consultations.</p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow hover:bg-blue-50 transition">System Check</button>
         </div>
         <i className="fa fa-video absolute -right-6 -bottom-6 text-9xl text-white/10 rotate-12"></i>
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h5 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">Upcoming Sessions</h5>
        </div>

        <div className="p-6">
           <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-blue-50/30">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                 <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-600 text-2xl border border-blue-100">
                       <i className="fa fa-user-md"></i>
                    </div>
                    <div>
                       <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest mb-1 inline-block">Starting Soon</span>
                       <h4 className="text-lg font-black text-gray-800 uppercase">Dr. James Wilson</h4>
                       <p className="text-xs text-gray-500 font-bold uppercase">General Consultation • 10:30 AM Today</p>
                    </div>
                 </div>
                 <Link to="/telehealth/encounter/patient-view" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-blue-700 transition flex items-center">
                    <i className="fa fa-video mr-2"></i> Join Room
                 </Link>
              </div>
           </div>
           
           <div className="mt-8 text-center">
              <p className="text-gray-400 text-xs italic">No other upcoming sessions scheduled.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PatientTelehealth;