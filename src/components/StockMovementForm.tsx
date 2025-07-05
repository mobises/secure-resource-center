
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { DeviceType, StockMovement, SectionUser, Employee } from "@/types";
import EmployeeSelector from './EmployeeSelector';

interface StockMovementFormProps {
  deviceTypes: DeviceType[];
  employees: Employee[];
  currentUser: SectionUser;
  onAddMovement: (movement: StockMovement) => void;
}

const StockMovementForm: React.FC<StockMovementFormProps> = ({
  deviceTypes,
  employees,
  currentUser,
  onAddMovement
}) => {
  const [newMovement, setNewMovement] = useState({
    deviceTypeId: '',
    movementType: 'alta' as 'alta' | 'baja',
    units: 1,
    reason: '',
    date: new Date().toISOString().split('T')[0],
    recipientId: '',
    recipientName: ''
  });

  const [employeeFilter, setEmployeeFilter] = useState('');

  const handleEmployeeSelect = (employee: Employee) => {
    setNewMovement({
      ...newMovement,
      recipientId: employee.id,
      recipientName: employee.name
    });
    setEmployeeFilter('');
  };

  const handleAddMovement = () => {
    if (!newMovement.deviceTypeId || newMovement.units <= 0 || !newMovement.reason) {
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
        description: "Para bajas es obligatorio especificar destinatario",
        variant: "destructive"
      });
      return;
    }

    const selectedDevice = deviceTypes.find(d => d.id === newMovement.deviceTypeId);
    const movement: StockMovement = {
      id: Date.now().toString(),
      deviceTypeId: newMovement.deviceTypeId,
      deviceTypeName: selectedDevice?.name || '',
      deviceCategory: selectedDevice?.category || '',
      deviceSubcategory: selectedDevice?.subcategory || '',
      movementType: newMovement.movementType,
      units: newMovement.units,
      reason: newMovement.reason,
      userId: currentUser.userId,
      userName: currentUser.name,
      date: newMovement.date,
      recipientId: newMovement.movementType === 'baja' ? newMovement.recipientId : undefined,
      recipientName: newMovement.movementType === 'baja' ? newMovement.recipientName : undefined,
      createdBy: currentUser.name,
      createdById: currentUser.userId,
      createdAt: new Date().toISOString()
    };

    onAddMovement(movement);
    setNewMovement({
      deviceTypeId: '',
      movementType: 'alta',
      units: 1,
      reason: '',
      date: new Date().toISOString().split('T')[0],
      recipientId: '',
      recipientName: ''
    });

    toast({
      title: "Éxito",
      description: "Movimiento de stock registrado correctamente"
    });
  };

  return (
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
                  {device.name} ({device.category} - {device.subcategory})
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
          <Label htmlFor="reason">Motivo</Label>
          <Input
            id="reason"
            value={newMovement.reason}
            onChange={(e) => setNewMovement({...newMovement, reason: e.target.value})}
            placeholder="Motivo del movimiento"
          />
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
          <EmployeeSelector
            employees={employees}
            employeeFilter={employeeFilter}
            onEmployeeFilterChange={setEmployeeFilter}
            onEmployeeSelect={handleEmployeeSelect}
            selectedEmployeeId={newMovement.recipientId}
            selectedEmployeeName={newMovement.recipientName}
            onEmployeeIdChange={(id) => setNewMovement({...newMovement, recipientId: id})}
            onEmployeeNameChange={(name) => setNewMovement({...newMovement, recipientName: name})}
          />
        )}

        <Button onClick={handleAddMovement}>
          <Plus className="h-4 w-4 mr-2" />
          Registrar Movimiento
        </Button>
      </div>
    </Card>
  );
};

export default StockMovementForm;
