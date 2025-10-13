
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
import { PackageCheck, PackageOpen, ArrowRight, Truck, Building, Calendar, User, PlusCircle, Target, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NewInstallationForm, NewDecommissioningForm, NewTransferForm } from './forms';
import { useAuth } from '@/hooks/use-auth';
import { Progress } from '@/components/ui/progress';

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
                        <CardTitle className="text-lg">Nova Instal·lació</CardTitle>
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
                        <span>Tècnic: {item.technician}</span>
                    </div>
                )}
                <Separator />
                <div className="space-y-1">
                    <h4 className="font-semibold">Material assignat:</h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                        {item.materials.map(material => <li key={material}>{material}</li>)}
                    </ul>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">Veure Fitxa d'Instal·lació</Button>
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
                        <CardTitle className="text-lg">Desinstal·lació</CardTitle>
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
                <Button className="w-full">Veure Fitxa de Desinstal·lació</Button>
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
                        <CardTitle className="text-lg">Traspàs</CardTitle>
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
                            <p className="font-semibold">Fase 1 - Desinstal·lació: <span className="font-normal text-primary">{item.phase1_status}</span></p>
                            <p className="text-xs text-muted-foreground">Data: {item.phase1_date}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-2">
                        <PackageCheck className="h-4 w-4 text-muted-foreground"/>
                         <div>
                            <p className="font-semibold">Fase 2 - Instal·lació: <span className="font-normal text-primary">{item.phase2_status}</span></p>
                            <p className="text-xs text-muted-foreground">Data: {item.phase2_date}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full">Veure Fitxa de Traspàs</Button>
            </CardFooter>
        </Card>
    );
};

const KPICard = ({ title, value, subtext, icon: Icon, progress, progressColor }: { title: string, value: string, subtext: string, icon: React.ElementType, progress?: number, progressColor?: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{subtext}</p>
            {progress !== undefined && (
                 <Progress value={progress} className="mt-2 h-2" style={{ backgroundColor: progressColor ? `${progressColor}20` : undefined, accentColor: progressColor }} />
            )}
        </CardContent>
    </Card>
);

export default function InstallationsPage() {
    const { user } = useAuth();
    const [isInstallationFormOpen, setInstallationFormOpen] = React.useState(false);
    const [isDecommissioningFormOpen, setDecommissioningFormOpen] = React.useState(false);
    const [isTransferFormOpen, setTransferFormOpen] = React.useState(false);
    
    const userInstallations = React.useMemo(() => {
        if (user?.role === 'Operador') {
            return mockInstallations.filter(i => i.operatorId === user.operatorId);
        }
        return mockInstallations;
    }, [user]);

    const userDecommissionings = React.useMemo(() => {
        if (user?.role === 'Operador') {
            return mockDecommissionings.filter(d => d.operatorId === user.operatorId);
        }
        return mockDecommissionings;
    }, [user]);

    const userTransfers = React.useMemo(() => {
        if (user?.role === 'Operador') {
            return mockTransfers.filter(t => t.operatorId === user.operatorId);
        }
        return mockTransfers;
    }, [user]);
    
  // Mock data for KPIs
  const budgetTotal = 66600;
  const budgetSpent = 21600; 
  const budgetProgress = (budgetSpent / budgetTotal) * 100;

  const newInstallationsCount = userInstallations.length;
  const decommissioningsCount = userDecommissionings.length;
  const transfersCount = userTransfers.length;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Operacions Lot 2</h1>
              <p className="text-muted-foreground">Instal·lacions, Desinstal·lacions i Traspassos</p>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" /> Nova Operació
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setInstallationFormOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nova Instal·lació
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setDecommissioningFormOpen(true)}>
                         <PackageOpen className="mr-2 h-4 w-4" />
                        Nova Desinstal·lació
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setTransferFormOpen(true)}>
                         <ArrowRight className="mr-2 h-4 w-4" />
                        Nou Traspàs
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

       <Card>
        <CardHeader>
            <CardTitle>KPIs de Rendiment (Lot 2)</CardTitle>
            <CardDescription>Mètriques clau per a l'auditoria de servei de SERMETRA.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               <KPICard title="Compliment SLA Instal·lació" value="95%" subtext="Operacions en ≤ 2 dies laborables" icon={Target} />
               <KPICard title="Temps Mitjà de Cicle" value="1.8 dies" subtext="Mitjana des d'OT a tancament" icon={Clock} />
               <KPICard title="Taxa d'Èxit (FTR)" value="98%" subtext="Instal·lacions sense incidències en 15 dies" icon={CheckCircle} />
               <KPICard 
                    title="Consum Bossa de Material" 
                    value={new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR' }).format(budgetTotal - budgetSpent)} 
                    subtext={`de ${new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR' }).format(budgetTotal)}`} 
                    icon={DollarSign}
                    progress={budgetProgress}
                />
            </div>
        </CardContent>
       </Card>

      <Tabs defaultValue="new-installations">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="new-installations">
              Noves Instal·lacions ({newInstallationsCount})
            </TabsTrigger>
            <TabsTrigger value="decommissioning">
              Desinstal·lacions ({decommissioningsCount})
            </TabsTrigger>
            <TabsTrigger value="transfers">Traspassos ({transfersCount})</TabsTrigger>
            <TabsTrigger value="history">Historial (0)</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="new-installations" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userInstallations.map(item => <InstallationCard key={item.id} item={item} />)}
          </div>
        </TabsContent>
        <TabsContent value="decommissioning" className="mt-4">
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userDecommissionings.map(item => <DecommissioningCard key={item.id} item={item} />)}
          </div>
        </TabsContent>
        <TabsContent value="transfers" className="mt-4">
           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userTransfers.map(item => <TransferCard key={item.id} item={item} />)}
          </div>
        </TabsContent>
        <TabsContent value="history" className="mt-4">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">
                        No hi ha historial d'operacions disponible.
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
