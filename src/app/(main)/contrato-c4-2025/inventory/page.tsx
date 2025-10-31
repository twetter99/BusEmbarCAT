'use client';

import { useMemo, useState } from 'react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertCircle, Trash2, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Tipos
type InventoryItem = {
  id: string;
  definitionRef: string;
  model: string;
  serialNumber: string;
  vehicleRef: string;
  status: 'Activa' | 'De Baixa';
};

type Vehicle = {
  id: string;
  uniqueId?: string;
  codBus?: string;
  operatorId?: string;
  cochera?: string;
};

type InventoryItemWithVehicle = InventoryItem & {
  vehicleId?: string;
  vehicleMatricula?: string;
  operador?: string;
  cochera?: string;
};

// DATOS MOCK LOCALES - Del pliego del Contracte C-4/2025
const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'VAL-MAG-1001', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'VAL-MAG-1001', vehicleRef: 'BUS-TCC-01', status: 'Activa' },
  { id: 'VAL-MAG-1002', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'VAL-MAG-1002', vehicleRef: 'BUS-TCC-02', status: 'Activa' },
  { id: 'VAL-MAG-1003', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'VAL-MAG-1003', vehicleRef: 'BUS-SAG-01', status: 'Activa' },
  { id: 'VAL-MAG-1004', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'VAL-MAG-1004', vehicleRef: 'BUS-SAG-02', status: 'Activa' },
  { id: 'VAL-MAG-1005', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'VAL-MAG-1005', vehicleRef: 'BUS-SAG-03', status: 'De Baixa' },
  { id: 'VAL-MAG-2001', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'VAL-MAG-2001', vehicleRef: 'BUS-MOV-01', status: 'Activa' },
  { id: 'VAL-MAG-2002', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'VAL-MAG-2002', vehicleRef: 'BUS-MOV-02', status: 'Activa' },
  { id: 'VAL-MAG-2003', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'VAL-MAG-2003', vehicleRef: 'BUS-MOV-03', status: 'Activa' },
  { id: 'VAL-MAG-2004', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'VAL-MAG-2004', vehicleRef: 'BUS-MOV-04', status: 'Activa' },
  { id: 'VAL-MAG-2005', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'VAL-MAG-2005', vehicleRef: 'BUS-SOL-01', status: 'De Baixa' },
  { id: 'VAL-MAG-1006', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'VAL-MAG-1006', vehicleRef: 'BUS-CAS-01', status: 'Activa' },
  { id: 'VAL-MAG-1007', definitionRef: 'validadora_magnetica_svv', model: 'INDRA', serialNumber: 'VAL-MAG-1007', vehicleRef: 'BUS-CAS-02', status: 'Activa' },
  { id: 'VAL-MAG-2006', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'VAL-MAG-2006', vehicleRef: 'BUS-HIS-01', status: 'Activa' },
  { id: 'VAL-MAG-2007', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'VAL-MAG-2007', vehicleRef: 'BUS-HIS-02', status: 'Activa' },
  { id: 'VAL-MAG-2008', definitionRef: 'validadora_magnetica_svv', model: 'ASCOM', serialNumber: 'VAL-MAG-2008', vehicleRef: 'BUS-HIS-03', status: 'Activa' },
];

const MOCK_VEHICLES: Vehicle[] = [
  { id: 'BUS-TCC-01', uniqueId: 'TCC-1001', codBus: '1001-TCC', operatorId: 'TRANSPORTS CIUTAT COMTAL SA', cochera: 'Barcelona - Casablanca' },
  { id: 'BUS-TCC-02', uniqueId: 'TCC-1002', codBus: '1002-TCC', operatorId: 'TRANSPORTS CIUTAT COMTAL SA', cochera: 'Barcelona - Casablanca' },
  { id: 'BUS-SAG-01', uniqueId: 'SAG-2001', codBus: '2001-SAG', operatorId: 'EMPRESA SAGALÉS SA', cochera: 'Mollet del Vallès' },
  { id: 'BUS-SAG-02', uniqueId: 'SAG-2002', codBus: '2002-SAG', operatorId: 'EMPRESA SAGALÉS SA', cochera: 'Mollet del Vallès' },
  { id: 'BUS-SAG-03', uniqueId: 'SAG-2003', codBus: '2003-SAG', operatorId: 'EMPRESA SAGALÉS SA', cochera: 'Mollet del Vallès' },
  { id: 'BUS-MOV-01', uniqueId: 'MOV-3001', codBus: '3001-MOV', operatorId: 'MOVENTIA L\'HOSPITALET', cochera: 'Barcelona - Sants' },
  { id: 'BUS-MOV-02', uniqueId: 'MOV-3002', codBus: '3002-MOV', operatorId: 'MOVENTIA L\'HOSPITALET', cochera: 'Barcelona - Sants' },
  { id: 'BUS-MOV-03', uniqueId: 'MOV-3003', codBus: '3003-MOV', operatorId: 'MOVENTIA L\'HOSPITALET', cochera: 'Barcelona - Sants' },
  { id: 'BUS-MOV-04', uniqueId: 'MOV-3004', codBus: '3004-MOV', operatorId: 'MOVENTIA L\'HOSPITALET', cochera: 'Barcelona - Sants' },
  { id: 'BUS-SOL-01', uniqueId: 'SOL-4001', codBus: '4001-SOL', operatorId: 'SOLER Y SAURET SA', cochera: 'Sant Feliu de Llobregat' },
  { id: 'BUS-CAS-01', uniqueId: 'CAS-5001', codBus: '5001-CAS', operatorId: 'EMPRESA CASAS SA', cochera: 'Mataró' },
  { id: 'BUS-CAS-02', uniqueId: 'CAS-5002', codBus: '5002-CAS', operatorId: 'EMPRESA CASAS SA', cochera: 'Mataró' },
  { id: 'BUS-HIS-01', uniqueId: 'HIS-6001', codBus: '6001-HIS', operatorId: 'LA HISPANO IGUALADINA SL', cochera: 'Igualada' },
  { id: 'BUS-HIS-02', uniqueId: 'HIS-6002', codBus: '6002-HIS', operatorId: 'LA HISPANO IGUALADINA SL', cochera: 'Reus' },
  { id: 'BUS-HIS-03', uniqueId: 'HIS-6003', codBus: '6003-HIS', operatorId: 'LA HISPANO IGUALADINA SL', cochera: 'Igualada' },
];

export default function ContratoC4InventoryPage() {
  const { toast } = useToast();
  
  // Estado local con datos mock
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [vehiclesData] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [itemToDeactivate, setItemToDeactivate] = useState<InventoryItemWithVehicle | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  // Combinar datos de inventario con información de vehículos
  const inventoryWithVehicles = useMemo((): InventoryItemWithVehicle[] => {
    return inventoryData.map(item => {
      // Buscar el vehículo usando vehicleRef
      const vehicle = vehiclesData.find(v => v.id === item.vehicleRef);
      
      return {
        ...item,
        vehicleId: vehicle?.uniqueId || vehicle?.id || item.vehicleRef,
        vehicleMatricula: vehicle?.codBus || vehicle?.id || 'Desconegut',
        operador: vehicle?.operatorId || 'Desconegut',
        cochera: vehicle?.cochera || 'Desconeguda',
      };
    });
  }, [inventoryData, vehiclesData]);

  // Función para dar de baja un equipo (actualiza el estado local)
  const handleDeactivate = async () => {
    if (!itemToDeactivate) return;

    setIsDeactivating(true);
    
    // Simular un pequeño delay para UX
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Actualizar el estado local
      setInventoryData(prevData => 
        prevData.map(item => 
          item.id === itemToDeactivate.id 
            ? { ...item, status: 'De Baixa' as const }
            : item
        )
      );

      toast({
        title: '✅ Equip donat de baixa',
        description: `El validador ${itemToDeactivate.serialNumber} ha estat marcat com "De Baixa".`,
      });

      setItemToDeactivate(null);
    } catch (error) {
      console.error('Error al donar de baixa:', error);
      toast({
        title: '❌ Error',
        description: 'No s\'ha pogut donar de baixa l\'equip.',
        variant: 'destructive',
      });
    } finally {
      setIsDeactivating(false);
    }
  };

  // Estadísticas
  const stats = useMemo(() => {
    const total = inventoryWithVehicles.length;
    const actives = inventoryWithVehicles.filter(i => i.status === 'Activa').length;
    const deactivated = inventoryWithVehicles.filter(i => i.status === 'De Baixa').length;
    
    return { total, actives, deactivated };
  }, [inventoryWithVehicles]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      {/* Header con estadísticas */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventari Validadores</h1>
          <p className="text-muted-foreground">
            Gestió del parc de validadores magnètiques - Contracte C-4/2025
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inventari</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actives</CardTitle>
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.actives}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">De Baixa</CardTitle>
              <div className="h-3 w-3 rounded-full bg-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.deactivated}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabla de Inventario */}
      <Card>
        <CardHeader>
          <CardTitle>Llistat Complet</CardTitle>
          <CardDescription>
            Totes les validadores magnètiques assignades al contracte
          </CardDescription>
        </CardHeader>
        <CardContent>
          {inventoryWithVehicles.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
              No hi ha validadores a l'inventari
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Sèrie</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Operador</TableHead>
                    <TableHead>Cotxera</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Estat</TableHead>
                    <TableHead className="text-right">Accions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryWithVehicles.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.serialNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.model}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{item.operador}</TableCell>
                      <TableCell className="text-sm">{item.cochera}</TableCell>
                      <TableCell className="text-sm">{item.vehicleMatricula}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.status === 'Activa' ? 'default' : 'destructive'}
                          className={item.status === 'Activa' ? 'bg-green-500 hover:bg-green-600' : ''}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {item.status === 'Activa' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setItemToDeactivate(item)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Donar de Baixa
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de confirmación para dar de baja */}
      <AlertDialog open={!!itemToDeactivate} onOpenChange={(open) => !open && setItemToDeactivate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Baixa d'Equip</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2">
                <p>
                  Estàs a punt de donar de baixa el següent equip:
                </p>
                {itemToDeactivate && (
                  <div className="rounded-md bg-muted p-4 space-y-1 text-sm">
                    <div><strong>Nº Sèrie:</strong> {itemToDeactivate.serialNumber}</div>
                    <div><strong>Model:</strong> {itemToDeactivate.model}</div>
                    <div><strong>Operador:</strong> {itemToDeactivate.operador}</div>
                    <div><strong>Cotxera:</strong> {itemToDeactivate.cochera}</div>
                    <div><strong>Vehicle:</strong> {itemToDeactivate.vehicleMatricula}</div>
                  </div>
                )}
                <p className="text-destructive font-medium">
                  ⚠️ Aquesta acció actualitzarà el KPI "Unitats de Baixa" i afectarà el càlcul de reducció a facturar.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeactivating}>Cancel·lar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              disabled={isDeactivating}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeactivating ? 'Processant...' : 'Confirmar Baixa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
