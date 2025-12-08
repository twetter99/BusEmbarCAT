'use client';

import * as React from 'react';
import { format, differenceInDays, addDays } from 'date-fns';
import { ca } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Package,
  Send,
  Factory,
  Truck,
  CheckCircle2,
  Clock,
  Eye,
  Calendar,
  Building2,
  FileText,
  ArrowRight,
  TrendingDown,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  mockPedidosProveedor,
  WINFIN_CONFIG,
} from '@/lib/central-compras-data';
import type {
  PedidoProveedor,
  EstadoPedidoProveedor,
} from '@/lib/contrato-c5-types';

// Configuración de estados
const estadoConfig: Record<EstadoPedidoProveedor, { 
  label: string; 
  color: string; 
  icon: React.ReactNode;
  step: number;
}> = {
  borrador: { label: 'Esborrany', color: 'bg-slate-100 text-slate-700', icon: <FileText className="h-4 w-4" />, step: 0 },
  enviado_proveedor: { label: 'Enviat', color: 'bg-blue-100 text-blue-700', icon: <Send className="h-4 w-4" />, step: 1 },
  confirmado: { label: 'Confirmat', color: 'bg-indigo-100 text-indigo-700', icon: <CheckCircle2 className="h-4 w-4" />, step: 2 },
  en_fabricacion: { label: 'En Fabricació', color: 'bg-amber-100 text-amber-700', icon: <Factory className="h-4 w-4" />, step: 3 },
  enviado: { label: 'En Trànsit', color: 'bg-purple-100 text-purple-700', icon: <Truck className="h-4 w-4" />, step: 4 },
  recibido_parcial: { label: 'Recepció Parcial', color: 'bg-orange-100 text-orange-700', icon: <Package className="h-4 w-4" />, step: 5 },
  recibido: { label: 'Rebut', color: 'bg-green-100 text-green-700', icon: <Package className="h-4 w-4" />, step: 6 },
  distribuido: { label: 'Distribuït', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="h-4 w-4" />, step: 7 },
};

const steps = [
  { key: 'borrador', label: 'Esborrany' },
  { key: 'enviado_proveedor', label: 'Enviat' },
  { key: 'confirmado', label: 'Confirmat' },
  { key: 'en_fabricacion', label: 'Fabricació' },
  { key: 'enviado', label: 'Trànsit' },
  { key: 'recibido', label: 'Rebut' },
  { key: 'distribuido', label: 'Distribuït' },
];

export default function PedidosProveedorPage() {
  const { toast } = useToast();
  const [pedidos, setPedidos] = React.useState<PedidoProveedor[]>(mockPedidosProveedor);
  const [filtroEstado, setFiltroEstado] = React.useState<string>('todos');
  const [busqueda, setBusqueda] = React.useState('');
  
  // Detalle
  const [selectedPedido, setSelectedPedido] = React.useState<PedidoProveedor | null>(null);
  const [isDetalleOpen, setIsDetalleOpen] = React.useState(false);

  // Filtrado
  const pedidosFiltrados = React.useMemo(() => {
    return pedidos.filter(p => {
      if (filtroEstado !== 'todos' && p.estado !== filtroEstado) return false;
      if (busqueda) {
        return p.codigo.toLowerCase().includes(busqueda.toLowerCase());
      }
      return true;
    });
  }, [pedidos, filtroEstado, busqueda]);

  // Stats
  const stats = React.useMemo(() => {
    return {
      total: pedidos.length,
      activos: pedidos.filter(p => !['distribuido', 'borrador'].includes(p.estado)).length,
      enFabricacion: pedidos.filter(p => p.estado === 'en_fabricacion').length,
      completados: pedidos.filter(p => p.estado === 'distribuido').length,
    };
  }, [pedidos]);

  const handleVerDetalle = (pedido: PedidoProveedor) => {
    setSelectedPedido(pedido);
    setIsDetalleOpen(true);
  };

  const handleAvanzarEstado = (pedido: PedidoProveedor) => {
    const estadosOrden: EstadoPedidoProveedor[] = [
      'borrador', 'enviado_proveedor', 'confirmado', 'en_fabricacion', 
      'enviado', 'recibido', 'distribuido'
    ];
    const currentIdx = estadosOrden.indexOf(pedido.estado);
    if (currentIdx < estadosOrden.length - 1) {
      const nuevoEstado = estadosOrden[currentIdx + 1];
      setPedidos(prev =>
        prev.map(p =>
          p.id === pedido.id ? { ...p, estado: nuevoEstado } : p
        )
      );
      toast({
        title: 'Estat actualitzat',
        description: `${pedido.codigo} → ${estadoConfig[nuevoEstado].label}`,
      });
    }
  };

  const calcularProgreso = (pedido: PedidoProveedor): number => {
    const step = estadoConfig[pedido.estado].step;
    return Math.round((step / 7) * 100);
  };

  const calcularDiasRestantes = (pedido: PedidoProveedor): number | null => {
    if (!pedido.fechaEntregaEstimada) return null;
    return differenceInDays(pedido.fechaEntregaEstimada, new Date());
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comandes a Proveïdor</h1>
        <p className="text-muted-foreground">
          Seguiment de comandes a WINFIN
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Comandes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Comandes Actives</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.activos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">En Fabricació</CardTitle>
            <Factory className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.enFabricacion}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completades</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completados}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <Label htmlFor="busqueda">Cerca</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="busqueda"
                  placeholder="Codi de comanda..."
                  className="pl-8"
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label>Estat</Label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Tots</SelectItem>
                  <SelectItem value="borrador">Esborrany</SelectItem>
                  <SelectItem value="enviado_proveedor">Enviat</SelectItem>
                  <SelectItem value="confirmado">Confirmat</SelectItem>
                  <SelectItem value="en_fabricacion">En Fabricació</SelectItem>
                  <SelectItem value="enviado">En Trànsit</SelectItem>
                  <SelectItem value="recibido">Rebut</SelectItem>
                  <SelectItem value="distribuido">Distribuït</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {pedidosFiltrados.map(pedido => {
          const diasRestantes = calcularDiasRestantes(pedido);
          const progreso = calcularProgreso(pedido);
          
          return (
            <Card key={pedido.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-lg font-mono">{pedido.codigo}</CardTitle>
                    <Badge className={estadoConfig[pedido.estado].color} variant="secondary">
                      {estadoConfig[pedido.estado].icon}
                      <span className="ml-1">{estadoConfig[pedido.estado].label}</span>
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {diasRestantes !== null && pedido.estado !== 'distribuido' && (
                      <Badge variant="outline" className={diasRestantes < 0 ? 'border-red-300 text-red-600' : ''}>
                        <Calendar className="h-3 w-3 mr-1" />
                        {diasRestantes < 0 
                          ? `${Math.abs(diasRestantes)}d retard`
                          : `${diasRestantes}d restants`
                        }
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleVerDetalle(pedido)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    WINFIN
                  </span>
                  <span>{pedido.solicitudesIncluidas.length} sol·licituds</span>
                  <span>{pedido.totalUnidades} unitats</span>
                  {pedido.ahorroEstimadoEscala && (
                    <span className="text-green-600 flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      -{pedido.ahorroEstimadoEscala}%
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                {/* Progress tracker */}
                <div className="relative pt-2">
                  <Progress value={progreso} className="h-2" />
                  <div className="flex justify-between mt-2">
                    {steps.map((step, idx) => {
                      const isActive = estadoConfig[pedido.estado].step >= idx;
                      const isCurrent = steps[estadoConfig[pedido.estado].step]?.key === step.key;
                      return (
                        <div 
                          key={step.key} 
                          className={`text-xs text-center ${
                            isCurrent ? 'text-primary font-bold' : 
                            isActive ? 'text-muted-foreground' : 'text-muted-foreground/50'
                          }`}
                          style={{ width: `${100 / steps.length}%` }}
                        >
                          {step.label}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Líneas resumidas */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {pedido.lineas.map(linea => (
                    <Badge key={linea.id} variant="outline" className="text-xs">
                      {linea.cantidadTotal}x {linea.nombre.split(' ')[0]}
                      {!linea.cumpleMinimoFabricacion && (
                        <AlertTriangle className="h-3 w-3 ml-1 text-amber-500" />
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 py-2">
                <div className="flex items-center justify-between w-full text-sm">
                  <span className="text-muted-foreground">
                    Creat: {format(pedido.fechaCreacion, 'dd/MM/yyyy', { locale: ca })}
                  </span>
                  {pedido.estado !== 'distribuido' && pedido.estado !== 'borrador' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAvanzarEstado(pedido)}
                    >
                      Avançar Estat
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          );
        })}

        {pedidosFiltrados.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No s'han trobat comandes amb els filtres actuals</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sheet Detalle */}
      <Sheet open={isDetalleOpen} onOpenChange={setIsDetalleOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          {selectedPedido && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {selectedPedido.codigo}
                </SheetTitle>
                <SheetDescription>
                  Detall de la comanda a WINFIN
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Estado */}
                <div className="flex items-center gap-2">
                  <Badge className={estadoConfig[selectedPedido.estado].color} variant="secondary">
                    {estadoConfig[selectedPedido.estado].icon}
                    <span className="ml-1">{estadoConfig[selectedPedido.estado].label}</span>
                  </Badge>
                  {selectedPedido.cumpleMinimosFabricacion ? (
                    <Badge variant="outline" className="text-green-600 border-green-300">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Compleix mínims
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-600 border-amber-300">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Sota mínims
                    </Badge>
                  )}
                </div>

                {/* Progreso */}
                <div>
                  <Label className="text-sm">Progrés</Label>
                  <Progress value={calcularProgreso(selectedPedido)} className="h-3 mt-2" />
                </div>

                <Separator />

                {/* Fechas */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Creat:</span>
                    <p className="font-medium">{format(selectedPedido.fechaCreacion, 'dd/MM/yyyy', { locale: ca })}</p>
                  </div>
                  {selectedPedido.fechaEnvioProveedor && (
                    <div>
                      <span className="text-muted-foreground">Enviat:</span>
                      <p className="font-medium">{format(selectedPedido.fechaEnvioProveedor, 'dd/MM/yyyy', { locale: ca })}</p>
                    </div>
                  )}
                  {selectedPedido.fechaConfirmacion && (
                    <div>
                      <span className="text-muted-foreground">Confirmat:</span>
                      <p className="font-medium">{format(selectedPedido.fechaConfirmacion, 'dd/MM/yyyy', { locale: ca })}</p>
                    </div>
                  )}
                  {selectedPedido.fechaEntregaEstimada && (
                    <div>
                      <span className="text-muted-foreground">Entrega estimada:</span>
                      <p className="font-medium">{format(selectedPedido.fechaEntregaEstimada, 'dd/MM/yyyy', { locale: ca })}</p>
                    </div>
                  )}
                  {selectedPedido.fechaRecepcion && (
                    <div>
                      <span className="text-muted-foreground">Rebut:</span>
                      <p className="font-medium text-green-600">{format(selectedPedido.fechaRecepcion, 'dd/MM/yyyy', { locale: ca })}</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Líneas */}
                <div className="space-y-3">
                  <Label>Productes</Label>
                  {selectedPedido.lineas.map(linea => (
                    <Card key={linea.id} className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{linea.nombre}</p>
                          <p className="text-xs text-muted-foreground">{linea.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{linea.cantidadTotal} ud.</p>
                          <div className="flex items-center gap-1 text-xs">
                            {linea.cumpleMinimoFabricacion ? (
                              <span className="text-green-600">✓ Mínim OK</span>
                            ) : (
                              <span className="text-amber-600">
                                ⚠ Mínim: {linea.cantidadMinimaFabricacion}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Progreso de recepción */}
                      {linea.cantidadRecibida > 0 && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Rebut</span>
                            <span>{linea.cantidadRecibida}/{linea.cantidadTotal}</span>
                          </div>
                          <Progress 
                            value={(linea.cantidadRecibida / linea.cantidadTotal) * 100} 
                            className="h-1.5"
                          />
                        </div>
                      )}

                      {/* Desglose por operador */}
                      <div className="mt-3 pt-2 border-t">
                        <p className="text-xs text-muted-foreground mb-1">Desglosat per operador:</p>
                        {linea.desgloseSolicitudes.map(d => (
                          <div key={d.solicitudId} className="flex justify-between text-xs">
                            <span className="truncate max-w-[200px]">{d.operadorNombre}</span>
                            <span className="font-medium">{d.cantidad} ud.</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Económico */}
                {selectedPedido.importeTotal && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Resum Econòmic</Label>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between">
                          <span>Import total:</span>
                          <span className="font-bold">{selectedPedido.importeTotal.toLocaleString('ca-ES')} €</span>
                        </div>
                        {selectedPedido.ahorroEstimadoEscala && (
                          <div className="flex justify-between text-green-600">
                            <span>Estalvi per volum:</span>
                            <span className="font-medium">-{selectedPedido.ahorroEstimadoEscala}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Notas */}
                {selectedPedido.notas && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        {selectedPedido.notas}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
