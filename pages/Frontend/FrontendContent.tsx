
import React, { useState, useMemo } from 'react';

type SectionType = 'hero' | 'slider' | 'features' | 'text' | 'gallery' | 'team' | 'faq' | 'columns';
type LayoutGrid = '1' | '2' | '3' | '1-2' | '2-1';

interface ContentBlock {
    id: string;
    type: SectionType;
    title: string;
    status: 'Live' | 'Draft' | 'Hidden';
    lastUpdated: string;
    order: number;
    branchOverride: boolean;
    layout?: LayoutGrid;
}

interface WebPage {
    id: string;
    title: string;
    slug: string;
    isSystem: boolean;
}

const FrontendContent: React.FC = () => {
    const [pages, setPages] = useState<WebPage[]>([
        { id: 'p1', title: 'Home', slug: '/', isSystem: true },
        { id: 'p2', title: 'About Us', slug: '/about', isSystem: true },
        { id: 'p3', title: 'Services', slug: '/services', isSystem: true },
        { id: 'p4', title: 'Contact', slug: '/contact', isSystem: true },
    ]);
    const [activePageId, setActivePageId] = useState('p1');
    const [sections, setSections] = useState<ContentBlock[]>([
        { id: 'sec_1', type: 'slider', title: 'Main Banner Slider', status: 'Live', lastUpdated: '24 Oct, 09:00', order: 1, branchOverride: false, layout: '1' },
        { id: 'sec_2', type: 'columns', title: 'Quick Services Grid', status: 'Live', lastUpdated: '20 Oct, 14:20', order: 2, branchOverride: true, layout: '3' },
    ]);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [showAddSectionModal, setShowAddSectionModal] = useState(false);

    const activePage = useMemo(() => pages.find(p => p.id === activePageId), [pages, activePageId]);

    const addSection = (type: SectionType) => {
        const newSec: ContentBlock = {
            id: `sec_${Date.now()}`,
            type,
            title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
            status: 'Draft',
            lastUpdated: 'Just now',
            order: sections.length + 1,
            branchOverride: false,
            layout: '1'
        };
        setSections([...sections, newSec]);
        setShowAddSectionModal(false);
    };

    const deleteSection = (id: string) => {
        if (confirm("Delete this block?")) {
            setSections(sections.filter(s => s.id !== id));
        }
    };

    const getIcon = (type: SectionType) => {
        switch(type) {
            case 'hero': return 'fa-image text-blue-500';
            case 'slider': return 'fa-clone text-purple-500';
            case 'features': return 'fa-th-large text-emerald-500';
            case 'text': return 'fa-align-left text-orange-500';
            case 'columns': return 'fa-columns text-indigo-500';
            case 'gallery': return 'fa-images text-pink-500';
            default: return 'fa-cube text-gray-500';
        }
    };

    return (
        <div className="animate-bottom space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm gap-4">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl shadow-lg">
                        <i className="fa fa-layer-group"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Experience Builder</h2>
                        <p className="text-xs text-gray-500 font-medium">Design "{activePage?.title}" page layout</p>
                    </div>
                </div>
                <button className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition">
                    <i className="fa fa-cloud-upload-alt mr-2"></i> Deploy Version
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)]">
                {/* Left: Navigator */}
                <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50 font-black text-[10px] text-gray-400 uppercase tracking-widest">Sitemap</div>
                    <div className="p-2 flex-1 overflow-y-auto space-y-1">
                        {pages.map(p => (
                            <button 
                                key={p.id}
                                className={`w-full text-left p-3 rounded-xl transition-all ${activePageId === p.id ? 'bg-indigo-50 text-indigo-700 font-black ring-1 ring-indigo-100' : 'text-gray-600 hover:bg-gray-50'}`}
                                onClick={() => setActivePageId(p.id)}
                            >
                                <span className="text-[11px] uppercase tracking-tight">{p.title}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Section Canvas */}
                <div className="lg:col-span-9 bg-slate-50 border border-gray-200 rounded-2xl shadow-inner flex flex-col overflow-hidden relative">
                    <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                        <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest">Editing: {activePage?.title}</h5>
                        <button 
                            onClick={() => setShowAddSectionModal(true)}
                            className="bg-indigo-600 text-white px-5 py-1.5 rounded-lg text-[10px] font-black uppercase shadow-lg hover:bg-indigo-700 transition"
                        >
                           <i className="fa fa-plus-square mr-2"></i> Add Block
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {sections.map((sec) => (
                            <div key={sec.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden group">
                                <div className="p-4 flex items-center justify-between border-b border-gray-50 bg-gray-50/30">
                                    <div className="flex items-center space-x-3">
                                        <i className={`fa ${getIcon(sec.type)}`}></i>
                                        <h6 className="text-xs font-black text-gray-800 uppercase tracking-tight">{sec.title}</h6>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="text-gray-300 hover:text-red-500 transition-colors" onClick={() => deleteSection(sec.id)}><i className="fa fa-trash-alt text-xs"></i></button>
                                    </div>
                                </div>
                                <div className="p-6 h-20 flex items-center justify-center text-gray-300 text-[10px] font-bold uppercase tracking-widest italic">
                                    Visual Preview of {sec.type} block
                                </div>
                            </div>
                        ))}
                        {sections.length === 0 && (
                            <div className="py-20 text-center text-gray-400">
                                <i className="fa fa-layer-group text-4xl mb-4 opacity-10"></i>
                                <p className="text-xs font-bold uppercase">No blocks added yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showAddSectionModal && (
                <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
                        <h5 className="text-sm font-black text-gray-800 uppercase mb-6 tracking-widest">Select Block Type</h5>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {(['hero', 'slider', 'features', 'text', 'gallery', 'team', 'faq', 'columns'] as SectionType[]).map(type => (
                                <button 
                                    key={type}
                                    onClick={() => addSection(type)}
                                    className="p-4 border border-gray-100 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all flex flex-col items-center group"
                                >
                                    <i className={`fa ${getIcon(type).split(' ')[0]} text-xl mb-2 text-gray-400 group-hover:text-indigo-500`}></i>
                                    <span className="text-[9px] font-black uppercase text-gray-500 group-hover:text-indigo-700">{type}</span>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setShowAddSectionModal(false)} className="w-full mt-6 py-2 text-xs font-bold text-gray-400 uppercase">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FrontendContent;
