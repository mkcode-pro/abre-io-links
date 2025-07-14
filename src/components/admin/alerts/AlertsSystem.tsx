import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  RefreshCw,
  Bell,
  Shield,
  TrendingDown,
  TrendingUp,
  Activity
} from 'lucide-react';

interface AdminAlert {
  id: string;
  type: 'security' | 'performance' | 'business' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  metadata?: any;
  is_read: boolean;
  resolved_at?: string;
  created_at: string;
}

export function AlertsSystem() {
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setAlerts((data || []) as AdminAlert[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alertas');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('admin_alerts')
        .update({ is_read: true })
        .eq('id', alertId);

      if (error) throw error;
      
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId ? { ...alert, is_read: true } : alert
      ));
    } catch (err) {
      console.error('Erro ao marcar alerta como lido:', err);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('admin_alerts')
        .update({ 
          resolved_at: new Date().toISOString(),
          is_read: true 
        })
        .eq('id', alertId);

      if (error) throw error;
      
      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, resolved_at: new Date().toISOString(), is_read: true } 
          : alert
      ));
    } catch (err) {
      console.error('Erro ao resolver alerta:', err);
    }
  };

  // Gerar alertas automáticos baseados em métricas
  const generateAutoAlerts = async () => {
    try {
      // Verificar performance do sistema
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      const { data: recentClicks, error: clicksError } = await supabase
        .from('clicks')
        .select('clicked_at', { count: 'exact' })
        .gte('clicked_at', oneHourAgo.toISOString());

      if (!clicksError && recentClicks && recentClicks.length > 1000) {
        await supabase.rpc('create_admin_alert', {
          _type: 'performance',
          _severity: 'medium',
          _title: 'Alto volume de tráfego detectado',
          _message: `${recentClicks.length} clicks na última hora. Monitorar performance.`,
          _metadata: { clicks_count: recentClicks.length, period: '1h' }
        });
      }

      // Verificar novos usuários
      const { data: newUsers, error: usersError } = await supabase
        .from('profiles')
        .select('created_at', { count: 'exact' })
        .gte('created_at', oneHourAgo.toISOString());

      if (!usersError && newUsers && newUsers.length > 50) {
        await supabase.rpc('create_admin_alert', {
          _type: 'business',
          _severity: 'low',
          _title: 'Pico de novos registros',
          _message: `${newUsers.length} novos usuários na última hora!`,
          _metadata: { new_users: newUsers.length, period: '1h' }
        });
      }

    } catch (err) {
      console.error('Erro ao gerar alertas automáticos:', err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    generateAutoAlerts();
    
    // Atualizar alertas a cada 30 segundos
    const interval = setInterval(() => {
      fetchAlerts();
      generateAutoAlerts();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type: string, severity: string) => {
    if (severity === 'critical') return <XCircle className="w-5 h-5 text-red-500" />;
    if (severity === 'high') return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    
    switch (type) {
      case 'security':
        return <Shield className="w-5 h-5 text-blue-500" />;
      case 'performance':
        return <Activity className="w-5 h-5 text-yellow-500" />;
      case 'business':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-black';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'security':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'performance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'business':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'system':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const unreadCount = alerts.filter(alert => !alert.is_read && !alert.resolved_at).length;
  const criticalCount = alerts.filter(alert => alert.severity === 'critical' && !alert.resolved_at).length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Carregando Alertas...</span>
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="w-4 h-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Sistema de Alertas</span>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
            {criticalCount > 0 && (
              <Badge className="bg-red-600 text-white">
                {criticalCount} Críticos
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAlerts}
            className="flex items-center space-x-1"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Atualizar</span>
          </Button>
        </CardTitle>
        <CardDescription>
          Monitoramento em tempo real de eventos importantes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <p>Nenhum alerta ativo no momento</p>
              <p className="text-sm">Sistema operando normalmente</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border rounded-lg transition-all duration-200 ${
                  alert.resolved_at
                    ? 'bg-muted/50 opacity-75'
                    : alert.is_read
                    ? 'bg-background'
                    : 'bg-primary/5 border-primary/20'
                }`}
              >
                <div className="flex items-start justify-between space-x-4">
                  <div className="flex items-start space-x-3 flex-1">
                    {getAlertIcon(alert.type, alert.severity)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium">{alert.title}</h4>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getTypeColor(alert.type)}>
                          {alert.type}
                        </Badge>
                        {alert.resolved_at && (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Resolvido
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(alert.created_at).toLocaleString('pt-BR')}
                          </span>
                        </span>
                        {alert.metadata && (
                          <span>
                            Dados: {JSON.stringify(alert.metadata)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {!alert.resolved_at && (
                    <div className="flex items-center space-x-2">
                      {!alert.is_read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(alert.id)}
                          className="text-xs"
                        >
                          Marcar como Lido
                        </Button>
                      )}
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => resolveAlert(alert.id)}
                        className="text-xs"
                      >
                        Resolver
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}