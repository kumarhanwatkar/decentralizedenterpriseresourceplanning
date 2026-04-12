import { CheckCircle, Zap, Shield, Globe } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useTheme } from '@/context/ThemeContext';

const AboutPage = () => {
  const { isDark } = useTheme();

  const features = [
    {
      icon: Zap,
      title: 'Real-time Payroll',
      description: 'Hourly stablecoin streaming ensures zero payroll delay',
    },
    {
      icon: Globe,
      title: 'Decentralized',
      description: 'Built on Binance Smart Chain for transparency',
    },
    {
      icon: Shield,
      title: 'Secure',
      description: 'Wallet-based authentication with smart contracts',
    },
    {
      icon: CheckCircle,
      title: 'Automated',
      description: 'AI-driven dashboard generation and yield optimization',
    },
  ];

  const stats = [
    { label: 'Total Employees', value: '10+' },
    { label: 'Active Resources', value: '5+' },
    { label: 'Transactions Tracked', value: '100+' },
    { label: 'Uptime', value: '99.9%' },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900' : 'bg-gray-50'}`}>
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className={`text-5xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            About D-ERP
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Revolutionizing Enterprise Resource Planning for the Web3 Era
          </p>
        </div>

        {/* Mission Statement */}
        <div className={`max-w-3xl mx-auto p-8 rounded-lg border mb-16 ${
          isDark
            ? 'bg-blue-900/20 border-blue-500/30'
            : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Our Mission
          </h2>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
            To create a transparent, autonomous, and efficient ERP system that eliminates the inefficiencies of traditional centralized enterprise management. We empower organizations and their workforce by enabling real-time, decentralized compensation with intelligent resource allocation and AI-driven automation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className={`text-3xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Why Choose D-ERP?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`p-6 rounded-lg border ${
                  isDark
                    ? 'bg-blue-900/20 border-blue-500/30 hover:border-cyan-500/50'
                    : 'bg-white border-gray-200 hover:border-blue-400'
                } transition-all group`}
              >
                <feature.icon className={`w-10 h-10 mb-3 transition-all ${isDark ? 'text-cyan-400 group-hover:text-cyan-300' : 'text-blue-600 group-hover:text-blue-700'}`} />
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

        {/* Stats Section */}
        <div className={`max-w-5xl mx-auto p-12 rounded-lg border mb-16 ${
          isDark
            ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-blue-500/30'
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
        }`}>
          <h2 className={`text-2xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            By The Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-3xl font-bold mb-2 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Built With
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'React 18',
              'TypeScript',
              'Vite',
              'Binance Smart Chain',
              'MongoDB',
              'Express.js',
              'Web3.js',
              'Tailwind CSS',
              'Smart Contracts',
            ].map((tech, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg text-center border ${
                  isDark
                    ? 'bg-blue-900/20 border-blue-500/30'
                    : 'bg-white border-gray-200'
                }`}
              >
                <p className={`font-medium ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                  {tech}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 px-4 sm:px-6 lg:px-8 border-t ${isDark ? 'border-blue-900/30 bg-blue-900/10' : 'border-gray-200 bg-gray-100'}`}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Ready to Transform Your Enterprise?
          </h2>
          <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Join organizations worldwide using D-ERP for transparent, efficient operations.
          </p>
          <a
            href="/#"
            className={`inline-block px-8 py-3 rounded-lg font-semibold transition-all ${
              isDark
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-600 hover:to-indigo-700'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
            }`}
          >
            Get Started Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
