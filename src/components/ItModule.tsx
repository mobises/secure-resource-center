
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Computer, Users, Package, Wrench } from "lucide-react";
import { SectionUser } from "@/types";
import SectionUserManagement from './SectionUserManagement';
import StockControl from './StockControl';
import MaintenanceControl from './MaintenanceControl';

const ItModule = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'stock' | 'maintenance'>('users');
  const [sectionUsers, setSectionUsers] = useState<SectionUser[]>([
    {
      id: '1',
      name: 'Admin IT',
      email: 'admin@empresa.com',
      sectionRoles: {
        stock: 'admin',
        maintenance: 'admin'
      },
      sectionAccess: {
        stock: true,
        maintenance: true
      }
    },
    {
      id: '2',
      name: 'Usuario Normal',
      email: 'user@empresa.com',
      sectionRoles: {
        stock: 'user',
        maintenance: null
      },
      sectionAccess: {
        stock: true,
        maintenance: false
      }
    }
  ]);

  // Usuario actual simulado (en un caso real vendría del contexto de autenticación)
  const currentUser = sectionUsers[0]; // Simulamos que es el admin
  
  const getUserRole = (section: 'stock' | 'maintenance') => {
    return currentUser.sectionRoles[section];
  };

  const isAdmin = (section: 'stock' | 'maintenance') => {
    return getUserRole(section) === 'admin';
  };

  const hasAccess = (section: 'stock' | 'maintenance') => {
    return currentUser.sectionAccess[section];
  };

  const availableTabs = [
    { id: 'users' as const, name: 'Gestión de Usuarios', icon: Users, always: true },
    { id: 'stock' as const, name: 'Control de Stock', icon: Package, access: hasAccess('stock') },
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
            <SectionUserManagement 
              users={sectionUsers}
              onUpdateUsers={setSectionUsers}
            />
          )}

          {activeTab === 'stock' && hasAccess('stock') && (
            <StockControl 
              currentUser={currentUser}
              isAdmin={isAdmin('stock')}
            />
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
