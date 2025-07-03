
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { LogIn, Loader2 } from "lucide-react";

interface LoginProps {
  onLogin: (userId: string, password: string) => Promise<boolean>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId || !password) {
      toast({
        title: "Error",
        description: "Por favor, ingresa tu ID de usuario y contraseña",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const success = await onLogin(userId, password);
      
      if (!success) {
        toast({
          title: "Error de autenticación",
          description: "Credenciales inválidas. Por favor, verifica tu ID de usuario y contraseña.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error durante el inicio de sesión",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-blue-50 to-sky-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-sky-600 mb-2">MOBIS</h1>
            <div className="w-24 h-1 bg-sky-400 mx-auto rounded-full"></div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sistema de Gestión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa tus credenciales para acceder
          </p>
        </div>
        
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 justify-center">
              <LogIn className="h-5 w-5" />
              Iniciar Sesión
            </CardTitle>
            <CardDescription className="text-sky-100 text-center">
              Accede a tu cuenta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="userId" className="text-gray-700 font-medium">ID de Usuario</Label>
                <Input
                  id="userId"
                  type="text"
                  autoComplete="username"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Tu ID de usuario"
                  disabled={loading}
                  className="mt-1 border-sky-200 focus:border-sky-500 focus:ring-sky-500"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  disabled={loading}
                  className="mt-1 border-sky-200 focus:border-sky-500 focus:ring-sky-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-medium py-2.5"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Demo: Usa cualquier ID de usuario y contraseña para acceder
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
