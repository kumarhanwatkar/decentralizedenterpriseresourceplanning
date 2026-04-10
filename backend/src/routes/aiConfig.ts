import { Router } from 'express';
import { AIConfigController } from '../controllers/aiConfigController';
import { authenticateToken, isAdmin } from '../middleware/authentication';

const router = Router();

/**
 * AI Config Routes
 * Base path: /api/ai-config
 */

// Middleware
router.use(authenticateToken);

/**
 * @route   POST /api/ai-config
 * @desc    Save/Create AI-generated dashboard config
 * @access  Admin
 * @body    { organizationName, description, rawInput, widgets, layout?, gridColumns? }
 */
router.post('/', isAdmin, AIConfigController.saveAIConfig);

/**
 * @route   GET /api/ai-config
 * @desc    Get AI config for current organization
 * @access  Private
 */
router.get('/', AIConfigController.getAIConfig);

/**
 * @route   PATCH /api/ai-config/layout
 * @desc    Update dashboard layout
 * @access  Admin
 * @body    { layout, gridColumns? }
 */
router.patch('/layout', isAdmin, AIConfigController.updateLayout);

/**
 * @route   PUT /api/ai-config/widgets
 * @desc    Update all widgets
 * @access  Admin
 * @body    { widgets: IWidget[] }
 */
router.put('/widgets', isAdmin, AIConfigController.updateWidgets);

/**
 * @route   POST /api/ai-config/widgets
 * @desc    Add a widget to dashboard
 * @access  Admin
 * @body    { id, type, title, position, size?, dataSource, configuration? }
 */
router.post('/widgets', isAdmin, AIConfigController.addWidget);

/**
 * @route   PATCH /api/ai-config/widgets/:widgetId
 * @desc    Update a specific widget
 * @access  Admin
 * @body    { partial widget fields }
 */
router.patch('/widgets/:widgetId', isAdmin, AIConfigController.updateWidget);

/**
 * @route   DELETE /api/ai-config/widgets/:widgetId
 * @desc    Remove a widget from dashboard
 * @access  Admin
 */
router.delete('/widgets/:widgetId', isAdmin, AIConfigController.removeWidget);

/**
 * @route   PATCH /api/ai-config/publish
 * @desc    Publish AI config
 * @access  Admin
 */
router.patch('/publish', isAdmin, AIConfigController.publishConfig);

/**
 * @route   PATCH /api/ai-config/deactivate
 * @desc    Deactivate AI config
 * @access  Admin
 */
router.patch('/deactivate', isAdmin, AIConfigController.deactivateConfig);

/**
 * @route   GET /api/ai-config/admin/all
 * @desc    Get all AI configs for admin
 * @access  Admin
 * @query   { limit?, page? }
 */
router.get('/admin/all', isAdmin, AIConfigController.getAdminConfigs);

/**
 * @route   GET /api/ai-config/:configId
 * @desc    Get AI config by ID
 * @access  Private
 */
router.get('/:configId', AIConfigController.getAIConfigById);

export default router;

/**
 * @route   GET /api/ai-config
 * @desc    Get AI config for current organization
 * @access  Private
 */
router.get('/', AIConfigController.getAIConfig);

/**
 * @route   PATCH /api/ai-config/layout
 * @desc    Update dashboard layout
 * @access  Admin
 * @body    { layout, gridColumns? }
 */
router.patch('/layout', authorize(['admin']), AIConfigController.updateLayout);

/**
 * @route   PUT /api/ai-config/widgets
 * @desc    Update all widgets
 * @access  Admin
 * @body    { widgets: IWidget[] }
 */
router.put('/widgets', authorize(['admin']), AIConfigController.updateWidgets);

/**
 * @route   POST /api/ai-config/widgets
 * @desc    Add a widget to dashboard
 * @access  Admin
 * @body    { id, type, title, position, size?, dataSource, configuration? }
 */
router.post('/widgets', authorize(['admin']), AIConfigController.addWidget);

/**
 * @route   PATCH /api/ai-config/widgets/:widgetId
 * @desc    Update a specific widget
 * @access  Admin
 * @body    { partial widget fields }
 */
router.patch('/widgets/:widgetId', authorize(['admin']), AIConfigController.updateWidget);

/**
 * @route   DELETE /api/ai-config/widgets/:widgetId
 * @desc    Remove a widget from dashboard
 * @access  Admin
 */
router.delete('/widgets/:widgetId', authorize(['admin']), AIConfigController.removeWidget);

/**
 * @route   PATCH /api/ai-config/publish
 * @desc    Publish AI config
 * @access  Admin
 */
router.patch('/publish', authorize(['admin']), AIConfigController.publishConfig);

/**
 * @route   PATCH /api/ai-config/deactivate
 * @desc    Deactivate AI config
 * @access  Admin
 */
router.patch('/deactivate', authorize(['admin']), AIConfigController.deactivateConfig);

/**
 * @route   GET /api/ai-config/admin/all
 * @desc    Get all AI configs for admin
 * @access  Admin
 * @query   { limit?, page? }
 */
router.get('/admin/all', authorize(['admin']), AIConfigController.getAdminConfigs);

/**
 * @route   GET /api/ai-config/:configId
 * @desc    Get AI config by ID
 * @access  Private
 */
router.get('/:configId', AIConfigController.getAIConfigById);

export default router;
