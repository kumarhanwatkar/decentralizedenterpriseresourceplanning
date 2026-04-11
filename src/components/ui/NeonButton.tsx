import React from 'react';

export const NeonButton: React.FC<{ children: React.ReactNode; onClick?: () => void; className?: string; disabled?: boolean }> = ({ children, onClick, className, disabled }) => 
  <button onClick={onClick} className={className} disabled={disabled}>{children}</button>;
