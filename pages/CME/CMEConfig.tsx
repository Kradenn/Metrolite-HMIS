
import React, { useState } from 'react';

const CMEConfig: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'categories' | 'providers' | 'rules'>('categories');

    const categories = [
        { id: 1, name: 'Clinical Excellence', description: 'Core medical skills and surgical techniques.', pointsPerHr: 1, status: 'Active' },
        { id: 2, name: 'Medical Ethics', description: 'Ethics, law, and professionalism.', pointsPerHr: 2, status: 'Active' },
        { id: 3, name: 'Health Management', description: 'Hospital leadership and workflow optimization.', pointsPerHr: 1, status: 'Active' },
        { id: 4, name: 'Technical Training', description: 'New equipment and system software usage.', pointsPerHr: 0.5, status: 'Active' },
    ];

    const providers = [
        { id: 1, name: 'Kenya Medical Practitioners & Dentists Council', type: 'Regulatory Body' },
        { id: 2, name: 'Ministry of Health (MOH)', type: 'Government' },
        { id: 3, name: 'Resuscitation Council of Kenya', type: 'Accredited Partner' },
    ];

    return (
        <div className="animate-bottom space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">CME Global Configuration</h2>
                    <p className="text-xs text-gray-500 font-medium">Define credit rules, categories, and accredited entities.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)]">
                {/* Left: Section Navigator */}
                <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h5 className="text-xs font-black text-gray-700 uppercase tracking-widest">Configuration Sets</h5>
                    </div>
                    <div className="p-2 space-y-1">
                        {[
                            { id: 'categories', label: 'Point Categories', icon: 'fa-tags' },
                            { id: 'providers', label: 'Accredited Providers', icon: 'fa-building' },
                            { id: 'rules', label: 'Global Point Rules', icon: 'fa-ruler-combined' }
                        ].map(s => (
                            <button
                                key={s.id}
                                onClick={() => setActiveTab(s.id as any)}
                                className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-all ${activeTab === s.id ? 'bg-teal-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                <i className={`fa ${s.icon} w-5 text-center`}></i>
                                <span className="text-xs font-black uppercase tracking-tight">{s.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Workspace */}
                <div className="lg:col-span-9 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    {activeTab === 'categories' && (
                        <div className="p-8 space-y-8 animate-in fade-in duration-300">
                            <div className="flex justify-between items-center">
                                <h5 className="text-sm font-black text-gray-700 uppercase tracking-widest">CPD Point Categories</h5>
                                <button className="bg-teal-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase shadow hover:bg-teal-700">Add Category</button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {categories.map(c => (
                                    <div key={c.id} className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50 hover:border-teal-500 transition-all flex justify-between group">
                                        <div>
                                            <h6 className="text-sm font-black text-gray-800 uppercase tracking-tight">{c.name}</h6>
                                            <p className="text-[11px] text-gray-500 mt-1">{c.description}</p>
                                            <div className="mt-4 flex items-center space-x-3">
                                                <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded border border-gray-200 text-teal-600">{c.pointsPerHr} Points / Hr</span>
                                                <span className="text-[10px] font-bold text-green-600 uppercase">{c.status}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-gray-400 hover:text-blue-600 transition"><i className="fa fa-pencil-alt"></i></button>
                                            <button className="text-gray-400 hover:text-red-500 transition"><i className="fa fa-trash-alt"></i></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'providers' && (
                        <div className="p-8 space-y-6 animate-in fade-in duration-300">
                            <div className="flex justify-between items-center">
                                <h5 className="text-sm font-black text-gray-700 uppercase tracking-widest">Accredited Providers</h5>
                                <button className="bg-teal-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase shadow hover:bg-teal-700">Register Provider</button>
                            </div>

                            <div className="overflow-x-auto border border-gray-100 rounded-xl">
                                <table className="w-full text-left text-[11px]">
                                    <thead className="bg-gray-50 text-gray-500 font-black uppercase tracking-tight">
                                        <tr>
                                            <th className="px-6 py-4">Provider Name</th>
                                            <th className="px-6 py-4">Type</th>
                                            <th className="px-6 py-4 text-center">Status</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-gray-700">
                                        {providers.map(p => (
                                            <tr key={p.id} className="hover:bg-blue-50 transition-colors">
                                                <td className="px-6 py-4 font-bold uppercase text-gray-800">{p.name}</td>
                                                <td className="px-6 py-4">{p.type}</td>
                                                <td className="px-6 py-4 text-center"><i className="fa fa-check-circle text-green-500"></i></td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-red-500 hover:underline text-[10px] font-bold uppercase">Deactivate</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'rules' && (
                        <div className="p-8 space-y-8 animate-in fade-in duration-300">
                            <h5 className="text-sm font-black text-gray-700 uppercase tracking-widest">Point System Parameters</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Annual Credit Target</label>
                                        <input type="number" defaultValue="50" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-black text-teal-600 outline-none focus:ring-1 focus:ring-teal-500" />
                                        <p className="text-[9px] text-gray-400 mt-1 italic">The target for license compliance indicators.</p>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Default Unit Multiplier</label>
                                        <input type="number" defaultValue="1" step="0.1" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-black text-gray-700 outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                                        <h6 className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center mb-2">
                                            <i className="fa fa-info-circle mr-2"></i> System Rule
                                        </h6>
                                        <p className="text-[11px] text-orange-800 leading-relaxed">
                                            Automatic point accrual is calculated as: <code>(Session Duration in Hours) * Category Multiplier</code>. External submissions skip this calculation and use the manually reported value.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6 border-t border-gray-100 flex justify-end">
                                <button className="bg-teal-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-teal-700 transition transform active:scale-95">Update Global Rules</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CMEConfig;
