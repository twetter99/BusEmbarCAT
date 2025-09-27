
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
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

const statusVariant: { [key in Operator['status']]: 'default' | 'destructive' } = {
    'Activo': 'default',
    'Inactivo': 'destructive',
}

const OperatorCard = ({ operator }: { operator: Operator }) => {
    const operatorVehicles = mockVehicles.filter(v => v.operatorId === operator.id);
    const vehicleCount = operatorVehicles.length;
    
    const operatorVehicleIds = operatorVehicles.map(v => v.id);

    const operatorTasks = mockTasks.filter(t => operatorVehicleIds.includes(t.vehicleId));
    const completedTasks = operatorTasks.filter(t => t.status === 'Completado').length;
    const maintenanceCompliance = operatorTasks.length > 0 ? Math.round((completedTasks / operatorTasks.length) * 100) : 100;
    
    const openIncidents = mockIncidents.filter(i => {
        return operatorVehicleIds.includes(i.vehicleId) && i.status === 'Abierto';
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
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Vehículos</span>
                        <span className="font-semibold">{vehicleCount}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Incidencias Abiertas</span>
                        <span className="font-semibold">{openIncidents}</span>
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <span>Cumplimiento Mant.</span>
                            <span className="font-semibold">{maintenanceCompliance}%</span>
                        </div>
                        <Progress value={maintenanceCompliance} className="h-2" />
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
