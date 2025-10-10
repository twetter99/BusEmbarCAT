'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Users,
  Truck,
  Wrench,
  PlayCircle,
  Eye,
  Building,
  User,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { mockTasks, mockVehicles, mockOperators } from '@/lib/data';
import type { MaintenanceTask } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Simulación de datos en tiempo real para el progreso
const useInterventionProgress = (taskId: string) => {
    const [progress, setProgress] = React.useState(0);
    const [startTime, setStartTime] = React.useState<Date | null>(null);

    React.useEffect(() => {
        // Simula un progreso que aumenta con el tiempo
        const randomStart = Math.random() * 50; // Inicia con algo de progreso
        setProgress(randomStart);
        setStartTime(new Date(Date.now() - Math.random() * 3 * 60 * 60 * 1000)); // Empezó en las últimas 3h

        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + Math.random() * 5;
                return newProgress > 100 ? 100 : newProgress;
            });
        }, 15000); // Actualiza cada 15 segundos

        return () => clearInterval(interval);
    }, [taskId]);
    
    return { progress, startTime };
};

const InterventionRow = ({ task }: { task: MaintenanceTask }) => {
    const { progress, startTime } = useInterventionProgress(task.id);
    const vehicle = mockVehicles.find(v => v.id === task.vehicleId);
    const operator = mockOperators.find(o => o.id === vehicle?.operatorId);

    const estimatedDurationHours = task.frequency === 'Bianual' ? 4 : task.frequency === 'Anual' ? 2 : 1;
    const estimatedEndTime = startTime ? new Date(startTime.getTime() + estimatedDurationHours * 60 * 60 * 1000) : null;
    const isDelayed = estimatedEndTime ? estimatedEndTime < new Date() : false;

    return (
        <TableRow className={isDelayed ? "bg-destructive/10 hover:bg-destructive/20" : ""}>
            <TableCell>
                <div className="font-medium">{task.title}</div>
                <div className="text-xs text-muted-foreground">{task.id}</div>
            </TableCell>
            <TableCell>
                {vehicle ? (
                     <Link href={`/vehicles/${vehicle.uniqueId}`} className="text-primary hover:underline font-medium">
                        {vehicle.uniqueId}
                    </Link>
                ) : (
                    <span className='text-muted-foreground'>{task.vehicleId}</span>
                )}
            </TableCell>
             <TableCell>
                 <div className='flex items-center gap-2'>
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{operator?.name || 'N/A'}</span>
                 </div>
            </TableCell>
             <TableCell>
                <div className='flex items-center gap-2'>
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className='font-medium'>{task.technician || 'Sin Asignar'}</span>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <div className="w-24">
                         <Progress value={progress} className="h-2" />
                    </div>
                    <span className="text-xs font-mono w-10 text-right">{Math.floor(progress)}%</span>
                </div>
            </TableCell>
            <TableCell>
                 <div className="flex items-center gap-2 text-sm">
                    <Clock className={`h-4 w-4 ${isDelayed ? 'text-destructive' : 'text-muted-foreground'}`} />
                    <div>
                        {startTime && <div>Inicio: <span className="font-mono">{format(startTime, 'HH:mm')}</span></div>}
                        {estimatedEndTime && <div>Fin est: <span className="font-mono">{format(estimatedEndTime, 'HH:mm')}</span></div>}
                    </div>
                 </div>
            </TableCell>
            <TableCell>
                {isDelayed && (
                    <Badge variant="destructive" className="animate-pulse">
                        <AlertCircle className="h-3 w-3 mr-1"/>
                        Retrasado
                    </Badge>
                )}
            </TableCell>
            <TableCell className='text-right'>
                 <Button asChild variant="outline" size="sm">
                    <Link href={`/maintenance/preventive/${task.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Ficha
                    </Link>
                </Button>
            </TableCell>
        </TableRow>
    );
};

export default function ActiveInterventionsPage() {
    const { user } = useAuth();

    const activeInterventions = React.useMemo(() => {
        let tasks = mockTasks.filter(t => t.status === 'En Progreso' && t.technician);
        if (user?.role === 'Operador') {
            const operatorVehicles = mockVehicles.filter(v => v.operatorId === user.operatorId).map(v => v.id);
            tasks = tasks.filter(t => operatorVehicles.includes(t.vehicleId));
        }
        return tasks;
    }, [user]);

    const activeTechnicians = React.useMemo(() => {
        return new Set(activeInterventions.map(t => t.technician)).size;
    }, [activeInterventions]);
    
    const activeVehicles = React.useMemo(() => {
        return new Set(activeInterventions.map(t => t.vehicleId)).size;
    }, [activeInterventions]);

    const delayedTasks = activeInterventions.filter(task => {
        const startTime = new Date(Date.now() - Math.random() * 3 * 60 * 60 * 1000);
        const estimatedDurationHours = task.frequency === 'Bianual' ? 4 : task.frequency === 'Anual' ? 2 : 1;
        const estimatedEndTime = new Date(startTime.getTime() + estimatedDurationHours * 60 * 60 * 1000);
        return estimatedEndTime < new Date();
    }).length;

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Intervenciones Activas</CardTitle>
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeInterventions.length}</div>
                        <p className="text-xs text-muted-foreground">Tareas "En Progreso" actualmente.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Técnicos Operando</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeTechnicians}</div>
                         <p className="text-xs text-muted-foreground">Técnicos con tareas asignadas ahora.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vehículos Intervenidos</CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeVehicles}</div>
                         <p className="text-xs text-muted-foreground">Flota en mantenimiento activo.</p>
                    </CardContent>
                </Card>
                 <Card className={delayedTasks > 0 ? 'border-destructive bg-destructive/10' : ''}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Alertas por Retraso</CardTitle>
                        <AlertCircle className={`h-4 w-4 ${delayedTasks > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${delayedTasks > 0 ? 'text-destructive' : ''}`}>{delayedTasks}</div>
                         <p className="text-xs text-muted-foreground">Intervenciones superando tiempo estimado.</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Torre de Control de Intervenciones</CardTitle>
                    <CardDescription>
                        Vista en tiempo real de todas las tareas de mantenimiento preventivo en ejecución.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {activeInterventions.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Intervención</TableHead>
                                    <TableHead>Vehículo</TableHead>
                                    <TableHead>Operador</TableHead>
                                    <TableHead>Técnico</TableHead>
                                    <TableHead>Progreso</TableHead>
                                    <TableHead>Tiempos</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activeInterventions.map((task) => (
                                    <InterventionRow key={task.id} task={task} />
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg min-h-[400px]">
                            <PlayCircle className="h-16 w-16 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold">No hay intervenciones activas</h3>
                            <p className="text-muted-foreground mt-2 max-w-sm">
                                No hay ningún mantenimiento preventivo en estado "En Progreso" en este momento. Las tareas activas aparecerán aquí en tiempo real.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
