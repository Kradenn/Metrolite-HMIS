
import React, { useState } from 'react';

const DietaryPlans: React.FC = () => {
    const [plans, setPlans] = useState([
        { id: 1, name: 'Diabetic Diet', desc: 'Controlled carbohydrate intake, low sugar.' },
        { id: 2, name: 'Renal Diet', desc: 'Low in sodium, phosphorus, and protein.' },
        { id: 3, name: 'Low Sodium Diet', desc: 'For patients with hypertension or heart conditions.' },
    ]);
    const [selectedPlan, setSelectedPlan] = useState(plans[0]);

    return (
        <div className="animate-bottom">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-[calc(100vh-180px)] flex">
                <div className="w-1/3 border-r border-gray-100 flex flex-col">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h5 className="text-sm font-bold text-gray-700 uppercase">Dietary Plans</h5>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {plans.map(p => (
                            <div key={p.id} onClick={() => setSelectedPlan(p)} className={`p-4 cursor-pointer border-b border-gray-100 ${selectedPlan.id === p.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                                <h6 className={`font-bold text-xs uppercase ${selectedPlan.id === p.id ? 'text-blue-700' : 'text-gray-800'}`}>{p.name}</h6>
                                <p className="text-xs text-gray-500">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 p-6">
                    <form className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Plan Name</label>
                            <input type="text" value={selectedPlan.name} className="w-full p-2 bg-gray-100 border border-gray-300 rounded text-sm font-bold" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                            <input type="text" value={selectedPlan.desc} className="w-full p-2 bg-gray-100 border border-gray-300 rounded text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Allowed Foods (One per line)</label>
                            <textarea className="w-full p-2 bg-white border border-gray-300 rounded text-sm h-32"></textarea>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Restricted Foods (One per line)</label>
                            <textarea className="w-full p-2 bg-white border border-gray-300 rounded text-sm h-32"></textarea>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 text-xs font-bold rounded">New Plan</button>
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 text-xs font-bold rounded">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DietaryPlans;
