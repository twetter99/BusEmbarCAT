
'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock data
const checklistSteps = [
    { id: 'step1', text: 'Verificació visual externa de la validadora', type: 'checkbox' },
    { id: 'step2', text: 'Neteja de la carcassa i pantalla', type: 'checkbox' },
    { id: 'step3', text: 'Comprovació de la lectura de targetes', type: 'checkbox' },
    { id: 'step4', text: 'Fotografia de l\'estat final', type: 'photo' },
];

export default function WorkOrderDetailPage() {
    const params = useParams();
    const { id } = params;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/contrato-c4-2025/work">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Tornar</span>
          </Link>
        </Button>
        <div>
            <h1 className="text-2xl font-bold">Execució OT: {id}</h1>
            <p className="text-muted-foreground">Revisió Trimestral per al vehicle VEH-AG-300</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Checklist de Manteniment</CardTitle>
          <CardDescription>Completeu tots els passos per finalitzar la tasca.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {checklistSteps.map(step => (
                <div key={step.id} className="flex items-center space-x-2">
                    {step.type === 'checkbox' && (
                        <>
                            <Checkbox id={step.id} />
                            <Label htmlFor={step.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {step.text}
                            </Label>
                        </>
                    )}
                    {step.type === 'photo' && (
                        <div className="w-full">
                            <Label htmlFor={step.id}>{step.text}</Label>
                            <Button variant="outline" className="w-full mt-1">Pujar Fotografia</Button>
                        </div>
                    )}
                </div>
            ))}
             <Button className="w-full">Finalitzar Manteniment</Button>
        </CardContent>
      </Card>
    </main>
  );
}

    