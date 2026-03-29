import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { Leaf, CheckCircle, Clock, RefreshCcw, MapPin, AlertCircle, Loader2, Activity, ShieldCheck, Recycle, Sparkles, Award, Star, Plus, FileText, Trophy } from 'lucide-react';

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

    return <span className="animate-count">{count}</span>;
};

const CitizenDashboard = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [zoneReports, setZoneReports] = useState([]);
    const [availableRewards, setAvailableRewards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashRes, rewardRes] = await Promise.all([
                    api.get('/dashboard/citizen', { headers: { 'x-auth-token': token } }),
                    api.get('/rewards/items', { headers: { 'x-auth-token': token } })
                ]);
                
                setUserData(dashRes.data);
                setAvailableRewards(rewardRes.data || []);
                
                const currentZone = dashRes.data.user?.zone || user?.zone;
                if (currentZone) {
                    const reportsRes = await api.get(`/reports?zone=${currentZone}`, {
                        headers: { 'x-auth-token': token }
                    });
                    setZoneReports(reportsRes.data.reports || []);
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load dashboard.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchData();
    }, [token, user?.zone]);

    const handleRedeem = async (reward) => {
        if (userData?.user?.ecoCredits < reward.points) {
            alert('Not enough reward points!');
            return;
        }
        if (!window.confirm(`Redeem ${reward.points} points for ${reward.name}?`)) return;

        try {
            const res = await api.post('/rewards/redeem', 
                { rewardId: reward._id, points: reward.points },
                { headers: { 'x-auth-token': token } }
            );
            alert(res.data.message);
            window.location.reload();
        } catch (err) {
            alert(err.response?.data?.message || 'Redemption failed');
        }
    };

    useEffect(() => {
        if (!loading && zoneReports.length > 0 && mapRef.current) {
            if (mapInstance.current) {
                mapInstance.current.remove();
            }

            const defaultCoords = [zoneReports[0].latitude, zoneReports[0].longitude];
            mapInstance.current = L.map(mapRef.current).setView(defaultCoords, 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(mapInstance.current);

            zoneReports.forEach(report => {
                if (report.latitude && report.longitude) {
                    const iconHtml = `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent-green)] text-white text-[10px] font-black shadow-lg border-2 border-white">${report.status.charAt(0)}</div>`;
                    const customIcon = L.divIcon({
                        className: 'custom-div-icon',
                        html: iconHtml,
                        iconSize: [32, 32],
                        iconAnchor: [16, 32]
                    });

                    L.marker([report.latitude, report.longitude], { icon: customIcon })
                        .addTo(mapInstance.current)
                        .bindPopup(`<b>${report.location}</b><br>Status: ${report.status}`);
                }
            });
        }
    }, [loading, zoneReports]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Resolved': return <CheckCircle className="text-emerald-500" size={18} />;
            case 'In Progress': return <RefreshCcw className="text-indigo-500 animate-spin" size={18} />;
            default: return <Clock className="text-amber-500" size={18} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <Loader2 className="w-12 h-12 text-[var(--accent-green)] animate-spin" />
            </div>
        );
    }

    const { stats = { total: 0, resolved: 0, pending: 0, inProgress: 0 }, recentReports = [] } = userData || {};

    return (
        <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-slide-up">
            
            {/* 1. Hero Header */}
            <div className="glass-card p-10 mb-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-green)]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10 flex items-center gap-8">
                    <div className="w-24 h-24 bg-gradient-to-tr from-[var(--accent-green)] to-[var(--accent-leaf)] rounded-[2.5rem] flex items-center justify-center text-4xl text-white shadow-2xl border-4 border-white/20 font-['Playfair_Display']">
                        {user?.name?.charAt(0) || 'G'}
                    </div>
                    <div>
                        <h1 className="text-5xl font-black tracking-tighter font-['Playfair_Display'] uppercase leading-none text-[var(--text-primary)]">
                            Welcome, <span className="text-[var(--accent-green)]">{user?.name?.split(' ')[0]}</span>
                        </h1>
                        <p className="text-[var(--text-muted)] mt-5 font-black uppercase tracking-[0.3em] text-[10px] flex items-center gap-3">
                            <Activity size={14} className="animate-pulse text-[var(--accent-green)]" />
                            Eco-Citizen Level: <span className="text-[var(--accent-green)]">{userData?.user?.rank || 'SEEDLING'}</span>
                        </p>
                    </div>
                </div>

                <div className="relative z-10 flex gap-4">
                    <div className="stat-card-nature p-6 min-w-[140px] border-none bg-white/40 shadow-inner">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Eco Credits</span>
                        <span className="text-3xl font-black text-[var(--accent-green)] mt-2"><CountUp end={userData?.user?.ecoCredits || 0} /></span>
                    </div>
                    <button 
                        onClick={() => navigate('/citizen/submit')}
                        className="eco-button h-full px-10 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 group hover:scale-105 transition-all"
                    >
                        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                        <span className="text-[10px] tracking-[0.2em] uppercase font-black">Report Waste</span>
                    </button>
                </div>
            </div>

            {/* 2. Content Grid */}
            <div className="grid grid-cols-12 gap-10">
                
                {/* Statistics Row (Mobile: full, Desktop: span 8) */}
                <div className="col-span-12 lg:col-span-8 space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="stat-card-nature p-8 group border-none bg-white/60">
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                                <Activity size={28} />
                            </div>
                            <span className="text-4xl font-black text-[var(--text-primary)]"><CountUp end={stats.total} /></span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-2">Total Reports</span>
                            <div className="accent-line bg-emerald-500" />
                        </div>
                        <div className="stat-card-nature p-8 group border-none bg-white/60">
                            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                                <CheckCircle size={28} />
                            </div>
                            <span className="text-4xl font-black text-[var(--text-primary)]"><CountUp end={stats.resolved} /></span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-2">Resolved</span>
                            <div className="accent-line bg-blue-500" />
                        </div>
                        <div className="stat-card-nature p-8 group border-none bg-white/60">
                            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
                                <Clock size={28} />
                            </div>
                            <span className="text-4xl font-black text-[var(--text-primary)]"><CountUp end={stats.pending + stats.inProgress} /></span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-2">Active Tasks</span>
                            <div className="accent-line bg-amber-500" />
                        </div>
                    </div>

                    {/* Recent Reports List */}
                    <div className="leaf-card border-none shadow-2xl relative overflow-hidden bg-white/80">
                        <div className="flex items-center justify-between mb-10 border-b border-[var(--border-color)] pb-8">
                             <h2 className="text-3xl font-black tracking-tighter uppercase flex items-center gap-4 font-['Playfair_Display'] text-[var(--text-primary)]">
                                <FileText className="text-[var(--accent-green)]" size={32} />
                                Recent Activity
                             </h2>
                             <Link to="/citizen/reports" className="text-[10px] font-black tracking-widest text-[var(--accent-green)] hover:bg-[var(--accent-green)] hover:text-white uppercase bg-[var(--accent-green)]/5 px-8 py-3 rounded-full border border-[var(--accent-green)]/20 transition-all">
                                 History
                             </Link>
                        </div>
                        
                        <div className="space-y-4">
                            {recentReports.length > 0 ? (
                                recentReports.map((report) => (
                                    <div key={report._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-[var(--bg-secondary)]/40 rounded-[2.5rem] border border-[var(--border-color)] hover:border-[var(--accent-green)]/40 transition-all group gap-4">
                                        <div className="flex items-center space-x-6">
                                            <div className="w-16 h-16 bg-white dark:bg-black/20 rounded-2xl flex items-center justify-center border border-[var(--border-color)] group-hover:bg-[var(--accent-green)]/10 transition-colors">
                                                <Recycle size={28} className="text-[var(--accent-green)]" />
                                            </div>
                                            <div>
                                                <span className="font-black text-[var(--text-primary)] tracking-tight text-xl block leading-tight">{report.location}</span>
                                                <span className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest mt-1 block italic">{new Date(report.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-white/60 dark:bg-black/40 px-6 py-3 rounded-2xl border border-[var(--border-color)] shadow-sm">
                                            {getStatusIcon(report.status)}
                                            <span className="font-black text-[var(--text-primary)] text-[10px] tracking-widest uppercase">{report.status}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-[var(--bg-secondary)]/20 rounded-[3rem] border-2 border-dashed border-[var(--border-color)]">
                                    <ShieldCheck size={64} className="text-[var(--text-muted)] mx-auto mb-6 opacity-40" />
                                    <p className="text-[12px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">No cleanups reported yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Gamification & Insights (col-span-4) */}
                <div className="col-span-12 lg:col-span-4 space-y-10">
                    
                    {/* Progression Card */}
                    <div className="leaf-card p-10 bg-gradient-to-br from-[var(--bg-secondary)] to-white border-none shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-green)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-16 h-16 bg-[var(--accent-green)]/10 rounded-2xl flex items-center justify-center text-[var(--accent-green)] group-hover:scale-110 transition-transform duration-500">
                                    <Trophy size={36} />
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Citizen Rank</span>
                                    <p className="text-2xl font-black uppercase tracking-tighter text-[var(--accent-green)] font-['Playfair_Display']">{userData?.user?.rank || 'SEEDLING'}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Next Level Progress</span>
                                    <span className="text-xs font-black text-[var(--accent-green)]">{userData?.user?.ecoCredits % 100} / 100 XP</span>
                                </div>
                                <div className="w-full h-4 bg-[var(--accent-green)]/10 rounded-full overflow-hidden border border-[var(--accent-green)]/10 p-0.5">
                                    <div 
                                        className="h-full bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-leaf)] rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(45,106,79,0.3)]"
                                        style={{ width: `${userData?.user?.ecoCredits % 100}%` }}
                                    />
                                </div>
                                <p className="text-[10px] text-[var(--text-muted)] italic leading-relaxed pt-2 leading-tight">
                                    &ldquo;Sustainability is no longer about doing less harm. It&apos;s about doing more good.&rdquo;
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Community Hotspot Map */}
                    <div className="leaf-card p-8 border-none bg-white shadow-2xl space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-3 text-[var(--text-primary)]">
                                <MapPin size={18} className="text-[var(--accent-earth)]" />
                                Community Map
                            </h3>
                            <span className="px-4 py-1.5 bg-[var(--accent-earth)]/10 text-[var(--accent-earth)] rounded-full text-[9px] font-black tracking-widest uppercase">Zone {userData?.user?.zone || 'Alpha'}</span>
                        </div>
                        <div 
                            ref={mapRef} 
                            className="w-full h-60 rounded-[2.5rem] border border-[var(--border-color)] shadow-inner z-0 overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 cursor-crosshair"
                        />
                        <div className="flex items-center gap-4 p-5 bg-[var(--bg-secondary)]/50 rounded-2xl border border-[var(--border-color)]">
                             <Activity size={20} className="text-[var(--accent-green)]" />
                             <div className="flex-1">
                                <p className="text-[10px] font-black uppercase tracking-widest">Neighborhood Intel</p>
                                <button onClick={() => navigate('/citizen/stats')} className="text-[9px] font-bold text-[var(--accent-leaf)] hover:underline uppercase">Full Analytics</button>
                             </div>
                        </div>
                    </div>

                    {/* Reward QuickHub */}
                    <div className="leaf-card p-10 bg-gradient-to-tr from-[var(--bg-secondary)] to-white border-none shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                             <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-3 text-[var(--text-primary)]">
                                <Star size={18} className="text-amber-500 fill-amber-500" />
                                Rewards Hub
                             </h3>
                             <div className="flex items-center gap-2">
                                <span className="text-[var(--accent-green)] font-black text-lg">{userData?.user?.ecoCredits || 0}</span>
                                <span className="text-[var(--text-muted)] text-[9px] font-bold uppercase tracking-widest">Credits</span>
                             </div>
                        </div>
                        
                        <div className="space-y-4">
                            {availableRewards.slice(0, 2).map(reward => (
                                <div key={reward._id} className="flex items-center gap-5 p-5 bg-white/60 border border-[var(--border-color)] rounded-[2rem] hover:border-[var(--accent-green)] transition-all group cursor-pointer shadow-sm hover:shadow-md">
                                    <div className="text-3xl grayscale group-hover:grayscale-0 transition-all transform group-hover:scale-110 duration-500">{reward.icon}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-[11px] tracking-tight uppercase truncate leading-none text-[var(--text-primary)]">{reward.name}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-[10px] font-black text-[var(--accent-leaf)]">{reward.points} CR</span>
                                            <button onClick={() => handleRedeem(reward)} className="text-[10px] font-black text-[var(--accent-green)] hover:scale-110 transition-transform uppercase tracking-widest">Redeem</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Link to="/citizen/profile" className="block text-center text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--accent-green)] pt-6 border-t border-[var(--border-color)] mt-6 transition-colors opacity-60">
                                Browse All Rewards
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CitizenDashboard;
