import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, MapPin, Award, BarChart2, CheckCircle, Clock, ShieldCheck, Trophy, Star, X, Save, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const CitizenProfile = () => {
    const { user, updateUser, token } = useAuth();
    const [stats, setStats] = useState({ totalRec: 0, resolvedRec: 0, pendingRec: 0 });
    const [badges, setBadges] = useState([]);
    const [allAvailableBadges, setAllAvailableBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Rewards & Points
    const [availableRewards, setAvailableRewards] = useState([]);
    const [points, setPoints] = useState(user?.rewardPoints || 0);

    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        zone: user?.zone || ''
    });
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const [dashRes, badgeRes, allBadgeRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/dashboard/citizen', { headers: { 'x-auth-token': token } }),
                    axios.get('http://localhost:5000/api/badges/user', { headers: { 'x-auth-token': token } }),
                    axios.get('http://localhost:5000/api/badges')
                ]);

                setStats({
                    totalRec: dashRes.data.stats.total || 0,
                    resolvedRec: dashRes.data.stats.resolved || 0,
                    pendingRec: dashRes.data.stats.pending || 0
                });
                setBadges(badgeRes.data);
                setAllAvailableBadges(allBadgeRes.data);
            } catch (err) {
                console.error('Error fetching profile data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchProfileData();
    }, [token]);

    useEffect(() => {
        const fetchRewards = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/rewards/items');
                setAvailableRewards(res.data);
            } catch (err) {
                console.error('Error fetching rewards:', err);
            }
        };
        fetchRewards();
    }, []);

    // Also update points from user object whenever it changes
    useEffect(() => {
        if (user?.rewardPoints !== undefined) {
            setPoints(user.rewardPoints);
        }
    }, [user]);

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const res = await axios.put('http://localhost:5000/api/auth/profile', editForm, {
                headers: { 'x-auth-token': token }
            });
            updateUser(res.data);
            setIsEditing(false);
        } catch (err) {
            console.error('Error updating profile:', err);
            alert(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleRedeem = async (reward) => {
        if (points < reward.points) {
            alert('Not enough points!');
            return;
        }
        
        if (!window.confirm(`Redeem ${reward.points} points for ${reward.name}?`)) return;

        try {
            const res = await axios.post('http://localhost:5000/api/rewards/redeem', 
                { rewardId: reward.id, points: reward.points },
                { headers: { 'x-auth-token': token } }
            );
            alert(res.data.message);
            // Update local points
            setPoints(res.data.remainingPoints);
            updateUser({ ...user, rewardPoints: res.data.remainingPoints });
        } catch (err) {
            alert(err.response?.data?.message || 'Redemption failed');
        }
    };

    const handleOpenEdit = () => {
        setEditForm({
            name: user?.name || '',
            phone: user?.phone || '',
            zone: user?.zone || ''
        });
        setIsEditing(true);
    };

    const earnedBadgeIds = badges.map(b => b.badgeId?._id || b.badgeId);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in text-slate-900">
            {/* Profile Header */}
            <div className="glass-card p-10 rounded-[3rem] mb-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-10 shadow-2xl border-white/40">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-[2.5rem] flex items-center justify-center text-4xl text-white shadow-xl">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-100">
                        <Award size={20} className="text-emerald-500" />
                    </div>
                </div>

                <div className="flex-grow text-center md:text-left space-y-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user?.name}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                            <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs">Certified Citizen Reporter</p>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 shadow-sm">
                                <Star size={14} className="text-amber-500 fill-amber-500" />
                                <span className="text-xs font-black text-amber-700">{points} Rewards Points</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-500 font-medium pt-2">
                        <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-slate-400" />
                            <span className="text-sm">{user?.zone || 'N/A'} Zone</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail size={18} className="text-slate-400" />
                            <span className="text-sm">{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={18} className="text-slate-400" />
                            <span className="text-sm">{user?.phone || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={handleOpenEdit}
                        className="px-8 py-4 bg-white border border-slate-100 rounded-[1.5rem] font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                        EDIT PROFILE
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Stats & Verify Section */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="glass-card p-8 rounded-[2.5rem] shadow-xl border-white/40">
                        <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                            <BarChart2 className="text-indigo-500" />
                            Activity Stats
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                                        <Award size={20} />
                                    </div>
                                    <span className="font-bold text-slate-600">Total Reports</span>
                                </div>
                                <span className="text-2xl font-black text-slate-800">{stats.totalRec}</span>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-emerald-50/30 rounded-2xl border border-emerald-100/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                                        <CheckCircle size={20} />
                                    </div>
                                    <span className="font-bold text-emerald-800/70">Resolved Cases</span>
                                </div>
                                <span className="text-2xl font-black text-emerald-600">{stats.resolvedRec}</span>
                            </div>

                            <div className="flex items-center justify-between p-5 bg-amber-50/30 rounded-2xl border border-amber-100/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm">
                                        <Clock size={20} />
                                    </div>
                                    <span className="font-bold text-amber-800/70">Pending Action</span>
                                </div>
                                <span className="text-2xl font-black text-amber-600">{stats.pendingRec}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-[2.5rem] bg-indigo-900 text-white shadow-xl relative overflow-hidden group border-none">
                        <div className="relative z-10">
                            <h3 className="text-xl font-black mb-4 flex items-center gap-3">
                                <ShieldCheck className="text-emerald-400" />
                                Verify Citizen Status
                            </h3>
                            <p className="text-indigo-200/60 text-sm font-medium leading-relaxed mb-6">
                                Your account is verified and you are contributing to a cleaner city. Keep reporting to earn more badges!
                            </p>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]" style={{ width: `${Math.min((stats.resolvedRec / 10) * 100, 100)}%` }}></div>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-indigo-300 text-[10px] font-black uppercase tracking-widest">{stats.resolvedRec} / 10 Resolved</span>
                                <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                    {10 - stats.resolvedRec > 0 ? `${10 - stats.resolvedRec} more for City Legend` : 'Max Level Reached'}
                                </span>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
                    </div>
                </div>

                {/* Badges & Rewards Section */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Badges */}
                    <div className="glass-card p-10 rounded-[3rem] shadow-xl border-white/40">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-4">
                                <Trophy className="text-amber-500" size={28} />
                                Achievements & Badges
                            </h2>
                            <div className="px-6 py-2 bg-amber-50 border border-amber-100 rounded-2xl text-amber-600 font-extrabold text-sm shadow-sm">
                                Level {Math.floor(stats.resolvedRec / 5) + 1}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                            {allAvailableBadges.map((badge) => {
                                const isEarned = earnedBadgeIds.includes(badge._id);
                                return (
                                    <div key={badge._id} className={`flex flex-col items-center text-center group relative cursor-help ${!isEarned ? 'opacity-40 grayscale hover:grayscale-0 transition-all' : ''}`}>
                                        <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-4xl mb-4 transition-all duration-500 relative ${
                                            isEarned 
                                            ? 'bg-gradient-to-tr from-amber-100 to-yellow-50 shadow-lg group-hover:scale-110 group-hover:rotate-6' 
                                            : 'bg-slate-50 border-2 border-dashed border-slate-200 group-hover:border-emerald-300'
                                        }`}>
                                            {badge.icon}
                                            {isEarned && (
                                                <div className="absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-md border-2 border-white">
                                                    <CheckCircle size={10} strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="font-black text-slate-800 text-sm mb-1 group-hover:text-emerald-600 transition-colors">
                                            {badge.name}
                                        </h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">
                                            {isEarned ? 'UNLOCKED' : `LOCKED: ${badge.conditionValue} ${badge.conditionType.split('_')[0]}`}
                                        </p>
                                        
                                        {/* Tooltip */}
                                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 bg-slate-900 text-white rounded-2xl p-4 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-2xl">
                                            <p className="font-black mb-1 text-emerald-400">{badge.name}</p>
                                            <p className="text-slate-300 font-medium italic leading-relaxed">{badge.description}</p>
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 rotate-45" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {badges.length === 0 && (
                            <div className="text-center py-16 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 mt-10">
                                <Award size={48} className="text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 font-black text-lg">No badges earned yet.</p>
                                <p className="text-slate-400 text-sm font-medium">Submit reports and get them resolved to unlock achievements!</p>
                            </div>
                        )}
                    </div>

                    {/* Rewards Shop */}
                    <div className="glass-card p-10 rounded-[3rem] shadow-xl border-white/40 bg-gradient-to-br from-white to-slate-50/50">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-4">
                                <Star className="text-indigo-500 fill-indigo-500" size={28} />
                                Rewards Shop
                            </h2>
                            <div className="px-6 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-600 font-extrabold text-sm shadow-sm flex items-center gap-2">
                                <Activity size={16} />
                                {points} Available
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {availableRewards.map((reward) => (
                                <div key={reward.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-xl transition-all group relative overflow-hidden">
                                    <div className="flex items-start gap-5 relative z-10">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:bg-indigo-50 transition-colors">
                                            {reward.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-black text-slate-800 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">{reward.name}</h3>
                                            <p className="text-slate-400 text-xs font-medium mb-4">{reward.description}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-lg font-black text-indigo-600">{reward.points} PTS</span>
                                                <button 
                                                    onClick={() => handleRedeem(reward)}
                                                    disabled={points < reward.points}
                                                    className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                                                        points >= reward.points 
                                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95' 
                                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    REDEEM
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-100 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditing && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-scale-up">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Edit Profile</h2>
                                <p className="text-slate-500 text-sm font-medium">Update your citizen account details</p>
                            </div>
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="p-3 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-600 transition-all shadow-sm border border-transparent hover:border-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                    <input 
                                        type="text"
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleEditChange}
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-slate-700 transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                    <div className="relative group">
                                        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <input 
                                            type="tel"
                                            name="phone"
                                            value={editForm.phone}
                                            onChange={handleEditChange}
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-slate-700 transition-all"
                                            placeholder="Phone number"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Assigned Zone</label>
                                    <div className="relative group">
                                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                        <select 
                                            name="zone"
                                            value={editForm.zone}
                                            onChange={handleEditChange}
                                            required
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-bold text-slate-700 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Select Zone</option>
                                            <option value="North">North Zone</option>
                                            <option value="South">South Zone</option>
                                            <option value="East">East Zone</option>
                                            <option value="West">West Zone</option>
                                            <option value="Central">Central Zone</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="flex-1 px-6 py-4 border border-slate-100 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all"
                                >
                                    CANCEL
                                </button>
                                <button 
                                    type="submit"
                                    disabled={updateLoading}
                                    className="flex-1 px-6 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {updateLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Save size={18} />
                                            SAVE CHANGES
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CitizenProfile;
