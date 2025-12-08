'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Truck, 
  ShieldCheck, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Wrench,
  Boxes,
  Timer,
  Bell,
  ArrowRight,
  Building,
  FileSpreadsheet,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { 
  equiposPrincipalesC5,
  mockPedidosC5, 
  mockReparacionesC5, 
  mockGarantiasC5,
  mockAlertasC5,
  mockKPIsC5
} from '@/lib/contrato-c5-data';
import {
  mockSolicitudesOperador,
  mockPedidosProveedor,
  mockStockCentral,
  mockKPIsCentralCompras
} from '@/lib/central-compras-data';
import { 
  calcularKitsFabricables,
  stockBajo,
  cumpleSLA,
  slaEnRiesgo,
  garantiaProximaVencer,
  diasRestantesSLA,
  porcentajeAvanceSLA
} from '@/lib/contrato-c5-utils';
import { CONTRATO_C5_CONFIG } from '@/lib/contrato-c5-types';
import { catalogoProductosC5 } from '@/lib/contrato-c5-data';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';

export default function ContratoC5DashboardPage() {
  // Estadísticas calculadas
  const resumenKits = calcularKitsFabricables();
  const productosStockBajo = catalogoProductosC5.filter(stockBajo).length;
  const pedidosActivos = mockPedidosC5.filter(p => !['entregado'].includes(p.estado));
  const reparacionesAbiertas = mockReparacionesC5.filter(r => r.estado !== 'cerrada');
  const reparacionesEnRiesgo = reparacionesAbiertas.filter(slaEnRiesgo);
  const reparacionesFueraSLA = mockReparacionesC5.filter(r => !cumpleSLA(r)).length;
  const garantiasProximas = mockGarantiasC5.filter(garantiaProximaVencer);
  const alertasSinLeer = mockAlertasC5.filter(a => !a.leida);

  // Total equipos en stock
  const totalEquiposStock = equiposPrincipalesC5.reduce((acc, p) => acc + p.stockActual, 0);

  // Estadísticas Central de Compras
  const solicitudesPendientes = mockSolicitudesOperador.filter(s => s.estado === 'enviada').length;
  const solicitudesAprobadas = mockSolicitudesOperador.filter(s => s.estado === 'aprobada').length;
  const pedidosProveedorActivos = mockPedidosProveedor.filter(p => p.estado !== 'recibido' && p.estado !== 'distribuido').length;
  const stockConAlertas = mockStockCentral.filter(s => s.nivelAlerta !== 'ok').length;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Contracte C-5/2025</h1>
          <p className="text-muted-foreground">
            Equipament de comunicacions per a autobusos - Magatzem i Garanties
          </p>
        </div>
        {alertasSinLeer.length > 0 && (
          <Badge variant="destructive" className="gap-1">
            <Bell className="h-3 w-3" />
            {alertasSinLeer.length} alertes
          </Badge>
        )}
      </div>

      {/* KPIs principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipos en Estoc</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEquiposStock}</div>
            <div className="flex items-center gap-2">
              <Progress value={(totalEquiposStock / (CONTRATO_C5_CONFIG.stockMaximoEquiposPrincipales * 3)) * 100} className="h-2 flex-1" />
              <span className="text-xs text-muted-foreground">
                {Math.round((totalEquiposStock / (CONTRATO_C5_CONFIG.stockMaximoEquiposPrincipales * 3)) * 100)}% capacitat
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kits Fabricables</CardTitle>
            <Wrench className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{resumenKits.kitsFabricables}</div>
            <p className="text-xs text-muted-foreground">
              {resumenKits.componenteLimitante 
                ? `Limitat per: ${resumenKits.componenteLimitante.nombre}`
                : 'Components suficients'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comandes Actives</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pedidosActivos.length}</div>
            <p className="text-xs text-muted-foreground">
              pendents de lliurament
            </p>
          </CardContent>
        </Card>

        <Card className={reparacionesFueraSLA > 0 ? 'border-destructive/50 bg-destructive/5' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reparacions Obertes</CardTitle>
            <ShieldCheck className={`h-4 w-4 ${reparacionesFueraSLA > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${reparacionesFueraSLA > 0 ? 'text-destructive' : ''}`}>
              {reparacionesAbiertas.length}
            </div>
            <p className={`text-xs ${reparacionesEnRiesgo.length > 0 ? 'text-orange-600' : 'text-muted-foreground'}`}>
              {reparacionesEnRiesgo.length > 0 
                ? `${reparacionesEnRiesgo.length} en risc de SLA` 
                : 'Totes dins SLA'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      {(productosStockBajo > 0 || reparacionesEnRiesgo.length > 0 || garantiasProximas.length > 0) && (
        <Card className="border-orange-300 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-orange-700 dark:text-orange-400">
              <AlertTriangle className="h-5 w-5" />
              Alertes Actives
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {productosStockBajo > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-white/50 dark:bg-black/20 p-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">{productosStockBajo} productes amb estoc baix</span>
                </div>
                <Link href="/contrato-c5-2025/inventario">
                  <Button variant="ghost" size="sm" className="text-orange-600">
                    Veure <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
            {reparacionesEnRiesgo.length > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-white/50 dark:bg-black/20 p-2">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">{reparacionesEnRiesgo.length} reparacions pròximes a SLA</span>
                </div>
                <Link href="/contrato-c5-2025/garantias">
                  <Button variant="ghost" size="sm" className="text-orange-600">
                    Veure <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
            {garantiasProximas.length > 0 && (
              <div className="flex items-center justify-between rounded-lg bg-white/50 dark:bg-black/20 p-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">{garantiasProximas.length} garanties pròximes a vèncer</span>
                </div>
                <Link href="/contrato-c5-2025/garantias">
                  <Button variant="ghost" size="sm" className="text-orange-600">
                    Veure <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Contenido principal en 2 columnas */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Reparaciones con SLA */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Reparacions en Curs</CardTitle>
              <CardDescription>Control d'SLA per tipus d'incidència</CardDescription>
            </div>
            <Link href="/contrato-c5-2025/garantias">
              <Button variant="ghost" size="sm">
                Veure totes <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {reparacionesAbiertas.slice(0, 4).map((rep) => {
              const diasRestantes = diasRestantesSLA(rep);
              const porcentaje = porcentajeAvanceSLA(rep);
              const enRiesgo = slaEnRiesgo(rep);
              
              return (
                <div key={rep.id} className="flex items-center gap-4">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    enRiesgo ? 'bg-orange-500/20' : 'bg-primary/10'
                  }`}>
                    <Wrench className={`h-4 w-4 ${enRiesgo ? 'text-orange-500' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{rep.codigo}</p>
                      <Badge variant={rep.tipoIncidencia === 'vandalismo' ? 'destructive' : 'outline'}>
                        {rep.tipoIncidencia === 'averia' ? 'Avaria' : 'Vandalisme'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{rep.productoNombre}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Progress value={porcentaje} className="h-1.5 flex-1" />
                      <span className={`text-xs font-medium ${enRiesgo ? 'text-orange-600' : 'text-muted-foreground'}`}>
                        {diasRestantes}d
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {reparacionesAbiertas.length === 0 && (
              <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Cap reparació pendent
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pedidos activos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Comandes Actives</CardTitle>
              <CardDescription>Pendents de lliurament</CardDescription>
            </div>
            <Link href="/contrato-c5-2025/pedidos">
              <Button variant="ghost" size="sm">
                Veure totes <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {pedidosActivos.slice(0, 4).map((pedido) => {
              const totalPedido = pedido.lineas.reduce((acc, l) => acc + l.cantidadPedida, 0);
              const totalEntregado = pedido.lineas.reduce((acc, l) => acc + l.cantidadEntregada, 0);
              const progreso = totalPedido > 0 ? (totalEntregado / totalPedido) * 100 : 0;
              
              return (
                <div key={pedido.id} className="flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Truck className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{pedido.codigo}</p>
                      <Badge variant={
                        pedido.estado === 'en_preparacion' ? 'secondary' :
                        pedido.estado === 'confirmado' ? 'outline' :
                        'default'
                      }>
                        {pedido.estado === 'confirmado' ? 'Confirmat' : 
                         pedido.estado === 'en_preparacion' ? 'En preparació' :
                         pedido.estado}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{pedido.operadorNombre.split(',')[0]}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Progress value={progreso} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground">{totalEntregado}/{totalPedido}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {pedidosActivos.length === 0 && (
              <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Totes les comandes lliurades
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Equipos principales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Equipos Principals</CardTitle>
            <CardDescription>
              Volumetria màxima contracte: {CONTRATO_C5_CONFIG.stockMaximoEquiposPrincipales} unitats per equip
            </CardDescription>
          </div>
          <Link href="/contrato-c5-2025/inventario">
            <Button variant="ghost" size="sm">
              Inventari complet <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {equiposPrincipalesC5.map((equipo) => {
              const disponible = equipo.stockActual - (equipo.stockReservado || 0);
              const porcentaje = Math.round((equipo.stockActual / CONTRATO_C5_CONFIG.stockMaximoEquiposPrincipales) * 100);
              const esBajo = stockBajo(equipo);
              
              return (
                <div 
                  key={equipo.id} 
                  className={`rounded-lg border p-4 ${esBajo ? 'border-destructive/50 bg-destructive/5' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-muted-foreground">{equipo.sku}</span>
                    {esBajo && <AlertTriangle className="h-4 w-4 text-destructive" />}
                  </div>
                  <h4 className="font-medium">{equipo.nombre}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{equipo.descripcion}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Estoc: <strong>{equipo.stockActual}</strong></span>
                      <span className="text-muted-foreground">Disponible: {disponible}</span>
                    </div>
                    <Progress value={porcentaje} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{porcentaje}% de {CONTRATO_C5_CONFIG.stockMaximoEquiposPrincipales}</span>
                      <span>Reservat: {equipo.stockReservado}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Central de Compras Section */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Building className="h-5 w-5" />
              Central de Compres
            </CardTitle>
            <CardDescription>
              Agregació de comandes d'operadors per a equipament T-mobilitat
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Link href="/contrato-c5-2025/solicitudes" className="group">
              <div className="rounded-lg border bg-white/80 dark:bg-black/20 p-4 transition-colors hover:border-blue-400">
                <div className="flex items-center gap-2 mb-2">
                  <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Sol·licituds Operador</span>
                </div>
                <div className="text-2xl font-bold text-blue-700">{solicitudesPendientes}</div>
                <p className="text-xs text-muted-foreground">pendents d'aprovar</p>
                {solicitudesAprobadas > 0 && (
                  <Badge variant="outline" className="mt-2 text-xs">
                    {solicitudesAprobadas} aprovades per agregar
                  </Badge>
                )}
              </div>
            </Link>

            <Link href="/contrato-c5-2025/central" className="group">
              <div className="rounded-lg border bg-white/80 dark:bg-black/20 p-4 transition-colors hover:border-blue-400">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium">Central Agregació</span>
                </div>
                <div className="text-2xl font-bold text-indigo-700">{solicitudesAprobadas}</div>
                <p className="text-xs text-muted-foreground">sol·licituds per agregar</p>
                <Badge variant="secondary" className="mt-2 text-xs">
                  {mockKPIsCentralCompras.porcentajeCumplimientoMinimos}% compleix mínims
                </Badge>
              </div>
            </Link>

            <Link href="/contrato-c5-2025/pedidos-proveedor" className="group">
              <div className="rounded-lg border bg-white/80 dark:bg-black/20 p-4 transition-colors hover:border-blue-400">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Comandes WINFIN</span>
                </div>
                <div className="text-2xl font-bold text-green-700">{pedidosProveedorActivos}</div>
                <p className="text-xs text-muted-foreground">en trànsit</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Lead time: 45 dies
                </div>
              </div>
            </Link>

            <Link href="/contrato-c5-2025/stock-central" className="group">
              <div className={`rounded-lg border bg-white/80 dark:bg-black/20 p-4 transition-colors hover:border-blue-400 ${stockConAlertas > 0 ? 'border-orange-300' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Boxes className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Estoc Central</span>
                </div>
                <div className="text-2xl font-bold text-purple-700">{mockStockCentral.reduce((acc, s) => acc + s.stockTotal, 0)}</div>
                <p className="text-xs text-muted-foreground">unitats totals</p>
                {stockConAlertas > 0 ? (
                  <Badge variant="destructive" className="mt-2 text-xs">
                    {stockConAlertas} alertes d'estoc
                  </Badge>
                ) : (
                  <Badge variant="outline" className="mt-2 text-xs text-green-600">
                    Estoc OK
                  </Badge>
                )}
              </div>
            </Link>
          </div>

          {/* KPIs row */}
          <div className="mt-4 grid gap-4 md:grid-cols-3 border-t pt-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{mockKPIsCentralCompras.ahorroAcumuladoEscala.toLocaleString('ca-ES')}€</p>
                <p className="text-xs text-muted-foreground">Estalvi acumulat volum</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Timer className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{mockKPIsCentralCompras.tiempoMedioEntregaDias} dies</p>
                <p className="text-xs text-muted-foreground">Temps mitjà entrega</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Boxes className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{mockKPIsCentralCompras.urgenciasServidasUltimos30Dias}</p>
                <p className="text-xs text-muted-foreground">Urgències des de buffer</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
