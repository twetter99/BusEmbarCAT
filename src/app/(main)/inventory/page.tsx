
'use client';

import * as React from 'react';
import {
  Archive,
  AlertTriangle,
  Boxes,
  ClipboardList,
  DollarSign,
  Download,
  FilePlus,
  Package,
  PackageCheck,
  PlusCircle,
  Wallet,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockInventory } from '@/lib/data';
import type { InventoryItem } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

const KPICard = ({
  title,
  value,
  icon: Icon,
  variant = 'default',
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  variant?: 'default' | 'warning';
}) => {
  const variantClasses = {
    default: 'bg-card',
    warning: 'bg-warning/10 border-warning',
  };
  const iconVariantClasses = {
    default: 'text-primary',
    warning: 'text-warning',
  };

  return (
    <Card className={variantClasses[variant]}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-muted-foreground ${iconVariantClasses[variant]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

const InventoryTable = ({ items }: { items: InventoryItem[] }) => {
  if (items.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <p>No hay artículos en esta vista.</p>
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre del Artículo</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Nº Serie</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Ubicación / Asignado</TableHead>
          <TableHead className="text-right">Stock</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const isLowStock = item.stock <= item.minStock;
          return (
            <TableRow key={item.id} className={isLowStock ? 'bg-warning/5' : ''}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.sku}</TableCell>
              <TableCell className="font-mono text-xs">{item.serialNumber || 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={
                    item.category === 'Material específico SERMETRA' ? 'secondary'
                    : item.category === 'Material de adquisición libre' ? 'outline'
                    : 'default'
                }>{item.category}</Badge>
                </TableCell>
              <TableCell className="text-muted-foreground">{item.assignedTo || item.location}</TableCell>
              <TableCell className="text-right font-bold">
                <div className="flex items-center justify-end gap-2">
                  {isLowStock && <AlertTriangle className="h-4 w-4 text-warning" />}
                  <span>{item.stock}</span>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default function InventoryPage() {
  const stockValue = mockInventory.reduce((acc, item) => acc + (item.value || 0) * item.stock, 0);
  const lowStockItems = mockInventory.filter((item) => item.stock <= item.minStock).length;
  const acquisitionBudget = 66600;
  const acquisitionSpent = mockInventory.filter(i => i.category === 'Material de adquisición libre').reduce((acc, item) => acc + (item.value || 0) * item.stock, 0);
  const acquisitionProgress = (acquisitionSpent / acquisitionBudget) * 100;

  const centralWarehouseStock = mockInventory.filter(item => item.location.includes('Central') && !item.assignedTo);
  const operatorWarehouseStock = mockInventory.filter(item => item.location.includes('Op.') && !item.assignedTo);
  const assignedStock = mockInventory.filter(item => item.assignedTo);


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Inventario y Stock (SGI)</h1>
          <p className="text-muted-foreground">Control centralizado de material y trazabilidad.</p>
        </div>
        <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <FilePlus className="mr-2 h-4 w-4" />
              Registrar Movimiento
            </Button>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Artículo
            </Button>
          </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Valor Total del Stock"
          value={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(stockValue)}
          icon={Wallet}
        />
        <KPICard
          title="Artículos Stock Bajo"
          value={lowStockItems}
          icon={AlertTriangle}
          variant={lowStockItems > 0 ? 'warning' : 'default'}
        />
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bolsa Adquisición Libre</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground text-primary" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(acquisitionBudget - acquisitionSpent)}</div>
                <p className="text-xs text-muted-foreground">{new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(acquisitionBudget)} de presupuesto</p>
                <Progress value={acquisitionProgress} className="mt-2 h-2" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Exportar</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground text-primary" />
            </CardHeader>
            <CardContent className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="w-full">Excel</Button>
                <Button variant="outline" size="sm" className="w-full">PDF</Button>
            </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="central">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="central">
            <Archive className="mr-2 h-4 w-4" />
            Almacén Principal
          </TabsTrigger>
          <TabsTrigger value="operator">
            <Boxes className="mr-2 h-4 w-4" />
            Almacenes Operador
          </TabsTrigger>
          <TabsTrigger value="assigned">
            <PackageCheck className="mr-2 h-4 w-4" />
            Material Asignado
          </TabsTrigger>
          <TabsTrigger value="budget">
            <ClipboardList className="mr-2 h-4 w-4" />
            Bolsa de Adquisición
          </TabsTrigger>
        </TabsList>

        <TabsContent value="central">
          <Card>
            <CardHeader>
              <CardTitle>Almacén Principal (Cornellà)</CardTitle>
              <CardDescription>
                Stock centralizado para distribución a operadores y proyectos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InventoryTable items={centralWarehouseStock} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operator">
          <Card>
            <CardHeader>
              <CardTitle>Stock en Almacenes de Operador</CardTitle>
              <CardDescription>
                Material delegado en las cocheras de los distintos operadores.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <InventoryTable items={operatorWarehouseStock} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assigned">
           <Card>
            <CardHeader>
              <CardTitle>Material Asignado a Vehículos</CardTitle>
              <CardDescription>
                Trazabilidad de componentes con número de serie instalados en la flota.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <InventoryTable items={assignedStock} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Control de la Bolsa de Adquisición Libre</CardTitle>
              <CardDescription>
                Seguimiento del consumo y presupuesto para material de adquisición libre. El presupuesto total es de 66.600,00 €.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-12 border-2 border-dashed rounded-lg">
                <p>Próximamente: Historial de movimientos y aprobaciones de presupuesto.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
