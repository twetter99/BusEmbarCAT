'use client';

import * as React from 'react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ExportButtons } from '@/components/export-buttons';
import type { ExportColumn } from '@/lib/export-utils';
import { 
  ShieldCheck, 
  PlusCircle, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Wrench,
  Timer,
  CalendarClock,
  AlertCircle,
  FileText,
  Camera,
  Package,
  ArrowRight,
  RefreshCw,
  Eye,
  Clipboard,
  Zap,
} from 'lucide-react';
import { 
  mockGarantiasC5, 
  mockReparacionesC5, 
  equiposPrincipalesC5,
  mockNumeroSeriesC5,
  mockPedidosC5,
} from '@/lib/contrato-c5-data';
import { 
  diasRestantesGarantia, 
  garantiaProximaVencer,
  diasRestantesSLA,
  porcentajeAvanceSLA,
  cumpleSLA,
  slaEnRiesgo,
  LABELS_ESTADO_REPARACION,
  LABELS_TIPO_INCIDENCIA,
  LABELS_ESTADO_GARANTIA
} from '@/lib/contrato-c5-utils';
import { CONTRATO_C5_CONFIG, type ReparacionC5, type TipoIncidenciaC5, type EstadoReparacionC5 } from '@/lib/contrato-c5-types';
import { format, add } from 'date-fns';
import { ca } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

// ============================================
// CATÁLOGO DE FALLOS
// ============================================

interface FalloCatalogo {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  productoIds: string[]; // Productos a los que aplica
  tipoIncidencia: TipoIncidenciaC5;
}

const catalogoFallos: FalloCatalogo[] = [
  { id: 'fallo-001', codigo: 'ANT-F01', nombre: 'Pèrdua senyal GPS', descripcion: 'La unitat no rep senyal GPS o és intermitent', productoIds: ['EP-001'], tipoIncidencia: 'averia' },
  { id: 'fallo-002', codigo: 'ANT-F02', nombre: 'Pèrdua senyal 4G/LTE', descripcion: 'No hi ha connexió de dades mòbils', productoIds: ['EP-001'], tipoIncidencia: 'averia' },
  { id: 'fallo-003', codigo: 'ANT-F03', nombre: 'Pèrdua senyal WiFi', descripcion: 'El WiFi no emet o no es pot connectar', productoIds: ['EP-001'], tipoIncidencia: 'averia' },
  { id: 'fallo-004', codigo: 'ANT-F04', nombre: 'Dany físic antena', descripcion: 'Antena trencada, esquerdes o deformacions', productoIds: ['EP-001'], tipoIncidencia: 'vandalismo' },
  { id: 'fallo-005', codigo: 'SWT-F01', nombre: 'Port Ethernet danyat', descripcion: 'Un o més ports no funcionen', productoIds: ['EP-002'], tipoIncidencia: 'averia' },
  { id: 'fallo-006', codigo: 'SWT-F02', nombre: 'No encén / No alimenta', descripcion: 'El switch no rep alimentació', productoIds: ['EP-002'], tipoIncidencia: 'averia' },
  { id: 'fallo-007', codigo: 'SWT-F03', nombre: 'Dany físic carcassa', descripcion: 'Carcassa trencada per impacte', productoIds: ['EP-002'], tipoIncidencia: 'vandalismo' },
  { id: 'fallo-008', codigo: 'KIT-F01', nombre: 'Fallo connector Harting', descripcion: 'Els connectors Harting no fan contacte', productoIds: ['EP-003'], tipoIncidencia: 'averia' },
  { id: 'fallo-009', codigo: 'KIT-F02', nombre: 'Curtcircuit placa', descripcion: 'Curtcircuit a la placa de connexions', productoIds: ['EP-003'], tipoIncidencia: 'averia' },
  { id: 'fallo-010', codigo: 'KIT-F03', nombre: 'Cable trencat', descripcion: 'Cables amb dany visible o trencat', productoIds: ['EP-003'], tipoIncidencia: 'vandalismo' },
  { id: 'fallo-011', codigo: 'GEN-F01', nombre: 'Altre fallo', descripcion: 'Fallo no catalogat - especificar a notes', productoIds: ['EP-001', 'EP-002', 'EP-003'], tipoIncidencia: 'averia' },
];

// Columnas para exportación RMA
const columnasRMA: ExportColumn[] = [
  { key: 'codigo', header: 'Codi RMA' },
  { key: 'productoNombre', header: 'Producte' },
  { key: 'numeroSerie', header: 'Núm. Sèrie' },
  { key: 'tipoIncidencia', header: 'Tipus' },
  { key: 'estado', header: 'Estat' },
  { key: 'fechaReporte', header: 'Data Obertura', formatter: (v) => v instanceof Date ? v.toLocaleDateString('ca-ES') : String(v || '-') },
  { key: 'fechaResolucion', header: 'Data Tancament', formatter: (v) => v instanceof Date ? v.toLocaleDateString('ca-ES') : (v ? String(v) : '-') },
  { key: 'cumpleSLA', header: 'SLA', formatter: (v) => v ? 'Compleix' : 'Incompleix' },
];

// Estados del flujo RMA
const flujoEstadosRMA: { estado: EstadoReparacionC5; label: string; icon: React.ReactNode }[] = [
  { estado: 'abierta', label: 'Obert', icon: <FileText className="h-4 w-4" /> },
  { estado: 'en_diagnostico', label: 'Diagnòstic', icon: <Eye className="h-4 w-4" /> },
  { estado: 'en_reparacion', label: 'Reparació', icon: <Wrench className="h-4 w-4" /> },
  { estado: 'sustituido', label: 'Substituït', icon: <RefreshCw className="h-4 w-4" /> },
  { estado: 'cerrada', label: 'Tancat', icon: <CheckCircle className="h-4 w-4" /> },
];

const getEstadoIndex = (estado: EstadoReparacionC5): number => {
  const idx = flujoEstadosRMA.findIndex(e => e.estado === estado);
  return idx >= 0 ? idx : 0;
};

const estadoGarantiaBadge = (estado: string) => {
  const config: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'destructive', label: string }> = {
    vigente: { variant: 'default', label: 'Vigent' },
    proxima_vencer: { variant: 'outline', label: 'Pròxima a Vèncer' },
    vencida: { variant: 'secondary', label: 'Vençuda' },
    reclamada: { variant: 'destructive', label: 'Reclamada' },
  };
  const c = config[estado] || { variant: 'outline', label: estado };
  return <Badge variant={c.variant}>{c.label}</Badge>;
};

const estadoReparacionBadge = (estado: string) => {
  const config: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
    abierta: { variant: 'destructive' },
    en_diagnostico: { variant: 'outline' },
    en_reparacion: { variant: 'secondary' },
    reparado: { variant: 'default' },
    sustituido: { variant: 'default' },
    cerrada: { variant: 'default' },
  };
  const c = config[estado] || { variant: 'outline' };
  return <Badge variant={c.variant}>{LABELS_ESTADO_REPARACION[estado] || estado}</Badge>;
};

const tipoIncidenciaBadge = (tipo: TipoIncidenciaC5) => {
  const isVandalismo = tipo === 'vandalismo';
  return (
    <Badge variant={isVandalismo ? 'destructive' : 'outline'}>
      {LABELS_TIPO_INCIDENCIA[tipo]}
    </Badge>
  );
};

export default function GarantiasPage() {
  const { toast } = useToast();
  
  // Estados del formulario RMA
  const [isNuevoRMAOpen, setIsNuevoRMAOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<string>('');
  const [serieSeleccionada, setSerieSeleccionada] = useState<string>('');
  const [falloSeleccionado, setFalloSeleccionado] = useState<string>('');
  const [notasRMA, setNotasRMA] = useState('');
  const [evidenciasRMA, setEvidenciasRMA] = useState<string[]>([]);
  
  // Estado para detalle de RMA
  const [rmaDetalleOpen, setRmaDetalleOpen] = useState(false);
  const [rmaSeleccionado, setRmaSeleccionado] = useState<ReparacionC5 | null>(null);
  
  // Estado para usar recambio
  const [usarRecambioOpen, setUsarRecambioOpen] = useState(false);
  const [serieRecambioSeleccionada, setSerieRecambioSeleccionada] = useState<string>('');
  
  // Estadísticas de garantías
  const garantiasVigentes = mockGarantiasC5.filter(g => g.estado === 'vigente').length;
  const garantiasProximasVencer = mockGarantiasC5.filter(g => garantiaProximaVencer(g)).length;
  
  // Estadísticas de reparaciones
  const reparacionesAbiertas = mockReparacionesC5.filter(r => r.estado !== 'cerrada');
  const reparacionesEnSLA = mockReparacionesC5.filter(cumpleSLA).length;
  const reparacionesFueraSLA = mockReparacionesC5.filter(r => !cumpleSLA(r)).length;
  const reparacionesEnRiesgo = mockReparacionesC5.filter(slaEnRiesgo).length;

  // Series disponibles para el producto seleccionado
  const seriesDisponibles = React.useMemo(() => {
    if (!productoSeleccionado) return [];
    return mockNumeroSeriesC5.filter(
      s => s.productoId === productoSeleccionado && 
           (s.estado === 'instalado' || s.estado === 'disponible')
    );
  }, [productoSeleccionado]);

  // Fallos disponibles para el producto seleccionado
  const fallosDisponibles = React.useMemo(() => {
    if (!productoSeleccionado) return catalogoFallos;
    return catalogoFallos.filter(f => f.productoIds.includes(productoSeleccionado));
  }, [productoSeleccionado]);

  // Series de recambio disponibles para el producto del RMA seleccionado
  const seriesRecambioDisponibles = React.useMemo(() => {
    if (!rmaSeleccionado) return [];
    return mockNumeroSeriesC5.filter(
      s => s.productoId === rmaSeleccionado.productoId && 
           s.estado === 'disponible' &&
           s.esRecambio
    );
  }, [rmaSeleccionado]);

  // Obtener info de la serie seleccionada
  const serieInfo = React.useMemo(() => {
    if (!serieSeleccionada) return null;
    return mockNumeroSeriesC5.find(s => s.numeroSerie === serieSeleccionada);
  }, [serieSeleccionada]);

  // Obtener pedido relacionado con la serie
  const pedidoRelacionado = React.useMemo(() => {
    if (!serieInfo?.pedidoOrigenId) return null;
    return mockPedidosC5.find(p => p.id === serieInfo.pedidoOrigenId);
  }, [serieInfo]);

  const handleCrearRMA = () => {
    const fallo = catalogoFallos.find(f => f.id === falloSeleccionado);
    const producto = equiposPrincipalesC5.find(p => p.id === productoSeleccionado);
    
    toast({
      title: 'RMA creat correctament',
      description: `S'ha creat el RMA per a ${producto?.nombre} (${serieSeleccionada}) - Fallo: ${fallo?.nombre}`,
    });
    
    // Reset form
    setIsNuevoRMAOpen(false);
    setProductoSeleccionado('');
    setSerieSeleccionada('');
    setFalloSeleccionado('');
    setNotasRMA('');
    setEvidenciasRMA([]);
  };

  const handleVerDetalle = (rma: ReparacionC5) => {
    setRmaSeleccionado(rma);
    setRmaDetalleOpen(true);
  };

  const handleCambiarEstado = (nuevoEstado: EstadoReparacionC5) => {
    toast({
      title: 'Estat actualitzat',
      description: `El RMA ${rmaSeleccionado?.codigo} ha canviat a: ${LABELS_ESTADO_REPARACION[nuevoEstado]}`,
    });
  };

  const handleUsarRecambio = () => {
    const serieRecambio = mockNumeroSeriesC5.find(s => s.numeroSerie === serieRecambioSeleccionada);
    const producto = equiposPrincipalesC5.find(p => p.id === rmaSeleccionado?.productoId);
    
    toast({
      title: 'Recambi assignat',
      description: `S'ha assignat la sèrie ${serieRecambioSeleccionada} com a substitució. Estoc recambi ${producto?.nombre}: ${(producto?.stockRecambio ?? 1) - 1} ud (mock).`,
    });
    
    setUsarRecambioOpen(false);
    setSerieRecambioSeleccionada('');
    
    // Simular cambio a estado sustituido
    handleCambiarEstado('sustituido');
  };

  const simularSubirEvidencia = () => {
    const mockUrl = `/evidencias/mock-${Date.now()}.jpg`;
    setEvidenciasRMA([...evidenciasRMA, mockUrl]);
    toast({
      title: 'Evidència afegida',
      description: 'Foto simulada pujada correctament.',
    });
  };

  // Datos enriquecidos para exportación
  const datosExportacionRMA = mockReparacionesC5.map(r => ({
    ...r,
    rmaCode: r.codigo,
    cumpleSLAExport: cumpleSLA(r),
  }));

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Garanties i Reparacions (RMA)</h1>
          <p className="text-muted-foreground">
            Garantia {CONTRATO_C5_CONFIG.garantiaMeses} mesos | SLA Avaria: {CONTRATO_C5_CONFIG.slaReparacionAveriaDias}d | SLA Vandalisme: {CONTRATO_C5_CONFIG.slaReparacionVandalismoDias}d
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportButtons
            filename="rma-garanties-c5"
            title="Reparacions i Garanties C-5/2025"
            columns={columnasRMA}
            data={datosExportacionRMA}
          />
          <Button onClick={() => setIsNuevoRMAOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nou RMA
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Garanties Vigents</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{garantiasVigentes}</div>
            {garantiasProximasVencer > 0 && (
              <p className="text-xs text-orange-600">
                {garantiasProximasVencer} pròximes a vèncer
              </p>
            )}
          </CardContent>
        </Card>

        <Card className={reparacionesAbiertas.length > 0 ? 'border-orange-300' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RMA Oberts</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reparacionesAbiertas.length}</div>
            {reparacionesEnRiesgo > 0 && (
              <p className="text-xs text-orange-600">
                {reparacionesEnRiesgo} en risc de SLA
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-green-50 dark:bg-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complint SLA</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{reparacionesEnSLA}</div>
            <p className="text-xs text-muted-foreground">
              de {mockReparacionesC5.length} totals
            </p>
          </CardContent>
        </Card>

        <Card className={reparacionesFueraSLA > 0 ? 'border-destructive/50 bg-destructive/5' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fora SLA</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${reparacionesFueraSLA > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${reparacionesFueraSLA > 0 ? 'text-destructive' : ''}`}>
              {reparacionesFueraSLA}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reparaciones">
        <TabsList>
          <TabsTrigger value="reparaciones">
            <Wrench className="mr-2 h-4 w-4" />
            RMA ({mockReparacionesC5.length})
          </TabsTrigger>
          <TabsTrigger value="garantias">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Garanties ({mockGarantiasC5.length})
          </TabsTrigger>
          <TabsTrigger value="catalogo">
            <Clipboard className="mr-2 h-4 w-4" />
            Catàleg Fallos
          </TabsTrigger>
        </TabsList>

        {/* TAB: Reparaciones con tracking SLA */}
        <TabsContent value="reparaciones">
          <Card>
            <CardHeader>
              <CardTitle>Llistat de RMA</CardTitle>
              <CardDescription>
                Seguiment amb control d'SLA - Avaria màx. {CONTRATO_C5_CONFIG.slaReparacionAveriaDias}d / Vandalisme màx. {CONTRATO_C5_CONFIG.slaReparacionVandalismoDias}d
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Codi</TableHead>
                    <TableHead>Producte</TableHead>
                    <TableHead>Nº Sèrie</TableHead>
                    <TableHead>Tipus</TableHead>
                    <TableHead>Operador</TableHead>
                    <TableHead>Estat</TableHead>
                    <TableHead>Progrés SLA</TableHead>
                    <TableHead>Accions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReparacionesC5.map((rep) => {
                    const diasRestantes = diasRestantesSLA(rep);
                    const porcentajeSLA = porcentajeAvanceSLA(rep);
                    const enRiesgo = slaEnRiesgo(rep);
                    const cumple = cumpleSLA(rep);
                    const isCerrada = rep.estado === 'cerrada';
                    
                    let progressColor = 'bg-green-500';
                    if (porcentajeSLA >= 70) progressColor = 'bg-orange-500';
                    if (porcentajeSLA >= 100) progressColor = 'bg-destructive';
                    if (isCerrada && cumple) progressColor = 'bg-green-500';
                    
                    return (
                      <TableRow 
                        key={rep.id} 
                        className={enRiesgo ? 'bg-orange-50 dark:bg-orange-950/20' : !cumple ? 'bg-destructive/5' : ''}
                      >
                        <TableCell className="font-medium">{rep.codigo}</TableCell>
                        <TableCell>{rep.productoNombre}</TableCell>
                        <TableCell className="font-mono text-xs">{rep.numeroSerie}</TableCell>
                        <TableCell>{tipoIncidenciaBadge(rep.tipoIncidencia)}</TableCell>
                        <TableCell className="text-sm max-w-[150px] truncate">{rep.operadorNombre.split(',')[0]}</TableCell>
                        <TableCell>{estadoReparacionBadge(rep.estado)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 w-28">
                            <Progress 
                              value={Math.min(porcentajeSLA, 100)} 
                              className={`h-2 ${progressColor}`}
                            />
                            <span className={`text-xs font-medium ${
                              isCerrada && cumple ? 'text-green-600' : 
                              !cumple ? 'text-destructive' : 
                              enRiesgo ? 'text-orange-600' : ''
                            }`}>
                              {isCerrada ? (cumple ? '✓' : '✗') : `${diasRestantes}d`}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleVerDetalle(rep)}>
                            <Eye className="h-4 w-4 mr-1" />
                            Detall
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Garantías */}
        <TabsContent value="garantias">
          <Card>
            <CardHeader>
              <CardTitle>Control de Garanties</CardTitle>
              <CardDescription>
                Equipament amb garantia de {CONTRATO_C5_CONFIG.garantiaMeses} mesos des de l'entrega
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producte</TableHead>
                    <TableHead>Nº Sèrie</TableHead>
                    <TableHead>Operador</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Data Entrega</TableHead>
                    <TableHead>Fi Garantia</TableHead>
                    <TableHead>Dies Restants</TableHead>
                    <TableHead>Estat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockGarantiasC5.map((gar) => {
                    const diasRestantes = diasRestantesGarantia(gar);
                    const proximaVencer = garantiaProximaVencer(gar);
                    
                    return (
                      <TableRow 
                        key={gar.id}
                        className={proximaVencer ? 'bg-orange-50 dark:bg-orange-950/20' : ''}
                      >
                        <TableCell className="font-medium">{gar.productoNombre}</TableCell>
                        <TableCell className="font-mono text-xs">{gar.numeroSerie}</TableCell>
                        <TableCell className="text-sm max-w-[150px] truncate">{gar.operadorNombre.split(',')[0]}</TableCell>
                        <TableCell>{gar.vehiculoInstalado || '-'}</TableCell>
                        <TableCell>{format(gar.fechaEntrega, 'dd/MM/yyyy', { locale: ca })}</TableCell>
                        <TableCell>{format(gar.fechaFinGarantia, 'dd/MM/yyyy', { locale: ca })}</TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-1 ${
                            diasRestantes <= 0 ? 'text-muted-foreground' :
                            proximaVencer ? 'text-orange-600 font-medium' : ''
                          }`}>
                            {proximaVencer && <Clock className="h-4 w-4" />}
                            {diasRestantes > 0 ? `${diasRestantes}d` : 'Vençuda'}
                          </div>
                        </TableCell>
                        <TableCell>{estadoGarantiaBadge(gar.estado)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB: Catálogo de Fallos */}
        <TabsContent value="catalogo">
          <Card>
            <CardHeader>
              <CardTitle>Catàleg de Fallos</CardTitle>
              <CardDescription>
                Tipus de fallos predefinits per a la creació de RMA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Codi</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Descripció</TableHead>
                    <TableHead>Productes</TableHead>
                    <TableHead>Tipus</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {catalogoFallos.map((fallo) => (
                    <TableRow key={fallo.id}>
                      <TableCell className="font-mono text-sm">{fallo.codigo}</TableCell>
                      <TableCell className="font-medium">{fallo.nombre}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{fallo.descripcion}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {fallo.productoIds.map(pid => {
                            const prod = equiposPrincipalesC5.find(p => p.id === pid);
                            return prod ? (
                              <Badge key={pid} variant="secondary" className="text-xs">
                                {prod.nombre.split(' ')[0]}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </TableCell>
                      <TableCell>{tipoIncidenciaBadge(fallo.tipoIncidencia)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog: Nuevo RMA */}
      <Dialog open={isNuevoRMAOpen} onOpenChange={setIsNuevoRMAOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] p-0 gap-0 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b bg-gradient-to-r from-slate-50 to-white">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">Nou RMA</DialogTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Crea una nova sol·licitud de reparació o substitució
                  </p>
                </div>
              </div>
            </DialogHeader>
          </div>
          
          {/* Contenido scrolleable */}
          <ScrollArea className="max-h-[calc(85vh-180px)]">
            <div className="px-6 py-5 space-y-5">
              {/* Producto */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-muted-foreground">Producte *</label>
                <Select value={productoSeleccionado} onValueChange={(v) => {
                  setProductoSeleccionado(v);
                  setSerieSeleccionada('');
                  setFalloSeleccionado('');
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un producte" />
                  </SelectTrigger>
                  <SelectContent>
                    {equiposPrincipalesC5.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.nombre} ({p.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Serie */}
              {productoSeleccionado && (
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wide text-muted-foreground">Número de Sèrie *</label>
                  <Select value={serieSeleccionada} onValueChange={setSerieSeleccionada}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la sèrie afectada" />
                    </SelectTrigger>
                    <SelectContent>
                      {seriesDisponibles.map((s) => (
                        <SelectItem key={s.id} value={s.numeroSerie}>
                          {s.numeroSerie} - {s.estado === 'instalado' ? `Instal·lat (${s.operadorNombre?.split(',')[0]})` : 'Disponible'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Info de la serie seleccionada */}
              {serieInfo && (
                <div className="p-4 bg-slate-50 rounded-xl border">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Informació de la Sèrie</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Estat:</span> <span className="font-medium">{serieInfo.estado}</span></div>
                    <div><span className="text-muted-foreground">Ubicació:</span> <span className="font-medium">{serieInfo.ubicacion}</span></div>
                    {serieInfo.operadorNombre && (
                      <div><span className="text-muted-foreground">Operador:</span> <span className="font-medium">{serieInfo.operadorNombre.split(',')[0]}</span></div>
                    )}
                    {serieInfo.vehiculoCalca && (
                      <div><span className="text-muted-foreground">Vehicle:</span> <span className="font-medium">{serieInfo.vehiculoCalca}</span></div>
                    )}
                    {pedidoRelacionado && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Comanda origen:</span> <span className="font-medium">{pedidoRelacionado.codigo}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Fallo del catálogo */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-muted-foreground">Tipus de Fallo *</label>
                <Select value={falloSeleccionado} onValueChange={setFalloSeleccionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipus de fallo" />
                  </SelectTrigger>
                  <SelectContent>
                    {fallosDisponibles.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs">{f.codigo}</span>
                          <span>{f.nombre}</span>
                          <Badge variant={f.tipoIncidencia === 'vandalismo' ? 'destructive' : 'outline'} className="text-xs">
                            {f.tipoIncidencia === 'vandalismo' ? 'Vand.' : 'Avaria'}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {falloSeleccionado && (
                  <p className="text-xs text-muted-foreground">
                    {catalogoFallos.find(f => f.id === falloSeleccionado)?.descripcion}
                  </p>
                )}
              </div>

              {/* Notas */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-muted-foreground">Notes addicionals</label>
                <Textarea
                  value={notasRMA}
                  onChange={(e) => setNotasRMA(e.target.value)}
                  placeholder="Descriu el problema amb més detall..."
                  rows={3}
                />
              </div>

              {/* Evidencias */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-muted-foreground">Evidències (fotos)</label>
                <div className="p-4 bg-slate-50 rounded-xl border">
                  <div className="flex flex-wrap gap-2">
                    {evidenciasRMA.map((ev, i) => (
                      <div key={i} className="flex items-center gap-1 rounded-lg bg-white border px-2 py-1 text-xs">
                        <Camera className="h-3 w-3" />
                        Foto {i + 1}
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={simularSubirEvidencia}>
                      <Camera className="h-4 w-4 mr-1" />
                      Afegir Foto (mock)
                    </Button>
                  </div>
                </div>
              </div>

              {/* SLA Info */}
              {falloSeleccionado && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-amber-600" />
                    <span className="font-medium text-sm text-amber-800">Termini SLA</span>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">
                    {catalogoFallos.find(f => f.id === falloSeleccionado)?.tipoIncidencia === 'vandalismo' 
                      ? `Vandalisme: ${CONTRATO_C5_CONFIG.slaReparacionVandalismoDias} dies màxim`
                      : `Avaria: ${CONTRATO_C5_CONFIG.slaReparacionAveriaDias} dies màxim`
                    }
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-slate-50 flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsNuevoRMAOpen(false)}>
              Cancel·lar
            </Button>
            <Button 
              onClick={handleCrearRMA}
              disabled={!productoSeleccionado || !serieSeleccionada || !falloSeleccionado}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear RMA
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Detalle RMA */}
      <Dialog open={rmaDetalleOpen} onOpenChange={setRmaDetalleOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] p-0 gap-0 overflow-hidden">
          {rmaSeleccionado && (
            <>
              {/* Header */}
              <div className="px-6 py-5 border-b bg-gradient-to-r from-slate-50 to-white">
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Wrench className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-semibold">{rmaSeleccionado.codigo}</DialogTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Detall i gestió del RMA
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {tipoIncidenciaBadge(rmaSeleccionado.tipoIncidencia)}
                    <Badge variant={diasRestantesSLA(rmaSeleccionado) < 2 ? 'destructive' : 'outline'}>
                      {diasRestantesSLA(rmaSeleccionado)}d restants
                    </Badge>
                  </div>
                </DialogHeader>
              </div>

              {/* Contenido scrolleable */}
              <ScrollArea className="max-h-[calc(85vh-180px)]">
                <div className="px-6 py-5 space-y-5">
                  {/* Flujo de estados */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wide text-muted-foreground">Flux d'Estats</label>
                    <div className="p-4 bg-slate-50 rounded-xl border">
                      <div className="flex items-center justify-between">
                        {flujoEstadosRMA.map((e, idx) => {
                          const estadoActualIdx = getEstadoIndex(rmaSeleccionado.estado);
                          const isActive = idx <= estadoActualIdx;
                          const isCurrent = e.estado === rmaSeleccionado.estado;
                          
                          return (
                            <React.Fragment key={e.estado}>
                              <div 
                                className={`flex flex-col items-center gap-1 ${
                                  isCurrent ? 'text-primary' : isActive ? 'text-green-600' : 'text-muted-foreground'
                                }`}
                              >
                                <div className={`rounded-full p-2 ${
                                  isCurrent ? 'bg-primary text-primary-foreground' : 
                                  isActive ? 'bg-green-100 dark:bg-green-900' : 'bg-white border'
                                }`}>
                                  {e.icon}
                                </div>
                                <span className="text-xs font-medium">{e.label}</span>
                              </div>
                              {idx < flujoEstadosRMA.length - 1 && (
                                <ArrowRight className={`h-4 w-4 ${isActive ? 'text-green-600' : 'text-muted-foreground'}`} />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Info básica */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wide text-muted-foreground">Informació</label>
                    <div className="p-4 bg-slate-50 rounded-xl border">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Producte:</span>
                          <p className="font-medium">{rmaSeleccionado.productoNombre}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Nº Sèrie:</span>
                          <p className="font-mono font-medium">{rmaSeleccionado.numeroSerie}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">SLA:</span>
                          <p className="font-medium">{rmaSeleccionado.slaDias} dies</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Data Límit:</span>
                          <p className="font-medium">{format(rmaSeleccionado.fechaLimiteSLA, 'dd/MM/yyyy', { locale: ca })}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Operador:</span>
                          <p className="font-medium">{rmaSeleccionado.operadorNombre.split(',')[0]}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Vehicle:</span>
                          <p className="font-medium">{rmaSeleccionado.vehiculoOrigen || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wide text-muted-foreground">Descripció del Fallo</label>
                    <div className="p-4 bg-slate-50 rounded-xl border">
                      <p className="text-sm">{rmaSeleccionado.descripcion}</p>
                    </div>
                  </div>

                  {/* Diagnóstico */}
                  {rmaSeleccionado.diagnostico && (
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wide text-muted-foreground">Diagnòstic</label>
                      <div className="p-4 bg-slate-50 rounded-xl border">
                        <p className="text-sm">{rmaSeleccionado.diagnostico}</p>
                      </div>
                    </div>
                  )}

                  {/* Acción Correctiva */}
                  {rmaSeleccionado.accionCorrectiva && (
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wide text-muted-foreground">Acció Correctiva</label>
                      <div className="p-4 bg-slate-50 rounded-xl border">
                        <p className="text-sm">{rmaSeleccionado.accionCorrectiva}</p>
                      </div>
                    </div>
                  )}

                  {/* Serie de sustitución */}
                  {rmaSeleccionado.numeroSerieSustitucion && (
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-sm text-green-800">Substituït</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Sèrie de substitució: <span className="font-mono font-medium">{rmaSeleccionado.numeroSerieSustitucion}</span>
                      </p>
                    </div>
                  )}

                  {/* Evidencias */}
                  {rmaSeleccionado.evidencias && rmaSeleccionado.evidencias.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wide text-muted-foreground">Evidències</label>
                      <div className="p-4 bg-slate-50 rounded-xl border">
                        <div className="grid grid-cols-2 gap-2">
                          {rmaSeleccionado.evidencias.map((ev) => (
                            <div key={ev.id} className="rounded-lg bg-white border p-2">
                              <div className="flex items-center gap-2 text-sm">
                                <Camera className="h-4 w-4 text-muted-foreground" />
                                {ev.descripcion}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(ev.fecha, 'dd/MM/yyyy', { locale: ca })}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Footer con acciones */}
              {rmaSeleccionado.estado !== 'cerrada' && (
                <div className="px-6 py-4 border-t bg-slate-50 flex flex-wrap gap-2 justify-end">
                  {rmaSeleccionado.estado === 'abierta' && (
                    <Button size="sm" variant="outline" onClick={() => handleCambiarEstado('en_diagnostico')}>
                      <Eye className="h-4 w-4 mr-1" />
                      Iniciar Diagnòstic
                    </Button>
                  )}
                  
                  {rmaSeleccionado.estado === 'en_diagnostico' && (
                    <Button size="sm" variant="outline" onClick={() => handleCambiarEstado('en_reparacion')}>
                      <Wrench className="h-4 w-4 mr-1" />
                      Iniciar Reparació
                    </Button>
                  )}
                  
                  {(rmaSeleccionado.estado === 'en_diagnostico' || rmaSeleccionado.estado === 'en_reparacion') && (
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => setUsarRecambioOpen(true)}
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      Usar Recambi
                    </Button>
                  )}
                  
                  {(rmaSeleccionado.estado === 'en_reparacion' || rmaSeleccionado.estado === 'sustituido') && (
                    <Button size="sm" variant="default" onClick={() => handleCambiarEstado('cerrada')}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Tancar RMA
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog: Usar Recambio */}
      <Dialog open={usarRecambioOpen} onOpenChange={setUsarRecambioOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] p-0 gap-0 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b bg-gradient-to-r from-slate-50 to-white">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">Usar Recambi</DialogTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Selecciona una sèrie de recambi per substituir l'equip danyat
                  </p>
                </div>
              </div>
            </DialogHeader>
          </div>
          
          {/* Contenido */}
          <div className="px-6 py-5 space-y-5">
            {seriesRecambioDisponibles.length > 0 ? (
              <>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wide text-muted-foreground">Sèries de Recambi Disponibles</label>
                  <Select value={serieRecambioSeleccionada} onValueChange={setSerieRecambioSeleccionada}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la sèrie de recambi" />
                    </SelectTrigger>
                    <SelectContent>
                      {seriesRecambioDisponibles.map((s) => (
                        <SelectItem key={s.id} value={s.numeroSerie}>
                          {s.numeroSerie} - {s.productoNombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-xl border">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">Estoc de Recambi</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {(() => {
                      const prod = equiposPrincipalesC5.find(p => p.id === rmaSeleccionado?.productoId);
                      return `${prod?.nombre}: ${prod?.stockRecambio ?? 0} unitats disponibles`;
                    })()}
                  </p>
                </div>
              </>
            ) : (
              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-sm text-red-800">Sense Recambis</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  No hi ha sèries marcades com a recambi disponibles per a aquest producte.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-slate-50 flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setUsarRecambioOpen(false)}>
              Cancel·lar
            </Button>
            <Button 
              onClick={handleUsarRecambio}
              disabled={!serieRecambioSeleccionada}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Assignar Recambi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}