
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

// Mock data, to be replaced with Firestore data
const inventoryData = [
  { model: 'INDRA', serialNumber: 'SN-MAG-001', vehicleId: 'VEH-AG-300', status: 'Activa' },
  { model: 'ASCOM', serialNumber: 'SN-MAG-002', vehicleId: 'VEH-AG-301', status: 'Activa' },
  { model: 'INDRA', serialNumber: 'SN-MAG-003', vehicleId: 'VEH-AJ-302', status: 'De Baixa' },
];

export default function ContratoC4InventoryPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Inventari - Contracte C-4/2025</CardTitle>
          <CardDescription>Llistat de tot el parc de validadores magnètiques.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead>Nº Sèrie</TableHead>
                <TableHead>Vehicle Assignat</TableHead>
                <TableHead>Estat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData.map((item) => (
                <TableRow key={item.serialNumber}>
                  <TableCell>{item.model}</TableCell>
                  <TableCell>{item.serialNumber}</TableCell>
                  <TableCell>{item.vehicleId}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'Activa' ? 'default' : 'destructive'}>
                      {item.status}
                    </Badge>
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
