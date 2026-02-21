import React from 'react';
import { Link } from 'react-router';

const TelehealthDashboard: React.FC = () => {
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
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-light text-gray-700 tracking-tight">Telehealth Command</h2>
          <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest font-bold">Virtual Care Management</p>
        </div>
        <Link to="/telehealth/encounter/new" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase shadow-xl hover:bg-blue-700 transition">
          <i className="fa fa-plus-circle mr-2"></i> Start Instant Session
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className={`w-12 h-12 ${s.color} text-white rounded-xl flex items-center justify-center text-xl shadow-lg`}>
              <i className={`fa ${s.icon}`}></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
              <h4 className="text-2xl font-black text-gray-800">{s.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Waiting Room */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h5 className="text-xs font-black text-gray-700 uppercase tracking-widest">Active Virtual Queue</h5>
            <div className="flex space-x-2">
               <button className="text-[10px] font-bold text-blue-600 uppercase hover:underline">Refresh List</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {upcomingVisits.map((v) => (
              <div key={v.id} className="p-4 hover:bg-blue-50 transition-colors flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-500">{v.patient[0]}</div>
                  <div>
                    <h6 className="text-sm font-bold text-gray-800 uppercase">{v.patient}</h6>
                    <div className="flex space-x-2 text-[10px] font-bold">
                       <span className="text-blue-600">{v.time}</span>
                       <span className="text-gray-400 uppercase">• {v.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                   <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${
                     v.status === 'Waiting' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'
                   }`}>{v.status}</span>
                   <Link to={`/telehealth/encounter/${v.id}`} className="bg-blue-600 text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <i className="fa fa-video text-xs"></i>
                   </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connectivity Status */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h5 className="text-xs font-black text-gray-700 uppercase tracking-widest border-b border-gray-50 pb-3 mb-4">Device Health</h5>
              <div className="space-y-4">
                 {[
                   { label: 'Broadband Connection', status: 'Excellent', icon: 'fa-wifi', color: 'text-green-500' },
                   { label: 'Camera Hardware', status: 'Ready', icon: 'fa-camera', color: 'text-green-500' },
                   { label: 'Microphone Sensitivity', status: 'Good', icon: 'fa-microphone', color: 'text-blue-500' },
                   { label: 'System Latency', status: '24ms', icon: 'fa-bolt', color: 'text-green-500' },
                 ].map((d, i) => (
                   <div key={i} className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center space-x-3 text-gray-500 uppercase tracking-tighter">
                         <i className={`fa ${d.icon} w-4`}></i>
                         <span>{d.label}</span>
                      </div>
                      <span className={d.color}>{d.status}</span>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-6 py-2 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-black text-gray-500 uppercase hover:bg-gray-100 transition">Run Technical Audit</button>
           </div>

           <div className="bg-[#1e293b] text-white rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h5 className="text-xs font-black uppercase tracking-widest mb-2 text-blue-400">AI Scribe Enabled</h5>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-4">Your sessions are automatically transcribed using Gemini Live API for instant medical coding.</p>
                <div className="flex items-center space-x-2">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest">System Ready</span>
                </div>
              </div>
              <i className="fa fa-robot absolute -right-4 -bottom-4 text-7xl text-white/5 rotate-12"></i>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TelehealthDashboard;