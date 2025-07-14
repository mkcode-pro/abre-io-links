import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  AlertTriangle, 
  Crown, 
  TrendingDown,
  Mail,
  Calendar,
  User,
  Award,
  Target,
  Zap,
  Download,
  Filter
} from 'lucide-react';

interface TopPerformersProps {
  topUsers: Array<{
    id: string;
    name: string;
    email: string;
    totalClicks: number;
    totalLinks: number;
    plan: string;
  }>;
  topLinks: Array<{
    id: string;
    title: string;
    clicks: number;
    ctr: number;
    userId: string;
  }>;
}

export function TopPerformers({ topUsers, topLinks }: TopPerformersProps) {
  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-purple-500 text-white';
      case 'premium':
        return 'bg-gold-500 text-white';
      case 'free':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getInitials = (name: string, email: string) => {
    if (name && name !== 'Usuário sem nome') {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Top Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Top Usuários</span>
          </CardTitle>
          <CardDescription>Usuários com melhor performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topUsers.slice(0, 5).map((user, index) => (
              <div key={user.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold w-6 text-center">
                    #{index + 1}
                  </span>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10">
                      {getInitials(user.name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium truncate">{user.name}</h4>
                    {user.plan === 'enterprise' && <Crown className="w-4 h-4 text-purple-500" />}
                    <Badge className={getPlanBadgeColor(user.plan)}>
                      {user.plan.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{user.totalClicks} clicks</span>
                    <span>{user.totalLinks} links</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium">
                    {user.totalClicks > 0 ? (user.totalClicks / user.totalLinks).toFixed(1) : '0'} 
                    <span className="text-xs ml-1">clicks/link</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Top Links</span>
          </CardTitle>
          <CardDescription>Links com melhor performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topLinks.slice(0, 5).map((link, index) => (
              <div key={link.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold w-6 text-center">
                    #{index + 1}
                  </span>
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{link.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{link.clicks} clicks</span>
                    <span>{link.ctr.toFixed(1)}% CTR</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    {link.clicks}
                  </div>
                  <div className="text-xs text-muted-foreground">clicks</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ChurnRiskAnalysisProps {
  churnRisk: Array<{
    userId: string;
    userName: string;
    email: string;
    riskScore: number;
    lastActivity: string;
  }>;
}

export function ChurnRiskAnalysis({ churnRisk }: ChurnRiskAnalysisProps) {
  const [showAll, setShowAll] = useState(false);
  
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: 'Crítico', color: 'bg-red-500 text-white' };
    if (score >= 60) return { level: 'Alto', color: 'bg-orange-500 text-white' };
    if (score >= 40) return { level: 'Médio', color: 'bg-yellow-500 text-black' };
    return { level: 'Baixo', color: 'bg-green-500 text-white' };
  };

  const displayedRisk = showAll ? churnRisk : churnRisk.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <span>Análise de Risco de Churn</span>
        </CardTitle>
        <CardDescription>
          Usuários com maior probabilidade de cancelamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedRisk.map((user) => {
            const risk = getRiskLevel(user.riskScore);
            
            return (
              <div key={user.userId} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium truncate">{user.userName}</h4>
                    <Badge className={risk.color}>
                      {risk.level}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                    <Calendar className="w-3 h-3" />
                    <span>Última atividade: {new Date(user.lastActivity).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">
                    {user.riskScore.toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">risco</div>
                </div>
              </div>
            );
          })}
          
          {churnRisk.length > 5 && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Ver Menos' : `Ver Todos (${churnRisk.length})`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface GeographyAnalysisProps {
  geographyData: Array<{
    country: string;
    users: number;
    clicks: number;
  }>;
}

export function GeographyAnalysis({ geographyData }: GeographyAnalysisProps) {
  const totalUsers = geographyData.reduce((sum, item) => sum + item.users, 0);
  const totalClicks = geographyData.reduce((sum, item) => sum + item.clicks, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição Geográfica</CardTitle>
        <CardDescription>Usuários e atividade por país</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>País</TableHead>
              <TableHead>Usuários</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Média Clicks/Usuário</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {geographyData.map((country) => (
              <TableRow key={country.country}>
                <TableCell className="font-medium">{country.country}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{country.users}</span>
                    <span className="text-xs text-muted-foreground">
                      ({((country.users / totalUsers) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{country.clicks}</span>
                    <span className="text-xs text-muted-foreground">
                      ({((country.clicks / totalClicks) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {country.users > 0 ? (country.clicks / country.users).toFixed(1) : '0'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface DeviceBrowserStatsProps {
  deviceStats: Array<{ device: string; count: number; percentage: number }>;
  browserStats: Array<{ browser: string; count: number; percentage: number }>;
}

export function DeviceBrowserStats({ deviceStats, browserStats }: DeviceBrowserStatsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Dispositivos</CardTitle>
          <CardDescription>Distribuição de acessos por dispositivo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deviceStats.slice(0, 5).map((device) => (
              <div key={device.device} className="flex items-center justify-between">
                <span className="text-sm font-medium">{device.device}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${device.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {device.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Navegadores</CardTitle>
          <CardDescription>Distribuição de acessos por navegador</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {browserStats.slice(0, 5).map((browser) => (
              <div key={browser.browser} className="flex items-center justify-between">
                <span className="text-sm font-medium">{browser.browser}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div 
                      className="bg-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${browser.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {browser.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}