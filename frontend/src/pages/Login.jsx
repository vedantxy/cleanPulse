import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Sparkles, Leaf } from 'lucide-react';
import NatureBackground from '../components/NatureBackground';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const onChange = e => setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const data = await login(credentials.email, credentials.password);
            const role = data.user?.role || 'citizen';
            
            if (role === 'admin') navigate('/admin');
            else if (role === 'collector') navigate('/collector');
            else navigate('/citizen');
        } catch (err) {
            console.error('Login Error:', err);
            let message = 'Login failed. Please check your connection.';
            if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') message = 'No account found with these credentials.';
            else if (err.code === 'auth/wrong-password') message = 'Incorrect password. Please try again.';
            else if (err.code === 'auth/invalid-email') message = 'Invalid email format.';
            else if (err.code === 'auth/user-disabled') message = 'This account has been disabled.';
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
            
            <div className="max-w-md w-full animate-slide-up relative z-10">
                <div className="bg-white p-4 rounded-[3.5rem] shadow-2xl transform transition-all duration-700">
                    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-10 rounded-[2.5rem] space-y-10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-bright)]/5 rounded-full blur-3xl -mr-16 -mt-16" />
                        
                        <div className="text-center relative">
                            <div className="w-16 h-16 bg-[var(--accent-green)] rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg mb-6">
                                <Leaf size={32} fill="white" />
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter text-[var(--accent-green)] font-['Playfair_Display']">Welcome</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mt-2">Sign in to your Sanctuary</p>
                        </div>

                        <form className="space-y-8" onSubmit={onSubmit}>
                            {error && (
                                <div className="bg-rose-500/10 text-rose-600 p-4 rounded-xl text-[11px] font-bold border border-rose-500/20 text-center uppercase tracking-widest">
                                    {error}
                                </div>
                            )}
                            
                            <div className="space-y-6">
                                <div className="group">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)]/60 ml-1 mb-2 block">Email Identity</label>
                                    <div className="relative">
                                        <Mail className="absolute top-1/2 -translate-y-1/2 left-5 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" />
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            className="earth-input pl-14 h-14"
                                            placeholder="your@email.com"
                                            value={credentials.email}
                                            onChange={onChange}
                                        />
                                    </div>
                                </div>

                                <div className="group">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)]/60 ml-1 mb-2 block">Secure Key</label>
                                    <div className="relative">
                                        <Lock className="absolute top-1/2 -translate-y-1/2 left-5 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" />
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            className="earth-input pl-14 h-14"
                                            placeholder="••••••••"
                                            value={credentials.password}
                                            onChange={onChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                                <label className="flex items-center text-[var(--text-muted)] cursor-pointer hover:text-[var(--accent-green)] transition-colors">
                                    <input type="checkbox" className="mr-2 accent-[var(--accent-green)]" />
                                    Persistent Access
                                </label>
                                <a href="#" className="text-[var(--accent-green)] hover:underline">Reset Logic</a>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="eco-button w-full h-16 group"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span className="text-xs tracking-[0.3em]">AUTHENTICATE</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="text-center pt-6 border-t border-[var(--border-color)]">
                                <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em]">
                                    Unregistered Citizen?{' '}
                                    <Link to="/signup" className="text-[var(--accent-green)] hover:text-[var(--accent-leaf)] underline underline-offset-4">
                                        JOIN NOW
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

export default Login;
