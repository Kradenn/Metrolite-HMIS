import React, { useState, useMemo } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { useNotification } from '../../context/NotificationContext';

interface Department {
    id: number;
    name: string;
    code: string;
    head: string;
    headInitials: string;
    staffCount: number;
    status: 'Active' | 'Inactive';
}

interface Branch {
    id: number;
    name: string;
    code: string;
    type: 'Main Hub' | 'Satellite' | 'Clinic';
    syncPolicy: 'Real-time' | 'Batch (EOD)' | 'Manual';
    status: 'Online' | 'Maintenance';
}

const HospitalDepartments: React.FC = () => {
    const { hospitalName, updateHospitalName } = useHospital();
    const { notify } = useNotification();
    const [activeTab, setActiveTab] = useState<'profile' | 'departments' | 'branches'>('profile');
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // --- State for Departments ---
    const [departments, setDepartments] = useState<Department[]>([
        { id: 1, name: 'Administration', code: 'ADMIN', head: 'John Doe', headInitials: 'JD', staffCount: 12, status: 'Active' },
        { id: 2, name: 'Clinical Services', code: 'CLIN', head: 'Dr. James Wilson', headInitials: 'DJW', staffCount: 45, status: 'Active' },
        { id: 3, name: 'Nursing', code: 'NURS', head: 'Sarah Kennedy', headInitials: 'SK', staffCount: 80, status: 'Active' },
        { id: 4, name: 'Pharmacy', code: 'PHAR', head: 'Peter Jones', headInitials: 'PJ', staffCount: 8, status: 'Active' },
        { id: 5, name: 'Laboratory', code: 'LAB', head: 'Jane Smith', headInitials: 'JS', staffCount: 15, status: 'Active' },
    ]);

    // --- State for Branches ---
    const [branches] = useState<Branch[]>([
        { id: 1, name: 'Main Branch (HQ)', code: 'MB-01', type: 'Main Hub', syncPolicy: 'Real-time', status: 'Online' },
        { id: 2, name: 'City Center Clinic', code: 'CC-02', type: 'Clinic', syncPolicy: 'Real-time', status: 'Online' },
        { id: 3, name: 'Westlands Facility', code: 'WF-03', type: 'Satellite', syncPolicy: 'Batch (EOD)', status: 'Maintenance' },
    ]);

    const [tempName, setTempName] = useState(hospitalName);

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            updateHospitalName(tempName);
            setIsSaving(false);
            notify('success', 'Profile Updated', 'Hospital meta-information has been synchronized globally.');
        }, 1000);
    };

    const inputClass = "w-full p-2.5 bg-white border border-slate-300 rounded-xl text-[11px] font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm";
    const labelClass = "block text-[10px] font-black text-slate-500 uppercase px-1 mb-1 tracking-widest";

    const filteredDepartments = useMemo(() => {
        return departments.filter(d => 
            d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.head.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [departments, searchTerm]);

    return (
        <div className="animate-bottom space-y-6 pb-20">
            {/* Header: Enterprise Branding */}
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-6 border-l-8 border-l-blue-600">
                <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl shadow-xl">
                        <i className="fa fa-hospital"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{hospitalName}</h2>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Infrastructure & Organizational Control</p>
                    </div>
                </div>
                
                <div className="flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200 shadow-inner">
                    {[
                        { id: 'profile', label: 'Hospital Profile', icon: 'fa-id-card' },
                        { id: 'departments', label: 'Departments', icon: 'fa-sitemap' },
                        { id: 'branches', label: 'Branch Logic', icon: 'fa-code-branch' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id as any); setSearchTerm(''); }}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                activeTab === tab.id 
                                ? 'bg-white text-blue-600 shadow-md scale-[1.02]' 
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <i className={`fa ${tab.icon}`}></i>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* TAB CONTENT: PROFILE */}
            {activeTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                        <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-4 mb-8">Identity & Metadata</h5>
                        <form onSubmit={handleSaveProfile} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Hospital Registered Name</label>
                                    <input type="text" value={tempName} onChange={e => setTempName(e.target.value)} className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Hospital Short Code</label>
                                    <input type="text" defaultValue="UHH_001" className={inputClass} />
                                </div>
                                <div className="col-span-2">
                                    <label className={labelClass}>Full Postal Address</label>
                                    <textarea className={`${inputClass} h-20 resize-none`} defaultValue="Plaza Building, Along Ngong Road, P.O Box 1029-00100, Nairobi, Kenya"></textarea>
                                </div>
                                <div>
                                    <label className={labelClass}>Primary Hotline</label>
                                    <input type="tel" defaultValue="+254 700 000 000" className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Official Contact Email</label>
                                    <input type="email" defaultValue="info@ultrahub.com" className={inputClass} />
                                </div>
                            </div>
                            <div className="pt-6 border-t border-gray-100 flex justify-end">
                                <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition transform active:scale-95 disabled:opacity-50">
                                    {isSaving ? <i className="fa fa-spinner fa-spin mr-2"></i> : <i className="fa fa-save mr-2"></i>}
                                    Commit Profile Changes
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div className="space-y-8">
                        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                            <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6">Logo & Branding</h5>
                            <div className="flex flex-col items-center">
                                <div className="w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center text-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-400 transition-all cursor-pointer group">
                                    <i className="fa fa-cloud-upload-alt text-3xl mb-2 group-hover:scale-110 transition-transform"></i>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Update Logo</span>
                                </div>
                                <p className="text-[9px] text-gray-400 font-bold uppercase mt-4 text-center leading-relaxed">Accepted formats: .png, .jpg, .svg <br/> Max Size: 2MB</p>
                            </div>
                        </div>

                        <div className="bg-[#1e293b] text-white p-6 rounded-3xl shadow-2xl relative overflow-hidden">
                            <h6 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Infrastructure Health</h6>
                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 font-bold uppercase">DB Sync:</span>
                                    <span className="font-black text-emerald-400 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> ACTIVE</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 font-bold uppercase">Uptime:</span>
                                    <span className="font-black">99.98%</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 font-bold uppercase">Nodes:</span>
                                    <span className="font-black">12 Active</span>
                                </div>
                            </div>
                            <i className="fa fa-server absolute -right-6 -bottom-6 text-8xl text-white/5 rotate-12"></i>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: DEPARTMENTS (User Requested Rewrite) */}
            {activeTab === 'departments' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {/* Add New Department Form */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                            <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-4 mb-8">Add New Department</h5>
                            <form className="space-y-6">
                                <div>
                                    <label className={labelClass}>Department Name *</label>
                                    <input type="text" className={inputClass} placeholder="e.g. RADIOLOGY" required />
                                </div>
                                <div>
                                    <label className={labelClass}>Department Code</label>
                                    <input type="text" className={inputClass} placeholder="e.g. RAD-01" />
                                </div>
                                <div>
                                    <label className={labelClass}>Head of Department</label>
                                    <input type="text" className={inputClass} placeholder="Enter Name..." />
                                </div>
                                <button type="button" onClick={() => notify('info', 'Process Locked', 'Creating departments requires Superadmin authentication in this workspace.')} className="w-full bg-blue-600 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition">
                                    Create Department
                                </button>
                            </form>
                        </div>

                        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6">
                            <div className="flex items-center space-x-3 mb-2">
                                <i className="fa fa-info-circle text-indigo-500"></i>
                                <h6 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Registry Information</h6>
                            </div>
                            <p className="text-[11px] text-indigo-600 font-medium leading-relaxed">
                                Departments define the logical structure of clinical and administrative permissions. Each unit must have an assigned head for reporting workflows.
                            </p>
                        </div>
                    </div>

                    {/* Department List */}
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 bg-gray-50 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Departmental Registry</h2>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Configure and manage hospital functional units.</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="text-right mr-4">
                                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Total Units</p>
                                    <p className="text-xl font-black text-blue-600 leading-none mt-1">{departments.length}</p>
                                </div>
                                <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition shadow-sm">
                                    <i className="fa fa-download mr-2"></i> Export List
                                </button>
                            </div>
                        </div>

                        <div className="p-4 border-b border-gray-50 flex items-center px-8 bg-white">
                            <div className="relative flex-1 max-w-sm">
                                <i className="fa fa-filter absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-[10px]"></i>
                                <input 
                                    type="text" 
                                    placeholder="Filter departments..." 
                                    className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 outline-none focus:ring-1 focus:ring-blue-600"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto flex-1">
                            <table className="w-full text-left text-[11px] border-collapse">
                                <thead className="bg-white border-b border-gray-200 text-gray-400 font-black uppercase tracking-widest">
                                    <tr>
                                        <th className="px-8 py-5">ID</th>
                                        <th className="px-8 py-5">Department Details</th>
                                        <th className="px-8 py-5">Head of Unit</th>
                                        <th className="px-8 py-5 text-center">Staffing</th>
                                        <th className="px-8 py-5 text-center">Status</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 bg-white font-medium text-slate-700">
                                    {filteredDepartments.map(dept => (
                                        <tr key={dept.id} className="hover:bg-blue-50/50 transition-colors group">
                                            <td className="px-8 py-4 font-black text-slate-300">{dept.id}</td>
                                            <td className="px-8 py-4">
                                                <div className="font-black text-slate-800 uppercase tracking-tight leading-none">{dept.name}</div>
                                                <div className="text-[9px] text-blue-600 font-black uppercase mt-1.5 tracking-tighter">{dept.code}</div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[8px] border border-indigo-100">{dept.headInitials}</div>
                                                    <span className="font-bold text-slate-700 uppercase tracking-tighter">{dept.head}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4 text-center">
                                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg font-black text-[9px] uppercase">{dept.staffCount} Staff</span>
                                            </td>
                                            <td className="px-8 py-4 text-center">
                                                <span className={`px-2 py-0.5 rounded-none text-[8px] font-black uppercase border ${dept.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500'}`}>{dept.status}</span>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"><i className="fa fa-edit"></i></button>
                                                    <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"><i className="fa fa-trash"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 bg-slate-900 border-t border-white/5 flex justify-between items-center px-8 shrink-0">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Registry Version 3.1 &bull; {hospitalName}</span>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[9px] font-black text-green-600 uppercase">System Integrated: Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: BRANCH LOGIC (Rewritten) */}
            {activeTab === 'branches' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
                        <div className="p-6 bg-gray-50 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Branch Infrastructure</h2>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Manage physical sites and cross-branch data synchronization rules.</p>
                            </div>
                            <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition">
                                <i className="fa fa-plus-circle mr-2"></i> Register New Site
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[11px] border-collapse">
                                <thead className="bg-white border-b border-gray-200 text-gray-400 font-black uppercase tracking-widest">
                                    <tr>
                                        <th className="px-8 py-5">Branch Code</th>
                                        <th className="px-8 py-5">Branch Name</th>
                                        <th className="px-8 py-5">Node Type</th>
                                        <th className="px-8 py-5">Sync Policy</th>
                                        <th className="px-8 py-5 text-center">Status</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 bg-white font-medium text-slate-700">
                                    {branches.map(br => (
                                        <tr key={br.id} className="hover:bg-blue-50/50 transition-colors group">
                                            <td className="px-8 py-4 font-mono font-black text-blue-600">{br.code}</td>
                                            <td className="px-8 py-4">
                                                <span className="font-black text-slate-800 uppercase tracking-tighter">{br.name}</span>
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${br.type === 'Main Hub' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-50 text-slate-500'}`}>{br.type}</span>
                                            </td>
                                            <td className="px-8 py-4 text-slate-500 font-bold italic">{br.syncPolicy}</td>
                                            <td className="px-8 py-4 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase border ${br.status === 'Online' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>{br.status}</span>
                                            </td>
                                            <td className="px-8 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg"><i className="fa fa-cog"></i></button>
                                                    <button className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg"><i className="fa fa-network-wired"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                             <div className="flex items-center space-x-4">
                                <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><i className="fa fa-shield-halved"></i></div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-slate-400 uppercase leading-none">Security Protocol</span>
                                        <span className="text-[10px] font-black text-slate-800 uppercase mt-1">Cross-Branch SSL</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-white border border-slate-200 rounded-2xl flex items-center gap-3">
                                    <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><i className="fa fa-database"></i></div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-slate-400 uppercase leading-none">Data Sovereignty</span>
                                        <span className="text-[10px] font-black text-slate-800 uppercase mt-1">Centralized Ledger</span>
                                    </div>
                                </div>
                             </div>
                             <div className="text-right">
                                 <p className="text-[10px] text-gray-400 font-bold uppercase italic leading-relaxed">Infrastructure managed via UltraHub Enterprise Multi-Site Orchestrator.</p>
                             </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HospitalDepartments;