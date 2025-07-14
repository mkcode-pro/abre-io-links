import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, BarChart3, QrCode, Users, Plus, TrendingUp, Globe, Clock, LogOut, Settings } from 'lucide-react';
import StatsCard from '@/components/ui/stats-card';
import LinkCard from '@/components/ui/link-card';
import GlassButton from '@/components/ui/glass-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateLinkForm } from '@/components/dashboard/CreateLinkForm';
import { useAuth } from '@/contexts/AuthContext';

export function Dashboard() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const stats = [
    {
      title: "Total de Links",
      value: 0,
      icon: Link,
      trend: { value: 0, isPositive: true },
      description: "último mês",
      gradient: "primary" as const
    },
    {
      title: "Cliques Totais",
      value: "0",
      icon: TrendingUp,
      trend: { value: 0, isPositive: true },
      description: "último mês",
      gradient: "secondary" as const
    },
    {
      title: "Bio Pages",
      value: 0,
      icon: Globe,
      trend: { value: 0, isPositive: true },
      description: "último mês",
      gradient: "accent" as const
    },
    {
      title: "QR Codes",
      value: 0,
      icon: QrCode,
      trend: { value: 0, isPositive: true },
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
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="border-b border-white/10 bg-dark/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Abrev.io
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Olá, {profile?.name || user?.email}
              </span>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  Dashboard
                </h1>
                <p className="text-xl text-muted-foreground">
                  Gerencie seus links e acompanhe suas métricas
                </p>
              </div>
              <Button 
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="glass-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Link
              </Button>
            </div>
          </motion.div>
        </div>

        {showCreateForm && (
          <div className="mb-8">
            <CreateLinkForm onLinkCreated={() => setShowCreateForm(false)} />
          </div>
        )}


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
      </main>
    </div>
  );
}