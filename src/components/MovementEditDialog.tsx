
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, X, Edit } from "lucide-react";
import { StockMovement } from "@/types";

interface MovementEditDialogProps {
  movement: StockMovement;
  editingData: StockMovement;
  onSave: () => void;
  onCancel: () => void;
  onDataChange: (data: StockMovement) => void;
}

const MovementEditDialog: React.FC<MovementEditDialogProps> = ({
  movement,
  editingData,
  onSave,
  onCancel,
  onDataChange
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Edit className="h-4 w-4" />
        <span className="font-medium">Editando movimiento</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          value={editingData.units || 0}
          onChange={(e) => onDataChange({
            ...editingData,
            units: parseInt(e.target.value) || 0
          })}
          type="number"
          placeholder="Unidades"
        />
        <Input
          value={editingData.date || ''}
          onChange={(e) => onDataChange({
            ...editingData,
            date: e.target.value
          })}
          type="date"
        />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={onSave}>
          <Save className="h-4 w-4 mr-1" />
          Guardar
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-1" />
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default MovementEditDialog;
