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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockIncidents, mockVehicles, mockOperators } from '@/lib/data';
import type { Incident } from '@/lib/types';
import { format, formatDistanceToNow, differenceInDays, add } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Calendar, Wrench, Truck, AlertTriangle, Zap, Clock, Building } from 'lucide-react';
import Link from 'next/link';
import { FilterControls } from '@/components/layout/filter-controls';
import { cn } from '@/lib/utils';

type UrgencyStatus = 'Vencido' | 'Urgente' | 'Próximo' | 'Normal';

const getUrgency = (incident: Incident): UrgencyStatus => {
    if (incident.status !== 'Abierto') return 'Normal';
    
    const dueDate = add(incident.reportedAt, { days: incident.slaDays });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);

    const daysDiff = differenceInDays(taskDate, today);

    if (daysDiff < 0) return 'Vencido';
    if (daysDiff < 1) return 'Urgente'; // Vence hoy
    if (daysDiff <= 2) return 'Próximo'; // Vence en 1-2 días
    return 'Normal';
};

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

const urgencyBadgeVariant: { [key in UrgencyStatus]: 'destructive' | 'warning' | 'attention' | 'default' } = {
    'Vencido': 'destructive',
    'Urgente': 'warning',
    'Próximo': 'attention',
    'Normal': 'default',
};

const urgencyText: { [key in UrgencyStatus]: string } = {
    'Vencido': 'Vencido',
    'Urgente': 'Urgente',
    'Próximo': 'Próximo',
    'Normal': 'Abierto',
};

const urgencyCardClass: { [key in UrgencyStatus]: string } = {
  'Vencido': 'border-l-4 border-l-destructive',
  'Urgente': 'border-l-4 border-l-warning',
  'Próximo': 'border-l-4 border-l-attention',
  'Normal': '',
};

const urgencyDateClass: { [key in UrgencyStatus]: string } = {
  'Vencido': 'bg-destructive/10 text-destructive underline decoration-destructive',
  'Urgente': 'bg-warning/10 text-warning-foreground underline decoration-warning',
  'Próximo': 'bg-attention/10 text-attention-foreground underline decoration-attention',
  'Normal': '',
};

const urgencyIcons: { [key in UrgencyStatus]: React.ElementType } = {
  'Vencido': AlertTriangle,
  'Urgente': Zap,
  'Próximo': Calendar,
  'Normal': Clock,
};

const buttonTextByStatus: { [key in Incident['status']]: string } = {
    'Abierto': 'Ver Ficha',
    'En Progreso': 'Ver Progreso',
    'Resuelto': 'Ver Informe',
};

const IncidentCard = ({ incident }: { incident: Incident }) => {
    const vehicle = mockVehicles.find(v => v.id === incident.vehicleId);
    const urgency = getUrgency(incident);
    const UrgencyIcon = urgencyIcons[urgency];
    const dueDate = add(incident.reportedAt, { days: incident.slaDays });

    return (
        <Card className={cn("flex flex-col", incident.status === 'Abierto' ? urgencyCardClass[urgency] : '')}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <Badge variant={priorityVariant[incident.priority]} className="mb-2">{incident.priority}</Badge>
                        <CardTitle className="text-lg">{incident.issue}</CardTitle>
                        <CardDescription>Mantenimiento Correctivo</CardDescription>
                    </div>
                     {incident.status === 'Abierto' ? (
                        <Badge variant={urgencyBadgeVariant[urgency]}>{urgencyText[urgency]}</Badge>
                    ) : (
                        <Badge variant={statusVariant[incident.status]}>{incident.status}</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground flex-grow">
                 {vehicle && (
                    <>
                        <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            <Link href={`/vehicles/${vehicle.uniqueId}`} className="hover:underline text-primary">
                                {vehicle.uniqueId} ({incident.vehicleId})
                            </Link>
                        </div>
                        <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span className="text-xs">{vehicle.operatorName}</span>
                        </div>
                    </>
                )}
                <div className="flex items-start gap-2">
                    <UrgencyIcon className={cn("h-4 w-4 mt-0.5", {
                        'text-destructive': urgency === 'Vencido',
                        'text-warning': urgency === 'Urgente',
                        'text-attention': urgency === 'Próximo',
                        'text-muted-foreground': urgency === 'Normal',
                    })} />
                    <div className={cn("text-sm", incident.status === 'Abierto' && urgencyDateClass[urgency], 'p-1 rounded-md')}>
                       <span>
                         {urgency === 'Vencido' ? 'Vencido ' : 'Vence '}
                         {formatDistanceToNow(dueDate, { addSuffix: true, locale: es })}
                       </span>
                        <br />
                       <span className="text-xs">({format(dueDate, 'd MMM, yyyy', { locale: es })})</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    <span>Revisión de: {incident.equipmentType}</span>
                </div>
                {incident.assignedTo ? <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Asignado a {incident.assignedTo}</span>
                </div> : <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-muted-foreground italic">Sin asignar</span>
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

    const urgencyOrder: Record<UrgencyStatus, number> = {
        'Vencido': 1,
        'Urgente': 2,
        'Próximo': 3,
        'Normal': 4,
    };
    
    const filteredIncidents = React.useMemo(() => {
        const incidents = mockIncidents.filter(incident => {
            const vehicle = mockVehicles.find(v => v.id === incident.vehicleId);
            const operatorMatch = filters.operator === 'all' || vehicle?.operatorId === filters.operator;
            
            const technicianMatch = filters.technician === 'all' 
                || (filters.technician === 'unassigned' && !incident.assignedTo)
                || incident.assignedTo === filters.technician;
                
            const priorityMatch = filters.category === 'all' || incident.priority === filters.category;
            
            const statusMatch = incident.status === activeTab;

            return operatorMatch && technicianMatch && priorityMatch && statusMatch;
        });

        if (activeTab === 'Abierto') {
            incidents.sort((a, b) => {
                const urgencyA = getUrgency(a);
                const urgencyB = getUrgency(b);
                if (urgencyOrder[urgencyA] !== urgencyOrder[urgencyB]) {
                    return urgencyOrder[urgencyA] - urgencyOrder[urgencyB];
                }
                const dueDateA = add(a.reportedAt, { days: a.slaDays });
                const dueDateB = add(b.reportedAt, { days: b.slaDays });
                return dueDateA.getTime() - dueDateB.getTime();
            });
        }

        return incidents;
    }, [filters, activeTab, urgencyOrder]);

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
