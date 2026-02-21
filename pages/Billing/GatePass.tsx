import React, { useState, useMemo } from 'react';
import { useNotification } from '../../context/NotificationContext';

interface GatePassRecord {
    id: string;
    patientName: string;
    opNo: string;
    ward: string;
    bed: string;
    dischargeDate: string;
    billingStatus: 'Cleared' | 'Pending' | 'Partial';
    nursingStatus: 'Cleared' | 'Pending';
    pharmacyStatus: 'Cleared' | 'Pending';
    releasedBy: string;
    exitTime?: string;
    securityOfficer?: string;
    vehicleReg?: string;
}

const GatePass: React.FC = () => {
    const { notify } = useNotification();
    const [activeTab, setActiveTab] = useState<'pending' | 'ready' | 'history'>('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPassId, setSelectedPassId] = useState<string | null>(null);
    const [isProcessingExit, setIsProcessingExit] = useState(false);

    // Mock Data
    const [passes, setPasses] = useState<GatePassRecord[]>([
        { id: 'GP-2023-1001', patientName: 'JANE DOE', opNo: 'OP-2023-001', ward: 'Gen Ward (F)', bed: 'F-04', dischargeDate: '24 Oct 2023', billingStatus: 'Cleared', nursingStatus: 'Cleared', pharmacyStatus: 'Cleared', releasedBy: 'Admin User' },
        { id: 'GP-2023-1002', patientName: 'JOHN SMITH', opNo: 'OP-2023-042', ward: 'Private Wing', bed: 'P-102', dischargeDate: '24 Oct 2023', billingStatus: 'Pending', nursingStatus: 'Cleared', pharmacyStatus: 'Cleared', releasedBy: 'Dr. Wilson' },
        { id: 'GP-2023-1003', patientName: 'ALICE WONG', opNo: 'OP-2023-089', ward: 'Gen Ward (F)', bed: 'F-12', dischargeDate: '23 Oct 2023', billingStatus: 'Cleared', nursingStatus: 'Cleared', pharmacyStatus: 'Cleared', releasedBy: 'Nurse Sarah', exitTime: '14:20 PM', securityOfficer: 'Sgt. Bakari', vehicleReg: 'KDA 123X' },
    ]);

    const filteredPasses = useMemo(() => {
        return passes.filter(p => {
            const matchesSearch = p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
            if (activeTab === 'pending') return matchesSearch && (p.billingStatus !== 'Cleared' || p.nursingStatus !== 'Cleared' || p.pharmacyStatus !== 'Cleared') && !p.exitTime;
            if (activeTab === 'ready') return matchesSearch && (p.billingStatus === 'Cleared' && p.nursingStatus === 'Cleared' && p.pharmacyStatus === 'Cleared') && !p.exitTime;
            if (activeTab === 'history') return matchesSearch && !!p.exitTime;
            return matchesSearch;
        });
    }, [passes, activeTab, searchTerm]);

    const selectedPass = useMemo(() => passes.find(p => p.id === selectedPassId), [passes, selectedPassId]);

    const handleProcessExit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const officer = formData.get('officer') as string;
        const vehicle = formData.get('vehicle') as string;

        setIsProcessingExit(true);
        setTimeout(() => {
            setPasses(prev => prev.map(p => 
                p.id === selectedPassId 
                ? { ...p, exitTime: new Date().toLocaleTimeString(), securityOfficer: officer, vehicleReg: vehicle } 
                : p
            ));
            setIsProcessingExit(false);
            notify('success', 'Exit Logged', 'Patient departure recorded.');
            setActiveTab('history');
        }, 800);
    };

    return (
        <div className="animate-bottom h-[calc(100vh-100px)] flex flex-col font-helvetica overflow-hidden -m-4 md:-m-6">
            {/* Header: Indigo Clinical Style */}
            <div className="bg-slate-900 border-l-[6px] border-l-indigo-600 p-3 flex justify-between items-center shrink-0 shadow-lg">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xl shadow-lg">
                        <i className="fa fa-ticket-alt"></i>
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-tighter leading-none">Gate Pass Control</h2>
                        <p className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Authorized Departure Verification</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[8px] font-black text-slate-500 uppercase leading-none mb-1">Station Status</p>
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Linked: Gate 1</span>
                             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden min-h-0 bg-white">
                {/* Left: Clearance Registry */}
                <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
                    <div className="p-3 border-b border-slate-100 bg-slate-50 flex flex-col gap-2">
                        <div className="relative">
                            <i className="fa fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
                            <input 
                                type="text" 
                                placeholder="Search Patient or GP#..." 
                                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold outline-none focus:ring-1 focus:ring-indigo-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex p-0.5 bg-gray-200/50 rounded-lg">
                            {(['pending', 'ready', 'history'] as const).map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => { setActiveTab(tab); setSelectedPassId(null); }}
                                    className={`flex-1 py-1 rounded-md text-[8px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-50 custom-scrollbar">
                        {filteredPasses.length > 0 ? filteredPasses.map(p => (
                            <div 
                                key={p.id} 
                                onClick={() => setSelectedPassId(p.id)}
                                className={`p-4 cursor-pointer transition-all border-l-4 ${selectedPassId === p.id ? 'bg-indigo-50 border-l-indigo-600' : 'hover:bg-gray-50 border-l-transparent'}`}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[8px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded tracking-tighter">{p.id}</span>
                                    <span className={`text-[7px] font-black uppercase px-1 py-0.5 rounded border ${p.billingStatus === 'Cleared' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                                        Bill: {p.billingStatus}
                                    </span>
                                </div>
                                <h6 className="text-xs font-black text-gray-800 uppercase truncate">{p.patientName}</h6>
                                <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 leading-none">{p.opNo} &bull; {p.ward}</p>
                            </div>
                        )) : (
                            <div className="py-12 text-center text-gray-300 italic text-[10px] uppercase font-black tracking-widest px-8">No results in {activeTab} registry.</div>
                        )}
                    </div>
                </div>

                {/* Center: Interactive Document Canvas */}
                <div className="flex-1 bg-slate-100 p-8 overflow-y-auto scrollbar-hide flex flex-col items-center relative">
                    {selectedPass ? (
                        <div className="bg-white w-full max-w-lg shadow-2xl rounded-sm p-12 flex flex-col relative animate-in zoom-in-95 duration-300">
                            {/* Verification Stamp Overlay */}
                            <div className="absolute top-10 right-10 rotate-[12deg] z-20 pointer-events-none opacity-20">
                                <div className="border-[6px] border-emerald-600 p-4 rounded-xl text-center">
                                    <span className="text-4xl font-black uppercase text-emerald-600">VERIFIED</span>
                                    <p className="text-[10px] font-black uppercase text-emerald-500 mt-1">System Authenticated</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-xl">
                                        <i className="fa fa-hospital-alt"></i>
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-black text-slate-800 uppercase tracking-tighter leading-none">UltraHub</h1>
                                        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-1">Authorized Exit Document</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Voucher No</p>
                                    <p className="text-sm font-mono font-black text-indigo-600">#{selectedPass.id}</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-1">{selectedPass.patientName}</h2>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{selectedPass.opNo}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                                    <div>
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 block mb-1.5">Original Unit</label>
                                        <p className="text-[11px] font-black text-slate-700 uppercase">{selectedPass.ward}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">Bed: {selectedPass.bed}</p>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 block mb-1.5">Discharge Point</label>
                                        <p className="text-[11px] font-black text-slate-700 uppercase">Main Gate Station 1</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{selectedPass.dischargeDate}</p>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 block mb-1.5">Administrative Clear</label>
                                        <p className="text-[11px] font-black text-emerald-600 uppercase">FULLY SETTLED</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">Auth: {selectedPass.releasedBy}</p>
                                    </div>
                                    {selectedPass.exitTime && (
                                        <div>
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 block mb-1.5">Security Log</label>
                                            <p className="text-[11px] font-black text-slate-800 uppercase">DEPARTED: {selectedPass.exitTime}</p>
                                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">Officer: {selectedPass.securityOfficer}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-12 border-t border-dashed border-gray-200 mt-12 flex justify-between items-end">
                                    <div className="flex flex-col gap-2">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300">
                                            <i className="fa fa-qrcode text-2xl"></i>
                                        </div>
                                        <p className="text-[7px] font-mono text-gray-300 uppercase tracking-tighter">SEC_HASH: {btoa(selectedPass.id).slice(0, 12)}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="w-32 h-0.5 bg-slate-900 mb-1"></div>
                                        <p className="text-[9px] font-black text-slate-900 uppercase">Authorized Signature</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-slate-300 h-full">
                            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-5xl shadow-sm border border-slate-200">
                                <i className="fa fa-shield-alt opacity-10"></i>
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mt-6">Select Passage from Registry</h3>
                        </div>
                    )}
                </div>

                {/* Right: Security Command Console */}
                <div className="w-80 bg-slate-900 flex flex-col h-full overflow-hidden border-l border-white/5">
                    {selectedPass ? (
                        <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
                            <div className="p-6 border-b border-white/10 bg-black/20 shrink-0">
                                <h6 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-4">Security Checklist</h6>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Financial Cleared', status: selectedPass.billingStatus === 'Cleared', icon: 'fa-dollar-sign' },
                                        { label: 'Nursing Sign-off', status: selectedPass.nursingStatus === 'Cleared', icon: 'fa-user-nurse' },
                                        { label: 'Pharmacy Check', status: selectedPass.pharmacyStatus === 'Cleared', icon: 'fa-pills' },
                                    ].map((check, i) => (
                                        <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5">
                                            <div className="flex items-center gap-2">
                                                <i className={`fa ${check.icon} text-[10px] ${check.status ? 'text-emerald-400' : 'text-rose-400'}`}></i>
                                                <span className="text-[10px] font-bold text-slate-300 uppercase">{check.label}</span>
                                            </div>
                                            <i className={`fa ${check.status ? 'fa-check-circle text-emerald-500' : 'fa-times-circle text-rose-500'} text-xs`}></i>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 p-6 space-y-6">
                                {!selectedPass.exitTime ? (
                                    <form onSubmit={handleProcessExit} className="space-y-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-1">Processing Officer</label>
                                                <input name="officer" required className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs font-black text-white outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Officer ID / Name..." />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1 block mb-1">Vehicle Registration</label>
                                                <input name="vehicle" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs font-black text-indigo-300 outline-none focus:ring-1 focus:ring-indigo-500 uppercase" placeholder="KDA 123X" />
                                            </div>
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={selectedPass.billingStatus !== 'Cleared' || isProcessingExit}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all transform active:scale-95 disabled:opacity-30 disabled:grayscale"
                                        >
                                            {isProcessingExit ? <i className="fa fa-spinner fa-spin"></i> : 'Authorize Exit & Stamp'}
                                        </button>
                                        
                                        {selectedPass.billingStatus !== 'Cleared' && (
                                            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-center">
                                                <p className="text-[9px] font-black text-rose-400 uppercase leading-relaxed">Blocked: Awaiting financial clearance from main office.</p>
                                            </div>
                                        )}
                                    </form>
                                ) : (
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2rem] text-center space-y-6 animate-in zoom-in-95">
                                        <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl mx-auto shadow-xl">
                                            <i className="fa fa-door-open"></i>
                                        </div>
                                        <div>
                                            <h5 className="text-sm font-black text-white uppercase tracking-tight leading-none">Departure Logged</h5>
                                            <p className="text-[10px] text-emerald-400 font-bold uppercase mt-2">Patient has exited facility</p>
                                        </div>
                                        <div className="pt-6 border-t border-white/5 space-y-1">
                                            <p className="text-[8px] font-black text-slate-500 uppercase">Officer Badge</p>
                                            <p className="text-xs font-black text-slate-300 uppercase">{selectedPass.securityOfficer}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-4 bg-black/40 border-t border-white/5 shrink-0">
                                <button onClick={() => setSelectedPassId(null)} className="w-full py-2 bg-white/10 text-white text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white/20 transition-all">Clear Selection</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full p-10 text-center text-slate-600 animate-in fade-in">
                            <div className="w-16 h-16 bg-white/5 rounded-none flex items-center justify-center mb-6 shadow-inner border border-white/5">
                                <i className="fa fa-user-shield text-2xl opacity-20"></i>
                            </div>
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Console Standby</h4>
                            <p className="text-[9px] font-medium mt-2 leading-relaxed max-w-[150px] uppercase opacity-40 italic">Registry selection required to interact with gate protocols</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GatePass;