'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp,
  Package,
  ShieldCheck,
  Truck,
  Timer,
  CheckCircle,
  AlertTriangle,
  Wrench
} from 'lucide-react';
import { 
  mockKPIsC5,
  mockPedidosC5,
  mockReparacionesC5,
  mockGarantiasC5,
  catalogoProductosC5,
  equiposPrincipalesC5
} from '@/lib/contrato-c5-data';
import { 
  calcularKitsFabricables,
  stockBajo,
  cumpleSLA,
  calcularEstadisticasReparaciones,
  calcularEstadisticasGarantias
} from '@/lib/contrato-c5-utils';
import { CONTRATO_C5_CONFIG } from '@/lib/contrato-c5-types';

export default function ReportingPage() {
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

  // Total equipos
  const totalEquiposStock = equiposPrincipalesC5.reduce((acc, p) => acc + p.stockActual, 0);
  const totalEquiposMax = CONTRATO_C5_CONFIG.stockMaximoEquiposPrincipales * 3; // 3 tipos de equipos

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Reporting i KPIs</h1>
        <p className="text-muted-foreground">
          Indicadors clau del Contracte C-5/2025
        </p>
      </div>

      {/* Sección: Resumen General */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ocupació Estoc</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((totalEquiposStock / totalEquiposMax) * 100)}%
            </div>
            <Progress value={(totalEquiposStock / totalEquiposMax) * 100} className="mt-2 h-2" />
            <p className="mt-1 text-xs text-muted-foreground">
              {totalEquiposStock} de {totalEquiposMax} unitats màx.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacitat Fabricació Kits</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{resumenKits.kitsFabricables}</div>
            <p className="text-xs text-muted-foreground">
              kits amb estoc actual
            </p>
          </CardContent>
        </Card>

        <Card className={productosStockBajo > 0 ? 'border-destructive/30' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Estoc</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${productosStockBajo > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${productosStockBajo > 0 ? 'text-destructive' : ''}`}>
              {productosStockBajo}
            </div>
            <p className="text-xs text-muted-foreground">
              productes sota mínim
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comandes</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPedidosC5.length}</div>
            <p className="text-xs text-muted-foreground">
              {pedidosEntregados.length} lliurades
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sección: KPIs de Entregas */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            <CardTitle>KPIs de Lliuraments</CardTitle>
          </div>
          <CardDescription>Compliment de terminis d'entrega (màx. {CONTRATO_C5_CONFIG.plazoMaximoEntregaMeses} mesos)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Taxa Compliment</span>
                <span className={`text-2xl font-bold ${tasaCumplimientoPedidos >= 90 ? 'text-green-600' : tasaCumplimientoPedidos >= 70 ? 'text-orange-600' : 'text-destructive'}`}>
                  {tasaCumplimientoPedidos}%
                </span>
              </div>
              <Progress value={tasaCumplimientoPedidos} className="h-3" />
              <p className="text-xs text-muted-foreground">
                {pedidosEnPlazo} de {pedidosEntregados.length} en termini
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Lliurats en Termini
              </div>
              <div className="mt-2 text-3xl font-bold text-green-600">{pedidosEnPlazo}</div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                Fora de Termini
              </div>
              <div className="mt-2 text-3xl font-bold text-orange-600">
                {pedidosEntregados.length - pedidosEnPlazo}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección: KPIs de Reparaciones */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            <CardTitle>KPIs de Reparacions i SLA</CardTitle>
          </div>
          <CardDescription>
            Avaria: {CONTRATO_C5_CONFIG.slaReparacionAveriaDias}d | Vandalisme: {CONTRATO_C5_CONFIG.slaReparacionVandalismoDias}d
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Compliment SLA</span>
                <span className={`text-2xl font-bold ${statsReparaciones.tasaCumplimientoSLA >= 90 ? 'text-green-600' : statsReparaciones.tasaCumplimientoSLA >= 70 ? 'text-orange-600' : 'text-destructive'}`}>
                  {statsReparaciones.tasaCumplimientoSLA}%
                </span>
              </div>
              <Progress value={statsReparaciones.tasaCumplimientoSLA} className="h-3" />
            </div>

            <div className="rounded-lg border p-4 text-center">
              <div className="text-sm font-medium text-muted-foreground">Total Reparacions</div>
              <div className="mt-1 text-3xl font-bold">{statsReparaciones.total}</div>
            </div>

            <div className="rounded-lg border p-4 text-center">
              <div className="text-sm font-medium text-muted-foreground">Obertes</div>
              <div className="mt-1 text-3xl font-bold text-orange-600">{statsReparaciones.abiertas}</div>
            </div>

            <div className="rounded-lg border p-4 text-center">
              <div className="text-sm font-medium text-muted-foreground">Temps Mitjà</div>
              <div className="mt-1 text-3xl font-bold">{statsReparaciones.tiempoMedioDias}d</div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg bg-green-50 dark:bg-green-950/20 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Complint SLA</span>
              </div>
              <Badge variant="default" className="bg-green-600">{statsReparaciones.enSLA}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-red-50 dark:bg-red-950/20 p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="font-medium">Fora de SLA</span>
              </div>
              <Badge variant="destructive">{statsReparaciones.fueraSLA}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección: KPIs de Garantías */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <CardTitle>KPIs de Garanties</CardTitle>
          </div>
          <CardDescription>
            Cobertura de {CONTRATO_C5_CONFIG.garantiaMeses} mesos des de l'entrega
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="rounded-lg border p-4 text-center">
              <div className="text-sm font-medium text-muted-foreground">Total Garanties</div>
              <div className="mt-1 text-3xl font-bold">{statsGarantias.total}</div>
            </div>

            <div className="rounded-lg border border-green-500/30 bg-green-50 dark:bg-green-950/20 p-4 text-center">
              <div className="text-sm font-medium text-green-700 dark:text-green-400">Vigents</div>
              <div className="mt-1 text-3xl font-bold text-green-600">{statsGarantias.vigentes}</div>
            </div>

            <div className="rounded-lg border border-orange-500/30 bg-orange-50 dark:bg-orange-950/20 p-4 text-center">
              <div className="text-sm font-medium text-orange-700 dark:text-orange-400">Pròximes a Vèncer</div>
              <div className="mt-1 text-3xl font-bold text-orange-600">{statsGarantias.proximasVencer}</div>
            </div>

            <div className="rounded-lg border p-4 text-center">
              <div className="text-sm font-medium text-muted-foreground">Vençudes</div>
              <div className="mt-1 text-3xl font-bold text-muted-foreground">{statsGarantias.vencidas}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección: Equipos por tipo */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
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
