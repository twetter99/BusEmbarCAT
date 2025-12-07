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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  FileText,
  Download,
  FileSpreadsheet,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Camera,
  FileSignature,
  User,
  ClipboardCheck,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { C4_TOTAL_VALIDADORES, c4RevisionsMensualsEstimades } from '@/lib/contract-c4';
import { 
  WORK_CHECKLISTS,
  getUniqueOperadores,
  getUniqueCotxeras,
  type WorkChecklist,
  type WorkStatus 
} from '@/lib/work-orders-data';

type ValidationStatus = 'pendent' | 'validat' | 'rebutjat';

type MonthlyReport = {
  id: string;
  month: string;
  year: number;
  otIds: string[];
  validationStatus: ValidationStatus;
  validatedBy?: string;
  validatedDate?: string;
  observations?: string;
  createdBy: string;
  createdDate: string;
  updatedBy?: string;
  updatedDate?: string;
};

// Mock data - Informes mensuales
const MONTHLY_REPORTS: MonthlyReport[] = [
  {
    id: 'INF-2025-10',
    month: 'Octubre',
    year: 2025,
    otIds: ['OT-CMG-26008', 'OT-CMG-26009'],
    validationStatus: 'validat',
    validatedBy: 'CMG - Joan Martínez',
    validatedDate: '2025-11-01T10:30:00Z',
    observations: 'Informe validat. Tots els treballs compleixen amb el PPT Sec. 2.1.2',
    createdBy: 'Marta C.',
    createdDate: '2025-10-31T18:00:00Z',
    updatedBy: 'CMG - Joan Martínez',
    updatedDate: '2025-11-01T10:30:00Z',
  },
];

// Componente Badge de validación
function ValidationBadge({ status }: { status: ValidationStatus }) {
  const config: Record<ValidationStatus, { 
    label: string; 
    icon: typeof Clock; 
    className: string;
  }> = {
    pendent: { label: 'Pendent Validació', icon: Clock, className: 'bg-yellow-500 hover:bg-yellow-600' },
    validat: { label: 'Validat CMG', icon: CheckCircle2, className: 'bg-green-500 hover:bg-green-600' },
    rebutjat: { label: 'Rebutjat', icon: XCircle, className: 'bg-red-500 hover:bg-red-600' },
  };

  const { label, icon: Icon, className } = config[status];

  return (
    <Badge className={className}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
}

// Modal de validación CMG
function ValidationModal({ report }: { report: MonthlyReport }) {
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>(report.validationStatus);
  const [observations, setObservations] = useState(report.observations || '');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileSignature className="h-4 w-4 mr-2" />
          Validar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Validació CMG - Informe {report.month} {report.year}</DialogTitle>
          <DialogDescription>
            Revisió i validació de l'informe mensual del Contracte C-4/2025
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Estat de Validació</Label>
            <Select value={validationStatus} onValueChange={(v) => setValidationStatus(v as ValidationStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendent">Pendent Validació</SelectItem>
                <SelectItem value="validat">Validat</SelectItem>
                <SelectItem value="rebutjat">Rebutjat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Observacions CMG</Label>
            <Textarea 
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Escriu les observacions de la validació..."
              className="min-h-[100px]"
            />
          </div>

          <div className="border-t pt-4 space-y-2 text-sm text-muted-foreground">
            <p><strong>OTs incloses:</strong> {report.otIds.length}</p>
            <p><strong>Creat per:</strong> {report.createdBy} - {new Date(report.createdDate).toLocaleString('ca-ES')}</p>
            {report.validatedBy && (
              <p><strong>Validat per:</strong> {report.validatedBy} - {report.validatedDate && new Date(report.validatedDate).toLocaleString('ca-ES')}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline">Cancel·lar</Button>
          <Button>Guardar Validació</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function TrackingPage() {
  const [filterMonth, setFilterMonth] = useState('10');
  const [filterYear, setFilterYear] = useState('2025');
  const [filterOperador, setFilterOperador] = useState('all');
  const [filterCotxera, setFilterCotxera] = useState('all');
  const [filterStatus, setFilterStatus] = useState<WorkStatus | 'all'>('all');

  const operadores = useMemo(() => getUniqueOperadores(), []);
  const cotxeras = useMemo(() => getUniqueCotxeras(), []);

  // Filtrar OTs del mes seleccionado
  const monthlyWorkOrders = useMemo(() => {
    return WORK_CHECKLISTS.filter(wo => {
      if (!wo.iniciISO && !wo.fiISO) return false;
      
      const date = new Date(wo.iniciISO || wo.fiISO!);
      const woMonth = date.getMonth() + 1;
      const woYear = date.getFullYear();
      
      const matchesDate = woMonth === parseInt(filterMonth) && woYear === parseInt(filterYear);
      const matchesOperador = filterOperador === 'all' || wo.operador === filterOperador;
      const matchesCotxera = filterCotxera === 'all' || wo.cotxera === filterCotxera;
      const matchesStatus = filterStatus === 'all' || wo.status === filterStatus;
      
      return matchesDate && matchesOperador && matchesCotxera && matchesStatus;
    });
  }, [filterMonth, filterYear, filterOperador, filterCotxera, filterStatus]);

  // Calcular KPIs
  const kpis = useMemo(() => {
    const planificades = c4RevisionsMensualsEstimades();
    const realitzades = monthlyWorkOrders.filter(wo => wo.status === 'completada').length;
    const percentatgeCompliment = planificades > 0 ? (realitzades / planificades) * 100 : 0;

    // KPI: Cumplimiento separación ≥4 meses
    const completadesAmbData = monthlyWorkOrders.filter(wo => wo.status === 'completada' && wo.fiISO);
    const compleixenSeparacio = completadesAmbData.length > 0 ? Math.floor(completadesAmbData.length * 0.95) : 0; // Mock: 95%
    const percentatgeSeparacio = completadesAmbData.length > 0 ? (compleixenSeparacio / completadesAmbData.length) * 100 : 0;

    // KPI: Incidencias por 1000 equipos
  const incidencies = monthlyWorkOrders.filter(wo => wo.status === 'incidencia').length;
  const totalEquips = C4_TOTAL_VALIDADORES; // Total validadoras según PPT
    const incidenciesPer1000 = (incidencies / totalEquips) * 1000;

    // KPI: Tiempo medio de cierre (en días)
    const otsAmbTemps = monthlyWorkOrders.filter(wo => wo.iniciISO && wo.fiISO);
    let tempsMitja = 0;
    if (otsAmbTemps.length > 0) {
      const totalDies = otsAmbTemps.reduce((sum, wo) => {
        const inici = new Date(wo.iniciISO!).getTime();
        const fi = new Date(wo.fiISO!).getTime();
        const dies = (fi - inici) / (1000 * 60 * 60 * 24);
        return sum + dies;
      }, 0);
      tempsMitja = totalDies / otsAmbTemps.length;
    }

    return {
      planificades,
      realitzades,
      percentatgeCompliment,
      percentatgeSeparacio,
      incidenciesPer1000,
      tempsMitja,
      totalOTs: monthlyWorkOrders.length,
      ambIncidencies: incidencies,
    };
  }, [monthlyWorkOrders]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Seguiment i Informes Mensuals C-4/2025</h1>
        <p className="text-muted-foreground">
          Control de compliment, validació CMG i generació d'informes contractuals
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planificades vs Realitzades</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.realitzades} / {kpis.planificades}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpis.percentatgeCompliment.toFixed(1)}% de compliment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Separació ≥4 Mesos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {kpis.percentatgeSeparacio.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Compliment PPT Sec. 2.1.1
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidències / 1000 Equips</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {kpis.incidenciesPer1000.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpis.ambIncidencies} incidències detectades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Mitjà de Tancament</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.tempsMitja.toFixed(1)} dies
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Des d'inici fins a finalització
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Vista Mensual</CardTitle>
              <CardDescription>Filtra i revisa les OTs del període seleccionat</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Exportar XLSX
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mes</label>
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Gener</SelectItem>
                  <SelectItem value="2">Febrer</SelectItem>
                  <SelectItem value="3">Març</SelectItem>
                  <SelectItem value="4">Abril</SelectItem>
                  <SelectItem value="5">Maig</SelectItem>
                  <SelectItem value="6">Juny</SelectItem>
                  <SelectItem value="7">Juliol</SelectItem>
                  <SelectItem value="8">Agost</SelectItem>
                  <SelectItem value="9">Setembre</SelectItem>
                  <SelectItem value="10">Octubre</SelectItem>
                  <SelectItem value="11">Novembre</SelectItem>
                  <SelectItem value="12">Desembre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Any</label>
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2027">2027</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Operador</label>
              <Select value={filterOperador} onValueChange={setFilterOperador}>
                <SelectTrigger>
                  <SelectValue placeholder="Tots" />
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
                  <SelectValue placeholder="Totes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Totes les cotxeres</SelectItem>
                  {cotxeras.map((cot) => (
                    <SelectItem key={cot} value={cot}>{cot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estat</label>
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as WorkStatus | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="Tots" />
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
          </div>

          {/* Tabla de OTs del mes */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>OT ID</TableHead>
                  <TableHead>Operador</TableHead>
                  <TableHead>Cotxera</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Tipus</TableHead>
                  <TableHead>Checklist</TableHead>
                  <TableHead>Incidències</TableHead>
                  <TableHead>Fotos</TableHead>
                  <TableHead>Firma</TableHead>
                  <TableHead>Estat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyWorkOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground h-24">
                      No s'han trobat ordres de treball per al període seleccionat
                    </TableCell>
                  </TableRow>
                ) : (
                  monthlyWorkOrders.map((wo) => {
                    const itemsCompletats = wo.items.filter(i => i.resposta === 'ok').length;
                    const totalItems = wo.items.length;
                    const incidencies = wo.items.filter(i => i.resposta === 'no_ok').length;
                    const totalFotos = wo.items.reduce((sum, i) => sum + (i.fotos || 0), 0);
                    
                    return (
                      <TableRow key={wo.otId}>
                        <TableCell className="font-medium">{wo.otId}</TableCell>
                        <TableCell className="text-sm">{wo.operador}</TableCell>
                        <TableCell className="text-sm">{wo.cotxera}</TableCell>
                        <TableCell>{wo.vehicle}</TableCell>
                        <TableCell>{wo.tipus}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <ClipboardCheck className="h-3 w-3" />
                            {itemsCompletats}/{totalItems}
                          </div>
                        </TableCell>
                        <TableCell>
                          {incidencies > 0 ? (
                            <Badge variant="destructive" className="text-xs">
                              {incidencies}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {totalFotos > 0 ? (
                            <div className="flex items-center gap-1 text-sm">
                              <Camera className="h-3 w-3" />
                              {totalFotos}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {wo.firma ? (
                            <FileSignature className="h-4 w-4 text-green-600" />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={wo.status === 'completada' ? 'default' : 'outline'} className={
                            wo.status === 'completada' ? 'bg-green-500 hover:bg-green-600' :
                            wo.status === 'incidencia' ? 'bg-orange-500 hover:bg-orange-600' :
                            wo.status === 'en_curs' ? 'bg-blue-500 hover:bg-blue-600' :
                            ''
                          }>
                            {wo.status === 'pendent' ? 'Pendent' :
                             wo.status === 'en_curs' ? 'En Curs' :
                             wo.status === 'completada' ? 'Completada' :
                             'Incidència'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Validación CMG */}
      <Card>
        <CardHeader>
          <CardTitle>Flux de Validació CMG</CardTitle>
          <CardDescription>
            Validació dels informes mensuals pel Consorci Metropolità de Barcelona
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Informe</TableHead>
                  <TableHead>Període</TableHead>
                  <TableHead>OTs Incloses</TableHead>
                  <TableHead>Estat Validació</TableHead>
                  <TableHead>Validat Per</TableHead>
                  <TableHead>Data Validació</TableHead>
                  <TableHead>Observacions</TableHead>
                  <TableHead className="text-right">Accions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MONTHLY_REPORTS.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.id}</TableCell>
                    <TableCell>{report.month} {report.year}</TableCell>
                    <TableCell>{report.otIds.length} OTs</TableCell>
                    <TableCell>
                      <ValidationBadge status={report.validationStatus} />
                    </TableCell>
                    <TableCell className="text-sm">
                      {report.validatedBy || '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {report.validatedDate ? new Date(report.validatedDate).toLocaleDateString('ca-ES') : '-'}
                    </TableCell>
                    <TableCell className="text-sm max-w-xs truncate">
                      {report.observations || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <ValidationModal report={report} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Auditoría */}
      <Card>
        <CardHeader>
          <CardTitle>Registre d'Auditoria</CardTitle>
          <CardDescription>Traçabilitat de creació i modificació dels informes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MONTHLY_REPORTS.map((report) => (
              <div key={report.id} className="border-l-4 border-primary pl-4 py-2 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{report.id}</p>
                  <Badge variant="outline">{report.month} {report.year}</Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <strong>Creat per:</strong> {report.createdBy} - {new Date(report.createdDate).toLocaleString('ca-ES')}
                  </p>
                  {report.updatedBy && report.updatedDate && (
                    <p className="flex items-center gap-2">
                      <User className="h-3 w-3" />
                      <strong>Actualitzat per:</strong> {report.updatedBy} - {new Date(report.updatedDate).toLocaleString('ca-ES')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
