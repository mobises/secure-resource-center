
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Users, Plus, Settings } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SectionUser } from "@/types";

interface SectionUserManagementProps {
  users: SectionUser[];
  onUpdateUsers: (users: SectionUser[]) => void;
}

const SectionUserManagement: React.FC<SectionUserManagementProps> = ({ users, onUpdateUsers }) => {
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    stockRole: null as 'admin' | 'user' | null,
    stockAccess: false,
    maintenanceRole: null as 'admin' | 'user' | null,
    maintenanceAccess: false
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Error",
        description: "Por favor, completa nombre y email",
        variant: "destructive"
      });
      return;
    }

    const user: SectionUser = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      sectionRoles: {
        stock: newUser.stockRole,
        maintenance: newUser.maintenanceRole
      },
      sectionAccess: {
        stock: newUser.stockAccess,
        maintenance: newUser.maintenanceAccess
      }
    };

    onUpdateUsers([...users, user]);
    setNewUser({
      name: '',
      email: '',
      stockRole: null,
      stockAccess: false,
      maintenanceRole: null,
      maintenanceAccess: false
    });

    toast({
      title: "Éxito",
      description: "Usuario agregado correctamente"
    });
  };

  const updateUserRole = (userId: string, section: 'stock' | 'maintenance', role: 'admin' | 'user' | null) => {
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

  const updateUserAccess = (userId: string, section: 'stock' | 'maintenance', access: boolean) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Gestión de Usuarios por Sección</h3>
      </div>

      <Card className="p-6">
        <h4 className="text-md font-semibold mb-4">Agregar Nuevo Usuario</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="userEmail">Email</Label>
              <Input
                id="userEmail"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="usuario@empresa.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h5 className="font-medium text-sm">Control de Stock</h5>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="stockAccess"
                  checked={newUser.stockAccess}
                  onChange={(e) => setNewUser({...newUser, stockAccess: e.target.checked})}
                />
                <Label htmlFor="stockAccess" className="text-sm">Acceso</Label>
              </div>
              {newUser.stockAccess && (
                <select
                  value={newUser.stockRole || ''}
                  onChange={(e) => setNewUser({...newUser, stockRole: e.target.value as 'admin' | 'user' || null})}
                  className="w-full h-8 px-2 py-1 border border-input bg-background rounded-md text-sm"
                >
                  <option value="">Seleccionar rol</option>
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              )}
            </div>

            <div className="space-y-3">
              <h5 className="font-medium text-sm">Mantenimiento</h5>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="maintenanceAccess"
                  checked={newUser.maintenanceAccess}
                  onChange={(e) => setNewUser({...newUser, maintenanceAccess: e.target.checked})}
                />
                <Label htmlFor="maintenanceAccess" className="text-sm">Acceso</Label>
              </div>
              {newUser.maintenanceAccess && (
                <select
                  value={newUser.maintenanceRole || ''}
                  onChange={(e) => setNewUser({...newUser, maintenanceRole: e.target.value as 'admin' | 'user' || null})}
                  className="w-full h-8 px-2 py-1 border border-input bg-background rounded-md text-sm"
                >
                  <option value="">Seleccionar rol</option>
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              )}
            </div>
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
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h6 className="text-sm font-medium">Control de Stock</h6>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={user.sectionAccess.stock}
                      onChange={(e) => updateUserAccess(user.id, 'stock', e.target.checked)}
                    />
                    <span className="text-sm">Acceso</span>
                  </div>
                  {user.sectionAccess.stock && (
                    <select
                      value={user.sectionRoles.stock || ''}
                      onChange={(e) => updateUserRole(user.id, 'stock', e.target.value as 'admin' | 'user' || null)}
                      className="w-full h-8 px-2 py-1 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="">Sin rol</option>
                      <option value="user">Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                  )}
                </div>

                <div className="space-y-2">
                  <h6 className="text-sm font-medium">Mantenimiento</h6>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={user.sectionAccess.maintenance}
                      onChange={(e) => updateUserAccess(user.id, 'maintenance', e.target.checked)}
                    />
                    <span className="text-sm">Acceso</span>
                  </div>
                  {user.sectionAccess.maintenance && (
                    <select
                      value={user.sectionRoles.maintenance || ''}
                      onChange={(e) => updateUserRole(user.id, 'maintenance', e.target.value as 'admin' | 'user' || null)}
                      className="w-full h-8 px-2 py-1 border border-input bg-background rounded-md text-sm"
                    >
                      <option value="">Sin rol</option>
                      <option value="user">Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SectionUserManagement;
