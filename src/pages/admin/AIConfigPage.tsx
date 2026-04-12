import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings, Trash2, Save, Check, AlertCircle } from 'lucide-react';
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
  const [creating, setCreating] = useState(false);
  const [newDashboard, setNewDashboard] = useState({ name: '', description: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load existing dashboards
  useEffect(() => {
    loadDashboards();
  }, []);

  const loadDashboards = async () => {
    try {
      setLoading(true);
      const response = await aiConfigAPI.getAll();
      setDashboards(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error('Error loading dashboards:', err);
      setDashboards([]);
      setError('Failed to load dashboards from backend');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDashboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDashboard.name.trim()) {
      setError('Dashboard name is required');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      
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
      setSuccess('Dashboard created successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
      // Reload dashboards
      await loadDashboards();
    } catch (err) {
      console.error('Error creating dashboard:', err);
      setError('Failed to create dashboard. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id || !window.confirm('Are you sure you want to delete this dashboard?')) return;

    try {
      setError(null);
      await aiConfigAPI.delete(id);
      setSuccess('Dashboard deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
      await loadDashboards();
    } catch (err) {
      console.error('Error deleting dashboard:', err);
      setError('Failed to delete dashboard');
    }
  };

  const handlePublish = async (id: string | undefined) => {
    if (!id) return;

    try {
      setError(null);
      await aiConfigAPI.publish();
      setSuccess('Dashboard published successfully!');
      setTimeout(() => setSuccess(null), 3000);
      await loadDashboards();
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
          <h1 className="text-3xl font-bold text-white mb-2">AI Dashboard Config</h1>
          <p className="text-text-secondary">Create and manage custom dashboard configurations with real-time persistence</p>
        </motion.div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert alert-success flex items-center gap-3"
          >
            <Check className="w-5 h-5" />
            <span>{success}</span>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert alert-error flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Create New Dashboard Form */}
        <GlassCard className="p-6" variant="default">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-secondary" />
            Create New Dashboard
          </h2>

          <form onSubmit={handleCreateDashboard} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Dashboard Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={newDashboard.name}
                onChange={(e) => setNewDashboard({ ...newDashboard, name: e.target.value })}
                placeholder="e.g., Revenue Overview Dashboard"
                className="w-full px-4 py-2.5 rounded-lg bg-bg-input border border-border-color-light text-white placeholder-text-muted focus:outline-none focus:border-primary focus:shadow-lg transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Description
              </label>
              <textarea
                value={newDashboard.description}
                onChange={(e) => setNewDashboard({ ...newDashboard, description: e.target.value })}
                placeholder="Describe this dashboard configuration and its purpose..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-bg-input border border-border-color-light text-white placeholder-text-muted focus:outline-none focus:border-primary focus:shadow-lg transition-all resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating}
                className="button button-primary flex-1"
              >
                <Plus className="w-4 h-4" />
                {creating ? 'Creating...' : 'Create Dashboard'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewDashboard({ name: '', description: '' });
                  setError(null);
                }}
                className="button button-ghost flex-1"
              >
                Clear
              </button>
            </div>
          </form>
        </GlassCard>

        {/* Dashboards List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              {dashboards.length > 0 
                ? `Dashboards (${dashboards.length})` 
                : 'No Dashboards Yet'}
            </h2>
            <button
              onClick={loadDashboards}
              disabled={loading}
              className="button button-secondary button-sm"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {loading ? (
            <GlassCard className="p-8 text-center" variant="default">
              <div className="flex justify-center mb-4">
                <div className="spinner spinner-lg"></div>
              </div>
              <p className="text-text-tertiary">Loading dashboards...</p>
            </GlassCard>
          ) : dashboards.length === 0 ? (
            <GlassCard className="p-8 text-center" variant="default">
              <Settings className="w-12 h-12 mx-auto text-text-tertiary mb-4 opacity-50" />
              <p className="text-text-tertiary mb-4">No dashboards created yet</p>
              <p className="text-text-muted text-sm">Create your first dashboard above to get started</p>
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
                  <GlassCard className="p-6" variant="default">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 pr-4">
                        <h3 className="text-lg font-bold text-white mb-1">{dashboard.name}</h3>
                        <p className="text-text-secondary text-sm mb-2">{dashboard.description || 'No description'}</p>
                        {dashboard.layout?.widgets && (
                          <p className="text-text-muted text-xs">
                            {dashboard.layout.widgets.length} widget{dashboard.layout.widgets.length !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                          dashboard.isPublished
                            ? 'badge-success'
                            : 'badge-warning'
                        }`}
                      >
                        {dashboard.isPublished ? '✓ Published' : '◯ Draft'}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!dashboard.isPublished && (
                        <button
                          onClick={() => handlePublish(dashboard._id)}
                          className="button button-success button-sm flex-1 text-sm"
                        >
                          <Save className="w-3 h-3" />
                          Publish
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(dashboard._id)}
                        className="button button-danger button-sm flex-1 text-sm"
                      >
                        <Trash2 className="w-3 h-3" />
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
        <GlassCard className="p-6 bg-primary/10 border border-primary/30" variant="default">
          <h3 className="text-lg font-bold text-secondary mb-3 flex items-center gap-2">
            💡 Dashboard Features
          </h3>
          <ul className="space-y-2 text-text-secondary text-sm">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              Create unlimited dashboard configurations
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              Customize widgets and layouts
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              Publish configurations for production use
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              Real-time persistence to backend
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              Automatic synchronization across all sessions
            </li>
          </ul>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
};

export default AIConfigPage;
