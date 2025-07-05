

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Car } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useVehicles } from "@/hooks/useLocalData";
import { Vehicle } from "@/types";

const EnhancedVehicleConfig = () => {
  const { data: vehicles, updateData: updateVehicles } = useVehicles();
  
  const [newVehicle, setNewVehicle] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    type: '',
    status: 'available' as Vehicle['status']
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddVehicle = () => {
    if (!newVehicle.brand || !newVehicle.model || !newVehicle.licensePlate || !newVehicle.type) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const vehicle: Vehicle = {
      id: Date.now().toString(),
      name: `${newVehicle.brand} ${newVehicle.model}`,
      type: newVehicle.type,
      status: newVehicle.status,
      brand: newVehicle.brand,
      model: newVehicle.model,
      year: newVehicle.year,
      licensePlate: newVehicle.licensePlate
    };

    updateVehicles([...vehicles, vehicle]);
    setNewVehicle({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      type: '',
      status: 'available'
    });

    toast({
      title: "Éxito",
      description: "Vehículo agregado correctamente"
    });
  };

  const handleDeleteVehicle = (id: string) => {
    updateVehicles(vehicles.filter(v => v.id !== id));
    toast({
      title: "Éxito",
      description: "Vehículo eliminado correctamente"
    });
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
  };

  const handleSaveEdit = (id: string, updatedVehicle: Partial<Vehicle>) => {
    const updated = vehicles.map(v => 
      v.id === id ? { 
        ...v, 
        ...updatedVehicle, 
        name: updatedVehicle.brand && updatedVehicle.model 
          ? `${updatedVehicle.brand} ${updatedVehicle.model}` 
          : v.name 
      } : v
    );
    updateVehicles(updated);
    setEditingId(null);
    toast({
      title: "Éxito",
      description: "Vehículo actualizado correctamente"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Car className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Configuración de Vehículos</h2>
      </div>

      {/* Formulario para agregar nuevo vehículo */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Agregar Nuevo Vehículo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="brand">Marca</Label>
            <Input
              id="brand"
              value={newVehicle.brand}
              onChange={(e) => setNewVehicle({...newVehicle, brand: e.target.value})}
              placeholder="Toyota, Ford, etc."
            />
          </div>
          <div>
            <Label htmlFor="model">Modelo</Label>
            <Input
              id="model"
              value={newVehicle.model}
              onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
              placeholder="Camry, Transit, etc."
            />
          </div>
          <div>
            <Label htmlFor="year">Año</Label>
            <Input
              id="year"
              type="number"
              value={newVehicle.year}
              onChange={(e) => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})}
              min="1900"
              max={new Date().getFullYear() + 1}
            />
          </div>
          <div>
            <Label htmlFor="licensePlate">Matrícula</Label>
            <Input
              id="licensePlate"
              value={newVehicle.licensePlate}
              onChange={(e) => setNewVehicle({...newVehicle, licensePlate: e.target.value.toUpperCase()})}
              placeholder="ABC-123"
            />
          </div>
          <div>
            <Label htmlFor="type">Tipo</Label>
            <Input
              id="type"
              value={newVehicle.type}
              onChange={(e) => setNewVehicle({...newVehicle, type: e.target.value})}
              placeholder="Sedan, SUV, Van, etc."
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAddVehicle} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Vehículo
            </Button>
          </div>
        </div>
      </Card>

      {/* Lista de vehículos */}
      <div className="grid gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="p-4">
            {editingId === vehicle.id ? (
              <VehicleEditForm
                vehicle={vehicle}
                onSave={(updatedVehicle) => handleSaveEdit(vehicle.id, updatedVehicle)}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <div className="flex justify-between items-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                  <div>
                    <p className="font-semibold">
                      {vehicle.name || `${vehicle.brand || 'N/A'} ${vehicle.model || 'N/A'}`}
                    </p>
                    <p className="text-sm text-gray-600">{vehicle.year || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-medium">{vehicle.licensePlate || 'Sin matrícula'}</p>
                    <p className="text-sm text-gray-600">{vehicle.type}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      vehicle.status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : vehicle.status === 'maintenance'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {vehicle.status === 'available' ? 'Disponible' : 
                       vehicle.status === 'maintenance' ? 'Mantenimiento' : 'En uso'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditVehicle(vehicle)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteVehicle(vehicle.id)}
                  >
                    <Trash2 className="h-4 w-4" />
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

interface VehicleEditFormProps {
  vehicle: Vehicle;
  onSave: (vehicle: Partial<Vehicle>) => void;
  onCancel: () => void;
}

const VehicleEditForm: React.FC<VehicleEditFormProps> = ({ vehicle, onSave, onCancel }) => {
  const [editData, setEditData] = useState({
    brand: vehicle.brand || '',
    model: vehicle.model || '',
    year: vehicle.year || new Date().getFullYear(),
    licensePlate: vehicle.licensePlate || '',
    type: vehicle.type,
    status: vehicle.status
  });

  const handleSave = () => {
    onSave(editData);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="edit-brand">Marca</Label>
          <Input
            id="edit-brand"
            value={editData.brand}
            onChange={(e) => setEditData({...editData, brand: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="edit-model">Modelo</Label>
          <Input
            id="edit-model"
            value={editData.model}
            onChange={(e) => setEditData({...editData, model: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="edit-year">Año</Label>
          <Input
            id="edit-year"
            type="number"
            value={editData.year}
            onChange={(e) => setEditData({...editData, year: parseInt(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="edit-licensePlate">Matrícula</Label>
          <Input
            id="edit-licensePlate"
            value={editData.licensePlate}
            onChange={(e) => setEditData({...editData, licensePlate: e.target.value.toUpperCase()})}
          />
        </div>
        <div>
          <Label htmlFor="edit-type">Tipo</Label>
          <Input
            id="edit-type"
            value={editData.type}
            onChange={(e) => setEditData({...editData, type: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="edit-status">Estado</Label>
          <select
            id="edit-status"
            value={editData.status}
            onChange={(e) => setEditData({...editData, status: e.target.value as Vehicle['status']})}
            className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
          >
            <option value="available">Disponible</option>
            <option value="maintenance">Mantenimiento</option>
            <option value="in_use">En uso</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave}>Guardar</Button>
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
      </div>
    </div>
  );
};

export default EnhancedVehicleConfig;

