
import React from 'react';
import { User } from '@/types';
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  Calendar, 
  Computer, 
  Shield, 
  Car, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  currentModule: string;
  onModuleChange: (module: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  onLogout, 
  currentModule, 
  onModuleChange 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'users', name: 'Usuarios', icon: Users },
    { id: 'rooms', name: 'Salas', icon: Calendar },
    { id: 'it', name: 'IT', icon: Computer },
    { id: 'security', name: 'Seguridad', icon: Shield },
    { id: 'vehicles', name: 'Vehículos', icon: Car },
  ];

  const handleModuleClick = (moduleId: string) => {
    onModuleChange(moduleId);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              <h1 className="text-xl font-semibold text-gray-900 ml-2 lg:ml-0">
                Sistema de Gestión Empresarial
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Bienvenido, {user.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full pt-16 lg:pt-0">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <button
                    key={module.id}
                    onClick={() => handleModuleClick(module.id)}
                    className={`
                      w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${currentModule === module.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {module.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Overlay para móvil */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenido principal */}
        <main className="flex-1 lg:ml-0">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
