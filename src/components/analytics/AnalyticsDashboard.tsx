import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  Calendar,
  Globe,
  Monitor,
  Smartphone,
  Download,
  TrendingUp,
  Users,
  Clock,
  MapPin,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAnalytics, AnalyticsStats } from '@/hooks/useAnalytics';
import { MapboxMap } from './MapboxMap';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

interface AnalyticsDashboardProps {
  linkId?: string;
  linkTitle?: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function AnalyticsDashboard({ linkId, linkTitle }: AnalyticsDashboardProps) {
  const { stats, loading, analytics } = useAnalytics(linkId);
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-48 bg-muted/50 rounded" />
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">
            Nenhum dado de analytics disponível ainda.
          </p>
        </CardContent>
      </Card>
    );
  }

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text(linkTitle ? `Analytics - ${linkTitle}` : 'Analytics Dashboard', 20, 30);
    
    doc.setFontSize(12);
    let yPosition = 50;
    
    doc.text(`Total de Cliques: ${stats.totalClicks}`, 20, yPosition);
    doc.text(`Cliques Únicos: ${stats.uniqueClicks}`, 20, yPosition + 10);
    doc.text(`Cliques Hoje: ${stats.clicksToday}`, 20, yPosition + 20);
    doc.text(`Cliques Esta Semana: ${stats.clicksThisWeek}`, 20, yPosition + 30);
    doc.text(`Cliques Este Mês: ${stats.clicksThisMonth}`, 20, yPosition + 40);
    
    yPosition += 60;
    doc.text('Top Países:', 20, yPosition);
    stats.topCountries.slice(0, 5).forEach((country, index) => {
      doc.text(`${index + 1}. ${country.country}: ${country.clicks} cliques`, 30, yPosition + 10 + (index * 10));
    });
    
    const filename = linkTitle ? `analytics-${linkTitle.replace(/[^a-zA-Z0-9]/g, '-')}.pdf` : 'analytics-report.pdf';
    doc.save(filename);
    
    toast({
      title: "Relatório Exportado",
      description: "Relatório em PDF baixado com sucesso!",
    });
  };

  const exportToCSV = () => {
    const csvData = [
      ['Data', 'País', 'Cidade', 'Navegador', 'Sistema', 'Dispositivo', 'Referrer'],
      ...analytics.map(click => [
        new Date(click.clicked_at).toLocaleString('pt-BR'),
        click.country || 'Unknown',
        click.city || 'Unknown',
        click.browser || 'Unknown',
        click.os || 'Unknown',
        click.device || 'Unknown',
        click.referrer || 'Direct'
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = linkTitle ? `analytics-${linkTitle.replace(/[^a-zA-Z0-9]/g, '-')}.csv` : 'analytics-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Dados Exportados",
      description: "Dados em CSV baixados com sucesso!",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {linkTitle ? `Analytics - ${linkTitle}` : 'Analytics Dashboard'}
          </h2>
          <p className="text-muted-foreground">
            Análise detalhada de performance e comportamento dos usuários
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" onClick={exportToPDF}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Únicos</p>
                <p className="text-2xl font-bold">{stats.uniqueClicks.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hoje</p>
                <p className="text-2xl font-bold">{stats.clicksToday.toLocaleString()}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Esta Semana</p>
                <p className="text-2xl font-bold">{stats.clicksThisWeek.toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Este Mês</p>
                <p className="text-2xl font-bold">{stats.clicksThisMonth.toLocaleString()}</p>
              </div>
              <MapPin className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="timeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="geography">Geografia</TabsTrigger>
          <TabsTrigger value="technology">Tecnologia</TabsTrigger>
          <TabsTrigger value="sources">Origens</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-6">
          {/* Daily Chart */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Cliques Diários (Últimos 30 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats.dailyClicks}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                    formatter={(value) => [value, 'Cliques']}
                  />
                  <Area type="monotone" dataKey="clicks" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Hourly Chart */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Cliques por Hora (Hoje)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.hourlyClicks}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="hour" tickFormatter={(hour) => `${hour}:00`} />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Cliques']} />
                  <Bar dataKey="clicks" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          {/* Geographic Map */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Mapa de Calor Geográfico</CardTitle>
            </CardHeader>
            <CardContent>
              <MapboxMap data={stats.topCountries} className="h-96" />
            </CardContent>
          </Card>

          {/* Top Countries */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Top Países</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topCountries.map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <span>{country.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ 
                            width: `${(country.clicks / stats.totalClicks) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {country.clicks}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technology" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Browsers */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Navegadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={stats.topBrowsers}
                      dataKey="clicks"
                      nameKey="browser"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ browser, percent }) => `${browser} ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats.topBrowsers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Devices */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Dispositivos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={stats.topDevices}
                      dataKey="clicks"
                      nameKey="device"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ device, percent }) => `${device} ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats.topDevices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          {/* Referrers */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Principais Origens de Tráfego
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.topReferrers} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" />
                  <YAxis dataKey="referrer" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}