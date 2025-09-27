
'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockEquipment, mockVehicles, mockOperators } from '@/lib/data';
import type { Equipment, EquipmentStatus, Operator, EquipmentType } from '@/lib/types';
import { PlusCircle, Link as LinkIcon, Package, Wrench, Search } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Label } from '@/components/ui/label';

const statusVariant: { [key in EquipmentStatus]: 'default' | 'secondary' | 'destructive' } = {
    'Operativo': 'default',
    'Requiere Reparación': 'destructive',
    'En Stock': 'secondary',
}

const LocationCell = ({ item }: { item: Equipment }) => {
    if (item.assignedVehicleUniqueId) {
        const vehicle = mockVehicles.find(v => v.uniqueId === item.assignedVehicleUniqueId);
        if (vehicle) {
            return (
                <Link href={`/vehicles/${vehicle.uniqueId}`} className="flex items-center gap-2 text-primary hover:underline">
                    <LinkIcon className="h-4 w-4" />
                    <span>Vehículo {vehicle.uniqueId} ({vehicle.id})</span>
                </Link>
            )
        }
    }

    const icon = item.status === 'Requiere Reparación' 
        ? <Wrench className="h-4 w-4 text-destructive" /> 
        : <Package className="h-4 w-4" />;

    return (
        <span className="flex items-center gap-2 text-muted-foreground">
            {icon}
            {item.location || 'Sin asignar'}
        </span>
    );
};

const FilterControls = ({
  filters,
  onFilterChange,
  operators,
  statuses,
  equipmentTypes,
}: {
  filters: { query: string; operator: string; status: string; type: string };
  onFilterChange: (newFilters: { query: string; operator: string; status: string; type: string }) => void;
  operators: Operator[];
  statuses: EquipmentStatus[];
  equipmentTypes: EquipmentType[];
}) => {

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };
  
  const clearFilters = () => {
    onFilterChange({ query: '', operator: 'all', status: 'all', type: 'all' });
  }

  return (
    <Card className="mb-4">
        <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="lg:col-span-2 relative">
                     <Label htmlFor="search" className="sr-only">Buscar</Label>
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input 
                        id="search"
                        placeholder="Buscar por nº de serie, tipo..."
                        value={filters.query}
                        onChange={(e) => handleFilterChange('query', e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div>
                     <Label htmlFor="type" className="text-sm font-medium">Tipo de Equipo</Label>
                     <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                        <SelectTrigger id="type">
                            <SelectValue placeholder="Filtrar por tipo..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {equipmentTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                     </Select>
                </div>
                <div>
                     <Label htmlFor="status" className="text-sm font-medium">Estado</Label>
                     <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Filtrar por estado..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                     </Select>
                </div>
                 <div>
                     <Label htmlFor="operator" className="text-sm font-medium">Operador</Label>
                     <Select value={filters.operator} onValueChange={(value) => handleFilterChange('operator', value)}>
                        <SelectTrigger id="operator">
                            <SelectValue placeholder="Filtrar por operador..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            {operators.map(op => <SelectItem key={op.id} value={op.id}>{op.name}</SelectItem>)}
                        </SelectContent>
                     </Select>
                </div>
                 <Button onClick={clearFilters} variant="ghost" className="w-full md:w-auto self-end lg:col-start-5">Limpiar Filtros</Button>
            </div>
        </CardContent>
    </Card>
  )
}

export default function EquipmentPage() {
    const { user } = useAuth();
    const [filters, setFilters] = React.useState({
        query: '',
        operator: 'all',
        status: 'all',
        type: 'all',
    });

    const userEquipment = React.useMemo(() => {
        if (user?.role === 'Operador') {
            const operatorName = mockOperators.find(op => op.id === user.operatorId)?.name;
            return mockEquipment.filter(e => e.operator === operatorName);
        }
        return mockEquipment;
    }, [user]);
    
    const availableOperators = React.useMemo(() => {
        if (user?.role === 'Operador') {
            return mockOperators.filter(op => op.id === user.operatorId);
        }
        const operatorNames = new Set(userEquipment.map(e => e.operator));
        return mockOperators.filter(op => operatorNames.has(op.name));
    }, [user, userEquipment]);

    const equipmentStatuses = React.useMemo(() => {
        return Array.from(new Set(userEquipment.map(e => e.status)));
    }, [userEquipment]);

    const equipmentTypes = React.useMemo(() => {
        return Array.from(new Set(userEquipment.map(e => e.type)));
    }, [userEquipment]);

    const filteredEquipment = React.useMemo(() => {
        return userEquipment.filter(item => {
            const queryMatch = filters.query.toLowerCase() === '' ||
                item.serialNumber.toLowerCase().includes(filters.query.toLowerCase()) ||
                item.type.toLowerCase().includes(filters.query.toLowerCase()) ||
                (item.subType && item.subType.toLowerCase().includes(filters.query.toLowerCase()));
            
            const operatorId = mockOperators.find(op => op.name === item.operator)?.id;
            const operatorMatch = filters.operator === 'all' || operatorId === filters.operator;

            const statusMatch = filters.status === 'all' || item.status === filters.status;

            const typeMatch = filters.type === 'all' || item.type === filters.type;

            return queryMatch && operatorMatch && statusMatch && typeMatch;
        });
    }, [userEquipment, filters]);


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
       <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Gestión de Equipamiento</h1>
            <p className="text-muted-foreground">
              {filteredEquipment.length} de {userEquipment.length} equipos mostrados.
            </p>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Añadir Equipamiento
          </Button>
        </div>

      <FilterControls
        filters={filters}
        onFilterChange={setFilters}
        operators={availableOperators}
        statuses={equipmentStatuses}
        equipmentTypes={equipmentTypes}
      />

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número de Serie</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Operador</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.serialNumber}</TableCell>
                  <TableCell>
                    {item.type}
                    {item.subType && <span className="text-muted-foreground ml-2">({item.subType})</span>}
                  </TableCell>
                  <TableCell>
                    <LocationCell item={item} />
                  </TableCell>
                  <TableCell>{item.operator}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[item.status]}>{item.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

    