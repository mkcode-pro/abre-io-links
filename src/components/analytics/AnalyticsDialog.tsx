import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AnalyticsDashboard } from './AnalyticsDashboard';

interface AnalyticsDialogProps {
  linkId: string;
  linkTitle: string;
  shortCode: string;
  open: boolean;
  onClose: () => void;
}

export function AnalyticsDialog({ 
  linkId, 
  linkTitle, 
  shortCode, 
  open, 
  onClose 
}: AnalyticsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-primary" />
              <div>
                <DialogTitle className="text-xl">
                  Analytics - /{shortCode}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {linkTitle || 'Link sem título'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <AnalyticsDashboard linkId={linkId} linkTitle={linkTitle} />
        </div>
      </DialogContent>
    </Dialog>
  );
}