import React from 'react';
import SpecialtyEncounter from '../../components/SpecialtyEncounter';

const NutritionClinic: React.FC = () => {
    const SpecializedForm = (
        <div className="space-y-8 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <h6 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-50 pb-1">Anthropometry Profile</h6>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-[8px] font-black text-gray-400 uppercase">MUAC (cm)</label><input className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black text-emerald-700" /></div>
                        <div><label className="block text-[8px] font-black text-gray-400 uppercase">Waist Circ. (cm)</label><input className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black text-emerald-700" /></div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Growth Status</label>
                        <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"><option>Healthy / Optimal</option><option>At Risk / Borderline</option><option>Moderate Malnutrition</option><option>Severe Malnutrition</option></select>
                    </div>
                </div>
                <div className="space-y-6">
                    <h6 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-50 pb-1">Dietary Management Plan</h6>
                    <textarea className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-3xl text-xs font-medium outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner resize-none leading-relaxed" placeholder="Detailed calories, macros, and specific restricted foods..."></textarea>
                </div>
            </div>
        </div>
    );

    return (
        <SpecialtyEncounter 
            clinicName="Nutrition & Dietetics" 
            icon="fa-apple-alt" 
            type="nutrition" 
            specializedForm={SpecializedForm} 
        />
    );
};

export default NutritionClinic;
