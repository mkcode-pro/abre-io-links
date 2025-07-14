-- SISTEMA DE MODERAÇÃO E SEGURANÇA
-- Tabela de domínios bloqueados/permitidos
CREATE TABLE public.domain_filters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('blocked', 'allowed')),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES admin_users(id)
);

-- Tabela de reportes de usuários
CREATE TABLE public.user_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  reporter_ip INET,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES admin_users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de tentativas de acesso suspeitas
CREATE TABLE public.security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT,
  details JSONB DEFAULT '{}',
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de backups
CREATE TABLE public.data_backups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  backup_type TEXT NOT NULL,
  file_path TEXT,
  size_bytes BIGINT,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- RLS Policies
ALTER TABLE public.domain_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_backups ENABLE ROW LEVEL SECURITY;

-- Políticas para domain_filters
CREATE POLICY "Admins can manage domain filters" ON public.domain_filters
FOR ALL USING (false);

CREATE POLICY "Public can read allowed domains" ON public.domain_filters
FOR SELECT USING (type = 'allowed');

-- Políticas para user_reports
CREATE POLICY "Anyone can create reports" ON public.user_reports
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage reports" ON public.user_reports
FOR ALL USING (false);

-- Políticas para security_events
CREATE POLICY "System can log security events" ON public.security_events
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view security events" ON public.security_events
FOR SELECT USING (false);

-- Políticas para data_backups
CREATE POLICY "Admins can manage backups" ON public.data_backups
FOR ALL USING (false);

-- Função para verificar domínios maliciosos
CREATE OR REPLACE FUNCTION public.check_domain_safety(url TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  domain_name TEXT;
  is_blocked BOOLEAN := false;
BEGIN
  -- Extrair domínio da URL
  domain_name := regexp_replace(url, '^https?://([^/]+).*$', '\1');
  
  -- Verificar se o domínio está na blacklist
  SELECT EXISTS(
    SELECT 1 FROM public.domain_filters 
    WHERE domain = domain_name AND type = 'blocked'
  ) INTO is_blocked;
  
  -- Se está bloqueado, retorna false (não é seguro)
  IF is_blocked THEN
    RETURN false;
  END IF;
  
  -- Verificar padrões suspeitos simples
  IF domain_name ~* '(malware|phishing|spam|virus|hack)' THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$;

-- Função para log de eventos de segurança
CREATE OR REPLACE FUNCTION public.log_security_event(
  _event_type TEXT,
  _ip_address INET,
  _user_agent TEXT DEFAULT NULL,
  _details JSONB DEFAULT '{}'::jsonb,
  _severity TEXT DEFAULT 'medium'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.security_events (
    event_type, ip_address, user_agent, details, severity
  ) VALUES (
    _event_type, _ip_address, _user_agent, _details, _severity
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Função para criar backup
CREATE OR REPLACE FUNCTION public.create_data_backup(
  _backup_type TEXT,
  _admin_user_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  backup_id UUID;
BEGIN
  INSERT INTO public.data_backups (backup_type, created_by)
  VALUES (_backup_type, _admin_user_id)
  RETURNING id INTO backup_id;
  
  RETURN backup_id;
END;
$$;