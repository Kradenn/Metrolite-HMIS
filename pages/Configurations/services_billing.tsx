
import React, { useState, useMemo } from 'react';

// --- Interfaces ---
interface Service {
  id: number;
  name: string;
  category: string;
  code: string;
  rate: number;
  active: boolean;
  incomeAccount: string;
  expenseAccount: string;
  isProcedure: boolean;
  isExamination: boolean;
}

interface LabTest {
  id: number;
  name: string;
  category: string;
  specimen: string;
  cost: number;
  tat: number;
}

interface Vital {
  id: number;
  name: string;
  type: string;
  lowerLimit: string;
  upperLimit: string;
  units: string;
  allowMultiple: boolean;
}

// --- MAIN COMPONENT ---
const ServicesBilling: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'services' | 'billing' | 'barcodes' | 'lab' | 'vitals'>('services');
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'financial' | 'attributes'>('general');
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- MOCK DATA ---
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: 'General Consultation', category: 'Consultation', code: 'CON-001', rate: 1500, active: true, incomeAccount: '4001', expenseAccount: '', isProcedure: false, isExamination: true },
    { id: 2, name: 'Specialist Review', category: 'Consultation', code: 'CON-002', rate: 3000, active: true, incomeAccount: '4001', expenseAccount: '', isProcedure: false, isExamination: true },
    { id: 3, name: 'Appendectomy', category: 'Surgery', code: 'SURG-001', rate: 45000, active: true, incomeAccount: '4002', expenseAccount: '5002', isProcedure: true, isExamination: false },
    { id: 4, name: 'Wound Dressing', category: 'Procedure', code: 'PROC-005', rate: 800, active: true, incomeAccount: '4003', expenseAccount: '5003', isProcedure: true, isExamination: false },
  ]);

  const [labTests] = useState<LabTest[]>([
    { id: 1, name: 'Full Haemogram', category: 'Haematology', specimen: 'Whole Blood', cost: 800, tat: 45 },
    { id: 2, name: 'Malaria Smear', category: 'Parasitology', specimen: 'Whole Blood', cost: 300, tat: 30 },
    { id: 3, name: 'U&Es (Renal)', category: 'Biochemistry', specimen: 'Serum', cost: 1500, tat: 60 },
    { id: 4, name: 'Stool Ova/Cysts', category: 'Parasitology', specimen: 'Stool', cost: 300, tat: 30 },
  ]);

  const [vitals] = useState<Vital[]>([
    { id: 1, name: 'Body Temperature', type: 'Temperature', lowerLimit: '34.0', upperLimit: '42.0', units: '°C', allowMultiple: true },
  ]);

  const barcodeItems = [
    {id: 1, name: 'Paracetamol 500mg', code: 'PCM-0001-2023'},
    {id: 2, name: 'Amoxicillin 250mg', code: 'AMX-0044-2023'},
    {id: 3, name: 'Surgical Gloves (Size 7)', code: 'GLV-0089-2023'},
  ];

  // --- DERIVED DATA ---
  const filteredServices = useMemo(() => 
    services.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.code.toLowerCase().includes(searchTerm.toLowerCase())),
  [services, searchTerm]);

  const selectedService = useMemo(() => services.find(s => s.id === selectedServiceId), [services, selectedServiceId]);

  return (
    <div className="animate-bottom space-y-6 pb-20">
      {/* 1. TOP LEVEL MODULE SWITCHER */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
         <div className="flex border-b border-gray-100 bg-slate-50/50 overflow-x-auto scrollbar-hide">
            {[
               { id: 'services', label: 'Hospital Services', icon: 'fa-hand-holding-medical' },
               { id: 'billing', label: 'Billing Configuration', icon: 'fa-file-invoice-dollar' },
               { id: 'barcodes', label: 'Item Barcodes', icon: 'fa-barcode' },
               { id: 'lab', label: 'Laboratory Tests', icon: 'fa-flask' },
               { id: 'vitals', label: 'Vitals Setup', icon: 'fa-thermometer-half' },
            ].map(mod => (
               <button
                  key={mod.id}
                  onClick={() => { setActiveModule(mod.id as any); setSearchTerm(''); }}
                  className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap flex items-center space-x-2 ${
                     activeModule === mod.id 
                     ? 'border-blue-600 text-blue-600 bg-white' 
                     : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
               >
                  <i className={`fa ${mod.icon}`}></i>
                  <span>{mod.label}</span>
               </button>
            ))}
         </div>

         <div className="p-8">
            {/* MODULE: HOSPITAL SERVICES */}
            {activeModule === 'services' && (
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px] animate-in fade-in duration-300">
                  <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                     <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col gap-2">
                        <div className="relative">
                           <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                           <input type="text" placeholder="Search services..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <button className="w-full bg-blue-600 text-white py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest"><i className="fa fa-plus-circle mr-1"></i> Add Service</button>
                     </div>
                     <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
                        {filteredServices.map(s => (
                           <div key={s.id} onClick={() => setSelectedServiceId(s.id)} className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md group ${selectedServiceId === s.id ? 'bg-white border-blue-500 ring-1 ring-blue-100 shadow-sm' : 'bg-white border-gray-200'}`}>
                              <div className="flex justify-between items-start mb-1">
                                 <h6 className="text-xs font-black text-gray-800 uppercase leading-snug">{s.name}</h6>
                                 {s.active ? <i className="fa fa-check-circle text-green-500 text-[10px]"></i> : <i className="fa fa-ban text-gray-300 text-[10px]"></i>}
                              </div>
                              <div className="flex justify-between items-end">
                                 <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">{s.category}</span>
                                 <span className="text-sm font-black text-blue-600">KES {s.rate.toLocaleString()}</span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                  <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                     {selectedService ? (
                        <>
                           <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                              <div><h4 className="text-lg font-black text-gray-800 uppercase tracking-tight">{selectedService.name}</h4><p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{selectedService.code}</p></div>
                              <button className="bg-blue-600 text-white px-6 py-1.5 rounded text-[10px] font-black uppercase shadow hover:bg-blue-700">Save Changes</button>
                           </div>
                           <div className="flex border-b border-gray-100 px-6">
                              {['general', 'financial', 'attributes'].map(t => <button key={t} onClick={() => setActiveSubTab(t as any)} className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${activeSubTab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>{t}</button>)}
                           </div>
                           <div className="p-8 flex-1 overflow-y-auto">
                              {activeSubTab === 'general' && (
                                 <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                       <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Service Name</label><input type="text" defaultValue={selectedService.name} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs font-bold outline-none" /></div>
                                       <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Category</label><select className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs outline-none" defaultValue={selectedService.category}><option>Consultation</option><option>Surgery</option></select></div>
                                    </div>
                                    <div className="space-y-4">
                                       <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Service Code</label><input type="text" defaultValue={selectedService.code} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none" /></div>
                                       <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Description</label><textarea className="w-full p-2.5 bg-white border border-gray-200 rounded text-xs outline-none h-24 resize-none"></textarea></div>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </>
                     ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300">
                           <i className="fa fa-hand-holding-medical text-6xl mb-4 opacity-10"></i>
                           <p className="text-sm font-bold uppercase tracking-widest">Select a service to configure</p>
                        </div>
                     )}
                  </div>
               </div>
            )}

            {/* MODULE: BILLING CONFIGURATION */}
            {activeModule === 'billing' && (
               <div className="space-y-8 animate-in fade-in duration-300">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                     <h5 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">Billing Configuration</h5>
                     <p className="text-[11px] text-gray-500 font-medium mb-6">Configure automated billing rules and recurring charges.</p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Trigger Rules */}
                        <div className="space-y-6 border-r border-gray-100 pr-8">
                           <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Trigger Rules</h6>
                           <form className="space-y-4">
                              <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Trigger Event</label><select className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs"><option>On Patient Registration (Queue)</option></select></div>
                              <div><label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Billable Item</label><select className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-xs"><option>Registration Fee</option></select></div>
                              <button className="bg-blue-600 text-white px-6 py-2 rounded text-[10px] font-black uppercase tracking-widest shadow">Save Rule</button>
                           </form>
                           <div className="mt-4 space-y-2">
                              <div className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
                                 <div><p className="text-[10px] font-black text-gray-800 uppercase">Registration Fee</p><p className="text-[9px] text-gray-500 uppercase font-bold">Trigger: On Queue • Scheme: Cash Only</p></div>
                                 <i className="fa fa-trash-alt text-red-300 hover:text-red-500 cursor-pointer"></i>
                              </div>
                           </div>
                        </div>
                        {/* Automated Charges */}
                        <div className="space-y-6">
                           <h6 className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Automated Charges</h6>
                           <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                              <p className="text-[10px] text-orange-800 leading-relaxed font-medium">Daily recurring charges (Bed, Equipment, Nursing) are posted at specified times. Configure schedules here.</p>
                           </div>
                           <button className="bg-orange-600 text-white px-6 py-2 rounded text-[10px] font-black uppercase tracking-widest shadow">Add Daily Schedule</button>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* MODULE: ITEM BARCODES */}
            {activeModule === 'barcodes' && (
               <div className="animate-in fade-in duration-300 space-y-6">
                  <div className="flex justify-between items-center mb-4">
                     <div><h3 className="text-sm font-black text-gray-700 uppercase tracking-widest">Item Barcodes</h3><p className="text-[10px] text-gray-400 font-bold uppercase">Generate and print inventory identification tags</p></div>
                     <div className="flex space-x-2">
                        <button className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded text-[10px] font-black uppercase shadow-sm">Clear</button>
                        <button className="bg-blue-600 text-white px-4 py-1.5 rounded text-[10px] font-black uppercase shadow hover:bg-blue-700 transition">Generate All</button>
                     </div>
                  </div>
                  <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm">
                     <table className="w-full text-left text-[11px]">
                        <thead className="bg-gray-100 border-b border-gray-200 text-gray-500 font-black uppercase tracking-tighter">
                           <tr>
                              <th className="px-6 py-4 w-8"><input type="checkbox" className="rounded" /></th>
                              <th className="px-6 py-4">No</th>
                              <th className="px-6 py-4">Item Name</th>
                              <th className="px-6 py-4">Barcode Value</th>
                              <th className="px-6 py-4 text-right">Action</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                           {barcodeItems.map(item => (
                              <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                                 <td className="px-6 py-4"><input type="checkbox" className="rounded" /></td>
                                 <td className="px-6 py-4 font-bold text-gray-400">{item.id}</td>
                                 <td className="px-6 py-4 font-black uppercase text-gray-800">{item.name}</td>
                                 <td className="px-6 py-4 font-mono text-blue-600">{item.code}</td>
                                 <td className="px-6 py-4 text-right"><button className="bg-white border border-blue-200 text-blue-600 px-4 py-1 rounded text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition shadow-sm">Print</button></td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
                  <div className="flex justify-end pt-4"><button className="bg-gray-800 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl">Print Multiple Selected</button></div>
               </div>
            )}

            {/* MODULE: LABORATORY TESTS SETUP */}
            {activeModule === 'lab' && (
               <div className="animate-in fade-in duration-300 space-y-6">
                  <div className="flex justify-between items-center mb-4 bg-white p-4 border border-gray-100 rounded-xl shadow-sm">
                     <div><h3 className="text-sm font-black text-gray-700 uppercase tracking-widest">Laboratory Tests Setup</h3><p className="text-[10px] text-gray-400 font-bold uppercase">Configure test parameters, reference ranges, and pricing.</p></div>
                     <button className="bg-purple-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-purple-700 transition"><i className="fa fa-plus mr-2"></i> Add Test</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {labTests.map(test => (
                        <div key={test.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all group cursor-pointer hover:border-purple-300">
                           <div className="flex justify-between items-start mb-4">
                              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform"><i className="fa fa-flask"></i></div>
                              <span className="text-[9px] font-black bg-gray-100 px-2 py-0.5 rounded uppercase text-gray-500">TAT: {test.tat}m</span>
                           </div>
                           <h6 className="text-sm font-black text-gray-800 uppercase tracking-tight leading-snug">{test.name}</h6>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 mb-4">{test.category}</p>
                           <div className="pt-3 border-t border-gray-50 flex justify-between items-center">
                              <span className="text-[10px] text-gray-500 font-medium"><i className="fa fa-vial mr-1 text-purple-300"></i> {test.specimen}</span>
                              <span className="text-sm font-black text-purple-600">KES {test.cost}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* MODULE: VITALS SETUP */}
            {activeModule === 'vitals' && (
               <div className="animate-in fade-in space-y-8">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                     <div className="flex items-center space-x-3 mb-6">
                        <i className="fa fa-heartbeat text-blue-500 text-xl"></i>
                        <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest">General Examinations (Vitals)</h5>
                     </div>
                     
                     <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Name</label>
                              <input type="text" className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500" required />
                           </div>
                           <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Type</label>
                              <select className="w-full p-2 bg-white border border-gray-300 rounded-lg text-xs font-bold outline-none">
                                 <option value="1">Temperature</option>
                                 <option value="2">Weight</option>
                                 <option value="3">Height</option>
                                 <option value="4">Blood Pressure</option>
                                 <option value="5">RBS</option>
                                 <option value="0">Other</option>
                              </select>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div>
                                 <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Lower Limit</label>
                                 <input type="text" className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold outline-none" required />
                              </div>
                              <div>
                                 <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Upper Limit</label>
                                 <input type="text" className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold outline-none" required />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4 flex flex-col justify-between">
                           <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Units</label>
                              <input type="text" className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold outline-none" required placeholder="e.g. °C, Kg, mmHg" />
                           </div>
                           <div className="flex items-center space-x-2 py-2">
                              <input type="checkbox" id="AllowMultiple" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                              <label htmlFor="AllowMultiple" className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Allow Multiple Captures</label>
                           </div>
                           <div className="flex justify-end">
                              <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition transform active:scale-95">
                                 <i className="fa fa-plus mr-1"></i> Add Vital
                              </button>
                           </div>
                        </div>
                     </form>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                     <div className="p-3 border-b border-gray-100 bg-gray-50 font-black text-gray-400 text-[10px] uppercase tracking-widest px-6">
                        View: Registered Vitals
                     </div>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px]">
                           <thead className="bg-white border-b border-gray-200 text-gray-500 font-black uppercase tracking-tighter">
                              <tr>
                                 <th className="px-6 py-3">Name</th>
                                 <th className="px-6 py-3 text-right">Lower Limit</th>
                                 <th className="px-6 py-3 text-right">Upper Limit</th>
                                 <th className="px-6 py-3 text-center">Units</th>
                                 <th className="px-6 py-3 text-right">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100 bg-white text-gray-600 font-medium">
                              {vitals.map(v => (
                                 <tr key={v.id} className="hover:bg-blue-50 transition-colors cursor-pointer">
                                    <td className="px-6 py-3 font-black text-gray-800 uppercase">{v.name}</td>
                                    <td className="px-6 py-3 text-right font-bold text-gray-500">{v.lowerLimit}</td>
                                    <td className="px-6 py-3 text-right font-bold text-gray-500">{v.upperLimit}</td>
                                    <td className="px-6 py-3 text-center"><span className="text-blue-600 font-black px-2 py-0.5 bg-blue-50 rounded">{v.units}</span></td>
                                    <td className="px-6 py-3 text-right font-black text-gray-300 uppercase text-[9px]">Edit</td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            )}

         </div>
      </div>
    </div>
  );
};

export default ServicesBilling;
