
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Clock, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useRoomScheduleConfig } from "@/hooks/useLocalData";
import { RoomScheduleConfig } from "@/types";

const RoomScheduleConfiguration = () => {
  const { data: scheduleConfig, updateData: updateScheduleConfig } = useRoomScheduleConfig();
  const [config, setConfig] = useState<RoomScheduleConfig[]>([]);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  useEffect(() => {
    // Inicializar configuración si no existe
    if (scheduleConfig.length === 0) {
      const initialConfig: RoomScheduleConfig[] = [];
      for (let month = 1; month <= 12; month++) {
        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
          initialConfig.push({
            month,
            dayOfWeek,
            startTime: '09:00',
            endTime: '18:00',
            enabled: true
          });
        }
      }
      setConfig(initialConfig);
    } else {
      setConfig(scheduleConfig);
    }
  }, [scheduleConfig]);

  const handleTimeChange = (month: number, dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => {
    const newConfig = config.map(item => {
      if (item.month === month && item.dayOfWeek === dayOfWeek) {
        const updatedItem = { ...item, [field]: value };
        // Si ambos tiempos son 00:00, deshabilitar
        if (updatedItem.startTime === '00:00' && updatedItem.endTime === '00:00') {
          updatedItem.enabled = false;
        } else {
          updatedItem.enabled = true;
        }
        return updatedItem;
      }
      return item;
    });
    setConfig(newConfig);
  };

  const getConfigForCell = (month: number, dayOfWeek: number) => {
    return config.find(item => item.month === month && item.dayOfWeek === dayOfWeek) || {
      month,
      dayOfWeek,
      startTime: '09:00',
      endTime: '18:00',
      enabled: true
    };
  };

  const handleSave = () => {
    updateScheduleConfig(config);
    toast({
      title: "Éxito",
      description: "Configuración de horarios guardada correctamente"
    });
  };

  const handleSetDefaultHours = (startTime: string, endTime: string) => {
    const newConfig = config.map(item => ({
      ...item,
      startTime,
      endTime,
      enabled: !(startTime === '00:00' && endTime === '00:00')
    }));
    setConfig(newConfig);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6" />
          <h3 className="text-xl font-bold">Configuración de Horarios de Reserva</h3>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSetDefaultHours('09:00', '18:00')}>
            Horario Normal (9:00-18:00)
          </Button>
          <Button variant="outline" onClick={() => handleSetDefaultHours('00:00', '00:00')}>
            Deshabilitar Todo
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Guardar Configuración
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-50 font-semibold">Mes</th>
                {daysOfWeek.map((day, index) => (
                  <th key={index} className="border p-2 bg-gray-50 font-semibold min-w-[120px]">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {months.map((monthName, monthIndex) => (
                <tr key={monthIndex}>
                  <td className="border p-2 font-medium bg-gray-50">
                    {monthName}
                  </td>
                  {daysOfWeek.map((_, dayIndex) => {
                    const cellConfig = getConfigForCell(monthIndex + 1, dayIndex);
                    const isDisabled = !cellConfig.enabled || (cellConfig.startTime === '00:00' && cellConfig.endTime === '00:00');
                    
                    return (
                      <td key={dayIndex} className={`border p-2 ${isDisabled ? 'bg-gray-100' : ''}`}>
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs">Inicio</Label>
                            <Input
                              type="time"
                              value={cellConfig.startTime}
                              onChange={(e) => handleTimeChange(monthIndex + 1, dayIndex, 'startTime', e.target.value)}
                              className="text-xs h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Fin</Label>
                            <Input
                              type="time"
                              value={cellConfig.endTime}
                              onChange={(e) => handleTimeChange(monthIndex + 1, dayIndex, 'endTime', e.target.value)}
                              className="text-xs h-8"
                            />
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>
            <strong>Nota:</strong> Si ambas horas están en 00:00, ese día estará deshabilitado para reservas.
            Los usuarios solo podrán seleccionar horas dentro del rango configurado.
          </span>
        </div>
      </Card>
    </div>
  );
};

export default RoomScheduleConfiguration;
