
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
  Eye,
  Sliders,
} from 'lucide-react';

const kpis = [
    { label: "Total Vehicles", value: "2,500" },
    { label: "Compliment SLA", value: "94%" },
    { label: "Manteniments Pendents", value: "45" },
    { label: "Operadors Crítics", value: "3" },
    { label: "Material Estoc Crític", value: "8 articles" },
    { label: "Venciments Propers", value: "12 aquesta setmana" },
    { label: "Pressupostos Pendents", value: "5 esperant aprovació" },
    { label: "Compliment Intervals", value: "94% preventius al dia"},
    { label: "Bossa Disponible", value: "€45,000 restants"},
];

const operationalReports = [
    "Compliment SLAs per Operador",
    "Anàlisi Preventiu vs Correctiu",
    "Eficiència de Tècnics",
    "Incidències per Operador",
    "Estat de Flota Global",
    "Consum de Material per Operador",
    "Control de Bossa d'Adquisició",
    "Temps de Resolució vs SLA",
    "Compliment Intervals Manteniment"
]

const predictiveAnalytics = [
    "Predicció de Manteniments",
    "Anàlisi de Patrons d'Avaries",
    "Optimització de Recursos",
    "Projecció de Demanda de Material",
    "Predicció de Consum de Material",
    "Anàlisi d'Eficiència per Zona",
    "Alertes Primerenques de Venciments"
]

export default function ReportsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {/* Documento de Actividad Mensual */}
        <Card className="flex flex-col lg:col-span-2">
          <CardHeader>
             <div className="flex items-start justify-between">
                 <div>
                    <CardTitle>Document d'Activitat Mensual</CardTitle>
                    <CardDescription>Informe automàtic requerit pel plec de SERMETRA. Genereu amb un sol clic l'informe complet amb traspassos, instal·lacions, desinstal·lacions, albarans, material i estat de la bossa d'estoc.</CardDescription>
                 </div>
                 <FileText className="h-8 w-8 text-primary" />
             </div>
          </CardHeader>
          <CardContent className="flex-grow space-y-4">
            <div>
                <p className="text-sm text-muted-foreground">Últim informe generat:</p>
                <p className="font-semibold">Setembre 2025</p>
            </div>
             <div>
                <p className="text-sm text-muted-foreground">Estat actual:</p>
                <p className="font-semibold text-green-600">Generat automàticament i llest per descarregar.</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-end gap-2 border-t pt-6 flex-wrap">
            <Button variant="outline"><Calendar className="mr-2 h-4 w-4" /> Anteriors</Button>
            <Button variant="outline"><Eye className="mr-2 h-4 w-4" /> Previsualització</Button>
            <Button variant="outline"><Sliders className="mr-2 h-4 w-4" /> Personalitzar</Button>
            <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Programar</Button>
            <Button><Download className="mr-2 h-4 w-4" /> Generar Informe Actual</Button>
          </CardFooter>
        </Card>

        {/* KPIs Globales */}
        <Card>
          <CardHeader>
             <div className="flex items-start justify-between">
                <div>
                    <CardTitle>KPIs Globals del Sistema</CardTitle>
                    <CardDescription>Mètriques clau en temps real.</CardDescription>
                </div>
                <BarChart2 className="h-8 w-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
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
                    <CardTitle>Informes Operatius</CardTitle>
                    <CardDescription>Informes predefinits per a la gestió diària.</CardDescription>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
                {operationalReports.map((report) => (
                   <li key={report} className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-md transition-colors">
                       <span>{report}</span>
                       <Button variant="ghost" size="sm">Veure</Button>
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
                    <CardDescription>Eines d'IA per a l'optimització.</CardDescription>
                </div>
                <BrainCircuit className="h-8 w-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
                {predictiveAnalytics.map((tool) => (
                   <li key={tool} className="flex items-center justify-between hover:bg-muted/50 p-2 rounded-md transition-colors">
                       <span>{tool}</span>
                       <Button variant="ghost" size="sm">Analitzar</Button>
                   </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
