
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Upload, Trash2, Database, Play, LogIn, Settings } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { dataService } from "@/services/dataService";
import { useAuth } from "@/hooks/useAuth";

const DataManager = () => {
  const { login } = useAuth();
  const [importData, setImportData] = useState('');
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatorCredentials, setSimulatorCredentials] = useState({
    userId: '',
    password: ''
  });

  const handleExportData = () => {
    const data = dataService.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mobis-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Éxito",
      description: "Datos exportados correctamente"
    });
  };

  const handleImportData = () => {
    if (!importData.trim()) {
      toast({
        title: "Error",
        description: "Por favor, pega los datos JSON a importar",
        variant: "destructive"
      });
      return;
    }

    const success = dataService.importData(importData);
    if (success) {
      toast({
        title: "Éxito",
        description: "Datos importados correctamente"
      });
      setImportData('');
      setShowSimulator(true);
    } else {
      toast({
        title: "Error",
        description: "Error al importar los datos. Verifica el formato JSON",
        variant: "destructive"
      });
    }
  };

  const handleClearData = () => {
    if (confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
      dataService.clearAllData();
      toast({
        title: "Éxito",
        description: "Todos los datos han sido eliminados"
      });
      window.location.reload();
    }
  };

  const handleSimulateLogin = async () => {
    if (!simulatorCredentials.userId || !simulatorCredentials.password) {
      toast({
        title: "Error",
        description: "Por favor, ingresa usuario y contraseña",
        variant: "destructive"
      });
      return;
    }

    try {
      // Intentar hacer login real con las credenciales
      const success = await login(simulatorCredentials.userId, simulatorCredentials.password);
      
      if (success) {
        toast({
          title: "Login Exitoso",
          description: "Sesión iniciada correctamente. Redirigiendo...",
        });
        
        // Recargar la página para mostrar la interfaz autenticada
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast({
          title: "Login Fallido",
          description: "Credenciales incorrectas. Verifica los datos importados.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al intentar hacer login",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Gestión de Datos Locales</h2>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Configurar Acceso
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Exportar Datos</h3>
          <p className="text-gray-600 mb-4">
            Descarga todos los datos del sistema en formato JSON.
          </p>
          <Button onClick={handleExportData} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Exportar Datos
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Importar Datos</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="importData">Datos JSON</Label>
              <Textarea
                id="importData"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Pega aquí los datos JSON a importar..."
                rows={6}
              />
            </div>
            <Button onClick={handleImportData} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Importar Datos
            </Button>
          </div>
        </Card>
      </div>

      {showSimulator && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Iniciar Sesión con Datos Importados</h3>
          <p className="text-gray-600 mb-4">
            Inicia sesión en la aplicación usando las credenciales de los datos importados.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="userId">Usuario</Label>
              <Input
                id="userId"
                value={simulatorCredentials.userId}
                onChange={(e) => setSimulatorCredentials({
                  ...simulatorCredentials,
                  userId: e.target.value
                })}
                placeholder="ID de usuario"
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={simulatorCredentials.password}
                onChange={(e) => setSimulatorCredentials({
                  ...simulatorCredentials,
                  password: e.target.value
                })}
                placeholder="Contraseña"
              />
            </div>
          </div>
          <Button onClick={handleSimulateLogin} className="w-full">
            <LogIn className="h-4 w-4 mr-2" />
            Iniciar Sesión
          </Button>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-red-600">Zona de Peligro</h3>
        <p className="text-gray-600 mb-4">
          Esta acción eliminará permanentemente todos los datos del sistema.
        </p>
        <Button variant="destructive" onClick={handleClearData} className="w-full">
          <Trash2 className="h-4 w-4 mr-2" />
          Eliminar Todos los Datos
        </Button>
      </Card>
    </div>
  );
};

export default DataManager;
