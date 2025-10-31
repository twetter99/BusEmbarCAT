
'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Package, TrendingDown, CheckCircle } from 'lucide-react';

// Tipos para las colecciones
type InventoryItem = {
  id: string;
  definitionRef: string;
  model: string;
  serialNumber: string;
  vehicleRef: string;
  status: 'Activa' | 'De Baixa';
};

type WorkOrder = {
  id: string;
  planRef: string;
  technicianRef: string;
  cochera: string;
  status: 'Pendent' | 'Completada' | 'Incidència';
  completedAt?: string;
};

// DATOS MOCK LOCALES - Del pliego del Contracte C-4/2025
const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'VAL-MAG-1001', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'VAL-MAG-1001', vehicleRef: 'BUS-TCC-01', status: 'Activa' },
  { id: 'VAL-MAG-1002', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'VAL-MAG-1002', vehicleRef: 'BUS-TCC-02', status: 'Activa' },
  { id: 'VAL-MAG-1003', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'VAL-MAG-1003', vehicleRef: 'BUS-SAG-01', status: 'Activa' },
  { id: 'VAL-MAG-1004', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'VAL-MAG-1004', vehicleRef: 'BUS-SAG-02', status: 'Activa' },
  { id: 'VAL-MAG-1005', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'VAL-MAG-1005', vehicleRef: 'BUS-SAG-03', status: 'De Baixa' },
  { id: 'VAL-MAG-2001', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'VAL-MAG-2001', vehicleRef: 'BUS-MOV-01', status: 'Activa' },
  { id: 'VAL-MAG-2002', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'VAL-MAG-2002', vehicleRef: 'BUS-MOV-02', status: 'Activa' },
  { id: 'VAL-MAG-2003', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'VAL-MAG-2003', vehicleRef: 'BUS-MOV-03', status: 'Activa' },
  { id: 'VAL-MAG-2004', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'VAL-MAG-2004', vehicleRef: 'BUS-MOV-04', status: 'Activa' },
  { id: 'VAL-MAG-2005', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'VAL-MAG-2005', vehicleRef: 'BUS-SOL-01', status: 'De Baixa' },
  { id: 'VAL-MAG-1006', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'VAL-MAG-1006', vehicleRef: 'BUS-CAS-01', status: 'Activa' },
  { id: 'VAL-MAG-1007', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'VAL-MAG-1007', vehicleRef: 'BUS-CAS-02', status: 'Activa' },
  { id: 'VAL-MAG-2006', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'VAL-MAG-2006', vehicleRef: 'BUS-HIS-01', status: 'Activa' },
  { id: 'VAL-MAG-2007', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'VAL-MAG-2007', vehicleRef: 'BUS-HIS-02', status: 'Activa' },
  { id: 'VAL-MAG-2008', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'VAL-MAG-2008', vehicleRef: 'BUS-HIS-03', status: 'Activa' },
];

const MOCK_WORK_ORDERS: WorkOrder[] = [
  { id: 'OT-CMG-26001', planRef: 'plan-trimestral', technicianRef: 'tech-001', cochera: 'C/Casablanca n8, Puerto de Barcelona', status: 'Pendent' },
  { id: 'OT-CMG-26002', planRef: 'plan-trimestral', technicianRef: 'tech-001', cochera: 'C/Casablanca n8, Puerto de Barcelona', status: 'Pendent' },
  { id: 'OT-CMG-26003', planRef: 'plan-trimestral', technicianRef: 'tech-002', cochera: 'Políg. Ind. Can Magarola, Mollet', status: 'Pendent' },
  { id: 'OT-CMG-26004', planRef: 'plan-trimestral', technicianRef: 'tech-002', cochera: 'Políg. Ind. Can Magarola, Mollet', status: 'Pendent' },
  { id: 'OT-CMG-26005', planRef: 'plan-trimestral', technicianRef: 'tech-003', cochera: 'Carrer 60, 2, Sants-Montjuïc', status: 'Pendent' },
  { id: 'OT-CMG-26006', planRef: 'plan-trimestral', technicianRef: 'tech-003', cochera: 'Carrer 60, 2, Sants-Montjuïc', status: 'Pendent' },
  { id: 'OT-CMG-26007', planRef: 'plan-trimestral', technicianRef: 'tech-003', cochera: 'Carrer 60, 2, Sants-Montjuïc', status: 'Pendent' },
  { id: 'OT-CMG-26008', planRef: 'plan-anual', technicianRef: 'tech-004', cochera: 'C/Remallaire N15-17, Mataró', status: 'Completada', completedAt: '2025-10-28T10:00:00Z' },
  { id: 'OT-CMG-26009', planRef: 'plan-trimestral', technicianRef: 'tech-005', cochera: 'Gabriel Castellà, 7 Igualada', status: 'Completada', completedAt: '2025-10-29T14:30:00Z' },
  { id: 'OT-CMG-26010', planRef: 'plan-trimestral', technicianRef: 'tech-005', cochera: 'Gabriel Castellà, 7 Igualada', status: 'Incidència' },
];

// Colores para el gráfico de tarta
const CHART_COLORS = {
  pendent: 'hsl(var(--destructive))',
  completada: 'hsl(var(--primary))',
  incidencia: '#f59e0b',
};

export default function ContratoC4DashboardPage() {
  const [inventoryData] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [workOrdersData] = useState<WorkOrder[]>(MOCK_WORK_ORDERS);
  const [isLoading] = useState(false);

  // Calcular KPIs
  const kpis = useMemo(() => {
    const parcViu = inventoryData.filter(item => item.status === 'Activa').length;
    const unitatsBaixa = inventoryData.filter(item => item.status === 'De Baixa').length;
    
    // KPI 3: Reducción a facturar = (Unidades de Baja / 25) * 2.5%
    const reduccioFacturar = (unitatsBaixa / 25) * 2.5;
    const percentatgeBaixa = inventoryData.length > 0 
      ? (unitatsBaixa / inventoryData.length) * 100 
      : 0;

    return {
      parcViu,
      unitatsBaixa,
      reduccioFacturar,
      percentatgeBaixa,
    };
  }, [inventoryData]);

  // Datos para el gráfico de OTs
  const chartData = useMemo(() => {
    const pendents = workOrdersData.filter(wo => wo.status === 'Pendent').length;
    const completades = workOrdersData.filter(wo => wo.status === 'Completada').length;
    const incidencies = workOrdersData.filter(wo => wo.status === 'Incidència').length;

    const data = [];
    if (pendents > 0) data.push({ name: 'Pendents', value: pendents, color: CHART_COLORS.pendent });
    if (completades > 0) data.push({ name: 'Completades', value: completades, color: CHART_COLORS.completada });
    if (incidencies > 0) data.push({ name: 'Incidències', value: incidencies, color: CHART_COLORS.incidencia });

    return data;
  }, [workOrdersData]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Contracte C-4/2025</h1>
        <p className="text-muted-foreground">
          Control de gestió del parc de validadores magnètiques
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Parc Viu */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parc Viu</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{kpis.parcViu.toLocaleString('ca-ES')}</div>
                <p className="text-xs text-muted-foreground">
                  Validadores actives al parc
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* KPI 2: Unitats de Baixa */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unitats de Baixa</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{kpis.unitatsBaixa.toLocaleString('ca-ES')}</div>
                <p className="text-xs text-muted-foreground">
                  {kpis.percentatgeBaixa.toFixed(1)}% del total de l'inventari
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* KPI 3: Reducció a Facturar */}
        <Card className="border-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reducció a Facturar</CardTitle>
            <TrendingDown className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-primary">
                  {kpis.reduccioFacturar.toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Control financer proactiu (Baixes/25 × 2.5%)
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* KPI 4: Total OTs Completades */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OTs Completades</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {chartData.find(d => d.name === 'Completades')?.value || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ordres de treball finalitzades
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de OTs */}
      <Card>
        <CardHeader>
          <CardTitle>Estat de les Ordres de Treball (OTs)</CardTitle>
          <CardDescription>
            Distribució de les tasques de manteniment per estat
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-[300px] items-center justify-center">
              <Skeleton className="h-[200px] w-[200px] rounded-full" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              No hi ha ordres de treball registrades
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => 
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} OTs`, 'Quantitat']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Informació del Contracte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total d'unitats a l'inventari:</span>
              <span className="font-medium">
                {inventoryData.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total d'ordres de treball:</span>
              <span className="font-medium">
                {workOrdersData.length}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-muted-foreground">Ràtio compliment OTs:</span>
              <span className="font-medium">
                {workOrdersData.length > 0 
                  ? ((chartData.find(d => d.name === 'Completades')?.value || 0) / workOrdersData.length * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
