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
        <div className="min-h-screen pt-24 font-sans text-[var(--text-primary)]">
            {/* Nature Hero Section */}
            <section className="relative py-28 overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 w-2/3 h-full bg-[var(--accent-green)]/5 rounded-l-[200px] blur-[100px]" />
                <div className="absolute bottom-0 left-0 -z-10 w-1/2 h-1/2 bg-[var(--accent-leaf)]/5 rounded-full blur-[120px]" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2 space-y-10 animate-slide-up relative z-10 text-center lg:text-left">
                        <div className="inline-flex items-center space-x-3 px-5 py-2.5 bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20 text-[var(--accent-green)] rounded-full text-xs font-black uppercase tracking-[0.2em]">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-leaf)] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--accent-green)]"></span>
                            </span>
                            <span>Keep it Clean</span>
                        </div>
                        
                        <h1 className="text-6xl lg:text-8xl font-black font-['Playfair+Display'] leading-none tracking-tighter uppercase">
                            CLEAN <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-leaf)] animate-gradient inline-block">
                                PULSE
                            </span>
                        </h1>
                        
                        <p className="text-xl text-[var(--text-muted)] max-w-lg leading-relaxed font-medium">
                            A smart platform for a cleaner city, connecting citizens and collectors to maintain a healthy environment.
                        </p>
                        
                        <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                            <Link to="/signup" className="eco-button flex items-center space-x-3 px-12 py-5 text-sm uppercase tracking-widest shadow-2xl">
                                <span>GET STARTED</span>
                                <ArrowRight size={20} />
                            </Link>
                            <Link to="/login" className="px-10 py-5 border border-[var(--border-color)] text-[var(--accent-green)] font-black rounded-2xl hover:bg-[var(--accent-green)]/5 transition-all text-xs tracking-widest uppercase">
                                Login Access
                            </Link>
                        </div>

                        <div className="flex items-center space-x-6 pt-10 border-t border-[var(--border-color)] justify-center lg:justify-start">
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[var(--bg-primary)] bg-[var(--bg-secondary)] flex items-center justify-center overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=nature-${i}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-[var(--text-muted)] text-xs font-black uppercase tracking-widest">
                                <span className="text-[var(--accent-green)]">50,000+</span> Active Users
                            </p>
                        </div>
                    </div>

                    <div className="lg:w-1/2 mt-20 lg:mt-0 relative group flex justify-center">
                        <div className="absolute -top-10 -left-10 w-64 h-64 bg-[var(--accent-green)]/10 rounded-full blur-[100px] animate-pulse" />
                        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[var(--accent-leaf)]/10 rounded-full blur-[100px] animate-pulse" />
                        
                        <div className="relative leaf-card p-4 rounded-[4rem] group-hover:scale-[1.02] transition-transform duration-700 -rotate-3 border-4 border-[var(--bg-card)]">
                            <img 
                                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000" 
                                alt="Pristine Forest Environment" 
                                className="rounded-[3rem] shadow-2xl relative z-10 w-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/40 via-transparent to-transparent opacity-60 rounded-[3rem] z-10" />
                            
                            <div className="absolute bottom-10 left-10 z-20 space-y-2">
                                <div className="p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl w-fit">
                                    <Leaf size={24} className="text-white fill-white" />
                                </div>
                                <p className="text-white font-black text-xs tracking-widest uppercase shadow-sm">Eco-Sync Active</p>
                            </div>
                        </div>
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
