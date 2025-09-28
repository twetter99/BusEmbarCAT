
'use client';

import * as React from 'react';

// This page will serve as the entry point for the new modular preventive maintenance system.
// For now, it's a placeholder for the "Dashboard Ejecutivo".
export default function PreventivePage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
       <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Dashboard Ejecutivo de Mantenimiento Preventivo</h1>
            <p className="text-muted-foreground mt-2">Próximamente: KPIs, gráficos y métricas estratégicas.</p>
          </div>
       </div>
    </main>
  );
}
