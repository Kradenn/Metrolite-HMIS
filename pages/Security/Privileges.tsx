import React, { useState, useMemo, FormEvent, useEffect } from 'react';
import { Link } from 'react-router';
import { useSecurity, Role } from '../../context/SecurityContext';

interface Privilege {
  id: number;
  name: string;
  group: string;
}

const mockPrivilegesData: Privilege[] = [
  { id: 1, name: 'Manage Users (Create, Edit, Delete)', group: 'Security Operations' },
  { id: 2, name: 'Manage Roles & Privileges', group: 'Security Operations' },
  { id: 3, name: 'View System Audit Logs', group: 'Security Operations' },
  { id: 10, name: 'View Longitudinal Patient Records', group: 'Clinical Core' },
  { id: 11, name: 'Admit Patients to IPD', group: 'Clinical Core' },
  { id: 12, name: 'Discharge Inpatients', group: 'Clinical Core' },
  { id: 13, name: 'Modify Triage Vitals', group: 'Clinical Core' },
  { id: 14, name: 'Finalize Physician Consultations', group: 'Clinical Core' },
  { id: 15, name: 'Create Laboratory Orders', group: 'Diagnostics' },
  { id: 16, name: 'Enter Laboratory Results', group: 'Diagnostics' },
  { id: 17, name: 'Verify Laboratory Reports', group: 'Diagnostics' },
  { id: 20, name: 'Access Financial Ledger', group: 'Revenue Cycle' },
  { id: 21, name: 'Finalize Patient Invoices', group: 'Revenue Cycle' },
  { id: 22, name: 'Void / Credit Issued Receipts', group: 'Revenue Cycle' },
  { id: 23, name: 'Manage Payer Schemes & Tariffs', group: 'Revenue Cycle' },
  { id: 30, name: 'Dispense Controlled Substances', group: 'Pharmacy' },
  { id: 31, name: 'Manage Pharmacy Inventory', group: 'Pharmacy' },
  { id: 32, name: 'Access Wholesale Sourcing', group: 'Procurement' },
  { id: 40, name: 'Access P&L Reports', group: 'Executive BI' },
  { id: 41, name: 'Access Clinical KPI Dashboard', group: 'Executive BI' },
];

const PrivilegeList: React.FC<{
    title: string;
    groupedPrivs: Record<string, Privilege[]>;
    selection: Set<number>;
    onToggle: (id: number) => void;
    onToggleGroup: (groupName: string) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    icon: string;
    accentColor: string;
}> = ({ title, groupedPrivs, selection, onToggle, onToggleGroup, searchTerm, onSearchChange, icon, accentColor }) => {
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(Object.keys(groupedPrivs)));

    const toggleGroupExpansion = (groupName: string) => {
        const newSet = new Set(expandedGroups);
        newSet.has(groupName) ? newSet.delete(groupName) : newSet.add(groupName);
        setExpandedGroups(newSet);
    };

    return (
    <div className="border border-slate-200 rounded-3xl flex flex-col bg-white h-full shadow-sm overflow-hidden border-t-8" style={{ borderTopColor: accentColor }}>
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex flex-col gap-4">
        <div className="flex items-center space-x-3">
           <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm" style={{ color: accentColor }}>
             <i className={`fa ${icon}`}></i>
           </div>
           <h6 className="text-[11px] font-black uppercase tracking-widest text-slate-800">{title}</h6>
        </div>
        <div className="relative">
            <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
            <input 
                type="text" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-inner"
                placeholder="Filter vector set..."
            />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30 scrollbar-hide">
        {Object.keys(groupedPrivs).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-300 py-20">
             <i className="fa fa-ban text-4xl mb-3 opacity-20"></i>
             <p className="text-[10px] font-black uppercase tracking-widest">No matching vectors</p>
          </div>
        ) : (
          Object.keys(groupedPrivs).map((group) => {
            const privs = groupedPrivs[group];
            const isExpanded = expandedGroups.has(group);
            const isGroupSelected = privs.length > 0 && privs.every(p => selection.has(p.id));
            const isGroupPartial = privs.some(p => selection.has(p.id)) && !isGroupSelected;

            return (
            <div key={group} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all group">
              <div 
                 onClick={() => toggleGroupExpansion(group)} 
                 className="p-4 cursor-pointer flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                    <div onClick={(e) => e.stopPropagation()} className="flex items-center">
                       <input 
                         type="checkbox" 
                         className="w-4 h-4 rounded text-indigo-600 focus:ring-0 cursor-pointer transition-all" 
                         onChange={() => onToggleGroup(group)}
                         checked={isGroupSelected}
                         ref={input => { if (input) input.indeterminate = isGroupPartial; }}
                       />
                    </div>
                    <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{group}</h6>
                </div>
                <i className={`fa fa-chevron-down text-[9px] text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}></i>
              </div>
              {isExpanded && (
                <div className="border-t border-slate-50 divide-y divide-slate-50">
                    {privs.map(priv => (
                    <div key={priv.id} onClick={() => onToggle(priv.id)}
                        className={`p-3.5 cursor-pointer transition-all text-[11px] font-bold flex justify-between items-center group/item ${selection.has(priv.id) ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-slate-50 text-slate-600'}`}>
                        <span>{priv.name}</span>
                        {selection.has(priv.id) ? <i className="fa fa-check-circle text-indigo-600 text-[10px]"></i> : <i className="fa fa-plus text-slate-200 text-[9px] opacity-0 group-hover/item:opacity-100 transition-opacity"></i>}
                    </div>
                    ))}
                </div>
              )}
            </div>
          )})
        )}
      </div>
    </div>
  )};


const Privileges: React.FC = () => {
  const { roles, rolePrivileges, setRolePrivileges } = useSecurity();
  const [privileges] = useState<Privilege[]>(mockPrivilegesData);
  
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(roles[0]?.id || null);
  const [selectedAvailable, setSelectedAvailable] = useState<Set<number>>(new Set());
  const [selectedAssigned, setSelectedAssigned] = useState<Set<number>>(new Set());
  const [availableSearch, setAvailableSearch] = useState('');
  const [assignedSearch, setAssignedSearch] = useState('');

  const { available, assigned } = useMemo(() => {
    if (!selectedRoleId) return { available: [], assigned: [] };
    const assignedIds = new Set(rolePrivileges[selectedRoleId] || []);
    const assignedPrivs = privileges.filter(p => assignedIds.has(p.id));
    const availablePrivs = privileges.filter(p => !assignedIds.has(p.id));
    return { available: availablePrivs, assigned: assignedPrivs };
  }, [selectedRoleId, rolePrivileges, privileges]);
  
  const groupPrivileges = (privs: Privilege[], searchTerm: string) => {
    const filtered = privs.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return filtered.reduce((acc, p) => {
      (acc[p.group] = acc[p.group] || []).push(p);
      return acc;
    }, {} as Record<string, Privilege[]>);
  };

  const groupedAvailable = useMemo(() => groupPrivileges(available, availableSearch), [available, availableSearch]);
  const groupedAssigned = useMemo(() => groupPrivileges(assigned, assignedSearch), [assigned, assignedSearch]);

  const handleMove = (direction: 'add' | 'remove') => {
    if (!selectedRoleId) return;
    const currentAssigned = new Set(rolePrivileges[selectedRoleId] || []);
    if (direction === 'add') {
      selectedAvailable.forEach(id => currentAssigned.add(id));
      setSelectedAvailable(new Set());
    } else {
      selectedAssigned.forEach(id => currentAssigned.delete(id));
      setSelectedAssigned(new Set());
    }
    setRolePrivileges(selectedRoleId, Array.from(currentAssigned));
  };

  return (
    <div className="animate-bottom h-[calc(100vh-140px)] flex flex-col -m-4 md:-m-6 bg-slate-50 font-helvetica overflow-hidden">
       
       <div className="bg-slate-900 border-l-[6px] border-l-red-600 p-4 flex justify-between items-center shrink-0 z-30 shadow-lg">
         <div className="flex items-center space-x-5">
            <div className="w-10 h-10 bg-red-600 text-white rounded-none flex items-center justify-center text-xl shadow-lg">
                <i className="fa fa-shield-halved"></i>
            </div>
            <div>
                <h2 className="text-sm font-black text-white uppercase tracking-tighter leading-none">Access Control Matrix</h2>
                <p className="text-[8px] text-red-400 font-bold uppercase tracking-widest mt-1">Granular Permission Orchestration</p>
            </div>
         </div>
         <div className="flex gap-3">
             <div className="text-right hidden sm:block">
                 <p className="text-[8px] font-black text-slate-500 uppercase leading-none mb-1">Target Authority</p>
                 <h4 className="text-sm font-black text-blue-400 uppercase tracking-tighter leading-none">{roles.find(r => r.id === selectedRoleId)?.name || 'NONE'}</h4>
             </div>
             <button className="bg-red-600 text-white px-8 py-2 rounded-none text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-red-700 transition">Save Matrix</button>
         </div>
       </div>
      
       <div className="flex-1 flex overflow-hidden min-h-0 bg-white">
          <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden shadow-inner">
             <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Authority Sets</h5>
                <Link to="/security/roles" className="text-[9px] font-black text-blue-600 uppercase hover:underline">Manage</Link>
             </div>
             <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-gray-50/30 scrollbar-hide">
                {roles.map(role => (
                   <div key={role.id} onClick={() => setSelectedRoleId(role.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-l-4 ${selectedRoleId === role.id ? 'bg-white border-l-red-600 shadow-md ring-1 ring-black/5' : 'border-l-transparent hover:bg-white hover:shadow-sm'}`}>
                      <h6 className={`text-[11px] font-black uppercase tracking-tight ${selectedRoleId === role.id ? 'text-red-700' : 'text-slate-800'}`}>{role.name}</h6>
                      <div className="flex justify-between items-center mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                         <span>{(rolePrivileges[role.id] || []).length} Rules</span>
                         <span>{role.userCount || 0} IDs</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-9 gap-6 p-8 bg-slate-50 overflow-hidden">
            <div className="md:col-span-4 h-full">
                <PrivilegeList 
                    title="Available Capabilities" 
                    icon="fa-lock-open"
                    accentColor="#64748b"
                    groupedPrivs={groupedAvailable} selection={selectedAvailable}
                    onToggle={(id) => {
                        const newSet = new Set(selectedAvailable);
                        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
                        setSelectedAvailable(newSet);
                    }}
                    onToggleGroup={(group) => {
                        const groupIds = (groupedAvailable[group] || []).map(p => p.id);
                        const newSet = new Set(selectedAvailable);
                        const allSelected = groupIds.every(id => newSet.has(id));
                        allSelected ? groupIds.forEach(id => newSet.delete(id)) : groupIds.forEach(id => newSet.add(id));
                        setSelectedAvailable(newSet);
                    }}
                    searchTerm={availableSearch} onSearchChange={setAvailableSearch}
                />
            </div>

            <div className="md:col-span-1 flex flex-row md:flex-col items-center justify-center gap-6">
                <button 
                  onClick={() => handleMove('add')} 
                  disabled={selectedAvailable.size === 0}
                  className="w-14 h-14 rounded-3xl bg-slate-900 text-white hover:bg-red-600 disabled:opacity-30 disabled:grayscale transition-all shadow-2xl flex items-center justify-center transform active:scale-95 group"
                >
                    <i className="fa fa-chevron-right hidden md:block text-lg group-hover:translate-x-1 transition-transform"></i>
                    <i className="fa fa-chevron-down md:hidden text-lg"></i>
                </button>
                <button 
                  onClick={() => handleMove('remove')} 
                  disabled={selectedAssigned.size === 0}
                  className="w-14 h-14 rounded-3xl bg-slate-900 text-white hover:bg-blue-600 disabled:opacity-30 disabled:grayscale transition-all shadow-2xl flex items-center justify-center transform active:scale-95 group"
                >
                    <i className="fa fa-chevron-left hidden md:block text-lg group-hover:-translate-x-1 transition-transform"></i>
                    <i className="fa fa-chevron-up md:hidden text-lg"></i>
                </button>
            </div>

            <div className="md:col-span-4 h-full">
                <PrivilegeList 
                    title={`Assigned to ${selectedRoleId ? roles.find(r => r.id === selectedRoleId)?.name : 'Role'}`}
                    icon="fa-shield-halved"
                    accentColor="#ef4444"
                    groupedPrivs={groupedAssigned} selection={selectedAssigned}
                    onToggle={(id) => {
                        const newSet = new Set(selectedAssigned);
                        newSet.has(id) ? newSet.delete(id) : newSet.add(id);
                        setSelectedAssigned(newSet);
                    }}
                    onToggleGroup={(group) => {
                        const groupIds = (groupedAssigned[group] || []).map(p => p.id);
                        const newSet = new Set(selectedAssigned);
                        const allSelected = groupIds.every(id => newSet.has(id));
                        allSelected ? groupIds.forEach(id => newSet.delete(id)) : groupIds.forEach(id => newSet.add(id));
                        setSelectedAssigned(newSet);
                    }}
                    searchTerm={assignedSearch} onSearchChange={setAssignedSearch}
                />
            </div>
          </div>
       </div>
    </div>
  );
};

export default Privileges;