
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Car, Plus, Edit, Trash2 } from "lucide-react";
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
    capacity: 4
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const handleAddVehicle = () => {
    if (!newVehicle.brand || !newVehicle.model || !newVehicle.licensePlate || !newVehicle.type) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    const vehicle: Vehicle = {
      id: Date.now().toString(),
      name: newVehicle.name || `${newVehicle.brand} ${newVehicle.model}`,
      brand: newVehicle.brand,
      model: newVehicle.model,
      year: newVehicle.year,
      licensePlate: newVehicle.licensePlate,
      type: newVehicle.type,
      capacity: newVehicle.capacity,
      status: 'available'
    };

    updateVehicles([...vehicles, vehicle]);
    
    setNewVehicle({
      name: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      type: '',
      capacity: 4
    });

    toast({
      title: "Éxito",
      description: "Vehículo agregado correctamente"
    });
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setEditingVehicle(vehicle);
  };

  const handleUpdateVehicle = () => {
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

  const handleDeleteVehicle = (id: string) => {
    const updatedVehicles = vehicles.filter(v => v.id !== id);
    updateVehicles(updatedVehicles);
    
    toast({
      title: "Éxito",
      description: "Vehículo eliminado correctamente"
    });
  };

  const statusOptions: Array<{value: Vehicle['status'], label: string}> = [
    { value: 'available', label: 'Disponible' },
    { value: 'in_use', label: 'En Uso' },
    { value: 'maintenance', label: 'Mantenimiento' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Car className="h-6 w-6" />
        <h3 className="text-xl font-bold">Configuración de Vehículos</h3>
      </div>

      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Agregar Nuevo Vehículo</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nombre (Opcional)</Label>
            <Input
              id="name"
              value={newVehicle.name}
              onChange={(e) => setNewVehicle({...newVehicle, name: e.target.value})}
              placeholder="Nombre personalizado del vehículo"
            />
          </div>
          <div>
            <Label htmlFor="brand">Marca *</Label>
            <Input
              id="brand"
              value={newVehicle.brand}
              onChange={(e) => setNewVehicle({...newVehicle, brand: e.target.value})}
              placeholder="Toyota, Ford, etc."
            />
          </div>
          <div>
            <Label htmlFor="model">Modelo *</Label>
            <Input
              id="model"
              value={newVehicle.model}
              onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
              placeholder="Corolla, Focus, etc."
            />
          </div>
          <div>
            <Label htmlFor="year">Año</Label>
            <Input
              id="year"
              type="number"
              value={newVehicle.year}
              onChange={(e) => setNewVehicle({...newVehicle, year: parseInt(e.target.value)})}
              min="1990"
              max={new Date().getFullYear() + 1}
            />
          </div>
          <div>
            <Label htmlFor="licensePlate">Matrícula *</Label>
            <Input
              id="licensePlate"
              value={newVehicle.licensePlate}
              onChange={(e) => setNewVehicle({...newVehicle, licensePlate: e.target.value})}
              placeholder="ABC-123"
            />
          </div>
          <div>
            <Label htmlFor="type">Tipo *</Label>
            <Input
              id="type"
              value={newVehicle.type}
              onChange={(e) => setNewVehicle({...newVehicle, type: e.target.value})}
              placeholder="Sedán, SUV, Van, etc."
            />
          </div>
          <div>
            <Label htmlFor="capacity">Capacidad</Label>
            <Input
              id="capacity"
              type="number"
              value={newVehicle.capacity}
              onChange={(e) => setNewVehicle({...newVehicle, capacity: parseInt(e.target.value)})}
              min="1"
              max="50"
            />
          </div>
        </div>
        <Button onClick={handleAddVehicle} className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Vehículo
        </Button>
      </Card>

      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Vehículos Registrados</h4>
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="p-4">
            {editingId === vehicle.id ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  <span className="font-semibold">Editando Vehículo</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={editingVehicle?.name || ''}
                      onChange={(e) => setEditingVehicle(prev => 
                        prev ? {...prev, name: e.target.value} : null
                      )}
                    />
                  </div>
                  <div>
                    <Label>Marca</Label>
                    <Input
                      value={editingVehicle?.brand || ''}
                      onChange={(e) => setEditingVehicle(prev => 
                        prev ? {...prev, brand: e.target.value} : null
                      )}
                    />
                  </div>
                  <div>
                    <Label>Modelo</Label>
                    <Input
                      value={editingVehicle?.model || ''}
                      onChange={(e) => setEditingVehicle(prev => 
                        prev ? {...prev, model: e.target.value} : null
                      )}
                    />
                  </div>
                  <div>
                    <Label>Año</Label>
                    <Input
                      type="number"
                      value={editingVehicle?.year || ''}
                      onChange={(e) => setEditingVehicle(prev => 
                        prev ? {...prev, year: parseInt(e.target.value)} : null
                      )}
                    />
                  </div>
                  <div>
                    <Label>Matrícula</Label>
                    <Input
                      value={editingVehicle?.licensePlate || ''}
                      onChange={(e) => setEditingVehicle(prev => 
                        prev ? {...prev, licensePlate: e.target.value} : null
                      )}
                    />
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Input
                      value={editingVehicle?.type || ''}
                      onChange={(e) => setEditingVehicle(prev => 
                        prev ? {...prev, type: e.target.value} : null
                      )}
                    />
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <select
                      value={editingVehicle?.status || 'available'}
                      onChange={(e) => setEditingVehicle(prev => 
                        prev ? {...prev, status: e.target.value as Vehicle['status']} : null
                      )}
                      className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Capacidad</Label>
                    <Input
                      type="number"
                      value={editingVehicle?.capacity || ''}
                      onChange={(e) => setEditingVehicle(prev => 
                        prev ? {...prev, capacity: parseInt(e.target.value)} : null
                      )}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleUpdateVehicle}>
                    Actualizar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingId(null);
                      setEditingVehicle(null);
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
                    <span className="font-semibold">
                      {vehicle.name || `${vehicle.brand || ''} ${vehicle.model || ''}`}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Marca: {vehicle.brand} | Modelo: {vehicle.model}</p>
                    <p>Año: {vehicle.year} | Matrícula: {vehicle.licensePlate}</p>
                    <p>Tipo: {vehicle.type} | Capacidad: {vehicle.capacity || 'No especificada'} personas</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    vehicle.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : vehicle.status === 'in_use'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {vehicle.status === 'available' ? 'Disponible' : 
                     vehicle.status === 'in_use' ? 'En Uso' : 'Mantenimiento'}
                  </span>
                  
                  <div className="flex gap-1">
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
              </div>
            )}
          </Card>
        ))}
        
        {vehicles.length === 0 && (
          <Card className="p-8 text-center">
            <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No hay vehículos registrados</p>
            <p className="text-sm text-gray-500">Agrega el primer vehículo usando el formulario de arriba</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EnhancedVehicleConfig;
