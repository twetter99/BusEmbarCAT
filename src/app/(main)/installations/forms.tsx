
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
import { mockOperators, mockVehicles } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const technicians = ['Jordi', 'Pau', 'Marc', 'Oriol', 'Xavier', 'Miquel', 'Josep', 'Carles', 'David', 'Bernat', 'Quim', 'Toni', 'Ramon', 'Ferran', 'Albert'];
const vehicleModels = ['Mercedes Citaro', 'Solaris Urbino', 'Otokar Vectio'];
const warehouses = ['Almacén A', 'Almacén B', 'Almacén C'];

// --- Installation Form ---
const installationSchema = z.object({
  vehicleId: z.string().min(1, 'ID de vehículo es requerido'),
  licensePlate: z.string().min(1, 'Matrícula es requerida'),
  model: z.string().min(1, 'Modelo es requerido'),
  operatorId: z.string().min(1, 'Operador es requerido'),
  depot: z.string().optional(),
  installDate: z.date({ required_error: 'Fecha de instalación es requerida' }),
  technician: z.string().min(1, 'Técnico es requerido'),
  priority: z.enum(['Normal', 'Urgente']),
  materials: z.object({
    pupitre: z.boolean(),
    validators: z.string().optional(),
    consultTerminal: z.boolean(),
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
            pupitre: false,
            consultTerminal: false,
            auxMaterial: false,
        }
    }
  });

  const onSubmit = (data: InstallationFormData) => {
    console.log(data);
    toast({ title: 'Instalación programada', description: 'La nueva instalación ha sido registrada.' });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Nueva Instalación</DialogTitle>
            <DialogDescription>Rellena los datos para programar una nueva instalación de equipamiento.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
            <h3 className="font-semibold text-lg">Información del Vehículo</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="vehicleId">ID Vehículo</Label>
                    <Input id="vehicleId" {...register('vehicleId')} />
                    {errors.vehicleId && <p className="text-destructive text-sm mt-1">{errors.vehicleId.message}</p>}
                </div>
                 <div>
                    <Label htmlFor="licensePlate">Matrícula</Label>
                    <Input id="licensePlate" {...register('licensePlate')} />
                    {errors.licensePlate && <p className="text-destructive text-sm mt-1">{errors.licensePlate.message}</p>}
                </div>
                 <div>
                    <Label htmlFor="model">Modelo</Label>
                     <Controller
                        control={control}
                        name="model"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar modelo..." /></SelectTrigger>
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
                    <Label htmlFor="depot">Cochera</Label>
                    <Input id="depot" {...register('depot')} />
                </div>
            </div>

            <h3 className="font-semibold text-lg mt-4">Programación</h3>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label>Fecha de instalación</Label>
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
                                    {field.value ? format(field.value, "PPP") : <span>Seleccionar fecha</span>}
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
                    <Label htmlFor="technician">Técnico asignado</Label>
                    <Controller
                        control={control}
                        name="technician"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar técnico..." /></SelectTrigger>
                            <SelectContent>
                                {technicians.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        )}
                    />
                     {errors.technician && <p className="text-destructive text-sm mt-1">{errors.technician.message}</p>}
                </div>
                <div>
                    <Label>Prioridad</Label>
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
                                <RadioGroupItem value="Urgente" id="p-urgente" />
                                <Label htmlFor="p-urgente">Urgente</Label>
                            </div>
                        </RadioGroup>
                         )}
                    />
                </div>
            </div>

            <h3 className="font-semibold text-lg mt-4">Material Requerido</h3>
            <div className="space-y-2">
                 <div className="flex items-center space-x-2">
                    <Checkbox id="pupitre" {...register('materials.pupitre')} />
                    <Label htmlFor="pupitre">Pupitre</Label>
                </div>
                <div className="flex items-center gap-2">
                    <Label htmlFor="validators" className="whitespace-nowrap">Validadoras</Label>
                    <Input id="validators" type="number" placeholder="Nº unidades" className="w-40" {...register('materials.validators')} />
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="consultTerminal" {...register('materials.consultTerminal')} />
                    <Label htmlFor="consultTerminal">Terminal de consulta</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <Checkbox id="auxMaterial" {...register('materials.auxMaterial')} />
                    <Label htmlFor="auxMaterial">Material auxiliar completo</Label>
                </div>
                 <div>
                    <Label htmlFor="wiring">Cableado</Label>
                    <Controller
                        control={control}
                        name="materials.wiring"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar estado..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="carrocero">Suministrado por carrocero</SelectItem>
                                <SelectItem value="pendiente">Pendiente de suministro</SelectItem>
                            </SelectContent>
                        </Select>
                        )}
                    />
                </div>
            </div>
             <div className="mt-4">
                <Label htmlFor="observations">Observaciones</Label>
                <Textarea id="observations" {...register('observations')} />
             </div>

          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Programar Instalación</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- Decommissioning Form ---
const decommissioningSchema = z.object({
  vehicleId: z.string().min(1, 'Debe seleccionar un vehículo'),
  reason: z.enum(['Baja definitiva vehículo', 'Preparación para traspaso', 'Reparación mayor', 'Cambio de operador']),
  decommissionDate: z.date({ required_error: 'Fecha es requerida' }),
  technician: z.string().min(1, 'Técnico es requerido'),
  materialDestination: z.string().min(1, 'Destino es requerido'),
});

type DecommissioningFormData = z.infer<typeof decommissioningSchema>;

export function NewDecommissioningForm({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (isOpen: boolean) => void }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm<DecommissioningFormData>({
    resolver: zodResolver(decommissioningSchema),
  });

  const onSubmit = (data: DecommissioningFormData) => {
    console.log(data);
    toast({ title: 'Desinstalación programada', description: 'La nueva desinstalación ha sido registrada.' });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Nueva Desinstalación</DialogTitle>
             <DialogDescription>Rellena los datos para programar una nueva desinstalación.</DialogDescription>
          </DialogHeader>
           <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <div>
                    <Label htmlFor="vehicleId">Vehículo a Desinstalar</Label>
                    <Controller
                        control={control}
                        name="vehicleId"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar vehículo..." /></SelectTrigger>
                            <SelectContent>
                                {mockVehicles.filter(v => v.status === 'Activo').map(v => <SelectItem key={v.uniqueId} value={v.uniqueId}>{v.uniqueId} ({v.id})</SelectItem>)}
                            </SelectContent>
                        </Select>
                        )}
                    />
                     {errors.vehicleId && <p className="text-destructive text-sm mt-1">{errors.vehicleId.message}</p>}
                </div>
                 <div>
                    <Label htmlFor="reason">Motivo de la desinstalación</Label>
                    <Controller
                        control={control}
                        name="reason"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar motivo..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Baja definitiva vehículo">Baja definitiva vehículo</SelectItem>
                                <SelectItem value="Preparación para traspaso">Preparación para traspaso</SelectItem>
                                <SelectItem value="Reparación mayor">Reparación mayor</SelectItem>
                                <SelectItem value="Cambio de operador">Cambio de operador</SelectItem>
                            </SelectContent>
                        </Select>
                        )}
                    />
                    {errors.reason && <p className="text-destructive text-sm mt-1">{String(errors.reason.message)}</p>}
                </div>
                
                <h3 className="font-semibold text-lg mt-4">Programación</h3>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <Label>Fecha desinstalación</Label>
                        <Controller
                            control={control}
                            name="decommissionDate"
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? format(field.value, "PPP") : <span>Seleccionar fecha</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                                </Popover>
                            )}
                        />
                        {errors.decommissionDate && <p className="text-destructive text-sm mt-1">{errors.decommissionDate.message}</p>}
                    </div>
                     <div>
                        <Label htmlFor="technician">Técnico asignado</Label>
                        <Controller
                            control={control}
                            name="technician"
                            render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar técnico..." /></SelectTrigger>
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
                    <Label htmlFor="materialDestination">Destino del material</Label>
                    <Controller
                        control={control}
                        name="materialDestination"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar destino..." /></SelectTrigger>
                            <SelectContent>
                                {warehouses.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                                 <SelectItem value="Traspaso directo">Traspaso directo</SelectItem>
                            </SelectContent>
                        </Select>
                        )}
                    />
                    {errors.materialDestination && <p className="text-destructive text-sm mt-1">{errors.materialDestination.message}</p>}
                </div>
          </div>
          <DialogFooter>
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
             <Button type="submit">Programar Desinstalación</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- Transfer Form ---
const transferSchema = z.object({
    originVehicleId: z.string().min(1, 'Debe seleccionar un vehículo de origen'),
    destinationVehicleId: z.string().min(1, 'ID de vehículo destino es requerido'),
    destinationLicensePlate: z.string().min(1, 'Matrícula destino es requerida'),
    destinationModel: z.string().min(1, 'Modelo destino es requerido'),
    destinationOperatorId: z.string().min(1, 'Operador destino es requerido'),
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
    message: "Las fechas de desinstalación e instalación son requeridas para traspaso en 2 fases",
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
    toast({ title: 'Traspaso programado', description: 'El nuevo traspaso ha sido registrado.' });
    onOpenChange(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Nuevo Traspaso</DialogTitle>
            <DialogDescription>Rellena los datos para programar un nuevo traspaso de equipamiento.</DialogDescription>
          </DialogHeader>
           <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                <h3 className="font-semibold text-lg">Vehículo Origen</h3>
                <div>
                    <Label htmlFor="originVehicleId">Seleccionar vehículo origen</Label>
                     <Controller
                        control={control}
                        name="originVehicleId"
                        render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar vehículo..." /></SelectTrigger>
                            <SelectContent>
                                {mockVehicles.filter(v => v.status === 'Activo').map(v => <SelectItem key={v.uniqueId} value={v.uniqueId}>{v.uniqueId} ({v.id})</SelectItem>)}
                            </SelectContent>
                        </Select>
                        )}
                    />
                    {errors.originVehicleId && <p className="text-destructive text-sm mt-1">{errors.originVehicleId.message}</p>}
                </div>

                <h3 className="font-semibold text-lg mt-4">Vehículo Destino</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="destinationVehicleId">ID Vehículo Destino</Label>
                        <Input id="destinationVehicleId" {...register('destinationVehicleId')} />
                        {errors.destinationVehicleId && <p className="text-destructive text-sm mt-1">{errors.destinationVehicleId.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="destinationLicensePlate">Matrícula Destino</Label>
                        <Input id="destinationLicensePlate" {...register('destinationLicensePlate')} />
                         {errors.destinationLicensePlate && <p className="text-destructive text-sm mt-1">{errors.destinationLicensePlate.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="destinationModel">Modelo Destino</Label>
                        <Controller
                            control={control}
                            name="destinationModel"
                            render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar modelo..." /></SelectTrigger>
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

                <h3 className="font-semibold text-lg mt-4">Tipo y Programación</h3>
                 <div>
                    <Label>Tipo de Traspaso</Label>
                    <Controller
                        control={control}
                        name="transferType"
                        render={({ field }) => (
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 items-center mt-2">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="directo" id="t-directo" /><Label htmlFor="t-directo">Traspaso directo (mismo día)</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="dos_fases" id="t-fases" /><Label htmlFor="t-fases">Traspaso en 2 fases</Label></div>
                        </RadioGroup>
                        )}
                    />
                </div>
                 {transferType === 'dos_fases' && (
                    <div className="grid grid-cols-2 gap-4 mt-2 border p-4 rounded-md">
                        <div>
                            <Label>Fecha desinstalación</Label>
                             <Controller
                                control={control} name="decommissionDate" render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Seleccionar fecha</span>}</Button></PopoverTrigger>
                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                                </Popover>
                            )}/>
                             {errors.decommissionDate && <p className="text-destructive text-sm mt-1">{errors.decommissionDate.message}</p>}
                        </div>
                         <div>
                            <Label>Fecha instalación estimada</Label>
                             <Controller
                                control={control} name="installDate" render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild><Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{field.value ? format(field.value, "PPP") : <span>Seleccionar fecha</span>}</Button></PopoverTrigger>
                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
                                </Popover>
                            )}/>
                            {errors.installDate && <p className="text-destructive text-sm mt-1">{errors.installDate.message}</p>}
                        </div>
                         <div className="col-span-2">
                             <Label htmlFor="tempWarehouse">Almacén temporal</Label>
                             <Controller
                                control={control}
                                name="tempWarehouse"
                                render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar almacén..." /></SelectTrigger>
                                    <SelectContent>{warehouses.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                                </Select>
                                )}
                            />
                        </div>
                    </div>
                 )}
                  <div className="grid grid-cols-2 gap-4 mt-2">
                       <div>
                           <Label htmlFor="technician1">Técnico {transferType === 'dos_fases' ? 'fase 1' : ''}</Label>
                            <Controller
                                control={control}
                                name="technician1"
                                render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar técnico..." /></SelectTrigger>
                                    <SelectContent>{technicians.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                </Select>
                                )}
                            />
                       </div>
                        {transferType === 'dos_fases' && (
                             <div>
                                <Label htmlFor="technician2">Técnico fase 2</Label>
                                 <Controller
                                    control={control}
                                    name="technician2"
                                    render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger><SelectValue placeholder="Seleccionar técnico..." /></SelectTrigger>
                                        <SelectContent>{technicians.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                    </Select>
                                    )}
                                />
                             </div>
                        )}
                  </div>
           </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit">Programar Traspaso</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
