import { useState, useEffect } from 'react';
import api from '../../api/api';
import { Mail, MapPin, Award, CheckCircle, Clock, ShieldCheck, Trophy, X, Calendar, BarChart as BarChart2, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CountUp = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [end, duration]);

    return <span>{count}</span>;
};

const CollectorProfile = () => {
    const { user, updateUser, token } = useAuth();
    const [stats, setStats] = useState({ assigned: 0, completed: 0, pending: 0 });
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        zone: user?.zone || ''
    });
    const [updateLoading, setUpdateLoading] = useState(false);

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const res = await api.get('/dashboard/collector', { 
                    headers: { 'x-auth-token': token } 
                });

                setStats({
                    assigned: res.data.stats.assigned || 0,
                    completed: res.data.stats.completed || 0,
                    pending: res.data.stats.pending || 0
                });
            } catch {
                // Silently handle
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchProfileData();
    }, [token]);

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const res = await api.put('/auth/profile', editForm, {
                headers: { 'x-auth-token': token }
            });
            updateUser(res.data);
            setIsEditing(false);
            alert('Profile updated successfully');
        } catch {
            alert('Failed to update profile');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        setPasswordLoading(true);
        try {
            await api.put('/auth/change-password', 
                { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword },
                { headers: { 'x-auth-token': token } }
            );
            alert('Password updated successfully');
            setIsChangingPassword(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch {
            alert('Failed to update password');
        } finally {
            setPasswordLoading(false);
        }
    };

    const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    }) : 'Jan 2025';

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-[var(--accent-green)] border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-slide-up text-[var(--text-primary)]">
            {/* Collector Profile Header */}
            <div className="leaf-card p-10 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 shadow-2xl mb-12 border-2 border-[var(--bg-card)]">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-green)]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative">
                    <div className="w-36 h-36 bg-gradient-to-tr from-[var(--accent-leaf)] to-[var(--accent-green)] rounded-[3rem] flex items-center justify-center text-5xl text-white shadow-xl border-4 border-white/20 font-['Playfair+Display']">
                        {user?.name?.charAt(0) || 'C'}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-[var(--bg-card)] p-2.5 rounded-2xl shadow-xl border border-[var(--accent-green)]/30">
                        <Briefcase size={20} className="text-[var(--accent-green)]" />
                    </div>
                </div>

                <div className="flex-grow text-center md:text-left space-y-4 relative z-10">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter font-['Playfair+Display'] uppercase text-[var(--text-primary)]">
                            {user?.name}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                            <span className="px-4 py-1.5 bg-[var(--accent-green)]/10 text-[var(--accent-green)] rounded-full text-[10px] font-black uppercase tracking-widest border border-[var(--accent-green)]/20">Official Collector</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-color)] hidden sm:block" />
                            <div className="flex items-center gap-2 bg-[var(--accent-leaf)]/10 px-4 py-1.5 rounded-full border border-[var(--accent-leaf)]/20 text-[var(--accent-leaf)]">
                                <ShieldCheck size={14} className="fill-current" />
                                <span className="text-xs font-black tracking-widest uppercase">Verified Employee</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[var(--text-muted)] font-black uppercase tracking-[0.1em] pt-2">
                        <div className="flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors cursor-default">
                            <MapPin size={18} className="text-[var(--accent-green)]" />
                            <span className="text-[10px]">{user?.zone || 'Unassigned'} Zone</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors cursor-default">
                            <Mail size={18} className="text-[var(--accent-green)]" />
                            <span className="text-[10px] uppercase">{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors cursor-default">
                            <Calendar size={18} className="text-[var(--accent-green)]" />
                            <span className="text-[10px]">Joined {memberSince}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:row gap-4 relative z-10">
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="px-8 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] rounded-2xl font-black hover:text-[var(--text-primary)] transition-all shadow-sm active:scale-95 text-[10px] tracking-widest uppercase"
                    >
                        EDIT PROFILE
                    </button>
                    <button 
                        onClick={() => setIsChangingPassword(true)}
                        className="eco-button px-8 py-4 text-[10px] tracking-widest uppercase shadow-xl"
                    >
                        SECURITY
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Stats Section */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="leaf-card p-8 border-2 border-[var(--bg-card)]">
                        <h2 className="text-xl font-black mb-8 flex items-center gap-3 font-['Playfair+Display'] tracking-tight uppercase">
                            <BarChart2 className="text-[var(--accent-green)]" />
                            Performance Tracking
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] group hover:border-[var(--accent-green)] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[var(--accent-green)]/10 rounded-xl flex items-center justify-center text-[var(--accent-green)] border border-[var(--accent-green)]/20">
                                        <CheckCircle size={20} />
                                    </div>
                                    <span className="font-black text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors text-[10px] tracking-widest uppercase">Total Completed</span>
                                </div>
                                <span className="text-2xl font-black text-[var(--accent-green)]"><CountUp end={stats.completed} /></span>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] group hover:border-[var(--accent-leaf)] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[var(--accent-leaf)]/10 rounded-xl flex items-center justify-center text-[var(--accent-leaf)] border border-[var(--accent-leaf)]/20">
                                        <Briefcase size={20} />
                                    </div>
                                    <span className="font-black text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors text-[10px] tracking-widest uppercase">Zone Tasks</span>
                                </div>
                                <span className="text-2xl font-black text-[var(--accent-leaf)]"><CountUp end={stats.assigned} /></span>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] group hover:border-[var(--accent-earth)] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[var(--accent-earth)]/10 rounded-xl flex items-center justify-center text-[var(--accent-earth)] border border-[var(--accent-earth)]/20">
                                        <Clock size={20} />
                                    </div>
                                    <span className="font-black text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors text-[10px] tracking-widest uppercase">Pending Zone Pickups</span>
                                </div>
                                <span className="text-2xl font-black text-[var(--accent-earth)]"><CountUp end={stats.pending} /></span>
                            </div>
                        </div>
                    </div>

                    <div className="leaf-card p-8 bg-gradient-to-br from-[var(--accent-leaf)] via-[var(--accent-green)] to-[var(--accent-earth)] text-white shadow-xl relative overflow-hidden group border-none">
                        <div className="relative z-10 text-center">
                            <Trophy className="text-white/80 mx-auto mb-4" size={48} />
                            <h3 className="text-xl font-black mb-2 font-['Playfair+Display'] tracking-tighter uppercase">Weekly Efficiency</h3>
                            <p className="text-white/60 text-[10px] font-black tracking-widest uppercase mb-6 italic">
                                {stats.completed > 0 ? Math.round((stats.completed / (stats.completed + stats.pending)) * 100) : 0}% Cleanup Rate
                            </p>
                            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full shadow-lg transition-all duration-1000" style={{ width: `${stats.completed > 0 ? (stats.completed / (stats.completed + stats.pending)) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                    </div>
                </div>

                {/* Details Section */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="leaf-card p-10 border-2 border-[var(--bg-card)]">
                        <h2 className="text-2xl font-black mb-10 border-b border-[var(--border-color)] pb-6 font-['Playfair+Display'] tracking-tighter uppercase">
                            Account Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-[var(--accent-green)] uppercase tracking-[0.2em]">Employee Name</p>
                                <p className="text-lg font-bold text-[var(--text-primary)]">{user?.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-[var(--accent-green)] uppercase tracking-[0.2em]">Email Address</p>
                                <p className="text-lg font-bold text-[var(--text-primary)]">{user?.email}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-[var(--accent-green)] uppercase tracking-[0.2em]">Phone Number</p>
                                <p className="text-lg font-bold text-[var(--text-primary)]">{user?.phone || 'Not provided'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-[var(--accent-green)] uppercase tracking-[0.2em]">Assigned Zone</p>
                                <p className="text-lg font-bold text-[var(--text-primary)]">{user?.zone} Region</p>
                            </div>
                        </div>

                        <div className="mt-12 p-6 bg-[var(--bg-secondary)] rounded-3xl border border-dashed border-[var(--border-color)]">
                            <div className="flex items-center gap-4 text-[var(--text-muted)]">
                                <Award className="text-[var(--accent-leaf)]" size={24} />
                                <p className="text-xs font-medium italic">&quot;Dedicated to keeping our city green and sustainable. Your work directly impacts the environment.&quot;</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-[var(--bg-card)] w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up border-2 border-[var(--accent-green)]/20">
                        <div className="p-8 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)]">
                            <div>
                                <h2 className="text-2xl font-black font-['Playfair+Display'] tracking-tighter uppercase text-[var(--text-primary)]">Edit Profile</h2>
                                <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] mt-1">Update employee records</p>
                            </div>
                            <button onClick={() => setIsEditing(false)} className="p-2.5 hover:bg-rose-500/10 rounded-2xl text-[var(--text-muted)] hover:text-rose-500 transition-all border border-transparent">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)] ml-1">Full Name</label>
                                <input type="text" name="name" value={editForm.name} onChange={handleEditChange} required className="earth-input" placeholder="Name" />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)] ml-1">Phone Number</label>
                                    <input type="tel" name="phone" value={editForm.phone} onChange={handleEditChange} required className="earth-input" placeholder="Phone" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)] ml-1">Zone (View Only)</label>
                                    <input type="text" value={editForm.zone} readOnly className="earth-input bg-[var(--bg-secondary)] cursor-not-allowed opacity-70" />
                                </div>
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 px-6 py-4 border border-[var(--border-color)] rounded-2xl font-black text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all text-[10px] tracking-widest uppercase">Cancel</button>
                                <button type="submit" disabled={updateLoading} className="eco-button flex-1 py-4 text-[10px] tracking-widest uppercase">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isChangingPassword && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-[var(--bg-card)] w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up border-2 border-[var(--accent-leaf)]/20">
                        <div className="p-8 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)]">
                            <div>
                                <h2 className="text-2xl font-black font-['Playfair+Display'] tracking-tighter uppercase text-[var(--text-primary)]">Security</h2>
                                <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] mt-1">Update Password</p>
                            </div>
                            <button onClick={() => setIsChangingPassword(false)} className="p-2.5 hover:bg-rose-500/10 rounded-2xl text-[var(--text-muted)] hover:text-rose-500 transition-all border border-transparent">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdatePassword} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-leaf)] ml-1">Current Password</label>
                                <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} required className="earth-input" placeholder="Current Password" />
                            </div>
                            <div className="space-y-4">
                                <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} required minLength="8" className="earth-input" placeholder="New Password" />
                                <input type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} required className="earth-input" placeholder="Confirm New Password" />
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setIsChangingPassword(false)} className="flex-1 px-6 py-4 border border-[var(--border-color)] rounded-2xl font-black text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all text-[10px] tracking-widest uppercase">Cancel</button>
                                <button type="submit" disabled={passwordLoading} className="eco-button flex-1 py-4 text-[10px] tracking-widest uppercase">Update Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollectorProfile;
