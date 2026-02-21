
import React, { useState, useMemo, FormEvent, useEffect } from 'react';
import { useLocation } from 'react-router';

// --- INTERFACES ---
interface Chamber {
  id: number;
  name: string;
  storageAreaId: number;
  status: 'Not Occupied' | 'Fully Occupied' | 'Faulty';
  deceasedId?: string;
  deceasedName?: string;
}

interface StorageArea {
  id: number;
  name: string;
}

// --- MOCK DATA ---
const mockStorageAreas: StorageArea[] = [
  { id: 1, name: 'Main Cold Room' },
  { id: 2, name: 'Private Wing Storage' },
  { id: 3, name: 'Forensic Section' },
];

const mockChambers: Chamber[] = [
  { id: 101, name: 'Rack 1 - A', storageAreaId: 1, status: 'Not Occupied' },
  { id: 102, name: 'Rack 1 - B', storageAreaId: 1, status: 'Fully Occupied', deceasedId: 'D-2023-056', deceasedName: 'JOHN DOE' },
  { id: 103, name: 'Rack 1 - C', storageAreaId: 1, status: 'Not Occupied' },
  { id: 104, name: 'Rack 2 - A', storageAreaId: 1, status: 'Faulty' },
  { id: 105, name: 'Rack 2 - B', storageAreaId: 1, status: 'Fully Occupied', deceasedId: 'D-2023-057', deceasedName: 'JANE SMITH' },
  { id: 201, name: 'Private-01', storageAreaId: 2, status: 'Not Occupied' },
  { id: 202, name: 'Private-02', storageAreaId: 2, status: 'Not Occupied' },
  { id: 301, name: 'FS-A1', storageAreaId: 3, status: 'Fully Occupied', deceasedId: 'D-2023-058', deceasedName: 'UNKNOWN MALE' },
];

// --- MODAL COMPONENT ---
const ChamberModal: React.FC<{
  chamber?: Chamber | null;
  storageAreas: StorageArea[];
  defaultAreaId: number;
  onClose: () => void;
  onSave: (chamberData: Partial<Chamber>) => void;
}> = ({ chamber, storageAreas, defaultAreaId, onClose, onSave }) => {
  const [name, setName] = useState(chamber?.name || '');
  const [status, setStatus] = useState(chamber?.status || 'Not Occupied');
  const [storageAreaId, setStorageAreaId] = useState(chamber?.storageAreaId || defaultAreaId);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ id: chamber?.id, name, status, storageAreaId: Number(storageAreaId) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <form onSubmit={handleSubmit}>
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h5 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{chamber ? 'Edit Chamber' : 'Add New Chamber'}</h5>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fa fa-times"></i></button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Chamber Name / No.</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-50">
                  <option>Not Occupied</option>
                  <option>Fully Occupied</option>
                  <option>Faulty</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Storage Area</label>
                <select value={storageAreaId} onChange={e => setStorageAreaId(Number(e.target.value))} className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-50">
                  {storageAreas.map(sa => <option key={sa.id} value={sa.id}>{sa.name}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 text-xs font-bold rounded uppercase shadow hover:bg-blue-700 transition">Save Chamber</button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---
const MorgueChambers: React.FC = () => {
  const location = useLocation();
  const [storageAreas] = useState<StorageArea[]>(mockStorageAreas);
  const [chambers, setChambers] = useState<Chamber[]>(mockChambers);
  
  const [selectedAreaId, setSelectedAreaId] = useState<number>(storageAreas[0]?.id || 0);
  const [showModal, setShowModal] = useState(false);
  const [editingChamber, setEditingChamber] = useState<Chamber | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const areaId = params.get('areaId');
    if (areaId) {
      setSelectedAreaId(Number(areaId));
    }
  }, [location.search]);

  const filteredChambers = useMemo(() => {
    return chambers.filter(c => 
      c.storageAreaId === selectedAreaId &&
      (
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.deceasedName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.deceasedId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [chambers, selectedAreaId, searchTerm]);

  const handleOpenModal = (chamber: Chamber | null = null) => {
    setEditingChamber(chamber);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingChamber(null);
  };

  const handleSaveChamber = (chamberData: Partial<Chamber>) => {
    if (editingChamber) {
      setChambers(chambers.map(c => c.id === chamberData.id ? { ...c, ...chamberData } as Chamber : c));
    } else {
      const newChamber: Chamber = {
        id: Date.now(),
        name: chamberData.name || 'New Chamber',
        status: chamberData.status || 'Not Occupied',
        storageAreaId: chamberData.storageAreaId || selectedAreaId,
      };
      setChambers([newChamber, ...chambers]);
    }
    handleCloseModal();
  };
  
  const handleDeleteChamber = (chamberId: number) => {
    if (confirm(`Are you sure you want to delete this chamber?`)) {
      setChambers(chambers.filter(c => c.id !== chamberId));
    }
  };
  
  const getStatusColor = (status: Chamber['status']) => {
    switch(status) {
      case 'Fully Occupied': return 'bg-red-100 border-red-300 text-red-800';
      case 'Faulty': return 'bg-gray-200 border-gray-300 text-gray-600';
      default: return 'bg-green-100 border-green-300 text-green-800';
    }
  };

  const selectedAreaName = storageAreas.find(sa => sa.id === selectedAreaId)?.name;

  return (
    <div className="animate-bottom space-y-6">
       {showModal && <ChamberModal chamber={editingChamber} storageAreas={storageAreas} defaultAreaId={selectedAreaId} onClose={handleCloseModal} onSave={handleSaveChamber} />}
       
       <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <div>
            <h2 className="text-xl font-bold text-gray-800">Morgue Chambers: <span className="text-blue-600">{selectedAreaName}</span></h2>
            <p className="text-sm text-gray-500">Visual layout and status of all storage chambers.</p>
         </div>
         <div className="flex items-center space-x-2 w-full md:w-auto">
            <select
               value={selectedAreaId}
               onChange={(e) => setSelectedAreaId(Number(e.target.value))}
               className="p-2 border border-gray-300 rounded-lg text-xs font-bold bg-white"
            >
               {storageAreas.map(sa => <option key={sa.id} value={sa.id}>{sa.name}</option>)}
            </select>
            <div className="relative flex-1">
               <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
               <input 
                  type="text" 
                  placeholder="Find chamber/body..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
               />
            </div>
            <button 
               onClick={() => handleOpenModal()}
               className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase shadow hover:bg-blue-700 transition flex items-center shrink-0"
            >
               <i className="fa fa-plus mr-2"></i> Add Chamber
            </button>
         </div>
       </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {filteredChambers.map(chamber => (
          <div 
             key={chamber.id} 
             onClick={() => handleOpenModal(chamber)}
             className={`p-4 rounded-lg border-2 shadow-sm cursor-pointer hover:-translate-y-1 transition-transform group ${getStatusColor(chamber.status)}`}
          >
             <div className="flex justify-between items-center">
                <h5 className="text-sm font-black tracking-tighter">{chamber.name}</h5>
                <div className="relative">
                   <button onClick={(e) => e.stopPropagation()} className="w-5 h-5 rounded text-gray-400 hover:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa fa-ellipsis-v text-xs"></i></button>
                   <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded shadow-xl hidden group-focus-within:block py-1 z-10 text-left">
                      <button onClick={() => handleOpenModal(chamber)} className="w-full px-3 py-1.5 text-[10px] hover:bg-gray-50">Edit</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteChamber(chamber.id);}} className="w-full px-3 py-1.5 text-[10px] text-red-600 hover:bg-red-50">Delete</button>
                   </div>
                </div>
             </div>
             <div className="mt-4 text-center">
                <p className="text-[9px] font-bold uppercase tracking-widest">{chamber.status}</p>
                {chamber.status === 'Fully Occupied' && (
                  <div className="mt-1">
                     <p className="text-xs font-bold text-black/70 truncate">{chamber.deceasedName}</p>
                     <p className="text-[9px] font-mono text-black/50">{chamber.deceasedId}</p>
                  </div>
                )}
             </div>
          </div>
        ))}
        {filteredChambers.length === 0 && (
          <div className="sm:col-span-3 md:col-span-4 lg:col-span-6 py-20 text-center text-gray-400">
             <i className="fa fa-box-open text-4xl mb-3"></i>
             <p className="font-bold">No chambers found for this area.</p>
             <p className="text-xs">Try adding a new chamber or adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MorgueChambers;
