
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SecurityReportSection } from "@/types";

interface SecurityReportConfigProps {
  sections: SecurityReportSection[];
  onUpdateSections: (sections: SecurityReportSection[]) => void;
}

const SecurityReportConfig: React.FC<SecurityReportConfigProps> = ({ 
  sections, 
  onUpdateSections 
}) => {
  const [newSection, setNewSection] = useState({ 
    name: '', 
    subsections: [{ name: '', question: '' }] 
  });
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

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

    onUpdateSections([...sections, section]);
    setNewSection({ name: '', subsections: [{ name: '', question: '' }] });

    toast({
      title: "Éxito",
      description: "Sección agregada correctamente"
    });
  };

  const handleEditSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      setEditingSection(sectionId);
      setEditData({ ...section });
    }
  };

  const handleSaveEdit = () => {
    onUpdateSections(sections.map(section => 
      section.id === editingSection ? editData : section
    ));
    setEditingSection(null);
    setEditData({});
    
    toast({
      title: "Éxito",
      description: "Sección actualizada correctamente"
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta sección?')) {
      onUpdateSections(sections.filter(s => s.id !== sectionId));
      toast({
        title: "Éxito",
        description: "Sección eliminada correctamente"
      });
    }
  };

  const addSubsection = (isNewSection = false) => {
    if (isNewSection) {
      setNewSection({
        ...newSection,
        subsections: [...newSection.subsections, { name: '', question: '' }]
      });
    } else {
      setEditData({
        ...editData,
        subsections: [...(editData.subsections || []), { name: '', question: '' }]
      });
    }
  };

  const removeSubsection = (index: number, isNewSection = false) => {
    if (isNewSection) {
      const updated = [...newSection.subsections];
      updated.splice(index, 1);
      setNewSection({ ...newSection, subsections: updated });
    } else {
      const updated = [...(editData.subsections || [])];
      updated.splice(index, 1);
      setEditData({ ...editData, subsections: updated });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h4 className="text-lg font-semibold mb-4">Agregar Nueva Sección</h4>
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
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border rounded relative">
                <Input
                  placeholder="Nombre del apartado"
                  value={subsection.name}
                  onChange={(e) => {
                    const updated = [...newSection.subsections];
                    updated[index].name = e.target.value;
                    setNewSection({...newSection, subsections: updated});
                  }}
                />
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Pregunta del apartado"
                    value={subsection.question}
                    onChange={(e) => {
                      const updated = [...newSection.subsections];
                      updated[index].question = e.target.value;
                      setNewSection({...newSection, subsections: updated});
                    }}
                    className="flex-1"
                  />
                  {newSection.subsections.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSubsection(index, true)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addSubsection(true)}
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

      <div className="space-y-4">
        <h4 className="text-lg font-semibold">Secciones Configuradas</h4>
        {sections.map((section) => (
          <Card key={section.id} className="p-4">
            {editingSection === section.id ? (
              <div className="space-y-4">
                <div>
                  <Label>Nombre de la Sección</Label>
                  <Input
                    value={editData.name || ''}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Preguntas</Label>
                  {(editData.subsections || []).map((subsection: any, index: number) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border rounded">
                      <Input
                        placeholder="Nombre del apartado"
                        value={subsection.name || ''}
                        onChange={(e) => {
                          const updated = [...(editData.subsections || [])];
                          updated[index].name = e.target.value;
                          setEditData({...editData, subsections: updated});
                        }}
                      />
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Pregunta del apartado"
                          value={subsection.question || ''}
                          onChange={(e) => {
                            const updated = [...(editData.subsections || [])];
                            updated[index].question = e.target.value;
                            setEditData({...editData, subsections: updated});
                          }}
                          className="flex-1"
                        />
                        {(editData.subsections || []).length > 1 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeSubsection(index, false)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addSubsection(false)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Pregunta
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit}>Guardar</Button>
                  <Button variant="outline" onClick={() => setEditingSection(null)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="font-semibold text-lg">{section.name}</h5>
                    <p className="text-sm text-gray-600">{section.subsections.length} preguntas</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditSection(section.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteSection(section.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {section.subsections.map((subsection) => (
                    <div key={subsection.id} className="p-2 bg-gray-50 rounded">
                      <p className="font-medium text-sm">{subsection.name}</p>
                      <p className="text-sm text-gray-600">{subsection.question}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SecurityReportConfig;
