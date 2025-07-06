
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calendar, Plus, Clock, MapPin, Users, Package } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SectionUser, RoomReservation } from "@/types";
import { useRoomConfigs, useRoomReservations } from "@/hooks/useLocalData";
import { useAuth } from "@/hooks/useAuth";

interface RoomBookingControlProps {
  currentUser: SectionUser;
  isAdmin: boolean;
}

const RoomBookingControl: React.FC<RoomBookingControlProps> = ({ currentUser, isAdmin }) => {
  const { user } = useAuth();
  const { data: roomConfigs } = useRoomConfigs();
  const { data: reservations, updateData: updateReservations } = useRoomReservations();

  const [newReservation, setNewReservation] = useState({
    roomId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1
  });

  // Solo mostrar salas activas
  const activeRooms = roomConfigs.filter(room => room.active);

  const selectedRoom = activeRooms.find(r => r.id === newReservation.roomId);

  const handleAddReservation = () => {
    if (!newReservation.roomId || !newReservation.date || !newReservation.startTime || !newReservation.endTime) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const selectedRoom = activeRooms.find(r => r.id === newReservation.roomId);
    if (!selectedRoom) {
      toast({
        title: "Error",
        description: "Sala no válida",
        variant: "destructive"
      });
      return;
    }

    if (newReservation.attendees > selectedRoom.maxCapacity) {
      toast({
        title: "Error",
        description: `La sala solo tiene capacidad para ${selectedRoom.maxCapacity} personas`,
        variant: "destructive"
      });
      return;
    }

    const reservation: RoomReservation = {
      id: Date.now().toString(),
      roomId: newReservation.roomId,
      roomName: selectedRoom.name,
      userId: user?.id || currentUser.id,
      userName: user?.name || currentUser.name,
      date: newReservation.date,
      startTime: newReservation.startTime,
      endTime: newReservation.endTime,
      purpose: newReservation.purpose,
      status: isAdmin ? 'approved' : 'pending',
      createdAt: new Date().toISOString()
    };

    updateReservations([...reservations, reservation]);
    setNewReservation({
      roomId: '',
      date: '',
      startTime: '',
      endTime: '',
      purpose: '',
      attendees: 1
    });

    toast({
      title: "Éxito",
      description: `Reserva ${isAdmin ? 'aprobada' : 'creada'} correctamente`
    });
  };

  const handleUpdateReservationStatus = (reservationId: string, status: 'approved' | 'rejected') => {
    const updated = reservations.map(r => 
      r.id === reservationId ? { ...r, status } : r
    );
    updateReservations(updated);

    toast({
      title: "Éxito",
      description: `Reserva ${status === 'approved' ? 'aprobada' : 'rechazada'}`
    });
  };

  if (!currentUser.sectionAccess.rooms) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No tienes acceso a esta sección</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-6 w-6" />
        <h3 className="text-xl font-bold">Reserva de Salas</h3>
      </div>

      {activeRooms.length === 0 ? (
        <Card className="p-6 text-center">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No hay salas disponibles</p>
          {isAdmin && (
            <p className="text-sm text-gray-500 mt-2">
              Configura las salas desde el módulo IT - Configuración de Salas
            </p>
          )}
        </Card>
      ) : (
        <>
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-4">Nueva Reserva</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="room">Sala</Label>
                <select
                  id="room"
                  value={newReservation.roomId}
                  onChange={(e) => setNewReservation({...newReservation, roomId: e.target.value, attendees: 1})}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="">Seleccionar sala</option>
                  {activeRooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} (Cap. {room.maxCapacity})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={newReservation.date}
                  onChange={(e) => setNewReservation({...newReservation, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="startTime">Hora de inicio</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newReservation.startTime}
                  onChange={(e) => setNewReservation({...newReservation, startTime: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="endTime">Hora de fin</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newReservation.endTime}
                  onChange={(e) => setNewReservation({...newReservation, endTime: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="attendees">Número de Asistentes</Label>
                <select
                  id="attendees"
                  value={newReservation.attendees}
                  onChange={(e) => setNewReservation({...newReservation, attendees: parseInt(e.target.value)})}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                  disabled={!selectedRoom}
                >
                  {selectedRoom ? (
                    Array.from({ length: selectedRoom.maxCapacity }, (_, i) => i + 1).map(num => (
                      <option key={num} value={num}>{num} persona{num > 1 ? 's' : ''}</option>
                    ))
                  ) : (
                    <option value={1}>Selecciona una sala primero</option>
                  )}
                </select>
              </div>
              <div>
                <Label htmlFor="purpose">Propósito</Label>
                <Input
                  id="purpose"
                  value={newReservation.purpose}
                  onChange={(e) => setNewReservation({...newReservation, purpose: e.target.value})}
                  placeholder="Reunión, presentación, etc."
                />
              </div>
            </div>
            
            {/* Mostrar detalles de la sala seleccionada */}
            {selectedRoom && (
              <Card className="mt-4 p-4 bg-blue-50">
                <h5 className="font-semibold mb-2">Detalles de la Sala</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Ubicación: {selectedRoom.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Capacidad: {selectedRoom.maxCapacity} personas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span>Recursos: {selectedRoom.resources?.length || 0}</span>
                  </div>
                </div>
                {selectedRoom.resources && selectedRoom.resources.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium text-sm mb-2">Recursos disponibles:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoom.resources.map((resource) => (
                        <span key={resource.id} className="px-2 py-1 bg-white rounded text-xs border">
                          {resource.name} ({resource.quantity})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}
            
            <Button onClick={handleAddReservation} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Crear Reserva
            </Button>
          </Card>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Reservas</h4>
            {reservations.length === 0 ? (
              <Card className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No hay reservas registradas</p>
              </Card>
            ) : (
              reservations.map((reservation) => {
                const room = activeRooms.find(r => r.id === reservation.roomId);
                return (
                  <Card key={reservation.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="font-semibold">
                            {reservation.roomName || room?.name || 'Sala no encontrada'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(reservation.date).toLocaleDateString('es-ES')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {reservation.startTime} - {reservation.endTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Usuario: {reservation.userName}
                          </div>
                        </div>
                        <p className="text-sm">{reservation.purpose}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          reservation.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : reservation.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {reservation.status === 'approved' ? 'Aprobada' : 
                           reservation.status === 'pending' ? 'Pendiente' : 'Rechazada'}
                        </span>
                        {isAdmin && reservation.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => handleUpdateReservationStatus(reservation.id, 'approved')}
                            >
                              Aprobar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateReservationStatus(reservation.id, 'rejected')}
                            >
                              Rechazar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RoomBookingControl;
