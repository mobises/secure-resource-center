
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Wrench, Plus, Calendar, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { MaintenanceEquipment, SectionUser } from "@/types";

interface MaintenanceControlProps {
  currentUser: SectionUser;
  isAdmin: boolean;
}

const MaintenanceControl: React.FC<MaintenanceControlProps> = ({ currentUser, isAdmin }) => {
  const [equipment, setEquipment] = useState<MaintenanceEquipment[]>([
    {
      id: '1',
      name: 'Servidor Principal',
      deviceType: 'Servidor',
      serialNumber: 'SRV001',
      lastMaintenance: '2024-01-01',
      nextMaintenance: '2024-04-01',
      status: 'operativo',
      location: 'Sala de Servidores',
      createdBy: 'Admin IT',
      createdAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const [newEquipment, setNewEquipment] = useState({
    name: '',
    deviceType: '',
    serialNumber: '',
    lastMaintenance: '',
    nextMaintenance: '',
    status: 'operativo' as 'operativo' | 'mantenimiento' | 'averiado',
    location: ''
  });

  const handleAddEquipment = () => {
    if (!newEquipment.name || !newEquipment.deviceType || !newEquipment.serialNumber) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    const equipmentItem: MaintenanceEquipment = {
      id: Date.now().toString(),
      ...newEquipment,
      createdBy: currentUser.name,
      createdAt: new Date().toISOString()
    };

    setEquipment([...equipment, equipmentItem]);
    setNewEquipment({
      name: '',
      deviceType: '',
      serialNumber: '',
      lastMaintenance: '',
      nextMaintenance: '',
      status: 'operativo',
      location: ''
    });

    toast({
      title: "Éxito",
      description: "Equipo agregado correctamente"
    });
  };

  const updateEquipmentStatus = (id: string, status: 'operativo' | 'mantenimiento' | 'averiado') => {
    setEquipment(equipment.map(eq => 
      eq.id === id ? { ...eq, status } : eq
    ));
    
    toast({
      title: "Éxito",
      description: "Estado del equipo actualizado"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operativo': return 'bg-green-100 text-green-800';
      case 'mantenimiento': return 'bg-yellow-100 text-yellow-800';
      case 'averiado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isMaintenanceDue = (nextMaintenance: string) => {
    if (!nextMaintenance) return false;
    const today = new Date();
    const maintenanceDate = new Date(nextMaintenance);
    const diffDays = Math.ceil((maintenanceDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diffDays <= 7;
  };

  if (!currentUser.sectionAccess.maintenance) {
    return (
      <div className="text-center py-8">
        <Wrench className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No tienes acceso a esta sección</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Wrench className="h-6 w-6" />
        <h3 className="text-xl font-bold">Mantenimiento de Equipos</h3>
      </div>

      {isAdmin && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Agregar Nuevo Equipo</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="equipmentName">Nombre del Equipo</Label>
                <Input
                  id="equipmentName"
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                  placeholder="Ej: Servidor Principal"
                />
              </div>
              <div>
                <Label htmlFor="equipmentType">Tipo de Dispositivo</Label>
                <Input
                  id="equipmentType"
                  value={newEquipment.deviceType}
                  onChange={(e) => setNewEquipment({...newEquipment, deviceType: e.target.value})}
                  placeholder="Ej: Servidor, Router, Switch"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serialNumber">Número de Serie</Label>
                <Input
                  id="serialNumber"
                  value={newEquipment.serialNumber}
                  onChange={(e) => setNewEquipment({...newEquipment, serialNumber: e.target.value})}
                  placeholder="Número de serie"
                />
              </div>
              <div>
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={newEquipment.location}
                  onChange={(e) => setNewEquipment({...newEquipment, location: e.target.value})}
                  placeholder="Ubicación del equipo"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="lastMaintenance">Último Mantenimiento</Label>
                <Input
                  id="lastMaintenance"
                  type="date"
                  value={newEquipment.lastMaintenance}
                  onChange={(e) => setNewEquipment({...newEquipment, lastMaintenance: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="nextMaintenance">Próximo Mantenimiento</Label>
                <Input
                  id="nextMaintenance"
                  type="date"
                  value={newEquipment.nextMaintenance}
                  onChange={(e) => setNewEquipment({...newEquipment, nextMaintenance: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  value={newEquipment.status}
                  onChange={(e) => setNewEquipment({...newEquipment, status: e.target.value as 'operativo' | 'mantenimiento' | 'averiado'})}
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="operativo">Operativo</option>
                  <option value="mantenimiento">En Mantenimiento</option>
                  <option value="averiado">Averiado</option>
                </select>
              </div>
            </div>

            <Button onClick={handleAddEquipment}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Equipo
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Lista de Equipos</h4>
        {equipment.map((eq) => (
          <Card key={eq.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5" />
                <div>
                  <h5 className="font-semibold">{eq.name}</h5>
                  <p className="text-sm text-gray-600">{eq.deviceType} - S/N: {eq.serialNumber}</p>
                  <p className="text-sm text-gray-600">Ubicación: {eq.location}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(eq.status)}`}>
                  {eq.status === 'operativo' ? 'Operativo' :
                   eq.status === 'mantenimiento' ? 'En Mantenimiento' : 'Averiado'}
                </span>
                {isMaintenanceDue(eq.nextMaintenance) && (
                  <div className="flex items-center gap-1 text-orange-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs">Mant. próximo</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div className="text-sm">
                <span className="font-medium">Último mantenimiento:</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {eq.lastMaintenance ? new Date(eq.lastMaintenance).toLocaleDateString() : 'No registrado'}
                </div>
              </div>
              <div className="text-sm">
                <span className="font-medium">Próximo mantenimiento:</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {eq.nextMaintenance ? new Date(eq.nextMaintenance).toLocaleDateString() : 'No programado'}
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateEquipmentStatus(eq.id, 'operativo')}
                  disabled={eq.status === 'operativo'}
                >
                  Operativo
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateEquipmentStatus(eq.id, 'mantenimiento')}
                  disabled={eq.status === 'mantenimiento'}
                >
                  Mantenimiento
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateEquipmentStatus(eq.id, 'averiado')}
                  disabled={eq.status === 'averiado'}
                >
                  Averiado
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceControl;
