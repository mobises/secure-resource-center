
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Plus, Settings, FileText, BarChart3 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SectionUser, SecurityReportSection, SecurityReport } from "@/types";

interface SecurityReportsControlProps {
  currentUser: SectionUser;
  isAdmin: boolean;
}

const SecurityReportsControl: React.FC<SecurityReportsControlProps> = ({ currentUser, isAdmin }) => {
  const [reportSections, setReportSections] = useState<SecurityReportSection[]>([
    {
      id: '1',
      name: 'Seguridad Física',
      subsections: [
        { id: '1-1', name: 'Accesos', question: '¿Están todos los accesos controlados adecuadamente?' },
        { id: '1-2', name: 'Iluminación', question: '¿La iluminación es suficiente en todas las áreas?' }
      ]
    }
  ]);

  const [reports, setReports] = useState<SecurityReport[]>([]);
  const [showConfig, setShowConfig] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentReport, setCurrentReport] = useState<{ [key: string]: number }>({});

  const [newSection, setNewSection] = useState({ name: '', subsections: [{ name: '', question: '' }] });

  const handleAddSection = () => {
    if (!newSection.name) {
      toast({
        title: "Error",
        description: "El nombre de la sección es requerido",
        variant: "destructive"
      });
      return;
    }

    const section: SecurityReportSection = {
      id: Date.now().toString(),
      name: newSection.name,
      subsections: newSection.subsections
        .filter(sub => sub.name && sub.question)
        .map((sub, index) => ({
          id: `${Date.now()}-${index}`,
          name: sub.name,
          question: sub.question
        }))
    };

    setReportSections([...reportSections, section]);
    setNewSection({ name: '', subsections: [{ name: '', question: '' }] });

    toast({
      title: "Éxito",
      description: "Sección agregada correctamente"
    });
  };

  const handleSubmitReport = () => {
    const totalResponses = Object.keys(currentReport).length;
    const totalQuestions = reportSections.reduce((acc, section) => acc + section.subsections.length, 0);

    if (totalResponses !== totalQuestions) {
      toast({
        title: "Error",
        description: "Por favor, responde todas las preguntas",
        variant: "destructive"
      });
      return;
    }

    const totalScore = Object.values(currentReport).reduce((acc, score) => acc + score, 0);
    const maxScore = totalQuestions * 5;

    const report: SecurityReport = {
      id: Date.now().toString(),
      reportDate: new Date().toISOString().split('T')[0],
      responses: currentReport,
      totalScore,
      maxScore,
      createdBy: currentUser.name,
      createdAt: new Date().toISOString()
    };

    setReports([...reports, report]);
    setCurrentReport({});

    toast({
      title: "Éxito",
      description: "Reporte de seguridad guardado correctamente"
    });
  };

  if (!currentUser.sectionAccess.security) {
    return (
      <div className="text-center py-8">
        <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No tienes acceso a esta sección</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <h3 className="text-xl font-bold">Reportes de Seguridad</h3>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <Button variant="outline" onClick={() => setShowConfig(!showConfig)}>
              <Settings className="h-4 w-4 mr-2" />
              Configuración
            </Button>
          )}
          <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Histórico
          </Button>
        </div>
      </div>

      {showConfig && isAdmin && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Configurar Secciones del Reporte</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sectionName">Nombre de la Sección</Label>
              <Input
                id="sectionName"
                value={newSection.name}
                onChange={(e) => setNewSection({...newSection, name: e.target.value})}
                placeholder="Ej: Seguridad Física"
              />
            </div>
            <div className="space-y-3">
              <Label>Preguntas de la Sección</Label>
              {newSection.subsections.map((subsection, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border rounded">
                  <Input
                    placeholder="Nombre del apartado"
                    value={subsection.name}
                    onChange={(e) => {
                      const updated = [...newSection.subsections];
                      updated[index].name = e.target.value;
                      setNewSection({...newSection, subsections: updated});
                    }}
                  />
                  <Textarea
                    placeholder="Pregunta del apartado"
                    value={subsection.question}
                    onChange={(e) => {
                      const updated = [...newSection.subsections];
                      updated[index].question = e.target.value;
                      setNewSection({...newSection, subsections: updated});
                    }}
                  />
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => setNewSection({
                  ...newSection,
                  subsections: [...newSection.subsections, { name: '', question: '' }]
                })}
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Pregunta
              </Button>
            </div>
            <Button onClick={handleAddSection}>
              <Plus className="h-4 w-4 mr-2" />
              Guardar Sección
            </Button>
          </div>
        </Card>
      )}

      {showHistory && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Histórico de Reportes</h4>
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">Reporte del {new Date(report.reportDate).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">
                    Puntuación: {report.totalScore}/{report.maxScore} ({Math.round((report.totalScore/report.maxScore) * 100)}%)
                  </p>
                  <p className="text-sm text-gray-600">Creado por: {report.createdBy}</p>
                </div>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Nuevo Reporte de Seguridad</h4>
        <div className="space-y-6">
          {reportSections.map((section) => (
            <div key={section.id} className="space-y-4">
              <h5 className="font-semibold text-lg">{section.name}</h5>
              {section.subsections.map((subsection) => (
                <div key={subsection.id} className="space-y-2">
                  <p className="font-medium">{subsection.name}</p>
                  <p className="text-sm text-gray-600">{subsection.question}</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        className={`w-10 h-10 rounded-full border-2 ${
                          currentReport[subsection.id] === score
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                        onClick={() => setCurrentReport({
                          ...currentReport,
                          [subsection.id]: score
                        })}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <Button onClick={handleSubmitReport} className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            Guardar Reporte
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SecurityReportsControl;
