
import React from 'react';

const PaySlips: React.FC = () => {
  const slips = [
    { no: 463, period: 'June, 2021', status: 'Paid', basic: '105,950.00', paye: '23,532.50', net: '79,637.50' },
    { no: 438, period: 'May, 2021', status: 'Pending', basic: '105,950.00', paye: '23,532.50', net: '79,637.50' },
    { no: 413, period: 'April, 2021', status: 'Pending', basic: '105,950.00', paye: '23,532.50', net: '79,637.50' },
    { no: 364, period: 'March, 2021', status: 'Pending', basic: '105,950.00', paye: '23,532.50', net: '79,637.50' },
    { no: 308, period: 'February, 2021', status: 'Pending', basic: '105,950.00', paye: '23,532.50', net: '79,637.50' },
  ];

  return (
    <div className="animate-bottom space-y-6">
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h6 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">My Pay Slips</h6>
          <button className="bg-blue-600 text-white px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded shadow hover:bg-blue-700 transition">Select Other Slips</button>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center space-x-4">
             <label className="text-[10px] font-black text-gray-400 uppercase">Page Size:</label>
             <select className="border border-gray-300 rounded px-2 py-1 text-xs outline-none bg-white">
                <option>show 10</option>
                <option>show 25</option>
                <option>show all</option>
             </select>
          </div>

          <div className="overflow-x-auto border rounded-xl border-gray-100">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 font-black uppercase tracking-tight">
                <tr>
                  <th className="px-6 py-4">Slip No</th>
                  <th className="px-6 py-4">Pay Period</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Basic Pay</th>
                  <th className="px-6 py-4 text-right">PAYE</th>
                  <th className="px-6 py-4 text-right">Net Pay</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                {slips.map((s, i) => (
                  <tr key={i} className={`hover:bg-blue-50/50 transition-colors ${s.status === 'Paid' ? 'bg-green-50/20' : 'bg-blue-50/20'}`}>
                    <td className="px-6 py-4 font-black text-gray-400">{s.no}</td>
                    <td className="px-6 py-4 font-bold text-gray-800">{s.period}</td>
                    <td className="px-6 py-4 uppercase">
                       <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                         s.status === 'Paid' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                       }`}>{s.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">{s.basic}</td>
                    <td className="px-6 py-4 text-right text-red-400">{s.paye}</td>
                    <td className="px-6 py-4 text-right font-black text-blue-600">{s.net}</td>
                    <td className="px-6 py-4 text-right">
                       <button className="bg-white border border-blue-200 text-blue-600 px-3 py-1 rounded text-[9px] font-black uppercase hover:bg-blue-600 hover:text-white transition">Open</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-center space-x-2">
             <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-gray-400 uppercase hover:bg-gray-50">&lt;</button>
             <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase">1</button>
             <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-gray-400 uppercase hover:bg-gray-50">2</button>
             <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-gray-400 uppercase hover:bg-gray-50">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaySlips;
