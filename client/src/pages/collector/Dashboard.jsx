import { useState, useEffect } from 'react';
import api from '../../api/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Truck, CheckCircle, Clock, MapPin, Play, Check, ClipboardList, Loader2, AlertCircle, Sparkles, Activity, ShieldCheck, Zap } from 'lucide-react';

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

const CollectorDashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/dashboard/collector');
                setData(res.data);
            } catch (err) {
                const msg = err.response?.data?.message || err.message || 'Failed to connect to the system. Please try again.';
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await api.put(`/reports/${id}/status`, { status });
            const res = await api.get('/dashboard/collector');
            setData(res.data);
        } catch {
            // Silently handle
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="relative">
                    <Loader2 className="w-16 h-16 text-[var(--accent-green)] animate-spin" />
                    <div className="absolute inset-0 bg-[var(--accent-green)]/20 blur-xl animate-pulse" />
                </div>
            </div>
        );
    }

    const { stats, pickups } = data || { stats: { assigned: 0, completed: 0, pending: 0 }, pickups: [] };

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-slide-up text-[var(--text-primary)]">
            {/* Collector Nature Header */}
            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 bg-gradient-to-tr from-[var(--accent-green)] to-[var(--accent-leaf)] rounded-[2rem] flex items-center justify-center text-white shadow-xl border-4 border-white/20 font-['Playfair+Display'] text-2xl font-black">
                        <Truck size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter font-['Playfair+Display'] uppercase">
                            Collector <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-leaf)]">Dashboard</span>
                        </h1>
                        <p className="text-[var(--text-muted)] font-black uppercase tracking-widest text-[10px] mt-1 flex items-center gap-2">
                             ID: {user?.name?.toUpperCase() || 'COLLECTOR'} <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" /> Status: Online
                        </p>
                    </div>
                </div>
                <div>
                    <Link to="/collector/profile" className="px-8 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-muted)] rounded-2xl font-black hover:text-[var(--text-primary)] transition-all shadow-sm active:scale-95 text-[10px] tracking-widest uppercase flex items-center gap-3">
                        <ShieldCheck size={18} className="text-[var(--accent-green)]" />
                        VIEW PROFILE
                    </Link>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center space-x-4 text-rose-500 animate-shake">
                    <AlertCircle size={24} />
                    <p className="font-black uppercase tracking-widest text-xs italic">{error}</p>
                </div>
            )}

            {/* Main Operational Hub */}
            <div className="leaf-card p-10 md:p-14 rounded-[3.5rem] relative overflow-hidden border-2 border-[var(--bg-card)]">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--accent-green)]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[var(--accent-earth)]/5 rounded-full blur-[100px]" />
                
                {/* Greeting Operative */}
                <div className="flex items-center space-x-5 mb-12">
                    <div className="relative">
                        <div className="w-14 h-14 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center border border-[var(--border-color)] text-[var(--accent-green)] group-hover:scale-110 transition-transform duration-500 shadow-inner">
                            <Activity size={28} />
                        </div>
                        <div className="absolute -top-1 -right-1">
                            <Zap size={14} className="text-[var(--accent-green)] fill-[var(--accent-green)] animate-pulse" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-[var(--text-primary)] font-['Playfair+Display'] tracking-tighter uppercase">
                            Hello, {user?.name || 'Collector'}
                        </h2>
                        <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em] mt-1 italic">Ready for today&apos;s tasks</p>
                    </div>
                </div>

                {/* Tactical Pickup Stats */}
                <div className="mb-16">
                    <h3 className="text-[10px] font-black text-[var(--accent-leaf)] uppercase tracking-[0.3em] mb-8 ml-1">Daily Pickup Overview</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Link to="/collector/pickups?status=Pending" className="leaf-card p-6 flex items-center gap-5 hover:translate-y-[-5px] transition-all bg-[var(--bg-secondary)] border-[var(--border-color)] group">
                            <div className="p-4 bg-[var(--accent-green)]/10 rounded-2xl flex items-center justify-center text-[var(--accent-green)] group-hover:bg-[var(--accent-green)] group-hover:text-white transition-all shadow-lg border border-[var(--accent-green)]/20">
                                <ClipboardList size={24} />
                            </div>
                            <div>
                                <span className="text-[var(--text-muted)] text-[9px] font-black uppercase tracking-widest block mb-1">New Tasks</span>
                                <span className="text-2xl font-black text-[var(--text-primary)] font-['Playfair+Display']"><CountUp end={stats.pending} /> ACTIVE</span>
                            </div>
                        </Link>
                        
                        <Link to="/collector/pickups?status=Resolved" className="leaf-card p-6 flex items-center gap-5 hover:translate-y-[-5px] transition-all bg-[var(--bg-secondary)] border-[var(--border-color)] group">
                            <div className="p-4 bg-[var(--accent-leaf)]/10 rounded-2xl flex items-center justify-center text-[var(--accent-leaf)] group-hover:bg-[var(--accent-leaf)] group-hover:text-white transition-all shadow-lg border border-[var(--accent-leaf)]/20">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <span className="text-[var(--text-muted)] text-[9px] font-black uppercase tracking-widest block mb-1">Completed</span>
                                <span className="text-2xl font-black text-[var(--accent-leaf)] font-['Playfair+Display']"><CountUp end={stats.completed} /> DONE</span>
                            </div>
                        </Link>

                        <div className="leaf-card p-6 flex items-center gap-5 bg-[var(--bg-secondary)] border-[var(--border-color)] group">
                            <div className="p-4 bg-[var(--accent-earth)]/10 rounded-2xl flex items-center justify-center text-[var(--accent-earth)] transition-all shadow-lg border border-[var(--accent-earth)]/20">
                                <Clock size={24} />
                            </div>
                            <div>
                                <span className="text-[var(--text-muted)] text-[9px] font-black uppercase tracking-widest block mb-1">Status</span>
                                <span className="text-2xl font-black text-[var(--accent-earth)] font-['Playfair+Display']"><CountUp end={stats.pending} /> PENDING</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission Deployment List */}
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8 border-b border-[var(--border-color)] pb-6">
                        <h3 className="text-2xl font-black font-['Playfair+Display'] tracking-tighter uppercase flex items-center gap-4">
                            <Sparkles size={24} className="text-[var(--accent-leaf)]" />
                            Active Pickups
                        </h3>
                        <Link 
                            to="/collector/pickups"
                            className="text-[10px] font-black tracking-widest text-[var(--accent-green)] hover:text-[var(--accent-leaf)] uppercase flex items-center gap-2 group/all transition-colors"
                        >
                            VIEW ALL <Truck size={14} className="group-hover/all:translate-x-2 transition-transform duration-700" />
                        </Link>
                    </div>
                    
                    <div className="space-y-5">
                        {pickups.length > 0 ? (
                            pickups.map((pickup) => (
                                <div key={pickup._id} className="flex flex-col lg:flex-row lg:items-center justify-between p-8 bg-[var(--bg-secondary)] rounded-[2.5rem] border border-[var(--border-color)] hover:border-[var(--accent-green)]/30 transition-all group gap-6">
                                    <div className="flex items-center space-x-6">
                                        <div className="w-14 h-14 bg-[var(--bg-card)] rounded-[1.5rem] flex items-center justify-center border border-[var(--border-color)] group-hover:bg-[var(--accent-green)]/10 transition-colors">
                                            <MapPin size={28} className="text-rose-500 animate-pulse" />
                                        </div>
                                        <div>
                                            <span className="font-black text-[var(--text-primary)] tracking-widest text-lg block font-['Playfair+Display'] uppercase truncate max-w-xs">{pickup.location}</span>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[var(--accent-green)]/70 text-[10px] font-black uppercase tracking-widest">{pickup.garbageType}</span>
                                                <span className="w-1 h-1 bg-[var(--border-color)] rounded-full" />
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${pickup.urgency === 'High' ? 'text-rose-500' : pickup.urgency === 'Medium' ? 'text-amber-500' : 'text-[var(--accent-leaf)]'}`}>{pickup.urgency} PRIORITY</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => {
                                            if (pickup.status === 'Pending') handleUpdateStatus(pickup._id, 'In Progress');
                                            else if (pickup.status === 'In Progress') handleUpdateStatus(pickup._id, 'Resolved');
                                        }}
                                        disabled={pickup.status === 'Resolved'}
                                        className={`flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-[10px] tracking-[0.2em] transform active:scale-95 transition-all uppercase whitespace-nowrap ${
                                            pickup.status === 'Resolved' 
                                            ? 'bg-[var(--accent-leaf)]/20 text-[var(--accent-leaf)] border border-[var(--accent-leaf)]/20 cursor-not-allowed' 
                                            : pickup.status === 'In Progress'
                                                ? 'bg-[var(--accent-green)] text-white shadow-xl hover:scale-105'
                                                : 'eco-button text-white shadow-xl'
                                        }`}
                                    >
                                        {pickup.status === 'Pending' && <><Play size={16} /> <span>START PICKUP</span></>}
                                        {pickup.status === 'In Progress' && <><Check size={16} /> <span>COMPLETE</span></>}
                                        {pickup.status === 'Resolved' && <><ShieldCheck size={16} /> <span>RESOLVED</span></>}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-[var(--bg-secondary)] rounded-[3rem] border-2 border-dashed border-[var(--border-color)] group">
                                <Truck size={48} className="text-[var(--text-muted)] mx-auto mb-6 opacity-40 group-hover:scale-110 transition-transform duration-700" />
                                <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.2em] text-[10px] px-4 italic">No pickups assigned at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectorDashboard;
