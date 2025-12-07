'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Download, 
  ArrowRightLeft, 
  AlertTriangle,
  Package,
  Box,
  Wrench,
  Info
} from 'lucide-react';
import { 
  equiposPrincipalesC5, 
  componentesKitC5,
  catalogoProductosC5, 
  mockMovimientosC5,
  composicionKitIntegral 
} from '@/lib/contrato-c5-data';
import { 
  calcularKitsFabricables,
  stockDisponible,
  stockBajo,
  porcentajeStockUsado,
  LABELS_SUBCATEGORIA 
} from '@/lib/contrato-c5-utils';
import { CONTRATO_C5_CONFIG } from '@/lib/contrato-c5-types';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';

const tipoMovimientoBadge = (tipo: string) => {
  const config: Record<string, { variant: 'default' | 'secondary' | 'outline' | 'destructive', label: string }> = {
    entrada_stock: { variant: 'default', label: 'Entrada' },
    reserva_pedido: { variant: 'outline', label: 'Reserva' },
    salida_instalacion: { variant: 'destructive', label: 'Instal·lació' },
    devolucion_reparacion: { variant: 'secondary', label: 'Devolució Rep.' },
    baja: { variant: 'destructive', label: 'Baixa' },
  };
  const c = config[tipo] || { variant: 'outline', label: tipo };
  return <Badge variant={c.variant}>{c.label}</Badge>;
};

export default function InventarioC5Page() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('equipos');
  
  const resumenKits = calcularKitsFabricables();
  
  // Filtrar equipos principales
  const equiposFiltrados = equiposPrincipalesC5.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar componentes del kit
  const componentesFiltrados = componentesKitC5.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar componentes por subcategoría
  const componentesPorSubcat = componentesFiltrados.reduce((acc, comp) => {
    const subcat = comp.subcategoria || 'otros';
    if (!acc[subcat]) acc[subcat] = [];
    acc[subcat].push(comp);
    return acc;
  }, {} as Record<string, typeof componentesKitC5>);

  // Contadores para KPIs
  const productosStockBajo = catalogoProductosC5.filter(stockBajo).length;
  const totalReservado = catalogoProductosC5.reduce((acc, p) => acc + (p.stockReservado || 0), 0);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventari C-5/2025</h1>
          <p className="text-muted-foreground">
            Equipament de comunicacions per a autobusos - Màx. {CONTRATO_C5_CONFIG.stockMaximoEquiposPrincipales} ud/equip
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipos Principals</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{equiposPrincipalesC5.length}</div>
            <p className="text-xs text-muted-foreground">
              {equiposPrincipalesC5.reduce((acc, p) => acc + p.stockActual, 0)} unitats en estoc
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/50 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kits Fabricables</CardTitle>
            <Wrench className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{resumenKits.kitsFabricables}</div>
            {resumenKits.componenteLimitante && (
              <p className="text-xs text-muted-foreground">
                Limitat per: {resumenKits.componenteLimitante.nombre}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className={productosStockBajo > 0 ? 'border-destructive/50 bg-destructive/5' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estoc Baix</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${productosStockBajo > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${productosStockBajo > 0 ? 'text-destructive' : ''}`}>
              {productosStockBajo}
            </div>
            <p className="text-xs text-muted-foreground">
              productes sota mínim
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reservat</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReservado}</div>
            <p className="text-xs text-muted-foreground">
              unitats en comandes
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="equipos">
              <Package className="mr-2 h-4 w-4" />
              Equipos Principals
            </TabsTrigger>
            <TabsTrigger value="componentes">
              <Wrench className="mr-2 h-4 w-4" />
              Components Kit
            </TabsTrigger>
            <TabsTrigger value="movimientos">
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Moviments
            </TabsTrigger>
          </TabsList>
          
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cercar per nom o SKU..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* TAB: Equipos Principales */}
        <TabsContent value="equipos">
          <Card>
            <CardHeader>
              <CardTitle>Equipos Principals del Contracte</CardTitle>
              <CardDescription>
                Antena Tribanda, Switch Ethernet i Kit Integral - Volumetria màx. {CONTRATO_C5_CONFIG.stockMaximoEquiposPrincipales} unitats cadascun
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Producte</TableHead>
                    <TableHead className="text-right">Estoc</TableHead>
                    <TableHead className="text-right">Reservat</TableHead>
                    <TableHead className="text-right">Disponible</TableHead>
                    <TableHead>Ús Contracte</TableHead>
                    <TableHead>Estat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equiposFiltrados.map((equipo) => {
                    const disponible = stockDisponible(equipo);
                    const esBajo = stockBajo(equipo);
                    const porcentaje = porcentajeStockUsado(equipo);
                    
                    return (
                      <TableRow key={equipo.id} className={esBajo ? 'bg-destructive/5' : ''}>
                        <TableCell className="font-mono text-sm">{equipo.sku}</TableCell>
                        <TableCell>
                          <div className="font-medium">{equipo.nombre}</div>
                          <div className="text-xs text-muted-foreground">{equipo.descripcion}</div>
                        </TableCell>
                        <TableCell className="text-right font-bold">{equipo.stockActual}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{equipo.stockReservado}</TableCell>
                        <TableCell className="text-right font-medium">{disponible}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={porcentaje} className="h-2 w-24" />
                            <span className="text-xs text-muted-foreground">{porcentaje}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {esBajo ? (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" /> Baix
                            </Badge>
                          ) : (
                            <Badge variant="default">OK</Badge>
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

        {/* TAB: Componentes del Kit */}
        <TabsContent value="componentes">
          <div className="space-y-4">
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">Composició del Kit Integral</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Cada Kit Integral conté {composicionKitIntegral.length} tipus de components. 
                  Amb l'estoc actual es poden fabricar <strong className="text-primary">{resumenKits.kitsFabricables} kits complets</strong>.
                  {resumenKits.componenteLimitante && (
                    <> El component limitant és <strong>{resumenKits.componenteLimitante.nombre}</strong> ({resumenKits.componenteLimitante.stock} disponibles, {resumenKits.componenteLimitante.necesarioPorKit}/kit).</>
                  )}
                </p>
              </CardContent>
            </Card>

            {Object.entries(componentesPorSubcat).map(([subcat, componentes]) => (
              <Card key={subcat}>
                <CardHeader>
                  <CardTitle className="text-base">{LABELS_SUBCATEGORIA[subcat] || subcat}</CardTitle>
                  <CardDescription>{componentes.length} components</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Component</TableHead>
                        <TableHead className="text-right">Uds/Kit</TableHead>
                        <TableHead className="text-right">Estoc</TableHead>
                        <TableHead className="text-right">Reservat</TableHead>
                        <TableHead className="text-right">Disponible</TableHead>
                        <TableHead className="text-right">Kits Possibles</TableHead>
                        <TableHead>Estat</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {componentes.map((comp) => {
                        const disponible = stockDisponible(comp);
                        const esBajo = stockBajo(comp);
                        const kitsPosibles = Math.floor(disponible / (comp.cantidadPorKit || 1));
                        
                        return (
                          <TableRow key={comp.id} className={esBajo ? 'bg-destructive/5' : ''}>
                            <TableCell className="font-mono text-xs">{comp.sku}</TableCell>
                            <TableCell className="font-medium">{comp.nombre}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{comp.cantidadPorKit || 1}</TableCell>
                            <TableCell className="text-right font-bold">{comp.stockActual}</TableCell>
                            <TableCell className="text-right text-muted-foreground">{comp.stockReservado}</TableCell>
                            <TableCell className="text-right">{disponible}</TableCell>
                            <TableCell className="text-right font-medium">{kitsPosibles}</TableCell>
                            <TableCell>
                              {esBajo ? (
                                <Badge variant="destructive" className="gap-1">
                                  <AlertTriangle className="h-3 w-3" /> Baix
                                </Badge>
                              ) : (
                                <Badge variant="outline">OK</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB: Movimientos */}
        <TabsContent value="movimientos">
          <Card>
            <CardHeader>
              <CardTitle>Històric de Moviments</CardTitle>
              <CardDescription>Traçabilitat completa d'entrades, sortides i reserves</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipus</TableHead>
                    <TableHead>Producte</TableHead>
                    <TableHead>Nº Sèrie</TableHead>
                    <TableHead className="text-right">Quantitat</TableHead>
                    <TableHead>Referència</TableHead>
                    <TableHead>Usuari</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMovimientosC5.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell>{format(mov.fecha, 'dd/MM/yyyy HH:mm', { locale: ca })}</TableCell>
                      <TableCell>{tipoMovimientoBadge(mov.tipo)}</TableCell>
                      <TableCell className="font-medium">{mov.productoNombre}</TableCell>
                      <TableCell className="font-mono text-xs">{mov.numeroSerie || '-'}</TableCell>
                      <TableCell className="text-right font-bold">{mov.cantidad}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {mov.pedidoRef || mov.vehiculoRef || '-'}
                      </TableCell>
                      <TableCell className="text-xs">{mov.realizadoPor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
