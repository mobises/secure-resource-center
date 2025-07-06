
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, Calendar, List, Clock, MapPin, Edit, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useVehicleReservations } from "@/hooks/useLocalData";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const MyVehicleReservations = () => {
  const { user } = useAuth();
  const { data: reservations, updateData: updateReservations } = useVehicleReservations();
  const [view, setView] = useState<'calendar' | 'list'>('list');

  const myReservations = reservations.filter(r => r.userId === user?.id);

  const handleCancelReservation = (reservationId: string) => {
    const updatedReservations = reservations.map(r => 
      r.id === reservationId ? { ...r, status: 'cancelled' as const } : r
    );
    updateReservations(updatedReservations);
    toast({
      title: "Éxito",
      description: "Reserva cancelada correctamente"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprobada';
      case 'pending': return 'Pendiente';
      case 'cancelled': return 'Cancelada';
      case 'completed': return 'Completada';
      default: return 'Rechazada';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Car className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Mis Reservas de Vehículos</h2>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as 'calendar' | 'list')}>
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Lista
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="space-y-4">
            {myReservations.length === 0 ? (
              <Card className="p-8 text-center">
                <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No tienes reservas de vehículos</p>
              </Card>
            ) : (
              myReservations.map((reservation) => (
                <Card key={reservation.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        <span className="font-semibold">{reservation.vehicleName}</span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(reservation.startDate), 'dd/MM/yyyy', { locale: es })} - {format(new Date(reservation.endDate), 'dd/MM/yyyy', { locale: es })}
                        </div>
                        {reservation.startTime && reservation.endTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {reservation.startTime} - {reservation.endTime}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {reservation.destination}
                        </div>
                        <p>Propósito: {reservation.purpose}</p>
                        <p>Matrícula del Vehículo: {reservation.licensePlate || reservation.driverLicense}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(reservation.status)}`}>
                        {getStatusText(reservation.status)}
                      </span>
                      {reservation.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelReservation(reservation.id)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <Card className="p-6">
            <p className="text-center text-gray-600">Vista de calendario próximamente disponible</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyVehicleReservations;
