
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
  const responsesHtml = report.responses.map(response => 
    `<div class="response">
       <div class="question">${response.question}</div>
       <div class="answer">Puntuación: ${response.answer}/${response.maxScore}</div>
     </div>`
  ).join('');

  const sectionsHtml = report.sections.map(section => 
    `<div class="section">
       <h3>${section.name}</h3>
       ${section.subsections.map(sub => {
         const response = report.responses.find(r => r.questionId === sub.id);
         return `<div class="subsection">
           <div class="sub-question">${sub.question}</div>
           <div class="sub-answer">Respuesta: ${response?.answer || 'N/A'}/${response?.maxScore || 5}</div>
         </div>`;
       }).join('')}
     </div>`
  ).join('');

  const htmlContent = `
    <html>
      <head>
        <title>Reporte de Seguridad - ${report.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
          h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
          h2 { color: #666; margin-top: 30px; }
          h3 { color: #777; margin-top: 20px; }
          .info { margin: 8px 0; }
          .label { font-weight: bold; color: #444; }
          .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
          .subsection { margin: 10px 0; padding: 10px; background-color: #f9f9f9; border-radius: 3px; }
          .sub-question { font-weight: bold; color: #555; }
          .sub-answer { color: #666; margin-top: 5px; }
          .response { margin: 10px 0; padding: 10px; background-color: #f5f5f5; border-radius: 3px; }
          .question { font-weight: bold; color: #333; }
          .answer { color: #666; margin-top: 5px; }
          .summary { background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1>Reporte de Seguridad</h1>
        
        <div class="summary">
          <div class="info"><span class="label">ID del Reporte:</span> ${report.id}</div>
          <div class="info"><span class="label">Fecha del Reporte:</span> ${report.reportDate}</div>
          <div class="info"><span class="label">Creado por:</span> ${report.createdBy}</div>
          <div class="info"><span class="label">Fecha de Creación:</span> ${new Date(report.createdAt).toLocaleDateString('es-ES')}</div>
          <div class="info"><span class="label">Tipo:</span> ${report.type}</div>
          <div class="info"><span class="label">Ubicación:</span> ${report.location}</div>
          <div class="info"><span class="label">Descripción:</span> ${report.description}</div>
          <div class="info"><span class="label">Severidad:</span> ${report.severity === 'high' ? 'Alta' : report.severity === 'medium' ? 'Media' : 'Baja'}</div>
          <div class="info"><span class="label">Estado:</span> ${report.status === 'open' ? 'Abierto' : report.status === 'in_progress' ? 'En Progreso' : 'Cerrado'}</div>
          <div class="info"><span class="label">Puntuación Total:</span> ${report.totalScore}/${report.maxScore} (${((report.totalScore / report.maxScore) * 100).toFixed(1)}%)</div>
        </div>

        <h2>Secciones y Respuestas del Cuestionario</h2>
        ${sectionsHtml}

        <h2>Resumen de Respuestas</h2>
        ${responsesHtml}
      </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reporte-seguridad-${report.reportDate}-${report.id}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
