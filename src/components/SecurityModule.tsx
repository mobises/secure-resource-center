
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Shield, AlertTriangle, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SecurityIncident } from "@/types";

const SecurityModule = () => {
  const [incidents, setIncidents] = useState<SecurityIncident[]>([
    {
      id: '1',
      title: 'Acceso no autorizado detectado',
      description: 'Se detectó un intento de acceso no autorizado al sistema de nóminas',
      type: 'cyber',
      severity: 'high',
      status: 'investigating',
      reportedBy: 'Sistema Automático',
      assignedTo: 'Equipo de Seguridad',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T11:00:00Z'
    },
    {
      id: '2',
      title: 'Puerta de emergencia abierta',
      description: 'La puerta de emergencia del piso 3 se encuentra abierta sin autorización',
      type: 'physical',
      severity: 'medium',
      status: 'reported',
      reportedBy: 'Juan Pérez',
      createdAt: '2024-01-15T08:15:00Z',
      updatedAt: '2024-01-15T08:15:00Z'
    }
  ]);

  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    type: 'physical' as const,
    severity: 'medium' as const
  });

  const handleAddIncident = () => {
    if (!newIncident.title || !newIncident.description) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const incident: SecurityIncident = {
      id: Date.now().toString(),
      reportedBy: 'Usuario Actual',
      status: 'reported',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...newIncident
    };

    setIncidents([...incidents, incident]);
    setNewIncident({
      title: '',
      description: '',
      type: 'physical',
      severity: 'medium'
    });

    toast({
      title: "Éxito",
      description: "Incidente de seguridad reportado correctamente"
    });
  };

  const updateIncidentStatus = (id: string, status: SecurityIncident['status'], assignedTo?: string) => {
    setIncidents(incidents.map(incident => 
      incident.id === id 
        ? { ...incident, status, assignedTo, updatedAt: new Date().toISOString() }
        : incident
    ));
    
    toast({
      title: "Éxito",
      description: "Estado del incidente actualizado"
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-blue-100 text-blue-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cyber': return '💻';
      case 'physical': return '🏢';
      case 'breach': return '🚨';
      case 'policy': return '📋';
      default: return '⚠️';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Módulo de Seguridad</h2>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Reportar Incidente de Seguridad</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título del Incidente</Label>
            <Input
              id="title"
              value={newIncident.title}
              onChange={(e) => setNewIncident({...newIncident, title: e.target.value})}
              placeholder="Describe brevemente el incidente"
            />
          </div>
          <div>
            <Label htmlFor="description">Descripción Detallada</Label>
            <Textarea
              id="description"
              value={newIncident.description}
              onChange={(e) => setNewIncident({...newIncident, description: e.target.value})}
              placeholder="Proporciona todos los detalles del incidente de seguridad"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo de Incidente</Label>
              <select
                id="type"
                value={newIncident.type}
                onChange={(e) => setNewIncident({...newIncident, type: e.target.value as SecurityIncident['type']})}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="physical">Físico</option>
                <option value="cyber">Cibernético</option>
                <option value="breach">Brecha de Seguridad</option>
                <option value="policy">Violación de Política</option>
              </select>
            </div>
            <div>
              <Label htmlFor="severity">Severidad</Label>
              <select
                id="severity"
                value={newIncident.severity}
                onChange={(e) => setNewIncident({...newIncident, severity: e.target.value as SecurityIncident['severity']})}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>
          </div>
          <Button onClick={handleAddIncident}>
            <Plus className="h-4 w-4 mr-2" />
            Reportar Incidente
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Incidentes de Seguridad</h3>
        {incidents.map((incident) => (
          <Card key={incident.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getTypeIcon(incident.type)}</span>
                <AlertTriangle className="h-5 w-5" />
                <h4 className="font-semibold">{incident.title}</h4>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(incident.severity)}`}>
                  {incident.severity === 'critical' ? 'Crítico' :
                   incident.severity === 'high' ? 'Alto' :
                   incident.severity === 'medium' ? 'Medio' : 'Bajo'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(incident.status)}`}>
                  {incident.status === 'reported' ? 'Reportado' :
                   incident.status === 'investigating' ? 'Investigando' : 'Resuelto'}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{incident.description}</p>
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                <span className="capitalize">
                  {incident.type === 'physical' ? 'Físico' :
                   incident.type === 'cyber' ? 'Cibernético' :
                   incident.type === 'breach' ? 'Brecha' : 'Política'}
                </span> • 
                Reportado por: {incident.reportedBy} • 
                {new Date(incident.createdAt).toLocaleDateString()}
                {incident.assignedTo && <span> • Asignado a: {incident.assignedTo}</span>}
              </div>
              <div className="flex gap-2">
                {incident.status === 'reported' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateIncidentStatus(incident.id, 'investigating', 'Equipo de Seguridad')}
                  >
                    Investigar
                  </Button>
                )}
                {incident.status === 'investigating' && (
                  <Button
                    size="sm"
                    onClick={() => updateIncidentStatus(incident.id, 'resolved')}
                  >
                    Resolver
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SecurityModule;
