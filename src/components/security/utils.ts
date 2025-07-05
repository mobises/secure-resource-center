
import { SecurityReport } from "@/types";

export const processSeverityData = (reports: SecurityReport[]) => {
  return reports.reduce((acc, report) => {
    const severity = report.severity || 'medium';
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

export const processStatusData = (reports: SecurityReport[]) => {
  return reports.reduce((acc, report) => {
    const status = report.status || 'open';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

export const createChartData = (severityData: Record<string, number>) => {
  return Object.entries(severityData).map(([severity, count]) => ({
    name: severity === 'low' ? 'Baja' : severity === 'medium' ? 'Media' : 'Alta',
    value: count as number,
    color: severity === 'low' ? '#22c55e' : severity === 'medium' ? '#f59e0b' : '#ef4444'
  }));
};

export const createStatusChartData = (statusData: Record<string, number>) => {
  return Object.entries(statusData).map(([status, count]) => ({
    name: status === 'open' ? 'Abierto' : status === 'in_progress' ? 'En Progreso' : 'Cerrado',
    count: count as number
  }));
};

export const exportToPDF = (report: SecurityReport) => {
  const htmlContent = `
    <html>
      <head>
        <title>Reporte de Seguridad - ${report.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          .info { margin: 10px 0; }
          .label { font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Reporte de Seguridad</h1>
        <div class="info"><span class="label">ID:</span> ${report.id}</div>
        <div class="info"><span class="label">Tipo:</span> ${report.type}</div>
        <div class="info"><span class="label">Descripción:</span> ${report.description}</div>
        <div class="info"><span class="label">Ubicación:</span> ${report.location}</div>
        <div class="info"><span class="label">Severidad:</span> ${report.severity}</div>
        <div class="info"><span class="label">Estado:</span> ${report.status}</div>
        <div class="info"><span class="label">Fecha:</span> ${report.reportDate}</div>
        <div class="info"><span class="label">Creado por:</span> ${report.createdBy}</div>
      </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reporte-seguridad-${report.id}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
