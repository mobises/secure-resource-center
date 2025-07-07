
// Tipos principales del sistema
export interface User {
  id: string;
  name: string;
  userId: string;
  password: string;
  role: 'admin' | 'user';
  permissions: string[];
  dashboardAccess?: boolean;
  blockedUntil?: string;
  failedLoginAttempts?: number;
  lastPasswordChange?: string;
  passwordHistory?: string[];
}

export interface SectionUser {
  id: string;
  name: string;
  userId: string;
  password: string;
  dashboardAccess: boolean;
  blockedUntil?: string;
  failedLoginAttempts?: number;
  lastPasswordChange?: string;
  passwordHistory?: string[];
  sectionRoles: {
    stock: 'admin' | 'user' | null;
    maintenance: 'admin' | 'user' | null;
    rooms: 'admin' | 'user' | null;
    security: 'admin' | 'user' | null;
    vehicles: 'admin' | 'user' | null;
  };
  sectionAccess: {
    stock: boolean;
    maintenance: boolean;
    rooms: boolean;
    security: boolean;
    vehicles: boolean;
  };
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string;
  equipment: string[];
  status: 'available' | 'occupied' | 'maintenance' | 'unavailable';
  amenities?: string[];
  available?: boolean;
}

export interface RoomReservation {
  id: string;
  roomId: string;
  roomName: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string;
  attendees?: number;
  isNew?: boolean; // Para notificaciones
}

export interface Reservation {
  id: string;
  roomId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  attendees: number;
}

export interface RoomConfig {
  id: string;
  name: string;
  maxCapacity: number;
  location: string;
  active: boolean;
  status?: 'available' | 'unavailable';
  resources?: RoomResource[];
}

export interface RoomResource {
  id: string;
  name: string;
  quantity: number;
  type: 'furniture' | 'equipment' | 'technology';
}

export interface RoomScheduleConfig {
  year: number;
  month: number;
  dayOfWeek: number; // 0 = Lunes, 6 = Domingo
  startTime: string;
  endTime: string;
  enabled: boolean;
}

export interface Holiday {
  id: string;
  day: number;
  month: number;
  year: number;
  comment: string;
}

export interface VehicleType {
  id: string;
  name: string;
  fuelType: 'electric' | 'gasoline' | 'diesel' | 'hybrid' | 'pluginHybrid';
  maxRange?: number; // Kilometros maximos antes de recargar/repostar
}

export interface Vehicle {
  id: string;
  name?: string;
  type: string;
  typeId?: string;
  capacity?: number;
  status: 'available' | 'in_use' | 'maintenance' | 'unavailable';
  brand?: string;
  model?: string;
  licensePlate?: string;
  year?: number;
  maxReservationDays?: number;
  currentKilometers?: number;
  fuelType?: 'electric' | 'gasoline' | 'diesel' | 'hybrid' | 'pluginHybrid';
  maxKmPerTank?: number; // Km máximos por depósito
  batteryPercentage?: number; // Para vehículos eléctricos
  fuelPercentage?: number; // Para vehículos no eléctricos
}

export interface VehicleReservation {
  id: string;
  vehicleId: string;
  vehicleName: string;
  userId: string;
  userName: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed' | 'active';
  createdAt: string;
  destination?: string;
  driverLicense?: string; // Mantenemos para compatibilidad
  licensePlate?: string; // Matrícula del vehículo
  startTime?: string;
  endTime?: string;
  initialKilometers?: number; // Km iniciales
  finalKilometers?: number; // Km finales
  initialBatteryPercentage?: number; // Batería inicial para eléctricos
  finalBatteryPercentage?: number; // Batería final para eléctricos
  initialFuelPercentage?: number; // Combustible inicial para no eléctricos
  finalFuelPercentage?: number; // Combustible final para no eléctricos
  isNew?: boolean; // Para notificaciones
  isClosed?: boolean; // Si la reserva está cerrada
}

export interface AdminNotification {
  id: string;
  type: 'room_reservation' | 'vehicle_reservation';
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  relatedId: string; // ID de la reserva relacionada
}

export interface StockMovement {
  id: string;
  deviceTypeId: string;
  deviceTypeName: string;
  deviceCategory: string;
  deviceSubcategory: string;
  movementType: 'alta' | 'baja';
  units: number;
  reason: string;
  userId: string;
  userName: string;
  date: string;
  createdAt: string;
  recipientId?: string;
  recipientName?: string;
  createdBy?: string;
  createdById?: string;
  modifiedBy?: string;
  modifiedById?: string;
}

export interface MaintenanceEquipment {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'operational' | 'maintenance' | 'broken';
  lastMaintenance: string;
  nextMaintenance: string;
  deviceType?: string;
  serialNumber?: string;
  createdBy?: string;
  createdAt?: string;
  purchaseDate?: string;
}

export interface SecurityReportSection {
  id: string;
  name: string;
  subsections: {
    id: string;
    name: string;
    question: string;
  }[];
}

export interface SecurityReportResponse {
  questionId: string;
  question: string;
  answer: number;
  maxScore: number;
}

export interface SecurityReport {
  id: string;
  type?: string;
  description?: string;
  location?: string;
  severity?: 'low' | 'medium' | 'high';
  status?: 'open' | 'in_progress' | 'closed';
  reportedBy?: string;
  reportedAt?: string;
  resolvedAt?: string;
  reportDate?: string;
  totalScore?: number;
  maxScore?: number;
  createdBy?: string;
  createdAt?: string;
  responses?: SecurityReportResponse[];
  sections?: SecurityReportSection[];
}

export interface DeviceType {
  id: string;
  name: string;
  category: string;
  subcategory: string;
}

export interface Employee {
  id: string;
  name: string;
  userId?: string;
  department: string;
  position?: string;
  active: boolean;
}
