
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useVehicles, useVehicleReservations } from "@/hooks/useLocalData";
import { VehicleReservation } from "@/types";
import { useAuth } from "@/hooks/useAuth";

const VehicleCalendarView = () => {
  const { user } = useAuth();
  const { data: vehicles } = useVehicles();
  const { data: reservations, updateData: updateReservations } = useVehicleReservations();
  
  const [viewType, setViewType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  
  const [newReservation, setNewReservation] = useState({
    endDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    destination: '',
    licensePlate: ''
  });

  const availableVehicles = vehicles.filter(vehicle => vehicle.status === 'available');

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDatesInWeek = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
    
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
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1);
    
    const dates = [];
    const current = new Date(startDate);
    
    while (current <= lastDay || dates.length < 35) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setSelectedVehicle('');
    setNewReservation({
      endDate: date,
      startTime: '',
      endTime: '',
      purpose: '',
      destination: '',
      licensePlate: ''
    });
    setShowReservationDialog(true);
  };

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
  };

  const handleCreateReservation = () => {
    if (!selectedVehicle || !newReservation.endDate || !newReservation.startTime || !newReservation.endTime) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    const reservation: VehicleReservation = {
      id: Date.now().toString(),
      vehicleId: selectedVehicle,
      vehicleName: vehicle?.name || `${vehicle?.brand || ''} ${vehicle?.model || ''}`,
      userId: user?.id || '1',
      userName: user?.name || 'Usuario',
      startDate: selectedDate,
      status: 'pending',
      createdAt: new Date().toISOString(),
      driverLicense: newReservation.licensePlate,
      licensePlate: newReservation.licensePlate,
      ...newReservation
    };

    updateReservations([...reservations, reservation]);
    
    setShowReservationDialog(false);
    setNewReservation({
      endDate: '',
      startTime: '',
      endTime: '',
      purpose: '',
      destination: '',
      licensePlate: ''
    });

    toast({
      title: "Éxito",
      description: "Reserva de vehículo creada correctamente"
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

  const renderDailyView = () => {
    const dateStr = formatDate(currentDate);
    const dayReservations = reservations.filter(r => 
      dateStr >= r.startDate && dateStr <= r.endDate
    );

    return (
      <Card 
        className="p-6 min-h-[400px] cursor-pointer hover:bg-blue-50"
        onClick={() => handleDateClick(dateStr)}
      >
        <div className="text-xl font-bold mb-4">{currentDate.toLocaleDateString('es-ES')}</div>
        <div className="space-y-2">
          {dayReservations.map((reservation) => (
            <div key={reservation.id} className="p-2 bg-green-100 rounded">
              <div className="font-medium">{reservation.vehicleName}</div>
              <div className="text-sm text-gray-600">{reservation.startTime} - {reservation.endTime}</div>
            </div>
          ))}
          {dayReservations.length === 0 && (
            <p className="text-gray-500">No hay reservas para este día</p>
          )}
        </div>
      </Card>
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
          const dayReservations = reservations.filter(r => 
            dateStr >= r.startDate && dateStr <= r.endDate
          );
          
          return (
            <Card 
              key={index} 
              className="p-2 min-h-[120px] cursor-pointer hover:bg-blue-50"
              onClick={() => handleDateClick(dateStr)}
            >
              <div className="text-sm font-medium mb-2">{date.getDate()}</div>
              <div className="space-y-1">
                {dayReservations.slice(0, 2).map((reservation) => (
                  <div key={reservation.id} className="text-xs bg-green-100 p-1 rounded">
                    {reservation.vehicleName}
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

  const renderMonthlyView = () => {
    const monthDates = getDatesInMonth(currentDate);
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
          <div key={index} className="text-center font-semibold p-2 bg-gray-50 text-sm">
            {day}
          </div>
        ))}
        {monthDates.map((date, index) => {
          const dateStr = formatDate(date);
          const dayReservations = reservations.filter(r => 
            dateStr >= r.startDate && dateStr <= r.endDate
          );
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          
          return (
            <Card 
              key={index} 
              className={`p-1 min-h-[80px] cursor-pointer hover:bg-blue-50 ${
                !isCurrentMonth ? 'opacity-50' : ''
              }`}
              onClick={() => handleDateClick(dateStr)}
            >
              <div className="text-xs font-medium mb-1">{date.getDate()}</div>
              <div className="space-y-1">
                {dayReservations.slice(0, 1).map((reservation) => (
                  <div key={reservation.id} className="text-xs bg-green-100 p-1 rounded truncate">
                    {reservation.vehicleName.split(' ')[0]}
                  </div>
                ))}
                {dayReservations.length > 1 && (
                  <div className="text-xs text-gray-500">+{dayReservations.length - 1}</div>
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
          <Car className="h-6 w-6" />
          <h3 className="text-xl font-bold">Calendario de Reservas de Vehículos</h3>
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
          {viewType === 'daily'
            ? currentDate.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            : viewType === 'weekly'
            ? `Semana del ${formatDate(getDatesInWeek(currentDate)[0])}`
            : currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
          }
        </h2>
        
        <Button variant="outline" onClick={() => navigateDate('next')}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {viewType === 'daily' && renderDailyView()}
      {viewType === 'weekly' && renderWeeklyView()}
      {viewType === 'monthly' && renderMonthlyView()}

      <Dialog open={showReservationDialog} onOpenChange={setShowReservationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva Reserva de Vehículo - {selectedDate}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Seleccionar Vehículo</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {availableVehicles.map((vehicle) => (
                  <Button
                    key={vehicle.id}
                    variant={selectedVehicle === vehicle.id ? 'default' : 'outline'}
                    onClick={() => handleVehicleSelect(vehicle.id)}
                    className="justify-start"
                  >
                    {vehicle.name || `${vehicle.brand || ''} ${vehicle.model || ''}`} - {vehicle.licensePlate}
                  </Button>
                ))}
              </div>
            </div>

            {selectedVehicle && (
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
                  <Label htmlFor="endDate">Fecha de Fin</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newReservation.endDate}
                    onChange={(e) => setNewReservation({...newReservation, endDate: e.target.value})}
                    min={selectedDate}
                  />
                </div>
                
                <div>
                  <Label htmlFor="licensePlate">Matrícula del Conductor</Label>
                  <Input
                    id="licensePlate"
                    value={newReservation.licensePlate}
                    onChange={(e) => setNewReservation({...newReservation, licensePlate: e.target.value})}
                    placeholder="Matrícula del conductor"
                  />
                </div>
                
                <div>
                  <Label htmlFor="destination">Destino</Label>
                  <Input
                    id="destination"
                    value={newReservation.destination}
                    onChange={(e) => setNewReservation({...newReservation, destination: e.target.value})}
                    placeholder="Destino del viaje"
                  />
                </div>
                
                <div>
                  <Label htmlFor="purpose">Propósito</Label>
                  <Input
                    id="purpose"
                    value={newReservation.purpose}
                    onChange={(e) => setNewReservation({...newReservation, purpose: e.target.value})}
                    placeholder="Motivo del viaje"
                  />
                </div>
                
                <Button onClick={handleCreateReservation} className="w-full">
                  Crear Reserva de Vehículo
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleCalendarView;
