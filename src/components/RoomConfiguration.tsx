
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
  const [showEditDialog, setShowEditDialog] = useState(false);

  const [newRoom, setNewRoom] = useState({
    name: '',
    maxCapacity: 1,
    location: '',
    active: true
  });

  const [editRoom, setEditRoom] = useState<RoomConfig | null>(null);

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

  const handleEditRoom = (room: RoomConfig) => {
    setEditRoom({ ...room });
    setShowEditDialog(true);
  };

  const handleSaveEditRoom = () => {
    if (editRoom) {
      handleUpdateRoom(editRoom);
      setShowEditDialog(false);
      setEditRoom(null);
    }
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
    if (!newResource.name.trim() || !selectedRoom) {
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

    const updatedRoom = {
      ...selectedRoom,
      resources: [...(selectedRoom.resources || []), resource]
    };

    // Actualizar la sala en la lista
    const updatedRooms = roomConfigs.map(room => 
      room.id === selectedRoom.id ? updatedRoom : room
    );
    
    updateRoomConfigs(updatedRooms);
    setSelectedRoom(updatedRoom);
    setNewResource({ name: '', quantity: 1, type: 'equipment' });
    setShowResourceDialog(false);

    toast({
      title: "Éxito",
      description: "Objeto agregado correctamente"
    });
  };

  const handleDeleteResource = (resourceId: string) => {
    if (!selectedRoom) return;

    const updatedResources = (selectedRoom.resources || []).filter(r => r.id !== resourceId);
    const updatedRoom = {
      ...selectedRoom,
      resources: updatedResources
    };

    const updatedRooms = roomConfigs.map(room => 
      room.id === selectedRoom.id ? updatedRoom : room
    );
    
    updateRoomConfigs(updatedRooms);
    setSelectedRoom(updatedRoom);

    toast({
      title: "Éxito",
      description: "Objeto eliminado correctamente"
    });
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
                        onClick={() => setSelectedRoom(room)}
                        title="Ver recursos"
                      >
                        <Package className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditRoom(room)}
                        title="Editar sala"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateRoom({...room, active: !room.active})}
                        title={room.active ? "Desactivar" : "Activar"}
                      >
                        <Lock className={`h-4 w-4 ${room.active ? 'text-green-600' : 'text-red-600'}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteRoom(room.id)}
                        title="Eliminar sala"
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
                {(selectedRoom.resources || []).map((resource) => (
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
                      onClick={() => handleDeleteResource(resource.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {(!selectedRoom.resources || selectedRoom.resources.length === 0) && (
                  <p className="text-gray-500 text-center py-4">No hay objetos configurados</p>
                )}
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

      {/* Dialog para editar sala */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Sala</DialogTitle>
          </DialogHeader>
          {editRoom && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editRoomName">Nombre de la Sala</Label>
                <Input
                  id="editRoomName"
                  value={editRoom.name}
                  onChange={(e) => setEditRoom({...editRoom, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editCapacity">Capacidad Máxima</Label>
                <Input
                  id="editCapacity"
                  type="number"
                  min="1"
                  value={editRoom.maxCapacity}
                  onChange={(e) => setEditRoom({...editRoom, maxCapacity: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="editLocation">Ubicación</Label>
                <Input
                  id="editLocation"
                  value={editRoom.location}
                  onChange={(e) => setEditRoom({...editRoom, location: e.target.value})}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveEditRoom} className="flex-1">
                  Guardar Cambios
                </Button>
                <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoomConfiguration;
