'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExportButtons } from '@/components/export-buttons';
import type { ExportColumn } from '@/lib/export-utils';
import { 
  PlusCircle, 
  FileText, 
  Truck, 
  Clock, 
  CheckCircle, 
  Package,
  AlertTriangle,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  Eye,
  Trash2,
  Plus,
  PackageCheck,
  ClipboardList,
  Check,
  X
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockPedidosC5, equiposPrincipalesC5, mockNumeroSeriesC5 } from '@/lib/contrato-c5-data';
import { CONTRATO_C5_CONFIG } from '@/lib/contrato-c5-types';
import { calcularComponentesKit, verificarStockParaKits } from '@/lib/contrato-c5-utils';
import { mockOperators } from '@/lib/data';
import type { GrupoEmpresarial } from '@/lib/types';
import { format, differenceInDays, isAfter, isBefore } from 'date-fns';
import { ca } from 'date-fns/locale';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from '@/hooks/use-toast';

// Agrupar operadores por grupo empresarial
const operadoresPorGrupo = mockOperators.reduce((acc, op) => {
  const grupo = op.grupo || 'Independiente';
  if (!acc[grupo]) acc[grupo] = [];
  acc[grupo].push(op);
  return acc;
}, {} as Record<GrupoEmpresarial | string, typeof mockOperators>);

const gruposOrdenados = Object.keys(operadoresPorGrupo).sort((a, b) => {
  if (a === 'Independiente') return -1;
  if (b === 'Independiente') return 1;
  return a.localeCompare(b);
});

const estadoPedidoBadge = (estado: string) => {
  const config: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'destructive', label: string }> = {
    borrador: { variant: 'outline', label: 'Esborrany' },
    confirmado: { variant: 'secondary', label: 'Confirmat' },
    en_preparacion: { variant: 'secondary', label: 'En Preparació' },
    enviado: { variant: 'default', label: 'Enviat' },
    entregado: { variant: 'default', label: 'Lliurat' },
    entregado_parcial: { variant: 'outline', label: 'Lliurament Parcial' },
  };
  const c = config[estado] || { variant: 'outline', label: estado };
  return <Badge variant={c.variant}>{c.label}</Badge>;
};

// Columnas para exportación de pedidos
const columnasPedidos: ExportColumn[] = [
  { key: 'codigoPedido', header: 'Codi Comanda' },
  { key: 'operadorNombre', header: 'Operador' },
  { key: 'estado', header: 'Estat' },
  { key: 'fechaPedido', header: 'Data Comanda', formatter: (v) => v instanceof Date ? v.toLocaleDateString('ca-ES') : String(v || '-') },
  { key: 'fechaEntregaPrevista', header: 'Entrega Prevista', formatter: (v) => v instanceof Date ? v.toLocaleDateString('ca-ES') : String(v || '-') },
  { key: 'numLineas', header: 'Línies' },
  { key: 'totalUnidades', header: 'Unitats' },
];

// Tipo para estado de reserva local
type EstadoReservaPedido = 'pendiente' | 'reservado' | 'parcial';

export default function PedidosPage() {
  const [expandedPedido, setExpandedPedido] = React.useState<string | null>(null);
  const [isNewPedidoOpen, setIsNewPedidoOpen] = React.useState(false);
  const [selectedOperadorId, setSelectedOperadorId] = React.useState<string>('');
  const [direccionEntrega, setDireccionEntrega] = React.useState('');
  const [lineasPedido, setLineasPedido] = React.useState<Array<{ productoId: string; cantidad: number }>>([]);
  const [reservasPedidos, setReservasPedidos] = React.useState<Record<string, EstadoReservaPedido>>({});
  const [isPickingOpen, setIsPickingOpen] = React.useState(false);
  const [pickingPedidoId, setPickingPedidoId] = React.useState<string | null>(null);
  const [seriesSeleccionadas, setSeriesSeleccionadas] = React.useState<Record<string, string[]>>({});
  const { toast } = useToast();
  
  // Pedidos activos (no entregados completamente)
  const pedidosActivos = mockPedidosC5.filter(p => !['entregado'].includes(p.estado));
  const pedidosEntregados = mockPedidosC5.filter(p => p.estado === 'entregado');
  
  // KPIs
  const pedidosEnPlazo = mockPedidosC5.filter(p => {
    if (p.estado !== 'entregado' || !p.fechaEntregaReal || !p.fechaEntregaLimite) return false;
    return isBefore(p.fechaEntregaReal, p.fechaEntregaLimite) || p.fechaEntregaReal.getTime() === p.fechaEntregaLimite.getTime();
  }).length;
  
  const pedidosFueraPlazo = mockPedidosC5.filter(p => {
    if (!p.fechaEntregaLimite) return false;
    if (p.estado === 'entregado' && p.fechaEntregaReal) {
      return isAfter(p.fechaEntregaReal, p.fechaEntregaLimite);
    }
    // Si no está entregado y ya pasó la fecha límite
    return p.estado !== 'entregado' && isBefore(p.fechaEntregaLimite, new Date());
  }).length;

  // Calcular días restantes para entrega
  const getDiasRestantes = (fechaLimite?: Date) => {
    if (!fechaLimite) return null;
    return differenceInDays(fechaLimite, new Date());
  };

  // Verificar si hay stock para un pedido (stock disponible vs cantidad pendiente)
  const verificarStockPedido = (pedidoId: string) => {
    const pedido = mockPedidosC5.find(p => p.id === pedidoId);
    if (!pedido) return { suficiente: true, faltantes: [], seriesDisponibles: {} };
    
    const faltantes: { productoId: string; nombre: string; requerido: number; disponible: number }[] = [];
    const seriesDisponibles: Record<string, typeof mockNumeroSeriesC5> = {};
    
    for (const linea of pedido.lineas) {
      const pendiente = linea.cantidadPedida - linea.cantidadEntregada;
      if (pendiente <= 0) continue;
      
      // Obtener series disponibles para este producto
      const seriesProducto = mockNumeroSeriesC5.filter(
        s => s.productoId === linea.productoId && s.estado === 'disponible' && s.ubicacion === 'almacen_sermetra'
      );
      seriesDisponibles[linea.productoId] = seriesProducto;
      
      if (seriesProducto.length < pendiente) {
        const producto = equiposPrincipalesC5.find(p => p.id === linea.productoId);
        faltantes.push({
          productoId: linea.productoId,
          nombre: producto?.nombre || linea.nombre,
          requerido: pendiente,
          disponible: seriesProducto.length
        });
      }
    }
    
    return { 
      suficiente: faltantes.length === 0, 
      faltantes,
      seriesDisponibles 
    };
  };

  // Obtener series disponibles para un producto
  const getSeriesDisponibles = (productoId: string) => {
    return mockNumeroSeriesC5.filter(
      s => s.productoId === productoId && s.estado === 'disponible' && s.ubicacion === 'almacen_sermetra'
    );
  };

  // Manejar reserva de stock para un pedido
  const handleReservarStock = (pedidoId: string) => {
    const stockCheck = verificarStockPedido(pedidoId);
    
    if (!stockCheck.suficiente) {
      // Mostrar alerta de stock insuficiente
      toast({
        title: "Stock insuficient",
        description: `Falten unitats per a: ${stockCheck.faltantes.map(f => `${f.nombre} (${f.disponible}/${f.requerido})`).join(', ')}`,
        variant: "destructive",
      });
      // Marcar como reserva parcial si hay algo disponible
      const tieneAlgo = stockCheck.faltantes.some(f => f.disponible > 0);
      setReservasPedidos(prev => ({ ...prev, [pedidoId]: tieneAlgo ? 'parcial' : 'pendiente' }));
      return;
    }
    
    // Reservar todo el stock
    setReservasPedidos(prev => ({ ...prev, [pedidoId]: 'reservado' }));
    toast({
      title: "Stock reservat",
      description: "S'ha reservat l'stock per a aquesta comanda",
    });
  };

  // Abrir vista de picking
  const handleOpenPicking = (pedidoId: string) => {
    setPickingPedidoId(pedidoId);
    setIsPickingOpen(true);
    // Inicializar series seleccionadas vacías
    const pedido = mockPedidosC5.find(p => p.id === pedidoId);
    if (pedido) {
      const initial: Record<string, string[]> = {};
      pedido.lineas.forEach(l => { initial[l.productoId] = []; });
      setSeriesSeleccionadas(initial);
    }
  };

  // Toggle selección de serie
  const handleToggleSerie = (productoId: string, serieId: string, maxCantidad: number) => {
    setSeriesSeleccionadas(prev => {
      const current = prev[productoId] || [];
      if (current.includes(serieId)) {
        return { ...prev, [productoId]: current.filter(id => id !== serieId) };
      } else {
        // No permitir seleccionar más del máximo
        if (current.length >= maxCantidad) {
          toast({ title: "Límit assolit", description: `Ja has seleccionat ${maxCantidad} unitats`, variant: "destructive" });
          return prev;
        }
        return { ...prev, [productoId]: [...current, serieId] };
      }
    });
  };

  // Confirmar picking
  const handleConfirmarPicking = () => {
    const pedido = mockPedidosC5.find(p => p.id === pickingPedidoId);
    if (!pedido) return;
    
    // Verificar que todas las líneas tienen series seleccionadas
    let todasCompletas = true;
    for (const linea of pedido.lineas) {
      const pendiente = linea.cantidadPedida - linea.cantidadEntregada;
      const seleccionadas = seriesSeleccionadas[linea.productoId]?.length || 0;
      if (seleccionadas < pendiente) {
        todasCompletas = false;
        break;
      }
    }
    
    if (!todasCompletas) {
      toast({
        title: "Picking incomplet",
        description: "Selecciona totes les sèries necessàries per a cada línia",
        variant: "destructive",
      });
      return;
    }
    
    // Simular confirmación de picking
    setReservasPedidos(prev => ({ ...prev, [pickingPedidoId!]: 'reservado' }));
    toast({
      title: "Picking confirmat",
      description: `S'han assignat ${Object.values(seriesSeleccionadas).flat().length} unitats a la comanda`,
    });
    setIsPickingOpen(false);
    setPickingPedidoId(null);
  };

  // Operador seleccionado
  const operadorSeleccionado = mockOperators.find(op => op.id === selectedOperadorId);

  // Añadir línea al pedido
  const handleAddLinea = () => {
    setLineasPedido([...lineasPedido, { productoId: '', cantidad: 1 }]);
  };

  // Eliminar línea del pedido
  const handleRemoveLinea = (index: number) => {
    setLineasPedido(lineasPedido.filter((_, i) => i !== index));
  };

  // Actualizar línea
  const handleUpdateLinea = (index: number, field: 'productoId' | 'cantidad', value: string | number) => {
    const newLineas = [...lineasPedido];
    newLineas[index] = { ...newLineas[index], [field]: value };
    setLineasPedido(newLineas);
  };

  // Crear nuevo pedido
  const handleCreatePedido = () => {
    if (!selectedOperadorId) {
      toast({ title: "Error", description: "Has de seleccionar un operador", variant: "destructive" });
      return;
    }
    if (lineasPedido.length === 0 || lineasPedido.some(l => !l.productoId || l.cantidad <= 0)) {
      toast({ title: "Error", description: "Has d'afegir almenys una línia de producte vàlida", variant: "destructive" });
      return;
    }

    // Simular creación (en producción, esto iría a Firestore)
    const nuevoCodigo = `PED-C5-2025-${String(mockPedidosC5.length + 1).padStart(4, '0')}`;
    toast({
      title: "Comanda creada",
      description: `S'ha creat la comanda ${nuevoCodigo} com a esborrany`,
    });

    // Reset form
    setSelectedOperadorId('');
    setDireccionEntrega('');
    setLineasPedido([]);
    setIsNewPedidoOpen(false);
  };

  // Reset form al cerrar
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setSelectedOperadorId('');
      setDireccionEntrega('');
      setLineasPedido([]);
    }
    setIsNewPedidoOpen(open);
  };

  // Datos para exportación
  const datosExportacionPedidos = mockPedidosC5.map(p => ({
    ...p,
    codigoPedido: p.codigo,
    numLineas: p.lineas.length,
    totalUnidades: p.lineas.reduce((sum, l) => sum + l.cantidadPedida, 0),
  }));

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Comandes i Entregues</h1>
          <p className="text-muted-foreground">
            Gestió de comandes d'operadors - Termini màx. {CONTRATO_C5_CONFIG.plazoMaximoEntregaMeses} mesos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButtons
            filename="comandes-c5"
            title="Comandes i Entregues C-5/2025"
            columns={columnasPedidos}
            data={datosExportacionPedidos}
          />
          <Dialog open={isNewPedidoOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Comanda
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Comanda</DialogTitle>
              <DialogDescription>
                Crea una nova comanda per a un operador. Es crearà com a esborrany.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Selector de Operador */}
              <div className="space-y-2">
                <Label>Operador *</Label>
                <Select value={selectedOperadorId} onValueChange={setSelectedOperadorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un operador..." />
                  </SelectTrigger>
                  <SelectContent>
                    {gruposOrdenados.map((grupo) => (
                      <SelectGroup key={grupo}>
                        <SelectLabel className="text-xs uppercase text-muted-foreground">
                          {grupo}
                        </SelectLabel>
                        {operadoresPorGrupo[grupo].map((op) => (
                          <SelectItem key={op.id} value={op.id}>
                            <span className="flex items-center gap-2">
                              <span>{op.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {op.vehiculosContrato} vehicles
                              </Badge>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
                {operadorSeleccionado && (
                  <p className="text-sm text-muted-foreground">
                    Grup: {operadorSeleccionado.grupo} · {operadorSeleccionado.vehiculosContrato} vehicles al contracte
                  </p>
                )}
              </div>

              {/* Dirección de entrega */}
              <div className="space-y-2">
                <Label>Adreça d'entrega</Label>
                <Textarea
                  value={direccionEntrega}
                  onChange={(e) => setDireccionEntrega(e.target.value)}
                  placeholder="Adreça de la cotxera o punt d'entrega..."
                  rows={2}
                />
              </div>

              {/* Líneas de pedido */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Línies de la comanda *</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddLinea}>
                    <Plus className="mr-1 h-3 w-3" />
                    Afegir línia
                  </Button>
                </div>
                
                {lineasPedido.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground border rounded-lg">
                    Fes clic a "Afegir línia" per començar
                  </div>
                ) : (
                  <div className="space-y-2">
                    {lineasPedido.map((linea, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <Select 
                          value={linea.productoId} 
                          onValueChange={(v) => handleUpdateLinea(index, 'productoId', v)}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Selecciona producte..." />
                          </SelectTrigger>
                          <SelectContent>
                            {equiposPrincipalesC5.map((prod) => (
                              <SelectItem key={prod.id} value={prod.id}>
                                <span className="flex items-center gap-2">
                                  <span className="font-mono text-xs">{prod.sku}</span>
                                  <span>{prod.nombre}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          min={1}
                          value={linea.cantidad}
                          onChange={(e) => handleUpdateLinea(index, 'cantidad', parseInt(e.target.value) || 1)}
                          className="w-24"
                          placeholder="Qty"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveLinea(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleDialogChange(false)}>
                Cancel·lar
              </Button>
              <Button onClick={handleCreatePedido}>
                Crear Esborrany
              </Button>
            </DialogFooter>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comandes Actives</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pedidosActivos.length}</div>
            <p className="text-xs text-muted-foreground">pendents d'entrega</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Preparació</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockPedidosC5.filter(p => p.estado === 'en_preparacion').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-green-50 dark:bg-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lliurats en Termini</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{pedidosEnPlazo}</div>
          </CardContent>
        </Card>

        <Card className={pedidosFueraPlazo > 0 ? 'border-destructive/50 bg-destructive/5' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fora de Termini</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${pedidosFueraPlazo > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${pedidosFueraPlazo > 0 ? 'text-destructive' : ''}`}>
              {pedidosFueraPlazo}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activos">
        <TabsList>
          <TabsTrigger value="activos">
            <Truck className="mr-2 h-4 w-4" />
            Actives ({pedidosActivos.length})
          </TabsTrigger>
          <TabsTrigger value="entregados">
            <CheckCircle className="mr-2 h-4 w-4" />
            Lliurades ({pedidosEntregados.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activos">
          <Card>
            <CardHeader>
              <CardTitle>Comandes Actives</CardTitle>
              <CardDescription>Comandes pendents de lliurament complet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pedidosActivos.map((pedido) => {
                const diasRestantes = getDiasRestantes(pedido.fechaEntregaLimite);
                const isExpanded = expandedPedido === pedido.id;
                const stockCheck = verificarStockPedido(pedido.id);
                const totalPedido = pedido.lineas.reduce((acc, l) => acc + l.cantidadPedida, 0);
                const totalEntregado = pedido.lineas.reduce((acc, l) => acc + l.cantidadEntregada, 0);
                const progreso = totalPedido > 0 ? (totalEntregado / totalPedido) * 100 : 0;
                
                return (
                  <Collapsible 
                    key={pedido.id}
                    open={isExpanded}
                    onOpenChange={() => setExpandedPedido(isExpanded ? null : pedido.id)}
                  >
                    <div className={`rounded-lg border p-4 ${diasRestantes !== null && diasRestantes < 7 ? 'border-orange-300 bg-orange-50/50 dark:bg-orange-950/20' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{pedido.codigo}</span>
                              {estadoPedidoBadge(pedido.estado)}
                              {!stockCheck.suficiente && (
                                <Badge variant="destructive" className="gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  Falta estoc
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {pedido.operadorNombre}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          {/* Progreso */}
                          <div className="text-right">
                            <div className="text-sm font-medium">{totalEntregado}/{totalPedido} uds</div>
                            <Progress value={progreso} className="h-2 w-24" />
                          </div>
                          
                          {/* Fecha límite */}
                          {pedido.fechaEntregaLimite && (
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-sm">
                                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                                {format(pedido.fechaEntregaLimite, 'dd/MM/yyyy', { locale: ca })}
                              </div>
                              {diasRestantes !== null && (
                                <div className={`text-xs ${diasRestantes < 7 ? 'text-orange-600 font-medium' : 'text-muted-foreground'}`}>
                                  {diasRestantes > 0 ? `${diasRestantes} dies restants` : diasRestantes === 0 ? 'Avui!' : 'Fora de termini!'}
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm">
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                        </div>
                      </div>
                      
                      <CollapsibleContent className="mt-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>SKU</TableHead>
                              <TableHead>Producte</TableHead>
                              <TableHead className="text-right">Demanat</TableHead>
                              <TableHead className="text-right">Lliurat</TableHead>
                              <TableHead className="text-right">Pendent</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pedido.lineas.map((linea) => (
                              <TableRow key={linea.id}>
                                <TableCell className="font-mono text-sm">{linea.sku}</TableCell>
                                <TableCell>{linea.nombre}</TableCell>
                                <TableCell className="text-right">{linea.cantidadPedida}</TableCell>
                                <TableCell className="text-right text-green-600">{linea.cantidadEntregada}</TableCell>
                                <TableCell className="text-right font-medium">
                                  {linea.cantidadPedida - linea.cantidadEntregada}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        
                        {/* Alerta de stock insuficiente */}
                        {!stockCheck.suficiente && (
                          <Alert variant="destructive" className="mt-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Stock insuficient</AlertTitle>
                            <AlertDescription>
                              <ul className="mt-2 list-disc list-inside space-y-1">
                                {stockCheck.faltantes.map((f) => (
                                  <li key={f.productoId}>
                                    {f.nombre}: disponible {f.disponible} de {f.requerido} requerits
                                  </li>
                                ))}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        {pedido.direccionEntrega && (
                          <div className="mt-4 text-sm">
                            <span className="font-medium">Adreça d'entrega:</span>{' '}
                            <span className="text-muted-foreground">{pedido.direccionEntrega}</span>
                          </div>
                        )}
                        
                        {/* Estado de reserva */}
                        {reservasPedidos[pedido.id] && (
                          <div className="mt-4">
                            <Badge 
                              variant={reservasPedidos[pedido.id] === 'reservado' ? 'default' : 'secondary'}
                              className="gap-1"
                            >
                              {reservasPedidos[pedido.id] === 'reservado' ? (
                                <><CheckCircle className="h-3 w-3" /> Stock reservat</>
                              ) : reservasPedidos[pedido.id] === 'parcial' ? (
                                <><AlertTriangle className="h-3 w-3" /> Reserva parcial</>
                              ) : (
                                <><Clock className="h-3 w-3" /> Pendent de reserva</>
                              )}
                            </Badge>
                          </div>
                        )}
                        
                        <div className="mt-4 flex gap-2 flex-wrap">
                          {/* Botón Reservar */}
                          {!reservasPedidos[pedido.id] || reservasPedidos[pedido.id] !== 'reservado' ? (
                            <Button 
                              size="sm" 
                              variant={stockCheck.suficiente ? 'default' : 'outline'}
                              onClick={() => handleReservarStock(pedido.id)}
                            >
                              <PackageCheck className="mr-2 h-4 w-4" />
                              Reservar Stock
                            </Button>
                          ) : null}
                          
                          {/* Botón Picking - solo si está reservado o parcial */}
                          {(reservasPedidos[pedido.id] === 'reservado' || reservasPedidos[pedido.id] === 'parcial') && (
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => handleOpenPicking(pedido.id)}
                            >
                              <ClipboardList className="mr-2 h-4 w-4" />
                              Picking / Assignar Sèries
                            </Button>
                          )}
                          
                          <Button size="sm" variant="outline">
                            <Truck className="mr-2 h-4 w-4" />
                            Registrar Entrega
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Albarà
                          </Button>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entregados">
          <Card>
            <CardHeader>
              <CardTitle>Comandes Lliurades</CardTitle>
              <CardDescription>Històric de lliuraments completats</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Codi</TableHead>
                    <TableHead>Operador</TableHead>
                    <TableHead>Unitats</TableHead>
                    <TableHead>Data Lliurament</TableHead>
                    <TableHead>Termini</TableHead>
                    <TableHead>Estat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pedidosEntregados.map((pedido) => {
                    const totalPedido = pedido.lineas.reduce((acc, l) => acc + l.cantidadPedida, 0);
                    const enPlazo = pedido.fechaEntregaReal && pedido.fechaEntregaLimite 
                      ? isBefore(pedido.fechaEntregaReal, pedido.fechaEntregaLimite) || pedido.fechaEntregaReal.getTime() === pedido.fechaEntregaLimite.getTime()
                      : true;
                    
                    return (
                      <TableRow key={pedido.id}>
                        <TableCell className="font-medium">{pedido.codigo}</TableCell>
                        <TableCell>{pedido.operadorNombre.split(',')[0]}</TableCell>
                        <TableCell>{totalPedido}</TableCell>
                        <TableCell>
                          {pedido.fechaEntregaReal 
                            ? format(pedido.fechaEntregaReal, 'dd/MM/yyyy', { locale: ca })
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {pedido.fechaEntregaLimite 
                            ? format(pedido.fechaEntregaLimite, 'dd/MM/yyyy', { locale: ca })
                            : '-'}
                        </TableCell>
                        <TableCell>
                          {enPlazo ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle className="h-3 w-3" />
                              En termini
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Fora termini
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sheet de Picking */}
      <Sheet open={isPickingOpen} onOpenChange={setIsPickingOpen}>
        <SheetContent className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Picking / Assignació de Sèries</SheetTitle>
            <SheetDescription>
              Selecciona els números de sèrie per a cada línia de la comanda
            </SheetDescription>
          </SheetHeader>
          
          {pickingPedidoId && (() => {
            const pedido = mockPedidosC5.find(p => p.id === pickingPedidoId);
            if (!pedido) return null;
            
            return (
              <div className="mt-6 space-y-6">
                {/* Info del pedido */}
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="font-medium">{pedido.codigo}</div>
                  <div className="text-sm text-muted-foreground">{pedido.operadorNombre}</div>
                </div>
                
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-6 pr-4">
                    {pedido.lineas.map((linea) => {
                      const pendiente = linea.cantidadPedida - linea.cantidadEntregada;
                      if (pendiente <= 0) return null;
                      
                      const seriesDisponibles = getSeriesDisponibles(linea.productoId);
                      const seleccionadas = seriesSeleccionadas[linea.productoId] || [];
                      
                      return (
                        <div key={linea.id} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{linea.nombre}</div>
                              <div className="text-xs text-muted-foreground font-mono">{linea.sku}</div>
                            </div>
                            <Badge variant={seleccionadas.length >= pendiente ? 'default' : 'secondary'}>
                              {seleccionadas.length} / {pendiente}
                            </Badge>
                          </div>
                          
                          {seriesDisponibles.length === 0 ? (
                            <Alert variant="destructive" className="py-2">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                No hi ha sèries disponibles per a aquest producte
                              </AlertDescription>
                            </Alert>
                          ) : (
                            <div className="space-y-2 rounded-lg border p-3">
                              {seriesDisponibles.map((serie) => {
                                const isSelected = seleccionadas.includes(serie.id);
                                return (
                                  <div 
                                    key={serie.id}
                                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                                      isSelected ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted/50'
                                    }`}
                                    onClick={() => handleToggleSerie(linea.productoId, serie.id, pendiente)}
                                  >
                                    <Checkbox 
                                      checked={isSelected}
                                      onCheckedChange={() => handleToggleSerie(linea.productoId, serie.id, pendiente)}
                                    />
                                    <div className="flex-1">
                                      <div className="font-mono text-sm">{serie.numeroSerie}</div>
                                      <div className="text-xs text-muted-foreground">
                                        Lot: {serie.lote}
                                      </div>
                                    </div>
                                    {isSelected && (
                                      <Check className="h-4 w-4 text-primary" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                
                {/* Acciones */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsPickingOpen(false)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel·lar
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleConfirmarPicking}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Confirmar Picking
                  </Button>
                </div>
              </div>
            );
          })()}
        </SheetContent>
      </Sheet>
    </main>
  );
}
