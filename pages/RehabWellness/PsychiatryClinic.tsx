import React from 'react';
import SpecialtyEncounter from '../../components/SpecialtyEncounter';

const PsychiatryClinic: React.FC = () => {
    const SpecializedForm = (
        <div className="space-y-10 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Mental State Examination (MSE)</h6>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Appearance & Behavior</label>
                            <input className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs" placeholder="Grooming, eye contact, psychomotor activity..." />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Mood & Affect</label>
                            <input className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs" placeholder="Subjective vs objective, range, stability..." />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Thought Process & Content</label>
                            <input className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs" placeholder="Flow, delusions, suicidal ideation..." />
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Cognition & Insight</h6>
                    <div className="space-y-4">
                         <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Orientation (T, P, P)</label><input className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs" defaultValue="Oriented x3" /></div>
                         <div><label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Insight Level</label><select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"><option>Good (G1)</option><option>Partial (G2)</option><option>Poor/None (G3)</option></select></div>
                    </div>
                    <div className="bg-red-50 border border-red-100 p-5 rounded-2xl">
                         <h6 className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-2 flex items-center"><i className="fa fa-exclamation-triangle mr-2"></i> Risk Screen</h6>
                         <label className="flex items-center space-x-3 text-[10px] font-bold text-red-800 uppercase cursor-pointer">
                             <input type="checkbox" className="rounded text-red-600" />
                             <span>Immediate Danger to Self / Others</span>
                         </label>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <SpecialtyEncounter 
            clinicName="Psychiatry & Mental Health" 
            icon="fa-head-side-virus" 
            type="psychiatry" 
            specializedForm={SpecializedForm} 
        />
    );
};

export default PsychiatryClinic;
