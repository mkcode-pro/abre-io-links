import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  gradient?: 'primary' | 'secondary' | 'accent';
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  description,
  gradient = 'primary',
  className
}) => {
  const gradientClasses = {
    primary: 'from-primary/20 to-primary/5',
    secondary: 'from-secondary/20 to-secondary/5',
    accent: 'from-accent/20 to-accent/5'
  };

  const iconBgClasses = {
    primary: 'bg-primary/20 text-primary',
    secondary: 'bg-secondary/20 text-secondary',
    accent: 'bg-accent/20 text-accent'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass-card p-6 hover-scale",
        `bg-gradient-to-br ${gradientClasses[gradient]}`,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground-muted mb-1">
            {title}
          </p>
          <motion.p 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold text-foreground mb-2"
          >
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
          </motion.p>
          
          {trend && (
            <div className="flex items-center space-x-2">
              <span
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  trend.isPositive
                    ? "text-success bg-success/20"
                    : "text-destructive bg-destructive/20"
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              {description && (
                <span className="text-xs text-foreground-subtle">
                  {description}
                </span>
              )}
            </div>
          )}
        </div>
        
        <motion.div
          whileHover={{ rotate: 5 }}
          className={cn(
            "p-3 rounded-lg",
            iconBgClasses[gradient]
          )}
        >
          <Icon className="w-6 h-6" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StatsCard;