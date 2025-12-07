'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ShieldCheck, 
  PlusCircle, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Wrench,
  Timer,
  CalendarClock,
  AlertCircle
} from 'lucide-react';
import { mockGarantiasC5, mockReparacionesC5 } from '@/lib/contrato-c5-data';
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
import { CONTRATO_C5_CONFIG } from '@/lib/contrato-c5-types';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';

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
    pendiente_repuesto: { variant: 'outline' },
    reparada: { variant: 'default' },
    sustitucion: { variant: 'default' },
    cerrada: { variant: 'default' },
  };
  const c = config[estado] || { variant: 'outline' };
  return <Badge variant={c.variant}>{LABELS_ESTADO_REPARACION[estado] || estado}</Badge>;
};

const tipoIncidenciaBadge = (tipo: 'averia' | 'vandalismo') => {
  const isVandalismo = tipo === 'vandalismo';
  return (
    <Badge variant={isVandalismo ? 'destructive' : 'outline'}>
      {LABELS_TIPO_INCIDENCIA[tipo]}
    </Badge>
  );
};

export default function GarantiasPage() {
  // Estadísticas de garantías
  const garantiasVigentes = mockGarantiasC5.filter(g => g.estado === 'vigente').length;
  const garantiasProximasVencer = mockGarantiasC5.filter(g => garantiaProximaVencer(g)).length;
  
  // Estadísticas de reparaciones
  const reparacionesAbiertas = mockReparacionesC5.filter(r => r.estado !== 'cerrada');
  const reparacionesEnSLA = mockReparacionesC5.filter(cumpleSLA).length;
  const reparacionesFueraSLA = mockReparacionesC5.filter(r => !cumpleSLA(r)).length;
  const reparacionesEnRiesgo = mockReparacionesC5.filter(slaEnRiesgo).length;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Garanties i Reparacions</h1>
          <p className="text-muted-foreground">
            Garantia {CONTRATO_C5_CONFIG.garantiaMeses} mesos | SLA Avaria: {CONTRATO_C5_CONFIG.slaReparacionAveriaDias}d | SLA Vandalisme: {CONTRATO_C5_CONFIG.slaReparacionVandalismoDias}d
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Reparació
        </Button>
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
            <CardTitle className="text-sm font-medium">Reparacions Obertes</CardTitle>
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
            Reparacions ({mockReparacionesC5.length})
          </TabsTrigger>
          <TabsTrigger value="garantias">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Garanties ({mockGarantiasC5.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB: Reparaciones con tracking SLA */}
        <TabsContent value="reparaciones">
          <Card>
            <CardHeader>
              <CardTitle>Llistat de Reparacions</CardTitle>
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
                    <TableHead>SLA</TableHead>
                    <TableHead>Progrés SLA</TableHead>
                    <TableHead>Data Límit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReparacionesC5.map((rep) => {
                    const diasRestantes = diasRestantesSLA(rep);
                    const porcentajeSLA = porcentajeAvanceSLA(rep);
                    const enRiesgo = slaEnRiesgo(rep);
                    const cumple = cumpleSLA(rep);
                    const isCerrada = rep.estado === 'cerrada';
                    
                    // Determinar color de progreso
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
                        <TableCell className="text-sm">{rep.operadorNombre.split(',')[0]}</TableCell>
                        <TableCell>{estadoReparacionBadge(rep.estado)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Timer className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{rep.slaDias}d</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 w-32">
                            <Progress 
                              value={Math.min(porcentajeSLA, 100)} 
                              className={`h-2 ${progressColor}`}
                            />
                            <span className={`text-xs font-medium min-w-[40px] ${
                              isCerrada && cumple ? 'text-green-600' : 
                              !cumple ? 'text-destructive' : 
                              enRiesgo ? 'text-orange-600' : ''
                            }`}>
                              {isCerrada ? (
                                cumple ? '✓' : '✗'
                              ) : (
                                `${diasRestantes}d`
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CalendarClock className="h-4 w-4 text-muted-foreground" />
                            {format(rep.fechaLimiteSLA, 'dd/MM/yyyy', { locale: ca })}
                          </div>
                          {!isCerrada && (
                            <div className={`text-xs ${enRiesgo ? 'text-orange-600 font-medium' : !cumple ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                              {enRiesgo && <AlertCircle className="inline h-3 w-3 mr-1" />}
                              {!cumple ? 'Fora de termini!' : enRiesgo ? 'En risc!' : ''}
                            </div>
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
                        <TableCell className="text-sm">{gar.operadorNombre.split(',')[0]}</TableCell>
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
      </Tabs>
    </main>
  );
}
