
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
  { month: 'Set', Trimestral: 95, Anual: 96 },
  { month: 'Oct', Trimestral: 91, Anual: 92 },
  { month: 'Nov', Trimestral: 98, Anual: 99 },
  { month: 'Des', Trimestral: 96, Anual: 97 },
  { month: 'Gen', Trimestral: 89, Anual: 90 },
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

const fleetHealthData = [
    { name: 'Al dia', value: 1250, color: 'hsl(var(--chart-2))' },
    { name: 'Venç en >15 dies', value: 100, color: 'hsl(var(--chart-4))' },
    { name: 'Venç en <15 dies', value: 38, color: 'hsl(var(--warning))' },
    { name: 'Vençut', value: 12, color: 'hsl(var(--destructive))' },
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
              Compliment Pla Preventiu
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              Completats en termini (últims 30 dies)
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tasques Vençudes
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">12</div>
            <p className="text-xs text-muted-foreground">
              Total de preventius fora de termini
            </p>
          </CardContent>
        </Card>
         <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Propers 7 dies
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">
              Intervencions programades o vencent
            </p>
          </CardContent>
        </Card>
         <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Eficàcia del Preventiu
            </CardTitle>
            <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+15%</div>
            <p className="text-xs text-muted-foreground">
              Detecció proactiva vs. mes anterior
            </p>
          </CardContent>
        </Card>


        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Compliment del Pla (Últims 6 Mesos)</CardTitle>
                <CardDescription>Evolució del % de tasques completades en termini, per periodicitat.</CardDescription>
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
                <CardTitle>Salut de la Flota</CardTitle>
                <CardDescription>Distribució dels 1.400 vehicles segons l'estat del seu pròxim manteniment.</CardDescription>
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
                <CardTitle>Anàlisi Preventiu vs. Correctiu</CardTitle>
                <CardDescription>Un bon pla preventiu redueix les intervencions correctives.</CardDescription>
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

       </div>
    </main>
  );
}
