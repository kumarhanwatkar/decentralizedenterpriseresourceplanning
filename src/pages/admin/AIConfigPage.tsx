import { useState } from 'react';
import { Sparkles, Loader, Check } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const AIConfigPage = () => {
  const { isDark } = useTheme();
  const [input, setInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [config, setConfig] = useState(null);

  const examples = [
    '10 CNC machines, 50 workers, 3 departments: Manufacturing, QA, Assembly. Monthly payroll $150,000 with average hourly rate of $25.',
    '5 Data Center Servers, 20 engineers, 2 teams: Backend, DevOps. Monthly payroll $120,000 with average hourly rate of $30.',
    '100 employees across 5 departments, 50 office desks, 10 meeting rooms, 3 warehouses. Monthly payroll $500,000.',
  ];

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setConfig({
        employees: Math.floor(Math.random() * 50) + 5,
        resources: Math.floor(Math.random() * 10) + 3,
        monthlyPayroll: Math.floor(Math.random() * 400000) + 50000,
        hourlyRate: Math.floor(Math.random() * 50) + 15,
        recommendations: [
          'Implement streaming payroll for improved cash flow management',
          'Optimize resource allocation based on usage patterns',
          'Set up automated yield generation on 85% of wages',
          'Configure department-based role hierarchies',
        ],
      });
      setGenerating(false);
    }, 2000);
  };

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isDark ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className={`flex items-center gap-3 mb-4 ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
            <Sparkles size={32} />
            <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              AI Config
            </h1>
          </div>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Describe your organization in plain English and let AI generate the perfect configuration
          </p>
        </div>

        {/* Input Section */}
        <div className={`p-8 rounded-lg border mb-8 ${isDark ? 'bg-blue-900/20 border-blue-500/30' : 'bg-white border-gray-200'}`}>
          <label className={`block text-sm font-medium mb-4 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            Natural Language Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your organization in plain English..."
            className={`w-full p-4 rounded-lg border transition-all resize-none h-32 ${
              isDark
                ? 'bg-slate-800 border-blue-500/30 text-white placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
            }`}
          />

          {/* Examples */}
          <div className="mt-6">
            <p className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Or use an example:
            </p>
            <div className="grid gap-2">
              {examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setInput(example)}
                  className={`text-left p-3 rounded-lg border transition-all hover:scale-105 ${
                    isDark
                      ? 'bg-blue-900/30 border-blue-500/30 text-gray-300 hover:border-cyan-500/50'
                      : 'bg-gray-100 border-gray-300 text-gray-600 hover:border-blue-400'
                  }`}
                >
                  Example {i + 1}: {example.substring(0, 50)}...
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!input.trim() || generating}
            className={`w-full mt-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              isDark
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-600 hover:to-indigo-700 disabled:opacity-50'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50'
            }`}
          >
            {generating ? (
              <>
                <Loader size={20} className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles size={20} /> Generate Configuration
              </>
            )}
          </button>
        </div>

        {/* Generated Config */}
        {config && (
          <div className={`p-8 rounded-lg border ${isDark ? 'bg-blue-900/20 border-blue-500/30' : 'bg-white border-gray-200'}`}>
            <div className={`flex items-center gap-2 mb-6 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              <Check size={24} /> Configuration Generated
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Employees', value: config.employees },
                { label: 'Resources', value: config.resources },
                { label: 'Monthly Payroll', value: `$${config.monthlyPayroll.toLocaleString()}` },
                { label: 'Hourly Rate', value: `$${config.hourlyRate}` },
              ].map((metric, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg border text-center ${
                    isDark
                      ? 'bg-blue-900/30 border-blue-500/30'
                      : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {metric.label}
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-cyan-400' : 'text-blue-600'}`}>
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                AI Recommendations
              </h3>
              <div className="space-y-2">
                {config.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg flex items-start gap-3 ${
                      isDark
                        ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
                        : 'bg-blue-50 border border-blue-200 text-blue-700'
                    }`}
                  >
                    <Check size={20} className="flex-shrink-0 mt-0.5" />
                    <p>{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <button
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  isDark
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'
                    : 'bg-blue-100 text-blue-600 border border-blue-300 hover:bg-blue-200'
                }`}
              >
                Apply Configuration
              </button>
              <button
                onClick={() => {
                  setConfig(null);
                  setInput('');
                }}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  isDark
                    ? 'bg-blue-900/30 text-gray-300 border border-blue-500/30 hover:bg-blue-900/50'
                    : 'bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300'
                }`}
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIConfigPage;
