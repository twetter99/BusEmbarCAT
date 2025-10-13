
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
  { month: 'Set', compliance: 95 },
  { month: 'Oct', compliance: 91 },
  { month: 'Nov', compliance: 98 },
  { month: 'Des', compliance: 96 },
  { month: 'Gen', compliance: 89 },
];

const complianceChartConfig = {
  compliance: {
    label: '% Compliment',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const breakdownByCategoryData = [
    { name: 'Elèctric', value: 45, color: 'hsl(var(--chart-1))' },
    { name: 'Mecànic', value: 25, color: 'hsl(var(--chart-2))' },
    { name: 'Software', value: 15, color: 'hsl(var(--chart-3))' },
    { name: 'Hardware', value: 10, color: 'hsl(var(--chart-4))' },
    { name: 'Altres', value: 5, color: 'hsl(var(--chart-5))' },
];

const correctiveVsPreventiveData = [
  { month: 'Ago', preventiu: 180, correctiu: 40 },
  { month: 'Set', preventiu: 190, correctiu: 35 },
  { month: 'Oct', preventiu: 230, correctiu: 30 },
  { month: 'Nov', preventiu: 240, correctiu: 25 },
  { month: 'Des', preventiu: 280, correctiu: 20 },
  { month: 'Gen', preventiu: 90, correctiu: 50 },
];

const correctiveVsPreventiveConfig = {
  preventiu: { label: 'Preventiu', color: 'hsl(var(--primary))' },
  correctiu: { label: 'Correctiu', color: 'hsl(var(--destructive))' },
} satisfies ChartConfig;

export default function AnalysisPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Compliment del Pla Preventiu (Últims 6 Mesos)</CardTitle>
                <CardDescription>Evolució del percentatge de tasques de manteniment preventiu completades en termini.</CardDescription>
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
                <CardTitle>Avaries per Tipologia</CardTitle>
                <CardDescription>Distribució dels manteniments correctius per tipus de problema detectat.</CardDescription>
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
                <CardTitle>Anàlisi Preventiu vs. Correctiu</CardTitle>
                <CardDescription>Comparativa del nombre d'intervencions. Un bon pla preventiu redueix les correctives.</CardDescription>
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
                        <Bar dataKey="preventiu" fill="var(--color-preventiu)" radius={4} />
                        <Bar dataKey="correctiu" fill="var(--color-correctiu)" radius={4} />
                    </BarChart>
                    </ChartContainer>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Generador d'Informes</CardTitle>
                <CardDescription>Creeu reportatges detallats en PDF o Excel per a anàlisis offline o auditories.</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                <Button className='w-full'><FileText className='mr-2' />Generar Informe de Compliment</Button>
                 <Button className='w-full' variant='secondary'><FileText className='mr-2' />Exportar Historial de Vehicle</Button>
            </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Anàlisi Predictiva IA</CardTitle>
                <CardDescription>Utilitzeu IA per trobar patrons i predir futures necessitats de manteniment.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className='w-full'><BrainCircuit className='mr-2' />Analitzar Patrons d'Avaria</Button>
            </CardContent>
        </Card>

       </div>
    </main>
  );
}
