'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
  Eye
} from 'lucide-react';
import { mockPedidosC5 } from '@/lib/contrato-c5-data';
import { CONTRATO_C5_CONFIG } from '@/lib/contrato-c5-types';
import { calcularComponentesKit, verificarStockParaKits } from '@/lib/contrato-c5-utils';
import { format, differenceInDays, isAfter, isBefore } from 'date-fns';
import { ca } from 'date-fns/locale';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

export default function PedidosPage() {
  const [expandedPedido, setExpandedPedido] = React.useState<string | null>(null);
  
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

  // Verificar si hay stock para un pedido
  const verificarStockPedido = (pedidoId: string) => {
    const pedido = mockPedidosC5.find(p => p.id === pedidoId);
    if (!pedido) return { suficiente: true, faltantes: [] };
    
    // Buscar líneas de Kit Integral
    const lineaKit = pedido.lineas.find(l => l.productoId === 'EP-003');
    if (!lineaKit) return { suficiente: true, faltantes: [] };
    
    return verificarStockParaKits(lineaKit.cantidadPedida - lineaKit.cantidadEntregada);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Comandes i Entregues</h1>
          <p className="text-muted-foreground">
            Gestió de comandes d'operadors - Termini màx. {CONTRATO_C5_CONFIG.plazoMaximoEntregaMeses} mesos
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Comanda
        </Button>
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
                        
                        {pedido.direccionEntrega && (
                          <div className="mt-4 text-sm">
                            <span className="font-medium">Adreça d'entrega:</span>{' '}
                            <span className="text-muted-foreground">{pedido.direccionEntrega}</span>
                          </div>
                        )}
                        
                        <div className="mt-4 flex gap-2">
                          <Button size="sm">
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
    </main>
  );
}
