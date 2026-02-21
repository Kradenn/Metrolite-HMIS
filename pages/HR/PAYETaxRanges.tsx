
import React from 'react';

const PAYETaxRanges: React.FC = () => {
  return (
    <div className="animate-bottom space-y-6">
       <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div>
             <h2 className="text-xl font-bold text-gray-800">PAYE Tax Brackets</h2>
             <p className="text-xs text-gray-500 font-medium">Configure graduated tax bands for payroll.</p>
          </div>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow hover:bg-blue-700 transition">
             Update Bands
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
             { label: 'Band 1', range: '0 - 24,000', rate: '10%', color: 'bg-green-500' },
             { label: 'Band 2', range: '24,001 - 32,333', rate: '25%', color: 'bg-blue-500' },
             { label: 'Band 3', range: '32,334 - 500,000', rate: '30%', color: 'bg-orange-500' },
             { label: 'Band 4', range: 'Above 500,000', rate: '35%', color: 'bg-red-500' },
          ].map((band, i) => (
             <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${band.color}`}></div>
                <h6 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{band.label}</h6>
                <h3 className="text-2xl font-black text-gray-800">{band.rate}</h3>
                <p className="text-xs font-medium text-gray-500 mt-2 bg-gray-50 inline-block px-2 py-1 rounded">Range: {band.range}</p>
             </div>
          ))}
       </div>

       <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">Tax Configuration</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Personal Relief (Monthly)</label>
                <input type="number" className="w-full p-2 bg-white border border-gray-300 rounded text-xs outline-none font-bold" defaultValue="2400" />
             </div>
             <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Insurance Relief (%)</label>
                <input type="number" className="w-full p-2 bg-white border border-gray-300 rounded text-xs outline-none font-bold" defaultValue="15" />
             </div>
          </div>
       </div>
    </div>
  );
};

export default PAYETaxRanges;
