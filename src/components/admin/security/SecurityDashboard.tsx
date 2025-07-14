import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Shield, ShieldCheck, ShieldX, Download, Upload, Ban, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DomainFilter {
  id: string;
  domain: string;
  type: string;
  reason: string;
  created_at: string;
}

interface UserReport {
  id: string;
  reason: string;
  description: string;
  status: string;
  created_at: string;
  links?: { title: string; original_url: string };
}

interface SecurityEvent {
  id: string;
  event_type: string;
  ip_address: string;
  severity: string;
  created_at: string;
  details: any;
}

export function SecurityDashboard() {
  const [domainFilters, setDomainFilters] = useState<DomainFilter[]>([]);
  const [userReports, setUserReports] = useState<UserReport[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState("");
  const [newDomainType, setNewDomainType] = useState<'blocked' | 'allowed'>('blocked');
  const [newDomainReason, setNewDomainReason] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      const [domainsRes, reportsRes, eventsRes] = await Promise.all([
        supabase.from('domain_filters').select('*').order('created_at', { ascending: false }),
        supabase.from('user_reports').select(`
          *,
          links(title, original_url)
        `).order('created_at', { ascending: false }),
        supabase.from('security_events').select('*').order('created_at', { ascending: false }).limit(50)
      ]);

      if (domainsRes.data) setDomainFilters(domainsRes.data);
      if (reportsRes.data) setUserReports(reportsRes.data);
      if (eventsRes.data) setSecurityEvents(eventsRes.data.map(event => ({
        ...event,
        ip_address: String(event.ip_address)
      })));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao carregar dados de segurança",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addDomainFilter = async () => {
    if (!newDomain.trim()) return;

    try {
      const { error } = await supabase.from('domain_filters').insert({
        domain: newDomain.trim().toLowerCase(),
        type: newDomainType,
        reason: newDomainReason.trim()
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Domínio ${newDomainType === 'blocked' ? 'bloqueado' : 'permitido'} com sucesso`,
      });

      setNewDomain("");
      setNewDomainReason("");
      loadSecurityData();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao adicionar filtro de domínio",
        variant: "destructive"
      });
    }
  };

  const updateReportStatus = async (reportId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('user_reports')
        .update({ 
          status,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Status do reporte atualizado",
      });

      loadSecurityData();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar reporte",
        variant: "destructive"
      });
    }
  };

  const createBackup = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.rpc('create_data_backup', {
        _backup_type: 'manual',
        _admin_user_id: user.id
      });

      toast({
        title: "Sucesso",
        description: "Backup iniciado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar backup",
        variant: "destructive"
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'default';
      case 'reviewed': return 'secondary';
      case 'dismissed': return 'outline';
      default: return 'destructive';
    }
  };

  if (loading) return <div className="flex justify-center p-8">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Segurança e Moderação</h1>
        <Button onClick={createBackup} className="gap-2">
          <Download className="h-4 w-4" />
          Criar Backup
        </Button>
      </div>

      <Tabs defaultValue="domains" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="domains">Filtros de Domínio</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
          <TabsTrigger value="events">Eventos de Segurança</TabsTrigger>
          <TabsTrigger value="backup">Backup & Recuperação</TabsTrigger>
        </TabsList>

        <TabsContent value="domains" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Filtros de Domínio
              </CardTitle>
              <CardDescription>
                Gerencie domínios bloqueados e permitidos para proteger os usuários
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="exemplo.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="flex-1"
                />
                <Select value={newDomainType} onValueChange={(value: 'blocked' | 'allowed') => setNewDomainType(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blocked">Bloquear</SelectItem>
                    <SelectItem value="allowed">Permitir</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Motivo"
                  value={newDomainReason}
                  onChange={(e) => setNewDomainReason(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addDomainFilter}>Adicionar</Button>
              </div>

              <div className="space-y-2">
                {domainFilters.map((filter) => (
                  <div key={filter.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {filter.type === 'blocked' ? (
                        <ShieldX className="h-4 w-4 text-destructive" />
                      ) : (
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                      )}
                      <div>
                        <p className="font-medium">{filter.domain}</p>
                        <p className="text-sm text-muted-foreground">{filter.reason}</p>
                      </div>
                    </div>
                    <Badge variant={filter.type === 'blocked' ? 'destructive' : 'default'}>
                      {filter.type === 'blocked' ? 'Bloqueado' : 'Permitido'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Reportes de Usuários
              </CardTitle>
              <CardDescription>
                Gerencie reportes de links suspeitos ou inadequados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{report.reason}</p>
                        <p className="text-sm text-muted-foreground">
                          {report.links?.title || 'Link removido'} - {report.links?.original_url}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    
                    {report.description && (
                      <p className="text-sm">{report.description}</p>
                    )}
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateReportStatus(report.id, 'reviewed')}
                      >
                        Revisar
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => updateReportStatus(report.id, 'resolved')}
                      >
                        Resolver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateReportStatus(report.id, 'dismissed')}
                      >
                        Descartar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eventos de Segurança</CardTitle>
              <CardDescription>
                Monitore tentativas de acesso suspeitas e atividades maliciosas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {securityEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{event.event_type}</p>
                      <p className="text-sm text-muted-foreground">
                        IP: {event.ip_address} • {new Date(event.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Backup e Recuperação
              </CardTitle>
              <CardDescription>
                Gerencie backups dos dados do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={createBackup} className="gap-2">
                  <Download className="h-4 w-4" />
                  Criar Backup Manual
                </Button>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Restaurar Backup
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>• Backups automáticos são criados diariamente</p>
                <p>• Os backups incluem todos os dados de usuários, links e configurações</p>
                <p>• Dados de backup são mantidos por 30 dias</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}