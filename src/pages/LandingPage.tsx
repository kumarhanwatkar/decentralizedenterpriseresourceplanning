import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  Shield, 
  Zap, 
  TrendingUp, 
  Users, 
  Bot, 
  ArrowRight,
  CheckCircle,
  Globe,
  Lock,
  Cpu
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';

const features = [
  {
    icon: Wallet,
    title: 'Streaming Payroll',
    description: 'Pay employees hourly in stablecoins with real-time balance updates on the blockchain.',
    color: 'cyan',
  },
  {
    icon: TrendingUp,
    title: 'Yield Generation',
    description: '85% of funds locked in Hot Wallet generate yield via algorithmic trading.',
    color: 'green',
  },
  {
    icon: Bot,
    title: 'AI-Powered Dashboards',
    description: 'Describe your organization in natural language; AI generates your ERP dashboard.',
    color: 'purple',
  },
  {
    icon: Shield,
    title: 'Transparent & Secure',
    description: 'Every transaction recorded on Binance Smart Chain with full auditability.',
    color: 'orange',
  },
];

const stats = [
  { value: '$2.4M+', label: 'Payroll Processed' },
  { value: '150+', label: 'Organizations' },
  { value: '12.5%', label: 'Average ROI' },
  { value: '24/7', label: 'Uptime' },
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background Effects */}
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]" />

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Built on Binance Smart Chain
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold mb-6"
          >
            <span className="gradient-text">Decentralized ERP</span>
            <br />
            <span className="text-foreground">for the Future of Work</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
          >
            Automate payroll with hourly stablecoin payments, optimize resources with AI,
            and generate yield from idle capital — all on-chain with complete transparency.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/login">
              <NeonButton size="lg">
                <Wallet className="w-5 h-5 mr-2" />
                Connect Wallet
              </NeonButton>
            </Link>
            <Link to="/features">
              <NeonButton variant="outline" size="lg">
                Explore Features
                <ArrowRight className="w-5 h-5 ml-2" />
              </NeonButton>
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-5xl mx-auto mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <GlassCard key={index} className="p-6 text-center" variant="glow" neonColor="cyan">
              <p className="text-3xl sm:text-4xl font-display font-bold gradient-text">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </GlassCard>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              Revolutionary <span className="gradient-text">Features</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Combining blockchain technology, AI automation, and DeFi yield strategies
              to create the next generation of enterprise resource planning.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard
                  className="p-8 h-full"
                  variant="neon"
                  neonColor={feature.color as any}
                >
                  <div className={`w-14 h-14 rounded-xl bg-neon-${feature.color}/10 flex items-center justify-center mb-6`}>
                    <feature.icon className={`w-7 h-7 text-neon-${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              How <span className="gradient-text">D-ERP</span> Works
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Globe,
                title: 'Connect & Configure',
                description: 'Connect your wallet and describe your organization. Our AI generates your custom ERP dashboard instantly.',
              },
              {
                step: '02',
                icon: Lock,
                title: 'Smart Capital Split',
                description: '15% stays liquid in Cold Wallet for payroll. 85% enters Hot Wallet for yield generation via trading bots.',
              },
              {
                step: '03',
                icon: Cpu,
                title: 'Automated Operations',
                description: 'Employees receive hourly payments automatically. Track everything on-chain with full transparency.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <GlassCard className="p-8 h-full relative" variant="glow">
                  <span className="absolute top-6 right-6 text-5xl font-display font-bold text-muted/20">
                    {item.step}
                  </span>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-12 text-center" variant="glow" neonColor="purple">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                Ready to Transform Your Organization?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join the decentralized revolution. Start streaming payroll, generating yield,
                and managing resources with AI-powered intelligence.
              </p>
              <Link to="/login">
                <NeonButton size="lg">
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </NeonButton>
              </Link>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">D</span>
            </div>
            <span className="font-display font-bold">D-ERP</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 D-ERP. Priyadarshini College of Engineering, Nagpur.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
            <Link to="/features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link>
            <Link to="/architecture" className="text-sm text-muted-foreground hover:text-foreground">Architecture</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
