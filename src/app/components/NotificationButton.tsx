import React from 'react';

interface NotificationButtonProps {
    onClick: () => void;
    count?: number;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({ onClick, count = 0 }) => {
    const buttonStyles: React.CSSProperties = {
        position: 'relative',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#007bff',
        color: '#fff',
    };

    const badgeStyles: React.CSSProperties = {
        position: 'absolute',
        top: '-5px',
        right: '-5px',
        backgroundColor: 'red',
        color: 'white',
        borderRadius: '50%',
        padding: '5px 10px',
        fontSize: '12px',
        fontWeight: 'bold',
    };

    return (
        <button onClick={onClick} className="notification-button" style={buttonStyles}>
            Notifications
            {count > 0 && <span style={badgeStyles}>{count}</span>}
        </button>
    );
};

export default NotificationButton;
