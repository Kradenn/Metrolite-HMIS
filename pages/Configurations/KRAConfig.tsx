
import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';

type KRATab = 'settings' | 'mapping' | 'logs' | 'ai';

const KRAConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState<KRATab>('settings');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);

  const stats = {
     transmitted: 1452,
     pending: 12,
     successRate: 99.2,
     lastSync: '24 Oct 2023, 11:45 AM'
  };

  const syncLogs = [
     { id: 'TRX-99812', date: '24 Oct, 11:45', patient: 'JANE DOE', amount: 2500.00, status: 'Success', code: 'C6629' },
     { id: 'TRX-99813', date: '24 Oct, 11:50', patient: 'JOHN SMITH', amount: 1200.00, status: 'Success', code: 'C6630' },
     { id: 'TRX-99814', date: '24 Oct, 12:15', patient: 'BABY RYAN', amount: 800.00, status: 'Pending', code: '-' },
  ];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
        setIsSyncing(false);
        alert('eTIMS Data Synchronization Complete.');
    }, 2000);
  };

  const handleAiAudit = async () => {
    setIsAiLoading(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Analyze current medical billing tax compliance for eTIMS (Kenya). 
        Context: 
        - Service A: Clinical Consultation (Tax Type: Exempt)
        - Service B: Pharmacy Sales (Tax Type: 16%)
        - Service C: Lab Tests (Tax Type: Exempt)
        Provide a quick summary of potential compliance risks based on recent Finance Acts.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { systemInstruction: "You are a specialized KRA Tax Consultant for Healthcare. Be professional, concise, and highlight risks." }
        });
        setAiAnalysis(response.text || 'Audit failed.');
    } catch (err) {
        setAiAnalysis('AI Service Unavailable.');
    } finally {
        setIsAiLoading(false);
    }
  };

  return (
    <div className="animate-bottom space-y-6 pb-20">
      {/* 1. COMPLIANCE HEADER */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-xl border border-red-500">
            <i className="fa fa-university"></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">KRA eTIMS Integration</h2>
            <p className="text-xs text-gray-500 font-medium tracking-wide">Tax Invoice Management System (v1.2.4)</p>
          </div>
        </div>
        
        <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button 
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Config
            </button>
            <button 
                onClick={() => setActiveTab('mapping')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'mapping' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Tax Map
            </button>
            <button 
                onClick={() => setActiveTab('logs')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'logs' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Sync Logs
            </button>
            <button 
                onClick={() => setActiveTab('ai')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ai' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
                AI Audit
            </button>
        </div>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Transmitted</h6>
            <h3 className="text-2xl font-black text-gray-800">{stats.transmitted}</h3>
            <p className="text-[10px] text-green-600 font-bold mt-1">Invoices Recorded</p>
         </div>
         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending Sync</h6>
            <h3 className="text-2xl font-black text-orange-500">{stats.pending}</h3>
            <p className="text-[10px] text-gray-500 font-bold mt-1">Awaiting Upload</p>
         </div>
         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">KRA API Status</h6>
            <div className="flex items-center space-x-2 mt-1">
               <h3 className="text-xl font-black text-green-600 uppercase">Operational</h3>
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-[10px] text-gray-400 font-bold mt-1">24ms Latency</p>
         </div>
         <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="bg-gray-800 text-white p-5 rounded-xl shadow-lg flex flex-col justify-center items-start cursor-pointer hover:bg-black transition-all transform active:scale-95 disabled:opacity-50"
         >
            <div className="flex items-center space-x-3">
               <i className={`fa ${isSyncing ? 'fa-sync fa-spin' : 'fa-cloud-upload-alt'} text-xl text-red-500`}></i>
               <div>
                  <h3 className="text-lg font-black uppercase tracking-tight">Sync Now</h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Manual Data Push</p>
               </div>
            </div>
         </button>
      </div>

      {/* 3. TAB CONTENT */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {activeTab === 'settings' && (
           <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 
                 {/* Left Column: API & Business */}
                 <div className="space-y-8">
                    {/* API Credentials */}
                    <div className="space-y-6">
                        <h6 className="text-[11px] font-black text-red-600 uppercase tracking-widest border-b border-red-50 pb-2">eTIMS API Connector</h6>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Base API URL</label>
                                <input type="text" defaultValue="https://etims.kra.go.ke/api/v1/invoice" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-blue-600 outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">API Secret Key</label>
                                <div className="relative">
                                    <input 
                                        type={showApiKey ? 'text' : 'password'} 
                                        defaultValue="SK_LIVE_9921_ETIMS_X88291" 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-700 outline-none focus:ring-1 focus:ring-red-500" 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <i className={`fa ${showApiKey ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Business Details */}
                    <div className="space-y-6">
                        <h6 className="text-[11px] font-black text-red-600 uppercase tracking-widest border-b border-red-50 pb-2">Taxpayer Business Details</h6>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Entity Registered Name</label>
                                <input type="text" defaultValue="ULTRAHUB HEALTHCARE SERVICES LTD" className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-bold uppercase" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Taxpayer PIN</label>
                                <input type="text" defaultValue="P000213942Z" className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono font-bold" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Sector / Industry</label>
                                <select className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-bold">
                                    <option>Health & Medical Services</option>
                                    <option>Pharmaceutical Services</option>
                                    <option>General Trade</option>
                                </select>
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Right Column: Identification & Prefixes */}
                 <div className="space-y-8">
                    {/* Device Identifiers */}
                    <div className="space-y-6">
                        <h6 className="text-[11px] font-black text-red-600 uppercase tracking-widest border-b border-red-50 pb-2">Control Unit Identification</h6>
                        <div className="space-y-4">
                           <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">OSCU ID (Electronic Signature Device)</label>
                              <input type="text" defaultValue="VSC-10293-8822" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-700 outline-none" />
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Device Serial</label>
                                 <input type="text" defaultValue="KRA-00192-X" className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none" />
                              </div>
                              <div>
                                 <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Branch Code</label>
                                 <input type="text" defaultValue="001" className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none" />
                              </div>
                           </div>
                        </div>
                    </div>

                    {/* Document Prefixes */}
                    <div className="space-y-6">
                        <h6 className="text-[11px] font-black text-red-600 uppercase tracking-widest border-b border-red-50 pb-2">Document Sequence Prefixes</h6>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Invoice</label>
                                <input type="text" defaultValue="INV-" className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-black text-blue-600 outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Credit Note</label>
                                <input type="text" defaultValue="CN-" className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-black text-red-600 outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Debit Note</label>
                                <input type="text" defaultValue="DN-" className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-xs font-black text-orange-600 outline-none" />
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2">
                             <p className="text-[9px] text-gray-400 leading-relaxed font-bold">
                                <i className="fa fa-info-circle mr-1 text-red-400"></i>
                                These prefixes are used to uniquely identify documents transmitted to KRA. Changing these after deployment may cause synchronization errors.
                             </p>
                        </div>
                    </div>
                 </div>
              </div>
              
              <div className="pt-8 border-t border-gray-100 flex justify-end gap-3">
                 <button className="px-6 py-2.5 border border-gray-300 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50">Reset Connection</button>
                 <button className="bg-red-600 text-white px-10 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-100 hover:bg-red-700">Save KRA Settings</button>
              </div>
           </div>
        )}

        {activeTab === 'mapping' && (
           <div className="p-8 animate-in fade-in duration-300">
              <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6">Tax Code Configuration</h5>
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                 <table className="w-full text-left text-[11px]">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-black uppercase tracking-widest">
                       <tr>
                          <th className="px-6 py-4">HMIS Internal Tax</th>
                          <th className="px-6 py-4">Rate (%)</th>
                          <th className="px-6 py-4">KRA eTIMS Category</th>
                          <th className="px-6 py-4">Mapped Code</th>
                          <th className="px-6 py-4 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                       {[
                          { internal: 'Standard VAT', rate: 16, category: 'General Rated', code: 'A' },
                          { internal: 'Zero Rated Goods', rate: 0, category: 'Zero Rated', code: 'B' },
                          { internal: 'Exempt Services', rate: 0, category: 'Exempt', code: 'C' },
                          { internal: 'Exports', rate: 0, category: 'Export', code: 'D' },
                       ].map((map, i) => (
                          <tr key={i} className="hover:bg-red-50/20 transition-colors">
                             <td className="px-6 py-4 font-bold text-gray-800 uppercase">{map.internal}</td>
                             <td className="px-6 py-4 font-black text-red-600">{map.rate}%</td>
                             <td className="px-6 py-4">{map.category}</td>
                             <td className="px-6 py-4 font-mono font-black text-lg">{map.code}</td>
                             <td className="px-6 py-4 text-right">
                                <button className="text-gray-400 hover:text-blue-600"><i className="fa fa-edit"></i></button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {activeTab === 'logs' && (
           <div className="p-8 animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-6">
                 <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest">Transmission History</h5>
                 <button className="bg-white border border-gray-300 text-gray-600 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-gray-50 shadow-sm">
                    Download Full Log
                 </button>
              </div>
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                 <table className="w-full text-left text-[11px]">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-black uppercase tracking-widest">
                       <tr>
                          <th className="px-6 py-4">Transaction ID</th>
                          <th className="px-6 py-4">Sync Date</th>
                          <th className="px-6 py-4">Patient</th>
                          <th className="px-6 py-4 text-right">Amount</th>
                          <th className="px-6 py-4 text-center">Status</th>
                          <th className="px-6 py-4">eTIMS Code</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                       {syncLogs.map((log, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                             <td className="px-6 py-4 font-mono font-bold text-blue-600">{log.id}</td>
                             <td className="px-6 py-4 text-gray-400">{log.date}</td>
                             <td className="px-6 py-4 font-black uppercase text-gray-800">{log.patient}</td>
                             <td className="px-6 py-4 text-right font-black">KES {log.amount.toLocaleString()}</td>
                             <td className="px-6 py-4 text-center">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                   log.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                }`}>{log.status}</span>
                             </td>
                             <td className="px-6 py-4 font-mono text-xs text-gray-500">{log.code}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {activeTab === 'ai' && (
           <div className="p-8 animate-in zoom-in-95 duration-300">
              <div className="max-w-3xl mx-auto space-y-8">
                 <div className="bg-[#1e293b] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-slate-700">
                    <div className="relative z-10">
                       <h4 className="text-xl font-black uppercase tracking-tight text-red-500 flex items-center">
                          <i className="fa fa-robot mr-3"></i> AI Tax Compliance Auditor
                       </h4>
                       <p className="text-xs text-slate-400 font-medium mt-2 leading-relaxed">
                          Gemini analyzes your current service-tax mappings against the latest KRA Finance Act provisions to ensure you aren't under-reporting or missing exemptions.
                       </p>
                       <div className="mt-8">
                          <button 
                             onClick={handleAiAudit}
                             disabled={isAiLoading}
                             className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl transition transform active:scale-95 disabled:opacity-50"
                          >
                             {isAiLoading ? <><i className="fa fa-spinner fa-spin mr-2"></i> Analyzing Compliance...</> : 'Perform Tax Audit'}
                          </button>
                       </div>
                    </div>
                    <i className="fa fa-gavel absolute -right-6 -bottom-6 text-9xl text-white/5 rotate-12"></i>
                 </div>

                 {aiAnalysis && (
                    <div className="bg-white border border-red-100 rounded-3xl p-8 shadow-xl animate-in slide-in-from-top-4 duration-500 relative">
                       <div className="absolute top-4 right-6 text-[9px] font-black text-red-600 bg-red-50 px-2 py-1 rounded uppercase">Audit Complete</div>
                       <div className="prose prose-sm max-w-none text-gray-700 font-medium leading-relaxed whitespace-pre-line text-xs">
                          {aiAnalysis}
                       </div>
                       <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                          <p className="text-[10px] text-gray-400 italic">This analysis is for guidance only. Consult your tax advisor.</p>
                          <button className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline">Apply Suggestions</button>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        )}
      </div>

      {/* FOOTER NOTICE */}
      <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex items-start space-x-4">
         <i className="fa fa-shield-alt text-orange-400 text-xl mt-1"></i>
         <div className="text-[11px] text-orange-900 font-medium leading-relaxed">
            <p className="font-black uppercase tracking-widest mb-1">eTIMS Compliance Notice</p>
            As per KRA regulations, every business entity is required to onboard on eTIMS. Failure to transmit invoices in real-time may lead to penalties. Ensure your Virtual PIN, OSCU ID, and Document Prefixes are accurate before enabling Auto-Transmit.
         </div>
      </div>
    </div>
  );
};

export default KRAConfig;
