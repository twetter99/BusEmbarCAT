export type Role = 'Administrador' | 'Operador' | 'Sermetra';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  operatorId?: string;
};

export type Vehicle = {
  id: string; // Matrícula
  model: string;
  operator: string;
  status: 'Activo' | 'En Mantenimiento' | 'Fuera de Servicio';
  vin: string; // N° Obra / Chasis
  codBus: string; // Número de Calca
  bodywork: string; // Carrocería
  preInstallationDate: string;
};

export type EquipmentType = 
  | 'Pupitre'
  | 'Validadora INDRA'
  | 'Validadora Inetum'
  | 'Terminal de consulta INDRA'
  | 'MMC'
  | 'Placa de conexión'
  | 'Soporte'
  | 'Antena'
  | 'Cambio de IP'
  | 'Kit de conexión HARTING'
  | 'Cable de conexión'
  | 'Conector'
  | 'Material diverso';

export const equipmentTypeCategories: Record<string, EquipmentType[] | EquipmentType> = {
    'Pupitre': 'Pupitre',
    'Terminal de validación': ['Validadora INDRA', 'Validadora Inetum'],
    'Terminal de consulta': ['Terminal de consulta INDRA'],
    'Material auxiliar': [
        'MMC',
        'Placa de conexión',
        'Soporte',
        'Antena',
        'Cambio de IP',
        'Kit de conexión HARTING',
        'Cable de conexión',
        'Conector',
        'Material diverso'
    ]
};

export type Equipment = {
  id: string;
  type: EquipmentType;
  assignedVehicleId: string | null;
  status: 'Operativo' | 'Requiere Reparación' | 'En Stock';
  serialNumber: string;
  location?: 'Almacén Principal' | 'Almacén Operador';
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
