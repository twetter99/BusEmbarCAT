
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListFilter, Search } from 'lucide-react';
import { mockOperatorMetrics } from '@/lib/data';
import { OperatorCard } from './components/operator-card';
import type { OperatorMetrics } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const OperatorFilters = ({
  filters,
  onFilterChange,
  locations,
  qualityLevels,
  statuses
}: {
  filters: {
    query: string;
    status: string;
    quality: string;
  };
  onFilterChange: (key: string, value: string) => void;
  locations: string[];
  qualityLevels: string[];
  statuses: string[];
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar Operador
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                type="text"
                placeholder="Buscar por nombre..."
                value={filters.query}
                onChange={(e) => onFilterChange('query', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Estado del Operador
            </label>
            <Select
              value={filters.status}
              onValueChange={(value) => onFilterChange('status', value)}
            >
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
           <div>
            <label htmlFor="quality-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Calidad de Servicio
            </label>
            <Select
              value={filters.quality}
              onValueChange={(value) => onFilterChange('quality', value)}
            >
              <SelectTrigger id="quality-filter">
                <SelectValue placeholder="Filtrar por calidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las calidades</SelectItem>
                 {qualityLevels.map(q => <SelectItem key={q} value={q}>Calidad {q}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


export default function OperatorsPage() {
  const [filters, setFilters] = React.useState({
    query: '',
    status: 'all',
    quality: 'all'
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const operatorStatuses = React.useMemo(() => [...new Set(mockOperatorMetrics.map(op => op.estado))], []);
  const qualityLevels = React.useMemo(() => [...new Set(mockOperatorMetrics.map(op => op.calidadServicio))].sort(), []);
  const locations = React.useMemo(() => [...new Set(mockOperatorMetrics.map(op => op.ubicacionPrincipal))].sort(), []);


  const getOverallStatus = (operator: OperatorMetrics): 'success' | 'warning' | 'destructive' => {
      let score = 0;
      if (operator.mantenimientosVencidos > 0) score += 3;
      if (operator.incidenciasAbiertas > 5) score += 2;
      if (operator.cumplimientoPreventivos < 90) score += 1;
      if (operator.slaCorrectivos > 3) score += 1;

      if (score >= 4) return 'destructive';
      if (score >= 2) return 'warning';
      return 'success';
  }

  const filteredOperators = React.useMemo(() => {
    let operators = [...mockOperatorMetrics];

    if (filters.query) {
      operators = operators.filter(op => op.nombre.toLowerCase().includes(filters.query.toLowerCase()));
    }
    if (filters.status !== 'all') {
      operators = operators.filter(op => op.estado === filters.status);
    }
     if (filters.quality !== 'all') {
      operators = operators.filter(op => op.calidadServicio === filters.quality);
    }

    return operators;
  }, [filters]);
  
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Operadores</h1>
          <p className="text-muted-foreground">
            Supervisa el estado y rendimiento de todos los operadores de la flota.
          </p>
        </div>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Añadir Operador
        </Button>
      </div>

       <OperatorFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        locations={locations}
        qualityLevels={qualityLevels}
        statuses={operatorStatuses}
      />
      
      <p className="text-sm text-muted-foreground">{filteredOperators.length} operadores encontrados.</p>


      {filteredOperators.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredOperators.map((operator) => (
            <OperatorCard key={operator.id} operator={operator} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
             <div className="text-center text-muted-foreground py-12">
               <p className="font-semibold">No se encontraron operadores</p>
               <p className="text-sm mt-1">Intenta ajustar o limpiar los filtros de búsqueda.</p>
            </div>
          </CardContent>
        </Card>
      )}

    </main>
  );
}
