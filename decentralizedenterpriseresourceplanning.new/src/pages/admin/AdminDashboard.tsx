import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Wallet,
  TrendingUp,
  Server,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  DollarSign,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { StreamingNumber } from '@/components/ui/StreamingNumber';
import { useAuth } from '@/context/AuthContext';
import { useOrganization } from '@/context/OrganizationContext';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const payrollData = [
  { name: 'Jan', amount: 45000, employees: 45 },
  { name: 'Feb', amount: 52000, employees: 48 },
  { name: 'Mar', amount: 48000, employees: 47 },
  { name: 'Apr', amount: 61000, employees: 52 },
  { name: 'May', amount: 55000, employees: 50 },
  { name: 'Jun', amount: 67000, employees: 55 },
];

const yieldData = [
  { name: 'Week 1', yield: 2.1 },
  { name: 'Week 2', yield: 3.4 },
  { name: 'Week 3', yield: 2.8 },
  { name: 'Week 4', yield: 4.2 },
];

const departmentData = [
  { name: 'Engineering', value: 35, color: 'hsl(187, 100%, 42%)' },
  { name: 'Operations', value: 25, color: 'hsl(263, 70%, 50%)' },
  { name: 'Sales', value: 20, color: 'hsl(142, 76%, 36%)' },
  { name: 'Support', value: 20, color: 'hsl(38, 92%, 50%)' },
];

const recentTransactions = [
  { id: 1, type: 'payroll', employee: 'Kumar H.', amount: 125.50, time: '2 min ago', status: 'completed' },
  { id: 2, type: 'payroll', employee: 'Ayush D.', amount: 118.25, time: '5 min ago', status: 'completed' },
  { id: 3, type: 'yield', description: 'Trading Profit', amount: 342.80, time: '1 hr ago', status: 'completed' },
  { id: 4, type: 'payroll', employee: 'Jitendra C.', amount: 132.00, time: '2 hr ago', status: 'completed' },
];

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { employees, resources, stats, transactions } = useOrganization();

  // Calculate department distribution from employees
  const departmentMap = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const departmentData = Object.entries(departmentMap).map((entry, index) => ({
    name: entry[0],
    value: entry[1],
    color: ['hsl(187, 100%, 42%)', 'hsl(263, 70%, 50%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(260, 92%, 60%)'][index % 5],
  }));

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
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your organization today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Total Employees',
              value: stats.totalEmployees,
              change: `+${stats.activeEmployees - (stats.totalEmployees - stats.activeEmployees)}`,
              changeType: 'positive',
              icon: Users,
              color: 'cyan',
            },
            {
              title: 'Payroll Streaming',
              value: stats.totalPayrollMonthly / 2080, // hourly rate calculation
              prefix: '$',
              suffix: '/hr',
              streaming: true,
              icon: Wallet,
              color: 'green',
            },
            {
              title: 'Yield Generated',
              value: stats.totalYieldGenerated,
              prefix: '$',
              change: '+12.5%',
              changeType: 'positive',
              icon: TrendingUp,
              color: 'purple',
            },
            {
              title: 'Active Resources',
              value: stats.activeResources,
              suffix: `/${resources.length}`,
              change: `${Math.round((stats.activeResources / resources.length) * 100)}%`,
              changeType: 'neutral',
              icon: Server,
              color: 'orange',
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6" variant="glow" neonColor={stat.color as 'cyan' | 'green' | 'purple' | 'orange'}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-neon-${stat.color}/10`}>
                    <stat.icon className={`w-6 h-6 text-neon-${stat.color}`} />
                  </div>
                  {stat.change && (
                    <span
                      className={`flex items-center text-sm font-medium ${
                        stat.changeType === 'positive'
                          ? 'text-success'
                          : stat.changeType === 'negative'
                          ? 'text-destructive'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {stat.changeType === 'positive' && <ArrowUpRight className="w-4 h-4" />}
                      {stat.changeType === 'negative' && <ArrowDownRight className="w-4 h-4" />}
                      {stat.change}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                {stat.streaming ? (
                  <StreamingNumber
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    streaming={true}
                    incrementPerSecond={0.05}
                    className="text-2xl font-bold"
                  />
                ) : (
                  <p className="text-2xl font-bold">
                    {stat.prefix}{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}{stat.suffix}
                  </p>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payroll Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-6" variant="default">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-display font-bold">Payroll Overview</h3>
                  <p className="text-sm text-muted-foreground">Monthly payroll distribution</p>
                </div>
                <select className="px-3 py-2 rounded-lg bg-muted text-sm border-none">
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={payrollData}>
                  <defs>
                    <linearGradient id="payrollGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(187, 100%, 42%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(187, 100%, 42%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                  <XAxis dataKey="name" stroke="hsl(215, 20%, 65%)" />
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
                    dataKey="amount"
                    stroke="hsl(187, 100%, 42%)"
                    strokeWidth={2}
                    fill="url(#payrollGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Department Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard className="p-6 h-full" variant="default">
              <h3 className="text-lg font-display font-bold mb-2">Workforce</h3>
              <p className="text-sm text-muted-foreground mb-6">By department</p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    stroke="none"
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {departmentData.map((dept, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: dept.color }}
                    />
                    <span className="text-xs text-muted-foreground">{dept.name}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Yield Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="p-6" variant="glow" neonColor="purple">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-display font-bold">Yield Performance</h3>
                  <p className="text-sm text-muted-foreground">Hot Wallet trading returns</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-success">+12.5%</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={yieldData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                  <XAxis dataKey="name" stroke="hsl(215, 20%, 65%)" />
                  <YAxis stroke="hsl(215, 20%, 65%)" />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(222, 47%, 10%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="yield" fill="hsl(263, 70%, 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <GlassCard className="p-6" variant="default">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-bold">Recent Transactions</h3>
                <button className="text-sm text-primary hover:underline">View all</button>
              </div>
              <div className="space-y-4">
                {transactions.slice(0, 4).map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          tx.type === 'payroll' ? 'bg-primary/10' : 'bg-success/10'
                        }`}
                      >
                        {tx.type === 'payroll' ? (
                          <DollarSign className="w-4 h-4 text-primary" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-success" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm capitalize">
                          {tx.type} - {tx.token}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {tx.timestamp}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-success">+${tx.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
