
import { useState, useEffect } from 'react';
import { User, SectionUser } from '@/types';
import { dataService } from '@/services/dataService';

export const useAuth = () => {
  const [user, setUser] = useState<User | SectionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('mobis_current_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('mobis_current_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userId: string, password: string): Promise<{ success: boolean; message?: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Buscar primero en usuarios regulares
        const users = dataService.getUsers();
        const foundUser = users.find(u => u.userId === userId);
        
        if (foundUser) {
          // Verificar si el usuario está bloqueado
          if (foundUser.blockedUntil && new Date(foundUser.blockedUntil) > new Date()) {
            resolve({ success: false, message: 'Usuario bloqueado. Contacte al administrador.' });
            return;
          }

          if (foundUser.password === password) {
            // Login exitoso - resetear intentos fallidos
            foundUser.failedLoginAttempts = 0;
            foundUser.blockedUntil = undefined;
            dataService.updateUser(foundUser);
            
            console.log('Login successful with regular user:', foundUser);
            setUser(foundUser);
            localStorage.setItem('mobis_current_user', JSON.stringify(foundUser));
            resolve({ success: true });
            return;
          } else {
            // Password incorrecto - incrementar intentos fallidos
            const attempts = (foundUser.failedLoginAttempts || 0) + 1;
            foundUser.failedLoginAttempts = attempts;
            
            if (attempts >= 5) {
              // Bloquear usuario por 30 minutos
              const blockUntil = new Date();
              blockUntil.setMinutes(blockUntil.getMinutes() + 30);
              foundUser.blockedUntil = blockUntil.toISOString();
              dataService.updateUser(foundUser);
              resolve({ success: false, message: 'Usuario bloqueado por demasiados intentos fallidos.' });
              return;
            }
            
            dataService.updateUser(foundUser);
            resolve({ success: false, message: `Contraseña incorrecta. Intentos restantes: ${5 - attempts}` });
            return;
          }
        }

        // Buscar en usuarios de sección
        const sectionUsers = dataService.getSectionUsers();
        const foundSectionUser = sectionUsers.find(u => u.userId === userId);
        
        if (foundSectionUser) {
          // Verificar si el usuario está bloqueado
          if (foundSectionUser.blockedUntil && new Date(foundSectionUser.blockedUntil) > new Date()) {
            resolve({ success: false, message: 'Usuario bloqueado. Contacte al administrador.' });
            return;
          }

          if (foundSectionUser.password === password) {
            // Login exitoso - resetear intentos fallidos
            foundSectionUser.failedLoginAttempts = 0;
            foundSectionUser.blockedUntil = undefined;
            dataService.updateSectionUser(foundSectionUser);
            
            console.log('Login successful with section user:', foundSectionUser);
            setUser(foundSectionUser);
            localStorage.setItem('mobis_current_user', JSON.stringify(foundSectionUser));
            resolve({ success: true });
            return;
          } else {
            // Password incorrecto - incrementar intentos fallidos
            const attempts = (foundSectionUser.failedLoginAttempts || 0) + 1;
            foundSectionUser.failedLoginAttempts = attempts;
            
            if (attempts >= 5) {
              // Bloquear usuario por 30 minutos
              const blockUntil = new Date();
              blockUntil.setMinutes(blockUntil.getMinutes() + 30);
              foundSectionUser.blockedUntil = blockUntil.toISOString();
              dataService.updateSectionUser(foundSectionUser);
              resolve({ success: false, message: 'Usuario bloqueado por demasiados intentos fallidos.' });
              return;
            }
            
            dataService.updateSectionUser(foundSectionUser);
            resolve({ success: false, message: `Contraseña incorrecta. Intentos restantes: ${5 - attempts}` });
            return;
          }
        }

        console.log('Login failed for:', userId);
        resolve({ success: false, message: 'Usuario no encontrado' });
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mobis_current_user');
  };

  const hasAccess = (section: 'dashboard' | 'stock' | 'maintenance' | 'rooms' | 'security' | 'vehicles' | 'it' | 'dataManagement') => {
    if (!user) return false;
    
    if (section === 'dashboard') {
      if ('role' in user) return user.role === 'admin' || user.dashboardAccess;
      return user.dashboardAccess;
    }
    
    if (section === 'it' || section === 'dataManagement') {
      return 'role' in user && user.role === 'admin';
    }
    
    // Si es admin regular, tiene acceso a todas las secciones
    if ('role' in user && user.role === 'admin') return true;
    
    if ('sectionAccess' in user) {
      return user.sectionAccess[section as keyof typeof user.sectionAccess];
    }
    
    return false;
  };

  const isAdmin = (section?: 'stock' | 'maintenance' | 'rooms' | 'security' | 'vehicles') => {
    if (!user) return false;
    
    if ('role' in user && user.role === 'admin') return true;
    
    if (section && 'sectionRoles' in user) {
      return user.sectionRoles[section] === 'admin';
    }
    
    return false;
  };

  return {
    user,
    login,
    logout,
    loading,
    hasAccess,
    isAdmin
  };
};
