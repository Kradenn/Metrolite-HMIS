
import React from 'react';

const PatientAppointments: React.FC = () => {
  return (
    <div className="animate-bottom space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Booking Form */}
         <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 sticky top-20">
               <h5 className="text-sm font-bold text-gray-700 uppercase tracking-tighter border-b border-gray-100 pb-2 mb-4">Book Appointment</h5>
               <form className="space-y-4">
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Department</label>
                     <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs outline-none">
                        <option>General Medicine</option>
                        <option>Dental</option>
                        <option>Paediatrics</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Doctor (Optional)</label>
                     <select className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs outline-none">
                        <option>Any Available</option>
                        <option>Dr. James Wilson</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Preferred Date</label>
                     <input type="date" className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs outline-none" />
                  </div>
                  <div>
                     <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Reason</label>
                     <textarea className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs outline-none h-20 resize-none" placeholder="Briefly describe your issue..."></textarea>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 rounded text-xs font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition">Confirm Booking</button>
               </form>
            </div>
         </div>

         {/* Upcoming List */}
         <div className="lg:col-span-2 space-y-4">
            <h5 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">Your Schedule</h5>
            
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center space-x-4 border-l-4 border-l-green-500">
               <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[60px]">
                  <span className="block text-[10px] font-black text-gray-400 uppercase">OCT</span>
                  <span className="block text-xl font-black text-gray-800">25</span>
               </div>
               <div className="flex-1">
                  <h6 className="text-sm font-black text-gray-800 uppercase">Dental Checkup</h6>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">10:00 AM • Dr. Sarah • Room 402</p>
               </div>
               <button className="text-gray-400 hover:text-red-500 transition"><i className="fa fa-times-circle text-lg"></i></button>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex items-center space-x-4 border-l-4 border-l-blue-500">
               <div className="bg-gray-100 rounded-lg px-3 py-2 text-center min-w-[60px]">
                  <span className="block text-[10px] font-black text-gray-400 uppercase">NOV</span>
                  <span className="block text-xl font-black text-gray-800">02</span>
               </div>
               <div className="flex-1">
                  <h6 className="text-sm font-black text-gray-800 uppercase">General Follow-up</h6>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">02:30 PM • Dr. James • Room 101</p>
               </div>
               <button className="text-gray-400 hover:text-red-500 transition"><i className="fa fa-times-circle text-lg"></i></button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PatientAppointments;
