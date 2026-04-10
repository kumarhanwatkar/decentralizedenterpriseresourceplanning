import { Schema, model, Document } from 'mongoose';
import { ITransaction, TransactionType, TransactionStatus } from '../types';

interface ITransactionDocument extends ITransaction, Document {}

const transactionSchema = new Schema<ITransactionDocument>(
  {
    txHash: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      match: /^0x[a-fA-F0-9]{64}$/,
    },
    blockNumber: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    type: {
      type: String,
      enum: ['payroll', 'yield', 'transfer', 'fee'],
      required: true,
      index: true,
    },
    fromEmployeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    toEmployeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    fromAddress: {
      type: String,
      required: true,
      lowercase: true,
      match: /^0x[a-fA-F0-9]{40}$/,
    },
    toAddress: {
      type: String,
      required: true,
      lowercase: true,
      match: /^0x[a-fA-F0-9]{40}$/,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    token: {
      type: String,
      enum: ['USDT', 'BUSD', 'USDC', 'BNB'],
      required: true,
    },
    yieldGenerated: {
      type: Number,
      default: 0,
      min: 0,
    },
    yieldPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    lockPeriod: {
      type: Number, // in days
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['confirmed', 'pending', 'failed'],
      default: 'pending',
      index: true,
    },
    confirmations: {
      type: Number,
      default: 0,
      min: 0,
    },
    gasUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
transactionSchema.index({ txHash: 1 });
transactionSchema.index({ type: 1, status: 1 });
transactionSchema.index({ timestamp: -1 });
transactionSchema.index({ fromAddress: 1, toAddress: 1 });
transactionSchema.index({ toEmployeeId: 1, type: 1 });

// Virtual for transaction status label
transactionSchema.virtual('statusLabel').get(function () {
  const labels: Record<TransactionStatus, string> = {
    confirmed: 'Confirmed ✓',
    pending: 'Pending ⏳',
    failed: 'Failed ✗',
  };
  return labels[this.status];
});

export const Transaction = model<ITransactionDocument>('Transaction', transactionSchema);
