
import React, { useState } from 'react';
import { usePatient } from '../../context/PatientContext';
import { useHospital } from '../../context/HospitalContext'; 
import QueueModal from '../../components/QueueModal';

// Types
interface PharmacyRequest {
  id: string;
  patientName: string;
  patientId: string;
  opNumber: string;
  visitDate: string;
  doctor: string;
  scheme: string;
  paymentStatus: 'Paid' | 'Pending' | 'Credit';
  status: 'New' | 'Processing' | 'Ready';
  itemCount: number;
}

interface PrescriptionItem {
  id: number;
  drugName: string;
  dosage: string;
  duration: string;
  quantityPrescribed: number;
  quantityDispensed: number;
  stockLevel: number;
  unitPrice: number;
  totalPrice: number;
  isPaid: boolean;
  status: 'Pending' | 'Dispensed' | 'Out of Stock';
}

const Pharmacy: React.FC = () => {
  const { activePatient, setActivePatient } = usePatient();
  const [activeTab, setActiveTab] = useState<'queue' | 'dispensing' | 'history'>('queue');
  
  // Modal States
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [showDirectSalesModal, setShowDirectSalesModal] = useState(false);
  const [showRequisitionModal, setShowRequisitionModal] = useState(false);
  const [showStockCheckModal, setShowStockCheckModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  
  // Mock Data: Pharmacy Queue
  const [queue, setQueue] = useState<PharmacyRequest[]>([
    { id: 'RX-101', patientName: 'Jane Doe', patientId: 'P-1001', opNumber: 'OP-2023-001', visitDate: '10:30 AM', doctor: 'Dr. Wilson', scheme: 'Cash', paymentStatus: 'Paid', status: 'New', itemCount: 3 },
    { id: 'RX-102', patientName: 'John Smith', patientId: 'P-1042', opNumber: 'OP-2023-042', visitDate: '11:15 AM', doctor: 'Dr. Sarah', scheme: 'Jubilee', paymentStatus: 'Credit', status: 'Processing', itemCount: 2 },
    { id: 'RX-103', patientName: 'Baby Ryan', patientId: 'P-2005', opNumber: 'OP-2023-155', visitDate: '11:45 AM', doctor: 'Dr. Wilson', scheme: 'NHIF', paymentStatus: 'Pending', status: 'New', itemCount: 5 },
  ]);

  // Mock Data: Active Prescription Items
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([
    { id: 1, drugName: 'Paracetamol 500mg', dosage: '1x3', duration: '5 Days', quantityPrescribed: 15, quantityDispensed: 15, stockLevel: 500, unitPrice: 10, totalPrice: 150, isPaid: true, status: 'Pending' },
    { id: 2, drugName: 'Amoxicillin 500mg', dosage: '1x3', duration: '7 Days', quantityPrescribed: 21, quantityDispensed: 21, stockLevel: 50, unitPrice: 20, totalPrice: 420, isPaid: true, status: 'Pending' },
    { id: 3, drugName: 'Cetirizine 10mg', dosage: '1x1', duration: '10 Days', quantityPrescribed: 10, quantityDispensed: 10, stockLevel: 0, unitPrice: 15, totalPrice: 150, isPaid: true, status: 'Out of Stock' },
  ]);

  const handlePatientSelect = (req: PharmacyRequest) => {
    // Set active patient context
    const names = req.patientName.split(' ');
    setActivePatient({
        id: req.patientId,
        surname: names[0] || '',
        othernames: names.slice(1).join(' '),
        age: 30, // Mock
        gender: 'Female', // Mock
        scheme: req.scheme,
        outpatientNo: req.opNumber,
        telephone: '0700000000',
        status: 'Queue'
    });
    setActiveTab('dispensing');
  };

  const handleDispense = (id: number) => {
    setPrescriptionItems(prev => prev.map(item => 
        item.id === id && item.stockLevel >= item.quantityDispensed 
        ? { ...item, status: 'Dispensed' } 
        : item
    ));
    // If it's the last pending item, prompt queue
    const remaining = prescriptionItems.filter(i => i.status === 'Pending').length;
    if (remaining <= 1) {
        setShowQueueModal(true);
    }
  };

  const dispenseAll = () => {
      setPrescriptionItems(prev => prev.map(item => 
        item.stockLevel >= item.quantityDispensed && item.status === 'Pending'
        ? { ...item, status: 'Dispensed' } 
        : item
    ));
    setShowQueueModal(true);
  };

  const calculateTotal = () => prescriptionItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const calculatePaid = () => prescriptionItems.filter(i => i.isPaid).reduce((acc, item) => acc + item.totalPrice, 0);

  const inputStyle = "w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600 transition-all shadow-inner";
  const labelStyle = "block text-[9px] font-black text-slate-500 uppercase mb-1.5 tracking-widest";

  return (
    <div className="animate-bottom space-y-6">
      {/* Top Bar: Standardized Clinical Header */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xl shadow-sm shrink-0">
               <i className="fa fa-pills"></i>
            </div>
            {activePatient ? (
                <div>
                   <h4 className="text-sm font-bold text-gray-800 uppercase">{activePatient.surname}, {activePatient.othernames}</h4>
                   <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{activePatient.outpatientNo} • {activePatient.scheme}</p>
                </div>
            ) : (
                <div className="flex-1">
                    <input type="text" className="w-full md:w-64 p-2 bg-gray-50 border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-red-500" placeholder="Search Patient (Name/ID)..." />
                </div>
            )}
         </div>
         
         <div className="flex items-center space-x-2">
             {/* ACTIONS DROPDOWN */}
             <div className="relative group">
                <button className="bg-[#5bc0de] text-white px-4 py-2 rounded text-[10px] font-bold uppercase shadow hover:bg-[#31b0d5] transition flex items-center tracking-widest">
                   Actions <i className="fa fa-caret-down ml-2"></i>
                </button>
                <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded shadow-xl hidden group-hover:block z-50 py-1 text-[11px] font-bold text-gray-600">
                   <button onClick={() => setShowQueueModal(true)} className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-50 text-blue-600">Queue Patient</button>
                   <button onClick={() => setShowDirectSalesModal(true)} className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-50">Direct Sales</button>
                   <button onClick={() => setShowRequisitionModal(true)} className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-50">Internal Requisition</button>
                   <button onClick={() => setShowStockCheckModal(true)} className="w-full text-left px-4 py-2 hover:bg-gray-50">Stock Check</button>
                </div>
             </div>
         </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden min-h-[600px] flex flex-col">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50 overflow-x-auto">
           {[
             { id: 'queue', label: 'Pharmacy Queue', count: queue.length },
             { id: 'dispensing', label: 'Dispensing', count: activePatient ? prescriptionItems.filter(i => i.status === 'Pending').length : 0 },
             { id: 'history', label: 'History', count: 0 }
           ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap flex items-center ${
                   activeTab === tab.id 
                   ? 'border-red-600 text-red-600 bg-white' 
                   : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                 {tab.label}
                 {tab.count > 0 && <span className="ml-2 bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-[9px]">{tab.count}</span>}
              </button>
           ))}
        </div>

        <div className="p-6 flex-1 bg-gray-50/30">
           
           {/* QUEUE TAB */}
           {activeTab === 'queue' && (
              <div className="animate-in fade-in space-y-4">
                 <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
                    <table className="w-full text-left text-[11px]">
                       <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 uppercase font-black tracking-tight">
                          <tr>
                             <th className="px-4 py-3">Time</th>
                             <th className="px-4 py-3">Patient</th>
                             <th className="px-4 py-3">Doctor</th>
                             <th className="px-4 py-3">Payment</th>
                             <th className="px-4 py-3">Items</th>
                             <th className="px-4 py-3">Status</th>
                             <th className="px-4 py-3 text-right">Action</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 text-gray-600">
                          {queue.map(req => (
                             <tr key={req.id} className="hover:bg-red-50 transition-colors cursor-pointer" onClick={() => handlePatientSelect(req)}>
                                <td className="px-4 py-3 font-bold">{req.visitDate}</td>
                                <td className="px-4 py-3">
                                   <div className="font-bold text-gray-800 uppercase">{req.patientName}</div>
                                   <div className="text-[9px] text-gray-400">{req.opNumber} • {req.scheme}</div>
                                </td>
                                <td className="px-4 py-3">{req.doctor}</td>
                                <td className="px-4 py-3">
                                   <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                       req.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 
                                       req.paymentStatus === 'Credit' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                                   }`}>{req.paymentStatus}</span>
                                </td>
                                <td className="px-4 py-3 font-bold">{req.itemCount}</td>
                                <td className="px-4 py-3">
                                   <span className="text-[10px] font-bold text-gray-500 uppercase">{req.status}</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                   <button className="bg-white border border-red-200 text-red-600 px-3 py-1 rounded text-[9px] font-bold uppercase hover:bg-red-600 hover:text-white transition">
                                      Process
                                   </button>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           )}

           {/* DISPENSING TAB */}
           {activeTab === 'dispensing' && activePatient ? (
              <div className="animate-in fade-in flex flex-col lg:flex-row gap-6">
                 {/* Left: Summary & Payment */}
                 <div className="lg:w-72 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                       <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-3">Prescription Summary</h6>
                       <div className="space-y-2 text-xs">
                          <div className="flex justify-between font-bold text-gray-600">
                             <span>Total Amount:</span>
                             <span className="text-blue-600">{calculateTotal().toLocaleString()}.00</span>
                          </div>
                          <div className="flex justify-between font-bold text-green-600">
                             <span>Paid/Covered:</span>
                             <span>{calculatePaid().toLocaleString()}.00</span>
                          </div>
                          <div className="flex justify-between font-black text-red-600 border-t border-gray-100 pt-2 text-sm">
                             <span>Balance Due:</span>
                             <span>{(calculateTotal() - calculatePaid()).toLocaleString()}.00</span>
                          </div>
                       </div>
                       
                       <div className="mt-4 space-y-2">
                          <button 
                             onClick={dispenseAll}
                             disabled={calculateTotal() > calculatePaid() && activePatient.scheme === 'Cash'}
                             className="w-full bg-green-600 text-white py-2 rounded text-[10px] font-black uppercase tracking-widest shadow hover:bg-green-700 transition disabled:opacity-50"
                          >
                             Dispense Available
                          </button>
                          <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded text-[10px] font-black uppercase shadow-sm hover:bg-gray-50">
                             Print Label / Script
                          </button>
                       </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-[10px] text-blue-800">
                       <p className="font-bold mb-1"><i className="fa fa-info-circle mr-1"></i> Patient Info</p>
                       <p>Name: {activePatient.surname} {activePatient.othernames}</p>
                       <p>Age: {activePatient.age}</p>
                       <p>Allergies: <span className="font-bold text-red-500">None Recorded</span></p>
                    </div>
                 </div>

                 {/* Right: Items Table */}
                 <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                       <h6 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Prescribed Items</h6>
                       <button 
                          onClick={() => setShowAddItemModal(true)}
                          className="text-red-600 text-[10px] font-bold hover:underline"
                       >
                          <i className="fa fa-plus-circle mr-1"></i> Add Item
                       </button>
                    </div>
                    <div className="overflow-x-auto">
                       <table className="w-full text-left text-[11px]">
                          <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-tight">
                             <tr>
                                <th className="px-4 py-2">Drug Name</th>
                                <th className="px-4 py-2">Dosage</th>
                                <th className="px-4 py-2 text-center">Rx Qty</th>
                                <th className="px-4 py-2 text-center">Dispense</th>
                                <th className="px-4 py-2 text-center">Stock</th>
                                <th className="px-4 py-2 text-right">Price</th>
                                <th className="px-4 py-2 text-center">Status</th>
                                <th className="px-4 py-2 text-right">Action</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-gray-700">
                             {prescriptionItems.map(item => (
                                <tr key={item.id} className={item.status === 'Dispensed' ? 'bg-green-50/30' : ''}>
                                   <td className="px-4 py-3 font-bold">{item.drugName}</td>
                                   <td className="px-4 py-3 text-gray-500">{item.dosage} ({item.duration})</td>
                                   <td className="px-4 py-3 text-center">{item.quantityPrescribed}</td>
                                   <td className="px-4 py-3 text-center w-24">
                                      <input 
                                         type="number" 
                                         className="w-16 p-1 text-center border border-gray-300 rounded text-xs outline-none focus:ring-1 focus:ring-red-500"
                                         defaultValue={item.quantityDispensed}
                                         disabled={item.status === 'Dispensed'}
                                      />
                                   </td>
                                   <td className="px-4 py-3 text-center">
                                      {item.stockLevel === 0 ? (
                                         <span className="text-red-600 font-bold text-[9px]">OUT</span>
                                      ) : (
                                         <span className="text-green-600 font-bold">{item.stockLevel}</span>
                                      )}
                                   </td>
                                   <td className="px-4 py-3 text-right">{item.totalPrice}</td>
                                   <td className="px-4 py-3 text-center">
                                      {item.status === 'Dispensed' && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[9px] font-black uppercase">Dispensed</span>}
                                      {item.status === 'Pending' && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[9px] font-black uppercase">Pending</span>}
                                      {item.status === 'Out of Stock' && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-[9px] font-black uppercase">No Stock</span>}
                                   </td>
                                   <td className="px-4 py-3 text-right">
                                      {item.status === 'Pending' && item.stockLevel > 0 && (
                                         <button 
                                            onClick={() => handleDispense(item.id)}
                                            className="text-blue-600 hover:text-blue-800 font-bold text-[10px] uppercase"
                                         >
                                            Dispense
                                         </button>
                                      )}
                                      {item.stockLevel === 0 && (
                                         <button className="text-orange-500 hover:text-orange-700 font-bold text-[10px] uppercase">Substitute</button>
                                      )}
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>
           ) : (
              activeTab === 'dispensing' && (
                 <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-gray-400">
                    <i className="fa fa-pills text-5xl mb-4 opacity-20"></i>
                    <p className="text-sm font-bold uppercase tracking-widest">Select a patient from the queue to start dispensing</p>
                 </div>
              )
           )}

           {/* HISTORY TAB */}
           {activeTab === 'history' && (
              <div className="p-10 text-center text-gray-400 italic">No historical records found for this session.</div>
           )}
        </div>
      </div>

      {/* MODALS */}

      {/* 1. Queue Modal Wrapper */}
      <QueueModal 
        isOpen={showQueueModal} 
        onClose={() => setShowQueueModal(false)}
        patientName={activePatient ? `${activePatient.surname} ${activePatient.othernames}` : ''}
        patientId={activePatient?.outpatientNo}
      />

      {/* 2. Direct Sales Modal */}
      {showDirectSalesModal && (
         <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="p-6 bg-slate-900 text-white flex justify-between items-start shrink-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><i className="fa fa-cash-register text-9xl transform -rotate-12"></i></div>
                  <div className="relative z-10">
                      <h5 className="text-xl font-black uppercase tracking-tight">Direct Sale</h5>
                      <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mt-1">OTC / Walk-In Purchase</p>
                  </div>
                  <button onClick={() => setShowDirectSalesModal(false)} className="text-white/50 hover:text-white transition-colors relative z-10"><i className="fa fa-times text-2xl"></i></button>
               </div>
               
               <div className="p-8 bg-slate-50">
                  <div className="space-y-6">
                     <div>
                        <label className={labelStyle}>Item Name</label>
                        <select className={inputStyle}>
                           <option>Paracetamol 500mg</option>
                           <option>Amoxicillin 250mg</option>
                           <option>Cough Syrup 100ml</option>
                        </select>
                     </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div><label className={labelStyle}>Quantity</label><input type="number" className={inputStyle} min="1" defaultValue="1" /></div>
                        <div><label className={labelStyle}>Payment</label><select className={inputStyle}><option>Cash</option><option>M-Pesa</option></select></div>
                     </div>
                     <div className="flex justify-end pt-4">
                        <button onClick={() => setShowDirectSalesModal(false)} className="bg-red-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-red-700 transition transform active:scale-95">Complete Sale</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* 3. Internal Requisition Modal */}
      {showRequisitionModal && (
         <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="p-6 bg-slate-900 text-white flex justify-between items-start shrink-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><i className="fa fa-dolly text-9xl transform -rotate-12"></i></div>
                  <div className="relative z-10">
                      <h5 className="text-xl font-black uppercase tracking-tight">Internal Order</h5>
                      <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mt-1">Stock Requisition Request</p>
                  </div>
                  <button onClick={() => setShowRequisitionModal(false)} className="text-white/50 hover:text-white transition-colors relative z-10"><i className="fa fa-times text-2xl"></i></button>
               </div>
               <div className="p-8 bg-slate-50 space-y-6">
                  <div><label className={labelStyle}>Requesting Store</label><input type="text" value="Main Pharmacy" readOnly className={`${inputStyle} bg-slate-100 text-slate-500`} /></div>
                  <div><label className={labelStyle}>Source Store</label><select className={inputStyle}><option>Main Stores</option><option>Laboratory Store</option></select></div>
                  <div className="grid grid-cols-2 gap-6">
                     <div><label className={labelStyle}>Item</label><select className={inputStyle}><option>Surgical Gloves</option><option>Cotton Wool</option></select></div>
                     <div><label className={labelStyle}>Quantity</label><input type="number" className={inputStyle} min="1" /></div>
                  </div>
                  <div className="flex justify-end pt-4">
                     <button onClick={() => setShowRequisitionModal(false)} className="bg-red-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-red-700 transition transform active:scale-95">Submit Request</button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* 4. Stock Check Modal */}
      {showStockCheckModal && (
         <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="p-6 bg-slate-900 text-white flex justify-between items-start shrink-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><i className="fa fa-boxes text-9xl transform -rotate-12"></i></div>
                  <div className="relative z-10">
                      <h5 className="text-xl font-black uppercase tracking-tight">Stock Lookup</h5>
                      <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mt-1">Real-time Inventory Balance</p>
                  </div>
                  <button onClick={() => setShowStockCheckModal(false)} className="text-white/50 hover:text-white transition-colors relative z-10"><i className="fa fa-times text-2xl"></i></button>
               </div>
               <div className="p-8 bg-slate-50">
                  <div className="flex space-x-2 mb-6">
                     <input type="text" className="flex-1 p-3 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600" placeholder="Search item name..." />
                     <button className="bg-red-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase shadow hover:bg-red-700">Search</button>
                  </div>
                  <div className="border border-slate-200 rounded-xl max-h-64 overflow-y-auto bg-white">
                     <table className="w-full text-left text-[10px]">
                        <thead className="bg-slate-50 text-slate-500 uppercase font-black tracking-wider">
                           <tr><th className="px-4 py-3">Item Name</th><th className="px-4 py-3">Store</th><th className="px-4 py-3 text-right">Qty</th><th className="px-4 py-3 text-right">Price</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-bold">
                           <tr><td className="px-4 py-3">Paracetamol 500mg</td><td className="px-4 py-3">Main Pharmacy</td><td className="px-4 py-3 text-right text-green-600">500</td><td className="px-4 py-3 text-right">10.00</td></tr>
                           <tr><td className="px-4 py-3">Paracetamol 500mg</td><td className="px-4 py-3">Main Store</td><td className="px-4 py-3 text-right text-green-600">2000</td><td className="px-4 py-3 text-right">8.50</td></tr>
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* 5. Add Item Modal */}
      {showAddItemModal && (
         <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
               <div className="p-6 bg-slate-900 text-white flex justify-between items-start shrink-0 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><i className="fa fa-plus-square text-9xl transform -rotate-12"></i></div>
                  <div className="relative z-10">
                      <h5 className="text-xl font-black uppercase tracking-tight">Add Prescription</h5>
                      <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest mt-1">Manual Order Entry</p>
                  </div>
                  <button onClick={() => setShowAddItemModal(false)} className="text-white/50 hover:text-white transition-colors relative z-10"><i className="fa fa-times text-2xl"></i></button>
               </div>
               <div className="p-8 bg-slate-50 space-y-6">
                  <div><label className={labelStyle}>Drug Name</label><select className={inputStyle}><option>Amoxicillin 500mg</option><option>Metronidazole 400mg</option><option>Brufen 400mg</option></select></div>
                  <div className="grid grid-cols-2 gap-6">
                     <div><label className={labelStyle}>Dosage</label><input type="text" className={inputStyle} placeholder="e.g. 1x3" /></div>
                     <div><label className={labelStyle}>Duration</label><input type="text" className={inputStyle} placeholder="e.g. 5 Days" /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div><label className={labelStyle}>Quantity</label><input type="number" className={inputStyle} /></div>
                     <div><label className={labelStyle}>Total Price</label><input type="text" readOnly className={`${inputStyle} bg-slate-100 text-slate-500`} placeholder="0.00" /></div>
                  </div>
                  <div className="flex justify-end pt-4">
                     <button onClick={() => setShowAddItemModal(false)} className="bg-red-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-red-700 transition transform active:scale-95">Add to List</button>
                  </div>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default Pharmacy;
