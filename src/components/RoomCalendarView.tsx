
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, ChevronLeft, ChevronRight, Clock, Users } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRoomConfigs, useRoomReservations } from "@/hooks/useLocalData";
import { RoomReservation } from "@/types";

const RoomCalendarView = () => {
  const { data: roomConfigs } = useRoomConfigs();
  const { data: reservations, updateData: updateReservations } = useRoomReservations();
  
  const [viewType, setViewType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  
  const [newReservation, setNewReservation] = useState({
    startTime: '',
    endTime: '',
    purpose: '',
    attendees: 1
  });

  const availableRooms = roomConfigs.filter(room => room.active);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDatesInWeek = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setSelectedRoom('');
    setShowReservationDialog(true);
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId);
  };

  const handleCreateReservation = () => {
    if (!selectedRoom || !newReservation.startTime || !newReservation.endTime) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    const room = roomConfigs.find(r => r.id === selectedRoom);
    const reservation: RoomReservation = {
      id: Date.now().toString(),
      roomId: selectedRoom,
      roomName: room?.name || '',
      userId: '1', // Usuario actual
      userName: 'Usuario Actual',
      date: selectedDate,
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...newReservation
    };

    updateReservations([...reservations, reservation]);
    
    setShowReservationDialog(false);
    setNewReservation({
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

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewType === 'daily') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewType === 'weekly') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const renderWeeklyView = () => {
    const weekDates = getDatesInWeek(currentDate);
    
    return (
      <div className="grid grid-cols-7 gap-2">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day, index) => (
          <div key={index} className="text-center font-semibold p-2 bg-gray-50">
            {day}
          </div>
        ))}
        {weekDates.map((date, index) => {
          const dateStr = formatDate(date);
          const dayReservations = reservations.filter(r => r.date === dateStr);
          
          return (
            <Card 
              key={index} 
              className="p-2 min-h-[100px] cursor-pointer hover:bg-blue-50"
              onClick={() => handleDateClick(dateStr)}
            >
              <div className="text-sm font-medium mb-2">{date.getDate()}</div>
              <div className="space-y-1">
                {dayReservations.slice(0, 2).map((reservation) => (
                  <div key={reservation.id} className="text-xs bg-blue-100 p-1 rounded">
                    {reservation.roomName} - {reservation.startTime}
                  </div>
                ))}
                {dayReservations.length > 2 && (
                  <div className="text-xs text-gray-500">+{dayReservations.length - 2} más</div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          <h3 className="text-xl font-bold">Calendario de Reservas</h3>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewType === 'daily' ? 'default' : 'outline'}
            onClick={() => setViewType('daily')}
          >
            Diario
          </Button>
          <Button
            variant={viewType === 'weekly' ? 'default' : 'outline'}
            onClick={() => setViewType('weekly')}
          >
            Semanal
          </Button>
          <Button
            variant={viewType === 'monthly' ? 'default' : 'outline'}
            onClick={() => setViewType('monthly')}
          >
            Mensual
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigateDate('prev')}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h2 className="text-lg font-semibold">
          {currentDate.toLocaleDateString('es-ES', { 
            month: 'long', 
            year: 'numeric',
            ...(viewType === 'weekly' && { day: 'numeric' })
          })}
        </h2>
        
        <Button variant="outline" onClick={() => navigateDate('next')}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {viewType === 'weekly' && renderWeeklyView()}

      <Dialog open={showReservationDialog} onOpenChange={setShowReservationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Reserva - {selectedDate}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Seleccionar Sala</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {availableRooms.map((room) => (
                  <Button
                    key={room.id}
                    variant={selectedRoom === room.id ? 'default' : 'outline'}
                    onClick={() => handleRoomSelect(room.id)}
                    className="justify-start"
                  >
                    {room.name} (Cap: {room.maxCapacity})
                  </Button>
                ))}
              </div>
            </div>

            {selectedRoom && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Hora de Inicio</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newReservation.startTime}
                      onChange={(e) => setNewReservation({...newReservation, startTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">Hora de Fin</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newReservation.endTime}
                      onChange={(e) => setNewReservation({...newReservation, endTime: e.target.value})}
                    />
                  </div>
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
                
                <div>
                  <Label htmlFor="attendees">Número de Asistentes</Label>
                  <Input
                    id="attendees"
                    type="number"
                    min="1"
                    value={newReservation.attendees}
                    onChange={(e) => setNewReservation({...newReservation, attendees: parseInt(e.target.value)})}
                  />
                </div>
                
                <Button onClick={handleCreateReservation} className="w-full">
                  Crear Reserva
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomCalendarView;
