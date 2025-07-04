
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

export interface Vehicle {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: 'available' | 'in_use' | 'maintenance';
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
}

export interface MaintenanceEquipment {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'operational' | 'maintenance' | 'broken';
  lastMaintenance: string;
  nextMaintenance: string;
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
}
