import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Trophy, User, LogOut, Leaf, Share2 } from 'lucide-react';

import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    const role = user?.role;
    const links = [
      { 
        name: 'DASHBOARD', 
        path: role === 'admin' ? '/admin' : role === 'collector' ? '/collector' : '/citizen', 
        icon: <LayoutDashboard size={18} /> 
      },
      { 
        name: 'ECOSYSTEM', 
        path: '/ecosystem', 
        icon: <Share2 size={18} /> 
      },
    ];

    if (role === 'citizen') {
      links.push(
        { name: 'REPORTS', path: '/citizen/reports', icon: <FileText size={18} /> },
        { name: 'LEADERBOARD', path: '/leaderboard', icon: <Trophy size={18} /> },
        { name: 'PROFILE', path: '/citizen/profile', icon: <User size={18} /> }
      );
    } else if (role === 'collector') {
      links.push(
        { name: 'PICKUPS', path: '/collector/pickups', icon: <FileText size={18} /> },
        { name: 'PROFILE', path: '/collector/profile', icon: <User size={18} /> }
      );
    } else if (role === 'admin') {
      links.push(
        { name: 'REPORTS', path: '/admin/reports', icon: <FileText size={18} /> },
        { name: 'USERS', path: '/admin/users', icon: <User size={18} /> }
      );
    }

    return links;
  };

  const navLinks = getNavLinks();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-md px-8 py-4 flex justify-between items-center border-b border-[var(--border-color)] transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[var(--accent-green)] rounded-xl text-white shadow-lg shadow-[var(--accent-green)]/20">
          <Leaf size={24} fill="white" />
        </div>
        <Link to="/" className="text-2xl font-black text-[var(--accent-green)] tracking-widest uppercase font-['Playfair_Display']">
          CLEANPULSE
        </Link>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`flex items-center gap-2 text-[10px] font-black tracking-[0.2em] transition-colors hover:text-[var(--accent-leaf)] ${
                location.pathname === link.path ? 'text-[var(--accent-green)]' : 'text-[var(--text-muted)]'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6 border-l border-[var(--border-color)] pl-8">
          <NotificationBell />
          <ThemeToggle />
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-rose-500 hover:text-rose-600 text-[10px] font-black tracking-[0.2em] transition-all"
          >
            <LogOut size={18} />
            EXIT
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
