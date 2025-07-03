
import React from 'react';
import RoomReservations from './RoomReservations';
import ItModule from './ItModule';
import SecurityModule from './SecurityModule';
import VehicleModule from './VehicleModule';

interface ModuleRendererProps {
  module: string;
}

const ModuleRenderer: React.FC<ModuleRendererProps> = ({ module }) => {
  switch (module) {
    case 'room-booking':
      return <RoomReservations />;
    case 'it':
      return <ItModule />;
    case 'security':
      return <SecurityModule />;
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
