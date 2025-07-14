import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, BarChart3, QrCode, Users, Plus, TrendingUp, Globe, Clock, LogOut, Settings } from 'lucide-react';
import StatsCard from '@/components/ui/stats-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateLinkForm } from '@/components/dashboard/CreateLinkForm';
import { LinksTable } from '@/components/dashboard/LinksTable';
import { useLinks } from '@/hooks/useLinks';
import { useAuth } from '@/contexts/AuthContext';

export function Dashboard() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user, profile, signOut } = useAuth();
  const {
    links,
    loading: linksLoading,
    hasMore,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedLinks,
    setSelectedLinks,
    updateLink,
    deleteLink,
    deleteSelectedLinks,
    toggleSelectedLinks,
    loadMore,
    refresh,
  } = useLinks();

  const handleSignOut = async () => {
    await signOut();
  };

  // Calculate real stats from links
  const stats = [
    {
      title: "Total de Links",
      value: links.length,
      icon: Link,
      trend: { value: links.length, isPositive: true },
      description: "total criados",
      gradient: "primary" as const
    },
    {
      title: "Cliques Totais",
      value: links.reduce((total, link) => total + (link.clicks || 0), 0).toLocaleString(),
      icon: BarChart3,
      trend: { value: 0, isPositive: true },
      description: "último mês",
      gradient: "secondary" as const
    },
    {
      title: "Links Ativos",
      value: links.filter(link => link.is_active).length,
      icon: TrendingUp,
      trend: { value: Math.round((links.filter(link => link.is_active).length / Math.max(links.length, 1)) * 100), isPositive: true },
      description: "% ativos",
      gradient: "accent" as const
    },
    {
      title: "Criados Hoje",
      value: links.filter(link => {
        const today = new Date().toDateString();
        return new Date(link.created_at).toDateString() === today;
      }).length,
      icon: Clock,
      trend: { value: 0, isPositive: true },
      description: "hoje",
      gradient: "primary" as const
    },
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
            <CreateLinkForm 
              onLinkCreated={() => {
                setShowCreateForm(false);
                refresh(); // Refresh the links data
              }}
            />
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Links Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Meus Links</h2>
              <Button
                onClick={() => setShowCreateForm(true)}
                size="sm"
                className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 backdrop-blur-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Link
              </Button>
            </div>
            
            <LinksTable
              links={links}
              loading={linksLoading}
              hasMore={hasMore}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              selectedLinks={selectedLinks}
              setSelectedLinks={setSelectedLinks}
              onUpdateLink={updateLink}
              onDeleteLink={deleteLink}
              onDeleteSelected={deleteSelectedLinks}
              onToggleSelected={toggleSelectedLinks}
              onLoadMore={loadMore}
            />
          </motion.div>

          {/* Analytics Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Analytics Rápidos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {links.reduce((total, link) => total + (link.clicks || 0), 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total de Cliques</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-xl font-semibold">
                      {links.filter(link => {
                        const today = new Date().toDateString();
                        return new Date(link.created_at).toDateString() === today;
                      }).reduce((total, link) => total + (link.clicks || 0), 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Cliques Hoje</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xl font-semibold">
                      {Math.round((links.filter(link => link.is_active).length / Math.max(links.length, 1)) * 100)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Links Ativos</p>
                  </div>
                </CardContent>
              </Card>

              {/* Upgrade Prompt */}
              <Card className="glass-card bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30">
                <CardContent className="text-center p-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Upgrade para PRO</h3>
                  <p className="text-sm text-foreground-muted mb-4">
                    Analytics avançado, domínios personalizados e muito mais.
                  </p>
                  <Button className="w-full glass-button">
                    Fazer Upgrade
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}