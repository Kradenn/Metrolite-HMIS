
import React, { useState } from 'react';

type LayoutComponent = 'header' | 'footer' | 'sidebar' | 'mega-menu' | 'typography';
type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface NavLink {
    id: string;
    label: string;
    path: string;
    isMega?: boolean;
}

const FrontendLayouts: React.FC = () => {
    const [activeComponent, setActiveComponent] = useState<LayoutComponent>('header');
    const [device, setDevice] = useState<DeviceType>('desktop');
    const [themeStyle, setThemeStyle] = useState('Modern Clinical');
    const [isSaving, setIsSaving] = useState(false);

    // Navigation State
    const [navLinks, setNavLinks] = useState<NavLink[]>([
        { id: '1', label: 'Home', path: '/' },
        { id: '2', label: 'About Us', path: '/about' },
        { id: '3', label: 'Services', path: '/services', isMega: true },
        { id: '4', label: 'Contact', path: '/contact' },
    ]);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("Site layout synchronized.");
        }, 1200);
    };

    const deleteLink = (id: string) => {
        setNavLinks(navLinks.filter(l => l.id !== id));
    };

    return (
        <div className="animate-bottom space-y-6">
            {/* Control Bar */}
            <div className="flex flex-col xl:flex-row justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm gap-4">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl shadow-lg">
                        <i className="fa fa-pencil-ruler"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Component Engine</h2>
                        <p className="text-xs text-gray-500 font-medium">Visual site structure and architecture</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                        {(['desktop', 'tablet', 'mobile'] as DeviceType[]).map(d => (
                            <button 
                                key={d}
                                onClick={() => setDevice(d)}
                                className={`w-10 h-8 rounded-lg flex items-center justify-center transition-all ${device === d ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <i className={`fa fa-${d === 'desktop' ? 'desktop' : d === 'tablet' ? 'tablet-alt' : 'mobile-alt'}`}></i>
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={handleSave}
                        className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition"
                    >
                        {isSaving ? <i className="fa fa-spinner fa-spin mr-2"></i> : <i className="fa fa-cloud-upload-alt mr-2"></i>}
                        Publish Layout
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)]">
                {/* Left: Component List */}
                <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-widest">Base Elements</div>
                    <div className="p-3 space-y-1">
                        {[
                            { id: 'header', label: 'Global Header', icon: 'fa-window-maximize' },
                            { id: 'mega-menu', label: 'Mega Navigation', icon: 'fa-sitemap' },
                            { id: 'sidebar', label: 'Sidebar Widgets', icon: 'fa-columns' },
                            { id: 'footer', label: 'Master Footer', icon: 'fa-window-minimize' },
                        ].map(comp => (
                            <button
                                key={comp.id}
                                onClick={() => setActiveComponent(comp.id as LayoutComponent)}
                                className={`w-full text-left p-4 rounded-xl flex items-center space-x-3 transition-all ${
                                    activeComponent === comp.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                <i className={`fa ${comp.icon} text-sm`}></i>
                                <span className="text-xs font-black uppercase tracking-tight">{comp.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Designer */}
                <div className="lg:col-span-9 bg-slate-50 border border-gray-200 rounded-2xl shadow-inner flex flex-col overflow-hidden">
                    <div className="p-8 flex-1 overflow-y-auto scrollbar-hide">
                         {activeComponent === 'header' && (
                             <div className="space-y-6">
                                <div className="bg-white border p-6 rounded-2xl shadow-sm">
                                    <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Header Navigation</h6>
                                    <div className="space-y-2">
                                        {navLinks.map(link => (
                                            <div key={link.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <span className="text-xs font-bold text-gray-700 uppercase tracking-tight">{link.label}</span>
                                                <button onClick={() => deleteLink(link.id)} className="text-gray-300 hover:text-red-500"><i className="fa fa-times-circle"></i></button>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-4 py-2 border-2 border-dashed border-gray-200 rounded-xl text-[10px] font-black text-gray-400 uppercase hover:text-indigo-600">+ Append Navigation Link</button>
                                </div>
                             </div>
                         )}
                         {activeComponent !== 'header' && (
                             <div className="py-20 text-center text-gray-300">
                                <i className="fa fa-tools text-4xl mb-4 opacity-10"></i>
                                <p className="text-xs font-bold uppercase tracking-widest">Module Design in Progress</p>
                             </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FrontendLayouts;
