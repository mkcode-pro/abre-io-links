import React, { useState } from 'react';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TimeSeriesChart, RevenueChart, UserSegmentationChart, PerformanceChart, PredictionChart, ActivityHeatmap } from '@/components/admin/analytics/AdvancedCharts';
import { TopPerformers, ChurnRiskAnalysis, GeographyAnalysis, DeviceBrowserStats } from '@/components/admin/analytics/AnalyticsInsights';
import { ReportsExport } from '@/components/admin/analytics/ReportsExport';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  MousePointer, 
  Link2,
  RefreshCw,
  AlertTriangle,
  Target,
  Globe,
  Smartphone,
  FileText,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export function AdvancedAnalytics() {
  const { data, loading, error, refetch } = useAdvancedAnalytics();
  const [selectedTab, setSelectedTab] = useState('overview');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics Avançado</h1>
            <p className="text-muted-foreground">Carregando dados analíticos...</p>
          </div>
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Avançado</h1>
          <p className="text-muted-foreground">Erro ao carregar dados</p>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={refetch} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar Novamente
        </Button>
      </div>
    );
  }

  if (!data) return null;

  const formatGrowth = (value: number) => {
    const isPositive = value >= 0;
    return (
      <span className={`text-xs flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {isPositive ? '+' : ''}{value.toFixed(1)}% vs mês anterior
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Avançado</h1>
          <p className="text-muted-foreground">
            Análise profunda de performance e insights de negócio
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="default" className="bg-blue-500 text-white">
            <BarChart3 className="w-3 h-3 mr-1" />
            Dados em Tempo Real
          </Badge>
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalUsers.toLocaleString()}</div>
            {formatGrowth(data.overview.growthRates.users)}
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Links</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalLinks.toLocaleString()}</div>
            {formatGrowth(data.overview.growthRates.links)}
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalClicks.toLocaleString()}</div>
            {formatGrowth(data.overview.growthRates.clicks)}
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {data.overview.totalRevenue.toLocaleString()}</div>
            {formatGrowth(data.overview.growthRates.revenue)}
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Analytics */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="predictions">Previsões</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6">
            <TimeSeriesChart 
              data={data.timeSeriesData.daily} 
              title="Tendências Diárias"
              description="Evolução de usuários, links e clicks nos últimos 30 dias"
            />
            
            <div className="grid gap-6 lg:grid-cols-2">
              <RevenueChart data={data.timeSeriesData.monthly.map(m => ({
                month: m.month,
                revenue: m.revenue,
                users: m.users
              }))} />
              <UserSegmentationChart data={data.userSegmentation.byPlan} />
            </div>
          </div>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance" className="space-y-6">
          <PerformanceChart topLinks={data.performance.topLinks} />
          
          <TopPerformers 
            topUsers={data.performance.topUsers}
            topLinks={data.performance.topLinks}
          />
          
          <DeviceBrowserStats 
            deviceStats={data.performance.deviceStats}
            browserStats={data.performance.browserStats}
          />
        </TabsContent>

        {/* Usuários */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ActivityHeatmap data={data.userSegmentation.byActivity} />
            <GeographyAnalysis geographyData={data.userSegmentation.byGeography} />
          </div>
          
          <ChurnRiskAnalysis churnRisk={data.predictions.churnRisk} />
        </TabsContent>

        {/* Previsões */}
        <TabsContent value="predictions" className="space-y-6">
          <PredictionChart data={data.predictions.growthForecast} />
          
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Previsões para Próximo Mês</span>
                </CardTitle>
                <CardDescription>Projeções baseadas em tendências atuais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Novos Usuários</p>
                      <p className="text-sm text-muted-foreground">Estimativa conservadora</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{data.predictions.nextMonthUsers}</p>
                      <p className="text-xs text-muted-foreground">usuários</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Receita Prevista</p>
                      <p className="text-sm text-muted-foreground">Com base no crescimento atual</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">R$ {data.predictions.nextMonthRevenue.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">próximo mês</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Tendências de Crescimento</span>
                </CardTitle>
                <CardDescription>Análise dos próximos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.predictions.growthForecast.slice(0, 3).map((forecast, index) => (
                    <div key={forecast.month} className="flex justify-between items-center p-2 border-l-4 border-primary pl-4">
                      <div>
                        <p className="font-medium">{forecast.month}</p>
                        <p className="text-sm text-muted-foreground">
                          Confiança: {forecast.confidence}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{forecast.predictedUsers} usuários</p>
                        <p className="text-sm text-muted-foreground">
                          R$ {forecast.predictedRevenue.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Insights Automáticos</CardTitle>
                <CardDescription>Análises geradas automaticamente pelos dados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-950">
                    <h4 className="font-medium text-green-800 dark:text-green-200">📈 Crescimento Acelerado</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      O crescimento de usuários aumentou {data.overview.growthRates.users.toFixed(1)}% este mês. 
                      Continue investindo em marketing digital.
                    </p>
                  </div>
                  
                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200">🎯 Performance de Links</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Os top 10 links representam {((data.performance.topLinks.slice(0, 10).reduce((sum, link) => sum + link.clicks, 0) / data.overview.totalClicks) * 100).toFixed(1)}% 
                      de todos os clicks. Concentre esforços nos links de melhor performance.
                    </p>
                  </div>
                  
                  <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">⚠️ Risco de Churn</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {data.predictions.churnRisk.filter(user => user.riskScore > 70).length} usuários 
                      com alto risco de cancelamento. Implemente estratégias de retenção.
                    </p>
                  </div>
                  
                  <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-950">
                    <h4 className="font-medium text-purple-800 dark:text-purple-200">💰 Oportunidade de Revenue</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      {data.userSegmentation.byPlan.find(p => p.plan === 'Free')?.count || 0} usuários gratuitos 
                      representam potencial de conversão de R$ {((data.userSegmentation.byPlan.find(p => p.plan === 'Free')?.count || 0) * 29.99).toLocaleString()}/mês.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Relatórios */}
        <TabsContent value="reports" className="space-y-6">
          <ReportsExport data={data} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}