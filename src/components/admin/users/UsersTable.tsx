import React, { useState } from 'react';
import { UserData } from '@/hooks/useUserManagement';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MoreHorizontal, 
  User, 
  Edit, 
  Trash2, 
  Crown, 
  Activity,
  Link2,
  MousePointer,
  Globe,
  Calendar,
  Mail
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UsersTableProps {
  users: UserData[];
  loading: boolean;
  selectedUsers: string[];
  onSelectUser: (userId: string) => void;
  onSelectAll: (selected: boolean) => void;
  onUpdateUserPlan: (userId: string, plan: string) => Promise<{ success: boolean; error?: string }>;
  onDeleteUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
  onViewUser: (user: UserData) => void;
}

export function UsersTable({ 
  users, 
  loading, 
  selectedUsers, 
  onSelectUser, 
  onSelectAll, 
  onUpdateUserPlan,
  onDeleteUser,
  onViewUser 
}: UsersTableProps) {
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email?.slice(0, 2).toUpperCase() || 'US';
  };

  const handlePlanUpdate = async (userId: string, newPlan: string) => {
    setActionLoading(userId);
    try {
      const result = await onUpdateUserPlan(userId, newPlan);
      if (result.success) {
        toast({
          title: 'Plano atualizado',
          description: `Plano alterado para ${newPlan} com sucesso.`
        });
      } else {
        toast({
          title: 'Erro ao atualizar plano',
          description: result.error,
          variant: 'destructive'
        });
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }

    setActionLoading(userId);
    try {
      const result = await onDeleteUser(userId);
      if (result.success) {
        toast({
          title: 'Usuário deletado',
          description: 'Usuário removido com sucesso.'
        });
      } else {
        toast({
          title: 'Erro ao deletar usuário',
          description: result.error,
          variant: 'destructive'
        });
      }
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="border rounded-lg">
        <div className="p-8 text-center">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
                <div className="w-20 h-6 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const allSelected = users.length > 0 && selectedUsers.length === users.length;
  const someSelected = selectedUsers.length > 0 && selectedUsers.length < users.length;

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
              />
            </TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Plano</TableHead>
            <TableHead>Estatísticas</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead className="w-12">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-muted/50">
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => onSelectUser(user.id)}
                />
              </TableCell>
              
              <TableCell>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="bg-primary/10">
                      {getInitials(user.name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name || 'Sem nome'}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {user.email}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Badge className={getPlanBadgeColor(user.plan_info?.plan_type || 'free')}>
                  {user.plan_info?.plan_type === 'enterprise' && <Crown className="w-3 h-3 mr-1" />}
                  {(user.plan_info?.plan_type || 'free').toUpperCase()}
                </Badge>
                <div className="text-xs text-muted-foreground mt-1">
                  {user.plan_info?.max_links} links, {user.plan_info?.max_clicks_per_month} clicks/mês
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Link2 className="w-3 h-3 mr-1 text-blue-500" />
                    <span>{user.stats?.total_links || 0} links</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MousePointer className="w-3 h-3 mr-1 text-green-500" />
                    <span>{user.stats?.total_clicks || 0} clicks</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Globe className="w-3 h-3 mr-1 text-purple-500" />
                    <span>{user.stats?.bio_pages || 0} bio pages</span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-sm">
                    {user.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                {user.last_login && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Último login: {new Date(user.last_login).toLocaleDateString('pt-BR')}
                  </div>
                )}
              </TableCell>

              <TableCell>
                <div className="flex items-center text-sm">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(user.created_at).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      disabled={actionLoading === user.id}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      onClick={() => onViewUser(user)}
                      className="cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Alterar Plano</DropdownMenuLabel>
                    
                    <DropdownMenuItem 
                      onClick={() => handlePlanUpdate(user.id, 'free')}
                      disabled={user.plan_info?.plan_type === 'free'}
                      className="cursor-pointer"
                    >
                      Gratuito
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => handlePlanUpdate(user.id, 'premium')}
                      disabled={user.plan_info?.plan_type === 'premium'}
                      className="cursor-pointer"
                    >
                      Premium
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem 
                      onClick={() => handlePlanUpdate(user.id, 'enterprise')}
                      disabled={user.plan_info?.plan_type === 'enterprise'}
                      className="cursor-pointer"
                    >
                      Enterprise
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem 
                      onClick={() => handleDeleteUser(user.id)}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Deletar Usuário
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {users.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum usuário encontrado</p>
          <p className="text-sm">Ajuste os filtros para ver mais resultados</p>
        </div>
      )}
    </div>
  );
}