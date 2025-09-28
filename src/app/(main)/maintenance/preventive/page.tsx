
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
import { mockTasks, mockVehicles, mockOperators } from '@/lib/data';
import type { MaintenanceTask } from '@/lib/types';
import { format, formatDistanceToNow, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Calendar, Wrench, Truck, AlertTriangle, Zap, Clock, Building } from 'lucide-react';
import Link from 'next/link';
import { FilterControls } from '@/components/layout/filter-controls';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';


type UrgencyStatus = 'Vencido' | 'Urgente' | 'Próximo' | 'Normal';

const getUrgency = (dueDate: Date): UrgencyStatus => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    const daysDiff = differenceInDays(taskDate, today);

    if (daysDiff < 0) return 'Vencido';
    if (daysDiff <= 3) return 'Urgente';
    if (daysDiff <= 15) return 'Próximo';
    return 'Normal';
};

const statusVariant: { [key in MaintenanceTask['status']]: 'destructive' | 'secondary' | 'outline' } = {
    'Pendiente': 'destructive',
    'En Progreso': 'secondary',
    'Completado': 'outline',
}

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
    'Normal': 'Pendiente',
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

const buttonTextByStatus: { [key in MaintenanceTask['status']]: string } = {
    'Pendiente': 'Ver Ficha',
    'En Progreso': 'Ver Progreso',
    'Completado': 'Ver Informe',
}

const TaskCard = ({ task }: { task: MaintenanceTask }) => {
    const vehicle = mockVehicles.find(v => v.id === task.vehicleId);
    const operator = mockOperators.find(o => o.id === vehicle?.operatorId);
    const urgency = task.status === 'Pendiente' ? getUrgency(task.dueDate) : 'Normal';
    const UrgencyIcon = urgencyIcons[urgency];
    const today = new Date();

    const isOverdue = differenceInDays(task.dueDate, today) < 0;
    
    const dateText = isOverdue
      ? `Vencido ${formatDistanceToNow(task.dueDate, { addSuffix: true, locale: es })}`.replace('hace aproximadamente', 'hace')
      : `Vence ${formatDistanceToNow(task.dueDate, { addSuffix: true, locale: es })}`;


    return (
        <Card className={cn("flex flex-col", task.status === 'Pendiente' ? urgencyCardClass[urgency] : '')}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <CardDescription>Mantenimiento Preventivo</CardDescription>
                    </div>
                     {task.status === 'Pendiente' ? (
                        <Badge variant={urgencyBadgeVariant[urgency]}>{urgencyText[urgency]}</Badge>
                    ) : (
                        <Badge variant={statusVariant[task.status]}>{task.status}</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground flex-grow">
                 {vehicle && (
                    <>
                        <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4" />
                            <Link href={`/vehicles/${vehicle.uniqueId}`} className="hover:underline text-primary">
                                {vehicle.uniqueId} ({task.vehicleId})
                            </Link>
                        </div>
                         {operator && (
                            <div className="flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                <span className="text-xs">{operator.name}</span>
                            </div>
                         )}
                    </>
                )}
                <div className="flex items-start gap-2">
                    <UrgencyIcon className={cn("h-4 w-4 mt-0.5", {
                        'text-destructive': urgency === 'Vencido',
                        'text-warning': urgency === 'Urgente',
                        'text-attention': urgency === 'Próximo',
                    })} />
                    <div className={cn("text-sm", task.status === 'Pendiente' && urgencyDateClass[urgency], 'p-1 rounded-md')}>
                       <span>{dateText}</span>
                       <br />
                       <span className="text-xs">({format(task.dueDate, 'd MMM, yyyy', { locale: es })})</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    <span>Tarea: {task.equipmentType}</span>
                </div>
                {task.technician ? <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Asignado a {task.technician}</span>
                </div> : <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="text-muted-foreground italic">Sin asignar</span>
                </div>}
            </CardContent>
            <CardFooter>
                 <Button asChild className="w-full">
                    <Link href={`/maintenance/preventive/${task.id}`}>{buttonTextByStatus[task.status]}</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function PreventivePage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = React.useState('Pendiente');
    const [filters, setFilters] = React.useState({
      operator: 'all',
      category: 'all',
    });

    const userTasks = React.useMemo(() => {
        if (user?.role === 'Operador') {
            const operatorVehicles = mockVehicles.filter(v => v.operatorId === user.operatorId).map(v => v.id);
            return mockTasks.filter(t => operatorVehicles.includes(t.vehicleId));
        }
        return mockTasks;
    }, [user]);

    const frequencies = React.useMemo(() => {
        const freqSet = new Set<string>();
        userTasks.forEach(task => freqSet.add(task.frequency));
        return Array.from(freqSet).sort();
    }, [userTasks]);
    
    const availableOperators = React.useMemo(() => {
        if (user?.role === 'Operador') {
            return mockOperators.filter(op => op.id === user.operatorId);
        }
        const operatorIds = new Set(userTasks.map(t => {
            const vehicle = mockVehicles.find(v => v.id === t.vehicleId);
            return vehicle?.operatorId;
        }));
        return mockOperators.filter(op => operatorIds.has(op.id));
    }, [user, userTasks]);

    const urgencyOrder: Record<UrgencyStatus, number> = {
        'Vencido': 1,
        'Urgente': 2,
        'Próximo': 3,
        'Normal': 4,
    };
    
    const allTasksByStatus = React.useMemo(() => ({
        'Pendiente': userTasks.filter(t => t.status === 'Pendiente'),
        'En Progreso': userTasks.filter(t => t.status === 'En Progreso'),
        'Completado': userTasks.filter(t => t.status === 'Completado'),
    }), [userTasks]);

    const getPendingTabTitle = () => {
        return `Pendiente (${allTasksByStatus['Pendiente'].length})`;
    }

    const filteredTasks = React.useMemo(() => {
        const tasks = allTasksByStatus[activeTab as keyof typeof allTasksByStatus] || [];

        const filtered = tasks.filter(task => {
            const vehicle = mockVehicles.find(v => v.id === task.vehicleId);
            const operatorMatch = filters.operator === 'all' || vehicle?.operatorId === filters.operator;
            const frequencyMatch = filters.category === 'all' || task.frequency === filters.category;
            
            return operatorMatch && frequencyMatch;
        });

        if (activeTab === 'Pendiente') {
            filtered.sort((a, b) => {
                const urgencyA = getUrgency(a.dueDate);
                const urgencyB = getUrgency(b.dueDate);
                if (urgencyOrder[urgencyA] !== urgencyOrder[urgencyB]) {
                    return urgencyOrder[urgencyA] - urgencyOrder[urgencyB];
                }
                return a.dueDate.getTime() - b.dueDate.getTime();
            });
        }
        
        return filtered;
    }, [filters, activeTab, allTasksByStatus, urgencyOrder]);
    
    const displayedTasks = filteredTasks;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
                 <TabsList className="grid w-full max-w-lg grid-cols-3">
                    <TabsTrigger value="Pendiente">{getPendingTabTitle()}</TabsTrigger>
                    <TabsTrigger value="En Progreso">En Progreso ({allTasksByStatus['En Progreso'].length})</TabsTrigger>
                    <TabsTrigger value="Completado">Completado ({allTasksByStatus['Completado'].length})</TabsTrigger>
                </TabsList>
            </div>

            <FilterControls
                filters={filters}
                onFilterChange={(newFilters) => setFilters(f => ({...f, ...newFilters}))}
                categories={frequencies}
                categoryLabel="Frecuencia"
                operators={availableOperators}
            />

            <div className="mt-4">
                {displayedTasks.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {displayedTasks.map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-center py-8">
                        No hay tareas que coincidan con los filtros seleccionados para el estado "{activeTab}".
                    </p>
                )}
            </div>
        </Tabs>
    </main>
  );
}

    
