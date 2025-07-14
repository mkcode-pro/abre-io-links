import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalUsers: number;
  totalLinks: number;
  totalClicks: number;
  totalBioPages: number;
  monthlyRevenue: number;
  activeUsers: number;
  conversionRate: number;
  retention30d: number;
  growthRate: {
    users: number;
    links: number;
    clicks: number;
    revenue: number;
  };
  clicksByDay: Array<{ date: string; clicks: number }>;
  usersByPlan: Array<{ plan: string; count: number }>;
  topLinks: Array<{ id: string; title: string; clicks: number; url: string }>;
}

export function useAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados básicos
      const [
        { data: users, error: usersError },
        { data: links, error: linksError },
        { data: clicks, error: clicksError },
        { data: bioPages, error: bioPagesError },
        { data: plans, error: plansError }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }),
        supabase.from('links').select('*', { count: 'exact' }),
        supabase.from('clicks').select('*', { count: 'exact' }),
        supabase.from('bio_pages').select('*', { count: 'exact' }),
        supabase.from('user_plans').select('plan_type', { count: 'exact' })
      ]);

      if (usersError || linksError || clicksError || bioPagesError || plansError) {
        throw new Error('Erro ao buscar dados do dashboard');
      }

      // Calcular estatísticas dos últimos 7 dias para crescimento
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('created_at', { count: 'exact' })
        .gte('created_at', sevenDaysAgo.toISOString());

      const { data: recentLinks } = await supabase
        .from('links')
        .select('created_at', { count: 'exact' })
        .gte('created_at', sevenDaysAgo.toISOString());

      const { data: recentClicks } = await supabase
        .from('clicks')
        .select('clicked_at', { count: 'exact' })
        .gte('clicked_at', sevenDaysAgo.toISOString());

      // Buscar top links
      const { data: topLinksData } = await supabase
        .from('links')
        .select('id, title, original_url, clicks')
        .order('clicks', { ascending: false })
        .limit(10);

      // Buscar clicks por dia (últimos 30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: clicksByDate } = await supabase
        .from('clicks')
        .select('clicked_at')
        .gte('clicked_at', thirtyDaysAgo.toISOString());

      // Processar clicks por dia
      const clicksByDay = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const dateStr = date.toISOString().split('T')[0];
        const dayClicks = clicksByDate?.filter(click => 
          click.clicked_at.startsWith(dateStr)
        ).length || 0;
        return { date: dateStr, clicks: dayClicks };
      });

      // Agrupar usuários por plano
      const planCounts = plans?.reduce((acc: any, plan: any) => {
        acc[plan.plan_type] = (acc[plan.plan_type] || 0) + 1;
        return acc;
      }, {}) || {};

      const usersByPlan = Object.entries(planCounts).map(([plan, count]) => ({
        plan: plan.charAt(0).toUpperCase() + plan.slice(1),
        count: count as number
      }));

      // Calcular taxa de conversão (usuários premium / total)
      const premiumUsers = planCounts.premium || 0;
      const totalUsers = users?.length || 0;
      const conversionRate = totalUsers > 0 ? (premiumUsers / totalUsers) * 100 : 0;

      // Mock de receita mensal (seria calculado com dados reais de pagamento)
      const monthlyRevenue = premiumUsers * 29.99; // Assumindo $29.99 por usuário premium

      setStats({
        totalUsers: totalUsers,
        totalLinks: links?.length || 0,
        totalClicks: clicks?.length || 0,
        totalBioPages: bioPages?.length || 0,
        monthlyRevenue,
        activeUsers: Math.floor(totalUsers * 0.7), // Mock: 70% são usuários ativos
        conversionRate,
        retention30d: 78, // Mock - seria calculado com dados reais
        growthRate: {
          users: recentUsers?.length || 0,
          links: recentLinks?.length || 0,
          clicks: recentClicks?.length || 0,
          revenue: (recentUsers?.length || 0) * 29.99 * 0.05 // Mock: 5% conversão
        },
        clicksByDay,
        usersByPlan,
        topLinks: topLinksData?.map(link => ({
          id: link.id,
          title: link.title || 'Link sem título',
          clicks: link.clicks || 0,
          url: link.original_url
        })) || []
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Atualizar dados a cada 30 segundos
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { stats, loading, error, refetch: fetchDashboardData };
}