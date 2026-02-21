import React from 'react';
import SpecialtyEncounter from '../../components/SpecialtyEncounter';

const EyeClinic: React.FC = () => {
    const SpecializedForm = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in">
            <div className="space-y-6">
                <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Anterior Segment Examination</h6>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Conjunctiva / Sclera</label>
                        <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"><option>Normal / Quiet</option><option>Injected / Red</option><option>Pale</option><option>Icteric</option></select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Cornea & Lens</label>
                        <textarea className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs h-20 outline-none shadow-inner" placeholder="Clarity, staining, cataract status..."></textarea>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Fundoscopy / Posterior</h6>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Retina / Macula Findings</label>
                        <textarea className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs h-32 outline-none shadow-inner" placeholder="Vessels, macula appearance, peripheral retina..."></textarea>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <SpecialtyEncounter 
            clinicName="Ophthalmology / Eye" 
            icon="fa-eye" 
            type="eye" 
            specializedForm={SpecializedForm} 
        />
    );
};

export default EyeClinic;
