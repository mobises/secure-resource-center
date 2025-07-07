
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Plus, Users } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { RoomReservation } from "@/types";
import { useRooms, useRoomReservations, useRoomScheduleConfig } from "@/hooks/useLocalData";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/hooks/useAuth";

const EnhancedRoomBooking = () => {
  const { user } = useAuth();
  const { data: rooms } = useRooms();
  const { data: reservations, updateData: updateReservations } = useRoomReservations();
  const { data: scheduleConfig } = useRoomScheduleConfig();
  const { addRoomReservationNotification } = useNotifications();

  const [newReservation, setNewReservation] = useState({
    roomId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1
  });

  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [maxAttendees, setMaxAttendees] = useState(1);

  // Generate 15-minute intervals
  const generateTimeSlots = (startHour: number, startMinute: number, endHour: number, endMinute: number) => {
    const slots = [];
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    for (let minutes = startTotalMinutes; minutes <= endTotalMinutes; minutes += 15) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      slots.push(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`);
    }
    
    return slots;
  };

  const getAvailableTimesForDate = (selectedDate: string, roomId: string) => {
    const today = new Date();
    const selectedDateObj = new Date(selectedDate);
    const isToday = selectedDate === today.toISOString().split('T')[0];
    const dayOfWeek = selectedDateObj.getDay() === 0 ? 6 : selectedDateObj.getDay() - 1; // Convert to Monday=0 format

    // Find schedule configuration for this day
    const dayConfig = scheduleConfig.find(config => 
      config.dayOfWeek === dayOfWeek && config.enabled
    );

    let startTime, endTime;
    
    if (dayConfig) {
      startTime = dayConfig.startTime;
      endTime = dayConfig.endTime;
    } else {
      // Default times if no configuration found
      startTime = "08:00";
      endTime = "18:00";
    }

    // If it's today, start time can't be earlier than current time
    if (isToday) {
      const currentTime = today.getHours() * 60 + today.getMinutes();
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const startTotalMinutes = startHour * 60 + startMinute;
      
      if (currentTime > startTotalMinutes) {
        // Round up to next 15-minute interval
        const nextSlot = Math.ceil(currentTime / 15) * 15;
        const nextHour = Math.floor(nextSlot / 60);
        const nextMinute = nextSlot % 60;
        startTime = `${nextHour.toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`;
      }
    }

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const allSlots = generateTimeSlots(startHour, startMinute, endHour, endMinute);
    
    // Filter out unavailable times based on existing reservations
    const dayReservations = reservations.filter(r => 
      r.roomId === roomId && 
      r.date === selectedDate && 
      r.status === 'approved'
    );

    const availableSlots = allSlots.filter(slot => {
      return !dayReservations.some(reservation => {
        const [slotHour, slotMinute] = slot.split(':').map(Number);
        const slotMinutes = slotHour * 60 + slotMinute;
        
        const [resStartHour, resStartMinute] = reservation.startTime.split(':').map(Number);
        const [resEndHour, resEndMinute] = reservation.endTime.split(':').map(Number);
        const resStartMinutes = resStartHour * 60 + resStartMinute;
        const resEndMinutes = resEndHour * 60 + resEndMinute;
        
        return slotMinutes >= resStartMinutes && slotMinutes < resEndMinutes;
      });
    });

    return availableSlots;
  };

  useEffect(() => {
    if (newReservation.roomId && newReservation.date) {
      const times = getAvailableTimesForDate(newReservation.date, newReservation.roomId);
      setAvailableTimes(times);
      
      // Set default end time to last available time
      if (times.length > 0 && !newReservation.startTime) {
        setNewReservation(prev => ({
          ...prev,
          endTime: times[times.length - 1]
        }));
      }
      
      // Set max attendees based on room capacity
      const selectedRoom = rooms.find(r => r.id === newReservation.roomId);
      if (selectedRoom) {
        setMaxAttendees(selectedRoom.capacity);
        setNewReservation(prev => ({
          ...prev,
          attendees: Math.min(prev.attendees, selectedRoom.capacity)
        }));
      }
    }
  }, [newReservation.roomId, newReservation.date, rooms, reservations, scheduleConfig]);

  const handleAddReservation = () => {
    if (!newReservation.roomId || !newReservation.date || !newReservation.startTime || !newReservation.endTime || !newReservation.purpose) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    if (newReservation.startTime >= newReservation.endTime) {
      toast({
        title: "Error",
        description: "La hora de fin debe ser posterior a la hora de inicio",
        variant: "destructive"
      });
      return;
    }

    const selectedRoom = rooms.find(r => r.id === newReservation.roomId);
    
    const reservation: RoomReservation = {
      id: Date.now().toString(),
      userId: user?.id || '1',
      userName: user?.name || 'Usuario',
      roomName: selectedRoom?.name || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...newReservation
    };

    updateReservations([...reservations, reservation]);
    
    // Add notification for administrators
    addRoomReservationNotification(reservation.id, selectedRoom?.name || '', user?.name || 'Usuario');
    
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
      description: "Reserva de sala creada correctamente"
    });
  };

  const availableRooms = rooms.filter(r => r.status === 'available');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-6 w-6" />
        <h3 className="text-xl font-semibold">Nueva Reserva de Sala</h3>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="room">Sala</Label>
              <select
                id="room"
                value={newReservation.roomId}
                onChange={(e) => setNewReservation({...newReservation, roomId: e.target.value})}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="">Seleccionar sala</option>
                {availableRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} (Capacidad: {room.capacity})
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
          </div>

          {newReservation.roomId && newReservation.date && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Hora de inicio</Label>
                  <select
                    id="startTime"
                    value={newReservation.startTime}
                    onChange={(e) => setNewReservation({...newReservation, startTime: e.target.value})}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="">Seleccionar hora de inicio</option>
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="endTime">Hora de fin</Label>
                  <select
                    id="endTime"
                    value={newReservation.endTime}
                    onChange={(e) => setNewReservation({...newReservation, endTime: e.target.value})}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="">Seleccionar hora de fin</option>
                    {availableTimes
                      .filter(time => !newReservation.startTime || time > newReservation.startTime)
                      .map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="attendees">Número de asistentes</Label>
                <select
                  id="attendees"
                  value={newReservation.attendees}
                  onChange={(e) => setNewReservation({...newReservation, attendees: parseInt(e.target.value)})}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                >
                  {Array.from({ length: maxAttendees }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'asistente' : 'asistentes'}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <Label htmlFor="purpose">Propósito de la reunión</Label>
            <Textarea
              id="purpose"
              value={newReservation.purpose}
              onChange={(e) => setNewReservation({...newReservation, purpose: e.target.value})}
              placeholder="Describe el propósito de la reunión"
              rows={3}
            />
          </div>

          <Button onClick={handleAddReservation}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Reserva
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedRoomBooking;
