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
import { mockTasks } from '@/lib/data';
import type { MaintenanceTask } from '@/lib/types';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Calendar, Wrench } from 'lucide-react';

const statusVariant: { [key in MaintenanceTask['status']]: 'default' | 'secondary' | 'outline' } = {
    'Pendiente': 'default',
    'En Progreso': 'secondary',
    'Completado': 'outline',
}

const TaskCard = ({ task }: { task: MaintenanceTask }) => (
    <Card>
        <CardHeader>
            <div className="flex items-start justify-between">
                <div>
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <CardDescription>{task.vehicleId}</CardDescription>
                </div>
                 <Badge variant={statusVariant[task.status]}>{task.status}</Badge>
            </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Vence {formatDistanceToNow(task.dueDate, { addSuffix: true, locale: es })} ({format(task.dueDate, 'd MMM, yyyy', { locale: es })})</span>
            </div>
            <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                <span>{task.equipmentType} ({task.frequency})</span>
            </div>
             {task.technician && <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Asignado a {task.technician}</span>
            </div>}
        </CardContent>
        <CardFooter>
            <Button variant="secondary" size="sm">Ver Detalles</Button>
        </CardFooter>
    </Card>
)

export default function TasksPage() {
    const pendingTasks = mockTasks.filter(t => t.status === 'Pendiente');
    const inProgressTasks = mockTasks.filter(t => t.status === 'En Progreso');
    const completedTasks = mockTasks.filter(t => t.status === 'Completado');

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">Pendiente ({pendingTasks.length})</TabsTrigger>
                <TabsTrigger value="in-progress">En Progreso ({inProgressTasks.length})</TabsTrigger>
                <TabsTrigger value="completed">Completado ({completedTasks.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-4">
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pendingTasks.map(task => <TaskCard key={task.id} task={task} />)}
                </div>
            </TabsContent>
            <TabsContent value="in-progress" className="mt-4">
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)}
                </div>
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {completedTasks.map(task => <TaskCard key={task.id} task={task} />)}
                </div>
            </TabsContent>
        </Tabs>
    </main>
  );
}
