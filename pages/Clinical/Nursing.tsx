
import React, { useState, useMemo, useEffect } from 'react';
import { usePatient, PatientRecord } from '../../context/PatientContext';
import { useNotification } from '../../context/NotificationContext';
import { 
    Activity, 
    ClipboardList, 
    Pill, 
    Stethoscope, 
    MessageSquare, 
    Plus, 
    Search, 
    ChevronRight, 
    Clock, 
    AlertCircle, 
    CheckCircle2, 
    User,
    FileText,
    Thermometer,
    Droplets,
    Brain,
    Scale,
    Utensils,
    Syringe,
    ArrowRightLeft,
    FileEdit
} from 'lucide-react';
import { 
    GeneralObservationChart, 
    NeurologicalObservationChart, 
    AdmissionCardex, 
    ComprehensiveFirstAssessment, 
    FluidIOChart, 
    InpatientFeedingChart, 
    TransfusionChart, 
    BloodSugarChart, 
    NutritionAssessment, 
    PreOpChecklist, 
    ContinuationNotes, 
    BedTransfer 
} from './Nursing/NursingModals';
import { GoogleGenAI } from "@google/genai";
import DictationButton from '../../components/DictationButton';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Interfaces ---
interface NursingPatient {
    id: string;
    name: string;
    room: string;
    acuity: 1 | 2 | 3 | 4 | 5;
    reason: string;
    lastChecked: string;
    diagnosis?: string;
}

interface MedicationTask {
    id: number;
    drug: string;
    dose: string;
    route: string;
    time: string;
    status: 'Pending' | 'Given' | 'Missed';
    stock: number;
}

interface SBAR {
    situation: string;
    background: string;
    assessment: string;
    recommendation: string;
}

interface IOEntry {
    time: string;
    category: 'Input' | 'Output';
    type: string;
    volume: number;
    route: string;
}

const ChartButton: React.FC<{ icon: React.ReactNode, title: string, description: string, onClick: () => void }> = ({ icon, title, description, onClick }) => (
    <button 
        onClick={onClick}
        className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all group text-left"
    >
        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-emerald-50 transition-colors">
            {icon}
        </div>
        <div>
            <h4 className="text-sm font-bold text-slate-700">{title}</h4>
            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{description}</p>
        </div>
    </button>
);

const Nursing: React.FC = () => {
    const { activePatient, setActivePatient } = usePatient();
    const { notify } = useNotification();
    const [activeTab, setActiveTab] = useState<'charts' | 'notes' | 'emar' | 'careplan' | 'vitals'>('charts');
    
    // --- State for Clinical Data ---
    const [noteText, setNoteText] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiCareAdvice, setAiCareAdvice] = useState<string | null>(null);

    // --- Modal States ---
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [showRRModal, setShowRRModal] = useState(false);

    // --- I/O Tracking State ---
    const [ioTab, setIoTab] = useState<'input' | 'output'>('input');
    const [ioForm, setIoForm] = useState({ type: '', volume: '', route: 'Oral' });
    const [ioHistory, setIoHistory] = useState<IOEntry[]>([
        { time: '08:00', category: 'Input', type: 'Normal Saline', volume: 500, route: 'IV' },
        { time: '09:30', category: 'Output', type: 'Urine', volume: 350, route: 'Catheter' },
        { time: '10:00', category: 'Input', type: 'Tea', volume: 200, route: 'Oral' },
    ]);

    // --- Rapid Response State ---
    const [rrReason, setRrReason] = useState('Cardiac Arrest');

    const [sbar, setSbar] = useState<SBAR>({
        situation: '',
        background: '',
        assessment: '',
        recommendation: ''
    });

    const [medicationTasks, setMedicationTasks] = useState<MedicationTask[]>([
        { id: 1, drug: 'Ceftriaxone', dose: '1g', route: 'IV', time: '10:00 AM', status: 'Pending', stock: 24 },
        { id: 2, drug: 'Paracetamol', dose: '1g', route: 'Oral', time: '10:00 AM', status: 'Given', stock: 500 },
        { id: 3, drug: 'Enoxaparin', dose: '40mg', route: 'SC', time: '08:00 AM', status: 'Given', stock: 12 },
        { id: 4, drug: 'Metronidazole', dose: '500mg', route: 'IV', time: '02:00 PM', status: 'Pending', stock: 8 },
        { id: 5, drug: 'Pantoprazole', dose: '40mg', route: 'IV', time: '06:00 AM', status: 'Missed', stock: 30 },
    ]);

    const [carePlan, setCarePlan] = useState([
        { id: 1, goal: 'Maintain SpO2 > 94%', intervention: 'Monitor O2 saturation q4h', status: 'Active' },
        { id: 2, goal: 'Pain Control < 3/10', intervention: 'Administer analgesics as prescribed', status: 'Active' },
        { id: 3, goal: 'Prevent DVT', intervention: 'Encourage ambulation tid', status: 'Completed' },
    ]);

    const vitalsData = [
        { time: '08:00', hr: 72, sbp: 120, dbp: 80, temp: 36.5, rr: 18, spo2: 98 },
        { time: '10:00', hr: 75, sbp: 122, dbp: 82, temp: 36.7, rr: 19, spo2: 97 },
        { time: '12:00', hr: 78, sbp: 125, dbp: 85, temp: 36.8, rr: 20, spo2: 99 },
        { time: '14:00', hr: 74, sbp: 118, dbp: 78, temp: 36.6, rr: 18, spo2: 98 },
        { time: '16:00', hr: 76, sbp: 121, dbp: 80, temp: 36.7, rr: 19, spo2: 97 },
    ];

    const nursingQueue: NursingPatient[] = [
        { id: 'IP-001', name: 'JANE DOE', room: 'GW-101A', acuity: 2, reason: 'Post-Op Monitoring', lastChecked: '10m ago', diagnosis: 'Post-Appendectomy' },
        { id: 'IP-042', name: 'JOHN SMITH', room: 'PW-205', acuity: 3, reason: 'IV Antibiotics', lastChecked: '1h ago', diagnosis: 'Pneumonia' },
        { id: 'IP-115', name: 'MARY ANN', room: 'ICU-03', acuity: 1, reason: 'Critical Resp.', lastChecked: '5m ago', diagnosis: 'ARDS' },
        { id: 'IP-201', name: 'ROBERT BARATHEON', room: 'GW-102B', acuity: 4, reason: 'Physio Rehab', lastChecked: '2h ago', diagnosis: 'Hip Replacement' },
    ];

    // --- Computed I/O Stats ---
    const ioStats = useMemo(() => {
        const input = ioHistory.filter(i => i.category === 'Input').reduce((acc, curr) => acc + curr.volume, 0);
        const output = ioHistory.filter(i => i.category === 'Output').reduce((acc, curr) => acc + curr.volume, 0);
        return { input, output, balance: input - output };
    }, [ioHistory]);

    const getAcuityStyle = (level: number) => {
        switch(level) {
            case 1: return 'bg-red-600 text-white border-red-700'; // Resuscitation
            case 2: return 'bg-orange-500 text-white border-orange-600'; // Emergent
            case 3: return 'bg-yellow-400 text-black border-yellow-500'; // Urgent
            case 4: return 'bg-green-500 text-white border-green-600'; // Standard
            default: return 'bg-blue-500 text-white border-blue-600'; // Non-urgent
        }
    };

    const handleSelectPatient = (p: NursingPatient) => {
        const names = p.name.split(' ');
        setActivePatient({
            id: p.id,
            surname: names[1] || names[0],
            othernames: names[0],
            age: 30, 
            gender: 'Female', 
            scheme: 'CASH',
            outpatientNo: p.id,
            telephone: '0700000000',
            status: 'Admitted',
            diagnosis: p.diagnosis
        });
        setNoteText('');
        setAiCareAdvice(null);
    };

    const handleMedAction = (taskId: number, newStatus: 'Given' | 'Missed' | 'Pending') => {
        const task = medicationTasks.find(t => t.id === taskId);
        if (!task) return;
        if (newStatus === 'Given' && task.stock <= 0) {
            notify('error', 'Inventory Error', `Drug ${task.drug} is out of stock.`);
            return;
        }
        setMedicationTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus, stock: newStatus === 'Given' ? t.stock - 1 : t.stock } : t));
        notify(newStatus === 'Given' ? 'success' : 'info', 'eMAR Updated', `${task.drug} marked as ${newStatus.toLowerCase()}.`);
    };

    const toggleCarePlan = (id: number) => {
        setCarePlan(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'Active' ? 'Completed' : 'Active' } : p));
    };

    const handleSave = (section: string) => {
        notify('success', 'Record Saved', `${section} has been committed to the patient chart.`);
    };

    const handleIoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ioForm.volume || !ioForm.type) return;
        
        const newEntry: IOEntry = {
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            category: ioTab === 'input' ? 'Input' : 'Output',
            type: ioForm.type,
            volume: parseInt(ioForm.volume),
            route: ioTab === 'input' ? ioForm.route : '-'
        };
        
        setIoHistory([newEntry, ...ioHistory]);
        setIoForm({ ...ioForm, volume: '' }); // Keep type/route for ease of entry
        notify('success', 'Fluid Recorded', `${ioTab === 'input' ? 'Intake' : 'Output'} of ${newEntry.volume}ml logged.`);
    };

    const handleRRTActivate = () => {
        notify('success', 'EMERGENCY TEAM ACTIVATED', `Code Blue triggered for ${activePatient?.surname}. Team dispatched to GW-101A.`, false);
        setShowRRModal(false);
    };

    const getAiClinicalAssistant = async () => {
        if (!activePatient) return;
        setIsAiLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Act as a Senior Clinical Nurse Specialist. 
            Patient: ${activePatient.surname}, Age: ${activePatient.age}, Gender: ${activePatient.gender}. 
            Diagnosis: ${activePatient.diagnosis || 'General Observation'}.
            Provide 3 specific nursing interventions for this shift and a brief alert on potential complications to watch for. 
            Format: High-density bullet points.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { systemInstruction: "Be clinical, concise, and prioritize patient safety." }
            });
            setAiCareAdvice(response.text || "Advice currently unavailable.");
        } catch (e) {
            setAiCareAdvice("AI Assistant is offline. Please refer to standard protocols.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const inputClass = "w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-600 transition-all shadow-inner";
    const labelClass = "block text-[9px] font-black text-slate-500 uppercase px-1 mb-1 tracking-widest";

    return (
        <div className="animate-bottom h-[calc(100vh-100px)] flex flex-col font-helvetica overflow-hidden bg-slate-50 -m-4 md:-m-6">
            
            {/* 1. Header: Compact Clinical Context */}
            <div className="bg-slate-900 border-l-[6px] border-l-sky-600 p-3 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800 shrink-0 shadow-lg relative z-20">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-sky-600 text-white rounded-none flex items-center justify-center text-xl shadow-lg">
                        <i className="fa fa-user-nurse"></i>
                    </div>
                    {activePatient ? (
                        <div>
                            <div className="flex items-center space-x-3">
                                <h2 className="text-sm font-black text-white uppercase tracking-tighter leading-none">{activePatient.surname}, {activePatient.othernames}</h2>
                                <span className={`px-2 py-0.5 rounded-none text-[8px] font-black uppercase border ${getAcuityStyle(2)}`}>Level 2 - Emergent</span>
                            </div>
                            <p className="text-[9px] text-sky-400 font-bold uppercase tracking-widest mt-1">Room: GW-101A &bull; ID: {activePatient.outpatientNo}</p>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-sm font-black text-white uppercase tracking-tighter leading-none">Nursing Command Desk</h2>
                            <p className="text-[8px] text-sky-400 font-bold uppercase tracking-widest mt-1">Select Patient to Begin Rounding</p>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => setActiveModal('handover')} 
                        disabled={!activePatient}
                        className="bg-white/10 hover:bg-white/20 text-white px-5 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest border border-white/5 disabled:opacity-50 transition"
                    >
                        Handover
                    </button>
                    <button 
                        onClick={() => setShowRRModal(true)} 
                        disabled={!activePatient}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-900/50 disabled:opacity-50 animate-pulse transition"
                    >
                        Rapid Response
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden min-h-0">
                
                {/* 2. Sidebar Queue: Acuity & Last Round Timer */}
                <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
                    <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ward Census</h6>
                        <span className="bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded-none font-black">{nursingQueue.length} Active</span>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-hide">
                        {nursingQueue.map(p => (
                            <div 
                                key={p.id} 
                                onClick={() => handleSelectPatient(p)}
                                className={`p-4 cursor-pointer transition-all border-l-4 ${activePatient?.outpatientNo === p.id ? 'bg-sky-50 border-l-sky-600 shadow-inner' : 'hover:bg-gray-50 border-l-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`px-2 py-0.5 rounded-none text-[8px] font-black uppercase border ${getAcuityStyle(p.acuity)}`}>Lvl {p.acuity}</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase">{p.room}</span>
                                </div>
                                <h6 className="text-xs font-black text-slate-800 uppercase truncate mb-1">{p.name}</h6>
                                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-tighter">
                                    <span className="text-slate-400">Last Round: <span className="text-sky-600">{p.lastChecked}</span></span>
                                    {p.id === 'IP-115' && <i className="fa fa-heartbeat text-red-500 animate-pulse"></i>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Main Clinical Workspace */}
                <div className="flex-1 flex flex-col overflow-hidden bg-white">
                    {activePatient ? (
                        <>
                            {/* Workflow Tabs */}
                            <div className="bg-slate-100 border-b border-slate-200 flex shrink-0">
                                {[
                                    { id: 'charts', label: 'Clinical Charts', icon: 'fa-clipboard-list' },
                                    { id: 'notes', label: 'Progress Notes', icon: 'fa-file-medical' },
                                    { id: 'vitals', label: 'Vitals Chart', icon: 'fa-heartbeat' },
                                    { id: 'emar', label: 'eMAR / Meds', icon: 'fa-pills' },
                                    { id: 'careplan', label: 'Nursing Plan', icon: 'fa-clipboard-check' },
                                ].map(tab => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${activeTab === tab.id ? 'bg-white text-sky-600 border-b-sky-600 shadow-sm' : 'text-slate-400 border-b-transparent hover:text-slate-600'}`}
                                    >
                                        <i className={`fa ${tab.icon} text-[9px]`}></i> {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                                {/* ... [Rest of the tab content remains same, structural styling is fine] ... */}
                                {/* Placeholder for brevity - standard content rendering logic */}
                                {activeTab === 'notes' && (
                                    <div className="animate-in fade-in duration-300 space-y-6 max-w-5xl">
                                        <div className="flex justify-between items-center bg-sky-50 border border-sky-100 p-4 rounded-none">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white border border-sky-200 rounded-none flex items-center justify-center text-sky-600 shadow-sm">
                                                    <i className="fa fa-info-circle"></i>
                                                </div>
                                                <div>
                                                    <h6 className="text-[10px] font-black text-sky-800 uppercase tracking-widest">Entry: Active Round</h6>
                                                    <p className="text-[9px] text-sky-600 font-bold uppercase mt-1">Shift Time: 07:00 - 19:00 &bull; Nurse: John Doe</p>
                                                </div>
                                            </div>
                                            <DictationButton onTranscript={(t) => setNoteText(prev => prev + ' ' + t)} />
                                        </div>

                                        <textarea 
                                            value={noteText}
                                            onChange={(e) => setNoteText(e.target.value)}
                                            className="w-full h-96 p-6 bg-slate-50 border border-slate-200 rounded-none text-xs font-semibold text-slate-800 outline-none focus:ring-1 focus:ring-sky-500 shadow-inner resize-none leading-relaxed"
                                            placeholder="Start typing clinical progress, wound assessments, and general observations..."
                                        ></textarea>

                                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                            <button className="bg-white border border-slate-300 text-slate-500 px-6 py-2 rounded-none text-[10px] font-black uppercase tracking-widest">Save Draft</button>
                                            <button onClick={() => handleSave('Notes')} className="bg-sky-600 text-white px-10 py-2 rounded-none text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-sky-700 transition">Finalize Note</button>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'vitals' && (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96">
                                            <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Vital Signs Trend</h6>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={vitalsData}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                                                    <Line type="monotone" dataKey="hr" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Heart Rate" />
                                                    <Line type="monotone" dataKey="sbp" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Systolic BP" />
                                                    <Line type="monotone" dataKey="dbp" stroke="#60a5fa" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Diastolic BP" />
                                                    <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Temp (°C)" />
                                                    <Line type="monotone" dataKey="spo2" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="SpO2 (%)" />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="grid grid-cols-5 gap-4">
                                            {vitalsData.slice(-1).map((v, i) => (
                                                <React.Fragment key={i}>
                                                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                                                        <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">Heart Rate</p>
                                                        <p className="text-2xl font-black text-red-600">{v.hr} <span className="text-xs">bpm</span></p>
                                                    </div>
                                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                                                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">BP</p>
                                                        <p className="text-2xl font-black text-blue-600">{v.sbp}/{v.dbp} <span className="text-xs">mmHg</span></p>
                                                    </div>
                                                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                                                        <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Temp</p>
                                                        <p className="text-2xl font-black text-orange-600">{v.temp} <span className="text-xs">°C</span></p>
                                                    </div>
                                                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center">
                                                        <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">SpO2</p>
                                                        <p className="text-2xl font-black text-emerald-600">{v.spo2} <span className="text-xs">%</span></p>
                                                    </div>
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Resp Rate</p>
                                                        <p className="text-2xl font-black text-slate-600">{v.rr} <span className="text-xs">/min</span></p>
                                                    </div>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'emar' && (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                            <table className="w-full text-left text-xs">
                                                <thead className="bg-slate-50 border-b border-slate-200">
                                                    <tr>
                                                        <th className="px-6 py-4 font-black text-slate-500 uppercase tracking-widest text-[9px]">Medication</th>
                                                        <th className="px-6 py-4 font-black text-slate-500 uppercase tracking-widest text-[9px]">Dose / Route</th>
                                                        <th className="px-6 py-4 font-black text-slate-500 uppercase tracking-widest text-[9px]">Scheduled</th>
                                                        <th className="px-6 py-4 font-black text-slate-500 uppercase tracking-widest text-[9px]">Stock Level</th>
                                                        <th className="px-6 py-4 font-black text-slate-500 uppercase tracking-widest text-[9px] text-right">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {medicationTasks.map(task => (
                                                        <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-6 py-4 font-bold text-slate-700">{task.drug}</td>
                                                            <td className="px-6 py-4 text-slate-500 font-medium">{task.dose} &bull; {task.route}</td>
                                                            <td className="px-6 py-4 text-slate-500 font-mono">{task.time}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${task.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                                    {task.stock} Units
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right space-x-2">
                                                                {task.status === 'Pending' ? (
                                                                    <>
                                                                        <button onClick={() => handleMedAction(task.id, 'Given')} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-sm">Give</button>
                                                                        <button onClick={() => handleMedAction(task.id, 'Missed')} className="bg-white border border-slate-200 text-slate-500 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition">Skip</button>
                                                                    </>
                                                                ) : (
                                                                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${task.status === 'Given' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                                        {task.status}
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'careplan' && (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        <div className="flex justify-between items-center">
                                            <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Nursing Interventions</h6>
                                            <button onClick={getAiClinicalAssistant} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-purple-700 transition flex items-center gap-2">
                                                <i className="fa fa-robot"></i> {isAiLoading ? 'Analyzing...' : 'AI Care Assistant'}
                                            </button>
                                        </div>

                                        {aiCareAdvice && (
                                             <div className="bg-purple-50 border border-purple-100 p-6 rounded-xl animate-in slide-in-from-top-4">
                                                 <div className="flex items-start gap-4">
                                                     <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center shrink-0">
                                                         <i className="fa fa-sparkles"></i>
                                                     </div>
                                                     <div>
                                                         <h6 className="text-[10px] font-black text-purple-800 uppercase tracking-widest mb-2">AI Clinical Recommendations</h6>
                                                         <div className="text-xs text-purple-900 leading-relaxed whitespace-pre-line font-medium">
                                                             {aiCareAdvice}
                                                         </div>
                                                     </div>
                                                 </div>
                                             </div>
                                        )}

                                        <div className="grid grid-cols-1 gap-4">
                                            {carePlan.map(plan => (
                                                <div key={plan.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center hover:border-sky-200 transition-all group">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                             <span className={`w-2 h-2 rounded-full ${plan.status === 'Active' ? 'bg-sky-500' : 'bg-emerald-500'}`}></span>
                                                             <h6 className="text-xs font-black text-slate-800 uppercase tracking-tight">{plan.goal}</h6>
                                                        </div>
                                                        <p className="text-xs text-slate-500 font-medium pl-5">{plan.intervention}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest ${plan.status === 'Active' ? 'bg-sky-50 text-sky-600' : 'bg-emerald-50 text-emerald-600'}`}>{plan.status}</span>
                                                        <button onClick={() => toggleCarePlan(plan.id)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${plan.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-400 hover:bg-sky-50 hover:text-sky-600'}`}>
                                                            <i className="fa fa-check"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'charts' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            <ChartButton 
                                                icon={<Activity className="w-5 h-5 text-emerald-600" />}
                                                title="General Observation"
                                                description="Vitals, Pain, Sedation, Glucose"
                                                onClick={() => setActiveModal('general_obs')}
                                            />
                                            <ChartButton 
                                                icon={<Brain className="w-5 h-5 text-purple-600" />}
                                                title="Neurological Obs"
                                                description="GCS, Limb Strength, Pupils"
                                                onClick={() => setActiveModal('neuro_obs')}
                                            />
                                            <ChartButton 
                                                icon={<FileText className="w-5 h-5 text-blue-600" />}
                                                title="Admission Cardex"
                                                description="History, Physical Exam, Allergies"
                                                onClick={() => setActiveModal('admission_cardex')}
                                            />
                                            <ChartButton 
                                                icon={<Stethoscope className="w-5 h-5 text-teal-600" />}
                                                title="First Assessment"
                                                description="Comprehensive initial evaluation"
                                                onClick={() => setActiveModal('first_assessment')}
                                            />
                                            <ChartButton 
                                                icon={<Droplets className="w-5 h-5 text-sky-600" />}
                                                title="Fluid Intake/Output"
                                                description="IV, Oral, NG tracking"
                                                onClick={() => setActiveModal('fluid_io')}
                                            />
                                            <ChartButton 
                                                icon={<Utensils className="w-5 h-5 text-orange-600" />}
                                                title="Feeding Chart"
                                                description="Inpatient nutritional tracking"
                                                onClick={() => setActiveModal('feeding')}
                                            />
                                            <ChartButton 
                                                icon={<Syringe className="w-5 h-5 text-red-600" />}
                                                title="Blood Transfusion"
                                                description="Unit tracking, symptoms, rate"
                                                onClick={() => setActiveModal('transfusion')}
                                            />
                                            <ChartButton 
                                                icon={<Thermometer className="w-5 h-5 text-rose-600" />}
                                                title="Blood Sugar Monitoring"
                                                description="Glucose levels & sample types"
                                                onClick={() => setActiveModal('blood_sugar')}
                                            />
                                            <ChartButton 
                                                icon={<Scale className="w-5 h-5 text-amber-600" />}
                                                title="Nutrition Assessment"
                                                description="MUAC, BMI, Z-Score, Macros"
                                                onClick={() => setActiveModal('nutrition')}
                                            />
                                            <ChartButton 
                                                icon={<ClipboardList className="w-5 h-5 text-indigo-600" />}
                                                title="Theatre Pre-Op"
                                                description="Checklist, Starvation, Consent"
                                                onClick={() => setActiveModal('pre_op')}
                                            />
                                            <ChartButton 
                                                icon={<FileEdit className="w-5 h-5 text-slate-600" />}
                                                title="Continuation Notes"
                                                description="Clinical notes & Doctor's orders"
                                                onClick={() => setActiveModal('continuation')}
                                            />
                                            <ChartButton 
                                                icon={<ArrowRightLeft className="w-5 h-5 text-cyan-600" />}
                                                title="Bed Transfer"
                                                description="Ward/Bed movement & reasons"
                                                onClick={() => setActiveModal('bed_transfer')}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                         <div className="flex-1 flex flex-col items-center justify-center p-20 text-center bg-gray-50/50">
                            <div className="w-24 h-24 bg-white border border-slate-200 rounded-none flex items-center justify-center mb-8 shadow-inner group">
                                <i className="fa fa-user-nurse text-5xl text-slate-200 group-hover:text-sky-300 transition-colors"></i>
                            </div>
                            <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">Clinical Dashboard Standby</h3>
                            <p className="max-w-xs text-[10px] text-slate-400 font-bold uppercase mt-2 leading-relaxed opacity-60">Identify a patient from the ward census list to begin clinical rounding and documentation.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODALS --- */}
            <GeneralObservationChart 
                isOpen={activeModal === 'general_obs'} 
                onClose={() => setActiveModal(null)} 
                patientName={activePatient?.surname || 'Patient'} 
            />
            <NeurologicalObservationChart 
                isOpen={activeModal === 'neuro_obs'} 
                onClose={() => setActiveModal(null)} 
                patientName={activePatient?.surname || 'Patient'} 
            />
            <AdmissionCardex 
                isOpen={activeModal === 'admission_cardex'} 
                onClose={() => setActiveModal(null)} 
                patientName={activePatient?.surname || 'Patient'} 
            />
            <ComprehensiveFirstAssessment 
                isOpen={activeModal === 'first_assessment'} 
                onClose={() => setActiveModal(null)} 
                patientName={activePatient?.surname || 'Patient'} 
            />
            <FluidIOChart 
                isOpen={activeModal === 'fluid_io'} 
                onClose={() => setActiveModal(null)} 
                patientName={activePatient?.surname || 'Patient'} 
            />
            <InpatientFeedingChart 
                isOpen={activeModal === 'feeding'} 
                onClose={() => setActiveModal(null)} 
                patientName={activePatient?.surname || 'Patient'} 
            />
            <TransfusionChart 
                isOpen={activeModal === 'transfusion'} 
                onClose={() => setActiveModal(null)} 
                patientName={activePatient?.surname || 'Patient'} 
            />
            <BloodSugarChart 
                isOpen={activeModal === 'blood_sugar'} 
                onClose={() => setActiveModal(null)} 
                patientName={activePatient?.surname || 'Patient'} 
            />
            <NutritionAssessment 
                isOpen={activeModal === 'nutrition'} 
                onClose={() => setActiveModal(null)} 
                patientName={activePatient?.surname || 'Patient'} 
            />
            <PreOpChecklist 
                isOpen={activeModal === 'pre_op'} 
                onClose={() => setActiveModal(null)} 
                patientName={activePatient?.surname || 'Patient'} 
            />
            <ContinuationNotes 
                isOpen={activeModal === 'continuation'} 
                onClose={() => setActiveModal(null)} 
                patientName={activePatient?.surname || 'Patient'} 
            />
            <BedTransfer 
                isOpen={activeModal === 'bed_transfer'} 
                onClose={() => setActiveModal(null)} 
                patientName={activePatient?.surname || 'Patient'} 
            />

            {/* Handover (SBAR) Modal */}
            {activeModal === 'handover' && activePatient && (
                <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-slate-900 text-white p-6 flex justify-between items-center shrink-0">
                            <div>
                                <h6 className="text-lg font-black uppercase tracking-tight">SBAR Handover Protocol</h6>
                                <p className="text-[10px] text-sky-400 font-bold uppercase tracking-widest mt-1">Shift Transfer Documentation • {activePatient.surname}</p>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="text-white/50 hover:text-white transition-colors"><i className="fa fa-times text-2xl"></i></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span className="w-6 h-6 rounded bg-sky-100 text-sky-600 flex items-center justify-center">S</span> Situation
                                    </label>
                                    <textarea 
                                        value={sbar.situation} 
                                        onChange={e => setSbar({...sbar, situation: e.target.value})}
                                        className="w-full h-32 p-4 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all resize-none shadow-sm"
                                        placeholder="Current situation, reason for admission, recent changes..."
                                    ></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span className="w-6 h-6 rounded bg-orange-100 text-orange-600 flex items-center justify-center">B</span> Background
                                    </label>
                                    <textarea 
                                        value={sbar.background} 
                                        onChange={e => setSbar({...sbar, background: e.target.value})}
                                        className="w-full h-32 p-4 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none shadow-sm"
                                        placeholder="Relevant history, allergies, comorbidities..."
                                    ></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span className="w-6 h-6 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">A</span> Assessment
                                    </label>
                                    <textarea 
                                        value={sbar.assessment} 
                                        onChange={e => setSbar({...sbar, assessment: e.target.value})}
                                        className="w-full h-32 p-4 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none shadow-sm"
                                        placeholder="Current vitals, lab results, physical exam findings..."
                                    ></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span className="w-6 h-6 rounded bg-purple-100 text-purple-600 flex items-center justify-center">R</span> Recommendation
                                    </label>
                                    <textarea 
                                        value={sbar.recommendation} 
                                        onChange={e => setSbar({...sbar, recommendation: e.target.value})}
                                        className="w-full h-32 p-4 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none shadow-sm"
                                        placeholder="Plan of care, pending tasks, discharge planning..."
                                    ></textarea>
                                </div>
                            </div>
                            <div className="flex justify-end pt-6 border-t border-slate-200">
                                <button onClick={() => { handleSave('SBAR Handover'); setActiveModal(null); }} className="bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition transform active:scale-95">
                                    Sign & Commit Handover
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Rapid Response Modal - UPDATED DESIGN */}
            {showRRModal && activePatient && (
                <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border-2 border-red-600 overflow-hidden animate-in zoom-in-95 duration-200 text-white relative">
                        {/* Background Pulse */}
                        <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none"></div>
                        <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none"><i className="fa fa-notes-medical text-9xl transform -rotate-12"></i></div>
                        
                        <div className="p-10 relative z-10 text-center">
                            <div className="w-24 h-24 bg-red-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(220,38,38,0.5)] animate-bounce border-4 border-slate-900">
                                <i className="fa fa-heart-crack text-5xl"></i>
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tight text-red-500 mb-2">Emergency Activation</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">Confirm Code Blue Protocol Initiation</p>
                            
                            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl mb-8 text-left backdrop-blur-sm">
                                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Target Patient</p>
                                <p className="text-lg font-bold text-white uppercase">{activePatient.surname}, {activePatient.othernames}</p>
                                <p className="text-xs text-slate-400 font-mono mt-1">LOC: GW-101A &bull; ID: {activePatient.outpatientNo}</p>
                            </div>

                            <div className="space-y-4 text-left">
                                <label className="block text-[10px] font-black text-red-400 uppercase tracking-widest">Primary Reason</label>
                                <select 
                                    value={rrReason} 
                                    onChange={e => setRrReason(e.target.value)}
                                    className="w-full p-4 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold outline-none focus:border-red-500 transition-colors uppercase text-xs shadow-inner"
                                >
                                    <option>Cardiac Arrest</option>
                                    <option>Respiratory Failure</option>
                                    <option>Seizure (Status Epilepticus)</option>
                                    <option>Severe Sepsis / Shock</option>
                                    <option>Stroke Protocol</option>
                                    <option>Massive Hemorrhage</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-10">
                                <button onClick={() => setShowRRModal(false)} className="py-4 rounded-xl border border-slate-700 text-slate-400 font-black text-xs uppercase hover:bg-slate-800 hover:text-white transition">Cancel Alert</button>
                                <button onClick={handleRRTActivate} className="py-4 rounded-xl bg-red-600 text-white font-black text-xs uppercase shadow-xl shadow-red-900/50 hover:bg-red-500 transition transform active:scale-95">Activate Team</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Nursing;
