
// Servicio para manejo de datos locales usando localStorage y estructura de archivos JSON simulada
export class LocalStorageService {
  private static instance: LocalStorageService;
  
  private constructor() {}
  
  static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  // Método genérico para guardar datos
  saveData<T>(key: string, data: T): void {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      localStorage.setItem(key, jsonData);
      console.log(`Datos guardados en ${key}:`, data);
    } catch (error) {
      console.error(`Error guardando datos en ${key}:`, error);
    }
  }

  // Método genérico para cargar datos
  loadData<T>(key: string, defaultValue: T): T {
    try {
      const jsonData = localStorage.getItem(key);
      if (jsonData) {
        const parsedData = JSON.parse(jsonData);
        console.log(`Datos cargados de ${key}:`, parsedData);
        return parsedData;
      }
    } catch (error) {
      console.error(`Error cargando datos de ${key}:`, error);
    }
    return defaultValue;
  }

  // Método para eliminar datos
  removeData(key: string): void {
    localStorage.removeItem(key);
    console.log(`Datos eliminados de ${key}`);
  }

  // Método para verificar si existen datos
  hasData(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  // Método para exportar todos los datos
  exportAllData(): Record<string, any> {
    const allData: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('mobis_')) {
        try {
          allData[key] = JSON.parse(localStorage.getItem(key) || '{}');
        } catch (error) {
          console.error(`Error exportando ${key}:`, error);
        }
      }
    }
    return allData;
  }

  // Método para importar datos
  importAllData(data: Record<string, any>): void {
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith('mobis_')) {
        this.saveData(key, value);
      }
    });
  }
}
