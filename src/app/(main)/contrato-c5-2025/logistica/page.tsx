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
} from '@/components/ui/dialog';
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
} from '@/components/ui/sheet';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Truck, 
  Package,
  PackageCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  FileText,
  Camera,
  Upload,
  X,
  Send,
  Eye,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { mockEnviosC5, getIncidenciasAbiertas } from '@/lib/contrato-c5-data';
import type { EnvioC5, EstadoEnvioC5, TipoIncidenciaEnvio, IncidenciaEnvioC5 } from '@/lib/contrato-c5-types';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

// Configuración de estados de envío
const estadoEnvioConfig: Record<EstadoEnvioC5, { label: string; color: string; icon: React.ElementType }> = {
  pendiente_preparacion: { label: 'Pendent Preparació', color: 'bg-gray-100 text-gray-800', icon: Clock },
  en_preparacion: { label: 'En Preparació', color: 'bg-blue-100 text-blue-800', icon: Package },
  preparado: { label: 'Preparat', color: 'bg-cyan-100 text-cyan-800', icon: PackageCheck },
  en_transito: { label: 'En Trànsit', color: 'bg-purple-100 text-purple-800', icon: Truck },
  entregado: { label: 'Lliurat', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  entregado_parcial: { label: 'Lliurament Parcial', color: 'bg-orange-100 text-orange-800', icon: AlertTriangle },
  incidencia: { label: 'Incidència', color: 'bg-red-100 text-red-800', icon: AlertCircle },
};

// Configuración de tipos de incidencia
const tipoIncidenciaConfig: Record<TipoIncidenciaEnvio, { label: string; color: string }> = {
  falta_unidades: { label: 'Falten Unitats', color: 'bg-orange-100 text-orange-800' },
  dano_transporte: { label: 'Danys Transport', color: 'bg-red-100 text-red-800' },
  producto_incorrecto: { label: 'Producte Incorrecte', color: 'bg-yellow-100 text-yellow-800' },
  direccion_incorrecta: { label: 'Adreça Incorrecta', color: 'bg-blue-100 text-blue-800' },
  rechazo_cliente: { label: 'Rebuig Client', color: 'bg-purple-100 text-purple-800' },
  otro: { label: 'Altre', color: 'bg-gray-100 text-gray-800' },
};

// Timeline de estados
const estadoTimeline: EstadoEnvioC5[] = [
  'pendiente_preparacion',
  'en_preparacion',
  'preparado',
  'en_transito',
  'entregado',
];

export default function LogisticaPage() {
  const [selectedEnvio, setSelectedEnvio] = React.useState<EnvioC5 | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);
  const [isIncidenciaOpen, setIsIncidenciaOpen] = React.useState(false);
  const [incidenciaEnvioId, setIncidenciaEnvioId] = React.useState<string | null>(null);
  const [incidenciaForm, setIncidenciaForm] = React.useState({
    tipo: '' as TipoIncidenciaEnvio | '',
    descripcion: '',
    unidadesAfectadas: '',
    fotos: [] as string[],
  });
  const { toast } = useToast();

  // KPIs
  const totalEnvios = mockEnviosC5.length;
  const enviosEnTransito = mockEnviosC5.filter(e => e.estado === 'en_transito').length;
  const enviosPreparados = mockEnviosC5.filter(e => e.estado === 'preparado' || e.estado === 'en_preparacion').length;
  const incidenciasAbiertas = getIncidenciasAbiertas();
  const enviosEntregados = mockEnviosC5.filter(e => e.estado === 'entregado').length;

  // Filtrar envíos por estado
  const enviosActivos = mockEnviosC5.filter(e => 
    !['entregado'].includes(e.estado)
  );
  const enviosCompletados = mockEnviosC5.filter(e => e.estado === 'entregado');

  // Abrir detalle de envío
  const handleOpenDetail = (envio: EnvioC5) => {
    setSelectedEnvio(envio);
    setIsDetailOpen(true);
  };

  // Abrir diálogo de nueva incidencia
  const handleOpenIncidencia = (envioId: string) => {
    setIncidenciaEnvioId(envioId);
    setIncidenciaForm({ tipo: '', descripcion: '', unidadesAfectadas: '', fotos: [] });
    setIsIncidenciaOpen(true);
  };

  // Simular subir foto
  const handleAddFoto = () => {
    const mockUrl = `/mock/foto-incidencia-${Date.now()}.jpg`;
    setIncidenciaForm(prev => ({
      ...prev,
      fotos: [...prev.fotos, mockUrl],
    }));
    toast({ title: 'Foto afegida', description: 'S\'ha simulat la càrrega de la foto' });
  };

  // Eliminar foto
  const handleRemoveFoto = (index: number) => {
    setIncidenciaForm(prev => ({
      ...prev,
      fotos: prev.fotos.filter((_, i) => i !== index),
    }));
  };

  // Guardar incidencia
  const handleGuardarIncidencia = () => {
    if (!incidenciaForm.tipo || !incidenciaForm.descripcion) {
      toast({ title: 'Error', description: 'Omple tots els camps obligatoris', variant: 'destructive' });
      return;
    }

    toast({
      title: 'Incidència registrada',
      description: `S'ha registrat la incidència de tipus "${tipoIncidenciaConfig[incidenciaForm.tipo as TipoIncidenciaEnvio]?.label}"`,
    });
    setIsIncidenciaOpen(false);
  };

  // Obtener posición en timeline
  const getTimelinePosition = (estado: EstadoEnvioC5): number => {
    const index = estadoTimeline.indexOf(estado);
    if (index === -1) return 0;
    return ((index + 1) / estadoTimeline.length) * 100;
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Logística i Pick&Pack</h1>
          <p className="text-muted-foreground">
            Gestió d'enviaments i seguiment de lliuraments
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Trànsit</CardTitle>
            <Truck className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{enviosEnTransito}</div>
            <p className="text-xs text-muted-foreground">enviaments en camí</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preparació</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{enviosPreparados}</div>
            <p className="text-xs text-muted-foreground">pendents d'enviar</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-green-50 dark:bg-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lliurats</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{enviosEntregados}</div>
            <p className="text-xs text-muted-foreground">completats</p>
          </CardContent>
        </Card>

        <Card className={incidenciasAbiertas.length > 0 ? 'border-destructive/50 bg-destructive/5' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidències</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${incidenciasAbiertas.length > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${incidenciasAbiertas.length > 0 ? 'text-destructive' : ''}`}>
              {incidenciasAbiertas.length}
            </div>
            <p className="text-xs text-muted-foreground">pendents de resoldre</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerta de incidencias */}
      {incidenciasAbiertas.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Incidències pendents</AlertTitle>
          <AlertDescription>
            Hi ha {incidenciasAbiertas.length} incidència/es obertes que requereixen atenció.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="activos">
        <TabsList>
          <TabsTrigger value="activos">
            <Truck className="mr-2 h-4 w-4" />
            Actius ({enviosActivos.length})
          </TabsTrigger>
          <TabsTrigger value="completados">
            <CheckCircle className="mr-2 h-4 w-4" />
            Completats ({enviosCompletados.length})
          </TabsTrigger>
          <TabsTrigger value="incidencias">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Incidències ({incidenciasAbiertas.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab Envíos Activos */}
        <TabsContent value="activos">
          <Card>
            <CardHeader>
              <CardTitle>Enviaments Actius</CardTitle>
              <CardDescription>Enviaments en curs pendents de lliurament</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enviosActivos.map((envio) => {
                  const config = estadoEnvioConfig[envio.estado];
                  const IconComponent = config.icon;
                  const progreso = getTimelinePosition(envio.estado);
                  
                  return (
                    <div 
                      key={envio.id}
                      className={`rounded-lg border p-4 ${envio.estado === 'incidencia' ? 'border-destructive/50 bg-destructive/5' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`rounded-full p-2 ${config.color}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{envio.codigo}</span>
                              <Badge className={config.color}>{config.label}</Badge>
                              {envio.incidencias && envio.incidencias.length > 0 && (
                                <Badge variant="destructive" className="gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  {envio.incidencias.length} incidència/es
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {envio.operadorNombre}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <MapPin className="h-3 w-3" />
                              {envio.direccionDestino}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6">
                          {/* Timeline visual */}
                          <div className="hidden md:block w-40">
                            <Progress value={progreso} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>Prep.</span>
                              <span>Trànsit</span>
                              <span>Lliurat</span>
                            </div>
                          </div>
                          
                          {/* Fecha estimada */}
                          {envio.fechaEstimadaLlegada && (
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {format(envio.fechaEstimadaLlegada, 'dd/MM/yyyy', { locale: ca })}
                              </div>
                              <div className="text-xs text-muted-foreground">arribada estimada</div>
                            </div>
                          )}
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenDetail(envio)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenIncidencia(envio.id)}
                            >
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Tracking */}
                      {envio.numeroSeguimiento && (
                        <div className="mt-3 flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Seguiment:</span>
                          <code className="bg-muted px-2 py-0.5 rounded text-xs">{envio.numeroSeguimiento}</code>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {enviosActivos.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No hi ha enviaments actius
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Completados */}
        <TabsContent value="completados">
          <Card>
            <CardHeader>
              <CardTitle>Enviaments Completats</CardTitle>
              <CardDescription>Històric de lliuraments realitzats</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Codi</TableHead>
                    <TableHead>Operador</TableHead>
                    <TableHead>Unitats</TableHead>
                    <TableHead>Data Lliurament</TableHead>
                    <TableHead>Albarà</TableHead>
                    <TableHead>Accions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enviosCompletados.map((envio) => (
                    <TableRow key={envio.id}>
                      <TableCell className="font-medium">{envio.codigo}</TableCell>
                      <TableCell>{envio.operadorNombre.split(',')[0]}</TableCell>
                      <TableCell>{envio.seriesEnviadas.length} uds</TableCell>
                      <TableCell>
                        {envio.fechaEntrega 
                          ? format(envio.fechaEntrega, 'dd/MM/yyyy', { locale: ca })
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {envio.albaranNumero ? (
                          <Badge variant="outline" className="gap-1">
                            <FileText className="h-3 w-3" />
                            {envio.albaranNumero}
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleOpenDetail(envio)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Incidencias */}
        <TabsContent value="incidencias">
          <Card>
            <CardHeader>
              <CardTitle>Incidències d'Enviament</CardTitle>
              <CardDescription>Gestió de faltes, danys i altres incidències</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEnviosC5.filter(e => e.incidencias && e.incidencias.length > 0).map((envio) => (
                  envio.incidencias!.map((incidencia) => {
                    const tipoConfig = tipoIncidenciaConfig[incidencia.tipo];
                    return (
                      <div 
                        key={incidencia.id}
                        className="rounded-lg border p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge className={tipoConfig.color}>{tipoConfig.label}</Badge>
                              <Badge variant={incidencia.estado === 'abierta' ? 'destructive' : incidencia.estado === 'en_gestion' ? 'secondary' : 'default'}>
                                {incidencia.estado === 'abierta' ? 'Oberta' : incidencia.estado === 'en_gestion' ? 'En Gestió' : 'Resolta'}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {envio.codigo}
                              </span>
                            </div>
                            <div className="text-sm font-medium">{envio.operadorNombre}</div>
                            <p className="text-sm text-muted-foreground">{incidencia.descripcion}</p>
                            {incidencia.unidadesAfectadas && (
                              <div className="text-sm">
                                <span className="font-medium">Unitats afectades:</span> {incidencia.unidadesAfectadas}
                              </div>
                            )}
                            {incidencia.fotos && incidencia.fotos.length > 0 && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Camera className="h-4 w-4" />
                                {incidencia.fotos.length} foto/es adjuntes
                              </div>
                            )}
                          </div>
                          <div className="text-right text-sm text-muted-foreground">
                            <div>{format(incidencia.fechaReporte, 'dd/MM/yyyy HH:mm', { locale: ca })}</div>
                            <div>per {incidencia.reportadoPor}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ))}

                {incidenciasAbiertas.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No hi ha incidències registrades
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Detalle Envío */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] p-0 gap-0 overflow-hidden">
          {selectedEnvio && (
            <>
              {/* Header */}
              <div className="px-6 py-5 border-b bg-gradient-to-r from-slate-50 to-white">
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-semibold">
                        {selectedEnvio.codigo}
                      </DialogTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {selectedEnvio.operadorNombre}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge className={estadoEnvioConfig[selectedEnvio.estado].color}>
                      {estadoEnvioConfig[selectedEnvio.estado].label}
                    </Badge>
                  </div>
                </DialogHeader>
              </div>

              {/* Contenido scrolleable */}
              <ScrollArea className="max-h-[calc(85vh-180px)]">
                <div className="px-6 py-5 space-y-5">

                  {/* Timeline visual */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wide text-muted-foreground">Estat de l'enviament</label>
                    <div className="p-4 bg-slate-50 rounded-xl border">
                      <div className="flex items-center justify-between">
                        {estadoTimeline.map((estado, i) => {
                          const isActive = estadoTimeline.indexOf(selectedEnvio.estado) >= i;
                          const isCurrent = selectedEnvio.estado === estado;
                          return (
                            <div key={estado} className="flex flex-col items-center gap-1">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                isCurrent ? 'bg-primary text-primary-foreground' : 
                                isActive ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                              }`}>
                                {React.createElement(estadoEnvioConfig[estado].icon, { className: 'h-4 w-4' })}
                              </div>
                              <span className={`text-xs ${isCurrent ? 'font-medium' : 'text-muted-foreground'}`}>
                                {estadoEnvioConfig[estado].label.split(' ')[0]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Info del envío */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wide text-muted-foreground">Informació</label>
                    <div className="p-4 bg-slate-50 rounded-xl border">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Comanda:</span>
                          <div className="font-medium">{selectedEnvio.pedidoCodigo}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Unitats:</span>
                          <div className="font-medium">{selectedEnvio.seriesEnviadas.length}</div>
                        </div>
                        {selectedEnvio.transportista && (
                          <div>
                            <span className="text-muted-foreground">Transportista:</span>
                            <div className="font-medium">{selectedEnvio.transportista}</div>
                          </div>
                        )}
                        {selectedEnvio.numeroSeguimiento && (
                          <div>
                            <span className="text-muted-foreground">Seguiment:</span>
                            <div className="font-mono text-xs">{selectedEnvio.numeroSeguimiento}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Destino */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      Destí
                    </label>
                    <div className="p-4 bg-slate-50 rounded-xl border">
                      <p className="text-sm">{selectedEnvio.direccionDestino}</p>
                    </div>
                  </div>

                  {/* Fechas */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      Dates
                    </label>
                    <div className="p-4 bg-slate-50 rounded-xl border">
                      <div className="space-y-2 text-sm">
                        {selectedEnvio.fechaPreparacion && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Preparat:</span>
                            <span className="font-medium">{format(selectedEnvio.fechaPreparacion, 'dd/MM/yyyy HH:mm', { locale: ca })}</span>
                          </div>
                        )}
                        {selectedEnvio.fechaSalida && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sortida:</span>
                            <span className="font-medium">{format(selectedEnvio.fechaSalida, 'dd/MM/yyyy HH:mm', { locale: ca })}</span>
                          </div>
                        )}
                        {selectedEnvio.fechaEstimadaLlegada && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Arribada estimada:</span>
                            <span className="font-medium">{format(selectedEnvio.fechaEstimadaLlegada, 'dd/MM/yyyy', { locale: ca })}</span>
                          </div>
                        )}
                        {selectedEnvio.fechaEntrega && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Lliurat:</span>
                            <span className="font-medium text-green-600">
                              {format(selectedEnvio.fechaEntrega, 'dd/MM/yyyy HH:mm', { locale: ca })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Series enviadas */}
                  {selectedEnvio.seriesEnviadas.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wide text-muted-foreground">Sèries Enviades</label>
                      <div className="p-4 bg-slate-50 rounded-xl border">
                        <div className="flex flex-wrap gap-1">
                          {selectedEnvio.seriesEnviadas.slice(0, 10).map((serie) => (
                            <Badge key={serie} variant="outline" className="font-mono text-xs bg-white">
                              {serie}
                            </Badge>
                          ))}
                          {selectedEnvio.seriesEnviadas.length > 10 && (
                            <Badge variant="secondary">+{selectedEnvio.seriesEnviadas.length - 10} més</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Incidencias */}
                  {selectedEnvio.incidencias && selectedEnvio.incidencias.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wide text-destructive flex items-center gap-2">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Incidències
                      </label>
                      {selectedEnvio.incidencias.map((inc) => (
                        <Alert key={inc.id} variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>{tipoIncidenciaConfig[inc.tipo].label}</AlertTitle>
                          <AlertDescription>{inc.descripcion}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}

                  {/* Albarán y firma */}
                  {(selectedEnvio.albaranNumero || selectedEnvio.firmaRecepcion) && (
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wide text-muted-foreground">Documents</label>
                      <div className="flex gap-2">
                        {selectedEnvio.albaranNumero && (
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Albarà {selectedEnvio.albaranNumero}
                          </Button>
                        )}
                        {selectedEnvio.firmaRecepcion && (
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Signatura
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo Nueva Incidencia */}
      <Dialog open={isIncidenciaOpen} onOpenChange={setIsIncidenciaOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] p-0 gap-0 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b bg-gradient-to-r from-slate-50 to-white">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">Registrar Incidència</DialogTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Reporta una incidència en aquest enviament
                  </p>
                </div>
              </div>
            </DialogHeader>
          </div>
          
          {/* Contenido scrolleable */}
          <ScrollArea className="max-h-[calc(85vh-200px)]">
            <div className="px-6 py-5 space-y-5">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-muted-foreground">Tipus d'incidència *</label>
                <Select 
                  value={incidenciaForm.tipo} 
                  onValueChange={(v) => setIncidenciaForm(prev => ({ ...prev, tipo: v as TipoIncidenciaEnvio }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipus..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(tipoIncidenciaConfig).map(([key, value]) => (
                      <SelectItem key={key} value={key}>{value.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-muted-foreground">Descripció *</label>
                <Textarea
                  value={incidenciaForm.descripcion}
                  onChange={(e) => setIncidenciaForm(prev => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Descriu la incidència en detall..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-muted-foreground">Unitats afectades</label>
                <Input
                  type="number"
                  min={0}
                  value={incidenciaForm.unidadesAfectadas}
                  onChange={(e) => setIncidenciaForm(prev => ({ ...prev, unidadesAfectadas: e.target.value }))}
                  placeholder="Nombre d'unitats"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide text-muted-foreground">Fotos</label>
                <div className="p-4 bg-slate-50 rounded-xl border">
                  <div className="flex flex-wrap gap-2">
                    {incidenciaForm.fotos.map((foto, i) => (
                      <div key={i} className="relative">
                        <div className="w-16 h-16 bg-white border rounded-lg flex items-center justify-center">
                          <Camera className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-5 w-5"
                          onClick={() => handleRemoveFoto(i)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-16 h-16"
                      onClick={handleAddFoto}
                    >
                      <Upload className="h-6 w-6" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Afegeix fotos per documentar la incidència
                  </p>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-slate-50 flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsIncidenciaOpen(false)}>
              Cancel·lar
            </Button>
            <Button onClick={handleGuardarIncidencia}>
              <Send className="mr-2 h-4 w-4" />
              Registrar Incidència
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
