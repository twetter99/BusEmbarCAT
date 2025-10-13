
'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { mockOperators, mockVehicles, mockInventory } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const technicians = ['Jordi', 'Pau', 'Marc', 'Oriol', 'Xavier', 'Miquel', 'Josep', 'Carles', 'David', 'Bernat', 'Quim', 'Toni', 'Ramon', 'Ferran', 'Albert'];
const vehicleModels = ['Mercedes Citaro', 'Solaris Urbino', 'Otokar Vectio'];
const warehouses = ['Magatzem A', 'Magatzem B', 'Magatzem C'];

const availableSpecificEquipment = mockInventory.filter(
    item => item.category === 'Material específico SERMETRA' && item.stock > 0
);
const availablePupitres = availableSpecificEquipment.filter(item => item.name.includes('Pupitre'));
const availableValidators = availableSpecificEquipment.filter(item => item.name.includes('Validadora'));
const availableConsultTerminals = availableSpecificEquipment.filter(item => item.name.includes('Terminal de consulta'));


// --- Installation Form ---
const installationSchema = z.object({
  vehicleId: z.string().min(1, 'ID de vehicle és requerit'),
  licensePlate: z.string().min(1, 'Matrícula és requerida'),
  model: z.string().min(1, 'Model és requerit'),
  operatorId: z.string().min(1, 'Operador és requerit'),
  depot: z.string().optional(),
  installDate: z.date({ required_error: 'Data d\'instal·lació és requerida' }),
  technician: z.string().min(1, 'Tècnic és requerit'),
  priority: z.enum(['Normal', 'Urgent']),
  materials: z.object({
    pupitre: z.string().optional(),
    validators: z.array(z.string()).optional(),
    consultTerminal: z.string().optional(),
    auxMaterial: z.boolean(),
    wiring: z.string().optional(),
  }),
  observations: z.string().optional(),
});

type InstallationFormData = z.infer<typeof installationSchema>;

export function NewInstallationForm({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<InstallationFormData>({
    resolver: zodResolver(installationSchema),
    defaultValues: {
        priority: 'Normal',
        materials: {
            auxMaterial: false,
        }
    }
  });

  const onSubmit = (data: InstallationFormData) => {
    console.log(data);
    toast({ title: 'Instal·lació programada', description: 'La nova instal·lació ha estat registrada.' });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Nova Instal·lació</DialogTitle>
            <DialogDescription>Ompliu les dades per programar una nova instal·lació d'equipament.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
            <h3 className="font-semibold text-lg">Informació del Vehicle</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="vehicleId">ID Vehicle</Label>
                    <Input id="vehicleId" {...register('vehicleId')} />
                    {errors.vehicleId && <p className="text-destructive text-sm mt-1">{errors.vehicleId.message}</p>}
                </div>
                 <div>
                    <Label htmlFor="licensePlate">Matrícula</Label>
                    <Input id="licensePlate" {...register('licensePlate')} />
                    {errors.licensePlate && <p className="text-destructive text-sm mt-1">{errors.licensePlate.message}</p>}
                </div>
                 <div>
                    <Label htmlFor="model">Model</Label>
                     <Controller
                        control={control}
                        name="model"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar model..." /></SelectTrigger>
                            <SelectContent>
                                {vehicleModels.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        )}
                    />
                    {errors.model && <p className="text-destructive text-sm mt-1">{errors.model.message}</p>}
                </div>
                <div>
                    <Label htmlFor="operatorId">Operador</Label>
                     <Controller
                        control={control}
                        name="operatorId"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar operador..." /></SelectTrigger>
                            <SelectContent>
                                {mockOperators.map(op => <SelectItem key={op.id} value={op.id}>{op.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        )}
                    />
                    {errors.operatorId && <p className="text-destructive text-sm mt-1">{errors.operatorId.message}</p>}
                </div>
                 <div>
                    <Label htmlFor="depot">Cotxera</Label>
                    <Input id="depot" {...register('depot')} />
                </div>
            </div>

            <h3 className="font-semibold text-lg mt-4">Programació</h3>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Data d'instal·lació</Label>
                    <Controller
                        control={control}
                        name="installDate"
                        render={({ field }) => (
                             <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, "PPP") : <span>Seleccionar data</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    {errors.installDate && <p className="text-destructive text-sm mt-1">{errors.installDate.message}</p>}
                </div>
                <div>
                    <Label htmlFor="technician">Tècnic assignat</Label>
                    <Controller
                        control={control}
                        name="technician"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar tècnic..." /></SelectTrigger>
                            <SelectContent>
                                {technicians.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        )}
                    />
                     {errors.technician && <p className="text-destructive text-sm mt-1">{errors.technician.message}</p>}
                </div>
                <div>
                    <Label>Prioritat</Label>
                    <Controller
                        control={control}
                        name="priority"
                        render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 items-center mt-2">
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Normal" id="p-normal" />
                                <Label htmlFor="p-normal">Normal</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Urgent" id="p-urgente" />
                                <Label htmlFor="p-urgente">Urgent</Label>
                            </div>
                        </RadioGroup>
                         )}
                    />
                </div>
            </div>

            <h3 className="font-semibold text-lg mt-4">Material Requerit</h3>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="pupitre">Pupitre (Nº Sèrie)</Label>
                    <Controller
                        control={control}
                        name="materials.pupitre"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar pupitre..." /></SelectTrigger>
                            <SelectContent>
                                {availablePupitres.map(p => <SelectItem key={p.id} value={p.serialNumber!}>{p.serialNumber}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        )}
                    />
                </div>
                <div>
                    <Label htmlFor="validators">Validadoras (Nº Sèrie)</Label>
                    {/* This could be a multi-select component in a real app */}
                    <Controller
                        control={control}
                        name="materials.validators"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value?.[0]}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar validadora..." /></SelectTrigger>
                            <SelectContent>
                                {availableValidators.map(v => <SelectItem key={v.id} value={v.serialNumber!}>{v.name} - {v.serialNumber}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        )}
                    />
                </div>
                <div>
                    <Label htmlFor="consultTerminal">Terminal de consulta (Nº Sèrie)</Label>
                    <Controller
                        control={control}
                        name="materials.consultTerminal"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar terminal..." /></SelectTrigger>
                            <SelectContent>
                                {availableConsultTerminals.map(t => <SelectItem key={t.id} value={t.serialNumber!}>{t.serialNumber}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        )}
                    />
                </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox id="auxMaterial" {...register('materials.auxMaterial')} />
                    <Label htmlFor="auxMaterial">Material auxiliar complet (cablejat, connectors...)</Label>
                </div>
                 <div>
                    <Label htmlFor="wiring">Estat Cablejat</Label>
                    <Controller
                        control={control}
                        name="materials.wiring"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar estat..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="carrocero">Subministrat per carrosser</SelectItem>
                                <SelectItem value="pendiente">Pendent de subministrament</SelectItem>
                            </SelectContent>
                        </Select>
                        )}
                    />
                </div>
            </div>
             <div className="mt-4">
                <Label htmlFor="observations">Observacions</Label>
                <Textarea id="observations" {...register('observations')} />
             </div>

          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel·lar</Button>
            <Button type="submit">Programar Instal·lació</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- Decommissioning Form ---
const decommissioningSchema = z.object({
  vehicleId: z.string().min(1, 'Heu de seleccionar un vehicle'),
  reason: z.enum(['Baja definitiva vehículo', 'Preparación para traspaso', 'Reparación mayor', 'Cambio de operador']),
  decommissionDate: z.date({ required_error: 'La data és requerida' }),
  technician: z.string().min(1, 'El tècnic és requerit'),
  materialDestination: z.string().min(1, 'El destí és requerit'),
});

type DecommissioningFormData = z.infer<typeof decommissioningSchema>;

export function NewDecommissioningForm({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<DecommissioningFormData>({
    resolver: zodResolver(decommissioningSchema),
  });

  const onSubmit = (data: DecommissioningFormData) => {
    console.log(data);
    // Here you would trigger the logic to update inventory status
    toast({ 
        title: 'Desinstal·lació programada', 
        description: `El material es retornarà a ${data.materialDestination}. L'estoc s'actualitzarà en completar.`
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Nova Desinstal·lació</DialogTitle>
             <DialogDescription>Ompliu les dades per programar una nova desinstal·lació.</DialogDescription>
          </DialogHeader>
           <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <div>
                    <Label htmlFor="vehicleId">Vehicle a Desinstal·lar</Label>
                    <Controller
                        control={control}
                        name="vehicleId"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar vehicle..." /></SelectTrigger>
                            <SelectContent>
                                {mockVehicles.filter(v => v.status === 'Activo').map(v => <SelectItem key={v.uniqueId} value={v.uniqueId}>{v.uniqueId} ({v.id})</SelectItem>)}
                            </SelectContent>
                        </Select>
                        )}
                    />
                     {errors.vehicleId && <p className="text-destructive text-sm mt-1">{errors.vehicleId.message}</p>}
                </div>
                 <div>
                    <Label htmlFor="reason">Motiu de la desinstal·lació</Label>
                    <Controller
                        control={control}
                        name="reason"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar motiu..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Baja definitiva vehículo">Baixa definitiva vehicle</SelectItem>
                                <SelectItem value="Preparación para traspaso">Preparació per a traspàs</SelectItem>
                                <SelectItem value="Reparación mayor">Reparació major</SelectItem>
                                <SelectItem value="Cambio de operador">Canvi d'operador</SelectItem>
                            </SelectContent>
                        </Select>
                        )}
                    />
                    {errors.reason && <p className="text-destructive text-sm mt-1">{String(errors.reason.message)}</p>}
                </div>
                
                <h3 className="font-semibold text-lg mt-4">Programació</h3>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <Label>Data desinstal·lació</Label>
                        <Controller
                            control={control}
                            name="decommissionDate"
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? format(field.value, "PPP") : <span>Seleccionar data</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                                </Popover>
                            )}
                        />
                        {errors.decommissionDate && <p className="text-destructive text-sm mt-1">{errors.decommissionDate.message}</p>}
                    </div>
                     <div>
                        <Label htmlFor="technician">Tècnic assignat</Label>
                        <Controller
                            control={control}
                            name="technician"
                            render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar tècnic..." /></SelectTrigger>
                                <SelectContent>
                                    {technicians.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            )}
                        />
                        {errors.technician && <p className="text-destructive text-sm mt-1">{errors.technician.message}</p>}
                    </div>
                </div>

                <div>
                    <Label htmlFor="materialDestination">Destí del material recuperat</Label>
                    <Controller
                        control={control}
                        name="materialDestination"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar destí..." /></SelectTrigger>
                            <SelectContent>
                                {warehouses.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                                 <SelectItem value="Traspaso directo">Traspàs directe</SelectItem>
                                 <SelectItem value="Taller de reparaciones">Taller de reparacions</SelectItem>
                            </SelectContent>
                        </Select>
                        )}
                    />
                    {errors.materialDestination && <p className="text-destructive text-sm mt-1">{errors.materialDestination.message}</p>}
                </div>
          </div>
          <DialogFooter>
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel·lar</Button>
             <Button type="submit">Programar Desinstal·lació</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- Transfer Form ---
const transferSchema = z.object({
    originVehicleId: z.string().min(1, 'Heu de seleccionar un vehicle d\'origen'),
    destinationVehicleId: z.string().min(1, 'ID de vehicle destí és requerit'),
    destinationLicensePlate: z.string().min(1, 'Matrícula destí és requerida'),
    destinationModel: z.string().min(1, 'Model destí és requerit'),
    destinationOperatorId: z.string().min(1, 'Operador destí és requerit'),
    transferType: z.enum(['directo', 'dos_fases']),
    decommissionDate: z.date().optional(),
    installDate: z.date().optional(),
    tempWarehouse: z.string().optional(),
    technician1: z.string().optional(),
    technician2: z.string().optional(),
}).refine(data => {
    if (data.transferType === 'dos_fases') {
        return !!data.decommissionDate && !!data.installDate;
    }
    return true;
}, {
    message: "Les dates de desinstal·lació i instal·lació són requerides per a traspàs en 2 fases",
    path: ["installDate"]
});


type TransferFormData = z.infer<typeof transferSchema>;

export function NewTransferForm({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
        transferType: 'directo'
    }
  });
  const transferType = watch('transferType');

  const onSubmit = (data: TransferFormData) => {
    console.log(data);
    toast({ title: 'Traspàs programat', description: 'El nou traspàs ha estat registrat.' });
    onOpenChange(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Nou Traspàs</DialogTitle>
            <DialogDescription>Ompliu les dades per programar un nou traspàs d'equipament.</DialogDescription>
          </DialogHeader>
           <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <h3 className="font-semibold text-lg">Vehicle Origen</h3>
                <div>
                    <Label htmlFor="originVehicleId">Seleccionar vehicle origen</Label>
                     <Controller
                        control={control}
                        name="originVehicleId"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar vehicle..." /></SelectTrigger>
                            <SelectContent>
                                {mockVehicles.filter(v => v.status === 'Activo').map(v => <SelectItem key={v.uniqueId} value={v.uniqueId}>{v.uniqueId} ({v.id})</SelectItem>)}
                            </SelectContent>
                        </Select>
                        )}
                    />
                    {errors.originVehicleId && <p className="text-destructive text-sm mt-1">{errors.originVehicleId.message}</p>}
                </div>

                <h3 className="font-semibold text-lg mt-4">Vehicle Destí</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="destinationVehicleId">ID Vehicle Destí</Label>
                        <Input id="destinationVehicleId" {...register('destinationVehicleId')} />
                        {errors.destinationVehicleId && <p className="text-destructive text-sm mt-1">{errors.destinationVehicleId.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="destinationLicensePlate">Matrícula Destí</Label>
                        <Input id="destinationLicensePlate" {...register('destinationLicensePlate')} />
                         {errors.destinationLicensePlate && <p className="text-destructive text-sm mt-1">{errors.destinationLicensePlate.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="destinationModel">Model Destí</Label>
                        <Controller
                            control={control}
                            name="destinationModel"
                            render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar model..." /></SelectTrigger>
                                <SelectContent>{vehicleModels.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                            </Select>
                            )}
                        />
                        {errors.destinationModel && <p className="text-destructive text-sm mt-1">{errors.destinationModel.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="destinationOperatorId">Operador</Label>
                         <Controller
                            control={control}
                            name="destinationOperatorId"
                            render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar operador..." /></SelectTrigger>
                                <SelectContent>{mockOperators.map(op => <SelectItem key={op.id} value={op.id}>{op.name}</SelectItem>)}</SelectContent>
                            </Select>
                            )}
                        />
                        {errors.destinationOperatorId && <p className="text-destructive text-sm mt-1">{errors.destinationOperatorId.message}</p>}
                    </div>
                </div>

                <h3 className="font-semibold text-lg mt-4">Tipus i Programació</h3>
                 <div>
                    <Label>Tipus de Traspàs</Label>
                    <Controller
                        control={control}
                        name="transferType"
                        render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 items-center mt-2">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="directo" id="t-directo" /><Label htmlFor="t-directo">Traspàs directe (mateix dia)</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="dos_fases" id="t-fases" /><Label htmlFor="t-fases">Traspàs en 2 fases</Label></div>
                        </RadioGroup>
                        )}
                    />
                </div>
                 {transferType === 'dos_fases' && (
                    <div className="grid grid-cols-2 gap-4 mt-2 border p-4 rounded-md">
                        <div>
                            <Label>Data desinstal·lació</Label>
                             <Controller
                                control={control} name="decommissionDate" render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Seleccionar data</span>}</Button></PopoverTrigger>
                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                                </Popover>
                            )}/>
                             {errors.decommissionDate && <p className="text-destructive text-sm mt-1">{errors.decommissionDate.message}</p>}
                        </div>
                         <div>
                            <Label>Data instal·lació estimada</Label>
                             <Controller
                                control={control} name="installDate" render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Seleccionar data</span>}</Button></PopoverTrigger>
                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                                </Popover>
                            )}/>
                            {errors.installDate && <p className="text-destructive text-sm mt-1">{errors.installDate.message}</p>}
                        </div>
                         <div className="col-span-2">
                             <Label htmlFor="tempWarehouse">Magatzem temporal</Label>
                             <Controller
                                control={control}
                                name="tempWarehouse"
                                render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar magatzem..." /></SelectTrigger>
                                    <SelectContent>{warehouses.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                                </Select>
                                )}
                            />
                        </div>
                    </div>
                 )}
                  <div className="grid grid-cols-2 gap-4 mt-2">
                       <div>
                           <Label htmlFor="technician1">Tècnic {transferType === 'dos_fases' ? 'fase 1' : ''}</Label>
                            <Controller
                                control={control}
                                name="technician1"
                                render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar tècnic..." /></SelectTrigger>
                                    <SelectContent>{technicians.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                </Select>
                                )}
                            />
                       </div>
                        {transferType === 'dos_fases' && (
                             <div>
                                <Label htmlFor="technician2">Tècnic fase 2</Label>
                                 <Controller
                                    control={control}
                                    name="technician2"
                                    render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger><SelectValue placeholder="Seleccionar tècnic..." /></SelectTrigger>
                                        <SelectContent>{technicians.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                    </Select>
                                    )}
                                />
                             </div>
                        )}
                  </div>
           </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel·lar</Button>
            <Button type="submit">Programar Traspàs</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
