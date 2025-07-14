import { useFinancialManagement } from "@/hooks/useFinancialManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, TrendingUp, Users, CreditCard, Download, Calculator, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const FinancialDashboard = () => {
  const {
    invoices,
    planFeatures,
    financialMetrics,
    summary,
    loading,
    error,
    updateInvoiceStatus,
    recalculateMetrics,
    exportFinancialData
  } = useFinancialManagement();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive">Erro ao carregar dados financeiros: {error}</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  // Chart data preparation
  const revenueChartData = financialMetrics.map(metric => ({
    date: format(new Date(metric.metric_date), 'dd/MM', { locale: ptBR }),
    mrr: metric.mrr,
    arr: metric.arr / 12 // Monthly equivalent
  }));

  const userGrowthData = financialMetrics.map(metric => ({
    date: format(new Date(metric.metric_date), 'dd/MM', { locale: ptBR }),
    total: metric.total_users,
    paid: metric.paid_users,
    conversion: metric.conversion_rate
  }));

  const planDistribution = planFeatures
    .filter(f => f.feature_name === 'price_monthly')
    .map(f => ({
      name: f.plan_type.charAt(0).toUpperCase() + f.plan_type.slice(1),
      value: parseFloat(f.feature_value),
      color: f.plan_type === 'free' ? '#8884d8' : f.plan_type === 'pro' ? '#82ca9d' : '#ffc658'
    }));

  const handleExportData = async () => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    const endDate = new Date();
    
    await exportFinancialData(
      startDate.toISOString(),
      endDate.toISOString()
    );
  };

  const handleRecalculateMetrics = async () => {
    await recalculateMetrics();
  };

  const handleUpdateInvoiceStatus = async (invoiceId: string, newStatus: string) => {
    await updateInvoiceStatus(invoiceId, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
          <p className="text-muted-foreground">Gerencie receitas, faturas e métricas financeiras</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRecalculateMetrics}>
            <Calculator className="h-4 w-4 mr-2" />
            Recalcular Métricas
          </Button>
          <Button onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Dados
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.totalRevenue || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary?.monthlyRevenue || 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.conversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturas Pendentes</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.pendingInvoices || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="invoices">Faturas</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Crescimento de Receita (MRR/ARR)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Area type="monotone" dataKey="mrr" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} name="MRR" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crescimento de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total" />
                    <Line type="monotone" dataKey="paid" stroke="#82ca9d" name="Pagos" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Plano</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={planDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    >
                      {planDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas Chave</CardTitle>
                <CardDescription>Últimas métricas calculadas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>MRR (Receita Recorrente Mensal):</span>
                  <strong>{formatCurrency(financialMetrics[0]?.mrr || 0)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>ARR (Receita Recorrente Anual):</span>
                  <strong>{formatCurrency(financialMetrics[0]?.arr || 0)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>ARPU (Receita Média por Usuário):</span>
                  <strong>{formatCurrency(summary?.averageRevenuePerUser || 0)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Churn:</span>
                  <strong>{financialMetrics[0]?.churn_rate.toFixed(1)}%</strong>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Faturas Recentes</CardTitle>
              <CardDescription>Últimas faturas geradas no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {invoices.slice(0, 10).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusLabel(invoice.status)}
                        </Badge>
                        <span className="font-medium">{invoice.plan_type.toUpperCase()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Vencimento: {format(new Date(invoice.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(invoice.amount)}</div>
                      <div className="text-sm text-muted-foreground">{invoice.currency}</div>
                    </div>
                    {invoice.status === 'pending' && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateInvoiceStatus(invoice.id, 'paid')}
                        >
                          Marcar como Pago
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleUpdateInvoiceStatus(invoice.id, 'failed')}
                        >
                          Marcar como Falhou
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {['free', 'pro', 'enterprise'].map((planType) => {
              const features = planFeatures.filter(f => f.plan_type === planType);
              const price = features.find(f => f.feature_name === 'price_monthly')?.feature_value || '0';
              
              return (
                <Card key={planType}>
                  <CardHeader>
                    <CardTitle className="capitalize">{planType}</CardTitle>
                    <CardDescription>
                      {formatCurrency(parseFloat(price))}/mês
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {features
                        .filter(f => f.feature_name !== 'price_monthly' && f.feature_name !== 'price_yearly')
                        .map((feature) => (
                          <div key={feature.feature_name} className="flex justify-between text-sm">
                            <span className="capitalize">{feature.feature_name.replace(/_/g, ' ')}:</span>
                            <span className="font-medium">
                              {feature.feature_value === 'true' ? '✓' : 
                               feature.feature_value === 'false' ? '✗' : 
                               feature.feature_value}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};