
import React, { useState } from 'react';

const GoodsReceivedNotes: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedPO, setSelectedPO] = useState('');

  return (
    <div className="animate-bottom space-y-6">
       
       <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[600px] flex flex-col">
          {/* Stepper Header */}
          <div className="bg-gray-50 border-b border-gray-200 p-4">
             <div className="flex items-center justify-center space-x-4">
                <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-teal-600' : 'text-gray-400'}`}>
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}>1</div>
                   <span className="text-xs font-bold uppercase tracking-wide">Select Order</span>
                </div>
                <div className="w-10 h-px bg-gray-300"></div>
                <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-teal-600' : 'text-gray-400'}`}>
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}>2</div>
                   <span className="text-xs font-bold uppercase tracking-wide">Verify Items</span>
                </div>
                <div className="w-10 h-px bg-gray-300"></div>
                <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-teal-600' : 'text-gray-400'}`}>
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}>3</div>
                   <span className="text-xs font-bold uppercase tracking-wide">Commit GRN</span>
                </div>
             </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto">
             {step === 1 && (
                <div className="max-w-2xl mx-auto space-y-6">
                   <h3 className="text-lg font-black text-gray-800 text-center uppercase tracking-tight">Receive Goods against Purchase Order</h3>
                   <div className="relative">
                      <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input 
                        type="text" 
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                        placeholder="Search by PO Number or Supplier Name..."
                      />
                   </div>
                   <div className="space-y-3">
                      <div onClick={() => setSelectedPO('LPO-2023-001')} className={`p-4 border rounded-xl cursor-pointer hover:shadow-md transition-all flex justify-between items-center ${selectedPO === 'LPO-2023-001' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-white'}`}>
                         <div>
                            <p className="text-sm font-bold text-gray-800">LPO-2023-001</p>
                            <p className="text-xs text-gray-500">MedSurg Supplies • 20 Oct 2023</p>
                         </div>
                         <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Sent</span>
                      </div>
                      {/* More mock items */}
                   </div>
                   <div className="flex justify-end pt-4">
                      <button 
                        onClick={() => setStep(2)} 
                        disabled={!selectedPO}
                        className="bg-teal-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-teal-700 transition disabled:opacity-50"
                      >
                         Next Step
                      </button>
                   </div>
                </div>
             )}

             {step === 2 && (
                <div className="space-y-6">
                   <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                      <div>
                         <h5 className="text-sm font-black text-gray-800 uppercase">Receiving: {selectedPO}</h5>
                         <p className="text-xs text-gray-500">Supplier Invoice No: <input type="text" className="border-b border-gray-300 outline-none w-32 focus:border-teal-500 text-teal-600 font-bold" placeholder="Enter Inv #" /></p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-bold text-gray-400 uppercase">Delivery Date</p>
                         <input type="date" className="text-xs font-bold border rounded p-1" defaultValue={new Date().toISOString().split('T')[0]} />
                      </div>
                   </div>
                   
                   <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 text-gray-500 uppercase font-bold border-b border-gray-200">
                         <tr>
                            <th className="px-4 py-3">Item Description</th>
                            <th className="px-4 py-3 text-center">Ordered</th>
                            <th className="px-4 py-3 w-32">Received</th>
                            <th className="px-4 py-3 w-32">Batch No.</th>
                            <th className="px-4 py-3 w-32">Expiry</th>
                            <th className="px-4 py-3 text-center">Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                         <tr>
                            <td className="px-4 py-3 font-medium">Surgical Gloves (Box of 50)</td>
                            <td className="px-4 py-3 text-center font-bold">50</td>
                            <td className="px-4 py-3"><input type="number" className="w-full border rounded p-1 text-center font-bold" defaultValue={50} /></td>
                            <td className="px-4 py-3"><input type="text" className="w-full border rounded p-1" placeholder="Batch..." /></td>
                            <td className="px-4 py-3"><input type="date" className="w-full border rounded p-1" /></td>
                            <td className="px-4 py-3 text-center"><i className="fa fa-check-circle text-green-500"></i></td>
                         </tr>
                      </tbody>
                   </table>

                   <div className="flex justify-between pt-8 border-t border-gray-100">
                      <button onClick={() => setStep(1)} className="text-gray-500 font-bold text-xs hover:text-gray-700">Back</button>
                      <button onClick={() => setStep(3)} className="bg-teal-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-teal-700 transition">Verify & Proceed</button>
                   </div>
                </div>
             )}
             
             {step === 3 && (
                 <div className="max-w-lg mx-auto text-center space-y-6 pt-10">
                     <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                        <i className="fa fa-check"></i>
                     </div>
                     <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Ready to Commit</h3>
                     <p className="text-gray-500 text-sm">This action will update inventory stock levels and create a pending bill for the supplier.</p>
                     
                     <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left text-xs space-y-2">
                        <div className="flex justify-between"><span>Items Received:</span> <span className="font-bold">1 Line Item</span></div>
                        <div className="flex justify-between"><span>Total Value:</span> <span className="font-bold">KES 45,000.00</span></div>
                        <div className="flex justify-between"><span>Inventory Update:</span> <span className="font-bold text-green-600">YES</span></div>
                     </div>

                     <button className="bg-green-600 text-white px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-green-700 transition w-full">Finalize GRN</button>
                     <button onClick={() => setStep(2)} className="text-gray-400 font-bold text-xs hover:text-gray-600 block w-full mt-4">Go Back</button>
                 </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default GoodsReceivedNotes;
