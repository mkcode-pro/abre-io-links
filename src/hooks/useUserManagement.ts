import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserData {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  plan?: string;
  created_at: string;
  updated_at: string;
  plan_info?: {
    plan_type: string;
    max_links: number;
    max_clicks_per_month: number;
    analytics_enabled: boolean;
    bio_pages_enabled: boolean;
    qr_codes_enabled: boolean;
  };
  stats?: {
    total_links: number;
    total_clicks: number;
    bio_pages: number;
  };
  last_login?: string;
  is_active?: boolean;
}

export interface UserFilters {
  search: string;
  plan: string;
  status: string;
  dateRange: {
    from?: Date;
    to?: Date;
  };
}

export function useUserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    plan: 'all',
    status: 'all',
    dateRange: {}
  });

  const pageSize = 20;

  const fetchUsers = async (page = 1, currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      // Construir query base
      let query = supabase
        .from('profiles')
        .select(`
          *,
          user_plans!inner(
            plan_type,
            max_links,
            max_clicks_per_month,
            analytics_enabled,
            bio_pages_enabled,
            qr_codes_enabled
          )
        `, { count: 'exact' });

      // Aplicar filtros
      if (currentFilters.search) {
        query = query.or(`name.ilike.%${currentFilters.search}%,email.ilike.%${currentFilters.search}%`);
      }

      if (currentFilters.plan !== 'all') {
        query = query.eq('user_plans.plan_type', currentFilters.plan);
      }

      if (currentFilters.dateRange.from) {
        query = query.gte('created_at', currentFilters.dateRange.from.toISOString());
      }

      if (currentFilters.dateRange.to) {
        query = query.lte('created_at', currentFilters.dateRange.to.toISOString());
      }

      // Paginação
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      // Buscar estatísticas de cada usuário
      const usersWithStats = await Promise.all(
        (data || []).map(async (user) => {
          try {
            const [linksResult, clicksResult, bioPagesResult] = await Promise.all([
              supabase.from('links').select('id', { count: 'exact' }).eq('user_id', user.user_id),
              supabase.from('clicks').select('id', { count: 'exact' }).in('link_id', 
                (await supabase.from('links').select('id').eq('user_id', user.user_id)).data?.map(l => l.id) || []
              ),
              supabase.from('bio_pages').select('id', { count: 'exact' }).eq('user_id', user.user_id)
            ]);

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              avatar_url: user.avatar_url,
              bio: user.bio,
              website: user.website,
              plan: user.plan,
              created_at: user.created_at,
              updated_at: user.updated_at,
              plan_info: Array.isArray(user.user_plans) ? user.user_plans[0] : null,
              stats: {
                total_links: linksResult.count || 0,
                total_clicks: clicksResult.count || 0,
                bio_pages: bioPagesResult.count || 0,
              },
              is_active: true // Mock - seria calculado baseado em última atividade
            };
          } catch (err) {
            console.error('Erro ao buscar stats do usuário:', err);
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              avatar_url: user.avatar_url,
              bio: user.bio,
              website: user.website,
              plan: user.plan,
              created_at: user.created_at,
              updated_at: user.updated_at,
              plan_info: Array.isArray(user.user_plans) ? user.user_plans[0] : null,
              stats: {
                total_links: 0,
                total_clicks: 0,
                bio_pages: 0,
              },
              is_active: false
            };
          }
        })
      );

      setUsers(usersWithStats);
      setTotalUsers(count || 0);
      setCurrentPage(page);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const updateUserPlan = async (userId: string, newPlan: string) => {
    try {
      const planLimits = {
        free: { max_links: 3, max_clicks_per_month: 100, analytics_enabled: false, bio_pages_enabled: false, qr_codes_enabled: false },
        premium: { max_links: 50, max_clicks_per_month: 10000, analytics_enabled: true, bio_pages_enabled: true, qr_codes_enabled: true },
        enterprise: { max_links: 1000, max_clicks_per_month: 100000, analytics_enabled: true, bio_pages_enabled: true, qr_codes_enabled: true }
      };

      const limits = planLimits[newPlan as keyof typeof planLimits];

      const { error } = await supabase
        .from('user_plans')
        .update({
          plan_type: newPlan,
          ...limits,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Atualizar também na tabela profiles
      await supabase
        .from('profiles')
        .update({ plan: newPlan, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      // Recarregar dados
      await fetchUsers(currentPage, filters);

      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Erro desconhecido' };
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Deletar dados relacionados primeiro (devido aos foreign keys)
      await Promise.all([
        supabase.from('links').delete().eq('user_id', userId),
        supabase.from('bio_pages').delete().eq('user_id', userId),
        supabase.from('user_plans').delete().eq('user_id', userId),
      ]);

      // Deletar perfil
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      // Recarregar dados
      await fetchUsers(currentPage, filters);

      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao deletar usuário' };
    }
  };

  const exportUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_plans(*)
        `);

      if (error) throw error;

      // Converter para CSV
      const headers = ['ID', 'Email', 'Nome', 'Plano', 'Data de Criação', 'Website'];
      const csvContent = [
        headers.join(','),
        ...(data || []).map(user => [
          user.id,
          user.email,
          user.name || '',
          user.plan || 'free',
          new Date(user.created_at).toLocaleDateString('pt-BR'),
          user.website || ''
        ].join(','))
      ].join('\n');

      // Download do arquivo
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `usuarios_abrev_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Erro ao exportar usuários' };
    }
  };

  useEffect(() => {
    fetchUsers(1, filters);
  }, []);

  return {
    users,
    loading,
    error,
    totalUsers,
    currentPage,
    pageSize,
    filters,
    setFilters,
    fetchUsers,
    updateUserPlan,
    deleteUser,
    exportUsers,
    setCurrentPage: (page: number) => fetchUsers(page, filters)
  };
}