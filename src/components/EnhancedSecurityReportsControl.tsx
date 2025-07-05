
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import { useSecurityReports } from "@/hooks/useLocalData";
import { SecurityReport } from "@/types";
import SecurityReportForm from "./security/SecurityReportForm";
import SecurityReportsList from "./security/SecurityReportsList";
import SecurityReportsAnalytics from "./security/SecurityReportsAnalytics";

const EnhancedSecurityReportsControl = () => {
  const { data: reports, updateData: updateReports } = useSecurityReports();

  const handleAddReport = (report: SecurityReport) => {
    updateReports([...reports, report]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Control de Reportes de Seguridad</h2>
      </div>

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Crear Reporte</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <SecurityReportForm onAddReport={handleAddReport} />
        </TabsContent>

        <TabsContent value="history">
          <SecurityReportsList reports={reports} />
        </TabsContent>

        <TabsContent value="analytics">
          <SecurityReportsAnalytics reports={reports} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedSecurityReportsControl;
