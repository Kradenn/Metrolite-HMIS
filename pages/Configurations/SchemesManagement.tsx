import React, { useState, useMemo } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { GoogleGenAI } from "@google/genai";

// --- Interfaces ---
interface Scheme {
    id: string;
    name: string;
    category: 'Insurance' | 'Corporate' | 'Cash';
    creditLimit: number;
    status: 'Active' | 'Inactive' | 'Credit Warning';
    phone: string;
    email: string;
    glAccount: string;
    smartAfricaEnabled: boolean;
}

interface PriceLine {
    id: string;
    serviceName: string;
    category: string;
    standardRate: number;
    schemeRate: number;
    copay: number;
}

const MOCK_SCHEMES: Scheme[] = [
    { id: 'S1', name: 'JUBILEE INSURANCE', category: 'Insurance', creditLimit: 5000000, status: 'Active', phone: '0711000999', email: 'claims@jubilee.co.ke', glAccount: '1200-01 (Receivables)', smartAfricaEnabled: true },
    { id: 'S2', name: 'NHIF / SHA', category: 'Insurance', creditLimit: 0, status: 'Active', phone: '0800720601', email: 'support@nhif.or.ke', glAccount: '1200-02 (Statutory)', smartAfricaEnabled: true },
    { id: 'S3', name: 'SAFARICOM STAFF', category: 'Corporate', creditLimit: 2000000, status: 'Credit Warning', phone: '0722000000', email: 'wellness@safaricom.co.ke', glAccount: '1200-03 (Corporate)', smartAfricaEnabled: false },
    { id: 'S4', name: 'AON MINET', category: 'Insurance', creditLimit: 10000000, status: 'Active', phone: '0733111222', email: 'info@minet.com', glAccount: '1200-01 (Receivables)', smartAfricaEnabled: true },
];

const MOCK_PRICES: PriceLine[] = [
    { id: '1', serviceName: 'Consultation - General', category: 'Consultation', standardRate: 1000, schemeRate: 1500, copay: 0 },
    { id: '2', serviceName: 'Consultation - Specialist', category: 'Consultation', standardRate: 3000, schemeRate: 3000, copay: 500 },
    { id: '3', serviceName: 'Full Haemogram (CBC)', category: 'Laboratory', standardRate: 800, schemeRate: 1000, copay: 0 },
    { id: '4', serviceName: 'Chest X-Ray PA', category: 'Radiology', standardRate: 1200, schemeRate: 1500, copay: 0 },
];

const SchemesManagement: React.FC = () => {
    const { notify } = useNotification();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(MOCK_SCHEMES[0].id);
    const [activeTab, setActiveTab] = useState<'details' | 'matrix' | 'commission' | 'biometric'>('details');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

    const filteredSchemes = useMemo(() => 
        MOCK_SCHEMES.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())), 
    [searchTerm]);

    const activeScheme = useMemo(() => MOCK_SCHEMES.find(s => s.id === selectedSchemeId), [selectedSchemeId]);

    const runAiPolicyAudit = async () => {
        if (!activeScheme) return;
        setIsAiLoading(true);
        setAiAnalysis(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `As a Medical Billing Auditor, analyze this payer scheme: 
            Name: ${activeScheme.name}, Category: ${activeScheme.category}, Smart Africa: ${activeScheme.smartAfricaEnabled}.
            Matrix Sample: Consultation is KES 1500, Lab is KES 1000.
            Provide a short clinical billing audit: 1. Potential for revenue leakage. 2. Common rejection patterns for this type of payer in Kenya. 3. Suggested co-pay optimization.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { systemInstruction: "You are a professional, data-driven, and highly concise. Use clinical-financial terminology." }
            });
            setAiAnalysis(response.text || "Audit clear.");
        } catch (e) {
            setAiAnalysis("Audit Engine Offline.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const inputClass = "w-full p-2.5 bg-white border border-slate-300 rounded-none text-[11px] font-bold text-slate-800 outline-none focus:border-indigo-600 transition-all shadow-inner";
    const labelClass = "block text-[9px] font-black text-slate-500 uppercase px-1 mb-1 tracking-widest";
    // Fix: Defined missing sectionHeader to resolve "Cannot find name" error on lines 188 and 199
    const sectionHeader = "text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1 mb-4 flex justify-between";

    return (
        <div className="animate-bottom h-[calc(100vh-100px)] flex flex-col font-helvetica overflow-hidden -m-4 md:-m-6 bg-slate-50">
            
            {/* 1. Industrial Header */}
            <div className="bg-slate-900 border-l-[6px] border-l-indigo-600 p-3 flex justify-between items-center shrink-0 z-30 shadow-lg">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-none flex items-center justify-center text-xl shadow-lg">
                        <i className="fa fa-building-shield"></i>
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-tighter leading-none">Schemes Management Command</h2>
                        <p className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Global Payer Configuration & Matrixing</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest border border-white/5 transition">Inherit Matrix</button>
                    <button className="bg-indigo-600 text-white px-6 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition">Register New Payer</button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden min-h-0 bg-white">
                
                {/* 2. Left: Schemes Registry Sidebar */}
                <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                        <div className="relative">
                            <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
                            <input 
                                type="text" 
                                placeholder="Filter Registry..." 
                                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-none text-[10px] font-bold outline-none focus:ring-1 focus:ring-indigo-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-50 scrollbar-hide">
                        {filteredSchemes.map(s => (
                            <div 
                                key={s.id} 
                                onClick={() => setSelectedSchemeId(s.id)}
                                className={`p-4 cursor-pointer transition-all border-l-4 ${selectedSchemeId === s.id ? 'bg-indigo-50 border-l-indigo-600 shadow-inner' : 'hover:bg-gray-50 border-l-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[8px] px-1.5 py-0.5 rounded-none font-black uppercase border ${s.category === 'Insurance' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>{s.category}</span>
                                    <span className={`text-[8px] font-black uppercase ${s.status === 'Active' ? 'text-emerald-500' : 'text-rose-500'}`}>{s.status}</span>
                                </div>
                                <h6 className="text-[11px] font-black text-gray-800 uppercase truncate leading-tight">{s.name}</h6>
                                <div className="flex justify-between items-center mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                    <span>{s.email}</span>
                                    {s.smartAfricaEnabled && <i className="fa fa-fingerprint text-indigo-400" title="Smart Africa Active"></i>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Right: Specialized Hub Workspace */}
                <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
                    {activeScheme ? (
                        <>
                            {/* Workflow Tabs: Flat Industrial */}
                            <div className="bg-white border-b border-slate-200 flex px-4 shrink-0 shadow-sm relative z-20">
                                {[
                                    { id: 'details', label: '1. Payer Identity', icon: 'fa-id-card' },
                                    { id: 'matrix', label: '2. Pricing Matrix', icon: 'fa-tags' },
                                    { id: 'commission', label: '3. Rebate Config', icon: 'fa-percent' },
                                    { id: 'biometric', label: '4. Biometric Switch', icon: 'fa-fingerprint' },
                                ].map(tab => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${activeTab === tab.id ? 'bg-white text-indigo-600 border-b-indigo-600' : 'text-slate-400 border-b-transparent hover:text-slate-600'}`}
                                    >
                                        <i className={`fa ${tab.icon} text-[9px]`}></i> {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                                <div className="max-w-6xl mx-auto space-y-10">
                                    
                                    {/* AI POLICY AUDITOR BANNER */}
                                    <div className="bg-[#1e293b] text-white p-6 rounded-none relative overflow-hidden shadow-2xl group">
                                        <div className="relative z-10 flex justify-between items-start">
                                            <div className="flex-1">
                                                <h5 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400 mb-2 flex items-center"><i className="fa fa-shield-halved mr-2"></i> Payer Contract Intelligence</h5>
                                                {isAiLoading ? (
                                                    <div className="flex items-center gap-2 text-indigo-300 text-[10px] py-2 uppercase font-black"><i className="fa fa-spinner fa-spin"></i> Auditing policy constraints...</div>
                                                ) : aiAnalysis ? (
                                                    <div className="text-[11px] font-medium text-slate-300 leading-relaxed max-w-2xl bg-black/20 p-4 border border-white/5 animate-in fade-in">{aiAnalysis}</div>
                                                ) : (
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight max-w-lg">Execute AI audit to identify common claim rejection patterns and matrix anomalies for {activeScheme.name}.</p>
                                                )}
                                            </div>
                                            <button onClick={runAiPolicyAudit} disabled={isAiLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-none text-[9px] font-black uppercase tracking-widest shadow-xl transition-all flex items-center gap-2 shrink-0 group-hover:scale-105">
                                                <i className="fa fa-robot"></i> Run Policy Audit
                                            </button>
                                        </div>
                                        <i className="fa fa-file-contract absolute -right-6 -bottom-6 text-9xl text-white/5 rotate-12 transition-transform group-hover:rotate-[15deg]"></i>
                                    </div>

                                    {/* TAB: GENERAL IDENTITY */}
                                    {activeTab === 'details' && (
                                        <div className="animate-in fade-in duration-300 grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-6">
                                                <h6 className={sectionHeader}>Corporate Identity <span>Essential Meta</span></h6>
                                                <div className="space-y-4">
                                                    <div><label className={labelClass}>Full Registered Name</label><input className={inputClass} defaultValue={activeScheme.name} /></div>
                                                    <div><label className={labelClass}>Ledger Account (Receivables)</label><select className={inputClass} defaultValue={activeScheme.glAccount}><option>{activeScheme.glAccount}</option></select></div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div><label className={labelClass}>Scheme Category</label><select className={inputClass} defaultValue={activeScheme.category}><option>Insurance</option><option>Corporate</option><option>Cash</option></select></div>
                                                        <div><label className={labelClass}>Credit Limit (Global)</label><input type="number" className={`${inputClass} text-red-600 font-black`} defaultValue={activeScheme.creditLimit} /></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <h6 className={sectionHeader}>Claims Communication <span>Notification Core</span></h6>
                                                <div className="space-y-4">
                                                    <div><label className={labelClass}>Claims/Wellness Email</label><input type="email" className={inputClass} defaultValue={activeScheme.email} /></div>
                                                    <div><label className={labelClass}>Official Phone Line</label><input type="tel" className={inputClass} defaultValue={activeScheme.phone} /></div>
                                                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-none">
                                                        <p className="text-[9px] text-amber-800 leading-relaxed font-bold">
                                                            <i className="fa fa-info-circle mr-1"></i>
                                                            Financial alerts for this scheme are triggered when the net balance across all visits exceeds 80% of the Credit Limit.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* TAB: PRICING MATRIX */}
                                    {activeTab === 'matrix' && (
                                        <div className="animate-in slide-in-from-bottom-4 duration-300 space-y-6">
                                            <div className="flex justify-between items-center bg-indigo-50 border border-indigo-100 p-4 rounded-none">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white border border-indigo-200 rounded-none flex items-center justify-center text-indigo-600 text-lg shadow-sm"><i className="fa fa-calculator"></i></div>
                                                    <div>
                                                        <h6 className="text-[10px] font-black text-indigo-800 uppercase tracking-widest">Active Tariff Matrix</h6>
                                                        <p className="text-[9px] text-indigo-500 font-bold uppercase mt-1">Defining specialized pricing for {activeScheme.name}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="bg-white border border-indigo-200 text-indigo-600 px-4 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest hover:bg-white transition shadow-sm">Sync with Master</button>
                                                    <button className="bg-indigo-600 text-white px-6 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest shadow-lg">New Override</button>
                                                </div>
                                            </div>

                                            <div className="border border-slate-200 rounded-none overflow-hidden bg-white shadow-sm">
                                                <table className="w-full text-left text-[11px] border-collapse">
                                                    <thead className="bg-slate-100 border-b border-slate-200 text-slate-500 font-black uppercase tracking-tight">
                                                        <tr>
                                                            <th className="px-5 py-4">Service/Item Name</th>
                                                            <th className="px-5 py-4 text-center">Category</th>
                                                            <th className="px-5 py-4 text-right">Standard</th>
                                                            <th className="px-5 py-4 text-right">Scheme Tariff</th>
                                                            <th className="px-5 py-4 text-right">Co-Pay</th>
                                                            <th className="px-5 py-4 text-right w-16">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {MOCK_PRICES.map(price => (
                                                            <tr key={price.id} className="hover:bg-indigo-50/20 transition-colors group">
                                                                <td className="px-5 py-4 font-black text-slate-800 uppercase tracking-tight">{price.serviceName}</td>
                                                                <td className="px-5 py-4 text-center"><span className="text-[9px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase">{price.category}</span></td>
                                                                <td className="px-5 py-4 text-right font-bold text-slate-400">{price.standardRate.toLocaleString()}</td>
                                                                <td className="px-5 py-4 text-right">
                                                                    <input className="w-24 text-right p-1.5 bg-gray-50 border border-slate-200 rounded-none font-black text-indigo-600 outline-none focus:border-indigo-600" defaultValue={price.schemeRate} />
                                                                </td>
                                                                <td className="px-5 py-4 text-right">
                                                                    <input className="w-20 text-right p-1.5 bg-gray-50 border border-slate-200 rounded-none font-black text-red-500 outline-none focus:border-red-500" defaultValue={price.copay} />
                                                                </td>
                                                                <td className="px-5 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button className="text-gray-300 hover:text-red-500"><i className="fa fa-trash"></i></button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    {/* TAB: COMMISSION & REBATES */}
                                    {activeTab === 'commission' && (
                                        <div className="animate-in fade-in duration-300 max-w-3xl mx-auto space-y-8">
                                            <div className="bg-emerald-900 text-white p-8 rounded-none relative overflow-hidden shadow-2xl">
                                                <h6 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest border-b border-white/10 pb-2 mb-6">Rebate Configuration</h6>
                                                <div className="grid grid-cols-2 gap-10 relative z-10">
                                                    <div className="space-y-4">
                                                        <label className={labelClass}>Rebate Type</label>
                                                        <select className={`${inputClass} bg-emerald-800 border-emerald-700 text-white`}>
                                                            <option>Percentage based (%)</option>
                                                            <option>Fixed Fee per Visit</option>
                                                            <option>None</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <label className={labelClass}>Rebate Value</label>
                                                        <div className="relative">
                                                            <input className={`${inputClass} bg-emerald-800 border-emerald-700 text-white pl-4 text-lg`} defaultValue="5.0" />
                                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 font-black">%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <i className="fa fa-hand-holding-dollar absolute -right-4 -bottom-4 text-8xl text-white/5 rotate-12"></i>
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase text-center leading-relaxed">Configuring a rebate will automatically create a commission expense voucher against this scheme during the revenue reconciliation run.</p>
                                        </div>
                                    )}

                                    {/* TAB: BIOMETRIC SWITCH */}
                                    {activeTab === 'biometric' && (
                                        <div className="animate-in zoom-in-95 duration-300 max-w-2xl mx-auto">
                                            <div className="bg-white border border-slate-200 rounded-none shadow-sm overflow-hidden">
                                                <div className="p-6 border-b border-slate-100 bg-gray-50 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-none flex items-center justify-center text-xl shadow-inner"><i className="fa fa-fingerprint"></i></div>
                                                        <h6 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Smart Africa Authentication</h6>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" className="sr-only peer" defaultChecked={activeScheme.smartAfricaEnabled} />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                                    </label>
                                                </div>
                                                <div className="p-8 space-y-6">
                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div><label className={labelClass}>Payer Provider ID</label><input className={inputClass} defaultValue="JUB-KEN-001" /></div>
                                                        <div><label className={labelClass}>Facility Provider ID</label><input className={inputClass} defaultValue="MTR-991" /></div>
                                                    </div>
                                                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-none flex items-start gap-4">
                                                        <i className="fa fa-shield-halved text-indigo-400 mt-1"></i>
                                                        <p className="text-[10px] text-indigo-800 leading-relaxed font-bold uppercase tracking-tight">Biometric verification is required for all OP visits under this scheme. Emergency overrides will be logged in the Security Audit Trail.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>

                            {/* 4. Persistence Footer */}
                            <div className="p-4 bg-slate-900 border-t border-white/5 flex justify-between items-center shrink-0">
                                <div className="flex items-center space-x-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <span className="flex items-center"><i className="fa fa-fingerprint mr-2 text-indigo-600"></i> Local Sync: ON</span>
                                    <span className="flex items-center"><i className="fa fa-cloud-upload mr-2 text-indigo-600"></i> External Switch: ACTIVE</span>
                                </div>
                                <div className="flex space-x-3">
                                    <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-none text-[10px] font-black uppercase tracking-widest transition" onClick={() => setSelectedSchemeId(null)}>Close Session</button>
                                    <button onClick={() => notify('success', 'Changes Deployed', 'All scheme parameters and tariffs have been updated.')} className="bg-indigo-600 text-white px-10 py-2 rounded-none text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700">Save & Deploy</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center bg-gray-50/50">
                            <div className="w-24 h-24 bg-white border border-slate-200 rounded-none flex items-center justify-center mb-8 shadow-inner group">
                                <i className="fa fa-building-shield text-5xl text-slate-200 group-hover:text-indigo-300 transition-colors"></i>
                            </div>
                            <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">Payer Workspace Standby</h3>
                            <p className="max-w-xs text-[10px] text-slate-400 font-bold uppercase mt-2 leading-relaxed opacity-60 italic">Identify an insurance provider or corporate account from the registry to manage tariffs and billing protocols.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SchemesManagement;
