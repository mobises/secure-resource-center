
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { dataService } from '@/services/dataService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
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
        // Buscar usuario en la base de datos local
        const users = dataService.getUsers();
        const foundUser = users.find(u => u.userId === userId && u.password === password);
        
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('mobis_current_user', JSON.stringify(foundUser));
          resolve(true);
        } else {
          // Si no se encuentra, crear un usuario temporal para la demo
          const tempUser: User = {
            id: Date.now().toString(),
            name: 'Usuario Demo',
            userId: userId,
            password: password,
            role: 'admin',
            permissions: ['all']
          };
          
          setUser(tempUser);
          localStorage.setItem('mobis_current_user', JSON.stringify(tempUser));
          resolve(true);
        }
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
