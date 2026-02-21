
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useNotification } from '../../context/NotificationContext';

type PortalTab = 'access' | 'features' | 'branding' | 'logs';

interface PortalFeature {
    id: string;
    label: string;
    category: 'Patient' | 'Staff';
    description: string;
    isActive: boolean;
    usageCount: number;
}

interface BrandingConfig {
    portalName: string;
    welcomeMessage: string;
    primaryColor: string;
    accentColor: string;
    logoUrl: string;
    showNotices: boolean;
}

const PortalManager: React.FC = () => {
    const location = useLocation();
    const { notify } = useNotification();
    const [activeTab, setActiveTab] = useState<PortalTab>('features');
    const [isSaving, setIsSaving] = useState(false);

    // --- Feature Toggles State ---
    const [features, setFeatures] = useState<PortalFeature[]>([
        { id: 'p_results', label: 'View Lab Results', category: 'Patient', description: 'Allows patients to download verified laboratory reports.', isActive: true, usageCount: 452 },
        { id: 'p_bills', label: 'Online Bill Payment', category: 'Patient', description: 'Enable M-Pesa/Card payments for outstanding bills via portal.', isActive: true, usageCount: 120 },
        { id: 'p_appoint', label: 'Self-Booking Appointments', category: 'Patient', description: 'Allow patients to schedule visits without calling reception.', isActive: false, usageCount: 0 },
        { id: 'p_telehealth', label: 'Telehealth Access', category: 'Patient', description: 'Enable virtual consultation rooms for patients.', isActive: true, usageCount: 35 },
        { id: 's_payslip', label: 'Digital Payslips', category: 'Staff', description: 'Staff can view and download monthly salary statements.', isActive: true, usageCount: 882 },
        { id: 's_leave', label: 'Leave Application', category: 'Staff', description: 'Digital workflow for leave requests and approvals.', isActive: true, usageCount: 154 },
        { id: 's_shift', label: 'Shift Swapping', category: 'Staff', description: 'Allow staff to request shift trades with colleagues.', isActive: false, usageCount: 0 },
    ]);

    // --- Branding State ---
    const [branding, setBranding] = useState<BrandingConfig>({
        portalName: 'UltraHub Patient Portal',
        welcomeMessage: 'Welcome to your digital health hub. Secure access to your medical records.',
        primaryColor: '#4f46e5',
        accentColor: '#ec4899',
        logoUrl: '',
        showNotices: true
    });

    // --- Access Control State ---
    const [accessConfig, setAccessConfig] = useState({
        methods: {
            standard: true,
            otp: true,
            biometric: false,
            social: false
        },
        security: {
            sessionTimeout: 20,
            maxLoginAttempts: 5,
            passwordExpiry: 90,
            mfaRequired: false
        }
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab === 'access') setActiveTab('access');
        else if (tab === 'features') setActiveTab('features');
        else if (tab === 'branding') setActiveTab('branding');
        else if (tab === 'logs') setActiveTab('logs');
    }, [location]);

    const handleToggleFeature = (id: string) => {
        setFeatures(prev => prev.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f));
        notify('info', 'Feature Updated', 'Feature toggle state changed. Deploy to apply.');
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            notify('success', 'Portal Configured', 'All self-service portal configurations have been synchronized.');
        }, 1200);
    };

    const inputClass = "w-full p-2.5 bg-white border border-slate-300 rounded-xl text-[11px] font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner";
    const labelClass = "block text-[9px] font-black text-slate-500 uppercase px-1 mb-1 tracking-widest";

    return (
        <div className="animate-bottom space-y-6 pb-20">
            
            {/* Header: Digital Hub Branding */}
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-6 border-l-8 border-l-indigo-600">
                <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl shadow-xl border border-indigo-400">
                        <i className="fa fa-laptop-medical"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Self-Service Hub Control</h2>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Patient & Staff Portal Governance</p>
                    </div>
                </div>
                
                <div className="flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200 shadow-inner">
                    {[
                        { id: 'features', label: 'Portal Features', icon: 'fa-toggle-on' },
                        { id: 'access', label: 'Access Control', icon: 'fa-user-lock' },
                        { id: 'branding', label: 'Identity', icon: 'fa-paint-brush' },
                        { id: 'logs', label: 'Usage Logs', icon: 'fa-chart-line' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as PortalTab)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                activeTab === tab.id 
                                ? 'bg-white text-indigo-600 shadow-md scale-[1.02]' 
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <i className={`fa ${tab.icon}`}></i>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Main Config Area */}
                <div className="lg:col-span-8 space-y-6">
                    {/* TAB: FEATURES */}
                    {activeTab === 'features' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {['Patient', 'Staff'].map(cat => (
                                    <div key={cat} className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col shadow-sm">
                                        <div className="p-4 bg-slate-900 text-white flex justify-between items-center px-6">
                                            <h6 className="text-[10px] font-black uppercase tracking-[0.2em]">{cat} Functionality</h6>
                                            <span className="text-[9px] font-bold text-indigo-400 uppercase">Live Switching</span>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            {features.filter(f => f.category === cat).map(feature => (
                                                <div key={feature.id} className="p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-between group">
                                                    <div className="flex-1 min-w-0 pr-4">
                                                        <h5 className="text-xs font-black text-slate-800 uppercase tracking-tight">{feature.label}</h5>
                                                        <p className="text-[10px] text-slate-400 font-medium leading-tight mt-1">{feature.description}</p>
                                                    </div>
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input 
                                                            type="checkbox" 
                                                            className="sr-only peer" 
                                                            checked={feature.isActive} 
                                                            onChange={() => handleToggleFeature(feature.id)} 
                                                        />
                                                        <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TAB: ACCESS */}
                    {activeTab === 'access' && (
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm animate-in fade-in duration-300">
                             <h5 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-4 mb-8">Portal Access Authentication</h5>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                                        <i className="fa fa-key"></i> Authentication Methods
                                    </h6>
                                    <div className="space-y-3">
                                        {[
                                            { key: 'standard', label: 'Username / Password', active: accessConfig.methods.standard },
                                            { key: 'otp', label: 'OTP via SMS (2FA)', active: accessConfig.methods.otp },
                                            { key: 'biometric', label: 'Biometric (Smart Africa)', active: accessConfig.methods.biometric },
                                            { key: 'social', label: 'Social Login (Google/Apple)', active: accessConfig.methods.social },
                                        ].map((method) => (
                                            <div key={method.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors">
                                                <span className="text-[11px] font-bold text-slate-700">{method.label}</span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer"
                                                        checked={method.active}
                                                        onChange={() => setAccessConfig(prev => ({
                                                            ...prev, 
                                                            methods: { ...prev.methods, [method.key]: !method.active }
                                                        }))}
                                                    />
                                                    <div className="w-8 h-4 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                                        <p className="text-[10px] text-blue-800 leading-relaxed font-bold uppercase tracking-tight">
                                            <i className="fa fa-info-circle mr-1"></i> Biometric Login requires integration with Smart Africa hardware at registration points.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                                        <i className="fa fa-shield-halved"></i> Security Policies
                                    </h6>
                                    <div className="space-y-4">
                                        <div>
                                            <label className={labelClass}>Session Timeout (Minutes)</label>
                                            <input 
                                                type="number" 
                                                value={accessConfig.security.sessionTimeout} 
                                                onChange={(e) => setAccessConfig(prev => ({ ...prev, security: { ...prev.security, sessionTimeout: parseInt(e.target.value) } }))}
                                                className={inputClass} 
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Max Failed Login Attempts</label>
                                            <input 
                                                type="number" 
                                                value={accessConfig.security.maxLoginAttempts} 
                                                onChange={(e) => setAccessConfig(prev => ({ ...prev, security: { ...prev.security, maxLoginAttempts: parseInt(e.target.value) } }))}
                                                className={inputClass} 
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Password Expiry (Days)</label>
                                            <input 
                                                type="number" 
                                                value={accessConfig.security.passwordExpiry} 
                                                onChange={(e) => setAccessConfig(prev => ({ ...prev, security: { ...prev.security, passwordExpiry: parseInt(e.target.value) } }))}
                                                className={inputClass} 
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                                            <input 
                                                type="checkbox" 
                                                checked={accessConfig.security.mfaRequired} 
                                                onChange={(e) => setAccessConfig(prev => ({ ...prev, security: { ...prev.security, mfaRequired: e.target.checked } }))}
                                                className="w-4 h-4 text-indigo-600 rounded"
                                            />
                                            <span className="text-[10px] font-black text-slate-600 uppercase">Enforce MFA for Staff Accounts</span>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}

                    {/* TAB: BRANDING */}
                    {activeTab === 'branding' && (
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm animate-in fade-in duration-300">
                             <h5 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-4 mb-8">Visual Identity & Theming</h5>
                             <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="space-y-6">
                                        <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Global Styles</h6>
                                        <div className="space-y-4">
                                            <div>
                                                <label className={labelClass}>Portal Title / App Name</label>
                                                <input 
                                                    value={branding.portalName} 
                                                    onChange={(e) => setBranding({ ...branding, portalName: e.target.value })} 
                                                    className={inputClass} 
                                                />
                                            </div>
                                            <div>
                                                <label className={labelClass}>Welcome Message (Login Screen)</label>
                                                <textarea 
                                                    value={branding.welcomeMessage} 
                                                    onChange={(e) => setBranding({ ...branding, welcomeMessage: e.target.value })} 
                                                    className={`${inputClass} h-20 resize-none`} 
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className={labelClass}>Primary Color</label>
                                                    <div className="flex gap-2 items-center">
                                                        <input 
                                                            type="color" 
                                                            value={branding.primaryColor} 
                                                            onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })} 
                                                            className="w-10 h-10 border-none cursor-pointer rounded-lg bg-transparent" 
                                                        />
                                                        <input value={branding.primaryColor} readOnly className={`${inputClass} uppercase`} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className={labelClass}>Accent Color</label>
                                                    <div className="flex gap-2 items-center">
                                                        <input 
                                                            type="color" 
                                                            value={branding.accentColor} 
                                                            onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })} 
                                                            className="w-10 h-10 border-none cursor-pointer rounded-lg bg-transparent" 
                                                        />
                                                        <input value={branding.accentColor} readOnly className={`${inputClass} uppercase`} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">White Labeling</h6>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="aspect-video w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-300 group hover:border-indigo-400 transition-all cursor-pointer">
                                                <i className="fa fa-cloud-upload-alt text-3xl mb-2 group-hover:scale-110 transition-transform"></i>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Upload Logo</span>
                                            </div>
                                            <div className="aspect-video w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-300 group hover:border-indigo-400 transition-all cursor-pointer">
                                                <i className="fa fa-image text-3xl mb-2 group-hover:scale-110 transition-transform"></i>
                                                <span className="text-[10px] font-black uppercase tracking-widest">Login Banner</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Live Preview Panel */}
                                <div className="bg-slate-100 rounded-[2rem] p-4 border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
                                    <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(135deg, ${branding.primaryColor} 0%, ${branding.accentColor} 100%)` }}></div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 z-10">Login Screen Preview</p>
                                    
                                    {/* Mock Phone Screen */}
                                    <div className="w-[240px] h-[480px] bg-white rounded-[2rem] border-4 border-slate-800 shadow-2xl overflow-hidden relative flex flex-col">
                                        <div className="h-6 bg-slate-800 w-full flex justify-center items-center">
                                            <div className="w-16 h-3 bg-black rounded-b-xl"></div>
                                        </div>
                                        <div className="flex-1 p-6 flex flex-col justify-center items-center text-center space-y-6">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg" style={{ backgroundColor: branding.primaryColor }}>
                                                <i className="fa fa-hospital-user"></i>
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-black text-slate-800 leading-tight">{branding.portalName}</h5>
                                                <p className="text-[8px] text-slate-400 mt-2 leading-relaxed">{branding.welcomeMessage}</p>
                                            </div>
                                            <div className="w-full space-y-2">
                                                <div className="h-8 bg-slate-50 rounded-lg border border-slate-100 w-full"></div>
                                                <div className="h-8 bg-slate-50 rounded-lg border border-slate-100 w-full"></div>
                                            </div>
                                            <div className="w-full h-8 rounded-lg text-white text-[9px] font-bold uppercase flex items-center justify-center shadow-md" style={{ backgroundColor: branding.primaryColor }}>
                                                Sign In
                                            </div>
                                            <p className="text-[8px] text-slate-400">Powered by UltraHub</p>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}

                    {/* TAB: LOGS */}
                    {activeTab === 'logs' && (
                        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden animate-in fade-in duration-300">
                            <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center px-8">
                                <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Real-time Portal Access Spool</h6>
                                <button className="text-[9px] font-black text-blue-600 uppercase border border-blue-200 px-3 py-1 rounded-lg">Export CSV</button>
                            </div>
                            <table className="w-full text-left text-[11px] border-collapse">
                                <thead className="bg-white border-b border-slate-200 text-slate-400 font-black uppercase tracking-tight">
                                    <tr>
                                        <th className="px-8 py-4">Identity</th>
                                        <th className="px-6 py-4">Action</th>
                                        <th className="px-6 py-4 text-center">Platform</th>
                                        <th className="px-8 py-4 text-right">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700 font-bold uppercase">
                                    {[
                                        { u: 'P-1002 (JANE DOE)', a: 'Viewed Lab Report', p: 'Web / Mobile', t: 'Just Now' },
                                        { u: 'E-8921 (JOHN DOE)', a: 'Downloaded Payslip', p: 'Web Portal', t: '5m ago' },
                                        { u: 'P-5521 (SAM SMITH)', a: 'Login Success', p: 'Android App', t: '12m ago' },
                                        { u: 'P-1002 (JANE DOE)', a: 'Paid Bill #INV-01', p: 'M-Pesa Express', t: '1h ago' },
                                    ].map((log, i) => (
                                        <tr key={i} className="hover:bg-indigo-50/20 transition-colors">
                                            <td className="px-8 py-4 text-indigo-600">{log.u}</td>
                                            <td className="px-6 py-4">{log.a}</td>
                                            <td className="px-6 py-4 text-center"><span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[8px]">{log.p}</span></td>
                                            <td className="px-8 py-4 text-right text-gray-400 font-mono">{log.t}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Engagement Analytics Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h6 className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Engagement Analytics</h6>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-xs font-black mb-1.5 uppercase"><span>Active Sessions</span><span>124</span></div>
                                    <div className="w-full bg-black/20 rounded-full h-1.5"><div className="bg-white h-1.5 rounded-full" style={{ width: '65%' }}></div></div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-black mb-1.5 uppercase"><span>Weekly Return Rate</span><span>82%</span></div>
                                    <div className="w-full bg-black/20 rounded-full h-1.5"><div className="bg-teal-400 h-1.5 rounded-full" style={{ width: '82%' }}></div></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-center">
                                    <div><p className="text-[18px] font-black">2.4k</p><p className="text-[8px] font-black text-indigo-200 uppercase">App Downloads</p></div>
                                    <div><p className="text-[18px] font-black">8.1k</p><p className="text-[8px] font-black text-indigo-200 uppercase">Total Hits</p></div>
                                </div>
                            </div>
                        </div>
                        <i className="fa fa-chart-bar absolute -right-6 -bottom-6 text-9xl text-white/5 rotate-12"></i>
                    </div>

                    <div className="bg-[#1e293b] text-white p-6 rounded-3xl shadow-xl">
                        <h6 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Most Used Features</h6>
                        <div className="space-y-3">
                            {features.sort((a,b) => b.usageCount - a.usageCount).slice(0, 3).map(f => (
                                <div key={f.id} className="flex items-center justify-between p-2 bg-white/5 rounded-xl border border-white/5">
                                    <span className="text-[10px] font-bold text-slate-300 uppercase">{f.label}</span>
                                    <span className="text-[10px] font-black text-blue-400">{f.usageCount} Hits</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
                        <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Infrastructure Status</h6>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-600 uppercase">External Sync</span>
                                <span className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Healthy</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-600 uppercase">M-Pesa Switch</span>
                                <span className="text-[10px] font-black text-emerald-500 uppercase">Connected</span>
                            </div>
                            <button className="w-full mt-4 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">Download Audit Report</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Persistent Control Footer */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-white/80 backdrop-blur-xl border border-slate-200 p-2 rounded-2xl shadow-2xl px-8 py-3 animate-in slide-in-from-bottom-10 duration-500">
                <div className="flex items-center space-x-6 text-[10px] font-black text-slate-400 uppercase tracking-widest pr-8 border-r border-slate-100">
                    <span className="flex items-center"><i className="fa fa-fingerprint mr-2 text-indigo-600"></i> Local Sync: ON</span>
                    <span className="flex items-center"><i className="fa fa-tag mr-2 text-indigo-600"></i> Version: 3.2.0</span>
                </div>
                <div className="flex gap-4">
                    <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-red-600 transition-colors">Revert Changes</button>
                    <button onClick={handleSave} disabled={isSaving} className="bg-indigo-600 text-white px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition transform active:scale-95 disabled:opacity-50">
                        {isSaving ? <i className="fa fa-spinner fa-spin"></i> : 'Deploy Hub Configuration'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PortalManager;
