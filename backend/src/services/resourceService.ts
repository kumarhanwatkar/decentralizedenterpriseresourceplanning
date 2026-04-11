import Resource from '../models/Resource';
import { IResource, ResourceType, ResourceStatus } from '../types';
import { AppError } from '../utils/errors';

interface ResourceFilters {
  type?: ResourceType;
  status?: ResourceStatus;
  department?: string;
  minUtilization?: number;
  maxUtilization?: number;
  minEfficiency?: number;
  maxEfficiency?: number;
}

interface ResourceQuery {
  type?: ResourceType;
  status?: ResourceStatus;
  department?: string;
  utilization?: { $gte?: number; $lte?: number };
  efficiency?: { $gte?: number; $lte?: number };
}

export class ResourceService {
  /**
   * Create a new resource
   */
  async createResource(resourceData: {
    resourceId: string;
    name: string;
    type: ResourceType;
    department: string;
    location: string;
    serialNumber?: string;
    purchasePrice?: number;
    warrantyExpiry?: Date;
    description?: string;
  }): Promise<IResource> {
    try {
      // Validate input
      if (!resourceData.resourceId || !resourceData.name) {
        throw new AppError('resourceId and name are required', 400);
      }

      // Check if resource ID already exists
      const existingResource = await Resource.findOne({ resourceId: resourceData.resourceId });
      if (existingResource) {
        throw new AppError('Resource with this ID already exists', 409);
      }

      // Create resource with default status as operational
      const resource = new Resource({
        ...resourceData,
        status: 'operational',
        utilization: 0,
        efficiency: 100,
      });

      await resource.save();
      return resource.toObject() as IResource;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to create resource', 500);
    }
  }

  /**
   * Get all resources with filtering and pagination
   */
  async getAllResources(
    filters?: ResourceFilters,
    page: number = 1,
    limit: number = 20,
    sortBy: 'name' | 'utilization' | 'efficiency' | 'createdAt' = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{ resources: IResource[]; total: number; page: number; pages: number }> {
    try {
      const query: ResourceQuery = {};

      if (filters?.type) query.type = filters.type;
      if (filters?.status) query.status = filters.status;
      if (filters?.department) query.department = filters.department;

      if (filters?.minUtilization !== undefined || filters?.maxUtilization !== undefined) {
        query.utilization = {};
        if (filters.minUtilization !== undefined) query.utilization.$gte = filters.minUtilization;
        if (filters.maxUtilization !== undefined) query.utilization.$lte = filters.maxUtilization;
      }

      if (filters?.minEfficiency !== undefined || filters?.maxEfficiency !== undefined) {
        query.efficiency = {};
        if (filters.minEfficiency !== undefined) query.efficiency.$gte = filters.minEfficiency;
        if (filters.maxEfficiency !== undefined) query.efficiency.$lte = filters.maxEfficiency;
      }

      const skip = (page - 1) * limit;
      const sortObj: Record<string, 1 | -1> = {};
      sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const [resources, total] = await Promise.all([
        Resource.find(query).sort(sortObj).skip(skip).limit(limit).lean(),
        Resource.countDocuments(query),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        resources: resources as IResource[],
        total,
        page,
        pages,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch resources', 500);
    }
  }

  /**
   * Get resource by ID
   */
  async getResourceById(resourceId: string): Promise<IResource> {
    try {
      const resource = await Resource.findById(resourceId);

      if (!resource) {
        throw new AppError('Resource not found', 404);
      }

      return resource.toObject() as IResource;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch resource', 500);
    }
  }

  /**
   * Get resource by resource ID string
   */
  async getResourceByResourceId(resourceId: string): Promise<IResource> {
    try {
      const resource = await Resource.findOne({ resourceId });

      if (!resource) {
        throw new AppError('Resource not found', 404);
      }

      return resource.toObject() as IResource;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch resource', 500);
    }
  }

  /**
   * Update resource status (operational, maintenance, offline)
   */
  async updateResourceStatus(
    resourceId: string,
    status: ResourceStatus,
    // description?: string // Removed unused variable
  ): Promise<IResource> {
    try {
      const validStatuses: ResourceStatus[] = ['operational', 'maintenance', 'offline'];

      if (!validStatuses.includes(status)) {
        throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }

      const resource = await Resource.findByIdAndUpdate(
        resourceId,
        {
          $set: {
            status,
            ...(status === 'maintenance' && { lastMaintenance: new Date() }),
          },
        },
        { new: true }
      );

      if (!resource) {
        throw new AppError('Resource not found', 404);
      }

      return resource.toObject() as IResource;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update resource status', 500);
    }
  }

  /**
   * Update resource utilization
   */
  async updateResourceUtilization(resourceId: string, utilization: number): Promise<IResource> {
    try {
      if (utilization < 0 || utilization > 100) {
        throw new AppError('Utilization must be between 0 and 100', 400);
      }

      const resource = await Resource.findByIdAndUpdate(
        resourceId,
        { $set: { utilization } },
        { new: true }
      );

      if (!resource) {
        throw new AppError('Resource not found', 404);
      }

      return resource.toObject() as IResource;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update resource utilization', 500);
    }
  }

  /**
   * Update resource efficiency
   */
  async updateResourceEfficiency(resourceId: string, efficiency: number): Promise<IResource> {
    try {
      if (efficiency < 0 || efficiency > 100) {
        throw new AppError('Efficiency must be between 0 and 100', 400);
      }

      const resource = await Resource.findByIdAndUpdate(
        resourceId,
        { $set: { efficiency } },
        { new: true }
      );

      if (!resource) {
        throw new AppError('Resource not found', 404);
      }

      return resource.toObject() as IResource;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update resource efficiency', 500);
    }
  }

  /**
   * Update resource (general update)
   */
  async updateResource(
    resourceId: string,
    updateData: Partial<{
      name: string;
      department: string;
      location: string;
      utilization: number;
      efficiency: number;
      lastMaintenance: Date;
      nextMaintenanceScheduled: Date;
      maintenanceCost: number;
    }>
  ): Promise<IResource> {
    try {
      // Validate numeric fields
      if (updateData.utilization !== undefined && (updateData.utilization < 0 || updateData.utilization > 100)) {
        throw new AppError('Utilization must be between 0 and 100', 400);
      }

      if (updateData.efficiency !== undefined && (updateData.efficiency < 0 || updateData.efficiency > 100)) {
        throw new AppError('Efficiency must be between 0 and 100', 400);
      }

      if (updateData.maintenanceCost !== undefined && updateData.maintenanceCost < 0) {
        throw new AppError('Maintenance cost cannot be negative', 400);
      }

      const resource = await Resource.findByIdAndUpdate(resourceId, { $set: updateData }, { new: true });

      if (!resource) {
        throw new AppError('Resource not found', 404);
      }

      return resource.toObject() as IResource;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update resource', 500);
    }
  }

  /**
   * Delete resource
   */
  async deleteResource(resourceId: string): Promise<{ message: string; resourceId: string }> {
    try {
      const resource = await Resource.findByIdAndDelete(resourceId);

      if (!resource) {
        throw new AppError('Resource not found', 404);
      }

      return {
        message: 'Resource deleted successfully',
        resourceId: resource._id.toString(),
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to delete resource', 500);
    }
  }

  /**
   * Filter resources by type and status
   */
  async filterResources(
    type?: ResourceType,
    status?: ResourceStatus,
    page: number = 1,
    limit: number = 20
  ): Promise<{ resources: IResource[]; total: number; page: number; pages: number }> {
    try {
      const query: Record<string, any> = {};

      if (type) query.type = type;
      if (status) query.status = status;

      const skip = (page - 1) * limit;

      const [resources, total] = await Promise.all([
        Resource.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Resource.countDocuments(query),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        resources: resources as IResource[],
        total,
        page,
        pages,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to filter resources', 500);
    }
  }

  /**
   * Get resources by department
   */
  async getResourcesByDepartment(
    department: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ resources: IResource[]; total: number; page: number; pages: number }> {
    try {
      const skip = (page - 1) * limit;

      const [resources, total] = await Promise.all([
        Resource.find({ department }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Resource.countDocuments({ department }),
      ]);

      const pages = Math.ceil(total / limit);

      return {
        resources: resources as IResource[],
        total,
        page,
        pages,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch department resources', 500);
    }
  }

  /**
   * Get resource statistics
   */
  async getResourceStats(): Promise<{
    totalResources: number;
    byStatus: Record<ResourceStatus, number>;
    byType: Record<ResourceType, number>;
    averageUtilization: number;
    averageEfficiency: number;
    maintenanceRequired: number;
    offline: number;
  }> {
    try {
      const [
        totalCount,
        byStatus,
        byType,
        utilStats,
        maintenanceCount,
        offlineCount,
      ] = await Promise.all([
        Resource.countDocuments(),
        Resource.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        Resource.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
        Resource.aggregate([
          {
            $group: {
              _id: null,
              avgUtilization: { $avg: '$utilization' },
              avgEfficiency: { $avg: '$efficiency' },
            },
          },
        ]),
        Resource.countDocuments({ status: 'maintenance' }),
        Resource.countDocuments({ status: 'offline' }),
      ]);

      const byStatusObj = byStatus.reduce(
        (acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        },
        {} as Record<ResourceStatus, number>
      );

      const byTypeObj = byType.reduce(
        (acc: any, item: any) => {
          acc[item._id] = item.count;
          return acc;
        },
        {} as Record<ResourceType, number>
      );

      return {
        totalResources: totalCount,
        byStatus: byStatusObj,
        byType: byTypeObj,
        averageUtilization: utilStats[0]?.avgUtilization || 0,
        averageEfficiency: utilStats[0]?.avgEfficiency || 0,
        maintenanceRequired: maintenanceCount,
        offline: offlineCount,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to get resource statistics', 500);
    }
  }

  /**
   * Get low efficiency resources
   */
  async getLowEfficiencyResources(threshold: number = 70, limit: number = 10): Promise<IResource[]> {
    try {
      if (threshold < 0 || threshold > 100) {
        throw new AppError('Threshold must be between 0 and 100', 400);
      }

      const resources = await Resource.find({ efficiency: { $lt: threshold } })
        .sort({ efficiency: 1 })
        .limit(limit)
        .lean();

      return resources as IResource[];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch low efficiency resources', 500);
    }
  }

  /**
   * Get high utilization resources
   */
  async getHighUtilizationResources(threshold: number = 80, limit: number = 10): Promise<IResource[]> {
    try {
      if (threshold < 0 || threshold > 100) {
        throw new AppError('Threshold must be between 0 and 100', 400);
      }

      const resources = await Resource.find({ utilization: { $gte: threshold } })
        .sort({ utilization: -1 })
        .limit(limit)
        .lean();

      return resources as IResource[];
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to fetch high utilization resources', 500);
    }
  }
}

export const resourceService = new ResourceService();
