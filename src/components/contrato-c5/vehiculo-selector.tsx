'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { mockOperators, mockVehicles } from '@/lib/data';
import type { Vehicle, GrupoEmpresarial } from '@/lib/types';
import type { AsignacionVehiculo } from '@/lib/contrato-c5-types';
import { Bus, User, Package, Search, X, Plus } from 'lucide-react';

interface VehiculoSelectorProps {
  /** Asignaciones existentes */
  asignaciones?: AsignacionVehiculo[];
  /** Cantidad máxima que se puede asignar */
  cantidadMaxima: number;
  /** Callback cuando cambian las asignaciones */
  onAsignacionesChange: (asignaciones: AsignacionVehiculo[]) => void;
  /** Si está deshabilitado */
  disabled?: boolean;
}

// Agrupar operadores por grupo empresarial
const operadoresPorGrupo = mockOperators.reduce((acc, op) => {
  const grupo = op.grupo || 'Independiente';
  if (!acc[grupo]) acc[grupo] = [];
  acc[grupo].push(op);
  return acc;
}, {} as Record<GrupoEmpresarial | string, typeof mockOperators>);

// Ordenar grupos
const gruposOrdenados = Object.keys(operadoresPorGrupo).sort((a, b) => {
  // Independiente primero, luego alfabético
  if (a === 'Independiente') return -1;
  if (b === 'Independiente') return 1;
  return a.localeCompare(b);
});

export function VehiculoSelector({
  asignaciones = [],
  cantidadMaxima,
  onAsignacionesChange,
  disabled = false,
}: VehiculoSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedOperadorId, setSelectedOperadorId] = React.useState<string>('');
  const [searchVehiculo, setSearchVehiculo] = React.useState('');
  const [selectedVehiculos, setSelectedVehiculos] = React.useState<Set<string>>(new Set());
  
  // Calcular cantidad ya asignada
  const cantidadAsignada = asignaciones.reduce((acc, a) => acc + a.cantidad, 0);
  const cantidadDisponible = cantidadMaxima - cantidadAsignada;
  
  // Obtener operador seleccionado
  const operadorSeleccionado = mockOperators.find(op => op.id === selectedOperadorId);
  
  // Filtrar vehículos por operador y búsqueda
  const vehiculosFiltrados = React.useMemo(() => {
    if (!selectedOperadorId) return [];
    
    // Buscar vehículos que coincidan con el operador
    // Comparamos por nombre ya que mockVehicles usa el nombre del operador
    const operadorNombre = operadorSeleccionado?.name || '';
    
    let vehiculos = mockVehicles.filter(v => {
      // El campo 'operatorName' en mockVehicles tiene el nombre del operador
      const matchOperador = v.operatorName.toLowerCase().includes(operadorNombre.toLowerCase()) ||
        operadorNombre.toLowerCase().includes(v.operatorName.toLowerCase()) ||
        v.operatorId === selectedOperadorId;
      return matchOperador;
    });
    
    // Si no hay coincidencia exacta, simular vehículos para el operador
    if (vehiculos.length === 0 && operadorSeleccionado) {
      // Generar vehículos de ejemplo basados en el operador
      vehiculos = generateMockVehiclesForOperator(operadorSeleccionado);
    }
    
    // Filtrar por búsqueda
    if (searchVehiculo) {
      const search = searchVehiculo.toLowerCase();
      vehiculos = vehiculos.filter(v => 
        v.codBus.toLowerCase().includes(search) ||
        v.id.toLowerCase().includes(search)
      );
    }
    
    return vehiculos;
  }, [selectedOperadorId, operadorSeleccionado, searchVehiculo]);
  
  // Generar vehículos mock para operadores que no están en mockVehicles
  function generateMockVehiclesForOperator(operador: typeof mockOperators[0]): Vehicle[] {
    const count = Math.min(operador.vehiculosContrato || 10, 20); // Mostrar máximo 20
    return Array.from({ length: count }, (_, i) => ({
      uniqueId: `VEH-${operador.id}-${1001 + i}`,
      codBus: String(1001 + i),
      id: `${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      vin: `WDB${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      model: 'Mercedes Citaro',
      bodywork: 'Standard',
      preInstallationDate: new Date().toISOString().split('T')[0],
      operatorId: operador.id,
      operatorName: operador.name,
      status: 'Actiu' as const,
    }));
  }
  
  // Manejar selección/deselección de vehículo
  const toggleVehiculo = (vehiculoId: string) => {
    const newSelected = new Set(selectedVehiculos);
    if (newSelected.has(vehiculoId)) {
      newSelected.delete(vehiculoId);
    } else if (newSelected.size < cantidadDisponible) {
      newSelected.add(vehiculoId);
    }
    setSelectedVehiculos(newSelected);
  };
  
  // Confirmar asignaciones
  const handleConfirmar = () => {
    if (!operadorSeleccionado) return;
    
    const nuevasAsignaciones: AsignacionVehiculo[] = Array.from(selectedVehiculos).map((vId, index) => {
      const vehiculo = vehiculosFiltrados.find(v => v.uniqueId === vId);
      return {
        id: `asig-new-${Date.now()}-${index}`,
        vehiculoId: vId,
        calca: vehiculo?.codBus || '',
        matricula: vehiculo?.id || '',
        operadorId: operadorSeleccionado.id,
        operadorNombre: operadorSeleccionado.name,
        cantidad: 1,
        estadoAsignacion: 'pendiente' as const,
      };
    });
    
    onAsignacionesChange([...asignaciones, ...nuevasAsignaciones]);
    
    // Reset
    setSelectedVehiculos(new Set());
    setSelectedOperadorId('');
    setSearchVehiculo('');
    setIsOpen(false);
  };
  
  // Eliminar una asignación
  const handleEliminarAsignacion = (asignacionId: string) => {
    onAsignacionesChange(asignaciones.filter(a => a.id !== asignacionId));
  };
  
  // Reset al cerrar
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedVehiculos(new Set());
      setSelectedOperadorId('');
      setSearchVehiculo('');
    }
    setIsOpen(open);
  };

  return (
    <div className="space-y-4">
      {/* Lista de asignaciones actuales */}
      {asignaciones.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Vehicles Assignats ({asignaciones.length})</Label>
          <div className="flex flex-wrap gap-2">
            {asignaciones.map((asig) => (
              <Badge 
                key={asig.id} 
                variant="secondary" 
                className="gap-1 py-1 px-2"
              >
                <Bus className="h-3 w-3" />
                <span className="font-mono">{asig.calca}</span>
                <span className="text-muted-foreground">({asig.matricula})</span>
                {!disabled && (
                  <button 
                    onClick={() => handleEliminarAsignacion(asig.id)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Resumen */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Package className="h-4 w-4" />
        <span>
          {cantidadAsignada} de {cantidadMaxima} unitats assignades a vehicles
          {cantidadDisponible > 0 && (
            <span className="text-primary"> ({cantidadDisponible} disponibles per assignar)</span>
          )}
        </span>
      </div>
      
      {/* Botón para abrir diálogo de asignación */}
      {!disabled && cantidadDisponible > 0 && (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Assignar a Vehicles
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Assignar Material a Vehicles</DialogTitle>
              <DialogDescription>
                Selecciona primer l'operador i després els vehicles als quals assignar material.
                Pots assignar fins a {cantidadDisponible} unitat(s).
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Selector de Operador */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Operador
                </Label>
                <Select
                  value={selectedOperadorId}
                  onValueChange={(value) => {
                    setSelectedOperadorId(value);
                    setSelectedVehiculos(new Set());
                    setSearchVehiculo('');
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un operador..." />
                  </SelectTrigger>
                  <SelectContent>
                    {gruposOrdenados.map((grupo) => (
                      <SelectGroup key={grupo}>
                        <SelectLabel className="text-xs uppercase text-muted-foreground">
                          {grupo}
                        </SelectLabel>
                        {operadoresPorGrupo[grupo].map((op) => (
                          <SelectItem key={op.id} value={op.id}>
                            <span className="flex items-center gap-2">
                              <span>{op.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {op.vehiculosContrato} vehicles
                              </Badge>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Selector de Vehículos (solo si hay operador seleccionado) */}
              {selectedOperadorId && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Bus className="h-4 w-4" />
                    Vehicles ({selectedVehiculos.size} seleccionats)
                  </Label>
                  
                  {/* Buscador */}
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Cercar per calca o matrícula..."
                      value={searchVehiculo}
                      onChange={(e) => setSearchVehiculo(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  
                  {/* Lista de vehículos con scroll */}
                  <ScrollArea className="h-[200px] rounded-md border">
                    <div className="p-2 space-y-1">
                      {vehiculosFiltrados.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          No s'han trobat vehicles
                        </div>
                      ) : (
                        vehiculosFiltrados.map((vehiculo) => {
                          const isSelected = selectedVehiculos.has(vehiculo.uniqueId);
                          const isDisabled = !isSelected && selectedVehiculos.size >= cantidadDisponible;
                          const yaAsignado = asignaciones.some(a => a.vehiculoId === vehiculo.uniqueId);
                          
                          return (
                            <div
                              key={vehiculo.uniqueId}
                              className={`flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 ${
                                yaAsignado ? 'opacity-50' : ''
                              }`}
                            >
                              <Checkbox
                                id={vehiculo.uniqueId}
                                checked={isSelected}
                                onCheckedChange={() => toggleVehiculo(vehiculo.uniqueId)}
                                disabled={isDisabled || yaAsignado}
                              />
                              <label
                                htmlFor={vehiculo.uniqueId}
                                className="flex-1 cursor-pointer flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <Bus className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-mono font-medium">{vehiculo.codBus}</span>
                                  <span className="text-muted-foreground">({vehiculo.id})</span>
                                </div>
                                {yaAsignado && (
                                  <Badge variant="outline" className="text-xs">Ja assignat</Badge>
                                )}
                              </label>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                  
                  {vehiculosFiltrados.length > 20 && (
                    <p className="text-xs text-muted-foreground">
                      Es mostren els primers 20 vehicles. Utilitza el cercador per trobar més.
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel·lar
              </Button>
              <Button 
                onClick={handleConfirmar}
                disabled={selectedVehiculos.size === 0}
              >
                Assignar {selectedVehiculos.size} vehicle(s)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
