
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, Line, LineChart, Pie, PieChart, Cell } from 'recharts';
import { BrainCircuit, FileText, ShieldCheck, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const complianceData = [
  { month: 'Ago', Trimestral: 92, Anual: 95 },
  { month: 'Sep', Trimestral: 95, Anual: 96 },
  { month: 'Oct', Trimestral: 91, Anual: 92 },
  { month: 'Nov', Trimestral: 98, Anual: 99 },
  { month: 'Dic', Trimestral: 96, Anual: 97 },
  { month: 'Ene', Trimestral: 89, Anual: 90 },
];

const complianceChartConfig = {
  Trimestral: {
    label: 'Trimestral',
    color: 'hsl(var(--primary))',
  },
   Anual: {
    label: 'Anual',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;


const correctiveVsPreventiveData = [
  { month: 'Ago', preventivo: 180, correctivo: 40 },
  { month: 'Sep', preventivo: 190, correctivo: 35 },
  { month: 'Oct', preventivo: 230, correctivo: 30 },
  { month: 'Nov', preventivo: 240, correctivo: 25 },
  { month: 'Dic', preventivo: 280, correctivo: 20 },
  { month: 'Ene', preventivo: 90, correctivo: 50 },
];

const correctiveVsPreventiveConfig = {
  preventivo: { label: 'Preventivo', color: 'hsl(var(--primary))' },
  correctivo: { label: 'Correctivo', color: 'hsl(var(--destructive))' },
} satisfies ChartConfig;

const fleetHealthData = [
    { name: 'Al día', value: 1250, color: 'hsl(var(--chart-2))' },
    { name: 'Vence en >15 días', value: 100, color: 'hsl(var(--chart-4))' },
    { name: 'Vence en <15 días', value: 38, color: 'hsl(var(--warning))' },
    { name: 'Vencido', value: 12, color: 'hsl(var(--destructive))' },
];

// This page will serve as the entry point for the new modular preventive maintenance system.
// It will now show the "Dashboard Ejecutivo".
export default function PreventivePage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
         <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cumplimiento Plan Preventivo
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              Completados en plazo (últimos 30 días)
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tareas Vencidas
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">12</div>
            <p className="text-xs text-muted-foreground">
              Total de preventivos fuera de plazo
            </p>
          </CardContent>
        </Card>
         <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Próximos 7 días
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">
              Intervenciones programadas o venciendo
            </p>
          </CardContent>
        </Card>
         <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Eficacia del Preventivo
            </CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15%</div>
            <p className="text-xs text-muted-foreground">
              Detección proactiva vs. mes anterior
            </p>
          </CardContent>
        </Card>


        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Cumplimiento del Plan (Últimos 6 Meses)</CardTitle>
                <CardDescription>Evolución del % de tareas completadas en plazo, por periodicidad.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={complianceChartConfig} className="h-[250px] w-full">
                    <LineChart data={complianceData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis unit="%" />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="Trimestral" stroke="var(--color-Trimestral)" strokeWidth={2} dot={true} />
                        <Line type="monotone" dataKey="Anual" stroke="var(--color-Anual)" strokeWidth={2} dot={true} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Salud de la Flota</CardTitle>
                <CardDescription>Distribución de los 1.400 vehículos según el estado de su próximo mantenimiento.</CardDescription>
            </CardHeader>
            <CardContent className='flex justify-center'>
                 <ChartContainer config={{}} className="h-[250px] w-full max-w-xs">
                    <PieChart>
                         <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={fleetHealthData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} label>
                             {fleetHealthData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                 </ChartContainer>
            </CardContent>
        </Card>
        
        <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle>Análisis Preventivo vs. Correctivo</CardTitle>
                <CardDescription>Un buen plan preventivo reduce las intervenciones correctivas.</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={correctiveVsPreventiveConfig} className="h-[300px] w-full">
                    <BarChart data={correctiveVsPreventiveData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        />
                        <YAxis />
                        <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Legend />
                        <Bar dataKey="preventivo" fill="var(--color-preventivo)" radius={4} />
                        <Bar dataKey="correctivo" fill="var(--color-correctivo)" radius={4} />
                    </BarChart>
                    </ChartContainer>
            </CardContent>
        </Card>

       </div>
    </main>
  );
}
