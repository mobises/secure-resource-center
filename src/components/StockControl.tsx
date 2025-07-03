
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Package, Plus, History, TrendingUp, TrendingDown, FileText, Edit, Save, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { DeviceType, StockMovement, SectionUser, Employee } from "@/types";

interface StockControlProps {
  currentUser: SectionUser;
  isAdmin: boolean;
}

const StockControl: React.FC<StockControlProps> = ({ currentUser, isAdmin }) => {
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([
    { id: '1', name: 'Laptop Dell', category: 'Computadoras', subcategory: 'Portátiles' },
    { id: '2', name: 'Monitor Samsung', category: 'Periféricos', subcategory: 'Pantallas' },
    { id: '3', name: 'Teclado Logitech', category: 'Periféricos', subcategory: 'Entrada' },
    { id: '4', name: 'Mouse Inalámbrico', category: 'Periféricos', subcategory: 'Entrada' }
  ]);

  const [employees, setEmployees] = useState<Employee[]>([
    { id: 'E001', name: 'Juan Pérez', userId: 'juan.perez', department: 'IT', position: 'Técnico', active: true },
    { id: 'E002', name: 'María García', userId: 'maria.garcia', department: 'Administración', position: 'Secretaria', active: true },
    { id: 'E003', name: 'Carlos López', userId: 'carlos.lopez', department: 'Ventas', position: 'Comercial', active: true }
  ]);

  const [stockMovements, setStockMovements] = useState<StockMovement[]>([
    {
      id: '1',
      deviceTypeId: '1',
      deviceTypeName: 'Laptop Dell',
      deviceCategory: 'Computadoras',
      deviceSubcategory: 'Portátiles',
      movementType: 'alta',
      units: 5,
      date: '2024-01-15',
      createdBy: 'Admin IT',
      createdById: 'admin001',
      createdAt: '2024-01-15T09:00:00Z'
    }
  ]);

  const [newDeviceType, setNewDeviceType] = useState({
    name: '',
    category: '',
    subcategory: ''
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
  const [editingMovement, setEditingMovement] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<StockMovement | null>(null);
  const [employeeFilter, setEmployeeFilter] = useState('');

  const filteredEmployees = employees.filter(emp => 
    emp.active && (
      emp.name.toLowerCase().includes(employeeFilter.toLowerCase()) ||
      emp.id.toLowerCase().includes(employeeFilter.toLowerCase())
    )
  );

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

    setDeviceTypes([...deviceTypes, deviceType]);
    setNewDeviceType({ name: '', category: '', subcategory: '' });

    toast({
      title: "Éxito",
      description: "Tipo de dispositivo agregado correctamente"
    });
  };

  const handleEmployeeSelect = (employee: Employee) => {
    setNewMovement({
      ...newMovement,
      recipientId: employee.id,
      recipientName: employee.name
    });
    setEmployeeFilter('');
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
      date: newMovement.date,
      recipientId: newMovement.movementType === 'baja' ? newMovement.recipientId : undefined,
      recipientName: newMovement.movementType === 'baja' ? newMovement.recipientName : undefined,
      createdBy: currentUser.name,
      createdById: currentUser.userId,
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

  const handleEditMovement = (movement: StockMovement) => {
    setEditingMovement(movement.id);
    setEditingData({ ...movement });
  };

  const handleSaveEdit = () => {
    if (!editingData) return;

    const updatedMovements = stockMovements.map(m => 
      m.id === editingMovement 
        ? { 
            ...editingData, 
            modifiedBy: currentUser.name,
            modifiedById: currentUser.userId,
            modifiedAt: new Date().toISOString()
          }
        : m
    );

    setStockMovements(updatedMovements);
    setEditingMovement(null);
    setEditingData(null);

    toast({
      title: "Éxito",
      description: "Movimiento actualizado correctamente"
    });
  };

  const generateDeliveryPDF = (movement: StockMovement) => {
    // Simulación de generación de PDF
    const pdfContent = `
      MOBISPARTS EUROPE NV
      
      COMPROBANTE DE ENTREGA DE MATERIAL
      
      Fecha: ${new Date(movement.date).toLocaleDateString()}
      
      Dispositivo: ${movement.deviceTypeName}
      Categoría: ${movement.deviceCategory}
      Subcategoría: ${movement.deviceSubcategory}
      Cantidad: ${movement.units} unidades
      
      Entregado a:
      ID: ${movement.recipientId}
      Nombre: ${movement.recipientName}
      
      Entregado por:
      ID: ${movement.createdById}
      Nombre: ${movement.createdBy}
      
      Fecha de entrega: ${new Date().toLocaleDateString()}
      
      ________________________________
      Firma del receptor
    `;

    console.log('Generando PDF:', pdfContent);
    toast({
      title: "PDF Generado",
      description: "Comprobante de entrega generado correctamente"
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
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              value={newMovement.date}
              onChange={(e) => setNewMovement({...newMovement, date: e.target.value})}
            />
          </div>

          {newMovement.movementType === 'baja' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="employeeFilter">Buscar Empleado</Label>
                <Input
                  id="employeeFilter"
                  value={employeeFilter}
                  onChange={(e) => setEmployeeFilter(e.target.value)}
                  placeholder="Buscar por nombre o ID..."
                />
                {employeeFilter && filteredEmployees.length > 0 && (
                  <div className="mt-2 border rounded-md max-h-40 overflow-y-auto">
                    {filteredEmployees.map(employee => (
                      <div
                        key={employee.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleEmployeeSelect(employee)}
                      >
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-gray-600">ID: {employee.id} - {employee.department}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipientId">ID del Destinatario</Label>
                  <Input
                    id="recipientId"
                    value={newMovement.recipientId}
                    onChange={(e) => setNewMovement({...newMovement, recipientId: e.target.value})}
                    placeholder="ID del empleado"
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="recipientName">Nombre del Destinatario</Label>
                  <Input
                    id="recipientName"
                    value={newMovement.recipientName}
                    onChange={(e) => setNewMovement({...newMovement, recipientName: e.target.value})}
                    placeholder="Nombre completo"
                    readOnly
                  />
                </div>
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
                {editingMovement === movement.id ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Edit className="h-4 w-4" />
                      <span className="font-medium">Editando movimiento</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        value={editingData?.units || 0}
                        onChange={(e) => setEditingData(prev => prev ? {...prev, units: parseInt(e.target.value) || 0} : null)}
                        type="number"
                        placeholder="Unidades"
                      />
                      <Input
                        value={editingData?.date || ''}
                        onChange={(e) => setEditingData(prev => prev ? {...prev, date: e.target.value} : null)}
                        type="date"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit}>
                        <Save className="h-4 w-4 mr-1" />
                        Guardar
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditingMovement(null);
                        setEditingData(null);
                      }}>
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
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
                          {movement.deviceCategory} - {movement.deviceSubcategory}
                        </p>
                        <p className="text-sm text-gray-600">
                          {movement.movementType === 'alta' ? 'Alta' : 'Baja'} de {movement.units} unidades
                        </p>
                        {movement.recipientName && (
                          <p className="text-sm text-gray-600">
                            Entregado a: {movement.recipientName} (ID: {movement.recipientId})
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          Registrado por: {movement.createdBy} (ID: {movement.createdById})
                        </p>
                        {movement.modifiedBy && (
                          <p className="text-sm text-gray-500">
                            Modificado por: {movement.modifiedBy} (ID: {movement.modifiedById})
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-right text-sm text-gray-500">
                        <p>{new Date(movement.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => handleEditMovement(movement)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {movement.movementType === 'baja' && movement.recipientId && (
                          <Button size="sm" variant="outline" onClick={() => generateDeliveryPDF(movement)}>
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default StockControl;
