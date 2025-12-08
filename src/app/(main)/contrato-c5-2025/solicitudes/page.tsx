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
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  Plus,
  Send,
  Eye,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Package,
  Truck,
  Search,
  Filter,
  Building2,
  Bus,
  Zap,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  mockSolicitudesOperador,
  operadoresC5,
} from '@/lib/central-compras-data';
import { equiposPrincipalesC5 } from '@/lib/contrato-c5-data';
import type {
  SolicitudOperador,
  EstadoSolicitudOperador,
  TipoSolicitudOperador,
  LineaSolicitudOperador,
} from '@/lib/contrato-c5-types';

// Helpers para estados
const estadoConfig: Record<EstadoSolicitudOperador, { label: string; color: string; icon: React.ReactNode }> = {
  borrador: { label: 'Esborrany', color: 'bg-slate-100 text-slate-700', icon: <FileText className="h-3 w-3" /> },
  enviada: { label: 'Enviada', color: 'bg-blue-100 text-blue-700', icon: <Send className="h-3 w-3" /> },
  aprobada: { label: 'Aprovada', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="h-3 w-3" /> },
  rechazada: { label: 'Rebutjada', color: 'bg-red-100 text-red-700', icon: <XCircle className="h-3 w-3" /> },
  asignada_pedido: { label: 'En Comanda', color: 'bg-purple-100 text-purple-700', icon: <Package className="h-3 w-3" /> },
  en_transito: { label: 'En Trànsit', color: 'bg-amber-100 text-amber-700', icon: <Truck className="h-3 w-3" /> },
  entregada: { label: 'Entregada', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="h-3 w-3" /> },
  servida_stock: { label: 'Servida (Stock)', color: 'bg-teal-100 text-teal-700', icon: <Zap className="h-3 w-3" /> },
};

const tipoConfig: Record<TipoSolicitudOperador, { label: string; color: string }> = {
  normal: { label: 'Normal', color: 'bg-slate-100 text-slate-700' },
  urgente: { label: 'Urgent', color: 'bg-orange-100 text-orange-700' },
  incidencia: { label: 'Incidència', color: 'bg-red-100 text-red-700' },
};

const prioridadConfig: Record<string, { label: string; color: string }> = {
  baja: { label: 'Baixa', color: 'text-slate-500' },
  media: { label: 'Mitjana', color: 'text-blue-600' },
  alta: { label: 'Alta', color: 'text-orange-600' },
  critica: { label: 'Crítica', color: 'text-red-600 font-bold' },
};

export default function SolicitudesPage() {
  const { toast } = useToast();
  // Solo mostramos solicitudes pendientes de aprobar (enviada) y rechazadas
  const [solicitudes, setSolicitudes] = React.useState<SolicitudOperador[]>(
    mockSolicitudesOperador.filter(s => s.estado === 'enviada' || s.estado === 'rechazada')
  );
  const [filtroEstado, setFiltroEstado] = React.useState<string>('todas');
  const [filtroOperador, setFiltroOperador] = React.useState<string>('todos');
  const [busqueda, setBusqueda] = React.useState('');
  
  // Detalle
  const [selectedSolicitud, setSelectedSolicitud] = React.useState<SolicitudOperador | null>(null);
  const [isDetalleOpen, setIsDetalleOpen] = React.useState(false);
  
  // Aprobar/Rechazar
  const [isAprobarOpen, setIsAprobarOpen] = React.useState(false);
  const [isRechazarOpen, setIsRechazarOpen] = React.useState(false);
  const [solicitudAccion, setSolicitudAccion] = React.useState<SolicitudOperador | null>(null);
  const [motivoRechazo, setMotivoRechazo] = React.useState('');
  
  // Nueva solicitud
  const [isNuevaOpen, setIsNuevaOpen] = React.useState(false);
  const [nuevaSolicitud, setNuevaSolicitud] = React.useState({
    operadorId: '',
    tipo: 'normal' as TipoSolicitudOperador,
    prioridad: 'media' as 'baja' | 'media' | 'alta' | 'critica',
    motivo: 'nueva_flota' as 'nueva_flota' | 'sustitucion' | 'ampliacion' | 'incidencia',
    justificacion: '',
    lineas: [] as { productoId: string; cantidad: number }[],
  });

  // Filtrado
  const solicitudesFiltradas = React.useMemo(() => {
    return solicitudes.filter(sol => {
      if (filtroEstado !== 'todas' && sol.estado !== filtroEstado) return false;
      if (filtroOperador !== 'todos' && sol.operadorId !== filtroOperador) return false;
      if (busqueda) {
        const term = busqueda.toLowerCase();
        return (
          sol.codigo.toLowerCase().includes(term) ||
          sol.operadorNombre.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [solicitudes, filtroEstado, filtroOperador, busqueda]);

  // Stats - Solo para solicitudes pendientes y rechazadas
  const stats = React.useMemo(() => {
    return {
      total: solicitudes.length,
      pendientes: solicitudes.filter(s => s.estado === 'enviada').length,
      urgentes: solicitudes.filter(s => s.tipo === 'urgente' && s.estado === 'enviada').length,
      rechazadas: solicitudes.filter(s => s.estado === 'rechazada').length,
    };
  }, [solicitudes]);

  const handleVerDetalle = (sol: SolicitudOperador) => {
    setSelectedSolicitud(sol);
    setIsDetalleOpen(true);
  };

  const handleEnviarSolicitud = (sol: SolicitudOperador) => {
    setSolicitudes(prev =>
      prev.map(s =>
        s.id === sol.id
          ? { ...s, estado: 'enviada' as EstadoSolicitudOperador, fechaEnvio: new Date() }
          : s
      )
    );
    toast({
      title: 'Sol·licitud enviada',
      description: `La sol·licitud ${sol.codigo} s'ha enviat a la Central de Compres.`,
    });
  };

  const handleAprobar = (sol: SolicitudOperador) => {
    setSolicitudAccion(sol);
    setIsAprobarOpen(true);
  };

  const handleRechazar = (sol: SolicitudOperador) => {
    setSolicitudAccion(sol);
    setMotivoRechazo('');
    setIsRechazarOpen(true);
  };

  const confirmarAprobacion = () => {
    if (!solicitudAccion) return;
    
    setSolicitudes(prev =>
      prev.map(s =>
        s.id === solicitudAccion.id
          ? { 
              ...s, 
              estado: 'aprobada' as EstadoSolicitudOperador, 
              fechaAprobacion: new Date(),
              aprobadoPor: 'G.S.S. (Jefe de Proyecto)',
              lineas: s.lineas.map(l => ({ ...l, cantidadAprobada: l.cantidadSolicitada }))
            }
          : s
      )
    );
    
    toast({
      title: 'Sol·licitud aprovada',
      description: `${solicitudAccion.codigo} ha estat aprovada i passarà a la Central de Compres.`,
    });
    
    setIsAprobarOpen(false);
    setSolicitudAccion(null);
  };

  const confirmarRechazo = () => {
    if (!solicitudAccion) return;
    
    setSolicitudes(prev =>
      prev.map(s =>
        s.id === solicitudAccion.id
          ? { 
              ...s, 
              estado: 'rechazada' as EstadoSolicitudOperador,
              notas: motivoRechazo ? `Rebutjada: ${motivoRechazo}` : 'Rebutjada sense motiu especificat'
            }
          : s
      )
    );
    
    toast({
      title: 'Sol·licitud rebutjada',
      description: `${solicitudAccion.codigo} ha estat rebutjada.`,
      variant: 'destructive',
    });
    
    setIsRechazarOpen(false);
    setSolicitudAccion(null);
    setMotivoRechazo('');
  };

  const handleCrearSolicitud = () => {
    if (!nuevaSolicitud.operadorId || nuevaSolicitud.lineas.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Has de seleccionar un operador i afegir almenys una línia.',
      });
      return;
    }

    const operador = operadoresC5.find(o => o.id === nuevaSolicitud.operadorId);
    const newId = `sol-${String(solicitudes.length + 1).padStart(3, '0')}`;
    const codigo = `SOL-2025-${String(solicitudes.length + 1).padStart(4, '0')}`;

    const lineas: LineaSolicitudOperador[] = nuevaSolicitud.lineas.map((l, idx) => {
      const producto = equiposPrincipalesC5.find(p => p.id === l.productoId);
      return {
        id: `lin-${newId}-${idx + 1}`,
        productoId: l.productoId,
        sku: producto?.sku || '',
        nombre: producto?.nombre || '',
        cantidadSolicitada: l.cantidad,
        cantidadEntregada: 0,
      };
    });

    const nueva: SolicitudOperador = {
      id: newId,
      codigo,
      operadorId: nuevaSolicitud.operadorId,
      operadorNombre: operador?.nombre || '',
      tipo: nuevaSolicitud.tipo,
      prioridad: nuevaSolicitud.prioridad,
      motivo: nuevaSolicitud.motivo,
      justificacion: nuevaSolicitud.justificacion,
      lineas,
      estado: 'borrador',
      servidaDesdeStock: false,
      fechaCreacion: new Date(),
      creadoPor: 'Usuari Demo',
    };

    setSolicitudes(prev => [nueva, ...prev]);
    setIsNuevaOpen(false);
    setNuevaSolicitud({
      operadorId: '',
      tipo: 'normal',
      prioridad: 'media',
      motivo: 'nueva_flota',
      justificacion: '',
      lineas: [],
    });

    toast({
      title: 'Sol·licitud creada',
      description: `S'ha creat la sol·licitud ${codigo} en mode esborrany.`,
    });
  };

  const addLineaNueva = () => {
    setNuevaSolicitud(prev => ({
      ...prev,
      lineas: [...prev.lineas, { productoId: '', cantidad: 1 }],
    }));
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aprovació de Sol·licituds</h1>
          <p className="text-muted-foreground">
            Revisió i aprovació de peticions de material dels operadors
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pendents d'Aprovar</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pendientes}</div>
            <p className="text-xs text-muted-foreground">sol·licituds per revisar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Urgents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgentes}</div>
            <p className="text-xs text-muted-foreground">requereixen atenció immediata</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rebutjades</CardTitle>
            <XCircle className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-600">{stats.rechazadas}</div>
            <p className="text-xs text-muted-foreground">històric de rebuigs</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <Label htmlFor="busqueda">Cerca</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="busqueda"
                  placeholder="Codi o operador..."
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
                  <SelectItem value="todas">Tots els estats</SelectItem>
                  <SelectItem value="enviada">Pendent d'aprovar</SelectItem>
                  <SelectItem value="rechazada">Rebutjada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-64">
              <Label>Operador</Label>
              <Select value={filtroOperador} onValueChange={setFiltroOperador}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Tots els operadors</SelectItem>
                  {operadoresC5.map(op => (
                    <SelectItem key={op.id} value={op.id}>
                      {op.codigo} - {op.nombre.substring(0, 30)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de solicitudes */}
      <Card>
        <CardHeader>
          <CardTitle>Llistat de Sol·licituds</CardTitle>
          <CardDescription>
            {solicitudesFiltradas.length} sol·licituds trobades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Codi</TableHead>
                <TableHead>Operador</TableHead>
                <TableHead>Tipus</TableHead>
                <TableHead>Prioritat</TableHead>
                <TableHead>Línies</TableHead>
                <TableHead>Estat</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Accions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {solicitudesFiltradas.map(sol => (
                <TableRow key={sol.id} className={sol.estado === 'rechazada' ? 'bg-slate-50 opacity-75' : sol.tipo === 'urgente' ? 'bg-red-50' : ''}>
                  <TableCell className="font-mono font-medium">
                    {sol.codigo}
                    {sol.tipo === 'urgente' && sol.estado === 'enviada' && (
                      <Zap className="inline ml-2 h-4 w-4 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate max-w-[200px]">{sol.operadorNombre}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={tipoConfig[sol.tipo].color} variant="secondary">
                      {tipoConfig[sol.tipo].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={prioridadConfig[sol.prioridad].color}>
                      {prioridadConfig[sol.prioridad].label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {sol.lineas.length} {sol.lineas.length === 1 ? 'producte' : 'productes'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={estadoConfig[sol.estado].color} variant="secondary">
                      <span className="mr-1">{estadoConfig[sol.estado].icon}</span>
                      {estadoConfig[sol.estado].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(sol.fechaCreacion, 'dd/MM/yy', { locale: ca })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVerDetalle(sol)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {sol.estado === 'enviada' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRechazar(sol)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Rebutjar
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleAprobar(sol)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Aprovar
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {solicitudesFiltradas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No s'han trobat sol·licituds amb els filtres actuals
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sheet Detalle */}
      <Sheet open={isDetalleOpen} onOpenChange={setIsDetalleOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          {selectedSolicitud && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {selectedSolicitud.codigo}
                </SheetTitle>
                <SheetDescription>
                  Detall de la sol·licitud
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Estado y badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge className={estadoConfig[selectedSolicitud.estado].color} variant="secondary">
                    {estadoConfig[selectedSolicitud.estado].icon}
                    <span className="ml-1">{estadoConfig[selectedSolicitud.estado].label}</span>
                  </Badge>
                  <Badge className={tipoConfig[selectedSolicitud.tipo].color} variant="secondary">
                    {tipoConfig[selectedSolicitud.tipo].label}
                  </Badge>
                  <Badge variant="outline" className={prioridadConfig[selectedSolicitud.prioridad].color}>
                    Prioritat: {prioridadConfig[selectedSolicitud.prioridad].label}
                  </Badge>
                </div>

                <Separator />

                {/* Info operador */}
                <div className="grid gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Operador:</span>
                    <span>{selectedSolicitud.operadorNombre}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Creada:</span>
                    <span>{format(selectedSolicitud.fechaCreacion, "dd/MM/yyyy HH:mm", { locale: ca })}</span>
                  </div>
                  {selectedSolicitud.fechaAprobacion && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Aprovada:</span>
                      <span>{format(selectedSolicitud.fechaAprobacion, "dd/MM/yyyy", { locale: ca })}</span>
                      {selectedSolicitud.aprobadoPor && (
                        <span className="text-muted-foreground">per {selectedSolicitud.aprobadoPor}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Justificación */}
                {selectedSolicitud.justificacion && (
                  <div className="space-y-2">
                    <Label>Justificació</Label>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      {selectedSolicitud.justificacion}
                    </p>
                  </div>
                )}

                {/* Vehículos afectados */}
                {selectedSolicitud.vehiculosAfectados && selectedSolicitud.vehiculosAfectados.length > 0 && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Bus className="h-4 w-4" />
                      Vehicles Afectats
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSolicitud.vehiculosAfectados.map(v => (
                        <Badge key={v} variant="outline">{v}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Líneas del pedido */}
                <div className="space-y-3">
                  <Label>Productes Sol·licitats</Label>
                  <div className="space-y-2">
                    {selectedSolicitud.lineas.map(linea => (
                      <div
                        key={linea.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{linea.nombre}</p>
                          <p className="text-xs text-muted-foreground">{linea.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{linea.cantidadSolicitada} ud.</p>
                          {linea.cantidadAprobada !== undefined && linea.cantidadAprobada !== linea.cantidadSolicitada && (
                            <p className="text-xs text-amber-600">
                              Aprovades: {linea.cantidadAprobada}
                            </p>
                          )}
                          {linea.cantidadEntregada > 0 && (
                            <p className="text-xs text-green-600">
                              Entregades: {linea.cantidadEntregada}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trazabilidad pedido proveedor */}
                {selectedSolicitud.pedidoProveedorId && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Comanda a Proveïdor
                      </Label>
                      <p className="text-sm font-mono bg-purple-50 text-purple-700 p-2 rounded">
                        {selectedSolicitud.pedidoProveedorId === 'ped-prov-001' ? 'PED-WINFIN-2025-001' : selectedSolicitud.pedidoProveedorId}
                      </p>
                    </div>
                  </>
                )}

                {/* Notas */}
                {selectedSolicitud.notas && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Notes</Label>
                      <p className="text-sm text-muted-foreground">{selectedSolicitud.notas}</p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Dialog Nueva Solicitud */}
      <Dialog open={isNuevaOpen} onOpenChange={setIsNuevaOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Sol·licitud de Material</DialogTitle>
            <DialogDescription>
              Crea una nova petició de material per a un operador
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Operador */}
            <div className="space-y-2">
              <Label>Operador *</Label>
              <Select
                value={nuevaSolicitud.operadorId}
                onValueChange={v => setNuevaSolicitud(prev => ({ ...prev, operadorId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona operador" />
                </SelectTrigger>
                <SelectContent>
                  {operadoresC5.map(op => (
                    <SelectItem key={op.id} value={op.id}>
                      {op.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo y Prioridad */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipus</Label>
                <Select
                  value={nuevaSolicitud.tipo}
                  onValueChange={v => setNuevaSolicitud(prev => ({ ...prev, tipo: v as TipoSolicitudOperador }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgente">Urgent</SelectItem>
                    <SelectItem value="incidencia">Incidència</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Prioritat</Label>
                <Select
                  value={nuevaSolicitud.prioridad}
                  onValueChange={v => setNuevaSolicitud(prev => ({ ...prev, prioridad: v as 'baja' | 'media' | 'alta' | 'critica' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baja">Baixa</SelectItem>
                    <SelectItem value="media">Mitjana</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="critica">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Motivo */}
            <div className="space-y-2">
              <Label>Motiu</Label>
              <Select
                value={nuevaSolicitud.motivo}
                onValueChange={v => setNuevaSolicitud(prev => ({ ...prev, motivo: v as 'nueva_flota' | 'sustitucion' | 'ampliacion' | 'incidencia' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nueva_flota">Nova flota</SelectItem>
                  <SelectItem value="sustitucion">Substitució</SelectItem>
                  <SelectItem value="ampliacion">Ampliació</SelectItem>
                  <SelectItem value="incidencia">Incidència</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Justificación */}
            <div className="space-y-2">
              <Label>Justificació</Label>
              <Textarea
                placeholder="Explica el motiu de la sol·licitud..."
                value={nuevaSolicitud.justificacion}
                onChange={e => setNuevaSolicitud(prev => ({ ...prev, justificacion: e.target.value }))}
              />
            </div>

            {/* Líneas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Productes</Label>
                <Button type="button" variant="outline" size="sm" onClick={addLineaNueva}>
                  <Plus className="h-3 w-3 mr-1" /> Afegir
                </Button>
              </div>
              {nuevaSolicitud.lineas.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4 border rounded-md border-dashed">
                  Cap producte afegit. Clica "Afegir" per començar.
                </p>
              ) : (
                <div className="space-y-2">
                  {nuevaSolicitud.lineas.map((linea, idx) => (
                    <div key={idx} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Select
                          value={linea.productoId}
                          onValueChange={v => {
                            const newLineas = [...nuevaSolicitud.lineas];
                            newLineas[idx].productoId = v;
                            setNuevaSolicitud(prev => ({ ...prev, lineas: newLineas }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Producte" />
                          </SelectTrigger>
                          <SelectContent>
                            {equiposPrincipalesC5.map(p => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-20">
                        <Input
                          type="number"
                          min={1}
                          value={linea.cantidad}
                          onChange={e => {
                            const newLineas = [...nuevaSolicitud.lineas];
                            newLineas[idx].cantidad = parseInt(e.target.value) || 1;
                            setNuevaSolicitud(prev => ({ ...prev, lineas: newLineas }));
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newLineas = nuevaSolicitud.lineas.filter((_, i) => i !== idx);
                          setNuevaSolicitud(prev => ({ ...prev, lineas: newLineas }));
                        }}
                      >
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNuevaOpen(false)}>
              Cancel·lar
            </Button>
            <Button onClick={handleCrearSolicitud}>
              Crear Sol·licitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Aprobar Solicitud */}
      <Dialog open={isAprobarOpen} onOpenChange={setIsAprobarOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Aprovar Sol·licitud
            </DialogTitle>
            <DialogDescription>
              Confirma l'aprovació de la sol·licitud {solicitudAccion?.codigo}
            </DialogDescription>
          </DialogHeader>
          {solicitudAccion && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{solicitudAccion.operadorNombre}</p>
                <p className="text-sm text-muted-foreground mt-1">{solicitudAccion.justificacion}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Productes sol·licitats:</p>
                {solicitudAccion.lineas.map(l => (
                  <div key={l.id} className="flex justify-between text-sm p-2 bg-slate-50 rounded">
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
            <Button className="bg-green-600 hover:bg-green-700" onClick={confirmarAprobacion}>
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Aprovar Sol·licitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Rechazar Solicitud */}
      <Dialog open={isRechazarOpen} onOpenChange={setIsRechazarOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Rebutjar Sol·licitud
            </DialogTitle>
            <DialogDescription>
              Indica el motiu del rebuig de la sol·licitud {solicitudAccion?.codigo}
            </DialogDescription>
          </DialogHeader>
          {solicitudAccion && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-medium">{solicitudAccion.operadorNombre}</p>
                <p className="text-sm text-muted-foreground mt-1">{solicitudAccion.justificacion}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="motivo-rechazo">Motiu del rebuig</Label>
                <Textarea
                  id="motivo-rechazo"
                  placeholder="Explica el motiu pel qual es rebutja la sol·licitud..."
                  value={motivoRechazo}
                  onChange={e => setMotivoRechazo(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRechazarOpen(false)}>
              Cancel·lar
            </Button>
            <Button variant="destructive" onClick={confirmarRechazo}>
              <XCircle className="h-4 w-4 mr-1" />
              Rebutjar Sol·licitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
