import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, Users, Plus, Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { SectionUser } from "@/types";
import { useSectionUsers } from "@/hooks/useLocalData";

const SectionUserManagement = () => {
  const { data: sectionUsers, updateData: updateSectionUsers } = useSectionUsers();
  
  const [newUser, setNewUser] = useState({
    name: '',
    userId: '',
    password: '',
    dashboardAccess: true,
    sectionRoles: {
      stock: null as 'admin' | 'user' | null,
      maintenance: null as 'admin' | 'user' | null,
      rooms: 'user' as 'admin' | 'user' | null,
      security: null as 'admin' | 'user' | null,
      vehicles: 'user' as 'admin' | 'user' | null,
      it: null as 'admin' | 'user' | null
    },
    sectionAccess: {
      stock: false,
      maintenance: false,
      rooms: true,
      security: false,
      vehicles: true,
      it: false
    }
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<SectionUser | null>(null);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});

  const validateUser = (user: any) => {
    if (!user.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre es obligatorio",
        variant: "destructive"
      });
      return false;
    }

    if (!user.userId.trim()) {
      toast({
        title: "Error",
        description: "El ID de usuario es obligatorio",
        variant: "destructive"
      });
      return false;
    }

    if (!user.password.trim()) {
      toast({
        title: "Error",
        description: "La contraseña es obligatoria",
        variant: "destructive"
      });
      return false;
    }

    // Verificar duplicados de userId (excluyendo el usuario que se está editando)
    const existingUser = sectionUsers.find(u => 
      u.userId === user.userId && u.id !== editingId
    );
    
    if (existingUser) {
      toast({
        title: "Error",
        description: "Ya existe un usuario con este ID",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleAddUser = () => {
    if (!validateUser(newUser)) return;

    const user: SectionUser = {
      id: Date.now().toString(),
      name: newUser.name,
      userId: newUser.userId,
      password: newUser.password,
      dashboardAccess: newUser.dashboardAccess,
      lastPasswordChange: new Date().toISOString(),
      sectionRoles: { ...newUser.sectionRoles, it: null },
      sectionAccess: { ...newUser.sectionAccess }
    };

    updateSectionUsers([...sectionUsers, user]);
    setNewUser({
      name: '',
      userId: '',
      password: '',
      dashboardAccess: true,
      sectionRoles: {
        stock: null,
        maintenance: null,
        rooms: 'user',
        security: null,
        vehicles: 'user',
        it: null
      },
      sectionAccess: {
        stock: false,
        maintenance: false,
        rooms: true,
        security: false,
        vehicles: true,
        it: false
      }
    });

    toast({
      title: "Éxito",
      description: "Usuario agregado correctamente"
    });
  };

  const handleDeleteUser = (id: string) => {
    updateSectionUsers(sectionUsers.filter(u => u.id !== id));
    toast({
      title: "Éxito",
      description: "Usuario eliminado correctamente"
    });
  };

  const handleEditUser = (user: SectionUser) => {
    setEditingId(user.id);
    setEditingUser({ ...user });
  };

  const handleSaveEdit = () => {
    if (!editingUser || !validateUser(editingUser)) return;

    const updatedUsers = sectionUsers.map(u => 
      u.id === editingId ? editingUser : u
    );
    updateSectionUsers(updatedUsers);
    setEditingId(null);
    setEditingUser(null);
    toast({
      title: "Éxito",
      description: "Usuario actualizado correctamente"
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingUser(null);
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Gestión de Usuarios por Sección</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agregar Nuevo Usuario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Label htmlFor="userId">ID de Usuario</Label>
              <Input
                id="userId"
                value={newUser.userId}
                onChange={(e) => setNewUser({...newUser, userId: e.target.value})}
                placeholder="usuario.ejemplo"
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

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="dashboardAccess"
                checked={newUser.dashboardAccess}
                onCheckedChange={(checked) => setNewUser({...newUser, dashboardAccess: checked})}
              />
              <Label htmlFor="dashboardAccess">Acceso al Dashboard</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {Object.entries(newUser.sectionAccess).map(([section, hasAccess]) => (
                <div key={section} className="space-y-2">
                  <Label className="text-sm font-medium capitalize">{section}</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={hasAccess}
                        onCheckedChange={(checked) => {
                          setNewUser({
                            ...newUser,
                            sectionAccess: {
                              ...newUser.sectionAccess,
                              [section]: checked
                            },
                            sectionRoles: {
                              ...newUser.sectionRoles,
                              [section]: checked ? 'user' : null
                            }
                          });
                        }}
                      />
                      <Label className="text-xs">Acceso</Label>
                    </div>
                    {hasAccess && (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`${section}-user`}
                            name={`${section}-role`}
                            checked={newUser.sectionRoles[section as keyof typeof newUser.sectionRoles] === 'user'}
                            onChange={() => setNewUser({
                              ...newUser,
                              sectionRoles: {
                                ...newUser.sectionRoles,
                                [section]: 'user'
                              }
                            })}
                          />
                          <Label htmlFor={`${section}-user`} className="text-xs">Usuario</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`${section}-admin`}
                            name={`${section}-role`}
                            checked={newUser.sectionRoles[section as keyof typeof newUser.sectionRoles] === 'admin'}
                            onChange={() => setNewUser({
                              ...newUser,
                              sectionRoles: {
                                ...newUser.sectionRoles,
                                [section]: 'admin'
                              }
                            })}
                          />
                          <Label htmlFor={`${section}-admin`} className="text-xs">Admin</Label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleAddUser}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Usuario
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {sectionUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              {editingId === user.id && editingUser ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Nombre</Label>
                      <Input
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>ID de Usuario</Label>
                      <Input
                        value={editingUser.userId}
                        onChange={(e) => setEditingUser({...editingUser, userId: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Contraseña</Label>
                      <Input
                        type="password"
                        value={editingUser.password}
                        onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editingUser.dashboardAccess}
                        onCheckedChange={(checked) => setEditingUser({...editingUser, dashboardAccess: checked})}
                      />
                      <Label>Acceso al Dashboard</Label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      {Object.entries(editingUser.sectionAccess).map(([section, hasAccess]) => (
                        <div key={section} className="space-y-2">
                          <Label className="text-sm font-medium capitalize">{section}</Label>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={hasAccess}
                                onCheckedChange={(checked) => {
                                  setEditingUser({
                                    ...editingUser,
                                    sectionAccess: {
                                      ...editingUser.sectionAccess,
                                      [section]: checked
                                    },
                                    sectionRoles: {
                                      ...editingUser.sectionRoles,
                                      [section]: checked ? 'user' : null
                                    }
                                  });
                                }}
                              />
                              <Label className="text-xs">Acceso</Label>
                            </div>
                            {hasAccess && (
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    checked={editingUser.sectionRoles[section as keyof typeof editingUser.sectionRoles] === 'user'}
                                    onChange={() => setEditingUser({
                                      ...editingUser,
                                      sectionRoles: {
                                        ...editingUser.sectionRoles,
                                        [section]: 'user'
                                      }
                                    })}
                                  />
                                  <Label className="text-xs">Usuario</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="radio"
                                    checked={editingUser.sectionRoles[section as keyof typeof editingUser.sectionRoles] === 'admin'}
                                    onChange={() => setEditingUser({
                                      ...editingUser,
                                      sectionRoles: {
                                        ...editingUser.sectionRoles,
                                        [section]: 'admin'
                                      }
                                    })}
                                  />
                                  <Label className="text-xs">Admin</Label>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit}>Guardar</Button>
                    <Button variant="outline" onClick={handleCancelEdit}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-600">ID: {user.userId}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">
                          Contraseña: {showPasswords[user.id] ? user.password : '••••••••'}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePasswordVisibility(user.id)}
                        >
                          {showPasswords[user.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-6 gap-4 text-xs">
                      {Object.entries(user.sectionAccess).map(([section, hasAccess]) => (
                        <div key={section}>
                          <span className="capitalize font-medium">{section}:</span>
                          <div className="text-gray-600">
                            {hasAccess ? (
                              <span className={`px-1 py-0.5 rounded text-xs ${
                                user.sectionRoles[section as keyof typeof user.sectionRoles] === 'admin' 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user.sectionRoles[section as keyof typeof user.sectionRoles]}
                              </span>
                            ) : (
                              <span className="text-gray-400">Sin acceso</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.dashboardAccess ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.dashboardAccess ? 'Dashboard: Sí' : 'Dashboard: No'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
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
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SectionUserManagement;
