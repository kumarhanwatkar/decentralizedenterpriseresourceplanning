import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Sparkles,
  Send,
  RefreshCw,
  CheckCircle,
  Settings,
  Code,
  LayoutDashboard,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';

interface GeneratedWidget {
  id: string;
  type: 'stat' | 'chart' | 'table' | 'list';
  title: string;
  config: any;
}

const AIConfigPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState<string | null>(null);
  const [widgets, setWidgets] = useState<GeneratedWidget[]>([]);

  const examplePrompts = [
    '10 CNC machines, 50 workers, 3 departments: Manufacturing, QA, Assembly',
    '25 employees across Engineering and Sales with monthly payroll of $125,000',
    'Small startup with 8 developers, 2 designers, and cloud infrastructure costs',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockConfig = {
      organization: {
        name: 'TechForge Industries',
        departments: ['Manufacturing', 'QA', 'Assembly'],
        totalEmployees: 50,
      },
      resources: {
        machines: 10,
        type: 'CNC',
        utilizationTarget: 85,
      },
      widgets: [
        { id: '1', type: 'stat', title: 'Total Workforce', config: { value: 50, icon: 'users' } },
        { id: '2', type: 'stat', title: 'Active Machines', config: { value: 10, icon: 'server' } },
        { id: '3', type: 'chart', title: 'Department Distribution', config: { type: 'pie' } },
        { id: '4', type: 'chart', title: 'Payroll Trend', config: { type: 'line' } },
        { id: '5', type: 'table', title: 'Top Performers', config: { rows: 5 } },
        { id: '6', type: 'stat', title: 'Avg Utilization', config: { value: 87, suffix: '%' } },
      ],
    };

    setGeneratedConfig(JSON.stringify(mockConfig, null, 2));
    setWidgets(mockConfig.widgets as GeneratedWidget[]);
    setIsGenerating(false);
  };

  const handleApplyConfig = () => {
    // Apply configuration to dashboard
    alert('Dashboard configuration applied! Your AI-generated widgets are now active.');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">AI Dashboard Generator</h1>
            <p className="text-muted-foreground">Describe your organization to auto-generate dashboards</p>
          </div>
        </div>

        {/* AI Input Section */}
        <GlassCard className="p-6" variant="glow" neonColor="purple">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-secondary/10">
              <Bot className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold">Natural Language Input</h2>
              <p className="text-sm text-muted-foreground">
                Describe your organization in plain English
              </p>
            </div>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., '10 CNC machines, 50 workers, 3 departments: Manufacturing, QA, Assembly. Monthly payroll budget of $150,000 with average hourly rate of $25.'"
            className="w-full h-32 p-4 rounded-xl bg-muted border-none focus:ring-2 focus:ring-secondary outline-none resize-none mb-4"
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setPrompt(example)}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
                >
                  Example {index + 1}
                </button>
              ))}
            </div>
            <NeonButton onClick={handleGenerate} loading={isGenerating}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Dashboard
            </NeonButton>
          </div>
        </GlassCard>

        {/* Generated Output */}
        {generatedConfig && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* JSON Config */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard className="p-6 h-full" variant="default">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Code className="w-5 h-5 text-primary" />
                    <h3 className="font-display font-bold">Generated Configuration</h3>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedConfig)}
                    className="text-sm text-primary hover:underline"
                  >
                    Copy
                  </button>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm font-mono text-muted-foreground">
                  {generatedConfig}
                </pre>
              </GlassCard>
            </motion.div>

            {/* Widget Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-6 h-full" variant="default">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-5 h-5 text-primary" />
                    <h3 className="font-display font-bold">Widget Preview</h3>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {widgets.length} widgets generated
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {widgets.map((widget) => (
                    <div
                      key={widget.id}
                      className="p-4 rounded-lg bg-muted/50 border border-border/50"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-xs text-muted-foreground capitalize">{widget.type}</span>
                      </div>
                      <p className="text-sm font-medium truncate">{widget.title}</p>
                    </div>
                  ))}
                </div>

                <NeonButton className="w-full" onClick={handleApplyConfig}>
                  <Settings className="w-4 h-4 mr-2" />
                  Apply to Dashboard
                </NeonButton>
              </GlassCard>
            </motion.div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: Bot,
              title: 'Natural Language Processing',
              description: 'Our AI understands plain English descriptions of your organization structure.',
            },
            {
              icon: Sparkles,
              title: 'Smart Widget Generation',
              description: 'Automatically creates relevant charts, stats, and tables based on your data.',
            },
            {
              icon: RefreshCw,
              title: 'Dynamic Updates',
              description: 'Re-generate anytime as your organization evolves and grows.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <GlassCard className="p-6" variant="neon" neonColor="cyan">
                <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIConfigPage;
