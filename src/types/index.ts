
export interface User {
  id: string;
  name: string;
  email: string;
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
