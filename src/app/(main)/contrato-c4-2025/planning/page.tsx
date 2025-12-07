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
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Calendar,
  Users,
  Package,
  Download,
  Upload,
  Plus,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react';
import { C4_TOTAL_VALIDADORES, C4_REVISIONS_PER_ANY, C4_TECNICS_ASSIGNATS, c4TotalRevisionsAnuals } from '@/lib/contract-c4';

// Tipo para planificaciones con fechas
type PlanningSchedule = {
  id: string;
  cotxera: string;
  operador: string;
  dates: string[]; // Array de fechas ISO
  tecnic: string;
  cmgAuthorized?: boolean;
};

// Mock data con fechas específicas
const MOCK_SCHEDULES: PlanningSchedule[] = [
  {
    id: 'PLAN-001',
    cotxera: 'Barcelona - Casablanca',
    operador: 'TRANSPORTS CIUTAT COMTAL, SA',
    dates: ['2026-01-05', '2026-01-06', '2026-01-07'], // 3 días consecutivos - VIOLACIÓN
    tecnic: 'Joan R.',
  },
  {
    id: 'PLAN-002',
    cotxera: 'Mollet del Vallès',
    operador: 'EMPRESA SAGALÉS, SA',
    dates: ['2026-01-12', '2026-01-13'], // 2 días consecutivos - OK
    tecnic: 'Marta C.',
  },
  {
    id: 'PLAN-003',
    cotxera: 'Barcelona - Sants',
    operador: 'MOVENTIA L\'HOSPITALET',
    dates: ['2026-01-20'], // 1 día - OK
    tecnic: 'Eric P.',
  },
];

// Función para detectar días consecutivos
function detectConsecutiveDays(dates: string[]): boolean {
  if (dates.length < 3) return false;
  
  const sortedDates = [...dates].sort();
  let consecutiveCount = 1;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      consecutiveCount++;
      if (consecutiveCount > 2) return true;
    } else {
      consecutiveCount = 1;
    }
  }
  
  return false;
}

export default function PlanningPage() {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedTrimester, setSelectedTrimester] = useState('all');
  const [schedules] = useState<PlanningSchedule[]>(MOCK_SCHEDULES);

  // Detectar violaciones de la regla
  const violations = useMemo(() => {
    return schedules.filter(schedule => {
      const hasViolation = detectConsecutiveDays(schedule.dates);
      return hasViolation && !schedule.cmgAuthorized;
    });
  }, [schedules]);

  const hasViolations = violations.length > 0;
  
  // KPI: Càlcul revisions planificades (centralitzat a lib)
  const TOTAL_VALIDADORES = C4_TOTAL_VALIDADORES;
  const REVISIONS_PER_ANY = C4_REVISIONS_PER_ANY;
  const totalRevisionsPlanificades = c4TotalRevisionsAnuals();
  const TECNICS_ASSIGNATS = C4_TECNICS_ASSIGNATS;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      {/* Título */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Planificació Anual C-4/2025</h1>
        <p className="text-muted-foreground">
          Planificació de les revisions programades per als tècnics durant l'exercici
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Validadores</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.198</div>
            <p className="text-xs text-muted-foreground">
              Segons PPT C-4/2025
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revisions Planificades</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevisionsPlanificades.toLocaleString('ca-ES')}</div>
            <p className="text-xs text-muted-foreground">
              {REVISIONS_PER_ANY} revisions/any × {TOTAL_VALIDADORES.toLocaleString('ca-ES')} unitats
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tècnics Assignats</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{TECNICS_ASSIGNATS}</div>
            <p className="text-xs text-muted-foreground">
              Equip operatiu
            </p>
          </CardContent>
        </Card>

        <Card className={hasViolations ? 'border-destructive' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes PPT</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${hasViolations ? 'text-destructive' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${hasViolations ? 'text-destructive' : ''}`}>
              {violations.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {hasViolations ? 'Dies consecutius excedits' : 'Cap incidència detectada'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerta de violaciones */}
      {hasViolations && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Incompliment PPT C-4/2025</AlertTitle>
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">
                El PPT C-4/2025 no permet programar més de 2 dies consecutius de manteniment en la mateixa cotxera.
              </p>
              <div className="mt-2">
                <p className="text-sm font-medium mb-1">Cotxeres afectades:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {violations.map((v) => (
                    <li key={v.id}>
                      <strong>{v.cotxera}</strong> - {v.operador} ({v.dates.length} dies programats)
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center space-x-2 mt-4 p-3 bg-background rounded-md border">
                <Checkbox id="cmg-auth" />
                <label
                  htmlFor="cmg-auth"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                >
                  <ShieldAlert className="h-4 w-4 text-amber-500" />
                  Autorització excepcional CMG (Coordinador Manteniment General)
                </label>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Calendari de Revisions</CardTitle>
              <CardDescription>Gestiona la planificació anual de manteniment</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nova Planificació
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Exercici</label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2027">2027</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Trimestre</label>
              <Select value={selectedTrimester} onValueChange={setSelectedTrimester}>
                <SelectTrigger>
                  <SelectValue placeholder="Tots els trimestres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tots els trimestres</SelectItem>
                  <SelectItem value="q1">1r Trimestre (Gen-Mar)</SelectItem>
                  <SelectItem value="q2">2n Trimestre (Abr-Jun)</SelectItem>
                  <SelectItem value="q3">3r Trimestre (Jul-Set)</SelectItem>
                  <SelectItem value="q4">4t Trimestre (Oct-Des)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabla de planificación */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Període</TableHead>
                  <TableHead>Operador</TableHead>
                  <TableHead>Validadores</TableHead>
                  <TableHead>Tècnic Assignat</TableHead>
                  <TableHead>Estat</TableHead>
                  <TableHead className="text-right">Accions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Q1 2026</TableCell>
                  <TableCell>TRANSPORTS CIUTAT COMTAL, SA</TableCell>
                  <TableCell>156</TableCell>
                  <TableCell>Joan R.</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500 hover:bg-green-600">Planificat</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Editar</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Q1 2026</TableCell>
                  <TableCell>EMPRESA SAGALÉS, SA</TableCell>
                  <TableCell>203</TableCell>
                  <TableCell>Marta C.</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500 hover:bg-green-600">Planificat</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Editar</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Q1 2026</TableCell>
                  <TableCell>MOVENTIA L'HOSPITALET</TableCell>
                  <TableCell>189</TableCell>
                  <TableCell>Eric P.</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500 hover:bg-green-600">Planificat</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Editar</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Q2 2026</TableCell>
                  <TableCell>EMPRESA CASAS, SA</TableCell>
                  <TableCell>145</TableCell>
                  <TableCell>Nuria G.</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500 hover:bg-green-600">Planificat</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Editar</Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Q2 2026</TableCell>
                  <TableCell>LA HISPANO IGUALADINA, SL</TableCell>
                  <TableCell>178</TableCell>
                  <TableCell>David S.</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500 hover:bg-green-600">Planificat</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Editar</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Informació de Planificació</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Freqüència de revisió:</span>
              <span className="font-medium">Semestral (2 vegades/any)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duració mitjana per revisió:</span>
              <span className="font-medium">90 minuts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total hores planificades (2026):</span>
              <span className="font-medium">{((totalRevisionsPlanificades * 90) / 60).toLocaleString('ca-ES')} hores</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-muted-foreground">Última actualització:</span>
              <span className="font-medium">1 de gener de 2026</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
