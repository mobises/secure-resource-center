
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Car, Calendar, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedVehicleBookingControl from './EnhancedVehicleBookingControl';
import EnhancedVehicleConfig from './EnhancedVehicleConfig';
import { useSectionUsers } from "@/hooks/useLocalData";
import { useAuth } from '@/hooks/useAuth';
import { SectionUser } from "@/types";

const VehicleModule = () => {
  const { user, hasAccess, isAdmin } = useAuth();
  const { data: sectionUsers } = useSectionUsers();
  
  // Verificar acceso a vehículos
  if (!hasAccess('vehicles')) {
    return (
      <div className="text-center py-8">
        <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No tienes acceso a esta sección</p>
      </div>
    );
  }
  
  // Simular usuario de sección actual
  const currentSectionUser: SectionUser = sectionUsers[0] || {
    id: '1',
    name: 'Usuario Demo',
    userId: 'demo',
    password: '12345',
    dashboardAccess: true,
    sectionRoles: {
      stock: null,
      maintenance: null,
      rooms: null,
      security: null,
      vehicles: 'user' as const
    },
    sectionAccess: {
      stock: false,
      maintenance: false,
      rooms: false,
      security: false,
      vehicles: true
    }
  };

  const adminAccess = isAdmin('vehicles');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Car className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Gestión de Vehículos</h2>
      </div>

      <Tabs defaultValue="booking" className="space-y-4">
        <TabsList>
          <TabsTrigger value="booking" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Reservas
          </TabsTrigger>
          {adminAccess && (
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="booking">
          <EnhancedVehicleBookingControl 
            currentUser={currentSectionUser}
            isAdmin={adminAccess}
          />
        </TabsContent>

        {adminAccess && (
          <TabsContent value="config">
            <EnhancedVehicleConfig />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default VehicleModule;
