
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from 'recharts';
import {
  Truck,
  ClipboardList,
  Siren,
  Boxes,
  ShieldCheck,
  Percent,
  TriangleAlert,
  Users,
} from 'lucide-react';
import { mockDashboardData } from '@/lib/data';
import type { OperatorMetric } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';


const chartConfig = {
  planned: {
    label: 'Programados',
    color: 'hsl(var(--secondary))',
  },
  completed: {
    label: 'Completados',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const kpiCardVariant: { [key: string]: 'default' | 'destructive' | 'warning' } = {
    default: 'default',
    critical: 'destructive',
    warning: 'warning',
}

const KPICard = ({ title, value, icon: Icon, subtext, variant = 'default' }: { title: string, value: string | number, icon: React.ElementType, subtext: string, variant?: 'default' | 'destructive' | 'warning' }) => {

    const variantClasses = {
        default: 'bg-card',
        destructive: 'bg-destructive/10 border-destructive',
        warning: 'bg-warning/10 border-warning',
    }
    const iconVariantClasses = {
        default: 'text-primary',
        destructive: 'text-destructive',
        warning: 'text-warning',
    }

    return (
        <Card className={variantClasses[variant]}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-5 w-5 ${iconVariantClasses[variant]}`} />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{subtext}</p>
            </CardContent>
        </Card>
    );
};

const OperatorStatusTable = ({ data }: { data: OperatorMetric[] }) => (
    <Card>
        <CardHeader>
            <CardTitle>Estado por Operador</CardTitle>
            <CardDescription>Resumen del estado de la flota y mantenimientos por cada operador.</CardDescription>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Operador</TableHead>
                        <TableHead className="text-center">Vehículos Activos</TableHead>
                        <TableHead className="text-center">En Mantenimiento</TableHead>
                        <TableHead className="text-center">SLA Cumplido</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map(op => (
                        <TableRow key={op.operatorName}>
                            <TableCell className="font-medium">{op.operatorName}</TableCell>
                            <TableCell className="text-center font-semibold">{op.activeVehicles}</TableCell>
                            <TableCell className="text-center">
                                <Badge variant="secondary">{op.maintenanceVehicles}</Badge>
                            </TableCell>
                            <TableCell>
                                 <div className="flex items-center gap-2">
                                    <Progress value={op.slaCompliance} className="h-2" />
                                    <span className="text-xs font-medium text-muted-foreground">{op.slaCompliance}%</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

export default function DashboardPage() {
  const { kpis, maintenanceChartData, operatorMetrics } = mockDashboardData;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
           <KPICard title="Cumplimiento SLA" value={`${kpis.slaCompliance}%`} icon={ShieldCheck} subtext="Últimos 30 días" />
           <KPICard title="Incidencias Críticas" value={kpis.criticalIncidents} icon={Siren} subtext="Abiertas actualmente" variant="destructive" />
           <KPICard title="Stock Crítico" value={kpis.criticalStockItems} icon={Boxes} subtext="Artículos bajo mínimos" variant="warning" />
           <KPICard title="Total Vehículos" value={kpis.totalVehicles.toLocaleString('es-ES')} icon={Truck} subtext="Flota gestionada" />
       </div>
      
       <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
             <Card>
                <CardHeader>
                    <CardTitle>Resumen de Mantenimientos (Últimos 6 meses)</CardTitle>
                     <CardDescription>Comparativa de tareas de mantenimiento programadas vs. completadas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={maintenanceChartData} accessibilityLayer>
                        <CartesianGrid vertical={false} />
                        <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis />
                        <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Legend />
                        <Bar dataKey="planned" fill="var(--color-planned)" radius={4} />
                        <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
                    </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <OperatorStatusTable data={operatorMetrics} />
          </div>
       </div>

    </main>
  );
}
