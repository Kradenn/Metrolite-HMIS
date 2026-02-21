
import React, { useState, useEffect } from 'react';

type ConfigTab = 'identity' | 'seo' | 'contact' | 'advanced';

interface BranchConfig {
    id: string;
    name: string;
    isGlobal: boolean;
}

const FrontendConfig: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ConfigTab>('identity');
    const [isSaving, setIsSaving] = useState(false);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    
    // Multi-branch state
    const [branches] = useState<BranchConfig[]>([
        { id: 'global', name: 'Main Corporate Website', isGlobal: true },
        { id: 'main', name: 'Main Branch (Nairobi)', isGlobal: false },
        { id: 'city', name: 'City Center Clinic', isGlobal: false },
        { id: 'west', name: 'Westlands Branch', isGlobal: false },
    ]);
    const [selectedBranchId, setSelectedBranchId] = useState('global');

    const selectedBranch = branches.find(b => b.id === selectedBranchId);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert(`Website configuration for [${selectedBranch?.name}] updated and deployed.`);
        }, 1200);
    };

    return (
        <div className="animate-bottom space-y-6">
            {/* Header Area with Branch Switcher */}
            <div className="flex flex-col xl:flex-row justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm gap-4">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl shadow-lg">
                        <i className="fa fa-globe"></i>
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                           <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Website CMS Control</h2>
                           {selectedBranch?.isGlobal && <span className="bg-blue-100 text-blue-700 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Master Config</span>}
                        </div>
                        <p className="text-xs text-gray-500 font-medium">Manage multi-branch public web presence and localized content.</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center space-x-2 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Targeting:</label>
                        <select 
                            value={selectedBranchId}
                            onChange={(e) => setSelectedBranchId(e.target.value)}
                            className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500 min-w-[180px]"
                        >
                            {branches.map(b => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block"></div>

                    <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[9px] font-black text-green-700 uppercase">Live</span>
                        </div>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition transform active:scale-95 disabled:opacity-50"
                        >
                            {isSaving ? <i className="fa fa-spinner fa-spin mr-2"></i> : <i className="fa fa-cloud-upload-alt mr-2"></i>}
                            Deploy Changes
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)]">
                {/* Left: Navigation Sidebar */}
                <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Configuration Groups</h6>
                    </div>
                    <div className="p-3 space-y-1">
                        {[
                            { id: 'identity', label: 'Identity & Brand', icon: 'fa-fingerprint' },
                            { id: 'seo', label: 'SEO & Meta Tags', icon: 'fa-search' },
                            { id: 'contact', label: 'Local Contact Info', icon: 'fa-map-marked-alt' },
                            { id: 'advanced', label: 'Advanced & API', icon: 'fa-terminal' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as ConfigTab)}
                                className={`w-full text-left p-4 rounded-xl flex items-center space-x-3 transition-all ${
                                    activeTab === tab.id 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-[1.02]' 
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                }`}
                            >
                                <i className={`fa ${tab.icon} w-5 text-center text-sm`}></i>
                                <span className="text-xs font-black uppercase tracking-tight">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                    
                    <div className="mt-auto p-6 bg-slate-50 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maintenance Mode</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={maintenanceMode} 
                                    onChange={(e) => setMaintenanceMode(e.target.checked)} 
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                            </label>
                        </div>
                        <p className="text-[9px] text-slate-400 leading-tight">Take the website for {selectedBranch?.name} offline.</p>
                    </div>
                </div>

                {/* Right: Active Settings Workspace */}
                <div className="lg:col-span-9 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden relative">
                    <div className="p-8 flex-1 overflow-y-auto scrollbar-hide">
                        
                        {/* TAB: BRAND IDENTITY */}
                        {activeTab === 'identity' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-6">
                                    <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest">Logo & Visual Assets</h5>
                                    {!selectedBranch?.isGlobal && (
                                        <button className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase hover:bg-indigo-100 transition">Inherit Global Assets</button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        { label: 'Branch Logo', desc: 'Main header (Colored)', size: '200x60' },
                                        { label: 'Alt Logo', desc: 'Inverted variation', size: '200x60' },
                                        { label: 'Favicon', desc: 'Site icon', size: '32x32' },
                                    ].map((asset, i) => (
                                        <div key={i} className="group border-2 border-dashed border-gray-100 rounded-2xl p-6 text-center hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer bg-gray-50/50">
                                            <i className="fa fa-image text-2xl text-gray-300 group-hover:text-indigo-500 mb-2"></i>
                                            <h6 className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">{asset.label}</h6>
                                            <p className="text-[9px] text-gray-400 mt-1">{asset.desc}</p>
                                            <p className="text-[8px] text-gray-300 font-mono mt-2">{asset.size}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Website Themes</h6>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Primary Color</label>
                                                <div className="flex items-center space-x-2">
                                                    <input type="color" defaultValue="#4f46e5" className="w-10 h-10 border-none rounded cursor-pointer" />
                                                    <input type="text" defaultValue="#4F46E5" className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Accent Color</label>
                                                <div className="flex items-center space-x-2">
                                                    <input type="color" defaultValue="#0d9488" className="w-10 h-10 border-none rounded cursor-pointer" />
                                                    <input type="text" defaultValue="#0D9488" className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Layout Controls</h6>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                                                    <span className="text-[10px] font-bold text-gray-600 uppercase">Sticky Header</span>
                                                </label>
                                            </div>
                                            <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                                                <label className="flex items-center space-x-2 cursor-pointer">
                                                    <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                                                    <span className="text-[10px] font-bold text-gray-600 uppercase">Show Branch Map</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: SEO */}
                        {activeTab === 'seo' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 mb-6">Search Engine Management for {selectedBranch?.name}</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Page Title Template</label>
                                                <input type="text" defaultValue={`${selectedBranch?.name} | Specialized Healthcare`} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:ring-2 focus:ring-indigo-500" />
                                                <p className="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-tight">Target keywords: Hospital, {selectedBranch?.name.split(' ')[0]}, Healthcare</p>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Meta Description (Localized)</label>
                                                <textarea className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs h-28 resize-none font-medium leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500" defaultValue={`${selectedBranch?.name} is a premier health facility offering localized care in ${selectedBranch?.name.includes('City') ? 'Nairobi CBD' : 'the city outskirts'}.`}></textarea>
                                            </div>
                                        </div>
                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Canonical URL</label>
                                                <input type="text" className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-mono text-indigo-600 outline-none" defaultValue={`https://metrolitehospital.co.ke/branches/${selectedBranchId}`} />
                                            </div>
                                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                                <h6 className="text-[10px] font-black text-blue-600 uppercase mb-2 tracking-widest flex items-center">
                                                    <i className="fa fa-google mr-2"></i> Search Engine Preview
                                                </h6>
                                                <div className="space-y-1">
                                                    <p className="text-blue-700 text-sm font-medium hover:underline cursor-pointer truncate">{selectedBranch?.name} | Specialized Healthcare</p>
                                                    <p className="text-green-800 text-[10px]">metrolitehospital.co.ke › branches › {selectedBranchId}</p>
                                                    <p className="text-gray-500 text-[10px] line-clamp-2">{selectedBranch?.name} is a premier health facility offering localized care...</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: CONTACT */}
                        {activeTab === 'contact' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 mb-6">Localized Contact & Access</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Branch Hotline</label>
                                                    <input type="tel" defaultValue="+254 700 111 222" className="w-full p-2.5 bg-gray-50 border border-gray-200 text-gray-800 font-black rounded-lg text-xs" />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Nursing Desk</label>
                                                    <input type="tel" defaultValue="+254 700 333 444" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Branch Email</label>
                                                <input type="email" defaultValue={`${selectedBranchId}@metrolitehospital.co.ke`} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Operating Hours</label>
                                                <input type="text" defaultValue={selectedBranchId === 'city' ? '8:00 AM - 8:00 PM, Mon-Sat' : '24 Hours, Mon-Sun'} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Physical Address Override</label>
                                                <textarea className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs h-20 resize-none font-medium" defaultValue={selectedBranchId === 'city' ? 'Eagle House, 1st Floor, Moi Avenue, CBD' : 'Plaza Building, Along Ngong Road'}></textarea>
                                            </div>
                                            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                                                <p className="text-[10px] text-orange-800 leading-tight">
                                                    <i className="fa fa-info-circle mr-1"></i>
                                                    The information entered here will only be displayed on the <strong>{selectedBranch?.name}</strong> landing page and footer.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 mb-6">Map & Geolocation</h5>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Google Maps Embed iframe Source</label>
                                            <input type="text" className="w-full p-2.5 bg-gray-900 text-green-400 font-mono text-[10px] rounded-lg border border-gray-800" placeholder="https://www.google.com/maps/embed?..." />
                                        </div>
                                        <div className="aspect-video w-full bg-gray-100 rounded-2xl border border-gray-200 flex flex-col items-center justify-center text-gray-400 overflow-hidden relative group">
                                            <i className="fa fa-map-marked text-4xl mb-2 opacity-20 group-hover:scale-110 transition-transform"></i>
                                            <p className="text-[10px] font-bold uppercase tracking-widest">Map Preview for {selectedBranch?.name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: ADVANCED */}
                        {activeTab === 'advanced' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 mb-6">Integration & Tracking</h5>
                                    <div className="space-y-6">
                                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl mb-4">
                                            <div className="flex items-center space-x-3">
                                                <i className="fa fa-code text-blue-600"></i>
                                                <span className="text-[10px] font-black text-blue-800 uppercase">Configuration Logic</span>
                                            </div>
                                            <p className="text-[11px] text-blue-600 mt-1">Scripts added to the <strong>Global Dashboard</strong> will load on all branch pages. Branch-specific scripts below only load for <strong>{selectedBranch?.name}</strong>.</p>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Branch-Specific Header Scripts</label>
                                            <textarea className="w-full p-4 bg-gray-900 text-emerald-400 font-mono text-[10px] rounded-2xl h-48 outline-none border border-gray-800" placeholder="<!-- Paste localized tracking pixels here -->"></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Branch-Specific Footer Scripts</label>
                                            <textarea className="w-full p-4 bg-gray-900 text-emerald-400 font-mono text-[10px] rounded-2xl h-48 outline-none border border-gray-800" placeholder="<!-- Paste localized chat widgets here -->"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Status / Preview Bar */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center bg-gray-50/50 backdrop-blur-sm sticky bottom-0">
                        <div className="flex items-center space-x-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <span className="flex items-center"><i className="fa fa-history mr-2"></i> Deployed: 24 Oct, 11:20 AM</span>
                            <span className="flex items-center"><i className="fa fa-tag mr-2"></i> Version: 3.1.2</span>
                        </div>
                        <div className="flex space-x-3">
                            <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-[10px] font-black uppercase hover:bg-white transition shadow-sm">Reset Changes</button>
                            <button className="px-4 py-2 bg-gray-800 text-white rounded-lg text-[10px] font-black uppercase hover:bg-black transition shadow-lg">Preview {selectedBranch?.name} Page</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FrontendConfig;
