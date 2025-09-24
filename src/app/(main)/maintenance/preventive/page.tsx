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
import { mockTasks, mockVehicles, mockOperators, mockUsers } from '@/lib/data';
import type { MaintenanceTask, Operator } from '@/lib/types';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Calendar, Wrench, Truck } from 'lucide-react';
import Link from 'next/link';
import { FilterControls } from './filter-controls';

const statusVariant: { [key in MaintenanceTask['status']]: 'destructive' | 'secondary' | 'outline' } = {
    'Pendiente': 'destructive',
    'En Progreso': 'secondary',
    'Completado': 'outline',
}

const buttonTextByStatus: { [key in MaintenanceTask['status']]: string } = {
    'Pendiente': 'Ver Ficha',
    'En Progreso': 'Ver Progreso',
    'Completado': 'Ver Informe',
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
      frequency: 'all',
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

    const filteredTasks = React.useMemo(() => {
        return mockTasks.filter(task => {
            const vehicle = mockVehicles.find(v => v.id === task.vehicleId);
            const operatorMatch = filters.operator === 'all' || vehicle?.operatorId === filters.operator;
            
            const technicianMatch = filters.technician === 'all' 
                || (filters.technician === 'unassigned' && !task.technician)
                || task.technician === filters.technician;
                
            const frequencyMatch = filters.frequency === 'all' || task.frequency === filters.frequency;
            
            const statusMatch = task.status === activeTab;

            return operatorMatch && technicianMatch && frequencyMatch && statusMatch;
        });
    }, [filters, activeTab]);
    
    const pendingTasks = mockTasks.filter(t => t.status === 'Pendiente');
    const inProgressTasks = mockTasks.filter(t => t.status === 'En Progreso');
    const completedTasks = mockTasks.filter(t => t.status === 'Completado');
    
    const displayedTasks = filteredTasks;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
                 <TabsList className="grid w-full max-w-lg grid-cols-3">
                    <TabsTrigger value="Pendiente">Pendiente ({pendingTasks.length})</TabsTrigger>
                    <TabsTrigger value="En Progreso">En Progreso ({inProgressTasks.length})</TabsTrigger>
                    <TabsTrigger value="Completado">Completado ({completedTasks.length})</TabsTrigger>
                </TabsList>
            </div>

            <FilterControls
                filters={filters}
                onFilterChange={setFilters}
                technicians={technicians}
                frequencies={frequencies}
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
