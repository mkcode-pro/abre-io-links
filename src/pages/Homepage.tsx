import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Link, 
  BarChart3, 
  Shield, 
  Globe, 
  Smartphone,
  ArrowRight,
  Check,
  Star,
  Users,
  TrendingUp,
  Lock
} from 'lucide-react';
import Navigation from '@/components/ui/navigation';
import GlassButton from '@/components/ui/glass-button';
import StatsCard from '@/components/ui/stats-card';
import { cn } from '@/lib/utils';

const Homepage = () => {
  const features = [
    {
      icon: Link,
      title: "Links Inteligentes",
      description: "Encurte URLs com personalização completa, análise avançada e controle total.",
      gradient: "primary"
    },
    {
      icon: BarChart3,
      title: "Analytics Avançado",
      description: "Métricas detalhadas, mapas de calor, geolocalização e insights em tempo real.",
      gradient: "secondary"
    },
    {
      icon: Globe,
      title: "Bio Pages Premium",
      description: "Crie páginas de bio personalizadas com temas únicos e integração completa.",
      gradient: "accent"
    },
    {
      icon: Shield,
      title: "Segurança Máxima",
      description: "Proteção anti-bot, links com senha, data de expiração e monitoramento 24/7.",
      gradient: "primary"
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Interface responsiva perfeita, PWA otimizada e experiência mobile premium.",
      gradient: "secondary"
    },
    {
      icon: TrendingUp,
      title: "Escalabilidade",
      description: "Infraestrutura robusta para milhões de clicks, API completa e integrações.",
      gradient: "accent"
    }
  ];

  const plans = [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "/mês",
      description: "Perfeito para começar",
      features: [
        "10 links por mês",
        "1.000 cliques",
        "1 bio page",
        "Analytics básico",
        "Suporte por email"
      ],
      popular: false
    },
    {
      name: "Profissional",
      price: "R$ 19,90",
      period: "/mês",
      description: "Para criadores e empresas",
      features: [
        "1.000 links por mês",
        "100.000 cliques",
        "5 bio pages",
        "Analytics avançado",
        "Domínio personalizado",
        "API completa",
        "Suporte prioritário"
      ],
      popular: true
    },
    {
      name: "Business",
      price: "R$ 99,90",
      period: "/mês",
      description: "Para equipes e agências",
      features: [
        "Links ilimitados",
        "Cliques ilimitados",
        "Bio pages ilimitadas",
        "Analytics completo",
        "10 domínios personalizados",
        "Team collaboration",
        "White label",
        "Suporte 24/7"
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Ana Silva",
      role: "Digital Marketer",
      content: "O Abrev.io revolucionou nossa estratégia de links. Analytics incríveis e interface perfeita!",
      rating: 5
    },
    {
      name: "Carlos Mendes",
      role: "Influenciador",
      content: "Bio pages lindas e funcionalidades que outros concorrentes nem sonham em ter.",
      rating: 5
    },
    {
      name: "Marina Costa",
      role: "Empresária",
      content: "ROI incrível! Conseguimos rastrear cada clique e otimizar nossas campanhas.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-poppins font-bold mb-6">
              O futuro dos{' '}
              <span className="gradient-text">links inteligentes</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground-muted mb-8 max-w-3xl mx-auto">
              Crie, gerencie e analise seus links com a plataforma mais avançada do Brasil. 
              Bio pages premium, analytics em tempo real e muito mais.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <GlassButton size="lg" icon={Zap}>
              Começar Grátis
            </GlassButton>
            <GlassButton variant="ghost" size="lg" icon={ArrowRight} iconPosition="right">
              Ver Demo
            </GlassButton>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <StatsCard
              title="Links Criados"
              value="2.4M+"
              icon={Link}
              gradient="primary"
            />
            <StatsCard
              title="Cliques Processados"
              value="150M+"
              icon={BarChart3}
              gradient="secondary"
            />
            <StatsCard
              title="Usuários Ativos"
              value="50K+"
              icon={Users}
              gradient="accent"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-4">
              Recursos <span className="gradient-text">Incríveis</span>
            </h2>
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar seus links como um profissional
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-card p-6 hover-scale group"
                >
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                    feature.gradient === 'primary' && "bg-primary/20 text-primary",
                    feature.gradient === 'secondary' && "bg-secondary/20 text-secondary",
                    feature.gradient === 'accent' && "bg-accent/20 text-accent"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-foreground-muted">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-background-secondary/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-4">
              Planos <span className="gradient-text">Flexíveis</span>
            </h2>
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
              Escolha o plano perfeito para suas necessidades
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={cn(
                  "glass-card p-8 relative hover-scale",
                  plan.popular && "ring-2 ring-primary shadow-glow"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-foreground-muted mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-foreground-muted ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-success mr-3 flex-shrink-0" />
                      <span className="text-foreground-muted">{feature}</span>
                    </li>
                  ))}
                </ul>

                <GlassButton 
                  variant={plan.popular ? "primary" : "outline"}
                  className="w-full"
                >
                  {plan.price === "R$ 0" ? "Começar Grátis" : "Escolher Plano"}
                </GlassButton>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-4">
              Amado por <span className="gradient-text">milhares</span>
            </h2>
            <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
              Veja o que nossos usuários estão dizendo sobre o Abrev.io
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-6 hover-scale"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-foreground-muted mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-foreground-subtle">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/20 to-secondary/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-6">
              Pronto para <span className="gradient-text">começar</span>?
            </h2>
            <p className="text-xl text-foreground-muted mb-8">
              Junte-se a milhares de usuários que já estão usando o Abrev.io para 
              revolucionar seus links
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlassButton size="lg" icon={Zap}>
                Começar Grátis Agora
              </GlassButton>
              <GlassButton variant="ghost" size="lg">
                Falar com Vendas
              </GlassButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background-secondary border-t border-glass-border/30 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-poppins font-bold gradient-text">
                Abrev.io
              </span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-foreground-muted">
              <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
              <a href="#" className="hover:text-foreground transition-colors">Termos</a>
              <a href="#" className="hover:text-foreground transition-colors">Suporte</a>
              <a href="#" className="hover:text-foreground transition-colors">API</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-glass-border/30 text-center text-foreground-subtle">
            <p>&copy; 2024 Abrev.io. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;