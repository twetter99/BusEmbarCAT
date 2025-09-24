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
import { mockTasks, mockVehicles, mockOperators } from '@/lib/data';
import type { MaintenanceTask } from '@/lib/types';
import { format, formatDistanceToNow, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Calendar, Wrench, Truck, AlertTriangle, Zap, Clock, Building } from 'lucide-react';
import Link from 'next/link';
import { FilterControls } from '@/components/layout/filter-controls';
import { cn } from '@/lib/utils';


type UrgencyStatus = 'Vencido' | 'Urgente' | 'Próximo' | 'Normal';

const getUrgency = (dueDate: Date): UrgencyStatus => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    const daysDiff = differenceInDays(taskDate, today);

    if (daysDiff < 0) return 'Vencido';
    if (daysDiff <= 2) return 'Urgente';
    if (daysDiff <= 7) return 'Próximo';
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
    const urgency = task.status === 'Pendiente' ? getUrgency(task.dueDate) : 'Normal';
    const UrgencyIcon = urgencyIcons[urgency];

    return (
        <Card className={cn("flex flex-col", task.status === 'Pendiente' ? urgencyCardClass[urgency] : '')}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <Badge variant="secondary" className="mb-2">{task.frequency}</Badge>
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
                    })} />
                    <div className={cn("text-sm", task.status === 'Pendiente' && urgencyDateClass[urgency], 'p-1 rounded-md')}>
                       <span>
                         {formatDistanceToNow(task.dueDate, { addSuffix: true, locale: es })}
                       </span>
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
                <Button className="w-full">{buttonTextByStatus[task.status]}</Button>
            </CardFooter>
        </Card>
    );
}

export default function PreventivePage() {
    const [activeTab, setActiveTab] = React.useState('Pendiente');
    const [filters, setFilters] = React.useState({
      operator: 'all',
      technician: 'all',
      category: 'all',
    });

    const technicians = React.useMemo(() => {
        const techSet = new Set<string>();
        mockTasks.forEach(task => {
            if(task.technician) techSet.add(task.technician);
        });
        return Array.from(techSet).sort();
    }, []);

    const frequencies = React.useMemo(() => {
        const freqSet = new Set<string>();
        mockTasks.forEach(task => freqSet.add(task.frequency));
        return Array.from(freqSet).sort();
    }, []);

    const urgencyOrder: Record<UrgencyStatus, number> = {
        'Vencido': 1,
        'Urgente': 2,
        'Próximo': 3,
        'Normal': 4,
    };

    const getPendingTabTitle = () => {
        const pending = allTasksByStatus['Pendiente'];
        return `Pendiente (${pending.length})`;
    }

    const filteredTasks = React.useMemo(() => {
        const tasks = mockTasks.filter(task => {
            const vehicle = mockVehicles.find(v => v.id === task.vehicleId);
            const operatorMatch = filters.operator === 'all' || vehicle?.operatorId === filters.operator;
            
            const technicianMatch = filters.technician === 'all' 
                || (filters.technician === 'unassigned' && !task.technician)
                || task.technician === filters.technician;
                
            const frequencyMatch = filters.category === 'all' || task.frequency === filters.category;
            
            const statusMatch = task.status === activeTab;

            return operatorMatch && technicianMatch && frequencyMatch && statusMatch;
        });

        if (activeTab === 'Pendiente') {
            tasks.sort((a, b) => {
                const urgencyA = getUrgency(a.dueDate);
                const urgencyB = getUrgency(b.dueDate);
                if (urgencyOrder[urgencyA] !== urgencyOrder[urgencyB]) {
                    return urgencyOrder[urgencyA] - urgencyOrder[urgencyB];
                }
                return a.dueDate.getTime() - b.dueDate.getTime();
            });
        }
        
        return tasks;
    }, [filters, activeTab, urgencyOrder]);
    
    const allTasksByStatus = {
        'Pendiente': mockTasks.filter(t => t.status === 'Pendiente'),
        'En Progreso': mockTasks.filter(t => t.status === 'En Progreso'),
        'Completado': mockTasks.filter(t => t.status === 'Completado'),
    };
    
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
                onFilterChange={setFilters}
                technicians={technicians}
                categories={frequencies}
                categoryLabel="Frecuencia"
                operators={mockOperators}
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
