
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { mockOperatorMetrics } from '@/lib/data';
import { OperatorCard } from './components/operator-card';

export default function OperatorsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Operadores</h1>
          <p className="text-muted-foreground">
            Supervisa el estado y rendimiento de todos los operadores de la flota.
          </p>
        </div>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          Añadir Operador
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {mockOperatorMetrics.map((operator) => (
          <OperatorCard key={operator.id} operator={operator} />
        ))}
      </div>
    </main>
  );
}

    