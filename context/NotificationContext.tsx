
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  autoClose?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  notify: (type: NotificationType, title: string, message: string, autoClose?: boolean) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback((type: NotificationType, title: string, message: string, autoClose = true) => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, type, title, message, autoClose }]);

    if (autoClose) {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, notify, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
