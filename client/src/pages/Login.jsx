import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Sparkles, Leaf } from 'lucide-react';

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
            await login(credentials.email, credentials.password);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login Error:', err);
            let message = 'Login failed. Please check your connection.';
            if (err.code === 'auth/user-not-found') message = 'No account found with this email.';
            else if (err.code === 'auth/wrong-password') message = 'Incorrect password. Please try again.';
            else if (err.code === 'auth/invalid-email') message = 'Invalid email format.';
            else if (err.code === 'auth/user-disabled') message = 'This account has been disabled.';
            else if (err.code === 'auth/operation-not-allowed') message = 'Email/Password auth is not enabled in Firebase. Please contact support.';
            else if (err.response?.data?.message) message = err.response.data.message;
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-[var(--text-primary)]">
            <div className="max-w-md w-full animate-slide-up relative z-10">
                <div className="leaf-card relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-leaf)]/10 rounded-full blur-3xl -mr-16 -mt-16" />
                    
                    <div className="mb-12 text-center">
                        <div className="relative inline-block group mb-8">
                            <div className="w-20 h-20 bg-gradient-to-tr from-[var(--accent-green)] to-[var(--accent-leaf)] rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl group-hover:scale-110 transition-transform duration-500">
                                <Leaf size={40} />
                            </div>
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter font-['Playfair+Display'] uppercase text-[var(--text-primary)]">Welcome Back</h2>
                        <p className="mt-2 text-[var(--text-muted)] font-black uppercase tracking-[0.2em] text-[10px] italic">Sign in to your account</p>
                    </div>

                    <form className="space-y-8" onSubmit={onSubmit}>
                        {error && (
                            <div className="bg-rose-500/10 text-rose-600 dark:text-rose-400 p-5 rounded-2xl text-xs font-bold border border-rose-500/20 flex items-center justify-center animate-shake uppercase tracking-widest">
                                {error}
                            </div>
                        )}
                        
                        <div className="space-y-6">
                            <div className="relative group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)] ml-1 mb-2 block">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute top-1/2 -translate-y-1/2 left-5 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="username"
                                        className="earth-input pl-14 font-bold tracking-widest text-[11px]"
                                        placeholder="your@email.com"
                                        value={credentials.email}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent-green)] ml-1 mb-2 block">Password</label>
                                <div className="relative">
                                    <Lock className="absolute top-1/2 -translate-y-1/2 left-5 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--accent-green)] transition-colors" />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        className="earth-input pl-14 font-bold tracking-widest text-[11px]"
                                        placeholder="Your Password"
                                        value={credentials.password}
                                        onChange={onChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] py-1 font-black uppercase tracking-widest">
                            <label className="flex items-center text-[var(--text-muted)] cursor-pointer group">
                                <input type="checkbox" className="peer hidden" />
                                <div className="w-5 h-5 border-2 border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center peer-checked:bg-[var(--accent-green)] peer-checked:border-[var(--accent-green)] transition-all mr-3">
                                    <Sparkles size={10} className="text-white opacity-0 peer-checked:opacity-100" />
                                </div>
                                <span className="group-hover:text-[var(--text-primary)] transition-colors">Remember Me</span>
                            </label>
                            <a href="#" className="text-[var(--accent-green)] hover:underline decoration-[var(--accent-green)] transition-all">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="eco-button w-full flex items-center justify-center gap-4 py-5"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span className="text-xs tracking-[0.3em] font-black uppercase">Login</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-500" />
                                </>
                            )}
                        </button>

                        <div className="text-center pt-8 border-t border-[var(--border-color)]">
                            <p className="text-[var(--text-muted)] text-[10px] font-black uppercase tracking-[0.2em]">
                                New user? {' '}
                                <Link to="/signup" className="text-[var(--accent-green)] font-black underline decoration-2 underline-offset-8 decoration-[var(--accent-green)]/20 hover:decoration-[var(--accent-green)] transition-all">
                                    SIGN UP
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
