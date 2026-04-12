import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, Shield, ArrowRight, User, Building2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { useWeb3 } from '@/context/Web3Context';
import { useAuth, UserRole } from '@/context/AuthContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { connectWallet, isConnected, account, isLoading } = useWeb3();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [step, setStep] = useState<'connect' | 'role' | 'complete'>('connect');

  const handleConnect = async () => {
    await connectWallet();
    setStep('role');
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleLogin = () => {
    if (selectedRole && account) {
      login(account, selectedRole);
      navigate(selectedRole === 'admin' ? '/admin' : '/employee');
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      {/* Background Effects */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px]" />

      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-display font-bold mb-2">
              {step === 'connect' && 'Connect Your Wallet'}
              {step === 'role' && 'Select Your Role'}
              {step === 'complete' && 'Welcome Back!'}
            </h1>
            <p className="text-muted-foreground">
              {step === 'connect' && 'Use MetaMask or any Web3 wallet to get started'}
              {step === 'role' && 'Choose how you want to access D-ERP'}
              {step === 'complete' && 'Redirecting to your dashboard...'}
            </p>
          </motion.div>

          <GlassCard className="p-8" variant="glow" neonColor="cyan">
            {step === 'connect' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Wallet className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    Connect your wallet to access the decentralized ERP platform.
                    Your wallet address will be used for authentication and transactions.
                  </p>
                </div>

                <NeonButton 
                  className="w-full" 
                  size="lg" 
                  onClick={handleConnect}
                  loading={isLoading}
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  {isLoading ? 'Connecting...' : 'Connect MetaMask'}
                </NeonButton>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Secure, decentralized authentication</span>
                </div>
              </motion.div>
            )}

            {step === 'role' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {isConnected && account && (
                  <div className="p-4 rounded-lg bg-muted flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <div>
                      <p className="text-sm font-medium">Wallet Connected</p>
                      <p className="text-xs text-muted-foreground">
                        {account.slice(0, 10)}...{account.slice(-8)}
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-sm text-muted-foreground text-center">
                  Select your role to continue to the appropriate dashboard
                </p>

                <div className="space-y-4">
                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                      selectedRole === 'admin'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedRole === 'admin' ? 'bg-primary' : 'bg-muted'
                    }`}>
                      <Building2 className={`w-6 h-6 ${
                        selectedRole === 'admin' ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Organization Admin</p>
                      <p className="text-sm text-muted-foreground">
                        Manage payroll, resources, and organization settings
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('employee')}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                      selectedRole === 'employee'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedRole === 'employee' ? 'bg-primary' : 'bg-muted'
                    }`}>
                      <User className={`w-6 h-6 ${
                        selectedRole === 'employee' ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Employee</p>
                      <p className="text-sm text-muted-foreground">
                        View earnings, transactions, and performance metrics
                      </p>
                    </div>
                  </button>
                </div>

                <NeonButton
                  className="w-full"
                  size="lg"
                  onClick={handleLogin}
                  disabled={!selectedRole}
                >
                  Continue to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </NeonButton>
              </motion.div>
            )}
          </GlassCard>

          <p className="text-center text-sm text-muted-foreground mt-6">
            By connecting, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
