import React, { useState, useMemo } from 'react';

interface Quotation {
    id: string;
    name: string;
    date: string;
    amount: number;
    status: 'Draft' | 'Sent' | 'Approved';
}

const ProFormaInvoices: React.FC = () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const quotations: Quotation[] = [
        { id: 'QT-1001', name: 'JANE DOE', date: '24 Oct 2023', amount: 25000, status: 'Draft' },
        { id: 'QT-1002', name: 'JOHN SMITH', date: '23 Oct 2023', amount: 120000, status: 'Sent' },
        { id: 'QT-1003', name: 'CORPORATE HEALTH EVENT', date: '22 Oct 2023', amount: 55000, status: 'Approved' },
    ];

    const filtered = useMemo(() => 
        quotations.filter(q => q.name.toLowerCase().includes(searchTerm.toLowerCase()) || q.id.includes(searchTerm)),
    [searchTerm]);

    const selected = useMemo(() => quotations.find(q => q.id === selectedId), [selectedId]);

    return (
        <div className="animate-bottom h-[calc(100vh-100px)] flex flex-col font-helvetica overflow-hidden -m-4 md:-m-6">
            {/* Header: Indigo Suite */}
            <div className="bg-slate-900 border-l-[6px] border-l-indigo-600 p-3 flex justify-between items-center shrink-0">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xl shadow-lg">
                        <i className="fa fa-file-alt"></i>
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-tighter leading-none">Pro-Forma Invoices</h2>
                        <p className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Quotations & Cost Estimation</p>
                    </div>
                </div>
                <button className="bg-indigo-600 text-white px-5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition">New Quotation</button>
            </div>

            <div className="flex-1 flex overflow-hidden min-h-0 bg-white">
                {/* Left: Registry */}
                <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                        <div className="relative">
                            <i className="fa fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
                            <input 
                                type="text" 
                                placeholder="Search quotations..." 
                                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-50 scrollbar-hide">
                        {filtered.map(q => (
                            <div 
                                key={q.id} 
                                onClick={() => setSelectedId(q.id)}
                                className={`p-4 cursor-pointer transition-all border-l-4 ${selectedId === q.id ? 'bg-indigo-50 border-l-indigo-600 shadow-inner' : 'hover:bg-gray-50 border-l-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded tracking-tighter">{q.id}</span>
                                    <span className={`text-[8px] px-2 py-0.5 rounded-none font-black uppercase border ${q.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>{q.status}</span>
                                </div>
                                <h6 className="text-xs font-black text-gray-800 uppercase truncate">{q.name}</h6>
                                <div className="flex justify-between items-end mt-2">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{q.date}</span>
                                    <span className="text-xs font-black text-slate-800">KES {q.amount.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Preview Canvas */}
                <div className="flex-1 bg-slate-200 p-8 overflow-y-auto scrollbar-hide flex flex-col items-center">
                    {selected ? (
                        <div className="bg-white w-full max-w-[21cm] min-h-[29.7cm] shadow-2xl p-16 flex flex-col relative animate-in zoom-in-95 duration-300">
                             <div className="flex justify-between items-start border-b-4 border-slate-900 pb-6 mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl">
                                        <i className="fa fa-calculator"></i>
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none">UltraHub</h1>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-2">Cost Estimation Certificate</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Pro-Forma</h2>
                                    <p className="text-sm font-mono font-black text-indigo-600 mt-2">#{selected.id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-16 mb-12 text-[11px]">
                                <div className="space-y-4">
                                    <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">Prospective Client</h6>
                                    <p className="text-lg font-black text-slate-800 uppercase">{selected.name}</p>
                                </div>
                                <div className="text-right space-y-4">
                                    <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1">Validation Period</h6>
                                    <p className="text-slate-500 font-bold uppercase">Issued: <span className="text-slate-800 font-black ml-2">{selected.date}</span></p>
                                    <p className="text-slate-500 font-bold uppercase">Valid For: <span className="text-slate-800 font-black ml-2">30 Days</span></p>
                                </div>
                            </div>

                            <table className="w-full text-left text-[10px] mb-12 border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 text-white font-black uppercase tracking-widest">
                                        <th className="px-6 py-3">Estimated Service Point</th>
                                        <th className="px-4 py-3 text-center">Qty</th>
                                        <th className="px-6 py-3 text-right">Standard Rate</th>
                                        <th className="px-6 py-3 text-right">Estimated Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700 font-bold uppercase">
                                    <tr>
                                        <td className="px-6 py-4">Inpatient Surgical Procedure (Standard)</td>
                                        <td className="px-4 py-4 text-center">1</td>
                                        <td className="px-6 py-4 text-right">20,000.00</td>
                                        <td className="px-6 py-4 text-right">20,000.00</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4">Bed Charges (Shared Ward - 5 Days)</td>
                                        <td className="px-4 py-4 text-center">5</td>
                                        <td className="px-6 py-4 text-right">1,000.00</td>
                                        <td className="px-6 py-4 text-right">5,000.00</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="mt-auto pt-8 border-t-2 border-slate-900 flex justify-between items-center">
                                <div className="text-[10px] font-bold text-slate-400 uppercase max-w-sm italic">
                                    This is an estimate only and does not constitute a final bill. Final costs may vary based on clinical complications or material consumption.
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase text-slate-900">Total Estimation</p>
                                    <p className="text-3xl font-black text-indigo-600 tracking-tighter leading-none mt-2">KES {selected.amount.toLocaleString()}.00</p>
                                </div>
                            </div>

                            <div className="absolute bottom-6 right-6 flex gap-2">
                                <button className="bg-slate-900 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">Convert to Invoice</button>
                                <button className="bg-white border border-slate-200 text-slate-600 px-6 py-2 rounded-xl text-[10px] font-black uppercase">Print Copy</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 h-full">
                            <i className="fa fa-file-alt text-6xl opacity-10 mb-4"></i>
                            <h3 className="text-sm font-black uppercase tracking-widest">Select Quote to Review</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProFormaInvoices;