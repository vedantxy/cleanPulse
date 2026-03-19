import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, Leaf } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        zone: '',
        role: 'citizen'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await signup(formData);
            navigate('/dashboard');
        } catch (err) {
            console.error('Signup Error:', err);
            let message = 'Signup failed. Please check your connection.';
            if (err.code === 'auth/email-already-in-use') message = 'This email is already registered.';
            else if (err.code === 'auth/weak-password') message = 'Password is too weak. Use at least 6 characters.';
            else if (err.code === 'auth/invalid-email') message = 'Invalid email format.';
            else if (err.code === 'auth/operation-not-allowed') message = 'Email/Password auth is not enabled in Firebase. Please contact support.';
            else if (err.response?.data?.message) message = err.response.data.message;
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-[var(--text-primary)]">
            <div className="max-w-2xl w-full animate-slide-up relative z-10">
                <div className="leaf-card relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[var(--accent-green)]/30" />

                    <div className="flex flex-col md:flex-row items-center justify-between mb-12 pb-10 border-b border-[var(--border-color)]">
                        <div className="text-center md:text-left mb-8 md:mb-0">
                            <h2 className="text-4xl font-black tracking-tighter font-['Playfair+Display'] uppercase text-[var(--text-primary)]">Sign Up</h2>
                            <p className="mt-2 text-[var(--text-muted)] font-black uppercase tracking-[0.2em] text-[10px] italic">Join our network for a cleaner environment</p>
                        </div>
                        <div className="w-20 h-20 bg-[var(--accent-green)]/10 text-[var(--accent-green)] rounded-3xl flex items-center justify-center border border-[var(--accent-green)]/20">
                            <Leaf size={40} />
                        </div>
                    </div>

                    <form className="space-y-10" onSubmit={onSubmit}>
                        {error && (
                            <div className="bg-rose-500/10 text-rose-600 dark:text-rose-400 p-5 rounded-2xl text-xs font-bold border border-rose-500/20 text-center animate-shake uppercase tracking-widest">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                            <div className="space-y-3 group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)] ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute top-1/2 -translate-y-1/2 left-5 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" />
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        className="earth-input pl-14 font-bold tracking-widest text-[11px]"
                                        placeholder="Your Full Name"
                                        value={formData.name}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)] ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute top-1/2 -translate-y-1/2 left-5 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="username"
                                        className="earth-input pl-14 font-bold tracking-widest text-[11px]"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)] ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute top-1/2 -translate-y-1/2 left-5 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        minLength="8"
                                        autoComplete="new-password"
                                        className="earth-input pl-14 font-bold tracking-widest text-[11px]"
                                        placeholder="8+ characters"
                                        value={formData.password}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)] ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute top-1/2 -translate-y-1/2 left-5 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" />
                                    <input
                                        name="phone"
                                        type="text"
                                        required
                                        autoComplete="tel"
                                        className="earth-input pl-14 font-bold tracking-widest text-[11px]"
                                        placeholder="+91 XXXXX XXXXX"
                                        value={formData.phone}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)] ml-1">Zone Selection</label>
                                <div className="relative">
                                    <MapPin className="absolute top-1/2 -translate-y-1/2 left-5 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" />
                                    <select
                                        name="zone"
                                        required
                                        className="earth-input pl-14 appearance-none font-bold uppercase tracking-widest text-[10px]"
                                        value={formData.zone}
                                        onChange={onChange}
                                    >
                                        <option value="">SELECT ZONE...</option>
                                        <option value="Alpha">ALPHA REGION</option>
                                        <option value="Beta">BETA REGION</option>
                                        <option value="Gamma">GAMMA REGION</option>
                                        <option value="Delta">DELTA REGION</option>
                                        <option value="Epsilon">EPSILON REGION</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
                                        <ArrowRight size={14} className="rotate-90" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)] ml-1">Account Role</label>
                                <div className="relative">
                                    <User className="absolute top-1/2 -translate-y-1/2 left-5 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" />
                                    <select
                                        name="role"
                                        required
                                        className="earth-input pl-14 appearance-none font-bold uppercase tracking-widest text-[10px]"
                                        value={formData.role}
                                        onChange={onChange}
                                    >
                                        <option value="citizen">CITIZEN</option>
                                        <option value="collector">COLLECTOR</option>
                                        <option value="admin">ADMIN</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
                                        <ArrowRight size={14} className="rotate-90" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="eco-button w-full flex items-center justify-center gap-4 py-6"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="text-xs tracking-[0.3em] font-black uppercase">Create Account</span>
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-500" />
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="text-center pt-8 border-t border-[var(--border-color)]">
                            <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em]">
                                Already have an account? {' '}
                                <Link to="/login" className="text-[var(--accent-green)] font-black underline decoration-2 underline-offset-8 decoration-[var(--accent-green)]/20 hover:decoration-[var(--accent-green)] transition-all">
                                    LOGIN HERE
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
