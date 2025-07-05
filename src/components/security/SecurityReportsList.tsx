
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SecurityReport } from "@/types";
import { exportToPDF } from "./utils";

interface SecurityReportsListProps {
  reports: SecurityReport[];
}

const SecurityReportsList: React.FC<SecurityReportsListProps> = ({ reports }) => {
  const handleExportToPDF = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    exportToPDF(report);

    toast({
      title: "Éxito",
      description: "Reporte exportado correctamente"
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Histórico de Reportes</h3>
        <p className="text-sm text-gray-600">Total: {reports.length} reportes</p>
      </div>
      
      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{report.type}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    report.severity === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : report.severity === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {report.severity === 'high' ? 'Alta' : 
                     report.severity === 'medium' ? 'Media' : 'Baja'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    report.status === 'closed' 
                      ? 'bg-gray-100 text-gray-800' 
                      : report.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {report.status === 'closed' ? 'Cerrado' : 
                     report.status === 'in_progress' ? 'En Progreso' : 'Abierto'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{report.description}</p>
                <div className="text-xs text-gray-500">
                  <p>Ubicación: {report.location}</p>
                  <p>Fecha: {report.reportDate} - Creado por: {report.createdBy}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportToPDF(report.id)}
                className="ml-4"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SecurityReportsList;
