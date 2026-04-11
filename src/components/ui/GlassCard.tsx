import React from 'react';

export const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => 
  <div className={className}>{children}</div>;
