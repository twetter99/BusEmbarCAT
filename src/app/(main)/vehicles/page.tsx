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
    'Activo': 'default',
    'En Mantenimiento': 'secondary',
    'Fuera de Servicio': 'destructive',
}

export default function VehiclesPage() {
  const uniqueModels = Array.from(new Set(mockVehicles.map(v => v.model)))
    .map(model => {
        const vehiclesOfModel = mockVehicles.filter(v => v.model === model);
        const firstVehicle = vehiclesOfModel[0];
        return {
            ...firstVehicle,
            count: vehiclesOfModel.length
        };
    });


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Modelos de Vehículos</CardTitle>
            <CardDescription>
              Un resumen de todos los modelos de vehículos en la flota.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-4 w-4" />
            Añadir Vehículo
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Modelo</TableHead>
                <TableHead>Operador de Ejemplo</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Estado General</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uniqueModels.map((vehicle) => (
                <TableRow key={vehicle.model}>
                  <TableCell className="font-medium">{vehicle.model}</TableCell>
                  <TableCell>{vehicle.operator}</TableCell>
                  <TableCell>{vehicle.count}</TableCell>
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
