
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

  const login = (userId: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Buscar primero en usuarios regulares
        const users = dataService.getUsers();
        const foundUser = users.find(u => u.userId === userId && u.password === password);
        
        if (foundUser) {
          console.log('Login successful with regular user:', foundUser);
          setUser(foundUser);
          localStorage.setItem('mobis_current_user', JSON.stringify(foundUser));
          resolve(true);
          return;
        }

        // Buscar en usuarios de sección
        const sectionUsers = dataService.getSectionUsers();
        const foundSectionUser = sectionUsers.find(u => u.userId === userId && u.password === password);
        
        if (foundSectionUser) {
          console.log('Login successful with section user:', foundSectionUser);
          setUser(foundSectionUser);
          localStorage.setItem('mobis_current_user', JSON.stringify(foundSectionUser));
          resolve(true);
          return;
        }

        console.log('Login failed for:', userId);
        resolve(false);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mobis_current_user');
  };

  return {
    user,
    login,
    logout,
    loading
  };
};
