-- Criar tabela de planos para controlar limitações dos usuários
CREATE TABLE public.user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT NOT NULL DEFAULT 'free',
  max_links INTEGER NOT NULL DEFAULT 3,
  max_clicks_per_month INTEGER NOT NULL DEFAULT 100,
  analytics_enabled BOOLEAN NOT NULL DEFAULT false,
  bio_pages_enabled BOOLEAN NOT NULL DEFAULT false,
  qr_codes_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Habilitar RLS
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem ver seus próprios planos" 
ON public.user_plans 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Usuários podem atualizar seus próprios planos" 
ON public.user_plans 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Usuários podem inserir seus próprios planos" 
ON public.user_plans 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Função para criar plano gratuito automaticamente
CREATE OR REPLACE FUNCTION public.create_user_plan()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_plans (user_id, plan_type)
  VALUES (NEW.id, 'free');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar plano automaticamente ao registrar usuário
CREATE TRIGGER on_auth_user_plan_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user_plan();