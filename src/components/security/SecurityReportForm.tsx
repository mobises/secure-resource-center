
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FileText } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SecurityReport, SecurityReportSection, SecurityReportResponse } from "@/types";
import { useSecurityReportSections } from "@/hooks/useLocalData";

interface SecurityReportFormProps {
  onAddReport: (report: SecurityReport) => void;
}

const SecurityReportForm: React.FC<SecurityReportFormProps> = ({ onAddReport }) => {
  const { data: sections } = useSecurityReportSections();
  const [responses, setResponses] = useState<{ [key: string]: number }>({});
  const [reportData, setReportData] = useState({
    type: '',
    description: '',
    location: ''
  });

  const handleResponseChange = (questionId: string, value: number) => {
    setResponses({
      ...responses,
      [questionId]: value
    });
  };

  const handleSubmit = () => {
    if (sections.length === 0) {
      toast({
        title: "Error",
        description: "No hay secciones configuradas. Configure las secciones primero.",
        variant: "destructive"
      });
      return;
    }

    const totalQuestions = sections.reduce((total, section) => total + section.subsections.length, 0);
    const answeredQuestions = Object.keys(responses).length;
    
    if (answeredQuestions < totalQuestions) {
      toast({
        title: "Error",
        description: "Por favor, responde todas las preguntas",
        variant: "destructive"
      });
      return;
    }

    const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
    const maxScore = totalQuestions * 5;

    // Convert responses object to SecurityReportResponse array
    const reportResponses: SecurityReportResponse[] = Object.entries(responses).map(([questionId, answer]) => {
      const question = sections
        .flatMap(section => section.subsections)
        .find(sub => sub.id === questionId);
      
      return {
        questionId,
        question: question?.question || '',
        answer,
        maxScore: 5
      };
    });

    const report: SecurityReport = {
      id: Date.now().toString(),
      reportDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      createdBy: 'Usuario Actual',
      totalScore,
      maxScore,
      responses: reportResponses,
      sections: sections,
      status: 'open',
      severity: totalScore / maxScore >= 0.8 ? 'low' : totalScore / maxScore >= 0.6 ? 'medium' : 'high',
      ...reportData
    };

    onAddReport(report);
    
    // Reset form
    setResponses({});
    setReportData({
      type: '',
      description: '',
      location: ''
    });

    toast({
      title: "Éxito",
      description: "Reporte de seguridad creado correctamente"
    });
  };

  const renderRatingButtons = (questionId: string, currentValue?: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <Button
            key={value}
            size="sm"
            variant={currentValue === value ? "default" : "outline"}
            onClick={() => handleResponseChange(questionId, value)}
            className="w-8 h-8 p-0"
          >
            {value}
          </Button>
        ))}
      </div>
    );
  };

  if (sections.length === 0) {
    return (
      <Card className="p-6 text-center">
        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No hay secciones configuradas</h3>
        <p className="text-gray-600 mb-4">
          Para crear reportes de seguridad, primero debe configurar las secciones y preguntas en la pestaña "Configuración".
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6" />
        <h3 className="text-xl font-bold">Crear Reporte de Seguridad</h3>
      </div>

      <Card className="p-6">
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo de Reporte</Label>
              <Input
                id="type"
                value={reportData.type}
                onChange={(e) => setReportData({...reportData, type: e.target.value})}
                placeholder="Ej: Inspección mensual"
              />
            </div>
            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={reportData.location}
                onChange={(e) => setReportData({...reportData, location: e.target.value})}
                placeholder="Ej: Planta baja, edificio principal"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Descripción General</Label>
            <Textarea
              id="description"
              value={reportData.description}
              onChange={(e) => setReportData({...reportData, description: e.target.value})}
              placeholder="Descripción general del reporte..."
              rows={3}
            />
          </div>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <Card key={section.id} className="p-4">
              <h4 className="text-lg font-semibold mb-4">{section.name}</h4>
              <div className="space-y-4">
                {section.subsections.map((subsection) => (
                  <div key={subsection.id} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-medium">{subsection.name}</h5>
                        <p className="text-sm text-gray-600">{subsection.question}</p>
                      </div>
                      <div className="ml-4">
                        {renderRatingButtons(subsection.id, responses[subsection.id])}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t">
          <div className="text-sm text-gray-600">
            Escala: 1 = Muy Malo, 2 = Malo, 3 = Regular, 4 = Bueno, 5 = Excelente
          </div>
          <Button onClick={handleSubmit} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Crear Reporte
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SecurityReportForm;
