
import React from 'react';
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface TimeSelectorProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  selectedDate?: Date;
  reservations: Array<{
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    vehicleId: string;
  }>;
  selectedVehicleId?: string;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  selectedDate,
  reservations,
  selectedVehicleId
}) => {
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const isTimeConflicting = (time: string, isEndTime = false) => {
    if (!selectedDate || !selectedVehicleId) return false;

    const dateStr = selectedDate.toISOString().split('T')[0];
    
    return reservations.some(reservation => {
      if (reservation.vehicleId !== selectedVehicleId) return false;
      if (reservation.startDate !== dateStr && reservation.endDate !== dateStr) return false;
      
      const resStart = reservation.startTime;
      const resEnd = reservation.endTime;
      
      if (isEndTime) {
        // Para hora de fin, verificar que no se superponga
        return time > resStart && time < resEnd;
      } else {
        // Para hora de inicio, verificar que no se superponga
        return time >= resStart && time < resEnd;
      }
    });
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5" />
        <h4 className="text-lg font-semibold">Horario de Reserva</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startTime">Hora de inicio</Label>
          <select
            id="startTime"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
          >
            <option value="">Seleccionar hora</option>
            {timeOptions.map((time) => (
              <option 
                key={time} 
                value={time}
                disabled={isTimeConflicting(time)}
              >
                {time} {isTimeConflicting(time) ? '(Ocupado)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="endTime">Hora de fin</Label>
          <select
            id="endTime"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
            disabled={!startTime}
          >
            <option value="">Seleccionar hora</option>
            {timeOptions
              .filter(time => time > startTime)
              .map((time) => (
                <option 
                  key={time} 
                  value={time}
                  disabled={isTimeConflicting(time, true)}
                >
                  {time} {isTimeConflicting(time, true) ? '(Ocupado)' : ''}
                </option>
              ))}
          </select>
        </div>
      </div>

      {startTime && endTime && (
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">
            Duración: {startTime} - {endTime}
          </p>
        </div>
      )}
    </div>
  );
};

export default TimeSelector;
