
import React, { useState } from 'react';

const Leaves: React.FC = () => {
  const [showRequestModal, setShowRequestModal] = useState(false);

  const leaves = [
    { type: 'Mandatory Leave 2019', desc: 'Mandatory Leave request.', from: '19-Aug-2019', to: '26-Aug-2019', status: 'Approved' },
  ];

  return (
    <div className="animate-bottom space-y-6">
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-3 border-b border-gray-100 bg-[#f8f9fa] flex justify-between items-center">
          <h6 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">My Leave Requests</h6>
          <button 
            onClick={() => setShowRequestModal(true)}
            className="bg-[#5bc0de] text-white px-4 py-1.5 text-[10px] font-bold uppercase rounded shadow hover:bg-[#31b0d5] transition"
          >
            Make a Request
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center space-x-4">
             <label className="text-[10px] font-bold text-gray-400 uppercase">Filter Number Of Leaves</label>
             <select className="border border-gray-300 rounded px-2 py-1 text-xs outline-none bg-white">
                <option>show all</option>
                <option>5</option>
                <option>10</option>
                <option>25</option>
             </select>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-[#f2f2f2] border-b border-gray-200 text-gray-600 font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">Leave Type</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">From</th>
                  <th className="px-6 py-4">To</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Rejection Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                {leaves.map((l, i) => (
                  <tr key={i} className="bg-[#dff0d8] hover:bg-[#d0e9c6] transition-colors">
                    <td className="px-6 py-4 font-bold">{l.type}</td>
                    <td className="px-6 py-4 italic">{l.desc}</td>
                    <td className="px-6 py-4">{l.from}</td>
                    <td className="px-6 py-4">{l.to}</td>
                    <td className="px-6 py-4">{l.status}</td>
                    <td className="px-6 py-4">-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-center">
             <nav className="inline-flex rounded-md shadow-sm">
                <button className="px-3 py-2 bg-white border border-gray-300 text-gray-400 hover:bg-gray-50 rounded-l-md font-bold text-[10px]">&lt;</button>
                <button className="px-3 py-2 bg-[#1d86c8] border border-[#1d86c8] text-white font-bold text-[10px]">1</button>
                <button className="px-3 py-2 bg-white border border-gray-300 text-gray-400 hover:bg-gray-50 rounded-r-md font-bold text-[10px]">&gt;</button>
             </nav>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
          <div className="bg-white rounded shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-gray-100 bg-[#f8f9fa] flex justify-between items-center">
              <h5 className="text-sm font-bold text-gray-800 uppercase">Leave Request</h5>
              <button onClick={() => setShowRequestModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
            </div>
            <div className="p-8">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-tight">Leave Type</label>
                      <select className="w-full p-2.5 bg-white border border-gray-300 rounded text-xs outline-none" required>
                         <option>Select Leave Type...</option>
                         <option>Mandatory Leave</option>
                         <option>Sick Leave</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-tight">Brief Description</label>
                      <textarea className="w-full p-2.5 bg-white border border-gray-300 rounded text-xs outline-none h-24" required></textarea>
                   </div>
                </div>
                <div className="space-y-4 flex flex-col">
                   <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-tight">Date From</label>
                      <input type="date" className="w-full p-2.5 bg-white border border-gray-300 rounded text-xs outline-none" required />
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-tight">Date To</label>
                      <input type="date" className="w-full p-2.5 bg-white border border-gray-300 rounded text-xs outline-none" required />
                   </div>
                   <div className="pt-4 mt-auto">
                     <button type="submit" className="w-full bg-[#1d86c8] text-white py-2 rounded font-bold text-xs uppercase shadow-md hover:bg-[#36a0e2] transition">Submit</button>
                   </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaves;
