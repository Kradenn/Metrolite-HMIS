
import React, { useState, useMemo, useEffect } from 'react';

// --- Types ---
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  color: string;
}

interface CartItem extends Product {
  cartId: number;
  qty: number;
}

// --- Mock Data ---
const PRODUCTS: Product[] = [
  { id: '1', name: 'Paracetamol 500mg', category: 'Analgesics', price: 5.00, stock: 1200, color: 'bg-blue-100 text-blue-700' },
  { id: '2', name: 'Amoxicillin 500mg', category: 'Antibiotics', price: 25.00, stock: 450, color: 'bg-green-100 text-green-700' },
  { id: '3', name: 'Brufen 400mg', category: 'Analgesics', price: 15.00, stock: 300, color: 'bg-blue-100 text-blue-700' },
  { id: '4', name: 'Cough Syrup 100ml', category: 'Syrups', price: 350.00, stock: 80, color: 'bg-orange-100 text-orange-700' },
  { id: '5', name: 'Surgical Gloves', category: 'Consumables', price: 50.00, stock: 5000, color: 'bg-gray-100 text-gray-700' },
  { id: '6', name: 'Metronidazole', category: 'Antibiotics', price: 10.00, stock: 200, color: 'bg-green-100 text-green-700' },
  { id: '7', name: 'Cetirizine 10mg', category: 'Antihistamine', price: 20.00, stock: 600, color: 'bg-purple-100 text-purple-700' },
  { id: '8', name: 'Vitamin C', category: 'Vitamins', price: 15.00, stock: 150, color: 'bg-yellow-100 text-yellow-700' },
  { id: '9', name: 'Zinc Tablets', category: 'Vitamins', price: 30.00, stock: 100, color: 'bg-yellow-100 text-yellow-700' },
  { id: '10', name: 'Antacid Susp.', category: 'Syrups', price: 250.00, stock: 40, color: 'bg-orange-100 text-orange-700' },
  { id: '11', name: 'Cotton Wool', category: 'Consumables', price: 100.00, stock: 50, color: 'bg-gray-100 text-gray-700' },
  { id: '12', name: 'Syringe 5ml', category: 'Consumables', price: 20.00, stock: 1000, color: 'bg-gray-100 text-gray-700' },
];

const CATEGORIES = ['All', 'Analgesics', 'Antibiotics', 'Syrups', 'Consumables', 'Vitamins', 'Antihistamine'];

const POS: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customer, setCustomer] = useState('Walk-in Customer');
  const [amountTendered, setAmountTendered] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // --- Calculations ---
  const subTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subTotal * 0; // Assume inclusive for this demo
  const total = subTotal + tax;
  const change = (parseFloat(amountTendered) || 0) - total;

  // --- Handlers ---
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, cartId: Date.now(), qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  const handleCheckout = () => {
    // Logic to save transaction would go here
    alert(`Transaction Complete!\nTotal: KES ${total}\nChange: KES ${change > 0 ? change.toFixed(2) : 0}`);
    setCart([]);
    setAmountTendered('');
    setShowPaymentModal(false);
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        document.getElementById('pos-search')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="animate-bottom flex flex-col h-[calc(100vh-140px)] bg-gray-50 -m-4 md:-m-6">
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT: Product Catalog */}
        <div className="flex-1 flex flex-col border-r border-gray-200 bg-white">
            {/* Header / Search */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
               <div className="relative w-full max-w-md">
                  <i className="fa fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input 
                    id="pos-search"
                    type="text" 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                    placeholder="Search product name or barcode (F2)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-100 px-2 py-0.5 rounded text-[9px] text-gray-400 font-bold border border-gray-200">F2</div>
               </div>
               <div className="flex space-x-2">
                  <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 shadow-sm transition" title="Scan Barcode"><i className="fa fa-barcode"></i></button>
                  <button className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 shadow-sm transition" title="Refresh Products"><i className="fa fa-sync"></i></button>
               </div>
            </div>

            {/* Categories */}
            <div className="px-4 pt-4 pb-2">
               <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
                  {CATEGORIES.map(cat => (
                     <button 
                       key={cat}
                       onClick={() => setSelectedCategory(cat)}
                       className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                         selectedCategory === cat 
                         ? 'bg-gray-800 text-white shadow-lg transform scale-105' 
                         : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
                       }`}
                     >
                       {cat}
                     </button>
                  ))}
               </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredProducts.map(product => (
                     <div 
                        key={product.id} 
                        onClick={() => addToCart(product)}
                        className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group flex flex-col justify-between h-40"
                     >
                        <div>
                           <div className="flex justify-between items-start mb-2">
                              <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase ${product.color}`}>
                                 {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
                              </span>
                           </div>
                           <h6 className="text-sm font-black text-gray-800 leading-tight group-hover:text-blue-600 line-clamp-2">{product.name}</h6>
                           <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{product.category}</p>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                           <span className="text-lg font-black text-gray-800">KES {product.price}</span>
                           <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition">
                              <i className="fa fa-plus"></i>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
        </div>

        {/* RIGHT: Cart & Checkout */}
        <div className="w-96 bg-white flex flex-col border-l border-gray-200 shadow-xl z-20">
            {/* Customer Info */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
               <div className="flex items-center justify-between mb-2">
                  <h6 className="text-xs font-black text-gray-500 uppercase tracking-widest">Current Sale</h6>
                  <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded cursor-pointer hover:underline" onClick={() => setCart([])}>Clear</span>
               </div>
               <div className="flex items-center space-x-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                     <i className="fa fa-user"></i>
                  </div>
                  <input 
                     type="text" 
                     className="flex-1 text-sm font-bold text-gray-800 outline-none placeholder-gray-400"
                     value={customer}
                     onChange={(e) => setCustomer(e.target.value)}
                  />
                  <button className="text-gray-400 hover:text-blue-600"><i className="fa fa-edit"></i></button>
               </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
               {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300 opacity-60">
                     <i className="fa fa-shopping-basket text-6xl mb-4"></i>
                     <p className="font-bold uppercase tracking-widest text-sm">Cart is Empty</p>
                  </div>
               ) : (
                  cart.map(item => (
                     <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm group hover:border-blue-200">
                        <div className="flex-1">
                           <h6 className="text-xs font-bold text-gray-800">{item.name}</h6>
                           <p className="text-[10px] text-gray-400 font-medium">@ KES {item.price}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                           <div className="flex items-center bg-gray-50 rounded-lg">
                              <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-l-lg transition">-</button>
                              <span className="text-xs font-bold w-6 text-center">{item.qty}</span>
                              <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-green-500 hover:bg-green-50 rounded-r-lg transition">+</button>
                           </div>
                           <div className="text-right w-16">
                              <p className="text-xs font-black text-gray-800">{(item.price * item.qty).toFixed(0)}</p>
                           </div>
                           <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition"><i className="fa fa-times"></i></button>
                        </div>
                     </div>
                  ))
               )}
            </div>

            {/* Totals & Checkout */}
            <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-10">
               <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs text-gray-500 font-bold">
                     <span>Subtotal</span>
                     <span>KES {subTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 font-bold">
                     <span>Tax (Included)</span>
                     <span>KES {tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-gray-800 pt-2 border-t border-dashed border-gray-200">
                     <span>Total</span>
                     <span className="text-blue-600">KES {total.toLocaleString()}</span>
                  </div>
               </div>
               
               <button 
                  onClick={() => setShowPaymentModal(true)}
                  disabled={cart.length === 0}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-xl hover:bg-blue-700 transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-between px-6"
               >
                  <span>Pay Now</span>
                  <span><i className="fa fa-chevron-right"></i></span>
               </button>
            </div>
        </div>
      </div>

      {/* Payment Modal - Updated Style */}
      {showPaymentModal && (
         <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
               
               {/* Modal Header */}
               <div className="p-6 bg-slate-900 text-white flex justify-between items-start shrink-0 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                       <i className="fa fa-wallet text-9xl transform -rotate-12"></i>
                   </div>
                   <div className="relative z-10">
                       <h3 className="text-xl font-black uppercase tracking-tight">Checkout</h3>
                       <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Transaction Processing</p>
                   </div>
                   <button onClick={() => setShowPaymentModal(false)} className="text-white/50 hover:text-white transition-colors relative z-10"><i className="fa fa-times text-2xl"></i></button>
               </div>

               <div className="p-8 bg-slate-50 flex-1 overflow-y-auto">
                  <div className="text-center mb-8">
                     <p className="text-xs text-gray-400 font-black uppercase mb-1 tracking-widest">Total Amount Due</p>
                     <h2 className="text-4xl font-black text-indigo-600">KES {total.toLocaleString()}</h2>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                     {['Cash', 'M-Pesa', 'Card'].map(mode => (
                        <button 
                           key={mode}
                           onClick={() => setPaymentMode(mode)}
                           className={`py-3 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${
                              paymentMode === mode 
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm' 
                              : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'
                           }`}
                        >
                           {mode}
                        </button>
                     ))}
                  </div>

                  <div className="space-y-6">
                     <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">Amount Tendered</label>
                        <input 
                           type="number" 
                           className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-xl font-black text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all shadow-inner"
                           value={amountTendered}
                           onChange={(e) => setAmountTendered(e.target.value)}
                           autoFocus
                           placeholder={`Min: ${total}`}
                        />
                     </div>
                     <div className="flex justify-between items-center p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                        <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Change Due</span>
                        <span className="text-xl font-black text-emerald-700">KES {change > 0 ? change.toFixed(2) : '0.00'}</span>
                     </div>
                  </div>

                  <button 
                     onClick={handleCheckout}
                     disabled={parseFloat(amountTendered || '0') < total}
                     className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     Print Receipt & Finish
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default POS;
