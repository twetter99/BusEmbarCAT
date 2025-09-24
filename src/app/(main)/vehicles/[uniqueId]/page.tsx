'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HardDrive, Info, Wrench } from 'lucide-react';
import { mockVehicles, mockEquipment, mockOperators } from '@/lib/data';
import type { Vehicle, Equipment, EquipmentType } from '@/lib/types';
import { equipmentTypeCategories } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

const statusVariant: {
  [key in Vehicle['status']]: 'default' | 'secondary' | 'destructive';
} = {
  Activo: 'default',
  'En Mantenimiento': 'secondary',
  'Fuera de Servicio': 'destructive',
};

const equipmentStatusVariant: {
  [key in Equipment['status']]: 'default' | 'secondary' | 'destructive';
} = {
  Operativo: 'default',
  'Requiere Reparación': 'destructive',
  'En Stock': 'secondary',
};

const equipmentLimits: { [key: string]: number } = {
  Pupitre: 1,
  Validación: 4,
  Auxiliar: 1,
  Consulta: 99, // No limit specified
};

const getCategoryForType = (type: EquipmentType): string | null => {
  for (const category in equipmentTypeCategories) {
    const types = equipmentTypeCategories[category];
    if (Array.isArray(types) && types.includes(type)) {
      return category;
    }
  }
  return null;
};

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { uniqueId } = params;

  const vehicle = mockVehicles.find((v) => v.uniqueId === uniqueId);
  const operator = mockOperators.find((o) => o.id === vehicle?.operatorId);
  const installedEquipment = mockEquipment.filter(
    (e) => e.assignedVehicleUniqueId === uniqueId
  );

  const groupedEquipment = installedEquipment.reduce((acc, item) => {
    const category = getCategoryForType(item.type);
    if (category) {
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
    }
    return acc;
  }, {} as Record<string, Equipment[]>);

  const totalEquipmentLimit = Object.values(equipmentLimits).filter(l => l < 99).reduce((sum, limit) => sum + limit, 0);

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <CardTitle>Vehículo no encontrado</CardTitle>
            <CardDescription>
              El vehículo que buscas no existe o ha sido movido.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/vehicles')}>
              Volver al listado
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Volver</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Ficha del Vehículo</h1>
          <p className="text-muted-foreground">{vehicle.uniqueId}</p>
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Info className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>
                  Datos identificativos y técnicos del vehículo.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 text-sm">
                <div>
                  <p className="font-semibold text-muted-foreground">
                    ID Único
                  </p>
                  <p>{vehicle.uniqueId}</p>
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground">
                    Número de Calca
                  </p>
                  <p>{vehicle.codBus}</p>
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground">
                    Matrícula
                  </p>
                  <p>{vehicle.id}</p>
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground">
                    Número de Chasis
                  </p>
                  <p>{vehicle.vin}</p>
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground">Modelo</p>
                  <p>{vehicle.model}</p>
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground">
                    Carrocería
                  </p>
                  <p>{vehicle.bodywork}</p>
                </div>
                <div>
                  <p className="font-semibold text-muted-foreground">
                    Fecha Instalación
                  </p>
                  <p>{vehicle.preInstallationDate || 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <HardDrive className="h-6 w-6 text-primary" />
                    Equipamiento Instalado
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                    Total: {installedEquipment.length}/{totalEquipmentLimit} equipos
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {installedEquipment.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo de Equipo</TableHead>
                      <TableHead>Número de Serie</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {installedEquipment.map((item) => {
                       const category = getCategoryForType(item.type) || 'Otro';
                       const limit = equipmentLimits[category] || 0;
                       const count = groupedEquipment[category]?.length || 0;
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.type}
                            {limit < 99 && <span className="ml-2 text-muted-foreground text-xs">({count}/{limit})</span>}
                          </TableCell>
                          <TableCell>{item.serialNumber}</TableCell>
                          <TableCell>
                            <Badge variant={equipmentStatusVariant[item.status]}>
                              {item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>Este vehículo no tiene equipamiento asignado actualmente.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Wrench className="h-6 w-6 text-primary" />
              <CardTitle>Estado y Operador</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-muted-foreground">Operador</p>
                <p>{operator?.name || 'No asignado'}</p>
              </div>
              <div>
                <p className="font-semibold text-muted-foreground">
                  Estado del Vehículo
                </p>
                <div>
                  <Badge variant={statusVariant[vehicle.status]}>
                    {vehicle.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <p className="font-medium">Total de Equipos Instalados</p>
                <p className="font-bold text-lg">{installedEquipment.length}</p>
              </div>
              <Separator />
              <div className="text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold">Última Revisión:</span>{' '}
                  24/05/2024
                </p>
                <p>
                  <span className="font-semibold">Próximo Mantenimiento:</span>{' '}
                  24/08/2024
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
