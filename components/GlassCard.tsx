import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div 
      className={`
        bg-white/70 dark:bg-white/10
        backdrop-blur-xl 
        border border-white/40 dark:border-white/20
        shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] dark:shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
        rounded-2xl 
        transition-colors duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
};