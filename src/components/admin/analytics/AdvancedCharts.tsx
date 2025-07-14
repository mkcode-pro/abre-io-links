import React from 'react';
import { Line, Bar, Area, Pie, ComposedChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, BarChart, AreaChart, PieChart, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, MousePointer, Link2 } from 'lucide-react';

const COLORS = {
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  muted: 'hsl(var(--muted-foreground))',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  green: '#10b981',
  orange: '#f97316'
};

interface TimeSeriesChartProps {
  data: Array<{
    date: string;
    users: number;
    links: number;
    clicks: number;
    revenue: number;
  }>;
  title: string;
  description?: string;
}

export function TimeSeriesChart({ data, title, description }: TimeSeriesChartProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString('pt-BR')}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke={COLORS.blue} 
              strokeWidth={2}
              name="Usuários"
              dot={{ fill: COLORS.blue, strokeWidth: 2, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="links" 
              stroke={COLORS.green} 
              strokeWidth={2}
              name="Links"
              dot={{ fill: COLORS.green, strokeWidth: 2, r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="clicks" 
              stroke={COLORS.purple} 
              strokeWidth={2}
              name="Clicks"
              dot={{ fill: COLORS.purple, strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    users: number;
  }>;
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5" />
          <span>Receita Mensal</span>
        </CardTitle>
        <CardDescription>Evolução da receita e novos usuários</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="revenue" fill={COLORS.success} name="Receita (R$)" />
            <Line yAxisId="right" type="monotone" dataKey="users" stroke={COLORS.blue} strokeWidth={2} name="Novos Usuários" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface UserSegmentationChartProps {
  data: Array<{
    plan: string;
    count: number;
    revenue: number;
  }>;
}

export function UserSegmentationChart({ data }: UserSegmentationChartProps) {
  const PLAN_COLORS = [COLORS.success, COLORS.warning, COLORS.primary, COLORS.purple];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Segmentação por Plano</span>
        </CardTitle>
        <CardDescription>Distribuição de usuários e receita</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ plan, count, percent }) => `${plan}: ${count} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PLAN_COLORS[index % PLAN_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string) => [value, name === 'count' ? 'Usuários' : 'Receita']}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface PerformanceChartProps {
  topLinks: Array<{
    title: string;
    clicks: number;
    ctr: number;
  }>;
}

export function PerformanceChart({ topLinks }: PerformanceChartProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Link2 className="w-5 h-5" />
          <span>Top 10 Links Performance</span>
        </CardTitle>
        <CardDescription>Links com melhor performance por clicks e CTR</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={topLinks.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="title" 
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar yAxisId="left" dataKey="clicks" fill={COLORS.blue} name="Clicks" />
            <Line yAxisId="right" type="monotone" dataKey="ctr" stroke={COLORS.orange} strokeWidth={2} name="CTR %" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface PredictionChartProps {
  data: Array<{
    month: string;
    predictedUsers: number;
    predictedRevenue: number;
    confidence: number;
  }>;
}

export function PredictionChart({ data }: PredictionChartProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Previsões de Crescimento</span>
        </CardTitle>
        <CardDescription>Projeções para os próximos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.success} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="predictedUsers"
              stroke={COLORS.blue}
              fillOpacity={1}
              fill="url(#usersGradient)"
              name="Usuários Previstos"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="predictedRevenue"
              stroke={COLORS.success}
              fillOpacity={1}
              fill="url(#revenueGradient)"
              name="Receita Prevista (R$)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="confidence"
              stroke={COLORS.warning}
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Confiança %"
              dot={{ fill: COLORS.warning, strokeWidth: 2, r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface ActivityHeatmapProps {
  data: Array<{
    segment: string;
    count: number;
    description: string;
  }>;
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const maxCount = Math.max(...data.map(d => d.count));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MousePointer className="w-5 h-5" />
          <span>Segmentação por Atividade</span>
        </CardTitle>
        <CardDescription>Distribuição de usuários por nível de atividade</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((segment, index) => {
            const intensity = (segment.count / maxCount) * 100;
            const color = intensity > 75 ? COLORS.success : 
                         intensity > 50 ? COLORS.warning : 
                         intensity > 25 ? COLORS.blue : COLORS.muted;
            
            return (
              <div key={segment.segment} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{segment.segment}</h4>
                    <p className="text-xs text-muted-foreground">{segment.description}</p>
                  </div>
                  <span className="font-bold text-lg">{segment.count}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${intensity}%`,
                      backgroundColor: color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}