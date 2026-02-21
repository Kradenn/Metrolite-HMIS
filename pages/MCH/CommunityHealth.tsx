import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';

interface Activity {
    id: number;
    date: string;
    type: string;
    description: string;
    beneficiaries: number;
    status: 'Logged' | 'Follow-up Needed';
}

const CommunityHealth: React.FC = () => {
    const { notify } = useNotification();
    const [activities, setActivities] = useState<Activity[]>([
        { id: 1, date: '24 Oct 2023', type: 'Household Visit', description: 'Antenatal care motivation for household #12 in Village A.', beneficiaries: 1, status: 'Logged' },
        { id: 2, date: '22 Oct 2023', type: 'Community Dialogue', description: 'Malnutrition screening and education session.', beneficiaries: 45, status: 'Logged' },
    ]);

    const handleLog = () => {
        notify('success', 'Activity Logged', 'Community health activity has been added to the system logs.');
    };

    const inputStyle = "w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm";
    const labelStyle = "block text-[10px] font-semibold text-slate-500 uppercase mb-1.5 tracking-wider";

    return (
        <div className="animate-bottom space-y-6 pb-20">
            {/* Header */}
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-l-8 border-l-emerald-600">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-emerald-100">
                        <i className="fa fa-house-user"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">CHV Outreach Portal</h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Community Health Volunteers Dashboard</p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button onClick={handleLog} className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-emerald-700 transition transform active:scale-95">
                        <i className="fa fa-plus-circle mr-2"></i> Log New Activity
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Reporting Form */}
                <div className="lg:col-span-5">
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm h-full">
                        <h5 className="text-sm font-black text-gray-800 uppercase tracking-tighter mb-8 border-b border-slate-100 pb-2">New Activity Entry</h5>
                        <form className="space-y-6">
                            <div>
                                <label className={labelStyle}>Activity Type</label>
                                <select className={inputStyle}>
                                    <option>Household Visit (Homecare)</option>
                                    <option>Health Education (Dialogue)</option>
                                    <option>Patient Defaulter Tracing</option>
                                    <option>Community Referral</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className={labelStyle}>Date</label><input type="date" className={inputStyle} defaultValue={new Date().toISOString().split('T')[0]} /></div>
                                <div><label className={labelStyle}>Beneficiaries Count</label><input type="number" className={inputStyle} placeholder="0" /></div>
                            </div>
                            <div>
                                <label className={labelStyle}>Community Unit / Location</label>
                                <input type="text" className={inputStyle} placeholder="Village / Area name..." />
                            </div>
                            <div>
                                <label className={labelStyle}>Activity Summary</label>
                                <textarea className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium outline-none focus:ring-1 focus:ring-emerald-500 shadow-inner resize-none" placeholder="What was achieved? Any red flags identified?"></textarea>
                            </div>
                            <button type="button" onClick={handleLog} className="w-full bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">
                                Submit Activity Report
                            </button>
                        </form>
                    </div>
                </div>

                {/* Recent Activity List */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                            <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Community Logs</h6>
                            <button className="text-[10px] font-black text-emerald-600 hover:underline">View All Logs</button>
                        </div>
                        <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[600px] scrollbar-hide">
                            {activities.map(act => (
                                <div key={act.id} className="p-6 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-2 py-0.5 rounded border border-emerald-100 bg-emerald-50">{act.type}</span>
                                        <span className="text-[10px] font-bold text-gray-400">{act.date}</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-700 leading-relaxed mb-3">"{act.description}"</p>
                                    <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                        <span>Beneficiaries: <span className="text-slate-800">{act.beneficiaries}</span></span>
                                        <span className="flex items-center text-emerald-500"><i className="fa fa-check-circle mr-1"></i> {act.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-emerald-900 text-emerald-100 flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-lg"><i className="fa fa-lightbulb"></i></div>
                            <p className="text-[10px] font-medium leading-tight">
                                <span className="font-black uppercase block mb-0.5">Education Focus Oct 2023:</span>
                                Prioritize Household Handwashing and Exclusive Breastfeeding education for new mothers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommunityHealth;