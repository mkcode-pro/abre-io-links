import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  children?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action, children }: EmptyStateProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center p-8">
      {icon && (
        <div className="text-muted-foreground">
          {icon}
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-muted-foreground max-w-md">
            {description}
          </p>
        )}
      </div>

      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}

      {children}
    </div>
  );
}