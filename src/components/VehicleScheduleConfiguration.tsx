
import React from 'react';
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

const VehicleScheduleConfiguration = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="h-6 w-6" />
        <h3 className="text-xl font-bold">Configuración de Horarios de Vehículos</h3>
      </div>

      <Card className="p-6 text-center">
        <p className="text-gray-600">Configuración de horarios para reservas de vehículos</p>
        <p className="text-sm text-gray-500 mt-2">
          Funcionalidad en desarrollo
        </p>
      </Card>
    </div>
  );
};

export default VehicleScheduleConfiguration;
