'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { summarizeMaintenanceLogs } from '@/ai/flows/summarize-maintenance-logs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Bot, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const defaultLogs = `
- Vehículo BC-456-Y: Módulo GPS reiniciado dos veces esta semana. El operador informó de una pérdida intermitente de la señal.
- Vehículo BC-123-X: Pastillas de freno desgastadas reemplazadas. Niveles de líquido rellenados.
- Vehículo BC-789-Z: Firmware del validador actualizado a v2.3.1. Un caso de fallo de lectura de tarjeta durante las pruebas, pero no se pudo replicar.
- Todos los vehículos: revisiones estándar de líquidos y presión de neumáticos completadas.
`.trim();

const defaultChecklist = `
- Inspeccionar la condición física
- Limpiar el lector de tarjetas
- Verificar la versión del firmware
- Ejecutar prueba de diagnóstico
- Probar con múltiples tipos de tarjetas
- Comprobar las conexiones
- Confirmar el registro de transacciones
`.trim();

type FormData = {
  maintenanceLogs: string;
  checklist: string;
};

export function SummarizeForm() {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      maintenanceLogs: defaultLogs,
      checklist: defaultChecklist,
    },
  });
  const [summary, setSummary] = useState('');
  const [failurePoints, setFailurePoints] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setSummary('');
    setFailurePoints('');
    try {
      const result = await summarizeMaintenanceLogs(data);
      setSummary(result.summary);
      setFailurePoints(result.potentialFailurePoints);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error al Generar el Resumen',
        description: 'Ocurrió un error al procesar los registros. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Registros de Mantenimiento</CardTitle>
          <CardDescription>
            Introduce los registros de mantenimiento y una lista de verificación opcional para generar un resumen con IA e identificar posibles puntos de fallo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maintenanceLogs">Registros de Mantenimiento</Label>
              <Textarea
                id="maintenanceLogs"
                rows={10}
                placeholder="Pega aquí los registros de mantenimiento..."
                {...register('maintenanceLogs')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checklist">Checklist de Mantenimiento (Opcional)</Label>
              <Textarea
                id="checklist"
                rows={6}
                placeholder="Proporcione elementos de la lista de verificación para el contexto..."
                {...register('checklist')}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Generando...' : 'Generar Resumen'}
              {!isLoading && <Sparkles className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <div className="space-y-8">
        <Card>
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-full">
                <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
                <CardTitle>Resumen de IA</CardTitle>
                <CardDescription>Un resumen conciso de los registros proporcionados.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && !summary && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
            {summary && <p className="text-sm">{summary}</p>}
            {!isLoading && !summary && <p className="text-sm text-muted-foreground">El resumen aparecerá aquí después de la generación.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="bg-destructive/10 p-2 rounded-full">
                <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
                <CardTitle>Puntos de Fallo Potenciales</CardTitle>
                <CardDescription>Áreas sugeridas por la IA para monitorear.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
          {isLoading && !failurePoints && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            )}
            {failurePoints && <p className="text-sm">{failurePoints}</p>}
            {!isLoading && !failurePoints && <p className="text-sm text-muted-foreground">Los fallos potenciales se identificarán aquí.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
