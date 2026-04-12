import { Schema, model } from 'mongoose';
import { IResource } from '../types';

const resourceSchema = new Schema<IResource>(
  {
    resourceId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['server', 'machine', 'equipment'],
      required: true,
      index: true,
    },
    serialNumber: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['operational', 'maintenance', 'offline'],
      default: 'operational',
      index: true,
    },
    utilization: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    efficiency: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },
    lastMaintenance: {
      type: Date,
      default: null,
    },
    nextMaintenanceScheduled: {
      type: Date,
      default: null,
    },
    purchaseDate: {
      type: Date,
      default: null,
    },
    warrantyExpiry: {
      type: Date,
      default: null,
    },
    purchasePrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    maintenanceCost: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
resourceSchema.index({ resourceId: 1 });
resourceSchema.index({ type: 1, status: 1 });
resourceSchema.index({ department: 1 });

export default model<IResource>('Resource', resourceSchema);
