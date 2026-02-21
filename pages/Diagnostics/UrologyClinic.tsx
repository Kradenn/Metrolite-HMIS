import React from 'react';
import SpecialtyEncounter from '../../components/SpecialtyEncounter';

const UrologyClinic: React.FC = () => {
    const SpecializedForm = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in">
            <div className="space-y-6">
                <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-50 pb-1">Voiding Symptoms (IPSS Scale)</h6>
                <div className="space-y-3">
                    {['Frequency', 'Nocturia', 'Weak Stream', 'Hesitancy', 'Urgency'].map(symp => (
                        <div key={symp} className="flex justify-between items-center text-xs">
                           <span className="font-bold text-gray-600">{symp}</span>
                           <select className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5 text-[10px]">
                               <option>0 - None</option><option>1 - Mild</option><option>3 - Moderate</option><option>5 - Severe</option>
                           </select>
                        </div>
                    ))}
                </div>
            </div>
            <div className="space-y-6">
                <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-blue-50 pb-1">Prostate / Exam Findings</h6>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">DRE Result (Digital Rectal Exam)</label>
                        <textarea className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs h-20 outline-none shadow-inner" placeholder="Size, consistency, nodules, median sulcus..."></textarea>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">PSA Result (Most Recent)</label>
                        <input type="text" className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black text-blue-700" placeholder="ng/mL" />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <SpecialtyEncounter 
            clinicName="Urology Specialist" 
            icon="fa-tint" 
            type="urology" 
            specializedForm={SpecializedForm} 
        />
    );
};

export default UrologyClinic;
