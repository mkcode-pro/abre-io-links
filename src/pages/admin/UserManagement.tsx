import React, { useState } from 'react';
import { useUserManagement, UserData } from '@/hooks/useUserManagement';
import { UsersFilters } from '@/components/admin/users/UsersFilters';
import { UsersTable } from '@/components/admin/users/UsersTable';
import { UserDetailsModal } from '@/components/admin/users/UserDetailsModal';
import { Pagination } from '@/components/admin/users/Pagination';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

export function UserManagement() {
  const {
    users,
    loading,
    error,
    totalUsers,
    currentPage,
    pageSize,
    filters,
    setFilters,
    fetchUsers,
    updateUserPlan,
    deleteUser,
    exportUsers,
    setCurrentPage
  } = useUserManagement();

  const { toast } = useToast();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedUsers(selected ? users.map(user => user.id) : []);
  };

  const handleViewUser = (user: UserData) => {
    setSelectedUser(user);
    setDetailsModalOpen(true);
  };

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    fetchUsers(1, newFilters);
  };

  const handleExport = async () => {
    const result = await exportUsers();
    if (result.success) {
      toast({
        title: 'Exportação concluída',
        description: 'Arquivo CSV baixado com sucesso!'
      });
    } else {
      toast({
        title: 'Erro na exportação',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return;

    let confirmMessage = '';
    switch (action) {
      case 'upgrade-premium':
        confirmMessage = `Alterar ${selectedUsers.length} usuários para o plano Premium?`;
        break;
      case 'downgrade-free':
        confirmMessage = `Alterar ${selectedUsers.length} usuários para o plano Gratuito?`;
        break;
      case 'delete':
        confirmMessage = `Deletar ${selectedUsers.length} usuários? Esta ação não pode ser desfeita.`;
        break;
      default:
        return;
    }

    if (!confirm(confirmMessage)) return;

    try {
      const promises = selectedUsers.map(userId => {
        switch (action) {
          case 'upgrade-premium':
            return updateUserPlan(userId, 'premium');
          case 'downgrade-free':
            return updateUserPlan(userId, 'free');
          case 'delete':
            return deleteUser(userId);
          default:
            return Promise.resolve({ success: false });
        }
      });

      const results = await Promise.all(promises);
      const successCount = results.filter(r => r.success).length;
      const failureCount = results.length - successCount;

      if (successCount > 0) {
        toast({
          title: 'Ação executada',
          description: `${successCount} usuários processados com sucesso${failureCount > 0 ? `, ${failureCount} falharam` : ''}.`
        });
      }

      if (failureCount > 0) {
        toast({
          title: 'Algumas ações falharam',
          description: `${failureCount} usuários não puderam ser processados.`,
          variant: 'destructive'
        });
      }

      setSelectedUsers([]);
    } catch (err) {
      toast({
        title: 'Erro na operação em massa',
        description: 'Erro inesperado ao processar usuários.',
        variant: 'destructive'
      });
    }
  };

  const totalPages = Math.ceil(totalUsers / pageSize);

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UsersFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalUsers={totalUsers}
        selectedCount={selectedUsers.length}
        onExport={handleExport}
        onBulkAction={handleBulkAction}
      />

      <UsersTable
        users={users}
        loading={loading}
        selectedUsers={selectedUsers}
        onSelectUser={handleSelectUser}
        onSelectAll={handleSelectAll}
        onUpdateUserPlan={updateUserPlan}
        onDeleteUser={deleteUser}
        onViewUser={handleViewUser}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalUsers}
          itemsPerPage={pageSize}
        />
      )}

      <UserDetailsModal
        user={selectedUser}
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
}