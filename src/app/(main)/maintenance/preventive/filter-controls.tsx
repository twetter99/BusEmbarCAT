'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import type { Operator } from '@/lib/types';

interface FilterControlsProps {
  filters: {
    operator: string;
    technician: string;
    frequency: string;
  };
  onFilterChange: (filters: FilterControlsProps['filters']) => void;
  technicians: string[];
  frequencies: string[];
  operators: Operator[];
}

export function FilterControls({
  filters,
  onFilterChange,
  technicians,
  frequencies,
  operators,
}: FilterControlsProps) {

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };
  
  const clearFilters = () => {
    onFilterChange({
        operator: 'all',
        technician: 'all',
        frequency: 'all',
    });
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="operator-filter">Operador</Label>
            <Select
              value={filters.operator}
              onValueChange={(value) => handleFilterChange('operator', value)}
            >
              <SelectTrigger id="operator-filter">
                <SelectValue placeholder="Filtrar por operador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los operadores</SelectItem>
                {operators.map((op) => (
                  <SelectItem key={op.id} value={op.id}>
                    {op.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="technician-filter">Técnico</Label>
            <Select
              value={filters.technician}
              onValueChange={(value) => handleFilterChange('technician', value)}
            >
              <SelectTrigger id="technician-filter">
                <SelectValue placeholder="Filtrar por técnico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los técnicos</SelectItem>
                {technicians.map((tech) => (
                  <SelectItem key={tech} value={tech}>
                    {tech}
                  </SelectItem>
                ))}
                 <SelectItem value="unassigned">Sin asignar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency-filter">Frecuencia</Label>
            <Select
              value={filters.frequency}
              onValueChange={(value) => handleFilterChange('frequency', value)}
            >
              <SelectTrigger id="frequency-filter">
                <SelectValue placeholder="Filtrar por frecuencia" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="all">Todas las frecuencias</SelectItem>
                {frequencies.map((freq) => (
                  <SelectItem key={freq} value={freq}>
                    {freq}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={clearFilters} variant="ghost" className="w-full md:w-auto">Limpiar Filtros</Button>
        </div>
      </CardContent>
    </Card>
  );
}
