'use client';

import * as React from 'react';
import { format } from 'date-fns';
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
import { Checkbox } from '@/components/ui/checkbox';
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
  SheetFooter,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Package,
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Clock,
  Building2,
  FileStack,
  Send,
  Zap,
  DollarSign,
  Factory,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  mockSolicitudesOperador,
  mockPedidosProveedor,
  mockStockCentral,
  mockKPIsCentralCompras,
  WINFIN_CONFIG,
  calcularCumplimientoMinimos,
  calcularDescuentoVolumen,
} from '@/lib/central-compras-data';
import type {
  SolicitudOperador,
  PedidoProveedor,
} from '@/lib/contrato-c5-types';

export default function CentralComprasPage() {
  const { toast } = useToast();
  
  // Estados
  const [solicitudesAprobadas, setSolicitudesAprobadas] = React.useState<SolicitudOperador[]>(
    mockSolicitudesOperador.filter(s => s.estado === 'aprobada')
  );
  const [solicitudesEnviadas, setSolicitudesEnviadas] = React.useState<SolicitudOperador[]>(
    mockSolicitudesOperador.filter(s => s.estado === 'enviada')
  );
  const [solicitudesSeleccionadas, setSolicitudesSeleccionadas] = React.useState<string[]>([]);
  const [pedidosBorrador, setPedidosBorrador] = React.useState<PedidoProveedor[]>(
    mockPedidosProveedor.filter(p => p.estado === 'borrador')
  );
  
  // Dialogs
  const [isAprobarOpen, setIsAprobarOpen] = React.useState(false);
  const [solicitudAprobar, setSolicitudAprobar] = React.useState<SolicitudOperador | null>(null);
  const [isGenerarPedidoOpen, setIsGenerarPedidoOpen] = React.useState(false);

  // Calcular agregación de solicitudes seleccionadas
  const agregacionSeleccionadas = React.useMemo(() => {
    const solicitudes = [...solicitudesAprobadas, ...solicitudesEnviadas]
      .filter(s => solicitudesSeleccionadas.includes(s.id));
    
    const lineasAgregadas: { productoId: string; cantidad: number }[] = [];
    solicitudes.forEach(sol => {
      sol.lineas.forEach(linea => {
        const existing = lineasAgregadas.find(l => l.productoId === linea.productoId);
        if (existing) {
          existing.cantidad += linea.cantidadSolicitada;
        } else {
          lineasAgregadas.push({ productoId: linea.productoId, cantidad: linea.cantidadSolicitada });
        }
      });
    });
    
    const cumplimiento = calcularCumplimientoMinimos(lineasAgregadas);
    const totalUnidades = lineasAgregadas.reduce((acc, l) => acc + l.cantidad, 0);
    const descuento = calcularDescuentoVolumen(totalUnidades);
    
    return {
      solicitudes,
      lineasAgregadas,
      cumplimiento,
      totalUnidades,
      descuento,
    };
  }, [solicitudesSeleccionadas, solicitudesAprobadas, solicitudesEnviadas]);

  // KPIs
  const kpis = mockKPIsCentralCompras;

  const handleToggleSolicitud = (id: string) => {
    setSolicitudesSeleccionadas(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleAprobarSolicitud = (sol: SolicitudOperador) => {
    setSolicitudAprobar(sol);
    setIsAprobarOpen(true);
  };

  const confirmarAprobacion = () => {
    if (!solicitudAprobar) return;
    
    // Mover de enviadas a aprobadas
    setSolicitudesEnviadas(prev => prev.filter(s => s.id !== solicitudAprobar.id));
    setSolicitudesAprobadas(prev => [
      ...prev,
      { ...solicitudAprobar, estado: 'aprobada', fechaAprobacion: new Date(), aprobadoPor: 'G.S.S. (Jefe de Proyecto)' }
    ]);
    
    toast({
      title: 'Sol·licitud aprovada',
      description: `${solicitudAprobar.codigo} ha estat aprovada i està llesta per agregar.`,
    });
    
    setIsAprobarOpen(false);
    setSolicitudAprobar(null);
  };

  const handleServirDesdeStock = (sol: SolicitudOperador) => {
    // Verificar stock disponible
    const stockOk = sol.lineas.every(linea => {
      const stock = mockStockCentral.find(s => s.productoId === linea.productoId);
      return stock && stock.stockReservadoUrgencias >= linea.cantidadSolicitada;
    });
    
    if (!stockOk) {
      toast({
        variant: 'destructive',
        title: 'Stock insuficient',
        description: 'No hi ha prou stock d\'urgències per servir aquesta sol·licitud.',
      });
      return;
    }
    
    // Simular servir desde stock
    setSolicitudesEnviadas(prev => prev.filter(s => s.id !== sol.id));
    
    toast({
      title: 'Sol·licitud servida',
      description: `${sol.codigo} s'ha servit des de l'stock d'urgències.`,
    });
  };

  const handleGenerarPedidoProveedor = () => {
    if (solicitudesSeleccionadas.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Sense selecció',
        description: 'Has de seleccionar almenys una sol·licitud per generar una comanda.',
      });
      return;
    }
    setIsGenerarPedidoOpen(true);
  };

  const confirmarGenerarPedido = () => {
    const newCodigo = `PED-WINFIN-2025-${String(mockPedidosProveedor.length + 1).padStart(3, '0')}`;
    
    toast({
      title: 'Comanda generada',
      description: `S'ha creat la comanda ${newCodigo} amb ${solicitudesSeleccionadas.length} sol·licituds.`,
    });
    
    // Mover solicitudes a estado 'asignada_pedido'
    setSolicitudesAprobadas(prev =>
      prev.filter(s => !solicitudesSeleccionadas.includes(s.id))
    );
    setSolicitudesSeleccionadas([]);
    setIsGenerarPedidoOpen(false);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Central de Compres</h1>
        <p className="text-muted-foreground">
          Agregació de sol·licituds i gestió de comandes a proveïdors
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pendent Aprovació</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{solicitudesEnviadas.length}</div>
            <p className="text-xs text-muted-foreground">sol·licituds per revisar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Llestes per Agregar</CardTitle>
            <Layers className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{solicitudesAprobadas.length}</div>
            <p className="text-xs text-muted-foreground">aprovades sense comanda</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Urgents Actives</CardTitle>
            <Zap className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{kpis.solicitudesUrgentes}</div>
            <p className="text-xs text-muted-foreground">prioritat alta/crítica</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Estalvi Acumulat</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {kpis.ahorroAcumuladoEscala.toLocaleString('ca-ES')} €
            </div>
            <p className="text-xs text-muted-foreground">per economies d'escala</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pendientes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="pendientes" className="relative">
            Pendents
            {solicitudesEnviadas.length > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-amber-500">
                {solicitudesEnviadas.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="agregar">
            Agregar
            {solicitudesAprobadas.length > 0 && (
              <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-blue-500">
                {solicitudesAprobadas.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="borrador">Esborranys</TabsTrigger>
        </TabsList>

        {/* Tab: Pendientes de Aprobación */}
        <TabsContent value="pendientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Sol·licituds Pendents d'Aprovació
              </CardTitle>
              <CardDescription>
                Revisa i aprova les sol·licituds enviades pels operadors
              </CardDescription>
            </CardHeader>
            <CardContent>
              {solicitudesEnviadas.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No hi ha sol·licituds pendents d'aprovació</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Codi</TableHead>
                      <TableHead>Operador</TableHead>
                      <TableHead>Tipus</TableHead>
                      <TableHead>Productes</TableHead>
                      <TableHead>Data Enviament</TableHead>
                      <TableHead className="text-right">Accions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solicitudesEnviadas.map(sol => (
                      <TableRow key={sol.id} className={sol.tipo === 'urgente' ? 'bg-red-50' : ''}>
                        <TableCell className="font-mono font-medium">
                          {sol.codigo}
                          {sol.tipo === 'urgente' && (
                            <Zap className="inline ml-2 h-4 w-4 text-red-500" />
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="truncate max-w-[200px] block">{sol.operadorNombre}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={sol.tipo === 'urgente' ? 'destructive' : 'secondary'}>
                            {sol.tipo === 'urgente' ? 'Urgent' : sol.tipo === 'incidencia' ? 'Incidència' : 'Normal'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {sol.lineas.map(l => (
                            <div key={l.id} className="text-sm">
                              {l.cantidadSolicitada}x {l.nombre}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {sol.fechaEnvio && format(sol.fechaEnvio, 'dd/MM/yy HH:mm', { locale: ca })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {sol.tipo === 'urgente' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleServirDesdeStock(sol)}
                              >
                                <Zap className="h-4 w-4 mr-1" />
                                Servir Stock
                              </Button>
                            )}
                            <Button
                              size="sm"
                              onClick={() => handleAprobarSolicitud(sol)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Agregar en Pedido */}
        <TabsContent value="agregar" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Lista de solicitudes para agregar */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-blue-500" />
                    Sol·licituds Aprovades
                  </CardTitle>
                  <CardDescription>
                    Selecciona les sol·licituds per agregar en una comanda a WINFIN
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {solicitudesAprobadas.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileStack className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No hi ha sol·licituds aprovades per agregar</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={
                                solicitudesAprobadas.length > 0 &&
                                solicitudesAprobadas.every(s => solicitudesSeleccionadas.includes(s.id))
                              }
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSolicitudesSeleccionadas(solicitudesAprobadas.map(s => s.id));
                                } else {
                                  setSolicitudesSeleccionadas([]);
                                }
                              }}
                            />
                          </TableHead>
                          <TableHead>Codi</TableHead>
                          <TableHead>Operador</TableHead>
                          <TableHead>Productes</TableHead>
                          <TableHead>Total Ud.</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {solicitudesAprobadas.map(sol => {
                          const totalUds = sol.lineas.reduce((acc, l) => acc + l.cantidadSolicitada, 0);
                          return (
                            <TableRow key={sol.id}>
                              <TableCell>
                                <Checkbox
                                  checked={solicitudesSeleccionadas.includes(sol.id)}
                                  onCheckedChange={() => handleToggleSolicitud(sol.id)}
                                />
                              </TableCell>
                              <TableCell className="font-mono font-medium">{sol.codigo}</TableCell>
                              <TableCell>
                                <span className="truncate max-w-[150px] block text-sm">
                                  {sol.operadorNombre}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  {sol.lineas.map(l => (
                                    <Badge key={l.id} variant="outline" className="mr-1">
                                      {l.cantidadSolicitada}x {l.nombre.split(' ')[0]}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">{totalUds}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={solicitudesSeleccionadas.length === 0}
                    onClick={handleGenerarPedidoProveedor}
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Generar Comanda a WINFIN ({solicitudesSeleccionadas.length} sol·licituds)
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Panel de Agregación */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Factory className="h-4 w-4" />
                    Anàlisi d'Agregació
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {solicitudesSeleccionadas.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Selecciona sol·licituds per veure l'anàlisi
                    </p>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Sol·licituds seleccionades:</span>
                          <span className="font-bold">{agregacionSeleccionadas.solicitudes.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total unitats:</span>
                          <span className="font-bold">{agregacionSeleccionadas.totalUnidades}</span>
                        </div>
                      </div>

                      <Separator />

                      {/* Cumplimiento de mínimos */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Mínims de Fabricació WINFIN:</p>
                        {agregacionSeleccionadas.cumplimiento.detalle.map(item => {
                          const producto = mockStockCentral.find(s => s.productoId === item.productoId);
                          return (
                            <div key={item.productoId} className="flex items-center justify-between text-sm">
                              <span className="truncate max-w-[120px]">{producto?.productoNombre || item.productoId}</span>
                              <div className="flex items-center gap-2">
                                <span className={item.cumple ? 'text-green-600' : 'text-red-600'}>
                                  {item.cantidad}/{item.minimo}
                                </span>
                                {item.cumple ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <Separator />

                      {/* Descuento */}
                      <div className="p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-800">Descompte per volum:</span>
                          <span className="text-lg font-bold text-green-600">
                            {agregacionSeleccionadas.descuento}%
                          </span>
                        </div>
                        {agregacionSeleccionadas.descuento === 0 && (
                          <p className="text-xs text-green-700 mt-1">
                            Necessites 50+ unitats per obtenir descompte
                          </p>
                        )}
                      </div>

                      {/* Alerta si no cumple mínimos */}
                      {!agregacionSeleccionadas.cumplimiento.cumple && (
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>No compleix mínims</AlertTitle>
                          <AlertDescription className="text-xs">
                            Alguns productes no arriben al mínim de fabricació. 
                            Pots esperar més sol·licituds o forçar la comanda.
                          </AlertDescription>
                        </Alert>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Info WINFIN */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Condicions WINFIN</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lead time:</span>
                    <span>{WINFIN_CONFIG.leadTimeDias} dies</span>
                  </div>
                  <Separator />
                  <p className="text-xs text-muted-foreground">Mínims producció:</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Antena Tribanda:</span>
                      <span className="font-medium">{WINFIN_CONFIG.minimosProduccion['EP-001']} ud.</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Switch Ethernet:</span>
                      <span className="font-medium">{WINFIN_CONFIG.minimosProduccion['EP-002']} ud.</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kit Integral:</span>
                      <span className="font-medium">{WINFIN_CONFIG.minimosProduccion['EP-003']} ud.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Borradores de Pedidos */}
        <TabsContent value="borrador" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileStack className="h-5 w-5" />
                Esborranys de Comandes
              </CardTitle>
              <CardDescription>
                Comandes en preparació pendents d'enviar a WINFIN
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pedidosBorrador.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hi ha esborranys de comandes</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pedidosBorrador.map(pedido => (
                    <Card key={pedido.id} className="border-dashed">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-mono">{pedido.codigo}</CardTitle>
                          <Badge variant="outline">Esborrany</Badge>
                        </div>
                        <CardDescription>
                          {pedido.solicitudesIncluidas.length} sol·licituds · {pedido.totalUnidades} unitats
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2">
                          {pedido.lineas.map(linea => (
                            <div key={linea.id} className="flex items-center justify-between text-sm">
                              <span>{linea.nombre}</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{linea.cantidadTotal} ud.</span>
                                {linea.cumpleMinimoFabricacion ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {!pedido.cumpleMinimosFabricacion && (
                          <Alert className="mt-4" variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              No compleix tots els mínims de fabricació
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                      <CardFooter className="gap-2">
                        <Button variant="outline" className="flex-1">
                          Editar
                        </Button>
                        <Button className="flex-1" disabled={!pedido.cumpleMinimosFabricacion}>
                          <Send className="h-4 w-4 mr-1" />
                          Enviar a WINFIN
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Aprobar */}
      <Dialog open={isAprobarOpen} onOpenChange={setIsAprobarOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Sol·licitud</DialogTitle>
            <DialogDescription>
              Confirma l'aprovació de la sol·licitud {solicitudAprobar?.codigo}
            </DialogDescription>
          </DialogHeader>
          {solicitudAprobar && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{solicitudAprobar.operadorNombre}</p>
                <p className="text-sm text-muted-foreground">{solicitudAprobar.justificacion}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Productes sol·licitats:</p>
                {solicitudAprobar.lineas.map(l => (
                  <div key={l.id} className="flex justify-between text-sm">
                    <span>{l.nombre}</span>
                    <span className="font-medium">{l.cantidadSolicitada} ud.</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAprobarOpen(false)}>
              Cancel·lar
            </Button>
            <Button onClick={confirmarAprobacion}>
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Aprovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Generar Pedido */}
      <Dialog open={isGenerarPedidoOpen} onOpenChange={setIsGenerarPedidoOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Generar Comanda a WINFIN</DialogTitle>
            <DialogDescription>
              Es crearà una comanda amb les sol·licituds seleccionades
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Resum de la comanda</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• {agregacionSeleccionadas.solicitudes.length} sol·licituds</li>
                  <li>• {agregacionSeleccionadas.totalUnidades} unitats totals</li>
                  <li>• Descompte estimat: {agregacionSeleccionadas.descuento}%</li>
                </ul>
              </AlertDescription>
            </Alert>
            
            {!agregacionSeleccionadas.cumplimiento.cumple && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Atenció</AlertTitle>
                <AlertDescription>
                  Alguns productes no compleixen el mínim de fabricació. 
                  WINFIN podria rebutjar la comanda o aplicar sobrecost.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerarPedidoOpen(false)}>
              Cancel·lar
            </Button>
            <Button onClick={confirmarGenerarPedido}>
              <Package className="h-4 w-4 mr-1" />
              Generar Comanda
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
