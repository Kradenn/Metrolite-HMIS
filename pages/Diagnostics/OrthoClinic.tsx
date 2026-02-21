import React from 'react';
import SpecialtyEncounter from '../../components/SpecialtyEncounter';

const OrthoClinic: React.FC = () => {
    const SpecializedForm = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in">
            <div className="space-y-6">
                <h6 className="text-[10px] font-black text-red-600 uppercase tracking-widest border-b border-red-50 pb-1">Trauma & Fracture Profile</h6>
                <div className="space-y-4">
                    <input className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold" placeholder="Anatomical Site of Injury..." />
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold">
                        <option>Closed Fracture</option>
                        <option>Open Fracture</option>
                        <option>Ligamentous Tear</option>
                        <option>Dislocation</option>
                        <option>Post-Op Review</option>
                    </select>
                </div>
            </div>
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex items-center justify-center text-center">
                <div>
                   <i className="fa fa-bone text-4xl text-slate-300 mb-3"></i>
                   <p className="text-[10px] font-black text-slate-400 uppercase">Imaging Sync Active</p>
                </div>
            </div>
        </div>
    );

    return (
        <SpecialtyEncounter 
            clinicName="Orthopedic Specialist" 
            icon="fa-bone" 
            type="ortho" 
            specializedForm={SpecializedForm} 
        />
    );
};

export default OrthoClinic;
