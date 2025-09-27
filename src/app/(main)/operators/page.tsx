
'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { mockOperators, mockVehicles, mockTasks, mockIncidents } from '@/lib/data';
import type { Operator } from '@/lib/types';
import { PlusCircle, Edit, Trash2, Truck, Wrench, Siren } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const statusVariant: { [key in Operator['status']]: 'default' | 'destructive' } = {
    'Activo': 'default',
    'Inactivo': 'destructive',
}

const OperatorCard = ({ operator }: { operator: Operator }) => {
    const vehicleCount = mockVehicles.filter(v => v.operatorId === operator.id).length;
    const pendingTasks = mockTasks.filter(t => {
        const vehicle = mockVehicles.find(v => v.id === t.vehicleId);
        return vehicle?.operatorId === operator.id && t.status === 'Pendiente';
    }).length;
    const openIncidents = mockIncidents.filter(i => {
        const vehicle = mockVehicles.find(v => v.id === i.vehicleId);
        return vehicle?.operatorId === operator.id && i.status === 'Abierto';
    }).length;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{operator.name}</CardTitle>
                    <Badge variant={statusVariant[operator.status]}>{operator.status}</Badge>
                </div>
                <CardDescription>ID: {operator.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Separator />
                <div className="flex justify-around text-center">
                    <div>
                        <Truck className="mx-auto h-6 w-6 text-muted-foreground mb-1"/>
                        <p className="text-xl font-bold">{vehicleCount}</p>
                        <p className="text-xs text-muted-foreground">Vehículos</p>
                    </div>
                    <div>
                        <Wrench className="mx-auto h-6 w-6 text-muted-foreground mb-1"/>
                        <p className="text-xl font-bold">{pendingTasks}</p>
                        <p className="text-xs text-muted-foreground">Mant. Pendientes</p>
                    </div>
                    <div>
                        <Siren className="mx-auto h-6 w-6 text-muted-foreground mb-1"/>
                        <p className="text-xl font-bold">{openIncidents}</p>
                        <p className="text-xs text-muted-foreground">Incidencias Abiertas</p>
                    </div>
                </div>
                 <Separator />
            </CardContent>
            <CardContent className="flex justify-end gap-2">
                 <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                </Button>
            </CardContent>
        </Card>
    )
}


export default function OperatorsPage() {

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold">Gestión de Operadores</h1>
            <p className="text-muted-foreground">
              Define y edita los operadores de la flota.
            </p>
        </div>
        <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Añadir Operador
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockOperators.map((operator) => (
            <OperatorCard key={operator.id} operator={operator} />
        ))}
      </div>
    </main>
  );
}
