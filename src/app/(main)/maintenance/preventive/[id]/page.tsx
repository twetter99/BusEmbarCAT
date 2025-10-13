
'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar as CalendarIcon, Check, Clock } from 'lucide-react';
import { mockTasks, mockVehicles, mockOperators } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { getChecklistData, ChecklistSectionData, ChecklistItemData } from '@/lib/checklists-data';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"


const FormField = ({ label, type, id }: { label: string, type: string, id: string }) => {
  const [date, setDate] = React.useState<Date>()

  if (type === 'date') {
    return (
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor={id} className="text-right">{label}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[200px] justify-start text-left font-normal col-span-3",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Seleccionar data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">{label}</Label>
      <Input id={id} type={type} className="col-span-3" />
    </div>
  );
};

const ChecklistItem = ({ item, level = 0 }: { item: ChecklistItemData, level?: number }) => {
    const [isChecked, setIsChecked] = React.useState(false);
    return (
        <div style={{ marginLeft: `${level * 2}rem`}}>
            <div className="flex items-center space-x-3 py-2">
                <Checkbox id={item.id} checked={isChecked} onCheckedChange={(checked) => setIsChecked(!!checked)} />
                <label
                    htmlFor={item.id}
                    className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", isChecked && "line-through text-muted-foreground")}
                >
                    {item.text}
                </label>
            </div>
            {item.subItems && item.subItems.map(subItem => <ChecklistItem key={subItem.id} item={subItem} level={level + 1} />)}
        </div>
    );
}

const ChecklistSection = ({ title, items }: { title: string, items: ChecklistItemData[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          <ChecklistItem item={item} />
          {index < items.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </CardContent>
  </Card>
);

export default function MaintenanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const task = mockTasks.find((t) => t.id === id);

  if (!task) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle>Tasca no trobada</CardTitle>
                <CardDescription>La tasca de manteniment que cerqueu no existeix.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => router.back()}>Tornar</Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  const vehicle = mockVehicles.find(v => v.id === task.vehicleId);
  const operator = mockOperators.find(o => o.id === vehicle?.operatorId);
  const checklistData = getChecklistData(task.frequency);

  if (!checklistData) {
      return (
         <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle>Checklist no disponible</CardTitle>
                    <CardDescription>No hi ha un checklist definit per a la freqüència "{task.frequency}".</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.back()}>Tornar</Button>
                </CardContent>
            </Card>
        </div>
      )
  }
  
  const allTasks: ChecklistItemData[] = [
      ...(checklistData.tasks?.items || []),
      ...(checklistData.additionalTasks?.items || []),
      ...(checklistData.batteryReplacement?.items || []),
      ...(checklistData.postOperations?.items || []),
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Tornar</span>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{`Manteniment Preventiu: ${task.frequency}`}</h1>
          <p className="text-muted-foreground">Fitxa de Manteniment per a {vehicle?.uniqueId}</p>
        </div>
        <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-sm font-medium">
                <span>Progrés</span>
                <span>0/{allTasks.length}</span>
            </div>
            <Progress value={0} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         <div className="lg:col-span-2 space-y-6">
            {checklistData.tasks && <ChecklistSection title={checklistData.tasks.title} items={checklistData.tasks.items} />}
            {checklistData.additionalTasks && <ChecklistSection title={checklistData.additionalTasks.title} items={checklistData.additionalTasks.items} />}
            {checklistData.batteryReplacement && <ChecklistSection title={checklistData.batteryReplacement.title} items={checklistData.batteryReplacement.items} />}
            {checklistData.postOperations && <ChecklistSection title={checklistData.postOperations.title} items={checklistData.postOperations.items} />}
            
            {checklistData.observations && (
                <Card>
                    <CardHeader><CardTitle>{checklistData.observations.title}</CardTitle></CardHeader>
                    <CardContent>
                        <Textarea id={checklistData.observations.id} placeholder="Afegir comentaris, recanvis utilitzats, etc." rows={5}/>
                    </CardContent>
                </Card>
            )}

         </div>
         <div className="space-y-6">
            <Card>
                <CardHeader><CardTitle>{checklistData.generalData.title}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {checklistData.generalData.fields.map(field => <FormField key={field.id} {...field} />)}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>{checklistData.hardwareData.title}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {checklistData.hardwareData.fields.map(field => <FormField key={field.id} {...field} />)}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>{checklistData.softwareData.title}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {checklistData.softwareData.fields.map(field => <FormField key={field.id} {...field} />)}
                </CardContent>
            </Card>

            {checklistData.preexistences && (
                 <Card>
                    <CardHeader><CardTitle>{checklistData.preexistences.title}</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {checklistData.preexistences.fields.map(field => <FormField key={field.id} {...field} />)}
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader><CardTitle>Accions</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    <Button className="w-full">Guardar Progrés</Button>
                    <Button variant="outline" className="w-full">Generar PDF</Button>
                    <Button variant="default" className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Check className="mr-2 h-4 w-4" />
                        Completar Manteniment
                    </Button>
                </CardContent>
            </Card>
         </div>
      </div>
    </main>
  );
}
