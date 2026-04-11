import React from 'react';

export const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => 
  <div className={className}>{children}</div>;

export const NeonButton: React.FC<{ children: React.ReactNode; onClick?: () => void; className?: string }> = ({ children, onClick, className }) => 
  <button onClick={onClick} className={className}>{children}</button>;

export const StreamingNumber: React.FC<{ value: number; className?: string }> = ({ value, className }) => 
  <span className={className}>{value}</span>;
