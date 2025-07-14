import { useState } from "react";
import { useFinancialManagement } from "@/hooks/useFinancialManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save, X, Plus } from "lucide-react";

export const PlanManagement = () => {
  const { planFeatures, updatePlanFeature, loading } = useFinancialManagement();
  const { toast } = useToast();
  const [editingFeature, setEditingFeature] = useState<string | null>(null);
  const [newFeatureValue, setNewFeatureValue] = useState("");
  const [isAddingFeature, setIsAddingFeature] = useState(false);
  const [newFeatureName, setNewFeatureName] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  const plans = ['free', 'pro', 'enterprise'];

  const handleUpdateFeature = async (planType: string, featureName: string, value: string) => {
    const result = await updatePlanFeature(planType, featureName, value);
    
    if (result.success) {
      toast({
        title: "Sucesso",
        description: "Recurso do plano atualizado com sucesso!"
      });
      setEditingFeature(null);
      setNewFeatureValue("");
    } else {
      toast({
        title: "Erro",
        description: result.error || "Erro ao atualizar recurso",
        variant: "destructive"
      });
    }
  };

  const handleAddFeature = async () => {
    if (!newFeatureName || !selectedPlan || !newFeatureValue) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    const result = await updatePlanFeature(selectedPlan, newFeatureName, newFeatureValue);
    
    if (result.success) {
      toast({
        title: "Sucesso",
        description: "Novo recurso adicionado com sucesso!"
      });
      setIsAddingFeature(false);
      setNewFeatureName("");
      setNewFeatureValue("");
      setSelectedPlan("");
    } else {
      toast({
        title: "Erro",
        description: result.error || "Erro ao adicionar recurso",
        variant: "destructive"
      });
    }
  };

  const getFeaturesByPlan = (planType: string) => {
    return planFeatures.filter(f => f.plan_type === planType);
  };

  const formatFeatureName = (name: string) => {
    return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatFeatureValue = (feature: any) => {
    if (feature.feature_name.includes('price')) {
      return `R$ ${parseFloat(feature.feature_value).toFixed(2)}`;
    }
    if (feature.feature_value === 'true') return '✓ Habilitado';
    if (feature.feature_value === 'false') return '✗ Desabilitado';
    if (feature.feature_value === 'unlimited') return '∞ Ilimitado';
    return feature.feature_value;
  };

  const getInputType = (featureName: string) => {
    if (featureName.includes('price') || featureName.includes('max_')) return 'number';
    if (featureName.includes('enabled')) return 'checkbox';
    return 'text';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciamento de Planos</h2>
          <p className="text-muted-foreground">Configure recursos e preços dos planos</p>
        </div>
        <Dialog open={isAddingFeature} onOpenChange={setIsAddingFeature}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Recurso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Recurso</DialogTitle>
              <DialogDescription>
                Adicione um novo recurso aos planos disponíveis
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="plan-select">Plano</Label>
                <select
                  id="plan-select"
                  className="w-full mt-1 p-2 border rounded-md"
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                >
                  <option value="">Selecione um plano</option>
                  {plans.map(plan => (
                    <option key={plan} value={plan} className="capitalize">
                      {plan}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="feature-name">Nome do Recurso</Label>
                <Input
                  id="feature-name"
                  placeholder="ex: custom_feature"
                  value={newFeatureName}
                  onChange={(e) => setNewFeatureName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="feature-value">Valor</Label>
                <Input
                  id="feature-value"
                  placeholder="ex: true, 100, unlimited"
                  value={newFeatureValue}
                  onChange={(e) => setNewFeatureValue(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddFeature} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" onClick={() => setIsAddingFeature(false)} className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((planType) => {
          const features = getFeaturesByPlan(planType);
          const priceFeature = features.find(f => f.feature_name === 'price_monthly');
          
          return (
            <Card key={planType}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="capitalize flex items-center gap-2">
                    {planType}
                    <Badge variant={planType === 'free' ? 'secondary' : planType === 'pro' ? 'default' : 'destructive'}>
                      {planType === 'free' ? 'Gratuito' : planType === 'pro' ? 'Popular' : 'Premium'}
                    </Badge>
                  </CardTitle>
                </div>
                <CardDescription>
                  {priceFeature && formatFeatureValue(priceFeature)}/mês
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {features.map((feature) => {
                    const isEditing = editingFeature === `${feature.plan_type}-${feature.feature_name}`;
                    const inputType = getInputType(feature.feature_name);
                    
                    return (
                      <div key={feature.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {formatFeatureName(feature.feature_name)}
                          </div>
                          {!isEditing ? (
                            <div className="text-sm text-muted-foreground">
                              {formatFeatureValue(feature)}
                            </div>
                          ) : (
                            <div className="mt-1">
                              {inputType === 'checkbox' ? (
                                <Switch
                                  checked={newFeatureValue === 'true'}
                                  onCheckedChange={(checked) => setNewFeatureValue(checked ? 'true' : 'false')}
                                />
                              ) : (
                                <Input
                                  type={inputType}
                                  value={newFeatureValue}
                                  onChange={(e) => setNewFeatureValue(e.target.value)}
                                  className="h-8"
                                  step={inputType === 'number' ? '0.01' : undefined}
                                />
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {!isEditing ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingFeature(`${feature.plan_type}-${feature.feature_name}`);
                                setNewFeatureValue(feature.feature_value);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleUpdateFeature(feature.plan_type, feature.feature_name, newFeatureValue)}
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingFeature(null);
                                  setNewFeatureValue("");
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Integration Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Integração de Pagamento - Documentação</CardTitle>
          <CardDescription>
            Sistema preparado para integração com gateways de pagamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">🔧 Estrutura Preparada:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Tabela de faturas (invoices) com campos para provedores de pagamento</li>
                <li>Sistema de planos flexível com recursos configuráveis</li>
                <li>Métricas financeiras (MRR, ARR, conversão, churn)</li>
                <li>Interface administrativa completa</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">💳 Gateways Recomendados:</h4>
              <div className="grid gap-2 md:grid-cols-2">
                <Badge variant="outline">Stripe (Internacional)</Badge>
                <Badge variant="outline">Mercado Pago (Brasil)</Badge>
                <Badge variant="outline">PagSeguro (Brasil)</Badge>
                <Badge variant="outline">Asaas (Brasil)</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">🚀 Próximos Passos:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Escolher gateway de pagamento</li>
                <li>Configurar webhooks para status de pagamento</li>
                <li>Implementar componente de checkout</li>
                <li>Configurar renovação automática</li>
                <li>Implementar sistema de dunning (cobrança)</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};