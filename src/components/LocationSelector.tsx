
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Calculator } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface LocationSelectorProps {
  destination: string;
  onDestinationChange: (destination: string, distance?: number) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  destination,
  onDestinationChange
}) => {
  const [showMap, setShowMap] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  
  // Ubicación base: C/Tapiceros 1 San Fernando de Henares
  const baseLocation = "C/Tapiceros 1, San Fernando de Henares, Madrid, España";

  const calculateDistance = async (destination: string) => {
    try {
      // Simulación del cálculo de distancia - en producción se usaría Google Maps API
      const randomDistance = Math.floor(Math.random() * 200) + 10; // 10-210 km
      setDistance(randomDistance);
      
      toast({
        title: "Distancia calculada",
        description: `${randomDistance} km desde ${baseLocation}`
      });
      
      onDestinationChange(destination, randomDistance);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo calcular la distancia",
        variant: "destructive"
      });
    }
  };

  const handleDestinationSubmit = () => {
    if (destination.trim()) {
      calculateDistance(destination);
    } else {
      toast({
        title: "Error",
        description: "Por favor, introduce un destino",
        variant: "destructive"
      });
    }
  };

  const openMapSelector = () => {
    setShowMap(true);
    // En una implementación real, aquí se abriría el selector de Google Maps
    toast({
      title: "Selector de ubicación",
      description: "Funcionalidad de Google Maps se integrará próximamente"
    });
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <h4 className="text-lg font-semibold">Destino y Distancia</h4>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="baseLocation">Ubicación de salida</Label>
            <Input
              id="baseLocation"
              value={baseLocation}
              readOnly
              className="bg-gray-50"
            />
          </div>

          <div>
            <Label htmlFor="destination">Destino</Label>
            <div className="flex gap-2">
              <Input
                id="destination"
                value={destination}
                onChange={(e) => onDestinationChange(e.target.value)}
                placeholder="Introduce el destino o dirección"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={openMapSelector}
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleDestinationSubmit}
            disabled={!destination.trim()}
            className="w-full"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calcular Distancia
          </Button>

          {distance && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">
                  <strong>Distancia estimada:</strong> {distance} km
                </span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Tiempo estimado: {Math.ceil(distance / 60)} horas aproximadamente
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default LocationSelector;
