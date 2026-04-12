import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StreamingNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  streaming?: boolean;
  className?: string;
  incrementPerSecond?: number;
}

export const StreamingNumber: React.FC<StreamingNumberProps> = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 2,
  streaming = false,
  className,
  incrementPerSecond = 0.0001,
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (streaming) {
      const interval = setInterval(() => {
        setDisplayValue((prev) => prev + incrementPerSecond);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setDisplayValue(value);
    }
  }, [streaming, value, incrementPerSecond]);

  const formattedValue = displayValue.toFixed(decimals);
  const [intPart, decPart] = formattedValue.split('.');

  return (
    <div className={cn('font-display tabular-nums', className)}>
      <span>{prefix}</span>
      <span>{intPart}</span>
      {decimals > 0 && (
        <>
          <span>.</span>
          <AnimatePresence mode="popLayout">
            {decPart.split('').map((digit, idx) => (
              <motion.span
                key={`${idx}-${digit}`}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {digit}
              </motion.span>
            ))}
          </AnimatePresence>
        </>
      )}
      <span>{suffix}</span>
      {streaming && (
        <motion.span
          className="ml-2 inline-block w-2 h-2 rounded-full bg-success"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </div>
  );
};
