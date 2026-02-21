import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

interface Receipt {
    id: string;
    time: string;
    patient: string;
    op: string;
    mode: string;
    cashier: string;
    amount: number;
    status: string;
}

const PrintableReceipt = React.forwardRef<HTMLDivElement, { receipt: Receipt | null }>((props, ref) => {
    const { receipt } = props;
    if (!receipt) return null;

    return (
        <div ref={ref} className="bg-white p-8 max-w-[10cm] mx-auto text-slate-800 hidden print:block print:w-full">
            <div className="text-center border-b border-slate-200 pb-4 mb-4">
                <h1 className="text-xl font-black uppercase tracking-tight">UltraHub Hospital</h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Official Payment Receipt</p>
                <p className="text-[8px] text-slate-400 mt-1">Nairobi, Kenya • +254 700 000 000</p>
            </div>

            <div className="space-y-3 text-[10px] mb-6">
                <div className="flex justify-between">
                    <span className="text-slate-400 uppercase font-bold">Receipt No:</span>
                    <span className="font-black">{receipt.id}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400 uppercase font-bold">Date/Time:</span>
                    <span className="font-black">{new Date().toLocaleDateString()} {receipt.time}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2">
                    <span className="text-slate-400 uppercase font-bold">Patient:</span>
                    <span className="font-black uppercase">{receipt.patient}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-400 uppercase font-bold">OP Number:</span>
                    <span className="font-black">{receipt.op}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2">
                    <span className="text-slate-400 uppercase font-bold">Payment Mode:</span>
                    <span className="font-black uppercase">{receipt.mode}</span>
                </div>
            </div>

            <div className="border-t-2 border-slate-900 py-4 mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase">Total Paid</span>
                    <span className="text-lg font-black tracking-tighter">KES {receipt.amount.toLocaleString()}.00</span>
                </div>
            </div>

            <div className="text-[8px] text-center space-y-2 text-slate-400">
                <p className="font-bold uppercase tracking-widest">Thank you for choosing UltraHub</p>
                <p className="italic">Served by: {receipt.cashier}</p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="font-mono">TXN: {btoa(receipt.id).slice(0, 12)}</p>
                </div>
            </div>
        </div>
    );
});

const Receipts: React.FC = () => {
    const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0]);
    const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
    const [printingReceipt, setPrintingReceipt] = useState<Receipt | null>(null);
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        onAfterPrint: () => setPrintingReceipt(null)
    });

    const triggerPrint = (r: Receipt) => {
        setPrintingReceipt(r);
        setTimeout(() => {
            handlePrint();
        }, 100);
    };

    const receipts: Receipt[] = [
        { id: 'RCP-1029', time: '11:45 AM', patient: 'JANE DOE', op: 'OPD-23-001', mode: 'Cash', cashier: 'Admin', amount: 2500, status: 'Confirmed' },
        { id: 'RCP-1030', time: '11:30 AM', patient: 'JOHN SMITH', op: 'OPD-23-042', mode: 'M-Pesa', cashier: 'User_B', amount: 1200, status: 'Confirmed' },
        { id: 'RCP-1031', time: '11:15 AM', patient: 'SARAH CONNOR', op: 'OPD-23-088', mode: 'Visa', cashier: 'Admin', amount: 8500, status: 'Confirmed' },
        { id: 'RCP-1032', time: '10:50 AM', patient: 'PETER PAN', op: 'OPD-23-102', mode: 'Cash', cashier: 'Admin', amount: 500, status: 'Confirmed' },
    ];

    return (
        <div className="animate-bottom space-y-6">
            {/* Cashier's Ribbon: Vibrant Header */}
            <div className="bg-blue-600 text-white rounded-3xl shadow-xl p-8 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="relative z-10 space-y-2">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Financial Collections Log</h2>
                    <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest opacity-80">Live Transaction Spool & Reconciliation</p>
                </div>
                
                <div className="relative z-10 flex gap-8">
                    <div className="text-center px-8 border-r border-white/20">
                        <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest leading-none mb-2">Shift Total</p>
                        <p className="text-3xl font-black tracking-tighter">KES 12,700.00</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest leading-none mb-2">Volume</p>
                        <p className="text-3xl font-black tracking-tighter">42 <span className="text-xs font-bold opacity-40">TXNS</span></p>
                    </div>
                </div>

                {/* Industrial Watermark */}
                <i className="fa fa-cash-register absolute -left-6 -bottom-6 text-9xl text-white/10 rotate-12"></i>
            </div>

            {/* Context Control Bar */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-3 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Period:</span>
                        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-[10px] font-black text-slate-800 outline-none" />
                        <span className="text-gray-300 font-black">TO</span>
                        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="bg-white border border-gray-200 rounded-lg px-3 py-1 text-[10px] font-black text-slate-800 outline-none mr-2" />
                    </div>
                    <div className="h-6 w-px bg-gray-200"></div>
                    <div className="relative">
                        <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]"></i>
                        <input type="text" placeholder="Filter by Receipt / Patient..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-[10px] font-bold w-64 outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white border border-gray-300 text-slate-700 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition shadow-sm"><i className="fa fa-download mr-2"></i> Export Log</button>
                    <button className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition">End Shift Run</button>
                </div>
            </div>

            {/* High Density Table */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-[11px] border-collapse">
                    <thead className="bg-slate-50 border-b border-gray-200 text-slate-500 font-black uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Receipt No</th>
                            <th className="px-6 py-4">Time</th>
                            <th className="px-6 py-4">Payer / Ident.</th>
                            <th className="px-6 py-4 text-center">Mode</th>
                            <th className="px-6 py-4 text-right">Net Amount</th>
                            <th className="px-6 py-4 text-center">Auth</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-slate-700 font-bold uppercase">
                        {receipts.map(r => (
                            <tr key={r.id} className="hover:bg-blue-50/50 transition-colors group">
                                <td className="px-6 py-3 font-mono font-black text-blue-600">{r.id}</td>
                                <td className="px-6 py-3 text-slate-400 font-mono text-[10px]">{r.time}</td>
                                <td className="px-6 py-3">
                                    <div className="font-black text-slate-800 leading-none">{r.patient}</div>
                                    <div className="text-[9px] text-slate-400 font-bold mt-1 tracking-tighter">{r.op}</div>
                                </td>
                                <td className="px-6 py-3 text-center">
                                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[9px] font-black">{r.mode}</span>
                                </td>
                                <td className="px-6 py-3 text-right font-black text-slate-900 text-sm tracking-tighter">
                                    {r.amount.toLocaleString()}.00
                                </td>
                                <td className="px-6 py-3 text-center">
                                    <div className="w-6 h-6 rounded bg-gray-100 text-gray-400 flex items-center justify-center mx-auto text-[8px] font-black border border-gray-200" title={r.cashier}>{r.cashier.charAt(0)}</div>
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => triggerPrint(r)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Reprint"><i className="fa fa-print"></i></button>
                                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Void Request"><i className="fa fa-ban"></i></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Data Pagination / Status */}
            <div className="flex justify-between items-center text-[10px] font-black text-gray-400 uppercase px-4 pb-12">
                <span>Showing {receipts.length} transactions in period</span>
                <div className="flex gap-1">
                    <button className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Prev</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-lg shadow-sm">1</button>
                    <button className="px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Next</button>
                </div>
            </div>

            <div className="hidden">
                <PrintableReceipt ref={printRef} receipt={printingReceipt} />
            </div>
        </div>
    );
};

export default Receipts;