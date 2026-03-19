import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Leaf, CheckCircle, Clock, RefreshCcw, MapPin, AlertCircle, Loader2, Activity, ShieldCheck, Recycle, Sparkles } from 'lucide-react';

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
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axios.get('/api/dashboard/citizen');
                setData(res.data);
            } catch (err) {
                const msg = err.response?.data?.message || err.message || 'Connection error. Failed to load dashboard.';
                setError(msg);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Resolved': return <CheckCircle className="text-emerald-500" size={18} />;
            case 'In Progress': return <RefreshCcw className="text-indigo-500 animate-spin-slow" size={18} />;
            case 'Pending': return <Clock className="text-amber-500" size={18} />;
            default: return <Clock size={18} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="relative">
                    <Loader2 className="w-16 h-16 text-[var(--accent-green)] animate-spin" />
                    <div className="absolute inset-0 bg-[var(--accent-leaf)]/20 blur-xl animate-pulse" />
                </div>
            </div>
        );
    }

    const { 
        stats = { total: 0, resolved: 0, pending: 0, inProgress: 0 }, 
        recentReports = [], 
        user: userData = { ecoCredits: 0, rank: 'Seedling' } 
    } = data || {};

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-slide-up text-[var(--text-main)]">
            {/* Nature Greeting */}
            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-5">
                    <div className="w-20 h-20 bg-gradient-to-tr from-[var(--accent-green)] to-[var(--accent-leaf)] rounded-[2.5rem] flex items-center justify-center text-white shadow-xl border border-white/20 font-['Playfair+Display'] text-3xl font-black">
                        {user?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase font-['Playfair+Display']">
                            Greetings, <span className="text-[var(--accent-green)] dark:text-[var(--accent-leaf)]">{user?.name}</span>
                        </h1>
                        <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-[10px] mt-1 flex items-center gap-2">
                             Zone: {user?.zone || 'Region-A'} <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Status: Active
                             <span className="mx-2 text-[var(--border-color)]">|</span>
                             <span className="text-[var(--accent-green)] font-black">{userData?.rank || 'Level 1'}</span>
                        </p>
                    </div>
                </div>
                
                <button 
                    onClick={() => navigate('/citizen/report')}
                    className="eco-button group"
                >
                    <Leaf size={22} className="group-hover:rotate-12 transition-transform duration-300" />
                    <span className="font-black tracking-[0.1em]">NEW REPORT</span>
                </button>
            </div>

            {error && (
                <div className="mb-8 p-6 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] flex items-center space-x-4 text-rose-600 dark:text-rose-400">
                    <AlertCircle size={24} />
                    <p className="font-bold">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Intel Panel */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="leaf-card relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]" />
                        
                        <div className="flex items-center justify-between mb-10 border-b border-[var(--border-color)] pb-6">
                            <h2 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-4">
                                <Activity className="text-[var(--accent-green)]" />
                                Your Impact
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                            <Link to="/citizen/my-reports" className="stat-card-nature group p-6 hover:shadow-2xl">
                                <span className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest block mb-1">Total Reports</span>
                                <span className="text-4xl font-black font-['Playfair+Display'] text-[var(--text-primary)]"><CountUp end={stats.total} /></span>
                                <div className="accent-line bg-[var(--accent-green)]" />
                            </Link>
                            
                            <Link to="/citizen/my-reports?status=Resolved" className="stat-card-nature p-6">
                                <span className="text-emerald-600/60 dark:text-emerald-400/60 text-[10px] font-black uppercase tracking-widest block mb-1">Resolved</span>
                                <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400 font-['Playfair+Display']"><CountUp end={stats.resolved} /></span>
                                <div className="accent-line bg-emerald-500" />
                            </Link>

                            <Link to="/citizen/my-reports?status=Pending" className="stat-card-nature p-6">
                                <span className="text-amber-600/60 dark:text-amber-400/60 text-[10px] font-black uppercase tracking-widest block mb-1">Pending</span>
                                <span className="text-4xl font-black text-amber-600 dark:text-amber-400 font-['Playfair+Display']"><CountUp end={stats.pending} /></span>
                                <div className="accent-line bg-amber-500" />
                            </Link>

                            <Link to="/citizen/my-reports?status=In Progress" className="stat-card-nature p-6">
                                <span className="text-indigo-600/60 dark:text-indigo-400/60 text-[10px] font-black uppercase tracking-widest block mb-1">In Progress</span>
                                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 font-['Playfair+Display']"><CountUp end={stats.inProgress} /></span>
                                <div className="accent-line bg-indigo-500" />
                            </Link>

                            <Link to="/citizen/leaderboard" className="stat-card-nature p-6 bg-[var(--accent-green)]/5 border-[var(--accent-green)]/20">
                                <span className="text-[var(--accent-green)] text-[10px] font-black uppercase tracking-widest block mb-1">Eco-Credits</span>
                                <span className="text-4xl font-black text-[var(--accent-green)] font-['Playfair+Display']"><CountUp end={userData?.ecoCredits || 0} /></span>
                                <div className="accent-line bg-[var(--accent-green)]" />
                            </Link>
                        </div>
                    </div>

                    {/* Recent Feed */}
                    <div className="leaf-card border-emerald-500/5 shadow-xl relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8 border-b border-[var(--border-color)] pb-6">
                             <h2 className="text-2xl font-black tracking-tighter uppercase flex items-center gap-4">
                                <MapPin className="text-[var(--accent-earth)]" />
                                Recent Reports
                             </h2>
                             <Link 
                                to="/citizen/my-reports"
                                className="text-xs font-black tracking-widest text-[var(--accent-green)] hover:text-[var(--accent-leaf)] uppercase flex items-center gap-2 group/all transition-colors"
                             >
                                 VIEW ALL <RefreshCcw size={14} className="group-hover/all:rotate-180 transition-transform duration-700" />
                             </Link>
                        </div>
                        
                        <div className="space-y-4">
                            {recentReports.length > 0 ? (
                                recentReports.map((report) => (
                                    <div key={report._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-[var(--bg-secondary)]/50 rounded-[2rem] border border-[var(--border-color)] hover:border-[var(--accent-leaf)]/30 transition-all group gap-4">
                                        <div className="flex items-center space-x-6">
                                            <div className="w-14 h-14 bg-white/40 dark:bg-black/20 rounded-2xl flex items-center justify-center border border-[var(--border-color)] group-hover:bg-[var(--accent-leaf)]/10 transition-colors">
                                                <Leaf size={24} className="text-[var(--accent-green)]" />
                                            </div>
                                            <div>
                                                <span className="font-bold text-[var(--text-primary)] tracking-tight text-lg block">{report.location}</span>
                                                <span className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest mt-1 block italic">{new Date(report.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-white/60 dark:bg-black/30 px-5 py-2.5 rounded-2xl border border-[var(--border-color)]">
                                            {getStatusIcon(report.status)}
                                            <span className="font-bold text-[var(--text-primary)] text-[10px] tracking-widest uppercase">{report.status}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-[var(--bg-secondary)]/30 rounded-[3rem] border-2 border-dashed border-[var(--border-color)]">
                                    <ShieldCheck size={48} className="text-[var(--text-muted)] mx-auto mb-4 opacity-50" />
                                    <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest">No reports found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="leaf-card bg-gradient-to-br from-[var(--accent-green)] to-[var(--accent-leaf)] text-white shadow-2xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <Sparkles className="text-emerald-200 mb-6 group-hover:scale-110 transition-transform duration-500" size={48} />
                            <h3 className="text-2xl font-black tracking-tighter uppercase mb-4 leading-tight">Your Impact Level</h3>
                            <p className="text-emerald-50/80 leading-relaxed font-medium mb-8 text-sm italic">
                                &ldquo;Nature is not a place to visit. It is home.&rdquo; - Your reports are making a difference.
                            </p>
                            <div className="p-5 bg-white/20 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/30 transition-colors">
                                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                    <Recycle className="text-[var(--accent-green)]" size={28} />
                                </div>
                                <div>
                                    <span className="text-emerald-100 text-[10px] font-black uppercase tracking-widest block">Impact Level</span>
                                    <p className="font-black text-xl uppercase tracking-tight">Eco-Guardian</p>
                                </div>
                            </div>
                        </div>
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
                    </div>
                    
                    <div className="leaf-card group text-center border-dashed">
                         <div className="inline-block p-5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-6 group-hover:bg-[var(--accent-green)] group-hover:text-white transition-all">
                            <Activity size={32} />
                         </div>
                         <h4 className="font-black tracking-tighter uppercase text-[var(--text-primary)] mb-2">Environment Stats</h4>
                         <p className="text-[var(--text-muted)] text-sm mb-8">View your local area&apos;s waste and recycling statistics.</p>
                         <button className="w-full py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase hover:border-[var(--accent-green)] transition-all active:scale-95">
                             VIEW ALL STATS
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CitizenDashboard;
