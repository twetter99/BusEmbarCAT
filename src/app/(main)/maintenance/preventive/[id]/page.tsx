'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { mockTasks, mockVehicles, mockOperators } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getChecklistData } from '@/lib/checklists-data';

export default function MaintenanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const task = mockTasks.find((t) => t.id === id);

  if (!task) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle>Tarea no encontrada</CardTitle>
                <CardDescription>La tarea de mantenimiento que buscas no existe.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => router.back()}>Volver</Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  const vehicle = mockVehicles.find(v => v.id === task.vehicleId);
  const operator = mockOperators.find(o => o.id === vehicle?.operatorId);
  const checklistData = getChecklistData(task.frequency);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Volver</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <p className="text-muted-foreground">Ficha de Mantenimiento Preventivo</p>
        </div>
      </div>

      <div className="flex justify-center">
         <div className="w-full max-w-4xl space-y-6">
            {/* Render checklist sections here */}
            {checklistData ? (
                <p>Checklist para frecuencia: {task.frequency}</p>
            ) : (
                <p>No hay un checklist definido para esta frecuencia.</p>
            )}
        </div>
      </div>
    </main>
  );
}
