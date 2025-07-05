
import React from 'react';
import UserManagement from './UserManagement';
import EnhancedRoomReservations from './EnhancedRoomReservations';
import VehicleModule from './VehicleModule';
import ItModule from './ItModule';
import EnhancedSecurityReportsControl from './EnhancedSecurityReportsControl';
import DataManager from './DataManager';

interface ModuleRendererProps {
  module: string;
}

const ModuleRenderer: React.FC<ModuleRendererProps> = ({ module }) => {
  switch (module) {
    case 'users':
      return <UserManagement />;
    case 'rooms':
      return <EnhancedRoomReservations />;
    case 'vehicles':
      return <VehicleModule />;
    case 'security':
      return <EnhancedSecurityReportsControl />;
    case 'it':
      return <ItModule />;
    case 'data':
      return <DataManager />;
    default:
      return <div>Módulo no encontrado</div>;
  }
};

export default ModuleRenderer;
