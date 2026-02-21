
import React, { useState, useMemo } from 'react';
import { usePatient } from '../../context/PatientContext';
import { useNotification } from '../../context/NotificationContext';
import { GoogleGenAI } from '@google/genai';
import PatientSelectorModal from '../../components/PatientSelectorModal';
import QueueModal from '../../components/QueueModal';

const MealOrdering: React.FC = () => {
    const { activePatient, setActivePatient } = usePatient();
    const { notify } = useNotification();
    const [order, setOrder] = useState<any[]>([]);
    const [showAiModal, setShowAiModal] = useState(false);
    const [aiSuggestion, setAiSuggestion] = useState('');
    const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);

    const menu = {
        Breakfast: [{ name: 'Oatmeal & Berries', cal: 250, price: 300, id: 'B1' }, { name: 'Scrambled Eggs (Spinach)', cal: 300, price: 450, id: 'B2' }],
        Lunch: [{ name: 'Grilled Chicken Salad', cal: 450, price: 850, id: 'L1' }, { name: 'Lentil Veg Soup', cal: 350, price: 600, id: 'L2' }],
        Dinner: [{ name: 'Steamed Salmon & Quinoa', cal: 500, price: 1200, id: 'D1' }, { name: 'Vegetable Mild Curry', cal: 400, price: 750, id: 'D2' }],
    };

    const addToOrder = (item: any) => {
        setOrder([...order, { ...item, instanceId: Date.now() }]);
        notify('info', 'Added to Tray', `${item.name} staged for delivery.`);
    };

    const removeFromOrder = (id: number) => {
        setOrder(order.filter(item => item.instanceId !== id));
    };
    
    const handlePlaceOrder = () => {
        notify('success', 'Order Dispatched', `Meal tray finalized for ${activePatient?.surname}. Charge posted to account.`);
        setOrder([]);
    };
    
    const getAiSuggestion = async () => {
        if (!activePatient) return;
        setIsLoadingSuggestion(true);
        setShowAiModal(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Patient Profile: ${activePatient.surname}, Age: ${activePatient.age}, Diagnosis: ${activePatient.diagnosis || 'General'}. Suggest a clinical diet for Lunch. Be brief.`;
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { systemInstruction: "You are a hospital clinical dietitian." }
            });
            setAiSuggestion(response.text || 'No suggestion.');
        } catch (error) { setAiSuggestion('Offline.'); } finally { setIsLoadingSuggestion(false); }
    };

    const orderTotal = order.reduce((acc, item) => acc + item.price, 0);

    if (!activePatient) {
        return (
            <div className="animate-bottom min-h-[70vh] flex flex-col items-center justify-center space-y-8">
                <PatientSelectorModal isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} filterType="all" title="Kitchen: Identify Inpatient" />
                <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto text-orange-500 shadow-inner border border-orange-100">
                        <i className="fa fa-utensils text-4xl opacity-40"></i>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Dietary Management</h2>
                    <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto">Select a patient from the ward census to configure their dietary requirements and meal tray.</p>
                </div>
                <button onClick={() => setIsSelectorOpen(true)} className="bg-orange-600 text-white px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-700 transition">
                    <i className="fa fa-search mr-2"></i> Find Patient
                </button>
            </div>
        );
    }

    return (
        <div className="animate-bottom space-y-6 pb-20">
            <PatientSelectorModal isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} filterType="all" />

            {/* Header */}
            <div className="bg-white border border-gray-200 rounded-[2.5rem] shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-6 border-l-8 border-l-orange-500">
                <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center text-3xl shadow-inner border border-orange-100">
                        <i className="fa fa-hamburger"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">{activePatient.surname}, {activePatient.othernames}</h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Room: {activePatient.room || 'GW-101'} &bull; Diet: <span className="text-orange-600">{activePatient.diet || 'REGULAR'}</span></p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                   <button onClick={getAiSuggestion} className="bg-indigo-600 text-white px-8 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition flex items-center">
                       <i className="fa fa-robot mr-2"></i> Clinical Diet AI
                   </button>
                   <button onClick={() => setIsSelectorOpen(true)} className="bg-white border border-gray-200 text-gray-500 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition shadow-sm">Change Patient</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Menu Catalog */}
                <div className="lg:col-span-8 space-y-10">
                    {Object.entries(menu).map(([category, items]) => (
                        <div key={category} className="animate-in fade-in slide-in-from-bottom-2">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4 border-b border-slate-100 pb-2">{category} Selections</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {items.map(item => (
                                    <div key={item.id} className="bg-white border border-slate-100 rounded-[1.5rem] p-6 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all flex justify-between items-center group">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight truncate group-hover:text-orange-600 transition-colors">{item.name}</h4>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">Caloric Value: {item.cal} &bull; <span className="text-green-600">KES {item.price}</span></p>
                                        </div>
                                        <button onClick={() => addToOrder(item)} className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-600 hover:text-white transition-all shadow-sm border border-orange-100 flex items-center justify-center">
                                            <i className="fa fa-plus text-xs"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tray / Order Sidebar */}
                <div className="lg:col-span-4">
                    <div className="bg-slate-900 text-white rounded-[2.5rem] shadow-2xl overflow-hidden sticky top-24 border border-white/5">
                        <div className="p-6 border-b border-white/10 bg-black/20">
                            <h5 className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Service Tray</h5>
                            <p className="text-[9px] text-slate-500 font-bold uppercase">Assigned for delivery: Today</p>
                        </div>
                        <div className="p-6 space-y-4 min-h-[300px]">
                            {order.length > 0 ? order.map(item => (
                                <div key={item.instanceId} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-2xl group">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black uppercase truncate pr-4">{item.name}</p>
                                        <p className="text-[9px] text-slate-500 font-bold">KES {item.price}</p>
                                    </div>
                                    <button onClick={() => removeFromOrder(item.instanceId)} className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"><i className="fa fa-times-circle"></i></button>
                                </div>
                            )) : (
                                <div className="flex flex-col items-center justify-center h-48 text-slate-700 opacity-50">
                                    <i className="fa fa-utensil-spoon text-5xl mb-4"></i>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Tray is Empty</p>
                                </div>
                            )}
                        </div>
                        <div className="p-6 bg-black/40 border-t border-white/10 space-y-6">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Billable</span>
                                <span className="text-2xl font-black text-white tracking-tighter">KES {orderTotal.toLocaleString()}.00</span>
                            </div>
                            <button onClick={handlePlaceOrder} className="w-full bg-orange-600 text-white py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-orange-700 transition transform active:scale-95 disabled:opacity-30 disabled:grayscale" disabled={order.length === 0}>
                                Dispatch to Kitchen
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Suggestion Modal */}
            {showAiModal && (
                <div className="fixed inset-0 z-[7000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2"><i className="fa fa-robot text-indigo-600"></i> AI Dietitian Insight</h5>
                            <button onClick={() => setShowAiModal(false)} className="text-gray-400 hover:text-red-500 px-2"><i className="fa fa-times"></i></button>
                        </div>
                        <div className="p-10">
                            {isLoadingSuggestion ? (
                                <div className="text-center py-10">
                                    <i className="fa fa-spinner fa-spin text-4xl text-indigo-500 mb-4"></i>
                                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Synthesizing clinical diet plan...</p>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                                    <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl relative overflow-hidden">
                                        <p className="text-[11px] text-indigo-900 font-medium leading-relaxed italic relative z-10 whitespace-pre-wrap">{aiSuggestion}</p>
                                        <i className="fa fa-quote-right absolute -right-4 -bottom-4 text-6xl text-indigo-200/50"></i>
                                    </div>
                                    <div className="flex gap-4">
                                        <button onClick={() => setShowAiModal(false)} className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200">Close</button>
                                        <button onClick={() => { setShowAiModal(false); notify('info', 'AI Suggestion Used', 'Template applied to tray.'); }} className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Apply Advice</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealOrdering;
