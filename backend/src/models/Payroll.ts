import { Schema, model, Document } from 'mongoose';
import { IPayroll } from '../types';

interface IPayrollDocument extends IPayroll, Document {}

const payrollSchema = new Schema<IPayrollDocument>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true,
    },
    cycleId: {
      type: String,
      required: true,
    },
    cycleStartDate: {
      type: Date,
      required: true,
    },
    cycleEndDate: {
      type: Date,
      required: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
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
    lastStreamedAt: {
      type: Date,
      default: null,
    },
    lastPaymentAt: {
      type: Date,
      default: null,
    },
    paymentFrequency: {
      type: String,
      enum: ['hourly', 'daily', 'weekly'],
      default: 'hourly',
    },
    isStreaming: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPaused: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
payrollSchema.index({ employeeId: 1, cycleStartDate: 1 });
payrollSchema.index({ isStreaming: 1, isPaused: 1 });

// Virtual for calculate accrued amount per second
payrollSchema.virtual('accrualPerSecond').get(function () {
  return this.hourlyRate / 3600;
});

export const Payroll = model<IPayrollDocument>('Payroll', payrollSchema);
