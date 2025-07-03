
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { DeviceType } from "@/types";

interface DeviceTypeManagerProps {
  deviceTypes: DeviceType[];
  onAddDeviceType: (deviceType: DeviceType) => void;
  isAdmin: boolean;
}

const DeviceTypeManager: React.FC<DeviceTypeManagerProps> = ({ 
  deviceTypes, 
  onAddDeviceType, 
  isAdmin 
}) => {
  const [newDeviceType, setNewDeviceType] = useState({
    name: '',
    category: '',
    subcategory: ''
  });

  const handleAddDeviceType = () => {
    if (!newDeviceType.name || !newDeviceType.category || !newDeviceType.subcategory) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const deviceType: DeviceType = {
      id: Date.now().toString(),
      ...newDeviceType
    };

    onAddDeviceType(deviceType);
    setNewDeviceType({ name: '', category: '', subcategory: '' });

    toast({
      title: "Éxito",
      description: "Tipo de dispositivo agregado correctamente"
    });
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="p-6">
      <h4 className="text-lg font-semibold mb-4">Agregar Tipo de Dispositivo</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="deviceName">Nombre del Dispositivo</Label>
          <Input
            id="deviceName"
            value={newDeviceType.name}
            onChange={(e) => setNewDeviceType({...newDeviceType, name: e.target.value})}
            placeholder="Ej: Laptop Dell Inspiron"
          />
        </div>
        <div>
          <Label htmlFor="deviceCategory">Categoría</Label>
          <Input
            id="deviceCategory"
            value={newDeviceType.category}
            onChange={(e) => setNewDeviceType({...newDeviceType, category: e.target.value})}
            placeholder="Ej: Computadoras"
          />
        </div>
        <div>
          <Label htmlFor="deviceSubcategory">Subcategoría</Label>
          <Input
            id="deviceSubcategory"
            value={newDeviceType.subcategory}
            onChange={(e) => setNewDeviceType({...newDeviceType, subcategory: e.target.value})}
            placeholder="Ej: Portátiles"
          />
        </div>
      </div>
      <Button onClick={handleAddDeviceType} className="mt-4">
        <Plus className="h-4 w-4 mr-2" />
        Agregar Tipo
      </Button>
    </Card>
  );
};

export default DeviceTypeManager;
