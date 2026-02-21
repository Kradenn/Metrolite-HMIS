import React from 'react';
import SpecialtyEncounter from '../../components/SpecialtyEncounter';

const CardiologyClinic: React.FC = () => {
    const SpecializedForm = (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">NYHA Functional Class</label>
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-red-500 transition-all">
                        <option>Class I (No symptoms)</option>
                        <option>Class II (Mild symptoms)</option>
                        <option>Class III (Marked limitation)</option>
                        <option>Class IV (Severe/At rest)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Chest Pain Presentation</label>
                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-red-500 transition-all">
                        <option>None</option>
                        <option>Typical Angina</option>
                        <option>Atypical Angina</option>
                        <option>Non-cardiac</option>
                    </select>
                </div>
            </div>
            <div className="space-y-6">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">ECG Interpretation</label>
                    <textarea className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs h-24 outline-none focus:border-red-500 shadow-inner" placeholder="P-wave, QRS, ST segments..."></textarea>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Echo Summary</label>
                    <textarea className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs h-24 outline-none focus:border-red-500 shadow-inner" placeholder="EF%, Valvular function..."></textarea>
                </div>
            </div>
        </div>
    );

    return (
        <SpecialtyEncounter 
            clinicName="Cardiology" 
            icon="fa-heartbeat" 
            type="cardiology" 
            specializedForm={SpecializedForm} 
        />
    );
};

export default CardiologyClinic;
