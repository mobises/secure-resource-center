
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, Search, Download } from "lucide-react";
import { useStockMovements } from "@/hooks/useLocalData";
import { StockMovement } from "@/types";

interface StockSummary {
  deviceTypeId: string;
  deviceTypeName: string;
  deviceCategory: string;
  deviceSubcategory: string;
  totalIn: number;
  totalOut: number;
  currentStock: number;
}

const CurrentStock: React.FC = () => {
  const { data: stockMovements } = useStockMovements();
  const [searchTerm, setSearchTerm] = useState('');

  const calculateCurrentStock = (): StockSummary[] => {
    const stockMap = new Map<string, StockSummary>();

    stockMovements.forEach((movement: StockMovement) => {
      const key = movement.deviceTypeId;
      
      if (!stockMap.has(key)) {
        stockMap.set(key, {
          deviceTypeId: movement.deviceTypeId,
          deviceTypeName: movement.deviceTypeName,
          deviceCategory: movement.deviceCategory,
          deviceSubcategory: movement.deviceSubcategory,
          totalIn: 0,
          totalOut: 0,
          currentStock: 0
        });
      }

      const summary = stockMap.get(key)!;
      
      if (movement.movementType === 'alta') {
        summary.totalIn += movement.units;
      } else {
        summary.totalOut += movement.units;
      }
      
      summary.currentStock = summary.totalIn - summary.totalOut;
    });

    return Array.from(stockMap.values())
      .filter(item => item.currentStock > 0)
      .sort((a, b) => a.deviceTypeName.localeCompare(b.deviceTypeName));
  };

  const stockSummary = calculateCurrentStock();
  
  const filteredStock = stockSummary.filter(item =>
    item.deviceTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.deviceCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.deviceSubcategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ['Categoría', 'Subcategoría', 'Dispositivo', 'Stock Actual'];
    const csvContent = [
      headers.join(','),
      ...filteredStock.map(item => [
        item.deviceCategory,
        item.deviceSubcategory,
        item.deviceTypeName,
        item.currentStock
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock_actual_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <h3 className="text-xl font-bold">Stock Actual</h3>
        </div>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por dispositivo, categoría o subcategoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Categoría</th>
                <th className="text-left p-3 font-semibold">Subcategoría</th>
                <th className="text-left p-3 font-semibold">Dispositivo</th>
                <th className="text-center p-3 font-semibold">Stock Actual</th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.map((item) => (
                <tr key={item.deviceTypeId} className="border-b hover:bg-gray-50">
                  <td className="p-3">{item.deviceCategory}</td>
                  <td className="p-3">{item.deviceSubcategory}</td>
                  <td className="p-3 font-medium">{item.deviceTypeName}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      item.currentStock > 10 ? 'bg-green-100 text-green-800' :
                      item.currentStock > 5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.currentStock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredStock.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No hay stock disponible</p>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="font-semibold mb-3">Resumen de Stock</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stockSummary.length}</div>
            <div className="text-sm text-gray-600">Tipos de Dispositivos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stockSummary.reduce((acc, item) => acc + item.currentStock, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Unidades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stockSummary.filter(item => item.currentStock <= 5).length}
            </div>
            <div className="text-sm text-gray-600">Stock Bajo (≤5)</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CurrentStock;
