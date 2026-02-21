import React from 'react';
import SpecialtyEncounter from '../../components/SpecialtyEncounter';

const EntClinic: React.FC = () => {
    const SpecializedForm = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in">
            <div className="space-y-6">
                <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-50 pb-1">Otoscopy / Ear Findings</h6>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Right Ear (AD)</label>
                        <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"><option>Normal</option><option>Wax Impaction</option><option>Perforation</option></select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Left Ear (AS)</label>
                        <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"><option>Normal</option><option>Wax Impaction</option><option>Perforation</option></select>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-50 pb-1">Rhinoscopy / Throat</h6>
                <div className="space-y-4">
                    <input type="text" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold" placeholder="Nasal Septum/Turbinates..." />
                    <input type="text" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold" placeholder="Tonsils / Pharynx..." />
                </div>
            </div>
        </div>
    );

    return (
        <SpecialtyEncounter 
            clinicName="ENT Specialist" 
            icon="fa-head-side-mask" 
            type="ent" 
            specializedForm={SpecializedForm} 
        />
    );
};

export default EntClinic;
