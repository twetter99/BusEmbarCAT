
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
import { mockVehicles, mockTasks, mockOperators } from '@/lib/data';
import type { Vehicle, Operator } from '@/lib/types';
import { PlusCircle, FileText, Search } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

const statusVariant: { [key in Vehicle['status']]: 'default' | 'secondary' | 'destructive' } = {
    'Activo': 'default',
    'En Mantenimiento': 'secondary',
    'Fuera de Servicio': 'destructive',
}

const NextMaintenanceCell = ({ vehicleId }: { vehicleId: string }) => {
    const today = new Date('2026-01-15T15:00:00');
    
    const upcomingTasks = mockTasks
        .filter(t => t.vehicleId === vehicleId && t.status === 'Pendiente' && t.dueDate >= today)
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    const overdueTasks = mockTasks
        .filter(t => t.vehicleId === vehicleId && t.status === 'Pendiente' && t.dueDate < today)
        .sort((a, b) => b.dueDate.getTime() - a.dueDate.getTime());
        
    if (overdueTasks.length > 0) {
        return <Badge variant="destructive">Vencido</Badge>
    }

    if (upcomingTasks.length === 0) {
        return <span className="text-muted-foreground">Al día</span>;
    }
    
    const nextTask = upcomingTasks[0];
    const daysUntilDue = differenceInDays(nextTask.dueDate, today);
    let variant: 'warning' | 'attention' | 'default' = 'default';

    if (daysUntilDue <= 7) {
        variant = 'warning';
    } else if (daysUntilDue <= 30) {
        variant = 'attention';
    }

    return <Badge variant={variant}>{format(nextTask.dueDate, 'dd/MM/yyyy', {locale: es})}</Badge>;
}

const VehicleFilters = ({
  filters,
  onFilterChange,
  operators,
  statuses,
}: {
  filters: { query: string; operator: string; status: string };
  onFilterChange: (key: string, value: string) => void;
  operators: Operator[];
  statuses: Vehicle['status'][];
}) => {
  return (
    <Card className="mb-4">
        <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="md:col-span-2 relative">
                     <label htmlFor="search" className="sr-only">Buscar</label>
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input 
                        id="search"
                        placeholder="Buscar por ID, matrícula, modelo..."
                        value={filters.query}
                        onChange={(e) => onFilterChange('query', e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div>
                     <label htmlFor="operator" className="sr-only">Operador</label>
                     <Select value={filters.operator} onValueChange={(value) => onFilterChange('operator', value)}>
                        <SelectTrigger id="operator">
                            <SelectValue placeholder="Filtrar por operador..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los Operadores</SelectItem>
                            {operators.map(op => <SelectItem key={op.id} value={op.id}>{op.name}</SelectItem>)}
                        </SelectContent>
                     </Select>
                </div>
                <div>
                     <label htmlFor="status" className="sr-only">Estado</label>
                     <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Filtrar por estado..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los Estados</SelectItem>
                            {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                     </Select>
                </div>
            </div>
        </CardContent>
    </Card>
  )
}

export default function VehiclesPage() {
    const { user } = useAuth();
    const [filters, setFilters] = React.useState({
        query: '',
        operator: 'all',
        status: 'all',
    });

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };
    
    const userVehicles = React.useMemo(() => {
        if (user?.role === 'Operador') {
            return mockVehicles.filter(v => v.operatorId === user.operatorId);
        }
        return mockVehicles;
    }, [user]);

    const availableOperators = React.useMemo(() => {
        if (user?.role === 'Operador') {
            return mockOperators.filter(op => op.id === user.operatorId);
        }
        const operatorIds = new Set(userVehicles.map(v => v.operatorId));
        return mockOperators.filter(op => operatorIds.has(op.id));
    }, [user, userVehicles]);

    const vehicleStatuses = React.useMemo(() => {
        return Array.from(new Set(userVehicles.map(v => v.status)));
    }, [userVehicles]);

    const filteredVehicles = React.useMemo(() => {
        return userVehicles.filter(vehicle => {
            const queryMatch = filters.query.toLowerCase() === '' ||
                vehicle.uniqueId.toLowerCase().includes(filters.query.toLowerCase()) ||
                vehicle.id.toLowerCase().includes(filters.query.toLowerCase()) ||
                vehicle.model.toLowerCase().includes(filters.query.toLowerCase());
            
            const operatorMatch = filters.operator === 'all' || vehicle.operatorId === filters.operator;

            const statusMatch = filters.status === 'all' || vehicle.status === filters.status;

            return queryMatch && operatorMatch && statusMatch;
        });
    }, [userVehicles, filters]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Listado Completo de Vehículos</h1>
            <p className="text-muted-foreground">
              Todos los vehículos de la flota por operador. {filteredVehicles.length} de {userVehicles.length} mostrados.
            </p>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Añadir Vehículo
          </Button>
        </div>

      <VehicleFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        operators={availableOperators}
        statuses={vehicleStatuses}
      />

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Único</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Operador</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Próx. Mant.</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.uniqueId}>
                  <TableCell className="font-medium">{vehicle.uniqueId}</TableCell>
                  <TableCell>{vehicle.id}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.operatorName}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[vehicle.status]}>{vehicle.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <NextMaintenanceCell vehicleId={vehicle.id} />
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/vehicles/${vehicle.uniqueId}`}>
                        <FileText className="h-4 w-4 mr-2"/>
                        Ver Ficha
                      </Link>
                    </Button>
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
