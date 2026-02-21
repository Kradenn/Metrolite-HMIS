import React, { useState } from 'react';
import { useModules, GlobalModuleState } from '../../context/ModuleContext';
import { useNotification } from '../../context/NotificationContext';

interface ModuleDef {
    key: keyof GlobalModuleState;
    title: string;
    description: string;
    icon: string;
    category: 'Clinical' | 'ERP' | 'Admin' | 'Comm';
}

const MODULE_DEFS: ModuleDef[] = [
    { key: 'clinical', title: 'Standard Clinical', description: 'Triage, consultation, and nursing workflow.', icon: 'fa-user-md', category: 'Clinical' },
    { key: 'medicalMopc', title: 'Medical (MOPC)', description: 'Chronic disease and medical outpatient clinics.', icon: 'fa-heart-pulse', category: 'Clinical' },
    { key: 'diagnostics', title: 'Surgical & Diagnostics', icon: 'fa-procedures', description: 'Theatres, SOPC, Lab and Radiology.', category: 'Clinical' },
    { key: 'mch', title: 'RMNCH', description: 'Antenatal and child health services.', icon: 'fa-baby', category: 'Clinical' },
    { key: 'dentalEye', title: 'Dental & Eye', description: 'Specialized optical and dental care.', icon: 'fa-teeth', category: 'Clinical' },
    { key: 'rehabWellness', title: 'Rehab & Wellness', description: 'Physio, Psych, and occupational therapy.', icon: 'fa-walking', category: 'Clinical' },
    { key: 'pharmacy', title: 'Pharmacy', description: 'Drug inventory and POS dispensing.', icon: 'fa-medkit', category: 'Clinical' },
    { key: 'morgue', title: 'Morgue', description: 'Deceased management and storage.', icon: 'fa-hourglass-end', category: 'Clinical' },
    { key: 'telehealth', title: 'Telehealth', description: 'Video conferencing and AI scribing.', icon: 'fa-video', category: 'Clinical' },
    { key: 'cmePortal', title: 'CME Portal', description: 'Continuing medical education tracking.', icon: 'fa-graduation-cap', category: 'Clinical' },
    
    { key: 'accounts', title: 'General Ledger', description: 'Banking, tax, and journal vouchers.', icon: 'fa-bank', category: 'ERP' },
    { key: 'billing', title: 'Patient Billing', description: 'Invoices, receipts, and payer schemes.', icon: 'fa-credit-card', category: 'ERP' },
    { key: 'procurement', title: 'Procurement', description: 'Suppliers, LPOs and goods receipt.', icon: 'fa-money-bill-transfer', category: 'ERP' },
    { key: 'inventory', title: 'Central Inventory', description: 'Stock take and internal consumption.', icon: 'fa-archive', category: 'ERP' },
    { key: 'hr', title: 'Human Resource', description: 'Payroll, leave, and employee records.', icon: 'fa-users', category: 'ERP' },
    { key: 'kitchen', title: 'Kitchen & Dietary', description: 'Patient meal planning and prep.', icon: 'fa-utensils', category: 'ERP' },
    
    { key: 'communication', title: 'UM Chat Hub', description: 'Broadcast SMS, Internal Chat, and Support Help Desk.', icon: 'fa-comments', category: 'Comm' },

    { key: 'website', title: 'Website Builder', description: 'Public site CMS and event manager.', icon: 'fa-globe', category: 'Admin' },
    { key: 'portalManager', title: 'Portal Visibility', description: 'Manage self-service portal views.', icon: 'fa-laptop-medical', category: 'Admin' },
];

const ModuleSettings: React.FC = () => {
    const { modules, toggleModule, toggleSubmodule } = useModules();
    const { notify } = useNotification();
    const [expandedKey, setExpandedKey] = useState<string | null>(null);

    const handleToggle = (key: keyof GlobalModuleState, title: string) => {
        const newState = !modules[key].enabled;
        toggleModule(key);
        notify(
            newState ? 'success' : 'warning', 
            newState ? 'Module Enabled' : 'Module Disabled', 
            `The ${title} module has been ${newState ? 'activated' : 'deactivated'} across the system.`
        );
    };

    const handleSubToggle = (moduleKey: keyof GlobalModuleState, subKey: string, subTitle: string) => {
        const newState = !modules[moduleKey].submodules[subKey];
        toggleSubmodule(moduleKey, subKey);
        notify(
            'info', 
            'Sub-module Updated', 
            `Feature "${subTitle}" is now ${newState ? 'visible' : 'hidden'}.`
        );
    };

    const renderCategory = (category: 'Clinical' | 'ERP' | 'Admin' | 'Comm') => {
        const categoryModules = MODULE_DEFS.filter(m => m.category === category);
        const displayCategory = category === 'Comm' ? 'UM Chat' : category;
        
        return (
            <div className="space-y-4">
                <h6 className="text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">{displayCategory} Infrastructure</h6>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryModules.map(m => {
                        const isModuleEnabled = modules[m.key].enabled;
                        const submodules = modules[m.key].submodules;
                        const activeSubCount = Object.values(submodules).filter(v => v).length;
                        const totalSubCount = Object.values(submodules).length;

                        return (
                            <div key={m.key} className={`flex flex-col rounded-3xl border transition-all ${isModuleEnabled ? 'bg-white border-blue-100 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
                                <div className="p-5 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${isModuleEnabled ? 'bg-blue-50 text-blue-600 shadow-inner' : 'bg-gray-200 text-gray-400'}`}>
                                            <i className={`fa ${m.icon}`}></i>
                                        </div>
                                        <div className="min-w-0">
                                            <h5 className="text-xs font-black text-gray-800 uppercase tracking-tight">{m.title}</h5>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${isModuleEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                                    {isModuleEnabled ? 'Active' : 'Disabled'}
                                                </span>
                                                {isModuleEnabled && (
                                                    <span className="text-[9px] font-bold text-blue-400 uppercase">{activeSubCount}/{totalSubCount} Features</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        {isModuleEnabled && (
                                            <button 
                                                onClick={() => setExpandedKey(expandedKey === m.key ? null : m.key)}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${expandedKey === m.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                            >
                                                <i className={`fa ${expandedKey === m.key ? 'fa-cog fa-spin' : 'fa-chevron-down'}`}></i>
                                            </button>
                                        )}
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={isModuleEnabled} 
                                                onChange={() => handleToggle(m.key, m.title)} 
                                            />
                                            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>

                                {expandedKey === m.key && isModuleEnabled && (
                                    <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-200">
                                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
                                            <h6 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Granular Feature Control</h6>
                                            <div className="grid grid-cols-1 gap-2">
                                                {Object.keys(submodules).map(subKey => (
                                                    <div key={subKey} className="flex items-center justify-between p-2 hover:bg-white rounded-lg transition-colors group">
                                                        <span className="text-[10px] font-bold text-gray-600 uppercase group-hover:text-blue-600">{subKey.replace(/_/g, ' ')}</span>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input 
                                                                type="checkbox" 
                                                                className="sr-only peer" 
                                                                checked={submodules[subKey]} 
                                                                onChange={() => handleSubToggle(m.key, subKey, subKey)} 
                                                            />
                                                            <div className="w-8 h-4 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-500"></div>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="animate-bottom space-y-8 pb-20">
            {/* Header Area */}
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-l-8 border-l-slate-800">
                <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 bg-slate-100 text-slate-800 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-slate-200">
                        <i className="fa fa-toggle-on"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">System Infrastructure Manager</h2>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Global Module & Feature Access Control</p>
                    </div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-[10px] text-blue-800 font-bold max-w-md leading-relaxed">
                    <i className="fa fa-shield-alt mr-2 text-sm text-blue-400"></i>
                    Changes made here affect all system users in real-time. Disabling a parent module automatically hides all its sub-modules.
                </div>
            </div>

            <div className="space-y-16">
                {renderCategory('Clinical')}
                {renderCategory('ERP')}
                {renderCategory('Comm')}
                {renderCategory('Admin')}
            </div>
        </div>
    );
};

export default ModuleSettings;