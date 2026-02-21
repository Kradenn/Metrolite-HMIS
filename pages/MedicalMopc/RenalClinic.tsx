import React from 'react';
import SpecialtyEncounter from '../../components/SpecialtyEncounter';

const RenalClinic: React.FC = () => {
    const SpecializedForm = (
        <div className="space-y-8 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-3xl">
                    <h6 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Renal Function Status</h6>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-[8px] font-black text-gray-400 uppercase">eGFR</label><input className="w-full p-2 bg-white border border-blue-200 rounded-lg text-xs font-black" /></div>
                        <div><label className="block text-[8px] font-black text-gray-400 uppercase">Creatinine</label><input className="w-full p-2 bg-white border border-blue-200 rounded-lg text-xs font-black" /></div>
                    </div>
                </div>
                <div className="space-y-4">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Dialysis Schedule</label>
                    <div className="flex gap-2">
                        {['Mon', 'Wed', 'Fri'].map(d => <span key={d} className="px-3 py-1 bg-white border border-blue-100 text-[10px] font-black text-blue-600 rounded-lg shadow-sm">{d}</span>)}
                    </div>
                    <textarea className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs h-24 outline-none" placeholder="Access site status (Fistula/Catheter)..."></textarea>
                </div>
            </div>
        </div>
    );

    return (
        <SpecialtyEncounter 
            clinicName="Renal / Nephrology" 
            icon="fa-hospital-user" 
            type="renal" 
            specializedForm={SpecializedForm} 
        />
    );
};

export default RenalClinic;
