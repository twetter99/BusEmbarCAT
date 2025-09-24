import type { Vehicle, Equipment, MaintenanceTask, Incident, InventoryItem, User, EquipmentType, Checklist } from '@/lib/types';
import { add, sub } from 'date-fns';

export const mockUsers: User[] = [
    { id: 'user-001', name: 'Admin User', email: 'admin@busembacat.com', role: 'Administrador' },
    { id: 'user-002', name: 'Operator User', email: 'operator@busembacat.com', role: 'Operador', operatorId: 'TUSGSAL' },
    { id: 'user-003', name: 'Sermetra User', email: 'sermetra@busembacat.com', role: 'Sermetra' },
];

const validOperators = [
  "ALSINA GRAELLS DE AUTO TRANSPORTES, SA", "AUTOCARES JULIA, SL", "AUTOCARS DEL PENEDÈS, SA",
  "AUTOCARS PRAT, SA", "AUTOCARS R. FONT, SAU", "AUTOCARS VENDRELL, SL", "AUTOCORB, SA",
  "HISPANO LLACUNENSE, SL", "MONTFERRI HERMANOS, SL", "TRANSPORTES MIR", "TUS, SCCL",
  "UTE BAJO LLOBREGAT", "CTSA-Mataró Bus", "RubiBus", "CTSL", "TMESA",
  "MASATS TRANSPORTES GENERALES, SA", "TRANSPORTE GENERAL DE OLESA, SA", "TUSGSAL",
  "CINTOI BUS, SL", "PLANA COMPANY, SL", "UTE HUERTA Y GRACIA", "LA HISPANO IGUALADINA, SL",
  "UTE SANT BOI", "BARCELONA Y OTROS CASAS COMPANY, SA", "AUTOBUSES MARFINA, SA",
  "LA VALLESANA, SA", "MOVENTIA L'HOSPITALET", "TRANSPORTE CONDADO CIUDAD, SA",
  "TRANSPORTES PUJOL Y PUJOL", "25 OSONA BUS, SA", "BARCELona BUS, SL", "CINGLES BUS, SA",
  "COMPAÑÍA SAGALÉS, SA", "FERROCARRILES Y TRANSPORTES, SA", "AUTOBUSES MANRESA, SA",
  "17 BAGES BUS, SA", "UTE VALLDOREIX", "SOLER Y SAURET, SA", "TEISA"
];

const assignOperator = (index: number) => validOperators[index % validOperators.length];

export const mockVehicles: Vehicle[] = [
  { id: '6916-HCR', model: 'MERCEDES CITARO 3 puertas', operator: assignOperator(0), status: 'Activo', vin: 'WEB62809013122121', codBus: '300', preInstallationDate: '' },
  { id: '7001-HCR', model: 'MERCEDES CITARO 2 puertas', operator: assignOperator(1), status: 'Activo', vin: 'WEB62808313122109', codBus: '302', preInstallationDate: '' },
  { id: '4602-JKD', model: 'MERCEDES CITARO LE MÜ 2 puertas', operator: assignOperator(2), status: 'En Mantenimiento', vin: 'WEB62852313704925', codBus: '326', preInstallationDate: '08/06/2022' },
  { id: '4192-KFL', model: 'OTOKAR VECTIO LE', operator: assignOperator(3), status: 'Activo', vin: 'NLRTMLA20HA006121', codBus: '338', preInstallationDate: '15/06/2022' },
  { id: '5400-LFN', model: 'MERCEDES CITARO Hybrid', operator: assignOperator(4), status: 'Activo', vin: 'WEB62805610612016', codBus: '342', preInstallationDate: '16/06/2022' },
  { id: '5993-LMS', model: 'EVOBUS-SOLARIS URBINO 12 HYBRID', operator: assignOperator(5), status: 'Fuera de Servicio', vin: 'SUU241163MB023120', codBus: '344', preInstallationDate: '14/06/2022' },
  { id: '3806-MBW', model: 'EVOBUS-SOLARIS Solaris Urbino 12 Hybrid', operator: assignOperator(6), status: 'Activo', vin: 'SUU241163NB025635', codBus: '349', preInstallationDate: '01/02/2023' },
  { id: '3235-MCR', model: 'MERCEDES Citaro Hybrid', operator: assignOperator(7), status: 'Activo', vin: 'WEB62805610616792', codBus: '350', preInstallationDate: '02/02/2023' },
  { id: '1399-MCY', model: 'MERCEDES Citaro LE MÜ Hybrid', operator: assignOperator(8), status: 'Activo', vin: 'WEB62852510616914', codBus: '354', preInstallationDate: '02/02/2023' },
  { id: '7907-MNZ', model: 'DAIMLER BUSES CITARO HYBRID (Clas 1) - 3 ptas', operator: assignOperator(9), status: 'Activo', vin: 'WEB2805611L619111', codBus: '358', preInstallationDate: '12/03/2024' },
  { id: '0816-NDV', model: 'DAIMLER BUSES Citaro LE MÜ Hybrid 2p', operator: assignOperator(10), status: 'Activo', vin: 'WEB2852511L621420', codBus: '368', preInstallationDate: '' }
];

export const mockEquipment: Equipment[] = [
  { id: 'EQ-PUP-001', type: 'Pupitre', assignedVehicleId: '6916-HCR', status: 'Operativo', serialNumber: 'SN-PUP-001' },
  { id: 'EQ-IND-001', type: 'Validadora INDRA', assignedVehicleId: '6916-HCR', status: 'Operativo', serialNumber: 'SN-IND-001' },
  { id: 'EQ-INE-001', type: 'Validadora Inetum', assignedVehicleId: '7001-HCR', status: 'Operativo', serialNumber: 'SN-INE-001' },
  { id: 'EQ-CON-001', type: 'Terminal de consulta INDRA', assignedVehicleId: '4602-JKD', status: 'Requiere Reparación', serialNumber: 'SN-CON-001' },
  { id: 'EQ-MMC-001', type: 'MMC', assignedVehicleId: '6916-HCR', status: 'Operativo', serialNumber: 'SN-MMC-001' },
  { id: 'EQ-PLC-001', type: 'Placa de conexión', assignedVehicleId: '6916-HCR', status: 'Operativo', serialNumber: 'SN-PLC-001' },
  { id: 'EQ-ANT-001', type: 'Antena', assignedVehicleId: null, status: 'En Stock', serialNumber: 'SN-ANT-001', location: 'Almacén Principal' },
  { id: 'EQ-KIT-001', type: 'Kit de conexión HARTING', assignedVehicleId: '4192-KFL', status: 'Operativo', serialNumber: 'SN-KIT-001' },
  { id: 'EQ-CAB-001', type: 'Cable de conexión', assignedVehicleId: '7001-HCR', status: 'Operativo', serialNumber: 'SN-CAB-001' },
];

export const mockTasks: MaintenanceTask[] = [
  { id: 'MT-001', title: 'Revisión trimestral Pupitre', vehicleId: '6916-HCR', equipmentType: 'Pupitre', frequency: 'Trimestral', dueDate: add(new Date(), { days: 10 }), status: 'Pendiente', technician: 'Alice' },
  { id: 'MT-002', title: 'Mantenimiento semestral Validadora', vehicleId: '7001-HCR', equipmentType: 'Validadora Inetum', frequency: 'Semestral', dueDate: add(new Date(), { days: 25 }), status: 'Pendiente' },
  { id: 'MT-003', title: 'Revisión anual MMC', vehicleId: '4602-JKD', equipmentType: 'MMC', frequency: 'Anual', dueDate: sub(new Date(), { days: 5 }), status: 'Completado', technician: 'Bob' },
  { id: 'MT-004', title: 'Chequeo de Antena', vehicleId: '4192-KFL', equipmentType: 'Antena', frequency: 'Trimestral', dueDate: add(new Date(), { days: 2 }), status: 'En Progreso', technician: 'Alice' },
  { id: 'MT-005', title: 'Revisión de Kit de conexión', vehicleId: '5400-LFN', equipmentType: 'Kit de conexión HARTING', frequency: 'Semestral', dueDate: add(new Date(), { days: 45 }), status: 'Pendiente' },
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
