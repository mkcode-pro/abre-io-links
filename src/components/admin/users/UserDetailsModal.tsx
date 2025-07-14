import React from 'react';
import { UserData } from '@/hooks/useUserManagement';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Globe, 
  Calendar, 
  Link2, 
  MousePointer, 
  Eye,
  Crown,
  Activity,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface UserDetailsModalProps {
  user: UserData | null;
  open: boolean;
  onClose: () => void;
}

export function UserDetailsModal({ user, open, onClose }: UserDetailsModalProps) {
  if (!user) return null;

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email?.slice(0, 2).toUpperCase() || 'US';
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-purple-500 text-white';
      case 'premium':
        return 'bg-gold-500 text-white';
      case 'free':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar_url} />
              <AvatarFallback className="bg-primary/10">
                {getInitials(user.name, user.email)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span>{user.name || 'Usuário sem nome'}</span>
                {user.plan_info?.plan_type === 'enterprise' && (
                  <Crown className="w-5 h-5 text-purple-500" />
                )}
                <Badge className={getPlanBadgeColor(user.plan_info?.plan_type || 'free')}>
                  {(user.plan_info?.plan_type || 'free').toUpperCase()}
                </Badge>
              </div>
              <DialogDescription className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </DialogDescription>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 mt-6">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Informações Pessoais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                  <p className="text-sm">{user.name || 'Não informado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Website</label>
                  <p className="text-sm">
                    {user.website ? (
                      <a 
                        href={user.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center space-x-1"
                      >
                        <span>{user.website}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      'Não informado'
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="flex items-center space-x-2">
                    {user.is_active ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm">
                      {user.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              </div>
              
              {user.bio && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bio</label>
                  <p className="text-sm mt-1 p-3 bg-muted/30 rounded-lg">{user.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Plano e Limites */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="w-5 h-5" />
                <span>Plano e Limites</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Plano Atual</label>
                  <Badge className={`${getPlanBadgeColor(user.plan_info?.plan_type || 'free')} mt-1`}>
                    {(user.plan_info?.plan_type || 'free').toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Limite de Links</label>
                  <p className="text-sm font-semibold">{user.plan_info?.max_links || 3}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Clicks por Mês</label>
                  <p className="text-sm font-semibold">{user.plan_info?.max_clicks_per_month?.toLocaleString() || '100'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Recursos</label>
                  <div className="space-y-1 mt-1">
                    <div className="flex items-center space-x-1 text-xs">
                      {user.plan_info?.analytics_enabled ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-500" />
                      )}
                      <span>Analytics</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs">
                      {user.plan_info?.bio_pages_enabled ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-500" />
                      )}
                      <span>Bio Pages</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs">
                      {user.plan_info?.qr_codes_enabled ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-500" />
                      )}
                      <span>QR Codes</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas de Uso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Estatísticas de Uso</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                    <Link2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold">{user.stats?.total_links || 0}</p>
                  <p className="text-sm text-muted-foreground">Links Criados</p>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, ((user.stats?.total_links || 0) / (user.plan_info?.max_links || 3)) * 100)}%` 
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {user.stats?.total_links || 0} de {user.plan_info?.max_links || 3}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
                    <MousePointer className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold">{user.stats?.total_clicks || 0}</p>
                  <p className="text-sm text-muted-foreground">Total de Clicks</p>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, ((user.stats?.total_clicks || 0) / (user.plan_info?.max_clicks_per_month || 100)) * 100)}%` 
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {user.stats?.total_clicks || 0} de {user.plan_info?.max_clicks_per_month?.toLocaleString() || '100'} este mês
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold">{user.stats?.bio_pages || 0}</p>
                  <p className="text-sm text-muted-foreground">Bio Pages</p>
                  <div className="mt-4">
                    {user.plan_info?.bio_pages_enabled ? (
                      <Badge variant="default" className="bg-green-500 text-white">
                        Habilitado
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Não Habilitado
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados Temporais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Informações Temporais</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Cadastro</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(user.created_at)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Última Atualização</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{formatDate(user.updated_at)}</span>
                  </div>
                </div>
                {user.last_login && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Último Login</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Activity className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatDate(user.last_login)}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button>
            Editar Usuário
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}