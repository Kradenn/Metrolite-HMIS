
import React, { useState } from 'react';

const InventoryReports: React.FC = () => {
  const [reportType, setReportType] = useState('');

  return (
    <div className="animate-bottom space-y-6">
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h5 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">Inventory Reports</h5>
        </div>
        
        <div className="p-4 bg-gray-50 border-b border-gray-100">
            <form className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-gray-500 uppercase">
                <div className="flex-1 min-w-[250px]">
                    <select 
                        className="w-full p-2 border border-gray-300 rounded outline-none bg-white"
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                    >
                        <option value="">Select Report...</option>
                        <option value="1">Stock Movement Detailed (All Branches)</option>
                        <option value="2">Stock Movement Detailed (By Branch)</option>
                        <option value="12">Stock Movement Detailed (By Storage Location)</option>
                        <option value="14">Stock Movement Summary (By Branch)</option>
                        <option value="15">Stock Movement Summary (By Storage Location)</option>
                        <option value="16">Stock Movement Detailed (By Item)</option>
                        <option value="3">Below Reorder Level</option>
                        <option value="4">Material Consumption (Committed)</option>
                        <option value="5">Material Consumption (Not Committed)</option>
                        <option value="6">Stock Valuation (All)</option>
                        <option value="7">Stock Valuation (By Storage Location)</option>
                        <option value="8">Out Of Stock</option>
                        <option value="9">Near Expiry</option>
                        <option value="10">Internal Order Issuance Detailed</option>
                        <option value="11">Internal Order Receipt Detailed</option>
                        <option value="13">Fast Moving Items (First 20)</option>
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
            <i className="fa fa-boxes text-6xl mb-4 opacity-50"></i>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Stock & Movement Analysis</p>
        </div>
      </div>
    </div>
  );
};

export default InventoryReports;
