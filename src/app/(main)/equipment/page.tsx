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
import { mockEquipment } from '@/lib/data';
import type { Equipment } from '@/lib/types';
import { PlusCircle, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

const statusVariant: { [key in Equipment['status']]: 'default' | 'secondary' | 'destructive' } = {
    'Operational': 'default',
    'Requires Repair': 'destructive',
    'In Stock': 'secondary',
}

export default function EquipmentPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Equipment Inventory</CardTitle>
            <CardDescription>
              Track all hardware components across the fleet.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Equipment
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serial Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Assigned Vehicle</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockEquipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.serialNumber}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    {item.assignedVehicleId ? (
                      <Link href={`/vehicles?id=${item.assignedVehicleId}`} className="flex items-center gap-1 text-primary hover:underline">
                        <LinkIcon className="h-3 w-3" />
                        {item.assignedVehicleId}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[item.status]}>{item.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
