import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  ExternalLink,
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { useOrganization } from '@/context/OrganizationContext';
import { toast } from 'sonner';

const EmployeeTransactionsPage: React.FC = () => {
  const { transactions } = useOrganization();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const truncateHash = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  const truncateAddress = (addr: string) =>
    addr.startsWith('0x') ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payroll':
        return 'bg-primary/10 text-primary';
      case 'yield':
        return 'bg-success/10 text-success';
      case 'transfer':
        return 'bg-secondary/10 text-secondary';
      case 'fee':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold">Blockchain Transactions</h1>
          <p className="text-muted-foreground">View all your on-chain transactions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-6" variant="glow" neonColor="cyan">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" variant="glow" neonColor="green">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Confirmed</p>
                <p className="text-2xl font-bold">
                  {transactions.filter((t) => t.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" variant="glow" neonColor="orange">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {transactions.filter((t) => t.status === 'pending').length}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" variant="glow" neonColor="purple">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary/10">
                <AlertCircle className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold">
                  ${transactions.reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Filters */}
        <GlassCard className="p-4" variant="default">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by hash or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary outline-none font-mono text-sm"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="all">All Types</option>
              <option value="payroll">Payroll</option>
              <option value="yield">Yield</option>
              <option value="transfer">Transfer</option>
              <option value="fee">Fee</option>
            </select>
          </div>
        </GlassCard>

        {/* Transactions Table */}
        <GlassCard className="overflow-hidden" variant="default">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tx Hash</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">From</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">To</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx, index) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{truncateHash(tx.txHash)}</span>
                        <button
                          onClick={() => copyToClipboard(tx.txHash)}
                          className="p-1 rounded hover:bg-muted transition-colors"
                        >
                          <Copy className="w-3 h-3 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(tx.type)}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-sm text-muted-foreground">
                      {truncateAddress(tx.from)}
                    </td>
                    <td className="p-4 font-mono text-sm text-muted-foreground">
                      {truncateAddress(tx.to)}
                    </td>
                    <td className="p-4">
                      <span className="font-medium">${tx.amount.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground ml-1">{tx.token}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(tx.status)}
                        <span className="text-xs font-medium capitalize">{tx.status}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <a
                        href={`https://testnet.bscscan.com/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors inline-flex"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeTransactionsPage;
