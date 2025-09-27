
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  BarChart2,
  TrendingUp,
  BrainCircuit,
  Settings,
  Calendar,
  Download,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const kpis = [
    { label: "Total Vehículos", value: "2,500" },
    { label: "SLA Cumplimiento", value: "94%" },
    { label: "Mantenimientos Pendientes", value: "45" },
    { label: "Operadores Críticos", value: "3" },
    { label: "Material Stock Crítico", value: "8 artículos" },
];

const operationalReports = [
    "Cumplimiento SLAs por Operador",
    "Análisis Preventivo vs Correctivo",
    "Eficiencia de Técnicos",
    "Incidencias por Operador",
    "Estado de Flota Global",
    "Consumo de Material por Operador",
]

const predictiveAnalytics = [
    "Predicción de Mantenimientos",
    "Análisis de Patrones de Averías",
    "Optimización de Recursos",
    "Proyección de Demanda de Material",
]

export default function ReportsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Documento de Actividad Mensual */}
        <Card className="flex flex-col">
          <CardHeader>
             <div className="flex items-start justify-between">
                 <div>
                    <CardTitle>Documento de Actividad Mensual</CardTitle>
                    <CardDescription>Reporte automático requerido por el pliego de SERMETRA.</CardDescription>
                 </div>
                 <FileText className="h-8 w-8 text-primary" />
             </div>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <div>
                <p className="text-sm text-muted-foreground">Último reporte generado:</p>
                <p className="font-semibold">Septiembre 2025</p>
            </div>
             <div>
                <p className="text-sm text-muted-foreground">Estado actual:</p>
                <p className="font-semibold text-green-600">Generado automáticamente</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-end gap-2 border-t pt-6">
            <Button variant="outline"><Calendar className="mr-2 h-4 w-4" /> Ver Anteriores</Button>
            <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Programar Envío</Button>
            <Button><Download className="mr-2 h-4 w-4" /> Generar Reporte</Button>
          </CardFooter>
        </Card>

        {/* KPIs Globales */}
        <Card>
          <CardHeader>
             <div className="flex items-start justify-between">
                <div>
                    <CardTitle>KPIs Globales del Sistema</CardTitle>
                    <CardDescription>Métricas clave en tiempo real.</CardDescription>
                </div>
                <BarChart2 className="h-8 w-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                {kpis.map(kpi => (
                    <div key={kpi.label}>
                        <p className="text-sm text-muted-foreground">{kpi.label}</p>
                        <p className="text-2xl font-bold">{kpi.value}</p>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Reportes Operativos */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
                <div>
                    <CardTitle>Reportes Operativos</CardTitle>
                    <CardDescription>Informes predefinidos para la gestión diaria.</CardDescription>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
                {operationalReports.map((report, index) => (
                   <li key={report} className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-md transition-colors">
                       <span>{report}</span>
                       <Button variant="ghost" size="sm">Ver</Button>
                   </li>
                ))}
            </ul>
          </CardContent>
        </Card>

        {/* Analítica Predictiva */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
                <div>
                    <CardTitle>Analítica Predictiva</CardTitle>
                    <CardDescription>Herramientas de IA para la optimización.</CardDescription>
                </div>
                <BrainCircuit className="h-8 w-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
                {predictiveAnalytics.map((tool, index) => (
                   <li key={tool} className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-md transition-colors">
                       <span>{tool}</span>
                       <Button variant="ghost" size="sm">Analizar</Button>
                   </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
