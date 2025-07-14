import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ClickAnalytics {
  id: string;
  clicked_at: string;
  ip_address?: string;
  country?: string;
  city?: string;
  browser?: string;
  os?: string;
  device?: string;
  referrer?: string;
  link_id: string;
}

export interface LinkWithAnalytics {
  id: string;
  short_code: string;
  original_url: string;
  title: string | null;
  clicks: number;
  created_at: string;
  analytics: ClickAnalytics[];
}

export interface AnalyticsStats {
  totalClicks: number;
  uniqueClicks: number;
  clicksToday: number;
  clicksThisWeek: number;
  clicksThisMonth: number;
  topCountries: { country: string; clicks: number }[];
  topBrowsers: { browser: string; clicks: number }[];
  topDevices: { device: string; clicks: number }[];
  topReferrers: { referrer: string; clicks: number }[];
  dailyClicks: { date: string; clicks: number }[];
  hourlyClicks: { hour: number; clicks: number }[];
}

export function useAnalytics(linkId?: string) {
  const [analytics, setAnalytics] = useState<ClickAnalytics[]>([]);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);

      let query = supabase
        .from('clicks')
        .select(`
          *,
          links!inner(
            id,
            short_code,
            original_url,
            title,
            user_id
          )
        `)
        .eq('links.user_id', user.id);

      if (linkId) {
        query = query.eq('link_id', linkId);
      }

      const { data, error } = await query.order('clicked_at', { ascending: false });

      if (error) throw error;

      const clicksData = (data || []).map(item => ({
        ...item,
        ip_address: item.ip_address ? String(item.ip_address) : undefined,
      })) as ClickAnalytics[];
      setAnalytics(clicksData);

      // Calculate statistics
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeek = new Date(today);
      thisWeek.setDate(today.getDate() - 7);
      const thisMonth = new Date(today);
      thisMonth.setDate(today.getDate() - 30);

      const clicksToday = clicksData.filter(click => 
        new Date(click.clicked_at) >= today
      ).length;

      const clicksThisWeek = clicksData.filter(click => 
        new Date(click.clicked_at) >= thisWeek
      ).length;

      const clicksThisMonth = clicksData.filter(click => 
        new Date(click.clicked_at) >= thisMonth
      ).length;

      // Unique clicks (by IP)
      const uniqueIPs = new Set(clicksData.map(click => click.ip_address).filter(Boolean));

      // Top countries
      const countryCount = clicksData.reduce((acc, click) => {
        const country = click.country || 'Unknown';
        acc[country] = (acc[country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topCountries = Object.entries(countryCount)
        .map(([country, clicks]) => ({ country, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      // Top browsers
      const browserCount = clicksData.reduce((acc, click) => {
        const browser = click.browser || 'Unknown';
        acc[browser] = (acc[browser] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topBrowsers = Object.entries(browserCount)
        .map(([browser, clicks]) => ({ browser, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      // Top devices
      const deviceCount = clicksData.reduce((acc, click) => {
        const device = click.device || 'Unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topDevices = Object.entries(deviceCount)
        .map(([device, clicks]) => ({ device, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      // Top referrers
      const referrerCount = clicksData.reduce((acc, click) => {
        const referrer = click.referrer || 'Direct';
        acc[referrer] = (acc[referrer] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topReferrers = Object.entries(referrerCount)
        .map(([referrer, clicks]) => ({ referrer, clicks }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

      // Daily clicks for last 30 days
      const dailyClicks = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const clicks = clicksData.filter(click => 
          click.clicked_at.startsWith(dateStr)
        ).length;
        dailyClicks.push({ date: dateStr, clicks });
      }

      // Hourly clicks for today
      const hourlyClicks = [];
      for (let hour = 0; hour < 24; hour++) {
        const clicks = clicksData.filter(click => {
          const clickDate = new Date(click.clicked_at);
          return clickDate >= today && clickDate.getHours() === hour;
        }).length;
        hourlyClicks.push({ hour, clicks });
      }

      setStats({
        totalClicks: clicksData.length,
        uniqueClicks: uniqueIPs.size,
        clicksToday,
        clicksThisWeek,
        clicksThisMonth,
        topCountries,
        topBrowsers,
        topDevices,
        topReferrers,
        dailyClicks,
        hourlyClicks,
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user, linkId]);

  return {
    analytics,
    stats,
    loading,
    refetch: fetchAnalytics,
  };
}