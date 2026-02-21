import React, { useState, useEffect } from 'react';
import { usePatient } from '../context/PatientContext';
import { useNotification } from '../context/NotificationContext';
import DictationButton from './DictationButton';
import PatientSelectorModal from './PatientSelectorModal';
import QueueModal from './QueueModal';

interface SpecialtyEncounterProps {
    clinicName: string;
    icon: string;
    type: string;
    specializedForm: React.ReactNode;
    ageLimit?: number;
    genderLimit?: 'Male' | 'Female';
}

const SpecialtyEncounter: React.FC<SpecialtyEncounterProps> = ({ 
    clinicName, 
    icon, 
    type, 
    specializedForm,
    ageLimit,
    genderLimit
}) => {
    const { activePatient, setActivePatient } = usePatient();
    const { notify } = useNotification();
    
    const [activeTab, setActiveTab] = useState<'vitals' | 'specialized' | 'notes' | 'diagnosis' | 'plan'>('vitals');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [noteText, setNoteText] = useState('');
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [showQueueModal, setShowQueueModal] = useState(false);
    const [triageHistory, setTriageHistory] = useState<any[]>([]);

    useEffect(() => {
        if (activePatient) {
            const savedTriage = localStorage.getItem(`latest_triage_${activePatient.outpatientNo}`);
            if (savedTriage) {
                try {
                    const parsed = JSON.parse(savedTriage);
                    if (new Date(parsed.timestamp).toDateString() === new Date().toDateString()) {
                        setTriageHistory(parsed.history || []);
                    }
                } catch (e) { setTriageHistory([]); }
            } else { setTriageHistory([]); }
        }
    }, [activePatient]);

    const handleComplete = () => {
        notify('success', 'Visit Finalized', `${clinicName} encounter for ${activePatient?.surname} has been successfully closed.`);
        setShowQueueModal(true);
    };

    if (!activePatient) {
        return (
            <div className="animate-bottom min-h-[calc(100vh-140px)] bg-slate-50 -m-4 p-8 flex flex-col items-center justify-center">
                <PatientSelectorModal 
                    isOpen={isSelectorOpen} 
                    onClose={() => setIsSelectorOpen(false)} 
                    filterType={ageLimit ? 'kids' : genderLimit === 'Female' ? 'mothers' : 'all'} 
                    title={`${clinicName} Registry Finder`} 
                />
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-white border border-slate-200 flex items-center justify-center text-4xl shadow-xl text-slate-300">
                        <i className={`fa ${icon}`}></i>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{clinicName} Clinic</h1>
                        <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2 italic">Authentication Required</p>
                    </div>
                    <button 
                        onClick={() => setIsSelectorOpen(true)}
                        className="bg-indigo-600 text-white px-10 py-3 font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition transform active:scale-95"
                    >
                        <i className="fa fa-search mr-2"></i> Identify Patient
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-bottom flex flex-col h-[calc(100vh-120px)] bg-gray-50 -m-4 relative overflow-hidden font-helvetica">
            <PatientSelectorModal isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} title={`Switch ${clinicName} Patient`} />
            <QueueModal isOpen={showQueueModal} onClose={() => setShowQueueModal(false)} patientName={activePatient.surname} patientId={activePatient.outpatientNo} />

            <div className="h-12 border-b border-gray-200 bg-white px-4 flex items-center justify-between shrink-0 z-20 shadow-sm">
                <div className="flex items-center space-x-4">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-8 h-8 hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
                        <i className={`fa ${isSidebarOpen ? 'fa-align-right' : 'fa-align-left'}`}></i>
                    </button>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h2 className="text-sm font-black text-gray-800 uppercase tracking-tight leading-none">{clinicName}</h2>
                            <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest border border-blue-200">Active Node</span>
                        </div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                            {activePatient.surname}, {activePatient.othernames} &bull; {activePatient.outpatientNo}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setIsSelectorOpen(true)} className="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm">Change</button>
                    <button onClick={handleComplete} className="bg-blue-600 text-white px-6 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition transform active:scale-95">Complete Visit</button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-60' : 'w-0 overflow-hidden'}`}>
                    <div className="p-3 border-b border-gray-100 bg-gray-50/50 font-black text-[9px] text-slate-400 uppercase tracking-[0.2em]">Encounter Vectors</div>
                    <div className="flex-1 overflow-y-auto py-1">
                        {[
                            { id: 'vitals', label: 'Triage & Vitals', icon: 'fa-heartbeat' },
                            { id: 'specialized', label: 'Clinical Review', icon: 'fa-user-md' },
                            { id: 'notes', label: 'Clinical Notes', icon: 'fa-file-medical-alt' },
                            { id: 'diagnosis', label: 'ICD Diagnosis', icon: 'fa-search-plus' },
                            { id: 'plan', label: 'Management Plan', icon: 'fa-clipboard-list' },
                        ].map(s => (
                            <button 
                                key={s.id}
                                onClick={() => setActiveTab(s.id as any)}
                                className={`w-full text-left px-5 py-3 flex items-center space-x-3 transition-all ${activeTab === s.id ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600 font-black' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <i className={`fa ${s.icon} text-[10px] ${activeTab === s.id ? 'text-blue-600' : 'text-gray-300'}`}></i>
                                <span className="text-[10px] font-bold uppercase tracking-tight">{s.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden bg-white">
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide bg-slate-50/20">
                        <div className="max-w-6xl mx-auto">
                            {activeTab === 'vitals' && (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] border-b border-gray-100 pb-2">Physiological Telemetry</h3>
                                    {triageHistory.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {triageHistory.map((take, idx) => (
                                                <div key={idx} className="bg-white border border-slate-200 p-4 shadow-sm border-t-4 border-t-indigo-600">
                                                    <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-3 block">Reading Set #{idx+1}</span>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-[9px] font-bold text-gray-400 uppercase">Blood Pressure</span><span className="text-sm font-black text-slate-800">{take.systolic}/{take.diastolic}</span></div>
                                                        <div className="flex justify-between border-b border-slate-50 pb-1"><span className="text-[9px] font-bold text-gray-400 uppercase">Pulse Rate</span><span className="text-sm font-black text-rose-600">{take.pulse}</span></div>
                                                        <div className="flex justify-between"><span className="text-[9px] font-bold text-gray-400 uppercase">Temperature</span><span className="text-sm font-black text-orange-500">{take.temp}°C</span></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-20 text-center text-slate-300 border-2 border-dashed border-slate-200 uppercase font-black tracking-widest text-[10px] bg-white">Awaiting station synchronization...</div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'specialized' && (
                                <div className="animate-in slide-in-from-bottom-2 duration-300">
                                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] border-b border-gray-100 pb-2 mb-6">{clinicName} Matrix Parameters</h3>
                                    <div className="bg-white border border-slate-200 p-6 shadow-sm border-l-[10px] border-l-blue-600">
                                        {specializedForm}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'notes' && (
                                <div className="space-y-4 animate-in fade-in duration-300">
                                    <div className="flex justify-between items-center bg-white p-3 border border-slate-200 border-l-[10px] border-l-purple-600 shadow-sm">
                                        <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">Clinical Documentation</h3>
                                        <DictationButton onTranscript={t => setNoteText(prev => prev + ' ' + t)} />
                                    </div>
                                    <textarea value={noteText} onChange={e => setNoteText(e.target.value)} className="w-full h-80 bg-white border border-slate-200 p-6 text-xs font-semibold outline-none focus:border-indigo-500 shadow-inner resize-none leading-relaxed text-slate-700" placeholder="Type or dictate clinical progress notes..."></textarea>
                                </div>
                            )}
                            
                            {['diagnosis', 'plan'].includes(activeTab) && (
                                <div className="py-20 text-center text-slate-200 uppercase font-black tracking-[0.4em] text-[10px] border border-dashed border-slate-200 bg-white">{activeTab} node active</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpecialtyEncounter;