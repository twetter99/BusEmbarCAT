import type { Vehicle, Equipment, MaintenanceTask, Incident, InventoryItem, User, EquipmentType, Checklist } from '@/lib/types';
import { add, sub } from 'date-fns';

export const mockUsers: User[] = [
    { id: 'user-001', name: 'Admin User', email: 'admin@busembacat.com', role: 'Administrador' },
    { id: 'user-002', name: 'Operator User', email: 'operator@busembacat.com', role: 'Operador', operatorId: 'MetroTrans' },
    { id: 'user-003', name: 'Sermetra User', email: 'sermetra@busembacat.com', role: 'Sermetra' },
];

export const mockVehicles: Vehicle[] = [
  { id: '6916-HCR', model: 'MERCEDES CITARO 3 puertas', operator: 'MetroTrans', status: 'Activo', vin: 'WEB62809013122121', codBus: '300', preInstallationDate: '' },
  { id: '7001-HCR', model: 'MERCEDES CITARO 2 puertas', operator: 'CityLink', status: 'Activo', vin: 'WEB62808313122109', codBus: '302', preInstallationDate: '' },
  { id: '7701-HGY', model: 'MERCEDES CITARO 3 puertas', operator: 'MetroTrans', status: 'Activo', vin: 'WEB62809013702556', codBus: '308', preInstallationDate: '06/06/2022' },
  { id: '7787-HGY', model: 'MERCEDES CITARO 3 puertas', operator: 'UrbanGo', status: 'Activo', vin: 'WEB62809013702557', codBus: '309', preInstallationDate: '06/06/2022' },
  { id: '7851-HGY', model: 'MERCEDES CITARO 3 puertas', operator: 'CityLink', status: 'Activo', vin: 'WEB62809013702539', codBus: '310', preInstallationDate: '07/06/2022' },
  { id: '2288-HHG', model: 'MERCEDES CITARO 3 puertas', operator: 'MetroTrans', status: 'En Mantenimiento', vin: 'WEB62809013702558', codBus: '311', preInstallationDate: '07/06/2022' },
  { id: '2368-HHG', model: 'MERCEDES CITARO 3 puertas', operator: 'UrbanGo', status: 'Activo', vin: 'WEB62809013702559', codBus: '312', preInstallationDate: '07/06/2022' },
  { id: '2090-HHL', model: 'MERCEDES CITARO 3 puertas', operator: 'CityLink', status: 'Activo', vin: 'WEB62809013702560', codBus: '313', preInstallationDate: '09/06/2022' },
  { id: '5020-HNL', model: 'MERCEDES CITARO 3 puertas', operator: 'MetroTrans', status: 'Activo', vin: 'WEB62805213124854', codBus: '315', preInstallationDate: '08/06/2022' },
  { id: '5079-HNL', model: 'MERCEDES CITARO 3 puertas', operator: 'UrbanGo', status: 'Fuera de Servicio', vin: 'WEB62805213124853', codBus: '316', preInstallationDate: '13/06/2022' },
  { id: '9563-HNN', model: 'MERCEDES CITARO 3 puertas', operator: 'CityLink', status: 'Activo', vin: 'WEB62805213124855', codBus: '317', preInstallationDate: '07/06/2022' },
  { id: '9607-HNN', model: 'MERCEDES CITARO 3 puertas', operator: 'MetroTrans', status: 'Activo', vin: 'WEB62805213124856', codBus: '318', preInstallationDate: '10/06/2022' },
  { id: '2093-HNP', model: 'MERCEDES CITARO 2 puertas', operator: 'UrbanGo', status: 'Activo', vin: 'WEB62803113124860', codBus: '319', preInstallationDate: '07/06/2022' },
  { id: '2123-HNP', model: 'MERCEDES CITARO 2 puertas', operator: 'CityLink', status: 'Activo', vin: 'WEB62803113124861', codBus: '320', preInstallationDate: '08/06/2022' },
  { id: '0767-HVG', model: 'MERCEDES CITARO 3 puertas', operator: 'MetroTrans', status: 'Activo', vin: 'WEB62805210604964', codBus: '321', preInstallationDate: '14/06/2022' },
  { id: '1010-HZH', model: 'MERCEDES CITARO 3 puertas', operator: 'UrbanGo', status: 'Activo', vin: 'WEB62805413704141', codBus: '322', preInstallationDate: '14/06/2022' },
  { id: '1023-HZH', model: 'MERCEDES CITARO 3 puertas', operator: 'CityLink', status: 'Activo', vin: 'WEB62805413704140', codBus: '323', preInstallationDate: '08/06/2022' },
  { id: '1025-HZH', model: 'MERCEDES CITARO 3 puertas', operator: 'MetroTrans', status: 'Activo', vin: 'WEB62805413704139', codBus: '324', preInstallationDate: '09/06/2022' },
  { id: '1668-JJN', model: 'MERCEDES CITARO 3 puertas', operator: 'UrbanGo', status: 'Activo', vin: 'WEB62805413705017', codBus: '325', preInstallationDate: '15/06/2022' },
  { id: '4602-JKD', model: 'MERCEDES CITARO LE MÜ 2 puertas', operator: 'CityLink', status: 'Activo', vin: 'WEB62852313704925', codBus: '326', preInstallationDate: '08/06/2022' },
  { id: '4613-JKD', model: 'MERCEDES CITARO LE MÜ 2 puertas', operator: 'MetroTrans', status: 'Activo', vin: 'WEB62852313704926', codBus: '327', preInstallationDate: '08/06/2022' },
  { id: '4619-JKD', model: 'MERCEDES CITARO LE MÜ 2 puertas', operator: 'UrbanGo', status: 'Activo', vin: 'WEB62852313704927', codBus: '328', preInstallationDate: '09/06/2022' },
  { id: '1703-JNF', model: 'MERCEDES CITARO 3 puertas', operator: 'CityLink', status: 'Activo', vin: 'WEB62805413131138', codBus: '329', preInstallationDate: '15/06/2022' },
  { id: '1842-JNF', model: 'MERCEDES CITARO 3 puertas', operator: 'MetroTrans', status: 'Activo', vin: 'WEB62805413131139', codBus: '330', preInstallationDate: '15/06/2022' },
  { id: '1953-JNF', model: 'MERCEDES CITARO 3 puertas', operator: 'UrbanGo', status: 'Activo', vin: 'WEB62805413131140', codBus: '331', preInstallationDate: '15/06/2022' },
  { id: '8836-JTR', model: 'MERCEDES CITARO 3 puertas', operator: 'CityLink', status: 'Activo', vin: 'WEB62805610606950', codBus: '332', preInstallationDate: '16/06/2022' },
  { id: '8884-JTR', model: 'MERCEDES CITARO 3 puertas', operator: 'MetroTrans', status: 'Activo', vin: 'WEB62805610606951', codBus: '333', preInstallationDate: '15/06/2022' },
  { id: '9127-JTZ', model: 'MERCEDES CITARO 3 puertas', operator: 'UrbanGo', status: 'Activo', vin: 'WEB62805610606949', codBus: '334', preInstallationDate: '10/06/2022' },
  { id: '3750-JVB', model: 'MERCEDES CITARO LE MÜ 2 puertas', operator: 'CityLink', status: 'Activo', vin: 'WEB62852513132390', codBus: '335', preInstallationDate: '09/06/2022' },
  { id: '9498-JXG', model: 'MERCEDES CITARO 3 puertas', operator: 'MetroTrans', status: 'Activo', vin: 'WEB62805610607409', codBus: '336', preInstallationDate: '16/06/2022' },
  { id: '0286-KBZ', model: 'MERCEDES CITARO LE MÜ 2 puertas', operator: 'UrbanGo', status: 'Activo', vin: 'WEB62852513133586', codBus: '337', preInstallationDate: '08/06/2022' },
  { id: '4192-KFL', model: 'OTOKAR VECTIO LE', operator: 'CityLink', status: 'Activo', vin: 'NLRTMLA20HA006121', codBus: '338', preInstallationDate: '15/06/2022' },
  { id: '5898-KPS', model: 'MERCEDES CITARO 3 puertas', operator: 'MetroTrans', status: 'Activo', vin: 'WEB62805610609224', codBus: '339', preInstallationDate: '16/06/2022' },
  { id: '6444-KPS', model: 'MERCEDES CITARO 3 puertas', operator: 'UrbanGo', status: 'Activo', vin: 'WEB62805610609225', codBus: '340', preInstallationDate: '16/06/2022' },
  { id: '2700-LCB', model: 'OTOKAR VECTIO LE', operator: 'CityLink', status: 'Activo', vin: 'NLRTMLA20KA007447', codBus: '341', preInstallationDate: '16/06/2022' },
  { id: '5400-LFN', model: 'MERCEDES CITARO Hybrid', operator: 'MetroTrans', status: 'Activo', vin: 'WEB62805610612016', codBus: '342', preInstallationDate: '16/06/2022' },
  { id: '6697-LGH', model: 'MERCEDES CITARO Hybrid', operator: 'UrbanGo', status: 'Activo', vin: 'WEB62805610612017', codBus: '343', preInstallationDate: '16/06/2022' },
  { id: '5993-LMS', model: 'EVOBUS-SOLARIS URBINO 12 HYBRID', operator: 'CityLink', status: 'Activo', vin: 'SUU241163MB023120', codBus: '344', preInstallationDate: '14/06/2022' },
  { id: '7820-LMX', model: 'EVOBUS-SOLARIS URBINO 12 HYBRID', operator: 'MetroTrans', status: 'Activo', vin: 'SUU241163MB023121', codBus: '345', preInstallationDate: '14/06/2022' },
  { id: '7868-LMX', model: 'EVOBUS-SOLARIS URBINO 12 HYBRID', operator: 'UrbanGo', status: 'Activo', vin: 'SUU241163MB023122', codBus: '346', preInstallationDate: '14/06/2022' },
  { id: '7882-LMX', model: 'EVOBUS-SOLARIS URBINO 12 HYBRID', operator: 'CityLink', status: 'Activo', vin: 'SUU241163MB023123', codBus: '347', preInstallationDate: '13/06/2022' },
  { id: '7898-LMX', model: 'EVOBUS-SOLARIS URBINO 12 HYBRID', operator: 'MetroTrans', status: 'Activo', vin: 'SUU241163MB023124', codBus: '348', preInstallationDate: '14/06/2022' },
  { id: '3806-MBW', model: 'EVOBUS-SOLARIS Solaris Urbino 12 Hybrid', operator: 'UrbanGo', status: 'Activo', vin: 'SUU241163NB025635', codBus: '349', preInstallationDate: '01/02/2023' },
  { id: '3235-MCR', model: 'MERCEDES Citaro Hybrid', operator: 'CityLink', status: 'Activo', vin: 'WEB62805610616792', codBus: '350', preInstallationDate: '02/02/2023' },
  { id: '3120-MCR', model: 'MERCEDES Citaro Hybrid', operator: 'MetroTrans', status: 'Activo', vin: 'WEB62805610616793', codBus: '351', preInstallationDate: '03/02/2023' },
  { id: '1376-MCY', model: 'MERCEDES Citaro Hybrid', operator: 'UrbanGo', status: 'Activo', vin: 'WEB62805610616794', codBus: '352', preInstallationDate: '06/02/2023' },
  { id: '9692-MDH', model: 'MERCEDES Citaro Hybrid', operator: 'CityLink', status: 'Activo', vin: 'WEB62805610616795', codBus: '353', preInstallationDate: '03/02/2023' },
  { id: '1399-MCY', model: 'MERCEDES Citaro LE MÜ Hybrid', operator: 'MetroTrans', status: 'Activo', vin: 'WEB62852510616914', codBus: '354', preInstallationDate: '02/02/2023' },
  { id: '9720-MDH', model: 'MERCEDES Citaro LE MÜ Hybrid', operator: 'UrbanGo', status: 'Activo', vin: 'WEB62852510616912', codBus: '355', preInstallationDate: '02/02/2023' },
  { id: '7606-MDP', model: 'MERCEDES Citaro LE MÜ Hybrid', operator: 'CityLink', status: 'Activo', vin: 'WEB62852510616911', codBus: '356', preInstallationDate: '01/02/2023' },
  { id: '7620-MDP', model: 'MERCEDES Citaro LE MÜ Hybrid', operator: 'MetroTrans', status: 'Activo', vin: 'WEB62852510616913', codBus: '357', preInstallationDate: '01/02/2023' },
  { id: '7907-MNZ', model: 'DAIMLER BUSES CITARO HYBRID (Clas 1) - 3 ptas', operator: 'UrbanGo', status: 'Activo', vin: 'WEB2805611L619111', codBus: '358', preInstallationDate: '12/03/2024' },
  { id: '8010-MNZ', model: 'DAIMLER BUSES CITARO HYBRID (Clas 1) - 3 ptas', operator: 'CityLink', status: 'Activo', vin: 'WEB2805631L619112', codBus: '359', preInstallationDate: '12/03/2024' },
  { id: '9026-MSS', model: 'DAIMLER BUSES CITARO HYBRID (Clas 1) - 3 ptas', operator: 'MetroTrans', status: 'Activo', vin: 'WEB2805671L619338', codBus: '360', preInstallationDate: '01/07/2024' },
  { id: '1603-MSX', model: 'DAIMLER BUSES CITARO HYBRID (Clas 1) - 3 ptas', operator: 'UrbanGo', status: 'Activo', vin: 'WEB2805671L619339', codBus: '361', preInstallationDate: '01/07/2024' },
];

export const mockEquipment: Equipment[] = [
  { id: 'EQ-PUP-001', type: 'Pupitre', assignedVehicleId: '6916-HCR', status: 'Operativo', serialNumber: 'SN-PUP-001' },
  { id: 'EQ-IND-001', type: 'Validadora INDRA', assignedVehicleId: '6916-HCR', status: 'Operativo', serialNumber: 'SN-IND-001' },
  { id: 'EQ-INE-001', type: 'Validadora Inetum', assignedVehicleId: '7001-HCR', status: 'Operativo', serialNumber: 'SN-INE-001' },
  { id: 'EQ-CON-001', type: 'Terminal de consulta INDRA', assignedVehicleId: '7701-HGY', status: 'Requiere Reparación', serialNumber: 'SN-CON-001' },
  { id: 'EQ-MMC-001', type: 'MMC', assignedVehicleId: '6916-HCR', status: 'Operativo', serialNumber: 'SN-MMC-001' },
  { id: 'EQ-PLC-001', type: 'Placa de conexión', assignedVehicleId: '6916-HCR', status: 'Operativo', serialNumber: 'SN-PLC-001' },
  { id: 'EQ-ANT-001', type: 'Antena', assignedVehicleId: null, status: 'En Stock', serialNumber: 'SN-ANT-001', location: 'Almacén Principal' },
  { id: 'EQ-KIT-001', type: 'Kit de conexión HARTING', assignedVehicleId: null, status: 'En Stock', serialNumber: 'SN-KIT-001', location: 'Almacén Operador' },
  { id: 'EQ-CAB-001', type: 'Cable de conexión', assignedVehicleId: '7001-HCR', status: 'Operativo', serialNumber: 'SN-CAB-001' },
];

export const mockTasks: MaintenanceTask[] = [
    { id: 'TSK-001', title: 'Revisión Trimestral de Validador', vehicleId: '6916-HCR', equipmentType: 'Validadora INDRA', frequency: 'Trimestral', dueDate: add(new Date(), { days: 10 }), status: 'Pendiente', technician: 'Alice' },
    { id: 'TSK-002', title: 'Calibración Anual de GPS', vehicleId: '7001-HCR', equipmentType: 'Antena', frequency: 'Anual', dueDate: add(new Date(), { days: 30 }), status: 'Pendiente', technician: 'Bob' },
    { id: 'TSK-003', title: 'Actualización Semestral de Consola', vehicleId: '6916-HCR', equipmentType: 'Pupitre', frequency: 'Semestral', dueDate: sub(new Date(), { days: 5 }), status: 'En Progreso', technician: 'Alice' },
    { id: 'TSK-004', title: 'Revisión Trimestral de Validador', vehicleId: '7701-HGY', equipmentType: 'Validadora INDRA', frequency: 'Trimestral', dueDate: sub(new Date(), { days: 90 }), status: 'Completado', technician: 'Charlie' },
];

export const mockIncidents: Incident[] = [
    { id: 'INC-001', vehicleId: '7001-HCR', issue: 'Antena GPS no reporta ubicación', reportedBy: 'Operador Smith', assignedTo: 'Equipo Técnico B', status: 'Abierto', reportedAt: sub(new Date(), { hours: 4 }), slaDays: 3 },
    { id: 'INC-002', vehicleId: '6916-HCR', issue: 'Validador de boletos falla ocasionalmente al leer tarjetas', reportedBy: 'CMG', assignedTo: 'Equipo Técnico A', status: 'En Progreso', reportedAt: sub(new Date(), { days: 1 }), slaDays: 3 },
    { id: 'INC-003', vehicleId: '7851-HGY', issue: 'La pantalla del pupitre está congelada', reportedBy: 'Operador Doe', assignedTo: 'Equipo Técnico A', status: 'Resuelto', reportedAt: sub(new Date(), { days: 5 }), slaDays: 3 },
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
