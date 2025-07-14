import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ExternalLink, Instagram, Twitter, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface BioPageData {
  id: string;
  username: string;
  title: string;
  bio: string | null;
  avatar_url: string | null;
  background_url: string | null;
  theme: string;
  social_links: Record<string, string> | null;
  custom_links: Array<{ title: string; url: string }> | null;
  is_active: boolean;
  views: number | null;
}

export default function BioPage() {
  const { username } = useParams<{ username: string }>();
  const [bioData, setBioData] = useState<BioPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchBioPage = async () => {
      if (!username) return;

      try {
        const { data, error } = await supabase
          .from('bio_pages')
          .select('*')
          .eq('username', username)
          .eq('is_active', true)
          .single();

        if (error || !data) {
          setNotFound(true);
        } else {
          setBioData({
            ...data,
            social_links: data.social_links as Record<string, string> | null,
            custom_links: data.custom_links as Array<{ title: string; url: string }> | null
          });
          // Increment view count
          await supabase
            .from('bio_pages')
            .update({ views: (data.views || 0) + 1 })
            .eq('id', data.id);
        }
      } catch (error) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBioPage();
  }, [username]);

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram className="h-5 w-5" />;
      case 'twitter': return <Twitter className="h-5 w-5" />;
      case 'github': return <Github className="h-5 w-5" />;
      case 'linkedin': return <Linkedin className="h-5 w-5" />;
      default: return <ExternalLink className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notFound || !bioData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-muted-foreground mb-8">Bio page não encontrada</p>
        <Button onClick={() => window.location.href = '/'}>
          Voltar ao início
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-background to-muted"
      style={{
        backgroundImage: bioData.background_url ? `url(${bioData.background_url})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="min-h-screen bg-background/80 backdrop-blur-sm">
        <div className="container max-w-md mx-auto py-12 px-4">
          <Card className="p-8 text-center space-y-6">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
                {bioData.avatar_url ? (
                  <img 
                    src={bioData.avatar_url} 
                    alt={bioData.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                    {bioData.title.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Title & Bio */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">{bioData.title}</h1>
              {bioData.bio && (
                <p className="text-muted-foreground">{bioData.bio}</p>
              )}
            </div>

            {/* Social Links */}
            {bioData.social_links && Object.keys(bioData.social_links).length > 0 && (
              <div className="flex justify-center gap-4">
                {Object.entries(bioData.social_links).map(([platform, url]) => (
                  <Button
                    key={platform}
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-12 h-12 p-0"
                  >
                    <a href={url as string} target="_blank" rel="noopener noreferrer">
                      {getSocialIcon(platform)}
                    </a>
                  </Button>
                ))}
              </div>
            )}

            {/* Custom Links */}
            <div className="space-y-3">
              {bioData.custom_links?.map((link, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full h-12"
                  asChild
                >
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    {link.title}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}