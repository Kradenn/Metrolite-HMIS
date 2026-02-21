import React from 'react';
import SpecialtyEncounter from '../../components/SpecialtyEncounter';

const NeurologyClinic: React.FC = () => {
    const SpecializedForm = (
        <div className="space-y-8 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Neurological Status</h6>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">GCS Score (E,V,M)</label>
                            <input className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-black" placeholder="e.g. 15/15" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Pupillary Response</label>
                            <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold">
                                <option>PERRLA</option>
                                <option>Sluggish</option>
                                <option>Fixed/Dilated</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <h6 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-1">Motor & Sensory</h6>
                    <textarea className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs h-32 outline-none shadow-inner" placeholder="Detailed cranial nerve and motor exam..."></textarea>
                </div>
            </div>
        </div>
    );

    return (
        <SpecialtyEncounter 
            clinicName="Neurology" 
            icon="fa-brain" 
            type="neurology" 
            specializedForm={SpecializedForm} 
        />
    );
};

export default NeurologyClinic;
