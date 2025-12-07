'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Package,
  ShieldCheck,
  Truck,
  Timer,
  CheckCircle,
  AlertTriangle,
  Wrench,
  RotateCcw,
  Activity,
  Calendar,
} from 'lucide-react';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { 
  mockPedidosC5,
  mockReparacionesC5,
  mockGarantiasC5,
  catalogoProductosC5,
  equiposPrincipalesC5
} from '@/lib/contrato-c5-data';
import { 
  calcularKitsFabricables,
  stockBajo,
  calcularEstadisticasReparaciones,
  calcularEstadisticasGarantias
} from '@/lib/contrato-c5-utils';
import { CONTRATO_C5_CONFIG } from '@/lib/contrato-c5-types';
import { format, sub, startOfMonth, endOfMonth, isWithinInterval, differenceInDays } from 'date-fns';
import { ca } from 'date-fns/locale';

// ============================================
// TIPOS Y DATOS MOCK PARA KPIs
// ============================================

type PeriodoKPI = 'mensual' | 'trimestral';

// Datos mock de roturas de stock (eventos donde stock < mínimo)
interface RoturaStock {
  fecha: Date;
  productoId: string;
  productoNombre: string;
  stockMomento: number;
  stockMinimo: number;
}

// Generar datos mock de roturas de stock
const mockRoturasStock: RoturaStock[] = [
  { fecha: sub(new Date(), { days: 5 }), productoId: 'EP-001', productoNombre: 'Antena Tribanda', stockMomento: 18, stockMinimo: 20 },
  { fecha: sub(new Date(), { days: 15 }), productoId: 'EP-002', productoNombre: 'Switch Ethernet', stockMomento: 12, stockMinimo: 15 },
  { fecha: sub(new Date(), { days: 25 }), productoId: 'EP-001', productoNombre: 'Antena Tribanda', stockMomento: 15, stockMinimo: 20 },
  { fecha: sub(new Date(), { days: 45 }), productoId: 'EP-003', productoNombre: 'Kit Integral', stockMomento: 8, stockMinimo: 10 },
  { fecha: sub(new Date(), { days: 60 }), productoId: 'EP-002', productoNombre: 'Switch Ethernet', stockMomento: 10, stockMinimo: 15 },
  { fecha: sub(new Date(), { days: 75 }), productoId: 'EP-001', productoNombre: 'Antena Tribanda', stockMomento: 17, stockMinimo: 20 },
  { fecha: sub(new Date(), { days: 90 }), productoId: 'EP-002', productoNombre: 'Switch Ethernet', stockMomento: 14, stockMinimo: 15 },
  { fecha: sub(new Date(), { days: 120 }), productoId: 'EP-003', productoNombre: 'Kit Integral', stockMomento: 9, stockMinimo: 10 },
];

// Datos mock de consumo anual para rotación
interface ConsumoAnual {
  productoId: string;
  productoNombre: string;
  consumoAnual: number;
  stockMedio: number;
}

const mockConsumoAnual: ConsumoAnual[] = [
  { productoId: 'EP-001', productoNombre: 'Antena Tribanda', consumoAnual: 180, stockMedio: 45 },
  { productoId: 'EP-002', productoNombre: 'Switch Ethernet', consumoAnual: 140, stockMedio: 38 },
  { productoId: 'EP-003', productoNombre: 'Kit Integral', consumoAnual: 95, stockMedio: 25 },
];

// Datos mock mensuales para gráficas
interface DatosMensuales {
  mes: string;
  mesLabel: string;
  pedidosEnPlazo: number;
  pedidosTotales: number;
  roturasStock: number;
  rmaAbiertos: number;
  rmaCerrados: number;
  tiempoMedioRMA: number;
}

// Generar últimos 12 meses de datos
function generarDatosMensuales(): DatosMensuales[] {
  const datos: DatosMensuales[] = [];
  const hoy = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const fecha = sub(hoy, { months: i });
    const mesKey = format(fecha, 'yyyy-MM');
    const mesLabel = format(fecha, 'MMM yy', { locale: ca });
    
    // Datos mock con variación realista
    const pedidosTotales = Math.floor(Math.random() * 8) + 5; // 5-12
    const pedidosEnPlazo = Math.floor(pedidosTotales * (0.75 + Math.random() * 0.20)); // 75-95%
    
    datos.push({
      mes: mesKey,
      mesLabel: mesLabel.charAt(0).toUpperCase() + mesLabel.slice(1),
      pedidosEnPlazo,
      pedidosTotales,
      roturasStock: Math.floor(Math.random() * 4), // 0-3
      rmaAbiertos: Math.floor(Math.random() * 5) + 1, // 1-5
      rmaCerrados: Math.floor(Math.random() * 4) + 1, // 1-4
      tiempoMedioRMA: Math.floor(Math.random() * 5) + 4, // 4-8 días
    });
  }
  
  return datos;
}

const datosMensuales = generarDatosMensuales();

// Agrupar por trimestre
function agruparPorTrimestre(datos: DatosMensuales[]): DatosMensuales[] {
  const trimestres: DatosMensuales[] = [];
  
  for (let i = 0; i < datos.length; i += 3) {
    const grupo = datos.slice(i, i + 3);
    if (grupo.length === 3) {
      trimestres.push({
        mes: grupo[0].mes,
        mesLabel: `T${Math.floor(i / 3) + 1}`,
        pedidosEnPlazo: grupo.reduce((s, d) => s + d.pedidosEnPlazo, 0),
        pedidosTotales: grupo.reduce((s, d) => s + d.pedidosTotales, 0),
        roturasStock: grupo.reduce((s, d) => s + d.roturasStock, 0),
        rmaAbiertos: grupo.reduce((s, d) => s + d.rmaAbiertos, 0),
        rmaCerrados: grupo.reduce((s, d) => s + d.rmaCerrados, 0),
        tiempoMedioRMA: Math.round(grupo.reduce((s, d) => s + d.tiempoMedioRMA, 0) / 3),
      });
    }
  }
  
  return trimestres;
}

// Configuración de colores para gráficas
const chartConfigPedidos: ChartConfig = {
  pedidosEnPlazo: { label: 'En termini', color: 'hsl(var(--chart-1))' },
  pedidosFueraPlazo: { label: 'Fora termini', color: 'hsl(var(--chart-2))' },
};

const chartConfigRMA: ChartConfig = {
  tiempoMedioRMA: { label: 'Temps mitjà (dies)', color: 'hsl(var(--chart-3))' },
};

const chartConfigRoturas: ChartConfig = {
  roturasStock: { label: 'Ruptures estoc', color: 'hsl(var(--chart-4))' },
};

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'];

export default function ReportingPage() {
  const [periodo, setPeriodo] = useState<PeriodoKPI>('mensual');
  
  // Datos según periodo seleccionado
  const datosGrafica = useMemo(() => {
    return periodo === 'mensual' ? datosMensuales : agruparPorTrimestre(datosMensuales);
  }, [periodo]);
  
  // Calcular estadísticas
  const resumenKits = calcularKitsFabricables();
  const productosStockBajo = catalogoProductosC5.filter(stockBajo).length;
  const statsReparaciones = calcularEstadisticasReparaciones(mockReparacionesC5);
  const statsGarantias = calcularEstadisticasGarantias(mockGarantiasC5);
  
  // Estadísticas de pedidos
  const pedidosEntregados = mockPedidosC5.filter(p => p.estado === 'entregado');
  const pedidosEnPlazo = pedidosEntregados.filter(p => 
    p.fechaEntregaReal && p.fechaEntregaLimite && p.fechaEntregaReal <= p.fechaEntregaLimite
  ).length;
  const tasaCumplimientoPedidos = pedidosEntregados.length > 0 
    ? Math.round((pedidosEnPlazo / pedidosEntregados.length) * 100)
    : 100;

  // KPIs calculados
  const roturasUltimos30Dias = mockRoturasStock.filter(r => 
    differenceInDays(new Date(), r.fecha) <= 30
  ).length;
  
  const roturasUltimos90Dias = mockRoturasStock.filter(r => 
    differenceInDays(new Date(), r.fecha) <= 90
  ).length;
  
  // Rotación de inventario (consumo anual / stock medio)
  const rotacionPromedio = useMemo(() => {
    const totalRotacion = mockConsumoAnual.reduce((sum, c) => 
      sum + (c.consumoAnual / c.stockMedio), 0
    );
    return (totalRotacion / mockConsumoAnual.length).toFixed(1);
  }, []);
  
  // Tiempo medio RMA
  const tiempoMedioRMA = statsReparaciones.tiempoMedioDias;
  
  // Total equipos
  const totalEquiposStock = equiposPrincipalesC5.reduce((acc, p) => acc + p.stockActual, 0);
  const totalEquiposMax = CONTRATO_C5_CONFIG.stockMaximoEquiposPrincipales * 3;

  // Datos para gráfico de rotación
  const datosRotacion = mockConsumoAnual.map(c => ({
    nombre: c.productoNombre.split(' ')[0],
    rotacion: +(c.consumoAnual / c.stockMedio).toFixed(1),
    consumo: c.consumoAnual,
    stock: c.stockMedio,
  }));

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reporting i KPIs</h1>
          <p className="text-muted-foreground">
            Indicadors clau del Contracte C-5/2025
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={periodo} onValueChange={(v) => setPeriodo(v as PeriodoKPI)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Període" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mensual">Mensual</SelectItem>
              <SelectItem value="trimestral">Trimestral</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">% Comandes en Termini</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${tasaCumplimientoPedidos >= 90 ? 'text-green-600' : tasaCumplimientoPedidos >= 70 ? 'text-orange-600' : 'text-destructive'}`}>
              {tasaCumplimientoPedidos}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {tasaCumplimientoPedidos >= 80 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
              )}
              {pedidosEnPlazo} de {pedidosEntregados.length} lliurades
            </div>
            <Progress value={tasaCumplimientoPedidos} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className={roturasUltimos30Dias > 2 ? 'border-destructive/30' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ruptures d'Estoc</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${roturasUltimos30Dias > 2 ? 'text-destructive' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${roturasUltimos30Dias > 2 ? 'text-destructive' : ''}`}>
              {roturasUltimos30Dias}
            </div>
            <p className="text-xs text-muted-foreground">
              últims 30 dies ({roturasUltimos90Dias} en 90d)
            </p>
            <div className="mt-2 flex gap-1">
              {equiposPrincipalesC5.map((eq) => {
                const roturas = mockRoturasStock.filter(r => 
                  r.productoId === eq.id && differenceInDays(new Date(), r.fecha) <= 30
                ).length;
                return (
                  <Badge key={eq.id} variant={roturas > 0 ? 'destructive' : 'secondary'} className="text-xs">
                    {eq.nombre.split(' ')[0]}: {roturas}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rotació Inventari</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rotacionPromedio}x</div>
            <p className="text-xs text-muted-foreground">
              consum anual / estoc mitjà
            </p>
            <div className="mt-2 space-y-1">
              {datosRotacion.map((d) => (
                <div key={d.nombre} className="flex items-center justify-between text-xs">
                  <span>{d.nombre}</span>
                  <span className="font-medium">{d.rotacion}x</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Mitjà RMA</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${tiempoMedioRMA <= CONTRATO_C5_CONFIG.slaReparacionAveriaDias ? 'text-green-600' : 'text-orange-600'}`}>
              {tiempoMedioRMA} dies
            </div>
            <p className="text-xs text-muted-foreground">
              SLA: {CONTRATO_C5_CONFIG.slaReparacionAveriaDias}d averia / {CONTRATO_C5_CONFIG.slaReparacionVandalismoDias}d vand.
            </p>
            <Progress 
              value={Math.min((tiempoMedioRMA / CONTRATO_C5_CONFIG.slaReparacionAveriaDias) * 100, 100)} 
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Tabs con gráficas */}
      <Tabs defaultValue="pedidos" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="pedidos">Comandes</TabsTrigger>
          <TabsTrigger value="roturas">Ruptures</TabsTrigger>
          <TabsTrigger value="rma">RMA</TabsTrigger>
          <TabsTrigger value="rotacion">Rotació</TabsTrigger>
        </TabsList>

        {/* Gráfica de Pedidos en Plazo */}
        <TabsContent value="pedidos">
          <Card>
            <CardHeader>
              <CardTitle>% Comandes Lliurades en Termini</CardTitle>
              <CardDescription>
                Evolució {periodo === 'mensual' ? 'mensual' : 'trimestral'} del compliment de terminis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfigPedidos} className="h-[350px]">
                <BarChart data={datosGrafica}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mesLabel" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="pedidosEnPlazo" 
                    fill="var(--color-pedidosEnPlazo)" 
                    radius={[4, 4, 0, 0]} 
                    name="En termini"
                  />
                  <Bar 
                    dataKey={(d: DatosMensuales) => d.pedidosTotales - d.pedidosEnPlazo} 
                    fill="var(--color-pedidosFueraPlazo)" 
                    radius={[4, 4, 0, 0]}
                    name="Fora termini"
                    stackId="a"
                  />
                </BarChart>
              </ChartContainer>
              <div className="mt-4 flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-[hsl(var(--chart-1))]" />
                  <span>En termini</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-[hsl(var(--chart-2))]" />
                  <span>Fora de termini</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gráfica de Roturas de Stock */}
        <TabsContent value="roturas">
          <Card>
            <CardHeader>
              <CardTitle>Ruptures d'Estoc</CardTitle>
              <CardDescription>
                Esdeveniments on l'estoc ha baixat del mínim ({periodo})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfigRoturas} className="h-[350px]">
                <BarChart data={datosGrafica}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mesLabel" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="roturasStock" 
                    fill="var(--color-roturasStock)" 
                    radius={[4, 4, 0, 0]}
                    name="Ruptures"
                  />
                </BarChart>
              </ChartContainer>
              <div className="mt-4 rounded-lg border p-4">
                <h4 className="font-medium mb-2">Últimes ruptures registrades</h4>
                <div className="space-y-2">
                  {mockRoturasStock.slice(0, 4).map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{format(r.fecha, 'dd/MM/yyyy', { locale: ca })}</span>
                      <span>{r.productoNombre}</span>
                      <Badge variant="destructive">{r.stockMomento}/{r.stockMinimo}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gráfica de Tiempo Medio RMA */}
        <TabsContent value="rma">
          <Card>
            <CardHeader>
              <CardTitle>Temps Mitjà de Reparació (RMA)</CardTitle>
              <CardDescription>
                Dies promig per tancar una reparació ({periodo})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfigRMA} className="h-[350px]">
                <LineChart data={datosGrafica}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mesLabel" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} domain={[0, 12]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone"
                    dataKey="tiempoMedioRMA" 
                    stroke="var(--color-tiempoMedioRMA)" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Temps mitjà"
                  />
                  {/* Línea de referencia SLA */}
                  <Line 
                    type="monotone"
                    dataKey={() => CONTRATO_C5_CONFIG.slaReparacionAveriaDias}
                    stroke="hsl(var(--destructive))"
                    strokeDasharray="5 5"
                    strokeWidth={1}
                    dot={false}
                    name="SLA Averia"
                  />
                </LineChart>
              </ChartContainer>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="rounded-lg border p-3">
                  <div className="text-2xl font-bold">{statsReparaciones.total}</div>
                  <div className="text-xs text-muted-foreground">Total RMA</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-2xl font-bold text-green-600">{statsReparaciones.enSLA}</div>
                  <div className="text-xs text-muted-foreground">Dins SLA</div>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-2xl font-bold text-destructive">{statsReparaciones.fueraSLA}</div>
                  <div className="text-xs text-muted-foreground">Fora SLA</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gráfica de Rotación */}
        <TabsContent value="rotacion">
          <Card>
            <CardHeader>
              <CardTitle>Rotació d'Inventari per Producte</CardTitle>
              <CardDescription>
                Consum anual dividit per estoc mitjà (vegades/any)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <ChartContainer config={{}} className="h-[300px]">
                  <PieChart>
                    <Pie
                      data={datosRotacion}
                      dataKey="consumo"
                      nameKey="nombre"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.nombre}: ${entry.consumo}`}
                    >
                      {datosRotacion.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="space-y-4">
                  <h4 className="font-medium">Detall per Equip</h4>
                  {datosRotacion.map((d, i) => (
                    <div key={d.nombre} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded" style={{ backgroundColor: COLORS[i] }} />
                          <span className="font-medium">{d.nombre}</span>
                        </div>
                        <span className="text-xl font-bold">{d.rotacion}x</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Consum anual: {d.consumo} ud</span>
                        <span>Estoc mitjà: {d.stock} ud</span>
                      </div>
                      <Progress value={(d.rotacion / 5) * 100} className="h-2" />
                    </div>
                  ))}
                  <div className="rounded-lg bg-muted p-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      <span className="font-medium">Rotació mitjana global: {rotacionPromedio}x</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Una rotació alta indica bona gestió d'inventari
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resumen de equipos */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <CardTitle>Distribució d'Estoc per Equip</CardTitle>
          </div>
          <CardDescription>
            Volumetria màxima: {CONTRATO_C5_CONFIG.stockMaximoEquiposPrincipales} unitats per tipus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {equiposPrincipalesC5.map((equipo) => {
              const porcentaje = Math.round((equipo.stockActual / CONTRATO_C5_CONFIG.stockMaximoEquiposPrincipales) * 100);
              const disponible = equipo.stockActual - (equipo.stockReservado || 0);
              
              return (
                <div key={equipo.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{equipo.nombre}</span>
                      <span className="ml-2 font-mono text-xs text-muted-foreground">{equipo.sku}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{equipo.stockActual}</span>
                      <span className="text-muted-foreground"> / {CONTRATO_C5_CONFIG.stockMaximoEquiposPrincipales}</span>
                    </div>
                  </div>
                  <Progress value={porcentaje} className="h-4" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Disponible: {disponible}</span>
                    <span>Reservat: {equipo.stockReservado}</span>
                    <span>{porcentaje}% ocupació</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
