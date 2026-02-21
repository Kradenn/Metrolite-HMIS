import React, { useState } from 'react';
import { Link } from 'react-router';

interface Notification {
  id: number;
  category: 'Critical' | 'Warning' | 'Info' | 'Success';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
  linkText?: string;
}

const NotificationsList: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const notifications: Notification[] = [
    { id: 1, category: 'Critical', title: 'Critical Stock Alert', message: 'Adrenaline vials are below minimum safety threshold (5 units remaining).', time: '2 mins ago', read: false, link: '/inventory/main', linkText: 'Restock Now' },
    { id: 2, category: 'Warning', title: 'Pending Invoices', message: '12 invoices from Jubilee Insurance are reaching the 30-day aging limit.', time: '1 hour ago', read: false, link: '/billing/invoices', linkText: 'View Invoices' },
    { id: 3, category: 'Info', title: 'System Update', message: 'UltraHub v3.2.0 will be deployed tonight at 00:00 AM.', time: '4 hours ago', read: true },
    { id: 4, category: 'Success', title: 'Backup Successful', message: 'Global database synchronization and off-site backup completed.', time: 'Yesterday', read: true }
  ];

  return (
    <div className="animate-bottom space-y-6">
       <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden min-h-[600px] flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center px-10">
             <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg"><i className="fa fa-bell"></i></div>
                <h5 className="text-sm font-black text-gray-800 uppercase tracking-widest">System Alerts & Notifications</h5>
             </div>
             <div className="flex space-x-2 bg-white p-1 rounded-xl border border-gray-200">
                {['All', 'Critical', 'Warning', 'Info'].map(f => (
                   <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>{f}</button>
                ))}
             </div>
          </div>
          
          <div className="flex-1 divide-y divide-gray-50">
             {notifications.filter(n => filter === 'All' || n.category === filter).map(n => (
                <div key={n.id} className={`p-8 hover:bg-slate-50 transition-colors flex items-start space-x-6 ${n.read ? 'opacity-60' : 'bg-indigo-50/20 border-l-4 border-l-indigo-600'}`}>
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${
                      n.category === 'Critical' ? 'bg-red-100 text-red-600' :
                      n.category === 'Warning' ? 'bg-orange-100 text-orange-600' :
                      n.category === 'Success' ? 'bg-green-100 text-green-600' :
                      'bg-blue-100 text-blue-600'
                   }`}>
                      <i className={`fa ${n.category === 'Critical' ? 'fa-biohazard' : 'fa-bell'}`}></i>
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                         <h6 className="text-sm font-black text-gray-800 uppercase tracking-tight">{n.title}</h6>
                         <span className="text-[10px] font-bold text-gray-400 uppercase">{n.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">{n.message}</p>
                      {n.link && (
                         <Link to={n.link} className="inline-flex items-center text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                            {n.linkText} <i className="fa fa-arrow-right ml-2 text-[8px]"></i>
                         </Link>
                      )}
                   </div>
                   {!n.read && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200"></div>}
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};

export default NotificationsList;
