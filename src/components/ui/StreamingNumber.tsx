import React, { useEffect, useState } from 'react';

export const StreamingNumber: React.FC<{ value: number; className?: string; duration?: number }> = ({ value, className, duration = 1 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    const startTime = Date.now();
    const startValue = displayValue;
    const target = value;

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = startValue + (target - startValue) * progress;
      setDisplayValue(Math.floor(currentValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span className={className}>{displayValue}</span>;
};
