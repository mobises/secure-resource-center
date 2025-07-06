
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X, Calendar, Car, Shield, Computer, Database } from "lucide-react";
import { User, SectionUser } from "@/types";

interface LayoutProps {
  children: React.ReactNode;
  user: User | SectionUser;
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
    { id: 'dashboard', name: 'Dashboard', icon: Menu },
    { id: 'rooms', name: 'Reserva de Salas', icon: Calendar },
    { id: 'vehicles', name: 'Vehículos', icon: Car },
    { id: 'security', name: 'Seguridad', icon: Shield },
    { id: 'it', name: 'IT', icon: Computer },
    { id: 'data', name: 'Gestión de Datos', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">MOBIS</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-blue-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="mt-6">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => {
                  onModuleChange(module.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 ${
                  currentModule === module.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {module.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Bienvenido, {user.name}</span>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
