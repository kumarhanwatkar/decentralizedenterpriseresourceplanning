import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Search,
  Filter,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  Copy,
  Download,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';

interface Transaction {
  id: string;
  txHash: string;
  type: 'payroll' | 'yield' | 'transfer' | 'fee';
  from: string;
  to: string;
  amount: number;
  token: string;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed';
  blockNumber: number;
}

const transactions: Transaction[] = [
  {
    id: '1',
    txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
    type: 'payroll',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f8dE71',
    to: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
    amount: 25.00,
    token: 'USDT',
    timestamp: '2025-02-04 10:30:00',
    status: 'confirmed',
    blockNumber: 45678901,
  },
  {
    id: '2',
    txHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab',
    type: 'yield',
    from: 'Hot Wallet',
    to: 'Trading Bot',
    amount: 342.80,
    token: 'USDT',
    timestamp: '2025-02-04 09:15:00',
    status: 'confirmed',
    blockNumber: 45678850,
  },
  {
    id: '3',
    txHash: '0x3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcd',
    type: 'transfer',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f8dE71',
    to: 'Partner Org',
    amount: 5000.00,
    token: 'BUSD',
    timestamp: '2025-02-04 08:00:00',
    status: 'confirmed',
    blockNumber: 45678700,
  },
  {
    id: '4',
    txHash: '0x4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    type: 'payroll',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f8dE71',
    to: '0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e',
    amount: 22.00,
    token: 'USDT',
    timestamp: '2025-02-04 07:30:00',
    status: 'confirmed',
    blockNumber: 45678650,
  },
  {
    id: '5',
    txHash: '0x5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    type: 'fee',
    from: 'Platform',
    to: 'Fee Collector',
    amount: 12.50,
    token: 'USDT',
    timestamp: '2025-02-04 06:00:00',
    status: 'confirmed',
    blockNumber: 45678500,
  },
  {
    id: '6',
    txHash: '0x6f7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    type: 'payroll',
    from: '0x742d35Cc6634C0532925a3b844Bc9e7595f8dE71',
    to: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    amount: 24.00,
    token: 'USDT',
    timestamp: '2025-02-03 18:30:00',
    status: 'pending',
    blockNumber: 45678400,
  },
];

const TransactionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalVolume = transactions.reduce((sum, tx) => sum + tx.amount, 0);
  const payrollCount = transactions.filter(tx => tx.type === 'payroll').length;
  const yieldCount = transactions.filter(tx => tx.type === 'yield').length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'payroll': return 'text-primary bg-primary/10';
      case 'yield': return 'text-success bg-success/10';
      case 'transfer': return 'text-secondary bg-secondary/10';
      case 'fee': return 'text-warning bg-warning/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const truncateHash = (hash: string) => `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  const truncateAddress = (addr: string) => addr.startsWith('0x') ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Blockchain Transactions</h1>
            <p className="text-muted-foreground">View all on-chain transactions</p>
          </div>
          <NeonButton variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </NeonButton>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-6" variant="glow" neonColor="cyan">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="w-6 h-6 text-primary" />
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
                <ArrowUpRight className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Volume</p>
                <p className="text-2xl font-bold">${totalVolume.toLocaleString()}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" variant="glow" neonColor="purple">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary/10">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payroll Txs</p>
                <p className="text-2xl font-bold">{payrollCount}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" variant="glow" neonColor="orange">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <CheckCircle className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Yield Txs</p>
                <p className="text-2xl font-bold">{yieldCount}</p>
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
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Block</th>
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
                    <td className="p-4 font-mono text-sm text-muted-foreground">
                      {tx.blockNumber.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        tx.status === 'confirmed' ? 'text-success bg-success/10' :
                        tx.status === 'pending' ? 'text-warning bg-warning/10' :
                        'text-destructive bg-destructive/10'
                      }`}>
                        {tx.status === 'confirmed' && <CheckCircle className="w-3 h-3" />}
                        {tx.status === 'pending' && <Clock className="w-3 h-3" />}
                        {tx.status}
                      </span>
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

export default TransactionsPage;
