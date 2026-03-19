import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, FileText, Award, Leaf, Trophy, Truck, Users, Activity } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-card)]/70 backdrop-blur-xl border-b border-[var(--border-color)] transition-all duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="bg-gradient-to-tr from-[var(--accent-green)] to-[var(--accent-leaf)] p-2.5 rounded-2xl text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                            <Leaf size={24} />
                        </div>
                        <span className="text-2xl font-black text-[var(--text-primary)] tracking-tighter transition-colors font-['Playfair+Display'] uppercase">
                            CLEAN<span className="text-[var(--accent-green)]">PULSE</span>
                        </span>
                    </Link>

                    <div className="flex items-center space-x-6">
                        <ThemeToggle />
                        
                        {!user ? (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-[var(--text-muted)] hover:text-[var(--accent-green)] font-black text-xs uppercase tracking-widest transition-colors">Login</Link>
                                <Link to="/signup" className="eco-button py-2 px-6 text-xs tracking-widest uppercase">Sign Up</Link>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-8">
                                <Link to="/dashboard" className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-[var(--accent-green)] font-black text-xs uppercase tracking-widest transition-colors">
                                    <UserIcon size={18} />
                                    <span>Dashboard</span>
                                </Link>
                                
                                {user.role === 'citizen' && (
                                    <>
                                        <Link to="/citizen/my-reports" className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-[var(--accent-green)] font-black text-xs uppercase tracking-widest transition-colors">
                                            <FileText size={18} />
                                            <span>Reports</span>
                                        </Link>
                                        <Link to="/citizen/leaderboard" className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-[var(--accent-green)] font-black text-xs uppercase tracking-widest transition-colors">
                                            <Trophy size={18} />
                                            <span>Leaderboard</span>
                                        </Link>
                                        <Link to="/citizen/profile" className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-[var(--accent-green)] font-black text-xs uppercase tracking-widest transition-colors">
                                            <Award size={18} />
                                            <span>Profile</span>
                                        </Link>
                                    </>
                                )}

                                {user.role === 'collector' && (
                                    <>
                                        <Link to="/collector/pickups" className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-[var(--accent-green)] font-black text-xs uppercase tracking-widest transition-colors">
                                            <Truck size={18} />
                                            <span>Pickups</span>
                                        </Link>
                                        <Link to="/collector/profile" className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-[var(--accent-green)] font-black text-xs uppercase tracking-widest transition-colors">
                                            <Award size={18} />
                                            <span>Profile</span>
                                        </Link>
                                    </>
                                )}

                                {user.role === 'admin' && (
                                    <>
                                        <Link to="/admin/reports" className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-[var(--accent-green)] font-black text-xs uppercase tracking-widest transition-colors">
                                            <Activity size={18} />
                                            <span>Reports</span>
                                        </Link>
                                        <Link to="/admin/users" className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-[var(--accent-green)] font-black text-xs uppercase tracking-widest transition-colors">
                                            <Users size={18} />
                                            <span>Users</span>
                                        </Link>
                                    </>
                                )}

                                <button 
                                    onClick={logout}
                                    className="flex items-center space-x-1 text-rose-500 hover:text-rose-600 font-black text-xs uppercase tracking-widest transition-colors"
                                >
                                    <LogOut size={18} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
