
import React from 'react';

const TelehealthSettings: React.FC = () => {
  return (
    <div className="animate-bottom space-y-6">
       <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-700 text-sm uppercase tracking-tighter">Telehealth Preferences</div>
          <div className="p-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">Session Configuration</h6>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <label className="text-xs font-bold text-gray-600">Auto-start AI Scribe</label>
                         <input type="checkbox" className="rounded text-blue-600" />
                      </div>
                      <div className="flex justify-between items-center">
                         <label className="text-xs font-bold text-gray-600">Send Link via SMS automatically</label>
                         <input type="checkbox" className="rounded text-blue-600" defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                         <label className="text-xs font-bold text-gray-600">Record Video Sessions</label>
                         <input type="checkbox" className="rounded text-blue-600" />
                      </div>
                      <div>
                         <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Default Meeting Duration (Mins)</label>
                         <input type="number" className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none" defaultValue="20" />
                      </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-2">SMS Link Template</h6>
                   <textarea className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium outline-none focus:ring-1 focus:ring-blue-500" defaultValue="Hello [Patient], your virtual consultation with [Doctor] at UltraHub Hospital is starting now. Join here: [Link]"></textarea>
                   <p className="text-[10px] text-gray-400 font-bold italic">Tags: [Patient], [Doctor], [Link], [Time]</p>
                </div>
             </div>
             <div className="pt-8 border-t border-gray-50 mt-8 flex justify-end">
                <button className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-700 transition">Save Settings</button>
             </div>
          </div>
       </div>
    </div>
  );
};

export default TelehealthSettings;
