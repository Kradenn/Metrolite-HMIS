
import React, { useState } from 'react';

interface Notification {
  id: number;
  type: 'Medical' | 'Billing' | 'System';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const PatientNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'Medical', title: 'Lab Results Ready', message: 'Your Full Haemogram results are now available for viewing.', time: '2 hours ago', read: false },
    { id: 2, type: 'Billing', title: 'Invoice Generated', message: 'Invoice #INV-2023-001 has been generated for your recent visit.', time: '1 day ago', read: false },
    { id: 3, type: 'Medical', title: 'Appointment Reminder', message: 'You have a dental appointment scheduled for tomorrow at 10:00 AM.', time: '1 day ago', read: true },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Medical': return 'fa-stethoscope text-green-500';
      case 'Billing': return 'fa-file-invoice-dollar text-orange-500';
      default: return 'fa-info-circle text-blue-500';
    }
  };

  return (
    <div className="animate-bottom space-y-6">
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h5 className="text-sm font-bold text-gray-700 uppercase tracking-tighter">My Notifications</h5>
          <button className="text-[10px] font-bold text-blue-600 uppercase hover:underline">Mark all as read</button>
        </div>

        <div className="divide-y divide-gray-50">
          {notifications.map((n) => (
            <div 
              key={n.id} 
              className={`p-6 hover:bg-gray-50 transition-colors flex items-start space-x-4 ${n.read ? 'opacity-60' : 'bg-blue-50/20'}`}
              onClick={() => markAsRead(n.id)}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0">
                <i className={`fa ${getIcon(n.type)} text-lg`}></i>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-black text-gray-800 uppercase tracking-tighter">{n.title}</h4>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{n.time}</span>
                </div>
                <p className="text-xs text-gray-600 font-medium leading-relaxed">{n.message}</p>
              </div>
              {!n.read && (
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" title="Unread"></div>
              )}
            </div>
          ))}
          {notifications.length === 0 && (
             <div className="p-12 text-center text-gray-400 italic text-xs">You have no new notifications.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientNotifications;
