import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  DollarSign,
  Bell,
  Lock,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { useOrganization } from '@/context/OrganizationContext';
import { toast } from 'sonner';

const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useOrganization();
  const [companySettings, setCompanySettings] = useState({
    companyName: settings.companyName,
    companyEmail: settings.companyEmail,
    companyPhone: settings.companyPhone,
  });
  const [payrollSettings, setPayrollSettings] = useState({
    payrollCycle: settings.payrollCycle,
    yieldDistributionPercent: settings.yieldDistributionPercent,
  });

  const handleCompanySave = () => {
    updateSettings(companySettings);
    toast.success('Company settings updated');
  };

  const handlePayrollSave = () => {
    updateSettings(payrollSettings);
    toast.success('Payroll settings updated');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold">Organization Settings</h1>
          <p className="text-muted-foreground">Manage organization-wide configuration</p>
        </div>

        {/* Company Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-6" variant="default">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold">Company Information</h3>
                <p className="text-sm text-muted-foreground">Basic organization details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companySettings.companyName}
                  onChange={(e) =>
                    setCompanySettings({ ...companySettings, companyName: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={companySettings.companyEmail}
                  onChange={(e) =>
                    setCompanySettings({ ...companySettings, companyEmail: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={companySettings.companyPhone}
                  onChange={(e) =>
                    setCompanySettings({ ...companySettings, companyPhone: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <NeonButton className="w-full justify-center" onClick={handleCompanySave}>
                Save Company Settings
              </NeonButton>
            </div>
          </GlassCard>
        </motion.div>

        {/* Payroll Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6" variant="default">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-lg bg-success/10">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold">Payroll Configuration</h3>
                <p className="text-sm text-muted-foreground">Set up payroll and yield distribution</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Payroll Cycle
                </label>
                <select
                  value={payrollSettings.payrollCycle}
                  onChange={(e) =>
                    setPayrollSettings({
                      ...payrollSettings,
                      payrollCycle: e.target.value as 'weekly' | 'biweekly' | 'monthly',
                    })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-muted border-none focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Yield Distribution Percentage
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={payrollSettings.yieldDistributionPercent}
                    onChange={(e) =>
                      setPayrollSettings({
                        ...payrollSettings,
                        yieldDistributionPercent: parseInt(e.target.value),
                      })
                    }
                    className="flex-1"
                  />
                  <div className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-bold min-w-fit">
                    {payrollSettings.yieldDistributionPercent}%
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Percentage of trading profits distributed to employees
                </p>
              </div>

              <NeonButton className="w-full justify-center" onClick={handlePayrollSave}>
                Save Payroll Settings
              </NeonButton>
            </div>
          </GlassCard>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6" variant="default">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-lg bg-warning/10">
                <Bell className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold">Notifications</h3>
                <p className="text-sm text-muted-foreground">Configure system notifications</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Send alerts via email</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>

              <label className="flex items-center justify-between p-4 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">Payroll Alerts</p>
                  <p className="text-xs text-muted-foreground">Notify on payroll processing</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>

              <label className="flex items-center justify-between p-4 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">Yield Updates</p>
                  <p className="text-xs text-muted-foreground">Notify about yield distributions</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
              </label>
            </div>
          </GlassCard>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6" variant="default">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-lg bg-destructive/10">
                <Lock className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold">Security</h3>
                <p className="text-sm text-muted-foreground">Manage security settings</p>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full p-4 rounded-lg border border-muted hover:border-primary hover:bg-primary/5 transition-colors text-left">
                <p className="font-medium">Enable Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground mt-1">Add extra security to your account</p>
              </button>

              <button className="w-full p-4 rounded-lg border border-muted hover:border-secondary hover:bg-secondary/5 transition-colors text-left">
                <p className="font-medium">Manage API Keys</p>
                <p className="text-xs text-muted-foreground mt-1">Create and manage API access tokens</p>
              </button>

              <button className="w-full p-4 rounded-lg border border-muted hover:border-warning hover:bg-warning/5 transition-colors text-left">
                <p className="font-medium">Backup Organization Data</p>
                <p className="text-xs text-muted-foreground mt-1">Download a backup of all data</p>
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettingsPage;
