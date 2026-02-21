import React, { useState, useMemo } from 'react';

interface ARInvoice {
    id: string;
    date: string;
    debtor: string;
    ref: string;
    amount: number;
    paid: number;
    status: 'Sent' | 'Paid' | 'Partial' | 'Overdue';
    aging: number;
}

const ARInvoices: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
    
    // Modal States
    const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
    const [showStatementRunModal, setShowStatementRunModal] = useState(false);

    // Form States
    const [newInvoice, setNewInvoice] = useState({
        debtor: '',
        date: new Date().toISOString().split('T')[0],
        ref: '',
        amount: '',
        status: 'Sent'
    });

    const [statementParams, setStatementParams] = useState({
        debtor: 'All',
        startDate: '',
        endDate: '',
        includePaid: false
    });

    const [invoices, setInvoices] = useState<ARInvoice[]>([
        { id: 'INV-2023-001', date: '2023-10-20', debtor: 'Jubilee Insurance', ref: 'CLM-99281', amount: 450000, paid: 150000, status: 'Partial', aging: 4 },
        { id: 'INV-2023-002', date: '2023-10-15', debtor: 'AON Minet', ref: 'CLM-99282', amount: 120000, paid: 0, status: 'Sent', aging: 9 },
        { id: 'INV-2023-003', date: '2023-09-22', debtor: 'Equity Bank Corporate', ref: 'CLM-99283', amount: 85000, paid: 85000, status: 'Paid', aging: 32 },
        { id: 'INV-2023-004', date: '2023-08-10', debtor: 'Britam', ref: 'CLM-99284', amount: 210000, paid: 0, status: 'Overdue', aging: 75 },
    ]);

    const handleCreateInvoice = (e: React.FormEvent) => {
        e.preventDefault();
        const invoice: ARInvoice = {
            id: `INV-2023-${(invoices.length + 1).toString().padStart(3, '0')}`,
            date: newInvoice.date,
            debtor: newInvoice.debtor,
            ref: newInvoice.ref,
            amount: Number(newInvoice.amount),
            paid: 0,
            status: newInvoice.status as any,
            aging: 0
        };
        setInvoices([invoice, ...invoices]);
        setShowCreateInvoiceModal(false);
        setNewInvoice({ debtor: '', date: new Date().toISOString().split('T')[0], ref: '', amount: '', status: 'Sent' });
    };

    const handleStatementRun = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock Statement Run Logic
        alert(`Generating Statement for ${statementParams.debtor} from ${statementParams.startDate} to ${statementParams.endDate}`);
        setShowStatementRunModal(false);
    };

    const filteredInvoices = useMemo(() => 
        invoices.filter(i => i.debtor.toLowerCase().includes(searchTerm.toLowerCase()) || i.id.includes(searchTerm)),
    [searchTerm, invoices]);

    const selectedInvoice = useMemo(() => invoices.find(i => i.id === selectedInvoiceId), [selectedInvoiceId, invoices]);

    const getStatusStyle = (status: ARInvoice['status']) => {
        switch(status) {
            case 'Paid': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Overdue': return 'bg-rose-50 text-rose-700 border-rose-200';
            case 'Partial': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="animate-bottom h-[calc(100vh-100px)] flex flex-col font-helvetica overflow-hidden -m-4 md:-m-6">
            {/* Header: Indigo Clinical Style */}
            <div className="bg-slate-900 border-l-[6px] border-l-indigo-600 p-3 flex justify-between items-center shrink-0">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xl shadow-lg">
                        <i className="fa fa-file-invoice"></i>
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-tighter leading-none">Accounts Receivable</h2>
                        <p className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Corporate & Insurance Ledger</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setShowCreateInvoiceModal(true)} className="bg-indigo-600 text-white px-5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition">Create Invoice</button>
                    <button onClick={() => setShowStatementRunModal(true)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition">Statement Run</button>
                </div>
            </div>

            {/* Aging Monitor Bar */}
            <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-4 shrink-0 overflow-x-auto scrollbar-hide">
                {[
                    { label: 'Current (0-30)', val: 'KES 2.4M', color: 'text-emerald-600' },
                    { label: 'Overdue (31-60)', val: 'KES 850k', color: 'text-orange-500' },
                    { label: 'Critical (61+)', val: 'KES 420k', color: 'text-rose-600' },
                    { label: 'Unallocated', val: 'KES 120k', color: 'text-blue-500' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white border border-slate-200 px-4 py-1.5 rounded-xl flex items-center gap-3 min-w-[160px] shadow-sm">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter leading-none">{stat.label}</span>
                            <span className={`text-[11px] font-black ${stat.color} mt-1`}>{stat.val}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex-1 flex overflow-hidden min-h-0">
                {/* Left: Invoice Registry */}
                <div className="w-96 bg-white border-r border-slate-200 flex flex-col shrink-0">
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                        <div className="relative">
                            <i className="fa fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
                            <input 
                                type="text" 
                                placeholder="Search Debtor or INV#..." 
                                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold outline-none focus:ring-1 focus:ring-indigo-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-50 scrollbar-hide">
                        {filteredInvoices.map(inv => (
                            <div 
                                key={inv.id} 
                                onClick={() => setSelectedInvoiceId(inv.id)}
                                className={`p-4 cursor-pointer transition-all border-l-4 ${selectedInvoiceId === inv.id ? 'bg-indigo-50 border-l-indigo-600 shadow-inner' : 'hover:bg-gray-50 border-l-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{inv.id}</span>
                                    <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase border ${getStatusStyle(inv.status)}`}>{inv.status}</span>
                                </div>
                                <h6 className="text-xs font-black text-gray-800 uppercase truncate">{inv.debtor}</h6>
                                <div className="flex justify-between items-end mt-2">
                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-none">
                                        <p>{inv.date}</p>
                                        <p className="mt-1">Aging: <span className={inv.aging > 30 ? 'text-rose-500' : 'text-slate-500'}>{inv.aging} Days</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-slate-800 tracking-tighter">KES {inv.amount.toLocaleString()}</p>
                                        {inv.amount - inv.paid > 0 && <p className="text-[8px] font-black text-rose-500 uppercase">Bal: {(inv.amount - inv.paid).toLocaleString()}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Document Inspector */}
                <div className="flex-1 bg-slate-100 p-6 overflow-y-auto scrollbar-hide flex justify-center">
                    {selectedInvoice ? (
                        <div className="bg-white w-full max-w-[21cm] min-h-[29.7cm] shadow-2xl p-16 flex flex-col relative animate-in zoom-in-95 duration-300">
                            {/* Watermark for Overdue */}
                            {selectedInvoice.status === 'Overdue' && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                                    <span className="text-[12rem] font-black uppercase -rotate-45 text-rose-600">OVERDUE</span>
                                </div>
                            )}

                            <div className="flex justify-between items-start border-b-4 border-slate-900 pb-6 mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl">
                                        <i className="fa fa-hospital-alt"></i>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">UltraHub Hospital</h1>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">Accounts Receivable Department</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Invoice</h2>
                                    <p className="text-sm font-mono font-black text-indigo-600 mt-2">#{selectedInvoice.id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-16 mb-12 text-[11px]">
                                <div className="space-y-4">
                                    <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">Billed To (Debtor)</h6>
                                    <div className="space-y-1">
                                        <p className="text-lg font-black text-slate-800 uppercase">{selectedInvoice.debtor}</p>
                                        <p className="font-bold text-slate-500">Claim ID: {selectedInvoice.ref}</p>
                                        <p className="text-slate-400">P.O Box 1029, Nairobi</p>
                                        <p className="text-slate-400">finance@provider.com</p>
                                    </div>
                                </div>
                                <div className="text-right space-y-4">
                                    <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">Invoice Context</h6>
                                    <div className="space-y-2">
                                        <p><span className="text-gray-400 uppercase font-bold mr-4">Issue Date:</span> <span className="font-black">{selectedInvoice.date}</span></p>
                                        <p><span className="text-gray-400 uppercase font-bold mr-4">Due Date:</span> <span className="font-black text-rose-600">30 Oct 2023</span></p>
                                        <p><span className="text-gray-400 uppercase font-bold mr-4">Currency:</span> <span className="font-black">KES (Kenya Shilling)</span></p>
                                    </div>
                                </div>
                            </div>

                            <table className="w-full text-left text-[10px] mb-12 border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 text-white font-black uppercase tracking-widest">
                                        <th className="px-6 py-3">Service / Item Details</th>
                                        <th className="px-4 py-3 text-center">Qty</th>
                                        <th className="px-6 py-3 text-right">Unit Rate</th>
                                        <th className="px-6 py-3 text-right">Net Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700 font-bold uppercase">
                                    <tr>
                                        <td className="px-6 py-4">Clinical Consultation (Specialist)</td>
                                        <td className="px-4 py-4 text-center">1</td>
                                        <td className="px-6 py-4 text-right">3,000.00</td>
                                        <td className="px-6 py-4 text-right">3,000.00</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4">Laboratory Diagnostics Package</td>
                                        <td className="px-4 py-4 text-center">1</td>
                                        <td className="px-6 py-4 text-right">12,500.00</td>
                                        <td className="px-6 py-4 text-right">12,500.00</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="flex justify-end mt-auto">
                                <div className="w-72 space-y-3">
                                    <div className="flex justify-between items-end text-xs font-bold text-slate-400">
                                        <span className="uppercase">Subtotal</span>
                                        <span className="text-slate-700">15,500.00</span>
                                    </div>
                                    <div className="flex justify-between items-end text-xs font-bold text-slate-400">
                                        <span className="uppercase">Tax (Exempt)</span>
                                        <span className="text-slate-700">0.00</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-3 border-t-2 border-slate-900">
                                        <span className="text-[10px] font-black uppercase text-slate-900">Consolidated Total</span>
                                        <span className="text-2xl font-black text-indigo-600 tracking-tighter">KES {selectedInvoice.amount.toLocaleString()}.00</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-20 flex justify-between items-end opacity-40">
                                <div className="space-y-1">
                                    <p className="text-[8px] font-black uppercase">System Generated Record</p>
                                    <p className="text-[7px] font-mono">UID: {selectedInvoice.id}-v3.1</p>
                                </div>
                                <div className="w-48 h-0.5 bg-slate-900"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-slate-300 space-y-6">
                            <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-5xl shadow-sm border border-slate-200">
                                <i className="fa fa-mouse-pointer opacity-10"></i>
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Select Invoice to Preview</h3>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Invoice Modal */}
            {showCreateInvoiceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
                        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                            <h3 className="text-lg font-black uppercase tracking-tight">Create New Invoice</h3>
                            <button onClick={() => setShowCreateInvoiceModal(false)} className="text-white/50 hover:text-white"><i className="fa fa-times"></i></button>
                        </div>
                        <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Debtor / Payer</label>
                                <select 
                                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-500"
                                    value={newInvoice.debtor}
                                    onChange={e => setNewInvoice({...newInvoice, debtor: e.target.value})}
                                    required
                                >
                                    <option value="">Select Debtor...</option>
                                    <option value="Jubilee Insurance">Jubilee Insurance</option>
                                    <option value="AON Minet">AON Minet</option>
                                    <option value="Britam">Britam</option>
                                    <option value="Equity Bank Corporate">Equity Bank Corporate</option>
                                    <option value="KCB">KCB</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Invoice Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-500"
                                        value={newInvoice.date}
                                        onChange={e => setNewInvoice({...newInvoice, date: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Reference / Claim ID</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-500"
                                        placeholder="e.g. CLM-XXXX"
                                        value={newInvoice.ref}
                                        onChange={e => setNewInvoice({...newInvoice, ref: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Total Amount (KES)</label>
                                <input 
                                    type="number" 
                                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-500"
                                    placeholder="0.00"
                                    value={newInvoice.amount}
                                    onChange={e => setNewInvoice({...newInvoice, amount: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="pt-4 flex justify-end gap-2">
                                <button type="button" onClick={() => setShowCreateInvoiceModal(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-indigo-700 shadow-lg">Create Invoice</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Statement Run Modal */}
            {showStatementRunModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                        <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                            <h3 className="text-lg font-black uppercase tracking-tight">Run Statement</h3>
                            <button onClick={() => setShowStatementRunModal(false)} className="text-white/50 hover:text-white"><i className="fa fa-times"></i></button>
                        </div>
                        <form onSubmit={handleStatementRun} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Select Debtor</label>
                                <select 
                                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-500"
                                    value={statementParams.debtor}
                                    onChange={e => setStatementParams({...statementParams, debtor: e.target.value})}
                                >
                                    <option value="All">All Debtors</option>
                                    <option value="Jubilee Insurance">Jubilee Insurance</option>
                                    <option value="AON Minet">AON Minet</option>
                                    <option value="Britam">Britam</option>
                                    <option value="Equity Bank Corporate">Equity Bank Corporate</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">Start Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-500"
                                        value={statementParams.startDate}
                                        onChange={e => setStatementParams({...statementParams, startDate: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase">End Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold outline-none focus:ring-1 focus:ring-indigo-500"
                                        value={statementParams.endDate}
                                        onChange={e => setStatementParams({...statementParams, endDate: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="includePaid"
                                    checked={statementParams.includePaid}
                                    onChange={e => setStatementParams({...statementParams, includePaid: e.target.checked})}
                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="includePaid" className="text-xs font-bold text-slate-600">Include Fully Paid Invoices</label>
                            </div>
                            <div className="pt-4 flex justify-end gap-2">
                                <button type="button" onClick={() => setShowStatementRunModal(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-lg hover:bg-indigo-700 shadow-lg">Generate Report</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ARInvoices;