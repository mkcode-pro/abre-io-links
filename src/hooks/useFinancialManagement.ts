import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Invoice {
  id: string;
  user_id: string;
  plan_type: string;
  amount: number;
  currency: string;
  status: string;
  due_date: string;
  paid_at?: string | null;
  payment_method?: string | null;
  payment_provider?: string | null;
  payment_provider_id?: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface PlanFeature {
  id: string;
  plan_type: string;
  feature_name: string;
  feature_value: string;
  created_at: string;
}

export interface FinancialMetrics {
  id: string;
  metric_date: string;
  mrr: number;
  arr: number;
  total_users: number;
  paid_users: number;
  conversion_rate: number;
  churn_rate: number;
  created_at: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingInvoices: number;
  paidInvoices: number;
  totalInvoices: number;
  averageRevenuePerUser: number;
  conversionRate: number;
  churnRate: number;
}

export const useFinancialManagement = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [planFeatures, setPlanFeatures] = useState<PlanFeature[]>([]);
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all financial data
  const fetchFinancialData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (invoicesError) throw invoicesError;

      // Fetch plan features
      const { data: featuresData, error: featuresError } = await supabase
        .from('plan_features')
        .select('*')
        .order('plan_type', { ascending: true });

      if (featuresError) throw featuresError;

      // Fetch financial metrics (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: metricsData, error: metricsError } = await supabase
        .from('financial_metrics')
        .select('*')
        .gte('metric_date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('metric_date', { ascending: false });

      if (metricsError) throw metricsError;

      setInvoices(invoicesData || []);
      setPlanFeatures(featuresData || []);
      setFinancialMetrics(metricsData || []);

      // Calculate summary
      const totalRevenue = (invoicesData || [])
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0);

      const thisMonth = new Date();
      thisMonth.setDate(1);
      const monthlyRevenue = (invoicesData || [])
        .filter(inv => inv.status === 'paid' && new Date(inv.paid_at!) >= thisMonth)
        .reduce((sum, inv) => sum + inv.amount, 0);

      const pendingInvoices = (invoicesData || []).filter(inv => inv.status === 'pending').length;
      const paidInvoices = (invoicesData || []).filter(inv => inv.status === 'paid').length;
      const totalInvoices = invoicesData?.length || 0;

      const latestMetrics = metricsData?.[0];
      const averageRevenuePerUser = latestMetrics?.paid_users > 0 
        ? latestMetrics.mrr / latestMetrics.paid_users 
        : 0;

      setSummary({
        totalRevenue,
        monthlyRevenue,
        pendingInvoices,
        paidInvoices,
        totalInvoices,
        averageRevenuePerUser,
        conversionRate: latestMetrics?.conversion_rate || 0,
        churnRate: latestMetrics?.churn_rate || 0
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create invoice
  const createInvoice = async (invoiceData: any) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select()
        .single();

      if (error) throw error;

      await fetchFinancialData();
      return { success: true, data };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Update invoice status
  const updateInvoiceStatus = async (invoiceId: string, status: string, metadata?: any) => {
    try {
      const updateData: any = { 
        status, 
        updated_at: new Date().toISOString()
      };

      if (status === 'paid') {
        updateData.paid_at = new Date().toISOString();
      }

      if (metadata) {
        updateData.metadata = metadata;
      }

      const { error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', invoiceId);

      if (error) throw error;

      await fetchFinancialData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Update plan features
  const updatePlanFeature = async (planType: string, featureName: string, featureValue: string) => {
    try {
      const { error } = await supabase
        .from('plan_features')
        .upsert([{
          plan_type: planType,
          feature_name: featureName,
          feature_value: featureValue
        }], {
          onConflict: 'plan_type,feature_name'
        });

      if (error) throw error;

      await fetchFinancialData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Calculate metrics manually
  const recalculateMetrics = async () => {
    try {
      const { error } = await supabase.rpc('calculate_daily_financial_metrics');
      
      if (error) throw error;

      await fetchFinancialData();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Generate invoice for user plan upgrade
  const generateInvoiceForUpgrade = async (userId: string, newPlan: string) => {
    try {
      // Get plan price
      const { data: priceFeature } = await supabase
        .from('plan_features')
        .select('feature_value')
        .eq('plan_type', newPlan)
        .eq('feature_name', 'price_monthly')
        .single();

      if (!priceFeature) {
        throw new Error('Plan price not found');
      }

      const amount = parseFloat(priceFeature.feature_value);
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7); // 7 days to pay

      return await createInvoice({
        user_id: userId,
        plan_type: newPlan,
        amount,
        currency: 'BRL',
        status: 'pending',
        due_date: dueDate.toISOString(),
        metadata: {
          type: 'plan_upgrade',
          generated_at: new Date().toISOString()
        }
      });
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Export financial data
  const exportFinancialData = async (startDate: string, endDate: string) => {
    try {
      const { data: exportData, error } = await supabase
        .from('invoices')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Generate CSV
      const headers = [
        'ID', 'Email', 'Nome', 'Plano', 'Valor', 'Moeda', 'Status', 
        'Data Vencimento', 'Data Pagamento', 'Método Pagamento', 'Data Criação'
      ];

      const csvContent = [
        headers.join(','),
        ...(exportData || []).map(invoice => [
          invoice.id,
          invoice.user_id,
          'N/A',
          invoice.plan_type,
          invoice.amount.toFixed(2),
          invoice.currency,
          invoice.status,
          new Date(invoice.due_date).toLocaleDateString('pt-BR'),
          invoice.paid_at ? new Date(invoice.paid_at).toLocaleDateString('pt-BR') : '',
          invoice.payment_method || '',
          new Date(invoice.created_at).toLocaleDateString('pt-BR')
        ].join(','))
      ].join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `financial_data_${startDate}_${endDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  return {
    invoices,
    planFeatures,
    financialMetrics,
    summary,
    loading,
    error,
    fetchFinancialData,
    createInvoice,
    updateInvoiceStatus,
    updatePlanFeature,
    recalculateMetrics,
    generateInvoiceForUpgrade,
    exportFinancialData
  };
};