
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Upload, Trash2, Database } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { dataService } from '@/services/dataService';

const DataManager = () => {
  const [importData, setImportData] = useState('');

  const handleExportData = () => {
    try {
      const exportedData = dataService.exportAllData();
      
      // Crear y descargar archivo
      const blob = new Blob([exportedData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mobis_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Éxito",
        description: "Datos exportados correctamente"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al exportar los datos",
        variant: "destructive"
      });
    }
  };

  const handleImportData = () => {
    if (!importData.trim()) {
      toast({
        title: "Error",
        description: "Por favor, pega los datos JSON para importar",
        variant: "destructive"
      });
      return;
    }

    try {
      const success = dataService.importData(importData);
      if (success) {
        toast({
          title: "Éxito",
          description: "Datos importados correctamente"
        });
        setImportData('');
        // Recargar la página para mostrar los nuevos datos
        window.location.reload();
      } else {
        throw new Error('Error en la importación');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al importar los datos. Verifica el formato JSON.",
        variant: "destructive"
      });
    }
  };

  const handleClearAllData = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
      try {
        dataService.clearAllData();
        toast({
          title: "Éxito",
          description: "Todos los datos han sido eliminados y se han restaurado los datos por defecto"
        });
        // Recargar la página para mostrar los datos por defecto
        window.location.reload();
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al limpiar los datos",
          variant: "destructive"
        });
      }
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportData(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Database className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Gestión de Datos Locales</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exportar Datos */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Exportar Datos</h3>
          <p className="text-sm text-gray-600 mb-4">
            Descarga una copia de seguridad de todos los datos del sistema en formato JSON.
          </p>
          <Button onClick={handleExportData} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Exportar Datos
          </Button>
        </Card>

        {/* Importar Datos */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Importar Datos</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-import">Importar desde archivo</Label>
              <Input
                id="file-import"
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="json-import">O pegar JSON directamente</Label>
              <textarea
                id="json-import"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Pega aquí el JSON de los datos..."
                className="w-full h-24 px-3 py-2 border border-input bg-background rounded-md text-sm resize-none"
              />
            </div>
            <Button onClick={handleImportData} className="w-full" disabled={!importData.trim()}>
              <Upload className="h-4 w-4 mr-2" />
              Importar Datos
            </Button>
          </div>
        </Card>
      </div>

      {/* Limpiar Todos los Datos */}
      <Card className="p-6 border-red-200">
        <h3 className="text-lg font-semibold mb-4 text-red-700">Zona de Peligro</h3>
        <p className="text-sm text-gray-600 mb-4">
          Esta acción eliminará todos los datos del sistema y restaurará los datos por defecto. 
          No se puede deshacer.
        </p>
        <Button 
          onClick={handleClearAllData} 
          variant="destructive"
          className="w-full"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Limpiar Todos los Datos
        </Button>
      </Card>

      {/* Información del Sistema */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Información del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Almacenamiento:</strong> localStorage del navegador
          </div>
          <div>
            <strong>Formato:</strong> JSON
          </div>
          <div>
            <strong>Persistencia:</strong> Local al navegador
          </div>
          <div>
            <strong>Respaldo:</strong> Manual (exportar/importar)
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Los datos se almacenan localmente en tu navegador. 
            Si limpias los datos del navegador o cambias de dispositivo, perderás la información. 
            Realiza copias de seguridad regulares exportando los datos.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default DataManager;
