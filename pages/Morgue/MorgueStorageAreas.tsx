
import React, { useState, useMemo, FormEvent } from 'react';
import { Link } from 'react-router';

// --- INTERFACES ---
interface StorageArea {
  id: number;
  name: string;
  department: string;
  chamberCount: number;
  occupiedCount: number;
}

// --- MOCK DATA ---
const mockStorageAreas: StorageArea[] = [
  { id: 1, name: 'Main Cold Room', department: 'Morgue', chamberCount: 20, occupiedCount: 15 },
  { id: 2, name: 'Private Wing Storage', department: 'Morgue', chamberCount: 10, occupiedCount: 2 },
  { id: 3, name: 'Forensic Section', department: 'Pathology', chamberCount: 5, occupiedCount: 5 },
];

// --- MODAL COMPONENT ---
const StorageAreaModal: React.FC<{
  area?: StorageArea | null;
  onClose: () => void;
  onSave: (areaData: Partial<StorageArea>) => void;
}> = ({ area, onClose, onSave }) => {
  const [name, setName] = useState(area?.name || '');
  const [department, setDepartment] = useState(area?.department || 'Morgue');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ id: area?.id, name, department });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <form onSubmit={handleSubmit}>
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h5 className="text-sm font-bold text-gray-800 uppercase tracking-wide">{area ? 'Edit Storage Area' : 'Create New Storage Area'}</h5>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fa fa-times"></i></button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Area Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Department</label>
              <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full p-2 border border-gray-300 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50">
                 <option>Morgue</option>
                 <option>Pathology</option>
              </select>
            </div>
          </div>
          <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-end">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 text-xs font-bold rounded uppercase shadow hover:bg-blue-700 transition">Save Area</button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---
const MorgueStorageAreas: React.FC = () => {
  const [storageAreas, setStorageAreas] = useState<StorageArea[]>(mockStorageAreas);
  const [showModal, setShowModal] = useState(false);
  const [editingArea, setEditingArea] = useState<StorageArea | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAreas = useMemo(() => {
    return storageAreas.filter(area => 
      area.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [storageAreas, searchTerm]);

  const handleOpenModal = (area: StorageArea | null = null) => {
    setEditingArea(area);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingArea(null);
  };

  const handleSaveArea = (areaData: Partial<StorageArea>) => {
    if (editingArea) {
      setStorageAreas(storageAreas.map(a => a.id === areaData.id ? { ...a, ...areaData } as StorageArea : a));
    } else {
      const newArea: StorageArea = {
        id: Date.now(),
        name: areaData.name || 'New Area',
        department: areaData.department || 'Morgue',
        chamberCount: 0,
        occupiedCount: 0,
      };
      setStorageAreas([newArea, ...storageAreas]);
    }
    handleCloseModal();
  };
  
  const handleDeleteArea = (areaId: number) => {
    if (confirm(`Are you sure you want to delete this storage area? This will also remove associated chambers.`)) {
      setStorageAreas(storageAreas.filter(a => a.id !== areaId));
    }
  };

  return (
    <div className="animate-bottom space-y-6">
       {showModal && <StorageAreaModal area={editingArea} onClose={handleCloseModal} onSave={handleSaveArea} />}
       
       <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <div>
            <h2 className="text-xl font-bold text-gray-800">Morgue Storage Areas</h2>
            <p className="text-sm text-gray-500">Manage the physical areas where chambers are located.</p>
         </div>
         <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-1">
               <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
               <input 
                  type="text" 
                  placeholder="Filter areas..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-xs"
               />
            </div>
            <button 
               onClick={() => handleOpenModal()}
               className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase shadow hover:bg-blue-700 transition flex items-center shrink-0"
            >
               <i className="fa fa-plus mr-2"></i> Add Area
            </button>
         </div>
       </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAreas.map(area => {
          const occupancy = area.chamberCount > 0 ? (area.occupiedCount / area.chamberCount) * 100 : 0;
          let occupancyColor = 'bg-green-500';
          if (occupancy > 75) occupancyColor = 'bg-red-500';
          else if (occupancy > 50) occupancyColor = 'bg-orange-500';

          return (
            <div key={area.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group flex flex-col">
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start">
                   <div className="flex items-center space-x-2 text-gray-500 mb-3">
                      <i className="fa fa-building"></i>
                      <span className="text-xs font-bold">{area.department}</span>
                   </div>
                   <div className="relative">
                      <button className="w-6 h-6 rounded text-gray-400 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"><i className="fa fa-ellipsis-v"></i></button>
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded shadow-xl hidden group-focus-within:block py-1 z-10">
                         <button onClick={() => handleOpenModal(area)} className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50">Edit</button>
                         <button onClick={() => handleDeleteArea(area.id)} className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">Delete</button>
                      </div>
                   </div>
                </div>
                <h5 className="text-sm font-black text-gray-800 uppercase tracking-wider">{area.name}</h5>
                <p className="text-xs text-gray-500 mt-4 font-bold">{area.occupiedCount} / {area.chamberCount} Chambers Occupied</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                   <div className={`${occupancyColor} h-1.5 rounded-full`} style={{ width: `${occupancy}%` }}></div>
                </div>
              </div>
              <Link to={`/morgue/chambers?areaId=${area.id}`} className="block p-3 bg-gray-50 border-t border-gray-100 text-center text-[10px] font-bold text-gray-500 uppercase hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-b-lg">
                 Manage Chambers <i className="fa fa-arrow-right ml-1"></i>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MorgueStorageAreas;
