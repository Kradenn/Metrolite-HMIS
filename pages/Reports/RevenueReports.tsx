
import React, { useState } from 'react';

const RevenueReports: React.FC = () => {
  const [reportType, setReportType] = useState('0');

  return (
    <div className="animate-bottom space-y-6">
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h5 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">Revenue Reports</h5>
        </div>
        
        <div className="p-4 bg-gray-50 border-b border-gray-100">
            <form className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-gray-500 uppercase">
                <div className="flex-1 min-w-[250px]">
                    <select 
                        className="w-full p-2 border border-gray-300 rounded outline-none bg-white"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value="0">Analytics</option>
                        <option value="1">Revenue (All Branches)</option>
                        <option value="2">Revenue (All Departments By Branch)</option>
                        <option value="23">Revenue Summary (All Departments By Branch)</option>
                        <option value="3">Revenue (All Items By Branch)</option>
                        <option value="4">Revenue (By Department)</option>
                        <option value="9">Revenue (By Storage Location)</option>
                        <option value="24">Revenue (All Schemes)</option>
                        <option value="25">Revenue (By Schemes)</option>
                        <option value="5">Revenue (Weekly Graph)</option>
                        <option value="6">Revenue (Monthly Graph)</option>
                        <option value="7">Total Receipts (All Branches)</option>
                        <option value="8">Total Receipts (By Branch)</option>
                        <option value="30">Total Receipts (Per Category)</option>
                        <option value="10">Total Receipts Breakdown (All Branches)</option>
                        <option value="11">Total Receipts Breakdown (By Branch)</option>
                        <option value="12">Total Invoices Breakdown (All Branches)</option>
                        <option value="13">Total Invoices Breakdown (By Branch)</option>
                        <option value="14">All Patients Bills (By Branch)</option>
                        <option value="15">OutPatients Bills (By Branch)</option>
                        <option value="16">Admitted Patients Bills (By Branch)</option>
                        <option value="17">Discharged InPatients Bills (By Branch)</option>
                        <option value="18">All Patients Bills (By Status)</option>
                        <option value="19">OutPatients Bills (By Status)</option>
                        <option value="20">Admitted Patients Bills (By Status)</option>
                        <option value="21">Discharged InPatients Bills (By Status)</option>
                        <option value="22">Sales Gross Margin</option>
                        <option value="26">Expected Cash Revenue</option>
                        <option value="27">Allowed Discounts</option>
                        <option value="28">Customer Balances</option>
                        <option value="29">Direct Sales Sales</option>
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <label>From:</label>
                    <input type="date" className="p-1.5 border border-gray-300 rounded outline-none bg-white font-medium text-gray-700" />
                </div>
                <div className="flex items-center space-x-2">
                    <label>To:</label>
                    <input type="date" className="p-1.5 border border-gray-300 rounded outline-none bg-white font-medium text-gray-700" />
                </div>
                <button className="bg-blue-600 text-white px-6 py-1.5 rounded shadow hover:bg-blue-700 transition uppercase text-[9px] font-black tracking-widest">View Report</button>
            </form>
        </div>

        <div className="p-6 min-h-[60vh] bg-white flex flex-col items-center justify-center text-gray-300 border-t border-gray-100">
           {reportType === '0' ? (
             <div className="text-center">
                <i className="fa fa-chart-area text-6xl mb-4 opacity-50 text-green-300"></i>
                <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Revenue Analytics Dashboard</p>
             </div>
           ) : (
             <div className="text-center">
                <i className="fa fa-money-check-alt text-6xl mb-4 opacity-50"></i>
                <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Revenue & Receipts Data</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default RevenueReports;
