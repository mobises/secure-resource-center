
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SecurityReport } from "@/types";

interface SecurityReportFormProps {
  onAddReport: (report: SecurityReport) => void;
}

const SecurityReportForm: React.FC<SecurityReportFormProps> = ({ onAddReport }) => {
  const [newReport, setNewReport] = useState({
    type: '',
    description: '',
    location: '',
    severity: 'medium' as 'low' | 'medium' | 'high'
  });

  const handleAddReport = () => {
    if (!newReport.type || !newReport.description || !newReport.location) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const report: SecurityReport = {
      id: Date.now().toString(),
      reportDate: new Date().toISOString().split('T')[0],
      reportedAt: new Date().toISOString(),
      status: 'open',
      createdBy: 'Usuario Actual',
      createdAt: new Date().toISOString(),
      ...newReport
    };

    onAddReport(report);
    
    setNewReport({
      type: '',
      description: '',
      location: '',
      severity: 'medium'
    });

    toast({
      title: "Éxito",
      description: "Reporte de seguridad guardado correctamente"
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Nuevo Reporte de Seguridad</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Tipo de Incidente</Label>
          <Input
            id="type"
            value={newReport.type}
            onChange={(e) => setNewReport({...newReport, type: e.target.value})}
            placeholder="Ej: Acceso no autorizado, Falla de equipo"
          />
        </div>
        <div>
          <Label htmlFor="location">Ubicación</Label>
          <Input
            id="location"
            value={newReport.location}
            onChange={(e) => setNewReport({...newReport, location: e.target.value})}
            placeholder="Ej: Edificio A, Piso 2"
          />
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="description">Descripción</Label>
          <textarea
            id="description"
            value={newReport.description}
            onChange={(e) => setNewReport({...newReport, description: e.target.value})}
            placeholder="Describe el incidente detalladamente..."
            className="w-full h-24 px-3 py-2 border border-input bg-background rounded-md resize-none"
          />
        </div>
        <div>
          <Label htmlFor="severity">Severidad</Label>
          <select
            id="severity"
            value={newReport.severity}
            onChange={(e) => setNewReport({...newReport, severity: e.target.value as any})}
            className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>
      </div>
      <Button onClick={handleAddReport} className="mt-4 w-full">
        <FileText className="h-4 w-4 mr-2" />
        Guardar Reporte
      </Button>
    </Card>
  );
};

export default SecurityReportForm;
