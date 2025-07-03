
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Package, History } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { DeviceType, StockMovement, SectionUser, Employee } from "@/types";
import DeviceTypeManager from './DeviceTypeManager';
import StockMovementForm from './StockMovementForm';
import MovementLog from './MovementLog';

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

  const [showLog, setShowLog] = useState(false);
  const [editingMovement, setEditingMovement] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<StockMovement | null>(null);

  const handleAddDeviceType = (deviceType: DeviceType) => {
    setDeviceTypes([...deviceTypes, deviceType]);
  };

  const handleAddMovement = (movement: StockMovement) => {
    setStockMovements([...stockMovements, movement]);
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

  const handleCancelEdit = () => {
    setEditingMovement(null);
    setEditingData(null);
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

      <DeviceTypeManager
        deviceTypes={deviceTypes}
        onAddDeviceType={handleAddDeviceType}
        isAdmin={isAdmin}
      />

      <StockMovementForm
        deviceTypes={deviceTypes}
        employees={employees}
        currentUser={currentUser}
        onAddMovement={handleAddMovement}
      />

      {showLog && isAdmin && (
        <MovementLog
          stockMovements={stockMovements}
          editingMovement={editingMovement}
          editingData={editingData}
          currentUser={currentUser}
          onEditMovement={handleEditMovement}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
          onEditingDataChange={setEditingData}
          onGenerateDeliveryPDF={generateDeliveryPDF}
        />
      )}
    </div>
  );
};

export default StockControl;
