import React from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  Clock,
  Lock,
  DollarSign,
  ArrowUpRight,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { StreamingNumber } from '@/components/ui/StreamingNumber';
import { useAuth } from '@/context/AuthContext';
import { useWeb3 } from '@/context/Web3Context';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const earningsData = [
  { day: 'Mon', earnings: 185 },
  { day: 'Tue', earnings: 200 },
  { day: 'Wed', earnings: 195 },
  { day: 'Thu', earnings: 210 },
  { day: 'Fri', earnings: 205 },
  { day: 'Sat', earnings: 0 },
  { day: 'Sun', earnings: 0 },
];

const transactionHistory = [
  { id: 1, type: 'salary', amount: 25.00, time: '1 hour ago', txHash: '0x1a2b...3c4d' },
  { id: 2, type: 'salary', amount: 25.00, time: '2 hours ago', txHash: '0x2b3c...4d5e' },
  { id: 3, type: 'yield', amount: 12.50, time: '5 hours ago', txHash: '0x3c4d...5e6f' },
  { id: 4, type: 'salary', amount: 25.00, time: '6 hours ago', txHash: '0x4d5e...6f7g' },
  { id: 5, type: 'salary', amount: 25.00, time: '7 hours ago', txHash: '0x5e6f...7g8h' },
];

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { balance, account } = useWeb3();

  const hourlyRate = user?.hourlyRate || 25;
  const hoursWorkedToday = 6.5;
  const todayEarnings = hourlyRate * hoursWorkedToday;
  const lockedFunds = 1250.00;
  const yieldGenerated = 156.25;
  const lockPeriodRemaining = 8; // days

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold mb-2">
            Hello, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-muted-foreground">
            Your payroll is streaming. Track your earnings in real-time.
          </p>
        </motion.div>

        {/* Live Earnings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-8" variant="glow" neonColor="cyan">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="streaming-dot" />
                  <span className="text-sm font-medium text-success">Payroll Streaming Active</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
                <StreamingNumber
                  value={todayEarnings}
                  prefix="$"
                  streaming={true}
                  incrementPerSecond={0.007} // ~$25/hr = $0.007/s
                  decimals={4}
                  className="text-5xl font-display font-bold text-primary"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Rate: ${hourlyRate}/hour • {hoursWorkedToday} hours today
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Wallet Balance</p>
                  <p className="text-xl font-bold">{balance} BNB</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">This Month</p>
                  <p className="text-xl font-bold text-success">$2,847.50</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Hours Today',
              value: hoursWorkedToday,
              suffix: ' hrs',
              icon: Clock,
              color: 'cyan',
            },
            {
              title: 'Locked Funds',
              value: lockedFunds,
              prefix: '$',
              icon: Lock,
              color: 'purple',
            },
            {
              title: 'Yield Earned',
              value: yieldGenerated,
              prefix: '+$',
              icon: TrendingUp,
              color: 'green',
            },
            {
              title: 'Unlock In',
              value: lockPeriodRemaining,
              suffix: ' days',
              icon: Calendar,
              color: 'orange',
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <GlassCard className="p-6" variant="neon" neonColor={stat.color as any}>
                <div className={`p-3 rounded-lg bg-neon-${stat.color}/10 w-fit mb-4`}>
                  <stat.icon className={`w-5 h-5 text-neon-${stat.color}`} />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold">
                  {stat.prefix}{stat.value.toLocaleString()}{stat.suffix}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Charts & Transactions */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly Earnings Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="p-6" variant="default">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-display font-bold">Weekly Earnings</h3>
                  <p className="text-sm text-muted-foreground">Your earnings this week</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">$995</p>
                  <p className="text-xs text-success flex items-center gap-1 justify-end">
                    <ArrowUpRight className="w-3 h-3" /> +8% vs last week
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={earningsData}>
                  <defs>
                    <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(187, 100%, 42%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(187, 100%, 42%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                  <XAxis dataKey="day" stroke="hsl(215, 20%, 65%)" />
                  <YAxis stroke="hsl(215, 20%, 65%)" />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(222, 47%, 10%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="hsl(187, 100%, 42%)"
                    strokeWidth={2}
                    fill="url(#earningsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Transaction History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <GlassCard className="p-6" variant="default">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-bold">Transaction History</h3>
                <button className="text-sm text-primary hover:underline">View all</button>
              </div>
              <div className="space-y-3">
                {transactionHistory.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          tx.type === 'salary' ? 'bg-primary/10' : 'bg-success/10'
                        }`}
                      >
                        {tx.type === 'salary' ? (
                          <DollarSign className="w-4 h-4 text-primary" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-success" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm capitalize">{tx.type} Payment</p>
                        <p className="text-xs text-muted-foreground">{tx.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-success">+${tx.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground font-mono">{tx.txHash}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Yield Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <GlassCard className="p-6" variant="glow" neonColor="purple">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h3 className="text-lg font-display font-bold mb-2">Yield Generation Status</h3>
                <p className="text-sm text-muted-foreground">
                  85% of your earnings are locked in the Hot Wallet generating yield through
                  algorithmic trading.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">${lockedFunds}</p>
                  <p className="text-xs text-muted-foreground">Locked Amount</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">+{((yieldGenerated / lockedFunds) * 100).toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">Current ROI</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">{lockPeriodRemaining}d</p>
                  <p className="text-xs text-muted-foreground">Until Unlock</p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Lock Period Progress</span>
                <span className="font-medium">{Math.round(((15 - lockPeriodRemaining) / 15) * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((15 - lockPeriodRemaining) / 15) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
