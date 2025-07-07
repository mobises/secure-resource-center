
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Settings, BarChart3, Users, Clock, Plus } from "lucide-react";
import RoomCalendarView from './RoomCalendarView';
import RoomConfiguration from './RoomConfiguration';
import RoomOccupancy from './RoomOccupancy';
import RoomScheduleConfiguration from './RoomScheduleConfiguration';
import EnhancedRoomBooking from './EnhancedRoomBooking';
import { useAuth } from '@/hooks/useAuth';

const EnhancedRoomReservations = () => {
  const { user } = useAuth();
  const isAdmin = (user && 'role' in user && user.role === 'admin') || (user && 'sectionRoles' in user && user.sectionRoles.rooms === 'admin');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Reserva de Salas</h2>
      </div>

      <Tabs defaultValue="booking" className="space-y-4">
        <TabsList>
          <TabsTrigger value="booking" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Reserva
          </TabsTrigger>
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
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Configuración Horarios
              </TabsTrigger>
              <TabsTrigger value="configuration" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configuración Salas
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="booking">
          <EnhancedRoomBooking />
        </TabsContent>

        <TabsContent value="calendar">
          <RoomCalendarView />
        </TabsContent>

        {isAdmin && (
          <>
            <TabsContent value="occupancy">
              <RoomOccupancy />
            </TabsContent>
            
            <TabsContent value="schedule">
              <RoomScheduleConfiguration />
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
