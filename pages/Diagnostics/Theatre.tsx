import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { useHospital } from '../../context/HospitalContext';
import QueueModal from '../../components/QueueModal';

interface SurgeryRequest {
  id: number;
  patientName: string;
  patientId: string;
  age: number;
  gender: string;
  procedure: string;
  surgeon: string;
  dateScheduled: string;
  status: 'Scheduled' | 'In Progress' | 'Recovery' | 'Completed';
  theatre: string;
}

const Theatre: React.FC = () => {
  const { activePatient, setActivePatient } = usePatient();
  const { hospitalName } = useHospital();
  const [activeTab, setActiveTab] = useState('schedule');
  
  // Modal States
  const [showBookModal, setShowBookModal] = useState(false);
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [isDetailsRevealed, setIsDetailsRevealed] = useState(true);

  // Operation Notes State (Matching Snapshot)
  const [opNotes, setOpNotes] = useState({
    operation: '',
    surgeon: '',
    assistant: '',
    anaesthetist: '',
    anaesthesia: '',
    scrubNurse: '',
    diagnosis: '',
    incision: '',
    biopsy: '',
    procedure: '',
    complications: '',
    estimatedBloodLoss: '',
    doctor: '',
    dateTimeRequested: new Date().toISOString().slice(0, 16),
    theatreCount: 'Correct',
    completed: false
  });

  // Checklist State
  const [checklist, setChecklist] = useState({
    signIn: { identity: false, siteMarked: false, anaesthesiaCheck: false, pulseOx: false, allergy: 'No' },
    timeOut: { teamIntro: false, patientConfirm: false, antibiotics: false, imaging: false },
    signOut: { procedureName: false, countComplete: false, specimensLabelled: false, equipmentIssues: false }
  });

  // Mock Data
  const [surgeries, setSurgeries] = useState<SurgeryRequest[]>([
    { 
      id: 1, 
      patientName: 'Jane Doe', 
      patientId: 'OP-2023-001',
      age: 24,
      gender: 'Female',
      procedure: 'Appendectomy', 
      surgeon: 'Dr. James Wilson', 
      dateScheduled: '2023-10-24 08:00', 
      status: 'In Progress',
      theatre: 'OR-1'
    },
    { 
      id: 2, 
      patientName: 'John Smith', 
      patientId: 'OP-2023-042',
      age: 45,
      gender: 'Male',
      procedure: 'Hernia Repair', 
      surgeon: 'Dr. Sarah Jane', 
      dateScheduled: '2023-10-24 10:30', 
      status: 'Scheduled',
      theatre: 'OR-2'
    },
  ]);

  const handleProcess = (surgery: SurgeryRequest) => {
    // Set Context
    const names = surgery.patientName.split(' ');
    setActivePatient({
        id: surgery.patientId,
        surname: names[0] || 'Unknown',
        othernames: names.slice(1).join(' '),
        age: surgery.age,
        gender: surgery.gender,
        scheme: 'Cash',
        outpatientNo: surgery.patientId,
        telephone: '000-000-0000',
        status: 'Admitted'
    });
    
    // Pre-fill form if needed
    setOpNotes(prev => ({ ...prev, operation: surgery.procedure, surgeon: surgery.surgeon }));
    setActiveTab('checklist'); // Start at checklist workflow usually
  };

  return (
    <div className="animate-bottom space-y-6">
      {/* Top Bar: Radiology Style */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xl shadow-sm shrink-0">
               <i className="fa fa-procedures"></i>
            </div>
            {activePatient ? (
                <div>
                   <h4 className="text-sm font-bold text-gray-800 uppercase">{activePatient.surname}, {activePatient.othernames}</h4>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{activePatient.outpatientNo} • {activePatient.age} Yrs • {activePatient.scheme}</p>
                </div>
            ) : (
                <div className="flex-1">
                    <input type="text" className="w-full md:w-64 p-2 bg-gray-50 border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-teal-500" placeholder="Search Patient (Name/ID)..." />
                </div>
            )}
         </div>
         
         <div className="flex items-center space-x-2">
             {activePatient && (
                <div className="bg-blue-50 px-3 py-1 rounded text-[10px] font-bold text-blue-600 border border-blue-100 flex items-center hidden md:flex">
                   <i className="fa fa-info-circle mr-1"></i> Admitted - General Ward
                </div>
             )}
             
             {/* ACTIONS DROPDOWN */}
             <div className="relative group">
                <button className="bg-[#5bc0de] text-white px-4 py-2 rounded text-[10px] font-bold uppercase shadow hover:bg-[#31b0d5] transition flex items-center tracking-widest">
                   Actions <i className="fa fa-caret-down ml-2"></i>
                </button>
                <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded shadow-xl hidden group-hover:block z-50 py-1 text-[11px] font-bold text-gray-600">
                   <button className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-50">Theatre List</button>
                   <button onClick={() => setShowQueueModal(true)} className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-50 text-blue-600">Queue Patient</button>
                   <button className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-50">Pre-Op Checklist</button>
                   <button className="w-full text-left px-4 py-2 hover:bg-gray-50">Post-Op Orders</button>
                </div>
             </div>

             {activePatient && (
                <button onClick={() => setShowBookModal(true)} className="bg-teal-600 text-white px-4 py-2 rounded text-[10px] font-bold uppercase shadow hover:bg-teal-700 transition flex items-center tracking-widest">
                    <i className="fa fa-plus-circle mr-2"></i> Book Surgery
                </button>
             )}
         </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden min-h-[600px] flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50 overflow-x-auto">
           {[
             { id: 'schedule', label: 'Surgery Schedule', count: surgeries.filter(s => s.status !== 'Completed').length },
             { id: 'checklist', label: 'Operative Checklist', count: 0 },
             { id: 'notes', label: 'Operation Notes', count: 0 },
             { id: 'history', label: 'History', count: 0 }
           ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap flex items-center ${
                   activeTab === tab.id 
                   ? 'border-teal-600 text-teal-600 bg-white' 
                   : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                 {tab.label}
                 {tab.count > 0 && <span className="ml-2 bg-teal-100 text-teal-600 px-1.5 py-0.5 rounded-full text-[9px]">{tab.count}</span>}
              </button>
           ))}
        </div>

        <div className="p-6 flex-1 bg-gray-50/30">
           
           {/* SCHEDULE TAB */}
           {activeTab === 'schedule' && (
              <div className="animate-in fade-in space-y-4">
                 <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
                    <table className="w-full text-left text-[11px]">
                       <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 uppercase font-black tracking-tight">
                          <tr>
                             <th className="px-4 py-3">Time</th>
                             <th className="px-4 py-3">Patient</th>
                             <th className="px-4 py-3">Procedure</th>
                             <th className="px-4 py-3">Surgeon</th>
                             <th className="px-4 py-3">Theatre</th>
                             <th className="px-4 py-3">Status</th>
                             <th className="px-4 py-3 text-right">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 text-gray-600">
                          {surgeries.map(s => (
                             <tr key={s.id} className="hover:bg-teal-50 transition-colors cursor-pointer" onClick={() => handleProcess(s)}>
                                <td className="px-4 py-3 font-bold">{s.dateScheduled.split(' ')[1]}</td>
                                <td className="px-4 py-3">
                                   <div className="font-bold text-gray-800 uppercase">{s.patientName}</div>
                                   <div className="text-[9px] text-gray-400">{s.patientId}</div>
                                </td>
                                <td className="px-4 py-3 font-bold text-teal-600">{s.procedure}</td>
                                <td className="px-4 py-3">{s.surgeon}</td>
                                <td className="px-4 py-3">{s.theatre}</td>
                                <td className="px-4 py-3">
                                   <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${s.status === 'In Progress' ? 'bg-green-100 text-green-600 animate-pulse' : 'bg-gray-100'}`}>
                                      {s.status}
                                   </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                   <button className="text-blue-600 font-bold hover:underline" onClick={(e) => { e.stopPropagation(); handleProcess(s); }}>Open</button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           )}

           {/* OPERATIVE CHECKLIST TAB */}
           {activeTab === 'checklist' && activePatient && (
              <div className="animate-in fade-in space-y-6">
                 <div className="bg-white border border-gray-200 rounded shadow-sm">
                    <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                       <h5 className="text-sm font-bold text-gray-700">WHO Surgical Safety Checklist</h5>
                       <button onClick={() => setActiveTab('notes')} className="bg-blue-600 text-white px-4 py-1.5 text-[10px] font-bold uppercase rounded shadow">Next: Op Notes</button>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                       {/* Sign In */}
                       <div className="border-r border-gray-100 pr-6 space-y-4">
                          <h6 className="text-xs font-black text-teal-600 uppercase tracking-widest border-b border-gray-100 pb-2">Sign In (Before Induction)</h6>
                          <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="rounded text-teal-600" checked={checklist.signIn.identity} onChange={() => setChecklist({...checklist, signIn: {...checklist.signIn, identity: !checklist.signIn.identity}})} />
                             <span className="text-[11px] font-medium text-gray-700">Patient has confirmed identity, site, procedure & consent</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="rounded text-teal-600" checked={checklist.signIn.siteMarked} onChange={() => setChecklist({...checklist, signIn: {...checklist.signIn, siteMarked: !checklist.signIn.siteMarked}})} />
                             <span className="text-[11px] font-medium text-gray-700">Site marked</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="rounded text-teal-600" checked={checklist.signIn.anaesthesiaCheck} onChange={() => setChecklist({...checklist, signIn: {...checklist.signIn, anaesthesiaCheck: !checklist.signIn.anaesthesiaCheck}})} />
                             <span className="text-[11px] font-medium text-gray-700">Anaesthesia safety check completed</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="rounded text-teal-600" checked={checklist.signIn.pulseOx} onChange={() => setChecklist({...checklist, signIn: {...checklist.signIn, pulseOx: !checklist.signIn.pulseOx}})} />
                             <span className="text-[11px] font-medium text-gray-700">Pulse oximeter on patient & functioning</span>
                          </label>
                          <div>
                             <span className="text-[11px] font-bold text-gray-700 block mb-1">Does patient have known allergy?</span>
                             <select className="w-full p-1 border rounded text-xs bg-gray-50">
                                <option>No</option>
                                <option>Yes</option>
                             </select>
                          </div>
                       </div>

                       {/* Time Out */}
                       <div className="border-r border-gray-100 pr-6 space-y-4">
                          <h6 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b border-gray-100 pb-2">Time Out (Before Incision)</h6>
                          <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="rounded text-blue-600" checked={checklist.timeOut.teamIntro} onChange={() => setChecklist({...checklist, timeOut: {...checklist.timeOut, teamIntro: !checklist.timeOut.teamIntro}})} />
                             <span className="text-[11px] font-medium text-gray-700">All team members have introduced themselves by name & role</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="rounded text-blue-600" checked={checklist.timeOut.patientConfirm} onChange={() => setChecklist({...checklist, timeOut: {...checklist.timeOut, patientConfirm: !checklist.timeOut.patientConfirm}})} />
                             <span className="text-[11px] font-medium text-gray-700">Surgeon, Anaesthetist & Nurse confirm patient, site & procedure</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="rounded text-blue-600" checked={checklist.timeOut.antibiotics} onChange={() => setChecklist({...checklist, timeOut: {...checklist.timeOut, antibiotics: !checklist.timeOut.antibiotics}})} />
                             <span className="text-[11px] font-medium text-gray-700">Antibiotic prophylaxis given within last 60 mins</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="rounded text-blue-600" checked={checklist.timeOut.imaging} onChange={() => setChecklist({...checklist, timeOut: {...checklist.timeOut, imaging: !checklist.timeOut.imaging}})} />
                             <span className="text-[11px] font-medium text-gray-700">Essential imaging displayed</span>
                          </label>
                       </div>

                       {/* Sign Out */}
                       <div className="space-y-4">
                          <h6 className="text-xs font-black text-green-600 uppercase tracking-widest border-b border-gray-100 pb-2">Sign Out (Before Leaving OR)</h6>
                          <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="rounded text-green-600" checked={checklist.signOut.procedureName} onChange={() => setChecklist({...checklist, signOut: {...checklist.signOut, procedureName: !checklist.signOut.procedureName}})} />
                             <span className="text-[11px] font-medium text-gray-700">Nurse verbally confirms name of procedure recorded</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="rounded text-green-600" checked={checklist.signOut.countComplete} onChange={() => setChecklist({...checklist, signOut: {...checklist.signOut, countComplete: !checklist.signOut.countComplete}})} />
                             <span className="text-[11px] font-medium text-gray-700">Instrument, sponge & needle counts are correct</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="rounded text-green-600" checked={checklist.signOut.specimensLabelled} onChange={() => setChecklist({...checklist, signOut: {...checklist.signOut, specimensLabelled: !checklist.signOut.specimensLabelled}})} />
                             <span className="text-[11px] font-medium text-gray-700">Specimen labelling is correct (Patient Name included)</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                             <input type="checkbox" className="rounded text-green-600" checked={checklist.signOut.equipmentIssues} onChange={() => setChecklist({...checklist, signOut: {...checklist.signOut, equipmentIssues: !checklist.signOut.equipmentIssues}})} />
                             <span className="text-[11px] font-medium text-gray-700">Equipment problems addressed</span>
                          </label>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {/* OPERATION NOTES TAB (Snapshot Implementation) */}
           {activeTab === 'notes' && activePatient && (
              <div className="animate-in fade-in space-y-6">
                 
                 {/* Patient Details Header */}
                 <div className="bg-blue-50 border border-blue-100 rounded p-4">
                    <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => setIsDetailsRevealed(!isDetailsRevealed)}>
                       <h5 className="text-sm font-bold text-gray-700">Patients Details <span className="text-blue-600 font-black ml-1">{isDetailsRevealed ? 'Hide' : 'Reveal'}</span></h5>
                    </div>
                    {isDetailsRevealed && (
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-8 text-xs text-gray-600">
                          <div className="flex justify-between border-b border-blue-200 pb-1">
                             <span className="font-bold">Surname:</span> 
                             <span className="text-blue-800 font-bold uppercase">{activePatient.surname}</span>
                          </div>
                          <div className="flex justify-between border-b border-blue-200 pb-1">
                             <span className="font-bold">Other Names:</span> 
                             <span className="text-blue-800 font-bold uppercase">{activePatient.othernames}</span>
                          </div>
                          <div className="flex justify-between border-b border-blue-200 pb-1">
                             <span className="font-bold">Occupation:</span> 
                             <span className="text-blue-800">{activePatient.occupation || '-'}</span>
                          </div>
                          <div className="flex justify-between border-b border-blue-200 pb-1">
                             <span className="font-bold">Age:</span> 
                             <span className="text-blue-800">{activePatient.age} (yrs)</span>
                          </div>
                          <div className="flex justify-between border-b border-blue-200 pb-1">
                             <span className="font-bold">Sex:</span> 
                             <span className="text-blue-800">{activePatient.gender}</span>
                          </div>
                          <div className="flex justify-between border-b border-blue-200 pb-1">
                             <span className="font-bold">Requested On:</span> 
                             <span className="text-blue-800">24-Oct-2023</span>
                          </div>
                       </div>
                    )}
                 </div>

                 {/* Main Operation Form - Matches Snapshot Layout */}
                 <div className="bg-white border border-gray-200 rounded shadow-sm">
                    <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                       <h5 className="text-sm font-bold text-gray-700">Operation Notes</h5>
                       
                       <div className="relative group">
                          <button className="bg-[#5bc0de] text-white px-3 py-1 text-[10px] font-bold rounded shadow hover:bg-[#31b0d5] transition flex items-center uppercase tracking-widest">
                             Actions <i className="fa fa-caret-down ml-2"></i>
                          </button>
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded shadow-xl hidden group-hover:block z-50 py-1 text-[11px] text-gray-700">
                             <button className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-50">Operative Checklist</button>
                             <button className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-50">Prescription</button>
                             <button className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-50">Billing</button>
                             <button className="w-full text-left px-4 py-2 hover:bg-gray-50">Procedure Report</button>
                          </div>
                       </div>
                    </div>

                    <div className="p-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          
                          {/* Column 1 */}
                          <div className="space-y-4">
                             <div>
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Operation <span className="text-red-500">*</span></label>
                                <select 
                                   className="w-full p-2 bg-gray-50 border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-teal-500"
                                   value={opNotes.operation}
                                   onChange={(e) => setOpNotes({...opNotes, operation: e.target.value})}
                                >
                                   <option value="">Select Operation...</option>
                                   <option>Appendectomy</option>
                                   <option>Caesarean Section</option>
                                   <option>Herniorrhaphy</option>
                                   <option>Laparotomy</option>
                                </select>
                             </div>
                             <div>
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Surgeon</label>
                                <input 
                                   type="text" 
                                   className="w-full p-2 bg-white border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-teal-500"
                                   value={opNotes.surgeon}
                                   onChange={(e) => setOpNotes({...opNotes, surgeon: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Assistance (Surgeon)</label>
                                <input 
                                   type="text" 
                                   className="w-full p-2 bg-white border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-teal-500"
                                   value={opNotes.assistant}
                                   onChange={(e) => setOpNotes({...opNotes, assistant: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Anaesthetist</label>
                                <input 
                                   type="text" 
                                   className="w-full p-2 bg-white border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-teal-500"
                                   value={opNotes.anaesthetist}
                                   onChange={(e) => setOpNotes({...opNotes, anaesthetist: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Anaesthesia</label>
                                <input 
                                   type="text" 
                                   className="w-full p-2 bg-white border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-teal-500"
                                   value={opNotes.anaesthesia}
                                   onChange={(e) => setOpNotes({...opNotes, anaesthesia: e.target.value})}
                                />
                             </div>
                          </div>

                          {/* Column 2 */}
                          <div className="space-y-4">
                             <div>
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Scrub Nurse</label>
                                <input 
                                   type="text" 
                                   className="w-full p-2 bg-white border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-teal-500"
                                   value={opNotes.scrubNurse}
                                   onChange={(e) => setOpNotes({...opNotes, scrubNurse: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Diagnosis</label>
                                <input 
                                   type="text" 
                                   className="w-full p-2 bg-white border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-teal-500"
                                   value={opNotes.diagnosis}
                                   onChange={(e) => setOpNotes({...opNotes, diagnosis: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Incision</label>
                                <input 
                                   type="text" 
                                   className="w-full p-2 bg-white border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-teal-500"
                                   value={opNotes.incision}
                                   onChange={(e) => setOpNotes({...opNotes, incision: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Biopsy Specimens</label>
                                <input 
                                   type="text" 
                                   className="w-full p-2 bg-white border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-teal-500"
                                   value={opNotes.biopsy}
                                   onChange={(e) => setOpNotes({...opNotes, biopsy: e.target.value})}
                                />
                             </div>
                          </div>

                          {/* Column 3 (Wider - Procedure & Complications) */}
                          <div className="space-y-4 flex flex-col">
                             <div className="flex-1 flex flex-col">
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Procedure</label>
                                <textarea 
                                   className="w-full p-3 bg-white border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-teal-500 resize-none flex-1 min-h-[150px]"
                                   value={opNotes.procedure}
                                   onChange={(e) => setOpNotes({...opNotes, procedure: e.target.value})}
                                ></textarea>
                             </div>
                             <div className="h-24">
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Complications</label>
                                <textarea 
                                   className="w-full p-3 bg-white border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-teal-500 resize-none h-full"
                                   value={opNotes.complications}
                                   onChange={(e) => setOpNotes({...opNotes, complications: e.target.value})}
                                ></textarea>
                             </div>
                          </div>

                          {/* Column 4 (Right Side Fields) */}
                          <div className="space-y-4">
                             <div>
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Estimated Blood Loss</label>
                                <input 
                                   type="text" 
                                   className="w-full p-2 bg-white border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-teal-500"
                                   value={opNotes.estimatedBloodLoss}
                                   onChange={(e) => setOpNotes({...opNotes, estimatedBloodLoss: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Doctor</label>
                                <input 
                                   type="text" 
                                   className="w-full p-2 bg-white border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-teal-500"
                                   value={opNotes.doctor}
                                   onChange={(e) => setOpNotes({...opNotes, doctor: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Date Time Requested</label>
                                <input 
                                   type="datetime-local" 
                                   className="w-full p-2 bg-gray-50 border border-gray-300 rounded text-xs outline-none text-green-600 font-bold"
                                   value={opNotes.dateTimeRequested}
                                   onChange={(e) => setOpNotes({...opNotes, dateTimeRequested: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="block text-[11px] font-bold text-gray-600 mb-1">Theatre Count</label>
                                <select 
                                   className="w-full p-2 bg-white border border-gray-300 rounded text-xs outline-none text-green-600 font-bold"
                                   value={opNotes.theatreCount}
                                   onChange={(e) => setOpNotes({...opNotes, theatreCount: e.target.value})}
                                >
                                   <option>Correct</option>
                                   <option>Incorrect</option>
                                </select>
                             </div>
                             <div className="flex items-center space-x-2 pt-2">
                                <input 
                                   type="checkbox" 
                                   id="opCompleted" 
                                   className="rounded" 
                                   checked={opNotes.completed}
                                   onChange={(e) => setOpNotes({...opNotes, completed: e.target.checked})}
                                />
                                <label htmlFor="opCompleted" className="text-[11px] font-bold text-gray-600">Operation Completed</label>
                             </div>
                             <div className="flex justify-end pt-4">
                                <button className="bg-[#337ab7] text-white px-6 py-2 rounded text-[11px] font-bold shadow hover:bg-blue-700 transition">Save</button>
                             </div>
                          </div>

                       </div>
                    </div>
                 </div>
              </div>
           )}

           {activeTab !== 'schedule' && !activePatient && (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-400">
                 <i className="fa fa-user-slash text-5xl mb-4 opacity-20"></i>
                 <p className="text-sm font-bold uppercase tracking-widest">Select a patient from the schedule to view/edit details</p>
              </div>
           )}

           {activeTab === 'history' && (
              <div className="text-center py-12 text-gray-400 italic">No surgery history found.</div>
           )}
        </div>
      </div>

      {/* Book Surgery Modal */}
      {showBookModal && (
         <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="p-4 border-b border-gray-100 bg-[#f5f5f5] flex justify-between items-center">
                  <h5 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">Book Surgery</h5>
                  <button onClick={() => setShowBookModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa fa-times"></i></button>
               </div>
               <div className="p-6 space-y-4">
                  <div>
                     <label className="block text-[11px] font-bold text-gray-600 mb-1">Patient</label>
                     <input type="text" className="w-full p-2 border border-gray-300 rounded text-xs outline-none bg-gray-50" defaultValue={activePatient ? `${activePatient.surname} ${activePatient.othernames}` : ''} placeholder="Search patient..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Procedure</label>
                        <select className="w-full p-2 border border-gray-300 rounded text-xs outline-none">
                           <option>Select...</option>
                           <option>Appendectomy</option>
                           <option>C-Section</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Theatre</label>
                        <select className="w-full p-2 border border-gray-300 rounded text-xs outline-none">
                           <option>OR-1</option>
                           <option>OR-2</option>
                        </select>
                     </div>
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold text-gray-600 mb-1">Surgeon</label>
                     <input type="text" className="w-full p-2 border border-gray-300 rounded text-xs outline-none" />
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold text-gray-600 mb-1">Date Time</label>
                     <input type="datetime-local" className="w-full p-2 border border-gray-300 rounded text-xs outline-none" />
                  </div>
                  <div className="flex justify-end pt-2">
                     <button onClick={() => setShowBookModal(false)} className="bg-teal-600 text-white px-6 py-2 rounded text-xs font-bold uppercase shadow hover:bg-teal-700 transition">Book Slot</button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Queue Modal */}
      <QueueModal 
        isOpen={showQueueModal} 
        onClose={() => setShowQueueModal(false)}
        patientName={activePatient ? `${activePatient.surname} ${activePatient.othernames}` : ''}
        patientId={activePatient?.outpatientNo}
      />
    </div>
  );
};

export default Theatre;