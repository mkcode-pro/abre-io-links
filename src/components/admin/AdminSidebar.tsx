import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Users,
  Link2,
  CreditCard,
  Shield,
  Settings,
  AlertTriangle,
  FileText,
  TrendingUp,
  UserCheck,
  Globe,
  Database
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: BarChart3,
    permission: 'read'
  },
  {
    title: 'Usuários',
    url: '/admin/users',
    icon: Users,
    permission: 'manage_users'
  },
  {
    title: 'Links',
    url: '/admin/links',
    icon: Link2,
    permission: 'read'
  },
  {
    title: 'Bio Pages',
    url: '/admin/bio-pages',
    icon: Globe,
    permission: 'read'
  },
  {
    title: 'Analytics',
    url: '/admin/analytics',
    icon: TrendingUp,
    permission: 'view_analytics'
  },
  {
    title: 'Financeiro',
    url: '/admin/financial',
    icon: CreditCard,
    permission: 'view_analytics'
  },
  {
    title: 'Relatórios',
    url: '/admin/reports',
    icon: FileText,
    permission: 'view_analytics'
  },
  {
    title: 'Moderação',
    url: '/admin/moderation',
    icon: UserCheck,
    permission: 'write'
  },
  {
    title: 'Segurança',
    url: '/admin/security',
    icon: Shield,
    permission: 'manage_settings'
  },
  {
    title: 'Alertas',
    url: '/admin/alerts',
    icon: AlertTriangle,
    permission: 'read'
  },
  {
    title: 'Banco de Dados',
    url: '/admin/database',
    icon: Database,
    permission: 'manage_settings'
  },
  {
    title: 'Configurações',
    url: '/admin/settings',
    icon: Settings,
    permission: 'manage_settings'
  }
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`border-r border-border bg-card transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              {!collapsed && (
                <div>
                  <h1 className="font-bold text-lg">Admin Panel</h1>
                  <p className="text-xs text-muted-foreground">Abrev.io Control</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8 p-0"
            >
              <Database className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {!collapsed && 'Administração'}
            </div>
            {navigationItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm">{item.title}</span>}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}