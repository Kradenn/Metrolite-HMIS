
import React, { useState } from 'react';

interface CmeEvent {
  id: number;
  title: string;
  provider: string;
  date: string;
  time: string;
  points: number;
  type: 'Webinar' | 'Physical' | 'Hybrid';
  status: 'Open' | 'Full' | 'Registered';
  image: string;
  description: string;
}

interface TranscriptItem {
  id: number;
  title: string;
  dateCompleted: string;
  provider: string;
  points: number;
  certificateId: string;
  category: 'Ethics' | 'Clinical' | 'Management' | 'Technical';
}

const CME: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'transcript' | 'report'>('calendar');
  const [filterType, setFilterType] = useState('All');

  // Mock Data
  const stats = {
     earned: 38,
     target: 50,
     compliance: 76,
     pending: 3
  };

  const upcomingEvents: CmeEvent[] = [
     { 
       id: 1, title: 'Advanced ACLS Refresher 2023', provider: 'Resuscitation Council', 
       date: '2023-11-05', time: '09:00 AM', points: 5, type: 'Physical', status: 'Open', image: 'fa-heartbeat',
       description: 'Hands-on training session for advanced cardiac life support protocols and drug administration.'
     },
     { 
       id: 2, title: 'Infection Prevention & Control', provider: 'MOH / KMTC', 
       date: '2023-11-10', time: '02:00 PM', points: 2, type: 'Webinar', status: 'Registered', image: 'fa-virus',
       description: 'Updating guidelines on post-pandemic hygiene standards and PPE optimization.'
     },
     { 
       id: 3, title: 'Paediatric Emergencies: Triage to Treatment', provider: 'Kenya Paediatric Assoc.', 
       date: '2023-11-15', time: '10:00 AM', points: 3, type: 'Hybrid', status: 'Full', image: 'fa-child',
       description: 'Case studies on respiratory distress and metabolic emergencies in children under 12.'
     },
     { 
       id: 4, title: 'AI in Radiology: Imaging Updates', provider: 'Radiology Dept', 
       date: '2023-11-20', time: '11:30 AM', points: 2, type: 'Physical', status: 'Open', image: 'fa-x-ray',
       description: 'Introduction to automated image segmentation and triage using current AI tools.'
     },
  ];

  const transcript: TranscriptItem[] = [
     { id: 101, title: 'Patient Privacy and HIPAA Standards', dateCompleted: '2023-01-15', provider: 'HR Dept', points: 2, certificateId: 'CERT-001', category: 'Ethics' },
     { id: 102, title: 'Medical Ethics & Law (KMPDC 2023)', dateCompleted: '2023-03-22', provider: 'KMPDC', points: 10, certificateId: 'CERT-002', category: 'Ethics' },
     { id: 103, title: 'Chronic Wound Management Series', dateCompleted: '2023-06-10', provider: 'Surgical Dept', points: 4, certificateId: 'CERT-003', category: 'Clinical' },
     { id: 104, title: 'Lean Hospital Management', dateCompleted: '2023-08-05', provider: 'Admin Unit', points: 6, certificateId: 'CERT-004', category: 'Management' },
  ];

  const handleRegister = (id: number) => {
      alert(`Registration successful for Event #${id}. An invitation has been sent to your email.`);
  };

  return (
    <div className="animate-bottom space-y-6">
      
      {/* 1. Executive Summary & KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
            <div className="relative z-10">
               <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CPD Points Earned</h6>
               <div className="flex items-baseline space-x-2 mt-1">
                  <h3 className="text-3xl font-black text-teal-600">{stats.earned}</h3>
                  <span className="text-sm text-gray-300 font-bold uppercase">/ {stats.target}</span>
               </div>
               <p className="text-[10px] text-gray-400 font-bold mt-4 uppercase">Required for license renewal</p>
            </div>
            <i className="fa fa-certificate absolute -right-6 -bottom-6 text-8xl text-teal-50 group-hover:text-teal-100 transition-colors duration-500 rotate-12"></i>
         </div>

         <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
            <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress to Target</h6>
            <div className="mt-4">
               <div className="flex justify-between text-xs font-black text-blue-600 mb-2">
                  <span>{stats.compliance}% Complete</span>
                  <span>{stats.target - stats.earned} to go</span>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner p-0.5">
                  <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${stats.compliance}%` }}></div>
               </div>
            </div>
         </div>

         <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
            <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Awaiting Verification</h6>
            <div className="flex items-center justify-between mt-4">
               <h3 className="text-3xl font-black text-orange-500">{stats.pending}</h3>
               <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-lg">
                  <i className="fa fa-clock"></i>
               </div>
            </div>
            <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase">Self-submitted credits</p>
         </div>

         <button 
             onClick={() => setActiveTab('report')}
             className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col justify-center items-start cursor-pointer hover:bg-black transition-all hover:-translate-y-1 active:scale-95 border border-slate-700"
          >
             <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-500/20 text-teal-400 rounded-xl flex items-center justify-center text-xl">
                   <i className="fa fa-plus-circle"></i>
                </div>
                <div>
                   <h3 className="text-lg font-black uppercase tracking-tight">Report CME</h3>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">External Credits</p>
                </div>
             </div>
         </button>
      </div>

      {/* 2. Main Content Module */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[600px] flex flex-col">
         
         {/* Internal Module Nav */}
         <div className="flex border-b border-gray-100 bg-gray-50 px-2 pt-2">
            {[
               { id: 'calendar', label: 'Training Calendar', icon: 'fa-calendar-alt' },
               { id: 'transcript', label: 'License Transcript', icon: 'fa-id-card' },
               { id: 'report', label: 'Submission Portal', icon: 'fa-file-upload' }
            ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-t-2 border-l border-r rounded-t-xl mx-0.5 flex items-center space-x-2 ${
                     activeTab === tab.id 
                     ? 'border-t-teal-600 border-l-gray-200 border-r-gray-200 bg-white text-teal-600 shadow-sm relative -bottom-[1px]' 
                     : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
               >
                  <i className={`fa ${tab.icon}`}></i>
                  <span>{tab.label}</span>
               </button>
            ))}
         </div>

         <div className="p-8 flex-1">
            
            {/* --- CALENDAR TAB --- */}
            {activeTab === 'calendar' && (
               <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                     <div>
                        <h5 className="text-sm font-black text-gray-700 uppercase tracking-widest">Upcoming Hospital & Partner Training</h5>
                        <p className="text-xs text-gray-500 font-medium">Browse and register for certified CME sessions.</p>
                     </div>
                     <div className="flex space-x-2">
                        {['All', 'Webinar', 'Physical', 'Hybrid'].map(ft => (
                           <button 
                              key={ft}
                              onClick={() => setFilterType(ft)}
                              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                                 filterType === ft ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                              }`}
                           >
                              {ft}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                     {upcomingEvents.filter(e => filterType === 'All' || e.type === filterType).map(evt => (
                        <div key={evt.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all flex flex-col group border-b-4 border-b-transparent hover:border-b-teal-500">
                           <div className="h-32 bg-gray-100 flex items-center justify-center text-gray-300 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-blue-500/20"></div>
                              <i className={`fa ${evt.image} text-5xl group-hover:scale-110 transition-transform duration-700`}></i>
                              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase text-teal-600 shadow-sm border border-teal-100">{evt.type}</span>
                           </div>
                           <div className="p-6 flex-1 flex flex-col">
                              <h6 className="text-sm font-black text-gray-800 uppercase leading-snug mb-2 group-hover:text-teal-600 transition-colors">{evt.title}</h6>
                              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3">{evt.provider}</p>
                              <p className="text-[11px] text-gray-400 font-medium line-clamp-2 mb-6">{evt.description}</p>
                              
                              <div className="mt-auto space-y-4">
                                 <div className="grid grid-cols-2 gap-2 text-[10px] font-black text-gray-500 uppercase border-t border-gray-50 pt-4">
                                    <div className="flex items-center"><i className="fa fa-calendar-alt mr-2 text-teal-500"></i> {evt.date}</div>
                                    <div className="flex items-center"><i className="fa fa-clock mr-2 text-teal-500"></i> {evt.time}</div>
                                 </div>
                                 <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                       <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Value</span>
                                       <span className="text-sm font-black text-teal-600">{evt.points} CPD Units</span>
                                    </div>
                                    {evt.status === 'Open' ? (
                                       <button onClick={() => handleRegister(evt.id)} className="bg-teal-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-teal-700 transition transform active:scale-95">Register</button>
                                    ) : (
                                       <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase border flex items-center ${evt.status === 'Registered' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                          {evt.status === 'Registered' ? <><i className="fa fa-check-circle mr-1"></i> Registered</> : 'Session Full'}
                                       </span>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* --- TRANSCRIPT TAB --- */}
            {activeTab === 'transcript' && (
               <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
                  <div className="flex justify-between items-center">
                      <div>
                        <h5 className="text-sm font-black text-gray-700 uppercase tracking-widest">Clinical Transcript</h5>
                        <p className="text-xs text-gray-500">Permanent record of all verified education units.</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-gray-50 flex items-center shadow-sm">
                           <i className="fa fa-file-pdf mr-2 text-red-500"></i> Export PDF
                        </button>
                        <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-blue-700 flex items-center shadow-lg">
                           <i className="fa fa-paper-plane mr-2"></i> Submit to Board
                        </button>
                      </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                     <table className="w-full text-left text-[11px]">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-black uppercase tracking-widest">
                           <tr>
                              <th className="px-6 py-5">Topic / Course Title</th>
                              <th className="px-6 py-5">Category</th>
                              <th className="px-6 py-5">Provider</th>
                              <th className="px-6 py-5">Completed</th>
                              <th className="px-6 py-5 text-center">CPD units</th>
                              <th className="px-6 py-5 text-right">Verification</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                           {transcript.map((item) => (
                              <tr key={item.id} className="hover:bg-teal-50/30 transition-colors">
                                 <td className="px-6 py-4">
                                    <div className="font-black text-gray-800 uppercase tracking-tight">{item.title}</div>
                                    <div className="text-[9px] text-gray-400 font-bold mt-0.5">Cert ID: {item.certificateId}</div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                                       item.category === 'Ethics' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                       item.category === 'Clinical' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                       'bg-gray-50 text-gray-500 border-gray-100'
                                    }`}>{item.category}</span>
                                 </td>
                                 <td className="px-6 py-4 font-bold">{item.provider}</td>
                                 <td className="px-6 py-4 font-mono text-gray-500">{item.dateCompleted}</td>
                                 <td className="px-6 py-4 text-center">
                                    <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-[10px] font-black shadow-inner">{item.points}</span>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <button className="text-teal-600 hover:text-teal-800 text-[10px] font-black uppercase tracking-widest flex items-center ml-auto bg-teal-50 px-3 py-1 rounded">
                                       <i className="fa fa-check-circle mr-1.5"></i> Verified
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {/* --- REPORT TAB --- */}
            {activeTab === 'report' && (
               <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-300">
                  <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full -mr-16 -mt-16"></div>
                     
                     <div className="relative z-10">
                        <h5 className="text-xl font-black text-gray-800 uppercase tracking-tight border-b border-gray-100 pb-4 mb-8">
                           Submit External Training Evidence
                        </h5>
                        
                        <form className="space-y-8">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                              <div className="space-y-5">
                                 <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Training / Conference Title</label>
                                    <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-teal-500 transition-all" placeholder="e.g. 10th Annual Surgical Symposium" />
                                 </div>
                                 <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Issuing Institution</label>
                                    <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-teal-500 transition-all" placeholder="e.g. Kenya Medical Association" />
                                 </div>
                                 <div className="grid grid-cols-2 gap-4">
                                    <div>
                                       <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Completion Date</label>
                                       <input type="date" className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none" />
                                    </div>
                                    <div>
                                       <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">CPD Units Claimed</label>
                                       <input type="number" className="w-full p-3 bg-blue-50 border border-blue-100 text-blue-800 rounded-xl text-sm font-black outline-none" placeholder="0" />
                                    </div>
                                 </div>
                              </div>

                              <div className="space-y-5">
                                 <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Brief Learning Outcomes</label>
                                    <textarea className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-teal-500 h-28 shadow-inner resize-none" placeholder="Summarize key medical takeaways..."></textarea>
                                 </div>
                                 <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Evidence Upload (Certificate/Log)</label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-teal-500 hover:bg-teal-50 transition-all cursor-pointer group bg-gray-50/50">
                                       <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                          <i className="fa fa-cloud-upload-alt text-teal-500"></i>
                                       </div>
                                       <p className="text-[10px] font-black text-gray-400 group-hover:text-teal-600 uppercase tracking-widest">Drop PDF or Scan Image</p>
                                       <p className="text-[9px] text-gray-300 mt-1 uppercase font-bold">Max 5MB • PDF/JPEG/PNG</p>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="pt-8 border-t border-gray-100 flex justify-end items-center space-x-6">
                              <button type="button" onClick={() => setActiveTab('calendar')} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors">Discard Draft</button>
                              <button type="submit" className="bg-teal-600 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-100 hover:bg-teal-700 transition transform active:scale-95 flex items-center">
                                 <i className="fa fa-paper-plane mr-2"></i> Submit for Verification
                              </button>
                           </div>
                        </form>
                     </div>
                  </div>
                  
                  <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start space-x-4">
                     <i className="fa fa-info-circle text-blue-500 mt-1"></i>
                     <div className="text-[11px] text-blue-900 leading-relaxed font-medium">
                        <p className="font-black uppercase tracking-tight mb-1">Board Verification Notice</p>
                        External submissions are reviewed by the clinical education committee every Thursday. You will receive a system notification once the credits are added to your official transcript.
                     </div>
                  </div>
               </div>
            )}

         </div>
      </div>
    </div>
  );
};

export default CME;
