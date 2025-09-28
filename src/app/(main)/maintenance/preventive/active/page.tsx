
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
import { format, formatDistanceToNow, differenceInDays, add } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Calendar, Wrench, Truck, AlertTriangle, Zap, Clock, Building, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

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

const statusBadgeVariant: { [key in MaintenanceTask['status']]: 'secondary' | 'default' | 'outline' } = {
    'Pendiente': 'secondary',
    'En Progreso': 'default',
    'Completado': 'outline'
};


const TaskCard = ({ task }: { task: MaintenanceTask }) => {
    const vehicle = mockVehicles.find(v => v.id === task.vehicleId);
    const operator = mockOperators.find(o => o.id === vehicle?.operatorId);
    const urgency = getUrgency(task);
    const UrgencyIcon = urgencyIcons[urgency];

    return (
        <Card className={cn("flex flex-col", task.status === 'Pendiente' ? urgencyCardClass[urgency] : '')}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <CardDescription>{task.frequency}</CardDescription>
                    </div>
                     <Badge variant={statusBadgeVariant[task.status]}>
                        {task.status === 'Pendiente' ? urgencyText[urgency] : task.status}
                    </Badge>
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
                    <div className={cn("text-sm", task.status === 'Pendiente' && urgencyDateClass[urgency], 'p-1 rounded-md')}>
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
                        {task.status === 'En Progreso' ? 'Ver Progreso' : 'Iniciar Intervención'}
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function ActiveInterventionsPage() {
    const { user } = useAuth();

    const activeInterventions = React.useMemo(() => {
        let tasks = mockTasks.filter(t => t.status === 'En Progreso');
        if (user?.role === 'Operador') {
            const operatorVehicles = mockVehicles.filter(v => v.operatorId === user.operatorId).map(v => v.id);
            tasks = tasks.filter(t => operatorVehicles.includes(t.vehicleId));
        }
        return tasks.sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }, [user]);

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Intervenciones Activas</h1>
                    <p className="text-muted-foreground">
                        {activeInterventions.length} mantenimiento(s) preventivo(s) en curso.
                    </p>
                </div>
            </div>

            {activeInterventions.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {activeInterventions.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg min-h-[400px]">
                            <PlayCircle className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold">No hay intervenciones activas</h3>
                            <p className="text-muted-foreground mt-2 max-w-sm">
                                No hay ningún mantenimiento preventivo en estado "En Progreso" en este momento.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </main>
    );
}
