import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Globe, Tag, Calendar, Lock, Copy, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSecurity } from '@/hooks/useSecurity';

interface CreatedLink {
  id: string;
  short_code: string;
  original_url: string;
  title?: string;
}

interface CreateLinkFormProps {
  onLinkCreated?: (link: CreatedLink) => void;
}

export function CreateLinkForm({ onLinkCreated }: CreateLinkFormProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<CreatedLink | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { validateLinkCreation } = useSecurity();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // Validate URL security before creating
      const isValid = await validateLinkCreation(url, user.id);
      if (!isValid) {
        setLoading(false);
        return;
      }
      // Generate short code from database function
      const { data: shortCodeData, error: shortCodeError } = await supabase
        .rpc('generate_short_code');

      if (shortCodeError) throw shortCodeError;

      const shortCode = customSlug || shortCodeData;

      // Create link
      const { data, error } = await supabase
        .from('links')
        .insert({
          user_id: user.id,
          original_url: url,
          short_code: shortCode,
          title: title || null,
          description: description || null,
          password: password || null,
          expires_at: expiresAt || null
        })
        .select()
        .single();

      if (error) throw error;

      const newLink: CreatedLink = {
        id: data.id,
        short_code: data.short_code,
        original_url: data.original_url,
        title: data.title
      };

      setCreatedLink(newLink);
      onLinkCreated?.(newLink);

      toast({
        title: "Link criado com sucesso!",
        description: "Seu link encurtado está pronto para uso.",
      });

      // Reset form
      setUrl('');
      setTitle('');
      setDescription('');
      setCustomSlug('');
      setPassword('');
      setExpiresAt('');

    } catch (error: any) {
      toast({
        title: "Erro ao criar link",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Link copiado para a área de transferência.",
    });
  };

  const shortUrl = createdLink ? `${window.location.origin}/${createdLink.short_code}` : '';

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="w-5 h-5" />
              Criar novo link
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="url">URL original *</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://exemplo.com/minha-url-longa"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título (opcional)</Label>
                  <Input
                    id="title"
                    placeholder="Nome do meu link"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customSlug">Slug personalizado</Label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="customSlug"
                      placeholder="meu-link"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Descrição do que este link faz..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Senha de proteção</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Senha opcional"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Data de expiração</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="expiresAt"
                      type="datetime-local"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full glass-button"
                disabled={loading || !url}
              >
                {loading ? 'Criando link...' : 'Criar link encurtado'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {createdLink && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card border-primary/50">
            <CardHeader>
              <CardTitle className="text-primary">Link criado com sucesso!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Seu link encurtado:</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={shortUrl}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyToClipboard(shortUrl)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                  >
                    <QrCode className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(shortUrl)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shortUrl)}`, '_blank')}
                >
                  Compartilhar WhatsApp
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shortUrl)}`, '_blank')}
                >
                  Compartilhar Twitter
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}