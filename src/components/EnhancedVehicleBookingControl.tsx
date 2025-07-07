import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Car, Plus, Calendar, BarChart3 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SectionUser, VehicleReservation } from "@/types";
import { useVehicles, useVehicleReservations } from "@/hooks/useLocalData";
import { useNotifications } from "@/hooks/useNotifications";
import VehicleKmReport from './VehicleKmReport';

interface EnhancedVehicleBookingControlProps {
  currentUser: SectionUser;
  isAdmin: boolean;
}

const EnhancedVehicleBookingControl: React.FC<EnhancedVehicleBookingControlProps> = ({ currentUser, isAdmin }) => {
  const { data: vehicles, updateData: updateVehicles } = useVehicles();
  const { data: reservations, updateData: updateReservations } = useVehicleReservations();
  const { addVehicleReservationNotification, markAsReadByRelatedId } = useNotifications();
  const [activeTab, setActiveTab] = useState<'reservations' | 'kmReport'>('reservations');

  const [newReservation, setNewReservation] = useState({
    vehicleId: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    destination: '',
    licensePlate: ''
  });

  const [closingReservation, setClosingReservation] = useState<{
    id: string;
    finalKilometers: number;
    finalBatteryPercentage: number;
    finalFuelPercentage: number;
  } | null>(null);

  const handleAddReservation = () => {
    if (!newReservation.vehicleId || !newReservation.startDate || !newReservation.endDate) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    const selectedVehicle = vehicles.find(v => v.id === newReservation.vehicleId);
    
    // Verificar días máximos de reserva
    if (selectedVehicle?.maxReservationDays) {
      const startDate = new Date(newReservation.startDate);
      const endDate = new Date(newReservation.endDate);
      const diffTime = endDate.getTime() - startDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      if (diffDays > selectedVehicle.maxReservationDays) {
        toast({
          title: "Error",
          description: `Este vehículo solo puede reservarse por máximo ${selectedVehicle.maxReservationDays} días`,
          variant: "destructive"
        });
        return;
      }
    }

    const reservation: VehicleReservation = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      vehicleName: selectedVehicle ? (selectedVehicle.name || `${selectedVehicle.brand || ''} ${selectedVehicle.model || ''}`) : '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      initialKilometers: selectedVehicle?.currentKilometers || 0,
      initialBatteryPercentage: selectedVehicle?.fuelType === 'electric' ? selectedVehicle.batteryPercentage : undefined,
      initialFuelPercentage: selectedVehicle?.fuelType !== 'electric' ? selectedVehicle.fuelPercentage : undefined,
      ...newReservation,
      licensePlate: newReservation.licensePlate
    };

    updateReservations([...reservations, reservation]);
    
    // Add notification for administrators
    addVehicleReservationNotification(reservation.id, reservation.vehicleName, currentUser.name);
    
    setNewReservation({
      vehicleId: '',
      startDate: '',
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

  const handleCloseReservation = (reservationId: string) => {
    if (!closingReservation) return;

    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) return;

    // Validate data
    if (closingReservation.finalKilometers < (reservation.initialKilometers || 0)) {
      toast({
        title: "Error",
        description: "Los kilómetros finales no pueden ser menores que los iniciales",
        variant: "destructive"
      });
      return;
    }

    // Update reservation
    const updatedReservation = {
      ...reservation,
      finalKilometers: closingReservation.finalKilometers,
      finalBatteryPercentage: closingReservation.finalBatteryPercentage,
      finalFuelPercentage: closingReservation.finalFuelPercentage,
      status: 'completed' as const,
      isClosed: true
    };

    // Update vehicle with new current kilometers and fuel/battery
    const vehicle = vehicles.find(v => v.id === reservation.vehicleId);
    if (vehicle) {
      const updatedVehicle = {
        ...vehicle,
        currentKilometers: closingReservation.finalKilometers,
        batteryPercentage: vehicle.fuelType === 'electric' ? closingReservation.finalBatteryPercentage : vehicle.batteryPercentage,
        fuelPercentage: vehicle.fuelType !== 'electric' ? closingReservation.finalFuelPercentage : vehicle.fuelPercentage,
        status: 'available' as const
      };

      updateVehicles(vehicles.map(v => v.id === vehicle.id ? updatedVehicle : v));
    }

    updateReservations(reservations.map(r => r.id === reservationId ? updatedReservation : r));
    
    // Mark related notifications as read
    markAsReadByRelatedId(reservationId);
    
    setClosingReservation(null);

    toast({
      title: "Éxito",
      description: "Reserva cerrada correctamente"
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

  const availableVehicles = vehicles.filter(v => v.status === 'available');
  const userReservations = reservations.filter(r => r.userId === currentUser.id);
  const pendingClosureReservations = userReservations.filter(r => 
    r.status === 'approved' && !r.isClosed && !r.finalKilometers
  );

  const getEstimatedRange = (vehicle: any) => {
    if (vehicle.fuelType === 'electric' && vehicle.batteryPercentage) {
      return Math.round((vehicle.maxKmPerTank || 500) * (vehicle.batteryPercentage / 100));
    }
    if (vehicle.fuelType !== 'electric' && vehicle.fuelPercentage) {
      return Math.round((vehicle.maxKmPerTank || 500) * (vehicle.fuelPercentage / 100));
    }
    return vehicle.maxKmPerTank || 500;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Car className="h-6 w-6" />
        <h3 className="text-xl font-bold">Gestión de Vehículos</h3>
      </div>

      {isAdmin && (
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'reservations' ? 'default' : 'outline'}
            onClick={() => setActiveTab('reservations')}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Reservas
          </Button>
          <Button
            variant={activeTab === 'kmReport' ? 'default' : 'outline'}
            onClick={() => setActiveTab('kmReport')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Reporte de Km
          </Button>
        </div>
      )}

      {activeTab === 'kmReport' && isAdmin ? (
        <VehicleKmReport />
      ) : (
        <>
          {/* Pending closure reservations alert */}
          {pendingClosureReservations.length > 0 && (
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <h4 className="font-semibold text-yellow-800 mb-2">Reservas pendientes de cierre</h4>
              <p className="text-sm text-yellow-700 mb-3">
                Tienes {pendingClosureReservations.length} reserva(s) que requieren datos de cierre.
              </p>
              {pendingClosureReservations.map(reservation => {
                const vehicle = vehicles.find(v => v.id === reservation.vehicleId);
                const isClosing = closingReservation?.id === reservation.id;
                
                return (
                  <div key={reservation.id} className="mb-4 p-3 bg-white rounded border">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-medium">{reservation.vehicleName}</p>
                        <p className="text-sm text-gray-600">
                          {reservation.startDate} - {reservation.endDate}
                        </p>
                      </div>
                      {!isClosing && (
                        <Button
                          size="sm"
                          onClick={() => setClosingReservation({
                            id: reservation.id,
                            finalKilometers: reservation.initialKilometers || 0,
                            finalBatteryPercentage: vehicle?.batteryPercentage || 100,
                            finalFuelPercentage: vehicle?.fuelPercentage || 100
                          })}
                        >
                          Cerrar Reserva
                        </Button>
                      )}
                    </div>
                    
                    {isClosing && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label>Kilómetros finales</Label>
                            <Input
                              type="number"
                              value={closingReservation.finalKilometers}
                              onChange={(e) => setClosingReservation({
                                ...closingReservation,
                                finalKilometers: parseInt(e.target.value) || 0
                              })}
                              min={reservation.initialKilometers || 0}
                            />
                            <p className="text-xs text-gray-500">
                              Km iniciales: {reservation.initialKilometers || 0}
                            </p>
                          </div>
                          
                          {vehicle?.fuelType === 'electric' ? (
                            <div>
                              <Label>Porcentaje de batería final</Label>
                              <Input
                                type="number"
                                value={closingReservation.finalBatteryPercentage}
                                onChange={(e) => setClosingReservation({
                                  ...closingReservation,
                                  finalBatteryPercentage: parseInt(e.target.value) || 0
                                })}
                                min="0"
                                max="100"
                              />
                            </div>
                          ) : (
                            <div>
                              <Label>Porcentaje de combustible final</Label>
                              <Input
                                type="number"
                                value={closingReservation.finalFuelPercentage}
                                onChange={(e) => setClosingReservation({
                                  ...closingReservation,
                                  finalFuelPercentage: parseInt(e.target.value) || 0
                                })}
                                min="0"
                                max="100"
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button onClick={() => handleCloseReservation(reservation.id)}>
                            Confirmar Cierre
                          </Button>
                          <Button variant="outline" onClick={() => setClosingReservation(null)}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </Card>
          )}

          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-4">Nueva Reserva de Vehículo</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicle">Vehículo</Label>
                <select
                  id="vehicle"
                  value={newReservation.vehicleId}
                  onChange={(e) => {
                    const selectedVehicle = vehicles.find(v => v.id === e.target.value);
                    setNewReservation({
                      ...newReservation, 
                      vehicleId: e.target.value,
                      licensePlate: selectedVehicle?.licensePlate || ''
                    });
                  }}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="">Seleccionar vehículo</option>
                  {availableVehicles.map((vehicle) => {
                    const estimatedRange = getEstimatedRange(vehicle);
                    return (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.name || `${vehicle.brand || ''} ${vehicle.model || ''}`} ({vehicle.licensePlate || 'Sin matrícula'})
                        {vehicle.maxReservationDays && ` - Máx. ${vehicle.maxReservationDays} días`}
                        {` - ${vehicle.currentKilometers || 0} km - ${estimatedRange} km disponibles`}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              {newReservation.vehicleId && (
                <div>
                  <Label>Información del vehículo</Label>
                  <div className="p-2 bg-gray-50 rounded text-sm">
                    {(() => {
                      const selectedVehicle = availableVehicles.find(v => v.id === newReservation.vehicleId);
                      if (!selectedVehicle) return null;
                      
                      return (
                        <div className="space-y-1">
                          <p><strong>Km actuales:</strong> {selectedVehicle.currentKilometers || 0}</p>
                          <p><strong>Tipo combustible:</strong> {selectedVehicle.fuelType || 'gasoline'}</p>
                          {selectedVehicle.fuelType === 'electric' ? (
                            <p><strong>Batería:</strong> {selectedVehicle.batteryPercentage || 100}% (~{getEstimatedRange(selectedVehicle)} km)</p>
                          ) : (
                            <p><strong>Combustible:</strong> {selectedVehicle.fuelPercentage || 100}% (~{getEstimatedRange(selectedVehicle)} km)</p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
              
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
                <Label htmlFor="startTime">Hora de Inicio</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newReservation.startTime}
                  onChange={(e) => setNewReservation({...newReservation, startTime: e.target.value})}
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
                <Label htmlFor="endTime">Hora de Fin</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newReservation.endTime}
                  onChange={(e) => setNewReservation({...newReservation, endTime: e.target.value})}
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
            <h4 className="text-lg font-semibold">Mis Reservas de Vehículos</h4>
            {userReservations.map((reservation) => (
              <Card key={reservation.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span className="font-semibold">
                        {reservation.vehicleName}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {reservation.startDate} - {reservation.endDate}
                      </div>
                      <p>Destino: {reservation.destination}</p>
                      <p>Propósito: {reservation.purpose}</p>
                      <p>Km iniciales: {reservation.initialKilometers || 0}</p>
                      {reservation.finalKilometers && (
                        <p>Km finales: {reservation.finalKilometers} (Recorridos: {(reservation.finalKilometers - (reservation.initialKilometers || 0)).toLocaleString()} km)</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      reservation.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : reservation.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : reservation.status === 'completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {reservation.status === 'approved' ? 'Aprobada' : 
                       reservation.status === 'pending' ? 'Pendiente' : 
                       reservation.status === 'completed' ? 'Completada' : 'Rechazada'}
                    </span>
                    {reservation.status === 'approved' && !reservation.isClosed && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        Pendiente de cierre
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EnhancedVehicleBookingControl;
