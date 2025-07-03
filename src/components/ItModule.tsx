
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Computer, Users, Package, Wrench, Calendar, Car } from "lucide-react";
import { SectionUser } from "@/types";
import SectionUserManagement from './SectionUserManagement';
import StockControl from './StockControl';
import MaintenanceControl from './MaintenanceControl';
import RoomBookingControl from './RoomBookingControl';
import VehicleBookingControl from './VehicleBookingControl';

const ItModule = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'stock' | 'maintenance' | 'rooms' | 'vehicles'>('users');
  const [sectionUsers, setSectionUsers] = useState<SectionUser[]>([
    {
      id: '1',
      name: 'Admin IT',
      userId: 'admin001',
      password: '12345',
      sectionRoles: {
        stock: 'admin',
        maintenance: 'admin',
        rooms: 'admin',
        security: 'admin',
        vehicles: 'admin'
      },
      sectionAccess: {
        stock: true,
        maintenance: true,
        rooms: true,
        security: true,
        vehicles: true
      }
    },
    {
      id: '2',
      name: 'Usuario Normal',
      userId: 'user001',
      password: '12345',
      sectionRoles: {
        stock: 'user',
        maintenance: null,
        rooms: 'user',
        security: null,
        vehicles: 'user'
      },
      sectionAccess: {
        stock: true,
        maintenance: false,
        rooms: true,
        security: false,
        vehicles: true
      }
    }
  ]);

  // Usuario actual simulado (en un caso real vendría del contexto de autenticación)
  const currentUser = sectionUsers[0]; // Simulamos que es el admin
  
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
    { id: 'stock' as const, name: 'Control de Stock', icon: Package, access: hasAccess('stock') },
    { id: 'maintenance' as const, name: 'Mantenimiento', icon: Wrench, access: hasAccess('maintenance') },
    { id: 'rooms' as const, name: 'Reserva de Salas', icon: Calendar, access: hasAccess('rooms') },
    { id: 'vehicles' as const, name: 'Reserva de Vehículos', icon: Car, access: hasAccess('vehicles') }
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

          {activeTab === 'rooms' && hasAccess('rooms') && (
            <RoomBookingControl 
              currentUser={currentUser}
              isAdmin={isAdmin('rooms')}
            />
          )}

          {activeTab === 'vehicles' && hasAccess('vehicles') && (
            <VehicleBookingControl 
              currentUser={currentUser}
              isAdmin={isAdmin('vehicles')}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default ItModule;
