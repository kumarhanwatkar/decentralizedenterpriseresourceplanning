import { Schema, model, Document } from 'mongoose';
import { IUser, UserRole, UserStatus } from '../types';

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^0x[a-fA-F0-9]{40}$/,
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin', 'employee', 'manager'],
      default: 'employee',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'paused'],
      default: 'active',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    department: {
      type: String,
      default: null,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
userSchema.index({ walletAddress: 1, isDeleted: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ createdAt: -1 });

export const User = model<IUserDocument>('User', userSchema);
