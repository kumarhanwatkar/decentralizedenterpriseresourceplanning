import { Home, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useTheme } from '@/context/ThemeContext';

const NotFound = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900' : 'bg-gray-50'}`}>
      <Navbar />

      <div className="flex flex-col items-center justify-center py-20 px-4">
        <AlertCircle className={`w-24 h-24 mb-6 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`} />
        <h1 className={`text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          404
        </h1>
        <p className={`text-2xl font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Page Not Found
        </p>
        <p className={`text-lg mb-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
            isDark
              ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-600 hover:to-indigo-700'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
          }`}
        >
          <Home size={20} /> Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
