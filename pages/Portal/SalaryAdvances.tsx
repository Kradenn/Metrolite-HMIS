
import React, { useState } from 'react';

const SalaryAdvances: React.FC = () => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [paymentPlan, setPaymentPlan] = useState('1');

  const history = [
    { date: '06-Apr-21', purpose: 'hospital bills', requested: '8000.00', status: 'Pending' },
    { date: '25-Nov-20', purpose: 'Personal Use', requested: '6000.00', status: 'Cleared' },
    { date: '11-Nov-20', purpose: 'Home Improvement', requested: '2000.00', status: 'Pending' },
  ];

  return (
    <div className="animate-bottom space-y-6">
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h6 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">My Salary Advances</h6>
          <button 
            onClick={() => setShowRequestModal(true)}
            className="bg-blue-600 text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-700 transition"
          >
            Make a Request
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
             <div className="flex items-center space-x-4">
                <label className="text-[10px] font-black text-gray-400 uppercase">View:</label>
                <select className="border border-gray-300 rounded px-2 py-1 text-xs outline-none bg-white">
                    <option>show all</option>
                    <option>Pending</option>
                    <option>Cleared</option>
                </select>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase">Total Outstanding</p>
                <p className="text-lg font-black text-red-600">KES 10,000.00</p>
             </div>
          </div>

          <div className="overflow-x-auto border rounded-xl border-gray-100">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 font-black uppercase tracking-tight">
                <tr>
                  <th className="px-6 py-4">Requested On</th>
                  <th className="px-6 py-4">Purpose</th>
                  <th className="px-6 py-4 text-right">Requested</th>
                  <th className="px-6 py-4 text-right">Disbursed</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                {history.map((h, i) => (
                  <tr key={i} className={`hover:bg-blue-50/50 transition-colors ${h.status === 'Pending' ? 'bg-blue-50/20' : 'bg-green-50/20'}`}>
                    <td className="px-6 py-4 font-mono">{h.date}</td>
                    <td className="px-6 py-4 uppercase tracking-tighter">{h.purpose}</td>
                    <td className="px-6 py-4 text-right font-black">KES {h.requested}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-400">0.00</td>
                    <td className="px-6 py-4 text-right">
                       <span className={`px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-tighter border ${
                         h.status === 'Pending' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-green-100 text-green-700 border-green-200'
                       }`}>{h.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest">Salary Advance Request</h5>
              <button onClick={() => setShowRequestModal(false)} className="text-gray-400 hover:text-gray-600"><i className="fa fa-times"></i></button>
            </div>
            <div className="p-8">
              <form className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                   <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Purpose</label>
                      <textarea className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs outline-none h-20" required placeholder="Reason for advance..."></textarea>
                   </div>
                   <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Amount Requested</label>
                      <input type="number" step="any" className="w-full p-2 bg-blue-50 border border-blue-100 rounded text-sm font-black text-blue-600 outline-none" required />
                   </div>
                </div>
                <div className="space-y-4">
                   <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Pay From Month</label>
                      <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs outline-none">
                         <option>January</option><option>February</option><option>March</option>
                         <option>April</option><option>May</option><option>June</option>
                         <option>July</option><option>August</option><option>September</option>
                         <option>October</option><option>November</option><option>December</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Pay From Year</label>
                      <input type="number" className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs outline-none" defaultValue="2023" />
                   </div>
                </div>
                <div className="space-y-4 flex flex-col justify-between">
                   <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Payment Plan</label>
                      <select 
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs outline-none"
                        onChange={(e) => setPaymentPlan(e.target.value)}
                        value={paymentPlan}
                      >
                         <option value="1">Clear fully at specified period</option>
                         <option value="2">Clear partially at specified intervals</option>
                      </select>
                   </div>
                   {paymentPlan === '2' && (
                     <div className="animate-in slide-in-from-top-2">
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Monthly Intervals</label>
                        <input type="number" min="2" className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs outline-none" />
                     </div>
                   )}
                   <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-black text-xs uppercase tracking-widest shadow-lg hover:bg-blue-700 transition">Submit Request</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryAdvances;
