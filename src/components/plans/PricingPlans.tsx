import { Check, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePlan } from '@/hooks/usePlan';

const plans = [
  {
    name: 'Gratuito',
    price: 'R$ 0',
    period: '/mês',
    description: 'Perfeito para começar',
    features: [
      '3 links encurtados',
      '100 cliques por mês',
      'Estatísticas básicas',
      'Suporte por email'
    ],
    disabled: [
      'Analytics avançado',
      'Bio pages',
      'QR codes',
      'Links ilimitados'
    ],
    planType: 'free',
    popular: false,
  },
  {
    name: 'Pro',
    price: 'R$ 29',
    period: '/mês',
    description: 'Para profissionais e pequenas empresas',
    features: [
      '50 links encurtados',
      '5.000 cliques por mês',
      'Analytics completo',
      'Bio pages personalizadas',
      'QR codes ilimitados',
      'Suporte prioritário'
    ],
    disabled: [],
    planType: 'pro',
    popular: true,
  },
  {
    name: 'Business',
    price: 'R$ 99',
    period: '/mês',
    description: 'Para equipes e empresas',
    features: [
      'Links ilimitados',
      'Cliques ilimitados',
      'Analytics avançado + exportação',
      'Bio pages premium',
      'QR codes personalizados',
      'API acesso',
      'Suporte dedicado'
    ],
    disabled: [],
    planType: 'business',
    popular: false,
  },
];

export function PricingPlans() {
  const { plan, isPremium } = usePlan();

  const handleUpgrade = (planType: string) => {
    if (planType === 'free') return;
    
    // Aqui você implementaria a integração com Stripe
    alert(`Upgrade para ${planType} será implementado em breve!`);
  };

  const currentPlanType = plan?.plan_type || 'free';

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Escolha seu plano</h2>
        <p className="text-muted-foreground text-lg">
          Comece gratuitamente e faça upgrade quando precisar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((planItem) => (
          <Card 
            key={planItem.planType} 
            className={`relative ${
              planItem.popular 
                ? 'border-primary shadow-lg scale-105' 
                : ''
            } ${
              currentPlanType === planItem.planType
                ? 'ring-2 ring-primary'
                : ''
            }`}
          >
            {planItem.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Crown className="h-3 w-3 mr-1" />
                Mais Popular
              </Badge>
            )}
            
            {currentPlanType === planItem.planType && (
              <Badge 
                variant="secondary" 
                className="absolute -top-3 right-4"
              >
                Plano Atual
              </Badge>
            )}

            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{planItem.name}</CardTitle>
              <CardDescription>{planItem.description}</CardDescription>
              <div className="flex items-baseline justify-center mt-4">
                <span className="text-4xl font-bold">{planItem.price}</span>
                <span className="text-muted-foreground">{planItem.period}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                {planItem.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
                
                {planItem.disabled.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 opacity-50">
                    <div className="h-4 w-4 rounded-full border border-muted flex-shrink-0" />
                    <span className="text-sm line-through">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full mt-6"
                variant={currentPlanType === planItem.planType ? "secondary" : "default"}
                disabled={currentPlanType === planItem.planType}
                onClick={() => handleUpgrade(planItem.planType)}
              >
                {currentPlanType === planItem.planType ? (
                  'Plano Atual'
                ) : planItem.planType === 'free' ? (
                  'Começar Grátis'
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Fazer Upgrade
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}