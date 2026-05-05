import { useState, useEffect } from 'react';
import api from '../../api/api';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Activity, ShieldCheck, MapPin, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Stats = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/analytics/public');
                setData(res.data);
            } catch (err) {
                setError('Failed to fetch environment statistics.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] mt-16">
                <Loader2 className="w-12 h-12 text-[var(--accent-green)] animate-spin" />
            </div>
        );
    }

    const { stats, zoneData } = data || {};

    const pieData = [
        { name: 'Resolved', value: stats?.resolved || 0, color: '#10B981' },
        { name: 'Pending', value: stats?.pending || 0, color: '#F59E0B' },
        { name: 'In Progress', value: stats?.inProgress || 0, color: '#6366F1' },
    ].filter(d => d.value > 0);

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-slide-up">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[var(--accent-green)] font-black uppercase tracking-widest text-xs mb-8 hover:translate-x-[-4px] transition-transform"
            >
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="flex items-center justify-between mb-12">
                <h1 className="text-4xl font-black tracking-tighter uppercase font-['Playfair+Display'] text-[var(--text-primary)]">
                    Environment <span className="text-[var(--accent-green)]">Stats</span>
                </h1>
                <div className="px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-3">
                    <Activity size={18} className="text-emerald-500" />
                    <span className="text-xs font-black tracking-widest text-emerald-600 uppercase">Live City Data</span>
                </div>
            </div>

            {error ? (
                 <div className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] text-rose-600 font-bold text-center">
                    {error}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Status Overview Card */}
                    <div className="leaf-card">
                        <h2 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                            <ShieldCheck className="text-emerald-500" />
                            Report Status Overview
                        </h2>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Zone Distribution Card */}
                    <div className="leaf-card">
                        <h2 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                            <MapPin className="text-[var(--accent-earth)]" />
                            Reports by Zone
                        </h2>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={zoneData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: 'var(--text-muted)', fontSize: 12, fontWeight: 700}}
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)', fontSize: 12, fontWeight: 700}} />
                                    <Tooltip 
                                        cursor={{fill: 'rgba(0,0,0,0.02)'}}
                                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="count" fill="var(--accent-green)" radius={[10, 10, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* City Impact Stats */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="leaf-card bg-emerald-500/5 text-center p-8">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 block mb-2">Total Managed</span>
                            <span className="text-5xl font-black text-[var(--accent-green)] font-['Playfair+Display']">{stats?.total || 0}</span>
                        </div>
                        <div className="leaf-card bg-amber-500/5 text-center p-8">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 block mb-2">Resolved City-Wide</span>
                            <span className="text-5xl font-black text-amber-600 font-['Playfair+Display']">{stats?.resolved || 0}</span>
                        </div>
                        <div className="leaf-card bg-indigo-500/5 text-center p-8">
                             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 block mb-2">Efficiency Rate</span>
                             <span className="text-5xl font-black text-indigo-600 font-['Playfair+Display']">
                                {stats?.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                             </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Stats;
