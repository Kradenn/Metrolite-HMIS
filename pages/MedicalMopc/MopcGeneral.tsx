import React from 'react';
import SpecialtyEncounter from '../../components/SpecialtyEncounter';

const MopcGeneral: React.FC = () => {
    const SpecializedForm = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
                <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-50 pb-1">Chronic Care Review</h6>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Medication Adherence</label>
                        <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold">
                            <option>Strictly Adherent</option>
                            <option>Occasional Defaulter</option>
                            <option>Poor Compliance</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Review Interval</label>
                        <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold">
                            <option>1 Month</option>
                            <option>3 Months</option>
                            <option>6 Months</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-50 pb-1">Comorbidity Mapping</h6>
                <div className="grid grid-cols-1 gap-2">
                    {['Hypertension', 'Dyslipidemia', 'COPD', 'CKD', 'None'].map(c => (
                        <label key={c} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer group">
                            <input type="checkbox" className="rounded text-blue-600" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase group-hover:text-blue-700">{c}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <SpecialtyEncounter 
            clinicName="Medical Outpatient (MOPC)" 
            icon="fa-user-tie" 
            type="mopc" 
            specializedForm={SpecializedForm} 
        />
    );
};

export default MopcGeneral;
