
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, isPast, startOfMonth, endOfMonth, eachWeekOfInterval } from "date-fns";
import { es } from "date-fns/locale";

interface CalendarViewProps {
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  onDateSelect: (startDate: Date, endDate?: Date) => void;
  reservations: Array<{
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    vehicleId: string;
  }>;
  selectedVehicleId?: string;
}

type ViewType = 'daily' | 'weekly' | 'monthly';

const CalendarView: React.FC<CalendarViewProps> = ({
  selectedStartDate,
  selectedEndDate,
  onDateSelect,
  reservations,
  selectedVehicleId
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('monthly');
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);

  const navigateDate = (direction: 'prev' | 'next') => {
    const days = viewType === 'daily' ? 1 : viewType === 'weekly' ? 7 : 30;
    setCurrentDate(prev => addDays(prev, direction === 'next' ? days : -days));
  };

  const getDateRange = () => {
    switch (viewType) {
      case 'daily':
        return [currentDate];
      case 'weekly':
        return eachDayOfInterval({
          start: startOfWeek(currentDate, { weekStartsOn: 1 }),
          end: endOfWeek(currentDate, { weekStartsOn: 1 })
        });
      case 'monthly':
        return eachDayOfInterval({
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        });
    }
  };

  const hasConflict = (date: Date) => {
    if (!selectedVehicleId) return false;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    return reservations.some(reservation => 
      reservation.vehicleId === selectedVehicleId &&
      dateStr >= reservation.startDate && 
      dateStr <= reservation.endDate
    );
  };

  const handleDateClick = (date: Date) => {
    if (isPast(date) || hasConflict(date)) return;

    if (!selectionStart) {
      setSelectionStart(date);
      onDateSelect(date);
    } else {
      const daysDiff = Math.abs((date.getTime() - selectionStart.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > 7) {
        // Máximo 7 días
        setSelectionStart(date);
        onDateSelect(date);
      } else {
        const start = date < selectionStart ? date : selectionStart;
        const end = date > selectionStart ? date : selectionStart;
        onDateSelect(start, end);
        setSelectionStart(null);
      }
    }
  };

  const isSelected = (date: Date) => {
    if (!selectedStartDate) return false;
    if (!selectedEndDate) return isSameDay(date, selectedStartDate);
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const isSelectionStart = (date: Date) => {
    return selectionStart && isSameDay(date, selectionStart);
  };

  const dates = getDateRange();

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button
            variant={viewType === 'daily' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('daily')}
          >
            Diario
          </Button>
          <Button
            variant={viewType === 'weekly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('weekly')}
          >
            Semanal
          </Button>
          <Button
            variant={viewType === 'monthly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('monthly')}
          >
            Mensual
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-semibold min-w-[200px] text-center">
            {format(currentDate, viewType === 'monthly' ? 'MMMM yyyy' : 'dd MMMM yyyy', { locale: es })}
          </span>
          <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={`grid gap-2 ${viewType === 'monthly' ? 'grid-cols-7' : viewType === 'weekly' ? 'grid-cols-7' : 'grid-cols-1'}`}>
        {viewType !== 'daily' && ['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(day => (
          <div key={day} className="p-2 text-center font-semibold text-sm text-gray-500">
            {day}
          </div>
        ))}
        
        {dates.map((date, index) => {
          const isPastDate = isPast(date) && !isToday(date);
          const hasDateConflict = hasConflict(date);
          const isDateSelected = isSelected(date);
          const isStartSelection = isSelectionStart(date);
          
          return (
            <Button
              key={index}
              variant={isDateSelected ? 'default' : 'outline'}
              className={`
                h-12 p-2 flex flex-col items-center justify-center
                ${isPastDate || hasDateConflict ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}
                ${isToday(date) ? 'ring-2 ring-blue-500' : ''}
                ${isStartSelection ? 'ring-2 ring-orange-500' : ''}
              `}
              onClick={() => handleDateClick(date)}
              disabled={isPastDate || hasDateConflict}
            >
              <span className="text-sm font-medium">
                {format(date, 'd')}
              </span>
              {hasDateConflict && (
                <div className="w-2 h-2 bg-red-500 rounded-full mt-1"></div>
              )}
            </Button>
          );
        })}
      </div>

      {selectionStart && (
        <div className="mt-4 p-3 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-orange-800">
            <Calendar className="h-4 w-4" />
            <span>Fecha de inicio seleccionada: {format(selectionStart, 'dd/MM/yyyy', { locale: es })}</span>
          </div>
          <p className="text-xs text-orange-600 mt-1">Selecciona la fecha de fin (máximo 7 días)</p>
        </div>
      )}
    </Card>
  );
};

export default CalendarView;
