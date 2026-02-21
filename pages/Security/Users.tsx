import React, { useState, useMemo, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { useSecurity } from '../../context/SecurityContext';

interface User {
  id: number;
  surname: string;
  othernames: string;
  username: string;
  roles: string[];
  branches: string[];
  status: 'Active' | 'Locked' | 'Blocked' | 'Disabled';
  lastLogin: string;
  logins: number;
  isEmployee: boolean;
}

const Users: React.FC = () => {
  const { notify } = useNotification();
  const { roles: systemRoles } = useSecurity();
  const [users, setUsers] = useState<User[]>([
    { id: 1, surname: 'ADMIN', othernames: 'SYSTEM', username: 'admin@admin.com', roles: ['Administrator'], branches: ['Main Branch'], status: 'Active', lastLogin: '24 Oct, 10:00 AM', logins: 452, isEmployee: true },
    { id: 2, surname: 'WILSON', othernames: 'JAMES', username: 'dr.wilson@hmis.com', roles: ['Doctor'], branches: ['Main Branch'], status: 'Active', lastLogin: '24 Oct, 09:30 AM', logins: 88, isEmployee: true },
    { id: 3, surname: 'KENNEDY', othernames: 'SARAH', username: 'nurse.sarah@hmis.com', roles: ['Nurse'], branches: ['Main Branch', 'Westlands'], status: 'Locked', lastLogin: '22 Oct, 14:00 PM', logins: 120, isEmployee: true },
  ]);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'roles' | 'logs'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const selectedUser = useMemo(() => users.find(u => u.id === selectedUserId), [users, selectedUserId]);

  const handleSaveUser = () => {
    notify('success', 'Account Updated', 'User security parameters have been synchronized across all branches.');
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Locked': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Blocked': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const inputClass = "w-full p-2.5 bg-white border border-slate-300 rounded-xl text-[11px] font-bold text-slate-800 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-sm";
  const labelClass = "block text-[9px] font-black text-slate-500 uppercase px-1 mb-1 tracking-widest";

  return (
    <div className="animate-bottom h-[calc(100vh-100px)] flex flex-col font-helvetica overflow-hidden -m-4 md:-m-6 bg-slate-50">
      
      <div className="bg-slate-900 border-l-[6px] border-l-red-600 p-3 flex justify-between items-center shrink-0 z-30 shadow-lg">
        <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center text-xl shadow-lg">
                <i className="fa fa-user-shield"></i>
            </div>
            <div>
                <h2 className="text-sm font-black text-white uppercase tracking-tighter leading-none">Identity Management</h2>
                <p className="text-[8px] text-red-400 font-bold uppercase tracking-widest mt-1">System User Access & Authentication</p>
            </div>
        </div>
        <div className="flex gap-2">
            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5 transition">Force Logout All</button>
            <button onClick={() => { setSelectedUserId(null); setIsEditing(true); }} className="bg-red-600 text-white px-6 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-red-700 transition">Add System User</button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0 bg-white">
        
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0">
            <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                <div className="relative">
                    <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"></i>
                    <input 
                        type="text" 
                        placeholder="Search Identity..." 
                        className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-none text-[10px] font-bold text-slate-800 outline-none focus:ring-1 focus:ring-red-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-50 scrollbar-hide">
                {filteredUsers.map(user => (
                    <div 
                        key={user.id} 
                        onClick={() => { setSelectedUserId(user.id); setIsEditing(false); }}
                        className={`p-4 cursor-pointer transition-all border-l-4 ${selectedUserId === user.id ? 'bg-red-50 border-l-red-600 shadow-inner' : 'hover:bg-gray-50 border-l-transparent'}`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded tracking-tighter">{user.username}</span>
                            <span className={`text-[8px] px-2 py-0.5 rounded-none font-black uppercase border ${getStatusColor(user.status)}`}>{user.status}</span>
                        </div>
                        <h6 className="text-xs font-black text-gray-800 uppercase truncate leading-tight mt-1">{user.surname}, {user.othernames}</h6>
                        <div className="flex justify-between items-center mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                            <span>Role: <span className="text-slate-600">{user.roles[0]}</span></span>
                            <span>{user.logins} Logins</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="flex-1 bg-slate-100 p-8 overflow-y-auto scrollbar-hide flex flex-col items-center">
            {selectedUser || isEditing ? (
                <div className="bg-white w-full max-w-4xl shadow-2xl rounded-3xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                    <div className="p-8 border-b border-gray-100 bg-slate-900 text-white flex justify-between items-center">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center text-3xl font-black shadow-xl">
                                {selectedUser?.surname?.[0] || '?'}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tight">{isEditing ? 'New User Identity' : `${selectedUser?.surname} ${selectedUser?.othernames}`}</h3>
                                <p className="text-sm font-mono text-red-400 font-black mt-1">ID: USER-{selectedUser?.id || 'NEW'}</p>
                            </div>
                        </div>
                        <button onClick={handleSaveUser} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all transform active:scale-95">Commit Account Changes</button>
                    </div>

                    <div className="flex border-b border-gray-100 bg-gray-50 px-6">
                        {[
                            { id: 'profile', label: 'Identity Profile', icon: 'fa-user' },
                            { id: 'roles', label: 'Access Rights', icon: 'fa-key' },
                            { id: 'logs', label: 'Audit Trail', icon: 'fa-history' },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === tab.id ? 'border-red-600 text-red-600 bg-white' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                            >
                                <i className={`fa ${tab.icon} mr-2`}></i> {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-10 bg-white flex-1 overflow-y-auto min-h-[400px]">
                        {activeTab === 'profile' && (
                            <div className="grid grid-cols-2 gap-10 animate-in fade-in">
                                <div className="space-y-6">
                                    <h6 className="text-[10px] font-black text-red-600 uppercase tracking-widest border-b border-red-50 pb-2">Basic Demographics</h6>
                                    <div className="space-y-4">
                                        <div><label className={labelClass}>Surname</label><input className={inputClass} defaultValue={selectedUser?.surname} /></div>
                                        <div><label className={labelClass}>Other Names</label><input className={inputClass} defaultValue={selectedUser?.othernames} /></div>
                                        <div><label className={labelClass}>Employee Link</label><select className={inputClass}><option>Link to Employee Record...</option></select></div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <h6 className="text-[10px] font-black text-red-600 uppercase tracking-widest border-b border-red-50 pb-2">Security Parameters</h6>
                                    <div className="space-y-4">
                                        <div><label className={labelClass}>Primary Username (Email)</label><input className={inputClass} defaultValue={selectedUser?.username} /></div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className={labelClass}>Account Status</label><select className={inputClass} defaultValue={selectedUser?.status}><option>Active</option><option>Disabled</option><option>Locked</option></select></div>
                                            <div><label className={labelClass}>Branch Node</label><select className={inputClass}><option>Main Branch</option><option>City Center</option></select></div>
                                        </div>
                                        <div className="pt-4 space-y-3">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input type="checkbox" className="w-4 h-4 rounded text-red-600" defaultChecked={selectedUser?.isEmployee} />
                                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-tight group-hover:text-red-600">Is Hospital Employee</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input type="checkbox" className="w-4 h-4 rounded text-red-600" />
                                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-tight group-hover:text-red-600">Force Password Change</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'roles' && (
                            <div className="space-y-8 animate-in fade-in">
                                <div className="p-6 bg-red-50 border border-red-100 rounded-2xl">
                                    <h6 className="text-[10px] font-black text-red-700 uppercase tracking-widest mb-4 flex items-center"><i className="fa fa-shield-halved mr-2"></i> Assigned Privilege Sets</h6>
                                    <div className="flex flex-wrap gap-3">
                                        {systemRoles.map(role => (
                                            <label key={role.id} className="flex items-center gap-3 bg-white border border-red-200 p-3 rounded-xl cursor-pointer hover:bg-red-100 transition-all">
                                                <input type="checkbox" className="w-4 h-4 rounded text-red-600" defaultChecked={selectedUser?.roles.includes(role.name)} />
                                                <span className="text-[11px] font-black text-slate-700 uppercase">{role.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase text-center leading-relaxed">Privileges are hierarchical. Granting 'Administrator' supersedes all other role constraints.</p>
                            </div>
                        )}

                        {activeTab === 'logs' && (
                             <div className="overflow-hidden border border-slate-100 rounded-2xl animate-in fade-in">
                                <table className="w-full text-left text-[10px] border-collapse">
                                    <thead className="bg-slate-900 text-white font-black uppercase tracking-widest">
                                        <tr>
                                            <th className="px-5 py-3">Timestamp</th>
                                            <th className="px-5 py-3">Action performed</th>
                                            <th className="px-5 py-3">Module</th>
                                            <th className="px-5 py-3 text-right">Node / IP</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-slate-700 font-bold uppercase">
                                        {[
                                            { t: '24-Oct 10:00', a: 'Login Success', m: 'Security', ip: '192.168.10.45' },
                                            { t: '24-Oct 10:15', a: 'Prescription Created', m: 'Pharmacy', ip: '192.168.10.45' },
                                            { t: '24-Oct 11:20', a: 'Bill Finalized', m: 'Billing', ip: '192.168.10.22' }
                                        ].map((log, i) => (
                                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-5 py-4 font-mono">{log.t}</td>
                                                <td className="px-5 py-4">{log.a}</td>
                                                <td className="px-5 py-4 text-red-600">{log.m}</td>
                                                <td className="px-5 py-4 text-right font-mono">{log.ip}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-slate-300 h-full">
                    <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-5xl shadow-sm border border-slate-200">
                        <i className="fa fa-user-lock opacity-10"></i>
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mt-6">Select Identity from Registry</h3>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Users;