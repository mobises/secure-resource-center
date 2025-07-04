
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Calendar, 
  Car,
  TrendingUp,
  CheckCircle,
  Clock
} from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useSectionUsers, useRoomReservations, useVehicles, useVehicleReservations } from '@/hooks/useLocalData';

const Dashboard = () => {
  const { user } = useAuth();
  const { data: sectionUsers } = useSectionUsers();
  const { data: roomReservations } = useRoomReservations();
  const { data: vehicles } = useVehicles();
  const { data: vehicleReservations } = useVehicleReservations();

  // Verificar si el usuario es administrador de alguna sección
  const currentSectionUser = sectionUsers.find(su => su.userId === user?.userId);
  const isAnyAdmin = currentSectionUser && Object.values(currentSectionUser.sectionRoles).some(role => role === 'admin');

  if (!isAnyAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center">
          <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido al Sistema</h2>
          <p className="text-gray-600">
            Utiliza el menú de navegación para acceder a los diferentes módulos del sistema.
          </p>
        </Card>
      </div>
    );
  }

  // Calcular estadísticas reales
  const today = new Date().toISOString().split('T')[0];
  const activeRoomReservations = roomReservations.filter(r => 
    r.date === today && r.status === 'approved'
  ).length;

  const todayVehicleReservations = vehicleReservations.filter(vr => 
    vr.startDate <= today && vr.endDate >= today && vr.status === 'approved'
  ).length;

  const availableVehicles = vehicles.filter(v => v.status === 'available').length - todayVehicleReservations;

  const connectedUsers = 1; // Usuario actual conectado - en implementación real sería dinámico

  const stats = [
    {
      title: "Total Usuarios",
      value: sectionUsers.length.toString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Usuarios Conectados",
      value: connectedUsers.toString(),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Reservas Salas Hoy",
      value: activeRoomReservations.toString(),
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Vehículos Disponibles",
      value: availableVehicles.toString(),
      icon: Car,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "user_login",
      description: `${user?.name} inició sesión`,
      time: "Ahora",
      icon: Users,
      color: "text-green-600"
    },
    {
      id: 2,
      type: "system",
      description: "Sistema iniciado correctamente",
      time: "Hace 5 minutos",
      icon: CheckCircle,
      color: "text-blue-600"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleString('es-ES')}
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              Actividad Reciente del Sistema
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

        {/* Información del sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Sistema funcionando correctamente
                  </p>
                  <p className="text-xs text-green-700">
                    Todos los módulos operativos
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Datos sincronizados
                  </p>
                  <p className="text-xs text-blue-700">
                    Almacenamiento local activo
                  </p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Información de Sesión:
                </p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Usuario:</strong> {user?.name}</p>
                  <p><strong>ID:</strong> {user?.userId}</p>
                  <p><strong>Rol:</strong> Administrador</p>
                  <p><strong>Último login:</strong> {new Date().toLocaleString('es-ES')}</p>
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
