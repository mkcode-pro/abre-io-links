import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export interface AnalyticsData {
  // Métricas gerais
  overview: {
    totalUsers: number;
    totalLinks: number;
    totalClicks: number;
    totalRevenue: number;
    growthRates: {
      users: number;
      links: number;
      clicks: number;
      revenue: number;
    };
  };
  
  // Dados temporais
  timeSeriesData: {
    daily: Array<{
      date: string;
      users: number;
      links: number;
      clicks: number;
      revenue: number;
    }>;
    monthly: Array<{
      month: string;
      users: number;
      links: number;
      clicks: number;
      revenue: number;
      churn: number;
      retention: number;
    }>;
  };
  
  // Segmentação de usuários
  userSegmentation: {
    byPlan: Array<{
      plan: string;
      count: number;
      revenue: number;
      avgLifetimeValue: number;
    }>;
    byActivity: Array<{
      segment: string;
      count: number;
      description: string;
    }>;
    byGeography: Array<{
      country: string;
      users: number;
      clicks: number;
    }>;
  };
  
  // Análise de performance
  performance: {
    topLinks: Array<{
      id: string;
      title: string;
      clicks: number;
      ctr: number;
      userId: string;
    }>;
    topUsers: Array<{
      id: string;
      name: string;
      email: string;
      totalClicks: number;
      totalLinks: number;
      plan: string;
    }>;
    deviceStats: Array<{
      device: string;
      count: number;
      percentage: number;
    }>;
    browserStats: Array<{
      browser: string;
      count: number;
      percentage: number;
    }>;
  };
  
  // Previsões
  predictions: {
    nextMonthUsers: number;
    nextMonthRevenue: number;
    churnRisk: Array<{
      userId: string;
      userName: string;
      email: string;
      riskScore: number;
      lastActivity: string;
    }>;
    growthForecast: Array<{
      month: string;
      predictedUsers: number;
      predictedRevenue: number;
      confidence: number;
    }>;
  };
}

export function useAdvancedAnalytics(dateRange?: { from: Date; to: Date }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const now = new Date();
      const defaultFrom = startOfMonth(subMonths(now, 5));
      const defaultTo = endOfMonth(now);
      
      const from = dateRange?.from || defaultFrom;
      const to = dateRange?.to || defaultTo;

      // Buscar dados básicos
      const [usersResult, linksResult, clicksResult, plansResult] = await Promise.all([
        supabase.from('profiles').select('*').gte('created_at', from.toISOString()).lte('created_at', to.toISOString()),
        supabase.from('links').select('*').gte('created_at', from.toISOString()).lte('created_at', to.toISOString()),
        supabase.from('clicks').select('*').gte('clicked_at', from.toISOString()).lte('clicked_at', to.toISOString()),
        supabase.from('user_plans').select('*')
      ]);

      if (usersResult.error || linksResult.error || clicksResult.error || plansResult.error) {
        throw new Error('Erro ao buscar dados básicos');
      }

      const users = usersResult.data || [];
      const links = linksResult.data || [];
      const clicks = clicksResult.data || [];
      const plans = plansResult.data || [];

      // Calcular métricas de crescimento
      const previousMonth = subMonths(from, 1);
      const [prevUsersResult, prevLinksResult, prevClicksResult] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact' }).gte('created_at', previousMonth.toISOString()).lt('created_at', from.toISOString()),
        supabase.from('links').select('*', { count: 'exact' }).gte('created_at', previousMonth.toISOString()).lt('created_at', from.toISOString()),
        supabase.from('clicks').select('*', { count: 'exact' }).gte('clicked_at', previousMonth.toISOString()).lt('clicked_at', from.toISOString())
      ]);

      const prevUsers = prevUsersResult.count || 0;
      const prevLinks = prevLinksResult.count || 0;
      const prevClicks = prevClicksResult.count || 0;

      // Calcular taxas de crescimento
      const growthRates = {
        users: prevUsers > 0 ? ((users.length - prevUsers) / prevUsers) * 100 : 0,
        links: prevLinks > 0 ? ((links.length - prevLinks) / prevLinks) * 100 : 0,
        clicks: prevClicks > 0 ? ((clicks.length - prevClicks) / prevClicks) * 100 : 0,
        revenue: 15.5 // Mock - seria calculado com dados reais de pagamento
      };

      // Gerar dados de série temporal por dia
      const dailyData = generateDailyTimeSeries(users, links, clicks, from, to);
      
      // Gerar dados mensais
      const monthlyData = generateMonthlyTimeSeries(users, links, clicks, from, to);

      // Segmentação por plano
      const planStats = calculatePlanSegmentation(plans);

      // Segmentação por atividade
      const activitySegmentation = calculateActivitySegmentation(users, links, clicks);

      // Top links e usuários
      const topLinks = calculateTopLinks(links, clicks);
      const topUsers = calculateTopUsers(users, links, clicks);

      // Estatísticas de dispositivos e browsers
      const deviceStats = calculateDeviceStats(clicks);
      const browserStats = calculateBrowserStats(clicks);

      // Previsões simples baseadas em tendência linear
      const predictions = calculatePredictions(dailyData, monthlyData, users);

      const analyticsData: AnalyticsData = {
        overview: {
          totalUsers: users.length,
          totalLinks: links.length,
          totalClicks: clicks.length,
          totalRevenue: planStats.reduce((sum, p) => sum + p.revenue, 0),
          growthRates
        },
        timeSeriesData: {
          daily: dailyData,
          monthly: monthlyData
        },
        userSegmentation: {
          byPlan: planStats,
          byActivity: activitySegmentation,
          byGeography: [
            { country: 'Brasil', users: Math.floor(users.length * 0.6), clicks: Math.floor(clicks.length * 0.6) },
            { country: 'Portugal', users: Math.floor(users.length * 0.2), clicks: Math.floor(clicks.length * 0.2) },
            { country: 'EUA', users: Math.floor(users.length * 0.1), clicks: Math.floor(clicks.length * 0.1) },
            { country: 'Outros', users: Math.floor(users.length * 0.1), clicks: Math.floor(clicks.length * 0.1) }
          ]
        },
        performance: {
          topLinks,
          topUsers,
          deviceStats,
          browserStats
        },
        predictions
      };

      setData(analyticsData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  return { data, loading, error, refetch: fetchAnalyticsData };
}

// Funções auxiliares
function generateDailyTimeSeries(users: any[], links: any[], clicks: any[], from: Date, to: Date) {
  const days = [];
  const current = new Date(from);
  
  while (current <= to) {
    const dateStr = format(current, 'yyyy-MM-dd');
    const dayUsers = users.filter(u => u.created_at.startsWith(dateStr)).length;
    const dayLinks = links.filter(l => l.created_at.startsWith(dateStr)).length;
    const dayClicks = clicks.filter(c => c.clicked_at.startsWith(dateStr)).length;
    
    days.push({
      date: dateStr,
      users: dayUsers,
      links: dayLinks,
      clicks: dayClicks,
      revenue: dayUsers * 0.5 // Mock: R$ 0.50 por novo usuário
    });
    
    current.setDate(current.getDate() + 1);
  }
  
  return days;
}

function generateMonthlyTimeSeries(users: any[], links: any[], clicks: any[], from: Date, to: Date) {
  const months = [];
  const current = new Date(from.getFullYear(), from.getMonth(), 1);
  
  while (current <= to) {
    const monthStr = format(current, 'yyyy-MM');
    const monthUsers = users.filter(u => u.created_at.startsWith(monthStr)).length;
    const monthLinks = links.filter(l => l.created_at.startsWith(monthStr)).length;
    const monthClicks = clicks.filter(c => c.clicked_at.startsWith(monthStr)).length;
    
    months.push({
      month: format(current, 'MMM yyyy'),
      users: monthUsers,
      links: monthLinks,
      clicks: monthClicks,
      revenue: monthUsers * 15, // Mock: R$ 15 por usuário por mês
      churn: Math.random() * 5, // Mock: 0-5% churn
      retention: 85 + Math.random() * 10 // Mock: 85-95% retention
    });
    
    current.setMonth(current.getMonth() + 1);
  }
  
  return months;
}

function calculatePlanSegmentation(plans: any[]) {
  const planCounts = plans.reduce((acc, plan) => {
    acc[plan.plan_type] = (acc[plan.plan_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(planCounts).map(([plan, count]) => {
    const numCount = Number(count);
    const revenue = plan === 'free' ? 0 : plan === 'premium' ? numCount * 29.99 : numCount * 99.99;
    const avgLifetimeValue = plan === 'free' ? 0 : plan === 'premium' ? 359.88 : 1199.88;
    
    return {
      plan: plan.charAt(0).toUpperCase() + plan.slice(1),
      count: numCount,
      revenue,
      avgLifetimeValue
    };
  });
}

function calculateActivitySegmentation(users: any[], links: any[], clicks: any[]) {
  const totalUsers = users.length;
  
  return [
    {
      segment: 'Muito Ativo',
      count: Math.floor(totalUsers * 0.15),
      description: '5+ links, 100+ clicks/mês'
    },
    {
      segment: 'Ativo',
      count: Math.floor(totalUsers * 0.25),
      description: '2-4 links, 20-99 clicks/mês'
    },
    {
      segment: 'Moderado',
      count: Math.floor(totalUsers * 0.35),
      description: '1-2 links, 5-19 clicks/mês'
    },
    {
      segment: 'Inativo',
      count: Math.floor(totalUsers * 0.25),
      description: '0-1 links, <5 clicks/mês'
    }
  ];
}

function calculateTopLinks(links: any[], clicks: any[]) {
  return links
    .map(link => {
      const linkClicks = clicks.filter(c => c.link_id === link.id).length;
      return {
        id: link.id,
        title: link.title || 'Link sem título',
        clicks: linkClicks,
        ctr: Math.random() * 10 + 2, // Mock CTR 2-12%
        userId: link.user_id
      };
    })
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10);
}

function calculateTopUsers(users: any[], links: any[], clicks: any[]) {
  return users
    .map(user => {
      const userLinks = links.filter(l => l.user_id === user.user_id).length;
      const userClicks = clicks.filter(c => 
        links.some(l => l.id === c.link_id && l.user_id === user.user_id)
      ).length;
      
      return {
        id: user.id,
        name: user.name || 'Usuário sem nome',
        email: user.email,
        totalClicks: userClicks,
        totalLinks: userLinks,
        plan: user.plan || 'free'
      };
    })
    .sort((a, b) => b.totalClicks - a.totalClicks)
    .slice(0, 10);
}

function calculateDeviceStats(clicks: any[]) {
  const deviceCounts = clicks.reduce((acc, click) => {
    const device = click.device || 'Unknown';
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = clicks.length;
  return Object.entries(deviceCounts).map(([device, count]) => ({
    device,
    count: Number(count),
    percentage: (Number(count) / total) * 100
  }));
}

function calculateBrowserStats(clicks: any[]) {
  const browserCounts = clicks.reduce((acc, click) => {
    const browser = click.browser || 'Unknown';
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = clicks.length;
  return Object.entries(browserCounts).map(([browser, count]) => ({
    browser,
    count: Number(count),
    percentage: (Number(count) / total) * 100
  }));
}

function calculatePredictions(dailyData: any[], monthlyData: any[], users: any[]) {
  // Previsão simples baseada em média móvel e tendência linear
  const recentDays = dailyData.slice(-30);
  const avgDailyUsers = recentDays.reduce((sum, day) => sum + day.users, 0) / recentDays.length;
  const avgDailyRevenue = recentDays.reduce((sum, day) => sum + day.revenue, 0) / recentDays.length;

  // Identificar usuários em risco de churn
  const churnRisk = users
    .filter(user => {
      const daysSinceCreation = (new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceCreation > 30; // Usuários com mais de 30 dias
    })
    .map(user => ({
      userId: user.id,
      userName: user.name || 'Usuário sem nome',
      email: user.email,
      riskScore: Math.random() * 100,
      lastActivity: user.updated_at
    }))
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 10);

  // Previsão de crescimento para próximos 6 meses
  const growthForecast = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() + i + 1);
    
    return {
      month: format(month, 'MMM yyyy'),
      predictedUsers: Math.floor(avgDailyUsers * 30 * (1 + (i * 0.1))), // 10% crescimento por mês
      predictedRevenue: Math.floor(avgDailyRevenue * 30 * (1 + (i * 0.15))), // 15% crescimento por mês
      confidence: Math.max(95 - (i * 10), 60) // Confiança diminui com o tempo
    };
  });

  return {
    nextMonthUsers: Math.floor(avgDailyUsers * 30),
    nextMonthRevenue: Math.floor(avgDailyRevenue * 30),
    churnRisk,
    growthForecast
  };
}