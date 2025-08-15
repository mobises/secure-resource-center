import React from 'react';
import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Tooltip, TooltipProps } from 'recharts';
import { SecurityReport } from "@/types";
import { useSecurityReports } from "@/hooks/useLocalData";

interface SecurityReportsAnalyticsProps {
  reports: SecurityReport[];
}

interface ScoreData {
  date: string;
  totalScore: number;
  [key: string]: string | number;
}

interface SectionScoreData {
  section: string;
  avgScore: number;
  reportCount: number;
}

const SecurityReportsAnalytics: React.FC<SecurityReportsAnalyticsProps> = ({ reports }) => {
  const { data: securityData } = useSecurityReports();

  // Process data for charts
  const processReportsData = (): { scoreData: ScoreData[], sectionData: SectionScoreData[] } => {
    const scoreData: ScoreData[] = [];
    const sectionScores: { [key: string]: { total: number; count: number } } = {};

    reports.forEach(report => {
      // Calculate total score and section scores
      let totalScore = 0;
      const sectionScoresByReport: { [key: string]: number } = {};

      if (report.responses && Array.isArray(report.responses)) {
        report.responses.forEach(response => {
          const score = response.answer || 0;
          totalScore += score;
          
          // Group by section logic would go here if sections are available
          const sectionName = "General";
          if (!sectionScoresByReport[sectionName]) {
            sectionScoresByReport[sectionName] = 0;
          }
          sectionScoresByReport[sectionName] += score;
          
          if (!sectionScores[sectionName]) {
            sectionScores[sectionName] = { total: 0, count: 0 };
          }
          sectionScores[sectionName].total += score;
          sectionScores[sectionName].count += 1;
        });
      }

      // Add to score data with date
      const dataPoint: ScoreData = {
        date: new Date(report.createdAt || Date.now()).toLocaleDateString('es-ES'),
        totalScore: totalScore,
        ...sectionScoresByReport
      };
      
      scoreData.push(dataPoint);
    });

    // Process section averages
    const sectionData: SectionScoreData[] = Object.entries(sectionScores).map(([section, data]) => ({
      section,
      avgScore: data.count > 0 ? Math.round((data.total / data.count) * 100) / 100 : 0,
      reportCount: data.count
    }));

    return { scoreData: scoreData.slice(-10), sectionData }; // Last 10 reports
  };

  const { scoreData, sectionData } = processReportsData();

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-medium mb-2">{`Fecha: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  return (
    <div className="space-y-6">
      {/* Tabla de datos */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Datos de Reportes Históricos
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Fecha</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Puntuación Total</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Creado por</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(report.createdAt || Date.now()).toLocaleDateString('es-ES')}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    {report.responses?.reduce((sum, resp) => sum + (resp.answer || 0), 0) || 0}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{report.createdBy || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      report.status === 'closed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status === 'closed' ? 'Completado' : 
                       report.status === 'in_progress' ? 'En Progreso' : 'Abierto'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Gráfica de puntuaciones totales en el tiempo */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Evolución de Puntuaciones Totales
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="totalScore" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Gráfica de puntuaciones por secciones */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Puntuaciones Promedio por Sección</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="section" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value} puntos`, 
                  name === 'avgScore' ? 'Puntuación Promedio' : name
                ]}
              />
              <Bar dataKey="avgScore" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Gráfica de evolución por secciones en el tiempo */}
      {sectionData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Evolución por Secciones</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                {sectionData.map((section, index) => (
                  <Line 
                    key={section.section}
                    type="monotone" 
                    dataKey={section.section} 
                    stroke={colors[index % colors.length]} 
                    strokeWidth={2}
                    dot={{ fill: colors[index % colors.length] }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            {sectionData.map((section, index) => (
              <div key={section.section} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm">{section.section}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SecurityReportsAnalytics;