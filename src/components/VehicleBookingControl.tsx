
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Car, Plus, Calendar } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SectionUser, Vehicle, VehicleReservation } from "@/types";

interface VehicleBookingControlProps {
  currentUser: SectionUser;
  isAdmin: boolean;
}

const VehicleBookingControl: React.FC<VehicleBookingControlProps> = ({ currentUser, isAdmin }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      brand: 'Toyota',
      model: 'Corolla',
      year: 2022,
      licensePlate: 'ABC-123',
      type: 'Sedán',
      status: 'available'
    }
  ]);

  const [reservations, setReservations] = useState<VehicleReservation[]>([]);

  const [newReservation, setNewReservation] = useState({
    vehicleId: '',
    startDate: '',
    endDate: '',
    purpose: '',
    destination: '',
    driverLicense: ''
  });

  const handleAddReservation = () => {
    if (!newReservation.vehicleId || !newReservation.startDate || !newReservation.endDate) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    const reservation: VehicleReservation = {
      id: Date.now().toString(),
      userId: currentUser.id,
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

  if (!currentUser.sectionAccess.vehicles) {
    return (
      <div className="text-center py-8">
        <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No tienes acceso a esta sección</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Car className="h-6 w-6" />
        <h3 className="text-xl font-bold">Reserva de Vehículos</h3>
      </div>

      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Nueva Reserva de Vehículo</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="vehicle">Vehículo</Label>
            <select
              id="vehicle"
              value={newReservation.vehicleId}
              onChange={(e) => setNewReservation({...newReservation, vehicleId: e.target.value})}
              className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="">Seleccionar vehículo</option>
              {vehicles.filter(v => v.status === 'available').map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.brand} {vehicle.model} ({vehicle.licensePlate})
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="driverLicense">Licencia de Conducir</Label>
            <Input
              id="driverLicense"
              value={newReservation.driverLicense}
              onChange={(e) => setNewReservation({...newReservation, driverLicense: e.target.value})}
              placeholder="Número de licencia"
            />
          </div>
          <div>
            <Label htmlFor="startDate">Fecha de Inicio</Label>
            <Input
              id="startDate"
              type="date"
              value={newReservation.startDate}
              onChange={(e) => setNewReservation({...newReservation, startDate: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="endDate">Fecha de Fin</Label>
            <Input
              id="endDate"
              type="date"
              value={newReservation.endDate}
              onChange={(e) => setNewReservation({...newReservation, endDate: e.target.value})}
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
        </div>
        <Button onClick={handleAddReservation} className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Crear Reserva de Vehículo
        </Button>
      </Card>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Reservas de Vehículos</h4>
        {reservations.map((reservation) => (
          <Card key={reservation.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  <span className="font-semibold">
                    {vehicles.find(v => v.id === reservation.vehicleId)?.brand} {vehicles.find(v => v.id === reservation.vehicleId)?.model}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {reservation.startDate} - {reservation.endDate}
                  </div>
                  <p>Destino: {reservation.destination}</p>
                  <p>Propósito: {reservation.purpose}</p>
                  <p>Licencia: {reservation.driverLicense}</p>
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

export default VehicleBookingControl;
