import React, { useState, useEffect } from 'react';

interface SaleItem {
  id: number;
  name: string;
  date: string;
  scheme: string;
  quantity: number;
  rate: number;
  discountValue: number;
  net: number;
}

interface Product {
  id: string;
  name: string;
  stock: number;
  units: string;
  cost: number;
  price: number;
  vat: number;
}

// Mock Data for Demonstration
const mockProducts: Product[] = [
  { id: '1', name: 'Paracetamol 500mg', stock: 1500, units: 'Tablet', cost: 5, price: 10, vat: 0 },
  { id: '2', name: 'Amoxicillin 250mg', stock: 800, units: 'Capsule', cost: 18, price: 25, vat: 16 },
  { id: '3', name: 'Cough Syrup 100ml', stock: 250, units: 'Bottle', cost: 80, price: 120, vat: 16 },
];

const mockServices = [
  { id: '101', name: 'Consultation Fee', price: 1000, cost: 0, vat: 0, units: 'Session' },
  { id: '102', name: 'Wound Dressing', price: 500, cost: 150, vat: 0, units: 'Service' },
];

const DirectSales: React.FC = () => {
  // UI State
  const [activeTab, setActiveTab] = useState('products');
  const [saleType, setSaleType] = useState('cash');
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);

  // Form State
  const [selectedItemId, setSelectedItemId] = useState('');
  const [itemDetails, setItemDetails] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [isChangingPrice, setIsChangingPrice] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [comment, setComment] = useState('');

  // Sale State
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Payment State
  const [amountTendered, setAmountTendered] = useState<number | ''>('');
  const [change, setChange] = useState(0);

  // Derived values for the current item in the form
  const currentItemAmount = unitPrice * quantity;
  const currentItemNetAmount = currentItemAmount - (currentItemAmount * (discountPercent / 100));

  // Effect to handle switching between Products and Services
  useEffect(() => {
    resetForm();
  }, [activeTab]);

  // Effect to update item details when a product/service is selected
  useEffect(() => {
    if (!selectedItemId) {
      setItemDetails(null);
      setUnitPrice(0);
      return;
    }

    let foundItem;
    if (activeTab === 'products') {
      foundItem = mockProducts.find(p => p.id === selectedItemId);
    } else {
      foundItem = mockServices.find(s => s.id === selectedItemId);
    }

    if (foundItem) {
      setItemDetails(foundItem);
      if (!isChangingPrice) {
        setUnitPrice(foundItem.price);
      }
    }
  }, [selectedItemId, activeTab, isChangingPrice]);

  // Effect to recalculate total amount when sale items change
  useEffect(() => {
    const total = saleItems.reduce((acc, item) => acc + item.net, 0);
    setTotalAmount(total);
  }, [saleItems]);

  // Effect to calculate change when amount tendered or total changes
  useEffect(() => {
    const tendered = Number(amountTendered);
    if (!isNaN(tendered) && tendered >= totalAmount) {
      setChange(tendered - totalAmount);
    } else {
      setChange(0);
    }
  }, [amountTendered, totalAmount]);

  // Function to reset the item entry form
  const resetForm = () => {
    setSelectedItemId('');
    setItemDetails(null);
    setQuantity(1);
    setUnitPrice(0);
    setIsChangingPrice(false);
    setDiscountPercent(0);
    setComment('');
  };

  // Function to handle adding an item to the sale
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemId || quantity <= 0 || !itemDetails) {
      alert("Please select a valid item and quantity.");
      return;
    }

    const newItem: SaleItem = {
      id: Date.now(),
      name: itemDetails.name,
      date: new Date().toLocaleDateString(),
      scheme: 'Cash / Self Pay',
      quantity,
      rate: unitPrice,
      discountValue: currentItemAmount * (discountPercent / 100),
      net: currentItemNetAmount,
    };

    setSaleItems(prevItems => [...prevItems, newItem]);
    resetForm();
  };

  // Function to clear the entire sale
  const handleNewSale = () => {
    setSaleItems([]);
    setAmountTendered('');
    resetForm();
    setShowNewSaleModal(false);
  };
  
  // Function to complete the transaction
  const handleCompleteSale = () => {
    if (saleItems.length === 0) {
      alert("Cannot complete an empty sale.");
      return;
    }
    const tendered = Number(amountTendered);
    if (isNaN(tendered) || tendered < totalAmount) {
      alert("Amount tendered is less than the total amount.");
      return;
    }

    // In a real app, you would save the sale to a database here.
    console.log("Sale Completed:", {
      items: saleItems,
      total: totalAmount,
      tendered: amountTendered,
      change,
    });
    
    alert(`Sale completed! Total: KES ${totalAmount.toFixed(2)}, Change: KES ${change.toFixed(2)}`);
    handleNewSale();
  };

  return (
    <div className="animate-bottom space-y-6">
      {/* Improved Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl shadow-sm shrink-0">
               <i className="fa fa-cash-register"></i>
            </div>
            <div>
               <h4 className="text-sm font-bold text-gray-800 uppercase">Over The Counter Sales</h4>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Walk-In Customer / Direct Sales</p>
            </div>
         </div>
         <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNewSaleModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded text-[10px] font-bold uppercase shadow hover:bg-green-700 transition flex items-center tracking-widest"
            >
               <i className="fa fa-plus-circle mr-2"></i> New Sale
            </button>
         </div>
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
           <h5 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">
             Sale Details
           </h5>
        </div>

        <div className="p-6">
           <form className="grid grid-cols-1 md:grid-cols-4 gap-6" onSubmit={handleAddItem}>
              {/* Col 1 - Item Selection */}
              <div className="space-y-4">
                 <div>
                    <div className="flex items-center space-x-2 mb-1">
                       <input type="checkbox" id="changeloc" className="rounded" />
                       <label htmlFor="changeloc" className="text-[10px] font-bold text-gray-500 uppercase">Change Location</label>
                    </div>
                    <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-900 outline-none font-bold" disabled>
                       <option>Main Pharmacy</option>
                    </select>
                 </div>
                 
                 <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Item Type</label>
                    <select 
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-900 outline-none"
                      value={activeTab}
                      onChange={(e) => setActiveTab(e.target.value)}
                    >
                       <option value="products">Product</option>
                       <option value="services">Service</option>
                    </select>
                 </div>

                 {activeTab === 'products' ? (
                   <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Product Name</label>
                      <select 
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-900 outline-none font-bold"
                        value={selectedItemId}
                        onChange={(e) => setSelectedItemId(e.target.value)}
                      >
                         <option value="">Select Product...</option>
                         {mockProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-500">
                         <span>Stock: <span className="text-blue-600">{itemDetails?.stock ?? '0.00'}</span></span>
                         <span>Units: <span className="text-blue-600">{itemDetails?.units ?? '-'}</span></span>
                      </div>
                   </div>
                 ) : (
                   <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Service Name</label>
                      <select 
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-900 outline-none font-bold"
                        value={selectedItemId}
                        onChange={(e) => setSelectedItemId(e.target.value)}
                      >
                         <option value="">Select Service...</option>
                         {mockServices.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                   </div>
                 )}

                 <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-500 pt-2 border-t border-gray-100">
                    <div>Unit Cost: <span className="text-blue-600 block">{itemDetails?.cost?.toFixed(2) ?? '0.00'}</span></div>
                    <div>VAT: <span className="text-blue-600 block">{itemDetails?.vat ?? 0}%</span></div>
                 </div>
              </div>

              {/* Col 2 - Pricing */}
              <div className="space-y-4">
                 <div className="pt-6">
                    <div className="flex items-center space-x-2 mb-1">
                       <input type="checkbox" id="changedate" className="rounded" />
                       <label htmlFor="changedate" className="text-[10px] font-bold text-gray-500 uppercase">Change Date</label>
                    </div>
                    <input type="datetime-local" className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-900 outline-none" disabled />
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Scheme</label>
                    <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-900 outline-none font-bold">
                       <option>Cash / Self Pay</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Unit Price</label>
                    <input 
                      type="number" 
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs font-black text-blue-600 outline-none" 
                      placeholder="0.00"
                      value={unitPrice}
                      onChange={(e) => setUnitPrice(Number(e.target.value))}
                      readOnly={!isChangingPrice}
                    />
                    <div className="flex items-center space-x-2 mt-1">
                       <input 
                         type="checkbox" 
                         id="changeprice" 
                         className="rounded"
                         checked={isChangingPrice}
                         onChange={(e) => setIsChangingPrice(e.target.checked)}
                       />
                       <label htmlFor="changeprice" className="text-[9px] font-bold text-gray-400 uppercase">Change Price</label>
                    </div>
                 </div>
              </div>

              {/* Col 3 - Quantity & Discount */}
              <div className="space-y-4">
                 <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Sale Quantity</label>
                    <input 
                      type="number" 
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-900 font-black outline-none" 
                      min="1" 
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">% Discount</label>
                    <input 
                      type="number" 
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-900 outline-none" 
                      min="0" max="100" 
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    />
                 </div>
                 <div>
                    <div className="flex items-center space-x-2 mb-1">
                       <input type="checkbox" id="usediscamt" className="rounded" disabled/>
                       <label htmlFor="usediscamt" className="text-[10px] font-bold text-gray-500 uppercase">Use Amount</label>
                    </div>
                    <input type="number" className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-900 outline-none" readOnly />
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Comment</label>
                    <input 
                      type="text" 
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-900 outline-none"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                 </div>
              </div>

              {/* Col 4 - Totals */}
              <div className="space-y-4 flex flex-col justify-between">
                 <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Amount</label>
                    <input type="text" className="w-full p-2 bg-gray-100 border border-gray-200 rounded text-xs text-gray-900 font-bold outline-none" readOnly value={currentItemAmount.toFixed(2)} />
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Net Amount</label>
                    <input type="text" className="w-full p-2 bg-blue-50 border border-blue-100 rounded text-lg font-black text-blue-700 outline-none" readOnly value={currentItemNetAmount.toFixed(2)} />
                 </div>
                 <div className="flex items-center space-x-2">
                    <input type="checkbox" id="updateexist" className="rounded" />
                    <label htmlFor="updateexist" className="text-[10px] font-bold text-gray-500 uppercase">Update Existing</label>
                 </div>
                 <div className="pt-2">
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded text-xs font-black uppercase tracking-widest shadow hover:bg-blue-700 transition">
                       <i className="fa fa-plus mr-1"></i> Add Item
                    </button>
                 </div>
              </div>
           </form>

           <hr className="my-6 border-gray-100" />

           <div className="flex flex-col lg:flex-row gap-8">
              {/* Sales List */}
              <div className="flex-1">
                 <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Direct Sales Items</h6>
                 <div className="overflow-x-auto border border-gray-200 rounded">
                    <table className="w-full text-left text-[11px]">
                       <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 font-bold uppercase">
                          <tr>
                             <th className="px-4 py-2 w-8"><input type="checkbox" className="rounded" /></th>
                             <th className="px-4 py-2">Name</th>
                             <th className="px-4 py-2">Date</th>
                             <th className="px-4 py-2 text-center">Qty</th>
                             <th className="px-4 py-2 text-right">Rate</th>
                             <th className="px-4 py-2 text-right">Discount</th>
                             <th className="px-4 py-2 text-right">Net</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 text-gray-600">
                          {saleItems.length === 0 ? (
                            <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400 italic">No items added to sale</td></tr>
                          ) : (
                            saleItems.map(item => (
                              <tr key={item.id} className="hover:bg-blue-50">
                                 <td className="px-4 py-2"><input type="checkbox" className="rounded"/></td>
                                 <td className="px-4 py-2 font-bold uppercase">{item.name}</td>
                                 <td className="px-4 py-2">{item.date}</td>
                                 <td className="px-4 py-2 text-center">{item.quantity}</td>
                                 <td className="px-4 py-2 text-right">{item.rate.toFixed(2)}</td>
                                 <td className="px-4 py-2 text-right text-red-500">{item.discountValue.toFixed(2)}</td>
                                 <td className="px-4 py-2 text-right font-black text-blue-700">{item.net.toFixed(2)}</td>
                              </tr>
                            ))
                          )}
                       </tbody>
                    </table>
                 </div>
                 
                 <div className="mt-4 flex space-x-4">
                    <div className="flex items-center space-x-2">
                       <div className="w-3 h-3 bg-green-500 rounded"></div>
                       <span className="text-[10px] font-bold text-gray-500 uppercase">Sold</span>
                    </div>
                    <div className="flex items-center space-x-2">
                       <div className="w-3 h-3 bg-orange-500 rounded"></div>
                       <span className="text-[10px] font-bold text-gray-500 uppercase">Invoiced</span>
                    </div>
                    <div className="flex items-center space-x-2">
                       <div className="w-3 h-3 bg-gray-800 rounded"></div>
                       <span className="text-[10px] font-bold text-gray-500 uppercase">Pending</span>
                    </div>
                 </div>
              </div>

              {/* Payment Section */}
              <div className="lg:w-80 space-y-6">
                 <div>
                    <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1 mb-3">Payment Details</h6>
                    <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-2">
                       <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                          <span>Sales No:</span>
                          <span className="text-blue-600">#NEW</span>
                       </div>
                       <div className="flex justify-between items-center text-sm font-black text-gray-800">
                          <span>Total Amount:</span>
                          <span>KES {totalAmount.toFixed(2)}</span>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Sale Type</label>
                          <select 
                            className="w-full p-2 bg-white border border-gray-200 rounded text-xs text-gray-900 outline-none font-bold"
                            value={saleType}
                            onChange={(e) => setSaleType(e.target.value)}
                          >
                             <option value="cash">Cash</option>
                             <option value="credit">Credit</option>
                          </select>
                       </div>
                       <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Mode</label>
                          <select className="w-full p-2 bg-white border border-gray-200 rounded text-xs text-gray-900 outline-none font-bold" disabled={saleType !== 'cash'}>
                             <option>Cash</option>
                             <option>M-Pesa</option>
                             <option>Card</option>
                          </select>
                       </div>
                    </div>

                    {saleType === 'cash' && (
                      <div className="animate-in fade-in slide-in-from-top-2 space-y-3">
                         <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Amount Tendered</label>
                            <input 
                              type="number" 
                              className="w-full p-3 bg-blue-50 border border-blue-100 rounded text-lg font-black text-blue-700 outline-none" 
                              placeholder="0.00"
                              value={amountTendered}
                              onChange={(e) => setAmountTendered(e.target.value === '' ? '' : Number(e.target.value))}
                            />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">To Pay</label>
                               <input readOnly className="w-full p-2 bg-gray-100 border border-gray-200 rounded text-xs text-gray-900 font-bold" value={totalAmount.toFixed(2)} />
                            </div>
                            <div>
                               <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Change</label>
                               <input readOnly className="w-full p-2 bg-green-50 border border-green-100 rounded text-xs font-bold text-green-600" value={change.toFixed(2)} />
                            </div>
                         </div>
                         <button 
                           onClick={handleCompleteSale}
                           className="w-full bg-green-600 text-white py-3 rounded font-black text-xs uppercase tracking-widest shadow-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed" 
                           disabled={saleItems.length === 0 || Number(amountTendered) < totalAmount}
                         >
                            Complete Sale
                         </button>
                      </div>
                    )}
                    
                    {saleType === 'credit' && (
                       <button className="w-full bg-blue-600 text-white py-3 rounded font-black text-xs uppercase tracking-widest shadow-lg hover:bg-blue-700 transition">
                          Create Invoice
                       </button>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* New Sale Confirmation Modal */}
      {showNewSaleModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100">
              <h5 className="text-sm font-bold text-gray-800">Confirm New Sale</h5>
              <p className="text-xs text-gray-500 mt-1">Starting a new sale will clear any unsaved items. Are you sure you want to continue?</p>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end space-x-2">
              <button onClick={() => setShowNewSaleModal(false)} className="px-4 py-2 border border-gray-300 rounded text-xs font-bold uppercase text-gray-600 hover:bg-gray-100">
                Cancel
              </button>
              <button 
                onClick={handleNewSale}
                className="px-4 py-2 bg-blue-600 text-white rounded text-xs font-bold uppercase hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DirectSales;
