
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Users, Clock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useSectionUsers, useUsers } from "@/hooks/useLocalData";
import { User, SectionUser } from "@/types";

const PasswordExpirationManagement = () => {
  const { data: users, updateData: updateUsers } = useUsers();
  const { data: sectionUsers, updateData: updateSectionUsers } = useSectionUsers();

  const getDaysUntilExpiration = (lastPasswordChange?: string) => {
    if (!lastPasswordChange) return -1; // Nunca ha cambiado la contraseña
    const lastChange = new Date(lastPasswordChange);
    const now = new Date();
    const diffTime = now.getTime() - lastChange.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return 90 - diffDays;
  };

  const getUsersNeedingPasswordChange = () => {
    const allUsers: (User | SectionUser)[] = [...users, ...sectionUsers];
    return allUsers.filter(user => {
      const daysLeft = getDaysUntilExpiration(user.lastPasswordChange);
      return daysLeft <= 7 && daysLeft >= -30; // Mostrar los que expiran en 7 días o ya expiraron hace menos de 30 días
    }).sort((a, b) => {
      const daysA = getDaysUntilExpiration(a.lastPasswordChange);
      const daysB = getDaysUntilExpiration(b.lastPasswordChange);
      return daysA - daysB;
    });
  };

  const handleForcePasswordChange = (userId: string, isRegularUser: boolean = true) => {
    if (isRegularUser) {
      const updatedUsers = users.map(user => 
        user.id === userId 
          ? { ...user, lastPasswordChange: new Date('2020-01-01').toISOString() }
          : user
      );
      updateUsers(updatedUsers);
    } else {
      const updatedSectionUsers = sectionUsers.map(user => 
        user.id === userId 
          ? { ...user, lastPasswordChange: new Date('2020-01-01').toISOString() }
          : user
      );
      updateSectionUsers(updatedSectionUsers);
    }

    toast({
      title: "Éxito",
      description: "Usuario marcado para cambio de contraseña obligatorio"
    });
  };

  const usersNeedingChange = getUsersNeedingPasswordChange();

  const getStatusColor = (daysLeft: number) => {
    if (daysLeft < 0) return 'bg-red-100 text-red-800';
    if (daysLeft <= 3) return 'bg-orange-100 text-orange-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (daysLeft: number) => {
    if (daysLeft < 0) return `Expiró hace ${Math.abs(daysLeft)} días`;
    if (daysLeft === 0) return 'Expira hoy';
    return `Expira en ${daysLeft} días`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-6 w-6" />
        <h3 className="text-xl font-bold">Gestión de Expiración de Contraseñas</h3>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5" />
          <h4 className="text-lg font-semibold">Usuarios que Requieren Cambio de Contraseña</h4>
        </div>
        
        {usersNeedingChange.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No hay usuarios que requieran cambio de contraseña próximamente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {usersNeedingChange.map((user) => {
              const daysLeft = getDaysUntilExpiration(user.lastPasswordChange);
              const isRegularUser = 'role' in user;
              
              return (
                <div key={user.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-sm text-gray-600">({user.userId})</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {isRegularUser ? 'Usuario Regular' : 'Usuario de Sección'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(daysLeft)}`}>
                        {getStatusText(daysLeft)}
                      </span>
                      {user.lastPasswordChange && (
                        <span className="text-xs text-gray-500">
                          Último cambio: {new Date(user.lastPasswordChange).toLocaleDateString('es-ES')}
                        </span>
                      )}
                      {!user.lastPasswordChange && (
                        <span className="text-xs text-red-500">
                          Nunca ha cambiado la contraseña
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleForcePasswordChange(user.id, isRegularUser)}
                  >
                    Forzar Cambio
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <AlertTriangle className="h-4 w-4" />
          <span>
            <strong>Nota:</strong> Las contraseñas deben cambiarse cada 90 días. 
            Los usuarios serán notificados cuando su contraseña esté por expirar.
          </span>
        </div>
      </Card>
    </div>
  );
};

export default PasswordExpirationManagement;
