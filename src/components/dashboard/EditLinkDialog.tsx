import { useState } from 'react';
import { Link } from '@/hooks/useLinks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EditLinkDialogProps {
  link: Link;
  open: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Link>) => void;
}

export function EditLinkDialog({ link, open, onClose, onSave }: EditLinkDialogProps) {
  const [formData, setFormData] = useState({
    title: link.title || '',
    description: link.description || '',
    original_url: link.original_url,
    is_active: link.is_active,
    password: link.password || '',
    expires_at: link.expires_at ? new Date(link.expires_at).toISOString().split('T')[0] : '',
  });
  
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates: Partial<Link> = {
        title: formData.title || null,
        description: formData.description || null,
        original_url: formData.original_url,
        is_active: formData.is_active,
        password: formData.password || null,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
      };
      
      await onSave(updates);
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const canSave = formData.original_url && isValidUrl(formData.original_url);

  return (
    <Dialog open={open} onOpenChange={() => !loading && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Link</DialogTitle>
          <DialogDescription>
            Modifique as informações do seu link abreviado.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL de Destino *</Label>
            <Input
              id="url"
              type="url"
              value={formData.original_url}
              onChange={(e) => setFormData(prev => ({ ...prev, original_url: e.target.value }))}
              placeholder="https://exemplo.com"
              className={!isValidUrl(formData.original_url) && formData.original_url ? 'border-destructive' : ''}
            />
            {!isValidUrl(formData.original_url) && formData.original_url && (
              <p className="text-sm text-destructive">URL inválida</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título (opcional)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Meu link importante"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição do link..."
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha (opcional)</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Senha para proteger o link"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires">Data de Expiração (opcional)</Label>
            <Input
              id="expires"
              type="date"
              value={formData.expires_at}
              onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="active">Link ativo</Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!canSave || loading}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}