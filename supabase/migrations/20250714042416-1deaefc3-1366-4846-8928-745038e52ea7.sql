-- Create billing/financial tables
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BRL',
  status TEXT NOT NULL DEFAULT 'pending',
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE NULL,
  payment_method TEXT NULL,
  payment_provider TEXT NULL,
  payment_provider_id TEXT NULL,
  metadata JSONB NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.plan_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_type TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  feature_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(plan_type, feature_name)
);

CREATE TABLE public.financial_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_date DATE NOT NULL,
  mrr DECIMAL(12,2) NOT NULL DEFAULT 0,
  arr DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_users INTEGER NOT NULL DEFAULT 0,
  paid_users INTEGER NOT NULL DEFAULT 0,
  conversion_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  churn_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(metric_date)
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invoices
CREATE POLICY "Users can view their own invoices" 
ON public.invoices 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can manage invoices" 
ON public.invoices 
FOR ALL 
USING (true);

-- RLS Policies for plan_features (public read)
CREATE POLICY "Plan features are public" 
ON public.plan_features 
FOR SELECT 
USING (true);

CREATE POLICY "Only system can manage plan features" 
ON public.plan_features 
FOR ALL 
USING (false);

-- RLS Policies for financial_metrics (admin only)
CREATE POLICY "Only system can manage financial metrics" 
ON public.financial_metrics 
FOR ALL 
USING (false);

-- Insert default plan features
INSERT INTO public.plan_features (plan_type, feature_name, feature_value) VALUES
('free', 'max_links', '3'),
('free', 'max_clicks_per_month', '100'),
('free', 'analytics_enabled', 'false'),
('free', 'bio_pages_enabled', 'false'),
('free', 'qr_codes_enabled', 'false'),
('free', 'custom_domain', 'false'),
('free', 'priority_support', 'false'),
('free', 'price_monthly', '0'),
('free', 'price_yearly', '0'),

('pro', 'max_links', '50'),
('pro', 'max_clicks_per_month', '10000'),
('pro', 'analytics_enabled', 'true'),
('pro', 'bio_pages_enabled', 'true'),
('pro', 'qr_codes_enabled', 'true'),
('pro', 'custom_domain', 'false'),
('pro', 'priority_support', 'false'),
('pro', 'price_monthly', '29.90'),
('pro', 'price_yearly', '299.00'),

('enterprise', 'max_links', 'unlimited'),
('enterprise', 'max_clicks_per_month', 'unlimited'),
('enterprise', 'analytics_enabled', 'true'),
('enterprise', 'bio_pages_enabled', 'true'),
('enterprise', 'qr_codes_enabled', 'true'),
('enterprise', 'custom_domain', 'true'),
('enterprise', 'priority_support', 'true'),
('enterprise', 'price_monthly', '99.90'),
('enterprise', 'price_yearly', '999.00');

-- Create triggers for timestamps
CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate financial metrics
CREATE OR REPLACE FUNCTION public.calculate_daily_financial_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  today_date DATE := CURRENT_DATE;
  monthly_revenue DECIMAL(12,2);
  total_user_count INTEGER;
  paid_user_count INTEGER;
  conversion DECIMAL(5,2);
BEGIN
  -- Calculate MRR (Monthly Recurring Revenue)
  SELECT COALESCE(SUM(
    CASE 
      WHEN pf.feature_value ~ '^[0-9]+\.?[0-9]*$' THEN pf.feature_value::DECIMAL
      ELSE 0 
    END
  ), 0) INTO monthly_revenue
  FROM profiles p
  JOIN plan_features pf ON pf.plan_type = p.plan AND pf.feature_name = 'price_monthly'
  WHERE p.plan != 'free';

  -- Count users
  SELECT COUNT(*) INTO total_user_count FROM profiles;
  SELECT COUNT(*) INTO paid_user_count FROM profiles WHERE plan != 'free';
  
  -- Calculate conversion rate
  IF total_user_count > 0 THEN
    conversion := (paid_user_count::DECIMAL / total_user_count::DECIMAL) * 100;
  ELSE
    conversion := 0;
  END IF;

  -- Insert or update metrics
  INSERT INTO public.financial_metrics (
    metric_date, 
    mrr, 
    arr, 
    total_users, 
    paid_users, 
    conversion_rate,
    churn_rate
  )
  VALUES (
    today_date,
    monthly_revenue,
    monthly_revenue * 12,
    total_user_count,
    paid_user_count,
    conversion,
    0 -- Placeholder for churn rate
  )
  ON CONFLICT (metric_date) 
  DO UPDATE SET
    mrr = EXCLUDED.mrr,
    arr = EXCLUDED.arr,
    total_users = EXCLUDED.total_users,
    paid_users = EXCLUDED.paid_users,
    conversion_rate = EXCLUDED.conversion_rate;
END;
$$;