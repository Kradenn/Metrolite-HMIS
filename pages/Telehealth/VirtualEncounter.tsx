import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { usePatient } from '../../context/PatientContext';
import { useNotification } from '../../context/NotificationContext';

const VirtualEncounter: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { activePatient } = usePatient();
    const { notify } = useNotification();
    
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [activePanel, setActivePanel] = useState<'chart' | 'chat' | 'orders'>('chat');

    useEffect(() => {
        if (!activePatient) {
            notify('warning', 'Session Context Error', 'No patient selected for this virtual encounter.');
            navigate('/telehealth');
        }
    }, [activePatient]);

    return (
        <div className="animate-bottom fixed inset-0 z-[6000] bg-slate-950 flex flex-col font-helvetica">
            {/* Header / Session Metadata */}
            <div className="h-16 bg-slate-900 border-b border-white/5 flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center space-x-6">
                    <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                        <i className="fa fa-video"></i>
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-tight">Virtual Encounter</h2>
                        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest mt-1">
                            Session: {id} &bull; SECURED P2P TUNNEL
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/5">
                    {['chart', 'chat', 'orders'].map(tab => (
                        <button 
                            key={tab} 
                            onClick={() => setActivePanel(tab as any)}
                            className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activePanel === tab ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-white'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[8px] font-black text-slate-500 uppercase leading-none mb-1">Time Elapsed</p>
                        <p className="text-sm font-black text-white font-mono">00:14:52</p>
                    </div>
                    <button onClick={() => navigate('/telehealth')} className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95">End Visit</button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* 1. VIDEO CALL CANVAS (Left) */}
                <div className="flex-1 flex flex-col bg-black relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                         {isVideoOff ? (
                             <div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center text-white text-5xl font-black shadow-2xl">
                                {activePatient?.surname[0]}
                             </div>
                         ) : (
                             <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                 <i className="fa fa-user-circle text-9xl text-slate-800 opacity-20"></i>
                                 <span className="text-xs font-black text-slate-700 uppercase absolute bottom-1/2">Remote Video Feed</span>
                             </div>
                         )}
                    </div>

                    {/* Local Feed PIP */}
                    <div className="absolute top-6 right-6 w-48 aspect-video bg-black rounded-2xl border border-white/20 shadow-2xl overflow-hidden group">
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                            <i className="fa fa-video-slash text-slate-600"></i>
                        </div>
                    </div>

                    {/* Call Controls Floating */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl">
                        <button onClick={() => setIsMuted(!isMuted)} className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                            <i className={`fa ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                        </button>
                        <button onClick={() => setIsVideoOff(!isVideoOff)} className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                            <i className={`fa ${isVideoOff ? 'fa-video-slash' : 'fa-video'}`}></i>
                        </button>
                        <button className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"><i className="fa fa-desktop"></i></button>
                        <button className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"><i className="fa fa-record-vinyl"></i></button>
                    </div>
                </div>

                {/* 2. CLINICAL CONTEXT PANEL (Right) */}
                <div className="w-[450px] bg-white flex flex-col border-l border-white/10 overflow-hidden shrink-0 shadow-2xl">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">{activePanel} Workspace</h3>
                        <span className="text-[9px] font-black bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase">Patient Active</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                        {activePanel === 'chat' && (
                            <div className="space-y-6">
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                                    <p className="text-[10px] text-blue-800 font-bold uppercase tracking-tight flex items-center">
                                        <i className="fa fa-robot mr-2"></i> AI Scribe Active
                                    </p>
                                    <p className="text-[11px] text-blue-600 mt-2 leading-relaxed italic">Consultation summary will be generated automatically at the end of the session.</p>
                                </div>
                                <div className="h-96 border border-dashed border-gray-200 rounded-3xl flex items-center justify-center text-gray-300">
                                    <p className="text-[10px] font-black uppercase tracking-widest">Chat Message Spool</p>
                                </div>
                            </div>
                        )}

                        {activePanel === 'chart' && (
                            <div className="space-y-8 animate-in fade-in">
                                <div>
                                    <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1 mb-4">Patient Profile</h6>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 bg-gray-50 rounded-xl"><p className="text-[8px] font-bold text-gray-400 uppercase">Age</p><p className="text-xs font-black text-slate-800">{activePatient?.age} Yrs</p></div>
                                        <div className="p-3 bg-gray-50 rounded-xl"><p className="text-[8px] font-bold text-gray-400 uppercase">Gender</p><p className="text-xs font-black text-slate-800">{activePatient?.gender}</p></div>
                                    </div>
                                </div>
                                <div>
                                    <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1 mb-4">Past Clinical Notes</h6>
                                    <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm italic text-xs text-gray-500 leading-relaxed">
                                        "Patient presented with chronic migraine. Previously responded well to sumatriptan..."
                                    </div>
                                </div>
                            </div>
                        )}

                        {activePanel === 'orders' && (
                            <div className="space-y-6">
                                <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg">New Prescription</button>
                                <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg">Order Diagnostics</button>
                                <button className="w-full bg-white border border-gray-200 text-slate-700 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-sm">Refer Specialty</button>
                            </div>
                        )}
                    </div>

                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                         <div className="bg-white border border-gray-200 rounded-2xl p-2 flex items-center space-x-3 focus-within:border-indigo-500 transition-all">
                            <input type="text" placeholder="Type for patient..." className="flex-1 bg-transparent border-none text-xs font-bold text-slate-800 outline-none p-2" />
                            <button className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"><i className="fa fa-paper-plane text-xs"></i></button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VirtualEncounter;
