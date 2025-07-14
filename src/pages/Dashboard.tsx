import React from 'react';
import { motion } from 'framer-motion';
import { 
  Link, 
  BarChart3, 
  Users, 
  Globe,
  TrendingUp,
  Eye,
  Plus,
  ExternalLink,
  Copy,
  QrCode,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import Navigation from '@/components/ui/navigation';
import StatsCard from '@/components/ui/stats-card';
import LinkCard from '@/components/ui/link-card';
import GlassButton from '@/components/ui/glass-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Dashboard = () => {
  // Mock data
  const stats = [
    {
      title: "Total de Links",
      value: 245,
      icon: Link,
      trend: { value: 12, isPositive: true },
      description: "último mês",
      gradient: "primary" as const
    },
    {
      title: "Cliques Totais",
      value: "125.8K",
      icon: Eye,
      trend: { value: 8.5, isPositive: true },
      description: "último mês",
      gradient: "secondary" as const
    },
    {
      title: "Taxa de Conversão",
      value: "3.2%",
      icon: TrendingUp,
      trend: { value: 1.8, isPositive: true },
      description: "último mês",
      gradient: "accent" as const
    },
    {
      title: "Bio Pages",
      value: 3,
      icon: Globe,
      trend: { value: 50, isPositive: true },
      description: "último mês",
      gradient: "primary" as const
    }
  ];

  const recentLinks = [
    {
      id: '1',
      originalUrl: 'https://www.exemplo.com/produto-incrivel-que-voce-precisa-conhecer',
      shortUrl: 'https://abrev.io/abc123',
      title: 'Produto Incrível',
      description: 'Landing page do nosso novo produto revolucionário',
      clicks: 1250,
      createdAt: new Date('2024-01-15'),
      tags: ['marketing', 'produto'],
      isActive: true
    },
    {
      id: '2',
      originalUrl: 'https://blog.empresa.com/artigo-sobre-marketing-digital',
      shortUrl: 'https://abrev.io/mkt456',
      title: 'Artigo Marketing Digital',
      description: 'Guia completo sobre marketing digital em 2024',
      clicks: 892,
      createdAt: new Date('2024-01-12'),
      tags: ['blog', 'marketing'],
      isActive: true
    },
    {
      id: '3',
      originalUrl: 'https://evento.com/inscricoes-webinar-gratuito',
      shortUrl: 'https://abrev.io/web789',
      title: 'Webinar Gratuito',
      description: 'Inscrições para o webinar sobre vendas',
      clicks: 2108,
      createdAt: new Date('2024-01-10'),
      tags: ['evento', 'webinar'],
      isActive: true
    }
  ];

  const quickActions = [
    {
      title: "Criar Link",
      description: "Encurte uma nova URL",
      icon: Plus,
      action: () => console.log('Criar link'),
      variant: "primary" as const
    },
    {
      title: "Bio Page",
      description: "Editar sua bio page",
      icon: Globe,
      action: () => console.log('Bio page'),
      variant: "secondary" as const
    },
    {
      title: "Analytics",
      description: "Ver relatórios completos",
      icon: BarChart3,
      action: () => console.log('Analytics'),
      variant: "accent" as const
    }
  ];

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    // TODO: Show toast notification
  };

  return (
    <div className="min-h-screen">
      <Navigation isAuthenticated={true} />
      
      <div className="pt-20 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-poppins font-bold mb-2">
            Dashboard
          </h1>
          <p className="text-foreground-muted">
            Gerencie seus links e acompanhe suas métricas
          </p>
        </motion.div>

        {/* Quick Create */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Criar Link Rápido</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Cole sua URL aqui..."
                className="glass-input"
              />
            </div>
            <GlassButton icon={Plus}>
              Encurtar
            </GlassButton>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              description={stat.description}
              gradient={stat.gradient}
            />
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Links Recentes</h2>
              <Button variant="ghost" className="text-primary">
                Ver Todos
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentLinks.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <LinkCard
                    {...link}
                    onCopy={handleCopy}
                    onEdit={(id) => console.log('Edit', id)}
                    onDelete={(id) => console.log('Delete', id)}
                    onViewAnalytics={(id) => console.log('Analytics', id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions & Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4">Ações Rápidas</h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={action.action}
                      className="w-full glass-card p-4 text-left hover:bg-background-tertiary transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          action.variant === 'primary' ? 'bg-primary/20 text-primary' :
                          action.variant === 'secondary' ? 'bg-secondary/20 text-secondary' :
                          'bg-accent/20 text-accent'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium">{action.title}</p>
                          <p className="text-sm text-foreground-muted">{action.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6">
              <h3 className="text-xl font-semibold mb-4">Atividade Recente</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-background-tertiary/50">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Link criado</p>
                    <p className="text-xs text-foreground-muted">Produto Incrível • há 2 horas</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-background-tertiary/50">
                  <div className="w-2 h-2 bg-info rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">1000 cliques atingidos</p>
                    <p className="text-xs text-foreground-muted">Webinar Gratuito • há 4 horas</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-background-tertiary/50">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Bio page atualizada</p>
                    <p className="text-xs text-foreground-muted">Perfil principal • ontem</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade Prompt */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="glass-card p-6 bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Upgrade para PRO</h3>
                <p className="text-sm text-foreground-muted mb-4">
                  Desbloqueie analytics avançado, domínios personalizados e muito mais.
                </p>
                <GlassButton className="w-full">
                  Fazer Upgrade
                </GlassButton>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;