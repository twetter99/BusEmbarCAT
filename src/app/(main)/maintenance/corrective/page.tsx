'use client';

import * as React from 'react';
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
import { mockIncidents, mockVehicles, mockOperators } from '@/lib/data';
import type { Incident } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Calendar, Wrench, Truck } from 'lucide-react';
import Link from 'next/link';
import { FilterControls } from '@/components/layout/filter-controls';

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
    const [activeTab, setActiveTab] = React.useState('Abierto');
    const [filters, setFilters] = React.useState({
      operator: 'all',
      technician: 'all',
      category: 'all',
    });

    const technicians = React.useMemo(() => {
        const techSet = new Set<string>();
        mockIncidents.forEach(task => {
            if(task.assignedTo) techSet.add(task.assignedTo);
        });
        return Array.from(techSet).sort();
    }, []);

    const priorities = React.useMemo(() => {
        const prioritySet = new Set<Incident['priority']>();
        mockIncidents.forEach(task => prioritySet.add(task.priority));
        return Array.from(prioritySet);
    }, []);
    
    const filteredIncidents = React.useMemo(() => {
        return mockIncidents.filter(incident => {
            const vehicle = mockVehicles.find(v => v.id === incident.vehicleId);
            const operatorMatch = filters.operator === 'all' || vehicle?.operatorId === filters.operator;
            
            const technicianMatch = filters.technician === 'all' 
                || (filters.technician === 'unassigned' && !incident.assignedTo)
                || incident.assignedTo === filters.technician;
                
            const priorityMatch = filters.category === 'all' || incident.priority === filters.category;
            
            const statusMatch = incident.status === activeTab;

            return operatorMatch && technicianMatch && priorityMatch && statusMatch;
        });
    }, [filters, activeTab]);

    const allIncidentsByStatus = {
        'Abierto': mockIncidents.filter(i => i.status === 'Abierto'),
        'En Progreso': mockIncidents.filter(i => i.status === 'En Progreso'),
        'Resuelto': mockIncidents.filter(i => i.status === 'Resuelto'),
    }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
             <div className="flex items-center justify-between mb-4">
                 <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="Abierto">Abiertas ({allIncidentsByStatus['Abierto'].length})</TabsTrigger>
                    <TabsTrigger value="En Progreso">En Reparación ({allIncidentsByStatus['En Progreso'].length})</TabsTrigger>
                    <TabsTrigger value="Resuelto">Resueltas ({allIncidentsByStatus['Resuelto'].length})</TabsTrigger>
                </TabsList>
            </div>
            
            <FilterControls
                filters={filters}
                onFilterChange={setFilters}
                technicians={technicians}
                categories={priorities}
                categoryLabel="Prioridad"
                operators={mockOperators}
            />

            <div className="mt-4">
                {filteredIncidents.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredIncidents.map(incident => <IncidentCard key={incident.id} incident={incident} />)}
                    </div>
                ) : (
                     <p className="text-muted-foreground text-center py-8">No hay averías que coincidan con los filtros seleccionados para el estado "{activeTab}".</p>
                )}
            </div>
        </Tabs>
    </main>
  );
}
