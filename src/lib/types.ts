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
  status: 'Activo' | 'En Mantenimiento' | 'Fuera de Servicio';
};

export type EquipmentType = 
  | 'Pupitre'
  | 'Validadora INDRA'
  | 'Validadora Inetum'
  | 'Terminal de consulta INDRA'
  | 'Material auxiliar';

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

export type EquipmentStatus = 'Operativo' | 'Requiere Reparación' | 'En Stock';

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
  title: string;
  vehicleId: string;
  equipmentType: Equipment['type'];
  frequency: 'Trimestral' | 'Semestral' | 'Anual';
  dueDate: Date;
  status: 'Pendiente' | 'En Progreso' | 'Completado';
  technician?: string;
};

export type Incident = {
  id: string;
  vehicleId: string;
  issue: string;
  reportedBy: string;
  assignedTo: string;
  status: 'Abierto' | 'En Progreso' | 'Resuelto';
  reportedAt: Date;
  slaDays: number;
};

export type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  category: 'Genérico' | 'Stock Libre' | 'Específico del Proveedor';
  stock: number;
  location: string;
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
