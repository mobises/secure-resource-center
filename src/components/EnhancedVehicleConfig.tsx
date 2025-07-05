
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Car, Edit } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useVehicles } from "@/hooks/useLocalData";
import { Vehicle } from "@/types";

const EnhancedVehicleConfig = () => {
  const { data: vehicles, updateData: updateVehicles } = useVehicles();

  const [newVehicle, setNewVehicle] = useState({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    type: '',
    status: 'available' as const
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const handleAddVehicle = () => {
    if (!newVehicle.name || !newVehicle.brand || !newVehicle.model || !newVehicle.licensePlate || !newVehicle.type) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const vehicle: Vehicle = {
      id: Date.now().toString(),
      name: newVehicle.name,
      type: newVehicle.type,
      status: newVehicle.status,
      brand: newVehicle.brand,
      model: newVehicle.model,
      year: newVehicle.year,
      licensePlate: newVehicle.licensePlate
    };

    const updatedVehicles = [...vehicles, vehicle];
    updateVehicles(updatedVehicles);
    setNewVehicle({
      name: '',
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
    setEditingVehicle(vehicle);
  };

  const handleSaveEdit = () => {
    if (!editingVehicle) return;

    const updatedVehicles = vehicles.map(v => 
      v.id === editingId ? editingVehicle : v
    );
    updateVehicles(updatedVehicles);
    setEditingId(null);
    setEditingVehicle(null);
    toast({
      title: "Éxito",
      description: "Vehículo actualizado correctamente"
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingVehicle(null);
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
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={newVehicle.name}
              onChange={(e) => setNewVehicle({...newVehicle, name: e.target.value})}
              placeholder="Nombre del vehículo"
            />
          </div>
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
            <Label htmlFor="licensePlate">Placa</Label>
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
        </div>
        <Button onClick={handleAddVehicle} className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Vehículo
        </Button>
      </Card>

      {/* Lista de vehículos */}
      <div className="grid gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="p-4">
            {editingId === vehicle.id && editingVehicle ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={editingVehicle.name || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Marca</Label>
                    <Input
                      value={editingVehicle.brand || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, brand: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Modelo</Label>
                    <Input
                      value={editingVehicle.model || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, model: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Año</Label>
                    <Input
                      type="number"
                      value={editingVehicle.year || new Date().getFullYear()}
                      onChange={(e) => setEditingVehicle({...editingVehicle, year: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Placa</Label>
                    <Input
                      value={editingVehicle.licensePlate || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, licensePlate: e.target.value.toUpperCase()})}
                    />
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Input
                      value={editingVehicle.type || ''}
                      onChange={(e) => setEditingVehicle({...editingVehicle, type: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit}>Guardar</Button>
                  <Button variant="outline" onClick={handleCancelEdit}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                  <div>
                    <p className="font-semibold">{vehicle.name || `${vehicle.brand || ''} ${vehicle.model || ''}`}</p>
                    <p className="text-sm text-gray-600">{vehicle.year}</p>
                  </div>
                  <div>
                    <p className="font-medium">{vehicle.licensePlate}</p>
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
                       vehicle.status === 'maintenance' ? 'Mantenimiento' : 'En Uso'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditVehicle(vehicle)}
                  >
                    <Edit className="h-4 w-4" />
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

export default EnhancedVehicleConfig;
