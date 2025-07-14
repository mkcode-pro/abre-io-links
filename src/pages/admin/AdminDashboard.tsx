import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Link2, 
  MousePointer, 
  Globe,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Activity
} from 'lucide-react';

export function AdminDashboard() {
  // Dados mockados - serão substituídos por dados reais
  const stats = {
    totalUsers: 1247,
    totalLinks: 8932,
    totalClicks: 45678,
    totalBioPages: 234,
    monthlyRevenue: 2543.50,
    activeAlerts: 3
  };

  const alerts = [
    {
      id: 1,
      type: 'security',
      severity: 'high',
      title: 'Tentativas de login suspeitas',
      description: '15 tentativas de força bruta detectadas',
      time: '5 min atrás'
    },
    {
      id: 2,
      type: 'performance',
      severity: 'medium',
      title: 'Latência elevada',
      description: 'Tempo de resposta acima de 2s',
      time: '12 min atrás'
    },
    {
      id: 3,
      type: 'business',
      severity: 'low',
      title: 'Meta de receita atingida',
      description: '105% da meta mensal alcançada',
      time: '1 hora atrás'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">
          Visão geral da plataforma Abrev.io
        </p>
      </div>

      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Links Criados</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLinks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliques Totais</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +23% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +15% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Alertas Ativos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Alertas Ativos</span>
              <Badge variant="destructive">{stats.activeAlerts}</Badge>
            </CardTitle>
            <CardDescription>
              Últimos eventos que requerem atenção
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className={`w-3 h-3 rounded-full mt-1 ${getSeverityColor(alert.severity)}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Atividade do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Atividade do Sistema</span>
            </CardTitle>
            <CardDescription>
              Status e performance em tempo real
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Status do Servidor</span>
              <Badge variant="default" className="bg-green-500">Online</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Uso de CPU</span>
              <span className="text-sm font-medium">23%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Uso de Memória</span>
              <span className="text-sm font-medium">67%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Conexões Ativas</span>
              <span className="text-sm font-medium">342</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Tempo de Uptime</span>
              <span className="text-sm font-medium">15d 7h 23m</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Adicionais */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bio Pages</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBioPages}</div>
            <p className="text-xs text-muted-foreground">
              +45% criação de páginas bio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">
              Usuários gratuitos → pagos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retenção 30d</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              Usuários ativos após 30 dias
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}