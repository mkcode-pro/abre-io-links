-- Criar tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  bio TEXT,
  website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de links encurtados
CREATE TABLE public.links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  short_code TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  clicks INTEGER DEFAULT 0,
  password TEXT,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de analytics de cliques
CREATE TABLE public.clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE,
  ip_address INET,
  country TEXT,
  city TEXT,
  device TEXT,
  browser TEXT,
  os TEXT,
  referrer TEXT,
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de bio pages
CREATE TABLE public.bio_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  theme TEXT DEFAULT 'default',
  avatar_url TEXT,
  background_url TEXT,
  social_links JSONB DEFAULT '{}',
  custom_links JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Criar tabela de QR codes
CREATE TABLE public.qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID REFERENCES public.links(id) ON DELETE CASCADE,
  style JSONB DEFAULT '{}',
  logo_url TEXT,
  size INTEGER DEFAULT 200,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bio_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Usuários podem ver seus próprios perfis" ON public.profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Usuários podem atualizar seus próprios perfis" ON public.profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Usuários podem inserir seus próprios perfis" ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Políticas RLS para links
CREATE POLICY "Usuários podem ver seus próprios links" ON public.links
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Usuários podem criar links" ON public.links
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Usuários podem atualizar seus próprios links" ON public.links
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Usuários podem deletar seus próprios links" ON public.links
  FOR DELETE USING (user_id = auth.uid());

-- Políticas RLS para clicks
CREATE POLICY "Usuários podem ver clicks de seus links" ON public.clicks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.links 
      WHERE links.id = clicks.link_id 
      AND links.user_id = auth.uid()
    )
  );

CREATE POLICY "Permitir inserção de clicks" ON public.clicks
  FOR INSERT WITH CHECK (true);

-- Políticas RLS para bio_pages
CREATE POLICY "Bio pages são públicas para leitura" ON public.bio_pages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Usuários podem gerenciar suas bio pages" ON public.bio_pages
  FOR ALL USING (user_id = auth.uid());

-- Políticas RLS para qr_codes
CREATE POLICY "Usuários podem ver QR codes de seus links" ON public.qr_codes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.links 
      WHERE links.id = qr_codes.link_id 
      AND links.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuários podem criar QR codes para seus links" ON public.qr_codes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.links 
      WHERE links.id = qr_codes.link_id 
      AND links.user_id = auth.uid()
    )
  );

-- Função para gerar código curto único
CREATE OR REPLACE FUNCTION generate_short_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  
  -- Verificar se já existe
  WHILE EXISTS(SELECT 1 FROM public.links WHERE short_code = result) LOOP
    result := '';
    FOR i IN 1..6 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
  END LOOP;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_links_updated_at
  BEFORE UPDATE ON public.links
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bio_pages_updated_at
  BEFORE UPDATE ON public.bio_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();