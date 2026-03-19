import { useState } from 'react';
import { Leaf, Search, AlertCircle, TreePine, Recycle, ArrowRight, Loader2 } from 'lucide-react';
import { useWasteAnalyzer } from '../hooks/useWasteAnalyzer';

const WasteAnalyzer = () => {
    const [input, setInput] = useState('');
    const { loading, result, error, history, stats, analyze } = useWasteAnalyzer();

    const quickChips = ["Plastic Bottle", "Newspaper", "Battery", "Vegetable Peels", "Broken Glass", "Old Mobile"];

    const handleScan = (e) => {
        e.preventDefault();
        if (input.trim()) analyze(input);
    };

    const handleChipClick = (item) => {
        setInput(item);
        analyze(item);
    };

    const getCategoryStyles = (category) => {
        switch (category) {
            case 'Recyclable': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Compostable': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'Hazardous': return 'bg-rose-100 text-rose-800 border-rose-200';
            case 'E-Waste': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    return (
        <section className="py-20 px-4 max-w-4xl mx-auto w-full">
            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="px-5 py-2.5 bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 rounded-full flex items-center gap-3">
                    <Search size={14} className="text-[var(--accent-green)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">
                        <span className="text-[var(--accent-green)] mr-1">{stats.analyzed}</span> Total Scans
                    </span>
                </div>
                <div className="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-3">
                    <Recycle size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">
                        <span className="text-emerald-500 mr-1">{stats.recyclable}</span> Recyclable
                    </span>
                </div>
                <div className="px-5 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center gap-3">
                    <AlertCircle size={14} className="text-rose-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">
                        <span className="text-rose-500 mr-1">{stats.hazardous}</span> Hazardous
                    </span>
                </div>
                <div className="px-5 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center gap-3">
                    <TreePine size={14} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">
                        <span className="text-amber-500 mr-1">{stats.compostable}</span> Compostable
                    </span>
                </div>
            </div>

            {/* Scanner Input Area */}
            <div className="leaf-card p-10 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-green)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <h2 className="text-4xl font-black font-['Playfair+Display'] text-[var(--text-primary)] uppercase tracking-tighter mb-4">
                    Eco Waste <span className="text-[var(--accent-green)]">Scanner</span>
                </h2>
                <p className="text-[var(--text-muted)] font-bold uppercase tracking-widest text-[10px] mb-8 italic">
                    Scan your waste item — our AI helper will guide you
                </p>

                <form onSubmit={handleScan} className="max-w-xl mx-auto space-y-6 relative z-10">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                            placeholder="Type a waste item (e.g., Plastic Bottle)..."
                            className="earth-input pr-32 h-16 text-lg font-medium"
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className={`absolute right-2 top-2 bottom-2 px-6 rounded-xl flex items-center gap-2 font-black text-xs tracking-widest uppercase transition-all ${
                                loading 
                                ? 'bg-slate-200 text-slate-400' 
                                : 'bg-[var(--accent-green)] text-white hover:bg-[var(--accent-leaf)] shadow-lg active:scale-95'
                            }`}
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    <span>SCAN</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {quickChips.map(chip => (
                            <button
                                key={chip}
                                type="button"
                                onClick={() => handleChipClick(chip)}
                                disabled={loading}
                                className="px-4 py-2 border border-[var(--border-color)] rounded-full text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:border-[var(--accent-green)] hover:text-[var(--accent-green)] transition-all bg-white"
                            >
                                {chip}
                            </button>
                        ))}
                    </div>
                </form>

                {error && (
                    <div className="mt-8 flex items-center justify-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest animate-pulse">
                        <AlertCircle size={14} />
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {/* Result Card */}
            {result && (
                <div className="mt-10 fade-slide-up">
                    <div className="leaf-card border-l-[6px] border-[var(--accent-green)] p-10 bg-white relative overflow-hidden">
                        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                            <div className="w-20 h-20 bg-[var(--bg-secondary)] rounded-3xl flex items-center justify-center text-5xl shadow-inner border border-[var(--border-color)] flex-shrink-0">
                                {result.emoji}
                            </div>
                            
                            <div className="flex-1 w-full">
                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                    <h3 className="text-3xl font-black font-['Playfair+Display'] uppercase text-[var(--text-primary)]">{result.item_name}</h3>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getCategoryStyles(result.category)}`}>
                                        {result.category}
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-green)]">Eco Score</span>
                                            <span className="text-lg font-black text-[var(--accent-green)]">{result.eco_score}/10</span>
                                        </div>
                                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-leaf)] rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${result.eco_score * 10}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 p-5 bg-[var(--accent-green)]/5 rounded-2xl border border-[var(--accent-green)]/10">
                                        <Leaf className="text-[var(--accent-green)] flex-shrink-0 mt-1" size={20} />
                                        <p className="text-sm font-medium leading-relaxed italic text-[var(--text-primary)]">
                                            {result.disposal_method}
                                        </p>
                                    </div>

                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] block mb-4">Disposal Tips</span>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {result.tips.map((tip, i) => (
                                                <li key={i} className="flex items-center gap-3 text-xs font-bold text-[var(--text-muted)] group">
                                                    <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] group-hover:scale-125 transition-transform" />
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-10 pt-6 border-t border-[var(--border-color)] text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] italic">
                                &quot;{result.environmental_impact}&quot;
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* History List */}
            {history.length > 0 && (
                <div className="mt-20">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px bg-[var(--border-color)] flex-grow" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)]">Recent Scans</h3>
                        <div className="h-px bg-[var(--border-color)] flex-grow" />
                    </div>

                    <div className="space-y-3">
                        {history.map((h, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-sm border border-[var(--border-color)] rounded-2xl hover:border-[var(--accent-green)]/30 transition-all hover:bg-white group">
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl group-hover:scale-110 transition-transform">{h.emoji}</span>
                                    <div>
                                        <p className="font-black text-xs uppercase text-[var(--text-primary)] tracking-tight">{h.item_name}</p>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">{h.category}</span>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500">
                                    Score: {h.eco_score}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default WasteAnalyzer;
