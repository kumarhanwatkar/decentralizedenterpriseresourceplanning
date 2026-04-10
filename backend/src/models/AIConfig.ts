import { Schema, model, Document } from 'mongoose';
import { IAIConfig, IWidget, WidgetType, WidgetSize } from '../types';

interface IAIConfigDocument extends IAIConfig, Document {}

// Widget Schema (nested)
const widgetSchema = new Schema<IWidget>(
  {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['stat_card', 'pie_chart', 'bar_chart', 'line_chart', 'table', 'alert'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: Number,
      required: true,
      min: 0,
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium',
    },
    dataSource: {
      type: String,
      required: true,
      trim: true,
    },
    configuration: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }
);

// Main AI Config Schema
const aiConfigSchema = new Schema<IAIConfigDocument>(
  {
    organizationId: {
      type: String,
      required: true,
      index: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    rawInput: {
      type: String,
      required: true,
      trim: true,
    },
    widgets: {
      type: [widgetSchema],
      default: [],
    },
    layout: {
      type: String,
      enum: ['grid', 'flex'],
      default: 'grid',
    },
    gridColumns: {
      type: Number,
      default: 4,
      min: 1,
      max: 12,
    },
    version: {
      type: Number,
      default: 1,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isPublished: {
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
aiConfigSchema.index({ organizationId: 1, isActive: 1 });
aiConfigSchema.index({ adminId: 1, isPublished: 1 });
aiConfigSchema.index({ createdAt: -1 });
aiConfigSchema.index({ updatedAt: -1 });

// Compound index for efficient admin queries
aiConfigSchema.index({ organizationId: 1, adminId: 1, isActive: 1 });

export const AIConfig = model<IAIConfigDocument>('AIConfig', aiConfigSchema);
