
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
  SecurityReportSection
} from '@/types';

const STORAGE_KEYS = {
  USERS: 'users',
  SECTION_USERS: 'sectionUsers',
  ROOMS: 'rooms',
  ROOM_CONFIGS: 'roomConfigs',
  ROOM_RESERVATIONS: 'roomReservations',
  ROOM_SCHEDULE_CONFIG: 'roomScheduleConfig',
  VEHICLES: 'vehicles',
  VEHICLE_RESERVATIONS: 'vehicleReservations',
  STOCK_MOVEMENTS: 'stockMovements',
  MAINTENANCE_EQUIPMENT: 'maintenanceEquipment',
  SECURITY_REPORTS: 'securityReports',
  SECURITY_REPORT_SECTIONS: 'securityReportSections'
};

// Helper function to get data from localStorage
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Helper function to save data to localStorage
const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Default data
const defaultUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    userId: 'admin',
    password: 'admin123',
    role: 'admin',
    permissions: ['all']
  },
  {
    id: '2',
    name: 'Regular User',
    userId: 'user',
    password: 'user123',
    role: 'user',
    permissions: ['read']
  }
];

const defaultSectionUsers: SectionUser[] = [
  {
    id: '1',
    name: 'Section Admin',
    userId: 'section_admin',
    password: 'admin123',
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
  }
];

const defaultRooms: Room[] = [
  {
    id: '1',
    name: 'Sala de Juntas Principal',
    capacity: 12,
    location: 'Piso 2',
    equipment: ['Proyector', 'Pantalla', 'Sistema de Audio'],
    status: 'available',
    amenities: ['WiFi', 'Aire Acondicionado', 'Pizarra']
  },
  {
    id: '2',
    name: 'Sala de Conferencias',
    capacity: 8,
    location: 'Piso 1',
    equipment: ['TV', 'Sistema de Videoconferencia'],
    status: 'available',
    amenities: ['WiFi', 'Cafetera']
  }
];

const defaultVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Toyota Camry 2022',
    type: 'Sedan',
    capacity: 5,
    status: 'available',
    brand: 'Toyota',
    model: 'Camry',
    licensePlate: 'ABC-123',
    year: 2022
  },
  {
    id: '2',
    name: 'Ford Transit 2021',
    type: 'Van',
    capacity: 12,
    status: 'maintenance',
    brand: 'Ford',
    model: 'Transit',
    licensePlate: 'DEF-456',
    year: 2021
  }
];

export const dataService = {
  // Users
  getUsers: (): User[] => getFromStorage(STORAGE_KEYS.USERS, defaultUsers),
  saveUsers: (users: User[]): void => saveToStorage(STORAGE_KEYS.USERS, users),

  // Section Users
  getSectionUsers: (): SectionUser[] => getFromStorage(STORAGE_KEYS.SECTION_USERS, defaultSectionUsers),
  saveSectionUsers: (users: SectionUser[]): void => saveToStorage(STORAGE_KEYS.SECTION_USERS, users),

  // Rooms
  getRooms: (): Room[] => getFromStorage(STORAGE_KEYS.ROOMS, defaultRooms),
  saveRooms: (rooms: Room[]): void => saveToStorage(STORAGE_KEYS.ROOMS, rooms),

  // Room Configs
  getRoomConfigs: (): RoomConfig[] => getFromStorage(STORAGE_KEYS.ROOM_CONFIGS, []),
  saveRoomConfigs: (configs: RoomConfig[]): void => saveToStorage(STORAGE_KEYS.ROOM_CONFIGS, configs),

  // Room Reservations
  getRoomReservations: (): RoomReservation[] => getFromStorage(STORAGE_KEYS.ROOM_RESERVATIONS, []),
  saveRoomReservations: (reservations: RoomReservation[]): void => saveToStorage(STORAGE_KEYS.ROOM_RESERVATIONS, reservations),

  // Room Schedule Config
  getRoomScheduleConfig: (): RoomScheduleConfig[] => getFromStorage(STORAGE_KEYS.ROOM_SCHEDULE_CONFIG, []),
  saveRoomScheduleConfig: (config: RoomScheduleConfig[]): void => saveToStorage(STORAGE_KEYS.ROOM_SCHEDULE_CONFIG, config),

  // Vehicles - Fixed to use proper Vehicle type
  getVehicles: (): Vehicle[] => getFromStorage(STORAGE_KEYS.VEHICLES, defaultVehicles),
  saveVehicles: (vehicles: Vehicle[]): void => saveToStorage(STORAGE_KEYS.VEHICLES, vehicles),

  // Vehicle Reservations
  getVehicleReservations: (): VehicleReservation[] => getFromStorage(STORAGE_KEYS.VEHICLE_RESERVATIONS, []),
  saveVehicleReservations: (reservations: VehicleReservation[]): void => saveToStorage(STORAGE_KEYS.VEHICLE_RESERVATIONS, reservations),

  // Stock Movements
  getStockMovements: (): StockMovement[] => getFromStorage(STORAGE_KEYS.STOCK_MOVEMENTS, []),
  saveStockMovements: (movements: StockMovement[]): void => saveToStorage(STORAGE_KEYS.STOCK_MOVEMENTS, movements),

  // Maintenance Equipment
  getMaintenanceEquipment: (): MaintenanceEquipment[] => getFromStorage(STORAGE_KEYS.MAINTENANCE_EQUIPMENT, []),
  saveMaintenanceEquipment: (equipment: MaintenanceEquipment[]): void => saveToStorage(STORAGE_KEYS.MAINTENANCE_EQUIPMENT, equipment),

  // Security Reports
  getSecurityReports: (): SecurityReport[] => getFromStorage(STORAGE_KEYS.SECURITY_REPORTS, []),
  saveSecurityReports: (reports: SecurityReport[]): void => saveToStorage(STORAGE_KEYS.SECURITY_REPORTS, reports),

  // Security Report Sections
  getSecurityReportSections: (): SecurityReportSection[] => getFromStorage(STORAGE_KEYS.SECURITY_REPORT_SECTIONS, []),
  saveSecurityReportSections: (sections: SecurityReportSection[]): void => saveToStorage(STORAGE_KEYS.SECURITY_REPORT_SECTIONS, sections)
};
