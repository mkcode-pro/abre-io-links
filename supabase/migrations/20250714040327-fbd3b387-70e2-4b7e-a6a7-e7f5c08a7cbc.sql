-- Criar tabela de usuários administrativos
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  permissions JSONB NOT NULL DEFAULT '["read"]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
  two_factor_secret TEXT,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de logs administrativos
CREATE TABLE public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de alertas administrativos
CREATE TABLE public.admin_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'security', 'performance', 'business', 'system'
  severity TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  is_read BOOLEAN NOT NULL DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para todas as tabelas
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_alerts ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para admin_users (apenas admins podem ver)
CREATE POLICY "Apenas admins podem gerenciar admin_users" 
ON public.admin_users 
FOR ALL 
USING (false); -- Será controlado pela aplicação

-- Políticas RLS para admin_logs
CREATE POLICY "Apenas admins podem ver logs" 
ON public.admin_logs 
FOR SELECT 
USING (false); -- Será controlado pela aplicação

CREATE POLICY "Sistema pode inserir logs" 
ON public.admin_logs 
FOR INSERT 
WITH CHECK (true);

-- Políticas RLS para admin_alerts
CREATE POLICY "Apenas admins podem gerenciar alertas" 
ON public.admin_alerts 
FOR ALL 
USING (false); -- Será controlado pela aplicação

-- Índices para performance
CREATE INDEX idx_admin_logs_admin_user_id ON public.admin_logs(admin_user_id);
CREATE INDEX idx_admin_logs_created_at ON public.admin_logs(created_at DESC);
CREATE INDEX idx_admin_logs_action ON public.admin_logs(action);
CREATE INDEX idx_admin_alerts_type_severity ON public.admin_alerts(type, severity);
CREATE INDEX idx_admin_alerts_created_at ON public.admin_alerts(created_at DESC);
CREATE INDEX idx_admin_alerts_is_read ON public.admin_alerts(is_read);

-- Trigger para updated_at nas tabelas admin
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Função para criar log administrativo
CREATE OR REPLACE FUNCTION public.create_admin_log(
  _admin_user_id UUID,
  _action TEXT,
  _resource_type TEXT,
  _resource_id TEXT DEFAULT NULL,
  _details JSONB DEFAULT NULL,
  _ip_address INET DEFAULT NULL,
  _user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.admin_logs (
    admin_user_id, 
    action, 
    resource_type, 
    resource_id, 
    details, 
    ip_address, 
    user_agent
  )
  VALUES (
    _admin_user_id, 
    _action, 
    _resource_type, 
    _resource_id, 
    _details, 
    _ip_address, 
    _user_agent
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Função para criar alerta administrativo
CREATE OR REPLACE FUNCTION public.create_admin_alert(
  _type TEXT,
  _severity TEXT,
  _title TEXT,
  _message TEXT,
  _metadata JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  alert_id UUID;
BEGIN
  INSERT INTO public.admin_alerts (
    type, 
    severity, 
    title, 
    message, 
    metadata
  )
  VALUES (
    _type, 
    _severity, 
    _title, 
    _message, 
    _metadata
  )
  RETURNING id INTO alert_id;
  
  RETURN alert_id;
END;
$$;

-- Inserir usuário admin padrão (senha: admin123 - MUDE IMEDIATAMENTE!)
INSERT INTO public.admin_users (
  email, 
  password_hash, 
  name, 
  role, 
  permissions
) VALUES (
  'admin@abrev.io',
  '$2b$10$rQ8Q8Q8Q8Q8Q8Q8Q8Q8Q8O', -- Hash temporário - será substituído pela aplicação
  'Administrador Principal',
  'super_admin',
  '["read", "write", "delete", "manage_users", "manage_settings", "view_analytics"]'::jsonb
);