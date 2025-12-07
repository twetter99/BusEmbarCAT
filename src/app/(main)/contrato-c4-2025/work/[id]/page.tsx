
'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Camera } from 'lucide-react';
import Link from 'next/link';
import { C4_CHECKLIST_DATA } from '@/lib/contrato-c4-data';

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
          <CardTitle>{C4_CHECKLIST_DATA.name}</CardTitle>
          <CardDescription>
            Checklist oficial segons PPT Secció 2.1.2 i PCAP Secció N (16 puntos)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {C4_CHECKLIST_DATA.steps.map((step, index) => (
                <div key={step.id} className="space-y-2">
                    {step.type === 'checkbox' && (
                        <div className="flex items-center space-x-2">
                            <Checkbox id={step.id} />
                            <Label 
                              htmlFor={step.id} 
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {index + 1}. {step.text}
                            </Label>
                        </div>
                    )}
                    {step.type === 'select' && (
                        <div className="space-y-2">
                            <Label htmlFor={step.id} className="text-sm font-medium">
                                {index + 1}. {step.text}
                            </Label>
                            <Select>
                              <SelectTrigger id={step.id}>
                                <SelectValue placeholder="Selecciona una opció" />
                              </SelectTrigger>
                              <SelectContent>
                                {step.options?.map((option) => (
                                  <SelectItem key={option} value={option.toLowerCase()}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                        </div>
                    )}
                    {step.type === 'textarea' && (
                        <div className="space-y-2">
                            <Label htmlFor={step.id} className="text-sm font-medium">
                                {index + 1}. {step.text}
                            </Label>
                            <Textarea 
                              id={step.id} 
                              placeholder="Escriu les observacions del tècnic..."
                              className="min-h-[100px]"
                            />
                        </div>
                    )}
                    {step.type === 'photo' && (
                        <div className="space-y-2">
                            <Label htmlFor={step.id} className="text-sm font-medium">
                                {index + 1}. {step.text}
                            </Label>
                            <Button variant="outline" className="w-full" id={step.id}>
                              <Camera className="h-4 w-4 mr-2" />
                              Pujar Fotografia
                            </Button>
                        </div>
                    )}
                </div>
            ))}
            <div className="pt-4 border-t">
              <Button className="w-full">Finalitzar Manteniment</Button>
            </div>
        </CardContent>
      </Card>
    </main>
  );
}

    