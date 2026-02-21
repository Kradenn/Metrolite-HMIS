import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { useNotification } from '../../context/NotificationContext';
import { usePatient } from '../../context/PatientContext';

// --- Types & Interfaces ---
type ChatCategory = 'Messages' | 'Departments' | 'Helpdesk' | 'Alerts';
type CallType = 'voice' | 'video' | 'none';

interface Message {
    id: string;
    sender: string;
    text: string;
    time: string;
    isMe: boolean;
    isAi?: boolean;
    status: 'sent' | 'delivered' | 'read';
}

interface Thread {
    id: string;
    name: string;
    avatar: string;
    lastMsg: string;
    time: string;
    unread: number;
    status: 'online' | 'away' | 'offline';
    role?: string;
    isAi?: boolean;
    category: ChatCategory;
}

// --- Audio Logic Utilities ---
function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
}

function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
}

const UMChat: React.FC = () => {
    const { notify } = useNotification();
    const { activePatient } = usePatient();
    const [activeCategory, setActiveCategory] = useState<ChatCategory>('Messages');
    const [activeThreadId, setActiveThreadId] = useState<string | null>('ai_assistant');
    const [activeCall, setActiveCall] = useState<CallType>('none');
    
    const [input, setInput] = useState('');
    const [isAiTyping, setIsAiTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    
    // Live API Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const sessionRef = useRef<any>(null);

    const [threads] = useState<Thread[]>([
        { id: 'ai_assistant', name: 'AI Clinical Copilot', category: 'Messages', role: 'System Assistant', avatar: '🤖', lastMsg: 'Ready for consultation.', time: 'Now', unread: 0, status: 'online', isAi: true },
        { id: 'u1', name: 'Dr. James Wilson', category: 'Messages', role: 'Cardiologist', avatar: 'JW', lastMsg: 'Stable results Room 402.', time: '10:05 AM', unread: 2, status: 'online' },
        { id: 'dept_pharmacy', name: 'Pharmacy Team', category: 'Departments', role: 'Group Channel', avatar: '💊', lastMsg: 'Stock order #992 received.', time: '11:00 AM', unread: 1, status: 'online' },
    ]);

    const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({
        'ai_assistant': [{ id: '1', sender: 'AI', text: 'UM Chat Live is active. Use the Video icon to start a virtual consultation.', time: '08:00 AM', isMe: false, isAi: true, status: 'read' }],
    });

    const activeConversation = useMemo(() => threads.find(t => t.id === activeThreadId), [activeThreadId, threads]);
    const filteredThreads = useMemo(() => threads.filter(t => t.category === activeCategory), [activeCategory, threads]);
    const activeMessages = useMemo(() => activeThreadId ? (chatHistory[activeThreadId] || []) : [], [activeThreadId, chatHistory]);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [activeMessages, isAiTyping]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !activeThreadId) return;

        const userMsg: Message = {
            id: Date.now().toString(), sender: 'Me', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isMe: true, status: 'sent'
        };

        setChatHistory(prev => ({ ...prev, [activeThreadId]: [...(prev[activeThreadId] || []), userMsg] }));
        setInput('');

        if (activeConversation?.isAi) {
            setIsAiTyping(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: input,
                    config: { systemInstruction: "Provide medical-grade, concise advice for hospital staff." }
                });
                const aiMsg: Message = {
                    id: (Date.now() + 1).toString(), sender: 'AI', text: response.text || 'Thinking...', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isMe: false, isAi: true, status: 'read'
                };
                setChatHistory(prev => ({ ...prev, [activeThreadId]: [...(prev[activeThreadId] || []), aiMsg] }));
            } catch (err) {
                notify('error', 'AI Hub Error', 'Failed to reach clinical brain.');
            } finally {
                setIsAiTyping(false);
            }
        }
    };

    const startCall = (type: CallType) => {
        setActiveCall(type);
        notify('info', 'Connecting VoIP', `Initializing secure ${type} tunnel for ${activeConversation?.name}...`);
        // Logic for Gemini Live API session would be initialized here
    };

    return (
        <div className="animate-bottom flex h-[calc(100vh-140px)] bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl overflow-hidden relative font-helvetica">
            
            {/* CALL OVERLAY */}
            {activeCall !== 'none' && (
                <div className="absolute inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex flex-col animate-in fade-in zoom-in-95 duration-500">
                    <div className="p-8 flex justify-between items-center shrink-0">
                         <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-2xl">
                                {activeConversation?.avatar}
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tight">{activeConversation?.name}</h2>
                                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                    Secure {activeCall} Link &bull; Active
                                </p>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <button className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/10 transition-all"><i className="fa fa-expand"></i></button>
                            <button onClick={() => setActiveCall('none')} className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition transform active:scale-95">End Call</button>
                         </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center p-12">
                        <div className="w-full max-w-4xl aspect-video bg-black/40 rounded-[3rem] border border-white/5 relative flex items-center justify-center overflow-hidden shadow-2xl group">
                            {activeCall === 'video' ? (
                                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                                     <i className="fa fa-user text-8xl text-slate-700"></i>
                                     <div className="absolute bottom-8 right-8 w-48 aspect-video bg-black/60 rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                                        <div className="w-full h-full flex items-center justify-center"><i className="fa fa-camera-slash text-slate-500"></i></div>
                                     </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center space-y-6">
                                    <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-5xl animate-pulse shadow-2xl">
                                        <i className="fa fa-microphone"></i>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {[1,2,3,4,5,6].map(i => <div key={i} className="w-1.5 h-8 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: `${i * 0.1}s`}}></div>)}
                                    </div>
                                </div>
                            )}
                            
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-red-500 text-white transition-all"><i className="fa fa-microphone"></i></button>
                                <button className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-blue-500 text-white transition-all"><i className="fa fa-video"></i></button>
                                <button className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-teal-500 text-white transition-all"><i className="fa fa-desktop"></i></button>
                                <button className="w-14 h-14 rounded-2xl bg-white/10 hover:bg-amber-500 text-white transition-all"><i className="fa fa-user-plus"></i></button>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-black/20 border-t border-white/5 flex justify-center">
                        <div className="w-full max-w-4xl flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                             <span className="flex items-center text-teal-400"><i className="fa fa-robot mr-2"></i> Clinical Scribe: Transcribing...</span>
                             <span className="flex items-center"><i className="fa fa-clock mr-2"></i> Session: 04:12</span>
                             <span className="flex items-center text-blue-400"><i className="fa fa-wifi mr-2"></i> Connection: 24ms (Excellent)</span>
                        </div>
                    </div>
                </div>
            )}

            {/* LEFT BAR: CATEGORY SELECTOR */}
            <div className="w-20 bg-slate-950 flex flex-col items-center py-8 space-y-10 shrink-0">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 mb-4">
                    <i className="fa fa-hospital-alt"></i>
                </div>
                {[
                    { id: 'Messages', icon: 'fa-user-group', label: 'DM' },
                    { id: 'Departments', icon: 'fa-sitemap', label: 'Groups' },
                    { id: 'Helpdesk', icon: 'fa-life-ring', label: 'Support' },
                    { id: 'Alerts', icon: 'fa-tower-broadcast', label: 'Alerts' },
                ].map(cat => (
                    <button 
                        key={cat.id} 
                        onClick={() => setActiveCategory(cat.id as ChatCategory)}
                        className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all group relative ${activeCategory === cat.id ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <i className={`fa ${cat.icon} text-lg`}></i>
                        <span className="text-[7px] font-black uppercase mt-1 tracking-widest">{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* MIDDLE BAR: THREADS */}
            <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50 shrink-0">
                <div className="p-6 bg-white border-b border-slate-100">
                    <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.2em]">{activeCategory} Hub</h2>
                    <div className="relative mt-4">
                        <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-[10px]"></i>
                        <input type="text" placeholder="Registry lookup..." className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-[10px] font-bold outline-none" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
                    {filteredThreads.map(t => (
                        <div key={t.id} onClick={() => setActiveThreadId(t.id)} className={`p-4 mx-2 rounded-2xl flex items-center space-x-4 cursor-pointer transition-all mb-1 ${activeThreadId === t.id ? 'bg-white shadow-lg ring-1 ring-slate-100' : 'hover:bg-slate-100'}`}>
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs relative ${t.isAi ? 'bg-indigo-600 text-white' : 'bg-blue-100 text-blue-600'}`}>
                                {t.avatar}
                                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${t.status === 'online' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-[11px] font-black text-slate-800 uppercase truncate">{t.name}</h4>
                                    <span className="text-[8px] font-bold text-gray-400">{t.time}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 truncate mt-0.5">{t.lastMsg}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT AREA: CANVAS */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
                {activeConversation ? (
                    <>
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white z-20 shadow-sm px-8">
                            <div className="flex items-center space-x-5">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs ${activeConversation.isAi ? 'bg-indigo-600 text-white shadow-xl' : 'bg-blue-50 text-blue-600'}`}>
                                    {activeConversation.avatar}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{activeConversation.name}</h3>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{activeConversation.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button onClick={() => startCall('video')} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center justify-center border border-slate-200"><i className="fa fa-video"></i></button>
                                <button onClick={() => startCall('voice')} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-green-600 hover:text-white transition-all shadow-sm flex items-center justify-center border border-slate-200"><i className="fa fa-phone"></i></button>
                                <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm flex items-center justify-center border border-slate-200"><i className="fa fa-ellipsis-v"></i></button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden relative bg-slate-50/50">
                            <div ref={scrollRef} className="h-full overflow-y-auto p-10 space-y-8 scrollbar-hide">
                                {activeMessages.map((m) => (
                                    <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}>
                                            <div className={`px-6 py-4 rounded-3xl text-xs font-medium leading-relaxed shadow-sm transition-all ${
                                                m.isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 
                                                m.isAi ? 'bg-[#1e293b] text-indigo-300 border border-slate-700 rounded-tl-none' : 
                                                'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                                            }`}>
                                                {m.isAi && <div className="text-[8px] font-black uppercase text-indigo-400 mb-2 flex items-center"><i className="fa fa-robot mr-1.5 animate-pulse"></i> AI Intelligence</div>}
                                                {m.text}
                                            </div>
                                            <div className="flex items-center mt-2 space-x-2 text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                                                <span>{m.time}</span>
                                                {m.isMe && <i className={`fa fa-check-double ${m.status === 'read' ? 'text-indigo-500' : ''}`}></i>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isAiTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-[#1e293b] border border-slate-700 px-6 py-3 rounded-full shadow-lg flex items-center space-x-2">
                                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 bg-white border-t border-slate-100 z-10">
                            <form onSubmit={handleSend} className="flex items-center space-x-4 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-indigo-500 transition-all">
                                <button type="button" className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"><i className="fa fa-paperclip text-lg"></i></button>
                                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type clinical message..." className="flex-1 bg-transparent border-none text-[13px] font-bold text-slate-800 outline-none" />
                                <button type="submit" className="bg-indigo-600 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-xl hover:bg-indigo-700 transition transform active:scale-95"><i className="fa fa-paper-plane"></i></button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-20 text-center bg-slate-50/30">
                        <i className="fa fa-comment-dots text-6xl opacity-10 mb-8"></i>
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">UM Chat Intelligence</h2>
                        <p className="text-xs font-bold text-slate-400 mt-2 uppercase max-w-sm">Encrypted communication node. VoIP and Video capability active.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UMChat;
