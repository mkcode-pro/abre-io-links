import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Copy, 
  ExternalLink, 
  BarChart3,
  Eye,
  EyeOff,
  Calendar,
  Mouse,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Link } from '@/hooks/useLinks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { EditLinkDialog } from './EditLinkDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

interface LinksTableProps {
  links: Link[];
  loading: boolean;
  hasMore: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: 'all' | 'active' | 'inactive';
  setStatusFilter: (filter: 'all' | 'active' | 'inactive') => void;
  selectedLinks: Set<string>;
  setSelectedLinks: (links: Set<string>) => void;
  onUpdateLink: (id: string, updates: Partial<Link>) => void;
  onDeleteLink: (id: string) => void;
  onDeleteSelected: () => void;
  onToggleSelected: (active: boolean) => void;
  onLoadMore: () => void;
}

export function LinksTable({
  links,
  loading,
  hasMore,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  selectedLinks,
  setSelectedLinks,
  onUpdateLink,
  onDeleteLink,
  onDeleteSelected,
  onToggleSelected,
  onLoadMore,
}: LinksTableProps) {
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [deletingLink, setDeletingLink] = useState<Link | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Link copiado para a área de transferência",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatUrl = (url: string, maxLength = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLinks(new Set(links.map(link => link.id)));
    } else {
      setSelectedLinks(new Set());
    }
  };

  const handleSelectLink = (linkId: string, checked: boolean) => {
    const newSelected = new Set(selectedLinks);
    if (checked) {
      newSelected.add(linkId);
    } else {
      newSelected.delete(linkId);
    }
    setSelectedLinks(newSelected);
  };

  const isAllSelected = links.length > 0 && selectedLinks.size === links.length;
  const isIndeterminate = selectedLinks.size > 0 && selectedLinks.size < links.length;

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, URL ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedLinks.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted/50 backdrop-blur-sm rounded-lg p-4 border"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {selectedLinks.size} link(s) selecionado(s)
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onToggleSelected(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ativar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onToggleSelected(false)}
              >
                <EyeOff className="h-4 w-4 mr-2" />
                Desativar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={onDeleteSelected}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Table */}
      <div className="border rounded-lg bg-card/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) {
                      const input = el.querySelector('input');
                      if (input) input.indeterminate = isIndeterminate;
                    }
                  }}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cliques</TableHead>
              <TableHead>Criado</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link, index) => (
              <motion.tr
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group hover:bg-muted/30 transition-colors"
              >
                <TableCell>
                  <Checkbox
                    checked={selectedLinks.has(link.id)}
                    onCheckedChange={(checked) => 
                      handleSelectLink(link.id, checked as boolean)
                    }
                  />
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}/${link.short_code}`)}
                        className="text-primary hover:text-primary/80 font-mono text-sm flex items-center gap-1"
                      >
                        /{link.short_code}
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                    {link.title && (
                      <p className="text-sm text-muted-foreground font-medium">
                        {link.title}
                      </p>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <a
                    href={link.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 max-w-[200px]"
                    title={link.original_url}
                  >
                    {formatUrl(link.original_url)}
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                </TableCell>
                
                <TableCell>
                  <Badge 
                    variant={link.is_active ? "default" : "secondary"}
                    className="flex items-center gap-1 w-fit"
                  >
                    {link.is_active ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {link.is_active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Mouse className="h-3 w-3 text-muted-foreground" />
                    {link.clicks?.toLocaleString() || '0'}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(link.created_at)}
                  </div>
                </TableCell>
                
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setEditingLink(link)}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => copyToClipboard(`${window.location.origin}/${link.short_code}`)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Link
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Analytics
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeletingLink(link)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
        
        {links.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Nenhum link encontrado com os filtros aplicados.'
                : 'Nenhum link criado ainda. Clique em "Criar Link" para começar!'
              }
            </p>
          </div>
        )}
        
        {hasMore && (
          <div className="p-4 text-center border-t">
            <Button
              variant="outline"
              onClick={onLoadMore}
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Carregar Mais'}
            </Button>
          </div>
        )}
      </div>

      {/* Dialogs */}
      {editingLink && (
        <EditLinkDialog
          link={editingLink}
          open={!!editingLink}
          onClose={() => setEditingLink(null)}
          onSave={(updates) => {
            onUpdateLink(editingLink.id, updates);
            setEditingLink(null);
          }}
        />
      )}

      {deletingLink && (
        <DeleteConfirmDialog
          link={deletingLink}
          open={!!deletingLink}
          onClose={() => setDeletingLink(null)}
          onConfirm={() => {
            onDeleteLink(deletingLink.id);
            setDeletingLink(null);
          }}
        />
      )}
    </div>
  );
}