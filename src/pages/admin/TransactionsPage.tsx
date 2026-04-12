import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Download,
  Filter,
  Check,
  Clock,
  AlertCircle,
  DollarSign,
  Wallet,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { useOrganization } from '@/context/OrganizationContext';
import { transactionAPI } from '@/services/api';

const TransactionsPage: React.FC = () => {
  const { transactions: mockTransactions } = useOrganization();
  const [transactions, setTransactions] = useState(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load transactions from backend on mount
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionAPI.getAll();
      if (response.data && Array.isArray(response.data)) {
        setTransactions(response.data);
      }
      setError(null);
    } catch (err) {
      console.warn('Failed to load from backend, using mock data:', err);
      setTransactions(mockTransactions);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh transactions every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadTransactions();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = 
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.txHash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || tx.type === filterType;
    const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate stats
  const totalTransactions = transactions.length;
  const confirmedCount = transactions.filter(t => t.status === 'confirmed').length;
  const totalVolume = transactions
    .filter(t => t.status === 'confirmed')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const successRate = totalTransactions > 0 
    ? Math.round((confirmedCount / totalTransactions) * 100)
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-success bg-success/10 border border-success/30';
      case 'pending':
        return 'text-warning bg-warning/10 border border-warning/30';
      case 'failed':
        return 'text-error bg-error/10 border border-error/30';
      default:
        return 'text-muted bg-muted/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Check className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payroll':
        return <DollarSign className="w-4 h-4" />;
      case 'yield':
        return <TrendingUp className="w-4 h-4" />;
      case 'transfer':
        return <Send className="w-4 h-4" />;
      case 'fee':
        return <Wallet className="w-4 h-4" />;
      default:
        return <Wallet className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Transactions</h1>
            <p className="text-text-secondary">Track all blockchain transactions and payments</p>
          </div>
          <button className="button button-primary flex-center">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <GlassCard className="p-6" variant="default">
              <div className="flex align-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-text-tertiary text-sm mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-white">{totalTransactions}</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6" variant="default">
              <div className="flex align-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <Check className="w-6 h-6 text-success" />
                </div>
              </div>
              <p className="text-text-tertiary text-sm mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-white">{successRate}%</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6" variant="default">
              <div className="flex align-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <DollarSign className="w-6 h-6 text-secondary" />
                </div>
              </div>
              <p className="text-text-tertiary text-sm mb-1">Total Volume</p>
              <p className="text-2xl font-bold text-white">${totalVolume.toLocaleString()}</p>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6" variant="default">
              <div className="flex align-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-info/10">
                  <Calendar className="w-6 h-6 text-info" />
                </div>
              </div>
              <p className="text-text-tertiary text-sm mb-1">Confirmed</p>
              <p className="text-2xl font-bold text-white">{confirmedCount}</p>
            </GlassCard>
          </motion.div>
        </div>

        {/* Filters */}
        <GlassCard className="p-4" variant="default">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search by address or hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-bg-input border border-border-color-light text-white placeholder-text-muted focus:outline-none focus:border-primary focus:shadow-lg"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-lg bg-bg-input border border-border-color-light text-white focus:outline-none focus:border-primary focus:shadow-lg"
            >
              <option value="all">All Types</option>
              <option value="payroll">Payroll</option>
              <option value="yield">Yield</option>
              <option value="transfer">Transfer</option>
              <option value="fee">Fee</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg bg-bg-input border border-border-color-light text-white focus:outline-none focus:border-primary focus:shadow-lg"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <button
              onClick={loadTransactions}
              className="button button-secondary w-full"
              disabled={loading}
            >
              <Filter className="w-4 h-4" />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </GlassCard>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Transactions Table */}
        <GlassCard className="overflow-hidden" variant="default">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-color">
                  <th className="text-left p-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">Type</th>
                  <th className="text-left p-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">From</th>
                  <th className="text-left p-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">To</th>
                  <th className="text-left p-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">Amount</th>
                  <th className="text-left p-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">Block</th>
                  <th className="text-left p-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-text-secondary uppercase tracking-wide">Hash</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx, index) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border-color hover:bg-bg-card-hover transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-primary/10">
                            {getTypeIcon(tx.type)}
                          </div>
                          <span className="capitalize font-medium text-text-secondary">{tx.type}</span>
                        </div>
                      </td>
                      <td className="p-4 text-text-secondary text-sm font-mono">
                        {tx.from.substring(0, 6)}...{tx.from.substring(tx.from.length - 4)}
                      </td>
                      <td className="p-4 text-text-secondary text-sm font-mono">
                        {tx.to.substring(0, 6)}...{tx.to.substring(tx.to.length - 4)}
                      </td>
                      <td className="p-4 font-semibold text-success">${tx.amount.toFixed(2)}</td>
                      <td className="p-4 text-text-secondary text-sm">{tx.blockNumber}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                            tx.status
                          )}`}
                        >
                          {getStatusIcon(tx.status)}
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-4 text-text-secondary text-sm font-mono hover:text-primary cursor-pointer transition-colors">
                        {tx.txHash.substring(0, 8)}...
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-text-tertiary">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Pagination Info */}
        <div className="flex items-center justify-between text-sm text-text-tertiary">
          <p>Showing {filteredTransactions.length} of {totalTransactions} transactions</p>
          <p className="text-primary font-semibold">Last updated: just now</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TransactionsPage;
