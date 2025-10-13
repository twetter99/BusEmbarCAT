
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
    label: 'Programats',
    color: 'hsl(var(--secondary))',
  },
  completed: {
    label: 'Completats',
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
            <CardTitle>Estat per Operador</CardTitle>
            <CardDescription>Resum de l'estat de la flota i manteniments per cada operador.</CardDescription>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Operador</TableHead>
                        <TableHead className="text-center">Vehicles Actius</TableHead>
                        <TableHead className="text-center">En Manteniment</TableHead>
                        <TableHead className="text-center">SLA Complert</TableHead>
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
           <KPICard title="Compliment SLA" value={`${kpis.slaCompliance}%`} icon={ShieldCheck} subtext="Últims 30 dies" />
           <KPICard title="Incidències Crítiques" value={kpis.criticalIncidents} icon={Siren} subtext="Obertes actualment" variant="destructive" />
           <KPICard title="Estoc Crític" value={kpis.criticalStockItems} icon={Boxes} subtext="Articles sota mínims" variant="warning" />
           <KPICard title="Total Vehicles" value={kpis.totalVehicles.toLocaleString('ca-ES')} icon={Truck} subtext="Flota gestionada" />
       </div>
      
       <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3">
             <Card>
                <CardHeader>
                    <CardTitle>Resum de Manteniments (Últims 6 mesos)</CardTitle>
                     <CardDescription>Comparativa de tasques de manteniment programades vs. completades.</CardDescription>
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
