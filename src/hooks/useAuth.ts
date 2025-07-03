
import { useState, useEffect } from 'react';
import { User } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userId: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      // Simulación de autenticación con ID de usuario
      setTimeout(() => {
        if (userId && password) {
          const mockUser: User = {
            id: '1',
            name: 'Usuario Admin',
            userId: userId,
            password: password,
            role: 'admin',
            permissions: ['all']
          };
          
          setUser(mockUser);
          localStorage.setItem('user', JSON.stringify(mockUser));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return {
    user,
    login,
    logout,
    loading
  };
};
