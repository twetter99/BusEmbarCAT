
'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  ClipboardCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Calendar,
  User,
  MapPin,
  Truck,
  Image as ImageIcon,
} from 'lucide-react';
import { 
  WORK_CHECKLISTS, 
  getWorkOrdersStats,
  getUniqueOperadores,
  getUniqueCotxeras,
  type WorkChecklist,
  type WorkStatus 
} from '@/lib/work-orders-data';

// Componente para mostrar el badge de estado
function StatusBadge({ status }: { status: WorkStatus }) {
  const config: Record<WorkStatus, { 
    label: string; 
    variant: 'destructive' | 'default'; 
    icon: typeof AlertCircle; 
    className?: string;
  }> = {
    pendent: { label: 'Pendent', variant: 'destructive', icon: AlertCircle },
    en_curs: { label: 'En Curs', variant: 'default', icon: Clock },
    completada: { label: 'Completada', variant: 'default', icon: CheckCircle2, className: 'bg-green-500 hover:bg-green-600' },
    incidencia: { label: 'Incidència', variant: 'destructive', icon: AlertCircle, className: 'bg-orange-500 hover:bg-orange-600' },
  };

  const { label, variant, icon: Icon, className } = config[status];

  return (
    <Badge variant={variant} className={className}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
}

// Modal para ver detalles de una OT
function WorkOrderDetailsModal({ workOrder }: { workOrder: WorkChecklist }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Veure Detalls
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ordre de Treball: {workOrder.otId}</DialogTitle>
          <DialogDescription>Detalls complets de la tasca de manteniment</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informació General</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Truck className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Vehicle</p>
                  <p className="text-muted-foreground">{workOrder.vehicle}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Cotxera</p>
                  <p className="text-muted-foreground">{workOrder.cotxera}</p>
                  <p className="text-xs text-muted-foreground">{workOrder.adreça}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Tècnic Assignat</p>
                  <p className="text-muted-foreground">{workOrder.tecnic}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ClipboardCheck className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Tipus de Treball</p>
                  <p className="text-muted-foreground">{workOrder.tipus}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="h-4 w-4 mt-0.5" />
                <div>
                  <p className="font-medium">Estat</p>
                  <div className="mt-1">
                    <StatusBadge status={workOrder.status} />
                  </div>
                </div>
              </div>
              {workOrder.duracioMin && (
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Duració</p>
                    <p className="text-muted-foreground">{workOrder.duracioMin} minuts</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Temporització */}
          {(workOrder.iniciISO || workOrder.fiISO) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Temporització</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                {workOrder.iniciISO && (
                  <div>
                    <p className="font-medium">Inici</p>
                    <p className="text-muted-foreground">
                      {new Date(workOrder.iniciISO).toLocaleString('ca-ES', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                )}
                {workOrder.fiISO && (
                  <div>
                    <p className="font-medium">Fi</p>
                    <p className="text-muted-foreground">
                      {new Date(workOrder.fiISO).toLocaleString('ca-ES', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Checklist */}
          {workOrder.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Checklist ({workOrder.items.length} punts)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pregunta</TableHead>
                      <TableHead className="w-24">Resposta</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="w-20 text-center">Fotos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workOrder.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.pregunta}</TableCell>
                        <TableCell>
                          {item.resposta === 'ok' && (
                            <Badge className="bg-green-500 hover:bg-green-600">OK</Badge>
                          )}
                          {item.resposta === 'no_ok' && (
                            <Badge variant="destructive">NO OK</Badge>
                          )}
                          {item.resposta === 'na' && (
                            <Badge variant="outline">N/A</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.notes || '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.fotos ? (
                            <div className="flex items-center justify-center gap-1">
                              <ImageIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{item.fotos}</span>
                            </div>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Observaciones */}
          {workOrder.observacions && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Observacions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{workOrder.observacions}</p>
              </CardContent>
            </Card>
          )}

          {/* Firma */}
          {workOrder.firma !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              {workOrder.firma ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-green-600 font-medium">Treball signat i certificat</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="text-orange-600 font-medium">Pendent de signatura</span>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ContratoC4WorkPage() {
  const [filterStatus, setFilterStatus] = useState<WorkStatus | 'all'>('all');
  const [filterOperador, setFilterOperador] = useState<string>('all');
  const [filterCotxera, setFilterCotxera] = useState<string>('all');

  const stats = useMemo(() => getWorkOrdersStats(), []);
  const operadores = useMemo(() => getUniqueOperadores(), []);
  const cotxeras = useMemo(() => getUniqueCotxeras(), []);

  // Filtrar órdenes de trabajo
  const filteredWorkOrders = useMemo(() => {
    return WORK_CHECKLISTS.filter((wo) => {
      if (filterStatus !== 'all' && wo.status !== filterStatus) return false;
      if (filterOperador !== 'all' && wo.operador !== filterOperador) return false;
      if (filterCotxera !== 'all' && wo.cotxera !== filterCotxera) return false;
      return true;
    });
  }, [filterStatus, filterOperador, filterCotxera]);

  // Agrupar por cotxera
  const groupedByCotxera = useMemo(() => {
    const grouped: Record<string, WorkChecklist[]> = {};
    filteredWorkOrders.forEach((wo) => {
      if (!grouped[wo.cotxera]) {
        grouped[wo.cotxera] = [];
      }
      grouped[wo.cotxera].push(wo);
    });
    return grouped;
  }, [filteredWorkOrders]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ordres de Treball</h1>
        <p className="text-muted-foreground">
          Gestió de tasques de manteniment - Contracte C-4/2025
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Vista només de consulta. L'inici i execució es realitza a <span className="font-medium">T‑MobiliCheck</span>.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total OTs</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendents</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.pendents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Curs</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.enCurs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completades</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completades}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidències</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.incidencies}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.percentatgeComplert.toFixed(1)}% completat
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Filtra les ordres de treball per estat, operador o cotxera</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Estat</label>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as WorkStatus | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="Tots els estats" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tots els estats</SelectItem>
                  <SelectItem value="pendent">Pendent</SelectItem>
                  <SelectItem value="en_curs">En Curs</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="incidencia">Incidència</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Operador</label>
              <Select value={filterOperador} onValueChange={setFilterOperador}>
                <SelectTrigger>
                  <SelectValue placeholder="Tots els operadors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tots els operadors</SelectItem>
                  {operadores.map((op) => (
                    <SelectItem key={op} value={op}>{op}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cotxera</label>
              <Select value={filterCotxera} onValueChange={setFilterCotxera}>
                <SelectTrigger>
                  <SelectValue placeholder="Totes les cotxeres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Totes les cotxeres</SelectItem>
                  {cotxeras.map((cot) => (
                    <SelectItem key={cot} value={cot}>{cot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listado agrupado por cotxera */}
      {Object.keys(groupedByCotxera).length === 0 ? (
        <Card>
          <CardContent className="flex h-[200px] items-center justify-center text-muted-foreground">
            No s'han trobat ordres de treball amb els filtres aplicats
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {Object.entries(groupedByCotxera).map(([cotxera, orders]) => {
            // Calcular estado principal
            const pendents = orders.filter(o => o.status === 'pendent').length;
            const enCurs = orders.filter(o => o.status === 'en_curs').length;
            const completades = orders.filter(o => o.status === 'completada').length;
            const incidencies = orders.filter(o => o.status === 'incidencia').length;
            
            let statusText = '';
            if (pendents > 0) statusText = `${pendents} pendent${pendents > 1 ? 's' : ''}`;
            else if (enCurs > 0) statusText = `${enCurs} en curs`;
            else if (completades > 0) statusText = `${completades} completada${completades > 1 ? 'des' : ''}`;
            else if (incidencies > 0) statusText = `${incidencies} incidència${incidencies > 1 ? 'es' : ''}`;
            
            return (
              <AccordionItem key={cotxera} value={cotxera} className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div className="text-left">
                        <p className="font-semibold">{orders[0].operador}</p>
                        <p className="text-sm text-muted-foreground">
                          {cotxera}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {orders.length} OT{orders.length !== 1 ? 's' : ''} {statusText && `- ${statusText}`}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-4">
                    {orders.map((order) => (
                      <div
                        key={order.otId}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium">{order.otId}</p>
                            <StatusBadge status={order.status} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">{order.tipus}</span> - {order.vehicle}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Tècnic: {order.tecnic}
                            {order.iniciISO && (
                              <>
                                <Calendar className="h-3 w-3 ml-2" />
                                {new Date(order.iniciISO).toLocaleDateString('ca-ES')}
                              </>
                            )}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <WorkOrderDetailsModal workOrder={order} />
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </main>
  );
}

    