
'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, FileText, Search, SlidersHorizontal } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ca } from 'date-fns/locale';
import { mockTasks, mockVehicles, mockOperators } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import type { MaintenanceTask, Operator } from '@/lib/types';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { DateRange } from 'react-day-picker';

const FilterControls = ({
  filters,
  onFilterChange,
  operators,
  technicians,
}: {
  filters: {
    query: string;
    operator: string;
    technician: string;
    dateRange?: DateRange;
  };
  onFilterChange: (newFilters: Partial<typeof filters>) => void;
  operators: Operator[];
  technicians: string[];
}) => {

  const handleFilterChange = <K extends keyof typeof filters>(key: K, value: (typeof filters)[K]) => {
    onFilterChange({ [key]: value });
  };
  
  const clearFilters = () => {
    onFilterChange({ query: '', operator: 'all', technician: 'all', dateRange: undefined });
  }

  return (
    <Card className="mb-4">
        <CardHeader>
            <div className='flex items-center gap-2'>
                <SlidersHorizontal className='h-5 w-5 text-primary' />
                <CardTitle className='text-lg'>Filtres de Cerca</CardTitle>
            </div>
            <CardDescription>
                Filtreu l'historial d'intervencions per vehicle, operador, tècnic o rang de dates.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="relative">
                     <Label htmlFor="search">Cerca Ràpida</Label>
                     <Search className="absolute left-3 bottom-3 h-4 w-4 text-muted-foreground" />
                     <Input 
                        id="search"
                        placeholder="Cercar per ID vehicle, tasca..."
                        value={filters.query}
                        onChange={(e) => handleFilterChange('query', e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div>
                     <Label htmlFor="operator">Operador</Label>
                     <Select value={filters.operator} onValueChange={(value) => handleFilterChange('operator', value)}>
                        <SelectTrigger id="operator"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tots els operadors</SelectItem>
                            {operators.map(op => <SelectItem key={op.id} value={op.id}>{op.name}</SelectItem>)}
                        </SelectContent>
                     </Select>
                </div>
                 <div>
                     <Label htmlFor="technician">Tècnic</Label>
                     <Select value={filters.technician} onValueChange={(value) => handleFilterChange('technician', value)}>
                        <SelectTrigger id="technician"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tots els tècnics</SelectItem>
                             {technicians.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                     </Select>
                </div>
                <div>
                    <Label>Rang de Dates</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !filters.dateRange && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.dateRange?.from ? (
                            filters.dateRange.to ? (
                                <>
                                {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                                {format(filters.dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(filters.dateRange.from, "LLL dd, y")
                            )
                            ) : (
                            <span>Seleccionar rang</span>
                            )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={filters.dateRange?.from}
                            selected={filters.dateRange}
                            onSelect={(range) => handleFilterChange('dateRange', range)}
                            numberOfMonths={2}
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                 <Button onClick={clearFilters} variant="ghost" className="w-full md:w-auto">Netejar Filtres</Button>
            </div>
        </CardContent>
    </Card>
  )
}

export default function HistoryPage() {
    const { user } = useAuth();
    const [filters, setFilters] = React.useState<{
        query: string;
        operator: string;
        technician: string;
        dateRange?: DateRange;
    }>({
        query: '',
        operator: 'all',
        technician: 'all',
    });

    const completedTasks: MaintenanceTask[] = React.useMemo(() => {
        let tasks = mockTasks.filter(t => t.status === 'Completado');
        if (user?.role === 'Operador') {
            const operatorVehicles = mockVehicles.filter(v => v.operatorId === user.operatorId).map(v => v.id);
            tasks = tasks.filter(t => operatorVehicles.includes(t.vehicleId));
        }
        return tasks.sort((a,b) => b.dueDate.getTime() - a.dueDate.getTime());
    }, [user]);

     const availableOperators = React.useMemo(() => {
        if (user?.role === 'Operador') {
            return mockOperators.filter(op => op.id === user.operatorId);
        }
        const operatorIds = new Set(completedTasks.map(t => {
            return mockVehicles.find(v => v.id === t.vehicleId)?.operatorId
        }));
        return mockOperators.filter(op => op && operatorIds.has(op.id));
    }, [user, completedTasks]);
    
    const availableTechnicians = React.useMemo(() => {
        return Array.from(new Set(completedTasks.map(t => t.technician).filter(Boolean))) as string[];
    }, [completedTasks]);

    const filteredTasks = React.useMemo(() => {
        return completedTasks.filter(task => {
            const vehicle = mockVehicles.find(v => v.id === task.vehicleId);

            const queryMatch = filters.query.toLowerCase() === '' ||
                task.id.toLowerCase().includes(filters.query.toLowerCase()) ||
                task.vehicleId.toLowerCase().includes(filters.query.toLowerCase()) ||
                vehicle?.uniqueId.toLowerCase().includes(filters.query.toLowerCase());

            const operatorMatch = filters.operator === 'all' || vehicle?.operatorId === filters.operator;
            
            const technicianMatch = filters.technician === 'all' || task.technician === filters.technician;
            
            const dateMatch = !filters.dateRange?.from || (
                task.dueDate >= filters.dateRange.from &&
                (!filters.dateRange.to || task.dueDate <= filters.dateRange.to)
            );

            return queryMatch && operatorMatch && technicianMatch && dateMatch;
        })
    }, [completedTasks, filters]);
    
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold">Historial i Traçabilitat</h1>
                <p className="text-muted-foreground">
                    {filteredTasks.length} de {completedTasks.length} intervencions completades mostrades.
                </p>
            </div>
        </div>

        <FilterControls 
            filters={filters}
            onFilterChange={setFilters}
            operators={availableOperators}
            technicians={availableTechnicians}
        />

        <Card>
            <CardContent className='pt-6'>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>ID Intervenció</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Tipus Mant.</TableHead>
                        <TableHead>Operador</TableHead>
                        <TableHead>Data Fi</TableHead>
                        <TableHead>Tècnic</TableHead>
                        <TableHead>Accions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTasks.map(task => {
                             const vehicle = mockVehicles.find(v => v.id === task.vehicleId);
                             const operator = mockOperators.find(o => o.id === vehicle?.operatorId);
                             return (
                                <TableRow key={task.id}>
                                    <TableCell className="font-mono text-xs">{task.id}</TableCell>
                                    <TableCell className="font-medium">{vehicle?.uniqueId || task.vehicleId}</TableCell>
                                    <TableCell>{task.frequency}</TableCell>
                                    <TableCell>{operator?.name || 'N/A'}</TableCell>
                                    <TableCell>{format(task.dueDate, 'dd/MM/yyyy')}</TableCell>
                                    <TableCell>{task.technician || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/maintenance/preventive/${task.id}`}>
                                                <FileText className="h-4 w-4 mr-2" />
                                                Veure Fitxa
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                             )
                        })}
                    </TableBody>
                </Table>
                 {filteredTasks.length === 0 && (
                    <div className="text-center text-muted-foreground py-12">
                        <p className="font-semibold">No s'han trobat intervencions que coincideixin amb els filtres.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    </main>
  );
}
