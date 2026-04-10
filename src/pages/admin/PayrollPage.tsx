import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Play,
  Pause,
  Search,
  DollarSign,
  Activity,
  TrendingUp,
  Download,
  MoreVertical,
  Clock,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { useOrganization } from '@/context/OrganizationContext';

const PayrollPage: React.FC = () => {
  const { employees, stats, toggleEmployeeStatus } = useOrganization();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment === 'all' || emp.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const departments = Array.from(new Set(employees.map((e) => e.department)));
  const totalEarned = filteredEmployees.reduce((sum, emp) => sum + emp.totalEarned, 0);
  const activeCount = filteredEmployees.filter((e) => e.status === 'active').length;
  const avgHourlyRate = employees.length > 0 
    ? (employees.reduce((sum, e) => sum + e.hourlyRate, 0) / employees.length).toFixed(2)
    : '0';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success bg-success/10';
      case 'paused': return 'text-warning bg-warning/10';
      case 'inactive': return 'text-muted-foreground bg-muted';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Stream Payroll</h1>
            <p className="text-muted-foreground">Manage real-time employee payments</p>
          </div>
          <div className="flex gap-2">
            <NeonButton variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </NeonButton>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-6" variant="glow" neonColor="cyan">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">{stats.totalEmployees}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" variant="glow" neonColor="green">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <Activity className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Now</p>
                <p className="text-2xl font-bold">{activeCount}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" variant="glow" neonColor="purple">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary/10">
                <DollarSign className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-bold">${totalEarned.toFixed(2)}</p>
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
                <p className="text-2xl font-bold">${avgHourlyRate}/hr</p>
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
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-2 rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </GlassCard>

        {/* Employees Table */}
        <GlassCard className="overflow-hidden" variant="default">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Department</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Hourly Rate</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Total Earned</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp, index) => (
                  <motion.tr
                    key={emp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">{emp.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{emp.department}</td>
                    <td className="p-4 text-muted-foreground">{emp.role}</td>
                    <td className="p-4 font-medium">${emp.hourlyRate}/hr</td>
                    <td className="p-4 font-medium text-success">${emp.totalEarned.toFixed(2)}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(emp.status)}`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleEmployeeStatus(emp.id)}
                        className="px-3 py-1 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-primary"
                      >
                        {emp.status === 'active' ? 'Pause' : 'Resume'}
                      </button>
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
