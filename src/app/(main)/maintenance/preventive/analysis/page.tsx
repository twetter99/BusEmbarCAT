
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
import { BrainCircuit, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const complianceData = [
  { month: 'Ago', compliance: 92 },
  { month: 'Sep', compliance: 95 },
  { month: 'Oct', compliance: 91 },
  { month: 'Nov', compliance: 98 },
  { month: 'Dic', compliance: 96 },
  { month: 'Ene', compliance: 89 },
];

const complianceChartConfig = {
  compliance: {
    label: '% Cumplimiento',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const breakdownByCategoryData = [
    { name: 'Eléctrico', value: 45, color: 'hsl(var(--chart-1))' },
    { name: 'Mecánico', value: 25, color: 'hsl(var(--chart-2))' },
    { name: 'Software', value: 15, color: 'hsl(var(--chart-3))' },
    { name: 'Hardware', value: 10, color: 'hsl(var(--chart-4))' },
    { name: 'Otro', value: 5, color: 'hsl(var(--chart-5))' },
];

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

export default function AnalysisPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Cumplimiento del Plan Preventivo (Últimos 6 Meses)</CardTitle>
                <CardDescription>Evolución del porcentaje de tareas de mantenimiento preventivo completadas en plazo.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={complianceChartConfig} className="h-[250px] w-full">
                    <LineChart data={complianceData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis unit="%" />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="compliance" stroke="var(--color-compliance)" strokeWidth={2} dot={true} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Averías por Tipología</CardTitle>
                <CardDescription>Distribución de los mantenimientos correctivos por tipo de problema detectado.</CardDescription>
            </CardHeader>
            <CardContent className='flex justify-center'>
                 <ChartContainer config={{}} className="h-[250px] w-full max-w-xs">
                    <PieChart>
                         <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie data={breakdownByCategoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                             {breakdownByCategoryData.map((entry) => (
                                <Cell key={`cell-${entry.name}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                 </ChartContainer>
            </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Análisis Preventivo vs. Correctivo</CardTitle>
                <CardDescription>Comparativa del número de intervenciones. Un buen plan preventivo reduce las correctivas.</CardDescription>
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

        <Card>
            <CardHeader>
                <CardTitle>Generador de Informes</CardTitle>
                <CardDescription>Crea reportes detallados en PDF o Excel para análisis offline o auditorías.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                <Button className='w-full'><FileText className='mr-2' />Generar Informe de Cumplimiento</Button>
                 <Button className='w-full' variant='secondary'><FileText className='mr-2' />Exportar Historial de Vehículo</Button>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Análisis Predictivo IA</CardTitle>
                <CardDescription>Utiliza IA para encontrar patrones y predecir futuras necesidades de mantenimiento.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className='w-full'><BrainCircuit className='mr-2' />Analizar Patrones de Fallo</Button>
            </CardContent>
        </Card>

       </div>
    </main>
  );
}
