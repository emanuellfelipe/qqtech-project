import React from 'react';
import "/src/styles/notification.css";

const Notification = ({ message, type }) => {
    if (!message) return null;

    const messageClass = type === 'success' ? 'success-message' : 'error-message';

    return (
        <div className={`notification ${messageClass}`}>
            {message}
        </div>
    );
};

export default Notification;
