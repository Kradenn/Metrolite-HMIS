import React, { useState, useMemo } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { GoogleGenAI } from '@google/genai';

interface SupplierPerformance {
    deliverySpeed: number; // 1-5
    qualityConsistency: number; // 1-5
    pricingValue: number; // 1-5
    complianceRate: number; // 100%
}

interface Supplier {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    category: 'Pharmaceuticals' | 'Medical Equipment' | 'Consumables' | 'General Supplies' | 'Services';
    activeOrders: number;
    totalSpend: number;
    outstandingBalance: number;
    status: 'Active' | 'Under Review' | 'Blacklisted' | 'Pending';
    performance: SupplierPerformance;
    lastDelivery: string;
    address: string;
}

const MOCK_SUPPLIERS: Supplier[] = [
    { 
        id: 'SUP-001', name: 'MedSurg Supplies Ltd', contactPerson: 'John Doe', email: 'sales@medsurg.com', phone: '0722000000', 
        category: 'Medical Equipment', activeOrders: 3, totalSpend: 4500000, outstandingBalance: 120000, status: 'Active', 
        performance: { deliverySpeed: 4.5, qualityConsistency: 4.8, pricingValue: 4.0, complianceRate: 98 },
        lastDelivery: '2023-10-20', address: 'Riverside Drive, Nairobi'
    },
    { 
        id: 'SUP-002', name: 'Harleys Limited', contactPerson: 'Jane Smith', email: 'info@harleys.co.ke', phone: '0733111222', 
        category: 'Pharmaceuticals', activeOrders: 12, totalSpend: 12000000, outstandingBalance: 850000, status: 'Active', 
        performance: { deliverySpeed: 4.8, qualityConsistency: 4.9, pricingValue: 4.5, complianceRate: 99 },
        lastDelivery: '2023-10-24', address: 'Industrial Area, Gate 4'
    },
    { 
        id: 'SUP-003', name: 'Crown Healthcare', contactPerson: 'Peter Kamau', email: 'orders@crown.co.ke', phone: '0711223344', 
        category: 'Consumables', activeOrders: 0, totalSpend: 850000, outstandingBalance: 0, status: 'Under Review', 
        performance: { deliverySpeed: 3.2, qualityConsistency: 3.5, pricingValue: 3.8, complianceRate: 85 },
        lastDelivery: '2023-09-15', address: 'Westlands Park'
    },
];

const Suppliers: React.FC = () => {
    const { notify } = useNotification();
    const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [showDrawer, setShowDrawer] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'ledger'>('overview');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

    const filteredSuppliers = useMemo(() => {
        return suppliers.filter(s => 
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [suppliers, searchTerm]);

    const selectedSupplier = useMemo(() => suppliers.find(s => s.id === selectedId), [suppliers, selectedId]);

    const handleOpenDetail = (id: string) => {
        setSelectedId(id);
        setAiAnalysis(null);
        setActiveTab('overview');
        setShowDrawer(true);
    };

    const handleRunAiAudit = async () => {
        if (!selectedSupplier) return;
        setIsAiLoading(true);
        setAiAnalysis(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Act as a Supply Chain Analyst. Analyze this vendor's performance data for a hospital:
            Name: ${selectedSupplier.name}
            Category: ${selectedSupplier.category}
            Performance Metrics (out of 5): Speed: ${selectedSupplier.performance.deliverySpeed}, Quality: ${selectedSupplier.performance.qualityConsistency}, Price Value: ${selectedSupplier.performance.pricingValue}
            Compliance: ${selectedSupplier.performance.complianceRate}%
            Active Orders: ${selectedSupplier.activeOrders}
            Outstanding Balance: KES ${selectedSupplier.outstandingBalance}
            
            Provide a short summary and 2 specific procurement recommendations (e.g., renegotiate, increase volume, or diversify).`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { systemInstruction: "Be professional, concise, and highlight supply chain risks." }
            });
            setAiAnalysis(response.text || "Analysis complete.");
        } catch (e) {
            setAiAnalysis("AI Intelligence Hub is currently offline. Review manually.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const getStatusStyle = (status: Supplier['status']) => {
        switch(status) {
            case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Under Review': return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'Blacklisted': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-500 border-gray-200';
        }
    };

    const labelStyle = "block text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest";
    const inputStyle = "w-full p-2.5 bg-gray-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-800 outline-none focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500 transition-all";

    return (
        <div className="animate-bottom space-y-8 font-helvetica">
            {/* Header / Stats Ribbon */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white border border-slate-200 rounded-3xl p-6 shadow-sm gap-6 border-l-8 border-l-teal-600">
                <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 bg-teal-600 text-white rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-teal-100">
                        <i className="fa fa-truck-field"></i>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">Vendor Command Hub</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Managing {suppliers.length} Active Partners & Performance Metrics</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative">
                        <i className="fa fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm"></i>
                        <input 
                            type="text" 
                            placeholder="Find Vendor / Category..." 
                            className="pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold w-full md:w-64 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all shadow-inner"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={() => { setSelectedId(null); setShowDrawer(true); }} className="bg-teal-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-100 hover:bg-teal-700 transition transform active:scale-95">
                        <i className="fa fa-plus-circle mr-2"></i> Register Vendor
                    </button>
                </div>
            </div>

            {/* Performance Overview Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Top Rated Vendors', val: '2', icon: 'fa-star', color: 'text-amber-500', bg: 'bg-amber-50' },
                    { label: 'Orders in Transit', val: '14', icon: 'fa-box-open', color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Pending GRNs', val: '8', icon: 'fa-file-invoice', color: 'text-indigo-500', bg: 'bg-indigo-50' },
                    { label: 'At Risk Partners', val: '1', icon: 'fa-triangle-exclamation', color: 'text-rose-500', bg: 'bg-rose-50' },
                ].map((s, i) => (
                    <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group hover:shadow-lg transition-all">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                            <h4 className="text-2xl font-black text-slate-800 mt-1">{s.val}</h4>
                        </div>
                        <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform`}>
                            <i className={`fa ${s.icon}`}></i>
                        </div>
                    </div>
                ))}
            </div>

            {/* Supplier Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                {filteredSuppliers.map(s => (
                    <div 
                        key={s.id} 
                        onClick={() => handleOpenDetail(s.id)}
                        className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group overflow-hidden flex flex-col"
                    >
                        <div className="p-8 flex-1">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-black shadow-xl group-hover:bg-teal-600 transition-colors">
                                    {s.name.charAt(0)}
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-none text-[8px] font-black uppercase border ${getStatusStyle(s.status)}`}>{s.status}</span>
                                    <p className="text-[9px] text-slate-300 font-mono mt-2 font-bold uppercase">{s.id}</p>
                                </div>
                            </div>

                            <h3 className="text-base font-black text-slate-800 uppercase tracking-tight group-hover:text-teal-600 transition-colors truncate">{s.name}</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">{s.category}</p>

                            <div className="mt-8 space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-500">
                                    <span>Lead Time Compliance</span>
                                    <span className="text-teal-600">{s.performance.complianceRate}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden shadow-inner">
                                    <div className="bg-teal-500 h-full transition-all duration-1000" style={{ width: `${s.performance.complianceRate}%` }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center group-hover:bg-teal-50 transition-colors">
                            <div className="flex items-center space-x-3 text-slate-400 group-hover:text-teal-700">
                                <i className="fa fa-envelope text-xs"></i>
                                <span className="text-[10px] font-black uppercase tracking-tight">{s.contactPerson}</span>
                            </div>
                            <div className="flex items-center text-xs font-black text-slate-800 tracking-tighter">
                                <span className="text-[9px] text-slate-400 mr-2 uppercase">Total:</span> KES {(s.totalSpend / 1000000).toFixed(1)}M
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* DETAIL DRAWER / HUB */}
            {showDrawer && (
                <div className="fixed inset-0 z-[6000] flex justify-end">
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowDrawer(false)}></div>
                    <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300 flex flex-col">
                        
                        {/* Drawer Header */}
                        <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
                            <div className="flex items-center space-x-5">
                                <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center text-2xl font-black shadow-2xl">
                                    {selectedSupplier?.name.charAt(0) || 'N'}
                                </div>
                                <div>
                                    <h4 className="text-lg font-black uppercase tracking-tight">{selectedSupplier?.name || 'New Vendor'}</h4>
                                    <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">{selectedSupplier?.id || 'In Registration'}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowDrawer(false)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"><i className="fa fa-times text-xl"></i></button>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex border-b border-slate-100 bg-slate-50 px-6 shrink-0">
                            {[
                                { id: 'overview', label: 'Overview', icon: 'fa-id-card' },
                                { id: 'performance', label: 'Intelligence', icon: 'fa-robot' },
                                { id: 'ledger', label: 'Ledger', icon: 'fa-book-open' },
                            ].map(tab => (
                                <button 
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === tab.id ? 'border-teal-600 text-teal-600 bg-white shadow-sm' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                                >
                                    <i className={`fa ${tab.icon} text-[9px]`}></i> {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            {selectedSupplier ? (
                                <div className="space-y-10 animate-in fade-in duration-300">
                                    {/* OVERVIEW */}
                                    {activeTab === 'overview' && (
                                        <div className="space-y-8">
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <h6 className="text-[10px] font-black text-teal-600 uppercase tracking-widest border-b pb-1">Contact Details</h6>
                                                    <div><label className={labelStyle}>Contact Person</label><input className={inputStyle} defaultValue={selectedSupplier.contactPerson} /></div>
                                                    <div><label className={labelStyle}>Primary Phone</label><input className={inputStyle} defaultValue={selectedSupplier.phone} /></div>
                                                    <div><label className={labelStyle}>Official Email</label><input className={inputStyle} defaultValue={selectedSupplier.email} /></div>
                                                </div>
                                                <div className="space-y-4">
                                                    <h6 className="text-[10px] font-black text-teal-600 uppercase tracking-widest border-b pb-1">Identification</h6>
                                                    <div><label className={labelStyle}>Category</label><select className={inputStyle} defaultValue={selectedSupplier.category}><option>Pharmaceuticals</option><option>Medical Equipment</option><option>Consumables</option></select></div>
                                                    <div><label className={labelStyle}>Physical Address</label><textarea className={`${inputStyle} h-24 resize-none`} defaultValue={selectedSupplier.address}></textarea></div>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                                                <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Contract Status</h6>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-teal-600 shadow-sm"><i className="fa fa-file-contract"></i></div>
                                                        <div>
                                                            <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Active Master Agreement</p>
                                                            <p className="text-[9px] text-slate-500 font-bold uppercase">Valid Until: 24 Oct 2024</p>
                                                        </div>
                                                    </div>
                                                    <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">Renew</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* PERFORMANCE */}
                                    {activeTab === 'performance' && (
                                        <div className="space-y-8">
                                            {/* AI Analysis Block */}
                                            <div className="bg-[#1e293b] text-white p-6 rounded-3xl shadow-2xl relative overflow-hidden group">
                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center"><i className="fa fa-robot"></i></div>
                                                            <h5 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400">Supplier Intelligence Engine</h5>
                                                        </div>
                                                        <button 
                                                            onClick={handleRunAiAudit} 
                                                            disabled={isAiLoading}
                                                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition transform active:scale-95 disabled:opacity-50"
                                                        >
                                                            {isAiLoading ? <i className="fa fa-spinner fa-spin mr-2"></i> : <i className="fa fa-magic mr-2"></i>}
                                                            Analyze Reliability
                                                        </button>
                                                    </div>
                                                    {aiAnalysis ? (
                                                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-[11px] font-medium leading-relaxed text-slate-300 animate-in fade-in">
                                                            {aiAnalysis}
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-slate-400 leading-relaxed font-medium pr-12">Identify risk patterns, pricing anomalies, and supply chain bottlenecks for {selectedSupplier.name} using Gemini Pro.</p>
                                                    )}
                                                </div>
                                                <i className="fa fa-brain absolute -right-6 -bottom-6 text-9xl text-white/5 rotate-12 transition-transform group-hover:rotate-[25deg]"></i>
                                            </div>

                                            {/* Hard Metrics Grid */}
                                            <div className="grid grid-cols-2 gap-4">
                                                {[
                                                    { label: 'Quality Consistency', val: selectedSupplier.performance.qualityConsistency, color: 'text-emerald-500', icon: 'fa-check-double' },
                                                    { label: 'Delivery Timeliness', val: selectedSupplier.performance.deliverySpeed, color: 'text-blue-500', icon: 'fa-clock' },
                                                    { label: 'Pricing Competitiveness', val: selectedSupplier.performance.pricingValue, color: 'text-amber-500', icon: 'fa-tag' },
                                                    { label: 'Stock Fulfillment', val: '94%', color: 'text-purple-500', icon: 'fa-box-open' },
                                                ].map((stat, i) => (
                                                    <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                                        <div className="flex items-center space-x-2 mb-2">
                                                            <i className={`fa ${stat.icon} ${stat.color} text-[10px]`}></i>
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                                                        </div>
                                                        <div className="flex items-baseline space-x-1">
                                                            <span className="text-xl font-black text-slate-800 tracking-tighter">{stat.val}</span>
                                                            <span className="text-[10px] text-gray-400 uppercase font-black">{typeof stat.val === 'number' ? '/ 5' : ''}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* LEDGER */}
                                    {activeTab === 'ledger' && (
                                        <div className="space-y-8">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 text-center">
                                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Lifetime Spend</p>
                                                    <p className="text-2xl font-black text-emerald-900 tracking-tighter">KES {selectedSupplier.totalSpend.toLocaleString()}</p>
                                                </div>
                                                <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 text-center">
                                                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-1">Current Payable</p>
                                                    <p className="text-2xl font-black text-rose-900 tracking-tighter">KES {selectedSupplier.outstandingBalance.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1 mb-4">Recent Transactions</h6>
                                                <div className="space-y-3">
                                                    {[
                                                        { id: 'LPO-2023-112', date: '20 Oct', amt: '450,000', type: 'Stock Order', stat: 'Finalized' },
                                                        { id: 'LPO-2023-098', date: '12 Oct', amt: '12,500', type: 'Credit Note', stat: 'Posted' },
                                                        { id: 'LPO-2023-085', date: '05 Oct', amt: '890,200', type: 'Stock Order', stat: 'Paid' },
                                                    ].map((txn, i) => (
                                                        <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group hover:border-teal-300 transition-colors shadow-sm">
                                                            <div className="flex items-center space-x-4">
                                                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 font-mono text-[9px] font-black">{txn.date}</div>
                                                                <div>
                                                                    <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{txn.id}</p>
                                                                    <p className="text-[9px] text-slate-400 font-bold uppercase">{txn.type}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xs font-black text-slate-700 tracking-tighter">KES {txn.amt}</p>
                                                                <span className="text-[8px] font-black bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded uppercase border border-gray-100">{txn.stat}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in fade-in">
                                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 text-center flex flex-col items-center">
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-teal-600 text-4xl shadow-xl border border-teal-50 mb-6">
                                            <i className="fa fa-user-plus"></i>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">New Partner Registration</h3>
                                        <p className="text-sm text-slate-400 mt-2 font-medium max-w-xs">Register a new hospital vendor and initiate the compliance workflow.</p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-4">
                                            <div><label className={labelStyle}>Vendor Registered Name</label><input className={inputStyle} placeholder="Full Legal Entity Name..." /></div>
                                            <div><label className={labelStyle}>Procurement Category</label><select className={inputStyle}><option>Pharmaceuticals</option><option>Medical Equipment</option><option>Consumables</option></select></div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><label className={labelStyle}>Payer PIN / Tax ID</label><input className={inputStyle} placeholder="KRA PIN..." /></div>
                                                <div><label className={labelStyle}>Primary Phone</label><input className={inputStyle} placeholder="+254..." /></div>
                                            </div>
                                            <button className="w-full bg-teal-600 text-white py-4 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-100 hover:bg-teal-700 transition transform active:scale-95 mt-6">Initialize Partnership</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Drawer Footer Actions */}
                        {selectedSupplier && (
                            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
                                <button className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Blacklist Vendor</button>
                                <div className="flex gap-4">
                                    <button onClick={() => setShowDrawer(false)} className="px-8 py-2.5 bg-white border border-slate-300 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition shadow-sm">Close Hub</button>
                                    <button onClick={() => notify('success', 'Changes Synchronized', 'Partner details updated.')} className="px-10 py-2.5 bg-teal-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-teal-100 hover:bg-teal-700 transition transform active:scale-95">Save Registry</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Suppliers;
