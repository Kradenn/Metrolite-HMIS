import React from 'react';
import SpecialtyEncounter from '../../components/SpecialtyEncounter';

const PhysioClinic: React.FC = () => {
    const SpecializedForm = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in">
            <div className="space-y-6">
                <h6 className="text-[10px] font-black text-teal-600 uppercase tracking-widest border-b border-teal-50 pb-1">Mobility & ROM</h6>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Gait Status</label>
                        <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold">
                            <option>Independent</option>
                            <option>Aided (Crutches/Walker)</option>
                            <option>Non-weight bearing</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Muscle Power (0-5)</label>
                        <input type="number" max="5" min="0" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-black text-teal-600" defaultValue="5" />
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <h6 className="text-[10px] font-black text-teal-600 uppercase tracking-widest border-b border-teal-50 pb-1">Exercise Prescription</h6>
                <textarea className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-3xl text-xs font-medium outline-none focus:ring-1 focus:ring-teal-500 shadow-inner resize-none leading-relaxed" placeholder="Strengthening, flexibility, or hydrotherapy plan..."></textarea>
            </div>
        </div>
    );

    return (
        <SpecialtyEncounter 
            clinicName="Physiotherapy" 
            icon="fa-walking" 
            type="physio" 
            specializedForm={SpecializedForm} 
        />
    );
};

export default PhysioClinic;
