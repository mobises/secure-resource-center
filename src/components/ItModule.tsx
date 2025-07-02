
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Computer, Plus, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { ItRequest } from "@/types";

const ItModule = () => {
  const [requests, setRequests] = useState<ItRequest[]>([
    {
      id: '1',
      userId: '1',
      title: 'Problema con impresora',
      description: 'La impresora del piso 2 no funciona correctamente',
      category: 'hardware',
      priority: 'medium',
      status: 'open',
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T09:00:00Z'
    },
    {
      id: '2',
      userId: '2',
      title: 'Acceso a sistema contable',
      description: 'Necesito acceso al nuevo sistema de contabilidad',
      category: 'access',
      priority: 'high',
      status: 'in-progress',
      assignedTo: 'IT Support',
      createdAt: '2024-01-14T14:30:00Z',
      updatedAt: '2024-01-15T08:00:00Z'
    }
  ]);

  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: 'hardware' as ItRequest['category'],
    priority: 'medium' as ItRequest['priority']
  });

  const handleAddRequest = () => {
    if (!newRequest.title || !newRequest.description) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const request: ItRequest = {
      id: Date.now().toString(),
      userId: '1', // Current user
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...newRequest
    };

    setRequests([...requests, request]);
    setNewRequest({
      title: '',
      description: '',
      category: 'hardware',
      priority: 'medium'
    });

    toast({
      title: "Éxito",
      description: "Solicitud IT creada correctamente"
    });
  };

  const updateRequestStatus = (id: string, status: ItRequest['status']) => {
    setRequests(requests.map(req => 
      req.id === id 
        ? { ...req, status, updatedAt: new Date().toISOString() }
        : req
    ));
    
    toast({
      title: "Éxito",
      description: "Estado actualizado correctamente"
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Computer className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Módulo IT</h2>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Nueva Solicitud IT</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={newRequest.title}
              onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
              placeholder="Describe brevemente el problema"
            />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={newRequest.description}
              onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
              placeholder="Describe detalladamente el problema o solicitud"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Categoría</Label>
              <select
                id="category"
                value={newRequest.category}
                onChange={(e) => setNewRequest({...newRequest, category: e.target.value as ItRequest['category']})}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="network">Red</option>
                <option value="access">Acceso</option>
              </select>
            </div>
            <div>
              <Label htmlFor="priority">Prioridad</Label>
              <select
                id="priority"
                value={newRequest.priority}
                onChange={(e) => setNewRequest({...newRequest, priority: e.target.value as ItRequest['priority']})}
                className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>
          <Button onClick={handleAddRequest}>
            <Plus className="h-4 w-4 mr-2" />
            Crear Solicitud
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Solicitudes IT</h3>
        {requests.map((request) => (
          <Card key={request.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <h4 className="font-semibold">{request.title}</h4>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(request.priority)}`}>
                  {request.priority === 'urgent' ? 'Urgente' :
                   request.priority === 'high' ? 'Alta' :
                   request.priority === 'medium' ? 'Media' : 'Baja'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                  {request.status === 'open' ? 'Abierto' :
                   request.status === 'in-progress' ? 'En Progreso' :
                   request.status === 'resolved' ? 'Resuelto' : 'Cerrado'}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{request.description}</p>
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">
                <span className="capitalize">{request.category}</span> • 
                Creado: {new Date(request.createdAt).toLocaleDateString()}
                {request.assignedTo && <span> • Asignado a: {request.assignedTo}</span>}
              </div>
              <div className="flex gap-2">
                {request.status === 'open' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateRequestStatus(request.id, 'in-progress')}
                  >
                    Tomar
                  </Button>
                )}
                {request.status === 'in-progress' && (
                  <Button
                    size="sm"
                    onClick={() => updateRequestStatus(request.id, 'resolved')}
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

export default ItModule;
