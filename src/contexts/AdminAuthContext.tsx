import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
}

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkPermission: (permission: string) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

// Sistema de autenticação independente para admins
export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há uma sessão admin ativa
    const adminSession = localStorage.getItem('admin_session');
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession);
        if (session.expiresAt > Date.now()) {
          setAdminUser(session.adminUser);
        } else {
          localStorage.removeItem('admin_session');
        }
      } catch (error) {
        localStorage.removeItem('admin_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Por enquanto, usar credencial hardcoded para demo
      // Em produção, implementar hash bcrypt real
      if (email === 'admin@abrev.io' && password === 'admin123') {
        const mockAdminUser: AdminUser = {
          id: '1',
          email: 'admin@abrev.io',
          name: 'Administrador Principal',
          role: 'super_admin',
          permissions: ['read', 'write', 'delete', 'manage_users', 'manage_settings', 'view_analytics'],
          isActive: true,
          twoFactorEnabled: false,
          lastLoginAt: new Date().toISOString()
        };

        // Criar sessão admin (24 horas)
        const session = {
          adminUser: mockAdminUser,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000)
        };

        localStorage.setItem('admin_session', JSON.stringify(session));
        setAdminUser(mockAdminUser);

        // Log de login
        await supabase.rpc('create_admin_log', {
          _admin_user_id: mockAdminUser.id,
          _action: 'login',
          _resource_type: 'auth',
          _details: { success: true }
        });

        return { success: true };
      } else {
        return { success: false, error: 'Credenciais inválidas' };
      }
    } catch (error) {
      return { success: false, error: 'Erro interno do servidor' };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_session');
    setAdminUser(null);
  };

  const checkPermission = (permission: string) => {
    if (!adminUser) return false;
    return adminUser.permissions.includes(permission) || adminUser.role === 'super_admin';
  };

  return (
    <AdminAuthContext.Provider value={{
      adminUser,
      loading,
      login,
      logout,
      checkPermission
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth deve ser usado dentro de AdminAuthProvider');
  }
  return context;
}