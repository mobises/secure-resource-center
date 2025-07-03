
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Employee } from "@/types";

interface EmployeeSelectorProps {
  employees: Employee[];
  employeeFilter: string;
  onEmployeeFilterChange: (filter: string) => void;
  onEmployeeSelect: (employee: Employee) => void;
  selectedEmployeeId: string;
  selectedEmployeeName: string;
  onEmployeeIdChange: (id: string) => void;
  onEmployeeNameChange: (name: string) => void;
}

const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  employees,
  employeeFilter,
  onEmployeeFilterChange,
  onEmployeeSelect,
  selectedEmployeeId,
  selectedEmployeeName,
  onEmployeeIdChange,
  onEmployeeNameChange
}) => {
  const filteredEmployees = employees.filter(emp => 
    emp.active && (
      emp.name.toLowerCase().includes(employeeFilter.toLowerCase()) ||
      emp.id.toLowerCase().includes(employeeFilter.toLowerCase())
    )
  );

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="employeeFilter">Buscar Empleado</Label>
        <Input
          id="employeeFilter"
          value={employeeFilter}
          onChange={(e) => onEmployeeFilterChange(e.target.value)}
          placeholder="Buscar por nombre o ID..."
        />
        {employeeFilter && filteredEmployees.length > 0 && (
          <div className="mt-2 border rounded-md max-h-40 overflow-y-auto">
            {filteredEmployees.map(employee => (
              <div
                key={employee.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => onEmployeeSelect(employee)}
              >
                <p className="font-medium">{employee.name}</p>
                <p className="text-sm text-gray-600">ID: {employee.id} - {employee.department}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="recipientId">ID del Destinatario</Label>
          <Input
            id="recipientId"
            value={selectedEmployeeId}
            onChange={(e) => onEmployeeIdChange(e.target.value)}
            placeholder="ID del empleado"
            readOnly
          />
        </div>
        <div>
          <Label htmlFor="recipientName">Nombre del Destinatario</Label>
          <Input
            id="recipientName"
            value={selectedEmployeeName}
            onChange={(e) => onEmployeeNameChange(e.target.value)}
            placeholder="Nombre completo"
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeSelector;
