import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity,
  Server,
  Database,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';

interface SystemMetrics {
  status: 'online' | 'warning' | 'offline';
  uptime: string;
  cpu: number;
  memory: number;
  storage: number;
  connections: number;
  responseTime: number;
  lastUpdated: string;
}

export function SystemMonitor() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    status: 'online',
    uptime: '15d 7h 23m',
    cpu: 23,
    memory: 67,
    storage: 45,
    connections: 342,
    responseTime: 145,
    lastUpdated: new Date().toISOString()
  });

  // Simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 80) + 10,
        memory: Math.floor(Math.random() * 90) + 10,
        connections: Math.floor(Math.random() * 500) + 200,
        responseTime: Math.floor(Math.random() * 300) + 50,
        lastUpdated: new Date().toISOString()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'offline':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-black';
      case 'offline':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-red-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Status Geral */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Server className="w-5 h-5" />
            <span>Status do Sistema</span>
            <Badge className={getStatusColor(metrics.status)}>
              {getStatusIcon(metrics.status)}
              <span className="ml-1 capitalize">{metrics.status}</span>
            </Badge>
          </CardTitle>
          <CardDescription>
            Monitoramento em tempo real da infraestrutura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-lg font-semibold">{metrics.uptime}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Wifi className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Conexões Ativas</p>
                <p className="text-lg font-semibold">{metrics.connections}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Tempo de Resposta</p>
                <p className="text-lg font-semibold">{metrics.responseTime}ms</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Database className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Última Atualização</p>
                <p className="text-sm font-medium">
                  {new Date(metrics.lastUpdated).toLocaleTimeString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CPU Usage */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Uso de CPU</CardTitle>
          <Cpu className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.cpu}%</div>
          <Progress 
            value={metrics.cpu} 
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {metrics.cpu < 50 ? 'Normal' : metrics.cpu < 80 ? 'Moderado' : 'Alto'}
          </p>
        </CardContent>
      </Card>

      {/* Memory Usage */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Uso de Memória</CardTitle>
          <MemoryStick className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.memory}%</div>
          <Progress 
            value={metrics.memory} 
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {metrics.memory < 50 ? 'Normal' : metrics.memory < 80 ? 'Moderado' : 'Alto'}
          </p>
        </CardContent>
      </Card>

      {/* Storage Usage */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Uso de Armazenamento</CardTitle>
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.storage}%</div>
          <Progress 
            value={metrics.storage} 
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {metrics.storage < 50 ? 'Normal' : metrics.storage < 80 ? 'Atenção' : 'Crítico'}
          </p>
        </CardContent>
      </Card>

      {/* Services Status */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Status dos Serviços</CardTitle>
          <CardDescription>Estado dos principais componentes do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Banco de Dados</span>
              </div>
              <Badge className="bg-green-500 text-white">Online</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Server className="w-5 h-5 text-purple-500" />
                <span className="font-medium">API Server</span>
              </div>
              <Badge className="bg-green-500 text-white">Online</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Cache Redis</span>
              </div>
              <Badge className="bg-green-500 text-white">Online</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Wifi className="w-5 h-5 text-green-500" />
                <span className="font-medium">CDN</span>
              </div>
              <Badge className="bg-green-500 text-white">Online</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}