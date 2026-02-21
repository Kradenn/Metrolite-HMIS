import React, { useState, useMemo } from 'react';
import QueueModal from '../../components/QueueModal';

const Queue: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'graph' | 'calendar'>('list');
  const [calendarView, setCalendarView] = useState<'day' | 'week'>('day');
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<{name: string, id: string} | null>(null);
  
  // New State for Filtering
  const [scope, setScope] = useState<'My Room' | 'All'>('My Room');

  // Mock Queue Data
  const queueItems = [
    { id: 1, name: 'JANE DOE', opNo: 'OP-2023-001', timeIn: '10:00 AM', duration: 45, from: 'Triage', to: 'Consultation', note: 'High Fever', priority: 'High' },
    { id: 2, name: 'JOHN SMITH', opNo: 'OP-2023-042', timeIn: '10:15 AM', duration: 30, from: 'Reception', to: 'Triage', note: 'Checkup', priority: 'Normal' },
    { id: 3, name: 'ALICE WONG', opNo: 'OP-2023-089', timeIn: '10:20 AM', duration: 25, from: 'Lab', to: 'Consultation', note: 'Review Results', priority: 'Normal' },
    { id: 4, name: 'MICHAEL BROWN', opNo: 'OP-2023-112', timeIn: '10:30 AM', duration: 15, from: 'Pharmacy', to: 'Billing', note: 'Payment Issue', priority: 'Low' },
    { id: 5, name: 'SARAH CONNOR', opNo: 'OP-2023-156', timeIn: '10:35 AM', duration: 10, from: 'Triage', to: 'Emergency', note: 'Chest Pain', priority: 'Critical' },
    { id: 6, name: 'ROBERT PATRICK', opNo: 'OP-2023-200', timeIn: '10:40 AM', duration: 5, from: 'Reception', to: 'Triage', note: '-', priority: 'Normal' },
  ];

  // Filtering Logic
  const filteredQueue = useMemo(() => {
    if (scope === 'All') return queueItems;
    // Assume "My Room" is Consultation for this demo
    return queueItems.filter(item => item.to === 'Consultation');
  }, [scope]);

  // Calendar time slots
  const timeSlots = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`); // 8:00 to 19:00

  const handleQueueClick = (patient: any) => {
      setSelectedPatient({ name: patient.name, id: patient.opNo });
      setShowQueueModal(true);
  };

  return (
    <div className="animate-bottom space-y-6">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg border border-blue-400">
                 <i className="fa fa-users-viewfinder"></i>
              </div>
              <div>
                <h4 className="text-lg font-black text-gray-800 uppercase tracking-tight leading-none">Patient Queue Center</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Live Hospital Flow Monitor</p>
              </div>
           </div>
           
           <div className="flex items-center space-x-2 bg-gray-200/50 p-1 rounded-2xl">
              {[
                { mode: 'list', icon: 'fa-list-ul' },
                { mode: 'grid', icon: 'fa-th-large' },
                { mode: 'calendar', icon: 'fa-calendar-alt' },
                { mode: 'graph', icon: 'fa-chart-pie' }
              ].map(item => (
                <button 
                  key={item.mode}
                  onClick={() => setViewMode(item.mode as any)}
                  className={`w-12 h-10 rounded-xl flex items-center justify-center transition-all ${viewMode === item.mode ? 'bg-white text-blue-600 shadow-lg scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                  title={`${item.mode} View`}
                >
                  <i className={`fa ${item.icon} text-sm`}></i>
                </button>
              ))}
           </div>
        </div>

        {/* Filters Bar */}
        <div className="p-4 bg-white border-b border-gray-50 px-8">
           <div className="flex items-center space-x-6">
              <button 
                onClick={() => setScope('My Room')}
                className={`flex items-center space-x-3 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${scope === 'My Room' ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                <i className="fa fa-user-doctor"></i>
                <span>My Station</span>
              </button>
              <button 
                onClick={() => setScope('All')}
                className={`flex items-center space-x-3 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${scope === 'All' ? 'bg-slate-900 text-white shadow-xl' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                <i className="fa fa-building"></i>
                <span>Global View</span>
              </button>
              <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block"></div>
              <span className="text-[10px] font-black text-gray-400 uppercase hidden md:block">Active Patients: <span className="text-blue-600">{filteredQueue.length}</span></span>
           </div>
        </div>

        {/* Content Area */}
        <div className="p-6 min-h-[500px]">
          
          {/* LIST VIEW */}
          {viewMode === 'list' && (
            <div className="overflow-x-auto border border-gray-100 rounded-2xl shadow-sm">
              <table className="w-full text-left text-[11px]">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-black uppercase tracking-widest">
                    <tr>
                        <th className="px-6 py-4">Queue No</th>
                        <th className="px-6 py-4">Patient's Name</th>
                        <th className="px-6 py-4">Arrival</th>
                        <th className="px-6 py-4">Wait Time</th>
                        <th className="px-6 py-4">Current/Next</th>
                        <th className="px-6 py-4">Note</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-600 bg-white">
                    {filteredQueue.map((item, index) => (
                        <tr key={item.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer group" onClick={() => handleQueueClick(item)}>
                          <td className="px-6 py-4 font-black text-blue-600">Q-{100 + index + 1}</td>
                          <td className="px-6 py-4 font-black text-gray-800 uppercase tracking-tight">{item.name} <span className="block text-[9px] text-gray-400 font-bold">{item.opNo}</span></td>
                          <td className="px-6 py-4 font-mono">{item.timeIn}</td>
                          <td className="px-6 py-4">
                              <span className={`font-black ${item.duration > 30 ? 'text-red-500' : 'text-gray-700'}`}>{item.duration}m</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                               <span className="bg-gray-100 px-2 py-0.5 rounded text-[9px] font-bold text-gray-500">{item.from}</span>
                               <i className="fa fa-chevron-right text-[8px] text-gray-300"></i>
                               <span className="bg-blue-50 px-2 py-0.5 rounded text-[9px] font-black text-blue-600">{item.to}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 italic text-gray-400 truncate max-w-[150px]">{item.note}</td>
                          <td className="px-6 py-4 text-center">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border ${
                                item.priority === 'Critical' ? 'bg-red-50 text-red-600 border-red-200' : 
                                item.priority === 'High' ? 'bg-orange-50 text-orange-600 border-orange-200' : 
                                item.priority === 'Low' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-blue-50 text-blue-600 border-blue-200'
                              }`}>
                                {item.priority}
                              </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm flex items-center justify-center">
                                <i className="fa fa-user-md text-xs"></i>
                             </button>
                          </td>
                        </tr>
                    ))}
                    {filteredQueue.length === 0 && (
                        <tr>
                            <td colSpan={8} className="px-6 py-20 text-center text-gray-400 italic">
                                <i className="fa fa-inbox text-4xl mb-4 opacity-10"></i>
                                <p className="text-sm font-black uppercase tracking-widest">No patients found in {scope}</p>
                            </td>
                        </tr>
                    )}
                  </tbody>
              </table>
            </div>
          )}

          {/* GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredQueue.map((item, index) => (
                  <div key={item.id} onClick={() => handleQueueClick(item)} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden group">
                      <div className={`absolute top-0 left-0 w-1.5 h-full ${
                          item.priority === 'Critical' ? 'bg-red-500' : 
                          item.priority === 'High' ? 'bg-orange-500' : 
                          item.priority === 'Low' ? 'bg-green-500' : 'bg-blue-500'
                      }`}></div>
                      
                      <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Q-{100 + index + 1}</span>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase border ${
                            item.priority === 'Critical' ? 'bg-red-50 text-red-600 border-red-200' : 
                            item.priority === 'High' ? 'bg-orange-50 text-orange-600 border-orange-200' : 
                            'bg-blue-50 text-blue-600 border-blue-200'
                          }`}>
                            {item.priority}
                          </span>
                      </div>
                      
                      <h5 className="text-sm font-black text-gray-800 uppercase tracking-tight mb-1 group-hover:text-blue-600 transition-colors">{item.name}</h5>
                      <p className="text-[10px] font-black text-blue-400 mb-4">{item.opNo}</p>
                      
                      <div className="space-y-3 pt-4 border-t border-gray-50">
                          <div className="flex justify-between text-[10px] font-bold">
                             <span className="text-gray-400 uppercase">Waiting Since</span>
                             <span className="text-gray-700">{item.timeIn} ({item.duration}m)</span>
                          </div>
                          <div className="flex items-center justify-between bg-gray-50 p-2 rounded-xl border border-gray-100">
                             <span className="text-[9px] font-black text-gray-500 uppercase">{item.from}</span>
                             <i className="fa fa-arrow-right text-[8px] text-gray-300 mx-2"></i>
                             <span className="text-[9px] font-black text-blue-600 uppercase">{item.to}</span>
                          </div>
                      </div>
                      
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="bg-blue-600 text-white w-7 h-7 rounded-xl flex items-center justify-center shadow-lg transform rotate-45 group-hover:rotate-0 transition-transform"><i className="fa fa-stethoscope text-[10px]"></i></button>
                      </div>
                  </div>
                ))}
            </div>
          )}

          {/* CALENDAR VIEW */}
          {viewMode === 'calendar' && (
            <div className="flex flex-col h-[600px] animate-in fade-in">
               <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-xl">
                     <button 
                        onClick={() => setCalendarView('day')} 
                        className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${calendarView === 'day' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                     >
                        Daily
                     </button>
                     <button 
                        onClick={() => setCalendarView('week')} 
                        className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${calendarView === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                     >
                        Weekly
                     </button>
                  </div>
                  <h5 className="text-sm font-black text-gray-600 uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h5>
               </div>

               <div className="flex-1 overflow-y-auto border border-gray-100 rounded-3xl bg-white shadow-inner">
                  <div className="grid grid-cols-[80px_1fr] divide-x divide-gray-100">
                     <div className="bg-gray-50 text-[10px] font-black text-gray-400 text-right pr-4 py-6 space-y-[4.5rem]">
                        {timeSlots.map(t => <div key={t} className="h-4">{t}</div>)}
                     </div>
                     <div className="relative bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCA0OGgxMDAlIiBzdHJva2U9IiNmM2Y0ZjYiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==')]">
                        {/* Mock Appointment on Calendar */}
                        <div 
                           onClick={() => handleQueueClick({name: 'JANE DOE', opNo: 'OP-2023-001'})}
                           className="absolute top-20 left-6 right-6 h-28 bg-blue-50 border-l-4 border-blue-600 rounded-2xl p-4 cursor-pointer hover:shadow-2xl transition-all group shadow-sm z-10"
                        >
                           <div className="flex justify-between">
                              <h6 className="text-xs font-black text-blue-900 uppercase tracking-tight">JANE DOE - Consultation</h6>
                              <span className="text-[9px] font-black bg-blue-100 text-blue-600 px-2 py-0.5 rounded uppercase">Urgent</span>
                           </div>
                           <p className="text-[10px] text-blue-400 font-bold mt-1">10:00 AM - 10:45 AM</p>
                           <p className="text-[9px] text-blue-300 mt-2 italic line-clamp-1">History: High grade fever since yesterday night.</p>
                           <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase">Open File</button>
                           </div>
                        </div>

                        {calendarView === 'week' && (
                           <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex items-center justify-center">
                              <div className="text-center p-8 bg-white border border-gray-100 rounded-3xl shadow-2xl">
                                 <i className="fa fa-lock text-3xl text-blue-500 mb-4 opacity-20"></i>
                                 <p className="text-xs font-black text-gray-800 uppercase tracking-widest">Multi-Day Roster View</p>
                                 <p className="text-[10px] text-gray-400 mt-2 font-medium">Enterprise license required for full scheduling analytics.</p>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* GRAPH VIEW */}
          {viewMode === 'graph' && (
            <div className="space-y-8 animate-in zoom-in-95">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10">
                           <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Volume</h6>
                           <p className="text-4xl font-black text-blue-600 mt-2">{filteredQueue.length}</p>
                           <p className="text-[9px] text-green-500 font-bold mt-2"><i className="fa fa-arrow-up"></i> +4 vs last hour</p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10">
                           <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avg Wait Time</h6>
                           <p className="text-4xl font-black text-orange-500 mt-2">21 <span className="text-xs text-gray-400 font-bold uppercase">min</span></p>
                           <p className="text-[9px] text-blue-500 font-bold mt-2"><i className="fa fa-check"></i> Within KPI</p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
                        <div className="relative z-10">
                           <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Acuity Index</h6>
                           <p className="text-4xl font-black text-red-500 mt-2">{filteredQueue.filter(i => i.priority === 'Critical' || i.priority === 'High').length}</p>
                           <p className="text-[9px] text-red-400 font-bold mt-2 uppercase tracking-widest">Priority cases</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Destination Bar Chart */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                        <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-6 border-b border-gray-50 pb-2">Load Distribution</h6>
                        <div className="space-y-6">
                            {[
                                { label: 'Consultation', count: 2, percent: '40%', color: 'bg-blue-600' },
                                { label: 'Triage Desk', count: 2, percent: '40%', color: 'bg-emerald-500' },
                                { label: 'Emergency', count: 1, percent: '20%', color: 'bg-red-500' },
                                { label: 'Billing', count: 1, percent: '20%', color: 'bg-slate-700' }
                            ].map((d, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-[10px] font-black text-gray-500 mb-2 uppercase tracking-tighter">
                                        <span>{d.label}</span>
                                        <span>{d.count} pts</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className={`${d.color} h-2 rounded-full transition-all duration-1000 shadow-sm`} style={{ width: d.percent }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Acuity Radar Simulation */}
                    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col items-center">
                        <h6 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-8 self-start border-b border-gray-50 pb-2 w-full">Priority Composition</h6>
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            {/* Circular Layout Mockup */}
                            <div className="absolute inset-0 border-4 border-gray-50 rounded-full"></div>
                            <div className="absolute inset-8 border-2 border-gray-100 rounded-full"></div>
                            <div className="absolute inset-16 border border-gray-200 rounded-full"></div>
                            <div className="relative z-10 text-center">
                               <p className="text-3xl font-black text-gray-800">100%</p>
                               <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Analysis</p>
                            </div>
                            {/* Priority Bubbles */}
                            <div className="absolute top-0 bg-red-500 w-4 h-4 rounded-full shadow-lg shadow-red-500/50"></div>
                            <div className="absolute bottom-4 right-0 bg-orange-500 w-3 h-3 rounded-full shadow-lg shadow-orange-500/50"></div>
                            <div className="absolute bottom-0 left-8 bg-blue-500 w-6 h-6 rounded-full shadow-lg shadow-blue-500/50"></div>
                        </div>
                        <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                           <div className="flex items-center text-[9px] font-black text-gray-400 uppercase"><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> Critical</div>
                           <div className="flex items-center text-[9px] font-black text-gray-400 uppercase"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> Normal</div>
                        </div>
                    </div>
                </div>
            </div>
          )}

        </div>

        {/* Footer Statistics */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 px-8 flex justify-between items-center">
           <div className="flex items-center space-x-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span>Station: <span className="text-blue-600">MAIN FRONT DESK</span></span>
              <span className="text-gray-300">|</span>
              <span>Operator: <span className="text-gray-800">ADMINISTRATOR</span></span>
           </div>
           <p className="text-[10px] text-gray-300 font-bold uppercase">System Latency: 24ms</p>
        </div>
      </div>

      <QueueModal 
        isOpen={showQueueModal} 
        onClose={() => setShowQueueModal(false)} 
        patientName={selectedPatient?.name}
        patientId={selectedPatient?.id}
      />
    </div>
  );
};

export default Queue;