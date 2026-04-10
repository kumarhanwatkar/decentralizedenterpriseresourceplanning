import { Request, Response, NextFunction } from 'express';
import { aiConfigService } from '../services/aiConfigService';
import { IWidget } from '../types';

export class AIConfigController {
  /**
   * Save/Create AI-generated dashboard config
   * POST /api/ai-config
   */
  static async saveAIConfig(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { organizationName, description, rawInput, widgets, layout, gridColumns } =
        req.body;
      const organizationId = (req as any).user?.organizationId;
      const adminId = (req as any).user?.id;

      // Validate required fields
      if (!organizationName || !rawInput || !widgets) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields: organizationName, rawInput, widgets',
        });
        return;
      }

      const config = await aiConfigService.saveAIConfig(
        organizationId!,
        adminId!,
        organizationName,
        rawInput,
        widgets as IWidget[],
        description,
        layout || 'grid',
        gridColumns || 4
      );

      res.status(201).json({
        success: true,
        message: 'AI config saved successfully',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get AI config for organization
   * GET /api/ai-config
   */
  static async getAIConfig(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const organizationId = (req as any).user?.organizationId;

      const config = await aiConfigService.getAIConfig(organizationId!);

      if (!config) {
        res.status(404).json({
          success: false,
          message: 'AI config not found for this organization',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get AI config by ID
   * GET /api/ai-config/:configId
   */
  static async getAIConfigById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { configId } = req.params;

      const config = await aiConfigService.getAIConfigById(configId);

      res.status(200).json({
        success: true,
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update dashboard layout
   * PATCH /api/ai-config/layout
   */
  static async updateLayout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { layout, gridColumns } = req.body;
      const organizationId = (req as any).user?.organizationId;

      if (!layout) {
        res.status(400).json({
          success: false,
          message: 'Layout is required',
        });
        return;
      }

      const config = await aiConfigService.updateLayout(organizationId!, layout, gridColumns);

      res.status(200).json({
        success: true,
        message: 'Layout updated successfully',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update all widgets
   * PUT /api/ai-config/widgets
   */
  static async updateWidgets(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { widgets } = req.body;
      const organizationId = (req as any).user?.organizationId;

      if (!widgets) {
        res.status(400).json({
          success: false,
          message: 'Widgets array is required',
        });
        return;
      }

      const config = await aiConfigService.updateWidgets(organizationId!, widgets as IWidget[]);

      res.status(200).json({
        success: true,
        message: 'Widgets updated successfully',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add a widget
   * POST /api/ai-config/widgets
   */
  static async addWidget(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const widget = req.body;
      const organizationId = (req as any).user?.organizationId;

      if (!widget.id || !widget.type) {
        res.status(400).json({
          success: false,
          message: 'Widget id and type are required',
        });
        return;
      }

      const config = await aiConfigService.addWidget(organizationId!, widget as IWidget);

      res.status(201).json({
        success: true,
        message: 'Widget added successfully',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove a widget
   * DELETE /api/ai-config/widgets/:widgetId
   */
  static async removeWidget(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { widgetId } = req.params;
      const organizationId = (req as any).user?.organizationId;

      const config = await aiConfigService.removeWidget(organizationId!, widgetId);

      res.status(200).json({
        success: true,
        message: 'Widget removed successfully',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a specific widget
   * PATCH /api/ai-config/widgets/:widgetId
   */
  static async updateWidget(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { widgetId } = req.params;
      const updates = req.body;
      const organizationId = (req as any).user?.organizationId;

      const config = await aiConfigService.updateWidget(
        organizationId!,
        widgetId,
        updates as Partial<IWidget>
      );

      res.status(200).json({
        success: true,
        message: 'Widget updated successfully',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Publish AI config
   * PATCH /api/ai-config/publish
   */
  static async publishConfig(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const organizationId = (req as any).user?.organizationId;

      const config = await aiConfigService.publishConfig(organizationId!);

      res.status(200).json({
        success: true,
        message: 'Config published successfully',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all AI configs for admin
   * GET /api/ai-config/admin/all
   */
  static async getAdminConfigs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const adminId = (req as any).user?.id;
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
      const page = Math.max(parseInt(req.query.page as string) || 1, 1);

      const result = await aiConfigService.getAdminConfigs(adminId!, limit, page);

      res.status(200).json({
        success: true,
        data: result.configs,
        pagination: {
          total: result.total,
          page,
          limit,
          pages: result.pages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deactivate AI config
   * PATCH /api/ai-config/deactivate
   */
  static async deactivateConfig(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const organizationId = (req as any).user?.organizationId;

      const config = await aiConfigService.deactivateConfig(organizationId!);

      res.status(200).json({
        success: true,
        message: 'Config deactivated successfully',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }
}

      // Validate required fields
      if (!organizationName || !rawInput || !widgets) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields: organizationName, rawInput, widgets',
        });
        return;
      }

      const config = await aiConfigService.saveAIConfig(
        organizationId!,
        adminId!,
        organizationName,
        rawInput,
        widgets as IWidget[],
        description,
        layout || 'grid',
        gridColumns || 4
      );

      res.status(201).json({
        success: true,
        message: 'AI config saved successfully',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get AI config for organization
   * GET /api/ai-config
   */
  static async getAIConfig(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const organizationId = req.user?.organizationId;

      const config = await aiConfigService.getAIConfig(organizationId!);

      if (!config) {
        res.status(404).json({
          success: false,
          message: 'AI config not found for this organization',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get AI config by ID
   * GET /api/ai-config/:configId
   */
  static async getAIConfigById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { configId } = req.params;

      const config = await aiConfigService.getAIConfigById(configId);

      res.status(200).json({
        success: true,
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update dashboard layout
   * PATCH /api/ai-config/layout
   */
  static async updateLayout(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { layout, gridColumns } = req.body;
      const organizationId = req.user?.organizationId;

      if (!layout) {
        res.status(400).json({
          success: false,
          message: 'Layout is required',
        });
        return;
      }

      const config = await aiConfigService.updateLayout(organizationId!, layout, gridColumns);

      res.status(200).json({
        success: true,
        message: 'Layout updated successfully',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update all widgets
   * PUT /api/ai-config/widgets
   */
  static async updateWidgets(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { widgets } = req.body;
      const organizationId = req.user?.organizationId;

      if (!widgets) {
        res.status(400).json({
          success: false,
          message: 'Widgets array is required',
        });
        return;
      }

      const config = await aiConfigService.updateWidgets(organizationId!, widgets as IWidget[]);

      res.status(200).json({
        success: true,
        message: 'Widgets updated successfully',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Add a widget
   * POST /api/ai-config/widgets
   */
  static async addWidget(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const widget = req.body;
      const organizationId = req.user?.organizationId;

      if (!widget.id || !widget.type) {
        res.status(400).json({
          success: false,
          message: 'Widget id and type are required',
        });
        return;
      }

      const config = await aiConfigService.addWidget(organizationId!, widget as IWidget);

      res.status(201).json({
        success: true,
        message: 'Widget added successfully',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Remove a widget
   * DELETE /api/ai-config/widgets/:widgetId
   */
  static async removeWidget(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { widgetId } = req.params;
      const organizationId = req.user?.organizationId;

      const config = await aiConfigService.removeWidget(organizationId!, widgetId);

      res.status(200).json({
        success: true,
        message: 'Widget removed successfully',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a specific widget
   * PATCH /api/ai-config/widgets/:widgetId
   */
  static async updateWidget(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { widgetId } = req.params;
      const updates = req.body;
      const organizationId = req.user?.organizationId;

      const config = await aiConfigService.updateWidget(
        organizationId!,
        widgetId,
        updates as Partial<IWidget>
      );

      res.status(200).json({
        success: true,
        message: 'Widget updated successfully',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Publish AI config
   * PATCH /api/ai-config/publish
   */
  static async publishConfig(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const organizationId = req.user?.organizationId;

      const config = await aiConfigService.publishConfig(organizationId!);

      res.status(200).json({
        success: true,
        message: 'Config published successfully',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all AI configs for admin
   * GET /api/ai-config/admin/all
   */
  static async getAdminConfigs(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const adminId = req.user?.id;
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
      const page = Math.max(parseInt(req.query.page as string) || 1, 1);

      const result = await aiConfigService.getAdminConfigs(adminId!, limit, page);

      res.status(200).json({
        success: true,
        data: result.configs,
        pagination: {
          total: result.total,
          page,
          limit,
          pages: result.pages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deactivate AI config
   * PATCH /api/ai-config/deactivate
   */
  static async deactivateConfig(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const organizationId = req.user?.organizationId;

      const config = await aiConfigService.deactivateConfig(organizationId!);

      res.status(200).json({
        success: true,
        message: 'Config deactivated successfully',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }
}
