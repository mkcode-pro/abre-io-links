import React from 'react';
import { motion } from 'framer-motion';
import { 
  Copy, 
  ExternalLink, 
  QrCode, 
  BarChart3, 
  Edit3, 
  Trash2,
  Eye,
  Calendar,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassButton from '@/components/ui/glass-button';
import { cn } from '@/lib/utils';

interface LinkCardProps {
  id: string;
  originalUrl: string;
  shortUrl: string;
  title?: string;
  description?: string;
  clicks: number;
  createdAt: Date;
  tags?: string[];
  isActive?: boolean;
  qrCode?: string;
  onCopy?: (url: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewAnalytics?: (id: string) => void;
  className?: string;
}

const LinkCard: React.FC<LinkCardProps> = ({
  id,
  originalUrl,
  shortUrl,
  title,
  description,
  clicks,
  createdAt,
  tags = [],
  isActive = true,
  qrCode,
  onCopy,
  onEdit,
  onDelete,
  onViewAnalytics,
  className
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    onCopy?.(shortUrl);
  };

  const displayUrl = originalUrl.length > 50 
    ? originalUrl.substring(0, 50) + '...' 
    : originalUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass-card p-6 hover-scale group",
        !isActive && "opacity-60",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-lg font-semibold text-foreground mb-1 truncate">
              {title}
            </h3>
          )}
          <p className="text-sm text-foreground-muted mb-2 break-all">
            {displayUrl}
          </p>
          {description && (
            <p className="text-sm text-foreground-subtle line-clamp-2 mb-3">
              {description}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <div className="flex items-center space-x-1 text-xs text-foreground-muted">
            <Eye className="w-3 h-3" />
            <span>{clicks.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </div>

      {/* Short URL */}
      <div className="glass-card p-3 mb-4 bg-background-tertiary/50">
        <div className="flex items-center justify-between">
          <span className="text-primary font-mono text-sm truncate flex-1 mr-2">
            {shortUrl}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            className="p-1 rounded text-foreground-muted hover:text-primary transition-colors"
            title="Copiar link"
          >
            <Copy className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/20 text-primary"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-glass-border/30">
        <div className="flex items-center space-x-2 text-xs text-foreground-subtle">
          <Calendar className="w-3 h-3" />
          <span>{createdAt.toLocaleDateString('pt-BR')}</span>
        </div>

        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(shortUrl, '_blank')}
            className="p-2"
            title="Abrir link"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewAnalytics?.(id)}
            className="p-2"
            title="Ver analytics"
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
            title="QR Code"
          >
            <QrCode className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(id)}
            className="p-2"
            title="Editar"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(id)}
            className="p-2 text-destructive hover:text-destructive"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default LinkCard;