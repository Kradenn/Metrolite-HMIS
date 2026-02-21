
import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { useHospital } from '../../context/HospitalContext';
import QueueModal from '../../components/QueueModal';

interface RadiologyRequest {
  id: number;
  patientName: string;
  patientId: string;
  age: number;
  gender: string;
  scheme: string;
  examName: string;
  orderedBy: string;
  dateOrdered: string;
  urgency: 'Routine' | 'Urgent' | 'Stat';
  status: 'Pending' | 'In Progress' | 'Preliminary' | 'Finalized';
  note?: string;
  clinicalHistory?: string;
}

const Radiology: React.FC = () => {
  const { activePatient, setActivePatient } = usePatient();
  const { hospitalName } = useHospital();
  const [activeTab, setActiveTab] = useState('requests');
  
  // Modal States
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [showRequestsListModal, setShowRequestsListModal] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState<RadiologyRequest | null>(null);
  const [isPartiallyDone, setIsPartiallyDone] = useState(false);

  // Form States for Examination
  const [history, setHistory] = useState('');
  const [technique, setTechnique] = useState('');
  const [findings, setFindings] = useState('');
  const [impression, setImpression] = useState('');
  const [comment, setComment] = useState('');
  const [examiner, setExaminer] = useState('');
  const [radiologist, setRadiologist] = useState('');

  // Mock Data
  const [requests, setRequests] = useState<RadiologyRequest[]>([
    { 
      id: 1, 
      patientName: 'Jane Doe',
      patientId: 'OP-2023-001',
      age: 24,
      gender: 'Female',
      scheme: 'Cash',
      examName: 'CXR (Chest X-Ray) PA View', 
      orderedBy: 'Dr. James Wilson', 
      dateOrdered: '2023-10-24 09:00', 
      urgency: 'Routine', 
      status: 'Pending',
      note: 'Rule out pneumonia',
      clinicalHistory: 'Cough for 3 days, fever'
    },
    { 
      id: 2, 
      patientName: 'John Smith',
      patientId: 'OP-2023-042',
      age: 45,
      gender: 'Male',
      scheme: 'Jubilee Insurance',
      examName: 'Ultrasound Abdomen', 
      orderedBy: 'Dr. Sarah Jane', 
      dateOrdered: '2023-10-24 09:15', 
      urgency: 'Urgent', 
      status: 'In Progress',
      note: 'Right upper quadrant pain'
    },
    { 
      id: 3, 
      patientName: 'Baby Ryan',
      patientId: 'OP-2023-100',
      age: 2,
      gender: 'Male',
      scheme: 'NHIF',
      examName: 'X-Ray Left Leg', 
      orderedBy: 'Triage Nurse', 
      dateOrdered: '2023-10-23 16:00', 
      urgency: 'Stat', 
      status: 'Finalized',
      note: 'Fall injury'
    }
  ]);

  const handleProcess = (req: RadiologyRequest) => {
    // 1. Pick Patient Context
    const names = req.patientName.split(' ');
    setActivePatient({
        id: req.patientId,
        surname: names[0] || 'Unknown',
        othernames: names.slice(1).join(' '),
        age: req.age,
        gender: req.gender,
        scheme: req.scheme,
        outpatientNo: req.patientId,
        telephone: '000-000-0000',
        status: 'Queue'
    });

    // 2. Set Selected Request
    setSelectedRequest(req);
    setHistory(req.clinicalHistory || '');
    
    // 3. Open appropriate modal
    if (req.status === 'Pending') {
       // Move to In Progress and open exam
       updateRequestStatus(req.id, 'In Progress');
       setShowExamModal(true);
    } else if (req.status === 'In Progress' || req.status === 'Preliminary') {
       setShowExamModal(true);
    } else if (req.status === 'Finalized') {
       setShowReportPreview(true);
    }
  };

  const updateRequestStatus = (id: number, status: any) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleSaveExam = () => {
     if (selectedRequest) {
        if (isPartiallyDone) {
           updateRequestStatus(selectedRequest.id, 'Preliminary');
        } else {
           updateRequestStatus(selectedRequest.id, 'Finalized');
        }
        setShowExamModal(false);
        setActiveTab(isPartiallyDone ? 'results' : 'history');
     }
  };

  const inputStyle = "w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all shadow-inner";
  const labelStyle = "block text-[9px] font-black text-slate-500 uppercase mb-1.5 tracking-widest";

  return (
    <div className="animate-bottom space-y-6">
      {/* Top Bar: Patient & Actions Dropdown */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xl shadow-sm shrink-0">
               <i className="fa fa-x-ray"></i>
            </div>
            {activePatient ? (
                <div>
                   <h4 className="text-sm font-bold text-gray-800 uppercase">{activePatient.surname}, {activePatient.othernames}</h4>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{activePatient.outpatientNo} • {activePatient.age} Yrs • {activePatient.scheme}</p>
                </div>
            ) : (
                <div className="flex-1 relative">
                    <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                    <input type="text" className="w-full md:w-64 p-2 pl-8 bg-gray-50 border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-teal-500" placeholder="Search Patient (Name/ID)..." />
                </div>
            )}
         </div>
         
         <div className="flex items-center space-x-2">
             {activePatient && (
                <div className="bg-blue-50 px-3 py-1 rounded text-[10px] font-bold text-blue-600 border border-blue-100 flex items-center hidden md:flex">
                   <i className="fa fa-info-circle mr-1"></i> {activePatient.diagnosis || 'Diagnosis Pending'}
                </div>
             )}
             
             {/* ACTIONS DROPDOWN */}
             <div className="relative group">
                <button className="bg-[#5bc0de] text-white px-4 py-2 rounded text-[10px] font-bold uppercase shadow hover:bg-[#31b0d5] transition flex items-center tracking-widest">
                   Actions <i className="fa fa-caret-down ml-2"></i>
                </button>
                <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded shadow-xl hidden group-hover:block z-50 py-1 text-[11px] font-bold text-gray-600">
                   <button onClick={() => setShowRequestModal(true)} className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-50 text-green-600">Create Radiology Request</button>
                   <button onClick={() => setShowRequestsListModal(true)} className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-50">View Radiology Requests</button>
                   <button onClick={() => setShowImageModal(true)} className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-50">View Images</button>
                   <button onClick={() => setShowQueueModal(true)} className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-50 text-blue-600">Queue Patient</button>
                   <button className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-50">Files</button>
                   <div className="border-t border-gray-100 my-1"></div>
                   <button onClick={() => setShowReportPreview(true)} className="w-full text-left px-4 py-2 hover:bg-gray-50">Examination Report</button>
                </div>
             </div>

             {activePatient && (
                <button onClick={() => setShowRequestModal(true)} className="bg-teal-600 text-white px-4 py-2 rounded text-[10px] font-bold uppercase shadow hover:bg-teal-700 transition flex items-center tracking-widest">
                    <i className="fa fa-plus-circle mr-2"></i> New Request
                </button>
             )}
         </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden min-h-[600px] flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50 overflow-x-auto">
           {[
             { id: 'requests', label: 'Requests', count: requests.filter(t => t.status === 'Pending').length },
             { id: 'results', label: 'Examination / Results', count: requests.filter(t => t.status === 'In Progress' || t.status === 'Preliminary').length },
             { id: 'history', label: 'History', count: requests.filter(t => t.status === 'Finalized').length }
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
           {/* Requests / Worklist Tab */}
           {activeTab === 'requests' && (
              <div className="animate-in fade-in space-y-4">
                 <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
                    <table className="w-full text-left text-[11px]">
                       <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 uppercase font-black tracking-tight">
                          <tr>
                             <th className="px-4 py-3">Patient</th>
                             <th className="px-4 py-3">Examination</th>
                             <th className="px-4 py-3">Ordered By</th>
                             <th className="px-4 py-3">Date Time</th>
                             <th className="px-4 py-3">Scheme/Note</th>
                             <th className="px-4 py-3">Urgency</th>
                             <th className="px-4 py-3 text-right">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 text-gray-600">
                          {requests.filter(t => t.status === 'Pending').map(t => (
                             <tr key={t.id} className="hover:bg-teal-50 transition-colors cursor-pointer" onClick={() => handleProcess(t)}>
                                <td className="px-4 py-3">
                                   <div className="font-bold text-gray-800 uppercase">{t.patientName}</div>
                                   <div className="text-[9px] text-gray-400">{t.patientId}</div>
                                </td>
                                <td className="px-4 py-3 font-bold text-teal-600">{t.examName}</td>
                                <td className="px-4 py-3">{t.orderedBy}</td>
                                <td className="px-4 py-3">{t.dateOrdered}</td>
                                <td className="px-4 py-3">
                                   <span className="block font-bold text-gray-700">{t.scheme}</span>
                                   {t.note && <span className="text-[9px] text-orange-500 italic"><i className="fa fa-sticky-note mr-1"></i>{t.note}</span>}
                                </td>
                                <td className="px-4 py-3">
                                   <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${t.urgency === 'Urgent' || t.urgency === 'Stat' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{t.urgency}</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                   <button 
                                      onClick={(e) => { e.stopPropagation(); handleProcess(t); }} 
                                      className="bg-white border border-teal-200 text-teal-600 px-3 py-1 rounded text-[9px] font-bold uppercase hover:bg-teal-600 hover:text-white transition"
                                   >
                                      Start Exam
                                   </button>
                                </td>
                             </tr>
                          ))}
                          {requests.filter(t => t.status === 'Pending').length === 0 && (
                             <tr><td colSpan={7} className="px-4 py-8 text-center italic text-gray-400">No pending requests</td></tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
           )}

           {/* Results / Examination Tab */}
           {activeTab === 'results' && (
              <div className="animate-in fade-in space-y-4">
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 border-r border-gray-200 pr-6 space-y-4">
                       <h6 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">In Progress / Preliminary</h6>
                       <div className="space-y-2">
                          {requests.filter(t => t.status === 'In Progress' || t.status === 'Preliminary').map(t => (
                             <div 
                                key={t.id} 
                                onClick={() => handleProcess(t)}
                                className={`p-3 rounded border cursor-pointer transition-all ${selectedRequest?.id === t.id ? 'bg-teal-50 border-teal-200 shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                             >
                                <div className="flex justify-between items-start">
                                   <h6 className="text-xs font-bold text-gray-800">{t.examName}</h6>
                                   {t.status === 'Preliminary' && <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-bold">Draft</span>}
                                </div>
                                <p className="text-[10px] font-bold text-teal-600 mt-1 uppercase">{t.patientName} ({t.patientId})</p>
                                <p className="text-[9px] text-gray-400 mt-0.5 italic">{t.scheme}</p>
                             </div>
                          ))}
                       </div>
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-center items-center text-gray-400">
                       <i className="fa fa-x-ray text-4xl mb-3 opacity-30"></i>
                       <p className="text-xs font-bold uppercase">Select an exam to enter findings</p>
                    </div>
                 </div>
              </div>
           )}

           {activeTab === 'history' && (
              <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
                 <table className="w-full text-left text-[11px]">
                    <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 uppercase font-black tracking-tight">
                       <tr>
                          <th className="px-4 py-3">Patient</th>
                          <th className="px-4 py-3">Examination</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600">
                       {requests.filter(t => t.status === 'Finalized').map(t => (
                          <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                             <td className="px-4 py-3 font-bold">{t.patientName}</td>
                             <td className="px-4 py-3">{t.examName}</td>
                             <td className="px-4 py-3">{t.dateOrdered}</td>
                             <td className="px-4 py-3"><span className="text-green-600 font-bold">Finalized</span></td>
                             <td className="px-4 py-3 text-right"><button onClick={() => setShowReportPreview(true)} className="text-blue-600 hover:underline font-bold">View Report</button></td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           )}
        </div>
      </div>

      {/* --- MODALS --- */}

      {/* Examination Reporting Modal - UPDATED DESIGN */}
      {showExamModal && selectedRequest && (
         <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="p-6 bg-slate-900 text-white flex justify-between items-start shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><i className="fa fa-microscope text-9xl transform -rotate-12"></i></div>
                    <div className="relative z-10">
                        <h3 className="text-xl font-black uppercase tracking-tight">Radiology Report</h3>
                        <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest mt-1">{selectedRequest.examName} • {selectedRequest.patientName}</p>
                    </div>
                    <button onClick={() => setShowExamModal(false)} className="text-white/50 hover:text-white transition-colors relative z-10"><i className="fa fa-times text-2xl"></i></button>
               </div>
               
               <div className="p-8 overflow-y-auto flex-1 bg-slate-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                     <div className="space-y-4">
                        <div>
                            <label className={labelStyle}>Clinical History</label>
                            <textarea 
                               className={`${inputStyle} h-24 resize-none`}
                               value={history}
                               onChange={(e) => setHistory(e.target.value)}
                               placeholder="Enter patient history..."
                            ></textarea>
                        </div>
                        <div>
                            <label className={labelStyle}>Technique / Procedure</label>
                            <textarea 
                               className={`${inputStyle} h-24 resize-none`}
                               value={technique}
                               onChange={(e) => setTechnique(e.target.value)}
                               placeholder="Describe technique used..."
                            ></textarea>
                        </div>
                     </div>
                     
                     <div className="space-y-4">
                        <div>
                            <label className={labelStyle}>Examiner (Technologist)</label>
                            <input 
                               type="text" 
                               className={inputStyle}
                               value={examiner}
                               onChange={(e) => setExaminer(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelStyle}>Radiologist</label>
                            <input 
                               type="text" 
                               className={inputStyle}
                               value={radiologist}
                               onChange={(e) => setRadiologist(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className={labelStyle}>Date Time Requested</label>
                            <p className="text-xs font-black text-slate-700 bg-white p-3 border border-slate-300 rounded-xl">{selectedRequest.dateOrdered}</p>
                        </div>
                     </div>

                     <div className="md:col-span-2 space-y-4">
                        <div>
                            <label className={labelStyle}>Findings</label>
                            <textarea 
                               className={`${inputStyle} h-40 resize-none font-medium`}
                               value={findings}
                               onChange={(e) => setFindings(e.target.value)}
                               placeholder="Enter detailed findings..."
                            ></textarea>
                        </div>
                        <div>
                            <label className={labelStyle}>Impression / Conclusion</label>
                            <textarea 
                               className={`${inputStyle} h-24 resize-none`}
                               value={impression}
                               onChange={(e) => setImpression(e.target.value)}
                               placeholder="Summary impression..."
                            ></textarea>
                        </div>
                        <div>
                            <label className={labelStyle}>Comment / Recommendation</label>
                            <textarea 
                               className={`${inputStyle} h-24 resize-none`}
                               value={comment}
                               onChange={(e) => setComment(e.target.value)}
                               placeholder="Additional comments..."
                            ></textarea>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-6 border-t border-slate-200 bg-white flex justify-between items-center z-10">
                  <div className="flex items-center space-x-4">
                     <div className="flex items-center space-x-2 cursor-pointer">
                        <input 
                           type="checkbox" 
                           id="partialCheck" 
                           className="rounded text-teal-600 focus:ring-teal-500"
                           checked={isPartiallyDone}
                           onChange={(e) => setIsPartiallyDone(e.target.checked)}
                        />
                        <label htmlFor="partialCheck" className="text-[10px] font-bold text-slate-600 uppercase tracking-widest cursor-pointer">Mark as Draft</label>
                     </div>
                  </div>
                  <div className="flex space-x-3">
                     <button onClick={() => setShowExamModal(false)} className="px-6 py-2.5 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-200 transition">Cancel</button>
                     <button onClick={handleSaveExam} className="bg-teal-600 text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-xl shadow-teal-100 hover:bg-teal-700 transition transform active:scale-95">
                        {isPartiallyDone ? 'Save Draft' : 'Finalize & Sign'}
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* New Request Modal */}
      {showRequestModal && (
         <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="p-3 border-b border-gray-100 bg-[#f5f5f5] flex justify-between items-center">
                  <h5 className="text-sm font-bold text-gray-700">Create Radiology Request</h5>
                  <button onClick={() => setShowRequestModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa fa-times"></i></button>
               </div>
               <div className="p-6 space-y-4">
                  <div>
                     <label className="block text-[11px] font-bold text-gray-600 mb-1">Select Examination</label>
                     <select className="w-full p-2 border border-gray-300 rounded text-xs outline-none">
                        <option>Chest X-Ray</option>
                        <option>MRI Brain</option>
                        <option>CT Abdomen</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold text-gray-600 mb-1">Clinical Notes</label>
                     <textarea className="w-full p-2 border border-gray-300 rounded text-xs outline-none h-24 resize-none"></textarea>
                  </div>
                  <div className="flex justify-end pt-2">
                     <button className="bg-[#337ab7] text-white px-4 py-1.5 rounded text-xs shadow hover:bg-blue-600">Submit Request</button>
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

      {/* Report Preview Modal (Simple) */}
      {showReportPreview && (
         <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 h-[80vh] flex flex-col">
               <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h5 className="text-sm font-bold text-gray-800 uppercase tracking-tighter">Radiology Report Preview</h5>
                  <button onClick={() => setShowReportPreview(false)} className="text-gray-400 hover:text-gray-600 text-xl ml-2">×</button>
               </div>
               <div className="flex-1 bg-gray-200 p-8 overflow-y-auto flex justify-center">
                  <div className="bg-white shadow-lg w-full max-w-[21cm] min-h-[29.7cm] p-10 text-xs">
                     <div className="text-center mb-8 border-b pb-4">
                        <h1 className="text-xl font-bold text-gray-800 uppercase">{hospitalName}</h1>
                        <p className="text-gray-500">Radiology Department</p>
                     </div>
                     <p className="text-center text-gray-400 italic mt-20">--- Radiology Report Content ---</p>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* All Requests Modal */}
      {showRequestsListModal && (
         <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                  <h5 className="text-sm font-bold text-gray-800 uppercase tracking-tighter">All Radiology Requests</h5>
                  <button onClick={() => setShowRequestsListModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">×</button>
               </div>
               <div className="p-6">
                  <p className="text-center text-gray-400 italic">Full request list loaded here...</p>
               </div>
            </div>
         </div>
      )}

      {/* View Images Placeholder Modal */}
      {showImageModal && (
         <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
            <div className="bg-black rounded-lg shadow-2xl w-full max-w-5xl overflow-hidden animate-in zoom-in-95 duration-200 h-[80vh] flex flex-col">
               <div className="p-4 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
                  <h5 className="text-sm font-bold text-gray-200 uppercase tracking-tighter">PACS Viewer</h5>
                  <button onClick={() => setShowImageModal(false)} className="text-gray-400 hover:text-white text-lg">×</button>
               </div>
               <div className="flex-1 flex items-center justify-center text-gray-600">
                  <div className="text-center">
                     <i className="fa fa-images text-6xl mb-4 opacity-50"></i>
                     <p className="text-xs font-bold uppercase tracking-widest">No Images Loaded</p>
                  </div>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default Radiology;
