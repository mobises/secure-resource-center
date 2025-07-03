
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Edit, FileText } from "lucide-react";
import { StockMovement, SectionUser } from "@/types";
import MovementEditDialog from './MovementEditDialog';

interface MovementLogProps {
  stockMovements: StockMovement[];
  editingMovement: string | null;
  editingData: StockMovement | null;
  currentUser: SectionUser;
  onEditMovement: (movement: StockMovement) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditingDataChange: (data: StockMovement) => void;
  onGenerateDeliveryPDF: (movement: StockMovement) => void;
}

const MovementLog: React.FC<MovementLogProps> = ({
  stockMovements,
  editingMovement,
  editingData,
  currentUser,
  onEditMovement,
  onSaveEdit,
  onCancelEdit,
  onEditingDataChange,
  onGenerateDeliveryPDF
}) => {
  return (
    <Card className="p-6">
      <h4 className="text-lg font-semibold mb-4">Log de Movimientos</h4>
      <div className="space-y-3">
        {stockMovements.map((movement) => (
          <div key={movement.id} className="border p-4 rounded-lg">
            {editingMovement === movement.id && editingData ? (
              <MovementEditDialog
                movement={movement}
                editingData={editingData}
                onSave={onSaveEdit}
                onCancel={onCancelEdit}
                onDataChange={onEditingDataChange}
              />
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
                    <Button size="sm" variant="outline" onClick={() => onEditMovement(movement)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {movement.movementType === 'baja' && movement.recipientId && (
                      <Button size="sm" variant="outline" onClick={() => onGenerateDeliveryPDF(movement)}>
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
  );
};

export default MovementLog;
