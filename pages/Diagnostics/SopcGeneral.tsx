import React from 'react';
import SpecialtyEncounter from '../../components/SpecialtyEncounter';

const SopcGeneral: React.FC = () => {
    const SpecializedForm = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in">
            <div className="space-y-6">
                <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Surgical Review Context</h6>
                <div className="space-y-4">
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none">
                        <option>Pre-Operative Assessment</option>
                        <option>Post-Operative Review (Wound Check)</option>
                        <option>Post-Operative Review (Suture Removal)</option>
                        <option>General Follow-up</option>
                    </select>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Wound Appearance</label>
                        <textarea className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none shadow-inner resize-none" placeholder="Healthy, dehiscence, signs of infection, seroma..."></textarea>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Diagnostic Sync</h6>
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center">
                    <i className="fa fa-folder-open text-4xl text-slate-300 mb-3 opacity-50"></i>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Linking Theatre Logs & Bio-reports...</p>
                </div>
            </div>
        </div>
    );

    return (
        <SpecialtyEncounter 
            clinicName="SOPC (Surgical OPD)" 
            icon="fa-user-injured" 
            type="sopc" 
            specializedForm={SpecializedForm} 
        />
    );
};

export default SopcGeneral;
