import { useState, useEffect, useRef } from 'react';
import { Bell, X, Trash2, CheckCircle2, Clock, Construction } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
    const { token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        if (token) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [token]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications', {
                headers: { 'x-auth-token': token }
            });
            setNotifications(res.data);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`, {}, {
                headers: { 'x-auth-token': token }
            });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const clearAll = async () => {
        try {
            await api.delete('/notifications', {
                headers: { 'x-auth-token': token }
            });
            setNotifications([]);
        } catch (err) {
            console.error('Failed to clear notifications:', err);
        }
    };

    const getIcon = (type, message) => {
        if (message.includes('✅')) return <CheckCircle2 size={16} className="text-emerald-500" />;
        if (message.includes('🚧')) return <Construction size={16} className="text-amber-500" />;
        return <Bell size={16} className="text-blue-500" />;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl hover:border-[var(--accent-green)] transition-all relative group"
            >
                <Bell size={20} className="text-[var(--text-muted)] group-hover:text-[var(--accent-green)]" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-[var(--bg-secondary)] animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-4 w-80 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2rem] shadow-2xl z-50 overflow-hidden animate-slide-up">
                    <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)]">
                        <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]">Notifications</h3>
                        {notifications.length > 0 && (
                            <button 
                                onClick={clearAll}
                                className="text-[9px] font-black uppercase tracking-tighter text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1"
                            >
                                <Trash2 size={12} /> Clear
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-10 text-center">
                                <Bell className="mx-auto mb-4 text-[var(--border-color)]" size={32} />
                                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest italic">All clean here!</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[var(--border-color)]">
                                {notifications.map(n => (
                                    <div 
                                        key={n._id} 
                                        onClick={() => !n.read && markAsRead(n._id)}
                                        className={`p-5 hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer group ${!n.read ? 'bg-emerald-500/[0.02]' : 'opacity-60'}`}
                                    >
                                        <div className="flex gap-4">
                                            <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border ${!n.read ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-100 border-slate-200'}`}>
                                                {getIcon(n.type, n.message)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-black uppercase tracking-tight mb-1 ${!n.read ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                                                    {n.title}
                                                </p>
                                                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed italic line-clamp-2 mb-2">
                                                    {n.message}
                                                </p>
                                                <div className="flex items-center gap-2 text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                                                    <Clock size={10} />
                                                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                            {!n.read && (
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
