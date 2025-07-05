
import React from 'react';
import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, TooltipProps } from 'recharts';
import { SecurityReport } from "@/types";
import { processSeverityData, processStatusData, createChartData, createStatusChartData } from "./utils";

interface SecurityReportsAnalyticsProps {
  reports: SecurityReport[];
}

// Define types for chart data
interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface StatusChartDataItem {
  name: string;
  count: number;
}

const SecurityReportsAnalytics: React.FC<SecurityReportsAnalyticsProps> = ({ reports }) => {
  const severityData = processSeverityData(reports);
  const chartData: ChartDataItem[] = createChartData(severityData);
  
  const statusData = processStatusData(reports);
  const statusChartData: StatusChartDataItem[] = createStatusChartData(statusData);

  // Custom tooltip formatter for pie chart
  const CustomPieTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-medium">{`${data.name}: ${data.value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip formatter for bar chart
  const CustomBarTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-medium">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabla de resumen */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Resumen por Severidad
          </h3>
          <div className="space-y-3">
            {Object.entries(severityData).map(([severity, count]) => (
              <div key={severity} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">
                  {severity === 'low' ? 'Baja' : severity === 'medium' ? 'Media' : 'Alta'}
                </span>
                <span className="font-bold text-lg">{count}</span>
              </div>
            ))}
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded border-t-2 border-blue-200">
              <span className="font-bold">Total</span>
              <span className="font-bold text-xl text-blue-600">{reports.length}</span>
            </div>
          </div>
        </Card>

        {/* Gráfico de pastel */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Distribución por Severidad
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Gráfico de barras por estado */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Reportes por Estado</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default SecurityReportsAnalytics;
