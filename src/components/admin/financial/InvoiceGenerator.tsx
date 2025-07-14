import { useState } from "react";
import { useFinancialManagement } from "@/hooks/useFinancialManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Send, Calculator, Clock } from "lucide-react";

export const InvoiceGenerator = () => {
  const { planFeatures, generateInvoiceForUpgrade, createInvoice } = useFinancialManagement();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    user_id: "",
    plan_type: "",
    amount: 0,
    currency: "BRL",
    due_date: "",
    payment_method: ""
  });

  const plans = ['free', 'pro', 'enterprise'];

  const handlePlanChange = (planType: string) => {
    const priceFeature = planFeatures.find(
      f => f.plan_type === planType && f.feature_name === 'price_monthly'
    );
    
    setInvoiceData(prev => ({
      ...prev,
      plan_type: planType,
      amount: priceFeature ? parseFloat(priceFeature.feature_value) : 0
    }));
  };

  const handleGenerateInvoice = async () => {
    if (!invoiceData.user_id || !invoiceData.plan_type || !invoiceData.due_date) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const result = await createInvoice({
        ...invoiceData,
        metadata: {
          type: 'manual_generation',
          generated_at: new Date().toISOString(),
          generated_by: 'admin'
        }
      });

      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Fatura gerada com sucesso!"
        });
        // Reset form
        setInvoiceData({
          user_id: "",
          plan_type: "",
          amount: 0,
          currency: "BRL",
          due_date: "",
          payment_method: ""
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao gerar fatura",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickUpgrade = async () => {
    if (!invoiceData.user_id || !invoiceData.plan_type) {
      toast({
        title: "Erro",
        description: "Selecione um usuário e plano",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const result = await generateInvoiceForUpgrade(invoiceData.user_id, invoiceData.plan_type);
      
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Fatura de upgrade gerada automaticamente!"
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao gerar fatura de upgrade",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTodayPlusDays = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gerador de Faturas</h2>
        <p className="text-muted-foreground">Crie faturas manualmente ou para upgrades de plano</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Manual Invoice Generation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Fatura Manual
            </CardTitle>
            <CardDescription>
              Gere faturas personalizadas manualmente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="user-id">ID do Usuário *</Label>
              <Input
                id="user-id"
                placeholder="UUID do usuário"
                value={invoiceData.user_id}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, user_id: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="plan-select">Plano *</Label>
              <Select onValueChange={handlePlanChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map(plan => {
                    const priceFeature = planFeatures.find(
                      f => f.plan_type === plan && f.feature_name === 'price_monthly'
                    );
                    const price = priceFeature ? parseFloat(priceFeature.feature_value) : 0;
                    
                    return (
                      <SelectItem key={plan} value={plan} className="capitalize">
                        {plan} - {formatCurrency(price)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={invoiceData.amount}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
              />
            </div>

            <div>
              <Label htmlFor="due-date">Data de Vencimento *</Label>
              <Input
                id="due-date"
                type="date"
                value={invoiceData.due_date}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, due_date: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="payment-method">Método de Pagamento</Label>
              <Select onValueChange={(value) => setInvoiceData(prev => ({ ...prev, payment_method: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Método de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                  <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerateInvoice} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Gerando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Gerar Fatura
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Upgrade */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Upgrade Rápido
            </CardTitle>
            <CardDescription>
              Gere fatura automatica para upgrade de plano
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="quick-user-id">ID do Usuário</Label>
              <Input
                id="quick-user-id"
                placeholder="UUID do usuário"
                value={invoiceData.user_id}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, user_id: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="quick-plan">Novo Plano</Label>
              <Select onValueChange={handlePlanChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o novo plano" />
                </SelectTrigger>
                <SelectContent>
                  {plans.filter(p => p !== 'free').map(plan => {
                    const priceFeature = planFeatures.find(
                      f => f.plan_type === plan && f.feature_name === 'price_monthly'
                    );
                    const price = priceFeature ? parseFloat(priceFeature.feature_value) : 0;
                    
                    return (
                      <SelectItem key={plan} value={plan} className="capitalize">
                        {plan} - {formatCurrency(price)}/mês
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {invoiceData.plan_type && (
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Resumo do Upgrade:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Plano:</span>
                    <span className="capitalize font-medium">{invoiceData.plan_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor Mensal:</span>
                    <span className="font-medium">{formatCurrency(invoiceData.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vencimento:</span>
                    <span className="font-medium">7 dias</span>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={handleQuickUpgrade} 
              disabled={isGenerating || !invoiceData.user_id || !invoiceData.plan_type}
              className="w-full"
              variant="secondary"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Processando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Gerar Upgrade Automático
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Configure rapidamente datas de vencimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-4">
            <Button
              variant="outline"
              onClick={() => setInvoiceData(prev => ({ ...prev, due_date: getTodayPlusDays(7) }))}
            >
              +7 dias
            </Button>
            <Button
              variant="outline"
              onClick={() => setInvoiceData(prev => ({ ...prev, due_date: getTodayPlusDays(15) }))}
            >
              +15 dias
            </Button>
            <Button
              variant="outline"
              onClick={() => setInvoiceData(prev => ({ ...prev, due_date: getTodayPlusDays(30) }))}
            >
              +30 dias
            </Button>
            <Button
              variant="outline"
              onClick={() => setInvoiceData(prev => ({ ...prev, due_date: getTodayPlusDays(60) }))}
            >
              +60 dias
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};