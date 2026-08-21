import { createContext, useState, useMemo } from 'react';

export const NotificationsContext = createContext(null);

export const NotificationsProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const value = useMemo(
        () => ({
            // Read-only state (consumed by UI via useContext)
            notifications,
            unreadCount,
            loading,
            error,

            // Setters (consumed strictly by Hooks layer)
            setNotifications,
            setUnreadCount,
            setLoading,
            setError,
        }),
        [notifications, unreadCount, loading, error],
    );

    return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export default NotificationsProvider;
