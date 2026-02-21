import React from 'react';
import { Link } from 'react-router';

const Telehealth: React.FC = () => {
  const stats = [
    { label: 'Today\'s Virtual Visits', value: '12', color: 'bg-blue-600', icon: 'fa-video' },
    { label: 'Ongoing Sessions', value: '2', color: 'bg-green-600', icon: 'fa-clock' },
    { label: 'Patient Waiting Room', value: '4', color: 'bg-orange-500', icon: 'fa-users' },
    { label: 'Completed Today', value: '6', color: 'bg-purple-600', icon: 'fa-check-double' },
  ];

  const upcomingVisits = [
    { id: 'VV-101', patient: 'Sarah Connor', time: '10:30 AM', status: 'Waiting', type: 'Follow-up' },
    { id: 'VV-102', patient: 'John Matrix', time: '11:15 AM', status: 'Scheduled', type: 'Consultation' },
    { id: 'VV-103', patient: 'Ellen Ripley', time: '12:00 PM', status: 'Scheduled', type: 'Specialist Review' },
  ];

  return (
    <div className="animate-bottom space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Telehealth Command Center</h2>
          <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest font-bold">UM Chat VoIP Backbone Active</p>
        </div>
        <Link to="/telehealth/encounter/new" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition transform active:scale-95">
          <i className="fa fa-plus-circle mr-2"></i> Open Instant Room
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-200 shadow-sm flex items-center space-x-6 group hover:shadow-xl transition-all">
            <div className={`w-14 h-14 ${s.color} text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
              <i className={`fa ${s.icon}`}></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{s.label}</p>
              <h4 className="text-3xl font-black text-gray-800 tracking-tighter">{s.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[500px]">
        {/* Waiting Room */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 bg-slate-900 text-white border-b border-white/10 flex justify-between items-center">
            <h5 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400">Active Patient Queue</h5>
            <div className="flex space-x-4">
               <button className="text-[10px] font-black text-indigo-400 uppercase hover:underline">Sync Registry</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50 custom-scrollbar">
            {upcomingVisits.map((v) => (
              <div key={v.id} className="p-6 hover:bg-indigo-50/50 transition-all flex items-center justify-between group cursor-pointer">
                <div className="flex items-center space-x-6">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    {v.patient[0]}
                  </div>
                  <div>
                    <h6 className="text-sm font-black text-gray-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{v.patient}</h6>
                    <div className="flex items-center space-x-3 mt-1.5">
                       <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{v.time}</span>
                       <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                       <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{v.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                   <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 transition-all ${
                     v.status === 'Waiting' ? 'bg-green-50 text-green-700 border-green-200 animate-pulse' : 'bg-gray-50 text-gray-400 border-gray-200'
                   }`}>{v.status}</div>
                   <Link to={`/telehealth/encounter/${v.id}`} className="bg-indigo-600 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all">
                      <i className="fa fa-video"></i>
                   </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connectivity Status */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white border border-gray-200 rounded-[2rem] shadow-sm p-8">
              <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-3 mb-6 flex items-center">
                <i className="fa fa-signal mr-2 text-indigo-500"></i> Signal Registry
              </h5>
              <div className="space-y-6">
                 {[
                   { label: 'Broadband Tunnel', status: 'Excellent', icon: 'fa-wifi', color: 'text-green-500' },
                   { label: 'Webcam Node', status: 'Active', icon: 'fa-camera', color: 'text-green-500' },
                   { label: 'VoIP Handshake', status: 'Ready', icon: 'fa-phone-volume', color: 'text-blue-500' },
                   { label: 'UM Chat Sync', status: 'Live', icon: 'fa-commenting', color: 'text-indigo-600' },
                 ].map((d, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                         <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                             <i className={`fa ${d.icon} text-sm`}></i>
                         </div>
                         <span className="text-[11px] font-bold text-gray-600 uppercase tracking-tighter">{d.label}</span>
                      </div>
                      <span className={`text-[10px] font-black uppercase ${d.color}`}>{d.status}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-indigo-400">AI Medical Scribe</h5>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-6">Real-time clinical coding powered by Gemini Live API. Dictations are automatically mapped to ICD-11.</p>
                <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                   <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">System Integrated</span>
                </div>
              </div>
              <i className="fa fa-microchip absolute -right-6 -bottom-6 text-[10rem] text-white/5 rotate-12 transition-transform group-hover:rotate-[25deg] duration-700"></i>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Telehealth;
