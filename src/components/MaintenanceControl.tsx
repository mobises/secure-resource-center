
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Wrench, Plus, Calendar, Edit, Trash2 } from "lucide-react";
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
      type: 'Servidor',
      deviceType: 'Servidor',
      serialNumber: 'SRV001',
      lastMaintenance: '2024-01-01',
      nextMaintenance: '2024-04-01',
      status: 'operational',
      location: 'Sala de Servidores',
      createdBy: 'Admin IT',
      createdAt: '2024-01-01T00:00:00Z'
    }
  ]);

  const [newEquipment, setNewEquipment] = useState({
    name: '',
    type: '',
    deviceType: '',
    serialNumber: '',
    lastMaintenance: '',
    nextMaintenance: '',
    purchaseDate: '',
    location: ''
  });

  const [editingEquipment, setEditingEquipment] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const calculateYearsSincePurchase = (purchaseDate: string) => {
    if (!purchaseDate) return '0,00';
    const purchase = new Date(purchaseDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - purchase.getTime());
    const years = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return years.toFixed(2).replace('.', ',');
  };

  const handleAddEquipment = () => {
    if (!newEquipment.name || !newEquipment.type || !newEquipment.serialNumber) {
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
      status: 'operational',
      createdBy: currentUser.name,
      createdAt: new Date().toISOString()
    };

    setEquipment([...equipment, equipmentItem]);
    setNewEquipment({
      name: '',
      type: '',
      deviceType: '',
      serialNumber: '',
      lastMaintenance: '',
      nextMaintenance: '',
      purchaseDate: '',
      location: ''
    });

    toast({
      title: "Éxito",
      description: "Equipo agregado correctamente"
    });
  };

  const handleEditEquipment = (id: string) => {
    const eq = equipment.find(e => e.id === id);
    if (eq) {
      setEditingEquipment(id);
      setEditData({ ...eq });
    }
  };

  const handleSaveEdit = () => {
    setEquipment(equipment.map(eq => 
      eq.id === editingEquipment ? { ...editData } : eq
    ));
    setEditingEquipment(null);
    setEditData({});
    
    toast({
      title: "Éxito",
      description: "Equipo actualizado correctamente"
    });
  };

  const handleDeleteEquipment = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      setEquipment(equipment.filter(eq => eq.id !== id));
      toast({
        title: "Éxito",
        description: "Equipo eliminado correctamente"
      });
    }
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
                  value={newEquipment.type}
                  onChange={(e) => setNewEquipment({...newEquipment, type: e.target.value})}
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
                <Label htmlFor="purchaseDate">Fecha de Compra</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={newEquipment.purchaseDate}
                  onChange={(e) => setNewEquipment({...newEquipment, purchaseDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="lastMaintenance">Inicio de Mantenimiento</Label>
                <Input
                  id="lastMaintenance"
                  type="date"
                  value={newEquipment.lastMaintenance}
                  onChange={(e) => setNewEquipment({...newEquipment, lastMaintenance: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="nextMaintenance">Fin de Mantenimiento</Label>
                <Input
                  id="nextMaintenance"
                  type="date"
                  value={newEquipment.nextMaintenance}
                  onChange={(e) => setNewEquipment({...newEquipment, nextMaintenance: e.target.value})}
                />
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
            {editingEquipment === eq.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nombre del Equipo</Label>
                    <Input
                      value={editData.name || ''}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Input
                      value={editData.type || ''}
                      onChange={(e) => setEditData({...editData, type: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Número de Serie</Label>
                    <Input
                      value={editData.serialNumber || ''}
                      onChange={(e) => setEditData({...editData, serialNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Ubicación</Label>
                    <Input
                      value={editData.location || ''}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Fecha de Compra</Label>
                    <Input
                      type="date"
                      value={editData.purchaseDate || ''}
                      onChange={(e) => setEditData({...editData, purchaseDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit}>Guardar</Button>
                  <Button variant="outline" onClick={() => setEditingEquipment(null)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <Wrench className="h-5 w-5" />
                    <div>
                      <h5 className="font-semibold">{eq.name}</h5>
                      <p className="text-sm text-gray-600">{eq.deviceType || eq.type} - S/N: {eq.serialNumber}</p>
                      <p className="text-sm text-gray-600">Ubicación: {eq.location}</p>
                      {eq.purchaseDate && (
                        <p className="text-sm text-gray-600">
                          Años desde compra: {calculateYearsSincePurchase(eq.purchaseDate)}
                        </p>
                      )}
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditEquipment(eq.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteEquipment(eq.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="text-sm">
                    <span className="font-medium">Inicio de mantenimiento:</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {eq.lastMaintenance ? new Date(eq.lastMaintenance).toLocaleDateString() : 'No registrado'}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Fin de mantenimiento:</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {eq.nextMaintenance ? new Date(eq.nextMaintenance).toLocaleDateString() : 'No programado'}
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceControl;
