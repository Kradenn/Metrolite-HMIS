
import React, { useState } from 'react';
import { Link } from 'react-router';

interface MealOrder {
    id: number;
    time: string;
    patient: string;
    room: string;
    diet: string;
    meal: string;
    status: 'Pending' | 'In Prep' | 'Ready' | 'Delivered';
    billingStatus: 'Billed' | 'Pending';
}

const KitchenDashboard: React.FC = () => {
    const [activeShift, setActiveShift] = useState('Lunch Service');
    const [filterStatus, setFilterStatus] = useState('All');

    const stats = [
        { label: 'Meals to Prepare', value: '32', color: 'bg-orange-500', icon: 'fa-utensil-spoon' },
        { label: 'Out for Delivery', value: '12', color: 'bg-blue-500', icon: 'fa-truck' },
        { label: 'Special Diets', value: '18', color: 'bg-purple-500', icon: 'fa-file-medical' },
        { label: 'Low Stock Alerts', value: '3', color: 'bg-red-500', icon: 'fa-exclamation-triangle' },
    ];

    const [mealOrders, setMealOrders] = useState<MealOrder[]>([
        { id: 101, time: '12:30 PM', patient: 'JANE DOE', room: 'GW-101A', diet: 'Diabetic, Low Sodium', meal: 'Grilled Chicken Salad', status: 'Pending', billingStatus: 'Billed' },
        { id: 102, time: '12:35 PM', patient: 'JOHN SMITH', room: 'PVT-202', diet: 'Regular', meal: 'Beef Stew & Rice', status: 'In Prep', billingStatus: 'Billed' },
        { id: 103, time: '12:40 PM', patient: 'MARY ANN', room: 'ICU-03', diet: 'Liquid / Soft', meal: 'Cream of Mushroom Soup', status: 'Ready', billingStatus: 'Pending' },
        { id: 104, time: '12:45 PM', patient: 'BABY RYAN', room: 'PED-12', diet: 'Pediatric (No Nuts)', meal: 'Mashed Potatoes & Peas', status: 'Pending', billingStatus: 'Billed' },
        { id: 105, time: '13:00 PM', patient: 'ROBERT B.', room: 'GW-105', diet: 'Renal', meal: 'Steamed Fish & Veg', status: 'Delivered', billingStatus: 'Billed' },
    ]);

    const dietDistribution = [
        { label: 'Regular', percent: 45, color: 'bg-green-500' },
        { label: 'Diabetic', percent: 25, color: 'bg-blue-500' },
        { label: 'Renal', percent: 15, color: 'bg-purple-500' },
        { label: 'Soft/Liquid', percent: 10, color: 'bg-orange-500' },
        { label: 'Allergy Specific', percent: 5, color: 'bg-red-500' },
    ];

    const criticalStock = [
        { item: 'Cooking Oil', current: '2L', required: '5L' },
        { item: 'Milk (Fresh)', current: '5L', required: '20L' },
        { item: 'Chicken Breast', current: '3kg', required: '10kg' },
    ];

    const updateStatus = (id: number, newStatus: MealOrder['status']) => {
        setMealOrders(prev => prev.map(order => order.id === id ? { ...order, status: newStatus } : order));
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'In Prep': return 'bg-blue-100 text-blue-700 border-blue-200 animate-pulse';
            case 'Ready': return 'bg-green-100 text-green-700 border-green-200';
            case 'Delivered': return 'bg-gray-100 text-gray-600 border-gray-200';
            default: return 'bg-gray-100';
        }
    };

    const filteredOrders = mealOrders.filter(order => filterStatus === 'All' || order.status === filterStatus);

    return (
        <div className="animate-bottom space-y-6">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-2xl border border-gray-200 shadow-sm gap-4">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center text-2xl shadow-lg border border-orange-400">
                        <i className="fa fa-fire-burner"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Kitchen Operations</h2>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-0.5">
                            Current Service: <span className="text-orange-600">{activeShift}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link to="/kitchen/ordering" className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition shadow-sm">
                        Patient Order
                    </Link>
                    <Link to="/kitchen/inventory" className="bg-orange-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-orange-700 transition">
                        Stock Check
                    </Link>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-black text-gray-800 tracking-tighter">{stat.value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-md ${stat.color} group-hover:scale-110 transition-transform`}>
                            <i className={`fa ${stat.icon}`}></i>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-280px)]">
                
                {/* LEFT: Meal Production Queue */}
                <div className="lg:col-span-8 flex flex-col bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                             <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest">Production Queue</h5>
                             <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md text-[9px] font-black">{filteredOrders.length}</span>
                        </div>
                        <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                            {['All', 'Pending', 'In Prep', 'Ready'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${filterStatus === status ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/50">
                        {filteredOrders.map(order => (
                            <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-md transition-shadow group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-500 font-bold shrink-0 border border-slate-200">
                                        <span className="text-[10px] uppercase">Room</span>
                                        <span className="text-xs text-slate-800">{order.room.split('-')[1] || order.room}</span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h6 className="text-sm font-black text-slate-800 uppercase">{order.patient}</h6>
                                            <span className={`text-[8px] px-2 py-0.5 rounded border uppercase font-black ${getStatusStyle(order.status)}`}>{order.status}</span>
                                        </div>
                                        <p className="text-[11px] font-bold text-slate-600 flex items-center gap-2">
                                            <i className="fa fa-utensils text-orange-400"></i> {order.meal}
                                        </p>
                                        <p className="text-[10px] text-red-500 font-black mt-1 uppercase tracking-wide">
                                            <i className="fa fa-notes-medical mr-1"></i> {order.diet}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                    <span className="text-[10px] font-mono text-gray-400 font-bold mr-2">{order.time}</span>
                                    {order.status === 'Pending' && (
                                        <button onClick={() => updateStatus(order.id, 'In Prep')} className="px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-[9px] font-black uppercase hover:bg-blue-600 hover:text-white transition">Start Prep</button>
                                    )}
                                    {order.status === 'In Prep' && (
                                        <button onClick={() => updateStatus(order.id, 'Ready')} className="px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded-lg text-[9px] font-black uppercase hover:bg-orange-600 hover:text-white transition">Mark Ready</button>
                                    )}
                                    {order.status === 'Ready' && (
                                        <button onClick={() => updateStatus(order.id, 'Delivered')} className="px-4 py-2 bg-green-50 text-green-600 border border-green-200 rounded-lg text-[9px] font-black uppercase hover:bg-green-600 hover:text-white transition">Dispatch</button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {filteredOrders.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                                <i className="fa fa-check-circle text-4xl mb-2 opacity-20"></i>
                                <p className="text-xs font-bold uppercase tracking-widest">No orders in this view</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT: Analytics & Stock */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    {/* Diet Analytics */}
                    <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6">
                        <h6 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">Dietary Requirements (Today)</h6>
                        <div className="space-y-4">
                            {dietDistribution.map((diet, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                                        <span className="uppercase">{diet.label}</span>
                                        <span>{diet.percent}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                        <div className={`h-1.5 rounded-full ${diet.color}`} style={{ width: `${diet.percent}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Critical Stock */}
                    <div className="bg-red-50 border border-red-100 rounded-3xl p-6 flex-1 shadow-inner">
                        <div className="flex items-center gap-2 mb-4 text-red-700">
                            <i className="fa fa-triangle-exclamation"></i>
                            <h6 className="text-[10px] font-black uppercase tracking-widest">Critical Shortages</h6>
                        </div>
                        <div className="space-y-3">
                            {criticalStock.map((item, i) => (
                                <div key={i} className="bg-white p-3 rounded-xl border border-red-100 shadow-sm flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-black text-slate-800">{item.item}</p>
                                        <p className="text-[9px] text-red-500 font-bold uppercase mt-0.5">Current: {item.current}</p>
                                    </div>
                                    <button className="text-[9px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition">Reorder</button>
                                </div>
                            ))}
                        </div>
                        <Link to="/procurement/requisitions" className="block text-center mt-6 text-[10px] font-black text-red-600 uppercase hover:underline">View Full Inventory</Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default KitchenDashboard;
