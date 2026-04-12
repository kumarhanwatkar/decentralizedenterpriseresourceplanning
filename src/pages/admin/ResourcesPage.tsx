import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Server,
  Cpu,
  Activity,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  MoreVertical,
  Plus,
  Search,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';

interface Resource {
  id: string;
  name: string;
  type: 'machine' | 'server' | 'equipment';
  status: 'operational' | 'maintenance' | 'offline';
  utilization: number;
  department: string;
  lastMaintenance: string;
  efficiency: number;
}

const resources: Resource[] = [
  {
    id: '1',
    name: 'CNC Machine A1',
    type: 'machine',
    status: 'operational',
    utilization: 87,
    department: 'Manufacturing',
    lastMaintenance: '2025-01-15',
    efficiency: 94,
  },
  {
    id: '2',
    name: 'CNC Machine A2',
    type: 'machine',
    status: 'operational',
    utilization: 92,
    department: 'Manufacturing',
    lastMaintenance: '2025-01-20',
    efficiency: 91,
  },
  {
    id: '3',
    name: 'Lathe Machine B1',
    type: 'machine',
    status: 'maintenance',
    utilization: 0,
    department: 'Manufacturing',
    lastMaintenance: '2025-02-01',
    efficiency: 88,
  },
  {
    id: '4',
    name: 'Production Server',
    type: 'server',
    status: 'operational',
    utilization: 65,
    department: 'IT',
    lastMaintenance: '2025-01-25',
    efficiency: 99,
  },
  {
    id: '5',
    name: 'Assembly Line Robot',
    type: 'equipment',
    status: 'operational',
    utilization: 78,
    department: 'Assembly',
    lastMaintenance: '2025-01-10',
    efficiency: 96,
  },
  {
    id: '6',
    name: 'Welding Station W1',
    type: 'equipment',
    status: 'offline',
    utilization: 0,
    department: 'Fabrication',
    lastMaintenance: '2024-12-20',
    efficiency: 82,
  },
];

const ResourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredResources = resources.filter((res) => {
    const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || res.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const operationalCount = resources.filter(r => r.status === 'operational').length;
  const maintenanceCount = resources.filter(r => r.status === 'maintenance').length;
  const offlineCount = resources.filter(r => r.status === 'offline').length;
  const avgUtilization = Math.round(resources.filter(r => r.status === 'operational')
    .reduce((sum, r) => sum + r.utilization, 0) / operationalCount);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-success bg-success/10';
      case 'maintenance': return 'text-warning bg-warning/10';
      case 'offline': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="w-3 h-3" />;
      case 'maintenance': return <Clock className="w-3 h-3" />;
      case 'offline': return <AlertTriangle className="w-3 h-3" />;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'machine': return <Cpu className="w-5 h-5" />;
      case 'server': return <Server className="w-5 h-5" />;
      case 'equipment': return <Settings className="w-5 h-5" />;
      default: return <Server className="w-5 h-5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Resource Management</h1>
            <p className="text-muted-foreground">Monitor and manage organizational assets</p>
          </div>
          <NeonButton size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
          </NeonButton>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard className="p-6" variant="glow" neonColor="cyan">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Server className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Resources</p>
                <p className="text-2xl font-bold">{resources.length}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" variant="glow" neonColor="green">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Operational</p>
                <p className="text-2xl font-bold">{operationalCount}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" variant="glow" neonColor="orange">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-warning/10">
                <Activity className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Utilization</p>
                <p className="text-2xl font-bold">{avgUtilization}%</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" variant="glow" neonColor="purple">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary/10">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Efficiency</p>
                <p className="text-2xl font-bold">92%</p>
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
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="all">All Types</option>
              <option value="machine">Machines</option>
              <option value="server">Servers</option>
              <option value="equipment">Equipment</option>
            </select>
          </div>
        </GlassCard>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-6" variant="neon" neonColor={
                resource.status === 'operational' ? 'green' :
                resource.status === 'maintenance' ? 'orange' : 'purple'
              }>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    resource.status === 'operational' ? 'bg-success/10 text-success' :
                    resource.status === 'maintenance' ? 'bg-warning/10 text-warning' :
                    'bg-destructive/10 text-destructive'
                  }`}>
                    {getTypeIcon(resource.type)}
                  </div>
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-display font-bold mb-1">{resource.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{resource.department}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(resource.status)}`}>
                      {getStatusIcon(resource.status)}
                      {resource.status}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Utilization</span>
                      <span className="font-medium">{resource.utilization}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          resource.utilization > 80 ? 'bg-success' :
                          resource.utilization > 50 ? 'bg-warning' :
                          'bg-destructive'
                        }`}
                        style={{ width: `${resource.utilization}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Efficiency</span>
                    <span className="font-medium text-success">{resource.efficiency}%</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Maintenance</span>
                    <span className="text-muted-foreground">{resource.lastMaintenance}</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResourcesPage;
