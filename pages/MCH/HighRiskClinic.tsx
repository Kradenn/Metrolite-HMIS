import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { useNotification } from '../../context/NotificationContext';
import PatientSelectorModal from '../../components/PatientSelectorModal';

const HighRiskClinic: React.FC = () => {
    const { activePatient, setActivePatient } = usePatient();
    const { notify } = useNotification();
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [riskLevel, setRiskLevel] = useState<'High' | 'Critical'>('High');

    const handleSave = () => {
        notify('success', 'High Risk Protocol Saved', 'Specialized monitoring data updated.');
    };

    const inputStyle = "w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm";
    const labelStyle = "block text-[10px] font-semibold text-slate-500 uppercase mb-1.5 tracking-wider";

    if (!activePatient) {
        return (
            <div className="animate-bottom min-h-[70vh] flex flex-col items-center justify-center space-y-8">
                <PatientSelectorModal isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} filterType="all" title="High-Risk Registry Finder" />
                <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-600 shadow-inner border border-red-100">
                        <i className="fa fa-exclamation-triangle text-5xl opacity-40"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">High-Risk Clinic (HRC)</h2>
                    <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto">Targeted care for complex maternal cases and children with special needs.</p>
                </div>
                <button onClick={() => setIsSelectorOpen(true)} className="bg-red-600 text-white px-10 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-red-100 hover:bg-red-700 transition">
                    <i className="fa fa-search mr-2"></i> Identify Patient
                </button>
            </div>
        );
    }

    return (
        <div className="animate-bottom space-y-6 pb-20">
            <PatientSelectorModal isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} filterType="all" title="Switch HRC Patient" />

            {/* Alert Header */}
            <div className={`border-l-8 p-6 rounded-3xl bg-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 ${riskLevel === 'Critical' ? 'border-red-600 shadow-red-100' : 'border-orange-500 shadow-orange-100'}`}>
                <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner border ${riskLevel === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                        <i className="fa fa-biohazard"></i>
                    </div>
                    <div>
                        <div className="flex items-center space-x-3">
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{activePatient.surname}, {activePatient.othernames}</h2>
                            <select 
                                value={riskLevel} 
                                onChange={(e) => setRiskLevel(e.target.value as any)}
                                className={`text-[9px] font-black uppercase px-2 py-1 rounded border-2 outline-none ${riskLevel === 'Critical' ? 'border-red-600 text-red-600' : 'border-orange-500 text-orange-500'}`}
                            >
                                <option value="High">High Risk</option>
                                <option value="Critical">Critical Case</option>
                            </select>
                        </div>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">ID: {activePatient.outpatientNo} &bull; {activePatient.gender} &bull; {activePatient.age} Yrs</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button onClick={() => setIsSelectorOpen(true)} className="bg-slate-100 text-slate-500 px-6 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition">Switch Patient</button>
                    <button onClick={handleSave} className="bg-slate-900 text-white px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition transform active:scale-95">Commit HRC Log</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Risk Parameters */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                        <h5 className="text-[11px] font-black text-red-600 uppercase tracking-widest border-b border-red-50 pb-2 mb-6">Maternal/Child Risk Indicators</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className={labelStyle}>Primary Risk Diagnosis</label>
                                    <select className={inputStyle}>
                                        <option>Pre-eclampsia / Eclampsia</option>
                                        <option>Gestational Diabetes</option>
                                        <option>Multiple Gestation (Twins+)</option>
                                        <option>Malnutrition (Severe)</option>
                                        <option>Chronic Illness Complication</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelStyle}>Assigned Consultant</label>
                                    <input className={inputStyle} placeholder="Name of Specialist..." />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className={labelStyle}>Clinical Warning (Red Flags)</label>
                                    <textarea className="w-full h-24 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-900 outline-none" placeholder="Document immediate concerns..."></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                        <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-2 mb-6">Intervention Tracking</h5>
                        <div className="space-y-4">
                            {[
                                { task: 'Bi-weekly BP Profile', status: 'In Progress', icon: 'fa-heartbeat' },
                                { task: 'Serial Growth Ultrasound', status: 'Scheduled', icon: 'fa-wave-square' },
                                { task: 'Neonatal Specialist Consult', status: 'Completed', icon: 'fa-user-md' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:bg-white hover:border-red-200 transition-all">
                                    <div className="flex items-center space-x-4">
                                        <i className={`fa ${item.icon} text-slate-300 group-hover:text-red-500 transition-colors`}></i>
                                        <span className="text-xs font-bold text-slate-700 uppercase">{item.task}</span>
                                    </div>
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${item.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Patient Status Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                        <h6 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">HRC Status Report</h6>
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-bold uppercase">Admission Count:</span>
                                <span className="font-black">4 Previous</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-bold uppercase">Last Review:</span>
                                <span className="font-black">Yesterday</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-bold uppercase">T.C.A (Next):</span>
                                <span className="font-black text-red-400 underline decoration-2">26 Oct 2023</span>
                            </div>
                        </div>
                        <i className="fa fa-notes-medical absolute -right-4 -bottom-4 text-7xl text-white/5 rotate-12"></i>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Urgent Actions</h6>
                        <div className="space-y-3">
                             <button className="w-full py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-100">Escalate to Senior MD</button>
                             <button className="w-full py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest">Order Emergency Labs</button>
                             <button className="w-full py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-[10px] font-black uppercase tracking-widest">Print Patient Alert Card</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HighRiskClinic;