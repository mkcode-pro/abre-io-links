import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';
import { AnalyticsDashboard } from './AnalyticsDashboard';

export function AnalyticsOverview() {
  const { stats, loading } = useAnalytics();
  const [showFullAnalytics, setShowFullAnalytics] = useState(false);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-32 bg-muted/50 rounded" />
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className="glass-card">
        <CardContent className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            Nenhum clique registrado ainda.
          </p>
          <p className="text-sm text-muted-foreground">
            Compartilhe seus links para começar a ver analytics!
          </p>
        </CardContent>
      </Card>
    );
  }

  if (showFullAnalytics) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setShowFullAnalytics(false)}
          >
            ← Voltar
          </Button>
          <h2 className="text-2xl font-bold">Analytics Completo</h2>
        </div>
        <AnalyticsDashboard />
      </div>
    );
  }

  const quickStats = [
    {
      title: 'Total de Cliques',
      value: stats.totalClicks.toLocaleString(),
      change: `+${stats.clicksToday} hoje`,
      icon: TrendingUp,
      color: 'text-blue-500',
    },
    {
      title: 'Visitantes Únicos',
      value: stats.uniqueClicks.toLocaleString(),
      change: `${Math.round((stats.uniqueClicks / Math.max(stats.totalClicks, 1)) * 100)}% do total`,
      icon: Users,
      color: 'text-green-500',
    },
    {
      title: 'Esta Semana',
      value: stats.clicksThisWeek.toLocaleString(),
      change: `vs. ${stats.clicksThisMonth - stats.clicksThisWeek} anterior`,
      icon: Clock,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Top Countries */}
      {stats.topCountries.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Top Países</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFullAnalytics(true)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Ver Tudo
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topCountries.slice(0, 5).map((country, index) => (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium w-4">{index + 1}</span>
                    <span>{country.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ 
                          width: `${(country.clicks / stats.totalClicks) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">
                      {country.clicks}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card className="glass-card border-primary/30">
        <CardContent className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Quer insights mais detalhados?
          </h3>
          <p className="text-muted-foreground mb-4">
            Explore analytics completos com mapas, gráficos temporais e relatórios detalhados.
          </p>
          <Button 
            onClick={() => setShowFullAnalytics(true)}
            className="glass-button"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics Completo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}