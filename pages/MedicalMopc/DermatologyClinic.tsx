import React from 'react';
import SpecialtyEncounter from '../../components/SpecialtyEncounter';

const DermatologyClinic: React.FC = () => {
    const SpecializedForm = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in">
            <div className="space-y-6">
                <h6 className="text-[10px] font-black text-orange-600 uppercase tracking-widest border-b border-orange-50 pb-1">Lesion Description</h6>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Primary Morphology</label>
                        <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"><option>Macule / Patch</option><option>Papule / Plaque</option><option>Vesicle / Bulla</option><option>Nodule</option><option>Pustule</option></select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Anatomical Distribution</label>
                        <textarea className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs h-20 outline-none shadow-inner" placeholder="Generalized, localized, flexural, sun-exposed..."></textarea>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <h6 className="text-[10px] font-black text-orange-600 uppercase tracking-widest border-b border-orange-50 pb-1">Skin Type & Integrity</h6>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Fitzpatrick Skin Type</label>
                        <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"><option>Type I</option><option>Type II</option><option>Type III</option><option>Type IV</option><option>Type V</option><option>Type VI</option></select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Surface Secondary Changes</label>
                        <div className="grid grid-cols-2 gap-2">
                             {['Scaling', 'Crusting', 'Lichenification', 'Erosion'].map(s => (
                                 <label key={s} className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-orange-200">
                                    <input type="checkbox" className="rounded text-orange-500" />
                                    <span className="text-[10px] font-bold text-slate-600">{s}</span>
                                 </label>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <SpecialtyEncounter 
            clinicName="Dermatology Specialist" 
            icon="fa-hand-sparkles" 
            type="dermatology" 
            specializedForm={SpecializedForm} 
        />
    );
};

export default DermatologyClinic;
