import type { Vehicle, Equipment, MaintenanceTask, Incident, InventoryItem } from '@/lib/types';
import { add, sub } from 'date-fns';

export const mockVehicles: Vehicle[] = [
  { id: 'BC-123-X', model: 'Volvo 9800', operator: 'MetroTrans', status: 'Active', vin: 'VIN1234567890' },
  { id: 'BC-456-Y', model: 'Mercedes-Benz Irizar i8', operator: 'CityLink', status: 'Active', vin: 'VIN2345678901' },
  { id: 'BC-789-Z', model: 'Scania Nuvak', operator: 'MetroTrans', status: 'In Maintenance', vin: 'VIN3456789012' },
  { id: 'BC-101-A', model: 'Volvo 9800', operator: 'UrbanGo', status: 'Active', vin: 'VIN4567890123' },
  { id: 'BC-202-B', model: 'Mercedes-Benz Irizar i8', operator: 'CityLink', status: 'Decommissioned', vin: 'VIN5678901234' },
];

export const mockEquipment: Equipment[] = [
  { id: 'EQ-VAL-001', type: 'Validator', assignedVehicleId: 'BC-123-X', status: 'Operational', serialNumber: 'SN-VAL-001' },
  { id: 'EQ-CON-001', type: 'Console', assignedVehicleId: 'BC-123-X', status: 'Operational', serialNumber: 'SN-CON-001' },
  { id: 'EQ-GPS-001', type: 'GPS Module', assignedVehicleId: 'BC-456-Y', status: 'Requires Repair', serialNumber: 'SN-GPS-001' },
  { id: 'EQ-RTR-001', type: 'Router', assignedVehicleId: null, status: 'In Stock', serialNumber: 'SN-RTR-001' },
  { id: 'EQ-VAL-002', type: 'Validator', assignedVehicleId: 'BC-789-Z', status: 'Operational', serialNumber: 'SN-VAL-002' },
];

export const mockTasks: MaintenanceTask[] = [
    { id: 'TSK-001', title: 'Quarterly Validator Check', vehicleId: 'BC-123-X', equipmentType: 'Validator', frequency: 'Quarterly', dueDate: add(new Date(), { days: 10 }), status: 'Pending', technician: 'Alice' },
    { id: 'TSK-002', title: 'Annual GPS Calibration', vehicleId: 'BC-456-Y', equipmentType: 'GPS Module', frequency: 'Annually', dueDate: add(new Date(), { days: 30 }), status: 'Pending', technician: 'Bob' },
    { id: 'TSK-003', title: 'Biannual Console Update', vehicleId: 'BC-123-X', equipmentType: 'Console', frequency: 'Biannually', dueDate: sub(new Date(), { days: 5 }), status: 'In Progress', technician: 'Alice' },
    { id: 'TSK-004', title: 'Quarterly Validator Check', vehicleId: 'BC-789-Z', equipmentType: 'Validator', frequency: 'Quarterly', dueDate: sub(new Date(), { days: 90 }), status: 'Completed', technician: 'Charlie' },
];

export const mockIncidents: Incident[] = [
    { id: 'INC-001', vehicleId: 'BC-456-Y', issue: 'GPS Module not reporting location', reportedBy: 'Operator Smith', assignedTo: 'Tech Team B', status: 'Open', reportedAt: sub(new Date(), { hours: 4 }), slaDays: 3 },
    { id: 'INC-002', vehicleId: 'BC-123-X', issue: 'Ticket validator occasionally fails to read cards', reportedBy: 'CMG', assignedTo: 'Tech Team A', status: 'In Progress', reportedAt: sub(new Date(), { days: 1 }), slaDays: 3 },
    { id: 'INC-003', vehicleId: 'BC-101-A', issue: 'Driver console screen is frozen', reportedBy: 'Operator Doe', assignedTo: 'Tech Team A', status: 'Resolved', reportedAt: sub(new Date(), { days: 5 }), slaDays: 3 },
];

export const mockInventory: InventoryItem[] = [
    { id: 'INV-001', name: 'Standard Fuse 15A', sku: 'GEN-FUSE-15A', category: 'Generic', stock: 250, location: 'Warehouse A, Bin 3' },
    { id: 'INV-002', name: 'Validator Screen Replacement', sku: 'VEND-VSR-01', category: 'Vendor Specific', stock: 15, location: 'Warehouse B, Shelf 1' },
    { id: 'INV-003', name: 'Ethernet Cable 5m', sku: 'FREE-ETH-5M', category: 'Free Stock', stock: 42, location: 'Tech Bench' },
    { id: 'INV-004', name: 'GPS Antenna', sku: 'VEND-GPS-ANT-04', category: 'Vendor Specific', stock: 8, location: 'Warehouse B, Shelf 2' },
];

export const mockChecklist = {
    id: 'CHK-QRT-VAL-01',
    title: 'Quarterly Validator Maintenance',
    items: [
        { id: '1', text: 'Inspect physical condition for damage or wear.', completed: false },
        { id: '2', text: 'Clean card reader and contactless sensor.', completed: false },
        { id: '3', text: 'Verify firmware version is up to date.', completed: false },
        { id: '4', text: 'Run diagnostic test for all reader types.', completed: false },
        { id: '5', text: 'Test with standard, concession, and staff cards.', completed: false },
        { id: '6', text: 'Check power and data cable connections.', completed: false },
        { id: '7', text: 'Confirm successful transaction logging.', completed: false },
    ],
};
