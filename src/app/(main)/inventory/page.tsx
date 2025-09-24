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
import { PlusCircle } from 'lucide-react';

export default function InventoryPage() {
    const genericItems = mockInventory.filter(i => i.category === 'Genérico');
    const freeStockItems = mockInventory.filter(i => i.category === 'Stock Libre');
    const vendorSpecificItems = mockInventory.filter(i => i.category === 'Específico del Proveedor');
    
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Tabs defaultValue="all">
             <div className="flex items-center justify-between">
                <TabsList>
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="generic">Genérico</TabsTrigger>
                    <TabsTrigger value="free">Stock Libre</TabsTrigger>
                    <TabsTrigger value="vendor">Específico del Proveedor</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                     <Button size="sm" variant="outline">
                        Registrar Movimiento
                    </Button>
                    <Button size="sm">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Añadir Artículo
                    </Button>
                </div>
            </div>
            <Card className="mt-4">
                 <CardHeader>
                    <CardTitle>Stock de Inventario</CardTitle>
                    <CardDescription>
                    Gestionar los niveles de stock de todos los materiales.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TabsContent value="all" className="m-0">
                       <InventoryTable items={mockInventory} />
                    </TabsContent>
                    <TabsContent value="generic" className="m-0">
                       <InventoryTable items={genericItems} />
                    </TabsContent>
                    <TabsContent value="free" className="m-0">
                       <InventoryTable items={freeStockItems} />
                    </TabsContent>
                    <TabsContent value="vendor" className="m-0">
                       <InventoryTable items={vendorSpecificItems} />
                    </TabsContent>
                </CardContent>
            </Card>
        </Tabs>
    </main>
  );
}

const InventoryTable = ({ items }: { items: typeof mockInventory }) => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Nombre del Artículo</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead className="text-right">Nivel de Stock</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {items.map((item) => (
                <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-muted-foreground">{item.location}</TableCell>
                    <TableCell className="text-right font-bold">{item.stock}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);
