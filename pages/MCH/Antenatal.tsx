
import React, { useState, useMemo } from 'react';
import { usePatient } from '../../context/PatientContext';
import { useNotification } from '../../context/NotificationContext';
import { useHospital } from '../../context/HospitalContext';
import PatientSelectorModal from '../../components/PatientSelectorModal';
import QueueModal from '../../components/QueueModal';
import DictationButton from '../../components/DictationButton';

const Antenatal: React.FC = () => {
    const { activePatient } = usePatient();
    const { notify } = useNotification();
    const { hospitalName } = useHospital();
    const [activeTab, setActiveTab] = useState<'history' | 'obstetric' | 'exam' | 'lab' | 'matrix' | 'plan' | 'notes'>('history');
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [showQueueModal, setShowQueueModal] = useState(false);

    // SOAP Notes State
    const [soap, setSoap] = useState({
        s: '',
        o: '',
        a: '',
        p: ''
    });

    const inputStyle = "w-full p-2 bg-white border border-slate-300 text-[11px] font-bold text-slate-800 outline-none focus:border-rose-600 transition-all shadow-inner";
    const labelStyle = "block text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest";
    const sectionHeader = "text-[10px] font-black text-rose-600 uppercase border-b border-rose-100 pb-1 mb-4 flex justify-between items-center";
    const textareaStyle = "w-full h-32 p-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-rose-500 shadow-inner resize-none leading-relaxed";

    const handleSave = () => {
        notify('success', 'ANC Record Committed', 'Longitudinal obstetric data has been synchronized with the medical ledger.');
        setShowQueueModal(true);
    };

    if (!activePatient) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-300 font-helvetica">
                <PatientSelectorModal isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} filterType="mothers" title="ANC Registry" />
                <div className="w-20 h-20 bg-rose-50 border border-rose-100 flex items-center justify-center mb-6 text-rose-300 shadow-sm">
                    <i className="fa fa-baby-carriage text-4xl"></i>
                </div>
                <p className="font-black uppercase tracking-[0.2em] text-sm text-slate-400">Antenatal Session Identification Required</p>
                <button onClick={() => setIsSelectorOpen(true)} className="mt-6 bg-rose-600 text-white px-10 py-3 font-black text-xs uppercase tracking-widest shadow-lg hover:bg-rose-700 transition">Identify Mother</button>
            </div>
        );
    }

    return (
        <div className="animate-bottom flex flex-col h-[calc(100vh-120px)] -m-4 md:-m-6 overflow-hidden font-helvetica bg-slate-50/50">
            <QueueModal isOpen={showQueueModal} onClose={() => setShowQueueModal(false)} patientName={activePatient.surname} patientId={activePatient.outpatientNo} />
            
            {/* Clinical Header Banner */}
            <div className="bg-slate-900 h-16 border-l-[10px] border-l-rose-600 px-6 flex items-center justify-between shrink-0 z-20 shadow-xl">
                <div className="flex items-center space-x-6">
                    <div className="flex flex-col">
                        <h2 className="text-sm font-black text-white uppercase tracking-tight leading-none">{activePatient.surname}, {activePatient.othernames}</h2>
                        <p className="text-[9px] text-rose-400 font-bold uppercase mt-1.5 tracking-widest">Reg No: {activePatient.outpatientNo} &bull; Age: {activePatient.age} &bull; Para: 1+0 Gravida: 2</p>
                    </div>
                    <div className="h-8 w-px bg-white/10 hidden lg:block"></div>
                    <div className="hidden lg:grid grid-cols-3 gap-x-8 gap-y-1">
                        <div className="flex flex-col"><span className="text-[8px] font-black text-slate-500 uppercase leading-none">L.M.P</span><span className="text-[10px] font-bold text-white leading-none">12-Jan-2024</span></div>
                        <div className="flex flex-col"><span className="text-[8px] font-black text-slate-500 uppercase leading-none">EDD (Dates)</span><span className="text-[10px] font-bold text-white leading-none">18-Oct-2024</span></div>
                        <div className="flex flex-col"><span className="text-[8px] font-black text-slate-500 uppercase leading-none">EDD (Scan)</span><span className="text-[10px] font-bold text-rose-400 leading-none">20-Oct-2024</span></div>
                        <div className="flex flex-col"><span className="text-[8px] font-black text-slate-500 uppercase leading-none">Quickening</span><span className="text-[10px] font-bold text-white leading-none">18 Wks</span></div>
                        <div className="flex flex-col col-span-2"><span className="text-[8px] font-black text-slate-500 uppercase leading-none">Special Attention</span><span className="text-[9px] font-black text-red-500 uppercase leading-none truncate">PREVIOUS C-SECTION &bull; RH NEGATIVE</span></div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsSelectorOpen(true)} className="bg-white/5 hover:bg-white/10 text-white px-4 py-1.5 rounded text-[9px] font-black uppercase tracking-widest transition">Switch</button>
                    <button onClick={handleSave} className="bg-rose-600 text-white px-8 py-2 text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-rose-700 transition">Save Encounter</button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Secondary Vertical Navigation */}
                <div className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-inner">
                    <div className="p-3 bg-slate-50 border-b border-slate-100 font-black text-[9px] text-slate-400 uppercase tracking-widest text-center">ANC Record Modules</div>
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        {[
                            { id: 'history', label: 'History & Comorbidity', icon: 'fa-id-card' },
                            { id: 'obstetric', label: 'Obstetric History', icon: 'fa-history' },
                            { id: 'exam', label: 'Physical Examination', icon: 'fa-stethoscope' },
                            { id: 'lab', label: 'Lab Profile & Scans', icon: 'fa-vials' },
                            { id: 'notes', label: 'Clinical Notes (SOAP)', icon: 'fa-file-medical' },
                            { id: 'matrix', label: 'Visit Tracker', icon: 'fa-table' },
                            { id: 'plan', label: 'Birth & Emergency Plan', icon: 'fa-clipboard-list' },
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

                {/* Content Canvas */}
                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    <div className="max-w-6xl mx-auto pb-20">
                        
                        {/* TAB: HISTORY & COMORBIDITIES */}
                        {activeTab === 'history' && (
                            <div className="animate-in fade-in space-y-10">
                                <div>
                                    <h3 className={sectionHeader}><span>Patient's Comorbidities</span> <i className="fa fa-user-md text-rose-300"></i></h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="bg-white border border-slate-200 p-4 shadow-sm space-y-3">
                                                <span className="text-[9px] font-black text-rose-600 uppercase">Condition {i}</span>
                                                <input className={inputStyle} placeholder="Enter Diagnosis..." />
                                                <div className="pt-2">
                                                    <label className={labelStyle}>Attending Doctor</label>
                                                    <input className={inputStyle} placeholder="Doctor Name" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <h3 className={sectionHeader}><span>Menstrual History</span></h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className={labelStyle}>Menarche (Age)</label><input className={inputStyle} /></div>
                                            <div><label className={labelStyle}>Cycle Length (Days)</label><input className={inputStyle} /></div>
                                            <div><label className={labelStyle}>Duration (Days)</label><input className={inputStyle} /></div>
                                            <div><label className={labelStyle}>Dysmenorrhea</label><select className={inputStyle}><option>No</option><option>Yes</option></select></div>
                                            <div className="col-span-2"><label className={labelStyle}>Family Planning Method(s)</label><input className={inputStyle} /></div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className={sectionHeader}><span>Family History</span></h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div><label className={labelStyle}>Hypertension</label><select className={inputStyle}><option>No</option><option>Yes</option></select></div>
                                            <div><label className={labelStyle}>Diabetes</label><select className={inputStyle}><option>No</option><option>Yes</option></select></div>
                                            <div><label className={labelStyle}>Twins</label><select className={inputStyle}><option>No</option><option>Yes</option></select></div>
                                        </div>
                                        <div>
                                            <label className={labelStyle}>Significant Past Medical / Surgical / Transfusion / Allergies</label>
                                            <textarea className="w-full h-24 p-3 bg-white border border-slate-300 text-xs outline-none shadow-inner resize-none"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: OBSTETRIC HISTORY */}
                        {activeTab === 'obstetric' && (
                            <div className="animate-in fade-in space-y-10">
                                <div>
                                    <h3 className={sectionHeader}><span>Previous Pregnancy Record</span> <i className="fa fa-clipboard-list text-rose-300"></i></h3>
                                    <div className="border border-slate-200 bg-white overflow-hidden shadow-sm">
                                        <table className="w-full text-left text-[10px] border-collapse">
                                            <thead className="bg-slate-100 text-slate-500 font-black uppercase tracking-tight border-b">
                                                <tr>
                                                    <th className="px-3 py-3">Date</th>
                                                    <th className="px-3 py-3">Place</th>
                                                    <th className="px-3 py-3">Gest.</th>
                                                    <th className="px-3 py-3">Comp.</th>
                                                    <th className="px-3 py-3">Mode</th>
                                                    <th className="px-3 py-3 w-8 text-center">Sex</th>
                                                    <th className="px-3 py-3">B.Wt</th>
                                                    <th className="px-3 py-3">Status</th>
                                                    <th className="px-3 py-3">Puerperium</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 text-slate-700 font-bold uppercase">
                                                {[1, 2].map(i => (
                                                    <tr key={i} className="hover:bg-rose-50/20 group">
                                                        <td className="px-3 py-2"><input className="w-full border-none bg-transparent" placeholder="YYYY" /></td>
                                                        <td className="px-3 py-2"><input className="w-full border-none bg-transparent" /></td>
                                                        <td className="px-3 py-2"><input className="w-full border-none bg-transparent" placeholder="Wks" /></td>
                                                        <td className="px-3 py-2"><input className="w-full border-none bg-transparent" /></td>
                                                        <td className="px-3 py-2"><select className="w-full border-none bg-transparent"><option>SVD</option><option>C/S</option></select></td>
                                                        <td className="px-3 py-2 text-center"><select className="border-none bg-transparent"><option>M</option><option>F</option></select></td>
                                                        <td className="px-3 py-2"><input className="w-full border-none bg-transparent" placeholder="g" /></td>
                                                        <td className="px-3 py-2"><select className="w-full border-none bg-transparent"><option>Alive</option><option>Dead</option></select></td>
                                                        <td className="px-3 py-2"><input className="w-full border-none bg-transparent" placeholder="Details" /></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button className="mt-3 text-[10px] font-black text-rose-600 uppercase hover:underline">+ Append Pregnancy Row</button>
                                </div>
                                <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl">
                                    <h3 className={sectionHeader}><span>Obstetric Risks / Special Attention</span></h3>
                                    <textarea className="w-full h-24 p-4 bg-white border border-rose-200 rounded-xl text-xs font-black text-rose-900 outline-none shadow-inner resize-none leading-relaxed" placeholder="Document high-risk flags here (e.g. Previous CS, Preeclampsia, RH Neg)..."></textarea>
                                </div>
                            </div>
                        )}

                        {/* TAB: PHYSICAL EXAMINATION */}
                        {activeTab === 'exam' && (
                            <div className="animate-in fade-in space-y-10">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    <div className="space-y-6">
                                        <h3 className={sectionHeader}><span>General Physical</span></h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className={labelStyle}>Weight (kg)</label><input className={inputStyle} /></div>
                                            <div><label className={labelStyle}>Height (cm)</label><input className={inputStyle} /></div>
                                            <div className="col-span-2 p-4 bg-slate-900 text-center rounded-2xl">
                                                <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Current BMI</p>
                                                <p className="text-2xl font-black text-white tracking-tighter">24.5</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-2 space-y-6">
                                        <h3 className={sectionHeader}><span>Systemic Assessment</span></h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div><label className={labelStyle}>Breast RT</label><input className={inputStyle} /></div>
                                                <div><label className={labelStyle}>Breast LT</label><input className={inputStyle} /></div>
                                            </div>
                                            <div><label className={labelStyle}>C.V.S (Cardiac)</label><input className={inputStyle} /></div>
                                            <div><label className={labelStyle}>R.S (Resp)</label><input className={inputStyle} /></div>
                                            <div><label className={labelStyle}>Varicose Veins</label><select className={inputStyle}><option>None</option><option>Present</option></select></div>
                                            <div className="md:col-span-2">
                                                <label className={labelStyle}>Pelvic Examination Findings</label>
                                                <textarea className={`${inputStyle} h-20 resize-none`} placeholder="Cervix, adnexa, discharge..."></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: LAB PROFILE & SCANS */}
                        {activeTab === 'lab' && (
                            <div className="animate-in fade-in space-y-10">
                                <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                                    <div className="p-4 bg-slate-900 text-white flex justify-between items-center px-8 border-b border-white/5">
                                        <h6 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Payer-Compliant ANC Lab Grid</h6>
                                        <span className="text-[8px] font-bold text-slate-500 uppercase italic">Linked to Hospital LIS</span>
                                    </div>
                                    <div className="p-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-y-8 gap-x-6">
                                        {[
                                            { l: 'Blood Grp', v: 'A+' }, { l: 'Rhesus', v: 'Pos' }, { l: 'ICT', v: 'Neg' }, { l: 'Anti-D 28wks', v: '-' },
                                            { l: 'HB 1st', v: '12.4' }, { l: 'HB 2nd', v: '-' }, { l: 'Platelets', v: '240k' }, { l: 'RBS', v: '4.5' },
                                            { l: 'OGTT', v: '-' }, { l: 'HbA1c', v: '-' }, { l: 'Pap Smear', v: 'Pending' }, { l: 'ELISA HIV', v: 'Non-React' },
                                            { l: 'HBsAG', v: 'Neg' }, { l: 'VDRL/RPR', v: 'Non-React' }, { l: 'Viral Load', v: '-' }, { l: 'HVS Strep', v: '-' },
                                            { l: 'T.T. 1st', v: 'Done' }, { l: 'T.T. 2nd', v: '-' }, { l: 'Flu Vaccine', v: '-' }
                                        ].map(item => (
                                            <div key={item.l} className="group">
                                                <label className="flex items-start gap-2 cursor-pointer">
                                                    <input type="checkbox" className="w-3.5 h-3.5 rounded-none text-rose-600 mt-1" defaultChecked={item.v !== '-' && item.v !== 'Pending'} />
                                                    <div className="min-w-0">
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1 group-hover:text-rose-600 transition-colors">{item.l}</p>
                                                        <p className="text-[10px] font-black text-slate-800 uppercase truncate">{item.v}</p>
                                                    </div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className={sectionHeader}><span>Obstetric Ultrasound Reports</span> <button className="bg-rose-600 text-white px-3 py-1 rounded text-[8px] font-black uppercase shadow-lg">New Scan</button></h3>
                                    <div className="border border-slate-200 bg-white overflow-hidden shadow-sm">
                                        <table className="w-full text-left text-[10px] border-collapse">
                                            <thead className="bg-slate-100 text-slate-500 font-black uppercase border-b">
                                                <tr>
                                                    <th className="px-5 py-4 w-32">Date</th>
                                                    <th className="px-5 py-4">Radiological Report / Findings</th>
                                                    <th className="px-5 py-4 text-right w-16">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 text-slate-700 font-bold uppercase">
                                                <tr className="hover:bg-rose-50/20">
                                                    <td className="px-5 py-3 font-mono">24-Oct-2023</td>
                                                    <td className="px-5 py-3">Single live intrauterine fetus. Presentation: Cephalic. Gestation: 32wks. Liquor: Adequate.</td>
                                                    <td className="px-5 py-3 text-right text-gray-300 hover:text-red-500 cursor-pointer transition-colors"><i className="fa fa-trash"></i></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: SOAP NOTES */}
                        {activeTab === 'notes' && (
                            <div className="animate-in fade-in space-y-6 max-w-5xl">
                                <h3 className={sectionHeader}><span>SOAP Documentation</span> <i className="fa fa-pen-nib"></i></h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className={labelStyle}>Subjective (S)</label>
                                            <DictationButton onTranscript={t => setSoap({ ...soap, s: soap.s + ' ' + t })} />
                                        </div>
                                        <textarea 
                                            className={textareaStyle} 
                                            value={soap.s} 
                                            onChange={e => setSoap({ ...soap, s: e.target.value })} 
                                            placeholder="Patient complaints, history of presenting illness..."
                                        ></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className={labelStyle}>Objective (O)</label>
                                            <DictationButton onTranscript={t => setSoap({ ...soap, o: soap.o + ' ' + t })} />
                                        </div>
                                        <textarea 
                                            className={textareaStyle} 
                                            value={soap.o} 
                                            onChange={e => setSoap({ ...soap, o: e.target.value })} 
                                            placeholder="Physical exam findings, vitals interpretation..."
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className={labelStyle}>Assessment (A)</label>
                                            <DictationButton onTranscript={t => setSoap({ ...soap, a: soap.a + ' ' + t })} />
                                        </div>
                                        <textarea 
                                            className={textareaStyle} 
                                            value={soap.a} 
                                            onChange={e => setSoap({ ...soap, a: e.target.value })} 
                                            placeholder="Diagnosis, differential diagnosis, clinical impression..."
                                        ></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className={labelStyle}>Plan (P)</label>
                                            <DictationButton onTranscript={t => setSoap({ ...soap, p: soap.p + ' ' + t })} />
                                        </div>
                                        <textarea 
                                            className={textareaStyle} 
                                            value={soap.p} 
                                            onChange={e => setSoap({ ...soap, p: e.target.value })} 
                                            placeholder="Treatment, medication, referrals, follow-up..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: PERIODIC VISIT MATRIX */}
                        {activeTab === 'matrix' && (
                            <div className="animate-in fade-in space-y-4">
                                <h3 className={sectionHeader}><span>Longitudinal ANC Tracker</span> <button className="bg-rose-600 text-white px-4 py-1.5 rounded text-[8px] font-black uppercase shadow-lg transform active:scale-95 transition-all">Initialize Visit Row</button></h3>
                                <div className="border border-slate-200 bg-white overflow-x-auto shadow-2xl scrollbar-hide">
                                    <table className="w-full text-left text-[10px] border-collapse min-w-[1400px]">
                                        <thead className="bg-slate-900 text-white font-black uppercase tracking-widest border-b border-white/10">
                                            <tr>
                                                <th className="px-4 py-4 sticky left-0 bg-slate-900 z-10">Date</th>
                                                <th className="px-4 py-4">Gest.</th>
                                                <th className="px-4 py-4">Wt / HT</th>
                                                <th className="px-4 py-4">B.P</th>
                                                <th className="px-4 py-4">Pulse</th>
                                                <th className="px-4 py-4">Urine</th>
                                                <th className="px-4 py-4">Oedema</th>
                                                <th className="px-4 py-4">Fund. Ht</th>
                                                <th className="px-4 py-4">F.H.R</th>
                                                <th className="px-4 py-4">Pres/Pos</th>
                                                <th className="px-4 py-4">Clinical Remarks</th>
                                                <th className="px-4 py-4 text-center">T.C.A</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-slate-700 font-bold uppercase">
                                            <tr className="hover:bg-rose-50/40">
                                                <td className="px-4 py-3 sticky left-0 bg-white group-hover:bg-rose-50 z-10 border-r">24-Oct-23</td>
                                                <td className="px-4 py-3"><input className="w-12 border-none bg-transparent outline-none" placeholder="Wks" /></td>
                                                <td className="px-4 py-3"><input className="w-16 border-none bg-transparent outline-none" placeholder="kg/cm" /></td>
                                                <td className="px-4 py-3"><input className="w-16 border-none bg-transparent outline-none font-mono" placeholder="120/80" /></td>
                                                <td className="px-4 py-3"><input className="w-12 border-none bg-transparent outline-none" placeholder="bpm" /></td>
                                                <td className="px-4 py-3"><input className="w-16 border-none bg-transparent outline-none" placeholder="Alb/Sug" /></td>
                                                <td className="px-4 py-3"><select className="border-none bg-transparent text-[10px] font-black outline-none"><option>No</option><option>Yes (+)</option></select></td>
                                                <td className="px-4 py-3"><input className="w-12 border-none bg-transparent outline-none" /></td>
                                                <td className="px-4 py-3"><input className="w-12 border-none bg-transparent outline-none text-rose-600" /></td>
                                                <td className="px-4 py-3"><input className="w-20 border-none bg-transparent outline-none" placeholder="C/LOA" /></td>
                                                <td className="px-4 py-3"><input className="w-full min-w-[200px] border-none bg-transparent outline-none italic" placeholder="Add clinical notes..." /></td>
                                                <td className="px-4 py-3 text-center text-rose-600"><input type="date" className="border-none bg-transparent text-[9px] font-black outline-none" /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* TAB: BIRTH & EMERGENCY PLAN */}
                        {activeTab === 'plan' && (
                            <div className="animate-in zoom-in-95 duration-300 space-y-10 max-w-5xl">
                                <div className="bg-slate-900 text-white p-8 border-l-[10px] border-l-rose-600 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
                                    <div className="relative z-10">
                                        <h4 className="text-xl font-black uppercase tracking-tight">Birth Plan & Preparedness Matrix</h4>
                                        <p className="text-xs text-rose-400 font-bold uppercase tracking-widest mt-2 leading-relaxed max-w-lg">Configuring specialist alignment and logistical readiness for safe delivery.</p>
                                    </div>
                                    <div className="bg-white/10 px-6 py-4 rounded-xl border border-white/10 text-center relative z-10">
                                        <i className="fa fa-shield-halved text-rose-500 text-2xl mb-2"></i>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Risk Profile</p>
                                        <p className="text-sm font-black text-emerald-400 uppercase">AWAITING REVIEW</p>
                                    </div>
                                    <i className="fa fa-hospital-user absolute -right-6 -bottom-6 text-[12rem] text-white/5 rotate-12"></i>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <h3 className={sectionHeader}><span>Logistics & Preference</span></h3>
                                        <div className="space-y-4">
                                            <div><label className={labelStyle}>Planned Mode of Delivery</label><select className={inputStyle}><option>SVD (Spontaneous Vaginal)</option><option>Planned/Elective CS</option><option>VBAC Attempt</option></select></div>
                                            <div><label className={labelStyle}>Hospital of Choice</label><input className={inputStyle} defaultValue={hospitalName} /></div>
                                            <div><label className={labelStyle}>Mode of Payment</label><select className={inputStyle}><option>Insurance / Scheme</option><option>CASH</option><option>Linda Mama</option></select></div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className={sectionHeader}><span>Specialist Alignment</span></h3>
                                        <div className="space-y-4">
                                            <div><label className={labelStyle}>Assigned Paediatrician</label><input className={inputStyle} placeholder="Consultant Name..." /></div>
                                            <div><label className={labelStyle}>Assigned Anesthesiologist</label><input className={inputStyle} placeholder="Consultant Name..." /></div>
                                            <div><label className={labelStyle}>Epidural Analgesia Preference</label><select className={inputStyle}><option>NO</option><option>YES (Requested)</option></select></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Persistent Terminal Footer */}
            <div className="h-10 bg-slate-900 border-t border-white/5 px-8 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center"><i className="fa fa-fingerprint mr-2 text-rose-600"></i> Session Auth: 898_MCH</span>
                    <span className="flex items-center"><i className="fa fa-clock mr-2 text-rose-600"></i> Round Time: 00:15:42</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] font-black text-white italic opacity-40 uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                    <span>Commitment to Happy Healthy Clients!</span>
                </div>
            </div>
        </div>
    );
};

export default Antenatal;
