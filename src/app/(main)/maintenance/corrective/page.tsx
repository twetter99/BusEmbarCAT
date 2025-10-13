
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
import { ca } from 'date-fns/locale';
import { User, Calendar, Wrench, Truck, AlertTriangle, Zap, Clock, Building } from 'lucide-react';
import Link from 'next/link';
import { FilterControls } from '@/components/layout/filter-controls';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

type UrgencyStatus = 'Vencido' | 'Urgente' | 'Próximo' | 'Normal';

const getUrgency = (incident: Incident): UrgencyStatus => {
    if (incident.status !== 'Abierto') return 'Normal';
    if (!incident.slaDays) return 'Normal';
    
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
    'Normal': 'default',
    'Baixa': 'outline',
};

const urgencyBadgeVariant: { [key in UrgencyStatus]: 'destructive' | 'warning' | 'attention' | 'default' } = {
    'Vencido': 'destructive',
    'Urgente': 'warning',
    'Próximo': 'attention',
    'Normal': 'default',
};

const urgencyText: { [key in UrgencyStatus]: string } = {
    'Vencido': 'Vençut',
    'Urgente': 'Urgent',
    'Próximo': 'Proper',
    'Normal': 'Obert',
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
    'Abierto': 'Veure Fitxa',
    'En Progreso': 'Veure Progrés',
    'Resuelto': 'Veure Informe',
};

const IncidentCard = ({ incident }: { incident: Incident }) => {
    const vehicle = mockVehicles.find(v => v.id === incident.vehicleId);
    const urgency = getUrgency(incident);
    const UrgencyIcon = urgencyIcons[urgency];
    const dueDate = incident.slaDays ? add(incident.reportedAt, { days: incident.slaDays }) : null;

    return (
        <Card className={cn("flex flex-col", incident.status === 'Abierto' ? urgencyCardClass[urgency] : '')}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <Badge variant={priorityVariant[incident.priority]} className="mb-2">{incident.priority}</Badge>
                        <CardTitle className="text-lg">{incident.issue}</CardTitle>
                        <CardDescription>Manteniment Correctiu</CardDescription>
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
                {dueDate && (
                    <div className="flex items-start gap-2">
                        <UrgencyIcon className={cn("h-4 w-4 mt-0.5", {
                            'text-destructive': urgency === 'Vencido',
                            'text-warning': urgency === 'Urgente',
                            'text-attention': urgency === 'Próximo',
                            'text-muted-foreground': urgency === 'Normal',
                        })} />
                        <div className={cn("text-sm", incident.status === 'Abierto' && urgencyDateClass[urgency], 'p-1 rounded-md')}>
                        <span>
                            {urgency === 'Vencido' ? 'Vençut ' : 'Venç '}
                            {formatDistanceToNow(dueDate, { addSuffix: true, locale: ca })}
                        </span>
                            <br />
                        <span className="text-xs">({format(dueDate, 'd MMM, yyyy', { locale: ca })})</span>
                        </div>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    <span>Revisió de: {incident.equipmentType || 'General'}</span>
                </div>
                {incident.assignedTo ? <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Assignat a {incident.assignedTo}</span>
                </div> : <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-muted-foreground italic">Sense assignar</span>
                </div>}
            </CardContent>
            <CardFooter>
                <Button className="w-full">{buttonTextByStatus[incident.status]}</Button>
            </CardFooter>
        </Card>
    );
}

export default function CorrectivePage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = React.useState('Abierto');
    const [filters, setFilters] = React.useState({
      operator: 'all',
      technician: 'all',
      category: 'all',
    });

    const userIncidents = React.useMemo(() => {
        if (user?.role === 'Operador') {
            const operatorVehicles = mockVehicles.filter(v => v.operatorId === user.operatorId).map(v => v.id);
            return mockIncidents.filter(i => operatorVehicles.includes(i.vehicleId));
        }
        return mockIncidents;
    }, [user]);

    const technicians = React.useMemo(() => {
        const techSet = new Set<string>();
        userIncidents.forEach(task => {
            if(task.assignedTo) techSet.add(task.assignedTo);
        });
        return Array.from(techSet).sort();
    }, [userIncidents]);

    const priorities = React.useMemo(() => {
        const prioritySet = new Set<Incident['priority']>();
        userIncidents.forEach(task => prioritySet.add(task.priority));
        return Array.from(prioritySet);
    }, [userIncidents]);

    const availableOperators = React.useMemo(() => {
        if (user?.role === 'Operador') {
            return mockOperators.filter(op => op.id === user.operatorId);
        }
        const operatorIds = new Set(userIncidents.map(i => {
            const vehicle = mockVehicles.find(v => v.id === i.vehicleId);
            return vehicle?.operatorId;
        }));
        return mockOperators.filter(op => operatorIds.has(op.id));
    }, [user, userIncidents]);

    const urgencyOrder: Record<UrgencyStatus, number> = {
        'Vencido': 1,
        'Urgente': 2,
        'Próximo': 3,
        'Normal': 4,
    };
    
    const allIncidentsByStatus = React.useMemo(() => ({
        'Abierto': userIncidents.filter(i => i.status === 'Abierto'),
        'En Progreso': userIncidents.filter(i => i.status === 'En Progreso'),
        'Resuelto': userIncidents.filter(i => i.status === 'Resuelto'),
    }),[userIncidents]);

    const filteredIncidents = React.useMemo(() => {
        const incidents = allIncidentsByStatus[activeTab as keyof typeof allIncidentsByStatus] || [];
        
        const filtered = incidents.filter(incident => {
            const vehicle = mockVehicles.find(v => v.id === incident.vehicleId);
            const operatorMatch = filters.operator === 'all' || vehicle?.operatorId === filters.operator;
            
            const technicianMatch = filters.technician === 'all' 
                || (filters.technician === 'unassigned' && !incident.assignedTo)
                || incident.assignedTo === filters.technician;
                
            const priorityMatch = filters.category === 'all' || incident.priority === filters.category;
            
            return operatorMatch && technicianMatch && priorityMatch;
        });

        if (activeTab === 'Abierto') {
            filtered.sort((a, b) => {
                const urgencyA = getUrgency(a);
                const urgencyB = getUrgency(b);
                if (urgencyOrder[urgencyA] !== urgencyOrder[urgencyB]) {
                    return urgencyOrder[urgencyA] - urgencyOrder[urgencyB];
                }
                const dueDateA = a.slaDays ? add(a.reportedAt, {days: a.slaDays}) : new Date();
                const dueDateB = b.slaDays ? add(b.reportedAt, {days: b.slaDays}) : new Date();
                return dueDateA.getTime() - dueDateB.getTime();
            });
        }

        return filtered;
    }, [filters, activeTab, allIncidentsByStatus, urgencyOrder]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
             <div className="flex items-center justify-between mb-4">
                 <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="Abierto">Obertes ({allIncidentsByStatus['Abierto'].length})</TabsTrigger>
                    <TabsTrigger value="En Progreso">En Reparació ({allIncidentsByStatus['En Progreso'].length})</TabsTrigger>
                    <TabsTrigger value="Resuelto">Resoltes ({allIncidentsByStatus['Resuelto'].length})</TabsTrigger>
                </TabsList>
            </div>
            
            <FilterControls
                filters={filters}
                onFilterChange={setFilters}
                technicians={technicians}
                showTechnicianFilter
                categories={priorities}
                categoryLabel="Prioritat"
                operators={availableOperators}
            />

            <div className="mt-4">
                {filteredIncidents.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredIncidents.map(incident => <IncidentCard key={incident.id} incident={incident} />)}
                    </div>
                ) : (
                     <p className="text-muted-foreground text-center py-8">No hi ha avaries que coincideixin amb els filtres seleccionats per a l'estat "{activeTab}".</p>
                )}
            </div>
        </Tabs>
    </main>
  );
}
