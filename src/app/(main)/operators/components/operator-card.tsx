
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
  CardFooter,
} from '@/components/ui/card';
import type { OperatorMetrics } from '@/lib/types';
import {
  Edit,
  Trash2,
  Truck,
  Wrench,
  Calendar,
  ShieldCheck,
  BarChart,
  FileText,
  TriangleAlert,
  HardDrive,
  Siren,
  Bell,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { differenceInDays, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const statusVariant: { [key in OperatorMetrics['estado']]: 'default' | 'destructive' | 'secondary' | 'success' } = {
  Activo: 'success',
  Inactivo: 'secondary',
  Suspendido: 'destructive',
};

const slaVariant = (value: number, threshold: number) => {
    return value <= threshold ? 'success' : 'destructive';
}

const MetricItem = ({ icon: Icon, label, value, className }: { icon: React.ElementType, label: string, value: React.ReactNode, className?: string }) => (
    <div className={cn("flex items-center justify-between text-sm", className)}>
        <div className="flex items-center gap-2 text-muted-foreground">
            <Icon className="h-4 w-4" />
            <span>{label}</span>
        </div>
        <span className="font-semibold">{value}</span>
    </div>
);

const AlertItem = ({ icon: Icon, label, value, variant = 'destructive' }: { icon: React.ElementType, label: string, value: React.ReactNode, variant?: 'destructive' | 'warning' }) => {
    if (!value) return null;
    
    const baseClasses= "p-2 rounded-lg flex items-center gap-2 text-sm";
    const variants = {
        destructive: 'bg-destructive/10 text-destructive-foreground',
        warning: 'bg-warning/10 text-warning-foreground',
    }

    return (
        <div className={cn(baseClasses, variants[variant])}>
            <Icon className={cn("h-5 w-5", {
                'text-destructive': variant === 'destructive',
                'text-warning': variant === 'warning'
            })} />
            <span className="font-semibold">{label}:</span>
            <span className="font-bold">{value}</span>
        </div>
    )
};


export const OperatorCard = ({ operator }: { operator: OperatorMetrics }) => {
  
  const nextMaintenanceDays = differenceInDays(new Date(operator.proximoMantenimiento), new Date('2026-01-15T15:00:00'));

  const getOverallStatus = (): 'success' | 'warning' | 'destructive' => {
      let score = 0;
      if (operator.mantenimientosVencidos > 0) score += 3;
      if (operator.incidenciasAbiertas > 5) score += 2;
      if (operator.cumplimientoPreventivos < 90) score += 1;
      if (operator.slaCorrectivos > 3) score += 1;

      if (score >= 4) return 'destructive';
      if (score >= 2) return 'warning';
      return 'success';
  }
  const overallStatus = getOverallStatus();
  
  const overallStatusBorder: Record<ReturnType<typeof getOverallStatus>, string> = {
      'destructive': 'border-l-4 border-destructive',
      'warning': 'border-l-4 border-warning',
      'success': 'border-l-4 border-success'
  }

  const totalAlerts = operator.mantenimientosVencidos + operator.incidenciasEscaladas + (operator.stockCritico ? 1 : 0);
  const alertBadgeVariant = totalAlerts > 3 ? 'destructive' : totalAlerts > 0 ? 'warning' : 'default';

  return (
    <Collapsible asChild>
        <Card className={cn("transition-all duration-300 ease-in-out", overallStatusBorder[overallStatus])}>
            <CollapsibleTrigger className="w-full text-left p-4 data-[state=open]:border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <MapPin className="h-5 w-5 text-muted-foreground"/>
                         <h3 className="text-lg font-semibold">{operator.nombre}</h3>
                    </div>
                     <div className="flex items-center gap-2">
                        <Badge variant={statusVariant[operator.estado]}>{operator.estado}</Badge>
                        {totalAlerts > 0 && <Badge variant={alertBadgeVariant}>{totalAlerts} Alertas</Badge>}
                        <Badge variant="outline">{operator.vehiculosOperativos}/{operator.vehiculosTotal} Veh.</Badge>
                        <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </div>
                </div>
                 <div className="flex items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2 flex-wrap">
                    <span>ID: {operator.id}</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span>Ubicación: {operator.ubicacionPrincipal}</span>
                     <Separator orientation="vertical" className="h-4" />
                    <span>Próx. Mant: {format(new Date(operator.proximoMantenimiento), 'dd/MM/yy')}</span>
                     <Separator orientation="vertical" className="h-4" />
                    <span>SLA Correctivos: {operator.slaCorrectivos.toFixed(1)}d</span>
                     <Separator orientation="vertical" className="h-4" />
                    <span>Calidad: {operator.calidadServicio}</span>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent asChild>
                <div className="p-4 flex flex-col">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                            <h4 className="font-semibold text-sm">Flota y Equipamiento</h4>
                            <MetricItem icon={Truck} label="Vehículos Operativos" value={`${operator.vehiculosOperativos} / ${operator.vehiculosTotal}`} />
                            <MetricItem icon={Wrench} label="En Mantenimiento" value={operator.vehiculosMantenimiento} />
                            <MetricItem icon={HardDrive} label="Equipos T-mobilitat" value={operator.equiposTMobilitat} />
                            <MetricItem icon={Calendar} label="Próximo Mant." value={
                                <Badge variant={nextMaintenanceDays < 7 ? 'warning' : 'outline'}>
                                    {format(new Date(operator.proximoMantenimiento), 'dd/MM/yyyy')}
                                </Badge>
                            } />
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="font-semibold text-sm">Cumplimiento y SLA</h4>
                            <MetricItem icon={ShieldCheck} label="SLA Correctivos" value={
                                <Badge variant={slaVariant(operator.slaCorrectivos, 3)}>{operator.slaCorrectivos.toFixed(1)} días</Badge>
                            } />
                            <MetricItem icon={ShieldCheck} label="SLA Instalaciones" value={
                                <Badge variant={slaVariant(operator.slaInstalaciones, 4)}>{operator.slaInstalaciones.toFixed(1)} días</Badge>
                            } />
                            <MetricItem icon={BarChart} label="Calidad Servicio" value={
                                <Badge variant={operator.calidadServicio === 'A' ? 'success' : operator.calidadServicio === 'B' ? 'warning' : 'destructive'}>{operator.calidadServicio}</Badge>
                            }/>
                            <div>
                                <div className="flex justify-between mb-1 text-sm text-muted-foreground">
                                    <span>Mant. Preventivos</span>
                                    <span className="font-semibold">{operator.cumplimientoPreventivos}%</span>
                                </div>
                                <Progress value={operator.cumplimientoPreventivos} className="h-2" />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Alertas Críticas</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <AlertItem icon={Calendar} label="Vencidos" value={operator.mantenimientosVencidos} />
                                <AlertItem icon={Siren} label="Abiertas" value={operator.incidenciasAbiertas} variant="warning"/>
                                <AlertItem icon={Bell} label="Escaladas" value={operator.incidenciasEscaladas} />
                            </div>
                            {operator.stockCritico && <AlertItem icon={TriangleAlert} label="Stock Crítico" value="Requiere atención" variant="warning" />}
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center">
                        <div className="grid grid-cols-3 gap-2">
                            <Button variant="secondary" size="sm"><FileText className="h-4 w-4 mr-1"/>Reporte</Button>
                            <Button variant="secondary" size="sm"><Truck className="h-4 w-4 mr-1"/>Flota</Button>
                            <Button variant="secondary" size="sm"><Wrench className="h-4 w-4 mr-1"/>Mant.</Button>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            </CollapsibleContent>
        </Card>
    </Collapsible>
  );
};
