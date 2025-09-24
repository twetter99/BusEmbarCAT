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
  "TRANSPORTES PUJOL Y PUJOL", "25 OSONA BUS, SA", "BARCELONA BUS, SL", "CINGLES BUS, SA",
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
  { id: 'EQ-KIT-001', type: 'Kit de conexión HARTING', assignedVehicleId: '4192-KFL', status: 'En Stock', serialNumber: 'SN-KIT-001', location: 'Almacén Operador' },
  { id: 'EQ-CAB-001', type: 'Cable de conexión', assignedVehicleId: '7001-HCR', status: 'Operativo', serialNumber: 'SN-CAB-001' },
];

export const mockTasks: MaintenanceTask[] = [
    { id: 'TSK-001', title: 'Revisión Trimestral de Validador', vehicleId: '6916-HCR', equipmentType: 'Validadora INDRA', frequency: 'Trimestral', dueDate: add(new Date(), { days: 10 }), status: 'Pendiente', technician: 'Alice' },
    { id: 'TSK-002', title: 'Calibración Anual de GPS', vehicleId: '7001-HCR', equipmentType: 'Antena', frequency: 'Anual', dueDate: add(new Date(), { days: 30 }), status: 'Pendiente', technician: 'Bob' },
    { id: 'TSK-003', title: 'Actualización Semestral de Consola', vehicleId: '6916-HCR', equipmentType: 'Pupitre', frequency: 'Semestral', dueDate: sub(new Date(), { days: 5 }), status: 'En Progreso', technician: 'Alice' },
    { id: 'TSK-004', title: 'Revisión Trimestral de Validador', vehicleId: '4602-JKD', equipmentType: 'Validadora INDRA', frequency: 'Trimestral', dueDate: sub(new Date(), { days: 90 }), status: 'Completado', technician: 'Charlie' },
];

export const mockIncidents: Incident[] = [
    { id: 'INC-001', vehicleId: '7001-HCR', issue: 'Antena GPS no reporta ubicación', reportedBy: 'Operador Smith', assignedTo: 'Equipo Técnico B', status: 'Abierto', reportedAt: sub(new Date(), { hours: 4 }), slaDays: 3 },
    { id: 'INC-002', vehicleId: '6916-HCR', issue: 'Validador de boletos falla ocasionalmente al leer tarjetas', reportedBy: 'CMG', assignedTo: 'Equipo Técnico A', status: 'En Progreso', reportedAt: sub(new Date(), { days: 1 }), slaDays: 3 },
    { id: 'INC-003', vehicleId: '4192-KFL', issue: 'La pantalla del pupitre está congelada', reportedBy: 'Operador Doe', assignedTo: 'Equipo Técnico A', status: 'Resuelto', reportedAt: sub(new Date(), { days: 5 }), slaDays: 3 },
];

export const mockInventory: InventoryItem[] = [
    { id: 'INV-001', name: 'Fusible Estándar 15A', sku: 'GEN-FUSE-15A', category: 'Genérico', stock: 250, location: 'Almacén A, Contenedor 3' },
    { id: 'INV-002', name: 'Reemplazo de Pantalla de Validador', sku: 'VEND-VSR-01', category: 'Específico del Proveedor', stock: 15, location: 'Almacén B, Estante 1' },
    { id: 'INV-003', name: 'Cable Ethernet 5m', sku: 'FREE-ETH-5M', category: 'Stock Libre', stock: 42, location: 'Banco de Técnicos' },
    { id: 'INV-004', name: 'Antena GPS', sku: 'VEND-GPS-ANT-04', category: 'Específico del Proveedor', stock: 8, location: 'Almacén B, Estante 2' },
];

export const mockChecklist: Checklist = {
    id: 'CHK-QRT-VAL-01',
    title: 'Mantenimiento Trimestral de Validador',
    items: [
        { id: '1', text: 'Inspeccionar la condición física en busca de daños o desgaste.', completed: false },
        { id: '2', text: 'Limpiar el lector de tarjetas y el sensor sin contacto.', completed: false },
        { id: '3', text: 'Verificar que la versión del firmware esté actualizada.', completed: false },
        { id: '4', text: 'Ejecutar prueba de diagnóstico para todos los tipos de lectores.', completed: false },
        { id: '5', text: 'Probar con tarjetas estándar, de concesión y de personal.', completed: false },
        { id: '6', text: 'Comprobar las conexiones de los cables de alimentación y datos.', completed: false },
        { id: '7', text: 'Confirmar el registro exitoso de transacciones.', completed: false },
    ],
};
