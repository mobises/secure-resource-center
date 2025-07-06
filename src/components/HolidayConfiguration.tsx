
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Plus, Trash2, Save } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useHolidays } from "@/hooks/useLocalData";
import { Holiday } from "@/types";

const HolidayConfiguration = () => {
  const { data: holidays, updateData: updateHolidays } = useHolidays();
  const [newHoliday, setNewHoliday] = useState({
    day: '',
    month: '',
    year: new Date().getFullYear().toString(),
    comment: ''
  });

  const handleAddHoliday = () => {
    if (!newHoliday.day || !newHoliday.month || !newHoliday.comment) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const holiday: Holiday = {
      id: Date.now().toString(),
      day: parseInt(newHoliday.day),
      month: parseInt(newHoliday.month),
      year: parseInt(newHoliday.year),
      comment: newHoliday.comment
    };

    updateHolidays([...holidays, holiday]);
    setNewHoliday({
      day: '',
      month: '',
      year: new Date().getFullYear().toString(),
      comment: ''
    });

    toast({
      title: "Éxito",
      description: "Día festivo agregado correctamente"
    });
  };

  const handleDeleteHoliday = (id: string) => {
    updateHolidays(holidays.filter(h => h.id !== id));
    toast({
      title: "Éxito",
      description: "Día festivo eliminado correctamente"
    });
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-6 w-6" />
        <h3 className="text-xl font-bold">Configuración de Días Festivos</h3>
      </div>

      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Agregar Nuevo Día Festivo</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="day">Día</Label>
            <Input
              id="day"
              type="number"
              min="1"
              max="31"
              value={newHoliday.day}
              onChange={(e) => setNewHoliday({...newHoliday, day: e.target.value})}
              placeholder="DD"
            />
          </div>
          <div>
            <Label htmlFor="month">Mes</Label>
            <select
              id="month"
              value={newHoliday.month}
              onChange={(e) => setNewHoliday({...newHoliday, month: e.target.value})}
              className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="">Seleccionar mes</option>
              {monthNames.map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="year">Año</Label>
            <Input
              id="year"
              type="number"
              min="2024"
              value={newHoliday.year}
              onChange={(e) => setNewHoliday({...newHoliday, year: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="comment">Descripción</Label>
            <Input
              id="comment"
              value={newHoliday.comment}
              onChange={(e) => setNewHoliday({...newHoliday, comment: e.target.value})}
              placeholder="Nombre del festivo"
            />
          </div>
        </div>
        <Button onClick={handleAddHoliday} className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Día Festivo
        </Button>
      </Card>

      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Días Festivos Configurados</h4>
        <div className="space-y-3">
          {holidays.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No hay días festivos configurados</p>
          ) : (
            holidays.map((holiday) => (
              <div key={holiday.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <span className="font-medium">
                    {holiday.day}/{holiday.month}/{holiday.year} - {holiday.comment}
                  </span>
                  <p className="text-sm text-gray-600">
                    {holiday.day} de {monthNames[holiday.month - 1]} de {holiday.year}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteHoliday(holiday.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default HolidayConfiguration;
