import type { Vehicle, Equipment, MaintenanceTask, Incident, InventoryItem, User, EquipmentType, Checklist, Operator, EquipmentSubtype } from '@/lib/types';
import { add, sub } from 'date-fns';

export const mockOperators: Operator[] = [
    { id: 'op-01', name: 'ALSINA GRAELLS DE AUTO TRANSPORTES, SA' },
    { id: 'op-02', name: 'AUTOCARES JULIA, SL' },
    { id: 'op-03', name: 'AUTOCARS DEL PENEDÈS, SA' },
    { id: 'op-04', name: 'AUTOCARS PRAT, SA' },
    { id: 'op-05', name: 'AUTOCARS R. FONT, SAU' },
    { id: 'op-06', name: 'AUTOCARS VENDRELL, SL' },
    { id: 'op-07', name: 'AUTOCORB, SA' },
    { id: 'op-08', name: 'HISPANO LLACUNENSE, SL' },
    { id: 'op-09', name: 'MONTFERRI HERMANOS, SL' },
    { id: 'op-10', name: 'TRANSPORTES MIR' },
    { id: 'op-11', name: 'TUS, SCCL' }
];

export const mockUsers: User[] = [
    { id: 'user-001', name: 'Admin User', email: 'admin@busembacat.com', role: 'Administrador' },
    { id: 'user-002', name: 'Operator User', email: 'operator@busembacat.com', role: 'Operador', operatorId: 'op-01' },
    { id: 'user-003', name: 'Sermetra User', email: 'sermetra@busembacat.com', role: 'Sermetra' },
];

const operatorMap = new Map(mockOperators.map(op => [op.name, op.id]));
const operatorNameMap = new Map(mockOperators.map(op => [op.id, op.name]));

const generateUniqueId = (codBus: string, operatorName: string): string => {
  const operatorCode = operatorName.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 8);
  return `VEH-${operatorCode}-${codBus}`;
}

const rawVehicles: Omit<Vehicle, 'uniqueId' | 'operatorId' | 'operatorName'> & { operator: string }[] = [
  { codBus: '300', id: '6916-HCR', vin: 'WEB62809013122121', model: 'MERCEDES', bodywork: 'CITARO 3 puertas', preInstallationDate: '06/06/22', operator: "ALSINA GRAELLS DE AUTO TRANSPORTES, SA", status: 'Activo' },
  { codBus: '302', id: '7001-HCR', vin: 'WEB62808313122109', model: 'MERCEDES', bodywork: 'CITARO 2 puertas', preInstallationDate: '07/06/22', operator: "AUTOCARES JULIA, SL", status: 'Activo' },
  { codBus: '326', id: '4602-JKD', vin: 'WEB62852313704925', model: 'MERCEDES', bodywork: 'CITARO LE MÜ 2 puertas', preInstallationDate: '08/06/22', operator: "AUTOCARS DEL PENEDÈS, SA", status: 'En Mantenimiento' },
  { codBus: '338', id: '4192-KFL', vin: 'NLRTMLA20HA006121', model: 'OTOKAR', bodywork: 'VECTIO LE', preInstallationDate: '15/06/22', operator: "AUTOCARS PRAT, SA", status: 'Activo' },
  { codBus: '342', id: '5400-LFN', vin: 'WEB62805610612016', model: 'MERCEDES', bodywork: 'CITARO Hybrid', preInstallationDate: '16/06/22', operator: "AUTOCARS R. FONT, SAU", status: 'Activo' },
  { codBus: '344', id: '5993-LMS', vin: 'SUU241163MB023120', model: 'EVOBUS-SOLARIS', bodywork: 'URBINO 12 HYBRID', preInstallationDate: '14/06/22', operator: "AUTOCARS VENDRELL, SL", status: 'Fuera de Servicio' },
  { codBus: '349', id: '3806-MBW', vin: 'SUU241163NB025635', model: 'EVOBUS-SOLARIS', bodywork: 'Solaris Urbino 12 Hybrid', preInstallationDate: '01/02/23', operator: "AUTOCORB, SA", status: 'Activo' },
  { codBus: '350', id: '3235-MCR', vin: 'WEB62805610616792', model: 'MERCEDES', bodywork: 'Citaro Hybrid', preInstallationDate: '02/02/23', operator: "HISPANO LLACUNENSE, SL", status: 'Activo' },
  { codBus: '354', id: '1399-MCY', vin: 'WEB62852510616914', model: 'MERCEDES', bodywork: 'Citaro LE MÜ Hybrid', preInstallationDate: '02/02/23', operator: "MONTFERRI HERMANOS, SL", status: 'Activo' },
  { codBus: '358', id: '7907-MNZ', vin: 'WEB2805611L619111', model: 'DAIMLER BUSES', bodywork: 'CITARO HYBRID (Clas 1) - 3 ptas', preInstallationDate: '12/03/24', operator: "TRANSPORTES MIR", status: 'Activo' },
  { codBus: '368', id: '0816-NDV', vin: 'WEB2852511L621420', model: 'DAIMLER BUSES', bodywork: 'Citaro LE MÜ Hybrid 2p', preInstallationDate: '13/03/24', operator: "TUS, SCCL", status: 'Activo' }
];


export const mockVehicles: Vehicle[] = rawVehicles.map(v => {
  const operatorId = operatorMap.get(v.operator) || 'op-unknown';
  return {
    ...v,
    uniqueId: generateUniqueId(v.codBus, v.operator),
    operatorId: operatorId,
    operatorName: v.operator,
  }
});

const generateEquipment = (): Equipment[] => {
  const equipmentList: Equipment[] = [];
  const operators = Array.from(operatorNameMap.values());

  // Helper function to create equipment
  const createEquipment = (type: EquipmentType, subType: EquipmentSubtype | undefined, vehicle: Vehicle | null, status: Equipment['status'], serial: string, location?: string) => {
    equipmentList.push({
      id: `EQ-${serial}`,
      type,
      subType,
      assignedVehicleUniqueId: vehicle ? vehicle.uniqueId : null,
      status,
      serialNumber: `SN-${serial}`,
      operator: vehicle ? vehicle.operatorName : operators[Math.floor(Math.random() * operators.length)],
      location,
    });
  };

  // Create equipment for some vehicles
  createEquipment('Pupitre', undefined, mockVehicles[0], 'Operativo', 'PUP-001');
  createEquipment('Validadora INDRA', undefined, mockVehicles[0], 'Operativo', 'IND-001');
  createEquipment('Material auxiliar', 'MMC', mockVehicles[0], 'Operativo', 'MMC-001');
  
  createEquipment('Pupitre', undefined, mockVehicles[1], 'Operativo', 'PUP-002');
  createEquipment('Validadora Inetum', undefined, mockVehicles[1], 'Operativo', 'INE-001');
  
  createEquipment('Pupitre', undefined, mockVehicles[2], 'Requiere Reparación', 'PUP-003');
  createEquipment('Terminal de consulta INDRA', undefined, mockVehicles[2], 'Operativo', 'CON-001');

  createEquipment('Validadora INDRA', undefined, mockVehicles[3], 'Operativo', 'IND-002');
  createEquipment('Validadora INDRA', undefined, mockVehicles[3], 'Operativo', 'IND-003');

  // Create unassigned equipment
  createEquipment('Pupitre', undefined, null, 'En Stock', 'PUP-100', 'Almacén Principal');
  createEquipment('Validadora INDRA', undefined, null, 'Requiere Reparación', 'IND-100', 'Taller Reparaciones');
  createEquipment('Validadora Inetum', undefined, null, 'En Stock', 'INE-100', 'Almacén Operador 2');
  createEquipment('Terminal de consulta INDRA', undefined, null, 'En Stock', 'CON-100', 'Almacén Principal');
  
  // Create all subtypes of Material auxiliar
  createEquipment('Material auxiliar', 'MMC', mockVehicles[4], 'Operativo', 'MMC-002');
  createEquipment('Material auxiliar', 'Placa de conexión', null, 'En Stock', 'PLC-101', 'Almacén Principal');
  createEquipment('Material auxiliar', 'Soporte', mockVehicles[5], 'Requiere Reparación', 'SOP-001');
  createEquipment('Material auxiliar', 'Antena', null, 'En Stock', 'ANT-101', 'Almacén Operador 1');
  createEquipment('Material auxiliar', 'Cambio de IP', mockVehicles[6], 'Operativo', 'CIP-001');
  createEquipment('Material auxiliar', 'Kit de conexión HARTING', null, 'En Stock', 'HAR-101', 'Almacén Principal');
  createEquipment('Material auxiliar', 'Cable de conexión', mockVehicles[7], 'Operativo', 'CAB-001');
  createEquipment('Material auxiliar', 'Conector', null, 'Requiere Reparación', 'CON-102', 'Taller Reparaciones');
  createEquipment('Material auxiliar', 'Fusible', mockVehicles[8], 'Operativo', 'FUS-001');
  createEquipment('Material auxiliar', 'Perno', null, 'En Stock', 'PER-101', 'Almacén Principal');
  createEquipment('Material auxiliar', 'Tanque', mockVehicles[9], 'Operativo', 'TAN-001');
  createEquipment('Material auxiliar', 'Brida', null, 'En Stock', 'BRI-101', 'Almacén Principal');
  createEquipment('Material auxiliar', 'Travesaño', mockVehicles[10], 'Operativo', 'TRA-001');
  createEquipment('Material auxiliar', 'Barra', null, 'En Stock', 'BAR-101', 'Almacén Principal');

  return equipmentList;
};

export const mockEquipment: Equipment[] = generateEquipment();

export const mockTasks: MaintenanceTask[] = [
  { id: 'MT-001', type: 'Preventivo', title: 'Limpieza y comprobación de pupitre', vehicleId: '6916-HCR', equipmentType: 'Pupitre', frequency: 'Trimestral', dueDate: add(new Date(), { days: 10 }), status: 'Pendiente', technician: 'Jordi' },
  { id: 'MT-002', type: 'Preventivo', title: 'Revisión semestral de anclajes', vehicleId: '7001-HCR', equipmentType: 'Validadora Inetum', frequency: 'Semestral', dueDate: add(new Date(), { days: 25 }), status: 'Pendiente', technician: 'Oriol' },
  { id: 'MT-003', type: 'Preventivo', title: 'Revisión anual de cableado', vehicleId: '4602-JKD', equipmentType: 'Cableado', frequency: 'Anual', dueDate: sub(new Date(), { days: 5 }), status: 'Completado', technician: 'Marc' },
  { id: 'MT-004', type: 'Preventivo', title: 'Limpieza de validadoras', vehicleId: '4192-KFL', equipmentType: 'Validadora INDRA', frequency: 'Trimestral', dueDate: add(new Date(), { days: 2 }), status: 'En Progreso', technician: 'Jordi' },
  { id: 'MT-005', type: 'Preventivo', title: 'Revisión de conexiones de antena', vehicleId: '5400-LFN', equipmentType: 'Antena', frequency: 'Semestral', dueDate: add(new Date(), { days: 45 }), status: 'Pendiente' },
  { id: 'MT-006', type: 'Preventivo', title: 'Sustitución de pilas CR-2032', vehicleId: '3806-MBW', equipmentType: 'Pupitre', frequency: 'Bimensual', dueDate: sub(new Date(), { days: 2 }), status: 'Pendiente', technician: 'Pau' },
  { id: 'MT-007', type: 'Preventivo', title: 'Comprobación de bornes y brida', vehicleId: '3235-MCR', equipmentType: 'Material auxiliar', frequency: 'Trimestral', dueDate: add(new Date(), { days: 5 }), status: 'Pendiente', technician: 'Arnau' },
  { id: 'MT-008', type: 'Preventivo', title: 'Inspección de fusibles', vehicleId: '1399-MCY', equipmentType: 'Material auxiliar', frequency: 'Anual', dueDate: sub(new Date(), { days: 20 }), status: 'Completado', technician: 'Marc' },
  { id: 'MT-009', type: 'Preventivo', title: 'Revisión de base de pupitre', vehicleId: '7907-MNZ', equipmentType: 'Pupitre', frequency: 'Semestral', dueDate: add(new Date(), { days: 60 }), status: 'Pendiente', technician: 'Xavier' },
  { id: 'MT-010', type: 'Preventivo', title: 'Identificación completa de equipos', vehicleId: '0816-NDV', equipmentType: 'Todos', frequency: 'Bimensual', dueDate: sub(new Date(), { days: 15 }), status: 'En Progreso', technician: 'David' },
];


export const mockIncidents: Incident[] = [
    { id: 'INC-001', vehicleId: '6916-HCR', issue: 'El pupitre no enciende la pantalla.', reportedBy: 'John Doe', assignedTo: 'Jordi', status: 'Abierto', reportedAt: sub(new Date(), { hours: 4 }), slaDays: 2, priority: 'Crítica', equipmentType: 'Pupitre' },
    { id: 'INC-002', vehicleId: '4602-JKD', issue: 'La validadora no lee las tarjetas T-Mobilitat.', reportedBy: 'Jane Smith', assignedTo: 'Marc', status: 'En Progreso', reportedAt: sub(new Date(), { days: 1 }), slaDays: 3, priority: 'Alta', equipmentType: 'Validadora INDRA' },
    { id: 'INC-003', vehicleId: '5993-LMS', issue: 'Pérdida intermitente de la señal GPS.', reportedBy: 'Peter Jones', assignedTo: 'David', status: 'Resuelto', reportedAt: sub(new Date(), { days: 3 }), slaDays: 1, priority: 'Media', equipmentType: 'Antena' },
    { id: 'INC-004', vehicleId: '7907-MNZ', issue: 'La impresora de tickets no funciona.', reportedBy: 'Emily Brown', assignedTo: 'Pau', status: 'Abierto', reportedAt: sub(new Date(), { days: 2 }), slaDays: 1, priority: 'Alta', equipmentType: 'Material auxiliar' },
];

export const mockInventory: InventoryItem[] = [
    { id: 'INV-001', name: 'Cable de red 2m', sku: 'CAB-NET-2M', category: 'Genérico', stock: 150, location: 'Almacén Principal' },
    { id: 'INV-002', name: 'Rollo de papel térmico', sku: 'PAP-THER-ROLL', category: 'Genérico', stock: 300, location: 'Almacén Principal' },
    { id: 'INV-003', name: 'Validadora Inetum v3', sku: 'VAL-INETUM-V3', category: 'Específico del Proveedor', stock: 12, location: 'Almacén Operador' },
    { id: 'INV-004', name: 'Tornillos M4', sku: 'HW-SCREW-M4', category: 'Stock Libre', stock: 2500, location: 'Almacén Principal' },
    { id: 'INV-005', name: 'Lector de tarjetas RFID', sku: 'COMP-RFID-READER', category: 'Específico del Proveedor', stock: 35, location: 'Almacén Operador' },
];

export const mockChecklist: Checklist = {
  id: 'CHK-001',
  title: 'Checklist Validador Inetum',
  items: [
    { id: 'item-1', text: 'Inspeccionar la condición física (carcasa, pantalla)', completed: false },
    { id: 'item-2', text: 'Limpiar el lector de tarjetas con un paño adecuado', completed: true },
    { id: 'item-3', text: 'Verificar la versión del firmware (debe ser v3.4.1 o superior)', completed: false },
    { id: 'item-4', text: 'Ejecutar prueba de diagnóstico de hardware', completed: false },
    { id: "item-5", text: 'Probar con múltiples tipos de tarjetas (T-Mobilitat, bancaria)', completed: false },
    { id: 'item-6', text: 'Comprobar las conexiones de alimentación y red', completed: true },
    { id: 'item-7', text: 'Confirmar que las transacciones se registran correctamente', completed: false },
  ],
};
