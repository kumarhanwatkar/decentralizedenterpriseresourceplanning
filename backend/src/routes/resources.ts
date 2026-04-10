import { Router, Request, Response, NextFunction } from 'express';
import ResourceController from '../controllers/resourceController';
import { authenticateToken, authorize } from '../middleware/authentication';

const router = Router();

// Middleware to protect all routes
router.use(authenticateToken);

/**
 * @route   GET /api/resources
 * @desc    Get all resources with filtering and pagination
 * @access  Private
 * @query   page, limit, type, status, department, minUtilization, maxUtilization, minEfficiency, maxEfficiency, sortBy, sortOrder
 */
router.get('/', ResourceController.getAllResources);

/**
 * @route   GET /api/resources/stats
 * @desc    Get resource statistics
 * @access  Private
 */
router.get('/stats', ResourceController.getResourceStats);

/**
 * @route   GET /api/resources/efficiency/low
 * @desc    Get low efficiency resources
 * @access  Private
 * @query   threshold (default 70), limit (default 10)
 */
router.get('/efficiency/low', ResourceController.getLowEfficiencyResources);

/**
 * @route   GET /api/resources/utilization/high
 * @desc    Get high utilization resources
 * @access  Private
 * @query   threshold (default 80), limit (default 10)
 */
router.get('/utilization/high', ResourceController.getHighUtilizationResources);

/**
 * @route   GET /api/resources/filter
 * @desc    Filter resources by type and status
 * @access  Private
 * @query   type, status, page, limit
 */
router.get('/filter', ResourceController.filterResources);

/**
 * @route   GET /api/resources/department/:department
 * @desc    Get resources by department
 * @access  Private
 * @params  department
 * @query   page, limit
 */
router.get('/department/:department', ResourceController.getResourcesByDepartment);

/**
 * @route   POST /api/resources
 * @desc    Create a new resource
 * @access  Private/Admin
 * @body    resourceId, name, type, department, location, [serialNumber, purchasePrice, warrantyExpiry]
 */
router.post('/', authorize(['admin']), ResourceController.createResource);

/**
 * @route   GET /api/resources/:id
 * @desc    Get resource by ID
 * @access  Private
 * @params  id
 */
router.get('/:id', ResourceController.getResourceById);

/**
 * @route   PATCH /api/resources/:id/status
 * @desc    Update resource status (operational, maintenance, offline)
 * @access  Private/Admin
 * @params  id
 * @body    status, [description]
 */
router.patch('/:id/status', authorize(['admin']), ResourceController.updateResourceStatus);

/**
 * @route   PATCH /api/resources/:id/utilization
 * @desc    Update resource utilization (0-100)
 * @access  Private/Admin
 * @params  id
 * @body    utilization
 */
router.patch('/:id/utilization', authorize(['admin']), ResourceController.updateResourceUtilization);

/**
 * @route   PATCH /api/resources/:id/efficiency
 * @desc    Update resource efficiency (0-100)
 * @access  Private/Admin
 * @params  id
 * @body    efficiency
 */
router.patch('/:id/efficiency', authorize(['admin']), ResourceController.updateResourceEfficiency);

/**
 * @route   PATCH /api/resources/:id
 * @desc    Update resource (general update)
 * @access  Private/Admin
 * @params  id
 * @body    name, department, location, utilization, efficiency, lastMaintenance, nextMaintenanceScheduled, maintenanceCost
 */
router.patch('/:id', authorize(['admin']), ResourceController.updateResource);

/**
 * @route   DELETE /api/resources/:id
 * @desc    Delete a resource
 * @access  Private/Admin
 * @params  id
 */
router.delete('/:id', authorize(['admin']), ResourceController.deleteResource);

export default router;
