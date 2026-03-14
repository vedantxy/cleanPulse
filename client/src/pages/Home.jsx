import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, MapPin, Truck, Leaf, ArrowRight } from 'lucide-react';

const Home = () => {
    const features = [
        { icon: <MapPin className="text-emerald-500" />, title: "Live Reporting", desc: "Report garbage issues with photos and real-time location." },
        { icon: <Truck className="text-emerald-500" />, title: "Smart Pickup", desc: "Collectors get optimized routes and instant notifications." },
        { icon: <Shield className="text-emerald-500" />, title: "Admin Portal", desc: "Manage the entire city's waste flow with data analytics." },
        { icon: <Leaf className="text-emerald-500" />, title: "Eco Rewards", desc: "Earn badges and points for helping keep the city clean." }
    ];

    return (
        <div className="min-h-screen pt-16 font-sans">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-emerald-50/50 rounded-l-[100px]" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2 space-y-8 animate-fade-in">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span>Making cities smarter & cleaner</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
                            Smart Waste <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Management</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
                            A centralized platform connecting citizens, collectors, and admins to build a sustainable and waste-free future.
                        </p>
                        <div className="flex space-x-4">
                            <Link to="/signup" className="btn-primary flex items-center space-x-2">
                                <span>Get Started</span>
                                <ArrowRight size={20} />
                            </Link>
                            <Link to="/login" className="px-8 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-all transform hover:scale-105">
                                Login
                            </Link>
                        </div>
                    </div>
                    <div className="lg:w-1/2 mt-16 lg:mt-0 animate-slide-up">
                        <div className="relative">
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl" />
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-400/20 rounded-full blur-3xl" />
                            <img 
                                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=1000" 
                                alt="Modern waste management" 
                                className="rounded-3xl shadow-2xl relative z-10 border border-white/50"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
                    <h2 className="text-4xl font-bold text-slate-900">Why Choose SmartWaste?</h2>
                    <p className="text-slate-600 mt-4 text-lg">Powerful features to streamline waste collection in your city.</p>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-transparent hover:border-emerald-200 hover:bg-white hover:shadow-xl hover:shadow-emerald-50 transition-all duration-300 transform hover:-translate-y-2 group">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Join Us CTA */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-animate p-12 lg:p-20 rounded-[40px] text-white text-center relative overflow-hidden shadow-2xl">
                        <div className="relative z-10">
                            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to make a difference?</h2>
                            <p className="text-xl text-emerald-50 mb-10 max-w-2xl mx-auto font-light">
                                Sign up today and start reporting waste issues in your area. Together we can build a cleaner city.
                            </p>
                            <Link to="/signup" className="px-10 py-4 bg-white text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 transition-all shadow-xl hover:shadow-white/20 transform hover:scale-105">
                                Join Now as Citizen
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            
            <footer className="py-12 text-center text-slate-500 border-t border-slate-100 mt-20">
                <p>&copy; 2025 SmartWaste System. Built for a cleaner future.</p>
            </footer>
        </div>
    );
};

export default Home;
