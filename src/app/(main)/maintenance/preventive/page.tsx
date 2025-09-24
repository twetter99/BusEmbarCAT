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
import { mockTasks, mockVehicles } from '@/lib/data';
import type { MaintenanceTask } from '@/lib/types';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Calendar, Wrench, Truck } from 'lucide-react';
import Link from 'next/link';

const statusVariant: { [key in MaintenanceTask['status']]: 'destructive' | 'secondary' | 'outline' } = {
    'Pendiente': 'destructive',
    'En Progreso': 'secondary',
    'Completado': 'outline',
}

const TaskCard = ({ task }: { task: MaintenanceTask }) => {
    const vehicle = mockVehicles.find(v => v.id === task.vehicleId);
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <Badge variant="secondary" className="mb-2">{task.frequency}</Badge>
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <CardDescription>Mantenimiento Preventivo</CardDescription>
                    </div>
                    <Badge variant={statusVariant[task.status]}>{task.status}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground flex-grow">
                 {vehicle && (
                    <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        <Link href={`/vehicles/${vehicle.uniqueId}`} className="hover:underline text-primary">
                            {vehicle.uniqueId} ({task.vehicleId})
                        </Link>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Vence {formatDistanceToNow(task.dueDate, { addSuffix: true, locale: es })} ({format(task.dueDate, 'd MMM, yyyy', { locale: es })})</span>
                </div>
                <div className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    <span>Revisión de: {task.equipmentType}</span>
                </div>
                {task.technician && <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Asignado a {task.technician}</span>
                </div>}
            </CardContent>
            <CardFooter>
                <Button className="w-full">Iniciar Tarea</Button>
            </CardFooter>
        </Card>
    );
}

export default function PreventivePage() {
    const pendingTasks = mockTasks.filter(t => t.status === 'Pendiente');
    const inProgressTasks = mockTasks.filter(t => t.status === 'En Progreso');
    const completedTasks = mockTasks.filter(t => t.status === 'Completado');

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Tabs defaultValue="pending">
            <div className="flex items-center justify-between mb-4">
                 <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="pending">Pendiente ({pendingTasks.length})</TabsTrigger>
                    <TabsTrigger value="in-progress">En Progreso ({inProgressTasks.length})</TabsTrigger>
                    <TabsTrigger value="completed">Completado ({completedTasks.length})</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="pending">
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {pendingTasks.map(task => <TaskCard key={task.id} task={task} />)}
                </div>
                 {pendingTasks.length === 0 && <p className="text-muted-foreground text-center py-8">No hay tareas pendientes.</p>}
            </TabsContent>
            <TabsContent value="in-progress">
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)}
                </div>
                 {inProgressTasks.length === 0 && <p className="text-muted-foreground text-center py-8">No hay tareas en progreso.</p>}
            </TabsContent>
            <TabsContent value="completed">
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {completedTasks.map(task => <TaskCard key={task.id} task={task} />)}
                </div>
                 {completedTasks.length === 0 && <p className="text-muted-foreground text-center py-8">No hay tareas completadas.</p>}
            </TabsContent>
        </Tabs>
    </main>
  );
}
