
import React, { useState, useMemo } from 'react';

interface LabTest {
  id: number;
  name: string;
  category: string;
  specimen: string;
  cost: number;
  tat: number; // Turnaround time in mins
}

const LabTests: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'details' | 'ranges' | 'components'>('details');
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Data
  const [tests, setTests] = useState<LabTest[]>([
    { id: 1, name: 'Full Haemogram', category: 'Haematology', specimen: 'Whole Blood', cost: 800, tat: 45 },
    { id: 2, name: 'Malaria Smear', category: 'Parasitology', specimen: 'Whole Blood', cost: 300, tat: 30 },
    { id: 3, name: 'U&Es (Renal)', category: 'Biochemistry', specimen: 'Serum', cost: 1500, tat: 60 },
    { id: 4, name: 'Stool Ova/Cysts', category: 'Parasitology', specimen: 'Stool', cost: 300, tat: 30 },
  ]);

  const filteredTests = useMemo(() => 
    tests.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())),
  [tests, searchTerm]);

  const selectedTest = tests.find(t => t.id === selectedTestId);

  return (
    <div className="animate-bottom space-y-6">
       <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div>
             <h2 className="text-xl font-bold text-gray-800">Laboratory Tests</h2>
             <p className="text-xs text-gray-500 font-medium">Configure test parameters, reference ranges, and pricing.</p>
          </div>
          <button className="bg-purple-600 text-white px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow hover:bg-purple-700 transition">
             <i className="fa fa-flask mr-2"></i> Add Test
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)]">
          
          {/* Left: Test List */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50">
                <input 
                   type="text" 
                   placeholder="Search lab tests..." 
                   className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-purple-500"
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
                {filteredTests.map(test => (
                   <div 
                      key={test.id} 
                      onClick={() => setSelectedTestId(test.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md group ${selectedTestId === test.id ? 'bg-white border-purple-500 ring-1 ring-purple-100 shadow-sm' : 'bg-white border-gray-200'}`}
                   >
                      <div className="flex justify-between items-start mb-1">
                         <h6 className="text-xs font-black text-gray-800 uppercase">{test.name}</h6>
                         <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">{test.category}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium flex items-center justify-between">
                         <span><i className="fa fa-vial mr-1"></i> {test.specimen}</span>
                         <span className="text-purple-600 font-bold">KES {test.cost}</span>
                      </p>
                   </div>
                ))}
             </div>
          </div>

          {/* Right: Configuration */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             {selectedTest ? (
                <>
                   <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                      <h4 className="text-lg font-black text-gray-800 uppercase tracking-tight">{selectedTest.name}</h4>
                      <div className="flex space-x-2">
                         <button className="bg-white border border-gray-300 text-gray-600 px-3 py-1.5 rounded text-[10px] font-bold uppercase hover:bg-gray-50">Deactivate</button>
                         <button className="bg-purple-600 text-white px-4 py-1.5 rounded text-[10px] font-black uppercase shadow hover:bg-purple-700">Save</button>
                      </div>
                   </div>

                   <div className="flex border-b border-gray-100 px-6">
                      <button onClick={() => setActiveTab('details')} className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'details' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Test Details</button>
                      <button onClick={() => setActiveTab('ranges')} className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'ranges' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Reference Ranges</button>
                      <button onClick={() => setActiveTab('components')} className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'components' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Sub-Components</button>
                   </div>

                   <div className="p-8 flex-1 overflow-y-auto">
                      {activeTab === 'details' && (
                         <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Test Name</label>
                                  <input type="text" defaultValue={selectedTest.name} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold outline-none" />
                               </div>
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Category / Department</label>
                                  <select className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs outline-none" defaultValue={selectedTest.category}>
                                     <option>Haematology</option><option>Biochemistry</option><option>Parasitology</option><option>Microbiology</option>
                                  </select>
                               </div>
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Specimen Type</label>
                                  <select className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs outline-none" defaultValue={selectedTest.specimen}>
                                     <option>Whole Blood</option><option>Serum</option><option>Plasma</option><option>Urine</option><option>Stool</option>
                                  </select>
                               </div>
                            </div>
                            <div className="space-y-4">
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Default Cost</label>
                                  <input type="number" defaultValue={selectedTest.cost} className="w-full p-2.5 bg-purple-50 border border-purple-100 text-purple-800 rounded-lg text-sm font-black outline-none" />
                               </div>
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Turnaround Time (Mins)</label>
                                  <input type="number" defaultValue={selectedTest.tat} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs outline-none" />
                               </div>
                            </div>
                         </div>
                      )}

                      {activeTab === 'ranges' && (
                         <div className="space-y-6">
                            <div className="flex justify-end">
                               <button className="text-purple-600 font-bold text-[10px] uppercase hover:underline">+ Add Range Rule</button>
                            </div>
                            <table className="w-full text-left text-[11px] border border-gray-200 rounded-lg overflow-hidden">
                               <thead className="bg-gray-50 text-gray-500 font-bold uppercase">
                                  <tr>
                                     <th className="px-4 py-2">Gender</th>
                                     <th className="px-4 py-2">Age Range</th>
                                     <th className="px-4 py-2">Lower Limit</th>
                                     <th className="px-4 py-2">Upper Limit</th>
                                     <th className="px-4 py-2">Unit</th>
                                     <th className="px-4 py-2 w-10"></th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-gray-100 text-gray-700">
                                  <tr>
                                     <td className="px-4 py-2">Male</td>
                                     <td className="px-4 py-2">18 - 100 Yrs</td>
                                     <td className="px-4 py-2 font-mono">13.5</td>
                                     <td className="px-4 py-2 font-mono">17.5</td>
                                     <td className="px-4 py-2">g/dL</td>
                                     <td className="px-4 py-2 text-center text-red-400 cursor-pointer"><i className="fa fa-trash-alt"></i></td>
                                  </tr>
                                  <tr>
                                     <td className="px-4 py-2">Female</td>
                                     <td className="px-4 py-2">18 - 100 Yrs</td>
                                     <td className="px-4 py-2 font-mono">12.0</td>
                                     <td className="px-4 py-2 font-mono">15.5</td>
                                     <td className="px-4 py-2">g/dL</td>
                                     <td className="px-4 py-2 text-center text-red-400 cursor-pointer"><i className="fa fa-trash-alt"></i></td>
                                  </tr>
                               </tbody>
                            </table>
                         </div>
                      )}
                      
                      {activeTab === 'components' && (
                          <div className="text-center py-10 text-gray-400 italic text-xs">
                             <p>Used for panel tests (e.g., LFTs, U&Es) to define individual parameters.</p>
                             <button className="mt-4 bg-gray-100 text-gray-600 px-4 py-2 rounded font-bold uppercase text-[10px] hover:bg-gray-200">Define Components</button>
                          </div>
                      )}
                   </div>
                </>
             ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-300">
                   <i className="fa fa-microscope text-6xl mb-4 opacity-20"></i>
                   <p className="text-sm font-bold uppercase tracking-widest">Select a test to configure</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default LabTests;
