import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  Bell,
  Lock,
  LogOut,
  Copy,
  Check,
  Toggle2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useOrganization } from '@/context/OrganizationContext';
import { toast } from 'sonner';

const EmployeeSettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { settings, updateSettings } = useOrganization();
  const [copied, setCopied] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    email: settings.notificationEmail,
    payroll: settings.notificationPayroll,
    yield_: settings.notificationYield,
  });

  const handleLogout = () => {
    logout();
    navigate('/#/login');
    toast.success('Logged out successfully');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNotificationToggle = (key: keyof typeof notificationSettings) => {
    const newSettings = { ...notificationSettings, [key]: !notificationSettings[key] };
    setNotificationSettings(newSettings);
    updateSettings({
      notificationEmail: newSettings.email,
      notificationPayroll: newSettings.payroll,
      notificationYield: newSettings.yield_,
    });
    toast.success('Notification settings updated');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile and preferences</p>
        </div>

        {/* Profile Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard className="p-6" variant="default">
            <h3 className="text-lg font-display font-bold mb-6">Profile Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Full Name
                </label>
                <div className="p-3 rounded-lg bg-muted text-foreground font-medium">
                  {user?.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Email
                </label>
                <div className="p-3 rounded-lg bg-muted text-foreground font-medium">
                  {user?.email || 'user@techforge.com'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Role
                </label>
                <div className="p-3 rounded-lg bg-muted text-foreground font-medium capitalize">
                  {user?.role}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Department
                </label>
                <div className="p-3 rounded-lg bg-muted text-foreground font-medium">
                  Engineering
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Wallet Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6" variant="glow" neonColor="cyan">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold">Wallet</h3>
                <p className="text-sm text-muted-foreground">Your blockchain wallet</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Wallet Address
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3 rounded-lg bg-muted font-mono text-sm text-foreground break-all">
                    {user?.wallet || '0x742d35Cc6634C0532925a3b844Bc9e7595f8dE71'}
                  </div>
                  <button
                    onClick={() => handleCopy(user?.wallet || '0x742d35Cc6634C0532925a3b844Bc9e7595f8dE71')}
                    className="p-3 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Current Balance
                </label>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-2xl font-bold text-success">2.5847 BNB</p>
                  <p className="text-xs text-muted-foreground mt-1">≈ $1,242.35 USD</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6" variant="glow" neonColor="green">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-lg bg-success/10">
                <Bell className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold">Notifications</h3>
                <p className="text-sm text-muted-foreground">Control how you receive updates</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive updates via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.email}
                  onChange={() => handleNotificationToggle('email')}
                  className="w-5 h-5 rounded border-primary"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">Payroll Updates</p>
                  <p className="text-xs text-muted-foreground">Get notified when payroll is processed</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.payroll}
                  onChange={() => handleNotificationToggle('payroll')}
                  className="w-5 h-5 rounded border-primary"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">Yield Distribution</p>
                  <p className="text-xs text-muted-foreground">Notify about yield earnings</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.yield_}
                  onChange={() => handleNotificationToggle('yield_')}
                  className="w-5 h-5 rounded border-primary"
                />
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
              <div className="p-3 rounded-lg bg-warning/10">
                <Lock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold">Security</h3>
                <p className="text-sm text-muted-foreground">Manage your account security</p>
              </div>
            </div>

            <div className="space-y-4">
              <button className="w-full p-4 rounded-lg border border-muted hover:border-warning hover:bg-warning/5 transition-colors text-left">
                <p className="font-medium">Change Password</p>
                <p className="text-xs text-muted-foreground mt-1">Update your account password</p>
              </button>

              <button className="w-full p-4 rounded-lg border border-muted hover:border-secondary hover:bg-secondary/5 transition-colors text-left">
                <p className="font-medium">Enable Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground mt-1">Add an extra layer of security</p>
              </button>

              <button className="w-full p-4 rounded-lg border border-muted hover:border-destructive hover:bg-destructive/5 transition-colors text-left">
                <p className="font-medium">View Active Sessions</p>
                <p className="text-xs text-muted-foreground mt-1">Manage your active login sessions</p>
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <NeonButton
            variant="outline"
            className="w-full justify-center"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </NeonButton>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeSettingsPage;
