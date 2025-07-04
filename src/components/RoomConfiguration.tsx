
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Settings, Package, Lock, Calendar } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRoomConfigs } from "@/hooks/useLocalData";
import { RoomConfig, RoomResource } from "@/types";

interface RoomConfigurationProps {
  isAdmin: boolean;
}

const RoomConfiguration: React.FC<RoomConfigurationProps> = ({ isAdmin }) => {
  const { data: roomConfigs, updateData: updateRoomConfigs } = useRoomConfigs();
  const [selectedRoom, setSelectedRoom] = useState<RoomConfig | null>(null);
  const [showRoomDialog, setShowRoomDialog] = useState(false);
  const [showResourceDialog, setShowResourceDialog] = useState(false);
  const [roomResources, setRoomResources] = useState<RoomResource[]>([]);

  const [newRoom, setNewRoom] = useState({
    name: '',
    maxCapacity: 1,
    location: '',
    active: true
  });

  const [newResource, setNewResource] = useState({
    name: '',
    quantity: 1,
    type: 'equipment' as 'furniture' | 'equipment' | 'technology'
  });

  const handleAddRoom = () => {
    if (!newRoom.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la sala es requerido",
        variant: "destructive"
      });
      return;
    }

    const room: RoomConfig = {
      id: Date.now().toString(),
      ...newRoom,
      resources: []
    };

    updateRoomConfigs([...roomConfigs, room]);
    setNewRoom({ name: '', maxCapacity: 1, location: '', active: true });
    setShowRoomDialog(false);

    toast({
      title: "Éxito",
      description: "Sala agregada correctamente"
    });
  };

  const handleUpdateRoom = (updatedRoom: RoomConfig) => {
    const updated = roomConfigs.map(room => 
      room.id === updatedRoom.id ? updatedRoom : room
    );
    updateRoomConfigs(updated);
    toast({
      title: "Éxito",
      description: "Sala actualizada correctamente"
    });
  };

  const handleDeleteRoom = (roomId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta sala?')) {
      const updated = roomConfigs.filter(room => room.id !== roomId);
      updateRoomConfigs(updated);
      toast({
        title: "Éxito",
        description: "Sala eliminada correctamente"
      });
    }
  };

  const handleAddResource = () => {
    if (!newResource.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del objeto es requerido",
        variant: "destructive"
      });
      return;
    }

    const resource: RoomResource = {
      id: Date.now().toString(),
      ...newResource
    };

    setRoomResources([...roomResources, resource]);
    setNewResource({ name: '', quantity: 1, type: 'equipment' });
    setShowResourceDialog(false);

    toast({
      title: "Éxito",
      description: "Objeto agregado correctamente"
    });
  };

  const handleUpdateRoomResources = (roomId: string, resources: RoomResource[]) => {
    const updated = roomConfigs.map(room => 
      room.id === roomId ? { ...room, resources } : room
    );
    updateRoomConfigs(updated);
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No tienes permisos de administrador</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h3 className="text-xl font-bold">Configuración de Salas</h3>
        </div>
        <Dialog open={showRoomDialog} onOpenChange={setShowRoomDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Sala
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nueva Sala</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="roomName">Nombre de la Sala</Label>
                <Input
                  id="roomName"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                  placeholder="Ej: Sala de Conferencias A"
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacidad Máxima</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  value={newRoom.maxCapacity}
                  onChange={(e) => setNewRoom({...newRoom, maxCapacity: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={newRoom.location}
                  onChange={(e) => setNewRoom({...newRoom, location: e.target.value})}
                  placeholder="Ej: Piso 2, Edificio A"
                />
              </div>
              <Button onClick={handleAddRoom} className="w-full">
                Agregar Sala
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="rooms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rooms">Gestión de Salas</TabsTrigger>
          <TabsTrigger value="resources">Objetos de Salas</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomConfigs.map((room) => (
              <Card key={room.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{room.name}</h4>
                      <p className="text-sm text-gray-600">Cap: {room.maxCapacity} personas</p>
                      <p className="text-sm text-gray-600">{room.location}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedRoom(room);
                          setRoomResources(room.resources || []);
                        }}
                      >
                        <Package className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateRoom({...room, active: !room.active})}
                      >
                        <Lock className={`h-4 w-4 ${room.active ? 'text-green-600' : 'text-red-600'}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteRoom(room.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs">
                    <span className={`px-2 py-1 rounded-full ${
                      room.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {room.active ? 'Activa' : 'Bloqueada'}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Recursos: {room.resources?.length || 0}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resources">
          {selectedRoom ? (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">Objetos de {selectedRoom.name}</h4>
                <Dialog open={showResourceDialog} onOpenChange={setShowResourceDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Objeto
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Agregar Objeto a la Sala</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="resourceName">Nombre del Objeto</Label>
                        <Input
                          id="resourceName"
                          value={newResource.name}
                          onChange={(e) => setNewResource({...newResource, name: e.target.value})}
                          placeholder="Ej: Proyector, Mesa, Silla"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quantity">Cantidad</Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          value={newResource.quantity}
                          onChange={(e) => setNewResource({...newResource, quantity: parseInt(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Tipo</Label>
                        <select
                          id="type"
                          value={newResource.type}
                          onChange={(e) => setNewResource({...newResource, type: e.target.value as any})}
                          className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
                        >
                          <option value="furniture">Mobiliario</option>
                          <option value="equipment">Equipo</option>
                          <option value="technology">Tecnología</option>
                        </select>
                      </div>
                      <Button onClick={handleAddResource} className="w-full">
                        Agregar Objeto
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-3">
                {roomResources.map((resource, index) => (
                  <div key={resource.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">{resource.name}</p>
                      <p className="text-sm text-gray-600">
                        Cantidad: {resource.quantity} - Tipo: {
                          resource.type === 'furniture' ? 'Mobiliario' :
                          resource.type === 'equipment' ? 'Equipo' : 'Tecnología'
                        }
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const updated = roomResources.filter(r => r.id !== resource.id);
                        setRoomResources(updated);
                        handleUpdateRoomResources(selectedRoom.id, updated);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Selecciona una sala para gestionar sus objetos</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoomConfiguration;
