
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { FileText, Download, Search, Calendar, Settings } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface LogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  section: string;
  details: string;
  ipAddress?: string;
}

const SystemLogs = () => {
  const [logs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      userId: 'admin',
      userName: 'Admin User',
      action: 'LOGIN',
      section: 'AUTHENTICATION',
      details: 'Usuario admin inició sesión correctamente',
      ipAddress: '192.168.1.100'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      userId: 'user',
      userName: 'Regular User',
      action: 'CREATE_RESERVATION',
      section: 'ROOMS',
      details: 'Creó reserva para Sala de Conferencias',
      ipAddress: '192.168.1.101'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      userId: 'section_admin',
      userName: 'Section Admin',
      action: 'UPDATE_USER',
      section: 'USER_MANAGEMENT',
      details: 'Modificó usuario José Martínez',
      ipAddress: '192.168.1.102'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      userId: 'admin',
      userName: 'Admin User',
      action: 'CREATE_VEHICLE',
      section: 'VEHICLES',
      details: 'Agregó nuevo vehículo Nissan Altima',
      ipAddress: '192.168.1.100'
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      userId: 'user',
      userName: 'Regular User',
      action: 'LOGOUT',
      section: 'AUTHENTICATION',
      details: 'Usuario cerró sesión',
      ipAddress: '192.168.1.101'
    }
  ]);

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    searchText: '',
    section: '',
    action: ''
  });

  const [retentionDays, setRetentionDays] = useState(365);

  const filteredLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    const matchesDateRange = (!filters.startDate || logDate >= new Date(filters.startDate)) &&
                           (!filters.endDate || logDate <= new Date(filters.endDate));
    const matchesSearch = !filters.searchText || 
                         log.details.toLowerCase().includes(filters.searchText.toLowerCase()) ||
                         log.userName.toLowerCase().includes(filters.searchText.toLowerCase()) ||
                         log.action.toLowerCase().includes(filters.searchText.toLowerCase());
    const matchesSection = !filters.section || log.section === filters.section;
    const matchesAction = !filters.action || log.action === filters.action;

    return matchesDateRange && matchesSearch && matchesSection && matchesAction;
  });

  const handleExport = () => {
    const csvContent = [
      ['Fecha/Hora', 'Usuario', 'Acción', 'Sección', 'Detalles', 'IP'],
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toLocaleString('es-ES'),
        log.userName,
        log.action,
        log.section,
        log.details,
        log.ipAddress || 'N/A'
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `system_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Éxito",
      description: "Logs exportados correctamente"
    });
  };

  const uniqueSections = [...new Set(logs.map(log => log.section))];
  const uniqueActions = [...new Set(logs.map(log => log.action))];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6" />
        <h3 className="text-xl font-bold">Logs del Sistema</h3>
      </div>

      {/* Configuración de retención */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Settings className="h-5 w-5" />
          <div className="flex items-center gap-2">
            <Label htmlFor="retention">Días de retención:</Label>
            <Input
              id="retention"
              type="number"
              value={retentionDays}
              onChange={(e) => setRetentionDays(parseInt(e.target.value))}
              className="w-20"
              min="1"
              max="3650"
            />
          </div>
          <Button variant="outline" size="sm">
            Aplicar
          </Button>
        </div>
      </Card>

      {/* Filtros */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Filtros</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="startDate">Fecha inicio</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="endDate">Fecha fin</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="searchText">Buscar texto</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="searchText"
                placeholder="Buscar en logs..."
                value={filters.searchText}
                onChange={(e) => setFilters({...filters, searchText: e.target.value})}
                className="pl-8"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="section">Sección</Label>
            <select
              id="section"
              value={filters.section}
              onChange={(e) => setFilters({...filters, section: e.target.value})}
              className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="">Todas las secciones</option>
              {uniqueSections.map(section => (
                <option key={section} value={section}>{section}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="action">Acción</Label>
            <select
              id="action"
              value={filters.action}
              onChange={(e) => setFilters({...filters, action: e.target.value})}
              className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="">Todas las acciones</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleExport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Exportar Logs
            </Button>
          </div>
        </div>
      </Card>

      {/* Lista de logs */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold">
            Entradas de Log ({filteredLogs.length})
          </h4>
        </div>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No se encontraron logs con los filtros aplicados
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-3 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {new Date(log.timestamp).toLocaleString('es-ES')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        log.action === 'LOGIN' ? 'bg-green-100 text-green-800' :
                        log.action === 'LOGOUT' ? 'bg-gray-100 text-gray-800' :
                        log.action.includes('CREATE') ? 'bg-blue-100 text-blue-800' :
                        log.action.includes('UPDATE') ? 'bg-yellow-100 text-yellow-800' :
                        log.action.includes('DELETE') ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {log.action}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {log.section}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>{log.userName}</strong> ({log.userId}) - {log.details}
                    </div>
                    {log.ipAddress && (
                      <div className="text-xs text-gray-500 mt-1">
                        IP: {log.ipAddress}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default SystemLogs;
