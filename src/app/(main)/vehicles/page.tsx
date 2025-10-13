
'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
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
import { ca } from 'date-fns/locale';
import { Label } from '@/components/ui/label';

type MaintenanceStatus = 'Vencido' | 'Vence esta semana' | 'Próximo' | 'Al día';

const getMaintenanceStatus = (vehicleId: string): MaintenanceStatus => {
    const today = new Date('2026-01-15T15:00:00');
    today.setHours(0,0,0,0);

    const overdueTasks = mockTasks.filter(t => t.vehicleId === vehicleId && t.status === 'Pendiente' && new Date(t.dueDate) < today);
    if (overdueTasks.length > 0) return 'Vencido';

    const upcomingTasks = mockTasks
        .filter(t => t.vehicleId === vehicleId && t.status === 'Pendiente' && new Date(t.dueDate) >= today)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    if (upcomingTasks.length > 0) {
        const nextTaskDate = new Date(upcomingTasks[0].dueDate);
        const daysUntilDue = differenceInDays(nextTaskDate, today);
        if (daysUntilDue <= 7) return 'Vence esta semana';
        return 'Próximo';
    }

    return 'Al día';
}


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
        return <Badge variant="destructive">Vençut</Badge>
    }

    if (upcomingTasks.length === 0) {
        return <Badge variant='outline'>Al dia</Badge>;
    }
    
    const nextTask = upcomingTasks[0];
    const daysUntilDue = differenceInDays(nextTask.dueDate, today);
    let variant: 'warning' | 'attention' | 'default' = 'default';

    if (daysUntilDue <= 7) {
        variant = 'warning';
    } else if (daysUntilDue <= 30) {
        variant = 'attention';
    }

    return <Badge variant={variant}>{format(nextTask.dueDate, 'dd/MM/yyyy', {locale: ca})}</Badge>;
}

const FilterControls = ({
  filters,
  onFilterChange,
  operators,
  statuses,
  maintenanceStatuses,
}: {
  filters: { query: string; operator: string; status: string; maintenance: string; };
  onFilterChange: (newFilters: { query: string; operator: string; status: string; maintenance: string; }) => void;
  operators: Operator[];
  statuses: Vehicle['status'][];
  maintenanceStatuses: MaintenanceStatus[];
}) => {

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };
  
  const clearFilters = () => {
    onFilterChange({ query: '', operator: 'all', status: 'all', maintenance: 'all' });
  }

  return (
    <Card className="mb-4">
        <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
                <div className="lg:col-span-2 relative">
                     <Label htmlFor="search" className="sr-only">Cercar</Label>
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input 
                        id="search"
                        placeholder="Cercar per ID, matrícula, model..."
                        value={filters.query}
                        onChange={(e) => handleFilterChange('query', e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div>
                     <Label htmlFor="operator" className="text-sm font-medium">Operador</Label>
                     <Select value={filters.operator} onValueChange={(value) => handleFilterChange('operator', value)}>
                        <SelectTrigger id="operator">
                            <SelectValue placeholder="Filtrar per operador..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tots</SelectItem>
                            {operators.map(op => <SelectItem key={op.id} value={op.id}>{op.name}</SelectItem>)}
                        </SelectContent>
                     </Select>
                </div>
                <div>
                     <Label htmlFor="status" className="text-sm font-medium">Estat Vehicle</Label>
                     <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                        <SelectTrigger id="status">
                            <SelectValue placeholder="Filtrar per estat..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tots</SelectItem>
                            {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                     </Select>
                </div>
                <div>
                     <Label htmlFor="maintenance" className="text-sm font-medium">Manteniment</Label>
                     <Select value={filters.maintenance} onValueChange={(value) => handleFilterChange('maintenance', value)}>
                        <SelectTrigger id="maintenance">
                            <SelectValue placeholder="Filtrar per mant..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tots</SelectItem>
                            {maintenanceStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                     </Select>
                </div>
                 <Button onClick={clearFilters} variant="ghost" className="w-full md:w-auto self-end lg:col-start-5">Netejar Filtres</Button>
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
        maintenance: 'all',
    });
    
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
    
    const maintenanceStatuses: MaintenanceStatus[] = ['Vencido', 'Vence esta semana', 'Próximo', 'Al día'];

    const filteredVehicles = React.useMemo(() => {
        return userVehicles.filter(vehicle => {
            const queryMatch = filters.query.toLowerCase() === '' ||
                vehicle.uniqueId.toLowerCase().includes(filters.query.toLowerCase()) ||
                vehicle.id.toLowerCase().includes(filters.query.toLowerCase()) ||
                vehicle.model.toLowerCase().includes(filters.query.toLowerCase());
            
            const operatorMatch = filters.operator === 'all' || vehicle.operatorId === filters.operator;

            const statusMatch = filters.status === 'all' || vehicle.status === filters.status;

            const maintenanceMatch = filters.maintenance === 'all' || getMaintenanceStatus(vehicle.id) === filters.maintenance;

            return queryMatch && operatorMatch && statusMatch && maintenanceMatch;
        });
    }, [userVehicles, filters]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Llistat Complet de Vehicles</h1>
            <p className="text-muted-foreground">
              {filteredVehicles.length} de {userVehicles.length} vehicles mostrats.
            </p>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Afegir Vehicle
          </Button>
        </div>

      <FilterControls 
        filters={filters}
        onFilterChange={setFilters}
        operators={availableOperators}
        statuses={vehicleStatuses}
        maintenanceStatuses={maintenanceStatuses}
      />

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Únic</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Operador</TableHead>
                <TableHead>Estat</TableHead>
                <TableHead>Pròx. Mant.</TableHead>
                <TableHead>Accions</TableHead>
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
                        Veure Fitxa
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
