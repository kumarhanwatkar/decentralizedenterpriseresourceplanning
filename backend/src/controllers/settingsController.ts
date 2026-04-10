import { Request, Response, NextFunction } from 'express';
import { settingsService } from '../services/settingsService';

export class SettingsController {
  /**
   * Get settings for organization
   * GET /api/settings
   */
  static async getSettings(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const organizationId = (req as any).user?.organizationId;

      const settings = await settingsService.getOrCreateSettings(organizationId!);

      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get settings with defaults (globally accessible)
   * GET /api/settings/defaults
   */
  static async getSettingsWithDefaults(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const organizationId = (req as any).user?.organizationId;

      const settings = await settingsService.getSettingsWithDefaults(organizationId!);

      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update company information
   * PATCH /api/settings/company
   */
  static async updateCompanyInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { companyName, companyEmail, companyPhone, companyLogo } = req.body;
      const organizationId = (req as any).user?.organizationId;

      // Validate that at least one field is provided
      if (!companyName && !companyEmail && !companyPhone && companyLogo === undefined) {
        res.status(400).json({
          success: false,
          message: 'At least one field must be provided for update',
        });
        return;
      }

      const settings = await settingsService.updateCompanyInfo(organizationId!, {
        companyName,
        companyEmail,
        companyPhone,
        companyLogo,
      });

      res.status(200).json({
        success: true,
        message: 'Company information updated successfully',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update payroll cycle
   * PATCH /api/settings/payroll-cycle
   */
  static async updatePayrollCycle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { payrollCycle, payrollDay } = req.body;
      const organizationId = (req as any).user?.organizationId;

      if (!payrollCycle) {
        res.status(400).json({
          success: false,
          message: 'Payroll cycle is required',
        });
        return;
      }

      const settings = await settingsService.updatePayrollCycle(
        organizationId!,
        payrollCycle,
        payrollDay
      );

      res.status(200).json({
        success: true,
        message: 'Payroll cycle updated successfully',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update yield percentage
   * PATCH /api/settings/yield-percentage
   */
  static async updateYieldPercentage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { yieldDistributionPercent } = req.body;
      const organizationId = (req as any).user?.organizationId;

      if (yieldDistributionPercent === undefined) {
        res.status(400).json({
          success: false,
          message: 'Yield distribution percentage is required',
        });
        return;
      }

      const settings = await settingsService.updateYieldPercentage(
        organizationId!,
        yieldDistributionPercent
      );

      res.status(200).json({
        success: true,
        message: 'Yield percentage updated successfully',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update notification settings
   * PATCH /api/settings/notifications
   */
  static async updateNotificationSettings(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { emailPayroll, emailYield, emailSystem, smsPayroll } = req.body;
      const organizationId = (req as any).user?.organizationId;

      // Validate that at least one field is provided
      if (
        emailPayroll === undefined &&
        emailYield === undefined &&
        emailSystem === undefined &&
        smsPayroll === undefined
      ) {
        res.status(400).json({
          success: false,
          message: 'At least one notification field must be provided',
        });
        return;
      }

      const settings = await settingsService.updateNotificationSettings(organizationId!, {
        emailPayroll,
        emailYield,
        emailSystem,
        smsPayroll,
      });

      res.status(200).json({
        success: true,
        message: 'Notification settings updated successfully',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update blockchain network
   * PATCH /api/settings/blockchain
   */
  static async updateBlockchainNetwork(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { blockchainNetwork, smartContractAddress } = req.body;
      const organizationId = (req as any).user?.organizationId;

      if (!blockchainNetwork) {
        res.status(400).json({
          success: false,
          message: 'Blockchain network is required',
        });
        return;
      }

      const settings = await settingsService.updateBlockchainNetwork(
        organizationId!,
        blockchainNetwork,
        smartContractAddress
      );

      res.status(200).json({
        success: true,
        message: 'Blockchain network updated successfully',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle two-factor authentication
   * PATCH /api/settings/2fa
   */
  static async toggleTwoFactorAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { enabled } = req.body;
      const organizationId = (req as any).user?.organizationId;

      if (enabled === undefined) {
        res.status(400).json({
          success: false,
          message: 'Enabled field is required',
        });
        return;
      }

      const settings = await settingsService.toggleTwoFactorAuth(organizationId!, enabled);

      res.status(200).json({
        success: true,
        message: 'Two-factor authentication setting updated successfully',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update all settings at once
   * PATCH /api/settings
   */
  static async updateAllSettings(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const organizationId = (req as any).user?.organizationId;
      let settings = await settingsService.getSettings(organizationId!);

      // Update company info if provided
      if (
        req.body.companyName ||
        req.body.companyEmail ||
        req.body.companyPhone ||
        req.body.companyLogo
      ) {
        settings = await settingsService.updateCompanyInfo(organizationId!, {
          companyName: req.body.companyName,
          companyEmail: req.body.companyEmail,
          companyPhone: req.body.companyPhone,
          companyLogo: req.body.companyLogo,
        });
      }

      // Update payroll cycle if provided
      if (req.body.payrollCycle) {
        settings = await settingsService.updatePayrollCycle(
          organizationId!,
          req.body.payrollCycle,
          req.body.payrollDay
        );
      }

      // Update yield percentage if provided
      if (req.body.yieldDistributionPercent !== undefined) {
        settings = await settingsService.updateYieldPercentage(
          organizationId!,
          req.body.yieldDistributionPercent
        );
      }

      // Update notifications if provided
      if (
        req.body.notificationSettings &&
        Object.keys(req.body.notificationSettings).length > 0
      ) {
        settings = await settingsService.updateNotificationSettings(
          organizationId!,
          req.body.notificationSettings
        );
      }

      // Update blockchain if provided
      if (req.body.blockchainNetwork) {
        settings = await settingsService.updateBlockchainNetwork(
          organizationId!,
          req.body.blockchainNetwork,
          req.body.smartContractAddress
        );
      }

      // Update 2FA if provided
      if (req.body.twoFactorEnabled !== undefined) {
        settings = await settingsService.toggleTwoFactorAuth(
          organizationId!,
          req.body.twoFactorEnabled
        );
      }

      res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }
}
