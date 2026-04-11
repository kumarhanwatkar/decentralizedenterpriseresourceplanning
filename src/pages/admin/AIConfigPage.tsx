import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings, Trash2, Save } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { aiConfigAPI } from '@/services/api';

interface Dashboard {
  _id?: string;
  name: string;
  description: string;
  layout: {
    gridSize: number;
    widgets: Array<{
      id: string;
      type: string;
      title: string;
      position: { x: number; y: number; w: number; h: number };
    }>;
  };
  isPublished: boolean;
  createdAt?: string;
}

const AIConfigPage: React.FC = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDashboard, setNewDashboard] = useState({ name: '', description: '' });
  const [error, setError] = useState<string | null>(null);

  // Load existing dashboards
  useEffect(() => {
    loadDashboards();
  }, []);

  const loadDashboards = async () => {
    try {
      setLoading(true);
      const response = await aiConfigAPI.getAll();
      setDashboards(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err) {
      console.error('Error loading dashboards:', err);
      setDashboards([]);
      setError('Failed to load dashboards');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDashboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDashboard.name.trim()) {
      setError('Dashboard name required');
      return;
    }

    try {
      const dashboard: Dashboard = {
        name: newDashboard.name,
        description: newDashboard.description,
        layout: {
          gridSize: 12,
          widgets: [],
        },
        isPublished: false,
      };

      await aiConfigAPI.create(dashboard);
      setNewDashboard({ name: '', description: '' });
      await loadDashboards();
      setError(null);
    } catch (err) {
      console.error('Error creating dashboard:', err);
      setError('Failed to create dashboard');
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id || !window.confirm('Delete this dashboard?')) return;

    try {
      await aiConfigAPI.delete(id);
      await loadDashboards();
      setError(null);
    } catch (err) {
      console.error('Error deleting dashboard:', err);
      setError('Failed to delete dashboard');
    }
  };

  const handlePublish = async (id: string | undefined) => {
    if (!id) return;

    try {
      await aiConfigAPI.update(id, { isPublished: true });
      await loadDashboards();
      setError(null);
    } catch (err) {
      console.error('Error publishing dashboard:', err);
      setError('Failed to publish dashboard');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            AI Dashboard Config
          </h1>
          <p className="text-gray-400 mt-2">Create and manage custom dashboard configurations</p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
            {error}
          </div>
        )}

        {/* Create New Dashboard Form */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2 mb-4">
            <Plus size={20} className="text-cyan-400" />
            Create New Dashboard
          </h2>

          <form onSubmit={handleCreateDashboard} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Dashboard Name *
              </label>
              <input
                type="text"
                value={newDashboard.name}
                onChange={(e) => setNewDashboard({ ...newDashboard, name: e.target.value })}
                placeholder="e.g., Revenue Dashboard"
                className="w-full bg-gray-900/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={newDashboard.description}
                onChange={(e) => setNewDashboard({ ...newDashboard, description: e.target.value })}
                placeholder="Describe this dashboard configuration..."
                rows={2}
                className="w-full bg-gray-900/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus size={18} />
              Create Dashboard
            </button>
          </form>
        </GlassCard>

        {/* Dashboards List */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            {dashboards.length > 0 ? `Dashboards (${dashboards.length})` : 'No Dashboards Yet'}
          </h2>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading dashboards...</div>
          ) : dashboards.length === 0 ? (
            <GlassCard className="p-8 text-center">
              <Settings size={48} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">Create a dashboard to get started</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboards.map((dashboard, index) => (
                <motion.div
                  key={dashboard._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 hover:bg-cyan-500/10 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{dashboard.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">{dashboard.description}</p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          dashboard.isPublished
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {dashboard.isPublished ? 'Published' : 'Draft'}
                      </div>
                    </div>

                    {dashboard.layout?.widgets && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500">
                          Widgets: {dashboard.layout.widgets.length || 0}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {!dashboard.isPublished && (
                        <button
                          onClick={() => handlePublish(dashboard._id)}
                          className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <Save size={16} />
                          Publish
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(dashboard._id)}
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <GlassCard className="p-6 bg-blue-500/10 border border-blue-500/20">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">💡 Dashboard Configuration</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>✓ Create unlimited dashboard configurations</li>
            <li>✓ Add custom widgets and layouts</li>
            <li>✓ Publish configurations for use</li>
            <li>✓ All changes saved to backend automatically</li>
            <li>✓ Real-time sync with database</li>
          </ul>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
};

export default AIConfigPage;
