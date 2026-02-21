
import React from 'react';

const PatientLabTests: React.FC = () => {
  return (
    <div className="animate-bottom space-y-6">
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h5 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">Medical Test Results</h5>
        </div>

        <div className="p-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow group cursor-pointer bg-white">
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-xl">
                        <i className="fa fa-flask"></i>
                    </div>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest">Ready</span>
                 </div>
                 <h6 className="text-sm font-black text-gray-800 uppercase mb-1 group-hover:text-blue-600 transition-colors">Full Haemogram</h6>
                 <p className="text-xs text-gray-500 mb-4">Requested on 24-Oct-2023 by Dr. Wilson</p>
                 <button className="w-full py-2 border border-gray-200 rounded text-xs font-bold text-gray-600 uppercase hover:bg-gray-50 transition">View Results</button>
              </div>

              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow group cursor-pointer bg-white opacity-75">
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-xl">
                        <i className="fa fa-dna"></i>
                    </div>
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest">Processing</span>
                 </div>
                 <h6 className="text-sm font-black text-gray-800 uppercase mb-1">Lipid Profile</h6>
                 <p className="text-xs text-gray-500 mb-4">Requested on 24-Oct-2023 by Dr. Wilson</p>
                 <button className="w-full py-2 border border-gray-200 rounded text-xs font-bold text-gray-400 uppercase cursor-not-allowed">Pending</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLabTests;
