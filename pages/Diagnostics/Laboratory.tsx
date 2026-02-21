import React, { useState, useMemo } from 'react';
import { usePatient } from '../../context/PatientContext';
import { useHospital } from '../../context/HospitalContext';
import { useNotification } from '../../context/NotificationContext';
import QueueModal from '../../components/QueueModal';

interface LabTest {
  id: number;
  patientName: string;
  patientId: string;
  opNumber: string;
  testName: string;
  orderedBy: string;
  dateOrdered: string;
  urgency: 'Routine' | 'Urgent' | 'Stat';
  status: 'Pending' | 'Collected' | 'In Progress' | 'Verified';
  scheme: string;
  sampleId?: string;
}

const Laboratory: React.FC = () => {
  const { activePatient, setActivePatient } = usePatient();
  const { hospitalName } = useHospital();
  const { notify } = useNotification();
  const [activeTab, setActiveTab] = useState('queue');
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);

  const [labQueue] = useState<LabTest[]>([
    { id: 1, patientName: 'JANE DOE', patientId: 'P1', opNumber: 'OP-23-001', testName: 'Full Haemogram', orderedBy: 'Dr. Wilson', dateOrdered: '10:30 AM', urgency: 'Routine', status: 'Pending', scheme: 'CASH' },
    { id: 2, patientName: 'JOHN SMITH', patientId: 'P2', opNumber: 'OP-23-042', testName: 'Renal Profile (U&Es)', orderedBy: 'Dr. Sarah', dateOrdered: '11:15 AM', urgency: 'Urgent', status: 'In Progress', scheme: 'JUBILEE', sampleId: 'S-992' },
  ]);

  const handleSelect = (test: LabTest) => {
    const names = test.patientName.split(' ');
    setActivePatient({
        id: test.patientId,
        surname: names[1] || names[0],
        othernames: names[0],
        age: 30, gender: 'Female', scheme: test.scheme,
        outpatientNo: test.opNumber, telephone: '-', status: 'Queue'
    });
    setSelectedTestId(test.id);
    setActiveTab('entry');
  };

  const selectedTest = useMemo(() => labQueue.find(t => t.id === selectedTestId), [selectedTestId, labQueue]);

  return (
    <div className="animate-bottom flex flex-col h-[calc(100vh-140px)] -m-4 md:-m-6 bg-slate-50 overflow-hidden font-helvetica">
      {/* Header Bar */}
      <div className="bg-slate-900 h-16 shrink-0 flex items-center justify-between px-6 border-b border-white/5 z-20 shadow-xl">
        <div className="flex items-center space-x-6">
           <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg border border-white/10"><i className="fa fa-flask"></i></div>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-tighter leading-none">Diagnostic Laboratory</h2>
                <p className="text-[9px] text-purple-400 font-bold uppercase mt-1">Worklist & Result Analytics</p>
              </div>
           </div>
        </div>
        <div className="flex items-center gap-2">
            <button className="bg-white/5 hover:bg-white/10 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition border border-white/5">Machine Logs</button>
            <button onClick={() => setShowQueueModal(true)} className="bg-purple-600 text-white px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-purple-700 transition">Finalize Report</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Worklist Sidebar */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
               <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Worklist</h6>
               <span className="bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded-full font-black">{labQueue.length} Pending</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50 scrollbar-hide">
                {labQueue.map(t => (
                    <div key={t.id} onClick={() => handleSelect(t)} className={`p-5 cursor-pointer transition-all border-l-4 ${selectedTestId === t.id ? 'bg-purple-50 border-l-purple-600' : 'hover:bg-gray-50 border-l-transparent'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black text-purple-600">{t.dateOrdered}</span>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase border ${t.urgency === 'Urgent' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-500'}`}>{t.urgency}</span>
                        </div>
                        <h6 className="text-xs font-black text-slate-800 uppercase truncate">{t.patientName}</h6>
                        <p className="text-[10px] font-black text-purple-400 uppercase mt-1 tracking-tight truncate">{t.testName}</p>
                        <div className="flex justify-between mt-3 text-[9px] font-bold text-slate-400 uppercase">
                            <span>By: {t.orderedBy}</span>
                            <span className="italic">{t.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Main Entry Workspace */}
        <div className="flex-1 bg-white flex flex-col overflow-hidden">
            {selectedTest ? (
                <>
                   <div className="bg-slate-50 border-b border-slate-200 flex px-6 shrink-0">
                      {['queue', 'collection', 'entry', 'verify', 'history'].map(t => (
                        <button key={t} onClick={() => setActiveTab(t)} className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === t ? 'border-purple-600 text-purple-600 bg-white shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                           {t.replace('_', ' ')}
                        </button>
                      ))}
                   </div>

                   <div className="flex-1 overflow-y-auto p-10 bg-slate-50/20 scrollbar-hide">
                      <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
                          {/* Patient Summary Card */}
                          <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex items-center justify-between">
                              <div className="flex items-center space-x-6">
                                  <div className="w-16 h-16 rounded-[1.5rem] bg-purple-100 text-purple-600 flex items-center justify-center text-3xl font-black shadow-inner">
                                    {selectedTest.patientName[0]}
                                  </div>
                                  <div>
                                     <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight leading-none">{selectedTest.patientName}</h3>
                                     <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">{selectedTest.opNumber} &bull; {selectedTest.scheme}</p>
                                  </div>
                              </div>
                              <div className="grid grid-cols-2 gap-8 text-right">
                                  <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Assigned Sample ID</p><p className="text-sm font-black text-purple-600 font-mono">{selectedTest.sampleId || 'AWAITING COLLECTION'}</p></div>
                                  <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Target Station</p><p className="text-sm font-black text-slate-800 uppercase">Bench 02 (Haematology)</p></div>
                              </div>
                          </div>

                          {/* Result Entry Grid */}
                          <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl">
                              <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                                  <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400">Parameter Entry Matrix</h6>
                                  <button className="bg-white/10 hover:bg-white/20 px-4 py-1 rounded text-[9px] font-black uppercase transition border border-white/5">Auto-Import (LIS)</button>
                              </div>
                              <table className="w-full text-left text-[11px] border-collapse">
                                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 font-black uppercase tracking-tight">
                                      <tr>
                                          <th className="px-8 py-4">Clinical Parameter</th>
                                          <th className="px-6 py-4 text-center">Reference Range</th>
                                          <th className="px-6 py-4 text-center">Unit</th>
                                          <th className="px-8 py-4 text-center w-40">Value Result</th>
                                          <th className="px-4 py-4 text-center">Flag</th>
                                          <th className="px-6 py-4">Diagnostic Remarks</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                                      {[
                                          { p: 'Hemoglobin (Hb)', r: '13.5 - 17.5', u: 'g/dL', v: '14.2' },
                                          { p: 'WBC Count', r: '4.0 - 11.0', u: 'x10^9/L', v: '6.8' },
                                          { p: 'Platelet Count', r: '150 - 450', u: 'x10^9/L', v: '320' },
                                          { p: 'MCV', r: '80 - 100', u: 'fL', v: '88.5' }
                                      ].map((row, i) => (
                                          <tr key={i} className="hover:bg-purple-50/20 transition-colors group">
                                              <td className="px-8 py-4 text-slate-900">{row.p}</td>
                                              <td className="px-6 py-4 text-center text-slate-400 font-mono text-[10px]">{row.r}</td>
                                              <td className="px-6 py-4 text-center text-slate-500">{row.u}</td>
                                              <td className="px-8 py-4">
                                                  <input type="text" defaultValue={row.v} className="w-full text-center p-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-600 outline-none font-black text-indigo-600 transition-all" />
                                              </td>
                                              <td className="px-4 py-4 text-center">
                                                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-400 mx-auto group-hover:bg-white group-hover:shadow-sm transition-all cursor-pointer">N</div>
                                              </td>
                                              <td className="px-6 py-4"><input type="text" className="w-full bg-transparent border-b border-transparent focus:border-purple-300 outline-none italic text-slate-500 text-[10px]" placeholder="Add comments..." /></td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                                 <button onClick={() => notify('success', 'Report Staged', 'Results saved. Final signature required.')} className="bg-purple-600 text-white px-12 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-purple-500/20 hover:bg-purple-700 transition transform active:scale-95">Verify & Stage Report</button>
                              </div>
                          </div>
                      </div>
                   </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-200 py-32 text-center p-20 animate-in fade-in">
                    <div className="w-24 h-24 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-8 shadow-inner border border-slate-100"><i className="fa fa-microscope text-5xl opacity-10"></i></div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Diagnostic Hub Ready</h4>
                    <p className="text-[10px] font-bold text-slate-300 mt-2 uppercase max-w-xs leading-relaxed italic">Identify a pending investigation from the worklist to start result entry.</p>
                </div>
            )}
        </div>
      </div>

      <QueueModal isOpen={showQueueModal} onClose={() => setShowQueueModal(false)} patientName={activePatient?.surname} patientId={activePatient?.outpatientNo} />
    </div>
  );
};

export default Laboratory;