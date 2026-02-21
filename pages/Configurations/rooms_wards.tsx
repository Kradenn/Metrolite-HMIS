
import React, { useState } from 'react';

interface Bed {
  id: number;
  number: string;
  type: string;
  status: 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';
}

const RoomsWards: React.FC = () => {
  const [activeWard, setActiveWard] = useState('General Ward - Male');
  const [beds] = useState<Bed[]>([
    { id: 1, number: '01', type: 'Standard', status: 'Occupied' },
    { id: 2, number: '02', type: 'Standard', status: 'Available' },
    { id: 3, number: '03', type: 'Cardiac', status: 'Available' },
    { id: 4, number: '04', type: 'Standard', status: 'Cleaning' },
    { id: 5, number: '05', type: 'Standard', status: 'Occupied' },
    { id: 6, number: '06', type: 'Standard', status: 'Maintenance' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 border-green-200 text-green-700';
      case 'Occupied': return 'bg-blue-100 border-blue-200 text-blue-700';
      case 'Cleaning': return 'bg-yellow-100 border-yellow-200 text-yellow-700';
      case 'Maintenance': return 'bg-red-100 border-red-200 text-red-700';
      default: return 'bg-gray-100 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="animate-bottom space-y-8 pb-20">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        
        {/* --- SECTION 1: STORAGE LOCATIONS / STORES --- */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h6 className="text-sm font-black text-gray-800 uppercase tracking-tighter">Storage Locations / Stores</h6>
            <i className="fa fa-boxes text-gray-300"></i>
          </div>
          
          <div className="p-6">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Store Name</label>
                  <input type="text" className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Description</label>
                  <input type="text" className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Department</label>
                  <select className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-bold outline-none">
                    <option>Pharmacy</option>
                    <option>Laboratory</option>
                    <option>Main Store</option>
                    <option>Radiology</option>
                  </select>
                </div>
                <div className="flex flex-col space-y-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="DefaultSellingPoint" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="DefaultSellingPoint" className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Default Selling Point</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="OpticalWorkshopStore" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="OpticalWorkshopStore" className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Optical Workshop Store</label>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition transform active:scale-95">
                     <i className="fa fa-plus mr-1"></i> Add Store
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="p-3 border-t border-gray-100 bg-gray-50 font-black text-gray-400 text-[10px] uppercase tracking-widest px-6">
            View: Registered Storage Locations
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-white border-b border-gray-200 text-gray-500 uppercase font-black tracking-tighter">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3 text-center">Default Sale Point</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                <tr className="hover:bg-blue-50 transition-colors cursor-pointer">
                  <td className="px-6 py-3 font-bold text-gray-400">1</td>
                  <td className="px-6 py-3 font-black uppercase text-blue-600">Main Pharmacy</td>
                  <td className="px-6 py-3 text-center"><i className="fa fa-check-circle text-green-500 text-lg"></i></td>
                  <td className="px-6 py-3 text-right font-black text-gray-300 uppercase text-[9px]">Edit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* --- SECTION 2: ROOM MANAGEMENT --- */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h6 className="text-sm font-black text-gray-800 uppercase tracking-tighter">Room Configuration</h6>
            <i className="fa fa-door-open text-gray-300"></i>
          </div>
          
          <div className="p-6">
            <form id="RoomForm" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Room Name</label>
                  <input type="text" className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Category / Type</label>
                  <select className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-bold outline-none">
                    <option value="1">Outpatient Room</option>
                    <option value="2">Ward Room</option>
                    <option value="3">Special Procedure Room</option>
                    <option value="4">Emergency Room</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Bind to panel</label>
                  <select className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-bold outline-none">
                    <option value="0">No Binding</option>
                    <option value="1">Triage Station</option>
                    <option value="2">Doctor's Consultation</option>
                    <option value="8">Pharmacy Dispensing</option>
                    <option value="9">Laboratory Bench</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <input type="checkbox" id="IsEntryPoint" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <label htmlFor="IsEntryPoint" className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Entry Point</label>
                </div>
                <div className="pt-2 flex justify-end">
                  <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition transform active:scale-95">
                    <i className="fa fa-plus mr-1"></i> Add Room
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="p-3 border-t border-gray-100 bg-gray-50 font-black text-gray-400 text-[10px] uppercase tracking-widest px-6">
            View: Registered Rooms
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-white border-b border-gray-200 text-gray-500 uppercase font-black tracking-tighter">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3 text-center">Entry Point</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-gray-600 font-medium">
                <tr className="hover:bg-blue-50 transition-colors cursor-pointer">
                  <td className="px-6 py-3 font-bold text-gray-700">38</td>
                  <td className="px-6 py-3 font-black uppercase text-gray-800">Consultation Room 1</td>
                  <td className="px-6 py-3 text-center"><i className="fa fa-check-circle text-green-500 text-lg"></i></td>
                  <td className="px-6 py-3 text-right font-black text-gray-300 uppercase text-[9px]">Edit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* --- SECTION 3: WARD CONFIGURATION --- */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center space-x-3">
             <i className="fa fa-procedures text-blue-500"></i>
             <div>
                <h6 className="text-sm font-black text-gray-800 uppercase tracking-tighter leading-none">Ward Configuration</h6>
                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Manage bed capacity and layout.</p>
             </div>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow hover:bg-blue-700 transition">
             <i className="fa fa-plus mr-1"></i> Add Bed
          </button>
        </div>

        {/* Ward Type Selector */}
        <div className="bg-gray-50 border-b border-gray-100 p-1 flex overflow-x-auto scrollbar-hide">
           {['General Ward - Male', 'General Ward - Female', 'Maternity', 'Pediatric', 'Private Wing', 'ICU'].map(ward => (
              <button
                 key={ward}
                 onClick={() => setActiveWard(ward)}
                 className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest whitespace-nowrap rounded-lg transition-all ${
                    activeWard === ward 
                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                    : 'text-gray-500 hover:bg-gray-200'
                 }`}
              >
                 {ward}
              </button>
           ))}
        </div>
        
        <div className="p-8 bg-white flex-1">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h5 className="text-sm font-black text-gray-700 uppercase tracking-tight">{activeWard} Layout</h5>
              <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                 <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span> Available</span>
                 <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span> Occupied</span>
                 <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span> Cleaning</span>
                 <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span> Maint.</span>
              </div>
           </div>

           <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
              {beds.map(bed => (
                 <div key={bed.id} className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-4 cursor-pointer hover:shadow-xl transition-all relative group shadow-sm ${getStatusColor(bed.status)}`}>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="w-6 h-6 bg-white/50 hover:bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm"><i className="fa fa-pencil-alt text-[10px]"></i></button>
                    </div>
                    <i className="fa fa-bed text-3xl mb-2 opacity-50"></i>
                    <h3 className="text-xl font-black">{bed.number}</h3>
                    <p className="text-[9px] font-black uppercase tracking-wider opacity-80">{bed.type}</p>
                    <span className="text-[8px] font-black uppercase mt-3 bg-white/40 px-2.5 py-1 rounded-full border border-white/20">{bed.status}</span>
                 </div>
              ))}
              
              {/* New Bed Shortcut */}
              <div 
                 className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all text-gray-300 hover:text-blue-500 group"
              >
                 <div className="w-10 h-10 bg-gray-50 group-hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors mb-2">
                    <i className="fa fa-plus text-xl"></i>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-widest">New Bed</span>
              </div>
           </div>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-[10px] font-black text-gray-400 uppercase tracking-widest px-8">
           <span>{activeWard} Status Overview</span>
           <span className="text-gray-500">Total Capacity: {beds.length} Beds</span>
        </div>
      </div>
    </div>
  );
};

export default RoomsWards;
