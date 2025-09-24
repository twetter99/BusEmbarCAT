
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockInstallations, mockDecommissionings, mockTransfers, mockOperators } from '@/lib/data';
import type { Installation, Decommissioning, Transfer } from '@/lib/types';
import { Package, PackageCheck, PackageOpen, ArrowRight, Truck, Building, Calendar, User, PlusCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NewInstallationForm, NewDecommissioningForm, NewTransferForm } from './forms';


const statusVariant: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' | 'warning' } = {
  'Programada': 'secondary',
  'En Progreso': 'default',
  'Completada': 'outline',
  'Pendiente': 'warning',
  'Fase 1 OK': 'attention',
};

const InstallationCard = ({ item }: { item: Installation }) => {
    const operator = mockOperators.find(op => op.id === item.operatorId);
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">Nueva Instalación</CardTitle>
                        <CardDescription>{item.vehicleModel}</CardDescription>
                    </div>
                    <Badge variant={statusVariant[item.status]}>{item.status}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                 <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>{item.vehicleId}</span>
                </div>
                {operator && (
                    <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{operator.name}</span>
                    </div>
                )}
                 <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Programada: {item.scheduledDate}</span>
                </div>
                {item.technician && (
                     <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Técnico: {item.technician}</span>
                    </div>
                )}
                <Separator />
                <div className="space-y-1">
                    <h4 className="font-semibold">Material asignado:</h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                        {item.materials.map(material => <li key={material}>{material}</li>)}
                    </ul>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">Ver Ficha de Instalación</Button>
            </CardFooter>
        </Card>
    );
};

const DecommissioningCard = ({ item }: { item: Decommissioning }) => {
    const operator = mockOperators.find(op => op.id === item.operatorId);
     return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">Desinstalación</CardTitle>
                        <CardDescription>{item.reason}</CardDescription>
                    </div>
                    <Badge variant={statusVariant[item.status]}>{item.status}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                 <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>{item.vehicleId} - {item.vehicleModel}</span>
                </div>
                {operator && (
                    <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{operator.name}</span>
                    </div>
                )}
                 <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Programada: {item.scheduledDate}</span>
                </div>
                <Separator />
                <div className="space-y-1">
                    <h4 className="font-semibold">Material a recuperar:</h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                        {item.materials.map(material => <li key={material}>{material}</li>)}
                    </ul>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">Ver Ficha de Desinstalación</Button>
            </CardFooter>
        </Card>
    );
};

const TransferCard = ({ item }: { item: Transfer }) => {
    const operator = mockOperators.find(op => op.id === item.operatorId);
    return (
        <Card>
            <CardHeader>
                 <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">Traspaso</CardTitle>
                        <CardDescription>{item.originVehicleModel} → {item.destinationVehicleModel}</CardDescription>
                    </div>
                    <Badge variant={statusVariant[item.status]}>{item.status}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                 <div className="flex items-center gap-3 font-medium">
                    <span>{item.originVehicleId}</span>
                    <ArrowRight className="h-4 w-4 text-primary"/>
                    <span>{item.destinationVehicleId}</span>
                </div>
                {operator && (
                    <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{operator.name}</span>
                    </div>
                )}
                <Separator />
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <PackageOpen className="h-4 w-4 text-muted-foreground"/>
                        <div>
                            <p className="font-semibold">Fase 1 - Desinstalación: <span className="font-normal text-primary">{item.phase1_status}</span></p>
                            <p className="text-xs text-muted-foreground">Fecha: {item.phase1_date}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <PackageCheck className="h-4 w-4 text-muted-foreground"/>
                         <div>
                            <p className="font-semibold">Fase 2 - Instalación: <span className="font-normal text-primary">{item.phase2_status}</span></p>
                            <p className="text-xs text-muted-foreground">Fecha: {item.phase2_date}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">Ver Ficha de Traspaso</Button>
            </CardFooter>
        </Card>
    );
};


export default function InstallationsPage() {
  const newInstallationsCount = mockInstallations.length;
  const decommissioningsCount = mockDecommissionings.length;
  const transfersCount = mockTransfers.length;
  const [isInstallationFormOpen, setInstallationFormOpen] = React.useState(false);
  const [isDecommissioningFormOpen, setDecommissioningFormOpen] = React.useState(false);
  const [isTransferFormOpen, setTransferFormOpen] = React.useState(false);


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center justify-between">
            <div className="flex-1">
                {/* El título se gestiona desde el layout */}
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Nueva Operación
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setInstallationFormOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nueva Instalación
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setDecommissioningFormOpen(true)}>
                         <PackageOpen className="mr-2 h-4 w-4" />
                        Nueva Desinstalación
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setTransferFormOpen(true)}>
                         <ArrowRight className="mr-2 h-4 w-4" />
                        Nuevo Traspaso
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>


       <Card>
        <CardHeader>
            <CardTitle>Resumen Operativo</CardTitle>
            <CardDescription>Estado actual de las operaciones de instalación y traspaso.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 border rounded-lg">
                    <Package className="mx-auto h-8 w-8 text-primary mb-2"/>
                    <p className="text-2xl font-bold">{newInstallationsCount}</p>
                    <p className="text-sm text-muted-foreground">Nuevas Instalaciones</p>
                </div>
                 <div className="p-4 border rounded-lg">
                    <PackageOpen className="mx-auto h-8 w-8 text-destructive mb-2"/>
                    <p className="text-2xl font-bold">{decommissioningsCount}</p>
                    <p className="text-sm text-muted-foreground">Desinstalaciones</p>
                </div>
                 <div className="p-4 border rounded-lg">
                    <ArrowRight className="mx-auto h-8 w-8 text-attention-foreground mb-2"/>
                    <p className="text-2xl font-bold">{transfersCount}</p>
                    <p className="text-sm text-muted-foreground">Traspasos</p>
                </div>
            </div>
        </CardContent>
       </Card>

      <Tabs defaultValue="new-installations">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="new-installations">
              Nuevas Instalaciones ({newInstallationsCount})
            </TabsTrigger>
            <TabsTrigger value="decommissioning">
              Desinstalaciones ({decommissioningsCount})
            </TabsTrigger>
            <TabsTrigger value="transfers">Traspasos ({transfersCount})</TabsTrigger>
            <TabsTrigger value="history">Historial (0)</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="new-installations" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockInstallations.map(item => <InstallationCard key={item.id} item={item} />)}
          </div>
        </TabsContent>
        <TabsContent value="decommissioning" className="mt-4">
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockDecommissionings.map(item => <DecommissioningCard key={item.id} item={item} />)}
          </div>
        </TabsContent>
        <TabsContent value="transfers" className="mt-4">
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockTransfers.map(item => <TransferCard key={item.id} item={item} />)}
          </div>
        </TabsContent>
        <TabsContent value="history" className="mt-4">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">
                        No hay historial de operaciones disponible.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      <NewInstallationForm isOpen={isInstallationFormOpen} onOpenChange={setInstallationFormOpen} />
      <NewDecommissioningForm isOpen={isDecommissioningFormOpen} onOpenChange={setDecommissioningFormOpen} />
      <NewTransferForm isOpen={isTransferFormOpen} onOpenChange={setTransferFormOpen} />
    </main>
  );
}
