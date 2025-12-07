'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  Truck, 
  Package,
  CheckCircle,
  Clock,
  MapPin,
  FileText
} from 'lucide-react';
import { mockPedidosC5 } from '@/lib/contrato-c5-data';
import { format, differenceInDays } from 'date-fns';
import { ca } from 'date-fns/locale';

export default function LogisticaPage() {
  // Filtrar pedidos por estado
  const pedidosEnPreparacion = mockPedidosC5.filter(p => p.estado === 'en_preparacion');
  const pedidosConfirmados = mockPedidosC5.filter(p => p.estado === 'confirmado');
  const pedidosEntregados = mockPedidosC5.filter(p => p.estado === 'entregado');

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Logística i Enviaments</h1>
          <p className="text-muted-foreground">Control d'enviaments i lliuraments d'equipament</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendents Preparar</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pedidosConfirmados.length}</div>
            <p className="text-xs text-muted-foreground">comandes confirmades</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Preparació</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pedidosEnPreparacion.length}</div>
            <p className="text-xs text-muted-foreground">en procés de picking</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-green-50 dark:bg-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lliurats</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{pedidosEntregados.length}</div>
            <p className="text-xs text-muted-foreground">enviaments completats</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unitats Enviades</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pedidosEntregados.reduce((acc, p) => 
                acc + p.lineas.reduce((sum, l) => sum + l.cantidadEntregada, 0), 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">equipos lliurats</p>
          </CardContent>
        </Card>
      </div>

      {/* Pedidos pendientes de preparación */}
      <Card>
        <CardHeader>
          <CardTitle>Comandes Pendents de Preparació</CardTitle>
          <CardDescription>Picking i empaquetat per a enviament</CardDescription>
        </CardHeader>
        <CardContent>
          {(pedidosConfirmados.length > 0 || pedidosEnPreparacion.length > 0) ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Codi</TableHead>
                  <TableHead>Operador</TableHead>
                  <TableHead>Estat</TableHead>
                  <TableHead>Unitats</TableHead>
                  <TableHead>Adreça</TableHead>
                  <TableHead>Data Límit</TableHead>
                  <TableHead>Dies Restants</TableHead>
                  <TableHead>Accions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...pedidosConfirmados, ...pedidosEnPreparacion].map((pedido) => {
                  const totalUnidades = pedido.lineas.reduce((acc, l) => acc + l.cantidadPedida, 0);
                  const diasRestantes = pedido.fechaEntregaLimite 
                    ? differenceInDays(pedido.fechaEntregaLimite, new Date())
                    : null;
                  
                  return (
                    <TableRow key={pedido.id}>
                      <TableCell className="font-medium">{pedido.codigo}</TableCell>
                      <TableCell>{pedido.operadorNombre.split(',')[0]}</TableCell>
                      <TableCell>
                        <Badge variant={pedido.estado === 'en_preparacion' ? 'secondary' : 'outline'}>
                          {pedido.estado === 'confirmado' ? 'Confirmat' : 'En preparació'}
                        </Badge>
                      </TableCell>
                      <TableCell>{totalUnidades}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {pedido.direccionEntrega || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {pedido.fechaEntregaLimite 
                          ? format(pedido.fechaEntregaLimite, 'dd/MM/yyyy', { locale: ca })
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {diasRestantes !== null && (
                          <span className={`font-medium ${diasRestantes < 7 ? 'text-orange-600' : ''}`}>
                            {diasRestantes}d
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {pedido.estado === 'confirmado' && (
                            <Button size="sm" variant="outline">
                              Iniciar Picking
                            </Button>
                          )}
                          {pedido.estado === 'en_preparacion' && (
                            <Button size="sm">
                              <Truck className="mr-2 h-4 w-4" />
                              Enviar
                            </Button>
                          )}
                          <Button size="sm" variant="ghost">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Cap comanda pendent de preparació
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial de entregas */}
      <Card>
        <CardHeader>
          <CardTitle>Històric de Lliuraments</CardTitle>
          <CardDescription>Enviaments completats</CardDescription>
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
                <TableHead>Compliment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidosEntregados.map((pedido) => {
                const totalUnidades = pedido.lineas.reduce((acc, l) => acc + l.cantidadEntregada, 0);
                const enPlazo = pedido.fechaEntregaReal && pedido.fechaEntregaLimite 
                  ? pedido.fechaEntregaReal <= pedido.fechaEntregaLimite
                  : true;
                
                return (
                  <TableRow key={pedido.id}>
                    <TableCell className="font-medium">{pedido.codigo}</TableCell>
                    <TableCell>{pedido.operadorNombre.split(',')[0]}</TableCell>
                    <TableCell>{totalUnidades}</TableCell>
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
                        <Badge variant="destructive">Fora termini</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
