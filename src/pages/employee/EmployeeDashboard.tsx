import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const EmployeeDashboard = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const stats = [
    { label: 'Today Earnings', value: '$50.00', change: '+2.5%' },
    { label: 'Weekly Total', value: '$400.00', change: '+5.0%' },
    { label: 'Monthly YTD', value: '$1,600.00', change: '+8.2%' },
    { label: 'Yield Generated', value: '$120.50', change: '+12.5%' },
  ];

  const transactions = [
    { type: 'Hourly Payment', amount: '+$50.00', time: '2 hours ago', status: 'completed' },
    { type: 'Yield Distribution', amount: '+$25.00', time: '1 day ago', status: 'completed' },
    { type: 'Payroll Deposit', amount: '+$400.00', time: '3 days ago', status: 'completed' },
  ];

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isDark ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome back, {user?.username}
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Here's your earning summary for today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`p-6 rounded-lg border transition-all group hover:scale-105 ${
                isDark
                  ? 'bg-blue-900/20 border-blue-500/30 hover:border-cyan-500/50'
                  : 'bg-white border-gray-200 hover:shadow-lg'
              }`}
            >
              <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </p>
              <p className={`text-3xl font-bold mb-2 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                {stat.value}
              </p>
              <div className={`flex items-center gap-1 text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                <ArrowUpRight size={16} /> {stat.change}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className={`lg:col-span-2 p-6 rounded-lg border ${isDark ? 'bg-blue-900/20 border-blue-500/30' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recent Transactions
            </h2>
            <div className="space-y-4">
              {transactions.map((tx, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg flex justify-between items-center ${
                    isDark
                      ? 'bg-slate-800/50'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-cyan-500/20' : 'bg-blue-100'}`}>
                      {tx.type.includes('Hourly') ? (
                        <ArrowDownLeft className={isDark ? 'text-cyan-400' : 'text-blue-600'} size={20} />
                      ) : (
                        <ArrowUpRight className={`text-green-500`} size={20} />
                      )}
                    </div>
                    <div>
                      <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {tx.type}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {tx.time}
                      </p>
                    </div>
                  </div>
                  <p className={`font-semibold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    {tx.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`p-6 rounded-lg border ${isDark ? 'bg-blue-900/20 border-blue-500/30' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className={`w-full py-2 rounded-lg font-semibold transition-all ${
                isDark
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'
                  : 'bg-blue-100 text-blue-600 border border-blue-300 hover:bg-blue-200'
              }`}>
                View Earnings
              </button>
              <button className={`w-full py-2 rounded-lg font-semibold transition-all ${
                isDark
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'
                  : 'bg-blue-100 text-blue-600 border border-blue-300 hover:bg-blue-200'
              }`}>
                View History
              </button>
              <button className={`w-full py-2 rounded-lg font-semibold transition-all ${
                isDark
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'
                  : 'bg-blue-100 text-blue-600 border border-blue-300 hover:bg-blue-200'
              }`}>
                Settings
              </button>
              <button className={`w-full py-2 rounded-lg font-semibold transition-all ${
                isDark
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'
                  : 'bg-blue-100 text-blue-600 border border-blue-300 hover:bg-blue-200'
              }`}>
                Help & Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
