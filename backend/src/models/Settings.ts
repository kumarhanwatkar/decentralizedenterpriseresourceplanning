import { Schema, model, Document } from 'mongoose';
import { ISettings, OrganizationPlan } from '../types';

interface ISettingsDocument extends ISettings, Document {}

const settingsSchema = new Schema<ISettingsDocument>(
  {
    organizationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    companyPhone: {
      type: String,
      trim: true,
    },
    companyLogo: {
      type: String,
      default: null,
    },
    payrollCycle: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly'],
      default: 'monthly',
    },
    payrollDay: {
      type: Number,
      min: 1,
      max: 31,
      default: 1,
    },
    yieldDistributionPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
    },
    liquidPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 15,
    },
    blockchainNetwork: {
      type: String,
      enum: ['bsc_mainnet', 'bsc_testnet'],
      default: 'bsc_testnet',
    },
    smartContractAddress: {
      type: String,
      lowercase: true,
      match: /^0x[a-fA-F0-9]{40}$/,
    },
    notificationSettings: {
      emailPayroll: {
        type: Boolean,
        default: true,
      },
      emailYield: {
        type: Boolean,
        default: true,
      },
      emailSystem: {
        type: Boolean,
        default: true,
      },
      smsPayroll: {
        type: Boolean,
        default: false,
      },
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Settings = model<ISettingsDocument>('Settings', settingsSchema);
