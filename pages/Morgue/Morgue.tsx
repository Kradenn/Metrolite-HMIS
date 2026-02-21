
import React, { useState, useMemo } from 'react';

// --- Interfaces ---
interface Deceased {
  id: string; // System ID
  tagNo: string;
  surname: string;
  otherNames: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  idNumber: string;
  dateOfDeath: string;
  dateReceived: string;
  admissionType: 'Internal' | 'External';
  storageArea: string;
  chamberNo: string;
  status: 'Admitted' | 'Pending Removal' | 'Released';
  nokName: string;
  nokPhone: string;
  nokRelation: string;
  causeOfDeath?: string;
  releasedTo?: string;
  releaseDate?: string;
}

// --- Mock Data ---
const MOCK_DECEASED: Deceased[] = [
  { 
    id: '1', tagNo: 'M-2023-001', surname: 'DOE', otherNames: 'JOHN', gender: 'Male', age: 78, idNumber: '1234567',
    dateOfDeath: '2023-10-20', dateReceived: '2023-10-20 14:30', admissionType: 'Internal',
    storageArea: 'Main Cold Room', chamberNo: 'Rack 1-A', status: 'Admitted',
    nokName: 'Jane Doe', nokPhone: '0722123456', nokRelation: 'Wife', causeOfDeath: 'Cardiac Arrest'
  },
  { 
    id: '2', tagNo: 'M-2023-002', surname: 'SMITH', otherNames: 'ALICE', gender: 'Female', age: 45, idNumber: '9876543',
    dateOfDeath: '2023-10-21', dateReceived: '2023-10-21 09:15', admissionType: 'External',
    storageArea: 'Main Cold Room', chamberNo: 'Rack 1-B', status: 'Pending Removal',
    nokName: 'Bob Smith', nokPhone: '0733123456', nokRelation: 'Husband', causeOfDeath: 'RTA'
  },
  { 
    id: '3', tagNo: 'M-2023-003', surname: 'KAMAU', otherNames: 'JAMES', gender: 'Male', age: 62, idNumber: '22334455',
    dateOfDeath: '2023-10-18', dateReceived: '2023-10-18 11:00', admissionType: 'Internal',
    storageArea: 'Private Wing', chamberNo: 'P-05', status: 'Released',
    nokName: 'Mary Kamau', nokPhone: '0711223344', nokRelation: 'Daughter', releasedTo: 'Mary Kamau', releaseDate: '2023-10-23'
  },
];

const Morgue: React.FC = () => {
  const [deceasedList, setDeceasedList] = useState<Deceased[]>(MOCK_DECEASED);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'storage' | 'nok' | 'release'>('details');
  const [isEditing, setIsEditing] = useState(false);

  // Form State (initialized empty, populated on selection)
  const [formData, setFormData] = useState<Partial<Deceased>>({});

  // Derived Data
  const filteredList = useMemo(() => {
    return deceasedList.filter(d => 
      d.surname.toLowerCase().includes(searchTerm.toLowerCase()) || 
      d.tagNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.otherNames.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [deceasedList, searchTerm]);

  const selectedBody = useMemo(() => deceasedList.find(d => d.id === selectedId), [deceasedList, selectedId]);

  const stats = useMemo(() => ({
     total: deceasedList.length,
     admitted: deceasedList.filter(d => d.status === 'Admitted').length,
     pending: deceasedList.filter(d => d.status === 'Pending Removal').length,
     released: deceasedList.filter(d => d.status === 'Released').length,
  }), [deceasedList]);

  // Handlers
  const handleSelect = (d: Deceased) => {
     setSelectedId(d.id);
     setFormData(d);
     setIsEditing(false); // View mode initially
     setActiveTab('details');
  };

  const handleAddNew = () => {
     const newId = (deceasedList.length + 1).toString();
     const newRecord: Partial<Deceased> = {
        id: newId,
        tagNo: `M-${new Date().getFullYear()}-${String(newId).padStart(3, '0')}`,
        dateReceived: new Date().toISOString().slice(0, 16),
        status: 'Admitted',
        admissionType: 'Internal',
        gender: 'Male',
        storageArea: 'Main Cold Room'
     };
     setFormData(newRecord);
     setSelectedId(null); // Deselect list to show "New" form state if desired, or handle differently
     setIsEditing(true);
     setActiveTab('details');
  };

  const handleSave = (e: React.FormEvent) => {
     e.preventDefault();
     if (selectedId) {
        // Update
        setDeceasedList(prev => prev.map(d => d.id === selectedId ? { ...d, ...formData } as Deceased : d));
        setIsEditing(false);
     } else {
        // Create
        const newRecord = { ...formData, id: Date.now().toString() } as Deceased;
        setDeceasedList([newRecord, ...deceasedList]);
        setSelectedId(newRecord.id);
        setIsEditing(false);
     }
     alert('Record Saved Successfully');
  };

  const getStatusColor = (status: string) => {
     switch(status) {
        case 'Admitted': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'Pending Removal': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'Released': return 'bg-gray-100 text-gray-600 border-gray-200';
        default: return 'bg-gray-100 text-gray-600';
     }
  };

  return (
    <div className="animate-bottom space-y-6">
       
       {/* 1. Dashboard Stats */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Bodies</p>
                   <h3 className="text-2xl font-black text-gray-800 mt-1">{stats.total}</h3>
                </div>
                <div className="w-10 h-10 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center text-lg">
                   <i className="fa fa-list"></i>
                </div>
             </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Currently Admitted</p>
                   <h3 className="text-2xl font-black text-blue-600 mt-1">{stats.admitted}</h3>
                </div>
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-lg">
                   <i className="fa fa-bed"></i>
                </div>
             </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
             <div className="flex justify-between items-start">
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Removal</p>
                   <h3 className="text-2xl font-black text-orange-500 mt-1">{stats.pending}</h3>
                </div>
                <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center text-lg">
                   <i className="fa fa-clock"></i>
                </div>
             </div>
          </div>
          <button 
             onClick={handleAddNew}
             className="bg-slate-800 text-white p-5 rounded-xl shadow-lg flex flex-col justify-center items-start cursor-pointer hover:bg-slate-900 transition border border-slate-700"
          >
             <div className="flex items-center space-x-3">
                <i className="fa fa-plus-circle text-2xl text-blue-400"></i>
                <div>
                   <h3 className="text-lg font-black uppercase tracking-tight">Admit Body</h3>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">New Registration</p>
                </div>
             </div>
          </button>
       </div>

       {/* 2. Main Workspace */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-250px)]">
          
          {/* Left: Deceased List */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                   <h5 className="text-xs font-black text-gray-700 uppercase tracking-widest">Deceased Registry</h5>
                </div>
                <div className="relative">
                   <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                   <input 
                      type="text" 
                      placeholder="Search name, tag..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                   />
                </div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
                {filteredList.map(d => (
                   <div 
                      key={d.id} 
                      onClick={() => handleSelect(d)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all group ${
                         selectedId === d.id 
                         ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-100' 
                         : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                      }`}
                   >
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{d.tagNo}</span>
                         <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase border ${getStatusColor(d.status)}`}>
                            {d.status}
                         </span>
                      </div>
                      <h6 className="text-xs font-black text-gray-800 uppercase leading-snug mb-1">{d.surname}, {d.otherNames}</h6>
                      <div className="flex justify-between items-end text-[10px] text-gray-500">
                         <span>{d.gender} • {d.age} Yrs</span>
                         <span>{d.chamberNo}</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Right: Detailed View / Form */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
             {(selectedId || isEditing) ? (
                <form onSubmit={handleSave} className="flex flex-col h-full">
                   {/* Header */}
                   <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                         <div className="w-12 h-12 bg-gray-200 text-gray-500 rounded-xl flex items-center justify-center text-xl font-black shadow-inner">
                            {formData.surname?.charAt(0) || '?'}
                         </div>
                         <div>
                            <h4 className="text-lg font-black text-gray-800 uppercase tracking-tight">
                               {formData.surname || 'New'}, {formData.otherNames || 'Record'}
                            </h4>
                            <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-500 mt-1">
                               <span>Tag: <span className="text-blue-600">{formData.tagNo}</span></span>
                               <span>•</span>
                               <span>{formData.admissionType} Admission</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex space-x-2">
                         {!isEditing && (
                            <button type="button" onClick={() => setIsEditing(true)} className="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded text-[10px] font-black uppercase hover:bg-gray-50 shadow-sm">
                               Edit Details
                            </button>
                         )}
                         {isEditing && (
                            <button type="submit" className="bg-blue-600 text-white px-6 py-1.5 rounded text-[10px] font-black uppercase shadow hover:bg-blue-700 transition">
                               Save Changes
                            </button>
                         )}
                      </div>
                   </div>

                   {/* Tabs */}
                   <div className="flex border-b border-gray-100 px-6 bg-white">
                      {[
                         { id: 'details', label: 'Body Details' },
                         { id: 'storage', label: 'Storage' },
                         { id: 'nok', label: 'Next of Kin' },
                         { id: 'release', label: 'Release & Billing' }
                      ].map(tab => (
                         <button 
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-colors ${
                               activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                         >
                            {tab.label}
                         </button>
                      ))}
                   </div>

                   {/* Content */}
                   <div className="p-8 flex-1 overflow-y-auto">
                      {activeTab === 'details' && (
                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Surname</label>
                                  <input type="text" disabled={!isEditing} value={formData.surname || ''} onChange={e => setFormData({...formData, surname: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded text-xs font-bold bg-white" />
                               </div>
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Other Names</label>
                                  <input type="text" disabled={!isEditing} value={formData.otherNames || ''} onChange={e => setFormData({...formData, otherNames: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded text-xs font-bold bg-white" />
                               </div>
                               <div className="grid grid-cols-2 gap-4">
                                  <div>
                                     <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Gender</label>
                                     <select disabled={!isEditing} value={formData.gender || ''} onChange={e => setFormData({...formData, gender: e.target.value as any})} className="w-full p-2.5 border border-gray-200 rounded text-xs bg-white">
                                        <option>Male</option><option>Female</option><option>Other</option>
                                     </select>
                                  </div>
                                  <div>
                                     <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Age</label>
                                     <input type="number" disabled={!isEditing} value={formData.age || ''} onChange={e => setFormData({...formData, age: Number(e.target.value)})} className="w-full p-2.5 border border-gray-200 rounded text-xs font-bold bg-white" />
                                  </div>
                               </div>
                            </div>
                            <div className="space-y-4">
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Admission Type</label>
                                  <select disabled={!isEditing} value={formData.admissionType || 'Internal'} onChange={e => setFormData({...formData, admissionType: e.target.value as any})} className="w-full p-2.5 border border-gray-200 rounded text-xs bg-white">
                                     <option value="Internal">Internal (From Ward)</option>
                                     <option value="External">External (BID)</option>
                                  </select>
                               </div>
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">ID / Passport No</label>
                                  <input type="text" disabled={!isEditing} value={formData.idNumber || ''} onChange={e => setFormData({...formData, idNumber: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded text-xs font-bold bg-white" />
                               </div>
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Cause of Death</label>
                                  <input type="text" disabled={!isEditing} value={formData.causeOfDeath || ''} onChange={e => setFormData({...formData, causeOfDeath: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded text-xs font-bold bg-white" />
                               </div>
                            </div>
                         </div>
                      )}

                      {activeTab === 'storage' && (
                         <div className="space-y-6">
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-center justify-between">
                               <div>
                                  <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Current Location</h6>
                                  <p className="text-sm font-bold text-gray-700 mt-1">{formData.storageArea} &mdash; {formData.chamberNo}</p>
                               </div>
                               <div className="text-right">
                                  <p className="text-[10px] font-bold text-gray-500 uppercase">Received On</p>
                                  <p className="text-sm font-bold text-gray-800">{formData.dateReceived?.replace('T', ' ')}</p>
                               </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Storage Area</label>
                                  <select disabled={!isEditing} value={formData.storageArea || ''} onChange={e => setFormData({...formData, storageArea: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded text-xs bg-white">
                                     <option>Main Cold Room</option>
                                     <option>Private Wing</option>
                                     <option>Forensic Section</option>
                                  </select>
                               </div>
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Chamber / Rack No</label>
                                  <select disabled={!isEditing} value={formData.chamberNo || ''} onChange={e => setFormData({...formData, chamberNo: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded text-xs bg-white">
                                     <option>Rack 1-A</option>
                                     <option>Rack 1-B</option>
                                     <option>P-05</option>
                                  </select>
                               </div>
                            </div>
                         </div>
                      )}

                      {activeTab === 'nok' && (
                         <div className="space-y-4">
                            <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Primary Contact</h6>
                            <div className="grid grid-cols-2 gap-6">
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Name</label>
                                  <input type="text" disabled={!isEditing} value={formData.nokName || ''} onChange={e => setFormData({...formData, nokName: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded text-xs font-bold bg-white" />
                               </div>
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Relationship</label>
                                  <input type="text" disabled={!isEditing} value={formData.nokRelation || ''} onChange={e => setFormData({...formData, nokRelation: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded text-xs font-bold bg-white" />
                               </div>
                               <div>
                                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Telephone</label>
                                  <input type="tel" disabled={!isEditing} value={formData.nokPhone || ''} onChange={e => setFormData({...formData, nokPhone: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded text-xs font-bold bg-white" />
                               </div>
                            </div>
                         </div>
                      )}

                      {activeTab === 'release' && (
                         <div className="space-y-6">
                            {formData.status === 'Released' ? (
                               <div className="bg-green-50 border border-green-100 p-6 rounded-lg text-center">
                                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-xl mb-3">
                                     <i className="fa fa-check"></i>
                                  </div>
                                  <h3 className="text-lg font-black text-gray-800 uppercase">Released</h3>
                                  <p className="text-xs text-gray-500 mt-1">Released to {formData.releasedTo} on {formData.releaseDate}</p>
                                  <button type="button" className="mt-4 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-[10px] font-bold uppercase shadow-sm">Print Gate Pass</button>
                               </div>
                            ) : (
                               <>
                                 <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                       <h6 className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Pending Bill</h6>
                                       <p className="text-sm font-bold text-gray-700 mt-1">KES 15,000.00</p>
                                    </div>
                                    <button type="button" className="bg-white text-orange-600 px-3 py-1 rounded text-[10px] font-bold border border-orange-200 uppercase">View Bill</button>
                                 </div>
                                 
                                 <div className="pt-4 border-t border-gray-100">
                                    <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Release Process</h6>
                                    <div className="grid grid-cols-2 gap-4">
                                       <div>
                                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Released To (Name)</label>
                                          <input type="text" disabled={!isEditing} value={formData.releasedTo || ''} onChange={e => setFormData({...formData, releasedTo: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded text-xs font-bold bg-white" />
                                       </div>
                                       <div>
                                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Release Date</label>
                                          <input type="date" disabled={!isEditing} value={formData.releaseDate || ''} onChange={e => setFormData({...formData, releaseDate: e.target.value})} className="w-full p-2.5 border border-gray-200 rounded text-xs font-bold bg-white" />
                                       </div>
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                       <button type="button" onClick={() => { setFormData({...formData, status: 'Released'}); handleSave({ preventDefault: () => {} } as React.FormEvent); }} className="bg-red-600 text-white px-6 py-2 rounded text-[10px] font-black uppercase shadow hover:bg-red-700 transition">
                                          Confirm Release
                                       </button>
                                    </div>
                                 </div>
                               </>
                            )}
                         </div>
                      )}
                   </div>
                </form>
             ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-300">
                   <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <i className="fa fa-book-dead text-4xl opacity-20"></i>
                   </div>
                   <p className="text-sm font-bold uppercase tracking-widest">Select a record to view details</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default Morgue;
