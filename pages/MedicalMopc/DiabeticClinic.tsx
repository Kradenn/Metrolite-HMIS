import React from 'react';
import SpecialtyEncounter from '../../components/SpecialtyEncounter';

const DiabeticClinic: React.FC = () => {
    const SpecializedForm = (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
                <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2 mb-6">Glycemic Control</h6>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">HbA1c (%)</label>
                        <input type="number" step="0.1" className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-blue-700 outline-none" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">FBG / RBS (mmol/L)</label>
                        <input type="number" step="0.1" className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-blue-700 outline-none" />
                    </div>
                </div>
            </div>
            <div className="p-6 bg-green-50/50 border border-green-100 rounded-3xl">
                <h6 className="text-[10px] font-black text-green-600 uppercase tracking-widest border-b border-green-100 pb-2 mb-6">Foot Assessment</h6>
                <div className="space-y-4">
                    <select className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold">
                        <option>No Ulcers / Healthy</option>
                        <option>Callous present</option>
                        <option>Active Ulcer (Wagner Grade 1-5)</option>
                    </select>
                </div>
            </div>
            <div className="p-6 bg-orange-50/50 border border-orange-100 rounded-3xl">
                <h6 className="text-[10px] font-black text-orange-600 uppercase tracking-widest border-b border-orange-100 pb-2 mb-6">Complications Scan</h6>
                <div className="space-y-2">
                    {['Retinopathy Screen', 'Neuropathy Screen', 'Renal Panel'].map(c => (
                        <label key={c} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer group">
                            <input type="checkbox" className="rounded text-orange-500" />
                            <span className="text-[10px] font-bold text-gray-500 uppercase group-hover:text-orange-600">{c}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <SpecialtyEncounter 
            clinicName="Diabetic Clinic" 
            icon="fa-syringe" 
            type="diabetic" 
            specializedForm={SpecializedForm} 
        />
    );
};

export default DiabeticClinic;
