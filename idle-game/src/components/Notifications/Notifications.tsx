import React, { useEffect } from 'react';
import './Notifications.css';

export type NotificationType = 'error' | 'success' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationsProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, onDismiss }) => {
  useEffect(() => {
    notifications.forEach(notification => {
      const timer = setTimeout(() => {
        onDismiss(notification.id);
      }, 5000);

      return () => clearTimeout(timer);
    });
  }, [notifications, onDismiss]);

  return (
    <div className="notifications-container">
      {notifications.map(notification => (
        <div 
          key={notification.id} 
          className={`notification ${notification.type}`}
          onClick={() => onDismiss(notification.id)}
        >
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications; 