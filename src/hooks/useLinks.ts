import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Link {
  id: string;
  short_code: string;
  original_url: string;
  title: string | null;
  description: string | null;
  clicks: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  password: string | null;
}

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedLinks, setSelectedLinks] = useState<Set<string>>(new Set());
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 10;

  const fetchLinks = async (pageNum = 0, reset = false) => {
    if (!user || (!reset && !hasMore)) return;

    try {
      setLoading(true);
      
      let query = supabase
        .from('links')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(pageNum * ITEMS_PER_PAGE, (pageNum + 1) * ITEMS_PER_PAGE - 1);

      // Apply filters
      if (statusFilter !== 'all') {
        query = query.eq('is_active', statusFilter === 'active');
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,original_url.ilike.%${searchTerm}%,short_code.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (reset) {
        setLinks(data || []);
      } else {
        setLinks(prev => [...prev, ...(data || [])]);
      }

      setHasMore((data || []).length === ITEMS_PER_PAGE);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching links:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar links",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLink = async (id: string, updates: Partial<Link>) => {
    try {
      const { error } = await supabase
        .from('links')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setLinks(prev => prev.map(link => 
        link.id === id ? { ...link, ...updates } : link
      ));

      toast({
        title: "Sucesso",
        description: "Link atualizado com sucesso",
      });
    } catch (error) {
      console.error('Error updating link:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar link",
        variant: "destructive",
      });
    }
  };

  const deleteLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLinks(prev => prev.filter(link => link.id !== id));
      setSelectedLinks(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });

      toast({
        title: "Sucesso",
        description: "Link excluído com sucesso",
      });
    } catch (error) {
      console.error('Error deleting link:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir link",
        variant: "destructive",
      });
    }
  };

  const deleteSelectedLinks = async () => {
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .in('id', Array.from(selectedLinks));

      if (error) throw error;

      setLinks(prev => prev.filter(link => !selectedLinks.has(link.id)));
      setSelectedLinks(new Set());

      toast({
        title: "Sucesso",
        description: `${selectedLinks.size} links excluídos com sucesso`,
      });
    } catch (error) {
      console.error('Error deleting links:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir links",
        variant: "destructive",
      });
    }
  };

  const toggleSelectedLinks = async (active: boolean) => {
    try {
      const { error } = await supabase
        .from('links')
        .update({ is_active: active })
        .in('id', Array.from(selectedLinks));

      if (error) throw error;

      setLinks(prev => prev.map(link => 
        selectedLinks.has(link.id) ? { ...link, is_active: active } : link
      ));

      toast({
        title: "Sucesso",
        description: `${selectedLinks.size} links ${active ? 'ativados' : 'desativados'}`,
      });
    } catch (error) {
      console.error('Error updating links:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar links",
        variant: "destructive",
      });
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchLinks(page + 1);
    }
  };

  const refresh = () => {
    setPage(0);
    setHasMore(true);
    fetchLinks(0, true);
  };

  useEffect(() => {
    if (user) {
      refresh();
    }
  }, [user, searchTerm, statusFilter]);

  return {
    links,
    loading,
    hasMore,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedLinks,
    setSelectedLinks,
    updateLink,
    deleteLink,
    deleteSelectedLinks,
    toggleSelectedLinks,
    loadMore,
    refresh,
  };
}