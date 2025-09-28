
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
    category: string;
    technician?: string;
  };
  onFilterChange: (filters: Partial<FilterControlsProps['filters']>) => void;
  categories: string[];
  categoryLabel: string;
  operators: Operator[];
  technicians?: string[];
  showTechnicianFilter?: boolean;
}

export function FilterControls({
  filters,
  onFilterChange,
  categories,
  categoryLabel,
  operators,
  technicians = [],
  showTechnicianFilter = false,
}: FilterControlsProps) {

  const handleFilterChange = (key: keyof FilterControlsProps['filters'], value: string) => {
    onFilterChange({ [key]: value });
  };
  
  const clearFilters = () => {
    onFilterChange({
        operator: 'all',
        category: 'all',
        technician: 'all',
    });
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          {operators.length > 1 && (
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
          )}
          
          <div className="space-y-2">
            <Label htmlFor="category-filter">{categoryLabel}</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger id="category-filter">
                <SelectValue placeholder={`Filtrar por ${categoryLabel.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="all">Todas</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showTechnicianFilter && (
            <div className="space-y-2">
              <Label htmlFor="technician-filter">Técnico</Label>
              <Select
                value={filters.technician}
                onValueChange={(value) => handleFilterChange('technician', value as string)}
              >
                <SelectTrigger id="technician-filter">
                  <SelectValue placeholder="Filtrar por técnico" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los técnicos</SelectItem>
                  <SelectItem value="unassigned">Sin asignar</SelectItem>
                  {technicians.map((tech) => (
                    <SelectItem key={tech} value={tech}>
                      {tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button onClick={clearFilters} variant="ghost" className="w-full md:w-auto self-end">Limpiar Filtros</Button>
        </div>
      </CardContent>
    </Card>
  );
}

    

    
