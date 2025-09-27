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
import { mockIncidents, mockVehicles } from '@/lib/data';
import type { Incident } from '@/lib/types';
import { add, differenceInDays } from 'date-fns';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const statusVariant: { [key in Incident['status']]: 'destructive' | 'secondary' | 'outline' } = {
    'Abierto': 'destructive',
    'En Progreso': 'secondary',
    'Resuelto': 'outline',
}

const SlaCell = ({ incident }: { incident: Incident }) => {
    if (incident.status === 'Resuelto') {
        return <TableCell><Badge variant="outline">Resuelto</Badge></TableCell>
    }

    const dueDate = add(incident.reportedAt, { days: incident.slaDays });
    const daysRemaining = differenceInDays(dueDate, new Date());

    let variant: 'destructive' | 'warning' | 'default' = 'default';
    let text: string;

    if (daysRemaining < 0) {
        variant = 'destructive';
        text = 'Vencido';
    } else if (daysRemaining < 1) {
        variant = 'warning';
        text = 'Urgente';
    } else {
       variant = 'default';
       text = `${daysRemaining} día${daysRemaining !== 1 ? 's' : ''} restante${daysRemaining !== 1 ? 's' : ''}`;
    }

    if (incident.status === 'En Progreso') {
        return <TableCell><Badge variant="secondary">En Progreso</Badge></TableCell>
    }

    return (
        <TableCell>
            <Badge variant={variant}>
                {text}
            </Badge>
        </TableCell>
    )
}

export default function IncidentsPage() {
  const { user } = useAuth();
  
  const userIncidents = React.useMemo(() => {
    if (user?.role === 'Operador') {
        const operatorVehicles = mockVehicles.filter(v => v.operatorId === user.operatorId).map(v => v.id);
        return mockIncidents.filter(i => operatorVehicles.includes(i.vehicleId));
    }
    return mockIncidents;
  }, [user]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestión de Incidencias</CardTitle>
            <CardDescription>
              Registre y gestione incidencias no planificadas y solicitudes de servicio.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Reportar Incidencia
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID de Ticket</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Problema</TableHead>
                <TableHead>Asignado a</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>SLA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userIncidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-medium">{incident.id}</TableCell>
                  <TableCell>{incident.vehicleId}</TableCell>
                  <TableCell className="max-w-xs truncate">{incident.issue}</TableCell>
                  <TableCell>{incident.assignedTo}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[incident.status]}>{incident.status}</Badge>
                  </TableCell>
                  <SlaCell incident={incident} />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
