
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Package, Plus, History, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { DeviceType, StockMovement, SectionUser } from "@/types";

interface StockControlProps {
  currentUser: SectionUser;
  isAdmin: boolean;
}

const StockControl: React.FC<StockControlProps> = ({ currentUser, isAdmin }) => {
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([
    { id: '1', name: 'Laptop Dell', category: 'Computadoras' },
    { id: '2', name: 'Monitor Samsung', category: 'Periféricos' },
    { id: '3', name: 'Teclado Logitech', category: 'Periféricos' },
    { id: '4', name: 'Mouse Inalámbrico', category: 'Periféricos' }
  ]);

  const [stockMovements, setStockMovements] = useState<StockMovement[]>([
    {
      id: '1',
      deviceTypeId: '1',
      deviceTypeName: 'Laptop Dell',
      movementType: 'alta',
      units: 5,
      date: '2024-01-15',
      createdBy: 'Admin IT',
      createdAt: '2024-01-15T09:00:00Z'
    }
  ]);

  const [newDeviceType, setNewDeviceType] = useState({
    name: '',
    category: ''
  });

  const [newMovement, setNewMovement] = useState({
    deviceTypeId: '',
    movementType: 'alta' as 'alta' | 'baja',
    units: 1,
    date: new Date().toISOString().split('T')[0],
    recipientId: '',
    recipientName: ''
  });

  const [showLog, setShowLog] = useState(false);

  const handleAddDeviceType = () => {
    if (!newDeviceType.name || !newDeviceType.category) {
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

    setDeviceTypes([...deviceTypes, deviceType]);
    setNewDeviceType({ name: '', category: '' });

    toast({
      title: "Éxito",
      description: "Tipo de dispositivo agregado correctamente"
    });
  };

  const handleAddMovement = () => {
    if (!newMovement.deviceTypeId || newMovement.units <= 0) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    if (newMovement.movementType === 'baja' && (!newMovement.recipientId || !newMovement.recipientName)) {
      toast({
        title: "Error",
        description: "Para bajas es obligatorio especificar ID y nombre del destinatario",
        variant: "destructive"
      });
      return;
    }

    const selectedDevice = deviceTypes.find(d => d.id === newMovement.deviceTypeId);
    const movement: StockMovement = {
      id: Date.now().toString(),
      deviceTypeId: newMovement.deviceTypeId,
      deviceTypeName: selectedDevice?.name || '',
      movementType: newMovement.movementType,
      units: newMovement.units,
      date: newMovement.date,
      recipientId: newMovement.movementType === 'baja' ? newMovement.recipientId : undefined,
      recipientName: newMovement.movementType === 'baja' ? newMovement.recipientName : undefined,
      createdBy: currentUser.name,
      createdAt: new Date().toISOString()
    };

    setStockMovements([...stockMovements, movement]);
    setNewMovement({
      deviceTypeId: '',
      movementType: 'alta',
      units: 1,
      date: new Date().toISOString().split('T')[0],
      recipientId: '',
      recipientName: ''
    });

    toast({
      title: "Éxito",
      description: "Movimiento de stock registrado correctamente"
    });
  };

  if (!currentUser.sectionAccess.stock) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No tienes acceso a esta sección</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <h3 className="text-xl font-bold">Control de Stock</h3>
        </div>
        {isAdmin && (
          <Button
            variant="outline"
            onClick={() => setShowLog(!showLog)}
          >
            <History className="h-4 w-4 mr-2" />
            {showLog ? 'Ocultar Log' : 'Ver Log'}
          </Button>
        )}
      </div>

      {isAdmin && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Agregar Tipo de Dispositivo</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          <Button onClick={handleAddDeviceType} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Tipo
          </Button>
        </Card>
      )}

      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Registrar Movimiento de Stock</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="deviceType">Tipo de Dispositivo</Label>
              <select
                id="deviceType"
                value={newMovement.deviceTypeId}
                onChange={(e) => setNewMovement({...newMovement, deviceTypeId: e.target.value})}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="">Seleccionar dispositivo</option>
                {deviceTypes.map(device => (
                  <option key={device.id} value={device.id}>
                    {device.name} ({device.category})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="movementType">Tipo de Movimiento</Label>
              <select
                id="movementType"
                value={newMovement.movementType}
                onChange={(e) => setNewMovement({...newMovement, movementType: e.target.value as 'alta' | 'baja'})}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="alta">Alta</option>
                <option value="baja">Baja</option>
              </select>
            </div>
            <div>
              <Label htmlFor="units">Unidades</Label>
              <Input
                id="units"
                type="number"
                min="1"
                value={newMovement.units}
                onChange={(e) => setNewMovement({...newMovement, units: parseInt(e.target.value) || 1})}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={newMovement.date}
              onChange={(e) => setNewMovement({...newMovement, date: e.target.value})}
            />
          </div>

          {newMovement.movementType === 'baja' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="recipientId">ID del Destinatario</Label>
                <Input
                  id="recipientId"
                  value={newMovement.recipientId}
                  onChange={(e) => setNewMovement({...newMovement, recipientId: e.target.value})}
                  placeholder="ID del empleado"
                />
              </div>
              <div>
                <Label htmlFor="recipientName">Nombre del Destinatario</Label>
                <Input
                  id="recipientName"
                  value={newMovement.recipientName}
                  onChange={(e) => setNewMovement({...newMovement, recipientName: e.target.value})}
                  placeholder="Nombre completo"
                />
              </div>
            </div>
          )}

          <Button onClick={handleAddMovement}>
            <Plus className="h-4 w-4 mr-2" />
            Registrar Movimiento
          </Button>
        </div>
      </Card>

      {showLog && isAdmin && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Log de Movimientos</h4>
          <div className="space-y-3">
            {stockMovements.map((movement) => (
              <div key={movement.id} className="border p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {movement.movementType === 'alta' ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">{movement.deviceTypeName}</p>
                      <p className="text-sm text-gray-600">
                        {movement.movementType === 'alta' ? 'Alta' : 'Baja'} de {movement.units} unidades
                      </p>
                      {movement.recipientName && (
                        <p className="text-sm text-gray-600">
                          Entregado a: {movement.recipientName} (ID: {movement.recipientId})
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{new Date(movement.date).toLocaleDateString()}</p>
                    <p>Por: {movement.createdBy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default StockControl;
