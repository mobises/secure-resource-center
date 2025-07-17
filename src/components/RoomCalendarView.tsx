
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, ChevronLeft, ChevronRight, Clock, Users, Settings } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRoomConfigs, useRoomReservations, useRoomScheduleConfig } from "@/hooks/useLocalData";
import { RoomReservation, RoomScheduleConfig } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RoomCalendarView = () => {
  const { data: roomConfigs } = useRoomConfigs();
  const { data: reservations, updateData: updateReservations } = useRoomReservations();
  const { data: scheduleConfig } = useRoomScheduleConfig();
  
  const [viewType, setViewType] = useState<'weekly' | 'monthly'>('weekly');
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

  const availableRooms = roomConfigs.filter(room => room.active && room.status !== 'unavailable');

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDatesInWeek = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Lunes
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getDatesInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates = [];
    
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const getAvailableTimesForDate = (date: string) => {
    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1;
    const dayOfWeek = (dateObj.getDay() + 6) % 7; // Convertir a Lunes=0, Domingo=6
    
    const config = scheduleConfig.find(c => c.month === month && c.dayOfWeek === dayOfWeek);
    if (!config || !config.enabled || (config.startTime === '00:00' && config.endTime === '00:00')) {
      return [];
    }
    
    const times = [];
    const startHour = parseInt(config.startTime.split(':')[0]);
    const endHour = parseInt(config.endTime.split(':')[0]);
    
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 15) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        if (timeStr <= config.endTime) {
          times.push(timeStr);
        }
      }
    }
    return times;
  };

  const isDayDisabled = (date: Date) => {
    const month = date.getMonth() + 1;
    const dayOfWeek = (date.getDay() + 6) % 7;
    const config = scheduleConfig.find(c => c.month === month && c.dayOfWeek === dayOfWeek);
    return !config || !config.enabled || (config.startTime === '00:00' && config.endTime === '00:00');
  };

  const handleDateClick = (date: string) => {
    if (isDayDisabled(new Date(date))) {
      toast({
        title: "Día no disponible",
        description: "No se pueden hacer reservas en este día",
        variant: "destructive"
      });
      return;
    }
    setSelectedDate(date);
    setSelectedRoom('');
    setNewReservation({
      startTime: '',
      endTime: '',
      purpose: '',
      attendees: 1
    });
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
      userId: '1',
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
    if (viewType === 'weekly') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const renderDailyView = () => {
    const dateStr = formatDate(currentDate);
    const dayReservations = reservations.filter(r => r.date === dateStr);
    const isDisabled = isDayDisabled(currentDate);
    
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">
            {currentDate.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
        </div>
        
        <Card 
          className={`p-6 min-h-[200px] cursor-pointer ${isDisabled ? 'bg-gray-100' : 'hover:bg-blue-50'}`}
          onClick={() => !isDisabled && handleDateClick(dateStr)}
        >
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{currentDate.getDate()}</div>
            {isDisabled ? (
              <div className="text-gray-500">Día no disponible</div>
            ) : (
              <div className="space-y-2">
                {dayReservations.slice(0, 3).map((reservation) => (
                  <div key={reservation.id} className="text-sm bg-blue-100 p-2 rounded">
                    <div className="font-medium">{reservation.roomName}</div>
                    <div>{reservation.startTime} - {reservation.endTime}</div>
                    <div className="text-xs text-gray-600">{reservation.purpose}</div>
                  </div>
                ))}
                {dayReservations.length > 3 && (
                  <div className="text-xs text-gray-500">+{dayReservations.length - 3} reservas más</div>
                )}
                {dayReservations.length === 0 && (
                  <div className="text-gray-500">Sin reservas</div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  const renderWeeklyView = () => {
    const weekDates = getDatesInWeek(currentDate);
    
    return (
      <div className="grid grid-cols-7 gap-2">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
          <div key={index} className="text-center font-semibold p-2 bg-gray-50">
            {day}
          </div>
        ))}
        {weekDates.map((date, index) => {
          const dateStr = formatDate(date);
          const dayReservations = reservations.filter(r => r.date === dateStr);
          const isDisabled = isDayDisabled(date);
          
          return (
            <Card 
              key={index} 
              className={`p-2 min-h-[100px] cursor-pointer ${
                isDisabled ? 'bg-gray-100' : 'hover:bg-blue-50'
              }`}
              onClick={() => !isDisabled && handleDateClick(dateStr)}
            >
              <div className="text-sm font-medium mb-2">{date.getDate()}</div>
              {isDisabled ? (
                <div className="text-xs text-gray-500">No disponible</div>
              ) : (
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
              )}
            </Card>
          );
        })}
      </div>
    );
  };

  const renderMonthlyView = () => {
    const monthDates = getDatesInMonth(currentDate);
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Convertir para que Lunes = 0
    
    const calendarDays = Array(startingDayOfWeek).fill(null).concat(monthDates);
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">
            {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h3>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
            <div key={index} className="text-center font-semibold p-2 bg-gray-50">
              {day}
            </div>
          ))}
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={index} className="p-3 min-h-[80px]"></div>;
            }
            
            const dateStr = formatDate(date);
            const dayReservations = reservations.filter(r => r.date === dateStr);
            const isDisabled = isDayDisabled(date);
            
            return (
              <Card 
                key={index} 
                className={`p-2 min-h-[80px] cursor-pointer ${
                  isDisabled ? 'bg-gray-100' : 'hover:bg-blue-50'
                }`}
                onClick={() => !isDisabled && handleDateClick(dateStr)}
              >
                <div className="text-sm font-medium mb-1">{date.getDate()}</div>
                {isDisabled ? (
                  <div className="text-xs text-gray-500">No disp.</div>
                ) : (
                  <div className="space-y-1">
                    {dayReservations.slice(0, 1).map((reservation) => (
                      <div key={reservation.id} className="text-xs bg-blue-100 p-1 rounded">
                        {reservation.startTime}
                      </div>
                    ))}
                    {dayReservations.length > 1 && (
                      <div className="text-xs text-gray-500">+{dayReservations.length - 1}</div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const availableTimes = getAvailableTimesForDate(selectedDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          <h3 className="text-xl font-bold">Calendario de Reservas</h3>
        </div>
        
        <div className="flex gap-2">
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
          {viewType === 'weekly'
            ? `Semana del ${formatDate(getDatesInWeek(currentDate)[0])}`
            : currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
          }
        </h2>
        
        <Button variant="outline" onClick={() => navigateDate('next')}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {viewType === 'weekly' && renderWeeklyView()}
      {viewType === 'monthly' && renderMonthlyView()}

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
                    <Select value={newReservation.startTime} onValueChange={(value) => setNewReservation({...newReservation, startTime: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimes.map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="endTime">Hora de Fin</Label>
                    <Select value={newReservation.endTime} onValueChange={(value) => setNewReservation({...newReservation, endTime: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimes.filter(time => time > newReservation.startTime).map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
