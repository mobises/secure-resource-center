
import React from 'react';
import RoomReservations from './RoomReservations';
import ItModule from './ItModule';
import SecurityReportsControl from './SecurityReportsControl';
import VehicleModule from './VehicleModule';
import { SectionUser } from "@/types";

interface ModuleRendererProps {
  module: string;
}

const ModuleRenderer: React.FC<ModuleRendererProps> = ({ module }) => {
  // Usuario simulado para el módulo de seguridad
  const mockUser: SectionUser = {
    id: '1',
    name: 'Usuario Admin',
    userId: 'admin001',
    password: '12345',
    sectionRoles: {
      stock: 'admin',
      maintenance: 'admin',
      rooms: 'admin',
      security: 'admin',
      vehicles: 'admin'
    },
    sectionAccess: {
      stock: true,
      maintenance: true,
      rooms: true,
      security: true,
      vehicles: true
    }
  };

  switch (module) {
    case 'room-booking':
      return <RoomReservations />;
    case 'it':
      return <ItModule />;
    case 'security':
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <h2 className="text-2xl font-bold">Módulo de Seguridad</h2>
          </div>
          <SecurityReportsControl 
            currentUser={mockUser}
            isAdmin={mockUser.sectionRoles.security === 'admin'}
          />
        </div>
      );
    case 'vehicle-booking':
      return <VehicleModule />;
    default:
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Módulo no encontrado</h2>
          <p className="text-gray-600 mt-2">El módulo "{module}" no está disponible.</p>
        </div>
      );
  }
};

export default ModuleRenderer;
