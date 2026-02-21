import React, { useState, useEffect } from 'react';
import { usePatient } from '../../context/PatientContext';
import { useNotification } from '../../context/NotificationContext';
import QueueModal from '../../components/QueueModal';

interface VitalSet {
  systolic: string;
  diastolic: string;
  pulse: string;
  temp: string;
  spo2: string;
  resp: string;
  weight: string;
  height: string;
  bmi: string;
  pain: number;
}

const DEFAULT_VITALS: VitalSet = {
  systolic: '',
  diastolic: '',
  pulse: '',
  temp: '',
  spo2: '',
  resp: '',
  weight: '',
  height: '',
  bmi: '0.0',
  pain: 0
};

const Triage: React.FC = () => {
  const { activePatient, setActivePatient } = usePatient();
  const { notify } = useNotification();
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [triageLevel, setTriageLevel] = useState<number | null>(null);
  
  // Current Session Vitals History
  const [vitalsHistory, setVitalsHistory] = useState<VitalSet[]>([DEFAULT_VITALS]);
  const [activeSetIndex, setActiveSetIndex] = useState(0);

  const [notes, setNotes] = useState('');
  const [generalExam, setGeneralExam] = useState('');
  const [systematicExam, setSystematicExam] = useState('');
  const [procedure, setProcedure] = useState('');

  // Mock Queue Data
  const triageQueue = [
    { id: 'Q101', name: 'Alice Wambui', time: '10:00 AM', reason: 'Fever & Headache', urgency: 'High' },
    { id: 'Q102', name: 'Kevin Omondi', time: '10:15 AM', reason: 'Abdominal Pain', urgency: 'Medium' },
    { id: 'Q103', name: 'Baby Ryan', time: '10:20 AM', reason: 'Coughing', urgency: 'Medium' },
  ];

  // Current active vitals set being edited
  const currentVitals = vitalsHistory[activeSetIndex];

  // Helper to update current active set
  const updateCurrentVitals = (updates: Partial<VitalSet>) => {
    const updatedHistory = [...vitalsHistory];
    updatedHistory[activeSetIndex] = { ...updatedHistory[activeSetIndex], ...updates };
    setVitalsHistory(updatedHistory);
  };

  // Auto-calculate BMI for active set
  useEffect(() => {
    const w = parseFloat(currentVitals.weight);
    const h = parseFloat(currentVitals.height) / 100; // convert cm to m
    if (w > 0 && h > 0) {
      const bmiVal = (w / (h * h)).toFixed(1);
      updateCurrentVitals({ bmi: bmiVal });
    } else {
      updateCurrentVitals({ bmi: '0.0' });
    }
  }, [currentVitals.weight, currentVitals.height]);

  const handleQueueSelect = (patientName: string) => {
      const names = patientName.split(' ');
      setActivePatient({
          id: 'P-999',
          surname: names[1] || names[0],
          othernames: names[0],
          age: 25,
          gender: 'Female',
          scheme: 'CASH',
          outpatientNo: 'OP-TEMP-001',
          telephone: '0700000000',
          status: 'Queue'
      });
      // Reset session
      setVitalsHistory([{...DEFAULT_VITALS}]);
      setActiveSetIndex(0);
      setTriageLevel(null);
  };

  const handleRetake = () => {
    if (vitalsHistory.length >= 5) {
      notify('warning', 'Limit Reached', 'Maximum of 4 retakes (5 total sets) allowed per encounter.');
      return;
    }
    const nextSet = { ...currentVitals }; 
    setVitalsHistory([...vitalsHistory, nextSet]);
    setActiveSetIndex(vitalsHistory.length);
    notify('info', 'Retake Initialized', `Added Vital Set #${vitalsHistory.length + 1}. Initial readings preserved.`);
  };

  const handleSubmitVitals = () => {
    if (!activePatient) return;
    
    // Simulate persistent storage for auto-picking in other clinics
    const submission = {
        patientId: activePatient.outpatientNo,
        timestamp: new Date().toISOString(),
        triageLevel,
        history: vitalsHistory,
        generalExam,
        systematicExam,
        procedure,
        notes
    };
    localStorage.setItem(`latest_triage_${activePatient.outpatientNo}`, JSON.stringify(submission));

    const pName = activePatient?.surname || 'Patient';
    notify('success', 'Vitals Finalized', `${vitalsHistory.length} set(s) of vitals for ${pName} recorded.`);
    
    // Auto-pop queue modal to move to next station
    setShowQueueModal(true);
  };

  const getAcuityColor = (level: number) => {
      switch(level) {
          case 1: return 'bg-red-600 text-white border-red-600';
          case 2: return 'bg-orange-500 text-white border-orange-500';
          case 3: return 'bg-yellow-400 text-black border-yellow-400';
          case 4: return 'bg-green-500 text-white border-green-500';
          case 5: return 'bg-blue-50 text-white border-blue-500';
          default: return 'bg-gray-50 text-gray-400 border-gray-200';
      }
  };

  const getBmiColor = (bmi: number) => {
      if (bmi < 18.5) return 'text-blue-500';
      if (bmi >= 18.5 && bmi < 25) return 'text-green-500';
      if (bmi >= 25 && bmi < 30) return 'text-orange-500';
      return 'text-red-500';
  };

  return (
    <div className="animate-bottom space-y-6 pb-20">
      
      {/* 1. Header & Active Patient Banner */}
      <div className="bg-[#1e293b] text-white rounded-xl shadow-lg border border-slate-700 p-4 flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-center space-x-4 z-10">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center font-black text-xl shadow-inner shrink-0">
            <i className="fa fa-heartbeat"></i>
          </div>
          
          {activePatient ? (
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-black uppercase tracking-tight leading-none">
                  {activePatient?.surname}, {activePatient?.othernames}
                </h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-black uppercase tracking-widest border border-emerald-500/30">Active Triage</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">
                {activePatient?.outpatientNo} • {activePatient?.age} Yrs • {activePatient?.gender}
              </p>
            </div>
          ) : (
            <div>
               <h2 className="text-lg font-black uppercase tracking-widest text-slate-300">Triage Station</h2>
               <p className="text-[10px] text-slate-500 font-bold">Select a patient from the queue to begin assessment</p>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3 z-10">
           <button 
             onClick={() => { setShowQueueModal(true); }}
             className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition"
           >
              Queue Actions
           </button>
           {activePatient && (
               <button onClick={handleSubmitVitals} className="bg-emerald-500 text-white px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg hover:bg-emerald-600 transition flex items-center">
                  <i className="fa fa-check-circle mr-2"></i> Submit & Clear Stage
               </button>
           )}
        </div>
        
        {/* Background Decoration */}
        <i className="fa fa-notes-medical absolute -right-6 -bottom-6 text-9xl text-white/5 rotate-12"></i>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* 2. LEFT: Triage Queue Sidebar */}
          <div className="lg:col-span-3 space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-[600px]">
                 <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h6 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Waiting List</h6>
                    <span className="bg-blue-100 text-blue-700 text-[9px] px-1.5 py-0.5 rounded-full font-bold">{triageQueue.length}</span>
                 </div>
                 <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/30">
                    {triageQueue.map(p => (
                       <div 
                         key={p.id} 
                         onClick={() => handleQueueSelect(p.name)}
                         className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md group ${activePatient?.surname === p.name.split(' ')[1] ? 'bg-emerald-50 border-emerald-200 ring-1 ring-emerald-500' : 'bg-white border-gray-200 hover:border-emerald-300'}`}
                       >
                          <div className="flex justify-between items-start mb-1">
                             <span className="text-[10px] font-black text-blue-600">{p.time}</span>
                             <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${p.urgency === 'High' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>{p.urgency}</span>
                          </div>
                          <h6 className="text-xs font-black text-gray-800 uppercase group-hover:text-emerald-700">{p.name}</h6>
                          <p className="text-[10px] text-gray-400 mt-1 italic truncate">{p.reason}</p>
                       </div>
                    ))}
                 </div>
              </div>
          </div>

          {/* 3. RIGHT: Main Triage Workspace */}
          <div className="lg:col-span-9 space-y-6">
              {activePatient ? (
                  <>
                    {/* VITALS MONITOR */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                       <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <h6 className="text-sm font-bold text-gray-700 uppercase tracking-tighter flex items-center">
                                <i className="fa fa-wave-square text-emerald-500 mr-2"></i> Vitals Monitor
                            </h6>
                            {/* Session Stepper */}
                            <div className="flex items-center space-x-1 ml-4 bg-gray-200/50 p-1 rounded-lg">
                               {vitalsHistory.map((_, idx) => (
                                 <button 
                                   key={idx}
                                   onClick={() => setActiveSetIndex(idx)}
                                   className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${activeSetIndex === idx ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-400 hover:bg-white hover:text-gray-600'}`}
                                 >
                                   {idx === 0 ? 'Initial' : `Retake #${idx}`}
                                 </button>
                               ))}
                               {vitalsHistory.length < 5 && (
                                 <button 
                                   onClick={handleRetake}
                                   className="px-2 py-1 text-emerald-600 hover:text-emerald-800 text-[9px] font-black uppercase transition-colors"
                                   title="Add a second set of measurements"
                                 >
                                   + Retake
                                 </button>
                               )}
                            </div>
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Captured: {vitalsHistory.length} Set(s)</span>
                       </div>
                       
                       <div className="p-8">
                          {activeSetIndex > 0 && (
                            <div className="mb-6 p-2 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center justify-between animate-in slide-in-from-top-2">
                               <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest"><i className="fa fa-history mr-2"></i> You are viewing Retake Set #{activeSetIndex}</span>
                               <span className="text-[9px] font-bold text-emerald-500 italic">Initial reading remains preserved in session.</span>
                            </div>
                          )}

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8">
                             {/* BP */}
                             <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Blood Pressure</label>
                                <div className="flex items-center space-x-2">
                                   <input 
                                      type="number" 
                                      placeholder="120"
                                      className="w-full text-center text-2xl font-black text-gray-700 border-b-2 border-gray-200 focus:border-emerald-500 outline-none placeholder-gray-200"
                                      value={currentVitals.systolic}
                                      onChange={(e) => updateCurrentVitals({ systolic: e.target.value })}
                                   />
                                   <span className="text-xl text-gray-300">/</span>
                                   <input 
                                      type="number" 
                                      placeholder="80"
                                      className="w-full text-center text-2xl font-black text-gray-700 border-b-2 border-gray-200 focus:border-emerald-500 outline-none placeholder-gray-200"
                                      value={currentVitals.diastolic}
                                      onChange={(e) => updateCurrentVitals({ diastolic: e.target.value })}
                                   />
                                </div>
                                <span className="text-[9px] font-bold text-emerald-600 block text-center">mmHg</span>
                             </div>

                             {/* Pulse */}
                             <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Heart Rate</label>
                                <div className="relative">
                                    <input 
                                       type="number" 
                                       placeholder="--"
                                       className="w-full text-center text-3xl font-black text-gray-700 border-b-2 border-gray-200 focus:border-red-400 outline-none placeholder-gray-200"
                                       value={currentVitals.pulse}
                                       onChange={(e) => updateCurrentVitals({ pulse: e.target.value })}
                                    />
                                    <i className="fa fa-heart absolute right-0 top-2 text-red-100 text-xl animate-pulse"></i>
                                </div>
                                <span className="text-[9px] font-bold text-red-500 block text-center">BPM</span>
                             </div>

                             {/* Temp */}
                             <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Temperature</label>
                                <input 
                                   type="number" 
                                   placeholder="--"
                                   className={`w-full text-center text-3xl font-black border-b-2 border-gray-200 outline-none placeholder-gray-200 focus:border-orange-400 ${parseFloat(currentVitals.temp) > 37.5 ? 'text-red-500' : 'text-gray-700'}`}
                                   value={currentVitals.temp}
                                   onChange={(e) => updateCurrentVitals({ temp: e.target.value })}
                                />
                                <span className="text-[9px] font-bold text-orange-500 block text-center">°C</span>
                             </div>

                             {/* SpO2 */}
                             <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">O2 Saturation</label>
                                <input 
                                   type="number" 
                                   placeholder="--"
                                   className="w-full text-center text-3xl font-black text-gray-700 border-b-2 border-gray-200 focus:border-blue-400 outline-none placeholder-gray-200"
                                   value={currentVitals.spo2}
                                   onChange={(e) => updateCurrentVitals({ spo2: e.target.value })}
                                />
                                <span className="text-[9px] font-bold text-blue-500 block text-center">%</span>
                             </div>
                             
                             {/* Anthropometry */}
                             <div className="col-span-2 md:col-span-4 border-t border-dashed border-gray-200 my-4"></div>

                             <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase text-center">Height</label>
                                <input 
                                   type="number" 
                                   placeholder="cm"
                                   className="w-full text-center text-xl font-bold text-gray-700 border-b-2 border-gray-200 focus:border-emerald-500 outline-none"
                                   value={currentVitals.height}
                                   onChange={(e) => updateCurrentVitals({ height: e.target.value })}
                                />
                             </div>
                             <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase text-center">Weight</label>
                                <input 
                                   type="number" 
                                   placeholder="kg"
                                   className="w-full text-center text-xl font-bold text-gray-700 border-b-2 border-gray-200 focus:border-emerald-500 outline-none"
                                   value={currentVitals.weight}
                                   onChange={(e) => updateCurrentVitals({ weight: e.target.value })}
                                />
                             </div>
                             
                             {/* Calculated BMI */}
                             <div className="col-span-2 bg-gray-50 rounded-xl p-2 flex flex-col items-center justify-center border border-gray-100">
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">BMI Calculator</span>
                                <div className="flex items-baseline space-x-2 mt-1">
                                   <span className={`text-3xl font-black ${getBmiColor(parseFloat(currentVitals.bmi))}`}>{currentVitals.bmi}</span>
                                   <span className="text-[9px] font-bold text-gray-400">kg/m²</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* TRIAGE ASSESSMENT */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                           <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Triage Acuity Scale (TAS)</h6>
                           <div className="space-y-2">
                                {[
                                  { lvl: 1, label: 'Resuscitation (Immediate)', color: 'red-600' },
                                  { lvl: 2, label: 'Emergent (15 min)', color: 'orange-500' },
                                  { lvl: 3, label: 'Urgent (30 min)', color: 'yellow-400' },
                                  { lvl: 4, label: 'Less Urgent (60 min)', color: 'green-500' },
                                  { lvl: 5, label: 'Non-Urgent (120 min)', color: 'blue-500' },
                                ].map((t) => (
                                  <button 
                                    key={t.lvl}
                                    onClick={() => setTriageLevel(t.lvl)}
                                    className={`w-full text-left px-4 py-3 rounded-lg border text-xs font-bold uppercase transition-all flex justify-between items-center ${
                                      triageLevel === t.lvl ? getAcuityColor(t.lvl) + ' shadow-md scale-[1.02]' : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
                                    }`}
                                  >
                                     <span>Level {t.lvl} - {t.label}</span>
                                     {triageLevel === t.lvl && <i className="fa fa-check-circle"></i>}
                                  </button>
                                ))}
                           </div>
                       </div>

                       <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col">
                           <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Clinical Notes & Actions</h6>
                           
                           <div className="space-y-4 flex-1">
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Chief Complaint</label>
                                  <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-emerald-500" placeholder="e.g. Severe headache, Fever..." />
                               </div>
                               <div className="flex-1">
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Nursing Assessment</label>
                                  <textarea 
                                     className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-emerald-500 h-32 resize-none"
                                     placeholder="Observations, interventions done..."
                                     value={notes}
                                     onChange={(e) => setNotes(e.target.value)}
                                  ></textarea>
                               </div>
                           </div>
                       </div>
                    </div>

                    {/* NEW SECTIONS: EXAMINATIONS & PROCEDURES */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                            <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Clinical Examinations</h6>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">General Examination</label>
                                    <textarea 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-emerald-500 h-24 resize-none"
                                        placeholder="Pallor, Jaundice, Cyanosis, Oedema, Lymphadenopathy..."
                                        value={generalExam}
                                        onChange={(e) => setGeneralExam(e.target.value)}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Systematic Examination</label>
                                    <textarea 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-emerald-500 h-24 resize-none"
                                        placeholder="CVS, RS, PA, CNS, MSS..."
                                        value={systematicExam}
                                        onChange={(e) => setSystematicExam(e.target.value)}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col">
                            <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Procedures</h6>
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Procedure Performed</label>
                                <textarea 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-emerald-500 h-full min-h-[180px] resize-none"
                                    placeholder="Wound dressing, Nebulization, Injection given..."
                                    value={procedure}
                                    onChange={(e) => setProcedure(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                  </>
              ) : (
                  <div className="h-full flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-200 rounded-xl text-gray-300 min-h-[400px]">
                      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                         <i className="fa fa-user-clock text-4xl opacity-20"></i>
                      </div>
                      <p className="text-sm font-black uppercase tracking-widest">No Patient Selected</p>
                      <p className="text-xs mt-2 font-medium">Select a patient from the <span className="text-emerald-500">Waiting List</span> sidebar.</p>
                  </div>
              )}
          </div>
      </div>

      <QueueModal 
        isOpen={showQueueModal} 
        onClose={() => setShowQueueModal(false)}
        patientName={activePatient ? `${activePatient.surname} ${activePatient.othernames}` : 'Triage Patient'}
        patientId={activePatient?.outpatientNo}
      />
    </div>
  );
};

export default Triage;
