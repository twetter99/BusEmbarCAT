'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Search, 
  Filter, 
  Truck, 
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  User,
  FileText,
  ChevronRight,
  PackageCheck,
  Timer,
  Building
} from 'lucide-react';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';

import { mockLliuraments, operadoresC5 } from '@/lib/central-compras-data';
import type { EstadoLliurament, TipusLliurament, Lliurament } from '@/lib/contrato-c5-types';

// Mapeo de estados
const estadoConfig: Record<EstadoLliurament, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; icon: React.ElementType }> = {
  pendent: { label: 'Pendent', variant: 'outline', icon: Clock },
  en_preparacio: { label: 'En preparació', variant: 'secondary', icon: Package },
  preparat: { label: 'Preparat', variant: 'default', icon: PackageCheck },
  en_transit: { label: 'En trànsit', variant: 'default', icon: Truck },
  lliurat: { label: 'Lliurat', variant: 'default', icon: CheckCircle2 },
  parcial: { label: 'Parcial', variant: 'destructive', icon: AlertCircle },
};

const tipusConfig: Record<TipusLliurament, { label: string; color: string }> = {
  normal: { label: 'Normal', color: 'bg-blue-100 text-blue-700' },
  urgencia: { label: 'Urgència', color: 'bg-red-100 text-red-700' },
  reposicio: { label: 'Reposició', color: 'bg-purple-100 text-purple-700' },
};

export default function LliuramentsPage() {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroOperador, setFiltroOperador] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [lliuramentSeleccionat, setLliuramentSeleccionat] = useState<Lliurament | null>(null);

  // Filtrar lliuraments
  const lliuramentsFiltrats = useMemo(() => {
    return mockLliuraments.filter(lli => {
      const matchBusqueda = busqueda === '' || 
        lli.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        lli.operadorNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        lli.operadorCodi.toLowerCase().includes(busqueda.toLowerCase());
      
      const matchEstado = filtroEstado === 'todos' || lli.estado === filtroEstado;
      const matchOperador = filtroOperador === 'todos' || lli.operadorId === filtroOperador;
      const matchTipo = filtroTipo === 'todos' || lli.tipo === filtroTipo;
      
      return matchBusqueda && matchEstado && matchOperador && matchTipo;
    });
  }, [busqueda, filtroEstado, filtroOperador, filtroTipo]);

  // KPIs
  const kpis = useMemo(() => {
    const pendents = mockLliuraments.filter(l => l.estado === 'pendent' || l.estado === 'en_preparacio').length;
    const enTransit = mockLliuraments.filter(l => l.estado === 'en_transit').length;
    const lliurats = mockLliuraments.filter(l => l.estado === 'lliurat').length;
    const urgencies = mockLliuraments.filter(l => l.tipo === 'urgencia').length;
    return { pendents, enTransit, lliurats, urgencies };
  }, []);

  // Calcular progreso de entrega
  const calcularProgreso = (lli: Lliurament) => {
    const totalSolicitado = lli.lineas.reduce((acc, l) => acc + l.cantidadSolicitada, 0);
    const totalEntregado = lli.lineas.reduce((acc, l) => acc + l.cantidadEntregada, 0);
    return totalSolicitado > 0 ? (totalEntregado / totalSolicitado) * 100 : 0;
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lliuraments a Operadors</h1>
          <p className="text-muted-foreground">
            Seguiment de lliuraments d'equipament als operadors de transport
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendents/En Preparació</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.pendents}</div>
            <p className="text-xs text-muted-foreground">lliuraments per processar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Trànsit</CardTitle>
            <Truck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{kpis.enTransit}</div>
            <p className="text-xs text-muted-foreground">en camí als operadors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lliurats</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{kpis.lliurats}</div>
            <p className="text-xs text-muted-foreground">completats amb èxit</p>
          </CardContent>
        </Card>

        <Card className={kpis.urgencies > 0 ? 'border-red-200 bg-red-50 dark:bg-red-950/20' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgències</CardTitle>
            <Timer className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{kpis.urgencies}</div>
            <p className="text-xs text-muted-foreground">des de buffer urgències</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Cerca</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Codi, operador..."
                  className="pl-8"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estat</Label>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Tots els estats" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Tots els estats</SelectItem>
                  {Object.entries(estadoConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Operador</Label>
              <Select value={filtroOperador} onValueChange={setFiltroOperador}>
                <SelectTrigger>
                  <SelectValue placeholder="Tots els operadors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Tots els operadors</SelectItem>
                  {operadoresC5.map((op) => (
                    <SelectItem key={op.id} value={op.id}>{op.codigo} - {op.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipus</Label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Tots els tipus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Tots els tipus</SelectItem>
                  {Object.entries(tipusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de lliuraments */}
      <Card>
        <CardHeader>
          <CardTitle>Lliuraments ({lliuramentsFiltrats.length})</CardTitle>
          <CardDescription>
            Llista de tots els lliuraments als operadors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Codi</TableHead>
                <TableHead>Operador</TableHead>
                <TableHead>Tipus</TableHead>
                <TableHead>Estat</TableHead>
                <TableHead>Data Creació</TableHead>
                <TableHead>Entrega Prev.</TableHead>
                <TableHead>Progrés</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lliuramentsFiltrats.map((lli) => {
                const config = estadoConfig[lli.estado];
                const tipusConf = tipusConfig[lli.tipo];
                const progreso = calcularProgreso(lli);
                const IconEstado = config.icon;
                
                return (
                  <TableRow 
                    key={lli.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setLliuramentSeleccionat(lli)}
                  >
                    <TableCell className="font-mono font-medium">{lli.codigo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{lli.operadorCodi}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {lli.operadorNombre}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${tipusConf.color}`}>
                        {tipusConf.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={config.variant} className="gap-1">
                        <IconEstado className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(lli.fechaCreacion, 'dd/MM/yyyy', { locale: ca })}
                    </TableCell>
                    <TableCell>
                      {lli.fechaEntrega 
                        ? format(lli.fechaEntrega, 'dd/MM/yyyy', { locale: ca })
                        : lli.fechaEstimadaEntrega 
                          ? <span className="text-muted-foreground">{format(lli.fechaEstimadaEntrega, 'dd/MM/yyyy', { locale: ca })}</span>
                          : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <Progress value={progreso} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground w-10 text-right">
                          {Math.round(progreso)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {lliuramentsFiltrats.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No s'han trobat lliuraments amb els filtres aplicats</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sheet de detalle */}
      <Sheet open={!!lliuramentSeleccionat} onOpenChange={() => setLliuramentSeleccionat(null)}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          {lliuramentSeleccionat && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {lliuramentSeleccionat.codigo}
                </SheetTitle>
                <SheetDescription>
                  Detall del lliurament a {lliuramentSeleccionat.operadorNombre}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Estado y tipo */}
                <div className="flex items-center gap-3">
                  <Badge variant={estadoConfig[lliuramentSeleccionat.estado].variant} className="gap-1">
                    {(() => { const Icon = estadoConfig[lliuramentSeleccionat.estado].icon; return <Icon className="h-3 w-3" />; })()}
                    {estadoConfig[lliuramentSeleccionat.estado].label}
                  </Badge>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${tipusConfig[lliuramentSeleccionat.tipo].color}`}>
                    {tipusConfig[lliuramentSeleccionat.tipo].label}
                  </span>
                </div>

                {/* Timeline de fechas */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Cronologia</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Creat:</span>
                      <span>{format(lliuramentSeleccionat.fechaCreacion, 'dd/MM/yyyy HH:mm', { locale: ca })}</span>
                    </div>
                    {lliuramentSeleccionat.fechaPreparacion && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Preparat:</span>
                        <span>{format(lliuramentSeleccionat.fechaPreparacion, 'dd/MM/yyyy HH:mm', { locale: ca })}</span>
                      </div>
                    )}
                    {lliuramentSeleccionat.fechaEnvio && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Enviat:</span>
                        <span>{format(lliuramentSeleccionat.fechaEnvio, 'dd/MM/yyyy HH:mm', { locale: ca })}</span>
                      </div>
                    )}
                    {lliuramentSeleccionat.fechaEntrega ? (
                      <div className="flex justify-between text-green-600">
                        <span>Lliurat:</span>
                        <span className="font-medium">{format(lliuramentSeleccionat.fechaEntrega, 'dd/MM/yyyy HH:mm', { locale: ca })}</span>
                      </div>
                    ) : lliuramentSeleccionat.fechaEstimadaEntrega && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Previst:</span>
                        <span className="text-blue-600">{format(lliuramentSeleccionat.fechaEstimadaEntrega, 'dd/MM/yyyy', { locale: ca })}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Información de entrega */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Dades d'Entrega
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Adreça:</span>
                      <p className="font-medium">{lliuramentSeleccionat.direccionEntrega}</p>
                    </div>
                    {lliuramentSeleccionat.contactoEntrega && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{lliuramentSeleccionat.contactoEntrega}</span>
                      </div>
                    )}
                    {lliuramentSeleccionat.telefonoContacto && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{lliuramentSeleccionat.telefonoContacto}</span>
                      </div>
                    )}
                    {lliuramentSeleccionat.albaranEntrega && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>Albarà: <span className="font-mono">{lliuramentSeleccionat.albaranEntrega}</span></span>
                      </div>
                    )}
                    {lliuramentSeleccionat.firmaRecepcion && (
                      <Badge variant="outline" className="text-green-600 gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Signat
                      </Badge>
                    )}
                  </CardContent>
                </Card>

                {/* Pedido proveedor relacionado */}
                {lliuramentSeleccionat.pedidoProveedorCodigo && (
                  <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                    <CardContent className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Truck className="h-4 w-4 text-blue-600" />
                          <span className="text-muted-foreground">Comanda WINFIN:</span>
                        </div>
                        <span className="font-mono font-medium text-blue-700">
                          {lliuramentSeleccionat.pedidoProveedorCodigo}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Líneas del lliurament */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Línies ({lliuramentSeleccionat.lineas.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lliuramentSeleccionat.lineas.map((linea) => {
                        const progresoLinea = linea.cantidadSolicitada > 0 
                          ? (linea.cantidadEntregada / linea.cantidadSolicitada) * 100 
                          : 0;
                        
                        return (
                          <div key={linea.id} className="rounded-lg border p-3">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <span className="font-mono text-xs text-muted-foreground">{linea.productoSku}</span>
                                <p className="font-medium">{linea.productoNombre}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                              <div>
                                <span className="text-muted-foreground">Sol·licitat:</span>
                                <span className="ml-1 font-medium">{linea.cantidadSolicitada}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Preparat:</span>
                                <span className="ml-1 font-medium">{linea.cantidadPreparada}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Lliurat:</span>
                                <span className="ml-1 font-medium text-green-600">{linea.cantidadEntregada}</span>
                              </div>
                            </div>
                            <Progress value={progresoLinea} className="h-1.5" />
                            {linea.numerosSerieEntregados && linea.numerosSerieEntregados.length > 0 && (
                              <div className="mt-2">
                                <span className="text-xs text-muted-foreground">Núm. Sèrie: </span>
                                <span className="text-xs font-mono">
                                  {linea.numerosSerieEntregados.slice(0, 3).join(', ')}
                                  {linea.numerosSerieEntregados.length > 3 && ` +${linea.numerosSerieEntregados.length - 3} més`}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Observaciones */}
                {lliuramentSeleccionat.observaciones && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Observacions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{lliuramentSeleccionat.observaciones}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Acciones */}
                <div className="flex gap-2 pt-4 border-t">
                  {lliuramentSeleccionat.estado === 'pendent' && (
                    <Button className="flex-1">
                      <Package className="mr-2 h-4 w-4" />
                      Iniciar Preparació
                    </Button>
                  )}
                  {lliuramentSeleccionat.estado === 'en_preparacio' && (
                    <Button className="flex-1">
                      <PackageCheck className="mr-2 h-4 w-4" />
                      Marcar Preparat
                    </Button>
                  )}
                  {lliuramentSeleccionat.estado === 'preparat' && (
                    <Button className="flex-1">
                      <Truck className="mr-2 h-4 w-4" />
                      Registrar Enviament
                    </Button>
                  )}
                  {lliuramentSeleccionat.estado === 'en_transit' && (
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Confirmar Lliurament
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setLliuramentSeleccionat(null)}>
                    Tancar
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}
