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
import { mockIncidents } from '@/lib/data';
import type { Incident } from '@/lib/types';
import { add, differenceInDays } from 'date-fns';
import { PlusCircle } from 'lucide-react';

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

    let variant: 'destructive' | 'secondary' | 'default' = 'default';
    if (daysRemaining < 1) {
        variant = 'destructive';
    } else if (daysRemaining < 2) {
        variant = 'secondary';
    }

    return (
        <TableCell>
            <Badge variant={variant}>
                {daysRemaining > 0 ? `${daysRemaining} día${daysRemaining > 1 ? 's' : ''} restante${daysRemaining > 1 ? 's' : ''}` : 'Vencido'}
            </Badge>
        </TableCell>
    )
}

export default function IncidentsPage() {
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
              {mockIncidents.map((incident) => (
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
