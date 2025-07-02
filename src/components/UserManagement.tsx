
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Users, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { User } from "@/types";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan.perez@company.com',
      role: 'admin',
      permissions: ['all']
    },
    {
      id: '2',
      name: 'María García',
      email: 'maria.garcia@company.com',
      role: 'user',
      permissions: ['rooms', 'it']
    }
  ]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user' as User['role'],
    permissions: [] as string[]
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      ...newUser
    };

    setUsers([...users, user]);
    setNewUser({
      name: '',
      email: '',
      role: 'user',
      permissions: []
    });

    toast({
      title: "Éxito",
      description: "Usuario agregado correctamente"
    });
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast({
      title: "Éxito",
      description: "Usuario eliminado correctamente"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Agregar Nuevo Usuario</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              placeholder="Nombre completo"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              placeholder="usuario@empresa.com"
            />
          </div>
          <div>
            <Label htmlFor="role">Rol</Label>
            <select
              id="role"
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value as User['role']})}
              className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="user">Usuario</option>
              <option value="manager">Manager</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleAddUser} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Usuario
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id} className="p-4">
            <div className="flex justify-between items-center">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-800' 
                      : user.role === 'manager'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role === 'admin' ? 'Administrador' : 
                     user.role === 'manager' ? 'Manager' : 'Usuario'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingId(user.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
