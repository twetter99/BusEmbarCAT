
export type Role = 'Administrador' | 'Operador' | 'Sermetra';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  operatorId?: string;
};

export type Operator = {
  id: string;
  name: string;
  status: 'Actiu' | 'Inactiu';
}

export type Vehicle = {
  uniqueId: string;
  codBus: string;
  id: string; // Matrícula
  vin: string;
  model: string;
  bodywork: string;
  preInstallationDate: string;
  operatorId: string;
  operatorName: string; // Duplicado para facilitar el acceso
  status: 'Actiu' | 'En Manteniment' | 'Fora de Servei';
};

export type EquipmentType = 
  | 'Pupitre'
  | 'Validadora INDRA'
  | 'Validadora Inetum'
  | 'Terminal de consulta INDRA'
  | 'Material auxiliar'
  | 'Todos'
  | 'Cableado'
  | 'Antena'
  | 'Placa conexiones'
  | 'Bornes y Pupitre'
  | 'Soporte y Barras'
  | 'Limpieza Validadora'
  | 'Baterías CPU'
  | 'Brida y Antena';


export const equipmentTypeCategories: Record<string, EquipmentType[] | string> = {
    'Pupitre': ['Pupitre'],
    'Validación': ['Validadora INDRA', 'Validadora Inetum'],
    'Consulta': ['Terminal de consulta INDRA'],
    'Auxiliar': ['Material auxiliar']
};


export const equipmentSubTypes = {
    'Material auxiliar': [
        'MMC',
        'Placa de conexión',
        'Soporte',
        'Antena',
        'Cambio de IP',
        'Kit de conexión HARTING',
        'Cable de conexión',
        'Conector',
        'Material diverso',
        'Fusible',
        'Perno',
        'Tanque',
        'Brida',
        'Travesaño',
        'Barra'
    ]
} as const;

export type EquipmentStatus = 'Operatiu' | 'Requereix Reparació' | 'En Estoc';

export type Equipment = {
  id: string;
  type: EquipmentType;
  subType?: string;
  assignedVehicleUniqueId: string | null;
  status: EquipmentStatus;
  serialNumber: string;
  location?: string;
  operator: string;
};

export type MaintenanceTask = {
  id: string;
  type: 'Preventiu' | 'Correctiu';
  title: string;
  vehicleId: string;
  equipmentType: EquipmentType;
  frequency: 'Trimestral' | 'Anual' | 'Bianual';
  dueDate: Date;
  status: 'Pendent' | 'En Progrés' | 'Completat';
  technician?: string;
};

export type Incident = {
  id: string;
  vehicleId: string;
  issue: string;
  reportedBy: string;
  assignedTo: string;
  status: 'Obert' | 'En Progrés' | 'Resolt';
  reportedAt: Date;
  slaDays: number;
  priority: 'Crítica' | 'Alta' | 'Mitjana' | 'Baixa';
  equipmentType: EquipmentType;
};

export type InventoryCategory = 'Material genèric' | 'Material de adquisició lliure' | 'Material específic SERMETRA';

export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  category: InventoryCategory;
  stock: number;
  minStock: number;
  location: string;
  value?: number;
  serialNumber?: string;
  assignedTo?: string; // vehicle uniqueId or warehouse
};


export type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
};

export type Checklist = {
  id: string;
  title: string;
  items: ChecklistItem[];
};

export type InstallationStatus = 'Programada' | 'En Progrés' | 'Completada';

export type Installation = {
  id: string;
  vehicleId: string;
  vehicleModel: string;
  operatorId: string;
  scheduledDate: string;
  technician?: string;
  status: InstallationStatus;
  materials: string[];
};

export type DecommissioningStatus = 'Programada' | 'En Progrés' | 'Completada';

export type Decommissioning = {
    id: string;
    vehicleId: string;
    vehicleModel: string;
    operatorId: string;
    reason: string;
    scheduledDate: string;
    status: DecommissioningStatus;
    materials: string[];
};

export type TransferStatus = 'Programada' | 'Fase 1 OK' | 'En Progrés' | 'Completada';

export type Transfer = {
    id: string;
    originVehicleId: string;
    destinationVehicleId: string;
    originVehicleModel: string;
    destinationVehicleModel: string;
    operatorId: string;
    status: TransferStatus;
    phase1_status: 'Pendent' | 'Completada';
    phase1_date: string;
    phase2_status: 'Pendent' | 'Completada';
    phase2_date: string;
};

export type OperatorMetric = {
    operatorName: string;
    activeVehicles: number;
    maintenanceVehicles: number;
    slaCompliance: number;
}

export type DashboardData = {
    kpis: {
        slaCompliance: number;
        criticalIncidents: number;
        criticalStockItems: number;
        totalVehicles: number;
    },
    maintenanceChartData: { month: string; planned: number; completed: number; }[];
    operatorMetrics: OperatorMetric[];
}

export interface OperatorMetrics {
  nombre: string;
  id: string;
  estado: 'Actiu' | 'Inactiu' | 'Suspès';
  ubicacionPrincipal: string;
  
  vehiculosOperativos: number;
  vehiculosTotal: number;
  vehiculosMantenimiento: number;
  vehiculosBaja: number;
  
  equiposTMobilitat: number;
  proximoMantenimiento: string; 
  
  slaCorrectivos: number; 
  slaInstalaciones: number; 
  cumplimientoPreventivos: number; 
  calidadServicio: 'A' | 'B' | 'C';
  
  mantenimientosVencidos: number;
  incidenciasAbiertas: number;
  incidenciasEscaladas: number;
  stockCritico: boolean;
}
