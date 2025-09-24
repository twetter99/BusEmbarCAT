export type Vehicle = {
  id: string;
  model: string;
  operator: string;
  status: 'Activo' | 'En Mantenimiento' | 'Fuera de Servicio';
  vin: string;
};

export type Equipment = {
  id: string;
  type: 'Validador' | 'Consola' | 'Módulo GPS' | 'Router';
  assignedVehicleId: string | null;
  status: 'Operativo' | 'Requiere Reparación' | 'En Stock';
  serialNumber: string;
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
