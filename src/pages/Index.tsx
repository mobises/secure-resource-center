
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Login from '@/components/Login';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import ModuleRenderer from '@/components/ModuleRenderer';

const Index = () => {
  const { user, login, logout } = useAuth();
  const [currentModule, setCurrentModule] = useState<string>('dashboard');

  if (!user) {
    return <Login onLogin={login} />;
  }

  const renderContent = () => {
    if (currentModule === 'dashboard') {
      return <Dashboard />;
    }
    return <ModuleRenderer module={currentModule} />;
  };

  return (
    <Layout 
      user={user} 
      onLogout={logout}
      currentModule={currentModule}
      onModuleChange={setCurrentModule}
    >
      {renderContent()}
    </Layout>
  );
};

export default Index;
