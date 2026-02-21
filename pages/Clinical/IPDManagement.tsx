
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useNotification } from '../../context/NotificationContext';
import { usePatient } from '../../context/PatientContext';
import { useHospital } from '../../context/HospitalContext';
import QueueModal from '../../components/QueueModal';

interface Inpatient {
    id: string;
    name: string;
    ward: string;
    bed: string;
    admitted: string;
    status: 'In Treatment' | 'Ready to Leave' | 'Critical' | 'Post-Op' | 'Discharged';
    financialStatus: 'Cleared' | 'Pending';
    age: number;
    gender: string;
    doctor: string;
    scheme: string;
    lastVitals?: string;
    room?: string;
}

const IPDManagement: React.FC = () => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { setActivePatient } = usePatient();
  const { hospitalName } = useHospital();
  
  // --- UI States ---
  const [selectedInpatient, setSelectedInpatient] = useState<Inpatient | null>(null);
  const [activeWardFilter, setActiveWardFilter] = useState('All');
  const [registryFilter, setRegistryFilter] = useState<'Active' | 'Discharged'>('Active');
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [ipdSearchQuery, setIpdSearchQuery] = useState('');
  const [showQueueModal, setShowQueueModal] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // Admission Form State
  const [admissionForm, setAdmissionForm] = useState({
      patientSearch: '',
      ward: 'General Ward - Male',
      bed: '',
      doctor: '',
      reason: ''
  });

  // --- Mock Patient Data ---
  const [patients, setPatients] = useState<Inpatient[]>([
    { id: 'IP-001', name: 'JANE DOE', ward: 'General Ward - Female', bed: 'F-04', admitted: '2023-10-20', status: 'In Treatment', financialStatus: 'Cleared', age: 24, gender: 'Female', doctor: 'Dr. James Wilson', scheme: 'CASH', lastVitals: '10:30 AM' },
    { id: 'IP-042', name: 'JOHN SMITH', ward: 'Private Wing', bed: 'P-102', admitted: '2023-10-22', status: 'Ready to Leave', financialStatus: 'Cleared', age: 45, gender: 'Male', doctor: 'Dr. Sarah Jane', scheme: 'JUBILEE', lastVitals: '09:45 AM' },
    { id: 'IP-115', name: 'MARY ANN', ward: 'ICU / HDU', bed: 'ICU-01', admitted: '2023-10-23', status: 'Critical', financialStatus: 'Pending', age: 32, gender: 'Female', doctor: 'Dr. Mike Ross', scheme: 'NHIF', lastVitals: '11:15 AM' },
    { id: 'IP-201', name: 'ROBERT BARATHEON', ward: 'General Ward - Male', bed: 'M-12', admitted: '2023-10-18', status: 'Post-Op', financialStatus: 'Pending', age: 55, gender: 'Male', doctor: 'Dr. James Wilson', scheme: 'CASH', lastVitals: '08:00 AM' },
    { id: 'IP-999', name: 'NED STARK', ward: 'General Ward - Male', bed: '-', admitted: '2023-09-01', status: 'Discharged', financialStatus: 'Cleared', age: 50, gender: 'Male', doctor: 'Dr. James Wilson', scheme: 'CASH' },
  ]);

  // --- Dynamic Ward Extraction ---
  const wardStats = useMemo(() => {
    const wards: string[] = Array.from(new Set(patients.filter(p => p.status !== 'Discharged').map(p => p.ward)));
    const colors = ['blue', 'pink', 'teal', 'indigo', 'red', 'emerald', 'orange', 'violet'];
    return wards.map((w, idx) => {
        const occupied = patients.filter(p => p.ward === w && p.status !== 'Discharged').length;
        const capacity = w.includes('ICU') ? 5 : (w.includes('Private') ? 10 : 30);
        const colorBase = colors[idx % colors.length];
        return { name: w, occupied, capacity, color: `text-${colorBase}-600`, border: `border-${colorBase}-600` };
    });
  }, [patients]);

  const filteredInpatients = useMemo(() => {
      return patients.filter(p => {
          const matchesSearch = p.name.toLowerCase().includes(ipdSearchQuery.toLowerCase()) || p.id.toLowerCase().includes(ipdSearchQuery.toLowerCase()) || p.bed.toLowerCase().includes(ipdSearchQuery.toLowerCase());
          const matchesWard = activeWardFilter === 'All' || p.ward === activeWardFilter;
          const matchesRegistry = registryFilter === 'Active' ? p.status !== 'Discharged' : p.status === 'Discharged';
          return matchesSearch && matchesWard && matchesRegistry;
      });
  }, [activeWardFilter, patients, ipdSearchQuery, registryFilter]);

  const handleAction = (path: string) => {
    if (selectedInpatient) {
      setActivePatient({
        id: selectedInpatient.id,
        surname: selectedInpatient.name.split(' ')[1] || selectedInpatient.name,
        othernames: selectedInpatient.name.split(' ')[0],
        age: selectedInpatient.age,
        gender: selectedInpatient.gender,
        scheme: selectedInpatient.scheme,
        outpatientNo: selectedInpatient.id,
        telephone: '0700 000 000',
        status: 'Admitted'
      });
      navigate(path);
    }
  };
  
  const handleAdmitPatient = (e: React.FormEvent) => {
      e.preventDefault();
      // Mock admission
      const newPatient: Inpatient = {
          id: `IP-${Date.now().toString().slice(-4)}`,
          name: admissionForm.patientSearch || 'NEW PATIENT',
          ward: admissionForm.ward,
          bed: admissionForm.bed || 'TBA',
          admitted: new Date().toISOString().split('T')[0],
          status: 'In Treatment',
          financialStatus: 'Pending',
          age: 30,
          gender: 'Unknown',
          doctor: admissionForm.doctor || 'Unassigned',
          scheme: 'CASH'
      };
      setPatients([newPatient, ...patients]);
      notify('success', 'Admission Successful', `${newPatient.name} has been admitted to ${newPatient.ward}.`);
      setActiveModal(null);
      setAdmissionForm({ patientSearch: '', ward: 'General Ward - Male', bed: '', doctor: '', reason: '' });
  };

  const actionItemClass = "w-full text-left px-4 py-2.5 hover:bg-indigo-50 text-[11px] font-bold text-slate-700 transition-colors border-b border-slate-100 last:border-0 uppercase tracking-tight";
  const inputClass = "w-full p-2.5 bg-white border border-slate-300 rounded-xl text-[11px] font-bold text-slate-800 outline-none focus:border-indigo-600 transition-all shadow-inner";
  const labelClass = "block text-[9px] font-black text-slate-500 uppercase px-1 mb-1 tracking-widest";

  return (
    <div className="animate-bottom h-[calc(100vh-140px)] flex flex-col font-helvetica overflow-hidden bg-white text-slate-900 -m-4 md:-m-6">
      
      {/* 1. Header */}
      <div className="bg-slate-900 border-l-[6px] border-l-indigo-600 p-3 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-800 shrink-0 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-none flex items-center justify-center text-xl shadow-lg">
            <i className="fa fa-hospital-user"></i>
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-tighter leading-none">Inpatient Management</h2>
            <p className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Census Control & Admissions</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
            <button onClick={() => setActiveModal('admission')} className="bg-indigo-600 text-white px-6 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition">Admit New</button>
            <button onClick={() => setShowQueueModal(true)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest border border-white/5 transition">Queue Move</button>
        </div>
      </div>

      {/* 2. Search & Context */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 shrink-0 flex items-center justify-between">
        <div className="flex-1 max-w-4xl px-2">
           <div className="relative">
              <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
              <input 
                type="text" 
                placeholder="Identity Search (Name, Bed, IP#)..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-none text-[11px] font-black uppercase text-slate-700 outline-none focus:ring-1 focus:ring-indigo-600 shadow-inner"
                value={ipdSearchQuery}
                onChange={(e) => setIpdSearchQuery(e.target.value)}
              />
           </div>
        </div>
        <div className="flex bg-gray-200 p-1 rounded-none mr-2">
            <button onClick={() => setRegistryFilter('Active')} className={`px-4 py-1.5 text-[9px] font-black uppercase transition-all ${registryFilter === 'Active' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Active</button>
            <button onClick={() => setRegistryFilter('Discharged')} className={`px-4 py-1.5 text-[9px] font-black uppercase transition-all ${registryFilter === 'Discharged' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Archives</button>
        </div>
      </div>

      {/* 3. Ward Filter Row */}
      <div className="bg-white border border-slate-100 p-2 shrink-0">
        <div className="flex gap-2 px-2 overflow-x-auto scrollbar-hide">
            <button onClick={() => setActiveWardFilter('All')} className={`flex flex-col min-w-[110px] p-2 border transition-all ${activeWardFilter === 'All' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-400'}`}>
                <span className="text-[8px] font-black uppercase tracking-tighter">Cumulative</span>
                <span className={`text-[10px] font-black uppercase mt-1 ${activeWardFilter === 'All' ? 'text-white' : 'text-slate-700'}`}>WARD VIEW</span>
            </button>
            {wardStats.map((ward, i) => (
                <button key={i} onClick={() => setActiveWardFilter(ward.name)} className={`flex flex-col min-w-[140px] p-2 border transition-all ${activeWardFilter === ward.name ? `bg-white ${ward.border} shadow-lg scale-[1.02] z-10` : 'bg-white border-slate-200 hover:border-slate-400'}`}>
                    <div className="flex justify-between items-start w-full">
                        <span className={`text-[8px] font-black uppercase tracking-widest ${activeWardFilter === ward.name ? ward.color : 'text-slate-400'}`}>{ward.occupied}/{ward.capacity}</span>
                        {activeWardFilter === ward.name && <i className={`fa fa-check-circle ${ward.color} text-[9px]`}></i>}
                    </div>
                    <span className={`text-[10px] font-black uppercase mt-1 text-left ${activeWardFilter === ward.name ? 'text-slate-900' : 'text-slate-600'} truncate w-full`}>{ward.name}</span>
                </button>
            ))}
        </div>
      </div>

      {/* 4. Full Width Registry Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-[11px]">
                  <thead className="bg-white border-b border-slate-200 text-slate-400 font-black uppercase tracking-tight sticky top-0 z-10 shadow-sm">
                      <tr>
                          <th className="px-5 py-3">Inpatient</th>
                          <th className="px-5 py-3">Admit Date</th>
                          <th className="px-5 py-3 text-center">Status</th>
                          <th className="px-5 py-3 text-right">Action</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {filteredInpatients.map((p) => (
                          <tr key={p.id} onClick={() => setSelectedInpatient(p)} className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedInpatient?.id === p.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600 shadow-inner' : 'border-l-4 border-l-transparent'}`}>
                              <td className="px-5 py-3">
                                  <div className="flex items-center space-x-3">
                                      <div className={`w-8 h-8 flex items-center justify-center font-black text-xs ${selectedInpatient?.id === p.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{p.name.charAt(0)}</div>
                                      <div>
                                          <div className="font-black text-slate-800 uppercase">{p.name}</div>
                                          <div className="text-[8px] text-gray-400 font-bold uppercase">{p.id} &bull; <span className="text-indigo-600 font-black">{p.bed}</span></div>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-5 py-3 text-[10px] font-bold text-slate-600 uppercase">{p.admitted}</td>
                              <td className="px-5 py-3 text-center">
                                  <span className={`px-2 py-0.5 rounded-none text-[8px] font-black uppercase border ${p.status === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>{p.status}</span>
                              </td>
                              <td className="px-5 py-3 text-right">
                                  <i className="fa fa-chevron-right text-slate-200 transition-all"></i>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>

      {/* Inpatient Hub Popup Modal */}
      {selectedInpatient && (
          <div 
            className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSelectedInpatient(null)}
          >
              <div 
                className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                  {/* Header */}
                  <div className="p-6 bg-slate-900 text-white flex justify-between items-start shrink-0 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                          <i className="fa fa-hospital-user text-9xl transform -rotate-12"></i>
                      </div>
                      <div className="flex items-center space-x-5 relative z-10">
                          <div className="w-16 h-16 bg-white text-indigo-900 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg">
                              {selectedInpatient.name.charAt(0)}
                          </div>
                          <div>
                              <h3 className="text-xl font-black uppercase tracking-tight leading-none">{selectedInpatient.name}</h3>
                              <div className="flex items-center gap-2 mt-2">
                                   <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${selectedInpatient.status === 'Critical' ? 'bg-red-600 border-red-500' : 'bg-indigo-600 border-indigo-500'}`}>{selectedInpatient.status}</span>
                                   <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest bg-indigo-900/50 px-2 py-0.5 rounded border border-indigo-700/50">{selectedInpatient.id}</span>
                              </div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                  {selectedInpatient.age} Yrs &bull; {selectedInpatient.gender} &bull; {selectedInpatient.scheme}
                              </p>
                          </div>
                      </div>
                      <button onClick={() => setSelectedInpatient(null)} className="text-white/50 hover:text-white transition-colors relative z-10"><i className="fa fa-times text-2xl"></i></button>
                  </div>

                  {/* Content */}
                  <div className="p-8 bg-slate-50 flex-1 overflow-y-auto">
                       {/* Status */}
                       <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                                  <i className="fa fa-bed"></i>
                              </div>
                              <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Location</p>
                                  <p className="text-sm font-black text-slate-800 uppercase">{selectedInpatient.ward} &bull; {selectedInpatient.bed}</p>
                              </div>
                           </div>
                           <div className="text-right">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attending</p>
                               <p className="text-sm font-bold text-slate-700">{selectedInpatient.doctor}</p>
                           </div>
                       </div>

                       <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Clinical Actions</h6>

                       {/* Grid */}
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                          {[
                              { label: 'Charts', path: '/clinical/chart', icon: 'fa-file-medical-alt', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                              { label: 'Nursing', path: '/clinical/nursing', icon: 'fa-user-nurse', color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100' },
                              { label: 'Meds (eMAR)', path: '/pharmacy/main', icon: 'fa-pills', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
                              { label: 'Vitals', path: '/clinical/nursing', icon: 'fa-heartbeat', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
                              { label: 'Lab Results', path: '/lab', icon: 'fa-flask', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
                              { label: 'Transfer', path: '/clinical/ipd-management', icon: 'fa-exchange-alt', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', action: () => setShowQueueModal(true) }, 
                              { label: 'Billing', path: '/billing/bills', icon: 'fa-file-invoice-dollar', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                              { label: 'Discharge', path: '/clinical/ipd-management', icon: 'fa-door-open', color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200', action: () => setShowQueueModal(true) },
                          ].map(item => (
                              <button 
                                  key={item.label}
                                  onClick={() => item.action ? item.action() : handleAction(item.path)}
                                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border ${item.bg} ${item.border} hover:shadow-md transition-all group active:scale-95`}
                              >
                                  <div className={`text-2xl mb-2 ${item.color} group-hover:scale-110 transition-transform`}>
                                      <i className={`fa ${item.icon}`}></i>
                                  </div>
                                  <span className={`text-[10px] font-black uppercase tracking-tight ${item.color.replace('600', '800')}`}>{item.label}</span>
                              </button>
                          ))}
                       </div>
                       
                       {/* Footer Buttons */}
                       <div className="grid grid-cols-2 gap-4">
                           <button className="py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition flex items-center justify-center gap-2">
                              <i className="fa fa-print text-slate-400"></i> Wristband
                           </button>
                           <button className="py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition flex items-center justify-center gap-2">
                              <i className="fa fa-history text-slate-400"></i> Admission History
                           </button>
                       </div>
                  </div>
              </div>
          </div>
      )}

      {/* Admission / Check-In Modal */}
      {activeModal === 'admission' && (
          <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                 {/* Header */}
                 <div className="p-6 bg-slate-900 text-white flex justify-between items-start shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                        <i className="fa fa-procedures text-9xl transform -rotate-12"></i>
                    </div>
                    <div className="relative z-10">
                       <h3 className="text-xl font-black uppercase tracking-tight">New Admission</h3>
                       <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Assign Ward & Bed</p>
                    </div>
                    <button onClick={() => setActiveModal(null)} className="text-white/50 hover:text-white transition-colors relative z-10"><i className="fa fa-times text-2xl"></i></button>
                 </div>

                 {/* Content */}
                 <div className="p-8 bg-slate-50 flex-1 overflow-y-auto">
                    <form onSubmit={handleAdmitPatient}>
                        {/* Search Patient Field */}
                        <div className="mb-8">
                           <label className={labelClass}>Identify Patient</label>
                           <div className="relative">
                             <input 
                                className="w-full p-4 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-indigo-600 transition-all shadow-inner pl-12" 
                                placeholder="Search by Name, OP Number or Phone..." 
                                value={admissionForm.patientSearch}
                                onChange={(e) => setAdmissionForm({...admissionForm, patientSearch: e.target.value})}
                                autoFocus
                             />
                             <i className="fa fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
                           </div>
                           <p className="text-[9px] text-indigo-500 font-bold uppercase mt-2 ml-1 cursor-pointer hover:underline"><i className="fa fa-plus-circle mr-1"></i> Or Register New Casualty</p>
                        </div>

                        {/* Form Grid */}
                        <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 border-b border-slate-200 pb-2">Admission Logistics</h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                           <div>
                              <label className={labelClass}>Target Ward</label>
                              <select 
                                 className={inputClass}
                                 value={admissionForm.ward}
                                 onChange={(e) => setAdmissionForm({...admissionForm, ward: e.target.value})}
                              >
                                 <option>General Ward - Male</option>
                                 <option>General Ward - Female</option>
                                 <option>Maternity Wing</option>
                                 <option>Paediatric Ward</option>
                                 <option>Private Wing</option>
                                 <option>ICU / HDU</option>
                              </select>
                           </div>
                           <div>
                              <label className={labelClass}>Bed Number</label>
                              <select 
                                 className={inputClass}
                                 value={admissionForm.bed}
                                 onChange={(e) => setAdmissionForm({...admissionForm, bed: e.target.value})}
                              >
                                 <option value="">Auto-Assign</option>
                                 <option>Bed 01 (Window)</option>
                                 <option>Bed 02</option>
                                 <option>Bed 03</option>
                              </select>
                           </div>
                           <div>
                              <label className={labelClass}>Admitting Doctor</label>
                              <select 
                                 className={inputClass}
                                 value={admissionForm.doctor}
                                 onChange={(e) => setAdmissionForm({...admissionForm, doctor: e.target.value})}
                              >
                                 <option value="">Select Consultant...</option>
                                 <option>Dr. James Wilson</option>
                                 <option>Dr. Sarah Jane</option>
                              </select>
                           </div>
                           <div>
                              <label className={labelClass}>Payment Scheme</label>
                              <select className={inputClass}>
                                 <option>Cash</option>
                                 <option>NHIF / SHA</option>
                                 <option>Corporate Insurance</option>
                              </select>
                           </div>
                        </div>

                        <div className="mb-8">
                             <label className={labelClass}>Provisional Diagnosis / Reason</label>
                             <textarea 
                                className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-medium outline-none focus:border-indigo-600 shadow-inner h-24 resize-none"
                                placeholder="Enter reason for admission..."
                                value={admissionForm.reason}
                                onChange={(e) => setAdmissionForm({...admissionForm, reason: e.target.value})}
                             ></textarea>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex gap-4">
                           <button type="button" onClick={() => setActiveModal(null)} className="flex-1 py-3 border border-slate-300 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 transition">Cancel</button>
                           <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase shadow-xl hover:bg-indigo-700 transition transform active:scale-95">Confirm Admission</button>
                        </div>
                    </form>
                 </div>
             </div>
          </div>
      )}

      <QueueModal 
        isOpen={showQueueModal} 
        onClose={() => setShowQueueModal(false)}
        patientName={selectedInpatient?.name}
        patientId={selectedInpatient?.id}
      />
    </div>
  );
};

export default IPDManagement;
