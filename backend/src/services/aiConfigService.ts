import { AIConfig } from '../models/AIConfig';
import { IAIConfig, IWidget } from '../types';
import { AppError } from '../utils/errors';

class AIConfigService {
  /**
   * Create or save a new AI-generated dashboard config
   */
  async saveAIConfig(
    organizationId: string,
    adminId: string,
    organizationName: string,
    rawInput: string,
    widgets: IWidget[],
    description?: string,
    layout: 'grid' | 'flex' = 'grid',
    gridColumns: number = 4
  ): Promise<IAIConfig> {
    try {
      // Check if config already exists for organization
      let config = await AIConfig.findOne({ organizationId, isActive: true });

      if (config) {
        // Update existing config (increment version)
        config.adminId = adminId;
        config.organizationName = organizationName;
        config.description = description || config.description;
        config.rawInput = rawInput;
        config.widgets = widgets;
        config.layout = layout;
        config.gridColumns = gridColumns;
        config.version = (config.version || 1) + 1;
        config.updatedAt = new Date();
        await config.save();
        return config as IAIConfig;
      } else {
        // Create new config
        const newConfig = new AIConfig({
          organizationId,
          adminId,
          organizationName,
          description: description || '',
          rawInput,
          widgets,
          layout,
          gridColumns,
          version: 1,
          isActive: true,
          isPublished: false,
        });
        await newConfig.save();
        return newConfig as IAIConfig;
      }
    } catch (error) {
      throw new AppError(
        error instanceof Error ? error.message : 'Failed to save AI config',
        500
      );
    }
  }

  /**
   * Retrieve AI config for an organization
   */
  async getAIConfig(organizationId: string): Promise<IAIConfig | null> {
    try {
      const config = await AIConfig.findOne({ organizationId, isActive: true }).populate(
        'adminId',
        'name email'
      );
      return config as IAIConfig | null;
    } catch (error) {
      throw new AppError('Failed to retrieve AI config', 500);
    }
  }

  /**
   * Retrieve AI config by ID
   */
  async getAIConfigById(configId: string): Promise<IAIConfig> {
    try {
      const config = await AIConfig.findById(configId).populate('adminId', 'name email');
      if (!config) {
        throw new AppError('AI config not found', 404);
      }
      return config as IAIConfig;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to retrieve AI config', 500);
    }
  }

  /**
   * Update dashboard layout
   */
  async updateLayout(
    organizationId: string,
    layout: 'grid' | 'flex',
    gridColumns?: number
  ): Promise<IAIConfig> {
    try {
      const config = await AIConfig.findOne({ organizationId, isActive: true });
      if (!config) {
        throw new AppError('AI config not found', 404);
      }

      if (!['grid', 'flex'].includes(layout)) {
        throw new AppError('Invalid layout type. Must be "grid" or "flex"', 400);
      }

      config.layout = layout;
      if (layout === 'grid' && gridColumns) {
        if (gridColumns < 1 || gridColumns > 12) {
          throw new AppError('Grid columns must be between 1 and 12', 400);
        }
        config.gridColumns = gridColumns;
      }
      config.updatedAt = new Date();
      await config.save();
      return config as IAIConfig;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update layout', 500);
    }
  }

  /**
   * Update widgets in dashboard config
   */
  async updateWidgets(organizationId: string, widgets: IWidget[]): Promise<IAIConfig> {
    try {
      const config = await AIConfig.findOne({ organizationId, isActive: true });
      if (!config) {
        throw new AppError('AI config not found', 404);
      }

      // Validate widgets
      if (!Array.isArray(widgets) || widgets.length === 0) {
        throw new AppError('Widgets must be a non-empty array', 400);
      }

      const validTypes = ['stat_card', 'pie_chart', 'bar_chart', 'line_chart', 'table', 'alert'];
      for (const widget of widgets) {
        if (!widget.id || !widget.type || !widget.title || widget.position === undefined) {
          throw new AppError(
            'Each widget must have id, type, title, and position fields',
            400
          );
        }
        if (!validTypes.includes(widget.type)) {
          throw new AppError(`Invalid widget type: ${widget.type}`, 400);
        }
      }

      config.widgets = widgets;
      config.version = (config.version || 1) + 1;
      config.updatedAt = new Date();
      await config.save();
      return config as IAIConfig;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update widgets', 500);
    }
  }

  /**
   * Add a widget to dashboard config
   */
  async addWidget(organizationId: string, widget: IWidget): Promise<IAIConfig> {
    try {
      const config = await AIConfig.findOne({ organizationId, isActive: true });
      if (!config) {
        throw new AppError('AI config not found', 404);
      }

      // Validate widget
      if (!widget.id || !widget.type || !widget.title || widget.position === undefined) {
        throw new AppError('Widget must have id, type, title, and position fields', 400);
      }

      const validTypes = ['stat_card', 'pie_chart', 'bar_chart', 'line_chart', 'table', 'alert'];
      if (!validTypes.includes(widget.type)) {
        throw new AppError(`Invalid widget type: ${widget.type}`, 400);
      }

      // Check if widget with same ID already exists
      const existingIndex = config.widgets.findIndex((w) => w.id === widget.id);
      if (existingIndex >= 0) {
        throw new AppError('Widget with this ID already exists', 409);
      }

      config.widgets.push(widget);
      config.version = (config.version || 1) + 1;
      config.updatedAt = new Date();
      await config.save();
      return config as IAIConfig;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to add widget', 500);
    }
  }

  /**
   * Remove a widget from dashboard config
   */
  async removeWidget(organizationId: string, widgetId: string): Promise<IAIConfig> {
    try {
      const config = await AIConfig.findOne({ organizationId, isActive: true });
      if (!config) {
        throw new AppError('AI config not found', 404);
      }

      const initialLength = config.widgets.length;
      config.widgets = config.widgets.filter((w) => w.id !== widgetId);

      if (config.widgets.length === initialLength) {
        throw new AppError('Widget not found', 404);
      }

      config.version = (config.version || 1) + 1;
      config.updatedAt = new Date();
      await config.save();
      return config as IAIConfig;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to remove widget', 500);
    }
  }

  /**
   * Update a specific widget
   */
  async updateWidget(organizationId: string, widgetId: string, updates: Partial<IWidget>): Promise<IAIConfig> {
    try {
      const config = await AIConfig.findOne({ organizationId, isActive: true });
      if (!config) {
        throw new AppError('AI config not found', 404);
      }

      const widgetIndex = config.widgets.findIndex((w) => w.id === widgetId);
      if (widgetIndex === -1) {
        throw new AppError('Widget not found', 404);
      }

      // Validate type if provided
      if (updates.type) {
        const validTypes = ['stat_card', 'pie_chart', 'bar_chart', 'line_chart', 'table', 'alert'];
        if (!validTypes.includes(updates.type)) {
          throw new AppError(`Invalid widget type: ${updates.type}`, 400);
        }
      }

      // Update widget fields
      config.widgets[widgetIndex] = {
        ...config.widgets[widgetIndex],
        ...updates,
        id: widgetId, // Ensure ID doesn't change
      };

      config.version = (config.version || 1) + 1;
      config.updatedAt = new Date();
      await config.save();
      return config as IAIConfig;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update widget', 500);
    }
  }

  /**
   * Publish AI config
   */
  async publishConfig(organizationId: string): Promise<IAIConfig> {
    try {
      const config = await AIConfig.findOne({ organizationId, isActive: true });
      if (!config) {
        throw new AppError('AI config not found', 404);
      }

      if (config.widgets.length === 0) {
        throw new AppError('Cannot publish config with no widgets', 400);
      }

      config.isPublished = true;
      config.updatedAt = new Date();
      await config.save();
      return config as IAIConfig;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to publish config', 500);
    }
  }

  /**
   * Get all AI configs for admin (with pagination)
   */
  async getAdminConfigs(
    adminId: string,
    limit: number = 10,
    page: number = 1
  ): Promise<{ configs: IAIConfig[]; total: number; pages: number }> {
    try {
      // Validate pagination
      if (limit < 1 || limit > 100) {
        throw new AppError('Limit must be between 1 and 100', 400);
      }
      if (page < 1) {
        throw new AppError('Page must be >= 1', 400);
      }

      const skip = (page - 1) * limit;
      const total = await AIConfig.countDocuments({ adminId });
      const configs = await AIConfig.find({ adminId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('adminId', 'name email');

      return {
        configs: configs as IAIConfig[],
        total,
        pages: Math.ceil(total / limit),
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to retrieve admin configs', 500);
    }
  }

  /**
   * Deactivate AI config
   */
  async deactivateConfig(organizationId: string): Promise<IAIConfig> {
    try {
      const config = await AIConfig.findOne({ organizationId });
      if (!config) {
        throw new AppError('AI config not found', 404);
      }

      config.isActive = false;
      config.updatedAt = new Date();
      await config.save();
      return config as IAIConfig;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to deactivate config', 500);
    }
  }
}

export const aiConfigService = new AIConfigService();
