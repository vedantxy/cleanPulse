import { useState, useEffect } from 'react';
import api from '../../api/api';
import { Mail, MapPin, Award, CheckCircle, Clock, ShieldCheck, Trophy, Star, X, Leaf, Calendar, BarChart as BarChart2 } from 'lucide-react';
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

const CitizenProfile = () => {
    const { user, updateUser, token } = useAuth();
    const [stats, setStats] = useState({ totalRec: 0, resolvedRec: 0, pendingRec: 0 });
    const [badges, setBadges] = useState([]);
    const [allAvailableBadges, setAllAvailableBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [availableRewards, setAvailableRewards] = useState([]);
    const [credits, setCredits] = useState(user?.ecoCredits || 0);

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
                const [dashRes, badgeRes, allBadgeRes] = await Promise.all([
                    api.get('/dashboard/citizen', { headers: { 'x-auth-token': token } }),
                    api.get('/badges/user', { headers: { 'x-auth-token': token } }),
                    api.get('/badges')
                ]);

                setStats({
                    totalRec: dashRes.data.stats.total || 0,
                    resolvedRec: dashRes.data.stats.resolved || 0,
                    pendingRec: dashRes.data.stats.pending || 0
                });
                setBadges(badgeRes.data);
                setAllAvailableBadges(allBadgeRes.data);
            } catch {
                // Silently handle
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchProfileData();
    }, [token]);

    useEffect(() => {
        const fetchRewards = async () => {
            try {
                const res = await api.get('/rewards/items');
                setAvailableRewards(res.data);
            } catch {
                // Silently handle
            }
        };
        fetchRewards();
    }, []);

    useEffect(() => {
        if (user?.ecoCredits !== undefined) {
            setCredits(user.ecoCredits);
        }
    }, [user]);

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
        } catch {
            alert('Failed to update profile');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleRedeem = async (reward) => {
        if (credits < reward.points) {
            alert('Not enough reward points!');
            return;
        }
        
        if (!window.confirm(`Redeem ${reward.points} points for ${reward.name}?`)) return;

        try {
            const res = await api.post('/rewards/redeem', 
                { rewardId: reward.id, points: reward.points },
                { headers: { 'x-auth-token': token } }
            );
            alert(res.data.message);
            setCredits(res.data.remainingCredits);
            updateUser({ ...user, ecoCredits: res.data.remainingCredits });
        } catch {
            alert('Redemption failed');
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

    const earnedBadgeIds = badges.map(b => b.badgeId?._id || b.badgeId);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-[var(--accent-green)] border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-slide-up text-[var(--text-primary)]">
            {/* Nature Profile Header */}
            <div className="leaf-card p-10 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 shadow-2xl mb-12 border-2 border-[var(--bg-card)]">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-green)]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent-earth)]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative">
                    <div className="w-36 h-36 bg-gradient-to-tr from-[var(--accent-green)] to-[var(--accent-leaf)] rounded-[3rem] flex items-center justify-center text-5xl text-white shadow-xl border-4 border-white/20 font-['Playfair+Display']">
                        {user?.name?.charAt(0) || 'G'}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-[var(--bg-card)] p-2.5 rounded-2xl shadow-xl border border-[var(--accent-green)]/30">
                        <Award size={20} className="text-[var(--accent-green)]" />
                    </div>
                </div>

                <div className="flex-grow text-center md:text-left space-y-4 relative z-10">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter font-['Playfair+Display'] uppercase text-[var(--text-primary)]">
                            {user?.name}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2">
                            <span className="px-4 py-1.5 bg-[var(--accent-green)]/10 text-[var(--accent-green)] rounded-full text-[10px] font-black uppercase tracking-widest border border-[var(--accent-green)]/20">{user?.rank || 'Level 1'}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--border-color)] hidden sm:block" />
                            <div className="flex items-center gap-2 bg-[var(--accent-leaf)]/10 px-4 py-1.5 rounded-full border border-[var(--accent-leaf)]/20 text-[var(--accent-leaf)]">
                                <Leaf size={14} className="fill-current" />
                                <span className="text-xs font-black tracking-widest uppercase"><CountUp end={credits} /> Reward Points</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[var(--text-muted)] font-black uppercase tracking-[0.1em] pt-2">
                        <div className="flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors cursor-default">
                            <MapPin size={18} className="text-[var(--accent-green)]" />
                            <span className="text-[10px]">{user?.zone || 'Sanctuary'} Zone</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors cursor-default">
                            <Mail size={18} className="text-[var(--accent-green)]" />
                            <span className="text-[10px] uppercase">{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-[var(--text-primary)] transition-colors cursor-default">
                            <Calendar size={18} className="text-[var(--accent-green)]" />
                            <span className="text-[10px]">Member Since {memberSince}</span>
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
                        PASSWORD
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Stats Section */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="leaf-card p-8 border-2 border-[var(--bg-card)]">
                        <h2 className="text-xl font-black mb-8 flex items-center gap-3 font-['Playfair+Display'] tracking-tight uppercase">
                            <BarChart2 className="text-[var(--accent-green)]" />
                            Activity Reports
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] group hover:border-[var(--accent-green)] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[var(--accent-green)]/10 rounded-xl flex items-center justify-center text-[var(--accent-green)] border border-[var(--accent-green)]/20">
                                        <Award size={20} />
                                    </div>
                                    <span className="font-black text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors text-[10px] tracking-widest uppercase">Total Reports</span>
                                </div>
                                <span className="text-2xl font-black text-[var(--text-primary)]"><CountUp end={stats.totalRec} /></span>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] group hover:border-[var(--accent-leaf)] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[var(--accent-leaf)]/10 rounded-xl flex items-center justify-center text-[var(--accent-leaf)] border border-[var(--accent-leaf)]/20">
                                        <CheckCircle size={20} />
                                    </div>
                                    <span className="font-black text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors text-[10px] tracking-widest uppercase">Resolved</span>
                                </div>
                                <span className="text-2xl font-black text-[var(--accent-leaf)]"><CountUp end={stats.resolvedRec} /></span>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] group hover:border-[var(--accent-earth)] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[var(--accent-earth)]/10 rounded-xl flex items-center justify-center text-[var(--accent-earth)] border border-[var(--accent-earth)]/20">
                                        <Clock size={20} />
                                    </div>
                                    <span className="font-black text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors text-[10px] tracking-widest uppercase">Pending</span>
                                </div>
                                <span className="text-2xl font-black text-[var(--accent-earth)]"><CountUp end={stats.pendingRec} /></span>
                            </div>
                        </div>
                    </div>

                    <div className="leaf-card p-8 bg-gradient-to-br from-[var(--accent-green)] via-[var(--accent-leaf)] to-[var(--accent-earth)] text-white shadow-xl relative overflow-hidden group border-none">
                        <div className="relative z-10 text-center">
                            <ShieldCheck className="text-white/80 mx-auto mb-4" size={48} />
                            <h3 className="text-xl font-black mb-2 font-['Playfair+Display'] tracking-tighter uppercase">Profile Verified</h3>
                            <p className="text-white/60 text-[10px] font-black tracking-widest uppercase mb-6 italic">
                                Level {Math.floor(stats.resolvedRec / 5) + 1} Citizen
                            </p>
                            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full shadow-lg transition-all duration-1000" style={{ width: `${Math.min((stats.resolvedRec % 5 / 5) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                    </div>
                </div>

                {/* Achievements Section */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="leaf-card p-10 border-2 border-[var(--bg-card)]">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 border-b border-[var(--border-color)] pb-6">
                            <h2 className="text-2xl font-black flex items-center gap-4 font-['Playfair+Display'] tracking-tighter uppercase">
                                <Trophy className="text-yellow-600 dark:text-yellow-400" size={28} />
                                Achievements
                            </h2>
                            <div className="px-5 py-2 bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20 rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-sm">
                                Level {Math.floor(stats.resolvedRec / 5) + 1}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                            {allAvailableBadges.map((badge) => {
                                const isEarned = earnedBadgeIds.includes(badge._id);
                                return (
                                    <div key={badge._id} className={`flex flex-col items-center text-center group relative cursor-help ${!isEarned ? 'opacity-30 grayscale' : ''}`}>
                                        <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center text-4xl mb-4 transition-all duration-500 relative border ${
                                            isEarned 
                                            ? 'bg-gradient-to-tr from-[var(--bg-secondary)] to-[var(--bg-card)] border-[var(--accent-green)]/40 shadow-xl group-hover:scale-110 group-hover:rotate-6' 
                                            : 'bg-[var(--bg-secondary)] border-dashed border-[var(--border-color)]'
                                        }`}>
                                            {badge.icon}
                                            {isEarned && (
                                                <div className="absolute -top-1 -right-1 bg-[var(--accent-green)] text-white rounded-full p-1 shadow-md border-2 border-[var(--bg-card)]">
                                                    <CheckCircle size={10} strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="font-black text-[10px] mb-1 tracking-widest group-hover:text-[var(--accent-green)] transition-colors uppercase">
                                            {badge.name}
                                        </h4>
                                        <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">
                                            {isEarned ? 'EARNED' : 'LOCKED'}
                                        </p>
                                        
                                        {/* Tooltip */}
                                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 bg-[var(--bg-card)] border border-[var(--accent-green)]/40 rounded-3xl p-4 text-[10px] opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 pointer-events-none z-20 shadow-2xl">
                                            <p className="font-black mb-1 text-[var(--accent-green)] uppercase tracking-widest">{badge.name}</p>
                                            <p className="text-[var(--text-muted)] font-medium leading-relaxed italic">&quot;{badge.description}&quot;</p>
                                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[var(--bg-card)] border-r border-b border-[var(--accent-green)]/40 rotate-45" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Reward Points store */}
                    <div className="leaf-card p-10 border-2 border-[var(--bg-card)] bg-gradient-to-tr from-[var(--bg-secondary)] to-transparent">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                            <h2 className="text-2xl font-black flex items-center gap-4 font-['Playfair+Display'] tracking-tighter uppercase">
                                <Star className="text-[var(--accent-leaf)] fill-[var(--accent-leaf)]" size={28} />
                                Reward Store
                            </h2>
                            <div className="px-5 py-2 bg-[var(--accent-leaf)]/10 text-[var(--accent-leaf)] border border-[var(--accent-leaf)]/20 rounded-2xl text-[10px] font-black tracking-widest uppercase flex items-center shadow-sm">
                                <Leaf size={12} className="mr-2" />
                                {credits} Reward Points
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {availableRewards.map((reward) => (
                                <div key={reward.id} className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[2rem] hover:border-[var(--accent-green)] transition-all group relative overflow-hidden">
                                    <div className="flex items-start gap-5 relative z-10">
                                        <div className="w-16 h-16 bg-[var(--bg-card)] rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:bg-[var(--accent-green)]/10 transition-colors border border-[var(--border-color)]">
                                            {reward.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-black tracking-tight mb-1 group-hover:text-[var(--accent-green)] transition-colors uppercase text-sm">{reward.name}</h3>
                                            <p className="text-[var(--text-muted)] text-[11px] font-medium mb-4 leading-normal italic">{reward.description}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-black text-[var(--accent-leaf)]">{reward.points} CR</span>
                                                <button 
                                                    onClick={() => handleRedeem(reward)}
                                                    disabled={credits < reward.points}
                                                    className={`px-6 py-2 rounded-2xl text-[9px] font-black tracking-widest transition-all uppercase ${
                                                        credits >= reward.points 
                                                        ? 'bg-[var(--accent-green)] text-white shadow-xl hover:scale-105 active:scale-95' 
                                                        : 'bg-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed border border-transparent'
                                                    }`}
                                                >
                                                    REDEEM
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                                <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] mt-1">Update your personal information</p>
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
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)] ml-1">Zone</label>
                                    <select name="zone" value={editForm.zone} onChange={handleEditChange} required className="earth-input appearance-none">
                                        <option value="Alpha">Alpha Region</option>
                                        <option value="Beta">Beta Region</option>
                                        <option value="Gamma">Gamma Region</option>
                                        <option value="Delta">Delta Region</option>
                                        <option value="Epsilon">Epsilon Region</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 px-6 py-4 border border-[var(--border-color)] rounded-2xl font-black text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all text-[10px] tracking-widest uppercase">Cancel</button>
                                <button type="submit" disabled={updateLoading} className="eco-button flex-1 py-4 text-[10px] tracking-widest uppercase">Save</button>
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

export default CitizenProfile;
