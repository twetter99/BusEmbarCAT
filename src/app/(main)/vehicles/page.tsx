
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
import { mockVehicles, mockTasks } from '@/lib/data';
import type { Vehicle } from '@/lib/types';
import { PlusCircle, FileText } from 'lucide-react';
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
    const nextTask = mockTasks
        .filter(t => t.vehicleId === vehicleId && t.status === 'Pendiente' && t.dueDate >= today)
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())[0];

    if (!nextTask) {
        const overdueTask = mockTasks
            .filter(t => t.vehicleId === vehicleId && t.status === 'Pendiente')
            .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())[0];
        
        if (overdueTask) {
             return <Badge variant="destructive">Vencido</Badge>
        }

        return <span className="text-muted-foreground">N/A</span>;
    }

    const daysUntilDue = differenceInDays(nextTask.dueDate, today);
    let variant: 'warning' | 'attention' | 'default' = 'default';

    if (daysUntilDue <= 7) {
        variant = 'warning';
    } else if (daysUntilDue <= 30) {
        variant = 'attention';
    }

    return <Badge variant={variant}>{format(nextTask.dueDate, 'dd/MM/yyyy', {locale: es})}</Badge>;
}

export default function VehiclesPage() {
    const { user } = useAuth();
    
    const userVehicles = React.useMemo(() => {
        if (user?.role === 'Operador') {
            return mockVehicles.filter(v => v.operatorId === user.operatorId);
        }
        return mockVehicles;
    }, [user]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Listado Completo de Vehículos</CardTitle>
            <CardDescription>
              Todos los vehículos de la flota por operador.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Añadir Vehículo
          </Button>
        </CardHeader>
        <CardContent>
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
              {userVehicles.map((vehicle) => (
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
