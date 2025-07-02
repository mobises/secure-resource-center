
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car } from "lucide-react";
import VehicleConfig from './VehicleConfig';
import VehicleReservations from './VehicleReservations';

const VehicleModule = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Car className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Módulo de Vehículos</h2>
      </div>

      <Tabs defaultValue="reservations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reservations">Reservas</TabsTrigger>
          <TabsTrigger value="config">Configuración</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reservations" className="space-y-4">
          <VehicleReservations />
        </TabsContent>
        
        <TabsContent value="config" className="space-y-4">
          <VehicleConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleModule;
