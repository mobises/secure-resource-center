
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Plus, Car } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Vehicle, VehicleReservation } from "@/types";

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

  const [reservations, setReservations] = useState<VehicleReservation[]>([
    {
      id: '1',
      vehicleId: '1',
      userId: '1',
      startDate: '2024-01-16',
      endDate: '2024-01-18',
      purpose: 'Viaje de negocios',
      destination: 'Ciudad de México',
      status: 'approved',
      driverLicense: 'DL123456789'
    }
  ]);

  const [newReservation, setNewReservation] = useState({
    vehicleId: '',
    startDate: '',
    endDate: '',
    purpose: '',
    destination: '',
    driverLicense: ''
  });

  const handleAddReservation = () => {
    if (!newReservation.vehicleId || !newReservation.startDate || !newReservation.endDate || !newReservation.driverLicense) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const reservation: VehicleReservation = {
      id: Date.now().toString(),
      userId: '1', // Current user
      status: 'pending',
      ...newReservation
    };

    setReservations([...reservations, reservation]);
    setNewReservation({
      vehicleId: '',
      startDate: '',
      endDate: '',
      purpose: '',
      destination: '',
      driverLicense: ''
    });

    toast({
      title: "Éxito",
      description: "Reserva de vehículo creada correctamente"
    });
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.licensePlate})` : 'Vehículo desconocido';
  };

  const availableVehicles = vehicles.filter(v => v.status === 'available');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-6 w-6" />
        <h3 className="text-xl font-semibold">Reservas de Vehículos</h3>
      </div>

      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Nueva Reserva de Vehículo</h4>
        <div className="space-y-4">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Fecha de inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={newReservation.startDate}
                onChange={(e) => setNewReservation({...newReservation, startDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Fecha de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={newReservation.endDate}
                onChange={(e) => setNewReservation({...newReservation, endDate: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="destination">Destino</Label>
            <Input
              id="destination"
              value={newReservation.destination}
              onChange={(e) => setNewReservation({...newReservation, destination: e.target.value})}
              placeholder="Ciudad o lugar de destino"
            />
          </div>

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

          <div>
            <Label htmlFor="driverLicense">Número de Licencia de Conducir</Label>
            <Input
              id="driverLicense"
              value={newReservation.driverLicense}
              onChange={(e) => setNewReservation({...newReservation, driverLicense: e.target.value})}
              placeholder="Ingresa tu número de licencia"
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
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span className="font-semibold">{getVehicleName(reservation.vehicleId)}</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-4">
                    <span>📅 {reservation.startDate} a {reservation.endDate}</span>
                  </div>
                  <div>🎯 Destino: {reservation.destination}</div>
                  <div>📝 {reservation.purpose}</div>
                  <div>🪪 Licencia: {reservation.driverLicense}</div>
                </div>
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

export default VehicleReservations;
