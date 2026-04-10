import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { useOrganization } from '@/context/OrganizationContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const weeklyBreakdown = [
  { week: 'Week 1', payroll: 1120, yield: 180 },
  { week: 'Week 2', yield: 220, payroll: 1200 },
  { week: 'Week 3', payroll: 1160, yield: 195 },
  { week: 'Week 4', payroll: 1240, yield: 240 },
];

const monthlyTrend = [
  { month: 'January', earned: 4800, yield: 720 },
  { month: 'February', earned: 5200, yield: 850 },
  { month: 'March', earned: 4900, yield: 780 },
  { month: 'April', earned: 5400, yield: 920 },
  { month: 'May', earned: 5100, yield: 840 },
  { month: 'June', earned: 5600, yield: 1050 },
];

const EmployeeEarningsPage: React.FC = () => {
  const { employees } = useOrganization();
  const currentEmployee = employees[0]; // Use first employee as example

  const totalEarned = currentEmployee?.totalEarned || 0;
  const weekEarned = 1840;
  const yieldShare = 342.50;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Earnings & Yield</h1>
            <p className="text-muted-foreground">Track your streaming payments and yield distribution</p>
          </div>
          <select className="px-4 py-2 rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary outline-none">
            <option>Last 6 months</option>
            <option>Last 12 months</option>
            <option>All time</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="p-6" variant="glow" neonColor="cyan">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Earned</p>
                  <p className="text-2xl font-bold">${totalEarned.toFixed(2)}</p>
                  <p className="text-xs text-success">+2.4% this month</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6" variant="glow" neonColor="green">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <Calendar className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold">${weekEarned}</p>
                  <p className="text-xs text-success">+5.2% vs last week</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6" variant="glow" neonColor="purple">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Yield Share</p>
                  <p className="text-2xl font-bold">${yieldShare.toFixed(2)}</p>
                  <p className="text-xs text-success">+8.1% this month</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Weekly Payroll vs Yield */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6" variant="default">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-display font-bold">Weekly Breakdown</h3>
                  <p className="text-sm text-muted-foreground">Payroll vs Yield</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                  <XAxis dataKey="week" stroke="hsl(215, 20%, 65%)" />
                  <YAxis stroke="hsl(215, 20%, 65%)" />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(222, 47%, 10%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="payroll" fill="hsl(187, 100%, 42%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="yield" fill="hsl(263, 70%, 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Monthly Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6" variant="default">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-display font-bold">6-Month Trend</h3>
                  <p className="text-sm text-muted-foreground">Cumulative earnings</p>
                </div>
                <div className="p-2 rounded-lg bg-success/10">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="earnedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                  <XAxis dataKey="month" stroke="hsl(215, 20%, 65%)" />
                  <YAxis stroke="hsl(215, 20%, 65%)" />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(222, 47%, 10%)',
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="earned"
                    stroke="hsl(142, 76%, 36%)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="yield"
                    stroke="hsl(263, 70%, 50%)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>
        </div>

        {/* Earnings Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-6" variant="default">
            <h3 className="text-lg font-display font-bold mb-6">Earnings Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-primary/10">
                <p className="text-sm text-muted-foreground mb-1">Total Payroll</p>
                <p className="text-2xl font-bold text-primary">$31,840</p>
                <p className="text-xs text-muted-foreground mt-2">From 158 work hours</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/10">
                <p className="text-sm text-muted-foreground mb-1">Total Yield</p>
                <p className="text-2xl font-bold text-secondary">$5,290</p>
                <p className="text-xs text-muted-foreground mt-2">From trading profits</p>
              </div>
              <div className="p-4 rounded-lg bg-success/10">
                <p className="text-sm text-muted-foreground mb-1">Combined Total</p>
                <p className="text-2xl font-bold text-success">$37,130</p>
                <p className="text-xs text-muted-foreground mt-2">All-time earnings</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeEarningsPage;
