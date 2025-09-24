import type { Vehicle, Equipment, MaintenanceTask, Incident, InventoryItem, User } from '@/lib/types';
import { add, sub } from 'date-fns';

export const mockUsers: User[] = [
    { id: 'user-001', name: 'Admin User', email: 'admin@busembacat.com', role: 'Administrador' },
    { id: 'user-002', name: 'Operator User', email: 'operator@busembacat.com', role: 'Operador', operatorId: 'MetroTrans' },
    { id: 'user-003', name: 'Sermetra User', email: 'sermetra@busembacat.com', role: 'Sermetra' },
];

export const mockVehicles: Vehicle[] = [
  { id: 'BC-123-X', model: 'Volvo 9800', operator: 'MetroTrans', status: 'Activo', vin: 'VIN1234567890' },
  { id: 'BC-456-Y', model: 'Mercedes-Benz Irizar i8', operator: 'CityLink', status: 'Activo', vin: 'VIN2345678901' },
  { id: 'BC-789-Z', model: 'Scania Nuvak', operator: 'MetroTrans', status: 'En Mantenimiento', vin: 'VIN3456789012' },
  { id: 'BC-101-A', model: 'Volvo 9800', operator: 'UrbanGo', status: 'Activo', vin: 'VIN4567890123' },
  { id: 'BC-202-B', model: 'Mercedes-Benz Irizar i8', operator: 'CityLink', status: 'Fuera de Servicio', vin: 'VIN5678901234' },
];

export const mockEquipment: Equipment[] = [
  { id: 'EQ-PUP-001', type: 'Pupitre', assignedVehicleId: 'BC-123-X', status: 'Operativo', serialNumber: 'SN-PUP-001' },
  { id: 'EQ-IND-001', type: 'Validadora INDRA', assignedVehicleId: 'BC-123-X', status: 'Operativo', serialNumber: 'SN-IND-001' },
  { id: 'EQ-INE-001', type: 'Validadora Inetum', assignedVehicleId: 'BC-456-Y', status: 'Operativo', serialNumber: 'SN-INE-001' },
  { id: 'EQ-CON-001', type: 'Terminal de consulta INDRA', assignedVehicleId: 'BC-789-Z', status: 'Requiere Reparación', serialNumber: 'SN-CON-001' },
  { id: 'EQ-MMC-001', type: 'MMC', assignedVehicleId: 'BC-123-X', status: 'Operativo', serialNumber: 'SN-MMC-001' },
  { id: 'EQ-PLC-001', type: 'Placa de conexión', assignedVehicleId: 'BC-123-X', status: 'Operativo', serialNumber: 'SN-PLC-001' },
  { id: 'EQ-ANT-001', type: 'Antena', assignedVehicleId: null, status: 'En Stock', serialNumber: 'SN-ANT-001', location: 'Almacén Principal' },
  { id: 'EQ-KIT-001', type: 'Kit de conexión HARTING', assignedVehicleId: null, status: 'En Stock', serialNumber: 'SN-KIT-001', location: 'Almacén Operador' },
  { id: 'EQ-CAB-001', type: 'Cable de conexión', assignedVehicleId: 'BC-456-Y', status: 'Operativo', serialNumber: 'SN-CAB-001' },
];

export const mockTasks: MaintenanceTask[] = [
    { id: 'TSK-001', title: 'Revisión Trimestral de Validador', vehicleId: 'BC-123-X', equipmentType: 'Validadora INDRA', frequency: 'Trimestral', dueDate: add(new Date(), { days: 10 }), status: 'Pendiente', technician: 'Alice' },
    { id: 'TSK-002', title: 'Calibración Anual de GPS', vehicleId: 'BC-456-Y', equipmentType: 'Antena', frequency: 'Anual', dueDate: add(new Date(), { days: 30 }), status: 'Pendiente', technician: 'Bob' },
    { id: 'TSK-003', title: 'Actualización Semestral de Consola', vehicleId: 'BC-123-X', equipmentType: 'Pupitre', frequency: 'Semestral', dueDate: sub(new Date(), { days: 5 }), status: 'En Progreso', technician: 'Alice' },
    { id: 'TSK-004', title: 'Revisión Trimestral de Validador', vehicleId: 'BC-789-Z', equipmentType: 'Validadora INDRA', frequency: 'Trimestral', dueDate: sub(new Date(), { days: 90 }), status: 'Completado', technician: 'Charlie' },
];

export const mockIncidents: Incident[] = [
    { id: 'INC-001', vehicleId: 'BC-456-Y', issue: 'Antena GPS no reporta ubicación', reportedBy: 'Operador Smith', assignedTo: 'Equipo Técnico B', status: 'Abierto', reportedAt: sub(new Date(), { hours: 4 }), slaDays: 3 },
    { id: 'INC-002', vehicleId: 'BC-123-X', issue: 'Validador de boletos falla ocasionalmente al leer tarjetas', reportedBy: 'CMG', assignedTo: 'Equipo Técnico A', status: 'En Progreso', reportedAt: sub(new Date(), { days: 1 }), slaDays: 3 },
    { id: 'INC-003', vehicleId: 'BC-101-A', issue: 'La pantalla del pupitre está congelada', reportedBy: 'Operador Doe', assignedTo: 'Equipo Técnico A', status: 'Resuelto', reportedAt: sub(new Date(), { days: 5 }), slaDays: 3 },
];

export const mockInventory: InventoryItem[] = [
    { id: 'INV-001', name: 'Fusible Estándar 15A', sku: 'GEN-FUSE-15A', category: 'Genérico', stock: 250, location: 'Almacén A, Contenedor 3' },
    { id: 'INV-002', name: 'Reemplazo de Pantalla de Validador', sku: 'VEND-VSR-01', category: 'Específico del Proveedor', stock: 15, location: 'Almacén B, Estante 1' },
    { id: 'INV-003', name: 'Cable Ethernet 5m', sku: 'FREE-ETH-5M', category: 'Stock Libre', stock: 42, location: 'Banco de Técnicos' },
    { id: 'INV-004', name: 'Antena GPS', sku: 'VEND-GPS-ANT-04', category: 'Específico del Proveedor', stock: 8, location: 'Almacén B, Estante 2' },
];

export const mockChecklist = {
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
