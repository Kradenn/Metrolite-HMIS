
import React, { useState, useMemo } from 'react';

interface KitchenItem {
    id: number;
    name: string;
    category: string;
    stock: number;
    unit: string;
    reorderLevel: number;
}

const KitchenInventory: React.FC = () => {
    // --- State ---
    const [items, setItems] = useState<KitchenItem[]>([
        { id: 1, name: 'Chicken Breast', category: 'Protein', stock: 25, unit: 'Kg', reorderLevel: 20 },
        { id: 2, name: 'Brown Rice', category: 'Grains', stock: 10, unit: 'Kg', reorderLevel: 15 },
        { id: 3, name: 'Broccoli', category: 'Vegetable', stock: 30, unit: 'Kg', reorderLevel: 10 },
        { id: 4, name: 'Olive Oil', category: 'Pantry', stock: 5, unit: 'Liters', reorderLevel: 5 },
    ]);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal States
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<KitchenItem | null>(null);

    // Form States
    const [newItem, setNewItem] = useState<Partial<KitchenItem>>({ category: 'Pantry', unit: 'Kg', stock: 0, reorderLevel: 10 });
    const [adjustment, setAdjustment] = useState({ type: 'add', qty: 0, reason: '' });

    // --- Computed Data ---
    const filteredItems = useMemo(() => {
        return items.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [items, searchQuery]);

    const getStatus = (item: KitchenItem) => {
        if (item.stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
        if (item.stock <= item.reorderLevel) return { label: 'Low', color: 'bg-yellow-100 text-yellow-800' };
        return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
    };

    // --- Handlers ---
    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItem.name) return;
        const item: KitchenItem = {
            id: Date.now(),
            name: newItem.name,
            category: newItem.category || 'Pantry',
            stock: Number(newItem.stock) || 0,
            unit: newItem.unit || 'Kg',
            reorderLevel: Number(newItem.reorderLevel) || 10
        };
        setItems([item, ...items]);
        setShowAddModal(false);
        setNewItem({ category: 'Pantry', unit: 'Kg', stock: 0, reorderLevel: 10 });
    };

    const openAdjustModal = (item: KitchenItem) => {
        setSelectedItem(item);
        setAdjustment({ type: 'add', qty: 0, reason: '' });
        setShowAdjustModal(true);
    };

    const handleAdjustStock = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;

        setItems(items.map(item => {
            if (item.id === selectedItem.id) {
                const change = adjustment.type === 'add' ? Number(adjustment.qty) : -Number(adjustment.qty);
                const newStock = Math.max(0, item.stock + change);
                return { ...item, stock: newStock };
            }
            return item;
        }));
        setShowAdjustModal(false);
    };

    return (
        <div className="animate-bottom space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Kitchen Inventory</h2>
                    <p className="text-xs text-gray-500 font-medium">Manage food stock levels and reorders.</p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => setShowAddModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase shadow hover:bg-blue-700 transition flex items-center">
                        <i className="fa fa-plus mr-2"></i> Add New Item
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                         <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                         <input 
                            type="text" 
                            placeholder="Search inventory items..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500" 
                         />
                    </div>
                </div>
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-gray-100 border-b border-gray-200 text-gray-600 uppercase font-bold">
                            <tr>
                                <th className="px-4 py-3">Item Name</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3 text-right">Stock on Hand</th>
                                <th className="px-4 py-3 text-right">Reorder Level</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredItems.map(item => {
                                const status = getStatus(item);
                                return (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-bold text-gray-800">{item.name}</td>
                                        <td className="px-4 py-3">
                                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-black uppercase">{item.category}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-black text-gray-800">{item.stock} <span className="text-gray-400 font-medium text-[10px]">{item.unit}</span></td>
                                        <td className="px-4 py-3 text-right text-gray-500">{item.reorderLevel} <span className="text-[10px]">{item.unit}</span></td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button 
                                                onClick={() => openAdjustModal(item)}
                                                className="text-blue-600 hover:text-blue-800 font-bold text-[10px] uppercase border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 transition"
                                            >
                                                Adjust
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredItems.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400 italic">No inventory items found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Item Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h5 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Add New Item</h5>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa fa-times"></i></button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleAddItem} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Item Name</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500" required 
                                        value={newItem.name || ''} onChange={e => setNewItem({...newItem, name: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Category</label>
                                        <select className="w-full p-2 border border-gray-300 rounded text-xs outline-none bg-white"
                                            value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}
                                        >
                                            <option>Pantry</option>
                                            <option>Vegetable</option>
                                            <option>Fruit</option>
                                            <option>Protein</option>
                                            <option>Dairy</option>
                                            <option>Grains</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Unit</label>
                                        <select className="w-full p-2 border border-gray-300 rounded text-xs outline-none bg-white"
                                            value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})}
                                        >
                                            <option>Kg</option>
                                            <option>Grams</option>
                                            <option>Liters</option>
                                            <option>Pieces</option>
                                            <option>Box</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Initial Stock</label>
                                        <input type="number" min="0" className="w-full p-2 border border-gray-300 rounded text-xs outline-none" 
                                            value={newItem.stock} onChange={e => setNewItem({...newItem, stock: Number(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Reorder Level</label>
                                        <input type="number" min="0" className="w-full p-2 border border-gray-300 rounded text-xs outline-none" 
                                            value={newItem.reorderLevel} onChange={e => setNewItem({...newItem, reorderLevel: Number(e.target.value)})}
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded text-[10px] font-black uppercase tracking-widest shadow hover:bg-blue-700 transition">Save Item</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Adjust Stock Modal */}
            {showAdjustModal && selectedItem && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                         <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <div>
                                <h5 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Adjust Stock</h5>
                                <p className="text-[10px] text-blue-600 font-bold uppercase">{selectedItem.name}</p>
                            </div>
                            <button onClick={() => setShowAdjustModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa fa-times"></i></button>
                        </div>
                        <div className="p-6">
                            <form onSubmit={handleAdjustStock} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Action</label>
                                    <div className="flex space-x-2">
                                        <button 
                                            type="button" 
                                            onClick={() => setAdjustment({...adjustment, type: 'add'})}
                                            className={`flex-1 py-2 text-[10px] font-black uppercase rounded border ${adjustment.type === 'add' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200'}`}
                                        >
                                            Restock (+)
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setAdjustment({...adjustment, type: 'remove'})}
                                            className={`flex-1 py-2 text-[10px] font-black uppercase rounded border ${adjustment.type === 'remove' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-200'}`}
                                        >
                                            Consume (-)
                                        </button>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Quantity ({selectedItem.unit})</label>
                                    <input type="number" min="1" className="w-full p-2 border border-gray-300 rounded text-sm font-bold outline-none focus:ring-1 focus:ring-blue-500" required 
                                        value={adjustment.qty} onChange={e => setAdjustment({...adjustment, qty: Number(e.target.value)})}
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1 text-right">Current Stock: {selectedItem.stock}</p>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Reason</label>
                                    <input type="text" className="w-full p-2 border border-gray-300 rounded text-xs outline-none" placeholder="e.g. Purchase, Spoilage, Meal Prep"
                                        value={adjustment.reason} onChange={e => setAdjustment({...adjustment, reason: e.target.value})}
                                    />
                                </div>

                                <div className="pt-2">
                                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded text-[10px] font-black uppercase tracking-widest shadow hover:bg-blue-700 transition">Update Stock</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KitchenInventory;
