import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserPlan {
  id: string;
  user_id: string;
  plan_type: string;
  max_links: number;
  max_clicks_per_month: number;
  analytics_enabled: boolean;
  bio_pages_enabled: boolean;
  qr_codes_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export function usePlan() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_plans')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = não encontrado
          console.error('Erro ao buscar plano:', error);
        } else if (data) {
          setPlan(data);
        } else {
          // Criar plano gratuito se não existir
          const { data: newPlan, error: insertError } = await supabase
            .from('user_plans')
            .insert({
              user_id: user.id,
              plan_type: 'free'
            })
            .select()
            .single();

          if (insertError) {
            console.error('Erro ao criar plano:', insertError);
          } else {
            setPlan(newPlan);
          }
        }
      } catch (error) {
        console.error('Erro inesperado:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [user]);

  const canCreateLinks = (currentCount: number) => {
    return plan ? currentCount < plan.max_links : false;
  };

  const canUseAnalytics = () => {
    return plan?.analytics_enabled || false;
  };

  const canUseBioPages = () => {
    return plan?.bio_pages_enabled || false;
  };

  const canUseQRCodes = () => {
    return plan?.qr_codes_enabled || false;
  };

  const getRemainingLinks = (currentCount: number) => {
    return plan ? Math.max(0, plan.max_links - currentCount) : 0;
  };

  const isPremium = () => {
    return plan?.plan_type !== 'free';
  };

  return {
    plan,
    loading,
    canCreateLinks,
    canUseAnalytics,
    canUseBioPages,
    canUseQRCodes,
    getRemainingLinks,
    isPremium,
  };
}