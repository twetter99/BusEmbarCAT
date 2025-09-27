
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
import { mockInventory } from '@/lib/data';
import { PlusCircle } from 'lucide-react';

export default function InventoryPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Stock de Inventario</CardTitle>
            <CardDescription>
              Gestionar los niveles de stock de todos los materiales.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Registrar Movimiento
            </Button>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Añadir Artículo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <InventoryTable items={mockInventory} />
        </CardContent>
      </Card>
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
