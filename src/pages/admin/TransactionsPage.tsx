import { useEffect, useState } from 'react';
import { Clock, RefreshCw, Download } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const TransactionsPage = () => {
  const { isDark } = useTheme();
  const [transactions, setTransactions] = useState([
    {
      id: '1',
      type: 'Payroll',
      employee: 'Alex Johnson',
      amount: '$50.00',
      status: 'completed',
      date: new Date(Date.now() - 3600000),
      hash: '0x1234...5678',
    },
    {
      id: '2',
      type: 'Resource',
      description: 'Server Node 1 allocation',
      amount: '100 hrs',
      status: 'completed',
      date: new Date(Date.now() - 7200000),
      hash: '0x9abc...def0',
    },
    {
      id: '3',
      type: 'Payroll',
      employee: 'Sarah Chen',
      amount: '$55.50',
      status: 'pending',
      date: new Date(Date.now() - 10800000),
      hash: '0xabcd...ef12',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const refreshTransactions = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newTransaction = {
        id: String(transactions.length + 1),
        type: Math.random() > 0.5 ? 'Payroll' : 'Resource',
        employee: Math.random() > 0.5 ? 'Alex Johnson' : 'Sarah Chen',
        amount: Math.random() > 0.5 ? '$50.00' : '$55.50',
        status: 'completed',
        date: new Date(),
        hash: '0x' + Math.random().toString(16).substring(2, 10).toUpperCase() + '...' + Math.random().toString(16).substring(2, 6).toUpperCase(),
      };
      setTransactions([newTransaction, ...transactions]);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(refreshTransactions, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, [transactions]);

  const getStatusColor = (status: string) => {
    if (status === 'completed')
      return isDark ? 'bg-green-900/20 text-green-400 border-green-500/30' : 'bg-green-100 text-green-700 border-green-300';
    if (status === 'pending')
      return isDark ? 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30' : 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return isDark ? 'bg-red-900/20 text-red-400 border-red-500/30' : 'bg-red-100 text-red-700 border-red-300';
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isDark ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Transactions
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Real-time transaction history
            </p>
          </div>

          <button
            onClick={refreshTransactions}
            disabled={loading}
            className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
              isDark
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 disabled:opacity-50'
                : 'bg-blue-100 text-blue-600 border border-blue-300 hover:bg-blue-200 disabled:opacity-50'
            }`}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Transactions', value: transactions.length },
            { label: 'Completed', value: transactions.filter(t => t.status === 'completed').length },
            { label: 'Pending', value: transactions.filter(t => t.status === 'pending').length },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-6 rounded-lg border ${
                isDark
                  ? 'bg-blue-900/20 border-blue-500/30'
                  : 'bg-white border-gray-200'
              }`}
            >
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </p>
              <p className={`text-3xl font-bold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Transactions Table */}
        <div className={`rounded-lg border overflow-hidden ${isDark ? 'bg-blue-900/20 border-blue-500/30' : 'bg-white border-gray-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${isDark ? 'border-blue-500/30 bg-blue-900/30' : 'border-gray-200 bg-gray-50'}`}>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Type
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Details
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Amount
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Status
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Date/Time
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Hash
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr
                    key={tx.id}
                    className={`border-b transition-all hover:${isDark ? 'bg-blue-900/20' : 'bg-gray-50'} ${i === 0 ? (isDark ? 'bg-cyan-500/10' : 'bg-cyan-50') : ''}`}
                  >
                    <td className={`px-6 py-4 text-sm font-medium ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                      {tx.type}
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {tx.employee || tx.description}
                    </td>
                    <td className={`px-6 py-4 text-sm font-semibold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                      {tx.amount}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(tx.status)}`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <Clock size={16} />
                      {tx.date.toLocaleTimeString()}
                    </td>
                    <td className={`px-6 py-4 text-sm font-mono ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                      {tx.hash}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-8 flex justify-center">
          <button
            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
              isDark
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-600 hover:to-indigo-700'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
            }`}
          >
            <Download size={20} /> Export Transactions
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
