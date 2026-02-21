import React from 'react';
import SpecialtyEncounter from '../../components/SpecialtyEncounter';

const DentalClinic: React.FC = () => {
    const SpecializedForm = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in">
            <div className="p-8 bg-green-50/50 border border-green-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                <i className="fa fa-tooth text-6xl text-green-200 mb-4 opacity-50"></i>
                <h6 className="text-xs font-black text-green-800 uppercase tracking-widest">Interactive Odontogram</h6>
                <p className="text-[10px] text-green-600 font-bold mt-2 uppercase">Select teeth to mark restorations or decay</p>
                <button className="mt-6 bg-green-600 text-white px-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-green-100 hover:bg-green-700">Launch Map</button>
            </div>
            <div className="space-y-6">
                <h6 className="text-[10px] font-black text-green-600 uppercase tracking-widest border-b border-green-50 pb-1">Periodontal Screening</h6>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Gingival Health</label>
                        <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"><option>Healthy</option><option>Inflamed</option><option>Recession</option></select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Hygiene Level</label>
                        <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"><option>Good</option><option>Fair</option><option>Poor</option></select>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <SpecialtyEncounter 
            clinicName="Dental Clinic" 
            icon="fa-tooth" 
            type="dental" 
            specializedForm={SpecializedForm} 
        />
    );
};

export default DentalClinic;
