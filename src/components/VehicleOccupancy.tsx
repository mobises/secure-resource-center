
import React from 'react';
import { Card } from "@/components/ui/card";
import { Car } from "lucide-react";
import { useVehicleReservations } from "@/hooks/useLocalData";

const VehicleOccupancy = () => {
  const { data: reservations } = useVehicleReservations();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Car className="h-6 w-6" />
        <h3 className="text-xl font-bold">Ocupación de Vehículos</h3>
      </div>

      <Card className="p-6 text-center">
        <p className="text-gray-600">Análisis de ocupación de vehículos</p>
        <p className="text-sm text-gray-500 mt-2">
          Total de reservas: {reservations.length}
        </p>
      </Card>
    </div>
  );
};

export default VehicleOccupancy;
