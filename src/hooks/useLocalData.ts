
import { useState, useEffect } from 'react';
import { dataService } from '@/services/dataService';

// Hook personalizado para manejar datos locales con reactividad
export const useLocalData = <T>(
  key: string,
  loader: () => T,
  saver: (data: T) => void
) => {
  const [data, setData] = useState<T>(loader);
  const [loading, setLoading] = useState(false);

  // Función para actualizar datos
  const updateData = (newData: T) => {
    setLoading(true);
    try {
      saver(newData);
      setData(newData);
    } catch (error) {
      console.error('Error updating data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para recargar datos
  const reloadData = () => {
    setLoading(true);
    try {
      const newData = loader();
      setData(newData);
    } catch (error) {
      console.error('Error reloading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    updateData,
    reloadData,
    loading
  };
};

// Hooks específicos para cada tipo de dato
export const useUsers = () => {
  return useLocalData(
    'users',
    () => dataService.getUsers(),
    (users) => dataService.saveUsers(users)
  );
};

export const useSectionUsers = () => {
  return useLocalData(
    'sectionUsers',
    () => dataService.getSectionUsers(),
    (users) => dataService.saveSectionUsers(users)
  );
};

export const useRooms = () => {
  return useLocalData(
    'rooms',
    () => dataService.getRooms(),
    (rooms) => dataService.saveRooms(rooms)
  );
};

export const useRoomConfigs = () => {
  return useLocalData(
    'roomConfigs',
    () => dataService.getRoomConfigs(),
    (configs) => dataService.saveRoomConfigs(configs)
  );
};

export const useRoomReservations = () => {
  return useLocalData(
    'roomReservations',
    () => dataService.getRoomReservations(),
    (reservations) => dataService.saveRoomReservations(reservations)
  );
};

export const useVehicles = () => {
  return useLocalData(
    'vehicles',
    () => dataService.getVehicles(),
    (vehicles) => dataService.saveVehicles(vehicles)
  );
};

export const useVehicleReservations = () => {
  return useLocalData(
    'vehicleReservations',
    () => dataService.getVehicleReservations(),
    (reservations) => dataService.saveVehicleReservations(reservations)
  );
};

export const useStockMovements = () => {
  return useLocalData(
    'stockMovements',
    () => dataService.getStockMovements(),
    (movements) => dataService.saveStockMovements(movements)
  );
};

export const useMaintenanceEquipment = () => {
  return useLocalData(
    'maintenanceEquipment',
    () => dataService.getMaintenanceEquipment(),
    (equipment) => dataService.saveMaintenanceEquipment(equipment)
  );
};

export const useSecurityReports = () => {
  return useLocalData(
    'securityReports',
    () => dataService.getSecurityReports(),
    (reports) => dataService.saveSecurityReports(reports)
  );
};
