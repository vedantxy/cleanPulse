import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, Leaf, Shield } from 'lucide-react';
import NatureBackground from '../components/NatureBackground';

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
            const data = await signup(formData);
            const role = data.user?.role || 'citizen';
            
            if (role === 'admin') navigate('/admin');
            else if (role === 'collector') navigate('/collector');
            else navigate('/citizen');
        } catch (err) {
            console.error('Signup Error:', err);
            let message = 'Signup failed. Please check your connection.';
            if (err.code === 'auth/email-already-in-use') message = 'This email is already registered.';
            else if (err.code === 'auth/weak-password') message = 'Password is too weak. Use at least 6 characters.';
            else if (err.code === 'auth/invalid-email') message = 'Invalid email format.';
            else if (err.code === 'auth/operation-not-allowed') message = 'Email/Password auth is not enabled in Firebase. Please contact support.';
            else if (err.response?.data?.message) message = err.response.data.message;
            else if (err.message) message = err.message;
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[var(--bg-primary)]">
            <NatureBackground />
            
            <div className="max-w-4xl w-full animate-slide-up relative z-10">
                <div className="bg-white p-4 rounded-[4rem] shadow-2xl transform transition-all duration-700">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-12 rounded-[3.5rem] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[var(--accent-green)]/5 to-transparent" />
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 relative">
                            <div className="space-y-2">
                                <h2 className="text-5xl font-black tracking-tighter text-[var(--accent-green)] font-['Playfair_Display']">Join Us</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Become a Guardian of the Ecosystem</p>
                            </div>
                            <div className="flex -space-x-4">
                                <div className="w-16 h-16 bg-[var(--accent-green)] rounded-2xl flex items-center justify-center text-white shadow-xl rotate-[-10deg] hover:rotate-0 transition-transform">
                                    <Leaf size={32} fill="white" />
                                </div>
                                <div className="w-16 h-16 bg-[var(--accent-leaf)] rounded-2xl flex items-center justify-center text-white shadow-xl rotate-[10deg] hover:rotate-0 transition-transform">
                                    <Shield size={32} fill="white" />
                                </div>
                            </div>
                        </div>

                        <form className="space-y-12" onSubmit={onSubmit}>
                            {error && (
                                <div className="bg-rose-500/10 text-rose-600 p-5 rounded-2xl text-[11px] font-bold border border-rose-500/20 text-center uppercase tracking-widest animate-shake">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                {/* Name Input */}
                                <div className="group space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)]/60 ml-1">Full Identity</label>
                                    <div className="relative">
                                        <User className="absolute top-1/2 -translate-y-1/2 left-5 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" />
                                        <input
                                            name="name"
                                            type="text"
                                            required
                                            className="earth-input pl-14 h-14"
                                            placeholder="Your Name"
                                            value={formData.name}
                                            onChange={onChange}
                                        />
                                    </div>
                                </div>

                                {/* Email Input */}
                                <div className="group space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)]/60 ml-1">Email Link</label>
                                    <div className="relative">
                                        <Mail className="absolute top-1/2 -translate-y-1/2 left-5 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" />
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            className="earth-input pl-14 h-14"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={onChange}
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="group space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)]/60 ml-1">Secure Key</label>
                                    <div className="relative">
                                        <Lock className="absolute top-1/2 -translate-y-1/2 left-5 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" />
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            minLength="8"
                                            className="earth-input pl-14 h-14"
                                            placeholder="8+ characters"
                                            value={formData.password}
                                            onChange={onChange}
                                        />
                                    </div>
                                </div>

                                {/* Phone Input */}
                                <div className="group space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)]/60 ml-1">Comms Number</label>
                                    <div className="relative">
                                        <Phone className="absolute top-1/2 -translate-y-1/2 left-5 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" />
                                        <input
                                            name="phone"
                                            type="text"
                                            required
                                            className="earth-input pl-14 h-14"
                                            placeholder="+XX XXXXXXXXXX"
                                            value={formData.phone}
                                            onChange={onChange}
                                        />
                                    </div>
                                </div>

                                {/* Zone Select */}
                                <div className="group space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)]/60 ml-1">Operational Zone</label>
                                    <div className="relative">
                                        <MapPin className="absolute top-1/2 -translate-y-1/2 left-5 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" />
                                        <select
                                            name="zone"
                                            required
                                            className="earth-input pl-14 h-14 appearance-none cursor-pointer uppercase text-[10px] tracking-[0.2em]"
                                            value={formData.zone}
                                            onChange={onChange}
                                        >
                                            <option value="">SCANNING REGIONS...</option>
                                            <option value="Alpha">ALPHA SECTOR</option>
                                            <option value="Beta">BETA SECTOR</option>
                                            <option value="Gamma">GAMMA SECTOR</option>
                                            <option value="Delta">DELTA SECTOR</option>
                                            <option value="Epsilon">EPSILON SECTOR</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Role Select */}
                                <div className="group space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)]/60 ml-1">Guardian Role</label>
                                    <div className="relative">
                                        <Shield className="absolute top-1/2 -translate-y-1/2 left-5 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" />
                                        <select
                                            name="role"
                                            required
                                            className="earth-input pl-14 h-14 appearance-none cursor-pointer uppercase text-[10px] tracking-[0.2em]"
                                            value={formData.role}
                                            onChange={onChange}
                                        >
                                            <option value="citizen">CITIZEN</option>
                                            <option value="collector">COLLECTOR</option>
                                            <option value="admin">ADMIN</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="eco-button w-full h-18 group"
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span className="text-sm tracking-[0.4em] font-black">INITIALIZE ACCOUNT</span>
                                            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-500" />
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="text-center pt-8 border-t border-[var(--border-color)]">
                                <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em]">
                                    Already Registered? {' '}
                                    <Link to="/login" className="text-[var(--accent-green)] hover:text-[var(--accent-leaf)] underline underline-offset-8">
                                        GO TO LOGIN
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
