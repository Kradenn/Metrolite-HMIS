
import React, { useState, useMemo } from 'react';

// --- Interfaces ---
interface DicomNode {
  id: number;
  aeTitle: string;
  hostName: string;
  ipAddress: string;
  port: number;
  type: 'PACS' | 'Modality' | 'Workstation';
  modalityCode?: string; // CR, CT, MR, US, DX etc.
  active: boolean;
  lastEcho?: string;
}

// --- MAIN COMPONENT ---
const DicomConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'nodes' | 'global'>('nodes');
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(1);
  const [isTesting, setIsTesting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // --- MOCK DATA ---
  const [nodes, setNodes] = useState<DicomNode[]>([
    { id: 1, aeTitle: 'ULTRAHUB_PACS', hostName: 'Central PACS Server', ipAddress: '192.168.10.200', port: 4242, type: 'PACS', active: true, lastEcho: '24 Oct 2023, 10:00 AM' },
    { id: 2, aeTitle: 'GE_VOLUSON_S8', hostName: 'ObsGyn Ultrasound', ipAddress: '192.168.10.205', port: 104, type: 'Modality', modalityCode: 'US', active: true, lastEcho: '24 Oct 2023, 08:30 AM' },
    { id: 3, aeTitle: 'SIEMENS_CT_1', hostName: 'Radiology CT Suite', ipAddress: '192.168.10.210', port: 104, type: 'Modality', modalityCode: 'CT', active: true, lastEcho: '23 Oct 2023, 11:45 PM' },
    { id: 4, aeTitle: 'VIEWER_RAD_01', hostName: 'Radiologist Station 1', ipAddress: '192.168.10.25', port: 11112, type: 'Workstation', active: false },
  ]);

  // --- DERIVED DATA ---
  const filteredNodes = useMemo(() => 
    nodes.filter(n => n.aeTitle.toLowerCase().includes(searchTerm.toLowerCase()) || n.hostName.toLowerCase().includes(searchTerm.toLowerCase())),
  [nodes, searchTerm]);

  const selectedNode = useMemo(() => nodes.find(n => n.id === selectedNodeId), [nodes, selectedNodeId]);

  // --- HANDLERS ---
  const handleVerify = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      alert(`DICOM C-ECHO to ${selectedNode?.aeTitle} successful.`);
    }, 1500);
  };

  return (
    <div className="animate-bottom space-y-6 pb-20">
      {/* 1. HUB HEADER */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-slate-900 text-teal-400 rounded-2xl flex items-center justify-center text-2xl shadow-xl border border-slate-700">
            <i className="fa fa-radiation"></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">DICOM & PACS Integration</h2>
            <p className="text-xs text-gray-500 font-medium tracking-wide">Image Networking, Modality Worklists & Storage Management</p>
          </div>
        </div>
        <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
            <button 
                onClick={() => setActiveTab('nodes')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'nodes' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Node Registry
            </button>
            <button 
                onClick={() => setActiveTab('global')}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'global' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
                Global Settings
            </button>
        </div>
      </div>

      {activeTab === 'nodes' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-280px)]">
          {/* LEFT: NODES LIST */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Imaging Entities</h5>
                <button className="bg-blue-600 text-white w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-700 transition shadow-lg"><i className="fa fa-plus text-[10px]"></i></button>
              </div>
              <div className="relative">
                <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                <input 
                  type="text" 
                  placeholder="Filter nodes..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/30">
              {filteredNodes.map(node => (
                <div 
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all group ${
                    selectedNodeId === node.id 
                    ? 'bg-white border-blue-600 shadow-md ring-1 ring-blue-100' 
                    : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-blue-600 font-mono">{node.aeTitle}</span>
                    <div className="flex items-center">
                      {node.active && <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></div>}
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase border ${node.type === 'PACS' ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                        {node.type}
                      </span>
                    </div>
                  </div>
                  <h6 className="text-xs font-black text-gray-800 uppercase tracking-tight truncate">{node.hostName}</h6>
                  <div className="mt-3 flex justify-between items-center text-[10px] text-gray-400 font-bold font-mono">
                    <span>{node.ipAddress}:{node.port}</span>
                    <span className="bg-gray-100 px-1.5 rounded text-[9px] font-black text-gray-500 uppercase">{node.modalityCode || 'AE'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: NODE WORKSPACE */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
            {selectedNode ? (
              <div className="flex flex-col h-full">
                <div className="p-6 bg-slate-900 text-white flex justify-between items-start shrink-0 relative overflow-hidden">
                   <div className="relative z-10">
                      <h4 className="text-xl font-black uppercase tracking-tight">{selectedNode.hostName}</h4>
                      <div className="flex items-center space-x-3 mt-2">
                         <span className="text-[10px] font-black text-teal-400 uppercase bg-teal-400/10 px-2 py-0.5 rounded border border-teal-400/20">{selectedNode.aeTitle}</span>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedNode.type} &bull; {selectedNode.modalityCode || 'Service'}</span>
                      </div>
                   </div>
                   <div className="relative z-10 text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Status</p>
                      <div className="flex items-center space-x-2">
                         <span className={`text-[10px] font-black uppercase ${selectedNode.active ? 'text-green-400' : 'text-red-400'}`}>{selectedNode.active ? 'Connected' : 'Offline'}</span>
                         <div className={`w-3 h-3 rounded-full ${selectedNode.active ? 'bg-green-500' : 'bg-red-500'} border-2 border-white/20`}></div>
                      </div>
                   </div>
                   <i className="fa fa-network-wired absolute -right-6 -bottom-6 text-9xl text-white/5 -rotate-12"></i>
                </div>

                <div className="p-8 flex-1 overflow-y-auto space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      {/* Network Params */}
                      <div className="space-y-6">
                         <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Network Configuration</h6>
                         <div className="space-y-4">
                            <div>
                               <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">AE Title</label>
                               <input type="text" defaultValue={selectedNode.aeTitle} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black text-indigo-600 outline-none focus:ring-1 focus:ring-indigo-500 font-mono uppercase" />
                            </div>
                            <div>
                               <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">IP Address / Hostname</label>
                               <input type="text" defaultValue={selectedNode.ipAddress} className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-800 outline-none focus:ring-1 focus:ring-indigo-500 font-mono" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                               <div>
                                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Port Number</label>
                                  <input type="number" defaultValue={selectedNode.port} className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-black text-gray-800 outline-none" />
                               </div>
                               <div>
                                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Modality Code</label>
                                  <input type="text" defaultValue={selectedNode.modalityCode || 'AE'} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black text-gray-500 outline-none uppercase" maxLength={4} />
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Capabilities & Security */}
                      <div className="space-y-6">
                         <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-2">Service Capabilities</h6>
                         <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                            {[
                               { id: 'scu', label: 'C-STORE SCU (Send Images)', checked: true },
                               { id: 'scp', label: 'C-STORE SCP (Receive Images)', checked: selectedNode.type === 'PACS' },
                               { id: 'mwl', label: 'Modality Worklist Support', checked: selectedNode.type !== 'Workstation' },
                               { id: 'qr', label: 'Query / Retrieve Support', checked: selectedNode.type !== 'Modality' },
                            ].map(cap => (
                               <label key={cap.id} className="flex items-center justify-between group cursor-pointer">
                                  <span className="text-[10px] font-bold text-gray-600 uppercase group-hover:text-indigo-600 transition-colors">{cap.label}</span>
                                  <input type="checkbox" defaultChecked={cap.checked} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500" />
                               </label>
                            ))}
                         </div>
                         <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                            <p className="text-[10px] text-indigo-800 leading-relaxed font-medium">
                               <i className="fa fa-shield-alt mr-2 text-indigo-400"></i>
                               Secure DICOM (TLS) is not enabled for this node. Peer AE Title verification is active.
                            </p>
                         </div>
                      </div>
                   </div>

                   {/* Diagnostics Workspace */}
                   <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-4">
                         <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Connectivity Diagnostics</h6>
                         {selectedNode.lastEcho && <span className="text-[9px] font-bold text-slate-400 uppercase italic">Last successful echo: {selectedNode.lastEcho}</span>}
                      </div>
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                         <div className="flex-1 text-[11px] font-medium text-slate-500 leading-tight">
                            Execute a <strong>DICOM C-ECHO</strong> to verify that this node is reachable on the network and responding with its configured AE Title.
                         </div>
                         <button 
                            onClick={handleVerify}
                            disabled={isTesting}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition transform active:scale-95 flex items-center ${isTesting ? 'bg-slate-300 text-slate-500' : 'bg-slate-800 text-white hover:bg-black'}`}
                         >
                            {isTesting ? <><i className="fa fa-spinner fa-spin mr-2"></i> Testing...</> : <><i className="fa fa-bolt mr-2 text-yellow-400"></i> Verify Connection</>}
                         </button>
                      </div>
                   </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                   <button className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:underline">Remove Node</button>
                   <div className="flex space-x-3">
                      <button className="bg-white border border-gray-300 text-gray-700 px-8 py-2 rounded-xl text-[10px] font-black uppercase shadow-sm">Duplicate</button>
                      <button className="bg-indigo-600 text-white px-10 py-2 rounded-xl text-[10px] font-black uppercase shadow-xl hover:bg-indigo-700">Apply Configuration</button>
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-300">
                <i className="fa fa-network-wired text-6xl mb-4 opacity-10"></i>
                <p className="text-sm font-bold uppercase tracking-widest">Select an Imaging Node</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* --- GLOBAL SETTINGS TAB --- */
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                 <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 mb-6 flex items-center">
                    <i className="fa fa-hdd mr-3 text-indigo-500"></i> Local Storage & Archive
                 </h5>
                 <div className="space-y-6">
                    <div>
                       <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">PACS Storage Path</label>
                       <div className="flex space-x-2">
                          <input type="text" readOnly className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-[10px] font-mono text-gray-500" defaultValue="/var/lib/pacs/storage/DICOM_DATA" />
                          <button className="bg-gray-100 text-gray-600 px-4 rounded-xl text-[10px] font-black uppercase">Change</button>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Retention Policy</label>
                          <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none">
                             <option>7 Years (Legal Standard)</option>
                             <option>10 Years (Pediatrics)</option>
                             <option>Infinite (Cloud Archive)</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Local Cache Limit</label>
                          <div className="relative">
                             <input type="number" defaultValue={500} className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-800 outline-none" />
                             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">GB</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                 <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 mb-6 flex items-center">
                    <i className="fa fa-sync mr-3 text-emerald-500"></i> Auto-Routing Rules
                 </h5>
                 <div className="space-y-6">
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between group">
                       <div>
                          <p className="text-xs font-black text-emerald-800 uppercase">Emergency Overflow</p>
                          <p className="text-[10px] text-emerald-600 font-medium">Forward all ER-CR to External_Radiologist_Station</p>
                       </div>
                       <i className="fa fa-trash text-emerald-200 group-hover:text-red-400 cursor-pointer transition-colors"></i>
                    </div>
                    <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-600 transition-all">+ Add New Routing Rule</button>
                 </div>
              </div>
           </div>
           
           <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-center shadow-2xl">
              <div className="relative z-10 space-y-2">
                 <h4 className="text-lg font-black uppercase tracking-tight text-teal-400">System Log Observer</h4>
                 <p className="text-xs text-slate-400 font-medium max-w-lg">Monitor raw DICOM traffic and association requests in real-time for debugging modality handshake issues.</p>
              </div>
              <button className="relative z-10 bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl transition transform active:scale-95 mt-4 md:mt-0">
                 Launch Monitor
              </button>
              <i className="fa fa-terminal absolute -left-6 -bottom-6 text-9xl text-white/5 rotate-12"></i>
           </div>
        </div>
      )}
    </div>
  );
};

export default DicomConfig;
