import React, { useState, useMemo, FormEvent } from 'react';
import { Link } from 'react-router';
import { useSecurity, Role } from '../../context/SecurityContext';

interface RoleModalProps {
  role?: Role | null;
  onClose: () => void;
  onSave: (roleData: { id: string, name: string, description: string }) => void;
}

const RoleModal: React.FC<RoleModalProps> = ({ role, onClose, onSave }) => {
  const [name, setName] = useState(role?.name || '');
  const [description, setDescription] = useState(role?.description || '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      id: role?.id || Date.now().toString(),
      name,
      description,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-100 bg-slate-900 text-white flex justify-between items-center">
            <h5 className="text-sm font-black uppercase tracking-widest">{role ? 'Edit Role Authority' : 'Define New Authority'}</h5>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><i className="fa fa-times text-lg"></i></button>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest px-1">Authority Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-black text-slate-800 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-inner uppercase" placeholder="e.g. SENIOR NURSE" required />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1.5 tracking-widest px-1">Access Scope Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium h-32 resize-none outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-inner" placeholder="Detailed access level documentation..."></textarea>
            </div>
          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-xl text-[10px] font-black uppercase text-gray-600 hover:bg-white transition tracking-widest">Cancel</button>
            <button type="submit" className="bg-red-600 text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-xl shadow-red-500/20 hover:bg-red-700 transition tracking-widest transform active:scale-95">Commit Role</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UserRoles: React.FC = () => {
  const { roles, addRole, updateRole, deleteRole } = useSecurity();
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoles = useMemo(() => {
    return roles.filter(role => 
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [roles, searchTerm]);

  const handleOpenModal = (role: Role | null = null) => {
    setEditingRole(role);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRole(null);
  };

  const handleSaveRole = (roleData: { id: string, name: string, description: string }) => {
    if (editingRole) {
      updateRole({ ...editingRole, ...roleData });
    } else {
      addRole(roleData);
    }
    handleCloseModal();
  };
  
  const handleDeleteRole = (roleId: string) => {
    if (confirm(`Admin Action: Permanently delete the role "${roles.find(r=>r.id === roleId)?.name}"? This will detach all users.`)) {
      deleteRole(roleId);
    }
  };

  return (
    <div className="animate-bottom space-y-8 pb-20">
       {showModal && <RoleModal role={editingRole} onClose={handleCloseModal} onSave={handleSaveRole} />}
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm border-t-4 border-t-red-600">
             <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Authority Sets</h6>
             <div className="flex justify-between items-end mt-2">
                <h3 className="text-3xl font-black text-gray-800 tracking-tighter">{roles.length}</h3>
                <i className="fa fa-shield-alt text-red-50 text-3xl"></i>
             </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm border-t-4 border-t-blue-600">
             <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Provisioned Identities</h6>
             <div className="flex justify-between items-end mt-2">
                <h3 className="text-3xl font-black text-blue-600 tracking-tighter">{roles.reduce((acc, r) => acc + (r.userCount || 0), 0)}</h3>
                <i className="fa fa-users-cog text-blue-50 text-3xl"></i>
             </div>
          </div>
          <button 
             onClick={() => handleOpenModal()}
             className="bg-slate-900 rounded-3xl p-6 shadow-2xl text-white flex flex-col justify-center items-start cursor-pointer hover:bg-black transition-all transform active:scale-95 group relative overflow-hidden"
          >
             <div className="relative z-10">
                <h3 className="text-lg font-black uppercase tracking-tight">Define New Role</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Architect System Access</p>
             </div>
             <i className="fa fa-plus absolute -right-4 -bottom-4 text-7xl text-white/5 rotate-12 transition-transform group-hover:rotate-[20deg]"></i>
          </button>
       </div>
       
       <div className="flex items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm gap-4">
          <div className="flex-1 relative">
             <i className="fa fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
             <input 
                type="text" 
                placeholder="Find specific authority set..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-inner"
             />
          </div>
          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-4 border-l border-gray-100">
             Found: {filteredRoles.length} Authority Vectors
          </div>
       </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRoles.map((role, idx) => (
          <div key={role.id} className="bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col relative overflow-hidden h-[280px]">
            <div className={`absolute top-0 left-0 w-full h-1.5 ${['bg-red-600', 'bg-blue-600', 'bg-emerald-600', 'bg-indigo-600', 'bg-purple-600'][idx % 5]}`}></div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center text-xl shadow-inner group-hover:bg-slate-900 group-hover:text-white transition-all">
                    <i className="fa fa-user-tag"></i>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Status</span>
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-none text-[8px] font-black uppercase border border-green-200">Active</span>
                 </div>
              </div>
              
              <h5 className="text-sm font-black text-gray-800 uppercase tracking-tight group-hover:text-red-600 transition-colors truncate mb-2">{role.name}</h5>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed line-clamp-3 mb-4">{role.description || 'No detailed documentation provided for this authority scope.'}</p>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                 <div className="flex items-center text-[10px] font-black text-gray-500 uppercase">
                    <i className="fa fa-users mr-2 text-red-500"></i>
                    {role.userCount || 0} Assigned
                 </div>
                 <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => handleOpenModal(role)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center shadow-sm" title="Edit Meta"><i className="fa fa-pencil-alt text-[10px]"></i></button>
                    <button onClick={() => handleDeleteRole(role.id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center shadow-sm" title="Purge Role"><i className="fa fa-trash-alt text-[10px]"></i></button>
                 </div>
              </div>
            </div>
            
            <Link to="/security/privileges" className="block p-4 bg-slate-900 text-center text-[10px] font-black text-red-400 uppercase tracking-widest hover:bg-black transition-all">
               Manage Access Matrix <i className="fa fa-arrow-right ml-2"></i>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRoles;