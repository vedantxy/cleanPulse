import { useState, useEffect, useCallback } from 'react';
import api from '../../api/api';
import { 
    Users as UsersIcon, 
    Search, 
    UserCircle,
    Mail,
    Phone,
    MapPin,
    ArrowLeft,
    Loader2,
    UserCheck,
    UserX,
    XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusUpdating, setStatusUpdating] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await api.get(`/admin/users`, {
                headers: { 'x-auth-token': token },
                params: {
                    role: roleFilter,
                    search: searchTerm
                }
            });
            setUsers(res.data);
        } catch {
            console.error('Connection error. Could not retrieve users.');
        } finally {
            setLoading(false);
        }
    }, [roleFilter, searchTerm]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const toggleStatus = async (userId, currentStatus) => {
        try {
            setStatusUpdating(userId);
            const token = localStorage.getItem('token');
            await api.put(`/admin/users/${userId}/status`, { isActive: !currentStatus }, {
                headers: { 'x-auth-token': token }
            });
            fetchUsers();
        } catch {
            alert('Status update failed.');
        } finally {
            setStatusUpdating(null);
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.zone.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-slide-up text-[var(--text-primary)]">
            {/* Nature Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div className="flex items-center space-x-6">
                    <button 
                        onClick={() => navigate('/admin')}
                        className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-sm hover:bg-[var(--accent-green)]/10 hover:border-[var(--accent-green)]/30 transition-all text-[var(--text-muted)] hover:text-[var(--accent-green)] active:scale-95"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter font-['Playfair+Display'] uppercase flex items-center gap-4">
                            <UsersIcon className="text-[var(--accent-green)]" size={32} />
                            User Directory
                        </h1>
                        <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.2em] text-[10px] mt-1 italic">
                            Manage all platform users
                        </p>
                    </div>
                </div>
                
                <div className="px-6 py-3 bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 rounded-2xl flex items-center space-x-3 shadow-xl">
                     <UserCheck size={18} className="text-[var(--accent-green)] animate-pulse" />
                     <span className="text-[var(--accent-green)] font-black text-[10px] tracking-widest uppercase">Admin Access Active</span>
                </div>
            </div>

            {/* Eco Search & Filters */}
            <div className="mb-12 flex flex-col lg:flex-row items-center gap-8">
                <div className="relative group w-full lg:flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" size={20} />
                    <input 
                        type="text"
                        placeholder="Search users by name, email or sector..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="earth-input pl-14 font-black tracking-widest text-[11px]"
                    />
                </div>
                <div className="flex items-center gap-4 bg-[var(--bg-card)] p-2 rounded-[1.5rem] border border-[var(--border-color)] shadow-xl">
                    {['All', 'Citizen', 'Collector'].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRoleFilter(r)}
                            className={`px-8 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all uppercase ${
                                roleFilter === r 
                                ? 'bg-[var(--accent-green)] text-white shadow-lg' 
                                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                            }`}
                        >
                            {r}s
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="py-24 flex flex-col items-center justify-center">
                    <Loader2 className="w-16 h-16 text-[var(--accent-green)] animate-spin" />
                    <p className="mt-6 text-[var(--accent-green)] font-black tracking-[0.3em] uppercase text-xs animate-pulse">Loading User Records...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredUsers.map((u) => (
                        <div key={u._id} className={`leaf-card p-10 rounded-[3.5rem] border border-[var(--border-color)] shadow-xl transition-all relative overflow-hidden group hover:border-[var(--accent-green)]/30 ${!u.isActive ? 'opacity-40 grayscale' : 'hover:shadow-[var(--accent-green)]/10 duration-700'}`}>
                            
                            {/* Role Tag & Bio-Link */}
                            <div className="flex items-center justify-between mb-10 border-b border-[var(--border-color)] pb-8 relative z-10">
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:scale-110 duration-500 ${
                                        u.role === 'admin' ? 'bg-[var(--accent-green)]/10 border-[var(--accent-green)]/30 text-[var(--accent-green)]' : 
                                        u.role === 'collector' ? 'bg-[var(--accent-earth)]/10 border-[var(--accent-earth)]/30 text-[var(--accent-earth)]' : 
                                        'bg-[var(--accent-leaf)]/10 border-[var(--accent-leaf)]/30 text-[var(--accent-leaf)]'
                                    }`}>
                                        <UserCircle size={32} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="text-xl font-black text-[var(--text-primary)] truncate font-['Playfair+Display'] tracking-tighter uppercase group-hover:text-[var(--accent-green)] transition-colors">{u.name}</h3>
                                        <div className="flex items-center gap-2 text-[var(--text-muted)] font-black text-[9px] uppercase tracking-widest mt-1">
                                            <MapPin size={10} className="text-[var(--accent-green)]/50" />
                                            <span>Zone: {u.zone}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${
                                    u.role === 'admin' ? 'bg-[var(--accent-green)]/10 text-[var(--accent-green)] border-[var(--accent-green)]/20' : 
                                    u.role === 'collector' ? 'bg-[var(--accent-earth)]/10 text-[var(--accent-earth)] border-[var(--accent-earth)]/20' : 
                                    'bg-[var(--accent-leaf)]/10 text-[var(--accent-leaf)] border-[var(--accent-leaf)]/20'
                                }`}>
                                    {u.role}
                                </div>
                            </div>

                            {/* Personnel Signal Details */}
                            <div className="space-y-5 mb-12 relative z-10">
                                <div className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] group-hover:bg-[var(--bg-card)] transition-colors">
                                    <Mail size={16} className="text-[var(--text-muted)]" />
                                    <span className="truncate text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">{u.email}</span>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] group-hover:bg-[var(--bg-card)] transition-colors">
                                    <Phone size={16} className="text-[var(--text-muted)]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">{u.phone}</span>
                                </div>
                            </div>

                            {/* Zone Assignment Module */}
                            <div className="flex items-center justify-between pt-8 border-t border-[var(--border-color)] mb-6 relative z-10">
                                <div className="flex items-center gap-3">
                                    <MapPin size={14} className="text-[var(--accent-green)]/50" />
                                    <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Zone Assignment</span>
                                </div>
                                {u.role === 'collector' ? (
                                    <div className="relative group/sel">
                                        <select 
                                            value={u.zone}
                                            onChange={(e) => {
                                                const newZone = e.target.value;
                                                const token = localStorage.getItem('token');
                                                api.put(`/admin/users/${u._id}/zone`, { zone: newZone }, {
                                                    headers: { 'x-auth-token': token }
                                                }).then(() => fetchUsers()).catch(() => alert('Update failed.'));
                                            }}
                                            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-1.5 text-[9px] font-black text-[var(--text-muted)] focus:ring-4 focus:ring-[var(--accent-green)]/10 outline-none uppercase tracking-widest cursor-pointer group-hover/sel:text-[var(--accent-green)] transition-colors"
                                        >
                                            {['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'].map(z => (
                                                <option key={z} value={z}>{z} Region</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">{u.zone} ZONE</span>
                                )}
                            </div>

                            {/* Status Override Module */}
                            <div className="flex items-center justify-between pt-6 border-t border-[var(--border-color)] relative z-10">
                                <div className="flex items-center gap-2">
                                    {u.isActive ? (
                                        <div className="flex items-center gap-3 text-[var(--accent-leaf)] text-[9px] font-black uppercase tracking-[0.2em]">
                                            <div className="w-2 h-2 rounded-full bg-[var(--accent-leaf)] animate-pulse shadow-[0_0_10px_#52B788]" />
                                            Account Active
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3 text-rose-500 text-[9px] font-black uppercase tracking-[0.2em]">
                                            <XCircle size={14} className="animate-pulse" />
                                            Account Deactivated
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={() => toggleStatus(u._id, u.isActive)}
                                    disabled={statusUpdating === u._id}
                                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-[9px] transition-all tracking-[0.3em] uppercase border shadow-xl active:scale-95 ${
                                        u.isActive 
                                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-600 hover:text-white' 
                                        : 'bg-[var(--accent-leaf)]/10 text-[var(--accent-leaf)] border-[var(--accent-leaf)]/20 hover:bg-[var(--accent-leaf)] hover:text-white'
                                    } disabled:opacity-50`}
                                >
                                    {statusUpdating === u._id ? (
                                        <Loader2 size={12} className="animate-spin" />
                                    ) : u.isActive ? (
                                        <><UserX size={14} /> Deactivate</>
                                    ) : (
                                        <><UserCheck size={14} /> Activate</>
                                    )}
                                </button>
                            </div>
                            
                            <div className={`absolute -bottom-16 -right-16 w-32 h-32 bg-${u.role === 'admin' ? 'emerald' : u.role === 'collector' ? 'earth' : 'leaf'}-600/5 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000`} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
