
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
import { User, Calendar, Wrench, Truck, AlertTriangle, Zap, Clock, Building, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { FilterControls } from '@/components/layout/filter-controls';

type UrgencyStatus = 'Vencido' | 'Urgente' | 'Próximo' | 'Normal';

const getUrgency = (task: MaintenanceTask): UrgencyStatus => {
    if (task.status !== 'Pendiente') return 'Normal';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);

    const daysDiff = differenceInDays(taskDate, today);

    if (daysDiff < 0) return 'Vencido';
    if (daysDiff <= 3) return 'Urgente';
    if (daysDiff <= 15) return 'Próximo';
    return 'Normal';
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
    'Normal': 'Pendiente',
};

const urgencyCardClass: { [key in UrgencyStatus]: string } = {
  'Vencido': 'border-l-4 border-l-destructive',
  'Urgente': 'border-l-4 border-l-warning',
  'Próximo': 'border-l-4 border-l-attention',
  'Normal': '',
};

const urgencyDateClass: { [key in UrgencyStatus]: string } = {
  'Vencido': 'bg-destructive/10 text-destructive',
  'Urgente': 'bg-warning/10 text-warning-foreground',
  'Próximo': 'bg-attention/10 text-attention-foreground',
  'Normal': '',
};

const urgencyIcons: { [key in UrgencyStatus]: React.ElementType } = {
  'Vencido': AlertTriangle,
  'Urgente': Zap,
  'Próximo': Calendar,
  'Normal': Clock,
};

const TaskCard = ({ task }: { task: MaintenanceTask }) => {
    const vehicle = mockVehicles.find(v => v.id === task.vehicleId);
    const operator = mockOperators.find(o => o.id === vehicle?.operatorId);
    const urgency = getUrgency(task);
    const UrgencyIcon = urgencyIcons[urgency];

    return (
        <Card className={cn("flex flex-col", urgencyCardClass[urgency])}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <CardDescription>{task.frequency}</CardDescription>
                    </div>
                     <Badge variant={urgencyBadgeVariant[urgency]}>{urgencyText[urgency]}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground flex-grow">
                 {vehicle && (
                    <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <Link href={`/vehicles/${vehicle.uniqueId}`} className="hover:underline text-primary">
                            {vehicle.uniqueId}
                        </Link>
                    </div>
                )}
                 {operator && (
                    <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span className="text-xs">{operator.name}</span>
                    </div>
                )}
                <div className="flex items-start gap-2">
                    <UrgencyIcon className={cn("h-4 w-4 mt-0.5", {
                        'text-destructive': urgency === 'Vencido',
                        'text-warning': urgency === 'Urgente',
                        'text-attention': urgency === 'Próximo',
                    })} />
                    <div className={cn("text-sm p-1 rounded-md", urgencyDateClass[urgency])}>
                       <span>
                         {urgency === 'Vencido' ? 'Vencido ' : 'Vence '}
                         {formatDistanceToNow(task.dueDate, { addSuffix: true, locale: es })}
                       </span>
                        <br />
                       <span className="text-xs">({format(task.dueDate, 'd MMM, yyyy', { locale: es })})</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    <span>Revisión de: {task.equipmentType}</span>
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
                 <Button className="w-full" asChild>
                    <Link href={`/maintenance/preventive/${task.id}`}>
                        Iniciar Intervención
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function DuePage() {
  const { user } = useAuth();
  const [filters, setFilters] = React.useState({
    operator: 'all',
    category: 'all', // Represents frequency in this context
  });

  const allPendingTasks = React.useMemo(() => {
    let tasks = mockTasks.filter(t => t.status === 'Pendiente');
     if (user?.role === 'Operador') {
        const operatorVehicles = mockVehicles.filter(v => v.operatorId === user.operatorId).map(v => v.id);
        tasks = tasks.filter(t => operatorVehicles.includes(t.vehicleId));
    }
    return tasks.sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [user]);

  const frequencies = React.useMemo(() => {
      const freqSet = new Set<MaintenanceTask['frequency']>();
      allPendingTasks.forEach(task => freqSet.add(task.frequency));
      return Array.from(freqSet);
  }, [allPendingTasks]);

  const availableOperators = React.useMemo(() => {
      if (user?.role === 'Operador') {
          return mockOperators.filter(op => op.id === user.operatorId);
      }
      const operatorIds = new Set(allPendingTasks.map(t => mockVehicles.find(v => v.id === t.vehicleId)?.operatorId));
      return mockOperators.filter(op => operatorIds.has(op.id));
  }, [user, allPendingTasks]);

  const filteredTasks = React.useMemo(() => {
    return allPendingTasks.filter(task => {
        const vehicle = mockVehicles.find(v => v.id === task.vehicleId);
        const operatorMatch = filters.operator === 'all' || vehicle?.operatorId === filters.operator;
        const frequencyMatch = filters.category === 'all' || task.frequency === filters.category;
        return operatorMatch && frequencyMatch;
    });
  }, [allPendingTasks, filters]);
  
  const tasksByUrgency = React.useMemo(() => {
    const grouped: Record<UrgencyStatus, MaintenanceTask[]> = {
      'Vencido': [],
      'Urgente': [],
      'Próximo': [],
      'Normal': []
    };
    filteredTasks.forEach(task => {
      const urgency = getUrgency(task);
      grouped[urgency].push(task);
    });
    return grouped;
  }, [filteredTasks]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">Control de Vencimientos</h1>
                <p className="text-muted-foreground">
                    {filteredTasks.length} de {allPendingTasks.length} mantenimientos pendientes mostrados.
                </p>
            </div>
        </div>

        <FilterControls
            filters={filters}
            onFilterChange={setFilters}
            categories={frequencies}
            categoryLabel="Frecuencia"
            operators={availableOperators}
        />
      
      {Object.entries(tasksByUrgency).map(([urgency, tasks]) => (
        tasks.length > 0 && (
          <div key={urgency}>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Badge variant={urgencyBadgeVariant[urgency as UrgencyStatus]}>{urgency}</Badge>
                <span className='text-muted-foreground text-sm'>({tasks.length} tareas)</span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )
      ))}

      {filteredTasks.length === 0 && (
        <Card>
            <CardContent className='pt-6'>
                <div className="text-center text-muted-foreground py-12">
                    <p className="font-semibold">No hay mantenimientos pendientes que coincidan con los filtros.</p>
                </div>
            </CardContent>
        </Card>
      )}

    </main>
  );
}
