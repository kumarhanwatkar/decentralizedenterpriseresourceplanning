import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/#features' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    ...(user ? [{ label: 'Dashboard', href: user.role === 'admin' ? '/admin' : '/employee' }] : []),
  ];

  const isActive = (href: string) => location.pathname === href || location.pathname.startsWith(href);

  return (
    <nav className={`sticky top-0 z-50 border-b ${isDark ? 'bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 border-blue-900/30' : 'bg-white border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className={`font-bold text-xl hidden sm:inline ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
              D-ERP
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? isDark
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-blue-100 text-blue-600'
                    : isDark
                    ? 'text-gray-300 hover:text-cyan-400 hover:bg-blue-900/30'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all ${
                isDark
                  ? 'bg-blue-900/30 text-cyan-400 hover:bg-blue-900/50'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User menu */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className={`text-sm hidden sm:block ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-xs">{user.role}</p>
                </div>
                <button
                  onClick={logout}
                  className={`px-3 py-1 text-sm rounded-md transition-all ${
                    isDark
                      ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-3 py-1 text-sm rounded-md transition-all ${
                  isDark
                    ? 'bg-cyan-500 text-white hover:bg-cyan-600'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className={`md:hidden pb-4 space-y-2 ${isDark ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all ${
                  isActive(link.href)
                    ? isDark
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'bg-blue-100 text-blue-600'
                    : isDark
                    ? 'text-gray-300 hover:text-cyan-400'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
