import { cloneElement } from 'react';
import { Link } from 'react-router-dom';
import WasteAnalyzer from '../components/WasteAnalyzer';
import { Shield, MapPin, Leaf, ArrowRight, Wind, Globe, Sparkles } from 'lucide-react';

const Home = () => {
    const features = [
        { 
            icon: <MapPin className="text-[var(--accent-green)]" />, 
            title: "Live Monitoring", 
            desc: "Track waste levels across zones with real-time reporting.",
            glow: "shadow-[0_0_20px_rgba(45,106,79,0.1)]"
        },
        { 
            icon: <Wind className="text-[var(--accent-leaf)]" />, 
            title: "Smart Logistics", 
            desc: "Optimized collection flows for faster waste removal.",
            glow: "shadow-[0_0_20_px_rgba(82,183,136,0.1)]"
        },
        { 
            icon: <Shield className="text-[var(--accent-earth)]" />, 
            title: "Admin Panel", 
            desc: "Monitor platform health with detailed data analytics.",
            glow: "shadow-[0_0_20px_rgba(139,94,60,0.1)]"
        },
        { 
            icon: <Leaf className="text-[var(--accent-green)]" />, 
            title: "Earn Rewards", 
            desc: "Earn reward points and ranks for your contribution.",
            glow: "shadow-[0_0_20px_rgba(45,106,79,0.1)]"
        }
    ];

    return (
        <div className="min-h-screen pt-32 relative overflow-hidden">
            <div className="star-pattern" />
            
            <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-16 py-20">
                    {/* Left Content */}
                    <div className="lg:w-1/2 space-y-8 animate-slide-up">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/50 backdrop-blur-sm border border-[#1B4332]/10 rounded-full shadow-sm">
                            <div className="w-2 h-2 rounded-full bg-[#209c6c]" />
                            <span className="text-[10px] font-black tracking-[0.2em] text-[#1B4332]">RESTORE THE HARMONY</span>
                        </div>
                        
                        <div className="space-y-4">
                            <h1 className="text-[120px] font-black leading-[0.8] tracking-tighter text-[#1B4332] font-['Playfair_Display']">
                                CLEAN <br />
                                <span className="text-[#52B788]">PULSE</span>
                            </h1>
                        </div>
                        
                        <p className="max-w-md text-lg text-[#1B4332]/70 leading-relaxed font-medium">
                            The definitive platform for planetary healing, connecting citizens and guardians to maintain a pristine ecosystem.
                        </p>
                        
                        <div className="flex flex-wrap gap-4 items-center">
                            <Link to="/signup" className="eco-button group">
                                JOIN SANCTUARY
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="px-10 py-4 border border-[#1B4332]/10 rounded-xl text-[#1B4332] font-black text-sm tracking-widest uppercase hover:bg-white/50 transition-all">
                                LOGIN ACCESS
                            </Link>
                        </div>
                    </div>

                    {/* Right Image Content */}
                    <div className="lg:w-1/2 relative">
                        <div className="relative z-10 p-4 bg-white rounded-[3rem] shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700 overflow-hidden">
                            <img 
                                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000" 
                                alt="Pristine Forest Path" 
                                className="rounded-[2.5rem] w-full h-[500px] object-cover"
                            />
                            
                            {/* Eco Badge inside image */}
                            <div className="absolute bottom-8 left-8 flex flex-col gap-2">
                                <div className="p-3 bg-black/40 backdrop-blur-md rounded-xl w-fit">
                                    <Leaf size={24} className="text-white" fill="white" />
                                </div>
                                <span className="text-white font-black text-[10px] tracking-[0.2em] uppercase">ECO-SYNC ACTIVE</span>
                            </div>
                        </div>
                        
                        {/* Decorative background circle */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#52B788]/20 rounded-full blur-3xl -z-10" />
                    </div>
                </div>
            </section>

            <WasteAnalyzer />

            {/* Features Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
                    <h2 className="text-4xl lg:text-5xl font-black font-['Playfair+Display'] tracking-tighter uppercase mb-6">
                        Core <span className="text-[var(--accent-green)]">Features</span>
                    </h2>
                    <p className="text-[var(--text-muted)] max-w-2xl mx-auto font-black uppercase tracking-widest text-xs">Simple tools for a more efficient cleanup process.</p>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className={`p-10 rounded-[2.5rem] leaf-card hover:translate-y-[-10px] transition-all duration-700 transform group overflow-hidden ${f.glow}`}>
                            <div className="w-16 h-16 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center border border-[var(--border-color)] mb-8 group-hover:bg-[var(--accent-green)] group-hover:text-white transition-all duration-500">
                                {cloneElement(f.icon, { size: 32 })}
                            </div>
                            <h3 className="text-lg font-black tracking-tight mb-4 uppercase text-[var(--text-primary)]">{f.title}</h3>
                            <p className="text-[var(--text-muted)] text-sm leading-relaxed font-medium group-hover:text-[var(--text-primary)] transition-colors">{f.desc}</p>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--accent-green)]/5 rounded-full blur-2xl group-hover:bg-[var(--accent-green)]/10 transition-colors" />
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative p-12 lg:p-24 rounded-[4rem] text-white text-center overflow-hidden group shadow-2xl shadow-[var(--accent-green)]/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-green)] via-[var(--accent-leaf)] to-[var(--accent-earth)] opacity-90 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <div className="relative z-10 space-y-10">
                            <Sparkles className="mx-auto text-yellow-300 animate-pulse" size={48} />
                            <h2 className="text-4xl lg:text-7xl font-black font-['Playfair+Display'] tracking-tighter uppercase leading-none italic">
                                CLEAN THE <br /> FUTURE
                            </h2>
                            <p className="text-xl text-white/80 max-w-2xl mx-auto font-black uppercase tracking-widest text-xs italic">
                                Join our network of active citizens and help keep our planet clean.
                            </p>
                            <div className="flex justify-center">
                                <Link to="/signup" className="px-14 py-6 bg-white text-[var(--accent-green)] font-black rounded-3xl hover:scale-110 transition-all shadow-2xl tracking-[0.2em] text-sm group uppercase">
                                    Join Now <ArrowRight className="inline-block ml-3 group-hover:translate-x-2 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <footer className="py-20 text-center border-t border-[var(--border-color)] mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-10 text-[var(--text-muted)]">
                    <div className="flex items-center space-x-3">
                        <Leaf className="text-[var(--accent-green)]" size={24} />
                        <span className="font-black tracking-widest text-lg uppercase text-[var(--text-primary)]">CLEANPULSE</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em]">&copy; 2026 CLEANPULSE TEAM. CLEANER FUTURE TOGETHER.</p>
                    <div className="flex items-center space-x-6">
                        <Globe size={20} className="hover:text-[var(--accent-green)] cursor-pointer" />
                        <Shield size={20} className="hover:text-[var(--accent-green)] cursor-pointer" />
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
