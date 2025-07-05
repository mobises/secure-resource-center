import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Plus, Car, Edit, Trash2, Clock, MapPin } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Vehicle, VehicleReservation } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import CalendarView from './CalendarView';
import TimeSelector from './TimeSelector';
import LocationSelector from './LocationSelector';

// Extendemos la interface para incluir los nuevos campos
interface ExtendedVehicleReservation extends Omit<VehicleReservation, 'driverLicense'> {
  startTime: string;
  endTime: string;
  distance?: number;
}

const VehicleReservations = () => {
  const [vehicles] = useState<Vehicle[]>([
    {
      id: '1',
      brand: 'Toyota',
      model: 'Camry',
      year: 2022,
      licensePlate: 'ABC-123',
      type: 'Sedan',
      status: 'available'
    },
    {
      id: '2',
      brand: 'Ford',
      model: 'Transit',
      year: 2021,
      licensePlate: 'DEF-456',
      type: 'Van',
      status: 'available'
    }
  ]);

  const [reservations, setReservations] = useState<ExtendedVehicleReservation[]>([
    {
      id: '1',
      vehicleId: '1',
      vehicleName: 'Toyota Camry',
      userId: '1',
      userName: 'Usuario Demo',
      startDate: '2024-07-05',
      endDate: '2024-07-06',
      startTime: '09:00',
      endTime: '17:00',
      purpose: 'Viaje de negocios',
      destination: 'Madrid Centro',
      status: 'approved',
      distance: 45,
      createdAt: new Date().toISOString()
    }
  ]);

  const [newReservation, setNewReservation] = useState({
    vehicleId: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
    startTime: '',
    endTime: '',
    purpose: '',
    destination: '',
    distance: undefined as number | undefined
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingReservation, setEditingReservation] = useState<ExtendedVehicleReservation | null>(null);

  // Simular rol de usuario (en una app real vendría del contexto de autenticación)
  const [userRole] = useState<'admin' | 'user'>('admin');

  const handleDateSelect = (startDate: Date, endDate?: Date) => {
    setNewReservation({
      ...newReservation,
      startDate,
      endDate: endDate || startDate
    });
  };

  const handleDestinationChange = (destination: string, distance?: number) => {
    setNewReservation({
      ...newReservation,
      destination,
      distance
    });
  };

  const validateReservation = (reservation: any): boolean => {
    // Validar campos obligatorios
    if (!reservation.vehicleId || !reservation.startDate || !reservation.endDate || 
        !reservation.startTime || !reservation.endTime || !reservation.destination) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos obligatorios",
        variant: "destructive"
      });
      return false;
    }

    // Validar que la hora de fin sea posterior a la de inicio
    if (reservation.startTime >= reservation.endTime) {
      toast({
        title: "Error",
        description: "La hora de fin debe ser posterior a la hora de inicio",
        variant: "destructive"
      });
      return false;
    }

    // Validar conflictos de reservas
    const startDateStr = format(reservation.startDate, 'yyyy-MM-dd');
    const endDateStr = format(reservation.endDate, 'yyyy-MM-dd');
    
    const hasConflict = reservations.some(existing => {
      if (existing.id === editingId) return false; // Excluir la reserva que se está editando
      if (existing.vehicleId !== reservation.vehicleId) return false;
      
      // Verificar solapamiento de fechas
      const existingStart = existing.startDate;
      const existingEnd = existing.endDate;
      
      const datesOverlap = !(endDateStr < existingStart || startDateStr > existingEnd);
      
      if (datesOverlap) {
        // Si las fechas se solapan, verificar horarios
        if (startDateStr === existingStart || endDateStr === existingEnd) {
          const timesOverlap = !(reservation.endTime <= existing.startTime || 
                                reservation.startTime >= existing.endTime);
          return timesOverlap;
        }
        return true; // Las fechas se solapan completamente
      }
      
      return false;
    });

    if (hasConflict) {
      toast({
        title: "Error",
        description: "Ya existe una reserva para este vehículo en el horario seleccionado",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleAddReservation = () => {
    if (!validateReservation(newReservation)) return;

    const selectedVehicle = vehicles.find(v => v.id === newReservation.vehicleId);
    const reservation: ExtendedVehicleReservation = {
      id: Date.now().toString(),
      userId: '1', // Usuario actual
      userName: 'Usuario Demo',
      vehicleName: selectedVehicle ? `${selectedVehicle.brand} ${selectedVehicle.model}` : '',
      status: 'pending',
      vehicleId: newReservation.vehicleId,
      startDate: format(newReservation.startDate!, 'yyyy-MM-dd'),
      endDate: format(newReservation.endDate!, 'yyyy-MM-dd'),
      startTime: newReservation.startTime,
      endTime: newReservation.endTime,
      purpose: newReservation.purpose,
      destination: newReservation.destination,
      distance: newReservation.distance,
      createdAt: new Date().toISOString()
    };

    setReservations([...reservations, reservation]);
    setNewReservation({
      vehicleId: '',
      startDate: null,
      endDate: null,
      startTime: '',
      endTime: '',
      purpose: '',
      destination: '',
      distance: undefined
    });

    toast({
      title: "Éxito",
      description: "Reserva de vehículo creada correctamente"
    });
  };

  const handleEditReservation = (reservation: ExtendedVehicleReservation) => {
    if (userRole !== 'admin') {
      toast({
        title: "Sin permisos",
        description: "Solo los administradores pueden modificar reservas",
        variant: "destructive"
      });
      return;
    }
    
    setEditingId(reservation.id);
    setEditingReservation(reservation);
  };

  const handleUpdateReservation = () => {
    if (!editingReservation || !validateReservation({
      ...editingReservation,
      startDate: new Date(editingReservation.startDate),
      endDate: new Date(editingReservation.endDate)
    })) return;

    setReservations(reservations.map(r => 
      r.id === editingId ? editingReservation : r
    ));

    setEditingId(null);
    setEditingReservation(null);

    toast({
      title: "Éxito",
      description: "Reserva actualizada correctamente"
    });
  };

  const handleDeleteReservation = (id: string) => {
    if (userRole !== 'admin') {
      toast({
        title: "Sin permisos",
        description: "Solo los administradores pueden eliminar reservas",
        variant: "destructive"
      });
      return;
    }

    setReservations(reservations.filter(r => r.id !== id));
    toast({
      title: "Éxito",
      description: "Reserva eliminada correctamente"
    });
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})` : 'Vehículo desconocido';
  };

  const availableVehicles = vehicles.filter(v => v.status === 'available');

  const reservationsWithTimes = reservations.map(r => ({
    startDate: r.startDate,
    endDate: r.endDate,
    startTime: r.startTime,
    endTime: r.endTime,
    vehicleId: r.vehicleId
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-6 w-6" />
        <h3 className="text-xl font-semibold">Reservas de Vehículos</h3>
      </div>

      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Nueva Reserva de Vehículo</h4>
        <div className="space-y-6">
          <div>
            <Label htmlFor="vehicle">Vehículo</Label>
            <select
              id="vehicle"
              value={newReservation.vehicleId}
              onChange={(e) => setNewReservation({...newReservation, vehicleId: e.target.value})}
              className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="">Seleccionar vehículo</option>
              {availableVehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} ({vehicle.licensePlate}) - {vehicle.type}
                </option>
              ))}
            </select>
          </div>

          {newReservation.vehicleId && (
            <CalendarView
              selectedStartDate={newReservation.startDate || undefined}
              selectedEndDate={newReservation.endDate || undefined}
              onDateSelect={handleDateSelect}
              reservations={reservationsWithTimes}
              selectedVehicleId={newReservation.vehicleId}
            />
          )}

          {newReservation.startDate && newReservation.endDate && (
            <TimeSelector
              startTime={newReservation.startTime}
              endTime={newReservation.endTime}
              onStartTimeChange={(time) => setNewReservation({...newReservation, startTime: time})}
              onEndTimeChange={(time) => setNewReservation({...newReservation, endTime: time})}
              selectedDate={newReservation.startDate}
              reservations={reservationsWithTimes}
              selectedVehicleId={newReservation.vehicleId}
            />
          )}

          <LocationSelector
            destination={newReservation.destination}
            onDestinationChange={handleDestinationChange}
          />

          <div>
            <Label htmlFor="purpose">Propósito del viaje</Label>
            <Textarea
              id="purpose"
              value={newReservation.purpose}
              onChange={(e) => setNewReservation({...newReservation, purpose: e.target.value})}
              placeholder="Describe el motivo del viaje"
              rows={2}
            />
          </div>

          <Button onClick={handleAddReservation}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Reserva
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Reservas Activas</h4>
        {reservations.map((reservation) => (
          <Card key={reservation.id} className="p-4">
            {editingId === reservation.id ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  <span className="font-semibold">Editando Reserva</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Fecha de inicio</Label>
                    <Input
                      type="date"
                      value={editingReservation?.startDate}
                      onChange={(e) => setEditingReservation(prev => 
                        prev ? {...prev, startDate: e.target.value} : null
                      )}
                    />
                  </div>
                  <div>
                    <Label>Fecha de fin</Label>
                    <Input
                      type="date"
                      value={editingReservation?.endDate}
                      onChange={(e) => setEditingReservation(prev => 
                        prev ? {...prev, endDate: e.target.value} : null
                      )}
                    />
                  </div>
                  <div>
                    <Label>Hora de inicio</Label>
                    <Input
                      type="time"
                      value={editingReservation?.startTime}
                      onChange={(e) => setEditingReservation(prev => 
                        prev ? {...prev, startTime: e.target.value} : null
                      )}
                    />
                  </div>
                  <div>
                    <Label>Hora de fin</Label>
                    <Input
                      type="time"
                      value={editingReservation?.endTime}
                      onChange={(e) => setEditingReservation(prev => 
                        prev ? {...prev, endTime: e.target.value} : null
                      )}
                    />
                  </div>
                </div>

                <div>
                  <Label>Destino</Label>
                  <Input
                    value={editingReservation?.destination}
                    onChange={(e) => setEditingReservation(prev => 
                      prev ? {...prev, destination: e.target.value} : null
                    )}
                  />
                </div>

                <div>
                  <Label>Propósito</Label>
                  <Textarea
                    value={editingReservation?.purpose}
                    onChange={(e) => setEditingReservation(prev => 
                      prev ? {...prev, purpose: e.target.value} : null
                    )}
                    rows={2}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleUpdateReservation}>
                    Actualizar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingId(null);
                      setEditingReservation(null);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span className="font-semibold">{getVehicleName(reservation.vehicleId)}</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-4">
                      <span>📅 {format(new Date(reservation.startDate), 'dd/MM/yyyy', { locale: es })} - {format(new Date(reservation.endDate), 'dd/MM/yyyy', { locale: es })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{reservation.startTime} - {reservation.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{reservation.destination}</span>
                      {reservation.distance && (
                        <span className="text-blue-600">({reservation.distance} km)</span>
                      )}
                    </div>
                    <div>📝 {reservation.purpose}</div>
                  </div>
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
                  
                  {userRole === 'admin' && (
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditReservation(reservation)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteReservation(reservation.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VehicleReservations;
