
import { LocalStorageService } from './localStorageService';
import { 
  User, 
  SectionUser, 
  Room, 
  Reservation, 
  Vehicle, 
  VehicleReservation, 
  StockMovement, 
  MaintenanceEquipment, 
  SecurityReport,
  DeviceType,
  Employee,
  RoomConfig
} from '@/types';

export class DataService {
  private storage: LocalStorageService;

  constructor() {
    this.storage = LocalStorageService.getInstance();
    this.initializeDefaultData();
  }

  // Inicializar datos por defecto si no existen
  private initializeDefaultData(): void {
    if (!this.storage.hasData('mobis_users')) {
      this.saveUsers([
        {
          id: '1',
          name: 'Admin Principal',
          userId: 'admin',
          password: '12345',
          role: 'admin',
          permissions: ['all']
        }
      ]);
    }

    if (!this.storage.hasData('mobis_section_users')) {
      this.saveSectionUsers([
        {
          id: '1',
          name: 'Admin IT',
          userId: 'admin001',
          password: '12345',
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
      ]);
    }

    if (!this.storage.hasData('mobis_rooms')) {
      this.saveRooms([
        {
          id: '1',
          name: 'Sala de Conferencias A',
          capacity: 10,
          location: 'Piso 1',
          amenities: ['Proyector', 'Pizarra'],
          available: true
        },
        {
          id: '2',
          name: 'Sala de Reuniones B',
          capacity: 6,
          location: 'Piso 2',
          amenities: ['TV', 'Mesa redonda'],
          available: true
        }
      ]);
    }

    if (!this.storage.hasData('mobis_vehicles')) {
      this.saveVehicles([
        {
          id: '1',
          brand: 'Toyota',
          model: 'Corolla',
          year: 2022,
          licensePlate: 'ABC-123',
          type: 'Sedán',
          status: 'available',
          maxReservationDays: 7
        },
        {
          id: '2',
          brand: 'Ford',
          model: 'Transit',
          year: 2021,
          licensePlate: 'XYZ-789',
          type: 'Van',
          status: 'available',
          maxReservationDays: 5
        }
      ]);
    }
  }

  // Métodos para Usuarios
  getUsers(): User[] {
    return this.storage.loadData('mobis_users', []);
  }

  saveUsers(users: User[]): void {
    this.storage.saveData('mobis_users', users);
  }

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  }

  updateUser(updatedUser: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      this.saveUsers(users);
    }
  }

  deleteUser(userId: string): void {
    const users = this.getUsers().filter(u => u.id !== userId);
    this.saveUsers(users);
  }

  // Métodos para Usuarios de Sección
  getSectionUsers(): SectionUser[] {
    return this.storage.loadData('mobis_section_users', []);
  }

  saveSectionUsers(users: SectionUser[]): void {
    this.storage.saveData('mobis_section_users', users);
  }

  addSectionUser(user: SectionUser): void {
    const users = this.getSectionUsers();
    users.push(user);
    this.saveSectionUsers(users);
  }

  updateSectionUser(updatedUser: SectionUser): void {
    const users = this.getSectionUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      this.saveSectionUsers(users);
    }
  }

  // Métodos para Salas
  getRooms(): Room[] {
    return this.storage.loadData('mobis_rooms', []);
  }

  saveRooms(rooms: Room[]): void {
    this.storage.saveData('mobis_rooms', rooms);
  }

  // Métodos para Reservas de Salas
  getRoomReservations(): Reservation[] {
    return this.storage.loadData('mobis_room_reservations', []);
  }

  saveRoomReservations(reservations: Reservation[]): void {
    this.storage.saveData('mobis_room_reservations', reservations);
  }

  addRoomReservation(reservation: Reservation): void {
    const reservations = this.getRoomReservations();
    reservations.push(reservation);
    this.saveRoomReservations(reservations);
  }

  // Métodos para Vehículos
  getVehicles(): Vehicle[] {
    return this.storage.loadData('mobis_vehicles', []);
  }

  saveVehicles(vehicles: Vehicle[]): void {
    this.storage.saveData('mobis_vehicles', vehicles);
  }

  // Métodos para Reservas de Vehículos
  getVehicleReservations(): VehicleReservation[] {
    return this.storage.loadData('mobis_vehicle_reservations', []);
  }

  saveVehicleReservations(reservations: VehicleReservation[]): void {
    this.storage.saveData('mobis_vehicle_reservations', reservations);
  }

  addVehicleReservation(reservation: VehicleReservation): void {
    const reservations = this.getVehicleReservations();
    reservations.push(reservation);
    this.saveVehicleReservations(reservations);
  }

  // Métodos para Movimientos de Stock
  getStockMovements(): StockMovement[] {
    return this.storage.loadData('mobis_stock_movements', []);
  }

  saveStockMovements(movements: StockMovement[]): void {
    this.storage.saveData('mobis_stock_movements', movements);
  }

  addStockMovement(movement: StockMovement): void {
    const movements = this.getStockMovements();
    movements.push(movement);
    this.saveStockMovements(movements);
  }

  // Métodos para Tipos de Dispositivos
  getDeviceTypes(): DeviceType[] {
    return this.storage.loadData('mobis_device_types', []);
  }

  saveDeviceTypes(deviceTypes: DeviceType[]): void {
    this.storage.saveData('mobis_device_types', deviceTypes);
  }

  // Métodos para Equipos de Mantenimiento
  getMaintenanceEquipment(): MaintenanceEquipment[] {
    return this.storage.loadData('mobis_maintenance_equipment', []);
  }

  saveMaintenanceEquipment(equipment: MaintenanceEquipment[]): void {
    this.storage.saveData('mobis_maintenance_equipment', equipment);
  }

  addMaintenanceEquipment(equipment: MaintenanceEquipment): void {
    const allEquipment = this.getMaintenanceEquipment();
    allEquipment.push(equipment);
    this.saveMaintenanceEquipment(allEquipment);
  }

  // Métodos para Reportes de Seguridad
  getSecurityReports(): SecurityReport[] {
    return this.storage.loadData('mobis_security_reports', []);
  }

  saveSecurityReports(reports: SecurityReport[]): void {
    this.storage.saveData('mobis_security_reports', reports);
  }

  addSecurityReport(report: SecurityReport): void {
    const reports = this.getSecurityReports();
    reports.push(report);
    this.saveSecurityReports(reports);
  }

  // Métodos para Empleados
  getEmployees(): Employee[] {
    return this.storage.loadData('mobis_employees', []);
  }

  saveEmployees(employees: Employee[]): void {
    this.storage.saveData('mobis_employees', employees);
  }

  // Métodos para Configuración de Salas
  getRoomConfigs(): RoomConfig[] {
    return this.storage.loadData('mobis_room_configs', []);
  }

  saveRoomConfigs(configs: RoomConfig[]): void {
    this.storage.saveData('mobis_room_configs', configs);
  }

  // Método para exportar todos los datos
  exportAllData(): string {
    const allData = this.storage.exportAllData();
    return JSON.stringify(allData, null, 2);
  }

  // Método para importar datos desde JSON
  importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      this.storage.importAllData(data);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Método para limpiar todos los datos
  clearAllData(): void {
    const keys = [
      'mobis_users', 'mobis_section_users', 'mobis_rooms', 'mobis_room_reservations',
      'mobis_vehicles', 'mobis_vehicle_reservations', 'mobis_stock_movements',
      'mobis_device_types', 'mobis_maintenance_equipment', 'mobis_security_reports',
      'mobis_employees', 'mobis_room_configs'
    ];
    
    keys.forEach(key => this.storage.removeData(key));
    this.initializeDefaultData();
  }
}

// Instancia singleton del servicio de datos
export const dataService = new DataService();
