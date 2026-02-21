import React from 'react';
import SpecialtyEncounter from '../../components/SpecialtyEncounter';

const OccupationalClinic: React.FC = () => {
    const SpecializedForm = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in">
            <div className="space-y-6">
                <h6 className="text-[10px] font-black text-orange-600 uppercase tracking-widest border-b border-orange-50 pb-1">Activities of Daily Living (ADL)</h6>
                <div className="space-y-3">
                    {['Bathing', 'Dressing', 'Toileting', 'Feeding', 'Transferring'].map(item => (
                        <div key={item} className="flex justify-between items-center text-xs">
                           <span className="font-bold text-gray-600">{item}</span>
                           <select className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5 text-[10px]">
                               <option>Independent</option><option>Assisted</option><option>Dependent</option>
                           </select>
                        </div>
                    ))}
                </div>
            </div>
            <div className="space-y-6">
                <h6 className="text-[10px] font-black text-orange-600 uppercase tracking-widest border-b border-orange-50 pb-1">Cognitive & Motor Coordination</h6>
                <textarea className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-3xl text-xs font-medium outline-none shadow-inner resize-none" placeholder="Fine motor skills, executive function, safety awareness..."></textarea>
            </div>
        </div>
    );

    return (
        <SpecialtyEncounter 
            clinicName="Occupational Therapy" 
            icon="fa-hands-helping" 
            type="occupational" 
            specializedForm={SpecializedForm} 
        />
    );
};

export default OccupationalClinic;
