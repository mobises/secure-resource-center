
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  Computer, 
  Shield, 
  Car,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Usuarios",
      value: "156",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Reservas Activas",
      value: "23",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Tickets IT Pendientes",
      value: "8",
      icon: Computer,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Incidentes de Seguridad",
      value: "2",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      title: "Vehículos Disponibles",
      value: "12",
      icon: Car,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "reservation",
      description: "Juan Pérez reservó la Sala de Conferencias A",
      time: "Hace 5 minutos",
      icon: Calendar,
      color: "text-green-600"
    },
    {
      id: 2,
      type: "it_request",
      description: "Nuevo ticket IT: Problema con impresora",
      time: "Hace 15 minutos",
      icon: Computer,
      color: "text-orange-600"
    },
    {
      id: 3,
      type: "security",
      description: "Incidente de seguridad resuelto",
      time: "Hace 1 hora",
      icon: Shield,
      color: "text-red-600"
    },
    {
      id: 4,
      type: "vehicle",
      description: "Vehículo ABC-123 devuelto",
      time: "Hace 2 horas",
      icon: Car,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleString('es-ES')}
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividad reciente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`p-2 rounded-full bg-gray-100`}>
                      <Icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Alertas y notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas y Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">
                    2 incidentes de seguridad pendientes
                  </p>
                  <p className="text-xs text-red-700">
                    Requieren atención inmediata
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <Computer className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-900">
                    8 tickets IT sin asignar
                  </p>
                  <p className="text-xs text-orange-700">
                    Revisar y asignar responsables
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Sistema funcionando correctamente
                  </p>
                  <p className="text-xs text-green-700">
                    Todos los servicios operativos
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
