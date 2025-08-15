
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
  SECURITY_REPORT_SECTIONS: 'securityReportSections',
  HOLIDAYS: 'holidays'
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

// Default data - Datos persistentes mejorados
const defaultUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    userId: 'admin',
    password: 'admin123',
    role: 'admin',
    permissions: ['all'],
    dashboardAccess: true
  },
  {
    id: '2',
    name: 'Regular User',
    userId: 'user',
    password: 'user123',
    role: 'user',
    permissions: ['read'],
    dashboardAccess: true
  },
  {
    id: '3',
    name: 'Juan Pérez',
    userId: 'juan.perez',
    password: 'juan123',
    role: 'user',
    permissions: ['read'],
    dashboardAccess: true
  },
  {
    id: '4',
    name: 'María García',
    userId: 'maria.garcia',
    password: 'maria123',
    role: 'user',
    permissions: ['read'],
    dashboardAccess: true
  }
];

const defaultSectionUsers: SectionUser[] = [
  {
    id: '1',
    name: 'Section Admin',
    userId: 'section_admin',
    password: 'admin123',
    dashboardAccess: true,
    lastPasswordChange: new Date().toISOString(),
    sectionRoles: {
      stock: 'admin',
      maintenance: 'admin',
      rooms: 'admin',
      security: 'admin',
      vehicles: 'admin',
      it: 'admin'
    },
    sectionAccess: {
      stock: true,
      maintenance: true,
      rooms: true,
      security: true,
      vehicles: true,
      it: true
    }
  },
  {
    id: '2',
    name: 'José Martínez',
    userId: 'jose.martinez',
    password: 'jose123',
    dashboardAccess: true,
    lastPasswordChange: new Date().toISOString(),
    sectionRoles: {
      stock: 'user',
      maintenance: null,
      rooms: 'user',
      security: null,
      vehicles: 'user',
      it: null
    },
    sectionAccess: {
      stock: true,
      maintenance: false,
      rooms: true,
      security: false,
      vehicles: true,
      it: false
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
  },
  {
    id: '3',
    name: 'Sala de Reuniones Pequeña',
    capacity: 4,
    location: 'Piso 1',
    equipment: ['TV', 'Pizarra'],
    status: 'available',
    amenities: ['WiFi']
  }
];

const defaultRoomReservations: RoomReservation[] = [
  {
    id: '1',
    roomId: '1',
    roomName: 'Sala de Juntas Principal',
    userId: '1',
    userName: 'Admin User',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '12:00',
    purpose: 'Reunión de planificación mensual',
    status: 'approved',
    createdAt: new Date().toISOString(),
    attendees: 8
  },
  {
    id: '2',
    roomId: '2',
    roomName: 'Sala de Conferencias',
    userId: '2',
    userName: 'Regular User',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Mañana
    startTime: '14:00',
    endTime: '16:00',
    purpose: 'Presentación de resultados',
    status: 'pending',
    createdAt: new Date().toISOString(),
    attendees: 6
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
    year: 2022,
    maxReservationDays: 7
  },
  {
    id: '2',
    name: 'Ford Transit 2021',
    type: 'Van',
    capacity: 12,
    status: 'available',
    brand: 'Ford',
    model: 'Transit',
    licensePlate: 'DEF-456',
    year: 2021,
    maxReservationDays: 14
  },
  {
    id: '3',
    name: 'Nissan Altima 2023',
    type: 'Sedan',
    capacity: 5,
    status: 'available',
    brand: 'Nissan',
    model: 'Altima',
    licensePlate: 'GHI-789',
    year: 2023,
    maxReservationDays: 10
  }
];

const defaultVehicleReservations: VehicleReservation[] = [
  {
    id: '1',
    vehicleId: '1',
    vehicleName: 'Toyota Camry 2022',
    userId: '1',
    userName: 'Admin User',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], // 2 días
    startTime: '08:00',
    endTime: '18:00',
    purpose: 'Visita a cliente',
    destination: 'Madrid Centro',
    status: 'approved',
    createdAt: new Date().toISOString(),
    licensePlate: 'ABC-123'
  },
  {
    id: '2',
    vehicleId: '2',
    vehicleName: 'Ford Transit 2021',
    userId: '2',
    userName: 'Regular User',
    startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Mañana
    endDate: new Date(Date.now() + 259200000).toISOString().split('T')[0], // 3 días
    startTime: '09:00',
    endTime: '17:00',
    purpose: 'Transporte de equipo',
    destination: 'Barcelona',
    status: 'pending',
    createdAt: new Date().toISOString(),
    licensePlate: 'DEF-456'
  }
];

export const dataService = {
  // Users
  getUsers: (): User[] => getFromStorage(STORAGE_KEYS.USERS, defaultUsers),
  saveUsers: (users: User[]): void => saveToStorage(STORAGE_KEYS.USERS, users),
  updateUser: (updatedUser: User): void => {
    const users = getFromStorage(STORAGE_KEYS.USERS, defaultUsers);
    const updatedUsers = users.map(user => user.id === updatedUser.id ? updatedUser : user);
    saveToStorage(STORAGE_KEYS.USERS, updatedUsers);
  },

  // Section Users
  getSectionUsers: (): SectionUser[] => getFromStorage(STORAGE_KEYS.SECTION_USERS, defaultSectionUsers),
  saveSectionUsers: (users: SectionUser[]): void => saveToStorage(STORAGE_KEYS.SECTION_USERS, users),
  updateSectionUser: (updatedUser: SectionUser): void => {
    const users = getFromStorage(STORAGE_KEYS.SECTION_USERS, defaultSectionUsers);
    const updatedUsers = users.map(user => user.id === updatedUser.id ? updatedUser : user);
    saveToStorage(STORAGE_KEYS.SECTION_USERS, updatedUsers);
  },

  // Rooms
  getRooms: (): Room[] => getFromStorage(STORAGE_KEYS.ROOMS, defaultRooms),
  saveRooms: (rooms: Room[]): void => saveToStorage(STORAGE_KEYS.ROOMS, rooms),

  // Room Configs
  getRoomConfigs: (): RoomConfig[] => getFromStorage(STORAGE_KEYS.ROOM_CONFIGS, []),
  saveRoomConfigs: (configs: RoomConfig[]): void => saveToStorage(STORAGE_KEYS.ROOM_CONFIGS, configs),

  // Room Reservations
  getRoomReservations: (): RoomReservation[] => getFromStorage(STORAGE_KEYS.ROOM_RESERVATIONS, defaultRoomReservations),
  saveRoomReservations: (reservations: RoomReservation[]): void => saveToStorage(STORAGE_KEYS.ROOM_RESERVATIONS, reservations),

  // Room Schedule Config
  getRoomScheduleConfig: (): RoomScheduleConfig[] => getFromStorage(STORAGE_KEYS.ROOM_SCHEDULE_CONFIG, []),
  saveRoomScheduleConfig: (config: RoomScheduleConfig[]): void => saveToStorage(STORAGE_KEYS.ROOM_SCHEDULE_CONFIG, config),

  // Holidays
  getHolidays: (): Holiday[] => getFromStorage(STORAGE_KEYS.HOLIDAYS, []),
  saveHolidays: (holidays: Holiday[]): void => saveToStorage(STORAGE_KEYS.HOLIDAYS, holidays),

  // Vehicles
  getVehicles: (): Vehicle[] => getFromStorage(STORAGE_KEYS.VEHICLES, defaultVehicles),
  saveVehicles: (vehicles: Vehicle[]): void => saveToStorage(STORAGE_KEYS.VEHICLES, vehicles),

  // Vehicle Reservations
  getVehicleReservations: (): VehicleReservation[] => getFromStorage(STORAGE_KEYS.VEHICLE_RESERVATIONS, defaultVehicleReservations),
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
  saveSecurityReportSections: (sections: SecurityReportSection[]): void => saveToStorage(STORAGE_KEYS.SECURITY_REPORT_SECTIONS, sections),

  // Export all data as JSON string
  exportAllData: (): string => {
    const allData = {
      users: getFromStorage(STORAGE_KEYS.USERS, defaultUsers),
      sectionUsers: getFromStorage(STORAGE_KEYS.SECTION_USERS, defaultSectionUsers),
      rooms: getFromStorage(STORAGE_KEYS.ROOMS, defaultRooms),
      roomConfigs: getFromStorage(STORAGE_KEYS.ROOM_CONFIGS, []),
      roomReservations: getFromStorage(STORAGE_KEYS.ROOM_RESERVATIONS, defaultRoomReservations),
      roomScheduleConfig: getFromStorage(STORAGE_KEYS.ROOM_SCHEDULE_CONFIG, []),
      holidays: getFromStorage(STORAGE_KEYS.HOLIDAYS, []),
      vehicles: getFromStorage(STORAGE_KEYS.VEHICLES, defaultVehicles),
      vehicleReservations: getFromStorage(STORAGE_KEYS.VEHICLE_RESERVATIONS, defaultVehicleReservations),
      stockMovements: getFromStorage(STORAGE_KEYS.STOCK_MOVEMENTS, []),
      maintenanceEquipment: getFromStorage(STORAGE_KEYS.MAINTENANCE_EQUIPMENT, []),
      securityReports: getFromStorage(STORAGE_KEYS.SECURITY_REPORTS, []),
      securityReportSections: getFromStorage(STORAGE_KEYS.SECURITY_REPORT_SECTIONS, [])
    };
    return JSON.stringify(allData, null, 2);
  },

  // Import data from JSON string
  importData: (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      // Save each data type if it exists in the imported data
      if (data.users) saveToStorage(STORAGE_KEYS.USERS, data.users);
      if (data.sectionUsers) saveToStorage(STORAGE_KEYS.SECTION_USERS, data.sectionUsers);
      if (data.rooms) saveToStorage(STORAGE_KEYS.ROOMS, data.rooms);
      if (data.roomConfigs) saveToStorage(STORAGE_KEYS.ROOM_CONFIGS, data.roomConfigs);
      if (data.roomReservations) saveToStorage(STORAGE_KEYS.ROOM_RESERVATIONS, data.roomReservations);
      if (data.roomScheduleConfig) saveToStorage(STORAGE_KEYS.ROOM_SCHEDULE_CONFIG, data.roomScheduleConfig);
      if (data.holidays) saveToStorage(STORAGE_KEYS.HOLIDAYS, data.holidays);
      if (data.vehicles) saveToStorage(STORAGE_KEYS.VEHICLES, data.vehicles);
      if (data.vehicleReservations) saveToStorage(STORAGE_KEYS.VEHICLE_RESERVATIONS, data.vehicleReservations);
      if (data.stockMovements) saveToStorage(STORAGE_KEYS.STOCK_MOVEMENTS, data.stockMovements);
      if (data.maintenanceEquipment) saveToStorage(STORAGE_KEYS.MAINTENANCE_EQUIPMENT, data.maintenanceEquipment);
      if (data.securityReports) saveToStorage(STORAGE_KEYS.SECURITY_REPORTS, data.securityReports);
      if (data.securityReportSections) saveToStorage(STORAGE_KEYS.SECURITY_REPORT_SECTIONS, data.securityReportSections);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },

  // Clear all data from localStorage
  clearAllData: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};
