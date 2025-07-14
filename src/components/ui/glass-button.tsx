import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GlassButtonProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  isLoading = false,
  children,
  className,
  ...props
}) => {
  const baseClasses = cn(
    "inline-flex items-center justify-center font-medium transition-all duration-300",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background"
  );

  const variantClasses = {
    primary: "btn-premium text-white",
    secondary: "bg-gradient-secondary text-white shadow-glow-purple hover:shadow-glass-lg",
    accent: "neon-accent hover:shadow-glass-lg",
    ghost: "glass-card hover:bg-background-tertiary text-foreground",
    outline: "glass-card border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-md gap-2",
    md: "px-6 py-3 text-base rounded-lg gap-2",
    lg: "px-8 py-4 text-lg rounded-xl gap-3"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </motion.button>
  );
};

export default GlassButton;