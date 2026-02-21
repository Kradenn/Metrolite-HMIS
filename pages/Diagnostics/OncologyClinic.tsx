import React from 'react';
import SpecialtyEncounter from '../../components/SpecialtyEncounter';

const OncologyClinic: React.FC = () => {
    const SpecializedForm = (
        <div className="space-y-8 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-purple-50/50 border border-purple-100 rounded-3xl">
                    <h6 className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-4">Cancer Staging (TNM)</h6>
                    <div className="space-y-4 text-xs">
                        <div className="flex justify-between items-center"><span className="font-bold text-gray-400">Tumor (T)</span><select className="bg-white border rounded px-2 py-1"><option>T1</option><option>T2</option><option>T3</option><option>T4</option></select></div>
                        <div className="flex justify-between items-center"><span className="font-bold text-gray-400">Nodes (N)</span><select className="bg-white border rounded px-2 py-1"><option>N0</option><option>N1</option><option>N2</option></select></div>
                        <div className="flex justify-between items-center"><span className="font-bold text-gray-400">Metastasis (M)</span><select className="bg-white border rounded px-2 py-1"><option>M0</option><option>M1</option></select></div>
                    </div>
                </div>
                <div className="md:col-span-2 space-y-4">
                    <h6 className="text-[10px] font-black text-purple-600 uppercase tracking-widest border-b border-purple-50 pb-1">Chemotherapy Cycle Tracking</h6>
                    <div className="grid grid-cols-2 gap-4">
                         <div><label className="block text-[8px] font-black text-gray-400 uppercase">Cycle Number</label><input type="number" className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-black text-purple-700" defaultValue="1" /></div>
                         <div><label className="block text-[8px] font-black text-gray-400 uppercase">Protocol Name</label><input type="text" className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs uppercase" placeholder="e.g. AC-T" /></div>
                    </div>
                    <textarea className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none shadow-inner resize-none" placeholder="Recent toxicities or side effects..."></textarea>
                </div>
            </div>
        </div>
    );

    return (
        <SpecialtyEncounter 
            clinicName="Oncology" 
            icon="fa-ribbon" 
            type="oncology" 
            specializedForm={SpecializedForm} 
        />
    );
};

export default OncologyClinic;
