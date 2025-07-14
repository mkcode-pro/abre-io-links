import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Eye } from 'lucide-react';

interface CustomLink {
  title: string;
  url: string;
}

interface SocialLinks {
  instagram?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
}

export function BioEditor() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [existingBio, setExistingBio] = useState<any>(null);

  useEffect(() => {
    const fetchBioPage = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('bio_pages')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setExistingBio(data);
        setUsername(data.username || '');
        setTitle(data.title || '');
        setBio(data.bio || '');
        setAvatarUrl(data.avatar_url || '');
        setCustomLinks((data.custom_links as unknown as CustomLink[]) || []);
        setSocialLinks((data.social_links as unknown as SocialLinks) || {});
      }
    };

    fetchBioPage();
  }, [user]);

  const addCustomLink = () => {
    setCustomLinks([...customLinks, { title: '', url: '' }]);
  };

  const removeCustomLink = (index: number) => {
    setCustomLinks(customLinks.filter((_, i) => i !== index));
  };

  const updateCustomLink = (index: number, field: 'title' | 'url', value: string) => {
    const updated = [...customLinks];
    updated[index] = { ...updated[index], [field]: value };
    setCustomLinks(updated);
  };

  const updateSocialLink = (platform: keyof SocialLinks, url: string) => {
    setSocialLinks({ ...socialLinks, [platform]: url });
  };

  const handleSave = async () => {
    if (!user) return;
    if (!username.trim() || !title.trim()) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Username e título são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const bioData = {
        user_id: user.id,
        username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
        title,
        bio,
        avatar_url: avatarUrl,
        social_links: socialLinks as any,
        custom_links: customLinks.filter(link => link.title && link.url) as any,
        is_active: true,
      };

      if (existingBio) {
        const { error } = await supabase
          .from('bio_pages')
          .update(bioData)
          .eq('id', existingBio.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('bio_pages')
          .insert(bioData);
        
        if (error) throw error;
      }

      toast({
        title: 'Bio page salva!',
        description: 'Sua bio page foi salva com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const previewUrl = `${window.location.origin}/bio/${username}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Bio Page Editor
            {username && (
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </a>
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="meuusername"
              />
              {username && (
                <p className="text-xs text-muted-foreground mt-1">
                  Sua bio page: {previewUrl}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Meu Nome"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Conte sobre você..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="avatar">URL do Avatar</Label>
            <Input
              id="avatar"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://exemplo.com/avatar.jpg"
            />
          </div>

          {/* Social Links */}
          <div>
            <Label>Redes Sociais</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Input
                  placeholder="Instagram URL"
                  value={socialLinks.instagram || ''}
                  onChange={(e) => updateSocialLink('instagram', e.target.value)}
                />
              </div>
              <div>
                <Input
                  placeholder="Twitter URL"
                  value={socialLinks.twitter || ''}
                  onChange={(e) => updateSocialLink('twitter', e.target.value)}
                />
              </div>
              <div>
                <Input
                  placeholder="GitHub URL"
                  value={socialLinks.github || ''}
                  onChange={(e) => updateSocialLink('github', e.target.value)}
                />
              </div>
              <div>
                <Input
                  placeholder="LinkedIn URL"
                  value={socialLinks.linkedin || ''}
                  onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Custom Links */}
          <div>
            <div className="flex items-center justify-between">
              <Label>Links Customizados</Label>
              <Button type="button" variant="outline" size="sm" onClick={addCustomLink}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Link
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {customLinks.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Título do link"
                    value={link.title}
                    onChange={(e) => updateCustomLink(index, 'title', e.target.value)}
                  />
                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateCustomLink(index, 'url', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCustomLink(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? 'Salvando...' : 'Salvar Bio Page'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}