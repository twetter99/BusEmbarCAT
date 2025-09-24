'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Truck,
  ClipboardList,
  Siren,
  Boxes,
} from 'lucide-react';
import { IconWrapper } from '@/components/icon-wrapper';
import { mockVehicles, mockTasks, mockIncidents, mockInventory } from '@/lib/data';
import Link from 'next/link';

const chartData = [
  { month: 'Enero', tasks: 186 },
  { month: 'Febrero', tasks: 305 },
  { month: 'Marzo', tasks: 237 },
  { month: 'Abril', tasks: 273 },
  { month: 'Mayo', tasks: 209 },
  { month: 'Junio', tasks: 214 },
];

const chartConfig = {
  tasks: {
    label: 'Tareas',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

export default function DashboardPage() {
    const activeVehicles = mockVehicles.filter(v => v.status === 'Activo').length;
    const pendingTasks = mockTasks.filter(t => t.status === 'Pendiente' || t.status === 'En Progreso').length;
    const openIncidents = mockIncidents.filter(i => i.status === 'Abierto').length;
    const totalInventory = mockInventory.reduce((acc, item) => acc + item.stock, 0);

  const summaryCards = [
    { title: 'Vehículos Activos', value: activeVehicles, icon: Truck, href: '/vehicles' },
    { title: 'Tareas Pendientes', value: pendingTasks, icon: ClipboardList, href: '/tasks' },
    { title: 'Incidencias Abiertas', value: openIncidents, icon: Siren, href: '/incidents' },
    { title: 'Artículos de Inventario', value: totalInventory, icon: Boxes, href: '/inventory' },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Link href={card.href} key={card.title}>
            <Card className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Mantenimiento</CardTitle>
            <CardDescription>Tareas de mantenimiento completadas mensualmente.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart data={chartData} accessibilityLayer>
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
                <Bar dataKey="tasks" fill="var(--color-tasks)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
