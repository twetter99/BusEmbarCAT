'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  Zap,
  TrendingDown,
  Box,
  ShieldCheck,
  Clock,
  ArrowUp,
  ArrowDown,
  Info,
  BarChart3,
} from 'lucide-react';
import { mockStockCentral, mockKPIsCentralCompras } from '@/lib/central-compras-data';
import type { StockCentralC5, NivelAlertaStock } from '@/lib/contrato-c5-types';

// Configuración de alertas
const alertaConfig: Record<NivelAlertaStock, { label: string; color: string; icon: React.ReactNode }> = {
  ok: { label: 'OK', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="h-4 w-4" /> },
  bajo: { label: 'Baix', color: 'bg-amber-100 text-amber-700', icon: <AlertTriangle className="h-4 w-4" /> },
  critico: { label: 'Crític', color: 'bg-red-100 text-red-700', icon: <AlertTriangle className="h-4 w-4" /> },
  agotado: { label: 'Esgotat', color: 'bg-red-200 text-red-800', icon: <AlertTriangle className="h-4 w-4" /> },
};

export default function StockCentralPage() {
  const [stocks] = React.useState<StockCentralC5[]>(mockStockCentral);
  const kpis = mockKPIsCentralCompras;

  // Cálculos agregados
  const stats = React.useMemo(() => {
    const totalStock = stocks.reduce((acc, s) => acc + s.stockTotal, 0);
    const totalDisponible = stocks.reduce((acc, s) => acc + s.stockDisponible, 0);
    const totalReservadoUrgencias = stocks.reduce((acc, s) => acc + s.stockReservadoUrgencias, 0);
    const productosAlerta = stocks.filter(s => s.nivelAlerta !== 'ok').length;
    
    return {
      totalStock,
      totalDisponible,
      totalReservadoUrgencias,
      productosAlerta,
      porcentajeUso: Math.round((totalStock / (stocks.length * 200)) * 100),
    };
  }, [stocks]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stock Central</h1>
        <p className="text-muted-foreground">
          Gestió centralitzada d'inventari amb buffer per urgències
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStock}</div>
            <p className="text-xs text-muted-foreground">unitats en magatzem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Disponible</CardTitle>
            <Box className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalDisponible}</div>
            <p className="text-xs text-muted-foreground">per assignar a sol·licituds</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Buffer Urgències</CardTitle>
            <Zap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.totalReservadoUrgencias}</div>
            <p className="text-xs text-muted-foreground">reservat per emergències</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Productes en Alerta</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.productosAlerta}</div>
            <p className="text-xs text-muted-foreground">requereixen atenció</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerta de urgencias servidas */}
      {kpis.urgenciasServidasUltimos30Dias > 0 && (
        <Alert className="border-green-200 bg-green-50">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Urgències Gestionades</AlertTitle>
          <AlertDescription className="text-green-700">
            S'han servit <strong>{kpis.urgenciasServidasUltimos30Dias}</strong> sol·licituds urgents 
            des de l'stock d'emergències en els últims 30 dies.
            {kpis.urgenciasNoServidasPorStock > 0 && (
              <span className="text-red-600 ml-2">
                ({kpis.urgenciasNoServidasPorStock} no servides per falta d'stock)
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Tabla de Stock */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Detall per Producte
          </CardTitle>
          <CardDescription>
            Nivells d'stock, reserves i alertes per cada equip principal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producte</TableHead>
                <TableHead className="text-center">Stock Total</TableHead>
                <TableHead className="text-center">Disponible</TableHead>
                <TableHead className="text-center">Reservat Sol·licituds</TableHead>
                <TableHead className="text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1 mx-auto">
                        Buffer Urgències
                        <Info className="h-3 w-3" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Stock reservat exclusivament per sol·licituds urgents</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="text-center">Dies Estimats</TableHead>
                <TableHead className="text-center">Estat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stocks.map(stock => {
                const porcentajeTotal = (stock.stockTotal / stock.stockMaximoContrato) * 100;
                const porcentajeUrgencias = (stock.stockReservadoUrgencias / stock.stockMinimoUrgencias) * 100;
                
                return (
                  <TableRow key={stock.productoId}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{stock.productoNombre}</p>
                        <p className="text-xs text-muted-foreground">{stock.sku}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <p className="font-bold">{stock.stockTotal}</p>
                        <div className="w-full max-w-[100px] mx-auto mt-1">
                          <Progress value={porcentajeTotal} className="h-1.5" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          màx. {stock.stockMaximoContrato}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-lg font-bold text-blue-600">
                        {stock.stockDisponible}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-purple-50">
                        {stock.stockReservadoSolicitudes}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <Badge 
                          variant="secondary" 
                          className={`${porcentajeUrgencias >= 100 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          {stock.stockReservadoUrgencias} / {stock.stockMinimoUrgencias}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {stock.diasStockEstimado && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <span className={`font-medium ${
                                stock.diasStockEstimado < 30 ? 'text-red-600' :
                                stock.diasStockEstimado < 60 ? 'text-amber-600' :
                                'text-green-600'
                              }`}>
                                {stock.diasStockEstimado}d
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Consum mitjà: {stock.consumoMedioDiario?.toFixed(2)} ud/dia</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={alertaConfig[stock.nivelAlerta].color} variant="secondary">
                        {alertaConfig[stock.nivelAlerta].icon}
                        <span className="ml-1">{alertaConfig[stock.nivelAlerta].label}</span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detalle visual por producto */}
      <div className="grid gap-4 md:grid-cols-3">
        {stocks.map(stock => {
          const porcentajeDisponible = (stock.stockDisponible / stock.stockTotal) * 100;
          const porcentajeReservado = (stock.stockReservadoSolicitudes / stock.stockTotal) * 100;
          const porcentajeUrgencias = (stock.stockReservadoUrgencias / stock.stockTotal) * 100;
          
          return (
            <Card key={stock.productoId} className={
              stock.nivelAlerta === 'critico' || stock.nivelAlerta === 'agotado' 
                ? 'border-red-200' 
                : stock.nivelAlerta === 'bajo' 
                  ? 'border-amber-200' 
                  : ''
            }>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{stock.productoNombre}</CardTitle>
                  <Badge className={alertaConfig[stock.nivelAlerta].color} variant="secondary">
                    {alertaConfig[stock.nivelAlerta].label}
                  </Badge>
                </div>
                <CardDescription>{stock.sku}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Barra de distribución */}
                <div>
                  <div className="flex h-4 rounded-full overflow-hidden bg-muted">
                    <div 
                      className="bg-blue-500" 
                      style={{ width: `${porcentajeDisponible}%` }}
                      title={`Disponible: ${stock.stockDisponible}`}
                    />
                    <div 
                      className="bg-purple-500" 
                      style={{ width: `${porcentajeReservado}%` }}
                      title={`Reservat: ${stock.stockReservadoSolicitudes}`}
                    />
                    <div 
                      className="bg-amber-500" 
                      style={{ width: `${porcentajeUrgencias}%` }}
                      title={`Urgències: ${stock.stockReservadoUrgencias}`}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Disponible</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>Reservat</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Urgències</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-bold">{stock.stockTotal}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Disponible:</span>
                    <span className="font-bold text-blue-600">{stock.stockDisponible}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Reservat:</span>
                    <span className="font-medium text-purple-600">{stock.stockReservadoSolicitudes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Urgències:</span>
                    <span className="font-medium text-amber-600">{stock.stockReservadoUrgencias}</span>
                  </div>
                </div>

                {/* Alerta de reposición */}
                {stock.stockDisponible <= stock.stockMinimoReposicion && (
                  <Alert variant="destructive" className="py-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Per sota del mínim de reposició ({stock.stockMinimoReposicion} ud.)
                    </AlertDescription>
                  </Alert>
                )}

                {/* Días de stock */}
                <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Stock estimat:</span>
                  </div>
                  <span className={`font-bold ${
                    stock.diasStockEstimado && stock.diasStockEstimado < 30 ? 'text-red-600' :
                    stock.diasStockEstimado && stock.diasStockEstimado < 60 ? 'text-amber-600' :
                    'text-green-600'
                  }`}>
                    {stock.diasStockEstimado} dies
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Leyenda */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4" />
            Llegenda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div>
              <p className="font-medium mb-2">Tipus d'Stock:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500" />
                  <strong>Disponible:</strong> Lliure per assignar a noves sol·licituds
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-purple-500" />
                  <strong>Reservat:</strong> Assignat a sol·licituds aprovades pendents
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-500" />
                  <strong>Urgències:</strong> Buffer fix per atendre emergències
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Nivells d'Alerta:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700 text-xs">OK</Badge>
                  Stock suficient per operacions normals
                </li>
                <li className="flex items-center gap-2">
                  <Badge className="bg-amber-100 text-amber-700 text-xs">Baix</Badge>
                  S'apropa al mínim de reposició
                </li>
                <li className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-700 text-xs">Crític</Badge>
                  Requereix reposició urgent
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
