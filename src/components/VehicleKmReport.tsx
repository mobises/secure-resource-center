
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3, Car, Edit, Save, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useVehicleReservations, useVehicles } from "@/hooks/useLocalData";
import { VehicleReservation } from "@/types";

const VehicleKmReport = () => {
  const { data: reservations, updateData: updateReservations } = useVehicleReservations();
  const { data: vehicles, updateData: updateVehicles } = useVehicles();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    finalKilometers: 0,
    finalBatteryPercentage: 0,
    finalFuelPercentage: 0
  });

  // Filter reservations that need km data or are completed
  const relevantReservations = reservations.filter(r => 
    r.status === 'approved' || r.status === 'completed' || r.status === 'active'
  );

  const handleEditReservation = (reservation: VehicleReservation) => {
    setEditingId(reservation.id);
    setEditData({
      finalKilometers: reservation.finalKilometers || reservation.initialKilometers || 0,
      finalBatteryPercentage: reservation.finalBatteryPercentage || 100,
      finalFuelPercentage: reservation.finalFuelPercentage || 100
    });
  };

  const handleSaveKmData = (reservationId: string) => {
    const reservation = reservations.find(r => r.id === reservationId);
    if (!reservation) return;

    // Validate data
    if (editData.finalKilometers < (reservation.initialKilometers || 0)) {
      toast({
        title: "Error",
        description: "Los kilómetros finales no pueden ser menores que los iniciales",
        variant: "destructive"
      });
      return;
    }

    // Update reservation with final data
    const updatedReservation = {
      ...reservation,
      finalKilometers: editData.finalKilometers,
      finalBatteryPercentage: editData.finalBatteryPercentage,
      finalFuelPercentage: editData.finalFuelPercentage,
      status: 'completed' as const,
      isClosed: true
    };

    // Update vehicle with new current kilometers and fuel/battery percentage
    const vehicle = vehicles.find(v => v.id === reservation.vehicleId);
    if (vehicle) {
      const updatedVehicle = {
        ...vehicle,
        currentKilometers: editData.finalKilometers,
        batteryPercentage: vehicle.fuelType === 'electric' ? editData.finalBatteryPercentage : vehicle.batteryPercentage,
        fuelPercentage: vehicle.fuelType !== 'electric' ? editData.finalFuelPercentage : vehicle.fuelPercentage,
        status: 'available' as const
      };

      updateVehicles(vehicles.map(v => v.id === vehicle.id ? updatedVehicle : v));
    }

    // Update reservations
    updateReservations(reservations.map(r => r.id === reservationId ? updatedReservation : r));

    setEditingId(null);
    toast({
      title: "Éxito",
      description: "Datos de kilometraje actualizados correctamente"
    });
  };

  const getVehicleName = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? (vehicle.name || `${vehicle.brand} ${vehicle.model}`) : 'Vehículo desconocido';
  };

  const getVehicleFuelType = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle?.fuelType || 'gasoline';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const canEdit = (reservation: VehicleReservation) => {
    // Can edit if reservation is not closed and there's no active reservation for the same vehicle
    if (reservation.isClosed) return false;
    
    const activeReservation = reservations.find(r => 
      r.vehicleId === reservation.vehicleId && 
      r.status === 'active' && 
      r.id !== reservation.id &&
      new Date(r.startDate) > new Date(reservation.endDate)
    );
    
    return !activeReservation;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Reporte de Kilómetros</h2>
      </div>

      <div className="grid gap-4">
        {relevantReservations.map((reservation) => {
          const isEditing = editingId === reservation.id;
          const vehicleFuelType = getVehicleFuelType(reservation.vehicleId);
          const canEditReservation = canEdit(reservation);

          return (
            <Card key={reservation.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    <span>{getVehicleName(reservation.vehicleId)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      reservation.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : reservation.status === 'active'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reservation.status === 'completed' ? 'Completada' : 
                       reservation.status === 'active' ? 'Activa' : 'Aprobada'}
                    </span>
                    {canEditReservation && !isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditReservation(reservation)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Usuario</p>
                    <p className="font-medium">{reservation.userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fechas</p>
                    <p className="font-medium">
                      {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Destino</p>
                    <p className="font-medium">{reservation.destination}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Propósito</p>
                    <p className="font-medium">{reservation.purpose}</p>
                  </div>
                </div>

                {isEditing ? (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label>Kilómetros finales</Label>
                        <Input
                          type="number"
                          value={editData.finalKilometers}
                          onChange={(e) => setEditData({...editData, finalKilometers: parseInt(e.target.value)})}
                          min={reservation.initialKilometers || 0}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Km iniciales: {reservation.initialKilometers || 0}
                        </p>
                      </div>
                      
                      {vehicleFuelType === 'electric' ? (
                        <div>
                          <Label>Porcentaje de batería final</Label>
                          <Input
                            type="number"
                            value={editData.finalBatteryPercentage}
                            onChange={(e) => setEditData({...editData, finalBatteryPercentage: parseInt(e.target.value)})}
                            min="0"
                            max="100"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Batería inicial: {reservation.initialBatteryPercentage || 100}%
                          </p>
                        </div>
                      ) : (
                        <div>
                          <Label>Porcentaje de combustible final</Label>
                          <Input
                            type="number"
                            value={editData.finalFuelPercentage}
                            onChange={(e) => setEditData({...editData, finalFuelPercentage: parseInt(e.target.value)})}
                            min="0"
                            max="100"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Combustible inicial: {reservation.initialFuelPercentage || 100}%
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={() => handleSaveKmData(reservation.id)}>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar
                      </Button>
                      <Button variant="outline" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Km iniciales</p>
                        <p className="font-medium">{reservation.initialKilometers || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Km finales</p>
                        <p className="font-medium">{reservation.finalKilometers || 'Pendiente'}</p>
                      </div>
                      {vehicleFuelType === 'electric' ? (
                        <>
                          <div>
                            <p className="text-gray-600">Batería inicial</p>
                            <p className="font-medium">{reservation.initialBatteryPercentage || 100}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Batería final</p>
                            <p className="font-medium">{reservation.finalBatteryPercentage || 'Pendiente'}%</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="text-gray-600">Combustible inicial</p>
                            <p className="font-medium">{reservation.initialFuelPercentage || 100}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Combustible final</p>
                            <p className="font-medium">{reservation.finalFuelPercentage || 'Pendiente'}%</p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {reservation.finalKilometers && (
                      <div className="mt-2 p-2 bg-green-50 rounded">
                        <p className="text-sm text-green-800">
                          <strong>Distancia recorrida:</strong> {(reservation.finalKilometers - (reservation.initialKilometers || 0)).toLocaleString()} km
                        </p>
                      </div>
                    )}

                    {!canEditReservation && reservation.isClosed && (
                      <div className="mt-2 p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">
                          Esta reserva ya no se puede editar debido a reservas posteriores.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {relevantReservations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No hay reservas de vehículos para mostrar</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleKmReport;
