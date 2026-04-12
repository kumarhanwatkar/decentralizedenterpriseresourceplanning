import React from 'react';
import { ArrowRight, Zap, Shield, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur z-50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">⛓️ Decentralized ERP</div>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Decentralized Enterprise Resource Planning
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Secure, transparent, and blockchain-integrated ERP system for modern enterprises
            </p>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition"
            >
              Get Started <ArrowRight size={20} />
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 hover:border-blue-500 transition">
              <Zap className="text-yellow-400 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Real-Time Updates</h3>
              <p className="text-slate-400">Instant synchronization across all departments</p>
            </div>
            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 hover:border-blue-500 transition">
              <Shield className="text-green-400 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Blockchain Secured</h3>
              <p className="text-slate-400">Built-in Web3 integration for maximum security</p>
            </div>
            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 hover:border-blue-500 transition">
              <Users className="text-purple-400 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Collaborative</h3>
              <p className="text-slate-400">Admin and employee dashboards with role-based access</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">✓</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Payroll Management</h4>
                <p className="text-slate-400">Automated payroll processing with real-time streaming</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">✓</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Resource Allocation</h4>
                <p className="text-slate-400">Efficient resource management and tracking</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">✓</div>
              <div>
                <h4 className="text-xl font-bold mb-2">Transaction Tracking</h4>
                <p className="text-slate-400">Complete visibility into all financial transactions</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">✓</div>
              <div>
                <h4 className="text-xl font-bold mb-2">AI-Powered Insights</h4>
                <p className="text-slate-400">Advanced analytics and AI configuration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-4xl font-bold mb-8">Ready to Transform Your Business?</h2>
        <button
          onClick={() => navigate('/login')}
          className="px-12 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition"
        >
          Start Now
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-slate-400">
          <p>© 2026 Decentralized ERP System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
