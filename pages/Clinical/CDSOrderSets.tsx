
import React, { useState, useMemo } from 'react';
import { usePatient } from '../../context/PatientContext';
import { useNotification } from '../../context/NotificationContext';
import { GoogleGenAI } from '@google/genai';

// --- Interfaces ---
interface OrderItem {
    id: string;
    type: 'Lab' | 'Rx' | 'Radiology' | 'Referral';
    name: string;
    instructions: string;
    price?: number;
}

interface OrderSet {
    id: string;
    title: string;
    description: string;
    icd11?: string;
    category: 'Emergency' | 'Chronic' | 'General' | 'MCH';
    lastUpdated: string;
    items: OrderItem[];
    qualityIndicator?: string;
}

// --- Mock Initial Data ---
const MOCK_SETS: OrderSet[] = [
    {
        id: 'CDS-101',
        title: 'Diabetic Clinic Protocol',
        description: 'Standard baseline for Type 2 Diabetes follow-up.',
        icd11: '5A11',
        category: 'Chronic',
        lastUpdated: '24 Oct 2023',
        qualityIndicator: 'HbA1c monitoring compliance',
        items: [
            { id: '1', type: 'Lab', name: 'HbA1c (Glycated Haemoglobin)', instructions: 'Fasting not required.' },
            { id: '2', type: 'Lab', name: 'Lipid Profile', instructions: '12-hour fast required.' },
            { id: '3', type: 'Rx', name: 'Metformin 500mg', instructions: '1x2 with meals' },
            { id: '4', type: 'Referral', name: 'Nutritionist Consultation', instructions: 'Dietary management review.' },
        ]
    },
    {
        id: 'CDS-102',
        title: 'Chest Pain / Acute MI',
        description: 'Emergency cardiac event bundle.',
        icd11: 'BA41',
        category: 'Emergency',
        lastUpdated: '25 Oct 2023',
        qualityIndicator: 'Door to Needle time',
        items: [
            { id: '5', type: 'Radiology', name: 'ECG (12-Lead)', instructions: 'Immediate.' },
            { id: '6', type: 'Lab', name: 'Troponin I/T', instructions: 'STAT.' },
            { id: '7', type: 'Rx', name: 'Aspirin 300mg', instructions: 'PO STAT (Chewable)' },
            { id: '8', type: 'Referral', name: 'Cardiologist On-Call', instructions: 'Immediate notification.' },
        ]
    }
];

const CDSOrderSets: React.FC = () => {
    const { activePatient } = usePatient();
    const { notify } = useNotification();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiQuery, setAiQuery] = useState('');
    const [showBuilder, setShowBuilder] = useState(false);
    const [selectedSetId, setSelectedSetId] = useState<string | null>(null);

    const filteredSets = useMemo(() => {
        return MOCK_SETS.filter(s => 
            s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            s.icd11?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const activeSet = useMemo(() => MOCK_SETS.find(s => s.id === selectedSetId), [selectedSetId]);

    const handleApplySet = (set: OrderSet) => {
        if (!activePatient) {
            notify('warning', 'Patient Context Required', 'Please select a patient before applying an order set.');
            return;
        }
        notify('success', 'Smart Set Applied', `All orders for "${set.title}" have been staged for ${activePatient.surname}.`);
    };

    const handleAiSuggest = async () => {
        if (!aiQuery) return;
        setIsAiLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `Create a professional Clinical Decision Support (CDS) Order Set for: ${aiQuery}. 
                Format as a structured list containing:
                1. Standard Lab Tests
                2. Evidence-based Medications
                3. Imaging requirements
                4. Quality Indicators to track.
                Context: Hospital Management System.`,
                config: { systemInstruction: "You are a clinical standards consultant." }
            });
            alert("AI suggested protocol generated. Consultant review required before deployment.");
            console.log(response.text);
        } catch (e) {
            notify('error', 'AI Service Error', 'Could not reach clinical intelligence engine.');
        } finally {
            setIsAiLoading(false);
            setAiQuery('');
        }
    };

    return (
        <div className="animate-bottom space-y-6 pb-20">
            {/* 1. Header Area */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-xl border border-indigo-400">
                        <i className="fa fa-list-check"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Clinical Decision Support (CDS)</h2>
                        <p className="text-xs text-gray-500 font-medium tracking-wide">Evidence-Based Care Pathways & Order Bundles</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                        <input 
                            type="text" 
                            placeholder="Filter by Diagnosis (ICD-11) or Name..." 
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={() => setShowBuilder(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition">
                        <i className="fa fa-plus-circle mr-2"></i> New Smart Set
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-280px)]">
                
                {/* 2. LEFT: PROTOCOL LIBRARY */}
                <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Protocol Library</h6>
                        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[9px] font-black">{filteredSets.length} Sets</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/30 scrollbar-hide">
                        {filteredSets.map(set => (
                            <div 
                                key={set.id}
                                onClick={() => setSelectedSetId(set.id)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer group ${selectedSetId === set.id ? 'bg-white border-indigo-600 shadow-md ring-1 ring-indigo-100' : 'bg-white border-gray-200 hover:border-indigo-300'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">{set.category}</span>
                                    {set.icd11 && <span className="text-[9px] font-mono text-gray-400 font-bold">ICD: {set.icd11}</span>}
                                </div>
                                <h5 className="text-sm font-black text-gray-800 uppercase tracking-tight leading-tight mb-2 group-hover:text-indigo-600">{set.title}</h5>
                                <div className="flex items-center space-x-3 text-gray-400 text-[11px]">
                                   <span title="Prescriptions"><i className="fa fa-pills mr-1"></i> {set.items.filter(i=>i.type==='Rx').length}</span>
                                   <span title="Lab Tests"><i className="fa fa-flask mr-1"></i> {set.items.filter(i=>i.type==='Lab').length}</span>
                                   <span title="Imaging"><i className="fa fa-x-ray mr-1"></i> {set.items.filter(i=>i.type==='Radiology').length}</span>
                                </div>
                                <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[9px] text-gray-400 font-bold italic">v2.4 Deployed</span>
                                    <button onClick={(e) => { e.stopPropagation(); handleApplySet(set); }} className="text-[10px] font-black text-blue-600 uppercase hover:underline">Apply To Patient</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. RIGHT: WORKSPACE / INSPECTOR */}
                <div className="lg:col-span-8 flex flex-col space-y-6 overflow-hidden">
                    {/* AI ASSISTANT MINI-BAR */}
                    <div className="bg-[#1e293b] text-white p-4 rounded-2xl shadow-xl flex items-center justify-between border border-slate-700 relative overflow-hidden">
                        <div className="flex items-center space-x-4 relative z-10">
                            <i className="fa fa-robot text-indigo-400 text-xl animate-pulse"></i>
                            <div>
                                <h6 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Protocol Intelligence</h6>
                                <div className="flex items-center space-x-3 mt-1">
                                    <input 
                                        type="text" 
                                        placeholder="Type condition (e.g. Septic Shock)..." 
                                        className="bg-slate-800 border-none rounded-lg py-1 px-3 text-xs w-64 outline-none focus:ring-1 focus:ring-indigo-500"
                                        value={aiQuery}
                                        onChange={e => setAiQuery(e.target.value)}
                                    />
                                    <button 
                                        onClick={handleAiSuggest}
                                        disabled={isAiLoading || !aiQuery}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition disabled:opacity-50"
                                    >
                                        {isAiLoading ? 'Synthesizing...' : 'Suggest Protocol'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <i className="fa fa-brain absolute -right-4 -bottom-4 text-7xl text-white/5 rotate-12"></i>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-sm">
                        {activeSet ? (
                            <>
                                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">{activeSet.title}</h3>
                                            <button className="text-gray-400 hover:text-indigo-600"><i className="fa fa-pencil-alt text-xs"></i></button>
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-2xl">{activeSet.description}</p>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <div className="inline-block bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">
                                            <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Quality Metric</p>
                                            <p className="text-[10px] font-bold text-emerald-800">{activeSet.qualityIndicator}</p>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button className="bg-white border border-gray-200 text-gray-600 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase shadow-sm">Duplicate</button>
                                            <button onClick={() => handleApplySet(activeSet)} className="bg-blue-600 text-white px-6 py-1.5 rounded-lg text-[10px] font-black uppercase shadow-lg hover:bg-blue-700 transition">Stage All Orders</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* LABS & RADIOLOGY */}
                                        <div className="space-y-6">
                                            <div>
                                                <h6 className="text-[10px] font-black text-purple-600 uppercase tracking-widest border-b border-purple-50 pb-2 mb-4 flex items-center">
                                                    <i className="fa fa-vial mr-2"></i> Laboratory Investigations
                                                </h6>
                                                <div className="space-y-2">
                                                    {activeSet.items.filter(i => i.type === 'Lab').map(item => (
                                                        <div key={item.id} className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-purple-300 transition-colors flex justify-between items-center group">
                                                            <div className="flex-1">
                                                                <h6 className="text-xs font-bold text-gray-700">{item.name}</h6>
                                                                <p className="text-[9px] text-gray-400 italic">{item.instructions}</p>
                                                            </div>
                                                            <button className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500"><i className="fa fa-times"></i></button>
                                                        </div>
                                                    ))}
                                                    <button className="w-full py-2 border border-dashed border-purple-200 rounded-xl text-[9px] font-black text-purple-400 uppercase hover:bg-purple-50 transition">+ Append Lab</button>
                                                </div>
                                            </div>

                                            <div>
                                                <h6 className="text-[10px] font-black text-teal-600 uppercase tracking-widest border-b border-teal-50 pb-2 mb-4 flex items-center">
                                                    <i className="fa fa-x-ray mr-2"></i> Diagnostic Imaging
                                                </h6>
                                                <div className="space-y-2">
                                                    {activeSet.items.filter(i => i.type === 'Radiology').map(item => (
                                                        <div key={item.id} className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm flex justify-between items-center group">
                                                            <div className="flex-1">
                                                                <h6 className="text-xs font-bold text-gray-700">{item.name}</h6>
                                                                <p className="text-[9px] text-gray-400 italic">{item.instructions}</p>
                                                            </div>
                                                            <button className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500"><i className="fa fa-times"></i></button>
                                                        </div>
                                                    ))}
                                                    {activeSet.items.filter(i => i.type === 'Radiology').length === 0 && <p className="text-[10px] text-gray-300 italic text-center py-4">No imaging orders in this set.</p>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* MEDICATIONS & REFERRALS */}
                                        <div className="space-y-6">
                                            <div>
                                                <h6 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-50 pb-2 mb-4 flex items-center">
                                                    <i className="fa fa-pills mr-2"></i> Pharmacotherapy
                                                </h6>
                                                <div className="space-y-2">
                                                    {activeSet.items.filter(i => i.type === 'Rx').map(item => (
                                                        <div key={item.id} className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm flex justify-between items-center group">
                                                            <div className="flex-1">
                                                                <h6 className="text-xs font-bold text-gray-700">{item.name}</h6>
                                                                <p className="text-[9px] text-emerald-600 font-bold">{item.instructions}</p>
                                                            </div>
                                                            <button className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500"><i className="fa fa-times"></i></button>
                                                        </div>
                                                    ))}
                                                    <button className="w-full py-2 border border-dashed border-emerald-200 rounded-xl text-[9px] font-black text-emerald-400 uppercase hover:bg-emerald-50 transition">+ Append Medication</button>
                                                </div>
                                            </div>

                                            <div>
                                                <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-50 pb-2 mb-4 flex items-center">
                                                    <i className="fa fa-external-link-alt mr-2"></i> Specialty Referrals
                                                </h6>
                                                <div className="space-y-2">
                                                    {activeSet.items.filter(i => i.type === 'Referral').map(item => (
                                                        <div key={item.id} className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm flex justify-between items-center group">
                                                            <div className="flex-1">
                                                                <h6 className="text-xs font-bold text-gray-700">{item.name}</h6>
                                                                <p className="text-[9px] text-gray-400 italic">{item.instructions}</p>
                                                            </div>
                                                            <button className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500"><i className="fa fa-times"></i></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-300 p-20 text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <i className="fa fa-hand-holding-medical text-4xl opacity-20"></i>
                                </div>
                                <h3 className="text-lg font-black text-gray-700 uppercase tracking-tight">Inspector Ready</h3>
                                <p className="text-xs font-medium mt-2 leading-relaxed max-w-xs">Select a clinical protocol from the library or use the AI Assistant to generate a new standard of care.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CDSOrderSets;
