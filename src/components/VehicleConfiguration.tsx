
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Edit, Save, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useVehicles } from "@/hooks/useLocalData";
import { Vehicle } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VehicleConfigurationProps {
  isAdmin: boolean;
}

const VehicleConfiguration: React.FC<VehicleConfigurationProps> = ({ isAdmin }) => {
  const { data: vehicles, updateData: updateVehicles } = useVehicles();
  const [editingVehicle, setEditingVehicle] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Vehicle>>({});

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle.id);
    setEditData({ ...vehicle });
  };

  const handleSave = () => {
    if (!editingVehicle) return;

    const updatedVehicles = vehicles.map(vehicle => {
      if (vehicle.id === editingVehicle) {
        // Ensure all required properties are present with proper types
        const updatedVehicle = {
          id: vehicle.id,
          name: editData.name || vehicle.name || `${vehicle.brand || ''} ${vehicle.model || ''}`,
          brand: editData.brand || vehicle.brand || '',
          model: editData.model || vehicle.model || '',
          year: editData.year || vehicle.year || new Date().getFullYear(),
          licensePlate: editData.licensePlate || vehicle.licensePlate || '',
          type: editData.type || vehicle.type,
          status: editData.status || vehicle.status,
          capacity: editData.capacity || vehicle.capacity || 5
        };
        return updatedVehicle;
      }
      return vehicle;
    });

    updateVehicles(updatedVehicles);
    setEditingVehicle(null);
    setEditData({});

    toast({
      title: "Éxito",
      description: "Vehículo actualizado correctamente"
    });
  };

  const handleCancel = () => {
    setEditingVehicle(null);
    setEditData({});
  };

  const handleStatusChange = (vehicleId: string, status: Vehicle['status']) => {
    const updatedVehicles = vehicles.map(vehicle => {
      if (vehicle.id === vehicleId) {
        const updatedVehicle = {
          ...vehicle,
          status,
          name: vehicle.name || `${vehicle.brand || ''} ${vehicle.model || ''}`,
          brand: vehicle.brand || '',
          model: vehicle.model || '',
          year: vehicle.year || new Date().getFullYear(),
          licensePlate: vehicle.licensePlate || '',
          type: vehicle.type,
          capacity: vehicle.capacity || 5
        };
        return updatedVehicle;
      }
      return vehicle;
    });
    
    updateVehicles(updatedVehicles);

    toast({
      title: "Éxito",
      description: "Estado del vehículo actualizado"
    });
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Solo los administradores pueden configurar vehículos</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Car className="h-6 w-6" />
        <h3 className="text-xl font-bold">Configuración de Vehículos</h3>
      </div>

      <div className="grid gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="p-4">
            {editingVehicle === vehicle.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={editData.name || ''}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Input
                      id="type"
                      value={editData.type || ''}
                      onChange={(e) => setEditData({...editData, type: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Marca</Label>
                    <Input
                      id="brand"
                      value={editData.brand || ''}
                      onChange={(e) => setEditData({...editData, brand: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Modelo</Label>
                    <Input
                      id="model"
                      value={editData.model || ''}
                      onChange={(e) => setEditData({...editData, model: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="licensePlate">Matrícula</Label>
                    <Input
                      id="licensePlate"
                      value={editData.licensePlate || ''}
                      onChange={(e) => setEditData({...editData, licensePlate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacidad</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={editData.capacity || ''}
                      onChange={(e) => setEditData({...editData, capacity: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span className="font-semibold">
                      {vehicle.name || `${vehicle.brand || ''} ${vehicle.model || ''}`}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Tipo: {vehicle.type}</p>
                    <p>Matrícula: {vehicle.licensePlate}</p>
                    <p>Capacidad: {vehicle.capacity || 'No especificada'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={vehicle.status}
                    onValueChange={(value: Vehicle['status']) => handleStatusChange(vehicle.id, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Disponible</SelectItem>
                      <SelectItem value="unavailable">No Disponible</SelectItem>
                      <SelectItem value="maintenance">Mantenimiento</SelectItem>
                      <SelectItem value="in_use">En Uso</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(vehicle)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VehicleConfiguration;
