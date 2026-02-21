import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useNotification } from '../../context/NotificationContext';

interface SmsConfig {
    provider: string;
    apiKey: string;
    username: string;
    senderId: string;
    httpMethod: string;
    regionCode: string;
    callbackUrl: string;
    isActive: boolean;
}

interface EmailConfig {
    mailServer: string;
    mailPort: string;
    senderName: string;
    senderEmail: string;
    password: string;
    encryption: 'TLS' | 'SSL' | 'None';
    isActive: boolean;
}

interface NotificationTrigger {
    id: string;
    type: string;
    targets: string[];
    threshold: number;
    storeFilter: string;
    active: boolean;
}

const NotificationsAlert: React.FC = () => {
    const location = useLocation();
    const { notify } = useNotification();
    
    // --- Tabs Logic ---
    const [activeTab, setActiveTab] = useState<'triggers' | 'sms' | 'email'>('triggers');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab === 'email') setActiveTab('email');
        else if (tab === 'sms') setActiveTab('sms');
        else if (tab === 'triggers') setActiveTab('triggers');
    }, [location]);

    // --- State Management ---
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [showSmsKey, setShowSmsKey] = useState(false);
    const [showEmailPass, setShowEmailPass] = useState(false);
    const [testInput, setTestInput] = useState('');

    const [smsConfig, setSmsConfig] = useState<SmsConfig>({
        provider: "Africa's Talking",
        apiKey: "SK_LIVE_9921_SMS_X88291_MTR",
        username: "metrolite_app",
        senderId: "ULTRAHUB",
        httpMethod: "POST",
        regionCode: "+254",
        callbackUrl: "https://api.hospital.com/sms/callback",
        isActive: true
    });

    const [emailConfig, setEmailConfig] = useState<EmailConfig>({
        mailServer: "smtp.gmail.com",
        mailPort: "587",
        senderName: "UltraHub Notifications",
        senderEmail: "alerts@ultrahub.com",
        password: "••••••••••••",
        encryption: 'TLS',
        isActive: true
    });

    const [schedules, setSchedules] = useState<NotificationTrigger[]>([
        { id: '1', type: 'Patients in queue for long', targets: ['admin@admin.com'], threshold: 1.0, storeFilter: 'Not Specified', active: true }
    ]);

    const [newTrigger, setNewTrigger] = useState<Partial<NotificationTrigger>>({
        type: '1',
        targets: [],
        threshold: 24,
        storeFilter: 'All Locations',
        active: true
    });

    // --- Handlers ---
    const handleSmsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setSmsConfig(prev => ({ ...prev, [name]: val }));
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setEmailConfig(prev => ({ ...prev, [name]: val }));
    };

    const handleSaveConfig = (type: 'SMS' | 'Email' | 'Triggers') => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            notify('success', `${type} Settings Updated`, `Global ${type.toLowerCase()} parameters have been synchronized with the notification management system.`);
        }, 1200);
    };

    const handleSendTest = (medium: 'SMS' | 'Email') => {
        if (!testInput) {
            notify('warning', 'Missing Recipient', `Please enter a valid ${medium === 'SMS' ? 'phone number' : 'email'} for the test broadcast.`);
            return;
        }
        setIsTesting(true);
        setTimeout(() => {
            setIsTesting(false);
            notify('success', 'Test Dispatched', `Handshake successful. Test ${medium} routed via configured gateway.`);
            setTestInput('');
        }, 1500);
    };

    const handleAddTrigger = (e: React.FormEvent) => {
        e.preventDefault();
        const typeMap: Record<string, string> = {
            '1': 'Patients in queue for long',
            '2': 'Items Below Reorder level',
            '3': 'Items Out of stock',
            '4': 'Items Near Expiry',
            '5': 'Unfinalized Bills'
        };

        const trigger: NotificationTrigger = {
            id: Date.now().toString(),
            type: typeMap[newTrigger.type as string] || 'Custom Alert',
            targets: newTrigger.targets || ['admin@admin.com'],
            threshold: newTrigger.threshold || 0,
            storeFilter: newTrigger.storeFilter || 'All',
            active: newTrigger.active || true
        };

        setSchedules([trigger, ...schedules]);
        notify('info', 'Schedule Added', 'New automated trigger rule has been enabled.');
    };

    const deleteTrigger = (id: string) => {
        setSchedules(prev => prev.filter(s => s.id !== id));
        notify('info', 'Trigger Rule Removed', 'The automated alert condition has been successfully deleted.');
    };

    return (
        <div className="animate-bottom space-y-6 pb-20">
            
            {/* Header: Consolidated Style */}
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-l-8 border-l-indigo-600">
                <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-indigo-100">
                        <i className="fa fa-bullhorn"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Notification Management</h2>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Automated Notifications & Gateway Control</p>
                    </div>
                </div>
                
                <div className="flex items-center bg-gray-100 p-1 rounded-2xl border border-gray-200 shadow-inner">
                    {[
                        { id: 'triggers', label: 'Alert Triggers', icon: 'fa-bolt' },
                        { id: 'sms', label: 'SMS Gateway', icon: 'fa-sms' },
                        { id: 'email', label: 'Email Integration', icon: 'fa-envelope' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
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

            {/* TAB: TRIGGER RULES */}
            {activeTab === 'triggers' && (
                <div className="animate-in fade-in duration-300 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center px-8">
                            <h5 className="font-black text-gray-800 text-xs uppercase tracking-widest">Register Notification Rule</h5>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Polling Active</span>
                            </div>
                        </div>
                        <div className="p-8">
                            <form onSubmit={handleAddTrigger} className="grid grid-cols-1 md:grid-cols-12 gap-10">
                                <div className="md:col-span-7 space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Notification Event</label>
                                        <select 
                                            value={newTrigger.type}
                                            onChange={e => setNewTrigger({...newTrigger, type: e.target.value})}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black text-gray-800 outline-none focus:ring-1 focus:ring-indigo-500" required>
                                            <option value="1">Patients in queue for long</option>
                                            <option value="2">Items Below Reorder level</option>
                                            <option value="3">Items Out of stock</option>
                                            <option value="4">Items Near Expiry</option>
                                            <option value="5">Unfinalized Bills</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Target Recipients (System Users)</label>
                                        <select 
                                            multiple 
                                            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none h-32 shadow-inner"
                                            onChange={(e) => {
                                                const values = Array.from(e.target.selectedOptions).map((option: HTMLOptionElement) => option.value);
                                                setNewTrigger({...newTrigger, targets: values});
                                            }}
                                        >
                                            <option value="admin@admin.com">Administrator (System)</option>
                                            <option value="nurse@hmis.com">Nursing Supervisor</option>
                                            <option value="doctor@hmis.com">Chief Medical Officer</option>
                                            <option value="pharma@hmis.com">Pharmacy Manager</option>
                                        </select>
                                        <p className="mt-2 text-[9px] text-gray-400 italic font-medium uppercase tracking-tighter">Ctrl + Click to multi-select recipients</p>
                                    </div>
                                </div>

                                <div className="md:col-span-5 space-y-6 flex flex-col">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Threshold (Hrs / Qty)</label>
                                        <input 
                                            type="number" 
                                            value={newTrigger.threshold}
                                            onChange={e => setNewTrigger({...newTrigger, threshold: Number(e.target.value)})}
                                            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-blue-600 outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm" placeholder="e.g. 24" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Source Entity Filter</label>
                                        <select 
                                            value={newTrigger.storeFilter}
                                            onChange={e => setNewTrigger({...newTrigger, storeFilter: e.target.value})}
                                            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none">
                                            <option>All Locations</option>
                                            <option>Main Pharmacy</option>
                                            <option>Central Store</option>
                                            <option>Laboratory</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-end mt-auto">
                                        <button type="submit" className="bg-indigo-600 text-white px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition transform active:scale-95">
                                            <i className="fa fa-plus-circle mr-2"></i> Register Rule
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
                        <table className="w-full text-left text-[11px]">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-400 font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-4">Alert Condition</th>
                                    <th className="px-6 py-4 text-center">Threshold</th>
                                    <th className="px-6 py-4">Scope</th>
                                    <th className="px-6 py-4 text-center">Recipients</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-8 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-medium text-gray-600">
                                {schedules.map(s => (
                                    <tr key={s.id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="px-8 py-4 uppercase font-black text-gray-800">{s.type}</td>
                                        <td className="px-6 py-4 text-center font-bold text-blue-600">{s.threshold} Unit(s)</td>
                                        <td className="px-6 py-4 italic text-gray-400">{s.storeFilter}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-gray-100 text-gray-500 px-2.5 py-0.5 rounded text-[9px] font-black">{s.targets.length} Target(s)</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {s.active ? <i className="fa fa-check-circle text-green-500 text-lg"></i> : <i className="fa fa-times-circle text-gray-300 text-lg"></i>}
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <button onClick={() => deleteTrigger(s.id)} className="text-gray-300 hover:text-red-500 transition-colors"><i className="fa fa-trash-alt"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB: SMS GATEWAY */}
            {activeTab === 'sms' && (
                <div className="animate-in fade-in duration-300 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
                        <div className="p-5 bg-gray-50 border-b border-gray-100 flex justify-between items-center px-8">
                             <div className="flex items-center space-x-3">
                                <i className="fa fa-broadcast-tower text-indigo-500"></i>
                                <h5 className="text-[10px] font-black text-gray-800 uppercase tracking-widest">Global SMS Routing Parameters</h5>
                             </div>
                             <button onClick={() => handleSaveConfig('SMS')} disabled={isSaving} className="bg-indigo-600 text-white px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition disabled:opacity-50">
                                {isSaving ? <i className="fa fa-spinner fa-spin mr-2"></i> : <i className="fa fa-save mr-2"></i>}
                                Save SMS Config
                             </button>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">API Credentials</h6>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Provider</label>
                                        <select name="provider" value={smsConfig.provider} onChange={handleSmsChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs font-bold">
                                            <option>Africa's Talking</option><option>Twilio</option><option>Infobip</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">API Key</label>
                                        <div className="relative">
                                            <input type={showSmsKey ? 'text' : 'password'} name="apiKey" value={smsConfig.apiKey} onChange={handleSmsChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono font-bold text-teal-600" />
                                            <button type="button" onClick={() => setShowSmsKey(!showSmsKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><i className={`fa ${showSmsKey ? 'fa-eye-slash' : 'fa-eye'}`}></i></button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Username / App ID</label>
                                        <input type="text" name="username" value={smsConfig.username} onChange={handleSmsChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs font-bold" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Identity & Routing</h6>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Sender ID (Alphanumeric)</label>
                                        <input type="text" name="senderId" value={smsConfig.senderId} onChange={handleSmsChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm font-black text-blue-600 uppercase" maxLength={11} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Region Code</label><input type="text" name="regionCode" value={smsConfig.regionCode} onChange={handleSmsChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs font-bold" /></div>
                                        <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Method</label><select name="httpMethod" value={smsConfig.httpMethod} onChange={handleSmsChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs font-bold"><option>POST</option><option>GET</option></select></div>
                                    </div>
                                    <div className="flex items-center space-x-2 pt-2">
                                        <input type="checkbox" name="isActive" id="smsActive" checked={smsConfig.isActive} onChange={handleSmsChange} className="w-4 h-4 rounded text-indigo-600" />
                                        <label htmlFor="smsActive" className="text-[10px] font-black text-gray-500 uppercase tracking-widest cursor-pointer">Enable SMS Services</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
                        <div className="relative z-10 flex-1">
                            <h5 className="text-sm font-black uppercase tracking-widest text-teal-400 flex items-center gap-2"><i className="fa fa-bolt"></i> Connection Diagnosis</h5>
                            <p className="text-xs text-slate-400 mt-2 leading-relaxed">Trigger a test broadcast to ensure the gateway handshake is active before enabling automated alerts.</p>
                        </div>
                        <div className="relative z-10 flex items-center gap-4 w-full md:w-auto">
                            <input type="tel" value={testInput} onChange={e => setTestInput(e.target.value)} className="bg-slate-800 border-none rounded-xl p-3 text-sm font-black text-white w-full md:w-64 outline-none focus:ring-1 focus:ring-teal-500" placeholder="Recipient: +254..." />
                            <button onClick={() => handleSendTest('SMS')} disabled={isTesting} className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition disabled:opacity-50 min-w-[150px]">
                                {isTesting ? <i className="fa fa-spinner fa-spin mr-2"></i> : 'Run SMS Test'}
                            </button>
                        </div>
                        <i className="fa fa-satellite-dish absolute -right-6 -bottom-6 text-9xl text-white/5 rotate-12"></i>
                    </div>
                </div>
            )}

            {/* TAB: EMAIL INTEGRATION */}
            {activeTab === 'email' && (
                <div className="animate-in fade-in duration-300 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
                        <div className="p-5 bg-gray-50 border-b border-gray-100 flex justify-between items-center px-8">
                             <div className="flex items-center space-x-3">
                                <i className="fa fa-envelope-open-text text-indigo-500"></i>
                                <h5 className="text-[10px] font-black text-gray-800 uppercase tracking-widest">SMTP & Mailing Server Logic</h5>
                             </div>
                             <button onClick={() => handleSaveConfig('Email')} disabled={isSaving} className="bg-indigo-600 text-white px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition disabled:opacity-50">
                                {isSaving ? <i className="fa fa-spinner fa-spin mr-2"></i> : <i className="fa fa-save mr-2"></i>}
                                Save Email Config
                             </button>
                        </div>
                        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Mailing Server (SMTP)</h6>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Mail Host / Server</label>
                                        <input type="text" name="mailServer" value={emailConfig.mailServer} onChange={handleEmailChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono font-bold text-blue-600" placeholder="e.g. smtp.gmail.com" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Port</label><input type="text" name="mailPort" value={emailConfig.mailPort} onChange={handleEmailChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs font-bold" /></div>
                                        <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Encryption</label><select name="encryption" value={emailConfig.encryption} onChange={handleEmailChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs font-bold"><option>TLS</option><option>SSL</option><option>None</option></select></div>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Sender Authorization</h6>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Sender Name</label><input type="text" name="senderName" value={emailConfig.senderName} onChange={handleEmailChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs font-bold" /></div>
                                        <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Sender Email</label><input type="email" name="senderEmail" value={emailConfig.senderEmail} onChange={handleEmailChange} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs font-bold" /></div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Password / App Token</label>
                                        <div className="relative">
                                            <input type={showEmailPass ? 'text' : 'password'} name="password" value={emailConfig.password} onChange={handleEmailChange} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono font-bold" />
                                            <button type="button" onClick={() => setShowEmailPass(!showEmailPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><i className={`fa ${showEmailPass ? 'fa-eye-slash' : 'fa-eye'}`}></i></button>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 pt-2">
                                        <input type="checkbox" name="isActive" id="emailActive" checked={emailConfig.isActive} onChange={handleEmailChange} className="w-4 h-4 rounded text-indigo-600" />
                                        <label htmlFor="emailActive" className="text-[10px] font-black text-gray-500 uppercase tracking-widest cursor-pointer">Enable Email Services</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-center shadow-2xl">
                        <div className="relative z-10 space-y-2">
                            <h4 className="text-lg font-black uppercase tracking-tight text-blue-400">Server Handshake Test</h4>
                            <p className="text-xs text-slate-400 font-medium max-w-lg">Send a test email to verify SMTP authentication and bypass firewall restrictions.</p>
                        </div>
                        <div className="relative z-10 flex items-center gap-4 w-full md:w-auto">
                            <input type="email" value={testInput} onChange={e => setTestInput(e.target.value)} className="bg-slate-800 border-none rounded-xl p-3 text-sm font-black text-white w-full md:w-64 outline-none focus:ring-1 focus:ring-blue-500" placeholder="Recipient@domain.com" />
                            <button onClick={() => handleSendTest('Email')} disabled={isTesting} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition disabled:opacity-50 min-w-[150px]">
                                {isTesting ? <i className="fa fa-spinner fa-spin mr-2"></i> : 'Send Test Mail'}
                            </button>
                        </div>
                        <i className="fa fa-at absolute -right-6 -bottom-6 text-9xl text-white/5 rotate-12"></i>
                    </div>
                </div>
            )}

            {/* Footer Policy Area */}
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-start space-x-5">
                <div className="w-10 h-10 bg-white border border-blue-200 rounded-xl flex items-center justify-center text-blue-500 shrink-0 shadow-sm">
                    <i className="fa fa-shield-halved"></i>
                </div>
                <div className="text-[11px] text-blue-900 leading-relaxed font-medium">
                    <p className="font-black uppercase tracking-widest mb-1 text-blue-600">Compliance & Security Notice</p>
                    All outgoing messages (SMS & Email) are logged for auditing purposes. Automated triggers for clinical alerts (Stock levels, Queue wait times) are governed by the polling interval defined in Module Settings. Ensure credentials for third-party providers are kept secure.
                </div>
            </div>
        </div>
    );
};

export default NotificationsAlert;