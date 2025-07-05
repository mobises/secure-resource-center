
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useRoomConfigs, useRoomReservations } from "@/hooks/useLocalData";

const RoomOccupancy = () => {
  const { data: roomConfigs } = useRoomConfigs();
  const { data: reservations } = useRoomReservations();
  
  const [viewType, setViewType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [filterType, setFilterType] = useState<'occupied' | 'free' | 'all'>('all');
  const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDatesInWeek = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Lunes
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getDatesInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates = [];
    
    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const getReservationsForDate = (date: string) => {
    return reservations.filter(r => r.date === date);
  };

  const getColorForOccupancy = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (count <= 2) return 'bg-green-200';
    if (count <= 4) return 'bg-yellow-200';
    if (count <= 6) return 'bg-orange-200';
    return 'bg-red-200';
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewType === 'daily') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewType === 'weekly') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const exportToCSV = () => {
    let dates = [];
    if (viewType === 'daily') {
      dates = [currentDate];
    } else if (viewType === 'weekly') {
      dates = getDatesInWeek(currentDate);
    } else {
      dates = getDatesInMonth(currentDate);
    }

    const csvData = dates.map(date => {
      const dateStr = formatDate(date);
      const dayReservations = getReservationsForDate(dateStr);
      return {
        Fecha: dateStr,
        'Total Reservas': dayReservations.length,
        'Salas Ocupadas': [...new Set(dayReservations.map(r => r.roomId))].length
      };
    });

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ocupacion-salas-${viewType}-${formatDate(currentDate)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderDailyView = () => {
    const dateStr = formatDate(currentDate);
    const dayReservations = getReservationsForDate(dateStr);
    const occupiedRooms = [...new Set(dayReservations.map(r => r.roomId))];
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">
            {currentDate.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <p className="text-gray-600">
            {dayReservations.length} reservas - {occupiedRooms.length} salas ocupadas
          </p>
        </div>
        
        <Card className={`p-6 text-center ${getColorForOccupancy(dayReservations.length)}`}>
          <div className="text-2xl font-bold">{dayReservations.length}</div>
          <div className="text-sm text-gray-600">Reservas totales</div>
        </Card>

        <div className="grid gap-2">
          {dayReservations.map((reservation) => (
            <Card key={reservation.id} className="p-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{reservation.roomName}</p>
                  <p className="text-sm text-gray-600">
                    {reservation.startTime} - {reservation.endTime}
                  </p>
                  <p className="text-sm text-gray-600">{reservation.purpose}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {reservation.userName}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderWeeklyView = () => {
    const weekDates = getDatesInWeek(currentDate);
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">
            Semana del {weekDates[0].toLocaleDateString('es-ES')} al {weekDates[6].toLocaleDateString('es-ES')}
          </h3>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
            <div key={index} className="text-center font-semibold p-2 bg-gray-50">
              {day}
            </div>
          ))}
          {weekDates.map((date, index) => {
            const dateStr = formatDate(date);
            const dayReservations = getReservationsForDate(dateStr);
            
            return (
              <Card 
                key={index} 
                className={`p-3 min-h-[80px] ${getColorForOccupancy(dayReservations.length)}`}
              >
                <div className="text-sm font-medium mb-1">{date.getDate()}</div>
                <div className="text-center">
                  <div className="text-lg font-bold">{dayReservations.length}</div>
                  <div className="text-xs text-gray-600">reservas</div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthlyView = () => {
    const monthDates = getDatesInMonth(currentDate);
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startingDayOfWeek = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
    
    // Agregar días vacíos al inicio
    const calendarDays = Array(startingDayOfWeek).fill(null).concat(monthDates);
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold">
            {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h3>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, index) => (
            <div key={index} className="text-center font-semibold p-2 bg-gray-50">
              {day}
            </div>
          ))}
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={index} className="p-3 min-h-[60px]"></div>;
            }
            
            const dateStr = formatDate(date);
            const dayReservations = getReservationsForDate(dateStr);
            
            return (
              <Card 
                key={index} 
                className={`p-2 min-h-[60px] ${getColorForOccupancy(dayReservations.length)}`}
              >
                <div className="text-sm font-medium mb-1">{date.getDate()}</div>
                <div className="text-center">
                  <div className="text-sm font-bold">{dayReservations.length}</div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          <h3 className="text-xl font-bold">Ocupación de Salas</h3>
        </div>
        
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div>
            <label className="text-sm font-medium">Vista</label>
            <Select value={viewType} onValueChange={(value: any) => setViewType(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diario</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {viewType === 'daily' && (
            <div>
              <label className="text-sm font-medium">Fecha</label>
              <input
                type="date"
                value={formatDate(currentDate)}
                onChange={(e) => setCurrentDate(new Date(e.target.value))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => navigateDate('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-4 text-sm">
          <span className="font-medium">Leyenda de colores:</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-100 border"></div>
            <span>0 reservas</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-200 border"></div>
            <span>1-2 reservas</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-yellow-200 border"></div>
            <span>3-4 reservas</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-orange-200 border"></div>
            <span>5-6 reservas</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-200 border"></div>
            <span>7+ reservas</span>
          </div>
        </div>
      </div>

      {viewType === 'daily' && renderDailyView()}
      {viewType === 'weekly' && renderWeeklyView()}
      {viewType === 'monthly' && renderMonthlyView()}
    </div>
  );
};

export default RoomOccupancy;
