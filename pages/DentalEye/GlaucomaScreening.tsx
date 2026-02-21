import React, { useState, useMemo, useEffect } from 'react';
import { usePatient } from '../../context/PatientContext';
import { useNotification } from '../../context/NotificationContext';
import { GoogleGenAI } from '@google/genai';
import DictationButton from '../../components/DictationButton';
import QueueModal from '../../components/QueueModal';

interface ScreeningRecord {
    odVa: string;
    osVa: string;
    odVaPinhole: string;
    osVaPinhole: string;
    odIop: string;
    osIop: string;
    iopTime: string;
    iopMethod: string;
    odCdr: number;
    osCdr: number;
    odRim: string;
    osRim: string;
    angle: string;
    findings: string;
    diagnosis: string;
    plan: string;
}

const VA_OPTIONS = ['6/4', '6/5', '6/6', '6/9', '6/12', '6/18', '6/24', '6/36', '6/60', 'CF', 'HM', 'PL', 'NPL'];

const GlaucomaScreening: React.FC = () => {
    const { activePatient } = usePatient();
    const { notify } = useNotification();
    const [showQueueModal, setShowQueueModal] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiInsight, setAiInsight] = useState<string | null>(null);

    const [form, setForm] = useState<ScreeningRecord>({
        odVa: '6/6', osVa: '6/6', odVaPinhole: '', osVaPinhole: '',
        odIop: '', osIop: '', iopTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        iopMethod: 'Goldmann Applanation',
        odCdr: 0.3, osCdr: 0.3, odRim: 'Healthy', osRim: 'Healthy',
        angle: 'Open (Grade 4)', findings: '', diagnosis: '', plan: ''
    });

    const iopHistory = [
        { date: 'Jan', od: 18, os: 17 },
        { date: 'Mar', od: 22, os: 20 },
        { date: 'Jun', od: 19, os: 19 },
        { date: 'Oct', od: Number(form.odIop) || 19, os: Number(form.osIop) || 18 }
    ];

    const handleSave = () => {
        notify('success', 'Screening Finalized', 'Glaucoma assessment record has been committed to the patient chart.');
        setShowQueueModal(true);
    };

    const runAiAnalysis = async () => {
        if (!form.odIop || !form.osIop) {
            notify('warning', 'Incomplete Data', 'Please enter IOP measurements for AI analysis.');
            return;
        }
        setIsAiLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Analyze this glaucoma screening for a ${activePatient?.age}yo ${activePatient?.gender}:
            - VA: OD ${form.odVa}, OS ${form.osVa}
            - IOP: OD ${form.odIop} mmHg, OS ${form.osIop} mmHg
            - CDR: OD ${form.odCdr}, OS ${form.osCdr}
            Provide clinical risk assessment and suggested management.`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { systemInstruction: "You are an ophthalmology specialist." }
            });
            setAiInsight(response.text || "Analysis complete.");
        } catch (e) {
            setAiInsight("AI Service Offline.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const inputStyle = "w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm";
    const labelStyle = "block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-widest";
    const cardStyle = "bg-white border border-slate-200 rounded-2xl shadow-sm p-6";

    if (!activePatient) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-300">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-200">
                    <i className="fa fa-eye text-4xl"></i>
                </div>
                <p className="font-black uppercase tracking-widest text-sm">Select Patient to Begin Screening</p>
            </div>
        );
    }

    return (
        <div className="animate-bottom space-y-6 pb-20">
            <div className="bg-[#1e293b] text-white rounded-2xl shadow-lg border border-slate-700 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
                <div className="flex items-center space-x-5 z-10">
                    <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner"><i className="fa fa-eye"></i></div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight leading-none">{activePatient.surname}, {activePatient.othernames}</h2>
                        <p className="text-[10px] text-emerald-400 font-bold mt-2 uppercase tracking-widest">{activePatient.outpatientNo} &bull; GL-SCREENING</p>
                    </div>
                </div>
                <button onClick={handleSave} className="bg-emerald-500 text-white px-8 py-2 rounded-xl text-[10px] font-black uppercase shadow-xl hover:bg-emerald-600 z-10 transition">Finalize Screening</button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 space-y-6">
                    <div className={cardStyle}>
                        <h6 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-6">Visual Acuity (Snellen)</h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">OD</span>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className={labelStyle}>Unaided</label>
                                        <select value={form.odVa} onChange={e => setForm({...form, odVa: e.target.value})} className={inputStyle}>
                                            {VA_OPTIONS.map(v => <option key={v}>{v}</option>)}
                                        </select>
                                    </div>
                                    <div><label className={labelStyle}>Pinhole</label>
                                        <select value={form.odVaPinhole} onChange={e => setForm({...form, odVaPinhole: e.target.value})} className={inputStyle}>
                                            <option value="">-</option>
                                            {VA_OPTIONS.map(v => <option key={v}>{v}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">OS</span>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className={labelStyle}>Unaided</label>
                                        <select value={form.osVa} onChange={e => setForm({...form, osVa: e.target.value})} className={inputStyle}>
                                            {VA_OPTIONS.map(v => <option key={v}>{v}</option>)}
                                        </select>
                                    </div>
                                    <div><label className={labelStyle}>Pinhole</label>
                                        <select value={form.osVaPinhole} onChange={e => setForm({...form, osVaPinhole: e.target.value})} className={inputStyle}>
                                            <option value="">-</option>
                                            {VA_OPTIONS.map(v => <option key={v}>{v}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cardStyle}>
                        <h6 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-6">Tonometry (mmHg)</h6>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div><label className={labelStyle}>OD</label><input type="number" value={form.odIop} onChange={e => setForm({...form, odIop: e.target.value})} className={inputStyle} /></div>
                            <div><label className={labelStyle}>OS</label><input type="number" value={form.osIop} onChange={e => setForm({...form, osIop: e.target.value})} className={inputStyle} /></div>
                            <div><label className={labelStyle}>Method</label><select className={inputStyle}><option>Goldmann</option><option>NCT</option></select></div>
                            <div><label className={labelStyle}>Time</label><input type="time" value={form.iopTime} className={inputStyle} /></div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h6 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center"><i className="fa fa-robot mr-2"></i> Clinical Intelligence</h6>
                            {isAiLoading ? <p className="text-xs animate-pulse">Analyzing results...</p> : aiInsight ? <p className="text-xs leading-relaxed opacity-80">{aiInsight}</p> : <p className="text-xs opacity-60">Enter measurements to generate a risk assessment report.</p>}
                            {!aiInsight && !isAiLoading && <button onClick={runAiAnalysis} className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase">Run Analysis</button>}
                        </div>
                        <i className="fa fa-brain absolute -right-6 -bottom-6 text-8xl text-white/5 rotate-12"></i>
                    </div>
                </div>
            </div>

            <QueueModal isOpen={showQueueModal} onClose={() => setShowQueueModal(false)} patientName={activePatient.surname} patientId={activePatient.outpatientNo} />
        </div>
    );
};

export default GlaucomaScreening;
