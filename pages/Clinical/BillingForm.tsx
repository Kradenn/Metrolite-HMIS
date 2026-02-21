import React, { useState, useMemo, useEffect } from 'react';
import { usePatient, PatientRecord } from '../../context/PatientContext';
import { useNavigate } from 'react-router';
import PatientSelectorModal from '../../components/PatientSelectorModal';
import { useNotification } from '../../context/NotificationContext';
import { GoogleGenAI } from "@google/genai";

interface BillItem {
  id: number;
  type: 'product' | 'service' | 'procedure';
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  netAmount: number;
  timestamp: string;
}

// Mock interface for pending clinical orders
interface ClinicalOrder {
    id: string;
    type: 'Lab' | 'Pharmacy' | 'Radiology' | 'Service';
    name: string;
    orderedBy: string;
    price: number;
}

const BillingForm: React.FC = () => {
  const { activePatient, setActivePatient } = usePatient();
  const { notify } = useNotification();
  const navigate = useNavigate();

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);
  
  // Station Context
  const [currentStation, setCurrentStation] = useState('Nursing Station');
  const [activeCategory, setActiveCategory] = useState('All');

  // --- Mock Catalog Data ---
  const catalog = [
    { id: 'S001', name: 'General Consultation', type: 'service', category: 'Consultation', price: 1500 },
    { id: 'S002', name: 'Specialist Review', type: 'service', category: 'Consultation', price: 3000 },
    { id: 'P102', name: 'Amoxicillin 500mg (Cap)', type: 'product', category: 'Pharmacy', price: 25 },
    { id: 'P881', name: 'Paracetamol 500mg (Tab)', type: 'product', category: 'Pharmacy', price: 10 },
    { id: 'R091', name: 'X-Ray Chest PA', type: 'procedure', category: 'Radiology', price: 2500 },
    { id: 'L003', name: 'Full Haemogram (CBC)', type: 'procedure', category: 'Laboratory', price: 800 },
    { id: 'C001', name: 'Surgical Gloves (Pair)', type: 'product', category: 'Consumables', price: 50 },
    { id: 'C002', name: 'Cotton Wool (Roll)', type: 'product', category: 'Consumables', price: 150 },
    { id: 'C003', name: 'Branula / Cannula', type: 'product', category: 'Consumables', price: 200 },
    { id: 'N001', name: 'Nursing Care (Daily)', type: 'service', category: 'Nursing', price: 1000 },
    { id: 'N002', name: 'Injection Fee', type: 'procedure', category: 'Nursing', price: 300 },
    { id: 'N003', name: 'Dressing (Small)', type: 'procedure', category: 'Nursing', price: 500 },
  ];

  // --- Mock Pending Clinical Orders ---
  const [pendingOrders, setPendingOrders] = useState<ClinicalOrder[]>([
      { id: 'ORD-101', type: 'Lab', name: 'Full Haemogram (CBC)', orderedBy: 'Dr. Wilson', price: 800 },
      { id: 'ORD-102', type: 'Pharmacy', name: 'Amoxicillin 500mg (Cap)', orderedBy: 'Dr. Wilson', price: 525 }, // Calc: 21 * 25
      { id: 'ORD-103', type: 'Service', name: 'General Consultation', orderedBy: 'Reception', price: 1500 },
  ]);

  // Derived: Filtered Catalog
  const filteredCatalog = useMemo(() => {
    return catalog.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = activeCategory === 'All' || c.category === activeCategory;
        return matchesSearch && matchesCat;
    });
  }, [searchTerm, activeCategory]);

  // Derived: Quick Picks based on Station
  const quickPicks = useMemo(() => {
      let filterFn = (item: any) => false;
      if (currentStation === 'Nursing Station') filterFn = (i) => ['C001', 'C003', 'N002', 'N003'].includes(i.id);
      if (currentStation === 'Consultation Room') filterFn = (i) => ['S001', 'S002'].includes(i.id);
      if (currentStation === 'Triage') filterFn = (i) => ['C001'].includes(i.id);
      
      return catalog.filter(filterFn);
  }, [currentStation]);

  const addItemToBill = (item: any) => {
    const newItem: BillItem = {
      id: Date.now(),
      type: item.type as any,
      itemId: item.id,
      name: item.name,
      quantity: 1,
      unitPrice: item.price,
      discountPercent: 0,
      netAmount: item.price,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setBillItems([newItem, ...billItems]);
    // setSearchTerm(''); // Optional: clear search on add
    notify('info', 'Item Added', `${item.name} added to bill.`);
  };

  const convertOrderToBill = (order: ClinicalOrder) => {
      const newItem: BillItem = {
          id: Date.now(),
          type: order.type === 'Pharmacy' ? 'product' : 'service',
          itemId: order.id,
          name: order.name,
          quantity: 1,
          unitPrice: order.price,
          discountPercent: 0,
          netAmount: order.price,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setBillItems([newItem, ...billItems]);
      setPendingOrders(prev => prev.filter(o => o.id !== order.id)); // Remove from pending
      notify('success', 'Order Converted', `${order.name} moved to active invoice.`);
  };

  const removeItem = (id: number) => {
    setBillItems(prev => prev.filter(i => i.id !== id));
  };

  const updateItemQty = (id: number, qty: number) => {
    setBillItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, qty);
        return { ...item, quantity: newQty, netAmount: newQty * item.unitPrice };
      }
      return item;
    }));
  };

  const totals = useMemo(() => {
    const sub = billItems.reduce((acc, i) => acc + (i.unitPrice * i.quantity), 0);
    const disc = 0; // Simple for now
    const net = sub - disc;
    return { sub, disc, net };
  }, [billItems]);

  const runAiAuditor = async () => {
    if (!activePatient) return;
    setIsAiLoading(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Act as a Hospital Billing Auditor. 
        Patient Diagnosis: ${activePatient.diagnosis || 'None Specified'}. 
        Age: ${activePatient.age}, Gender: ${activePatient.gender}.
        Current Bill Items: ${billItems.map(i => i.name).join(', ')}.
        Suggest 3-5 clinical services or products that are standard for this profile but missing from the bill. 
        Focus on missing Lab Tests (CBC, Urinalysis), Consumables (Gloves, Syringes), or Procedures. Be concise.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { systemInstruction: "You are a clinical billing expert. Provide concise recommendations." }
        });
        setAiSuggestions(response.text || "No discrepancies found.");
    } catch (e) {
        setAiSuggestions("AI Auditor unavailable. Proceeding with manual review.");
    } finally {
        setIsAiLoading(false);
    }
  };

  const handleFinalizeBill = () => {
    if (billItems.length === 0) {
        notify('warning', 'Empty Ledger', 'Cannot finalize an empty bill.');
        return;
    }
    notify('success', 'Bill Finalized', `Invoice of KES ${totals.net.toLocaleString()} has been committed to ${activePatient?.surname}'s ledger.`);
    setBillItems([]);
    navigate('/billing/bills');
  };

  if (!activePatient) {
      return (
          <div className="animate-bottom flex flex-col items-center justify-center min-h-[70vh] space-y-8">
              <PatientSelectorModal isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} />
              <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-400 shadow-inner">
                      <i className="fa fa-cash-register text-5xl opacity-40"></i>
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Invoice Generation Desk</h2>
                  <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto">Please identify a patient from the registry to begin constructing their service ledger.</p>
              </div>
              <button onClick={() => setIsSelectorOpen(true)} className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition transform active:scale-95">
                  <i className="fa fa-search mr-2"></i> Find Patient
              </button>
          </div>
      );
  }

  return (
    <div className="animate-bottom space-y-6 pb-20">
      <PatientSelectorModal isOpen={isSelectorOpen} onClose={() => setIsSelectorOpen(false)} />

      {/* Header: Dynamic Patient Ribbon */}
      <div className="bg-slate-900 border-l-[6px] border-l-emerald-600 p-4 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center space-x-5 z-10">
          <div className="w-14 h-14 bg-white text-slate-900 rounded-2xl flex items-center justify-center text-2xl font-black shadow-2xl">
            {activePatient.surname[0]}
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight leading-none">{activePatient.surname}, {activePatient.othernames}</h2>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em] mt-2 leading-none">{activePatient.outpatientNo} &bull; {activePatient.scheme}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 z-10">
             <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
                 <span className="text-[9px] font-bold text-slate-400 uppercase">Station:</span>
                 <select 
                    value={currentStation} 
                    onChange={(e) => setCurrentStation(e.target.value)} 
                    className="bg-transparent text-white text-[10px] font-black uppercase outline-none cursor-pointer"
                 >
                    <option className="text-slate-900">Nursing Station</option>
                    <option className="text-slate-900">Consultation Room</option>
                    <option className="text-slate-900">Triage</option>
                    <option className="text-slate-900">Treatment Room</option>
                 </select>
             </div>
            <button onClick={() => setIsSelectorOpen(true)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 transition">Switch Patient</button>
        </div>
        <i className="fa fa-calculator absolute -right-6 -bottom-6 text-9xl text-white/5 rotate-12"></i>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-280px)]">
        
        {/* LEFT: SERVICE CATALOG & QUICK PICKS */}
        <div className="lg:col-span-5 flex flex-col bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
            
            {/* Search & Categories */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col gap-3">
                <div className="relative group">
                    <i className="fa fa-search absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500"></i>
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search items..." 
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-800 text-xs shadow-sm" 
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {['All', 'Consultation', 'Nursing', 'Consumables', 'Pharmacy', 'Laboratory', 'Radiology'].map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wide whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Picks for Station */}
            {activeCategory === 'All' && !searchTerm && quickPicks.length > 0 && (
                <div className="p-4 border-b border-gray-100 bg-indigo-50/30">
                    <h6 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center"><i className="fa fa-star mr-1"></i> Quick Picks ({currentStation})</h6>
                    <div className="flex flex-wrap gap-2">
                        {quickPicks.map(item => (
                            <button 
                                key={item.id}
                                onClick={() => addItemToBill(item)}
                                className="px-3 py-2 bg-white border border-indigo-100 rounded-lg text-[9px] font-bold text-indigo-800 shadow-sm hover:bg-indigo-50 hover:border-indigo-200 transition active:scale-95"
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Main List */}
            <div className="flex-1 overflow-y-auto p-2 bg-slate-50/50 scrollbar-hide">
                <div className="grid grid-cols-1 gap-2">
                    {filteredCatalog.map(item => (
                        <button 
                            key={item.id} 
                            onClick={() => addItemToBill(item)}
                            className="w-full text-left p-3 bg-white border border-gray-100 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all flex items-center justify-between group"
                        >
                            <div>
                                <h6 className="text-[11px] font-bold text-slate-800 uppercase tracking-tight leading-tight">{item.name}</h6>
                                <p className="text-[9px] text-slate-400 font-bold mt-0.5">{item.category}</p>
                            </div>
                            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                                {item.price.toLocaleString()}
                            </span>
                        </button>
                    ))}
                    {filteredCatalog.length === 0 && (
                        <div className="py-12 text-center text-gray-400">
                            <i className="fa fa-box-open text-2xl mb-2 opacity-30"></i>
                            <p className="text-[10px] font-black uppercase tracking-widest">No items found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* RIGHT: BILL LEDGER */}
        <div className="lg:col-span-7 flex flex-col space-y-4 overflow-hidden">
            
            {/* PENDING ORDERS NOTIFICATION */}
            {pendingOrders.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3 flex justify-between items-center shadow-sm animate-in slide-in-from-top-2">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><i className="fa fa-bell"></i></div>
                        <div>
                            <h6 className="text-[10px] font-black text-orange-800 uppercase tracking-widest">{pendingOrders.length} Pending Orders Found</h6>
                            <p className="text-[9px] text-orange-600 font-medium">Lab/Pharmacy requests waiting for billing.</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {pendingOrders.map(order => (
                            <button 
                                key={order.id}
                                onClick={() => convertOrderToBill(order)}
                                className="bg-white text-orange-700 border border-orange-200 px-3 py-1 rounded-lg text-[9px] font-black uppercase hover:bg-orange-100 transition shadow-sm"
                                title={`Add ${order.name}`}
                            >
                                + {order.type}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* BILL ITEMS */}
            <div className="bg-white border border-gray-200 rounded-3xl flex-1 flex flex-col overflow-hidden shadow-sm relative">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-widest">Active Ledger</h5>
                    <button onClick={runAiAuditor} disabled={isAiLoading} className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 transition flex items-center gap-1">
                        <i className={`fa ${isAiLoading ? 'fa-spinner fa-spin' : 'fa-robot'}`}></i> AI Audit
                    </button>
                </div>
                
                {aiSuggestions && (
                    <div className="bg-indigo-50 border-b border-indigo-100 p-3 text-[10px] text-indigo-800 font-medium leading-relaxed relative">
                        <button onClick={() => setAiSuggestions(null)} className="absolute top-1 right-2 text-indigo-400 hover:text-indigo-600"><i className="fa fa-times"></i></button>
                        <strong className="block mb-1 uppercase tracking-widest text-indigo-600">Audit Findings:</strong>
                        {aiSuggestions}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto scrollbar-hide p-0">
                    <table className="w-full text-left text-[11px] border-collapse">
                        <thead className="bg-white text-slate-400 font-black uppercase tracking-tight sticky top-0 z-10 border-b border-gray-100">
                            <tr>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-2 py-3 text-center">Qty</th>
                                <th className="px-4 py-3 text-right">Total</th>
                                <th className="px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {billItems.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-4 py-3">
                                        <div className="font-black text-slate-800 uppercase leading-none">{item.name}</div>
                                        <div className="text-[8px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">@{item.unitPrice.toLocaleString()}</div>
                                    </td>
                                    <td className="px-2 py-3 text-center">
                                        <input 
                                            type="number" 
                                            value={item.quantity}
                                            onChange={(e) => updateItemQty(item.id, parseInt(e.target.value))}
                                            className="w-10 text-center bg-gray-50 border border-gray-200 rounded p-1 text-[10px] font-bold outline-none focus:border-indigo-500"
                                            min="1"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-right font-black text-indigo-600">{item.netAmount.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors"><i className="fa fa-times-circle"></i></button>
                                    </td>
                                </tr>
                            ))}
                            {billItems.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-20 text-center text-slate-300">
                                        <i className="fa fa-receipt text-4xl mb-2 opacity-20"></i>
                                        <p className="text-[10px] font-black uppercase tracking-widest">No items billed</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 bg-slate-900 text-white shrink-0">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Net Total</span>
                        <span className="text-3xl font-black tracking-tighter">KES {totals.net.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                         <button className="bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition">Save Draft</button>
                         <button onClick={handleFinalizeBill} className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition transform active:scale-95">Finalize Bill</button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default BillingForm;