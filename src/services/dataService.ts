// Servicio de datos que maneja la persistencia local
class DataService {
  // Usuarios del sistema
  private readonly USERS_KEY = 'mobis_users';
  private readonly SECTION_USERS_KEY = 'mobis_section_users';
  
  // Salas y configuraciones
  private readonly ROOMS_KEY = 'mobis_rooms';
  private readonly ROOM_CONFIGS_KEY = 'mobis_room_configs';
  private readonly ROOM_RESERVATIONS_KEY = 'mobis_room_reservations';
  private readonly ROOM_SCHEDULE_CONFIG_KEY = 'mobis_room_schedule_config';
  
  // Vehículos
  private readonly VEHICLES_KEY = 'mobis_vehicles';
  private readonly VEHICLE_RESERVATIONS_KEY = 'mobis_vehicle_reservations';
  
  // Stock y mantenimiento
  private readonly STOCK_MOVEMENTS_KEY = 'mobis_stock_movements';
  private readonly MAINTENANCE_EQUIPMENT_KEY = 'mobis_maintenance_equipment';
  
  // Seguridad
  private readonly SECURITY_REPORTS_KEY = 'mobis_security_reports';
  private readonly SECURITY_REPORT_SECTIONS_KEY = 'mobis_security_report_sections';

  // Obtener datos con valores por defecto
  private getData<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error loading data for key ${key}:`, error);
      return defaultValue;
    }
  }

  // Guardar datos
  private saveData<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving data for key ${key}:`, error);
    }
  }

  // Usuarios principales
  getUsers() {
    return this.getData(this.USERS_KEY, [
      {
        id: '1',
        name: 'Administrador',
        userId: 'admin',
        password: 'admin',
        role: 'admin' as const,
        permissions: ['all']
      }
    ]);
  }

  saveUsers(users: any[]) {
    this.saveData(this.USERS_KEY, users);
  }

  // Usuarios de sección
  getSectionUsers() {
    return this.getData(this.SECTION_USERS_KEY, [
      {
        id: '1',
        name: 'Admin IT',
        userId: 'admin001',
        password: '12345',
        sectionRoles: {
          stock: 'admin' as const,
          maintenance: 'admin' as const,
          rooms: 'admin' as const,
          security: 'admin' as const,
          vehicles: 'admin' as const
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

  saveSectionUsers(users: any[]) {
    this.saveData(this.SECTION_USERS_KEY, users);
  }

  // Salas
  getRooms() {
    return this.getData(this.ROOMS_KEY, [
      {
        id: '1',
        name: 'Sala de Reuniones A',
        capacity: 10,
        location: 'Planta 1',
        equipment: ['Proyector', 'Pizarra'],
        status: 'available'
      }
    ]);
  }

  saveRooms(rooms: any[]) {
    this.saveData(this.ROOMS_KEY, rooms);
  }

  // Configuraciones de salas
  getRoomConfigs() {
    return this.getData(this.ROOM_CONFIGS_KEY, []);
  }

  saveRoomConfigs(configs: any[]) {
    this.saveData(this.ROOM_CONFIGS_KEY, configs);
  }

  // Reservas de salas
  getRoomReservations() {
    return this.getData(this.ROOM_RESERVATIONS_KEY, []);
  }

  saveRoomReservations(reservations: any[]) {
    this.saveData(this.ROOM_RESERVATIONS_KEY, reservations);
  }

  // Room Schedule Configuration
  getRoomScheduleConfig() {
    return this.getData(this.ROOM_SCHEDULE_CONFIG_KEY, []);
  }

  saveRoomScheduleConfig(config: any[]) {
    this.saveData(this.ROOM_SCHEDULE_CONFIG_KEY, config);
  }

  // Vehículos
  getVehicles() {
    return this.getData(this.VEHICLES_KEY, [
      {
        id: '1',
        name: 'Toyota Corolla',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2022,
        licensePlate: 'ABC-123',
        type: 'Sedan',
        status: 'available' as const
      }
    ]);
  }

  saveVehicles(vehicles: any[]) {
    this.saveData(this.VEHICLES_KEY, vehicles);
  }

  // Reservas de vehículos
  getVehicleReservations() {
    return this.getData(this.VEHICLE_RESERVATIONS_KEY, []);
  }

  saveVehicleReservations(reservations: any[]) {
    this.saveData(this.VEHICLE_RESERVATIONS_KEY, reservations);
  }

  // Movimientos de stock
  getStockMovements() {
    return this.getData(this.STOCK_MOVEMENTS_KEY, []);
  }

  saveStockMovements(movements: any[]) {
    this.saveData(this.STOCK_MOVEMENTS_KEY, movements);
  }

  // Equipos de mantenimiento
  getMaintenanceEquipment() {
    return this.getData(this.MAINTENANCE_EQUIPMENT_KEY, []);
  }

  saveMaintenanceEquipment(equipment: any[]) {
    this.saveData(this.MAINTENANCE_EQUIPMENT_KEY, equipment);
  }

  // Reportes de seguridad
  getSecurityReports() {
    return this.getData(this.SECURITY_REPORTS_KEY, []);
  }

  saveSecurityReports(reports: any[]) {
    this.saveData(this.SECURITY_REPORTS_KEY, reports);
  }

  // Security Report Sections
  getSecurityReportSections() {
    return this.getData(this.SECURITY_REPORT_SECTIONS_KEY, []);
  }

  saveSecurityReportSections(sections: any[]) {
    this.saveData(this.SECURITY_REPORT_SECTIONS_KEY, sections);
  }

  // Exportar todos los datos
  exportAllData(): string {
    const allData = {
      users: this.getUsers(),
      sectionUsers: this.getSectionUsers(),
      rooms: this.getRooms(),
      roomConfigs: this.getRoomConfigs(),
      roomReservations: this.getRoomReservations(),
      vehicles: this.getVehicles(),
      vehicleReservations: this.getVehicleReservations(),
      stockMovements: this.getStockMovements(),
      maintenanceEquipment: this.getMaintenanceEquipment(),
      securityReports: this.getSecurityReports()
    };
    return JSON.stringify(allData, null, 2);
  }

  // Importar datos
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.users) this.saveUsers(data.users);
      if (data.sectionUsers) this.saveSectionUsers(data.sectionUsers);
      if (data.rooms) this.saveRooms(data.rooms);
      if (data.roomConfigs) this.saveRoomConfigs(data.roomConfigs);
      if (data.roomReservations) this.saveRoomReservations(data.roomReservations);
      if (data.vehicles) this.saveVehicles(data.vehicles);
      if (data.vehicleReservations) this.saveVehicleReservations(data.vehicleReservations);
      if (data.stockMovements) this.saveStockMovements(data.stockMovements);
      if (data.maintenanceEquipment) this.saveMaintenanceEquipment(data.maintenanceEquipment);
      if (data.securityReports) this.saveSecurityReports(data.securityReports);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Limpiar todos los datos
  clearAllData(): void {
    const keys = [
      this.USERS_KEY,
      this.SECTION_USERS_KEY,
      this.ROOMS_KEY,
      this.ROOM_CONFIGS_KEY,
      this.ROOM_RESERVATIONS_KEY,
      this.VEHICLES_KEY,
      this.VEHICLE_RESERVATIONS_KEY,
      this.STOCK_MOVEMENTS_KEY,
      this.MAINTENANCE_EQUIPMENT_KEY,
      this.SECURITY_REPORTS_KEY
    ];
    
    keys.forEach(key => localStorage.removeItem(key));
  }
}

export const dataService = new DataService();
