
import React, { useState, useMemo } from 'react';
import * as Lucide from 'lucide-react';

// --- Types ---
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  class: string;
  unitCost: number;
  unitPrice: number;
  availableQty: number;
  totalQty: number;
  reorderLevel: number;
  uom: string;
  expiryDate: string;
  batchNo: string;
  active: boolean;
  location: string;
}

const MOCK_ITEMS: InventoryItem[] = [
  { id: 'ITM-001', name: 'Paracetamol 500mg', category: 'Pharmaceuticals', class: 'Analgesic', unitCost: 2.50, unitPrice: 10.00, availableQty: 1200, totalQty: 1200, reorderLevel: 500, uom: 'Tablet', expiryDate: '2025-12-31', batchNo: 'BATCH-X1', active: true, location: 'Main Pharmacy' },
  { id: 'ITM-002', name: 'Amoxicillin 250mg', category: 'Pharmaceuticals', class: 'Antibiotic', unitCost: 8.00, unitPrice: 25.00, availableQty: 450, totalQty: 450, reorderLevel: 200, uom: 'Capsule', expiryDate: '2024-06-30', batchNo: 'BATCH-A2', active: true, location: 'Main Pharmacy' },
  { id: 'ITM-003', name: 'Surgical Gloves (Pair)', category: 'Consumables', class: 'Surgical', unitCost: 15.00, unitPrice: 50.00, availableQty: 5000, totalQty: 5000, reorderLevel: 1000, uom: 'Pair', expiryDate: '2026-01-01', batchNo: 'GLV-001', active: true, location: 'Main Store' },
  { id: 'ITM-004', name: 'Cotton Wool 500g', category: 'Consumables', class: 'General', unitCost: 150.00, unitPrice: 350.00, availableQty: 20, totalQty: 20, reorderLevel: 50, uom: 'Roll', expiryDate: '2027-01-01', batchNo: 'CW-99', active: true, location: 'Main Store' },
  { id: 'ITM-005', name: 'Syringe 5ml', category: 'Consumables', class: 'Surgical', unitCost: 5.00, unitPrice: 15.00, availableQty: 0, totalQty: 0, reorderLevel: 100, uom: 'Pcs', expiryDate: '2028-01-01', batchNo: 'SYR-05', active: true, location: 'Main Store' },
];

const LOCATIONS = ['All Locations', 'Main Pharmacy', 'Main Store', 'Laboratory', 'Theatres', 'Emergency'];

const Inventory: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(MOCK_ITEMS);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'financial' | 'stock'>('basic');

  // Derived Data
  const filteredItems = useMemo(() => {
    return items.filter(i => {
      const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = selectedLocation === 'All Locations' || i.location === selectedLocation;
      return matchesSearch && matchesLocation;
    });
  }, [items, searchTerm, selectedLocation]);

  const stats = {
     totalValue: filteredItems.reduce((acc, i) => acc + (i.unitCost * i.totalQty), 0),
     lowStock: filteredItems.filter(i => i.availableQty <= i.reorderLevel).length,
     outOfStock: filteredItems.filter(i => i.availableQty === 0).length
  };

  const handleEdit = (item: InventoryItem) => {
     setSelectedItem(item);
     setIsDrawerOpen(true);
     setActiveTab('basic');
  };

  const handleAddNew = () => {
     setSelectedItem({
        id: 'NEW', name: '', category: 'Pharmaceuticals', class: 'General', unitCost: 0, unitPrice: 0, 
        availableQty: 0, totalQty: 0, reorderLevel: 0, uom: 'Pcs', expiryDate: '', batchNo: '', active: true, location: selectedLocation === 'All Locations' ? 'Main Store' : selectedLocation
     });
     setIsDrawerOpen(true);
     setActiveTab('basic');
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] p-6 font-sans text-slate-900">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-light tracking-tight text-slate-900">Inventory Control</h1>
          <p className="text-sm text-slate-500 mt-1 font-mono">Manage stock levels, locations, and valuation.</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="relative">
                <select 
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 pl-4 pr-10 py-2.5 rounded-lg text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer"
                >
                    {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
                <Lucide.ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button 
                onClick={handleAddNew}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-2"
            >
                <Lucide.Plus className="w-4 h-4" />
                <span>Add Item</span>
            </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Lucide.DollarSign className="w-4 h-4" /></div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Valuation</span>
            </div>
            <div className="text-2xl font-mono font-semibold text-slate-900">
                KES {stats.totalValue.toLocaleString()}
            </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Lucide.Package className="w-4 h-4" /></div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Items</span>
            </div>
            <div className="text-2xl font-mono font-semibold text-slate-900">
                {filteredItems.length}
            </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Lucide.AlertTriangle className="w-4 h-4" /></div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Low Stock</span>
            </div>
            <div className="text-2xl font-mono font-semibold text-orange-600">
                {stats.lowStock}
            </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Lucide.XCircle className="w-4 h-4" /></div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Out of Stock</span>
            </div>
            <div className="text-2xl font-mono font-semibold text-red-600">
                {stats.outOfStock}
            </div>
        </div>
      </div>

      {/* Main Data Grid */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-md w-full">
                <Lucide.Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                    type="text" 
                    placeholder="Search by name, SKU, or batch..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
            </div>
            <div className="flex items-center gap-2">
                <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                    <Lucide.Filter className="w-3.5 h-3.5" /> Filter
                </button>
                <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                    <Lucide.Download className="w-3.5 h-3.5" /> Export
                </button>
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Item Details</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Stock Level</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Unit Price</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item) => (
                        <tr 
                            key={item.id} 
                            onClick={() => handleEdit(item)}
                            className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                        >
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="font-medium text-slate-900">{item.name}</span>
                                    <span className="text-xs font-mono text-slate-400 mt-0.5">{item.id}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                                    {item.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {item.location}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex flex-col items-end">
                                    <span className={`font-mono font-medium ${item.availableQty <= item.reorderLevel ? 'text-orange-600' : 'text-slate-700'}`}>
                                        {item.availableQty} {item.uom}
                                    </span>
                                    {item.availableQty <= item.reorderLevel && (
                                        <span className="text-[10px] text-orange-500 font-medium">Reorder: {item.reorderLevel}</span>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right font-mono text-sm text-slate-700">
                                {item.unitPrice.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-center">
                                {item.active ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        Active
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                        Inactive
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-slate-400 hover:text-blue-600 transition-colors p-2">
                                    <Lucide.MoreHorizontal className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {filteredItems.length === 0 && (
                        <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                <Lucide.PackageOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="text-sm">No items found matching your criteria.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Slide-over Drawer */}
      {isDrawerOpen && selectedItem && (
            <>
                <div 
                    onClick={closeDrawer}
                    className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
                />
                <div 
                    className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
                >
                    {/* Drawer Header */}
                    <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">
                                {selectedItem.id === 'NEW' ? 'New Inventory Item' : selectedItem.name}
                            </h2>
                            <p className="text-sm text-slate-500 font-mono mt-1">{selectedItem.id === 'NEW' ? 'Create a new stock keeping unit' : selectedItem.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <button onClick={closeDrawer} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                                <Lucide.X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Drawer Tabs */}
                    <div className="flex border-b border-slate-100 px-6">
                        <button onClick={() => setActiveTab('basic')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'basic' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Basic Info</button>
                        <button onClick={() => setActiveTab('financial')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'financial' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Financials</button>
                        <button onClick={() => setActiveTab('stock')} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'stock' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Stock & Batches</button>
                    </div>

                    {/* Drawer Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeTab === 'basic' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Item Name</label>
                                        <input type="text" defaultValue={selectedItem.name} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                                        <select defaultValue={selectedItem.category} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                                            <option>Pharmaceuticals</option>
                                            <option>Consumables</option>
                                            <option>Laboratory</option>
                                            <option>General</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Item Class</label>
                                        <select defaultValue={selectedItem.class} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                                            <option>Analgesic</option>
                                            <option>Antibiotic</option>
                                            <option>Surgical</option>
                                            <option>General</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Unit of Measure</label>
                                        <select defaultValue={selectedItem.uom} className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                                            <option>Tablet</option>
                                            <option>Capsule</option>
                                            <option>Bottle</option>
                                            <option>Pair</option>
                                            <option>Roll</option>
                                            <option>Pcs</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">SKU / Barcode</label>
                                        <input type="text" defaultValue={selectedItem.id} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                                    </div>
                                    <div className="col-span-2 pt-4 border-t border-slate-100">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" defaultChecked={selectedItem.active} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                                            <span className="text-sm font-medium text-slate-700">Item is Active and available for transactions</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'financial' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Unit Cost (Buying)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">KES</span>
                                            <input type="number" defaultValue={selectedItem.unitCost} className="w-full pl-12 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Unit Price (Selling)</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">KES</span>
                                            <input type="number" defaultValue={selectedItem.unitPrice} className="w-full pl-12 pr-3 py-3 bg-white border border-blue-200 text-blue-600 rounded-lg text-sm font-mono font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                                    <h4 className="text-sm font-semibold text-slate-900">Accounting Integration</h4>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Inventory Asset Account</label>
                                        <select className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none">
                                            <option>1005 - Inventory Asset</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Cost of Goods Sold Account</label>
                                        <select className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none">
                                            <option>5001 - COGS Pharmaceuticals</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Income Account</label>
                                        <select className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none">
                                            <option>4001 - Drug Sales</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'stock' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                                        <span className="block text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Available</span>
                                        <span className="text-2xl font-mono font-bold text-emerald-700">{selectedItem.availableQty}</span>
                                    </div>
                                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                                        <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Physical</span>
                                        <span className="text-2xl font-mono font-bold text-slate-700">{selectedItem.totalQty}</span>
                                    </div>
                                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-center">
                                        <span className="block text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">Reorder Level</span>
                                        <span className="text-2xl font-mono font-bold text-orange-700">{selectedItem.reorderLevel}</span>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-sm font-semibold text-slate-900">Batch Management</h4>
                                        <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                            <Lucide.Plus className="w-3 h-3" /> Add Batch
                                        </button>
                                    </div>
                                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="px-4 py-3 font-medium text-slate-500">Batch No</th>
                                                    <th className="px-4 py-3 font-medium text-slate-500">Expiry</th>
                                                    <th className="px-4 py-3 font-medium text-slate-500 text-right">Qty</th>
                                                    <th className="px-4 py-3 font-medium text-slate-500 text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                <tr>
                                                    <td className="px-4 py-3 font-mono text-slate-700">{selectedItem.batchNo}</td>
                                                    <td className="px-4 py-3 text-slate-700">{selectedItem.expiryDate}</td>
                                                    <td className="px-4 py-3 text-right font-mono">{selectedItem.availableQty}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                                                            Active
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Drawer Footer */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                        <button className="text-slate-500 hover:text-slate-700 text-sm font-medium flex items-center gap-2">
                            <Lucide.History className="w-4 h-4" /> Audit Trail
                        </button>
                        <div className="flex gap-3">
                            <button onClick={closeDrawer} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                            <button className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-colors">Save Changes</button>
                        </div>
                    </div>
                </div>
            </>
        )}
    </div>
  );
};

export default Inventory;
