
import React, { useState, useEffect, useMemo } from 'react';

// --- Interfaces ---
interface Asset {
  id: number;
  code: string;
  name: string;
  assetClass: string;
  location: string;
  purchaseDate: string;
  initialValue: number;
  currentValue: number;
  salvageValue: number;
  usefulLife: number; // years
  status: 'Active' | 'Maintenance' | 'Disposed' | 'Fully Depreciated';
  depreciationMethod: 'Straight-Line' | 'Declining Balance';
}

// --- Mock Data ---
const MOCK_ASSETS: Asset[] = [
  { id: 1, code: 'AST-001', name: 'Mindray DC-40 Ultrasound', assetClass: 'Medical Equipment', location: 'Radiology', purchaseDate: '2022-01-15', initialValue: 1200000, currentValue: 800000, salvageValue: 100000, usefulLife: 5, status: 'Active', depreciationMethod: 'Straight-Line' },
  { id: 2, code: 'AST-002', name: 'Dell Latitude 7420', assetClass: 'IT Equipment', location: 'Admin Block', purchaseDate: '2023-03-10', initialValue: 180000, currentValue: 150000, salvageValue: 0, usefulLife: 3, status: 'Active', depreciationMethod: 'Straight-Line' },
  { id: 3, code: 'AST-003', name: 'Toyota Hilux Ambulance', assetClass: 'Vehicles', location: 'Transport', purchaseDate: '2020-06-20', initialValue: 4500000, currentValue: 2100000, salvageValue: 500000, usefulLife: 7, status: 'Active', depreciationMethod: 'Declining Balance' },
  { id: 4, code: 'AST-004', name: 'Office Desk - Executive', assetClass: 'Furniture', location: 'CEO Office', purchaseDate: '2019-01-01', initialValue: 45000, currentValue: 5000, salvageValue: 2000, usefulLife: 5, status: 'Fully Depreciated', depreciationMethod: 'Straight-Line' },
  { id: 5, code: 'AST-005', name: 'Microscope Olympus CX23', assetClass: 'Medical Equipment', location: 'Laboratory', purchaseDate: '2021-11-05', initialValue: 350000, currentValue: 280000, salvageValue: 30000, usefulLife: 8, status: 'Maintenance', depreciationMethod: 'Straight-Line' },
];

const FixedAssetManagement: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [activeTab, setActiveTab] = useState<'Active' | 'Disposed' | 'All'>('Active');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Stats
  const totalValue = assets.reduce((sum, a) => a.status !== 'Disposed' ? sum + a.currentValue : sum, 0);
  const totalInitial = assets.reduce((sum, a) => a.status !== 'Disposed' ? sum + a.initialValue : sum, 0);
  const assetCount = assets.filter(a => a.status !== 'Disposed').length;
  const maintenanceCount = assets.filter(a => a.status === 'Maintenance').length;

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            asset.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            asset.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (activeTab === 'All') return matchesSearch;
      if (activeTab === 'Disposed') return asset.status === 'Disposed' && matchesSearch;
      // Active tab includes Active, Maintenance, Fully Depreciated
      return asset.status !== 'Disposed' && matchesSearch;
    });
  }, [assets, activeTab, searchTerm]);

  // Form State
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    assetClass: 'Medical Equipment',
    depreciationMethod: 'Straight-Line',
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const asset: Asset = {
      id: Date.now(),
      code: `AST-${Math.floor(Math.random() * 10000)}`,
      name: newAsset.name || 'New Asset',
      assetClass: newAsset.assetClass || 'General',
      location: newAsset.location || 'Store',
      purchaseDate: newAsset.purchaseDate || '',
      initialValue: Number(newAsset.initialValue) || 0,
      currentValue: Number(newAsset.initialValue) || 0,
      salvageValue: Number(newAsset.salvageValue) || 0,
      usefulLife: Number(newAsset.usefulLife) || 1,
      status: 'Active',
      depreciationMethod: newAsset.depreciationMethod as any,
    };
    setAssets([asset, ...assets]);
    setShowAddModal(false);
    setNewAsset({ assetClass: 'Medical Equipment', depreciationMethod: 'Straight-Line', purchaseDate: new Date().toISOString().split('T')[0] });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-700 border-green-200';
      case 'Maintenance': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Fully Depreciated': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Disposed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="animate-bottom space-y-6">
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Fixed Asset Register</h2>
           <p className="text-sm text-gray-500">Track acquisition, depreciation, and disposal of hospital assets.</p>
        </div>
        <div className="flex space-x-2">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-xs font-bold uppercase shadow-sm hover:bg-gray-50 transition">
               <i className="fa fa-calculator mr-2"></i> Run Depreciation
            </button>
            <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase shadow hover:bg-blue-700 transition">
               <i className="fa fa-plus mr-2"></i> Register Asset
            </button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Portfolio Value</p>
               <h3 className="text-xl font-black text-gray-800 mt-1">KES {(totalValue / 1000000).toFixed(2)}M</h3>
               <p className="text-[10px] text-green-600 font-bold mt-1">Book Value</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xl"><i className="fa fa-coins"></i></div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Assets</p>
               <h3 className="text-xl font-black text-gray-800 mt-1">{assetCount}</h3>
               <p className="text-[10px] text-blue-600 font-bold mt-1">Active Items</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl"><i className="fa fa-cubes"></i></div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Depreciation</p>
               <h3 className="text-xl font-black text-gray-800 mt-1">{(100 - (totalValue/totalInitial)*100).toFixed(1)}%</h3>
               <p className="text-[10px] text-red-500 font-bold mt-1">Value Lost</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-xl"><i className="fa fa-chart-line"></i></div>
         </div>
         <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Maintenance</p>
               <h3 className="text-xl font-black text-gray-800 mt-1">{maintenanceCount}</h3>
               <p className="text-[10px] text-orange-500 font-bold mt-1">Requiring Service</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center text-xl"><i className="fa fa-tools"></i></div>
         </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
         {/* Toolbar */}
         <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
            <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg">
               {['Active', 'Disposed', 'All'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                     {tab}
                  </button>
               ))}
            </div>
            <div className="relative w-full md:w-64">
               <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
               <input 
                  type="text" 
                  placeholder="Search assets..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500 bg-white"
               />
            </div>
         </div>

         {/* Table */}
         <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
               <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-tight">
                  <tr>
                     <th className="px-6 py-3">Asset Details</th>
                     <th className="px-6 py-3">Location</th>
                     <th className="px-6 py-3">Purchase Date</th>
                     <th className="px-6 py-3 text-right">Initial Cost</th>
                     <th className="px-6 py-3 text-right">Current Value</th>
                     <th className="px-6 py-3">Book Value</th>
                     <th className="px-6 py-3 text-center">Status</th>
                     <th className="px-6 py-3 text-center">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredAssets.map(asset => {
                     const valuePercent = Math.max(0, Math.min(100, (asset.currentValue / asset.initialValue) * 100));
                     const barColor = valuePercent > 50 ? 'bg-green-500' : valuePercent > 20 ? 'bg-orange-500' : 'bg-red-500';

                     return (
                        <tr key={asset.id} className="hover:bg-blue-50/50 transition-colors group">
                           <td className="px-6 py-3">
                              <p className="font-bold text-gray-800 text-xs">{asset.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                 <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 rounded border border-gray-200 font-mono">{asset.code}</span>
                                 <span className="text-[9px] text-blue-600 font-medium">{asset.assetClass}</span>
                              </div>
                           </td>
                           <td className="px-6 py-3 text-gray-600 font-medium">{asset.location}</td>
                           <td className="px-6 py-3">{asset.purchaseDate}</td>
                           <td className="px-6 py-3 text-right font-medium">{asset.initialValue.toLocaleString()}</td>
                           <td className="px-6 py-3 text-right font-bold text-gray-800">{asset.currentValue.toLocaleString()}</td>
                           <td className="px-6 py-3 w-32">
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                                 <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${valuePercent}%` }}></div>
                              </div>
                              <p className="text-[9px] text-gray-400 text-right">{valuePercent.toFixed(0)}% Left</p>
                           </td>
                           <td className="px-6 py-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${getStatusColor(asset.status)}`}>
                                 {asset.status}
                              </span>
                           </td>
                           <td className="px-6 py-3 text-center">
                              <button className="text-gray-400 hover:text-blue-600 transition p-1"><i className="fa fa-edit"></i></button>
                              <button className="text-gray-400 hover:text-red-600 transition p-1 ml-2"><i className="fa fa-trash-alt"></i></button>
                           </td>
                        </tr>
                     );
                  })}
                  {filteredAssets.length === 0 && (
                     <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400 italic">No assets found matching criteria</td></tr>
                  )}
               </tbody>
            </table>
         </div>
         <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
            <span>Showing {filteredAssets.length} records</span>
            <div className="flex space-x-1">
               <button className="px-3 py-1 border border-green-600 rounded bg-green-50 text-green-700 text-xs font-bold hover:bg-green-100 disabled:opacity-50">Prev</button>
               <button className="px-3 py-1 border border-green-600 rounded bg-green-50 text-green-700 text-xs font-bold hover:bg-green-100 disabled:opacity-50">Next</button>
            </div>
         </div>
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                 <h5 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Register New Asset</h5>
                 <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa fa-times text-lg"></i></button>
              </div>
              <div className="p-6">
                 <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                       <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 border-b border-blue-50 pb-1">Asset Information</h6>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Asset Name</label>
                             <input type="text" className="w-full p-2 border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500" required 
                                value={newAsset.name || ''} onChange={e => setNewAsset({...newAsset, name: e.target.value})}
                             />
                          </div>
                          <div>
                             <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Asset Class</label>
                             <select className="w-full p-2 border border-gray-300 rounded text-xs outline-none bg-white"
                                value={newAsset.assetClass} onChange={e => setNewAsset({...newAsset, assetClass: e.target.value})}
                             >
                                <option>Medical Equipment</option>
                                <option>Furniture</option>
                                <option>Vehicles</option>
                                <option>IT Equipment</option>
                                <option>Land & Buildings</option>
                             </select>
                          </div>
                          <div>
                             <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Physical Location</label>
                             <input type="text" className="w-full p-2 border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500" placeholder="e.g. Radiology Room 1"
                                value={newAsset.location || ''} onChange={e => setNewAsset({...newAsset, location: e.target.value})}
                             />
                          </div>
                          <div>
                             <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Purchase Date</label>
                             <input type="date" className="w-full p-2 border border-gray-300 rounded text-xs outline-none" 
                                value={newAsset.purchaseDate} onChange={e => setNewAsset({...newAsset, purchaseDate: e.target.value})}
                             />
                          </div>
                       </div>
                    </div>

                    <div>
                       <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 border-b border-blue-50 pb-1">Financial & Depreciation</h6>
                       <div className="grid grid-cols-3 gap-4">
                          <div>
                             <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Initial Cost</label>
                             <input type="number" className="w-full p-2 border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500" required 
                                value={newAsset.initialValue || ''} onChange={e => setNewAsset({...newAsset, initialValue: Number(e.target.value)})}
                             />
                          </div>
                          <div>
                             <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Salvage Value</label>
                             <input type="number" className="w-full p-2 border border-gray-300 rounded text-xs outline-none" 
                                value={newAsset.salvageValue || ''} onChange={e => setNewAsset({...newAsset, salvageValue: Number(e.target.value)})}
                             />
                          </div>
                          <div>
                             <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Useful Life (Years)</label>
                             <input type="number" className="w-full p-2 border border-gray-300 rounded text-xs outline-none" required 
                                value={newAsset.usefulLife || ''} onChange={e => setNewAsset({...newAsset, usefulLife: Number(e.target.value)})}
                             />
                          </div>
                          <div className="col-span-3">
                             <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Depreciation Method</label>
                             <select className="w-full p-2 border border-gray-300 rounded text-xs outline-none bg-white"
                                value={newAsset.depreciationMethod} onChange={e => setNewAsset({...newAsset, depreciationMethod: e.target.value as any})}
                             >
                                <option value="Straight-Line">Straight-Line Method</option>
                                <option value="Declining Balance">Declining Balance Method</option>
                                <option value="Sum-of-Years-Digits">Sum-of-Years-Digits</option>
                             </select>
                          </div>
                       </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                       <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-300 rounded text-xs font-bold uppercase text-gray-600 hover:bg-gray-50 mr-2">Cancel</button>
                       <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded text-xs font-bold uppercase shadow hover:bg-blue-700 transition">Complete Registration</button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default FixedAssetManagement;
