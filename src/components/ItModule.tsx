
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Computer, Users, Package, Wrench, Calendar, AlertTriangle, FileText } from "lucide-react";
import { SectionUser } from "@/types";
import SectionUserManagement from './SectionUserManagement';
import StockControl from './StockControl';
import CurrentStock from './CurrentStock';
import MaintenanceControl from './MaintenanceControl';
import HolidayConfiguration from './HolidayConfiguration';
import PasswordExpirationManagement from './PasswordExpirationManagement';
import SystemLogs from './SystemLogs';
import { useSectionUsers } from "@/hooks/useLocalData";

const ItModule = () => {
  const { data: sectionUsers, updateData: updateSectionUsers } = useSectionUsers();
  const [activeTab, setActiveTab] = useState<'users' | 'stock' | 'current-stock' | 'maintenance' | 'holidays' | 'passwords' | 'logs'>('users');

  // Usuario actual simulado (en un caso real vendría del contexto de autenticación)
  const currentUser: SectionUser = sectionUsers[0] || {
    id: '1',
    name: 'Admin IT',
    userId: 'admin001',
    password: '12345',
    dashboardAccess: true,
    sectionRoles: {
      stock: 'admin' as const,
      maintenance: 'admin' as const,
      rooms: 'admin' as const,
      security: 'admin' as const,
      vehicles: 'admin' as const
    },
    sectionAccess: {
      stock: true,
      maintenance: true,
      rooms: true,
      security: true,
      vehicles: true
    }
  };
  
  const getUserRole = (section: 'stock' | 'maintenance' | 'rooms' | 'security' | 'vehicles') => {
    return currentUser.sectionRoles[section];
  };

  const isAdmin = (section: 'stock' | 'maintenance' | 'rooms' | 'security' | 'vehicles') => {
    return getUserRole(section) === 'admin';
  };

  const hasAccess = (section: 'stock' | 'maintenance' | 'rooms' | 'security' | 'vehicles') => {
    return currentUser.sectionAccess[section];
  };

  const availableTabs = [
    { id: 'users' as const, name: 'Gestión de Usuarios', icon: Users, always: true },
    { id: 'passwords' as const, name: 'Cambio de Contraseñas', icon: AlertTriangle, always: true },
    { id: 'holidays' as const, name: 'Días Festivos', icon: Calendar, always: true },
    { id: 'logs' as const, name: 'Logs del Sistema', icon: FileText, always: true },
    { id: 'stock' as const, name: 'Control de Stock', icon: Package, access: hasAccess('stock') },
    { id: 'current-stock' as const, name: 'Stock Actual', icon: Package, access: hasAccess('stock') },
    { id: 'maintenance' as const, name: 'Mantenimiento', icon: Wrench, access: hasAccess('maintenance') }
  ].filter(tab => tab.always || tab.access);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Computer className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Módulo IT</h2>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-2 mb-6">
          {availableTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </Button>
            );
          })}
        </div>

        <div className="mt-6">
          {activeTab === 'users' && (
            <SectionUserManagement />
          )}

          {activeTab === 'passwords' && (
            <PasswordExpirationManagement />
          )}

          {activeTab === 'holidays' && (
            <HolidayConfiguration />
          )}

          {activeTab === 'logs' && (
            <SystemLogs />
          )}

          {activeTab === 'stock' && hasAccess('stock') && (
            <StockControl 
              currentUser={currentUser}
              isAdmin={isAdmin('stock')}
            />
          )}

          {activeTab === 'current-stock' && hasAccess('stock') && (
            <CurrentStock />
          )}

          {activeTab === 'maintenance' && hasAccess('maintenance') && (
            <MaintenanceControl 
              currentUser={currentUser}
              isAdmin={isAdmin('maintenance')}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default ItModule;
