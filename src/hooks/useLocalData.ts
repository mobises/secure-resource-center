
import { useState, useEffect } from 'react';
import { dataService } from '@/services/dataService';
import { 
  User, 
  SectionUser, 
  Room, 
  RoomConfig, 
  RoomReservation, 
  RoomScheduleConfig,
  Vehicle,
  VehicleReservation,
  StockMovement,
  MaintenanceEquipment,
  SecurityReport,
  SecurityReportSection,
  Holiday
} from '@/types';

// Generic hook for localStorage data
const useLocalData = <T>(
  key: string,
  getter: () => T,
  setter: (data: T) => void
) => {
  const [data, setData] = useState<T>(getter());

  const updateData = (newData: T) => {
    setData(newData);
    setter(newData);
  };

  useEffect(() => {
    setData(getter());
  }, []);

  return { data, updateData };
};

// Specific hooks for each data type
export const useUsers = () => useLocalData(
  'users',
  dataService.getUsers,
  dataService.saveUsers
);

export const useSectionUsers = () => useLocalData(
  'sectionUsers',
  dataService.getSectionUsers,
  dataService.saveSectionUsers
);

export const useRooms = () => useLocalData(
  'rooms',
  dataService.getRooms,
  dataService.saveRooms
);

export const useRoomConfigs = () => useLocalData(
  'roomConfigs',
  dataService.getRoomConfigs,
  dataService.saveRoomConfigs
);

export const useRoomReservations = () => useLocalData(
  'roomReservations',
  dataService.getRoomReservations,
  dataService.saveRoomReservations
);

export const useRoomScheduleConfig = () => useLocalData(
  'roomScheduleConfig',
  dataService.getRoomScheduleConfig,
  dataService.saveRoomScheduleConfig
);

export const useVehicles = () => useLocalData(
  'vehicles',
  dataService.getVehicles,
  dataService.saveVehicles
);

export const useVehicleReservations = () => useLocalData(
  'vehicleReservations',
  dataService.getVehicleReservations,
  dataService.saveVehicleReservations
);

export const useStockMovements = () => useLocalData(
  'stockMovements',
  dataService.getStockMovements,
  dataService.saveStockMovements
);

export const useMaintenanceEquipment = () => useLocalData(
  'maintenanceEquipment',
  dataService.getMaintenanceEquipment,
  dataService.saveMaintenanceEquipment
);

export const useSecurityReports = () => useLocalData(
  'securityReports',
  dataService.getSecurityReports,
  dataService.saveSecurityReports
);

export const useSecurityReportSections = () => useLocalData(
  'securityReportSections',
  dataService.getSecurityReportSections,
  dataService.saveSecurityReportSections
);

export const useHolidays = () => useLocalData(
  'holidays',
  dataService.getHolidays,
  dataService.saveHolidays
);
