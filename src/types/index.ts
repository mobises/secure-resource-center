
// Tipos principales del sistema
export interface User {
  id: string;
  name: string;
  userId: string;
  password: string;
  role: 'admin' | 'user';
  permissions: string[];
}

export interface SectionUser {
  id: string;
  name: string;
  userId: string;
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

export interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string;
  equipment: string[];
  status: 'available' | 'occupied' | 'maintenance';
  amenities?: string[];
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
  resources?: RoomResource[];
}

export interface RoomResource {
  id: string;
  name: string;
  quantity: number;
  type: 'furniture' | 'equipment' | 'technology';
}

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: 'available' | 'in_use' | 'maintenance';
  brand?: string;
  model?: string;
  licensePlate?: string;
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
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  createdAt: string;
  destination?: string;
  driverLicense?: string;
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
}

export interface SecurityReport {
  id: string;
  type: string;
  description: string;
  location: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'closed';
  reportedBy: string;
  reportedAt: string;
  resolvedAt?: string;
  reportDate?: string;
  totalScore?: number;
  maxScore?: number;
  createdBy?: string;
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
  department: string;
  active: boolean;
}
