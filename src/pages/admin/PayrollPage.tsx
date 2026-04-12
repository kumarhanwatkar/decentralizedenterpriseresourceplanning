import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Play,
  Pause,
  Search,
  Filter,
  MoreVertical,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Download,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { StreamingNumber } from '@/components/ui/StreamingNumber';

interface Employee {
  id: string;
  name: string;
  department: string;
  walletAddress: string;
  hourlyRate: number;
  status: 'active' | 'paused' | 'completed';
  hoursThisMonth: number;
  totalEarned: number;
}

const employees: Employee[] = [
  {
    id: '1',
    name: 'Kumar Hanwatkar',
    department: 'Engineering',
    walletAddress: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
    hourlyRate: 25,
    status: 'active',
    hoursThisMonth: 160,
    totalEarned: 4000,
  },
  {
    id: '2',
    name: 'Ayush Dongarwar',
    department: 'Engineering',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f8dE71',
    hourlyRate: 28,
    status: 'active',
    hoursThisMonth: 152,
    totalEarned: 4256,
  },
  {
    id: '3',
    name: 'Jitendra Chandankhede',
    department: 'Operations',
    walletAddress: '0x2932b7A2355D6fecc4b5c0B6BD44cC31df247a2e',
    hourlyRate: 22,
    status: 'paused',
    hoursThisMonth: 120,
    totalEarned: 2640,
  },
  {
    id: '4',
    name: 'Priya Sharma',
    department: 'Sales',
    walletAddress: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    hourlyRate: 24,
    status: 'active',
    hoursThisMonth: 168,
    totalEarned: 4032,
  },
  {
    id: '5',
    name: 'Rahul Deshmukh',
    department: 'Support',
    walletAddress: '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
    hourlyRate: 20,
    status: 'completed',
    hoursThisMonth: 176,
    totalEarned: 3520,
  },
];

const PayrollPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || emp.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalPayrollThisMonth = employees.reduce((sum, emp) => sum + emp.totalEarned, 0);
  const activeStreams = employees.filter(e => e.status === 'active').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'paused': return 'text-warning bg-warning/10';
      case 'completed': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-3 h-3" />;
      case 'paused': return <Pause className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Payroll Management</h1>
            <p className="text-muted-foreground">Manage streaming payroll for all employees</p>
          </div>
          <div className="flex items-center gap-3">
            <NeonButton variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </NeonButton>
            <NeonButton size="sm">
              <Users className="w-4 h-4 mr-2" />
              Add Employee
            </NeonButton>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-6" variant="glow" neonColor="cyan">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Payroll (MTD)</p>
                <p className="text-2xl font-bold">${totalPayrollThisMonth.toLocaleString()}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" variant="glow" neonColor="green">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <Play className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Streams</p>
                <p className="text-2xl font-bold">{activeStreams}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" variant="glow" neonColor="purple">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary/10">
                <Clock className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Streaming Rate</p>
                <StreamingNumber
                  value={125.50}
                  prefix="$"
                  suffix="/hr"
                  streaming={true}
                  incrementPerSecond={0.001}
                  className="text-2xl font-bold"
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" variant="glow" neonColor="orange">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Hourly Rate</p>
                <p className="text-2xl font-bold">$23.80</p>
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
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </GlassCard>

        {/* Employee Table */}
        <GlassCard className="overflow-hidden" variant="default">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Employee</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Department</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Wallet</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rate/hr</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Hours (MTD)</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Earned (MTD)</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee, index) => (
                  <motion.tr
                    key={employee.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-foreground">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium">{employee.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{employee.department}</td>
                    <td className="p-4">
                      <span className="font-mono text-sm text-muted-foreground">
                        {employee.walletAddress.slice(0, 6)}...{employee.walletAddress.slice(-4)}
                      </span>
                    </td>
                    <td className="p-4 font-medium">${employee.hourlyRate}</td>
                    <td className="p-4">{employee.hoursThisMonth}h</td>
                    <td className="p-4 font-medium text-success">${employee.totalEarned.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(employee.status)}`}>
                        {getStatusIcon(employee.status)}
                        {employee.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {employee.status === 'active' ? (
                          <button className="p-2 rounded-lg hover:bg-warning/10 text-warning transition-colors">
                            <Pause className="w-4 h-4" />
                          </button>
                        ) : employee.status === 'paused' ? (
                          <button className="p-2 rounded-lg hover:bg-success/10 text-success transition-colors">
                            <Play className="w-4 h-4" />
                          </button>
                        ) : null}
                        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
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

export default PayrollPage;
