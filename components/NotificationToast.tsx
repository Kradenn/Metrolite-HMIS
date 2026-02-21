
import React from 'react';
import { useNotification, NotificationType } from '../context/NotificationContext';

const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success': return 'fa-check-circle text-green-500';
      case 'error': return 'fa-exclamation-circle text-red-500';
      case 'warning': return 'fa-exclamation-triangle text-orange-500';
      default: return 'fa-info-circle text-blue-500';
    }
  };

  const getBg = (type: NotificationType) => {
    switch (type) {
      case 'success': return 'border-green-100 bg-white/90';
      case 'error': return 'border-red-100 bg-white/90';
      case 'warning': return 'border-orange-100 bg-white/90';
      default: return 'border-blue-100 bg-white/90';
    }
  };

  return (
    <div className="fixed top-20 right-6 z-[9999] flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => (
        <div 
          key={n.id} 
          className={`pointer-events-auto flex items-start p-4 rounded-xl border shadow-2xl backdrop-blur-md animate-in slide-in-from-right-10 duration-300 ${getBg(n.type)}`}
        >
          <div className="shrink-0 pt-0.5">
            <i className={`fa ${getIcon(n.type)} text-lg`}></i>
          </div>
          <div className="ml-4 flex-1">
            <h5 className="text-xs font-black text-gray-800 uppercase tracking-tight">{n.title}</h5>
            <p className="text-[11px] text-gray-600 font-medium mt-1 leading-relaxed">{n.message}</p>
          </div>
          <button 
            onClick={() => removeNotification(n.id)}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fa fa-times text-xs"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
