
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Settings, BarChart3, Users } from "lucide-react";
import RoomCalendarView from './RoomCalendarView';
import RoomConfiguration from './RoomConfiguration';
import RoomOccupancy from './RoomOccupancy';
import { useAuth } from '@/hooks/useAuth';

const EnhancedRoomReservations = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Reserva de Salas</h2>
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
                Ocupación de Salas
              </TabsTrigger>
              <TabsTrigger value="configuration" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configuración Salas
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="calendar">
          <RoomCalendarView />
        </TabsContent>

        {isAdmin && (
          <>
            <TabsContent value="occupancy">
              <RoomOccupancy />
            </TabsContent>
            
            <TabsContent value="configuration">
              <RoomConfiguration isAdmin={isAdmin} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default EnhancedRoomReservations;
