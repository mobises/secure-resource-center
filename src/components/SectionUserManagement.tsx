
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Users, Plus, Edit, Trash2, Lock, Unlock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SectionUser } from "@/types";

interface SectionUserManagementProps {
  users: SectionUser[];
  onUpdateUsers: (users: SectionUser[]) => void;
}

const SectionUserManagement: React.FC<SectionUserManagementProps> = ({ users, onUpdateUsers }) => {
  const [newUser, setNewUser] = useState({
    name: '',
    userId: '',
    password: '',
    stockRole: null as 'admin' | 'user' | null,
    stockAccess: false,
    maintenanceRole: null as 'admin' | 'user' | null,
    maintenanceAccess: false,
    roomsRole: null as 'admin' | 'user' | null,
    roomsAccess: false,
    securityRole: null as 'admin' | 'user' | null,
    securityAccess: false,
    vehiclesRole: null as 'admin' | 'user' | null,
    vehiclesAccess: false
  });

  const [editingUser, setEditingUser] = useState<SectionUser | null>(null);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.userId || !newUser.password) {
      toast({
        title: "Error",
        description: "Por favor, completa nombre, ID de usuario y contraseña",
        variant: "destructive"
      });
      return;
    }

    const user: SectionUser = {
      id: Date.now().toString(),
      name: newUser.name,
      userId: newUser.userId,
      password: newUser.password,
      dashboardAccess: true,
      lastPasswordChange: new Date().toISOString(),
      sectionRoles: {
        stock: newUser.stockRole,
        maintenance: newUser.maintenanceRole,
        rooms: newUser.roomsRole,
        security: newUser.securityRole,
        vehicles: newUser.vehiclesRole
      },
      sectionAccess: {
        stock: newUser.stockAccess,
        maintenance: newUser.maintenanceAccess,
        rooms: newUser.roomsAccess,
        security: newUser.securityAccess,
        vehicles: newUser.vehiclesAccess
      }
    };

    onUpdateUsers([...users, user]);
    setNewUser({
      name: '',
      userId: '',
      password: '',
      stockRole: null,
      stockAccess: false,
      maintenanceRole: null,
      maintenanceAccess: false,
      roomsRole: null,
      roomsAccess: false,
      securityRole: null,
      securityAccess: false,
      vehiclesRole: null,
      vehiclesAccess: false
    });

    toast({
      title: "Éxito",
      description: "Usuario agregado correctamente"
    });
  };

  const handleDeleteUser = (userId: string) => {
    onUpdateUsers(users.filter(u => u.id !== userId));
    toast({
      title: "Éxito",
      description: "Usuario eliminado correctamente"
    });
  };

  const handleBlockUser = (userId: string) => {
    const blockUntil = new Date();
    blockUntil.setHours(blockUntil.getHours() + 1); // Bloquear por 1 hora
    
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, blockedUntil: blockUntil.toISOString() }
        : user
    );
    onUpdateUsers(updatedUsers);
    
    toast({
      title: "Éxito",
      description: "Usuario bloqueado temporalmente"
    });
  };

  const handleUnblockUser = (userId: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, blockedUntil: undefined, failedLoginAttempts: 0 }
        : user
    );
    onUpdateUsers(updatedUsers);
    
    toast({
      title: "Éxito",
      description: "Usuario desbloqueado correctamente"
    });
  };

  const handleChangePassword = (userId: string, newPassword: string) => {
    if (!newPassword) {
      toast({
        title: "Error",
        description: "La contraseña no puede estar vacía",
        variant: "destructive"
      });
      return;
    }

    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            password: newPassword,
            lastPasswordChange: new Date().toISOString(),
            passwordHistory: [...(user.passwordHistory || []), user.password].slice(-5) // Mantener últimas 5 contraseñas
          }
        : user
    );
    onUpdateUsers(updatedUsers);
    
    toast({
      title: "Éxito",
      description: "Contraseña cambiada correctamente"
    });
  };

  const updateUserRole = (userId: string, section: 'stock' | 'maintenance' | 'rooms' | 'security' | 'vehicles', role: 'admin' | 'user' | null) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? {
            ...user, 
            sectionRoles: { ...user.sectionRoles, [section]: role }
          }
        : user
    );
    onUpdateUsers(updatedUsers);
  };

  const updateUserAccess = (userId: string, section: 'stock' | 'maintenance' | 'rooms' | 'security' | 'vehicles', access: boolean) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? {
            ...user, 
            sectionAccess: { ...user.sectionAccess, [section]: access }
          }
        : user
    );
    onUpdateUsers(updatedUsers);
  };

  const isUserBlocked = (user: SectionUser) => {
    return user.blockedUntil && new Date(user.blockedUntil) > new Date();
  };

  const getDaysUntilPasswordExpiration = (lastPasswordChange?: string) => {
    if (!lastPasswordChange) return -1;
    const lastChange = new Date(lastPasswordChange);
    const now = new Date();
    const diffTime = now.getTime() - lastChange.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return 90 - diffDays;
  };

  const sections = [
    { key: 'stock' as const, name: 'Control de Stock' },
    { key: 'maintenance' as const, name: 'Mantenimiento' },
    { key: 'rooms' as const, name: 'Reserva de Salas' },
    { key: 'security' as const, name: 'Seguridad' },
    { key: 'vehicles' as const, name: 'Reserva de Vehículos' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Gestión de Usuarios por Sección</h3>
      </div>

      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">Agregar Nuevo Usuario</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="userName">Nombre</Label>
              <Input
                id="userName"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <Label htmlFor="userId">ID de Usuario</Label>
              <Input
                id="userId"
                value={newUser.userId}
                onChange={(e) => setNewUser({...newUser, userId: e.target.value})}
                placeholder="ID único del usuario"
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <div key={section.key} className="space-y-3">
                <h5 className="font-medium text-sm">{section.name}</h5>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`${section.key}Access`}
                    checked={newUser[`${section.key}Access` as keyof typeof newUser] as boolean}
                    onChange={(e) => setNewUser({...newUser, [`${section.key}Access`]: e.target.checked})}
                  />
                  <Label htmlFor={`${section.key}Access`} className="text-sm">Acceso</Label>
                </div>
                {newUser[`${section.key}Access` as keyof typeof newUser] && (
                  <select
                    value={newUser[`${section.key}Role` as keyof typeof newUser] as string || ''}
                    onChange={(e) => setNewUser({...newUser, [`${section.key}Role`]: e.target.value as 'admin' | 'user' || null})}
                    className="w-full h-8 px-2 py-1 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="">Seleccionar rol</option>
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                )}
              </div>
            ))}
          </div>

          <Button onClick={handleAddUser}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Usuario
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">Usuarios Existentes</h4>
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{user.name}</p>
                    {isUserBlocked(user) && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                        BLOQUEADO
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">ID: {user.userId}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    <p>Última modificación de clave: {user.lastPasswordChange ? new Date(user.lastPasswordChange).toLocaleDateString('es-ES') : 'Nunca'}</p>
                    {user.lastPasswordChange && (
                      <p>Días hasta expiración: {getDaysUntilPasswordExpiration(user.lastPasswordChange)}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newPassword = prompt("Nueva contraseña:");
                      if (newPassword) handleChangePassword(user.id, newPassword);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {isUserBlocked(user) ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnblockUser(user.id)}
                    >
                      <Unlock className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBlockUser(user.id)}
                    >
                      <Lock className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sections.map((section) => (
                  <div key={section.key} className="space-y-2">
                    <h6 className="text-sm font-medium">{section.name}</h6>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={user.sectionAccess[section.key]}
                        onChange={(e) => updateUserAccess(user.id, section.key, e.target.checked)}
                      />
                      <span className="text-sm">Acceso</span>
                    </div>
                    {user.sectionAccess[section.key] && (
                      <select
                        value={user.sectionRoles[section.key] || ''}
                        onChange={(e) => updateUserRole(user.id, section.key, e.target.value as 'admin' | 'user' || null)}
                        className="w-full h-8 px-2 py-1 border border-input bg-background rounded-md text-sm"
                      >
                        <option value="">Sin rol</option>
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SectionUserManagement;
