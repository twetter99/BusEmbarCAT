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
import { mockVehicles } from '@/lib/data';
import type { Vehicle } from '@/lib/types';
import { PlusCircle } from 'lucide-react';

const statusVariant: { [key in Vehicle['status']]: 'default' | 'secondary' | 'destructive' } = {
    'Active': 'default',
    'In Maintenance': 'secondary',
    'Decommissioned': 'destructive',
}

export default function VehiclesPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Vehicles</CardTitle>
            <CardDescription>
              A complete list of all vehicles in the fleet.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Add Vehicle
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle ID</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>VIN</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.id}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.vin}</TableCell>
                  <TableCell>{vehicle.operator}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[vehicle.status]}>{vehicle.status}</Badge>
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
