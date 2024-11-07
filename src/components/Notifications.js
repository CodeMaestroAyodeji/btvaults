// src/components/Notifications.js
import React, { useEffect } from 'react';
import styles from './Notifications.module.css';

function Notifications({ notifications, removeNotification }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (notifications.length > 0) {
                removeNotification(notifications[0].id);
            }
        }, 5000); // Auto-dismiss notifications after 5 seconds

        return () => clearTimeout(timer);
    }, [notifications, removeNotification]);

    return (
        <div className={styles.notificationsContainer}>
            {notifications.map((notification) => (
                <div key={notification.id} className={styles.notification}>
                    <p>{notification.message}</p>
                    <button
                        onClick={() => removeNotification(notification.id)}
                        className={styles.dismissButton}
                    >
                        Dismiss
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Notifications;
