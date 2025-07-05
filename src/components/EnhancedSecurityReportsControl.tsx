import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileText, Download, BarChart3, TrendingUp } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useSecurityReports } from "@/hooks/useLocalData";
import { SecurityReport } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const EnhancedSecurityReportsControl = () => {
  const { data: reports, updateData: updateReports } = useSecurityReports();
  
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

    updateReports([...reports, report]);
    
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

  const exportToPDF = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    // Crear contenido HTML para el PDF
    const htmlContent = `
      <html>
        <head>
          <title>Reporte de Seguridad - ${reportId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            .info { margin: 10px 0; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Reporte de Seguridad</h1>
          <div class="info"><span class="label">ID:</span> ${report.id}</div>
          <div class="info"><span class="label">Tipo:</span> ${report.type}</div>
          <div class="info"><span class="label">Descripción:</span> ${report.description}</div>
          <div class="info"><span class="label">Ubicación:</span> ${report.location}</div>
          <div class="info"><span class="label">Severidad:</span> ${report.severity}</div>
          <div class="info"><span class="label">Estado:</span> ${report.status}</div>
          <div class="info"><span class="label">Fecha:</span> ${report.reportDate}</div>
          <div class="info"><span class="label">Creado por:</span> ${report.createdBy}</div>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-seguridad-${reportId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Éxito",
      description: "Reporte exportado correctamente"
    });
  };

  // Datos para gráficos
  const severityData = reports.reduce((acc, report) => {
    const severity = report.severity || 'medium';
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(severityData).map(([severity, count]) => ({
    name: severity === 'low' ? 'Baja' : severity === 'medium' ? 'Media' : 'Alta',
    value: count,
    color: severity === 'low' ? '#22c55e' : severity === 'medium' ? '#f59e0b' : '#ef4444'
  }));

  const statusData = reports.reduce((acc, report) => {
    const status = report.status || 'open';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    name: status === 'open' ? 'Abierto' : status === 'in_progress' ? 'En Progreso' : 'Cerrado',
    count
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Control de Reportes de Seguridad</h2>
      </div>

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Crear Reporte</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
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
        </TabsContent>

        <TabsContent value="history">
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
                      onClick={() => exportToPDF(report.id)}
                      className="ml-4"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tabla de resumen */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Resumen por Severidad
                </h3>
                <div className="space-y-3">
                  {Object.entries(severityData).map(([severity, count]) => (
                    <div key={severity} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">
                        {severity === 'low' ? 'Baja' : severity === 'medium' ? 'Media' : 'Alta'}
                      </span>
                      <span className="font-bold text-lg">{count}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded border-t-2 border-blue-200">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-xl text-blue-600">{reports.length}</span>
                  </div>
                </div>
              </Card>

              {/* Gráfico de pastel */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Distribución por Severidad
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [value.toString(), 'Cantidad']}
                        labelFormatter={(label: string) => `Severidad: ${label}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Gráfico de barras por estado */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Reportes por Estado</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSecurityReportsControl;
