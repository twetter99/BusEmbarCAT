
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar, Target, Clock, AlertTriangle } from 'lucide-react';

export default function PlanningPage() {

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Adherencia al Plan
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              Tareas completadas en plazo en los últimos 30 días
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tareas Programadas (Próx. 30 días)
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">
              Intervenciones planificadas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tareas Vencidas
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">12</div>
            <p className="text-xs text-muted-foreground">
              Preventivos fuera de plazo
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Capacidad Técnicos
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">
              Ocupación media en los próximos 30 días
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Calendario de Planificación</CardTitle>
            <CardDescription>Vista mensual de las intervenciones programadas. Próximamente: filtros por cochera, operador y estado.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg min-h-[400px]">
                <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Vista de Calendario</h3>
                <p className="text-muted-foreground mt-2">
                    Esta sección mostrará un calendario interactivo para la planificación visual de los mantenimientos.
                </p>
            </div>
        </CardContent>
      </Card>
    </main>
  );
}
