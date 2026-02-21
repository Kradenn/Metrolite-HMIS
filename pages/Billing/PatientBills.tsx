import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useNotification } from '../../context/NotificationContext';
import { usePatient, PatientRecord } from '../../context/PatientContext';
import PatientSelectorModal from '../../components/PatientSelectorModal';
import { useReactToPrint } from 'react-to-print';

interface Bill {
  id: string;
  visitDate: string;
  type: string;
  amount: number;
  paid: number;
  balance: number;
  status: 'Pending' | 'Cleared' | 'Partial';
  claimId?: string;
  lastPrinted?: string;
  payer: string;
  patientName: string;
  patientId: string;
}

interface BillDetail {
    service: string;
    qty: number;
    rate: number;
    amount: number;
}

const PrintableInvoice = React.forwardRef<HTMLDivElement, { bill: Bill; patient: PatientRecord | null; lines: BillDetail[] }>((props, ref) => {
    const { bill, patient, lines } = props;
    if (!bill) return null;

    return (
        <div ref={ref} className="bg-white p-12 max-w-[21cm] mx-auto text-slate-800 hidden print:block print:w-full print:h-full">
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl">
                        <i className="fa fa-hospital-alt"></i>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">UltraHub Hospital</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">Revenue Management Department</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Invoice</h2>
                    <p className="text-sm font-mono font-black text-blue-600 mt-2">#{bill.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-16 mb-12 text-[11px]">
                <div className="space-y-4">
                    <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">Patient Billing Address</h6>
                    <div className="space-y-1">
                        <p className="text-lg font-black text-slate-800 uppercase">{bill.patientName}</p>
                        <p className="font-bold text-slate-500">ID: {patient ? patient.outpatientNo : 'OP-GEN-001'}</p>
                        <p className="text-slate-400">{patient ? patient.telephone : '0700000000'}</p>
                        <p className="text-slate-400">Nairobi, Kenya</p>
                    </div>
                </div>
                <div className="text-right space-y-4">
                    <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">Statement Context</h6>
                    <div className="space-y-2">
                        <p><span className="text-gray-400 uppercase font-bold mr-4">Issue Date:</span> <span className="font-black">{bill.visitDate}</span></p>
                        <p><span className="text-gray-400 uppercase font-bold mr-4">Payment Term:</span> <span className="font-black">DUE ON RECEIPT</span></p>
                        <p><span className="text-gray-400 uppercase font-bold mr-4">Primary Payer:</span> <span className="font-black text-blue-600 uppercase">{bill.payer}</span></p>
                    </div>
                </div>
            </div>

            <table className="w-full text-left text-[10px] mb-12 border-collapse">
                <thead>
                    <tr className="bg-slate-900 text-white font-black uppercase tracking-widest">
                        <th className="px-6 py-3">Description of Service</th>
                        <th className="px-4 py-3 text-center">Qty</th>
                        <th className="px-6 py-3 text-right">Unit Rate</th>
                        <th className="px-6 py-3 text-right">Net Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-bold uppercase">
                    {lines.map((line, i) => (
                        <tr key={i}>
                            <td className="px-6 py-4">{line.service}</td>
                            <td className="px-4 py-4 text-center">{line.qty}</td>
                            <td className="px-6 py-4 text-right">{line.rate.toLocaleString()}.00</td>
                            <td className="px-6 py-4 text-right">{line.amount.toLocaleString()}.00</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-end mt-auto">
                <div className="w-72 space-y-3">
                    <div className="flex justify-between items-end text-xs font-bold text-slate-400">
                        <span className="uppercase">Gross Subtotal</span>
                        <span className="text-slate-700">{bill.amount.toLocaleString()}.00</span>
                    </div>
                    <div className="flex justify-between items-end text-xs font-bold text-slate-400">
                        <span className="uppercase">Total Paid to Date</span>
                        <span className="text-emerald-600">({bill.paid.toLocaleString()}.00)</span>
                    </div>
                    <div className="flex justify-between items-end pt-3 border-t-2 border-slate-900">
                        <span className="text-[10px] font-black uppercase text-slate-900">Amount Outstanding</span>
                        <span className="text-2xl font-black text-rose-600 tracking-tighter">KES {bill.balance.toLocaleString()}.00</span>
                    </div>
                </div>
            </div>

            <div className="mt-20 flex justify-between items-end opacity-40">
                <div className="space-y-1 text-slate-400">
                    <p className="text-[8px] font-black uppercase">System Generated Ledger Record</p>
                    <p className="text-[7px] font-mono">HASH: {btoa(bill.id).slice(0, 16)}</p>
                </div>
                <div className="text-right">
                    <div className="w-40 h-0.5 bg-slate-900 mb-1"></div>
                    <p className="text-[8px] font-black uppercase text-slate-900">Finance Approval</p>
                </div>
            </div>
        </div>
    );
});

const PatientBills: React.FC = () => {
  const { notify } = useNotification();
  const { activePatient, setActivePatient } = usePatient();
  const navigate = useNavigate();

  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPatientSelector, setShowPatientSelector] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
      contentRef: printRef,
  });

  // --- Mock Billing History ---
  const allBills: Bill[] = [
    { id: 'INV-2023-1029', visitDate: '24-Oct-2023', type: 'OPD Encounter', amount: 3500, paid: 0, balance: 3500, status: 'Pending', payer: 'CASH', patientName: 'DOE, JANE', patientId: '1' },
    { id: 'INV-2023-1025', visitDate: '20-Oct-2023', type: 'Laboratory Services', amount: 1200, paid: 1200, balance: 0, status: 'Cleared', lastPrinted: '20-Oct, 14:00', payer: 'NHIF / SHA', patientName: 'DOE, JANE', patientId: '1' },
    { id: 'INV-2023-0988', visitDate: '15-Sep-2023', type: 'Pharmacy Refill', amount: 850, paid: 850, balance: 0, status: 'Cleared', lastPrinted: '15-Sep, 10:15', payer: 'CASH', patientName: 'DOE, JANE', patientId: '1' },
    { id: 'INV-2023-1030', visitDate: '25-Oct-2023', type: 'X-Ray Services', amount: 2500, paid: 0, balance: 2500, status: 'Pending', payer: 'JUBILEE', patientName: 'SMITH, MARY', patientId: '2' },
    { id: 'INV-2023-1031', visitDate: '26-Oct-2023', type: 'Consultation', amount: 1500, paid: 1500, balance: 0, status: 'Cleared', payer: 'CASH', patientName: 'MWANGI, GRACE', patientId: '3' },
  ];

  const billLines: BillDetail[] = [
    { service: 'Consultation - Specialist', qty: 1, rate: 3000, amount: 3000 },
    { service: 'Triage Assessment', qty: 1, rate: 500, amount: 500 },
  ];

  // Filter bills based on active patient and search term
  const filteredBills = useMemo(() => {
      let bills = allBills;
      
      // If a patient is active, filter by that patient
      if (activePatient) {
          bills = bills.filter(b => b.patientId === activePatient.id);
      }

      // Apply search filter
      if (searchTerm) {
          const lowerTerm = searchTerm.toLowerCase();
          bills = bills.filter(b => 
              b.id.toLowerCase().includes(lowerTerm) || 
              b.type.toLowerCase().includes(lowerTerm) ||
              b.patientName.toLowerCase().includes(lowerTerm)
          );
      }
      
      return bills;
  }, [activePatient, searchTerm]);

  const selectedBill = useMemo(() => allBills.find(b => b.id === selectedBillId), [selectedBillId]);

  const handlePostPayment = () => {
      notify('success', 'Payment Synchronized', `Payment of KES ${selectedBill?.balance} processed successfully.`);
      setShowPaymentModal(false);
  };

  const handlePrintInvoice = () => {
      if (!selectedBill) return;
      handlePrint();
  };

  const handleEmailStatement = () => {
      if (!selectedBill) return;
      notify('success', 'Email Sent', `Statement for Invoice #${selectedBill.id} has been emailed to patient.`);
  };

  const inputClass = "w-full p-2.5 bg-white border border-slate-300 rounded-xl text-[11px] font-bold text-slate-800 outline-none focus:ring-1 focus:ring-blue-500 transition-all";
  const labelClass = "block text-[9px] font-black text-slate-500 uppercase px-1 mb-1 tracking-widest";

  return (
    <div className="animate-bottom h-[calc(100vh-100px)] flex flex-col font-helvetica overflow-hidden -m-4 md:-m-6 bg-slate-50">
      
      {/* 1. Header: High Impact Patient Banner */}
      <div className="bg-slate-900 border-l-[6px] border-l-blue-600 p-3 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800 shrink-0 z-30 shadow-lg">
        <div className="flex items-center space-x-5">
            {activePatient ? (
                <>
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-2xl font-black shadow-xl">
                        {activePatient.surname[0]}
                    </div>
                    <div>
                        <h2 className="text-md font-black text-white uppercase tracking-tight leading-none">{activePatient.surname}, {activePatient.othernames}</h2>
                        <p className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-2 leading-none">{activePatient.outpatientNo} &bull; Payer: {activePatient.scheme}</p>
                    </div>
                </>
            ) : (
                <>
                    <div className="w-12 h-12 bg-slate-700 text-white rounded-xl flex items-center justify-center text-2xl font-black shadow-xl">
                        <i className="fa fa-globe"></i>
                    </div>
                    <div>
                        <h2 className="text-md font-black text-white uppercase tracking-tight leading-none">Global Billing Ledger</h2>
                        <p className="text-[9px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-2 leading-none">All Patients &bull; Consolidated View</p>
                    </div>
                </>
            )}
        </div>
        
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-[8px] font-black text-slate-500 uppercase leading-none mb-1">Outstanding Balance</p>
                <p className="text-xl font-black text-rose-500 tracking-tighter leading-none">KES {activePatient ? '3,500.00' : '7,200.00'}</p>
            </div>
            <button onClick={() => navigate('/clinical/billing')} className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition">Create New Bill</button>
            {activePatient ? (
                <button onClick={() => setActivePatient(null)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5 transition">View All Patients</button>
            ) : (
                <button onClick={() => setShowPatientSelector(true)} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition">Select Patient</button>
            )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0 bg-white">
        
        {/* 2. Left: Bill Registry Sidebar */}
        <div className="w-96 bg-white border-r border-slate-200 flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                <div className="relative">
                    <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
                    <input 
                        type="text" 
                        placeholder="Search Invoice, Patient or Date..." 
                        className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-none text-[10px] font-bold outline-none focus:ring-1 focus:ring-blue-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50 scrollbar-hide">
                {filteredBills.map(bill => (
                    <div 
                        key={bill.id} 
                        onClick={() => setSelectedBillId(bill.id)}
                        className={`p-4 cursor-pointer transition-all border-l-4 ${selectedBillId === bill.id ? 'bg-blue-50 border-l-blue-600 shadow-inner' : 'hover:bg-gray-50 border-l-transparent'}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{bill.id}</span>
                            <span className={`text-[8px] px-2 py-0.5 rounded-none font-black uppercase border ${bill.status === 'Cleared' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>{bill.status}</span>
                        </div>
                        <h6 className="text-xs font-black text-gray-800 uppercase truncate leading-tight mt-1">{bill.patientName}</h6>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight mb-2">{bill.type}</p>
                        <div className="flex justify-between items-end mt-2">
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-none">
                                <p>{bill.visitDate}</p>
                                <p className="mt-1">Payer: <span className="text-slate-600">{bill.payer}</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-slate-800 tracking-tighter">KES {bill.amount.toLocaleString()}</p>
                                {bill.balance > 0 && <p className="text-[8px] font-black text-rose-500 uppercase leading-none">Bal: {bill.balance.toLocaleString()}</p>}
                            </div>
                        </div>
                    </div>
                ))}
                {filteredBills.length === 0 && (
                    <div className="p-8 text-center opacity-50">
                        <p className="text-xs font-bold text-slate-400">No bills found</p>
                    </div>
                )}
            </div>
        </div>

        {/* 3. Center: Interactive Invoice Canvas */}
        <div className="flex-1 bg-slate-100 p-8 overflow-y-auto scrollbar-hide flex flex-col items-center">
            {selectedBill ? (
                <div className="bg-white w-full max-w-[21cm] min-h-[29.7cm] shadow-2xl p-16 flex flex-col relative animate-in zoom-in-95 duration-300">
                    {/* Paid Stamp Overlay */}
                    {selectedBill.status === 'Cleared' && (
                        <div className="absolute top-10 right-10 rotate-[12deg] z-20 pointer-events-none opacity-20">
                            <div className="border-[6px] border-emerald-600 p-4 rounded-xl text-center">
                                <span className="text-4xl font-black uppercase text-emerald-600">PAID</span>
                                <p className="text-[10px] font-black uppercase text-emerald-500 mt-1">Transaction Settled</p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl">
                                <i className="fa fa-hospital-alt"></i>
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">UltraHub Hospital</h1>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">Revenue Management Department</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Invoice</h2>
                            <p className="text-sm font-mono font-black text-blue-600 mt-2">#{selectedBill.id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-16 mb-12 text-[11px]">
                        <div className="space-y-4">
                            <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">Patient Billing Address</h6>
                            <div className="space-y-1">
                                <p className="text-lg font-black text-slate-800 uppercase">{selectedBill.patientName}</p>
                                <p className="font-bold text-slate-500">ID: {activePatient ? activePatient.outpatientNo : 'OP-GEN-001'}</p>
                                <p className="text-slate-400">{activePatient ? activePatient.telephone : '0700000000'}</p>
                                <p className="text-slate-400">Nairobi, Kenya</p>
                            </div>
                        </div>
                        <div className="text-right space-y-4">
                            <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">Statement Context</h6>
                            <div className="space-y-2">
                                <p><span className="text-gray-400 uppercase font-bold mr-4">Issue Date:</span> <span className="font-black">{selectedBill.visitDate}</span></p>
                                <p><span className="text-gray-400 uppercase font-bold mr-4">Payment Term:</span> <span className="font-black">DUE ON RECEIPT</span></p>
                                <p><span className="text-gray-400 uppercase font-bold mr-4">Primary Payer:</span> <span className="font-black text-blue-600 uppercase">{selectedBill.payer}</span></p>
                            </div>
                        </div>
                    </div>

                    <table className="w-full text-left text-[10px] mb-12 border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-white font-black uppercase tracking-widest">
                                <th className="px-6 py-3">Description of Service</th>
                                <th className="px-4 py-3 text-center">Qty</th>
                                <th className="px-6 py-3 text-right">Unit Rate</th>
                                <th className="px-6 py-3 text-right">Net Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-bold uppercase">
                            {billLines.map((line, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4">{line.service}</td>
                                    <td className="px-4 py-4 text-center">{line.qty}</td>
                                    <td className="px-6 py-4 text-right">{line.rate.toLocaleString()}.00</td>
                                    <td className="px-6 py-4 text-right">{line.amount.toLocaleString()}.00</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end mt-auto">
                        <div className="w-72 space-y-3">
                            <div className="flex justify-between items-end text-xs font-bold text-slate-400">
                                <span className="uppercase">Gross Subtotal</span>
                                <span className="text-slate-700">{selectedBill.amount.toLocaleString()}.00</span>
                            </div>
                            <div className="flex justify-between items-end text-xs font-bold text-slate-400">
                                <span className="uppercase">Total Paid to Date</span>
                                <span className="text-emerald-600">({selectedBill.paid.toLocaleString()}.00)</span>
                            </div>
                            <div className="flex justify-between items-end pt-3 border-t-2 border-slate-900">
                                <span className="text-[10px] font-black uppercase text-slate-900">Amount Outstanding</span>
                                <span className="text-2xl font-black text-rose-600 tracking-tighter">KES {selectedBill.balance.toLocaleString()}.00</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 flex justify-between items-end opacity-40">
                        <div className="space-y-1 text-slate-400">
                            <p className="text-[8px] font-black uppercase">System Generated Ledger Record</p>
                            <p className="text-[7px] font-mono">HASH: {btoa(selectedBill.id).slice(0, 16)}</p>
                        </div>
                        <div className="text-right">
                             <div className="w-40 h-0.5 bg-slate-900 mb-1"></div>
                             <p className="text-[8px] font-black uppercase text-slate-900">Finance Approval</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full p-10 text-center text-slate-600 animate-in fade-in">
                    <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-5xl shadow-sm border border-slate-200">
                        <i className="fa fa-file-invoice-dollar opacity-10"></i>
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mt-6">Select an invoice to view details</h3>
                </div>
            )}
        </div>

        {/* 4. Right: Action Console Sidebar */}
        <div className="w-80 bg-slate-900 flex flex-col h-full overflow-hidden border-l border-white/5 shrink-0">
            {selectedBill ? (
                <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
                    <div className="p-6 border-b border-white/10 bg-black/20 shrink-0">
                        <h6 className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-4">Command Console</h6>
                        <div className="space-y-2">
                             <button onClick={handlePrintInvoice} className="w-full flex items-center justify-between p-3 bg-white/5 border border-white/5 hover:bg-white/10 transition-all rounded-xl">
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Reprint Invoice</span>
                                <i className="fa fa-print text-blue-400"></i>
                             </button>
                             <button onClick={handleEmailStatement} className="w-full flex items-center justify-between p-3 bg-white/5 border border-white/5 hover:bg-white/10 transition-all rounded-xl">
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Email Statement</span>
                                <i className="fa fa-envelope text-blue-400"></i>
                             </button>
                        </div>
                    </div>

                    <div className="flex-1 p-6 space-y-6">
                        {selectedBill.status !== 'Cleared' ? (
                            <div className="space-y-6">
                                <h6 className="text-[10px] font-black text-rose-400 uppercase tracking-widest border-b border-white/10 pb-2">Process Receipt</h6>
                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClass}>Payment Mode</label>
                                        <select className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs font-black text-white outline-none focus:ring-1 focus:ring-blue-500">
                                            <option>Cash (KES)</option>
                                            <option>M-Pesa Express</option>
                                            <option>Visa / Mastercard</option>
                                            <option>Insurance Authorization</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Amount Tendered</label>
                                        <input type="number" defaultValue={selectedBill.balance} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-lg font-black text-emerald-400 outline-none focus:ring-1 focus:ring-emerald-500" />
                                    </div>
                                    <button 
                                        onClick={handlePostPayment}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all transform active:scale-95"
                                    >
                                        Confirm & Post Payment
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-[2rem] text-center space-y-6 animate-in zoom-in-95">
                                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl mx-auto shadow-xl">
                                    <i className="fa fa-check-double"></i>
                                </div>
                                <div>
                                    <h5 className="text-sm font-black text-white uppercase tracking-tight leading-none">Invoice Settled</h5>
                                    <p className="text-[10px] text-emerald-400 font-bold uppercase mt-2">Zero balance remaining</p>
                                </div>
                                <button className="w-full py-2 bg-white/5 text-white rounded-xl text-[9px] font-black uppercase border border-white/10">View Audit Log</button>
                            </div>
                        )}

                        <div className="pt-6 border-t border-white/5">
                             <h6 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Account Integrity</h6>
                             <button className="w-full flex items-center p-4 bg-white/5 border border-white/5 hover:bg-white/10 transition-all rounded-2xl group">
                                <div className="w-10 h-10 rounded-xl bg-orange-600/20 flex items-center justify-center text-orange-500 mr-4 group-hover:bg-orange-600 group-hover:text-white transition-all"><i className="fa fa-shield-halved"></i></div>
                                <div className="text-left">
                                    <p className="text-[11px] font-black text-slate-200 uppercase tracking-tighter">Dispute Entry</p>
                                    <p className="text-[9px] text-slate-500 font-bold uppercase">Log billing anomaly</p>
                                </div>
                             </button>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-black/40 border-t border-white/5 shrink-0 flex gap-2">
                        <button onClick={() => setSelectedBillId(null)} className="flex-1 py-2 bg-white/10 text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white/20 transition-all">Deselect</button>
                        <button className="flex-1 py-2 bg-red-600 text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">Void Invoice</button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full p-10 text-center text-slate-600 animate-in fade-in">
                    <div className="w-16 h-16 bg-white/5 rounded-none flex items-center justify-center mb-6 shadow-inner border border-white/5">
                        <i className="fa fa-money-check-alt text-2xl opacity-20"></i>
                    </div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Billing Console</h4>
                    <p className="text-[9px] font-medium mt-2 leading-relaxed max-w-[150px] uppercase opacity-40 italic">Select an invoice to enable revenue collection tools</p>
                </div>
            )}
        </div>
      </div>

      <PatientSelectorModal 
          isOpen={showPatientSelector} 
          onClose={() => setShowPatientSelector(false)} 
          title="Select Patient for Billing"
      />

      <div className="hidden">
          <PrintableInvoice 
            ref={printRef} 
            bill={selectedBill!} 
            patient={activePatient} 
            lines={billLines} 
          />
      </div>
    </div>
  );
};

export default PatientBills;
