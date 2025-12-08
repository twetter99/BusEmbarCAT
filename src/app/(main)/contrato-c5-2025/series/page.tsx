'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Search, 
  Package, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Wrench,
  XCircle,
  MapPin,
  Bus,
  Building2,
  Calendar,
  History,
  Filter,
  X,
  ArrowRight,
  Truck,
  FileText,
} from 'lucide-react';
import { mockNumeroSeriesC5, mockMovimientosSerieC5, equiposPrincipalesC5 } from '@/lib/contrato-c5-data';
import { mockOperators } from '@/lib/data';
import type { NumeroSerieC5, MovimientoSerieC5, EstadoNumeroSerieC5, UbicacionSerieC5 } from '@/lib/contrato-c5-types';
import { format, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { ca } from 'date-fns/locale';

// Configuración de badges por estado
const estadoBadgeConfig: Record<EstadoNumeroSerieC5, { variant: 'default' | 'secondary' | 'outline' | 'destructive', label: string, icon: React.ElementType }> = {
  disponible: { variant: 'default', label: 'Disponible', icon: CheckCircle },
  reservado: { variant: 'secondary', label: 'Reservat', icon: Clock },
  instalado: { variant: 'default', label: 'Instal·lat', icon: Bus },
  en_garantia: { variant: 'outline', label: 'En Garantia', icon: AlertTriangle },
  en_reparacion: { variant: 'outline', label: 'En Reparació', icon: Wrench },
  baja: { variant: 'destructive', label: 'Baixa', icon: XCircle },
};

const ubicacionLabels: Record<UbicacionSerieC5, string> = {
  almacen_sermetra: 'Magatzem Sermetra',
  operador: 'Operador',
  vehiculo: 'Vehicle',
  proveedor: 'Proveïdor',
  baja: 'Baixa',
};

const tipoMovimientoLabels: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  entrada: { label: 'Entrada', icon: Package, color: 'text-green-600' },
  reserva: { label: 'Reserva', icon: Clock, color: 'text-blue-600' },
  liberacion_reserva: { label: 'Alliberament reserva', icon: CheckCircle, color: 'text-blue-600' },
  instalacion: { label: 'Instal·lació', icon: Bus, color: 'text-green-600' },
  desinstalacion: { label: 'Desinstal·lació', icon: Truck, color: 'text-orange-600' },
  garantia_salida: { label: 'Sortida garantia', icon: AlertTriangle, color: 'text-yellow-600' },
  garantia_entrada: { label: 'Retorn garantia', icon: CheckCircle, color: 'text-green-600' },
  reparacion_salida: { label: 'Sortida reparació', icon: Wrench, color: 'text-orange-600' },
  reparacion_entrada: { label: 'Retorn reparació', icon: CheckCircle, color: 'text-green-600' },
  baja: { label: 'Baixa', icon: XCircle, color: 'text-red-600' },
};

export default function SeriesPage() {
  // Estado de filtros
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterProducto, setFilterProducto] = React.useState<string>('all');
  const [filterEstado, setFilterEstado] = React.useState<string>('all');
  const [filterOperador, setFilterOperador] = React.useState<string>('all');
  
  // Estado del sheet de detalle
  const [selectedSerie, setSelectedSerie] = React.useState<NumeroSerieC5 | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  // Filtrar series
  const seriesFiltradas = React.useMemo(() => {
    return mockNumeroSeriesC5.filter(serie => {
      // Búsqueda por texto
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchSearch = 
          serie.numeroSerie.toLowerCase().includes(search) ||
          serie.lote?.toLowerCase().includes(search) ||
          serie.sku.toLowerCase().includes(search) ||
          serie.productoNombre.toLowerCase().includes(search) ||
          serie.vehiculoCalca?.toLowerCase().includes(search) ||
          serie.vehiculoMatricula?.toLowerCase().includes(search);
        if (!matchSearch) return false;
      }
      
      // Filtro por producto
      if (filterProducto !== 'all' && serie.productoId !== filterProducto) return false;
      
      // Filtro por estado
      if (filterEstado !== 'all' && serie.estado !== filterEstado) return false;
      
      // Filtro por operador
      if (filterOperador !== 'all' && serie.operadorId !== filterOperador) return false;
      
      return true;
    });
  }, [searchTerm, filterProducto, filterEstado, filterOperador]);

  // KPIs
  const kpis = React.useMemo(() => {
    const thisMonth = { start: startOfMonth(new Date()), end: endOfMonth(new Date()) };
    
    return {
      total: mockNumeroSeriesC5.length,
      disponibles: mockNumeroSeriesC5.filter(s => s.estado === 'disponible').length,
      instaladas: mockNumeroSeriesC5.filter(s => s.estado === 'instalado').length,
      reservadas: mockNumeroSeriesC5.filter(s => s.estado === 'reservado').length,
      enGarantiaReparacion: mockNumeroSeriesC5.filter(s => s.estado === 'en_garantia' || s.estado === 'en_reparacion').length,
      bajas: mockNumeroSeriesC5.filter(s => s.estado === 'baja').length,
      instaladasEsteMes: mockNumeroSeriesC5.filter(s => 
        s.fechaInstalacion && isWithinInterval(s.fechaInstalacion, thisMonth)
      ).length,
    };
  }, []);

  // Obtener movimientos de una serie
  const getMovimientosSerie = (serieId: string): MovimientoSerieC5[] => {
    return mockMovimientosSerieC5
      .filter(m => m.numeroSerieId === serieId)
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime()); // Más reciente primero
  };

  // Abrir detalle de serie
  const handleOpenDetail = (serie: NumeroSerieC5) => {
    setSelectedSerie(serie);
    setIsDetailOpen(true);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setFilterProducto('all');
    setFilterEstado('all');
    setFilterOperador('all');
  };

  const hasActiveFilters = searchTerm || filterProducto !== 'all' || filterEstado !== 'all' || filterOperador !== 'all';

  // Operadores únicos que tienen series
  const operadoresConSeries = React.useMemo(() => {
    const ids = new Set(mockNumeroSeriesC5.filter(s => s.operadorId).map(s => s.operadorId!));
    return mockOperators.filter(op => ids.has(op.id));
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sèries i Lots</h1>
          <p className="text-muted-foreground">
            Traçabilitat i historial de números de sèrie
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sèries</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.total}</div>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-green-50 dark:bg-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instal·lades</CardTitle>
            <Bus className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{kpis.instaladas}</div>
            <p className="text-xs text-muted-foreground">{kpis.instaladasEsteMes} aquest mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disponibles</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.disponibles}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservades</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.reservadas}</div>
          </CardContent>
        </Card>

        <Card className={kpis.enGarantiaReparacion > 0 ? 'border-orange-500/30 bg-orange-50 dark:bg-orange-950/20' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Garantia/Rep.</CardTitle>
            <Wrench className={`h-4 w-4 ${kpis.enGarantiaReparacion > 0 ? 'text-orange-600' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${kpis.enGarantiaReparacion > 0 ? 'text-orange-600' : ''}`}>
              {kpis.enGarantiaReparacion}
            </div>
          </CardContent>
        </Card>

        <Card className={kpis.bajas > 0 ? 'border-red-500/30 bg-red-50 dark:bg-red-950/20' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Baixes</CardTitle>
            <XCircle className={`h-4 w-4 ${kpis.bajas > 0 ? 'text-red-600' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${kpis.bajas > 0 ? 'text-red-600' : ''}`}>
              {kpis.bajas}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <CardTitle className="text-base">Filtres</CardTitle>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-1 h-3 w-3" />
                Netejar filtres
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Búsqueda */}
            <div className="space-y-2">
              <Label>Cercar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nº sèrie, lot, matrícula..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Producto */}
            <div className="space-y-2">
              <Label>Producte</Label>
              <Select value={filterProducto} onValueChange={setFilterProducto}>
                <SelectTrigger>
                  <SelectValue placeholder="Tots els productes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tots els productes</SelectItem>
                  {equiposPrincipalesC5.map((prod) => (
                    <SelectItem key={prod.id} value={prod.id}>
                      {prod.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label>Estat</Label>
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Tots els estats" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tots els estats</SelectItem>
                  {Object.entries(estadoBadgeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Operador */}
            <div className="space-y-2">
              <Label>Operador</Label>
              <Select value={filterOperador} onValueChange={setFilterOperador}>
                <SelectTrigger>
                  <SelectValue placeholder="Tots els operadors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tots els operadors</SelectItem>
                  {operadoresConSeries.map((op) => (
                    <SelectItem key={op.id} value={op.id}>
                      {op.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de series */}
      <Card>
        <CardHeader>
          <CardTitle>Llistat de Sèries</CardTitle>
          <CardDescription>
            {seriesFiltradas.length} de {mockNumeroSeriesC5.length} sèries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Sèrie</TableHead>
                <TableHead>Lot</TableHead>
                <TableHead>Producte</TableHead>
                <TableHead>Estat</TableHead>
                <TableHead>Ubicació</TableHead>
                <TableHead>Operador/Vehicle</TableHead>
                <TableHead>Data Entrada</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seriesFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No s'han trobat sèries amb els filtres actuals
                  </TableCell>
                </TableRow>
              ) : (
                seriesFiltradas.map((serie) => {
                  const estadoConfig = estadoBadgeConfig[serie.estado];
                  const IconEstado = estadoConfig.icon;
                  
                  return (
                    <TableRow 
                      key={serie.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleOpenDetail(serie)}
                    >
                      <TableCell className="font-mono font-medium">{serie.numeroSerie}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{serie.lote || '-'}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{serie.productoNombre}</span>
                          <span className="text-xs text-muted-foreground font-mono">{serie.sku}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={estadoConfig.variant} className="gap-1">
                          <IconEstado className="h-3 w-3" />
                          {estadoConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{ubicacionLabels[serie.ubicacion]}</TableCell>
                      <TableCell>
                        {serie.ubicacion === 'vehiculo' ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">Calca {serie.vehiculoCalca}</span>
                            <span className="text-xs text-muted-foreground">{serie.operadorNombre?.split(',')[0]}</span>
                          </div>
                        ) : serie.operadorNombre ? (
                          <span className="text-sm">{serie.operadorNombre.split(',')[0]}</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(serie.fechaEntrada, 'dd/MM/yyyy', { locale: ca })}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <History className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de detalle */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] p-0 gap-0 overflow-hidden">
          {selectedSerie && (
            <>
              {/* Header */}
              <div className="px-6 py-5 border-b bg-gradient-to-r from-slate-50 to-white">
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-semibold">
                        {selectedSerie.numeroSerie}
                      </DialogTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {selectedSerie.productoNombre} · {selectedSerie.sku}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {(() => {
                      const config = estadoBadgeConfig[selectedSerie.estado];
                      const Icon = config.icon;
                      return (
                        <Badge variant={config.variant} className="gap-1">
                          <Icon className="h-3 w-3" />
                          {config.label}
                        </Badge>
                      );
                    })()}
                  </div>
                </DialogHeader>
              </div>

              {/* Contenido scrolleable */}
              <ScrollArea className="max-h-[calc(85vh-140px)]">
                <div className="px-6 py-5 space-y-5">
                  {/* Información de ubicación */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      Ubicació
                    </label>
                    <div className="p-4 bg-slate-50 rounded-xl border">
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ubicació</span>
                          <span className="font-medium">{ubicacionLabels[selectedSerie.ubicacion]}</span>
                        </div>
                        {selectedSerie.operadorNombre && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Operador</span>
                            <span className="font-medium">{selectedSerie.operadorNombre.split(',')[0]}</span>
                          </div>
                        )}
                        {selectedSerie.vehiculoCalca && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Vehicle</span>
                            <span className="font-medium">Calca {selectedSerie.vehiculoCalca} ({selectedSerie.vehiculoMatricula})</span>
                          </div>
                        )}
                        {selectedSerie.lote && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Lot</span>
                            <span className="font-mono font-medium">{selectedSerie.lote}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fechas */}
                  <div className="space-y-2">
                    <div className="p-4 bg-slate-50 rounded-xl border">
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Entrada</span>
                          <span className="font-medium">{format(selectedSerie.fechaEntrada, 'dd/MM/yyyy', { locale: ca })}</span>
                        </div>
                        {selectedSerie.fechaReserva && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Reserva</span>
                            <span className="font-medium">{format(selectedSerie.fechaReserva, 'dd/MM/yyyy', { locale: ca })}</span>
                          </div>
                        )}
                        {selectedSerie.fechaInstalacion && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Instal·lació</span>
                            <span className="font-medium">{format(selectedSerie.fechaInstalacion, 'dd/MM/yyyy', { locale: ca })}</span>
                          </div>
                        )}
                        {selectedSerie.fechaBaja && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Baixa</span>
                            <span className="font-medium text-red-600">{format(selectedSerie.fechaBaja, 'dd/MM/yyyy', { locale: ca })}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Referencias */}
                  {(selectedSerie.pedidoOrigenCodigo || selectedSerie.pedidoDestinoCodigo || selectedSerie.garantiaCodigo || selectedSerie.reparacionCodigo) && (
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5" />
                        Referències
                      </label>
                      <div className="p-4 bg-slate-50 rounded-xl border">
                        <div className="grid gap-2 text-sm">
                          {selectedSerie.pedidoOrigenCodigo && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Comanda origen</span>
                              <span className="font-mono font-medium text-blue-600">{selectedSerie.pedidoOrigenCodigo}</span>
                            </div>
                          )}
                          {selectedSerie.pedidoDestinoCodigo && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Comanda destí</span>
                              <span className="font-mono font-medium text-blue-600">{selectedSerie.pedidoDestinoCodigo}</span>
                            </div>
                          )}
                          {selectedSerie.garantiaCodigo && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Garantia</span>
                              <span className="font-mono font-medium text-yellow-600">{selectedSerie.garantiaCodigo}</span>
                            </div>
                          )}
                          {selectedSerie.reparacionCodigo && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Reparació</span>
                              <span className="font-mono font-medium text-orange-600">{selectedSerie.reparacionCodigo}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notas */}
                  {selectedSerie.notas && (
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wide text-muted-foreground">Notes</label>
                      <div className="p-4 bg-slate-50 rounded-xl border">
                        <p className="text-sm">{selectedSerie.notas}</p>
                      </div>
                    </div>
                  )}

                  {/* Historial de movimientos */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                      <History className="h-3.5 w-3.5" />
                      Historial de Moviments
                    </label>
                    <div className="p-4 bg-slate-50 rounded-xl border max-h-[200px] overflow-y-auto">
                      <div className="space-y-3">
                        {getMovimientosSerie(selectedSerie.id).map((mov, index) => {
                          const tipoConfig = tipoMovimientoLabels[mov.tipo] || { label: mov.tipo, icon: Package, color: 'text-gray-600' };
                          const IconTipo = tipoConfig.icon;
                          
                          return (
                            <div key={mov.id} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className={`rounded-full p-1.5 bg-white border ${tipoConfig.color}`}>
                                  <IconTipo className="h-3 w-3" />
                                </div>
                                {index < getMovimientosSerie(selectedSerie.id).length - 1 && (
                                  <div className="w-px h-full bg-border flex-1 my-1" />
                                )}
                              </div>
                              <div className="flex-1 pb-3">
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm font-medium ${tipoConfig.color}`}>
                                    {tipoConfig.label}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {format(mov.fecha, 'dd/MM/yyyy HH:mm', { locale: ca })}
                                  </span>
                                </div>
                                {mov.estadoAnterior && mov.estadoNuevo && mov.estadoAnterior !== mov.estadoNuevo && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                    <span>{estadoBadgeConfig[mov.estadoAnterior]?.label}</span>
                                    <ArrowRight className="h-3 w-3" />
                                    <span>{estadoBadgeConfig[mov.estadoNuevo]?.label}</span>
                                  </div>
                                )}
                                {mov.operadorNombre && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    <Building2 className="h-3 w-3 inline mr-1" />
                                    {mov.operadorNombre.split(',')[0]}
                                  </div>
                                )}
                                {mov.vehiculoCalca && (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    <Bus className="h-3 w-3 inline mr-1" />
                                    Calca {mov.vehiculoCalca}
                                  </div>
                                )}
                                {mov.notas && (
                                  <p className="text-xs text-muted-foreground mt-1 italic">
                                    {mov.notas}
                                  </p>
                                )}
                                <div className="text-xs text-muted-foreground mt-1">
                                  Per: {mov.realizadoPor}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
