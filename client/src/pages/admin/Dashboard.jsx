import api from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle, Clock, MapPin, TrendingUp, Loader2, AlertCircle, FileText, LayoutGrid, UserCheck, PieChart as PieChartIcon, Activity, Award, ShieldCheck, Zap } from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line, Legend 
} from 'recharts';

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

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [dashRes, analyticsRes, trendsRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/analytics/overview'),
                    api.get('/analytics/trends')
                ]);
                
                setData({
                    ...dashRes.data,
                    stats: { 
                        ...dashRes.data.stats, 
                        ...analyticsRes.data.stats 
                    },
                    zoneData: analyticsRes.data.zoneData,
                    topCollectors: analyticsRes.data.topCollectors,
                    trends: trendsRes.data
                });
            } catch (err) {
                const msg = err.response?.data?.message || err.message || 'Connection error. Failed to load dashboard data.';
                setError(msg);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="relative">
                    <Loader2 className="w-20 h-20 text-[var(--accent-green)] animate-spin" />
                    <div className="absolute inset-0 bg-[var(--accent-green)]/20 blur-2xl animate-pulse" />
                </div>
            </div>
        );
    }

    const { stats, zoneData, trends, topCollectors } = data || { 
        stats: { total: 0, resolved: 0, pending: 0, inProgress: 0, collectorsCount: 0 }, 
        zoneData: [],
        trends: [],
        topCollectors: []
    };

    const statusPieData = [
        { name: 'Resolved', value: stats.resolved, color: '#52B788' },
        { name: 'Pending', value: stats.pending, color: '#8B5E3C' },
        { name: 'In Progress', value: stats.inProgress, color: '#2D6A4F' }
    ].filter(item => item.value > 0);

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-slide-up text-[var(--text-primary)]">
            {/* Admin Nature Header */}
            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex items-center space-x-6">
                    <div className="relative group">
                        <div className="w-16 h-16 bg-gradient-to-tr from-[var(--accent-green)] to-[var(--accent-leaf)] rounded-[2rem] flex items-center justify-center text-white shadow-xl border-4 border-white/20 group-hover:scale-110 transition-transform duration-500">
                            <ShieldCheck size={32} />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-[var(--bg-primary)] p-1.5 rounded-lg border border-[var(--accent-green)]/30">
                            <Zap size={12} className="text-[var(--accent-green)] animate-pulse" />
                        </div>
                    </div>
                     <div>
                        <h1 className="text-4xl font-black tracking-tighter font-['Playfair+Display'] uppercase">
                            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-leaf)]">Dashboard</span>
                        </h1>
                        <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.2em] text-[10px] mt-2 flex items-center gap-2">
                             Status: Admin Logged In <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse ml-2" /> All systems normal
                        </p>
                    </div>
                </div>
                {/* Welcome Message */}
                <div className="flex items-center space-x-5 mb-12">
                     <div className="px-6 py-3 bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 rounded-2xl flex items-center space-x-3 shadow-xl group hover:border-[var(--accent-leaf)]/50 transition-all">
                        <div className="w-2 h-2 rounded-full bg-[var(--accent-leaf)] animate-pulse shadow-[0_0_10px_#52B788]" />
                        <span className="text-[var(--accent-green)] font-black text-[10px] tracking-widest uppercase">System Connected</span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-10 p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center space-x-4 text-rose-500 animate-shake">
                    <AlertCircle size={24} />
                    <p className="font-black tracking-wide uppercase text-xs italic">{error}</p>
                </div>
            )}

            {/* Key Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {[
                    { label: 'Total Reports', value: stats.total, icon: FileText, color: 'emerald', desc: 'Total submitted' },
                    { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'leaf', desc: 'Resolved issues' },
                    { label: 'Pending', value: stats.pending, icon: Clock, color: 'earth', desc: 'Awating action' },
                    { label: 'Collectors', value: stats.collectorsCount || 0, icon: Users, color: 'green', desc: 'Active collectors' }
                ].map((stat, idx) => (
                    <div key={idx} className="leaf-card relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 bg-[var(--accent-green)]/10 rounded-2xl flex items-center justify-center text-[var(--accent-green)] group-hover:bg-[var(--accent-green)] group-hover:text-white transition-all duration-500 border border-[var(--accent-green)]/20 shadow-inner`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`text-[9px] font-black uppercase text-[var(--text-muted)] tracking-[0.2em]`}>{stat.label}</span>
                        </div>
                        <span className="text-5xl font-black text-[var(--text-primary)] tracking-tighter font-['Playfair+Display'] block">
                            <CountUp end={stat.value} />
                        </span>
                        <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest mt-2">{stat.desc}</p>
                        
                        <div className={`absolute -bottom-10 -right-10 w-24 h-24 bg-[var(--accent-green)]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000`} />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
                {/* Performance Stats */}
                <div className="mb-16 lg:col-span-8 space-y-10">
                    {/* Main Dashboard Panel */}
            <div className="leaf-card p-10 md:p-14 rounded-[3.5rem] relative overflow-hidden border-2 border-[var(--bg-card)]">
                        <div className="flex items-center justify-between mb-12">
                             <h2 className="text-2xl font-black text-[var(--text-primary)] flex items-center gap-4 font-['Playfair+Display'] tracking-tighter uppercase">
                                <Activity className="text-[var(--accent-green)]" />
                                Reporting Trends
                            </h2>
                            <div className="px-5 py-2 bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 rounded-xl text-[9px] font-black text-[var(--accent-green)] tracking-[0.3em] uppercase">
                                Trends Overview
                            </div>
                        </div>
                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trends}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.3} />
                                    <XAxis 
                                        dataKey="month" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 900 }}
                                        dy={15}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 900 }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '20px' }}
                                        itemStyle={{ fontWeight: 900, color: 'var(--accent-green)', fontSize: '12px' }}
                                        labelStyle={{ color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 900, fontSize: '10px' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="reports" 
                                        stroke="var(--accent-green)" 
                                        strokeWidth={5} 
                                        dot={{ fill: 'var(--accent-green)', r: 7, strokeWidth: 4, stroke: 'var(--bg-card)' }}
                                        activeDot={{ r: 9, strokeWidth: 0, fill: 'var(--accent-leaf)' }}
                                        animationDuration={3000}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Status Matrix - Pie */}
                        <div className="leaf-card p-10 rounded-[4rem] flex flex-col items-center">
                             <h2 className="text-xl font-black text-[var(--text-primary)] mb-10 flex items-center gap-3 self-start font-['Playfair+Display'] tracking-tighter uppercase">
                                <PieChartIcon className="text-[var(--accent-leaf)]" size={24} />
                                Report Status
                            </h2>
                            <div className="h-[280px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusPieData}
                                            innerRadius={70}
                                            outerRadius={100}
                                            paddingAngle={10}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {statusPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                            itemStyle={{ fontWeight: 900, fontSize: '10px' }}
                                        />
                                        <Legend verticalAlign="bottom" height={40} iconType="circle" wrapperStyle={{ fontWeight: 900, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Sector Harmony - Bar */}
                        <div className="leaf-card p-10 rounded-[4rem] shadow-xl border-[var(--border-color)] flex flex-col items-center">
                             <h2 className="text-xl font-black text-[var(--text-primary)] mb-10 flex items-center gap-3 self-start font-['Playfair+Display'] tracking-tighter uppercase">
                                <MapPin className="text-[var(--accent-green)]" size={24} />
                                Reports by Zone
                            </h2>
                            <div className="h-[280px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={zoneData}>
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false}
                                            tick={{ fill: 'var(--text-muted)', fontSize: 9, fontWeight: 900 }}
                                        />
                                        <Tooltip 
                                            cursor={{fill: 'rgba(0,0,0,0.03)'}}
                                            contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                                            itemStyle={{ fontWeight: 900, fontSize: '10px', color: 'var(--accent-green)' }}
                                        />
                                        <Bar dataKey="count" fill="url(#colorBar)" radius={[12, 12, 12, 12]} barSize={35}>
                                            <defs>
                                                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="var(--accent-leaf)" stopOpacity={0.2}/>
                                                </linearGradient>
                                            </defs>
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Pickups List */}
                <div className="relative z-10 lg:col-span-4 space-y-10">
                     {/* Quick Actions Card */}
                     <div className="leaf-card p-10 rounded-[4rem] bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] text-[var(--text-primary)] shadow-xl relative overflow-hidden group border-[var(--accent-green)]/20">
                        <div className="relative z-10">
                             <h3 className="text-2xl font-black mb-10 flex items-center gap-4 font-['Playfair+Display'] tracking-tighter uppercase">
                                <LayoutGrid size={28} className="text-[var(--accent-green)] group-hover:rotate-90 transition-transform duration-700" />
                                Quick Actions
                            </h3>
                            <div className="space-y-5">
                                <Link to="/admin/reports" className="flex items-center justify-between p-6 bg-[var(--bg-card)] hover:bg-[var(--accent-green)]/10 border border-[var(--border-color)] hover:border-[var(--accent-green)]/30 rounded-[2rem] transition-all group/item">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-[var(--accent-green)]/10 rounded-2xl flex items-center justify-center text-[var(--accent-green)] group-hover:scale-110 transition-transform">
                                            <FileText size={24} />
                                         </div>
                                         <div>
                                            <span className="font-black block text-xs uppercase tracking-widest">Manage Reports</span>
                                            <span className="text-[var(--text-muted)] text-[9px] font-black uppercase tracking-[0.2em] mt-1 block">View all submissions</span>
                                        </div>
                                    </div>
                                    <TrendingUp size={18} className="text-[var(--text-muted)] group-hover:text-[var(--accent-green)] transition-colors" />
                                </Link>
                                
                                <Link to="/admin/users" className="flex items-center justify-between p-6 bg-[var(--bg-card)] hover:bg-[var(--accent-earth)]/10 border border-[var(--border-color)] hover:border-[var(--accent-earth)]/30 rounded-[2rem] transition-all group/item">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-[var(--accent-earth)]/10 rounded-2xl flex items-center justify-center text-[var(--accent-earth)] group-hover:scale-110 transition-transform">
                                            <Users size={24} />
                                        </div>
                                         <div>
                                            <span className="font-black block text-xs uppercase tracking-widest">Users</span>
                                            <span className="text-[var(--text-muted)] text-[9px] font-black uppercase tracking-[0.2em] mt-1 block">Manage access</span>
                                        </div>
                                    </div>
                                    <UserCheck size={18} className="text-[var(--text-muted)] group-hover:text-[var(--accent-earth)] transition-colors" />
                                </Link>
                            </div>
                            
                            <div className="mt-10 space-y-4">
                                <button 
                                    onClick={async () => {
                                        try {
                                            await api.get('/admin/stats');
                                            alert('Rewards synchronized.');
                                        } catch {
                                            alert('Sync failure.');
                                        }
                                    }}
                                    className="w-full py-5 eco-button text-white rounded-3xl font-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 text-[10px] tracking-[0.3em] scroll-px-10 uppercase"
                                >
                                     <Award size={20} />
                                    SYNC USER BADGES
                                </button>
                                <button className="w-full py-5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-3xl font-black transition-all active:scale-95 text-[10px] tracking-[0.3em] uppercase">
                                    DOWNLOAD REPORT .PDF
                                </button>
                            </div>
                        </div>
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[var(--accent-green)]/10 rounded-full blur-[100px]" />
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--accent-leaf)]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    </div>

                    {/* Top Citizens Feed */}
                    <div className="leaf-card p-10 rounded-[4rem] shadow-xl border-[var(--border-color)] relative overflow-hidden">
                        <h2 className="text-xl font-black text-[var(--text-primary)] mb-10 flex items-center gap-4 font-['Playfair+Display'] tracking-tighter uppercase">
                            <TrendingUp className="text-[var(--accent-leaf)]" size={28} />
                            Top Citizens
                        </h2>
                        <div className="space-y-5">
                              {topCollectors.length > 0 ? (
                                topCollectors.map((collector, index) => (
                                    <div key={index} className="flex items-center justify-between p-6 bg-[var(--bg-secondary)] rounded-[2rem] border border-[var(--border-color)] hover:border-[var(--accent-green)]/30 transition-all group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-[var(--bg-card)] rounded-[1.2rem] flex items-center justify-center shadow-lg group-hover:shadow-[var(--accent-green)]/10 transition-all font-black text-[var(--text-muted)] text-xs border border-[var(--border-color)]">
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <span className="font-black text-[var(--text-primary)] block text-sm tracking-tight uppercase group-hover:text-[var(--accent-green)] transition-colors">{collector.name}</span>
                                                <span className="text-[9px] font-black text-[var(--accent-leaf)] uppercase tracking-widest mt-1 block">Top Performer</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[var(--accent-green)] font-black text-2xl block font-['Playfair+Display']">{collector.completed}</span>
                                            <span className="text-[var(--text-muted)] text-[8px] uppercase font-black tracking-widest block mt-1">Reports</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-[var(--text-muted)] font-black uppercase tracking-[0.3em] text-[10px] italic">
                                    Data Unavailable
                                </div>
                            )}
                        </div>
                        
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[var(--accent-leaf)]/5 rounded-full blur-3xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
