
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Mock data
const workOrders = {
  'Cotxera de Ponent': [
    { id: 'ot-001', vehicleId: 'VEH-AG-300', plan: 'Revisió Trimestral' },
    { id: 'ot-002', vehicleId: 'VEH-AG-301', plan: 'Revisió Trimestral' },
  ],
  'Cotxera del Nord': [
    { id: 'ot-003', vehicleId: 'VEH-AJ-303', plan: 'Revisió Anual' },
  ],
};

export default function ContratoC4WorkPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Ordres de Treball Pendents</CardTitle>
          <CardDescription>Tasques de manteniment assignades, agrupades per cotxera.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(workOrders).map(([cochera, orders]) => (
            <div key={cochera}>
              <h2 className="text-lg font-semibold mb-2">{cochera}</h2>
              <div className="border rounded-md">
                {orders.map((order, index) => (
                  <div key={order.id} className={`flex justify-between items-center p-4 ${index < orders.length - 1 ? 'border-b' : ''}`}>
                    <div>
                      <p className="font-medium">{order.plan} - {order.vehicleId}</p>
                      <p className="text-sm text-muted-foreground">ID Ordre: {order.id}</p>
                    </div>
                    <Button asChild>
                      <Link href={`/contrato-c4-2025/work/${order.id}`}>Iniciar</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
