import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useSecurity() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const checkUrlSafety = async (url: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('check_domain_safety', { url });
      
      if (error) {
        console.warn('Security check failed:', error);
        return true; // Allow by default if check fails
      }
      
      return data;
    } catch (error) {
      console.warn('Security check error:', error);
      return true; // Allow by default if check fails
    }
  };

  const logSecurityEvent = async (
    eventType: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    details: Record<string, any> = {}
  ) => {
    try {
      // Get user's IP (in a real app, this would be from the request)
      const response = await fetch('https://api.ipify.org?format=json');
      const { ip } = await response.json();

      await supabase.rpc('log_security_event', {
        _event_type: eventType,
        _ip_address: ip,
        _user_agent: navigator.userAgent,
        _details: details,
        _severity: severity
      });
    } catch (error) {
      console.warn('Failed to log security event:', error);
    }
  };

  const validateLinkCreation = async (url: string, userId: string) => {
    setLoading(true);
    try {
      // Check if URL is safe
      const isSafe = await checkUrlSafety(url);
      
      if (!isSafe) {
        await logSecurityEvent('blocked_malicious_url', 'high', { 
          url, 
          userId,
          action: 'link_creation_blocked'
        });
        
        toast({
          title: "URL Bloqueada",
          description: "Esta URL foi identificada como potencialmente perigosa e não pode ser encurtada.",
          variant: "destructive"
        });
        
        return false;
      }

      // Check for rate limiting (simple implementation)
      const { data: recentLinks } = await supabase
        .from('links')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 5 * 60 * 1000).toISOString()); // Last 5 minutes

      if (recentLinks && recentLinks.length >= 10) {
        await logSecurityEvent('rate_limit_exceeded', 'medium', { 
          userId,
          recentLinksCount: recentLinks.length,
          action: 'link_creation_rate_limited'
        });
        
        toast({
          title: "Limite Atingido",
          description: "Você está criando links muito rapidamente. Aguarde alguns minutos.",
          variant: "destructive"
        });
        
        return false;
      }

      return true;
    } catch (error) {
      console.error('Validation error:', error);
      return true; // Allow by default if validation fails
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    checkUrlSafety,
    logSecurityEvent,
    validateLinkCreation
  };
}