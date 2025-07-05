
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Filter } from "lucide-react";
import { useRoomConfigs, useRoomReservations } from "@/hooks/useLocalData";

const RoomOccupancy = () => {
  const { data: roomConfigs } = useRoomConfigs();
  const { data: reservations } = useRoomReservations();
  
  const [viewType, setViewType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [filterType, setFilterType] = useState<'occupied' | 'free' | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const getFilteredRooms = () => {
    const availableRooms = roomConfigs.filter(room => room.active);
    const dateReservations = reservations.filter(r => r.date === selectedDate);
    const occupiedRoomIds = [...new Set(dateReservations.map(r => r.roomId))];

    switch (filterType) {
      case 'occupied':
        return availableRooms.filter(room => occupiedRoomIds.includes(room.id));
      case 'free':
        return availableRooms.filter(room => !occupiedRoomIds.includes(room.id));
      default:
        return availableRooms;
    }
  };

  const getRoomReservations = (roomId: string) => {
    return reservations.filter(r => r.roomId === roomId && r.date === selectedDate);
  };

  const exportToCSV = () => {
    const filteredRooms = getFilteredRooms();
    const csvData = filteredRooms.map(room => {
      const roomReservations = getRoomReservations(room.id);
      const isOccupied = roomReservations.length > 0;
      
      return {
        Sala: room.name,
        Ubicacion: room.location,
        Capacidad: room.maxCapacity,
        Estado: isOccupied ? 'Ocupada' : 'Libre',
        Reservas: roomReservations.length,
        Fecha: selectedDate
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
    link.setAttribute('download', `ocupacion-salas-${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRooms = getFilteredRooms();

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

      <div className="flex gap-4 items-end">
        <div>
          <label className="text-sm font-medium">Fecha</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
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
        
        <div>
          <label className="text-sm font-medium">Filtro</label>
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="occupied">Ocupadas</SelectItem>
              <SelectItem value="free">Libres</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => {
          const roomReservations = getRoomReservations(room.id);
          const isOccupied = roomReservations.length > 0;
          
          return (
            <Card key={room.id} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{room.name}</h4>
                    <p className="text-sm text-gray-600">{room.location}</p>
                    <p className="text-sm text-gray-600">Cap: {room.maxCapacity}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    isOccupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {isOccupied ? 'Ocupada' : 'Libre'}
                  </div>
                </div>
                
                {roomReservations.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Reservas:</p>
                    {roomReservations.map((reservation) => (
                      <div key={reservation.id} className="text-xs bg-gray-50 p-2 rounded">
                        <p className="font-medium">{reservation.startTime} - {reservation.endTime}</p>
                        <p>{reservation.purpose}</p>
                        <p className="text-gray-600">{reservation.userName}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
      
      {filteredRooms.length === 0 && (
        <Card className="p-6 text-center">
          <Filter className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No hay salas que coincidan con los filtros seleccionados</p>
        </Card>
      )}
    </div>
  );
};

export default RoomOccupancy;
