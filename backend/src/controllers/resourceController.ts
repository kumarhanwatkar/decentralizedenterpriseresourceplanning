import { Request, Response, NextFunction } from 'express';
import { resourceService } from '../services/resourceService';
import { ResourceType, ResourceStatus } from '../types';
import { AppError } from '../utils/errors';

export class ResourceController {
  /**
   * GET /api/resources - Get all resources with filtering
   */
  static async getAllResources(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        type,
        status,
        department,
        minUtilization,
        maxUtilization,
        minEfficiency,
        maxEfficiency,
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query;

      // Validate pagination
      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));

      // Build filters
      const filters: any = {};
      if (type) filters.type = type as ResourceType;
      if (status) filters.status = status as ResourceStatus;
      if (department) filters.department = department;
      if (minUtilization !== undefined) filters.minUtilization = parseFloat(minUtilization as string);
      if (maxUtilization !== undefined) filters.maxUtilization = parseFloat(maxUtilization as string);
      if (minEfficiency !== undefined) filters.minEfficiency = parseFloat(minEfficiency as string);
      if (maxEfficiency !== undefined) filters.maxEfficiency = parseFloat(maxEfficiency as string);

      const result = await resourceService.getAllResources(
        filters,
        pageNum,
        limitNum,
        (sortBy as any) || 'createdAt',
        (sortOrder as 'asc' | 'desc') || 'desc'
      );

      res.status(200).json({
        success: true,
        data: result.resources,
        pagination: {
          total: result.total,
          page: result.page,
          pages: result.pages,
          limit: limitNum,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/resources - Create a new resource
   */
  static async createResource(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        resourceId,
        name,
        type,
        department,
        location,
        serialNumber,
        purchasePrice,
        warrantyExpiry,
      } = req.body;

      // Validate required fields
      if (!resourceId || !name || !type || !department || !location) {
        throw new AppError('Missing required fields: resourceId, name, type, department, location', 400);
      }

      // Validate resource type
      const validTypes: ResourceType[] = ['server', 'machine', 'equipment'];
      if (!validTypes.includes(type)) {
        throw new AppError(`Invalid type. Must be one of: ${validTypes.join(', ')}`, 400);
      }

      const resourceData = {
        resourceId,
        name,
        type,
        department,
        location,
        serialNumber,
        purchasePrice,
        warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : undefined,
      };

      const resource = await resourceService.createResource(resourceData);

      res.status(201).json({
        success: true,
        message: 'Resource created successfully',
        data: resource,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/resources/:id - Get resource by ID
   */
  static async getResourceById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const resource = await resourceService.getResourceById(id);

      res.status(200).json({
        success: true,
        data: resource,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/resources/:id/status - Update resource status
   */
  static async updateResourceStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status, description } = req.body;

      if (!status) {
        throw new AppError('Status is required', 400);
      }

      const validStatuses: ResourceStatus[] = ['operational', 'maintenance', 'offline'];
      if (!validStatuses.includes(status)) {
        throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }

      const resource = await resourceService.updateResourceStatus(id, status, description);

      res.status(200).json({
        success: true,
        message: `Resource status updated to ${status}`,
        data: resource,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/resources/:id/utilization - Update resource utilization
   */
  static async updateResourceUtilization(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { utilization } = req.body;

      if (utilization === undefined) {
        throw new AppError('Utilization is required', 400);
      }

      const resource = await resourceService.updateResourceUtilization(id, utilization);

      res.status(200).json({
        success: true,
        message: 'Resource utilization updated successfully',
        data: resource,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/resources/:id/efficiency - Update resource efficiency
   */
  static async updateResourceEfficiency(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { efficiency } = req.body;

      if (efficiency === undefined) {
        throw new AppError('Efficiency is required', 400);
      }

      const resource = await resourceService.updateResourceEfficiency(id, efficiency);

      res.status(200).json({
        success: true,
        message: 'Resource efficiency updated successfully',
        data: resource,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/resources/:id - Update resource (general)
   */
  static async updateResource(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Don't allow updating certain fields
      delete updateData.resourceId;
      delete updateData.createdAt;

      // Convert date strings if needed
      if (updateData.lastMaintenance) {
        updateData.lastMaintenance = new Date(updateData.lastMaintenance);
      }
      if (updateData.nextMaintenanceScheduled) {
        updateData.nextMaintenanceScheduled = new Date(updateData.nextMaintenanceScheduled);
      }

      const resource = await resourceService.updateResource(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Resource updated successfully',
        data: resource,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/resources/:id - Delete a resource
   */
  static async deleteResource(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const result = await resourceService.deleteResource(id);

      res.status(200).json({
        success: true,
        message: result.message,
        data: { id: result.resourceId },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/resources/filter - Filter resources by type and status
   */
  static async filterResources(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { type, status, page = 1, limit = 20 } = req.query;

      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));

      const result = await resourceService.filterResources(
        type as ResourceType | undefined,
        status as ResourceStatus | undefined,
        pageNum,
        limitNum
      );

      res.status(200).json({
        success: true,
        data: result.resources,
        pagination: {
          total: result.total,
          page: result.page,
          pages: result.pages,
          limit: limitNum,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/resources/department/:department - Get resources by department
   */
  static async getResourcesByDepartment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { department } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));

      const result = await resourceService.getResourcesByDepartment(department, pageNum, limitNum);

      res.status(200).json({
        success: true,
        data: result.resources,
        pagination: {
          total: result.total,
          page: result.page,
          pages: result.pages,
          limit: limitNum,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/resources/stats - Get resource statistics
   */
  static async getResourceStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await resourceService.getResourceStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/resources/efficiency/low - Get low efficiency resources
   */
  static async getLowEfficiencyResources(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { threshold = 70, limit = 10 } = req.query;

      const thresholdNum = parseFloat(threshold as string) || 70;
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));

      const resources = await resourceService.getLowEfficiencyResources(thresholdNum, limitNum);

      res.status(200).json({
        success: true,
        data: resources,
        meta: {
          threshold: thresholdNum,
          count: resources.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/resources/utilization/high - Get high utilization resources
   */
  static async getHighUtilizationResources(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { threshold = 80, limit = 10 } = req.query;

      const thresholdNum = parseFloat(threshold as string) || 80;
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 10));

      const resources = await resourceService.getHighUtilizationResources(thresholdNum, limitNum);

      res.status(200).json({
        success: true,
        data: resources,
        meta: {
          threshold: thresholdNum,
          count: resources.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ResourceController;
