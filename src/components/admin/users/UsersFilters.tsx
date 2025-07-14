import React from 'react';
import { UserFilters } from '@/hooks/useUserManagement';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  Download,
  UserPlus
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UsersFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  totalUsers: number;
  selectedCount: number;
  onExport: () => void;
  onBulkAction: (action: string) => void;
}

export function UsersFilters({ 
  filters, 
  onFiltersChange, 
  totalUsers, 
  selectedCount,
  onExport,
  onBulkAction
}: UsersFiltersProps) {
  const hasActiveFilters = 
    filters.search || 
    filters.plan !== 'all' || 
    filters.status !== 'all' ||
    filters.dateRange.from || 
    filters.dateRange.to;

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      plan: 'all',
      status: 'all',
      dateRange: {}
    });
  };

  const updateFilter = (key: keyof UserFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="space-y-4">
      {/* Header com estatísticas */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestão de Usuários</h2>
          <p className="text-muted-foreground">
            {totalUsers.toLocaleString()} usuários cadastrados
            {selectedCount > 0 && ` • ${selectedCount} selecionados`}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Ações em massa */}
      {selectedCount > 0 && (
        <div className="flex items-center space-x-2 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <Badge variant="secondary">{selectedCount} selecionados</Badge>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onBulkAction('upgrade-premium')}
            >
              Upgrade para Premium
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onBulkAction('downgrade-free')}
            >
              Downgrade para Gratuito
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => onBulkAction('delete')}
            >
              Deletar Selecionados
            </Button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
        {/* Busca */}
        <div className="flex-1 min-w-64">
          <Label htmlFor="search" className="text-sm font-medium">
            Buscar usuários
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="search"
              placeholder="Nome, email..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filtro por Plano */}
        <div className="min-w-40">
          <Label className="text-sm font-medium">Plano</Label>
          <Select 
            value={filters.plan} 
            onValueChange={(value) => updateFilter('plan', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os planos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os planos</SelectItem>
              <SelectItem value="free">Gratuito</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por Status */}
        <div className="min-w-40">
          <Label className="text-sm font-medium">Status</Label>
          <Select 
            value={filters.status} 
            onValueChange={(value) => updateFilter('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por Data */}
        <div className="min-w-48">
          <Label className="text-sm font-medium">Período de Criação</Label>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex-1 justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.from 
                    ? format(filters.dateRange.from, 'dd/MM/yyyy', { locale: ptBR })
                    : 'De'
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.from}
                  onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, from: date })}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex-1 justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.to 
                    ? format(filters.dateRange.to, 'dd/MM/yyyy', { locale: ptBR })
                    : 'Até'
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.dateRange.to}
                  onSelect={(date) => updateFilter('dateRange', { ...filters.dateRange, to: date })}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Limpar Filtros */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <Button variant="ghost" onClick={clearFilters} className="h-10">
              <X className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          </div>
        )}
      </div>

      {/* Tags de filtros ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Busca: "{filters.search}"</span>
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('search', '')}
              />
            </Badge>
          )}
          
          {filters.plan !== 'all' && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Plano: {filters.plan}</span>
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('plan', 'all')}
              />
            </Badge>
          )}
          
          {filters.status !== 'all' && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Status: {filters.status}</span>
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('status', 'all')}
              />
            </Badge>
          )}
          
          {(filters.dateRange.from || filters.dateRange.to) && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>
                Período: {filters.dateRange.from ? format(filters.dateRange.from, 'dd/MM', { locale: ptBR }) : '...'} 
                {' - '}
                {filters.dateRange.to ? format(filters.dateRange.to, 'dd/MM', { locale: ptBR }) : '...'}
              </span>
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => updateFilter('dateRange', {})}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}