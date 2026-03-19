import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    Trophy, 
    Medal, 
    ArrowLeft, 
    Loader2, 
    ShieldCheck, 
    MapPin
} from 'lucide-react';

const Leaderboard = () => {
    const navigate = useNavigate();
    const [citizens, setCitizens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/rewards/leaderboard', {
                headers: { 'x-auth-token': token }
            });
            setCitizens(res.data);
        } catch (err) {
            setError('Failed to load the leaderboard.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (index) => {
        switch (index) {
            case 0: return <Trophy className="text-yellow-400" size={24} />;
            case 1: return <Medal className="text-slate-300" size={24} />;
            case 2: return <Medal className="text-amber-600" size={24} />;
            default: return <span className="text-[var(--text-muted)] font-black text-sm">{index + 1}</span>;
        }
    };

    const getRankColor = (rank) => {
        switch (rank) {
            case 'Earth Guardian': return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10';
            case 'Forest Ranger': return 'text-indigo-500 border-indigo-500/30 bg-indigo-500/10';
            case 'Sprout': return 'text-amber-500 border-amber-500/30 bg-amber-500/10';
            default: return 'text-var(--text-muted) border-var(--border-color) bg-var(--bg-secondary)';
        }
    };

    return (
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-slide-up text-[var(--text-primary)]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div className="flex items-center space-x-6">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-sm hover:border-[var(--accent-green)] transition-all text-[var(--text-muted)] hover:text-[var(--accent-green)] active:scale-95"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter font-['Playfair+Display'] uppercase flex items-center gap-4">
                            <ShieldCheck className="text-[var(--accent-green)]" size={32} />
                            Leaderboard
                        </h1>
                        <p className="text-[var(--text-muted)] font-bold uppercase tracking-[0.2em] text-[10px] mt-1 italic">
                            Top Contributors to a Cleaner Environment
                        </p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="py-24 flex flex-col items-center justify-center">
                    <Loader2 className="w-16 h-16 text-[var(--accent-green)] animate-spin" />
                    <p className="mt-6 text-[var(--accent-green)] font-black tracking-[0.3em] uppercase text-xs animate-pulse">Loading rankings...</p>
                </div>
            ) : error ? (
                <div className="py-20 text-center leaf-card border-rose-500/20">
                    <p className="text-rose-500 font-black uppercase tracking-widest">{error}</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Top 3 Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {citizens.slice(0, 3).map((g, i) => (
                            <div key={g._id} className={`leaf-card relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 ${i === 0 ? 'border-[var(--accent-green)] shadow-[var(--accent-green)]/10' : ''}`}>
                                <div className="absolute top-4 right-4">{getRankIcon(i)}</div>
                                <div className="flex flex-col items-center text-center py-6">
                                    <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center border-2 border-[var(--border-color)] mb-4 text-2xl font-black font-['Playfair+Display']">
                                        {g.name.charAt(0)}
                                    </div>
                                    <h3 className="text-xl font-black tracking-tight uppercase mb-2">{g.name}</h3>
                                    <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getRankColor(g.rank)}`}>
                                        {g.rank}
                                    </div>
                                    <div className="mt-6 flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-[var(--accent-green)]">{g.ecoCredits}</span>
                                        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-tighter">Points</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Leaderboard Table */}
                    <div className="leaf-card overflow-hidden p-0 border border-[var(--border-color)]">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Position</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Citizen</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Zone</th>
                                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Points</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-color)]">
                                    {citizens.map((g, i) => (
                                        <tr key={g._id} className="hover:bg-[var(--accent-green)]/5 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    {getRankIcon(i)}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-[var(--bg-secondary)] rounded-xl flex items-center justify-center font-black text-sm">
                                                        {g.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-sm uppercase tracking-tight">{g.name}</p>
                                                        <p className={`text-[9px] font-black uppercase tracking-widest ${g.rank === 'Earth Guardian' ? 'text-emerald-500' : 'text-[var(--text-muted)]'}`}>{g.rank}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-[var(--text-muted)] text-[10px] font-black uppercase tracking-widest">
                                                    <MapPin size={12} className="text-[var(--accent-green)]/50" />
                                                    {g.zone}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-lg font-black text-[var(--accent-green)]">{g.ecoCredits}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
