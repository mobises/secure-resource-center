
export interface User {
  id: string;
  name: string;
  userId: string; // Cambio de email a ID de usuario
  password: string;
  role: 'admin' | 'user' | 'manager';
  permissions: string[];
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string;
  amenities: string[];
  available: boolean;
}

export interface Reservation {
  id: string;
  roomId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  attendees: number;
}

export interface ItRequest {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'hardware' | 'software' | 'network' | 'access';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  type: 'breach' | 'physical' | 'cyber' | 'policy';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'resolved';
  reportedBy: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  type: string;
  status: 'available' | 'maintenance' | 'reserved';
  maxReservationDays?: number;
}

export interface VehicleReservation {
  id: string;
  vehicleId: string;
  userId: string;
  startDate: string;
  endDate: string;
  purpose: string;
  destination: string;
  status: 'pending' | 'approved' | 'rejected';
  driverLicense: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeReservations: number;
  pendingItRequests: number;
  securityIncidents: number;
  availableVehicles: number;
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'reservation' | 'it_request' | 'security' | 'vehicle';
  description: string;
  timestamp: string;
  user: string;
}

export interface Module {
  id: string;
  name: string;
  icon: string;
  description: string;
  permissions: string[];
}

// Nuevos tipos actualizados para el sistema IT mejorado
export interface SectionUser {
  id: string;
  name: string;
  userId: string; // Cambio de email a userId
  password: string;
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

export interface DeviceType {
  id: string;
  name: string;
  category: string;
  subcategory: string;
}

export interface StockMovement {
  id: string;
  deviceTypeId: string;
  deviceTypeName: string;
  deviceCategory: string;
  deviceSubcategory: string;
  movementType: 'alta' | 'baja';
  units: number;
  date: string;
  recipientId?: string;
  recipientName?: string;
  createdBy: string;
  createdById: string;
  createdAt: string;
  modifiedBy?: string;
  modifiedById?: string;
  modifiedAt?: string;
}

export interface MaintenanceEquipment {
  id: string;
  name: string;
  deviceType: string;
  serialNumber: string;
  lastMaintenance: string;
  nextMaintenance: string;
  status: 'operativo' | 'mantenimiento' | 'averiado';
  location: string;
  createdBy: string;
  createdAt: string;
}

// Nuevos tipos para el sistema de reportes de seguridad
export interface SecurityReportSection {
  id: string;
  name: string;
  subsections: SecurityReportSubsection[];
}

export interface SecurityReportSubsection {
  id: string;
  name: string;
  question: string;
}

export interface SecurityReport {
  id: string;
  reportDate: string;
  responses: { [subsectionId: string]: number }; // Respuestas de 1-5
  totalScore: number;
  maxScore: number;
  createdBy: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  section: 'stock' | 'maintenance' | 'rooms' | 'security' | 'vehicles';
  message: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
  createdAt: string;
}

// Nuevos tipos para empleados/usuarios del sistema
export interface Employee {
  id: string;
  name: string;
  userId: string;
  department: string;
  position: string;
  active: boolean;
}

// Configuración de salas
export interface RoomConfig {
  id: string;
  name: string;
  resources: RoomResource[];
  maxCapacity: number;
  location: string;
  active: boolean;
}

export interface RoomResource {
  id: string;
  name: string;
  quantity: number;
  type: 'furniture' | 'equipment' | 'technology';
}
