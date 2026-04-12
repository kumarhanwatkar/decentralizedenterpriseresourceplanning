import { ArrowRight, Users, Zap, Gauge, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const LandingPage = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const features = [
    {
      icon: Zap,
      title: 'Real-time Payroll',
      description: 'Hourly stablecoin streaming with zero delay. Get paid instantly as you work.',
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Manage employees, roles, and departments with ease.',
    },
    {
      icon: Gauge,
      title: 'Resource Optimization',
      description: 'Track and allocate resources efficiently across your organization.',
    },
    {
      icon: BarChart3,
      title: 'AI-Powered Analytics',
      description: 'Automatic dashboard generation and intelligent insights.',
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900' : 'bg-white'}`}>
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-block">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              isDark
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-blue-100 text-blue-600 border border-blue-200'
            }`}>
              🚀 Welcome to the Future of Work
            </span>
          </div>

          <h1 className={`text-5xl md:text-6xl font-bold mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Decentralized Payroll for the <span className={isDark ? 'text-cyan-400' : 'text-blue-600'}>Web3 Workforce</span>
          </h1>

          <p className={`text-xl mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Stream hourly stablecoins, split compensation into liquid and yield-generating capital, and manage your enterprise with AI-powered intelligence.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to={user ? (user.role === 'admin' ? '/admin' : '/employee') : '/login'}
              className={`inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold transition-all gap-2 group ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-600 hover:to-indigo-700'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              {user ? 'Go to Dashboard' : 'Get Started'} <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <a
              href="/about"
              className={`inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold transition-all border ${
                isDark
                  ? 'border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10'
                  : 'border-blue-600 text-blue-600 hover:bg-blue-50'
              }`}
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
          {[
            { label: 'Zero Payroll Delay', value: '24/7' },
            { label: 'Employees Supported', value: '10+' },
            { label: 'Resources Tracked', value: '5+' },
            { label: 'System Uptime', value: '99.9%' },
          ].map((metric, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border text-center ${
                isDark
                  ? 'bg-blue-900/20 border-blue-500/30'
                  : 'bg-gray-100 border-gray-300'
              }`}
            >
              <div className={`text-2xl font-bold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                {metric.value}
              </div>
              <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${isDark ? 'border-blue-900/30' : 'border-gray-200'}`}>
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`p-6 rounded-lg border transition-all group hover:scale-105 ${
                  isDark
                    ? 'bg-blue-900/20 border-blue-500/30 hover:border-cyan-500/50'
                    : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg'
                }`}
              >
                <feature.icon className={`w-10 h-10 mb-4 transition-all ${isDark ? 'text-cyan-400 group-hover:scale-110' : 'text-blue-600 group-hover:scale-110'}`} />
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${isDark ? 'border-blue-900/30 bg-blue-900/10' : 'border-gray-200 bg-gray-50'}`}>
        <div className="max-w-5xl mx-auto">
          <h2 className={`text-4xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Connect Wallet', desc: 'Securely connect your crypto wallet' },
              { step: '2', title: 'Set Up Organization', desc: 'Define your employees and resources' },
              { step: '3', title: 'Start Streaming', desc: 'Enable real-time hourly payroll' },
              { step: '4', title: 'Earn Yield', desc: 'Automatic capital optimization' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-3 mx-auto ${
                  isDark
                    ? 'bg-gradient-to-br from-cyan-500 to-indigo-600 text-white'
                    : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white'
                }`}>
                  {item.step}
                </div>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 text-center ${isDark ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
        <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Ready to Get Started?
        </h2>
        <p className={`text-xl mb-8 max-w-2xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Join organizations transforming payroll and resource management with blockchain technology.
        </p>
        <Link
          to="/login"
          className={`inline-flex items-center justify-center px-8 py-3 rounded-lg font-semibold transition-all gap-2 ${
            isDark
              ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-600 hover:to-indigo-700'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
          }`}
        >
          Launch Dashboard <ArrowRight size={20} />
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
