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
    const genericItems = mockInventory.filter(i => i.category === 'Generic');
    const freeStockItems = mockInventory.filter(i => i.category === 'Free Stock');
    const vendorSpecificItems = mockInventory.filter(i => i.category === 'Vendor Specific');
    
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Tabs defaultValue="all">
             <div className="flex items-center justify-between">
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="generic">Generic</TabsTrigger>
                    <TabsTrigger value="free">Free Stock</TabsTrigger>
                    <TabsTrigger value="vendor">Vendor Specific</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                     <Button size="sm" variant="outline">
                        Log Movement
                    </Button>
                    <Button size="sm">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Item
                    </Button>
                </div>
            </div>
            <Card className="mt-4">
                 <CardHeader>
                    <CardTitle>Inventory Stock</CardTitle>
                    <CardDescription>
                    Manage stock levels for all materials.
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
                <TableHead>Item Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Stock Level</TableHead>
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
