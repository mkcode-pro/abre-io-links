import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AnalyticsData } from '@/hooks/useAdvancedAnalytics';
import { 
  Download, 
  FileText, 
  BarChart3, 
  PieChart, 
  Calendar as CalendarIcon,
  Filter,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface ReportsExportProps {
  data: AnalyticsData | null;
  loading: boolean;
}

type ReportType = 
  | 'overview' 
  | 'users' 
  | 'links' 
  | 'revenue' 
  | 'performance' 
  | 'predictions';

type ExportFormat = 'csv' | 'pdf' | 'xlsx';

interface ReportConfig {
  type: ReportType;
  format: ExportFormat;
  dateRange: { from?: Date; to?: Date };
  includeCharts: boolean;
  includeDetails: boolean;
  segments: string[];
}

export function ReportsExport({ data, loading }: ReportsExportProps) {
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);
  const [config, setConfig] = useState<ReportConfig>({
    type: 'overview',
    format: 'csv',
    dateRange: {},
    includeCharts: false,
    includeDetails: true,
    segments: ['overview', 'users', 'performance']
  });

  const reportTypes = [
    { value: 'overview', label: 'Visão Geral', description: 'Resumo executivo completo' },
    { value: 'users', label: 'Análise de Usuários', description: 'Segmentação e comportamento' },
    { value: 'links', label: 'Performance de Links', description: 'Top links e estatísticas' },
    { value: 'revenue', label: 'Relatório Financeiro', description: 'Receita e previsões' },
    { value: 'performance', label: 'Performance Geral', description: 'KPIs e métricas' },
    { value: 'predictions', label: 'Previsões', description: 'Forecasting e tendências' }
  ];

  const exportFormats = [
    { value: 'csv', label: 'CSV', description: 'Dados tabulares' },
    { value: 'pdf', label: 'PDF', description: 'Relatório formatado' },
    { value: 'xlsx', label: 'Excel', description: 'Planilha avançada' }
  ];

  const availableSegments = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'users', label: 'Usuários' },
    { id: 'links', label: 'Links' },
    { id: 'performance', label: 'Performance' },
    { id: 'geography', label: 'Geografia' },
    { id: 'devices', label: 'Dispositivos' },
    { id: 'predictions', label: 'Previsões' }
  ];

  const handleSegmentChange = (segmentId: string, checked: boolean) => {
    setConfig(prev => ({
      ...prev,
      segments: checked 
        ? [...prev.segments, segmentId]
        : prev.segments.filter(s => s !== segmentId)
    }));
  };

  const generateCSVReport = () => {
    if (!data) return null;

    let csvContent = '';
    
    if (config.segments.includes('overview')) {
      csvContent += 'VISÃO GERAL\n';
      csvContent += 'Métrica,Valor\n';
      csvContent += `Total de Usuários,${data.overview.totalUsers}\n`;
      csvContent += `Total de Links,${data.overview.totalLinks}\n`;
      csvContent += `Total de Clicks,${data.overview.totalClicks}\n`;
      csvContent += `Receita Total,R$ ${data.overview.totalRevenue.toFixed(2)}\n`;
      csvContent += '\n';
    }

    if (config.segments.includes('users')) {
      csvContent += 'SEGMENTAÇÃO DE USUÁRIOS POR PLANO\n';
      csvContent += 'Plano,Usuários,Receita,Valor Médio Lifetime\n';
      data.userSegmentation.byPlan.forEach(plan => {
        csvContent += `${plan.plan},${plan.count},R$ ${plan.revenue.toFixed(2)},R$ ${plan.avgLifetimeValue.toFixed(2)}\n`;
      });
      csvContent += '\n';
    }

    if (config.segments.includes('performance')) {
      csvContent += 'TOP 10 LINKS\n';
      csvContent += 'Título,Clicks,CTR\n';
      data.performance.topLinks.slice(0, 10).forEach(link => {
        csvContent += `"${link.title}",${link.clicks},${link.ctr.toFixed(2)}%\n`;
      });
      csvContent += '\n';
    }

    if (config.segments.includes('geography')) {
      csvContent += 'DISTRIBUIÇÃO GEOGRÁFICA\n';
      csvContent += 'País,Usuários,Clicks\n';
      data.userSegmentation.byGeography.forEach(geo => {
        csvContent += `${geo.country},${geo.users},${geo.clicks}\n`;
      });
      csvContent += '\n';
    }

    return csvContent;
  };

  const exportReport = async () => {
    if (!data) {
      toast({
        title: 'Erro',
        description: 'Nenhum dado disponível para exportação',
        variant: 'destructive'
      });
      return;
    }

    setExporting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simular processamento

      const reportData = generateCSVReport();
      if (!reportData) {
        throw new Error('Erro ao gerar relatório');
      }

      // Criar arquivo e fazer download
      const blob = new Blob([reportData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `relatorio_analytics_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      toast({
        title: 'Relatório exportado com sucesso!',
        description: `Arquivo ${config.format.toUpperCase()} baixado.`
      });

    } catch (error) {
      toast({
        title: 'Erro na exportação',
        description: 'Não foi possível gerar o relatório.',
        variant: 'destructive'
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Configuração do Relatório */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Configuração do Relatório</span>
          </CardTitle>
          <CardDescription>
            Configure os parâmetros para gerar relatórios personalizados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tipo de Relatório */}
          <div className="space-y-3">
            <Label>Tipo de Relatório</Label>
            <Select
              value={config.type}
              onValueChange={(value: ReportType) => setConfig(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Formato de Exportação */}
          <div className="space-y-3">
            <Label>Formato de Exportação</Label>
            <Select
              value={config.format}
              onValueChange={(value: ExportFormat) => setConfig(prev => ({ ...prev, format: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {exportFormats.map(format => (
                  <SelectItem key={format.value} value={format.value}>
                    <div>
                      <div className="font-medium">{format.label}</div>
                      <div className="text-xs text-muted-foreground">{format.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Período */}
          <div className="space-y-3">
            <Label>Período do Relatório</Label>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {config.dateRange.from 
                      ? format(config.dateRange.from, 'dd/MM/yyyy', { locale: ptBR })
                      : 'Data inicial'
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={config.dateRange.from}
                    onSelect={(date) => setConfig(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, from: date } 
                    }))}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex-1 justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {config.dateRange.to 
                      ? format(config.dateRange.to, 'dd/MM/yyyy', { locale: ptBR })
                      : 'Data final'
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={config.dateRange.to}
                    onSelect={(date) => setConfig(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, to: date } 
                    }))}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Seções para Incluir */}
          <div className="space-y-3">
            <Label>Seções para Incluir</Label>
            <div className="grid grid-cols-2 gap-3">
              {availableSegments.map(segment => (
                <div key={segment.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={segment.id}
                    checked={config.segments.includes(segment.id)}
                    onCheckedChange={(checked) => handleSegmentChange(segment.id, !!checked)}
                  />
                  <Label htmlFor={segment.id} className="text-sm">
                    {segment.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Opções Avançadas */}
          <div className="space-y-3">
            <Label>Opções Avançadas</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCharts"
                  checked={config.includeCharts}
                  onCheckedChange={(checked) => setConfig(prev => ({ 
                    ...prev, 
                    includeCharts: !!checked 
                  }))}
                />
                <Label htmlFor="includeCharts" className="text-sm">
                  Incluir gráficos (apenas PDF)
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeDetails"
                  checked={config.includeDetails}
                  onCheckedChange={(checked) => setConfig(prev => ({ 
                    ...prev, 
                    includeDetails: !!checked 
                  }))}
                />
                <Label htmlFor="includeDetails" className="text-sm">
                  Incluir detalhamentos
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview e Ações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Preview do Relatório</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/30">
            <h4 className="font-medium mb-2">Relatório: {reportTypes.find(t => t.value === config.type)?.label}</h4>
            <p className="text-sm text-muted-foreground mb-3">
              {reportTypes.find(t => t.value === config.type)?.description}
            </p>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Formato:</span>
                <span className="font-medium">{config.format.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>Seções:</span>
                <span className="font-medium">{config.segments.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Período:</span>
                <span className="font-medium">
                  {config.dateRange.from && config.dateRange.to 
                    ? `${format(config.dateRange.from, 'dd/MM', { locale: ptBR })} - ${format(config.dateRange.to, 'dd/MM', { locale: ptBR })}`
                    : 'Último período'
                  }
                </span>
              </div>
            </div>
          </div>

          <Button 
            onClick={exportReport}
            disabled={loading || exporting || !data || config.segments.length === 0}
            className="w-full"
          >
            {exporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando Relatório...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Exportar Relatório
              </>
            )}
          </Button>

          {loading && (
            <p className="text-xs text-muted-foreground text-center">
              Aguardando dados do analytics...
            </p>
          )}

          {!data && !loading && (
            <p className="text-xs text-destructive text-center">
              Erro ao carregar dados
            </p>
          )}

          {config.segments.length === 0 && (
            <p className="text-xs text-orange-600 text-center">
              Selecione pelo menos uma seção
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}