
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';

type IntegrationTab = 'ipay' | 'mpesa' | 'smart';

const PaymentGateways: React.FC = () => {
  const [activeTab, setActiveTab] = useState<IntegrationTab>('ipay');
  
  // Environment states
  const [ipayEnv, setIpayEnv] = useState<'Live' | 'Sandbox'>('Live');
  const [mpesaEnv, setMpesaEnv] = useState<'Production' | 'Sandbox'>('Production');

  // Smart Lookup Sim State
  const [isSearching, setIsSearching] = useState(false);
  const [lookupResult, setLookupResult] = useState<any>(null);

  const handleSmartLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setLookupResult(null);
    // Simulate real-time lookup with Smart Africa
    setTimeout(() => {
        setIsSearching(false);
        setLookupResult({
            memberName: "JANE DOE",
            membershipNo: "254711000999",
            status: "ACTIVE",
            availableLimit: "50,000.00",
            lastVerified: new Date().toLocaleTimeString()
        });
    }, 1500);
  };

  return (
    <div className="animate-bottom space-y-6 pb-20">
      {/* 1. HUB HEADER */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-xl border border-indigo-400">
            <i className={`fa ${activeTab === 'ipay' ? 'fa-globe' : activeTab === 'mpesa' ? 'fa-mobile-alt' : 'fa-share-alt-square'}`}></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Payment & Service Gateways</h2>
            <p className="text-xs text-gray-500 font-medium tracking-wide">Manage financial integrations and biometric switches</p>
          </div>
        </div>
        
        {/* Tab Navigator */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button 
                onClick={() => setActiveTab('ipay')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ipay' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
                iPay Africa
            </button>
            <button 
                onClick={() => setActiveTab('mpesa')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'mpesa' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
                M-Pesa Daraja
            </button>
            <button 
                onClick={() => setActiveTab('smart')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'smart' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Smart Africa
            </button>
        </div>
      </div>

      {/* 2. TAB CONTENT: IPAY AFRICA */}
      {activeTab === 'ipay' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
             <div>
                <h4 className="text-sm font-black text-gray-800 uppercase tracking-widest">iPay Africa Gateway</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Direct Visa, Mastercard & Mobile Money</p>
             </div>
             <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
                 <button onClick={() => setIpayEnv('Live')} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase transition-all ${ipayEnv === 'Live' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Live</button>
                 <button onClick={() => setIpayEnv('Sandbox')} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase transition-all ${ipayEnv === 'Sandbox' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>Sandbox</button>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                   <h5 className="text-[10px] font-black text-gray-700 uppercase tracking-widest">API Credentials ({ipayEnv})</h5>
                   <i className="fa fa-key text-gray-300"></i>
                </div>
                <div className="p-8 space-y-6 flex-1">
                   <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Vendor ID</label>
                      <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-500" placeholder="e.g. metrolite" />
                   </div>
                   <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Hash Key (Secret)</label>
                      <div className="relative">
                         <input type="password" value="••••••••••••••••" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 outline-none" readOnly />
                         <i className="fa fa-eye absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"></i>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div>
                         <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Callback URL</label>
                         <input type="text" className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-[10px] text-gray-400 font-mono" defaultValue="https://hmis.com/ipay/callback" readOnly />
                      </div>
                      <div>
                         <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Default Currency</label>
                         <select className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none">
                            <option>KES</option>
                            <option>USD</option>
                         </select>
                      </div>
                   </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                   <button className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition transform active:scale-95">Save iPay Config</button>
                </div>
             </div>

             <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                   <h5 className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Enabled Channels</h5>
                   <i className="fa fa-sliders-h text-gray-300"></i>
                </div>
                <div className="p-6">
                   <div className="grid grid-cols-1 gap-3">
                      {[
                         { id: 'mpesa', label: 'M-Pesa (Direct)', icon: 'fa-mobile-alt', color: 'text-green-600' },
                         { id: 'airtel', label: 'Airtel Money', icon: 'fa-mobile-alt', color: 'text-red-500' },
                         { id: 'equity', label: 'Equity EazzyPay', icon: 'fa-university', color: 'text-purple-600' },
                         { id: 'card', label: 'Visa / Mastercard', icon: 'fa-credit-card', color: 'text-blue-600' },
                         { id: 'pesalink', label: 'PesaLink', icon: 'fa-exchange-alt', color: 'text-blue-400' },
                      ].map(ch => (
                         <label key={ch.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center space-x-4">
                               <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ${ch.color} text-lg shadow-inner`}>
                                  <i className={`fa ${ch.icon}`}></i>
                               </div>
                               <span className="text-xs font-black text-gray-700 uppercase group-hover:text-gray-900 transition-colors">{ch.label}</span>
                            </div>
                            <div className="relative inline-flex items-center cursor-pointer">
                               <input type="checkbox" className="sr-only peer" defaultChecked />
                               <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                            </div>
                         </label>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT: M-PESA DARAJA */}
      {activeTab === 'mpesa' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white text-xl shadow-sm">
                    <i className="fa fa-mobile-alt"></i>
                 </div>
                 <div>
                    <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest">Mpesa C2B / Express</h5>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Daraja API Integration</p>
                 </div>
              </div>
              
              <div className="flex items-center bg-gray-200 p-1 rounded-lg border border-gray-300">
                 <button onClick={() => setMpesaEnv('Production')} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase transition-all ${mpesaEnv === 'Production' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}>Production</button>
                 <button onClick={() => setMpesaEnv('Sandbox')} className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase transition-all ${mpesaEnv === 'Sandbox' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-700'}`}>Sandbox</button>
              </div>
            </div>

            <div className="p-8 space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                     <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">App Credentials</h6>
                     
                     <div className="space-y-4">
                        <div>
                           <label className="block text-[10px] font-black text-gray-500 uppercase mb-1 tracking-widest">Consumer Key</label>
                           <input type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-gray-700 outline-none focus:ring-1 focus:ring-green-500" placeholder="Enter key..." />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Consumer Secret</label>
                           <div className="relative">
                              <input type="password" value="••••••••••••••••" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-700 outline-none" readOnly />
                              <i className="fa fa-eye absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"></i>
                           </div>
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Pass Key (Lipa Na Mpesa Online)</label>
                           <div className="relative">
                              <input type="password" value="••••••••••••••••" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-700 outline-none" readOnly />
                              <i className="fa fa-eye absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"></i>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Business Details</h6>

                     <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1 tracking-widest">Paybill / Shortcode</label>
                              <input type="text" className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-blue-600 outline-none focus:ring-1 focus:ring-green-500" placeholder="e.g. 174379" />
                           </div>
                           <div>
                              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1 tracking-widest">Initiator Name</label>
                              <input type="text" className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-1 focus:ring-green-500" placeholder="API User" />
                           </div>
                        </div>
                        <div>
                           <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Initiator Password</label>
                           <input type="password" value="••••••••" className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 outline-none focus:ring-1 focus:ring-green-500" />
                        </div>

                        <div className="pt-6 flex items-center justify-between">
                           <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full bg-red-500 border-2 border-white ring-1 ring-gray-100`}></div>
                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Status: Not Connected</span>
                           </div>
                           <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">Test Connectivity</button>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="pt-8 border-t border-gray-100 flex justify-end">
                  <button className="bg-green-600 text-white px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-100 hover:bg-green-700 transition transform active:scale-95">
                     Save Configuration
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: SMART AFRICA */}
      {activeTab === 'smart' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 bg-indigo-800 rounded-lg flex items-center justify-center text-white text-xl shadow-sm">
                   <i className="fa fa-share-alt-square"></i>
                 </div>
                 <div>
                    <h2 className="text-sm font-black text-gray-800 uppercase tracking-widest">Smart Africa Interface</h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Biometric & Claim Switch Integration</p>
                 </div>
              </div>
            </div>
            <div className="p-8 text-center text-gray-400 py-20">
               <i className="fa fa-fingerprint text-5xl mb-4 opacity-10"></i>
               <p className="text-sm font-bold uppercase tracking-widest">Smart Africa Integration Active</p>
               <p className="text-xs mt-2">Manage biometric authentication and claim submission flows.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentGateways;
