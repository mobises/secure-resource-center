
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Plus, Settings, FileText, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface SecurityQuestion {
  id: string;
  text: string;
}

interface SecuritySubsection {
  id: string;
  name: string;
  questions: SecurityQuestion[];
}

interface SecuritySection {
  id: string;
  name: string;
  subsections: SecuritySubsection[];
}

interface SecurityFormResponse {
  id: string;
  formDate: string;
  responses: { [questionId: string]: number };
  createdBy: string;
  createdAt: string;
}

const SecurityFormsControl = () => {
  const [sections, setSections] = useState<SecuritySection[]>([
    {
      id: '1',
      name: 'Seguridad Física',
      subsections: [
        {
          id: '1-1',
          name: 'Control de Accesos',
          questions: [
            { id: '1-1-1', text: '¿Están todos los accesos controlados adecuadamente?' },
            { id: '1-1-2', text: '¿Funcionan correctamente los sistemas de identificación?' }
          ]
        }
      ]
    }
  ]);

  const [responses, setResponses] = useState<SecurityFormResponse[]>([]);
  const [currentResponses, setCurrentResponses] = useState<{ [questionId: string]: number }>({});
  
  // Estados para configuración
  const [newSection, setNewSection] = useState({ name: '' });
  const [newSubsection, setNewSubsection] = useState({ name: '', sectionId: '' });
  const [newQuestion, setNewQuestion] = useState({ text: '', subsectionId: '' });

  const handleAddSection = () => {
    if (!newSection.name) {
      toast({
        title: "Error",
        description: "El nombre de la sección es requerido",
        variant: "destructive"
      });
      return;
    }

    const section: SecuritySection = {
      id: Date.now().toString(),
      name: newSection.name,
      subsections: []
    };

    setSections([...sections, section]);
    setNewSection({ name: '' });

    toast({
      title: "Éxito",
      description: "Sección agregada correctamente"
    });
  };

  const handleAddSubsection = () => {
    if (!newSubsection.name || !newSubsection.sectionId) {
      toast({
        title: "Error",
        description: "El nombre y la sección son requeridos",
        variant: "destructive"
      });
      return;
    }

    const subsection: SecuritySubsection = {
      id: Date.now().toString(),
      name: newSubsection.name,
      questions: []
    };

    setSections(sections.map(section => 
      section.id === newSubsection.sectionId 
        ? { ...section, subsections: [...section.subsections, subsection] }
        : section
    ));

    setNewSubsection({ name: '', sectionId: '' });

    toast({
      title: "Éxito",
      description: "Subsección agregada correctamente"
    });
  };

  const handleAddQuestion = () => {
    if (!newQuestion.text || !newQuestion.subsectionId) {
      toast({
        title: "Error",
        description: "La pregunta y la subsección son requeridos",
        variant: "destructive"
      });
      return;
    }

    const question: SecurityQuestion = {
      id: Date.now().toString(),
      text: newQuestion.text
    };

    setSections(sections.map(section => ({
      ...section,
      subsections: section.subsections.map(subsection =>
        subsection.id === newQuestion.subsectionId
          ? { ...subsection, questions: [...subsection.questions, question] }
          : subsection
      )
    })));

    setNewQuestion({ text: '', subsectionId: '' });

    toast({
      title: "Éxito",
      description: "Pregunta agregada correctamente"
    });
  };

  const handleSubmitForm = () => {
    const totalQuestions = sections.reduce((acc, section) => 
      acc + section.subsections.reduce((subAcc, subsection) => 
        subAcc + subsection.questions.length, 0), 0);

    if (Object.keys(currentResponses).length !== totalQuestions) {
      toast({
        title: "Error",
        description: "Por favor, responde todas las preguntas",
        variant: "destructive"
      });
      return;
    }

    const formResponse: SecurityFormResponse = {
      id: Date.now().toString(),
      formDate: new Date().toISOString().split('T')[0],
      responses: currentResponses,
      createdBy: 'Usuario Actual',
      createdAt: new Date().toISOString()
    };

    setResponses([...responses, formResponse]);
    setCurrentResponses({});

    toast({
      title: "Éxito",
      description: "Formulario de seguridad completado"
    });
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
    toast({
      title: "Éxito",
      description: "Sección eliminada"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Formularios de Seguridad</h2>
      </div>

      <Tabs defaultValue="form" className="space-y-4">
        <TabsList>
          <TabsTrigger value="form">Completar Formulario</TabsTrigger>
          <TabsTrigger value="config">Configuración</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Formulario de Evaluación de Seguridad</h3>
            <div className="space-y-8">
              {sections.map((section) => (
                <div key={section.id} className="space-y-6">
                  <h4 className="text-xl font-bold text-blue-800 border-b-2 border-blue-200 pb-2">
                    {section.name}
                  </h4>
                  {section.subsections.map((subsection) => (
                    <div key={subsection.id} className="space-y-4 ml-4">
                      <h5 className="text-lg font-semibold text-gray-700">
                        {subsection.name}
                      </h5>
                      {subsection.questions.map((question) => (
                        <div key={question.id} className="space-y-3 ml-4 p-4 bg-gray-50 rounded-lg">
                          <p className="font-medium text-gray-800">{question.text}</p>
                          <div className="flex gap-2 items-center">
                            <span className="text-sm text-gray-600 mr-2">Puntuación:</span>
                            {[1, 2, 3, 4, 5].map((score) => (
                              <button
                                key={score}
                                className={`w-10 h-10 rounded-full border-2 font-semibold ${
                                  currentResponses[question.id] === score
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                                }`}
                                onClick={() => setCurrentResponses({
                                  ...currentResponses,
                                  [question.id]: score
                                })}
                              >
                                {score}
                              </button>
                            ))}
                            <span className="text-xs text-gray-500 ml-2">
                              (1=Muy deficiente, 5=Excelente)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
              
              <Button onClick={handleSubmitForm} className="w-full mt-6">
                <FileText className="h-4 w-4 mr-2" />
                Enviar Formulario
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <div className="space-y-6">
            {/* Agregar Sección */}
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Agregar Nueva Sección</h4>
              <div className="flex gap-4">
                <Input
                  placeholder="Nombre de la sección"
                  value={newSection.name}
                  onChange={(e) => setNewSection({ name: e.target.value })}
                  className="flex-1"
                />
                <Button onClick={handleAddSection}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Sección
                </Button>
              </div>
            </Card>

            {/* Agregar Subsección */}
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Agregar Nueva Subsección</h4>
              <div className="flex gap-4">
                <select
                  value={newSubsection.sectionId}
                  onChange={(e) => setNewSubsection({ ...newSubsection, sectionId: e.target.value })}
                  className="px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="">Seleccionar sección</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder="Nombre de la subsección"
                  value={newSubsection.name}
                  onChange={(e) => setNewSubsection({ ...newSubsection, name: e.target.value })}
                  className="flex-1"
                />
                <Button onClick={handleAddSubsection}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Subsección
                </Button>
              </div>
            </Card>

            {/* Agregar Pregunta */}
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Agregar Nueva Pregunta</h4>
              <div className="space-y-4">
                <select
                  value={newQuestion.subsectionId}
                  onChange={(e) => setNewQuestion({ ...newQuestion, subsectionId: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="">Seleccionar subsección</option>
                  {sections.map((section) =>
                    section.subsections.map((subsection) => (
                      <option key={subsection.id} value={subsection.id}>
                        {section.name} - {subsection.name}
                      </option>
                    ))
                  )}
                </select>
                <div className="flex gap-4">
                  <Input
                    placeholder="Texto de la pregunta"
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                    className="flex-1"
                  />
                  <Button onClick={handleAddQuestion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Pregunta
                  </Button>
                </div>
              </div>
            </Card>

            {/* Vista de Configuración Actual */}
            <Card className="p-6">
              <h4 className="text-lg font-semibold mb-4">Configuración Actual</h4>
              <div className="space-y-4">
                {sections.map((section) => (
                  <div key={section.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-semibold text-lg">{section.name}</h5>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteSection(section.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {section.subsections.map((subsection) => (
                      <div key={subsection.id} className="ml-4 mt-2">
                        <p className="font-medium">{subsection.name}</p>
                        <ul className="ml-4 mt-1 space-y-1">
                          {subsection.questions.map((question) => (
                            <li key={question.id} className="text-sm text-gray-600">
                              • {question.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="p-6">
            <h4 className="text-lg font-semibold mb-4">Histórico de Formularios</h4>
            <div className="space-y-4">
              {responses.map((response) => (
                <div key={response.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Formulario del {response.formDate}</p>
                      <p className="text-sm text-gray-600">Completado por: {response.createdBy}</p>
                      <p className="text-sm text-gray-600">
                        Respuestas: {Object.keys(response.responses).length} preguntas
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityFormsControl;
