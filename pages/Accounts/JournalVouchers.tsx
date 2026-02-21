
import React, { useState, useMemo } from 'react';

interface JournalLine {
  id: number;
  accountId: string;
  description: string;
  debit: number;
  credit: number;
}

interface JournalVoucher {
  id: string;
  date: string;
  ref: string;
  narration: string;
  status: 'Draft' | 'Posted';
  total: number;
  lines: JournalLine[];
}

// Mock Data
const MOCK_JVS: JournalVoucher[] = [
   {
      id: 'JV-2023-001', date: '2023-10-24', ref: 'ADJ-OCT-01', narration: 'Petty Cash Replenishment', status: 'Draft', total: 15000,
      lines: [
         { id: 1, accountId: '1110 - Cash on Hand', description: 'Replenish petty cash', debit: 15000, credit: 0 },
         { id: 2, accountId: '1120 - Bank KCB', description: 'Withdrawal for PC', debit: 0, credit: 15000 }
      ]
   },
   {
      id: 'JV-2023-002', date: '2023-10-23', ref: 'REV-RECLASS', narration: 'Revenue Reclassification', status: 'Posted', total: 5000,
      lines: [
         { id: 1, accountId: '4100 - Consultation', description: 'Correction entry', debit: 5000, credit: 0 },
         { id: 2, accountId: '4200 - Pharmacy', description: 'Correction entry', debit: 0, credit: 5000 }
      ]
   }
];

const JournalVouchers: React.FC = () => {
  const [vouchers, setVouchers] = useState<JournalVoucher[]>(MOCK_JVS);
  const [selectedJvId, setSelectedJvId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [activeJv, setActiveJv] = useState<JournalVoucher | null>(null);

  const handleSelect = (jv: JournalVoucher) => {
     setActiveJv(jv);
     setSelectedJvId(jv.id);
     setIsCreating(false);
  };

  const handleCreate = () => {
     const newJv: JournalVoucher = {
        id: `JV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        date: new Date().toISOString().split('T')[0],
        ref: '',
        narration: '',
        status: 'Draft',
        total: 0,
        lines: [
           { id: Date.now(), accountId: '', description: '', debit: 0, credit: 0 },
           { id: Date.now() + 1, accountId: '', description: '', debit: 0, credit: 0 }
        ]
     };
     setActiveJv(newJv);
     setSelectedJvId(null);
     setIsCreating(true);
  };

  const updateLine = (id: number, field: keyof JournalLine, value: any) => {
     if (!activeJv) return;
     const updatedLines = activeJv.lines.map(line => 
        line.id === id ? { ...line, [field]: value } : line
     );
     setActiveJv({ ...activeJv, lines: updatedLines });
  };

  const addLine = () => {
     if (!activeJv) return;
     setActiveJv({
        ...activeJv,
        lines: [...activeJv.lines, { id: Date.now(), accountId: '', description: '', debit: 0, credit: 0 }]
     });
  };

  const removeLine = (id: number) => {
     if (!activeJv) return;
     setActiveJv({ ...activeJv, lines: activeJv.lines.filter(l => l.id !== id) });
  };

  const totals = useMemo(() => {
     if (!activeJv) return { debit: 0, credit: 0, diff: 0 };
     const debit = activeJv.lines.reduce((sum, l) => sum + Number(l.debit), 0);
     const credit = activeJv.lines.reduce((sum, l) => sum + Number(l.credit), 0);
     return { debit, credit, diff: debit - credit };
  }, [activeJv]);

  return (
    <div className="animate-bottom space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm shrink-0">
          <div>
             <h2 className="text-xl font-bold text-gray-800">Journal Vouchers</h2>
             <p className="text-xs text-gray-500">General Ledger Adjustments</p>
          </div>
          <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow hover:bg-blue-700 transition">
             <i className="fa fa-plus mr-2"></i> New Journal Entry
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
         
         {/* Left: JV List */}
         <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             <div className="p-3 bg-gray-50 border-b border-gray-100">
                <input type="text" placeholder="Search vouchers..." className="w-full bg-white border border-gray-200 rounded text-xs px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500" />
             </div>
             <div className="flex-1 overflow-y-auto">
                {vouchers.map(jv => (
                   <div 
                      key={jv.id} 
                      onClick={() => handleSelect(jv)}
                      className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${selectedJvId === jv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                   >
                      <div className="flex justify-between items-center mb-1">
                         <span className="font-bold text-xs text-gray-800">{jv.id}</span>
                         <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${jv.status === 'Posted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{jv.status}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 truncate">{jv.narration}</p>
                      <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                         <span>{jv.date}</span>
                         <span className="font-black text-gray-600">KES {jv.total.toLocaleString()}</span>
                      </div>
                   </div>
                ))}
             </div>
         </div>

         {/* Right: JV Editor */}
         <div className="lg:col-span-9 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            {activeJv ? (
               <>
                  <div className="p-6 border-b border-gray-100 bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                         <h5 className="text-lg font-black text-gray-800 uppercase">{activeJv.id} <span className="text-gray-400 text-sm font-medium ml-2">{activeJv.status === 'Draft' ? '(Draft)' : '(Read Only)'}</span></h5>
                         <div className="flex space-x-2">
                             {activeJv.status === 'Draft' && (
                                <button className="bg-green-600 text-white px-4 py-1.5 rounded text-xs font-bold uppercase shadow hover:bg-green-700">Post Journal</button>
                             )}
                             <button className="bg-white border border-gray-300 text-gray-600 px-4 py-1.5 rounded text-xs font-bold uppercase hover:bg-gray-50">Print</button>
                         </div>
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Date</label>
                            <input type="date" value={activeJv.date} className="w-full p-2 bg-white border border-gray-200 rounded text-xs outline-none" disabled={activeJv.status !== 'Draft'} />
                         </div>
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Reference</label>
                            <input type="text" value={activeJv.ref} className="w-full p-2 bg-white border border-gray-200 rounded text-xs outline-none" disabled={activeJv.status !== 'Draft'} />
                         </div>
                         <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Narration</label>
                            <input type="text" value={activeJv.narration} className="w-full p-2 bg-white border border-gray-200 rounded text-xs outline-none" disabled={activeJv.status !== 'Draft'} />
                         </div>
                      </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-0">
                     <table className="w-full text-left text-xs">
                        <thead className="bg-gray-100 border-b border-gray-200 text-gray-600 font-bold uppercase sticky top-0 z-10">
                           <tr>
                              <th className="px-4 py-3">Account</th>
                              <th className="px-4 py-3">Description</th>
                              <th className="px-4 py-3 text-right w-32">Debit</th>
                              <th className="px-4 py-3 text-right w-32">Credit</th>
                              <th className="px-4 py-3 w-10"></th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                           {activeJv.lines.map((line) => (
                              <tr key={line.id} className="hover:bg-blue-50/30 group">
                                 <td className="px-4 py-2">
                                    <input 
                                       type="text" 
                                       value={line.accountId}
                                       onChange={(e) => updateLine(line.id, 'accountId', e.target.value)}
                                       className="w-full bg-transparent outline-none font-medium" 
                                       placeholder="Search account..."
                                       disabled={activeJv.status !== 'Draft'}
                                    />
                                 </td>
                                 <td className="px-4 py-2">
                                    <input 
                                       type="text" 
                                       value={line.description}
                                       onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                                       className="w-full bg-transparent outline-none" 
                                       placeholder="Line description..."
                                       disabled={activeJv.status !== 'Draft'}
                                    />
                                 </td>
                                 <td className="px-4 py-2 text-right">
                                    <input 
                                       type="number" 
                                       value={line.debit}
                                       onChange={(e) => updateLine(line.id, 'debit', Number(e.target.value))}
                                       className="w-full bg-transparent outline-none text-right font-mono" 
                                       disabled={activeJv.status !== 'Draft'}
                                    />
                                 </td>
                                 <td className="px-4 py-2 text-right">
                                    <input 
                                       type="number" 
                                       value={line.credit}
                                       onChange={(e) => updateLine(line.id, 'credit', Number(e.target.value))}
                                       className="w-full bg-transparent outline-none text-right font-mono" 
                                       disabled={activeJv.status !== 'Draft'}
                                    />
                                 </td>
                                 <td className="px-4 py-2 text-center">
                                    {activeJv.status === 'Draft' && (
                                       <button onClick={() => removeLine(line.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa fa-times"></i></button>
                                    )}
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                     {activeJv.status === 'Draft' && (
                        <button onClick={addLine} className="m-4 text-xs font-bold text-blue-600 hover:underline flex items-center"><i className="fa fa-plus mr-1"></i> Add Line</button>
                     )}
                  </div>

                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <div className="flex justify-end gap-8 text-sm font-black text-gray-700">
                          <div className="text-right">
                             <p className="text-[10px] text-gray-400 uppercase font-bold">Total Debit</p>
                             <p className="text-blue-600">{totals.debit.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] text-gray-400 uppercase font-bold">Total Credit</p>
                             <p className="text-blue-600">{totals.credit.toLocaleString()}</p>
                          </div>
                          <div className="text-right pl-6 border-l border-gray-300">
                             <p className="text-[10px] text-gray-400 uppercase font-bold">Difference</p>
                             <p className={`${Math.abs(totals.diff) > 0 ? 'text-red-500' : 'text-green-600'}`}>{Math.abs(totals.diff).toLocaleString()}</p>
                          </div>
                      </div>
                  </div>
               </>
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-gray-300">
                  <i className="fa fa-book-open text-6xl mb-4 opacity-20"></i>
                  <p className="text-sm font-bold uppercase tracking-widest">Select a voucher to view details</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default JournalVouchers;
