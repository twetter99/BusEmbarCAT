
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2 } from 'lucide-react';

const MaintenancePlanCard = ({ title, interval, tasks }: { title: string, interval: number, tasks: number }) => (
    <Card>
        <CardHeader>
            <CardTitle className='text-lg'>{title}</CardTitle>
            <CardDescription>Se ejecuta cada {interval} meses.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                 <div>
                    <Label htmlFor={`interval-${title}`}>Intervalo (meses)</Label>
                    <Input id={`interval-${title}`} type="number" defaultValue={interval} />
                </div>
                 <div>
                    <Label>Tareas asociadas</Label>
                    <p className="text-sm text-muted-foreground">{tasks} tareas definidas en el checklist.</p>
                    <Button variant='link' className='p-0 h-auto'>Editar Checklist</Button>
                </div>
            </div>
        </CardContent>
        <CardFooter className='flex justify-between'>
            <Button variant='ghost' className='text-destructive hover:text-destructive'>
                <Trash2 className='mr-2' />
                Eliminar Plan
            </Button>
            <Button>Guardar</Button>
        </CardFooter>
    </Card>
)

export default function ConfigPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className='grid gap-6 lg:grid-cols-2'>
            <div className='space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>Planes de Mantenimiento</CardTitle>
                        <CardDescription>Define las periodicidades de los mantenimientos preventivos y las tareas asociadas a cada uno.</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <MaintenancePlanCard title="Mantenimiento Trimestral" interval={3} tasks={8} />
                        <MaintenancePlanCard title="Mantenimiento Anual" interval={12} tasks={16} />
                        <MaintenancePlanCard title="Mantenimiento Bianual" interval={24} tasks={23} />
                    </CardContent>
                    <CardFooter>
                        <Button variant='outline' className='w-full'>Añadir Nuevo Plan de Mantenimiento</Button>
                    </CardFooter>
                </Card>
            </div>
            <div className='space-y-6'>
                 <Card>
                    <CardHeader>
                        <CardTitle>Configuración de Alertas</CardTitle>
                        <CardDescription>Ajusta cuándo y cómo se envían las notificaciones de vencimiento.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className='space-y-0.5'>
                                <Label htmlFor="notifications-enabled">Activar notificaciones</Label>
                                <p className='text-sm text-muted-foreground'>
                                    Envía alertas por email cuando los mantenimientos están próximos a vencer o vencidos.
                                </p>
                            </div>
                            <Switch id="notifications-enabled" defaultChecked />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='alert-urgent'>Umbral "Urgente" (días antes)</Label>
                            <Input id='alert-urgent' type='number' defaultValue={3} />
                        </div>

                         <div className='space-y-2'>
                            <Label htmlFor='alert-upcoming'>Umbral "Próximo" (días antes)</Label>
                            <Input id='alert-upcoming' type='number' defaultValue={15} />
                        </div>
                        
                         <div className='space-y-2'>
                            <Label>Destinatarios de Alertas</Label>
                             <Input placeholder="ej: supervisor@operador.com, jefe.taller@operador.com" />
                             <p className='text-xs text-muted-foreground'>Añade múltiples emails separados por comas.</p>
                        </div>

                    </CardContent>
                    <CardFooter>
                        <Button className="ml-auto">Guardar Configuración</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </main>
  );
}
