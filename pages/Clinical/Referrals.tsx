
import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';

const Referrals: React.FC = () => {
  const { activePatient } = usePatient();
  const [activeTab, setActiveTab] = useState<'history' | 'create'>('history');
  const [referralType, setReferralType] = useState<'Outbound' | 'Inbound'>('Outbound');

  // Mock Data for History
  const referralsHistory = [
    { id: 'REF-2023-001', date: '2023-10-15', type: 'Outbound', facility: 'Kenyatta National Hospital', doctor: 'Dr. Kamau', reason: 'Specialized Cardiac Surgery', status: 'Accepted' },
    { id: 'REF-2023-002', date: '2023-09-20', type: 'Inbound', facility: 'Aga Khan Hospital', doctor: 'Dr. Smith', reason: 'ICU Overflow', status: 'Completed' },
    { id: 'REF-2023-003', date: '2023-08-10', type: 'Outbound', facility: 'Moi Teaching & Referral', doctor: 'Dr. Omondi', reason: 'Oncology Review', status: 'Pending' },
  ];

  return (
    <div className="animate-bottom space-y-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Referral Management</h2>
            <p className="text-xs text-gray-500 font-medium mt-1">Manage inbound and outbound patient transfers and clinical handovers.</p>
          </div>
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
             <button 
               onClick={() => setActiveTab('history')}
               className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                <i className="fa fa-list-alt mr-2"></i> History
             </button>
             <button 
               onClick={() => setActiveTab('create')}
               className={`px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'create' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
             >
                <i className="fa fa-plus-circle mr-2"></i> New Referral
             </button>
          </div>
      </div>

      {/* Patient Context Card */}
      {activePatient ? (
           <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
              <div className="flex items-center space-x-5 z-10">
                 <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-2xl shadow-inner border border-blue-100">
                    {activePatient.surname.charAt(0)}
                 </div>
                 <div>
                    <h4 className="text-base font-black text-gray-800 uppercase tracking-tight">{activePatient.surname}, {activePatient.othernames}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 mr-2">{activePatient.outpatientNo}</span>
                        {activePatient.gender} • {activePatient.age} Yrs
                    </p>
                 </div>
              </div>
              <div className="flex items-center space-x-8 text-xs text-gray-600 z-10">
                  <div className="text-right">
                      <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Primary Scheme</span>
                      <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{activePatient.scheme}</span>
                  </div>
                  <div className="text-right">
                      <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Contact</span>
                      <span className="font-mono font-bold">{activePatient.telephone}</span>
                  </div>
                  <div className="text-right">
                       <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Occupation</span>
                       <span className="font-bold">{activePatient.occupation || 'N/A'}</span>
                  </div>
              </div>
              <i className="fa fa-file-medical-alt absolute -right-6 -bottom-6 text-9xl text-gray-50 opacity-50 rotate-12 z-0"></i>
           </div>
       ) : (
           <div className="bg-orange-50 border border-orange-100 rounded-xl p-6 text-center flex flex-col items-center justify-center min-h-[120px]">
               <i className="fa fa-user-clock text-3xl text-orange-400 mb-2"></i>
               <p className="text-sm font-bold text-orange-700 uppercase tracking-tight">No Active Patient Selected</p>
               <p className="text-xs text-orange-500 mt-1">Please select a patient from the registry or queue to proceed with referrals.</p>
           </div>
       )}

      {/* Main Content Area */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[500px]">
         
         {/* HISTORY TAB */}
         {activeTab === 'history' && (
             <div className="p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h5 className="text-sm font-black text-gray-700 uppercase tracking-widest">Referral History</h5>
                    <div className="flex space-x-2">
                        <input type="date" className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs outline-none bg-gray-50" />
                        <button className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition"><i className="fa fa-filter mr-1"></i> Filter</button>
                    </div>
                 </div>
                 
                 <div className="overflow-x-auto border border-gray-100 rounded-lg">
                    <table className="w-full text-left text-[11px]">
                       <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-tight">
                          <tr>
                             <th className="px-6 py-3">Referral ID</th>
                             <th className="px-6 py-3">Date</th>
                             <th className="px-6 py-3 text-center">Type</th>
                             <th className="px-6 py-3">Facility</th>
                             <th className="px-6 py-3">Doctor</th>
                             <th className="px-6 py-3">Reason</th>
                             <th className="px-6 py-3 text-center">Status</th>
                             <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-50 text-gray-600">
                          {referralsHistory.map(ref => (
                             <tr key={ref.id} className="hover:bg-blue-50/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-blue-600">{ref.id}</td>
                                <td className="px-6 py-4">{ref.date}</td>
                                <td className="px-6 py-4 text-center">
                                   <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${ref.type === 'Outbound' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                                      {ref.type}
                                   </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-800 uppercase">{ref.facility}</td>
                                <td className="px-6 py-4">{ref.doctor}</td>
                                <td className="px-6 py-4 truncate max-w-[150px]">{ref.reason}</td>
                                <td className="px-6 py-4 text-center">
                                   <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                      ref.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : 
                                      ref.status === 'Accepted' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                      'bg-gray-50 text-gray-500 border-gray-100'
                                   }`}>
                                      {ref.status}
                                   </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                   <button className="text-gray-400 hover:text-blue-600 transition"><i className="fa fa-eye"></i></button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
             </div>
         )}

         {/* CREATE TAB */}
         {activeTab === 'create' && (
             <div className="flex flex-col h-full">
                 {activePatient ? (
                     <div className="p-8 max-w-5xl mx-auto w-full">
                        <form className="space-y-8">
                           {/* Referral Context */}
                           <div>
                              <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2 mb-6">Logistics & Context</h6>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                 <div className="space-y-4">
                                     <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Referral Type</label>
                                        <div className="flex bg-gray-100 p-1 rounded-lg">
                                           <button 
                                             type="button" 
                                             onClick={() => setReferralType('Outbound')}
                                             className={`flex-1 py-2 rounded-md text-[10px] font-black uppercase transition-all ${referralType === 'Outbound' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                           >
                                              Outbound
                                           </button>
                                           <button 
                                             type="button"
                                             onClick={() => setReferralType('Inbound')}
                                             className={`flex-1 py-2 rounded-md text-[10px] font-black uppercase transition-all ${referralType === 'Inbound' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                           >
                                              Inbound
                                           </button>
                                        </div>
                                     </div>
                                     <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Priority</label>
                                        <select className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500">
                                            <option>Routine</option>
                                            <option>Urgent</option>
                                            <option>Emergency</option>
                                        </select>
                                     </div>
                                 </div>
                                 <div className="space-y-4">
                                     <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{referralType === 'Outbound' ? 'Referred To (Facility)' : 'Referred From (Facility)'}</label>
                                        <select className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500">
                                            <option>Select Facility...</option>
                                            <option>Kenyatta National Hospital</option>
                                            <option>Moi Teaching & Referral</option>
                                            <option>Aga Khan University Hospital</option>
                                        </select>
                                     </div>
                                     <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">External Doctor / Consultant</label>
                                        <input type="text" className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500" placeholder="Name of doctor..." />
                                     </div>
                                 </div>
                                 <div className="space-y-4">
                                     <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Date Time</label>
                                        <input type="datetime-local" className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500" />
                                     </div>
                                     <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Internal Doctor</label>
                                        <input type="text" className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs outline-none bg-gray-100" readOnly defaultValue="Current User" />
                                     </div>
                                 </div>
                              </div>
                           </div>

                           {/* Clinical Details */}
                           <div>
                              <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2 mb-6">Clinical Information</h6>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <div className="space-y-4">
                                      <div>
                                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Reason for Referral</label>
                                          <textarea className="w-full p-3 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 h-24 resize-none" placeholder="Primary reason for transfer..."></textarea>
                                      </div>
                                      <div>
                                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">History / Presenting Complaints</label>
                                          <textarea className="w-full p-3 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 h-24 resize-none" placeholder="Brief clinical history..."></textarea>
                                      </div>
                                  </div>
                                  <div className="space-y-4">
                                      <div>
                                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Examination Findings</label>
                                          <textarea className="w-full p-3 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 h-24 resize-none" placeholder="Relevant findings..."></textarea>
                                      </div>
                                      <div>
                                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Investigations / Treatment Given</label>
                                          <textarea className="w-full p-3 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 h-24 resize-none" placeholder="Labs, Radiology, Meds administered..."></textarea>
                                      </div>
                                  </div>
                              </div>
                           </div>

                           {/* Footer Actions */}
                           <div className="flex justify-end pt-6 border-t border-gray-100 gap-3">
                               <button type="button" className="px-6 py-2.5 border border-gray-300 rounded-lg text-xs font-bold text-gray-600 uppercase hover:bg-gray-50 transition">
                                   Save as Draft
                               </button>
                               <button type="submit" className="bg-blue-600 text-white px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition transform active:scale-95">
                                   Finalize Referral
                               </button>
                           </div>
                        </form>
                     </div>
                 ) : (
                     <div className="flex flex-col items-center justify-center h-full text-gray-300 py-20">
                        <i className="fa fa-user-slash text-6xl mb-4 opacity-30"></i>
                        <p className="text-sm font-bold uppercase tracking-widest">No Patient Selected</p>
                        <p className="text-xs mt-2">Please select a patient to initiate a new referral.</p>
                     </div>
                 )}
             </div>
         )}

      </div>
    </div>
  );
};

export default Referrals;
