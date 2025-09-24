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
    'Open': 'destructive',
    'In Progress': 'secondary',
    'Resolved': 'outline',
}

const SlaCell = ({ incident }: { incident: Incident }) => {
    if (incident.status === 'Resolved') {
        return <TableCell><Badge variant="outline">Resolved</Badge></TableCell>
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
                {daysRemaining > 0 ? `${daysRemaining} day${daysRemaining > 1 ? 's' : ''} left` : 'Overdue'}
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
            <CardTitle>Incident Ticketing</CardTitle>
            <CardDescription>
              Log and manage unplanned incidents and service requests.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Report Incident
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
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
