import React, { useState, useMemo } from 'react';
import { usePatient } from '../../context/PatientContext';
import { useNotification } from '../../context/NotificationContext';
import PatientSelectorModal from '../../components/PatientSelectorModal';
import QueueModal from '../../components/QueueModal';

const PaediatricClinic: React.FC = () => {
    const { activePatient } = usePatient();
    const { notify } = useNotification();
    const [activeTab, setActiveTab] = useState<'imci' | 'growth' | 'kepi' | 'polio' | 'milestones'>('imci');
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [showQueueModal, setShowQueueModal] = useState(false);
    const [historyOfTravel, setHistoryOfTravel] = useState('');

    const inputStyle = "w-full p-2 bg-white border border-slate-300 text-[11px] font-bold text-slate-800 outline-none focus:border-blue-600 transition-all shadow-inner";
    const labelStyle = "block text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest";
    const sectionHeader = "text-[10px] font-black text-blue-600 uppercase border-b border-blue-50 pb-1 mb-4 flex justify-between";

    const handleSave = () => {
        notify('success', 'Child Health Record Saved', 'Clinical assessments and preventative data synchronized.');
        setShowQueueModal(true);
    };

    if (!activePatient) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-300 font-helvetica">
                <PatientSelectorModal isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} filterType="kids" title="Paediatric Registry" />
                <div className="w-20 h-20 bg-blue-50 border border-blue-100 flex items-center justify-center mb-6 text-blue-300 shadow-sm">
                    <i className="fa fa-child text-4xl"></i>
                </div>
                <p className="font-black uppercase tracking-[0.2em] text-sm text-slate-400">Paediatric Authentication Required</p>
                <button onClick={() => setIsSelectorOpen(true)} className="mt-6 bg-blue-600 text-white px-10 py-3 font-black text-xs uppercase tracking-widest shadow-lg hover:bg-blue-700 transition">Find Child Record</button>
            </div>
        );
    }

    return (
        <div className="animate-bottom flex flex-col h-[calc(100vh-120px)] -m-4 md:-m-6 overflow-hidden font-helvetica bg-slate-50/50">
            <QueueModal isOpen={showQueueModal} onClose={() => setShowQueueModal(false)} patientName={activePatient.surname} patientId={activePatient.outpatientNo} />

            {/* Main Header Ribbon */}
            <div className="bg-slate-900 h-14 border-l-[10px] border-l-blue-600 px-6 flex items-center justify-between shrink-0 z-20 shadow-xl">
                <div className="flex items-center space-x-6">
                    <div className="flex flex-col">
                        <h2 className="text-sm font-black text-white uppercase tracking-tight leading-none">{activePatient.surname}, {activePatient.othernames}</h2>
                        <p className="text-[9px] text-blue-400 font-bold uppercase mt-1 tracking-widest">{activePatient.outpatientNo} &bull; {activePatient.age} Yrs &bull; Parent: Jane Doe</p>
                    </div>
                    <div className="h-6 w-px bg-white/10"></div>
                    <div className="flex gap-6">
                        <div className="flex flex-col text-center"><span className="text-[8px] font-black text-slate-500 uppercase">Z-SCORE</span><span className="text-[10px] font-black text-green-400">NORMAL (-0.5)</span></div>
                        <div className="flex flex-col text-center"><span className="text-[8px] font-black text-slate-500 uppercase">IMMUNIZATION</span><span className="text-[10px] font-black text-blue-400">UP TO DATE</span></div>
                    </div>
                </div>
                <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition">Finalize Review</button>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Vertical Navigation Sidebar */}
                <div className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">
                    <div className="p-3 bg-slate-50 border-b border-slate-100 font-black text-[9px] text-slate-400 uppercase tracking-widest text-center">Encounter Modules</div>
                    <div className="flex-1 overflow-y-auto">
                        {[
                            { id: 'imci', label: 'Clinical (IMCI)', icon: 'fa-stethoscope' },
                            { id: 'growth', label: 'Growth Monitoring', icon: 'fa-chart-line' },
                            { id: 'kepi', label: 'Immunization (KEPI)', icon: 'fa-syringe' },
                            { id: 'polio', label: 'Polio Inoculation', icon: 'fa-vial' },
                            { id: 'milestones', label: 'Developmental', icon: 'fa-brain' },
                        ].map(t => (
                            <button 
                                key={t.id} 
                                onClick={() => setActiveTab(t.id as any)}
                                className={`w-full text-left px-5 py-4 border-b border-slate-50 flex items-center space-x-3 transition-all ${activeTab === t.id ? 'bg-blue-50 border-r-4 border-r-blue-600 text-blue-700 font-black' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                <i className={`fa ${t.icon} text-[10px] w-4 text-center`}></i>
                                <span className="text-[10px] uppercase tracking-tight">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    <div className="max-w-6xl mx-auto">
                        
                        {/* TAB: IMCI CLINICAL */}
                        {activeTab === 'imci' && (
                            <div className="animate-in fade-in space-y-8">
                                <h3 className={sectionHeader}><span>General Danger Signs & Assessment</span></h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Immediate Red Flags</h6>
                                        <div className="grid grid-cols-2 gap-4">
                                            {['Unable to drink/breastfeed', 'Vomits everything', 'Convulsions', 'Lethargic/Unconscious'].map(sign => (
                                                <label key={sign} className="flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-none cursor-pointer hover:bg-red-50 transition-colors group">
                                                    <input type="checkbox" className="w-4 h-4 rounded-none text-red-600" />
                                                    <span className="text-[10px] font-bold text-slate-600 group-hover:text-red-900">{sign}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Cough / Respiratory Effort</h6>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className={labelStyle}>Resp Rate (cpm)</label><input type="number" className={inputStyle} /></div>
                                            <div><label className={labelStyle}>Chest In-drawing</label><select className={inputStyle}><option>None</option><option>Mild</option><option>Severe</option></select></div>
                                            <div><label className={labelStyle}>Stridor</label><select className={inputStyle}><option>No</option><option>Yes</option></select></div>
                                            <div><label className={labelStyle}>Wheeze</label><select className={inputStyle}><option>No</option><option>Yes</option></select></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: GROWTH */}
                        {activeTab === 'growth' && (
                            <div className="animate-in fade-in space-y-8">
                                <h3 className={sectionHeader}><span>Anthropometry & Nutrition</span></h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-4 bg-white border border-slate-200 p-6 shadow-sm border-t-4 border-t-blue-600">
                                        <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b pb-1">Current Weight</h6>
                                        <div className="flex items-baseline space-x-2">
                                            <input type="number" step="0.1" className="w-32 p-1 text-3xl font-black text-slate-800 border-b-2 border-blue-100 outline-none" defaultValue="12.4" />
                                            <span className="text-sm font-black text-slate-400 uppercase">KG</span>
                                        </div>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase">Weight for Age: <span className="text-green-600">Stable</span></p>
                                    </div>
                                    <div className="space-y-4 bg-white border border-slate-200 p-6 shadow-sm border-t-4 border-t-blue-600">
                                        <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b pb-1">MUAC Measurement</h6>
                                        <div className="flex items-baseline space-x-2">
                                            <input type="number" step="0.1" className="w-32 p-1 text-3xl font-black text-slate-800 border-b-2 border-blue-100 outline-none" defaultValue="14.5" />
                                            <span className="text-sm font-black text-slate-400 uppercase">CM</span>
                                        </div>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase">Nutrition: <span className="text-green-600">Green Zone</span></p>
                                    </div>
                                    <div className="space-y-4 bg-white border border-slate-200 p-6 shadow-sm border-t-4 border-t-blue-600">
                                        <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b pb-1">Height / Stature</h6>
                                        <div className="flex items-baseline space-x-2">
                                            <input type="number" step="0.1" className="w-32 p-1 text-3xl font-black text-slate-800 border-b-2 border-blue-100 outline-none" defaultValue="88" />
                                            <span className="text-sm font-black text-slate-400 uppercase">CM</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-64 bg-white border border-slate-200 flex items-center justify-center text-slate-300 font-black uppercase text-[10px] tracking-[0.3em] shadow-inner">
                                    [ WHO Growth Analytics Engine ]
                                </div>
                            </div>
                        )}

                        {/* TAB: KEPI */}
                        {activeTab === 'kepi' && (
                            <div className="animate-in fade-in space-y-6">
                                <h3 className={sectionHeader}><span>Preventative Immunization (KEPI)</span></h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { age: 'At Birth', shots: ['BCG', 'OPV 0'] },
                                        { age: '6 Weeks', shots: ['OPV 1', 'Pentavalent 1', 'PCV 1', 'Rotarix 1'] },
                                        { age: '10 Weeks', shots: ['OPV 2', 'Pentavalent 2', 'PCV 2', 'Rotarix 2'] },
                                        { age: '14 Weeks', shots: ['OPV 3', 'IPV', 'Pentavalent 3', 'PCV 3'] },
                                        { age: '6 Months', shots: ['Vitamin A', 'Flu Vaccine'] },
                                        { age: '9 Months', shots: ['Measles-Rubella 1', 'Yellow Fever'] },
                                    ].map(period => (
                                        <div key={period.age} className="bg-white border border-slate-200 p-5 group hover:border-blue-500 transition-colors shadow-sm">
                                            <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-50 pb-1">{period.age}</h6>
                                            <div className="grid grid-cols-2 gap-2">
                                                {period.shots.map(shot => (
                                                    <label key={shot} className="flex items-center space-x-3 p-2 bg-slate-50 hover:bg-blue-50 transition-colors cursor-pointer">
                                                        <input type="checkbox" className="w-4 h-4 rounded-none text-blue-600" />
                                                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{shot}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* TAB: POLIO (Integrated from standalone) */}
                        {activeTab === 'polio' && (
                            <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
                                <h3 className={sectionHeader}><span>Polio Inoculation & Risk Monitoring</span></h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-6 md:col-span-1">
                                        <div className="bg-blue-50 border border-blue-100 p-5 rounded-none shadow-sm">
                                            <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Dose Sequence Control</h6>
                                            <div className="space-y-3">
                                                <div>
                                                   <label className={labelStyle}>Target Dose</label>
                                                   <select className={inputStyle}>
                                                        <option>Birth Dose (bOPV)</option>
                                                        <option>Dose 1 (6 Weeks)</option>
                                                        <option>Dose 2 (10 Weeks)</option>
                                                        <option>Dose 3 (14 Weeks)</option>
                                                   </select>
                                                </div>
                                                <div>
                                                   <label className={labelStyle}>Administration Route</label>
                                                   <select className={inputStyle}>
                                                        <option>Oral (OPV)</option>
                                                        <option>Injectable (IPV)</option>
                                                   </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="md:col-span-2 space-y-6">
                                        <div className="bg-white border border-slate-200 p-6 shadow-sm">
                                            <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-50 pb-1">Travel Risk Assessment</h6>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className={labelStyle}>History of Travel (Last 21 Days)</label>
                                                    <textarea
                                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-none text-xs font-semibold outline-none focus:border-blue-600 h-28 shadow-inner resize-none leading-relaxed"
                                                        value={historyOfTravel}
                                                        onChange={(e) => setHistoryOfTravel(e.target.value)}
                                                        placeholder="Specify regions visited, contact with known cases, or exposure risks..."
                                                    ></textarea>
                                                </div>
                                                <div className="flex items-center space-x-3 bg-red-50 border border-red-100 p-3">
                                                    <i className="fa fa-shield-virus text-red-500 text-xs"></i>
                                                    <p className="text-[10px] font-black text-red-800 uppercase leading-none">Mandatory cross-border screening for high-risk zones.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: MILESTONES */}
                        {activeTab === 'milestones' && (
                            <div className="animate-in slide-in-from-bottom-4 duration-300 space-y-8">
                                <h3 className={sectionHeader}><span>Developmental Milestones Tracker</span></h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Motor & Social Matrix</h6>
                                        <div className="space-y-2">
                                            {['Social Smile', 'Head Control', 'Sitting with Support', 'Pincer Grasp', 'Stands Alone'].map(m => (
                                                <label key={m} className="flex items-center justify-between p-3 bg-white border border-slate-100 hover:bg-blue-50 transition-all cursor-pointer shadow-sm group">
                                                    <span className="text-[11px] font-black text-slate-600 uppercase group-hover:text-blue-700">{m}</span>
                                                    <select className="bg-transparent border-none text-[10px] font-black text-blue-600 uppercase outline-none cursor-pointer">
                                                        <option>Normal</option>
                                                        <option>Delayed</option>
                                                        <option>Not Assessed</option>
                                                    </select>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Sensory Baseline</h6>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="p-5 bg-blue-50 border border-blue-100 rounded-none shadow-sm">
                                                <p className="text-[10px] font-black text-blue-800 uppercase mb-2 flex items-center"><i className="fa fa-ear-listen mr-2"></i> Hearing Response</p>
                                                <p className="text-[11px] text-blue-600 font-medium leading-relaxed italic">Child turns head towards localized sound source.</p>
                                            </div>
                                            <div className="p-5 bg-blue-50 border border-blue-100 rounded-none shadow-sm">
                                                <p className="text-[10px] font-black text-blue-800 uppercase mb-2 flex items-center"><i className="fa fa-eye mr-2"></i> Visual Tracking</p>
                                                <p className="text-[11px] text-blue-600 font-medium leading-relaxed italic">Child tracks bright stimuli across the sagittal midline.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-10 bg-slate-900 border-t border-white/5 px-8 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center"><i className="fa fa-fingerprint mr-2 text-blue-600"></i> Clinician: Paediatric Unit 01</span>
                    <span className="flex items-center"><i className="fa fa-clock mr-2 text-blue-600"></i> Local Sync: ON</span>
                </div>
                <div className="flex items-center space-x-2 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span>Data Sovereign Hub</span>
                </div>
            </div>
        </div>
    );
};

export default PaediatricClinic;