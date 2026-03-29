import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all duration-300 group relative"
            title={theme === 'light' ? 'Switch to Jungle Night' : 'Switch to Forest Morning'}
        >
            <div className="relative w-5 h-5">
                <div className={`absolute inset-0 transform transition-all duration-500 ${theme === 'dark' ? 'rotate-0 opacity-100 scale-100' : 'rotate-90 opacity-0 scale-0'}`}>
                    <Sun className="text-amber-400 w-5 h-5 fill-amber-400" />
                </div>
                <div className={`absolute inset-0 transform transition-all duration-500 ${theme === 'light' ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-0'}`}>
                    <Moon className="text-slate-600 w-5 h-5 fill-slate-600" />
                </div>
            </div>
            
            {/* Subtle Glow Ring */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--accent-leaf)]/10 blur-xl z-[-1]" />
        </button>
    );
};

export default ThemeToggle;
