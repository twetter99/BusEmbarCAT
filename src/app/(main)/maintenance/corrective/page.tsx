'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockIncidents, mockVehicles } from '@/lib/data';
import type { Incident } from '@/lib/types';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Calendar, Wrench, Truck } from 'lucide-react';
import Link from 'next/link';

const statusVariant: { [key in Incident['status']]: 'destructive' | 'secondary' | 'outline' } = {
    'Abierto': 'destructive',
    'En Progreso': 'secondary',
    'Resuelto': 'outline',
};

const priorityVariant: { [key in Incident['priority']]: 'destructive' | 'secondary' | 'default' | 'outline' } = {
    'Crítica': 'destructive',
    'Alta': 'secondary',
    'Media': 'default',
    'Baja': 'outline',
};

const buttonTextByStatus: { [key in Incident['status']]: string } = {
    'Abierto': 'Ver Ficha',
    'En Progreso': 'Ver Progreso',
    'Resuelto': 'Ver Informe',
};

const IncidentCard = ({ incident }: { incident: Incident }) => {
    const vehicle = mockVehicles.find(v => v.id === incident.vehicleId);

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <Badge variant={priorityVariant[incident.priority]} className="mb-2">{incident.priority}</Badge>
                        <CardTitle className="text-lg">{incident.issue}</CardTitle>
                        <CardDescription>Mantenimiento Correctivo</CardDescription>
                    </div>
                    <Badge variant={statusVariant[incident.status]}>{incident.status}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground flex-grow">
                 {vehicle && (
                    <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <Link href={`/vehicles/${vehicle.uniqueId}`} className="hover:underline text-primary">
                            {vehicle.uniqueId} ({incident.vehicleId})
                        </Link>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Reportado {formatDistanceToNow(incident.reportedAt, { addSuffix: true, locale: es })}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    <span>Revisión de: {incident.equipmentType}</span>
                </div>
                {incident.assignedTo && <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Asignado a {incident.assignedTo}</span>
                </div>}
            </CardContent>
            <CardFooter>
                <Button className="w-full">{buttonTextByStatus[incident.status]}</Button>
            </CardFooter>
        </Card>
    );
}

export default function CorrectivePage() {
    const openIncidents = mockIncidents.filter(i => i.status === 'Abierto');
    const inProgressIncidents = mockIncidents.filter(i => i.status === 'En Progreso');
    const resolvedIncidents = mockIncidents.filter(i => i.status === 'Resuelto');
    
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Tabs defaultValue="open">
             <div className="flex items-center justify-between mb-4">
                 <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="open">Abiertas ({openIncidents.length})</TabsTrigger>
                    <TabsTrigger value="in-progress">En Reparación ({inProgressIncidents.length})</TabsTrigger>
                    <TabsTrigger value="resolved">Resueltas ({resolvedIncidents.length})</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="open">
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {openIncidents.map(incident => <IncidentCard key={incident.id} incident={incident} />)}
                </div>
                 {openIncidents.length === 0 && <p className="text-muted-foreground text-center py-8">No hay averías abiertas.</p>}
            </TabsContent>
            <TabsContent value="in-progress">
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {inProgressIncidents.map(incident => <IncidentCard key={incident.id} incident={incident} />)}
                </div>
                 {inProgressIncidents.length === 0 && <p className="text-muted-foreground text-center py-8">No hay averías en reparación.</p>}
            </TabsContent>
            <TabsContent value="resolved">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {resolvedIncidents.map(incident => <IncidentCard key={incident.id} incident={incident} />)}
                </div>
                 {resolvedIncidents.length === 0 && <p className="text-muted-foreground text-center py-8">No hay averías resueltas.</p>}
            </TabsContent>
        </Tabs>
    </main>
  );
}
