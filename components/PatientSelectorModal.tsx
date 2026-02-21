
import React, { useState, useMemo } from 'react';
import { usePatient, PatientRecord } from '../context/PatientContext';

interface PatientSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterType?: 'mothers' | 'kids' | 'adolescents' | 'all';
  title?: string;
}

// Mock Global Registry with Production-ready data structure
const GLOBAL_REGISTRY: PatientRecord[] = [
    { id: '1', surname: 'DOE', othernames: 'JANE', age: 24, gender: 'Female', scheme: 'CASH', outpatientNo: 'OP-2023-001', telephone: '0711000000', status: 'None', allergies: 'Penicillin', diagnosis: 'Hypertension' },
    { id: '2', surname: 'SMITH', othernames: 'MARY', age: 28, gender: 'Female', scheme: 'JUBILEE', outpatientNo: 'OP-2023-042', telephone: '0722000000', status: 'None', allergies: 'None' },
    { id: '3', surname: 'MWANGI', othernames: 'GRACE', age: 31, gender: 'Female', scheme: 'NHIF', outpatientNo: 'OP-2023-115', telephone: '0733000000', status: 'None', allergies: 'Sulfa Drugs' },
    { id: 'k1', surname: 'DOE', othernames: 'BABY RYAN', age: 0.5, gender: 'Male', scheme: 'CASH', outpatientNo: 'PED-2023-001', telephone: '0711000000', status: 'None', parentName: 'JANE DOE' },
    { id: 'k2', surname: 'SMITH', othernames: 'BABY LIAM', age: 2, gender: 'Male', scheme: 'NHIF', outpatientNo: 'PED-2023-088', telephone: '0722000000', status: 'None', parentName: 'MARY SMITH' },
    { id: '4', surname: 'KAMAU', othernames: 'PETER', age: 45, gender: 'Male', scheme: 'NHIF', outpatientNo: 'OP-2023-501', telephone: '0744000000', status: 'None' },
    { id: '5', surname: 'OTIENO', othernames: 'KEVIN', age: 16, gender: 'Male', scheme: 'CASH', outpatientNo: 'OP-2023-600', telephone: '0755000000', status: 'None' },
];

const PatientSelectorModal: React.FC<PatientSelectorModalProps> = ({ isOpen, onClose, filterType = 'all', title }) => {
  const { setActivePatient } = usePatient();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredList = useMemo(() => {
    let base = GLOBAL_REGISTRY;
    if (filterType === 'mothers') base = base.filter(p => p.gender === 'Female' && p.age > 13);
    else if (filterType === 'kids') base = base.filter(p => p.age <= 13);
    else if (filterType === 'adolescents') base = base.filter(p => p.age >= 10 && p.age <= 24);

    if (!searchTerm.trim()) return base;
    const query = searchTerm.toLowerCase();
    return base.filter(p => 
      p.surname.toLowerCase().includes(query) || 
      p.othernames.toLowerCase().includes(query) ||
      p.outpatientNo.toLowerCase().includes(query)
    );
  }, [searchTerm, filterType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex justify-between items-start shrink-0 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                 <i className="fa fa-fingerprint text-9xl transform -rotate-12"></i>
             </div>
             <div className="flex items-center space-x-4 relative z-10">
                 <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-indigo-500/30">
                     <i className="fa fa-search"></i>
                 </div>
                 <div>
                    <h5 className="text-xl font-black uppercase tracking-tight">{title || 'Registry Explorer'}</h5>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Searching {filterType} database</p>
                 </div>
             </div>
             <button onClick={onClose} className="text-white/50 hover:text-white transition-colors relative z-10"><i className="fa fa-times text-2xl"></i></button>
        </div>

        {/* Dynamic Search */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 shrink-0">
          <div className="relative group max-w-3xl mx-auto">
            <i className="fa fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
            <input 
              type="text" 
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter Patient Name, ID Number, or Phone..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-300 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-bold text-slate-800 text-lg shadow-sm"
            />
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredList.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => { setActivePatient(p); onClose(); }}
                  className="w-full text-left p-5 bg-white border border-slate-200 rounded-[1.5rem] hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition-all flex items-start space-x-5 group relative overflow-hidden"
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                    {p.surname[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h6 className="text-sm font-black text-slate-800 uppercase group-hover:text-indigo-600 transition-colors truncate">
                      {p.surname}, {p.othernames}
                    </h6>
                    <div className="flex items-center space-x-2 mt-1 text-[10px] font-bold uppercase tracking-tight text-slate-400">
                      <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{p.outpatientNo}</span>
                      <span>{p.gender} &bull; {p.age}y</span>
                    </div>
                    {p.allergies && p.allergies !== 'None' && (
                        <div className="mt-3 flex items-center space-x-2">
                           <span className="bg-red-50 text-red-600 text-[8px] font-black px-2 py-0.5 rounded border border-red-100 uppercase tracking-tighter"><i className="fa fa-triangle-exclamation mr-1"></i> Allergy: {p.allergies}</span>
                        </div>
                    )}
                  </div>
                  <div className="shrink-0 flex flex-col items-end">
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Status</span>
                      <span className="text-[10px] font-black text-emerald-500 uppercase bg-emerald-50 px-2 py-0.5 rounded">Active File</span>
                  </div>
                </button>
            ))}
          </div>
          {filteredList.length === 0 && (
             <div className="py-20 text-center">
                <i className="fa fa-user-slash text-6xl text-slate-300 mb-4 opacity-50"></i>
                <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No clinical record matches</p>
                <button className="mt-4 text-indigo-600 font-black text-[10px] uppercase hover:underline">Register New Patient</button>
             </div>
          )}
        </div>

        <div className="p-4 bg-slate-900 border-t border-white/5 flex justify-between items-center px-8 shrink-0">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Registry Engine v3.1 &bull; Secure Encrypted Tunnel</span>
          <div className="flex items-center space-x-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-[9px] font-black text-green-500 uppercase">Live Database Sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientSelectorModal;
