
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calendar, Plus, Clock, MapPin, Users } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SectionUser, Room, Reservation } from "@/types";

interface RoomBookingControlProps {
  currentUser: SectionUser;
  isAdmin: boolean;
}

const RoomBookingControl: React.FC<RoomBookingControlProps> = ({ currentUser, isAdmin }) => {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: '1',
      name: 'Sala de Juntas A',
      capacity: 12,
      location: 'Piso 2',
      amenities: ['Proyector', 'Pizarra', 'Wi-Fi'],
      available: true
    }
  ]);

  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [newReservation, setNewReservation] = useState({
    roomId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1
  });

  const handleAddReservation = () => {
    if (!newReservation.roomId || !newReservation.date || !newReservation.startTime || !newReservation.endTime) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const reservation: Reservation = {
      id: Date.now().toString(),
      userId: currentUser.id,
      status: 'pending',
      ...newReservation
    };

    setReservations([...reservations, reservation]);
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
      description: "Reserva creada correctamente"
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

      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Nueva Reserva</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="room">Sala</Label>
            <select
              id="room"
              value={newReservation.roomId}
              onChange={(e) => setNewReservation({...newReservation, roomId: e.target.value})}
              className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="">Seleccionar sala</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} (Cap. {room.capacity})
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
            <Label htmlFor="attendees">Asistentes</Label>
            <Input
              id="attendees"
              type="number"
              min="1"
              value={newReservation.attendees}
              onChange={(e) => setNewReservation({...newReservation, attendees: parseInt(e.target.value)})}
            />
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
        <Button onClick={handleAddReservation} className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Crear Reserva
        </Button>
      </Card>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Reservas Activas</h4>
        {reservations.map((reservation) => (
          <Card key={reservation.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-semibold">
                    {rooms.find(r => r.id === reservation.roomId)?.name || 'Sala desconocida'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {reservation.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {reservation.startTime} - {reservation.endTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {reservation.attendees} personas
                  </div>
                </div>
                <p className="text-sm">{reservation.purpose}</p>
              </div>
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
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoomBookingControl;
