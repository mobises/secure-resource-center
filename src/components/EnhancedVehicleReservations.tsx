
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Settings, BarChart3, Calendar, Clock } from "lucide-react";
import VehicleCalendarView from './VehicleCalendarView';
import VehicleConfiguration from './VehicleConfiguration';
import VehicleOccupancy from './VehicleOccupancy';
import VehicleScheduleConfiguration from './VehicleScheduleConfiguration';
import { useAuth } from '@/hooks/useAuth';

const EnhancedVehicleReservations = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Car className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Reserva de Vehículos</h2>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendario
          </TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="occupancy" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Ocupación
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Configuración Horarios
              </TabsTrigger>
              <TabsTrigger value="configuration" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configuración Vehículos
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="calendar">
          <VehicleCalendarView />
        </TabsContent>

        {isAdmin && (
          <>
            <TabsContent value="occupancy">
              <VehicleOccupancy />
            </TabsContent>
            
            <TabsContent value="schedule">
              <VehicleScheduleConfiguration />
            </TabsContent>
            
            <TabsContent value="configuration">
              <VehicleConfiguration isAdmin={isAdmin} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default EnhancedVehicleReservations;
