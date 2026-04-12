import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const LoginPage = () => {
  const { isDark } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: 'admin@erp.com',
    password: 'password123',
  });

  const handleChange = (e: any) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate login
      const user = {
        id: '1',
        username: 'Admin User',
        email: credentials.email,
        role: credentials.email === 'admin@erp.com' ? 'admin' : 'employee',
        wallet: '0x' + Math.random().toString(16).substring(2, 42),
      };
      login(user);
      navigate(user.role === 'admin' ? '/admin' : '/employee');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900' : 'bg-gray-50'}`}>
      <Navbar />

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-3xl">D</span>
            </div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              D-ERP Login
            </h1>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className={`p-8 rounded-lg border ${
              isDark
                ? 'bg-blue-900/20 border-blue-500/30'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border transition-all ${
                    isDark
                      ? 'bg-slate-800 border-blue-500/30 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  }`}
                  placeholder="admin@erp.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg border transition-all ${
                    isDark
                      ? 'bg-slate-800 border-blue-500/30 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  }`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Demo Info */}
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              isDark
                ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
                : 'bg-blue-50 border border-blue-200 text-blue-700'
            }`}>
              Demo credentials:<br/>
              <strong>Admin:</strong> admin@erp.com / password123<br/>
              <strong>Employee:</strong> emp@erp.com / password123
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-600 hover:to-indigo-700 disabled:opacity-50'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50'
              }`}
            >
              <Wallet size={20} /> {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <p className={`text-center mt-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <a href="#" className={isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'}>
              Request access
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
