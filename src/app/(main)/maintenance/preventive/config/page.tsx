
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
            <CardDescription>S'executa cada {interval} mesos.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                 <div>
                    <Label htmlFor={`interval-${title}`}>Interval (mesos)</Label>
                    <Input id={`interval-${title}`} type="number" defaultValue={interval} />
                </div>
                 <div>
                    <Label>Tasques associades</Label>
                    <p className="text-sm text-muted-foreground">{tasks} tasques definides al checklist.</p>
                    <Button variant='link' className='p-0 h-auto'>Editar Checklist</Button>
                </div>
            </div>
        </CardContent>
        <CardFooter className='flex justify-between'>
            <Button variant='ghost' className='text-destructive hover:text-destructive'>
                <Trash2 className='mr-2' />
                Eliminar Pla
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
                        <CardTitle>Plans de Manteniment</CardTitle>
                        <CardDescription>Definiu les periodicitats dels manteniments preventius i les tasques associades a cadascun.</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <MaintenancePlanCard title="Manteniment Trimestral" interval={3} tasks={8} />
                        <MaintenancePlanCard title="Manteniment Anual" interval={12} tasks={16} />
                        <MaintenancePlanCard title="Manteniment Bianual" interval={24} tasks={23} />
                    </CardContent>
                    <CardFooter>
                        <Button variant='outline' className='w-full'>Afegir Nou Pla de Manteniment</Button>
                    </CardFooter>
                </Card>
            </div>
            <div className='space-y-6'>
                 <Card>
                    <CardHeader>
                        <CardTitle>Configuració d'Alertes</CardTitle>
                        <CardDescription>Ajusteu quan i com s'envien les notificacions de venciment.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className='space-y-0.5'>
                                <Label htmlFor="notifications-enabled">Activar notificacions</Label>
                                <p className='text-sm text-muted-foreground'>
                                    Envia alertes per email quan els manteniments estan a punt de vèncer o vençuts.
                                </p>
                            </div>
                            <Switch id="notifications-enabled" defaultChecked />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='alert-urgent'>Límit "Urgent" (dies abans)</Label>
                            <Input id='alert-urgent' type='number' defaultValue={3} />
                        </div>

                         <div className='space-y-2'>
                            <Label htmlFor='alert-upcoming'>Límit "Proper" (dies abans)</Label>
                            <Input id='alert-upcoming' type='number' defaultValue={15} />
                        </div>
                        
                         <div className='space-y-2'>
                            <Label>Destinataris d'Alertes</Label>
                             <Input placeholder="ex: supervisor@operador.com, cap.taller@operador.com" />
                             <p className='text-xs text-muted-foreground'>Afegiu múltiples emails separats per comes.</p>
                        </div>

                    </CardContent>
                    <CardFooter>
                        <Button className="ml-auto">Guardar Configuració</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </main>
  );
}
