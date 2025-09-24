import type { Vehicle, Equipment, MaintenanceTask, Incident, InventoryItem, User, EquipmentType, Checklist } from '@/lib/types';
import { add, sub } from 'date-fns';

export const mockUsers: User[] = [
    { id: 'user-001', name: 'Admin User', email: 'admin@busembacat.com', role: 'Administrador' },
    { id: 'user-002', name: 'Operator User', email: 'operator@busembacat.com', role: 'Operador', operatorId: 'TUSGSAL' },
    { id: 'user-003', name: 'Sermetra User', email: 'sermetra@busembacat.com', role: 'Sermetra' },
];

const generateUniqueId = (codBus: string, operator: string): string => {
  const operatorCode = operator.split(' ')[0].replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 8);
  return `VEH-${operatorCode}-${codBus}`;
}

const rawVehicles: Omit<Vehicle, 'uniqueId'>[] = [
  { codBus: '300', id: '6916-HCR', vin: 'WEB62809013122121', model: 'MERCEDES', bodywork: 'CITARO 3 puertas', preInstallationDate: '06/06/22', operator: "ALSINA GRAELLS DE AUTO TRANSPORTES, SA", status: 'Activo' },
  { codBus: '302', id: '7001-HCR', vin: 'WEB62808313122109', model: 'MERCEDES', bodywork: 'CITARO 2 puertas', preInstallationDate: '', operator: "AUTOCARES JULIA, SL", status: 'Activo' },
  { codBus: '326', id: '4602-JKD', vin: 'WEB62852313704925', model: 'MERCEDES', bodywork: 'CITARO LE MÜ 2 puertas', preInstallationDate: '08/06/22', operator: "AUTOCARS DEL PENEDÈS, SA", status: 'En Mantenimiento' },
  { codBus: '338', id: '4192-KFL', vin: 'NLRTMLA20HA006121', model: 'OTOKAR', bodywork: 'VECTIO LE', preInstallationDate: '15/06/22', operator: "AUTOCARS PRAT, SA", status: 'Activo' },
  { codBus: '342', id: '5400-LFN', vin: 'WEB62805610612016', model: 'MERCEDES', bodywork: 'CITARO Hybrid', preInstallationDate: '16/06/22', operator: "AUTOCARS R. FONT, SAU", status: 'Activo' },
  { codBus: '344', id: '5993-LMS', vin: 'SUU241163MB023120', model: 'EVOBUS-SOLARIS', bodywork: 'URBINO 12 HYBRID', preInstallationDate: '14/06/22', operator: "AUTOCARS VENDRELL, SL", status: 'Fuera de Servicio' },
  { codBus: '349', id: '3806-MBW', vin: 'SUU241163NB025635', model: 'EVOBUS-SOLARIS', bodywork: 'Solaris Urbino 12 Hybrid', preInstallationDate: '01/02/23', operator: "AUTOCORB, SA", status: 'Activo' },
  { codBus: '350', id: '3235-MCR', vin: 'WEB62805610616792', model: 'MERCEDES', bodywork: 'Citaro Hybrid', preInstallationDate: '02/02/23', operator: "HISPANO LLACUNENSE, SL", status: 'Activo' },
  { codBus: '354', id: '1399-MCY', vin: 'WEB62852510616914', model: 'MERCEDES', bodywork: 'Citaro LE MÜ Hybrid', preInstallationDate: '02/02/23', operator: "MONTFERRI HERMANOS, SL", status: 'Activo' },
  { codBus: '358', id: '7907-MNZ', vin: 'WEB2805611L619111', model: 'DAIMLER BUSES', bodywork: 'CITARO HYBRID (Clas 1) - 3 ptas', preInstallationDate: '12/03/24', operator: "TRANSPORTES MIR", status: 'Activo' },
  { codBus: '368', id: '0816-NDV', vin: 'WEB2852511L621420', model: 'DAIMLER BUSES', bodywork: 'Citaro LE MÜ Hybrid 2p', preInstallationDate: '', operator: "TUS, SCCL", status: 'Activo' }
];

export const mockVehicles: Vehicle[] = rawVehicles.map(v => ({
  ...v,
  uniqueId: generateUniqueId(v.codBus, v.operator),
}));

export const mockEquipment: Equipment[] = [
  { id: 'EQ-PUP-001', type: 'Pupitre', assignedVehicleId: '6916-HCR', status: 'Operativo', serialNumber: 'SN-PUP-001' },
  { id: 'EQ-IND-001', type: 'Validadora INDRA', assignedVehicleId: '6916-HCR', status: 'Operativo', serialNumber: 'SN-IND-001' },
  { id: 'EQ-INE-001', type: 'Validadora Inetum', assignedVehicleId: '7001-HCR', status: 'Operativo', serialNumber: 'SN-INE-001' },
  { id: 'EQ-CON-001', type: 'Terminal de consulta INDRA', assignedVehicleId: '4602-JKD', status: 'Requiere Reparación', serialNumber: 'SN-CON-001' },
  { id: 'EQ-MMC-001', type: 'Material auxiliar', subType: 'MMC', assignedVehicleId: '6916-HCR', status: 'Operativo', serialNumber: 'SN-MMC-001' },
  { id: 'EQ-PLC-001', type: 'Material auxiliar', subType: 'Placa de conexión', assignedVehicleId: '6916-HCR', status: 'Operativo', serialNumber: 'SN-PLC-001' },
  { id: 'EQ-ANT-001', type: 'Material auxiliar', subType: 'Antena', assignedVehicleId: null, status: 'En Stock', serialNumber: 'SN-ANT-001', location: 'Almacén Principal' },
  { id: 'EQ-KIT-001', type: 'Material auxiliar', subType: 'Kit de conexión HARTING', assignedVehicleId: '4192-KFL', status: 'Operativo', serialNumber: 'SN-KIT-001' },
  { id: 'EQ-CAB-001', type: 'Material auxiliar', subType: 'Cable de conexión', assignedVehicleId: '7001-HCR', status: 'Operativo', serialNumber: 'SN-CAB-001' },
];

export const mockTasks: MaintenanceTask[] = [
  { id: 'MT-001', title: 'Revisión trimestral Pupitre', vehicleId: '6916-HCR', equipmentType: 'Pupitre', frequency: 'Trimestral', dueDate: add(new Date(), { days: 10 }), status: 'Pendiente', technician: 'Alice' },
  { id: 'MT-002', title: 'Mantenimiento semestral Validadora', vehicleId: '7001-HCR', equipmentType: 'Validadora Inetum', frequency: 'Semestral', dueDate: add(new Date(), { days: 25 }), status: 'Pendiente' },
  { id: 'MT-003', title: 'Revisión anual MMC', vehicleId: '4602-JKD', equipmentType: 'Material auxiliar', frequency: 'Anual', dueDate: sub(new Date(), { days: 5 }), status: 'Completado', technician: 'Bob' },
  { id: 'MT-004', title: 'Chequeo de Antena', vehicleId: '4192-KFL', equipmentType: 'Material auxiliar', frequency: 'Trimestral', dueDate: add(new Date(), { days: 2 }), status: 'En Progreso', technician: 'Alice' },
  { id: 'MT-005', title: 'Revisión de Kit de conexión', vehicleId: '5400-LFN', equipmentType: 'Material auxiliar', frequency: 'Semestral', dueDate: add(new Date(), { days: 45 }), status: 'Pendiente' },
];

export const mockIncidents: Incident[] = [
    { id: 'INC-001', vehicleId: '6916-HCR', issue: 'El pupitre no enciende la pantalla.', reportedBy: 'John Doe', assignedTo: 'Alice', status: 'Abierto', reportedAt: new Date('2024-07-28'), slaDays: 2 },
    { id: 'INC-002', vehicleId: '4602-JKD', issue: 'La validadora no lee las tarjetas T-Mobilitat.', reportedBy: 'Jane Smith', assignedTo: 'Bob', status: 'En Progreso', reportedAt: new Date('2024-07-27'), slaDays: 3 },
    { id: 'INC-003', vehicleId: '5993-LMS', issue: 'Pérdida intermitente de la señal GPS.', reportedBy: 'Peter Jones', assignedTo: 'Charlie', status: 'Resuelto', reportedAt: new Date('2024-07-25'), slaDays: 1 },
    { id: 'INC-004', vehicleId: '7907-MNZ', issue: 'La impresora de tickets no funciona.', reportedBy: 'Emily Brown', assignedTo: 'Alice', status: 'Abierto', reportedAt: new Date(), slaDays: 1 },
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
    { id: 'item-5', text: 'Probar con múltiples tipos de tarjetas (T-Mobilitat, bancaria)', completed: false },
    { id: 'item-6', text: 'Comprobar las conexiones de alimentación y red', completed: true },
    { id: 'item-7', text: 'Confirmar que las transacciones se registran correctamente', completed: false },
  ],
};
