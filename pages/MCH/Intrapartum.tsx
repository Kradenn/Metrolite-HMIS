import React, { useState, useMemo } from 'react';
import { usePatient } from '../../context/PatientContext';
import { useNotification } from '../../context/NotificationContext';
import { GoogleGenAI } from "@google/genai";
import PatientSelectorModal from '../../components/PatientSelectorModal';
import QueueModal from '../../components/QueueModal';

interface LaborObservation {
    timestamp: string;
    fetalHeartRate: number;
    cervicalDilation: number;
    fetalDescent: number;
    contractions: number;
    contractionDuration: number;
    liquor: string;
    molding: number;
    maternalBP: string;
    maternalPulse: number;
}

const Intrapartum: React.FC = () => {
    const { activePatient, setActivePatient } = usePatient();
    const { notify } = useNotification();
    const [activeTab, setActiveTab] = useState<'parto' | 'emar' | 'birth' | 'neo'>('parto');
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [showQueueModal, setShowQueueModal] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiInsight, setAiInsight] = useState<string | null>(null);

    // Mock Labor Data
    const observations: LaborObservation[] = [
        { timestamp: '08:00', fetalHeartRate: 140, cervicalDilation: 4, fetalDescent: 4, contractions: 2, contractionDuration: 25, liquor: 'I', molding: 0, maternalBP: '120/80', maternalPulse: 72 },
        { timestamp: '10:00', fetalHeartRate: 145, cervicalDilation: 6, fetalDescent: 3, contractions: 3, contractionDuration: 35, liquor: 'C', molding: 1, maternalBP: '122/82', maternalPulse: 78 },
        { timestamp: '12:00', fetalHeartRate: 138, cervicalDilation: 8, fetalDescent: 2, contractions: 4, contractionDuration: 45, liquor: 'C', molding: 1, maternalBP: '120/80', maternalPulse: 80 }
    ];

    const runAiAudit = async () => {
        setIsAiLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: "Analyze labor progress: 8cm dilation, 138 FHR, 4 contractions/10m. Patient G2P1. 1 sentence assessment and 1 risk alert.",
                config: { systemInstruction: "You are a senior obstetrician." }
            });
            setAiInsight(response.text || "Normal progress.");
        } catch (e) {
            setAiInsight("AI Engine Offline.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const inputStyle = "w-full p-1.5 bg-white border border-slate-200 rounded text-[11px] font-bold text-slate-700 outline-none focus:border-rose-500 transition-all";
    const labelStyle = "block text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest";
    const sectionHeader = "text-[10px] font-black text-rose-600 uppercase border-b border-rose-50 pb-1 mb-4 flex justify-between";

    if (!activePatient) {
        return (
            <div className="animate-bottom min-h-[calc(100vh-140px)] bg-slate-50 flex flex-col items-center justify-center p-8 -m-4 md:-m-6">
                <PatientSelectorModal isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} filterType="mothers" title="Identify Mother" />
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-3xl mx-auto border border-rose-200 shadow-sm"><i className="fa fa-procedures"></i></div>
                    <div>
                        <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Labor Command Desk</h1>
                        <p className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Select an admitted mother to start tracking</p>
                    </div>
                    <button onClick={() => setIsSelectorOpen(true)} className="bg-rose-600 text-white px-10 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-rose-700 transition">Search Registry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-bottom flex flex-col h-[calc(100vh-100px)] -m-4 md:-m-6 bg-slate-50 overflow-hidden font-helvetica">
            <PatientSelectorModal isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} filterType="mothers" title="Switch Patient" />
            <QueueModal isOpen={showQueueModal} onClose={() => setShowQueueModal(false)} patientName={activePatient.surname} patientId={activePatient.outpatientNo} />

            {/* 1. SLIM HEADER */}
            <div className="bg-slate-900 h-14 shrink-0 flex items-center justify-between px-6 border-b border-white/5 z-20">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center text-white text-lg"><i className="fa fa-procedures text-sm"></i></div>
                        <div>
                            <h2 className="text-xs font-black text-white uppercase tracking-tight leading-none">{activePatient.surname}, {activePatient.othernames}</h2>
                            <p className="text-[8px] text-rose-400 font-bold uppercase mt-1">Bed: L-04 &bull; {activePatient.outpatientNo}</p>
                        </div>
                    </div>
                    <div className="h-6 w-px bg-white/10 hidden md:block"></div>
                    <div className="hidden md:flex gap-4 items-center">
                        <div className="flex flex-col"><span className="text-[8px] font-black text-slate-500 uppercase">Gestation</span><span className="text-[10px] font-bold text-white">38 Wks 2 Days</span></div>
                        <div className="flex flex-col"><span className="text-[8px] font-black text-slate-500 uppercase">Gravida/Para</span><span className="text-[10px] font-bold text-white">G2 P1</span></div>
                        <div className="flex flex-col"><span className="text-[8px] font-black text-slate-500 uppercase">Acuity</span><span className="text-[10px] font-black text-emerald-400">Stable</span></div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsSelectorOpen(true)} className="bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition">Switch</button>
                    <button onClick={() => setShowQueueModal(true)} className="bg-rose-600 text-white px-5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition">Clear Stage</button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                
                {/* 2. COMPACT SIDEBAR */}
                <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 p-3 space-y-3 shadow-inner">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2">
                        <div className="flex justify-between items-center"><span className="text-[9px] font-black text-slate-400 uppercase">Fetal Heart Rate</span><i className="fa fa-heartbeat text-rose-500 animate-pulse text-[10px]"></i></div>
                        <div className="flex items-baseline space-x-1"><span className="text-xl font-black text-slate-800 tracking-tighter">138</span><span className="text-[8px] font-bold text-slate-400 uppercase">BPM</span></div>
                    </div>
                    
                    <div className="bg-indigo-600 rounded-xl p-3 text-white shadow-lg space-y-2 relative overflow-hidden group">
                        <div className="flex justify-between items-center relative z-10">
                            <span className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">Clinical Audit</span>
                            <button onClick={runAiAudit} disabled={isAiLoading} className="bg-white/20 hover:bg-white/30 p-1 rounded transition-colors">{isAiLoading ? <i className="fa fa-spinner fa-spin text-[8px]"></i> : <i className="fa fa-robot text-[8px]"></i>}</button>
                        </div>
                        <div className="relative z-10">
                            {aiInsight ? (
                                <p className="text-[9px] font-medium leading-tight animate-in fade-in">{aiInsight}</p>
                            ) : (
                                <p className="text-[9px] text-indigo-100 italic opacity-80 leading-tight">Click robot for real-time labor assessment.</p>
                            )}
                        </div>
                        <i className="fa fa-brain absolute -right-3 -bottom-3 text-5xl text-white/5 group-hover:rotate-12 transition-transform"></i>
                    </div>

                    <div className="flex-1 space-y-3 pt-2">
                        <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-1">Quick Monitoring</h6>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100"><p className="text-[7px] font-black text-emerald-600 uppercase">Dilation</p><p className="text-xs font-black text-emerald-900">8cm</p></div>
                            <div className="p-2 bg-blue-50 rounded-lg border border-blue-100"><p className="text-[7px] font-black text-blue-600 uppercase">Station</p><p className="text-xs font-black text-blue-900">-1</p></div>
                            <div className="p-2 bg-purple-50 rounded-lg border border-purple-100"><p className="text-[7px] font-black text-purple-600 uppercase">Membranes</p><p className="text-xs font-black text-purple-900">Clear</p></div>
                            <div className="p-2 bg-orange-50 rounded-lg border border-orange-100"><p className="text-[7px] font-black text-orange-600 uppercase">Contract.</p><p className="text-xs font-black text-orange-900">4/10m</p></div>
                        </div>
                    </div>
                </div>

                {/* 3. WORKSPACE: TIGHT TABS & DATA */}
                <div className="flex-1 flex flex-col overflow-hidden bg-white">
                    {/* Minimal Tabs */}
                    <div className="flex border-b border-slate-100 bg-slate-50 px-4 shrink-0">
                        {[
                            { id: 'parto', label: 'Partograph', icon: 'fa-chart-area', color: 'text-rose-600' },
                            { id: 'emar', label: 'eMAR / Meds', icon: 'fa-pills', color: 'text-teal-600' },
                            { id: 'birth', label: 'Birth Record', icon: 'fa-baby', color: 'text-amber-600' },
                            { id: 'neo', label: 'Neonatal', icon: 'fa-child', color: 'text-blue-600' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${activeTab === tab.id ? `border-rose-600 ${tab.color} bg-white shadow-sm` : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                            >
                                <i className={`fa ${tab.icon} text-[9px]`}></i> {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                        {activeTab === 'parto' && (
                            <div className="animate-in fade-in duration-300 space-y-4">
                                {/* Compact Graph */}
                                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative group overflow-hidden">
                                    <div className="flex justify-between items-center mb-3">
                                        <h6 className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Active Phase Curve</h6>
                                        <span className="text-[8px] font-bold text-slate-300 italic uppercase">Auto-Plotting Active</span>
                                    </div>
                                    <div className="h-48 w-full">
                                        <svg viewBox="0 0 600 200" className="w-full h-full">
                                            {/* Simplified Grid */}
                                            {Array.from({length: 11}).map((_, i) => (
                                                <line key={i} x1="30" y1={180 - (i*16)} x2="570" y2={180 - (i*16)} stroke="#f8fafc" strokeWidth="1" />
                                            ))}
                                            {/* Alert/Action Lines */}
                                            <line x1="30" y1="116" x2="280" y2="20" stroke="#fecaca" strokeWidth="2" strokeDasharray="4" />
                                            <line x1="80" y1="116" x2="330" y2="20" stroke="#f87171" strokeWidth="2" />
                                            {/* Dilation Line */}
                                            <polyline points="30,116 100,84 170,52" fill="none" stroke="#4e0170" strokeWidth="3" strokeLinecap="round" />
                                            <circle cx="170" cy="52" r="4" fill="#4e0170" stroke="white" strokeWidth="2" />
                                        </svg>
                                    </div>
                                </div>

                                {/* High-Density Entry Form */}
                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 items-end">
                                        <div className="col-span-1"><label className={labelStyle}>Time</label><input type="time" className={inputStyle} defaultValue="12:00"/></div>
                                        <div className="col-span-1"><label className={labelStyle}>FHR (bpm)</label><input type="number" className={inputStyle} placeholder="140"/></div>
                                        <div className="col-span-1"><label className={labelStyle}>Dil. (cm)</label><input type="number" className={inputStyle} placeholder="0-10"/></div>
                                        <div className="col-span-1"><label className={labelStyle}>Desc.</label><select className={inputStyle}><option>5/5</option><option>4/5</option><option>3/5</option><option>2/5</option></select></div>
                                        <div className="col-span-1"><label className={labelStyle}>Liquor</label><select className={inputStyle}><option>Intact</option><option>Clear</option><option>Mecon.</option></select></div>
                                        <div className="col-span-1"><label className={labelStyle}>BP</label><input className={inputStyle} placeholder="120/80"/></div>
                                        <div className="col-span-1"><label className={labelStyle}>Pulse</label><input className={inputStyle} placeholder="72"/></div>
                                        <div className="col-span-1">
                                            <button onClick={() => notify('success', 'Plotted', 'Observation added to curve.')} className="w-full bg-[#4e0170] text-white h-[31px] rounded font-black text-[9px] uppercase tracking-widest shadow-lg active:scale-95 transition">Plot</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'emar' && (
                            <div className="animate-in fade-in duration-300 space-y-3">
                                <div className="bg-teal-50 border border-teal-100 p-2 rounded-xl flex items-center space-x-3">
                                    <i className="fa fa-info-circle text-teal-600 text-xs"></i>
                                    <p className="text-[9px] font-black text-teal-800 uppercase tracking-tight">Hourly oxytocin titration audits required for active augmentation.</p>
                                </div>
                                <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                                    <table className="w-full text-left text-[10px] border-collapse">
                                        <thead className="bg-slate-100 border-b border-slate-200 text-slate-500 font-black uppercase tracking-tight">
                                            <tr>
                                                <th className="px-4 py-2">Medication</th>
                                                <th className="px-4 py-2">Dose / Route</th>
                                                <th className="px-4 py-2">Sched.</th>
                                                <th className="px-4 py-2 text-center">Status</th>
                                                <th className="px-4 py-2 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {[
                                                { drug: 'Oxytocin', dose: '10 IU', route: 'IV Inf', time: '12:30 PM', status: 'Pending', color: 'text-blue-600 bg-blue-50' },
                                                { drug: 'Ampicillin', dose: '2g', route: 'IV', time: '08:00 AM', status: 'Given', color: 'text-emerald-600 bg-emerald-50' },
                                                { drug: 'Pethidine', dose: '100mg', route: 'IM', time: '10:15 AM', status: 'Given', color: 'text-emerald-600 bg-emerald-50' },
                                            ].map((med, i) => (
                                                <tr key={i} className="hover:bg-slate-50">
                                                    <td className="px-4 py-2 font-black text-slate-800 uppercase tracking-tight">{med.drug}</td>
                                                    <td className="px-4 py-2 font-bold text-slate-500">{med.dose} &bull; {med.route}</td>
                                                    <td className="px-4 py-2 font-mono font-bold text-indigo-600">{med.time}</td>
                                                    <td className="px-4 py-2 text-center">
                                                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${med.color}`}>{med.status}</span>
                                                    </td>
                                                    <td className="px-4 py-2 text-right">
                                                        <button onClick={() => notify('success', 'Administered', med.drug)} className="w-6 h-6 rounded bg-teal-600 text-white shadow hover:bg-teal-700 transition"><i className="fa fa-check text-[10px]"></i></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'birth' && (
                            <div className="animate-in slide-in-from-bottom-2 duration-300 max-w-4xl mx-auto py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <h6 className="text-[10px] font-black text-rose-600 uppercase border-b border-rose-50 pb-1">Stage 3 Outcome</h6>
                                        <div><label className={labelStyle}>Birth Date/Time</label><input type="datetime-local" className={inputStyle}/></div>
                                        <div>
                                            <label className={labelStyle}>Mode of Delivery</label>
                                            <select className={inputStyle}>
                                                <option>SVD</option><option>Vacuum</option><option>Forceps</option><option>Emergency CS</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h6 className={sectionHeader}>Maternal Outcome</h6>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className={labelStyle}>EBL (ml)</label><input type="number" className={inputStyle} placeholder="ml"/></div>
                                            <div><label className={labelStyle}>Placenta</label><select className={inputStyle}><option>Complete</option><option>Incomplete</option></select></div>
                                        </div>
                                        <div><label className={labelStyle}>Perineal State</label><input className={inputStyle} placeholder="Intact / Tear Grade..."/></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'neo' && (
                            <div className="animate-in slide-in-from-bottom-2 duration-300 max-w-4xl mx-auto py-4">
                                <div className="bg-sky-50 border border-sky-100 rounded-3xl p-6 shadow-sm">
                                    <h6 className="text-[10px] font-black text-sky-700 uppercase mb-6 border-b border-sky-200 pb-2">Immediate Newborn Care</h6>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <div><label className={labelStyle}>Weight (g)</label><input type="number" className={inputStyle} placeholder="e.g. 3200"/></div>
                                        <div><label className={labelStyle}>Sex</label><select className={inputStyle}><option>Male</option><option>Female</option></select></div>
                                        <div className="col-span-2">
                                            <label className={labelStyle}>APGAR (1 | 5 | 10)</label>
                                            <div className="flex gap-2">
                                                <input className={`${inputStyle} text-center font-black`} placeholder="1m"/>
                                                <input className={`${inputStyle} text-center font-black`} placeholder="5m"/>
                                                <input className={`${inputStyle} text-center font-black`} placeholder="10m"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-sky-100 pt-6">
                                        <label className="flex items-center space-x-3 p-3 bg-white rounded-2xl border border-sky-100 cursor-pointer hover:bg-sky-50 transition-colors">
                                            <input type="checkbox" className="w-4 h-4 rounded text-sky-600 focus:ring-0" />
                                            <span className="text-[10px] font-black text-slate-600 uppercase">Vitamin K Administered</span>
                                        </label>
                                        <label className="flex items-center space-x-3 p-3 bg-white rounded-2xl border border-sky-100 cursor-pointer hover:bg-sky-50 transition-colors">
                                            <input type="checkbox" className="w-4 h-4 rounded text-sky-600 focus:ring-0" />
                                            <span className="text-[10px] font-black text-slate-600 uppercase">Eye Prophylaxis Done</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Floating Signature / Context Bar */}
                    <div className="h-10 bg-slate-900 border-t border-white/5 px-6 flex items-center justify-between shrink-0">
                        <div className="flex items-center space-x-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            <span className="flex items-center"><i className="fa fa-fingerprint mr-2 text-rose-500"></i> Authenticated: Nurse Emily</span>
                            <span className="flex items-center"><i className="fa fa-history mr-2 text-rose-500"></i> Session Duration: 04:22:15</span>
                        </div>
                        <div className="flex items-center space-x-2 text-[9px] font-black text-white uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Cloud Sync Enabled</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Intrapartum;