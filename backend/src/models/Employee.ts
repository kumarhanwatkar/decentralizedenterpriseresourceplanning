import { Schema, model, Document } from 'mongoose';
import { IEmployee, EmployeeStatus } from '../types';

interface IEmployeeDocument extends IEmployee, Document {}

const employeeSchema = new Schema<IEmployeeDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
      lowercase: true,
      match: /^0x[a-fA-F0-9]{40}$/,
      index: true,
    },
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },
    baseSalary: {
      type: Number,
      required: true,
      min: 0,
    },
    payrollCycle: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly'],
      default: 'monthly',
    },
    coldWallet: {
      type: String,
      required: true,
      lowercase: true,
      match: /^0x[a-fA-F0-9]{40}$/,
    },
    hotWallet: {
      type: String,
      required: true,
      lowercase: true,
      match: /^0x[a-fA-F0-9]{40}$/,
    },
    walletType: {
      type: String,
      enum: ['metamask', 'binance', 'other'],
      default: 'metamask',
    },
    status: {
      type: String,
      enum: ['active', 'on_leave', 'paused', 'terminated'],
      default: 'active',
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
    totalEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAccrued: {
      type: Number,
      default: 0,
      min: 0,
    },
    liquidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lockedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    pendingAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastStreamedAt: {
      type: Date,
      default: () => new Date(),
    },
    isStreamingActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ userId: 1 });
employeeSchema.index({ department: 1, status: 1 });
employeeSchema.index({ email: 1 });

export const Employee = model<IEmployeeDocument>('Employee', employeeSchema);
