
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { usePatient, PatientRecord } from '../../context/PatientContext';
import { useNotification } from '../../context/NotificationContext';
import { GoogleGenAI } from '@google/genai';
import DictationButton from '../../components/DictationButton';
import QueueModal from '../../components/QueueModal';

// --- Interfaces ---
interface OrderItem {
    id: string;
    type: 'Lab' | 'Radiology' | 'Pharmacy' | 'Procedure';
    name: string;
    instructions: string;
    urgency: 'Routine' | 'Stat';
    // Prescription specific fields
    dosage?: string;
    frequency?: string;
    duration?: string;
    route?: string;
}

interface CatalogItem {
    id: string;
    name: string;
    type: 'Lab' | 'Radiology' | 'Pharmacy' | 'Procedure';
    category: string;
}

// --- Mock Catalog ---
const CATALOG: CatalogItem[] = [
    { id: 'L01', name: 'Full Haemogram', type: 'Lab', category: 'Haematology' },
    { id: 'L02', name: 'U&Es (Renal Profile)', type: 'Lab', category: 'Biochemistry' },
    { id: 'L03', name: 'Liver Function Tests', type: 'Lab', category: 'Biochemistry' },
    { id: 'L04', name: 'Malaria Smear', type: 'Lab', category: 'Parasitology' },
    { id: 'L05', name: 'Urinalysis', type: 'Lab', category: 'Microbiology' },
    { id: 'R01', name: 'CXR PA', type: 'Radiology', category: 'X-Ray' },
    { id: 'R02', name: 'Ultrasound Abdomen', type: 'Radiology', category: 'Ultrasound' },
    { id: 'R03', name: 'CT Brain Plain', type: 'Radiology', category: 'CT Scan' },
    { id: 'P01', name: 'Amoxicillin 500mg', type: 'Pharmacy', category: 'Antibiotic' },
    { id: 'P02', name: 'Paracetamol 1g', type: 'Pharmacy', category: 'Analgesic' },
    { id: 'P03', name: 'Cetirizine 10mg', type: 'Pharmacy', category: 'Antihistamine' },
    { id: 'P04', name: 'Metronidazole 400mg', type: 'Pharmacy', category: 'Antibiotic' },
    { id: 'P05', name: 'Amlodipine 5mg', type: 'Pharmacy', category: 'Antihypertensive' },
    { id: 'P06', name: 'Metformin 500mg', type: 'Pharmacy', category: 'Antidiabetic' },
    { id: 'P07', name: 'Atorvastatin 20mg', type: 'Pharmacy', category: 'Lipid Lowering' },
    { id: 'P08', name: 'Omeprazole 20mg', type: 'Pharmacy', category: 'Antacid' },
    { id: 'P09', name: 'Salbutamol Inhaler', type: 'Pharmacy', category: 'Bronchodilator' },
    { id: 'P10', name: 'Warfarin 5mg', type: 'Pharmacy', category: 'Anticoagulant' },
    { id: 'P11', name: 'Ibuprofen 400mg', type: 'Pharmacy', category: 'NSAID' },
    { id: 'P12', name: 'Azithromycin 500mg', type: 'Pharmacy', category: 'Antibiotic' },
    { id: 'P13', name: 'Losartan 50mg', type: 'Pharmacy', category: 'Antihypertensive' },
    { id: 'P14', name: 'Insulin Glargine', type: 'Pharmacy', category: 'Insulin' },
    { id: 'P15', name: 'Prednisolone 5mg', type: 'Pharmacy', category: 'Corticosteroid' },
    { id: 'S01', name: 'Wound Dressing', type: 'Procedure', category: 'Nursing' },
    { id: 'S02', name: 'Stitching / Suturing', type: 'Procedure', category: 'Minor Surgery' },
    { id: 'S03', name: 'Nebulization', type: 'Procedure', category: 'Nursing' },
];

const Consultation: React.FC = () => {
  const { activePatient, setActivePatient } = usePatient();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('history');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  
  // Differential Diagnosis AI State
  const [isDiffLoading, setIsDiffLoading] = useState(false);
  const [aiDifferentials, setAiDifferentials] = useState<string | null>(null);

  const [showQueueModal, setShowQueueModal] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(true);
  
  // Interaction AI State
  const [isInteractionLoading, setIsInteractionLoading] = useState(false);
  const [interactionResult, setInteractionResult] = useState<string | null>(null);

  // --- Clinical Data State ---
  const [encounter, setEncounter] = useState({
    complaints: '',
    hpi: '',
    pmh: '',
    physicalExam: '',
    assessmentNotes: '',
    planNotes: '',
    icd11: [] as string[]
  });

  // Review of Systems State
  const [ros, setRos] = useState({
      general: '',
      heent: '',
      respiratory: '',
      cardiac: '',
      gastro: '',
      genito: '',
      neuro: '',
      msk: ''
  });

  // Vitals State (Mocked for context)
  const [vitals, setVitals] = useState({
      bp: '120/80', pulse: '72', temp: '36.8', spo2: '98', rr: '16'
  });

  // --- Order Management State ---
  const [orderTypeFilter, setOrderTypeFilter] = useState<'All' | 'Lab' | 'Radiology' | 'Pharmacy' | 'Procedure'>('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [pendingOrders, setPendingOrders] = useState<OrderItem[]>([]);

  // Derived Data for Orders
  const filteredCatalog = useMemo(() => {
      return CATALOG.filter(item => {
          const matchesType = orderTypeFilter === 'All' || item.type === orderTypeFilter;
          const matchesSearch = item.name.toLowerCase().includes(orderSearch.toLowerCase());
          return matchesType && matchesSearch;
      });
  }, [orderTypeFilter, orderSearch]);

  const myQueue = [
    { id: 'OP-2023-001', name: 'JANE DOE', age: 24, gender: 'Female', time: '10:30 AM', priority: 'High', reason: 'Persistent Migraine' },
    { id: 'OP-2023-042', name: 'JOHN SMITH', age: 45, gender: 'Male', time: '11:15 AM', priority: 'Normal', reason: 'Check-up' },
    { id: 'OP-2023-115', name: 'MARY ANN', age: 32, gender: 'Female', time: '11:45 AM', priority: 'Critical', reason: 'Chest Tightness' },
  ];

  const handleSelectFromQueue = (p: any) => {
    const names = p.name.split(' ');
    setActivePatient({
      id: p.id,
      surname: names[1] || names[0],
      othernames: names[0],
      age: p.age,
      gender: p.gender,
      scheme: 'CASH',
      outpatientNo: p.id,
      telephone: '0700-000-000',
      status: 'Queue'
    });
    setAiInsights(null);
    setAiDifferentials(null);
    setEncounter({
        complaints: '', hpi: '', pmh: '', physicalExam: '', assessmentNotes: '', planNotes: '', icd11: []
    });
    setRos({ general: '', heent: '', respiratory: '', cardiac: '', gastro: '', genito: '', neuro: '', msk: '' });
  };

  const handleAiConsult = async () => {
    if (!encounter.complaints) { notify('warning', 'Data Needed', 'Capture complaints for AI analysis.'); return; }
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Patient: ${activePatient?.gender}, ${activePatient?.age}y. Complaint: ${encounter.complaints}. HPI: ${encounter.hpi}. Suggest: 1. Differentials. 2. Investigations. 3. Red flags.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { systemInstruction: "You are a clinical consultant assistant." }
      });
      setAiInsights(response.text || "No insights.");
    } catch (e) { setAiInsights("Offline."); } finally { setIsAiLoading(false); }
  };

  const generateDifferentials = async () => {
    if (!encounter.complaints && !encounter.hpi) { 
        notify('warning', 'Data Needed', 'Please enter Chief Complaints or HPI first.'); 
        return; 
    }
    
    setIsDiffLoading(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Construct ROS string
        const positiveRos = Object.entries(ros)
            .filter(([_, value]) => (value as string).trim() !== '')
            .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
            .join('; ');

        const prompt = `
            Act as a Senior Clinical Consultant. Based on the following data, provide a structured list of the top 3-5 Differential Diagnoses. For each diagnosis, briefly explain "Why it fits" and "Why it might not".
            
            **Patient Profile**: ${activePatient?.age} year old ${activePatient?.gender}
            **Chief Complaint**: ${encounter.complaints}
            **History of Presenting Illness**: ${encounter.hpi}
            **Review of Systems (Positives)**: ${positiveRos || 'None recorded'}
            **Vitals**: BP ${vitals.bp}, HR ${vitals.pulse}, Temp ${vitals.temp}
            
            Output Format:
            **1. [Diagnosis Name]**
            *Likelihood: [High/Medium/Low]*
            *Reasoning: ...*
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { 
                temperature: 0.2, // Lower temperature for more clinical precision
                systemInstruction: "You are a medical diagnostic assistant. Be concise, evidence-based, and prioritize life-threatening conditions if symptoms suggest them." 
            }
        });
        setAiDifferentials(response.text || "Could not generate differentials.");
    } catch (e) {
        setAiDifferentials("AI Service unavailable. Please check connection.");
    } finally {
        setIsDiffLoading(false);
    }
  };

  const checkDrugInteractions = async () => {
    const pharmacyOrders = pendingOrders.filter(o => o.type === 'Pharmacy');
    if (pharmacyOrders.length < 1) {
        notify('warning', 'No Medications', 'Add medications to check for interactions.');
        return;
    }

    setIsInteractionLoading(true);
    setInteractionResult(null);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const medList = pharmacyOrders.map(o => `${o.name} (${o.dosage} ${o.frequency})`).join(', ');
        const prompt = `
            Act as a Clinical Pharmacologist. Analyze the following list of medications for a ${activePatient?.age}y ${activePatient?.gender} patient.
            
            Medications: ${medList}
            Patient Diagnosis/Complaints: ${encounter.complaints}
            
            1. Identify any potential drug-drug interactions.
            2. Identify any drug-disease interactions based on the complaints.
            3. Suggest safer alternatives if interactions are found.
            4. Provide a "Safety Score" from 1-10.
            
            Be concise and clinical.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { systemInstruction: "You are a drug safety expert." }
        });
        setInteractionResult(response.text || "No interactions found.");
    } catch (e) {
        setInteractionResult("Interaction check failed.");
    } finally {
        setIsInteractionLoading(false);
    }
  };

  const handleAddToOrder = (item: CatalogItem) => {
      const newOrder: OrderItem = {
          id: Date.now().toString(),
          type: item.type,
          name: item.name,
          instructions: '',
          dosage: item.type === 'Pharmacy' ? '1' : undefined,
          frequency: item.type === 'Pharmacy' ? 'Once Daily' : undefined,
          duration: item.type === 'Pharmacy' ? '5 Days' : undefined,
          route: item.type === 'Pharmacy' ? 'Oral' : undefined,
          urgency: 'Routine'
      };
      setPendingOrders([...pendingOrders, newOrder]);
      notify('info', 'Item Added', `${item.name} added to request list.`);
  };

  const removeOrder = (id: string) => {
      setPendingOrders(pendingOrders.filter(o => o.id !== id));
  };

  const updateOrderField = (id: string, field: keyof OrderItem, val: string) => {
      setPendingOrders(pendingOrders.map(o => o.id === id ? { ...o, [field]: val } : o));
  };
  
  const updateOrderUrgency = (id: string, val: 'Routine' | 'Stat') => {
      setPendingOrders(pendingOrders.map(o => o.id === id ? { ...o, urgency: val } : o));
  };

  const handleFinalize = () => {
    if (pendingOrders.length > 0) {
        notify('success', 'Orders Placed', `${pendingOrders.length} requests sent to respective departments.`);
    }
    notify('success', 'Visit Finalized', 'Encounter committed to permanent record.');
    setShowQueueModal(true);
  };

  const labelStyle = "block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest";
  const sectionHeader = "text-[11px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1 mb-4 flex justify-between items-center";
  const inputStyle = "w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm";

  return (
    <div className="animate-bottom flex flex-col h-[calc(100vh-140px)] -m-4 md:-m-6 bg-slate-50 overflow-hidden font-helvetica">
      {/* Workspace Header */}
      <div className="bg-slate-900 h-16 shrink-0 flex items-center justify-between px-6 border-b border-white/5 z-20 shadow-xl">
        <div className="flex items-center space-x-6">
           <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg border border-white/10"><i className="fa fa-user-md"></i></div>
              {activePatient ? (
                  <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-tighter leading-none">{activePatient.surname}, {activePatient.othernames}</h2>
                    <p className="text-[9px] text-indigo-400 font-bold uppercase mt-1">ID: {activePatient.outpatientNo} &bull; {activePatient.age}Yrs &bull; {activePatient.scheme}</p>
                  </div>
              ) : (
                  <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-tighter leading-none">Consultation Desk</h2>
                    <p className="text-[9px] text-indigo-400 font-bold uppercase mt-1">Standby Mode</p>
                  </div>
              )}
           </div>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => setIsQueueOpen(!isQueueOpen)} className="bg-white/5 hover:bg-white/10 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition border border-white/5">{isQueueOpen ? 'Hide Queue' : 'Show Queue'}</button>
            <button onClick={handleFinalize} className="bg-indigo-600 text-white px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition">Finalize Visit</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Waiting List Sidebar */}
        <div className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col shrink-0 ${isQueueOpen ? 'w-80' : 'w-0 overflow-hidden'}`}>
           <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
              <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Queue</h6>
              <span className="bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded-full font-black">{myQueue.length}</span>
           </div>
           <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {myQueue.map(p => (
                <div key={p.id} onClick={() => handleSelectFromQueue(p)} className={`p-5 cursor-pointer transition-all border-l-4 ${activePatient?.outpatientNo === p.id ? 'bg-indigo-50 border-l-indigo-600' : 'hover:bg-gray-50 border-l-transparent'}`}>
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-black text-indigo-600">{p.time}</span>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${p.priority === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{p.priority}</span>
                    </div>
                    <h6 className="text-xs font-black text-slate-800 uppercase truncate">{p.name}</h6>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 italic">{p.reason}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Main Content Pane */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
           {activePatient ? (
               <>
                  <div className="bg-slate-50 border-b border-slate-200 flex px-6 shrink-0">
                      {[
                        { id: 'history', label: '1. History (S)', icon: 'fa-history' },
                        { id: 'exam', label: '2. Examination (O)', icon: 'fa-stethoscope' },
                        { id: 'assess', label: '3. Assessment (A)', icon: 'fa-search-plus' },
                        { id: 'plan', label: '4. Clinical Requests (P)', icon: 'fa-clipboard-list' },
                      ].map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)} className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === t.id ? 'border-indigo-600 text-indigo-600 bg-white shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                           <i className={`fa ${t.icon} mr-2 opacity-50`}></i> {t.label}
                        </button>
                      ))}
                  </div>

                  <div className="flex-1 overflow-y-auto p-0 scrollbar-hide">
                      <div className="h-full">
                          {activeTab === 'history' && (
                              <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 p-10 max-w-6xl mx-auto">
                                 {/* Subjective Data - SOAP 'S' */}
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center"><label className={labelStyle}>Chief Complaint</label><DictationButton onTranscript={t => setEncounter({...encounter, complaints: encounter.complaints + ' ' + t})} /></div>
                                        <textarea className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-inner resize-none leading-relaxed" placeholder="Primary reason for visit..." value={encounter.complaints} onChange={e => setEncounter({...encounter, complaints: e.target.value})}></textarea>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center"><label className={labelStyle}>History of Presenting Illness (HPI)</label><DictationButton onTranscript={t => setEncounter({...encounter, hpi: encounter.hpi + ' ' + t})} /></div>
                                        <textarea className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-inner resize-none leading-relaxed" placeholder="Onset, duration, and associated symptoms..." value={encounter.hpi} onChange={e => setEncounter({...encounter, hpi: e.target.value})}></textarea>
                                    </div>
                                 </div>

                                 {/* Review of Systems (ROS) */}
                                 <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                                     <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Review of Systems (ROS)</h6>
                                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                         {Object.keys(ros).map(system => (
                                             <div key={system} className="space-y-1">
                                                 <label className="text-[9px] font-bold text-slate-400 uppercase">{system}</label>
                                                 <input 
                                                     type="text" 
                                                     className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:border-indigo-500 outline-none transition-colors placeholder:text-gray-300"
                                                     placeholder="Enter findings..."
                                                     value={(ros as any)[system]}
                                                     onChange={(e) => setRos({...ros, [system]: e.target.value})}
                                                 />
                                             </div>
                                         ))}
                                     </div>
                                 </div>

                                 {/* Original AI Insight Panel */}
                                 <div className="bg-[#1e293b] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400"><i className="fa fa-robot"></i></div>
                                                <h5 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400">Clinical Intelligence Engine</h5>
                                            </div>
                                            <button onClick={handleAiConsult} disabled={isAiLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50">
                                                {isAiLoading ? <i className="fa fa-spinner fa-spin"></i> : <i className="fa fa-brain"></i>}
                                                Analyze Symptoms
                                            </button>
                                        </div>
                                        {aiInsights ? (
                                            <div className="bg-white/5 border border-white/5 rounded-2xl p-6 text-[11px] font-medium leading-relaxed text-slate-300 animate-in fade-in zoom-in-95 whitespace-pre-wrap">
                                                {aiInsights}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 font-medium italic">Document complaints then click analysis for red flag screening.</p>
                                        )}
                                    </div>
                                    <i className="fa fa-brain absolute -right-8 -bottom-8 text-[12rem] text-white/5 rotate-12"></i>
                                 </div>
                              </div>
                          )}

                          {activeTab === 'exam' && (
                             <div className="animate-in fade-in space-y-8 p-10 max-w-5xl mx-auto">
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {[{l:'TEMP', v:vitals.temp + '°C'}, {l:'BP', v:vitals.bp}, {l:'PR', v:vitals.pulse + ' bpm'}, {l:'RR', v:vitals.rr + ' bpm'}, {l:'SpO2', v:vitals.spo2 + '%'}].map(v => (
                                        <div key={v.l} className="bg-white border border-slate-200 p-4 rounded-2xl text-center shadow-sm">
                                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{v.l}</p>
                                            <p className="text-lg font-black text-slate-800">{v.v}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center"><label className={labelStyle}>General & Systemic Findings</label><DictationButton onTranscript={t => {}} /></div>
                                    <textarea className="w-full h-80 p-8 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-inner resize-none leading-relaxed" placeholder="Document physical examination results by system (HEENT, Resp, CVS, GI, CNS)..."></textarea>
                                </div>
                             </div>
                          )}

                          {activeTab === 'assess' && (
                              <div className="animate-in fade-in space-y-10 p-10 max-w-6xl mx-auto">
                                 
                                 {/* AI Differential Diagnosis Panel */}
                                 <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h4 className="text-lg font-black text-indigo-900 uppercase tracking-tight flex items-center gap-2">
                                                <i className="fa fa-wand-magic-sparkles"></i> AI Differential Diagnosis
                                            </h4>
                                            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wide mt-1">
                                                Generates diagnostic possibilities based on Subjective (ROS/HPI) and Objective data.
                                            </p>
                                        </div>
                                        <button 
                                            onClick={generateDifferentials} 
                                            disabled={isDiffLoading}
                                            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isDiffLoading ? <i className="fa fa-circle-notch fa-spin"></i> : <i className="fa fa-bolt"></i>}
                                            Generate List
                                        </button>
                                    </div>
                                    
                                    {aiDifferentials ? (
                                        <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm text-xs text-slate-700 leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-top-2">
                                            {aiDifferentials}
                                        </div>
                                    ) : (
                                        <div className="bg-white/50 rounded-2xl p-8 border border-indigo-100 border-dashed text-center text-indigo-400">
                                            <p className="text-xs font-bold uppercase tracking-widest">Awaiting Analysis</p>
                                        </div>
                                    )}
                                 </div>

                                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                     <div className="space-y-4">
                                        <label className={labelStyle}>Diagnosis Search (ICD-11 / SNOMED CT)</label>
                                        <div className="flex gap-2">
                                            <input className="flex-1 p-4 bg-white border border-slate-300 rounded-2xl text-sm font-black uppercase text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm" placeholder="Start typing diagnosis name or code..." />
                                            <button className="bg-indigo-600 text-white px-8 rounded-2xl text-xs font-black uppercase shadow-xl hover:bg-indigo-700 transition">Add</button>
                                        </div>
                                        <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50 flex flex-col items-center justify-center text-slate-300 min-h-[150px]">
                                            <i className="fa fa-stethoscope text-3xl mb-2 opacity-20"></i>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">No Active Diagnoses</p>
                                        </div>
                                     </div>
                                     <div className="space-y-4">
                                        <label className={labelStyle}>Assessment Remarks</label>
                                        <textarea 
                                            className="w-full h-full min-h-[240px] p-6 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-medium outline-none focus:ring-1 focus:ring-indigo-500 shadow-inner resize-none leading-relaxed"
                                            value={encounter.assessmentNotes}
                                            onChange={e => setEncounter({...encounter, assessmentNotes: e.target.value})}
                                            placeholder="Clinical impression and synthesis..."
                                        ></textarea>
                                     </div>
                                 </div>
                              </div>
                          )}

                          {activeTab === 'plan' && (
                              <div className="h-full flex flex-col animate-in fade-in">
                                 <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
                                    {/* Left: Item Catalog */}
                                    <div className="lg:col-span-7 border-r border-slate-200 flex flex-col bg-gray-50/30">
                                       <div className="p-4 border-b border-gray-100 bg-white">
                                           <div className="flex space-x-2 mb-4 overflow-x-auto scrollbar-hide">
                                              {['All', 'Lab', 'Radiology', 'Pharmacy', 'Procedure'].map(type => (
                                                  <button 
                                                    key={type}
                                                    onClick={() => setOrderTypeFilter(type as any)}
                                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${orderTypeFilter === type ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                                  >
                                                      {type}
                                                  </button>
                                              ))}
                                           </div>
                                           <div className="relative">
                                               <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                               <input 
                                                  type="text" 
                                                  placeholder="Search tests, drugs, procedures..." 
                                                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-500"
                                                  value={orderSearch}
                                                  onChange={e => setOrderSearch(e.target.value)}
                                               />
                                           </div>
                                       </div>
                                       <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                           {filteredCatalog.map(item => (
                                               <div 
                                                  key={item.id} 
                                                  onClick={() => handleAddToOrder(item)}
                                                  className="bg-white border border-gray-100 rounded-xl p-3 flex justify-between items-center cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all group"
                                               >
                                                   <div className="flex items-center space-x-3">
                                                       <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs text-white shadow-sm ${
                                                           item.type === 'Lab' ? 'bg-purple-500' :
                                                           item.type === 'Radiology' ? 'bg-teal-500' :
                                                           item.type === 'Pharmacy' ? 'bg-rose-500' : 'bg-orange-500'
                                                       }`}>
                                                           <i className={`fa ${
                                                               item.type === 'Lab' ? 'fa-flask' :
                                                               item.type === 'Radiology' ? 'fa-x-ray' :
                                                               item.type === 'Pharmacy' ? 'fa-pills' : 'fa-user-nurse'
                                                           }`}></i>
                                                       </div>
                                                       <div>
                                                           <p className="text-xs font-black text-gray-800">{item.name}</p>
                                                           <p className="text-[9px] font-bold text-gray-400 uppercase">{item.category}</p>
                                                       </div>
                                                   </div>
                                                   <i className="fa fa-plus-circle text-gray-300 group-hover:text-indigo-500 transition-colors"></i>
                                               </div>
                                           ))}
                                       </div>
                                    </div>

                                    {/* Right: Pending Orders */}
                                    <div className="lg:col-span-5 bg-white flex flex-col border-l border-slate-100">
                                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                            <h6 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Pending Requests</h6>
                                            <div className="flex items-center gap-2">
                                                {pendingOrders.some(o => o.type === 'Pharmacy') && (
                                                    <button 
                                                        onClick={checkDrugInteractions}
                                                        disabled={isInteractionLoading}
                                                        className="bg-rose-500 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 transition disabled:opacity-50"
                                                    >
                                                        {isInteractionLoading ? <i className="fa fa-spinner fa-spin"></i> : <i className="fa fa-shield-halved mr-1"></i>}
                                                        Check Safety
                                                    </button>
                                                )}
                                                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-[9px] font-black">{pendingOrders.length}</span>
                                            </div>
                                        </div>
                                        
                                        {interactionResult && (
                                            <div className="p-4 bg-rose-50 border-b border-rose-100 animate-in slide-in-from-top-2">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h6 className="text-[9px] font-black text-rose-700 uppercase tracking-widest flex items-center gap-1">
                                                        <i className="fa fa-triangle-exclamation"></i> Drug Safety Analysis
                                                    </h6>
                                                    <button onClick={() => setInteractionResult(null)} className="text-rose-400 hover:text-rose-600"><i className="fa fa-times"></i></button>
                                                </div>
                                                <div className="text-[10px] text-rose-800 leading-relaxed whitespace-pre-wrap font-medium">
                                                    {interactionResult}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                            {pendingOrders.length === 0 ? (
                                                <div className="text-center py-20 text-gray-300">
                                                    <i className="fa fa-shopping-basket text-4xl mb-3 opacity-20"></i>
                                                    <p className="text-[10px] font-black uppercase tracking-widest">List is empty</p>
                                                </div>
                                            ) : (
                                                pendingOrders.map((order, idx) => (
                                                    <div key={idx} className="border border-gray-200 rounded-xl p-3 bg-white shadow-sm group">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                                                                order.type === 'Lab' ? 'bg-purple-50 text-purple-700' :
                                                                order.type === 'Radiology' ? 'bg-teal-50 text-teal-700' :
                                                                order.type === 'Pharmacy' ? 'bg-rose-50 text-rose-700' : 'bg-orange-50 text-orange-700'
                                                            }`}>{order.type}</span>
                                                            <button onClick={() => removeOrder(order.id)} className="text-gray-300 hover:text-red-500"><i className="fa fa-times"></i></button>
                                                        </div>
                                                        <h6 className="text-xs font-black text-gray-800 mb-2">{order.name}</h6>
                                                        
                                                        {order.type === 'Pharmacy' ? (
                                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                                <div className="space-y-1">
                                                                    <label className="text-[8px] font-black text-slate-400 uppercase">Dosage</label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="w-full bg-gray-50 border border-gray-200 rounded p-1.5 text-[10px] outline-none focus:border-rose-400"
                                                                        placeholder="e.g. 500mg"
                                                                        value={order.dosage}
                                                                        onChange={e => updateOrderField(order.id, 'dosage', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[8px] font-black text-slate-400 uppercase">Frequency</label>
                                                                    <select 
                                                                        className="w-full bg-gray-50 border border-gray-200 rounded p-1.5 text-[10px] outline-none focus:border-rose-400"
                                                                        value={order.frequency}
                                                                        onChange={e => updateOrderField(order.id, 'frequency', e.target.value)}
                                                                    >
                                                                        <option>Once Daily</option>
                                                                        <option>Twice Daily</option>
                                                                        <option>Three Times Daily</option>
                                                                        <option>Four Times Daily</option>
                                                                        <option>As Needed (PRN)</option>
                                                                        <option>At Bedtime</option>
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[8px] font-black text-slate-400 uppercase">Duration</label>
                                                                    <input 
                                                                        type="text" 
                                                                        className="w-full bg-gray-50 border border-gray-200 rounded p-1.5 text-[10px] outline-none focus:border-rose-400"
                                                                        placeholder="e.g. 7 Days"
                                                                        value={order.duration}
                                                                        onChange={e => updateOrderField(order.id, 'duration', e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[8px] font-black text-slate-400 uppercase">Route</label>
                                                                    <select 
                                                                        className="w-full bg-gray-50 border border-gray-200 rounded p-1.5 text-[10px] outline-none focus:border-rose-400"
                                                                        value={order.route}
                                                                        onChange={e => updateOrderField(order.id, 'route', e.target.value)}
                                                                    >
                                                                        <option>Oral</option>
                                                                        <option>IV</option>
                                                                        <option>IM</option>
                                                                        <option>SC</option>
                                                                        <option>Topical</option>
                                                                        <option>Inhalation</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <input 
                                                                    type="text" 
                                                                    className="w-full bg-gray-50 border border-gray-200 rounded p-1.5 text-[10px] outline-none focus:border-indigo-400"
                                                                    placeholder="Clinical Notes..."
                                                                    value={order.instructions}
                                                                    onChange={e => updateOrderField(order.id, 'instructions', e.target.value)}
                                                                />
                                                            </div>
                                                        )}
                                                        
                                                        <div className="mt-2 flex items-center justify-between">
                                                            <label className="flex items-center space-x-1 cursor-pointer">
                                                                <input 
                                                                    type="checkbox" 
                                                                    className="rounded text-red-500 focus:ring-red-500 w-3 h-3"
                                                                    checked={order.urgency === 'Stat'}
                                                                    onChange={e => updateOrderUrgency(order.id, e.target.checked ? 'Stat' : 'Routine')}
                                                                />
                                                                <span className="text-[9px] font-bold text-gray-500 uppercase">Urgent</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                                            <div className="space-y-3 mb-4">
                                                <label className={labelStyle}>Management Plan / Advice</label>
                                                <textarea 
                                                    className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-medium h-20 outline-none resize-none focus:ring-1 focus:ring-indigo-500"
                                                    placeholder="Home care instructions, diet, follow-up..."
                                                    value={encounter.planNotes}
                                                    onChange={e => setEncounter({...encounter, planNotes: e.target.value})}
                                                ></textarea>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="flex-1 bg-white border border-gray-300 text-gray-600 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-gray-50">Save Draft</button>
                                                <button onClick={handleFinalize} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-[10px] font-black uppercase shadow-lg hover:bg-indigo-700">Sign & Commit</button>
                                            </div>
                                        </div>
                                    </div>
                                 </div>
                              </div>
                          )}
                      </div>
                  </div>

                  {/* Context-aware Floating Footer Action */}
                  <div className="p-4 bg-slate-900 border-t border-white/5 flex justify-between items-center shrink-0">
                      <div className="flex items-center space-x-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                         <span className="flex items-center"><i className="fa fa-fingerprint mr-2 text-indigo-500"></i> Authenticated MD Rounding</span>
                         <span className="flex items-center"><i className="fa fa-clock mr-2 text-indigo-500"></i> Session Time: 00:12:45</span>
                      </div>
                  </div>
               </>
           ) : (
               <div className="flex flex-col items-center justify-center h-full text-slate-200 py-32 text-center p-20 animate-in fade-in">
                  <div className="w-24 h-24 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-8 shadow-inner border border-slate-100"><i className="fa fa-stethoscope text-5xl opacity-10"></i></div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Clinical Desk Standby</h4>
                  <p className="text-[10px] font-bold text-slate-300 mt-2 uppercase max-w-xs leading-relaxed italic">Select a patient from the waiting list or use search to initiate an encounter record.</p>
               </div>
           )}
        </div>
      </div>

      <QueueModal isOpen={showQueueModal} onClose={() => setShowQueueModal(false)} patientName={activePatient?.surname} patientId={activePatient?.outpatientNo} />
    </div>
  );
};

export default Consultation;
