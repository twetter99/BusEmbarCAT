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
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Listado Completo de Vehículos</CardTitle>
            <CardDescription>
              Todos los vehículos de la flota por operador.
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
                <TableHead>Número de Calca</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Número de Chasis</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Carrocería</TableHead>
                <TableHead>Fecha Instalación</TableHead>
                <TableHead>Operador</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.codBus}</TableCell>
                  <TableCell>{vehicle.id}</TableCell>
                  <TableCell>{vehicle.vin}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>{vehicle.bodywork}</TableCell>
                  <TableCell>{vehicle.preInstallationDate || 'N/A'}</TableCell>
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
