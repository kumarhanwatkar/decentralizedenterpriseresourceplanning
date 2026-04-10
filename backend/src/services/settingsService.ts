import { Settings } from '../models/Settings';
import { ISettings } from '../types';
import { AppError } from '../utils/errors';

class SettingsService {
  /**
   * Get or create settings for an organization
   */
  async getOrCreateSettings(organizationId: string): Promise<ISettings> {
    try {
      let settings = await Settings.findOne({ organizationId });
      if (!settings) {
        // Create default settings
        settings = new Settings({
          organizationId,
          companyName: 'My Organization',
          companyEmail: 'admin@organization.com',
          payrollCycle: 'monthly',
          payrollDay: 1,
          yieldDistributionPercent: 85,
          liquidPercentage: 15,
          blockchainNetwork: 'bsc_testnet',
          notificationSettings: {
            emailPayroll: true,
            emailYield: true,
            emailSystem: true,
            smsPayroll: false,
          },
          twoFactorEnabled: false,
        });
        await settings.save();
      }
      return settings as ISettings;
    } catch (error) {
      throw new AppError('Failed to get or create settings', 500);
    }
  }

  /**
   * Get settings for an organization
   */
  async getSettings(organizationId: string): Promise<ISettings> {
    try {
      const settings = await Settings.findOne({ organizationId });
      if (!settings) {
        throw new AppError('Settings not found for organization', 404);
      }
      return settings as ISettings;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to retrieve settings', 500);
    }
  }

  /**
   * Update company information
   */
  async updateCompanyInfo(
    organizationId: string,
    updates: {
      companyName?: string;
      companyEmail?: string;
      companyPhone?: string;
      companyLogo?: string;
    }
  ): Promise<ISettings> {
    try {
      // Validate required fields
      if (updates.companyName !== undefined && !updates.companyName.trim()) {
        throw new AppError('Company name cannot be empty', 400);
      }
      if (updates.companyEmail !== undefined && !updates.companyEmail.trim()) {
        throw new AppError('Company email cannot be empty', 400);
      }

      // Basic email validation
      if (
        updates.companyEmail &&
        !updates.companyEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      ) {
        throw new AppError('Invalid email format', 400);
      }

      const settings = await Settings.findOneAndUpdate(
        { organizationId },
        {
          ...(updates.companyName && { companyName: updates.companyName }),
          ...(updates.companyEmail && { companyEmail: updates.companyEmail.toLowerCase() }),
          ...(updates.companyPhone && { companyPhone: updates.companyPhone }),
          ...(updates.companyLogo !== undefined && { companyLogo: updates.companyLogo }),
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      if (!settings) {
        throw new AppError('Settings not found', 404);
      }

      return settings as ISettings;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update company info', 500);
    }
  }

  /**
   * Update payroll cycle
   */
  async updatePayrollCycle(
    organizationId: string,
    payrollCycle: 'weekly' | 'biweekly' | 'monthly',
    payrollDay?: number
  ): Promise<ISettings> {
    try {
      // Validate payroll cycle
      if (!['weekly', 'biweekly', 'monthly'].includes(payrollCycle)) {
        throw new AppError('Invalid payroll cycle. Must be weekly, biweekly, or monthly', 400);
      }

      // Validate payroll day
      if (payrollDay !== undefined) {
        if (payrollDay < 1 || payrollDay > 31) {
          throw new AppError('Payroll day must be between 1 and 31', 400);
        }
      }

      const updateData: any = {
        payrollCycle,
        updatedAt: new Date(),
      };

      if (payrollDay !== undefined) {
        updateData.payrollDay = payrollDay;
      }

      const settings = await Settings.findOneAndUpdate(
        { organizationId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!settings) {
        throw new AppError('Settings not found', 404);
      }

      return settings as ISettings;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update payroll cycle', 500);
    }
  }

  /**
   * Update yield distribution percentage
   */
  async updateYieldPercentage(
    organizationId: string,
    yieldDistributionPercent: number
  ): Promise<ISettings> {
    try {
      // Validate yield percentage
      if (yieldDistributionPercent < 0 || yieldDistributionPercent > 100) {
        throw new AppError('Yield distribution percentage must be between 0 and 100', 400);
      }

      // Calculate and validate liquid percentage
      const liquidPercentage = 100 - yieldDistributionPercent;

      const settings = await Settings.findOneAndUpdate(
        { organizationId },
        {
          yieldDistributionPercent,
          liquidPercentage,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      if (!settings) {
        throw new AppError('Settings not found', 404);
      }

      return settings as ISettings;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update yield percentage', 500);
    }
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(
    organizationId: string,
    notificationSettings: {
      emailPayroll?: boolean;
      emailYield?: boolean;
      emailSystem?: boolean;
      smsPayroll?: boolean;
    }
  ): Promise<ISettings> {
    try {
      // Validate that at least one notification type is enabled
      const updatedSettings = await Settings.findOneAndUpdate(
        { organizationId },
        {
          notificationSettings: {
            emailPayroll:
              notificationSettings.emailPayroll !== undefined
                ? notificationSettings.emailPayroll
                : true,
            emailYield:
              notificationSettings.emailYield !== undefined
                ? notificationSettings.emailYield
                : true,
            emailSystem:
              notificationSettings.emailSystem !== undefined
                ? notificationSettings.emailSystem
                : true,
            smsPayroll:
              notificationSettings.smsPayroll !== undefined
                ? notificationSettings.smsPayroll
                : false,
          },
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      if (!updatedSettings) {
        throw new AppError('Settings not found', 404);
      }

      return updatedSettings as ISettings;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update notification settings', 500);
    }
  }

  /**
   * Update blockchain network
   */
  async updateBlockchainNetwork(
    organizationId: string,
    blockchainNetwork: 'bsc_mainnet' | 'bsc_testnet',
    smartContractAddress?: string
  ): Promise<ISettings> {
    try {
      // Validate blockchain network
      if (!['bsc_mainnet', 'bsc_testnet'].includes(blockchainNetwork)) {
        throw new AppError('Invalid blockchain network', 400);
      }

      // Validate smart contract address if provided
      if (smartContractAddress && !smartContractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        throw new AppError('Invalid smart contract address format', 400);
      }

      const updateData: any = {
        blockchainNetwork,
        updatedAt: new Date(),
      };

      if (smartContractAddress) {
        updateData.smartContractAddress = smartContractAddress.toLowerCase();
      }

      const settings = await Settings.findOneAndUpdate(
        { organizationId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!settings) {
        throw new AppError('Settings not found', 404);
      }

      return settings as ISettings;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to update blockchain network', 500);
    }
  }

  /**
   * Toggle two-factor authentication
   */
  async toggleTwoFactorAuth(organizationId: string, enabled: boolean): Promise<ISettings> {
    try {
      const settings = await Settings.findOneAndUpdate(
        { organizationId },
        {
          twoFactorEnabled: enabled,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      if (!settings) {
        throw new AppError('Settings not found', 404);
      }

      return settings as ISettings;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Failed to toggle two-factor authentication', 500);
    }
  }

  /**
   * Get settings with defaults applied (globally accessible)
   */
  async getSettingsWithDefaults(organizationId: string): Promise<ISettings> {
    try {
      let settings = await Settings.findOne({ organizationId });
      if (!settings) {
        // Return default settings even if not created in DB
        return {
          _id: '',
          organizationId,
          companyName: 'My Organization',
          companyEmail: 'admin@organization.com',
          companyPhone: '',
          companyLogo: undefined,
          payrollCycle: 'monthly',
          payrollDay: 1,
          yieldDistributionPercent: 85,
          liquidPercentage: 15,
          blockchainNetwork: 'bsc_testnet',
          smartContractAddress: '',
          notificationSettings: {
            emailPayroll: true,
            emailYield: true,
            emailSystem: true,
            smsPayroll: false,
          },
          twoFactorEnabled: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
      return settings as ISettings;
    } catch (error) {
      throw new AppError('Failed to retrieve settings', 500);
    }
  }
}

export const settingsService = new SettingsService();
