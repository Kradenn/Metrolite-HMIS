import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { useNotification } from '../../context/NotificationContext';
import PatientSelectorModal from '../../components/PatientSelectorModal';
import QueueModal from '../../components/QueueModal';
import DictationButton from '../../components/DictationButton';

type VisitType = '1-week' | '2-4-week' | '6-week';

const Postnatal: React.FC = () => {
    const { activePatient } = usePatient();
    const { notify } = useNotification();
    const [activeTab, setActiveTab] = useState<'summary' | 'visits' | 'notes'>('summary');
    const [selectedVisit, setSelectedVisit] = useState<VisitType>('1-week');
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [showQueueModal, setShowQueueModal] = useState(false);

    const inputStyle = "w-full p-2 bg-white border border-slate-300 text-[11px] font-bold text-slate-800 outline-none focus:border-rose-600 transition-all shadow-inner";
    const labelStyle = "block text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest";
    const sectionHeader = "text-[10px] font-black text-rose-600 uppercase border-b border-rose-100 pb-1 mb-4 flex justify-between items-center";

    const handleSave = () => {
        notify('success', 'PNC Record Synchronized', 'The postnatal encounter has been committed to the medical ledger.');
        setShowQueueModal(true);
    };

    if (!activePatient) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-300 font-helvetica">
                <PatientSelectorModal isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} filterType="mothers" title="PNC Registry" />
                <div className="w-20 h-20 bg-rose-50 border border-rose-100 flex items-center justify-center mb-6 text-rose-300 shadow-sm">
                    <i className="fa fa-hands-holding-child text-4xl"></i>
                </div>
                <p className="font-black uppercase tracking-[0.2em] text-sm">Postnatal Session Identification Required</p>
                <button onClick={() => setIsSelectorOpen(true)} className="mt-6 bg-rose-600 text-white px-10 py-3 font-black text-xs uppercase tracking-widest shadow-lg hover:bg-rose-700 transition">Open Registry</button>
            </div>
        );
    }

    return (
        <div className="animate-bottom flex flex-col h-[calc(100vh-120px)] -m-4 md:-m-6 overflow-hidden font-helvetica bg-slate-50/30">
            <QueueModal isOpen={showQueueModal} onClose={() => setShowQueueModal(false)} patientName={activePatient.surname} patientId={activePatient.outpatientNo} />

            {/* Header Ribbon */}
            <div className="bg-slate-900 h-14 border-l-[10px] border-l-rose-600 px-6 flex items-center justify-between shrink-0 z-20 shadow-xl">
                <div className="flex items-center space-x-6">
                    <div className="flex flex-col">
                        <h2 className="text-sm font-black text-white uppercase tracking-tight leading-none">{activePatient.surname}, {activePatient.othernames}</h2>
                        <p className="text-[9px] text-rose-400 font-bold uppercase mt-1 tracking-widest">Reg No: {activePatient.outpatientNo} &bull; DOB: 12-Oct-1995</p>
                    </div>
                    <div className="h-6 w-px bg-white/10"></div>
                    <div className="flex gap-6">
                        <div className="flex flex-col"><span className="text-[8px] font-black text-slate-500 uppercase">Status</span><span className="text-[10px] font-black text-emerald-400 uppercase">ALIVE / WELL</span></div>
                        <div className="flex flex-col"><span className="text-[8px] font-black text-slate-500 uppercase">MOD</span><span className="text-[10px] font-bold text-white uppercase">SVD</span></div>
                    </div>
                </div>
                <button onClick={handleSave} className="bg-rose-600 text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-rose-700 transition">Save Record</button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Secondary Sidebar */}
                <div className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-inner">
                    <div className="p-3 bg-slate-50 border-b border-slate-100 font-black text-[9px] text-slate-400 uppercase tracking-widest text-center">Encounter Modules</div>
                    <div className="flex-1 overflow-y-auto">
                        {[
                            { id: 'summary', label: 'Birth Summary', icon: 'fa-baby' },
                            { id: 'visits', label: 'Clinic Visits', icon: 'fa-calendar-check' },
                            { id: 'notes', label: 'Care Notes', icon: 'fa-file-medical-alt' },
                        ].map(t => (
                            <button 
                                key={t.id} 
                                onClick={() => setActiveTab(t.id as any)}
                                className={`w-full text-left px-5 py-4 border-b border-slate-50 flex items-center space-x-3 transition-all ${activeTab === t.id ? 'bg-rose-50 border-r-4 border-r-rose-600 text-rose-700 font-black' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                <i className={`fa ${t.icon} text-[10px] w-4 text-center`}></i>
                                <span className="text-[10px] uppercase tracking-tight">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    <div className="max-w-6xl mx-auto space-y-10 pb-20">
                        
                        {/* TAB: BIRTH SUMMARY */}
                        {activeTab === 'summary' && (
                            <div className="animate-in fade-in space-y-10">
                                <div>
                                    <h3 className={sectionHeader}><span>Maternal & Delivery Context</span> <i className="fa fa-clipboard-list"></i></h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-4">
                                            <div><label className={labelStyle}>Place of Delivery</label><input className={inputStyle} defaultValue="Glissan Medical Services" /></div>
                                            <div><label className={labelStyle}>EDD</label><input type="date" className={inputStyle} /></div>
                                            <div><label className={labelStyle}>Gestation at Delivery</label><input className={inputStyle} placeholder="...wks" /></div>
                                        </div>
                                        <div className="space-y-4">
                                            <div><label className={labelStyle}>Delivery Mode</label><select className={inputStyle}><option>Spontaneous</option><option>Scheduled</option><option>Induced</option><option>Emergency</option></select></div>
                                            <div><label className={labelStyle}>Pregnancy Complications</label><input className={inputStyle} /></div>
                                            <div><label className={labelStyle}>Labour/Postpartum Complications</label><input className={inputStyle} /></div>
                                        </div>
                                        <div className="space-y-4">
                                            <div><label className={labelStyle}>Pre-existing Conditions</label><textarea className={`${inputStyle} h-20 resize-none`}></textarea></div>
                                            <div><label className={labelStyle}>Maternal Allergies</label><input className={inputStyle} /></div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className={sectionHeader}><span>Birth Outcome Matrix</span> <i className="fa fa-baby"></i></h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-white border border-slate-200 p-6 shadow-sm space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><label className={labelStyle}>DoD (Date of Delivery)</label><input type="date" className={inputStyle} /></div>
                                                <div><label className={labelStyle}>MOD (Mode of Delivery)</label><input className={inputStyle} /></div>
                                            </div>
                                            <div><label className={labelStyle}>Outcome</label><select className={inputStyle}><option>A/W (Alive & Well)</option><option>NNC</option><option>FSB</option><option>MSB</option><option>NND</option></select></div>
                                        </div>

                                        <div className="bg-slate-900 p-6 rounded-none text-white space-y-4 relative overflow-hidden">
                                            <div className="relative z-10">
                                                <h6 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-4">Baby 1 Profile</h6>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div><label className="text-[8px] font-black text-slate-500 uppercase">Sex</label><select className="w-full bg-slate-800 border-none text-[10px] p-1"><option>M</option><option>F</option><option>I</option></select></div>
                                                    <div><label className="text-[8px] font-black text-slate-500 uppercase">Birth Wt (g)</label><input className="w-full bg-slate-800 border-none text-[10px] p-1" placeholder="g" /></div>
                                                    <div><label className="text-[8px] font-black text-slate-500 uppercase">A/S (1,5,10)</label><input className="w-full bg-slate-800 border-none text-[10px] p-1" placeholder="X/X/X" /></div>
                                                </div>
                                                <div className="mt-4">
                                                    <label className="text-[8px] font-black text-slate-500 uppercase">Perinatal Destination</label>
                                                    <select className="w-full bg-slate-800 border-none text-[10px] p-1 mt-1"><option>General Ward</option><option>NBU</option><option>NHDU</option><option>NICU</option></select>
                                                </div>
                                            </div>
                                            <i className="fa fa-baby absolute -right-4 -bottom-4 text-7xl text-white/5 rotate-12"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: CLINIC VISITS */}
                        {activeTab === 'visits' && (
                            <div className="animate-in fade-in space-y-8">
                                <div className="flex bg-white p-1 border border-slate-200 shadow-sm shrink-0">
                                    {(['1-week', '2-4-week', '6-week'] as VisitType[]).map(v => (
                                        <button 
                                            key={v} 
                                            onClick={() => setSelectedVisit(v)}
                                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${selectedVisit === v ? 'bg-rose-600 text-white shadow-lg scale-[1.02] z-10' : 'text-slate-400 hover:bg-slate-50'}`}
                                        >
                                            {v} Postnatal Visit
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                    {/* Physiological Telemetry */}
                                    <div className="md:col-span-4 space-y-6">
                                        <h3 className={sectionHeader}><span>Visit Vitals</span></h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className={labelStyle}>BP (mmHg)</label><input className={inputStyle} placeholder="00/00" /></div>
                                            <div><label className={labelStyle}>PR (bpm)</label><input type="number" className={inputStyle} /></div>
                                            <div><label className={labelStyle}>RR (bpm)</label><input type="number" className={inputStyle} /></div>
                                            <div><label className={labelStyle}>sPO2 (%)</label><input type="number" className={inputStyle} /></div>
                                            <div><label className={labelStyle}>Temp (°C)</label><input type="number" step="0.1" className={inputStyle} /></div>
                                            <div><label className={labelStyle}>Wt (Kg)</label><input type="number" step="0.1" className={inputStyle} /></div>
                                        </div>
                                    </div>

                                    {/* Physical Examination */}
                                    <div className="md:col-span-8 space-y-6">
                                        <h3 className={sectionHeader}><span>Maternal Clinical Exam</span></h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div><label className={labelStyle}>General Condition</label><input className={inputStyle} /></div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div><label className={labelStyle}>Breast RT</label><input className={inputStyle} /></div>
                                                    <div><label className={labelStyle}>Breast LT</label><input className={inputStyle} /></div>
                                                </div>
                                                <div><label className={labelStyle}>Uterus (Involution)</label><input className={inputStyle} /></div>
                                            </div>
                                            <div className="space-y-4">
                                                <div><label className={labelStyle}>C/S Scar</label><input className={inputStyle} /></div>
                                                <div><label className={labelStyle}>Perineum</label><input className={inputStyle} /></div>
                                                <div><label className={labelStyle}>Lochia</label><input className={inputStyle} /></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {selectedVisit === '6-week' && (
                                    <div className="animate-in slide-in-from-top-4 bg-rose-50 border border-rose-100 p-8 space-y-8 shadow-sm">
                                        <h3 className={sectionHeader}><span>6-Week Reproductive Health Audit</span> <i className="fa fa-star text-rose-400"></i></h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <label className={labelStyle}>Menses Resumed?</label>
                                                    <div className="flex gap-4">
                                                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-700 cursor-pointer"><input type="radio" name="menses" /> YES</label>
                                                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-700 cursor-pointer"><input type="radio" name="menses" /> NO</label>
                                                    </div>
                                                </div>
                                                <div><label className={labelStyle}>If Yes, LMP</label><input type="date" className={inputStyle} /></div>
                                                <div className="flex items-center justify-between">
                                                    <label className={labelStyle}>Cervical Screening Done?</label>
                                                    <div className="flex gap-4">
                                                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-700 cursor-pointer"><input type="radio" name="cx" /> YES</label>
                                                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-700 cursor-pointer"><input type="radio" name="cx" /> NO</label>
                                                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-700 cursor-pointer"><input type="radio" name="cx" /> POSTPONED</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <label className={labelStyle}>Contraceptive Counselling?</label>
                                                    <div className="flex gap-4">
                                                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-700 cursor-pointer"><input type="radio" name="fp" /> YES</label>
                                                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-700 cursor-pointer"><input type="radio" name="fp" /> NO</label>
                                                    </div>
                                                </div>
                                                <div><label className={labelStyle}>Family Planning Method Chosen</label><select className={inputStyle}><option>None</option><option>Depo</option><option>Implant</option><option>IUCD</option><option>OCP</option><option>Condoms</option></select></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center"><label className={labelStyle}>Clinical Observations & Other Comments</label><DictationButton onTranscript={() => {}} /></div>
                                    <textarea className="w-full h-32 p-4 bg-white border border-slate-200 text-xs font-semibold outline-none focus:ring-1 focus:ring-rose-500 shadow-inner resize-none leading-relaxed"></textarea>
                                    <div className="flex justify-end items-center gap-4 pt-4 border-t border-slate-100">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Return Visit (T.C.A) in</span>
                                        <div className="flex items-center gap-2">
                                            <input className="w-20 p-2 border border-slate-300 rounded text-center font-black text-rose-600" placeholder="0" />
                                            <select className="p-2 border border-slate-300 rounded text-[10px] font-black uppercase"><option>Days</option><option>Weeks</option></select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: ADDITIONAL NOTES */}
                        {activeTab === 'notes' && (
                            <div className="animate-in fade-in space-y-6">
                                <div className="flex justify-between items-center bg-white p-4 border border-slate-200 border-l-[10px] border-l-rose-600 shadow-sm">
                                    <div>
                                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest leading-none">Additional Care Notes</h3>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Longitudinal psychosocial and recovery documentation</p>
                                    </div>
                                    <DictationButton onTranscript={() => {}} />
                                </div>
                                <textarea className="w-full h-[500px] p-10 bg-white border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-rose-500 shadow-inner resize-none leading-relaxed" placeholder="Document specialized follow-up care, social history road-blocks, or post-discharge recovery metrics..."></textarea>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Signature Footer */}
            <div className="h-10 bg-slate-900 border-t border-white/5 px-8 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center"><i className="fa fa-fingerprint mr-2 text-rose-600"></i> Clinician: AUTH_NURS_02</span>
                    <span className="flex items-center"><i className="fa fa-clock mr-2 text-rose-600"></i> Time: {new Date().toLocaleTimeString()}</span>
                </div>
                <div className="text-[10px] font-black text-white italic opacity-50 uppercase tracking-widest">
                    Commitment to Happy Healthy Clients!
                </div>
            </div>
        </div>
    );
};

export default Postnatal;