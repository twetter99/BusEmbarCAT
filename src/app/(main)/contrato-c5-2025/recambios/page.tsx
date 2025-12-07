'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle,
  CheckCircle2,
  Package,
  Settings2,
  TrendingDown,
  TrendingUp,
  Wrench,
  RefreshCw,
  Save,
} from 'lucide-react';
import { equiposPrincipalesC5, mockNumeroSeriesC5 } from '@/lib/contrato-c5-data';
import type { ProductoC5 } from '@/lib/contrato-c5-types';
import { useToast } from '@/hooks/use-toast';

// Calcular series marcadas como recambio por producto
function getSeriesRecambio(productoId: string) {
  return mockNumeroSeriesC5.filter(
    (s) => s.productoId === productoId && s.esRecambio && s.estado === 'disponible'
  );
}

// Tipo para alertas de stock de recambio
interface AlertaRecambio {
  productoId: string;
  productoNombre: string;
  sku: string;
  stockRecambio: number;
  stockMinimoRecambio: number;
  diferencia: number;
  porcentaje: number;
  tipo: 'critico' | 'bajo' | 'ok';
}

// Calcular alertas de recambio
function calcularAlertasRecambio(): AlertaRecambio[] {
  return equiposPrincipalesC5.map((producto) => {
    const stockRecambio = producto.stockRecambio ?? 0;
    const stockMinimoRecambio = producto.stockMinimoRecambio ?? 0;
    const diferencia = stockRecambio - stockMinimoRecambio;
    const porcentaje = stockMinimoRecambio > 0 
      ? Math.round((stockRecambio / stockMinimoRecambio) * 100) 
      : 100;
    
    let tipo: 'critico' | 'bajo' | 'ok' = 'ok';
    if (porcentaje < 50) {
      tipo = 'critico';
    } else if (porcentaje < 100) {
      tipo = 'bajo';
    }
    
    return {
      productoId: producto.id,
      productoNombre: producto.nombre,
      sku: producto.sku,
      stockRecambio,
      stockMinimoRecambio,
      diferencia,
      porcentaje,
      tipo,
    };
  });
}

export default function RecambiosPage() {
  const { toast } = useToast();
  const [alertas] = useState<AlertaRecambio[]>(calcularAlertasRecambio());
  const [isAjusteOpen, setIsAjusteOpen] = useState(false);
  const [productoAjuste, setProductoAjuste] = useState<ProductoC5 | null>(null);
  const [nuevoMinimo, setNuevoMinimo] = useState<string>('');

  // KPIs
  const totalRecambio = equiposPrincipalesC5.reduce((sum, p) => sum + (p.stockRecambio ?? 0), 0);
  const totalMinimoRequerido = equiposPrincipalesC5.reduce((sum, p) => sum + (p.stockMinimoRecambio ?? 0), 0);
  const alertasCriticas = alertas.filter((a) => a.tipo === 'critico').length;
  const alertasBajas = alertas.filter((a) => a.tipo === 'bajo').length;
  const porcentajeGlobal = totalMinimoRequerido > 0 
    ? Math.round((totalRecambio / totalMinimoRequerido) * 100) 
    : 100;

  const handleOpenAjuste = (producto: ProductoC5) => {
    setProductoAjuste(producto);
    setNuevoMinimo(String(producto.stockMinimoRecambio ?? 0));
    setIsAjusteOpen(true);
  };

  const handleGuardarAjuste = () => {
    // Mock - en producción guardaría en Firebase
    toast({
      title: 'Mínim ajustat',
      description: `El mínim de recambi per a ${productoAjuste?.nombre} s'ha actualitzat a ${nuevoMinimo} unitats.`,
    });
    setIsAjusteOpen(false);
    setProductoAjuste(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recambi i Mínims</h1>
          <p className="text-muted-foreground">
            Control d'estoc de recambis i alertes per sota del mínim
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualitzar
        </Button>
      </div>

      {/* Alertas críticas */}
      {alertasCriticas > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Alertes crítiques d'estoc de recambi!</AlertTitle>
          <AlertDescription>
            Hi ha {alertasCriticas} producte(s) amb estoc de recambi per sota del 50% del mínim requerit.
            Cal reposar urgentment.
          </AlertDescription>
        </Alert>
      )}

      {alertasBajas > 0 && alertasCriticas === 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Estoc de recambi baix</AlertTitle>
          <AlertDescription>
            Hi ha {alertasBajas} producte(s) amb estoc de recambi per sota del mínim.
            Es recomana reposar aviat.
          </AlertDescription>
        </Alert>
      )}

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoc Recambi Total</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecambio} ud</div>
            <p className="text-xs text-muted-foreground">
              de {totalMinimoRequerido} mínim requerit
            </p>
            <Progress value={Math.min(porcentajeGlobal, 100)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobertura Global</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{porcentajeGlobal}%</div>
            <div className="flex items-center text-xs">
              {porcentajeGlobal >= 100 ? (
                <>
                  <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                  <span className="text-green-600">Dins de mínims</span>
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                  <span className="text-red-600">Per sota dels mínims</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertes Crítiques</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertasCriticas}</div>
            <p className="text-xs text-muted-foreground">
              productes &lt; 50% del mínim
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productes OK</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {alertas.filter((a) => a.tipo === 'ok').length}
            </div>
            <p className="text-xs text-muted-foreground">
              de {equiposPrincipalesC5.length} equips principals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="detall">Detall per Producte</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          {/* Cards de estado por producto */}
          <div className="grid gap-4 md:grid-cols-3">
            {equiposPrincipalesC5.map((producto) => {
              const alerta = alertas.find((a) => a.productoId === producto.id)!;
              const stockRecambio = producto.stockRecambio ?? 0;
              const stockMinimo = producto.stockMinimoRecambio ?? 0;

              return (
                <Card key={producto.id} className={
                  alerta.tipo === 'critico' ? 'border-destructive' :
                  alerta.tipo === 'bajo' ? 'border-yellow-500' : ''
                }>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{producto.nombre}</CardTitle>
                      <Badge
                        variant={
                          alerta.tipo === 'critico' ? 'destructive' :
                          alerta.tipo === 'bajo' ? 'outline' : 'default'
                        }
                        className={alerta.tipo === 'bajo' ? 'border-yellow-500 text-yellow-600' : ''}
                      >
                        {alerta.tipo === 'critico' ? 'Crític' :
                         alerta.tipo === 'bajo' ? 'Baix' : 'OK'}
                      </Badge>
                    </div>
                    <CardDescription>{producto.sku}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Estoc recambi:</span>
                      <span className="font-bold">{stockRecambio} ud</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Mínim requerit:</span>
                      <span className="text-muted-foreground">{stockMinimo} ud</span>
                    </div>
                    <Progress 
                      value={Math.min(alerta.porcentaje, 100)} 
                      className={
                        alerta.tipo === 'critico' ? '[&>div]:bg-destructive' :
                        alerta.tipo === 'bajo' ? '[&>div]:bg-yellow-500' : ''
                      }
                    />
                    <div className="flex items-center justify-between text-sm">
                      <span className={
                        alerta.diferencia < 0 ? 'text-destructive' : 'text-green-600'
                      }>
                        {alerta.diferencia >= 0 ? '+' : ''}{alerta.diferencia} respecte mínim
                      </span>
                      <span className="text-muted-foreground">{alerta.porcentaje}%</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleOpenAjuste(producto)}
                    >
                      <Settings2 className="mr-2 h-3 w-3" />
                      Ajustar Mínim
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="detall">
          <Card>
            <CardHeader>
              <CardTitle>Detall d'Estoc de Recambi</CardTitle>
              <CardDescription>
                Comparativa de stock actual de recambi vs mínim per a cada equip principal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producte</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Stock Recambi</TableHead>
                    <TableHead className="text-right">Mínim</TableHead>
                    <TableHead className="text-right">Diferència</TableHead>
                    <TableHead className="text-center">Estat</TableHead>
                    <TableHead className="text-right">Cobertura</TableHead>
                    <TableHead className="text-center">Accions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equiposPrincipalesC5.map((producto) => {
                    const alerta = alertas.find((a) => a.productoId === producto.id)!;
                    
                    return (
                      <TableRow key={producto.id}>
                        <TableCell className="font-medium">{producto.nombre}</TableCell>
                        <TableCell className="text-muted-foreground">{producto.sku}</TableCell>
                        <TableCell className="text-right font-bold">
                          {producto.stockRecambio ?? 0}
                        </TableCell>
                        <TableCell className="text-right">
                          {producto.stockMinimoRecambio ?? 0}
                        </TableCell>
                        <TableCell className={`text-right font-medium ${
                          alerta.diferencia < 0 ? 'text-destructive' : 'text-green-600'
                        }`}>
                          {alerta.diferencia >= 0 ? '+' : ''}{alerta.diferencia}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              alerta.tipo === 'critico' ? 'destructive' :
                              alerta.tipo === 'bajo' ? 'outline' : 'default'
                            }
                            className={alerta.tipo === 'bajo' ? 'border-yellow-500 text-yellow-600' : ''}
                          >
                            {alerta.tipo === 'critico' ? 'Crític' :
                             alerta.tipo === 'bajo' ? 'Baix' : 'OK'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Progress 
                              value={Math.min(alerta.porcentaje, 100)} 
                              className={`w-20 ${
                                alerta.tipo === 'critico' ? '[&>div]:bg-destructive' :
                                alerta.tipo === 'bajo' ? '[&>div]:bg-yellow-500' : ''
                              }`}
                            />
                            <span className="w-12 text-right text-sm">
                              {alerta.porcentaje}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenAjuste(producto)}
                          >
                            <Settings2 className="h-4 w-4" />
                          </Button>
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

      {/* Dialog Ajustar Mínimo */}
      <Dialog open={isAjusteOpen} onOpenChange={setIsAjusteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajustar Mínim de Recambi</DialogTitle>
            <DialogDescription>
              Modifica el mínim d'estoc de recambi per a {productoAjuste?.nombre}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Producte</Label>
              <div className="text-sm font-medium">{productoAjuste?.nombre}</div>
              <div className="text-xs text-muted-foreground">{productoAjuste?.sku}</div>
            </div>
            <div className="space-y-2">
              <Label>Estoc de recambi actual</Label>
              <div className="text-lg font-bold">{productoAjuste?.stockRecambio ?? 0} unitats</div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nuevoMinimo">Nou mínim de recambi</Label>
              <Input
                id="nuevoMinimo"
                type="number"
                min="0"
                value={nuevoMinimo}
                onChange={(e) => setNuevoMinimo(e.target.value)}
                placeholder="Introdueix el nou mínim"
              />
              <p className="text-xs text-muted-foreground">
                Mínim anterior: {productoAjuste?.stockMinimoRecambio ?? 0} unitats
              </p>
            </div>
            {nuevoMinimo && Number(nuevoMinimo) > (productoAjuste?.stockRecambio ?? 0) && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Atenció</AlertTitle>
                <AlertDescription>
                  El nou mínim ({nuevoMinimo}) és superior a l'estoc actual (
                  {productoAjuste?.stockRecambio ?? 0}). Caldrà reposar estoc.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAjusteOpen(false)}>
              Cancel·lar
            </Button>
            <Button onClick={handleGuardarAjuste}>
              <Save className="mr-2 h-4 w-4" />
              Desar Canvis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
