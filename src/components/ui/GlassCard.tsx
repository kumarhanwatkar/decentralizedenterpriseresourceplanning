import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  variant?: 'default' | 'glow' | 'neon';
  neonColor?: 'cyan' | 'purple' | 'green' | 'orange';
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  className,
  variant = 'default',
  neonColor = 'cyan',
  children,
  onClick,
}) => {
  const glowClasses = {
    cyan: 'hover:shadow-[0_0_30px_hsl(187_100%_50%/0.3)]',
    purple: 'hover:shadow-[0_0_30px_hsl(263_70%_60%/0.3)]',
    green: 'hover:shadow-[0_0_30px_hsl(142_76%_50%/0.3)]',
    orange: 'hover:shadow-[0_0_30px_hsl(25_95%_53%/0.3)]',
  };

  const neonBorderClasses = {
    cyan: 'border-neon-cyan/30 hover:border-neon-cyan/60',
    purple: 'border-neon-purple/30 hover:border-neon-purple/60',
    green: 'border-neon-green/30 hover:border-neon-green/60',
    orange: 'border-neon-orange/30 hover:border-neon-orange/60',
  };

  return (
    <motion.div
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-xl border bg-card/60 backdrop-blur-xl transition-all duration-300',
        variant === 'glow' && glowClasses[neonColor],
        variant === 'neon' && neonBorderClasses[neonColor],
        variant === 'default' && 'border-border/50 hover:border-border',
        onClick && 'cursor-pointer',
        className
      )}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
