
import React from 'react';

const PatientBills: React.FC = () => {
  const bills = [
    { id: 'BILL-12093', date: '24-Oct-2023', service: 'Consultation & Lab Tests', amount: 2500, status: 'Pending' },
    { id: 'BILL-11002', date: '15-Sep-2023', service: 'Pharmacy Refill', amount: 1200, status: 'Paid' },
  ];

  return (
    <div className="animate-bottom space-y-6">
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h5 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">My Bills</h5>
          <div className="text-right">
             <span className="text-[10px] font-bold text-gray-400 uppercase">Total Outstanding:</span>
             <span className="ml-2 text-lg font-black text-red-600">KES 2,500.00</span>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 font-black uppercase tracking-tight">
                <tr>
                  <th className="px-6 py-3">Bill No</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Service Description</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {bills.map((bill, i) => (
                  <tr key={i} className="hover:bg-blue-50 transition-colors bg-white">
                    <td className="px-6 py-4 font-bold text-blue-600">{bill.id}</td>
                    <td className="px-6 py-4 font-medium">{bill.date}</td>
                    <td className="px-6 py-4 uppercase">{bill.service}</td>
                    <td className="px-6 py-4 text-right font-black">KES {bill.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase border ${bill.status === 'Paid' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                            {bill.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        {bill.status === 'Pending' ? (
                            <button className="bg-green-600 text-white px-4 py-1.5 rounded shadow hover:bg-green-700 transition uppercase text-[9px] font-black tracking-widest">
                                Pay Now
                            </button>
                        ) : (
                            <button className="bg-white border border-gray-300 text-gray-600 px-4 py-1.5 rounded hover:bg-gray-50 transition uppercase text-[9px] font-black tracking-widest">
                                <i className="fa fa-download mr-1"></i> Receipt
                            </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientBills;
