
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { mockOperatorMetrics } from '@/lib/data';
import { OperatorCard } from './components/operator-card';
import type { OperatorMetrics } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const OperatorFilters = ({
  filters,
  onFilterChange,
  complianceStatuses
}: {
  filters: {
    query: string;
    compliance: 'all' | 'critical' | 'at_risk' | 'normal';
  };
  onFilterChange: (key: string, value: string) => void;
  complianceStatuses: { value: 'critical' | 'at_risk' | 'normal'; label: string }[];
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div className="lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Cercar Operador
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                type="text"
                placeholder="Cercar per nom..."
                value={filters.query}
                onChange={(e) => onFilterChange('query', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label htmlFor="compliance-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Estat de Compliment
            </label>
            <Select
              value={filters.compliance}
              onValueChange={(value) => onFilterChange('compliance', value)}
            >
              <SelectTrigger id="compliance-filter">
                <SelectValue placeholder="Filtrar per compliment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tots els estats</SelectItem>
                {complianceStatuses.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
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
    compliance: 'all' as 'all' | 'critical' | 'at_risk' | 'normal',
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const complianceStatuses = [
    { value: 'critical', label: 'Crític' },
    { value: 'at_risk', label: 'En Risc' },
    { value: 'normal', label: 'Normal' },
  ] as const;

  const getOverallStatus = (operator: OperatorMetrics): 'critical' | 'at_risk' | 'normal' => {
      let score = 0;
      if (operator.mantenimientosVencidos > 0) score += 3;
      if (operator.incidenciasAbiertas > 5) score += 2;
      if (operator.cumplimientoPreventivos < 90) score += 1;
      if (operator.slaCorrectivos > 3) score += 1;

      if (score >= 4) return 'critical';
      if (score >= 2) return 'at_risk';
      return 'normal';
  }

  const filteredOperators = React.useMemo(() => {
    let operators = [...mockOperatorMetrics];

    if (filters.query) {
      operators = operators.filter(op => op.nombre.toLowerCase().includes(filters.query.toLowerCase()));
    }
    
    if (filters.compliance !== 'all') {
      operators = operators.filter(op => getOverallStatus(op) === filters.compliance);
    }

    return operators;
  }, [filters]);
  
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestió d'Operadors</h1>
          <p className="text-muted-foreground">
            Superviseu l'estat i rendiment de tots els operadors de la flota.
          </p>
        </div>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Afegir Operador
        </Button>
      </div>

       <OperatorFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        complianceStatuses={complianceStatuses}
      />
      
      <p className="text-sm text-muted-foreground">{filteredOperators.length} operadors trobats.</p>

      {filteredOperators.length > 0 ? (
        <div className="space-y-2">
          {filteredOperators.map((operator) => (
            <OperatorCard key={operator.id} operator={operator} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
             <div className="text-center text-muted-foreground py-12">
               <p className="font-semibold">No s'han trobat operadors</p>
               <p className="text-sm mt-1">Intenteu ajustar o netejar els filtres de cerca.</p>
            </div>
          </CardContent>
        </Card>
      )}

    </main>
  );
}
