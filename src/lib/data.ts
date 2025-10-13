

import type { Vehicle, Equipment, MaintenanceTask, Incident, InventoryItem, User, EquipmentType, Operator, Installation, Decommissioning, Transfer, DashboardData, OperatorMetrics, InventoryCategory } from '@/lib/types';
import { add, sub } from 'date-fns';

export const mockOperators: Operator[] = [
    { id: 'op-01', name: 'ALSINA GRAELLS DE AUTO TRANSPORTES, SA', status: 'Actiu' },
    { id: 'op-02', name: 'AUTOCARES JULIA, SL', status: 'Actiu' },
    { id: 'op-03', name: 'AUTOCARS DEL PENEDÈS, SA', status: 'Actiu' },
    { id: 'op-04', name: 'AUTOCARS PRAT, SA', status: 'Actiu' },
    { id: 'op-05', name: 'AUTOCARS R. FONT, SAU', status: 'Inactiu' },
    { id: 'op-06', name: 'AUTOCARS VENDRELL, SL', status: 'Actiu' },
    { id: 'op-07', name: 'AUTOCORB, SA', status: 'Actiu' },
    { id: 'op-08', name: 'HISPANO LLACUNENSE, SL', status: 'Actiu' },
    { id: 'op-09', name: 'MONTFERRI HERMANOS, SL', status: 'Actiu' },
    { id: 'op-10', name: 'TRANSPORTES MIR', status: 'Inactiu' },
    { id: 'op-11', name: 'TUS, SCCL', status: 'Actiu' }
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
    { codBus: '300', id: '6916-HCR', vin: 'WEB62809013122121', model: 'MERCEDES', bodywork: 'CITARO 3 portes', preInstallationDate: '06/01/26', operator: "ALSINA GRAELLS DE AUTO TRANSPORTES, SA", status: 'Actiu' },
    { codBus: '301', id: '6917-HCR', vin: 'WEB62809013122122', model: 'MERCEDES', bodywork: 'CITARO 3 portes', preInstallationDate: '06/01/26', operator: "ALSINA GRAELLS DE AUTO TRANSPORTES, SA", status: 'Actiu' },
    { codBus: '302', id: '7001-HCR', vin: 'WEB62808313122109', model: 'MERCEDES', bodywork: 'CITARO 2 portes', preInstallationDate: '07/01/26', operator: "AUTOCARES JULIA, SL", status: 'Actiu' },
    { codBus: '303', id: '7002-HCR', vin: 'WEB62808313122110', model: 'MERCEDES', bodywork: 'CITARO 2 portes', preInstallationDate: '07/01/26', operator: "AUTOCARES JULIA, SL", status: 'Actiu' },
    { codBus: '326', id: '4602-JKD', vin: 'WEB62852313704925', model: 'MERCEDES', bodywork: 'CITARO LE MÜ 2 portes', preInstallationDate: '08/01/26', operator: "AUTOCARS DEL PENEDÈS, SA", status: 'En Manteniment' },
    { codBus: '338', id: '4192-KFL', vin: 'NLRTMLA20HA006121', model: 'OTOKAR', bodywork: 'VECTIO LE', preInstallationDate: '15/01/26', operator: "AUTOCARS PRAT, SA", status: 'Actiu' },
    { codBus: '342', id: '5400-LFN', vin: 'WEB62805610612016', model: 'MERCEDES', bodywork: 'CITARO Hybrid', preInstallationDate: '16/01/26', operator: "AUTOCARS R. FONT, SAU", status: 'Actiu' },
    { codBus: '344', id: '5993-LMS', vin: 'SUU241163MB023120', model: 'EVOBUS-SOLARIS', bodywork: 'URBINO 12 HYBRID', preInstallationDate: '14/01/26', operator: "AUTOCARS VENDRELL, SL", status: 'Fora de Servei' },
    { codBus: '349', id: '3806-MBW', vin: 'SUU241163NB025635', model: 'EVOBUS-SOLARIS', bodywork: 'Solaris Urbino 12 Hybrid', preInstallationDate: '01/02/26', operator: "AUTOCORB, SA", status: 'Actiu' },
    { codBus: '350', id: '3235-MCR', vin: 'WEB62805610616792', model: 'MERCEDES', bodywork: 'Citaro Hybrid', preInstallationDate: '02/02/26', operator: "HISPANO LLACUNENSE, SL", status: 'Actiu' },
    { codBus: '351', id: '3236-MCR', vin: 'WEB62805610616793', model: 'MERCEDES', bodywork: 'Citaro Hybrid', preInstallationDate: '02/02/26', operator: "HISPANO LLACUNENSE, SL", status: 'Actiu' },
    { codBus: '354', id: '1399-MCY', vin: 'WEB62852510616914', model: 'MERCEDES', bodywork: 'Citaro LE MÜ Hybrid', preInstallationDate: '02/02/26', operator: "MONTFERRI HERMANOS, SL", status: 'Actiu' },
    { codBus: '358', id: '7907-MNZ', vin: 'WEB2805611L619111', model: 'DAIMLER BUSES', bodywork: 'CITARO HYBRID (Clas 1) - 3 ptas', preInstallationDate: '12/03/26', operator: "TRANSPORTES MIR", status: 'Actiu' },
    { codBus: '368', id: '0816-NDV', vin: 'WEB2852511L621420', model: 'DAIMLER BUSES', bodywork: 'Citaro LE MÜ Hybrid 2p', preInstallationDate: '13/03/26', operator: "TUS, SCCL", status: 'Actiu' },
    { codBus: '287', id: '1111-KFL', vin: 'NLRTMLA20HA001111', model: 'OTOKAR', bodywork: 'VECTIO LE', preInstallationDate: '15/01/26', operator: "AUTOCARS PRAT, SA", status: 'Actiu' },
    { codBus: '203', id: '2222-JKD', vin: 'WEB62852313704222', model: 'MERCEDES', bodywork: 'CITARO LE MÜ 2 portes', preInstallationDate: '08/01/26', operator: "AUTOCARS DEL PENEDÈS, SA", status: 'Actiu' },
    { codBus: '159', id: '3333-HCR', vin: 'WEB62808313122333', model: 'MERCEDES', bodywork: 'CITARO 2 portes', preInstallationDate: '07/01/26', operator: "AUTOCARES JULIA, SL", status: 'Actiu' },
    { codBus: '445', id: '4444-HCR', vin: 'WEB62809013122444', model: 'MERCEDES', bodywork: 'CITARO 3 portes', preInstallationDate: '06/01/26', operator: "ALSINA GRAELLS DE AUTO TRANSPORTES, SA", status: 'Actiu' },
    { codBus: '412', id: '5555-LMS', vin: 'SUU241163MB023555', model: 'EVOBUS-SOLARIS', bodywork: 'URBINO 12 HYBRID', preInstallationDate: '14/01/26', operator: "AUTOCARS VENDRELL, SL", status: 'Fora de Servei' },
    { codBus: '334', id: '6666-MCY', vin: 'WEB62852510616666', model: 'MERCEDES', bodywork: 'Citaro LE MÜ Hybrid', preInstallationDate: '02/02/26', operator: "MONTFERRI HERMANOS, SL", status: 'Actiu' },
    { codBus: '304', id: '8889-HCR', vin: 'WEB62808313122889', model: 'MERCEDES', bodywork: 'CITARO 2 portes', preInstallationDate: '07/01/26', operator: "AUTOCARES JULIA, SL", status: 'Actiu' },
    { codBus: '352', id: '9990-MCR', vin: 'WEB62805610616990', model: 'MERCEDES', bodywork: 'Citaro Hybrid', preInstallationDate: '02/02/26', operator: "HISPANO LLACUNENSE, SL", status: 'Actiu' },
    { codBus: '288', id: '1112-KFL', vin: 'NLRTMLA20HA001112', model: 'OTOKAR', bodywork: 'VECTIO LE', preInstallationDate: '15/01/26', operator: "AUTOCARS PRAT, SA", status: 'Actiu' },
    { codBus: '369', id: '0817-NDV', vin: 'WEB2852511L621421', model: 'DAIMLER BUSES', bodywork: 'Citaro LE MÜ Hybrid 2p', preInstallationDate: '13/03/26', operator: "TUS, SCCL", status: 'Actiu' },
    { codBus: '204', id: '2223-JKD', vin: 'WEB62852313704223', model: 'MERCEDES', bodywork: 'CITARO LE MÜ 2 portes', preInstallationDate: '08/01/26', operator: "AUTOCARS DEL PENEDÈS, SA", status: 'Actiu' },
    { codBus: '160', id: '3334-HCR', vin: 'WEB62808313122334', model: 'MERCEDES', bodywork: 'CITARO 2 portes', preInstallationDate: '07/01/26', operator: "AUTOCARES JULIA, SL", status: 'Actiu' },
    { codBus: '446', id: '4445-HCR', vin: 'WEB62809013122445', model: 'MERCEDES', bodywork: 'CITARO 3 portes', preInstallationDate: '06/01/26', operator: "ALSINA GRAELLS DE AUTO TRANSPORTES, SA", status: 'Actiu' },
    { codBus: '413', id: '5556-LMS', vin: 'SUU241163MB023556', model: 'EVOBUS-SOLARIS', bodywork: 'URBINO 12 HYBRID', preInstallationDate: '14/01/26', operator: "AUTOCARS VENDRELL, SL", status: 'Fora de Servei' },
    { codBus: '335', id: '6667-MCY', vin: 'WEB62852510616667', model: 'MERCEDES', bodywork: 'Citaro LE MÜ Hybrid', preInstallationDate: '02/02/26', operator: "MONTFERRI HERMANOS, SL", status: 'Actiu' },
    { codBus: '289', id: '1113-KFL', vin: 'NLRTMLA20HA001113', model: 'OTOKAR', bodywork: 'VECTIO LE', preInstallationDate: '15/01/26', operator: "AUTOCARS PRAT, SA", status: 'Actiu' },
    { codBus: '370', id: '0818-NDV', vin: 'WEB2852511L621422', model: 'DAIMLER BUSES', bodywork: 'Citaro LE MÜ Hybrid 2p', preInstallationDate: '13/03/26', operator: "TUS, SCCL", status: 'Actiu' },
    { codBus: '205', id: '2224-JKD', vin: 'WEB62852313704224', model: 'MERCEDES', bodywork: 'CITARO LE MÜ 2 portes', preInstallationDate: '08/01/26', operator: "AUTOCARS DEL PENEDÈS, SA", status: 'Actiu' },
    { codBus: '161', id: '3335-HCR', vin: 'WEB62808313122335', model: 'MERCEDES', bodywork: 'CITARO 2 portes', preInstallationDate: '07/01/26', operator: "AUTOCARES JULIA, SL", status: 'Actiu' },
    { codBus: '447', id: '4446-HCR', vin: 'WEB62809013122446', model: 'MERCEDES', bodywork: 'CITARO 3 portes', preInstallationDate: '06/01/26', operator: "ALSINA GRAELLS DE AUTO TRANSPORTES, SA", status: 'Actiu' },
    { codBus: '414', id: '5557-LMS', vin: 'SUU241163MB023557', model: 'EVOBUS-SOLARIS', bodywork: 'URBINO 12 HYBRID', preInstallationDate: '14/01/26', operator: "AUTOCARS VENDRELL, SL", status: 'Fora de Servei' },
    { codBus: '336', id: '6668-MCY', vin: 'WEB62852510616668', model: 'MERCEDES', bodywork: 'Citaro LE MÜ Hybrid', preInstallationDate: '02/02/26', operator: "MONTFERRI HERMANOS, SL", status: 'Actiu' },
];

export const mockVehicles: Vehicle[] = rawVehicles.map((v) => {
  const operatorId = operatorMap.get(v.operator);
  if (!operatorId) {
    console.warn(`Operador no trobat per al vehicle amb calca ${v.codBus}: ${v.operator}`);
    return {
      ...v,
      uniqueId: generateUniqueId(v.codBus, v.operator),
      operatorId: 'op-unknown',
      operatorName: v.operator,
    };
  }
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
  const createEquipment = (type: EquipmentType, subType: string | undefined, vehicle: Vehicle | null, status: Equipment['status'], serial: string, location?: string) => {
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
  createEquipment('Pupitre', undefined, mockVehicles[0], 'Operatiu', 'PUP-001');
  createEquipment('Validadora INDRA', undefined, mockVehicles[0], 'Operatiu', 'IND-001');
  createEquipment('Material auxiliar', 'MMC', mockVehicles[0], 'Operatiu', 'MMC-001');
  
  createEquipment('Pupitre', undefined, mockVehicles[1], 'Operatiu', 'PUP-002');
  createEquipment('Validadora Inetum', undefined, mockVehicles[1], 'Operatiu', 'INE-001');
  
  createEquipment('Pupitre', undefined, mockVehicles[2], 'Requereix Reparació', 'PUP-003');
  createEquipment('Terminal de consulta INDRA', undefined, mockVehicles[2], 'Operatiu', 'CON-001');

  createEquipment('Validadora INDRA', undefined, mockVehicles[3], 'Operatiu', 'IND-002');
  createEquipment('Validadora INDRA', undefined, mockVehicles[3], 'Operatiu', 'IND-003');

  // Create unassigned equipment
  createEquipment('Pupitre', undefined, null, 'En Estoc', 'PUP-100', 'Magatzem Principal');
  createEquipment('Validadora INDRA', undefined, null, 'Requereix Reparació', 'IND-100', 'Taller Reparacions');
  createEquipment('Validadora Inetum', undefined, null, 'En Estoc', 'INE-100', 'Magatzem Operador 2');
  createEquipment('Terminal de consulta INDRA', undefined, null, 'En Estoc', 'CON-100', 'Magatzem Principal');
  
  // Create all subtypes of Material auxiliar
  createEquipment('Material auxiliar', 'MMC', mockVehicles[4], 'Operatiu', 'MMC-002');
  createEquipment('Material auxiliar', 'Placa de conexión', null, 'En Estoc', 'PLC-101', 'Magatzem Principal');
  createEquipment('Material auxiliar', 'Soporte', mockVehicles[5], 'Requereix Reparació', 'SOP-001');
  createEquipment('Material auxiliar', 'Antena', null, 'En Estoc', 'ANT-101', 'Magatzem Operador 1');
  createEquipment('Material auxiliar', 'Cambio de IP', mockVehicles[6], 'Operatiu', 'CIP-001');
  createEquipment('Material auxiliar', 'Kit de conexión HARTING', null, 'En Estoc', 'HAR-101', 'Magatzem Principal');
  createEquipment('Material auxiliar', 'Cable de conexión', mockVehicles[7], 'Operatiu', 'CAB-001');
  createEquipment('Material auxiliar', 'Conector', null, 'Requereix Reparació', 'CON-102', 'Taller Reparacions');
  createEquipment('Material auxiliar', 'Fusible', mockVehicles[8], 'Operatiu', 'FUS-001');
  createEquipment('Material auxiliar', 'Perno', null, 'En Estoc', 'PER-101', 'Magatzem Principal');
  createEquipment('Material auxiliar', 'Tanque', mockVehicles[9], 'Operatiu', 'TAN-001');
  createEquipment('Material auxiliar', 'Brida', null, 'En Estoc', 'BRI-101', 'Magatzem Principal');
  createEquipment('Material auxiliar', 'Travesaño', mockVehicles[10], 'Operatiu', 'TRA-001');
  createEquipment('Material auxiliar', 'Barra', null, 'En Estoc', 'BAR-101', 'Magatzem Principal');

  return equipmentList;
};

export const mockEquipment: Equipment[] = generateEquipment();

const findVehicleByOperatorAndIndex = (operatorId: string, index: number): Vehicle => {
    const vehiclesOfOperator = mockVehicles.filter(v => v.operatorId === operatorId);
    if (vehiclesOfOperator.length > 0) {
        return vehiclesOfOperator[index % vehiclesOfOperator.length];
    }
    // Fallback if no vehicle for operator is found
    const fallbackVehicle = mockVehicles[index % mockVehicles.length];
    return fallbackVehicle;
};

const technicians = ['Jordi', 'Pau', 'Marc', 'Oriol', 'Xavier', 'Miquel', 'Josep', 'Carles', 'David', 'Bernat', 'Quim', 'Toni', 'Ramon', 'Ferran', 'Albert'];
const today = new Date('2026-01-15T15:00:00');

export const mockTasks: MaintenanceTask[] = [
    // === PENDIENTE (10) ===
    // 4 Vencidos (rojos)
    { id: 'MT-P01', type: 'Preventiu', title: 'Manteniment 3M', vehicleId: findVehicleByOperatorAndIndex('op-01', 0).id, equipmentType: 'Placa conexiones', frequency: 'Trimestral', dueDate: new Date('2026-01-03T15:00:00'), status: 'Pendent' },
    { id: 'MT-P02', type: 'Preventiu', title: 'Manteniment 1A', vehicleId: findVehicleByOperatorAndIndex('op-02', 0).id, equipmentType: 'Bornes y Pupitre', frequency: 'Anual', dueDate: new Date('2026-01-07T15:00:00'), status: 'Pendent' },
    { id: 'MT-P03', type: 'Preventiu', title: 'Manteniment 2A', vehicleId: findVehicleByOperatorAndIndex('op-08', 0).id, equipmentType: 'Baterías CPU', frequency: 'Bianual', dueDate: new Date('2026-01-12T15:00:00'), status: 'Pendent' },
    { id: 'MT-P04', type: 'Preventiu', title: 'Manteniment 3M', vehicleId: findVehicleByOperatorAndIndex('op-01', 1).id, equipmentType: 'Placa conexiones', frequency: 'Trimestral', dueDate: new Date('2025-12-20T15:00:00'), status: 'Pendent' },
    
    // 2 Urgentes (naranjas)
    { id: 'MT-P05', type: 'Preventiu', title: 'Manteniment 1A', vehicleId: findVehicleByOperatorAndIndex('op-04', 0).id, equipmentType: 'Limpieza Validadora', frequency: 'Anual', dueDate: new Date('2026-01-16T15:00:00'), status: 'Pendent' },
    { id: 'MT-P06', type: 'Preventiu', title: 'Manteniment 3M', vehicleId: findVehicleByOperatorAndIndex('op-11', 0).id, equipmentType: 'Placa conexiones', frequency: 'Trimestral', dueDate: new Date('2026-01-18T15:00:00'), status: 'Pendent' },

    // 3 Próximos (amarillos)
    { id: 'MT-P07', type: 'Preventiu', title: 'Manteniment 1A', vehicleId: findVehicleByOperatorAndIndex('op-03', 0).id, equipmentType: 'Soporte y Barras', frequency: 'Anual', dueDate: new Date('2026-01-23T15:00:00'), status: 'Pendent' },
    { id: 'MT-P08', type: 'Preventiu', title: 'Manteniment 2A', vehicleId: findVehicleByOperatorAndIndex('op-02', 1).id, equipmentType: 'Antena', frequency: 'Bianual', dueDate: new Date('2026-01-30T15:00:00'), status: 'Pendent' },
    
    // 1 Normal (default)
    { id: 'MT-P09', type: 'Preventiu', title: 'Manteniment 3M', vehicleId: findVehicleByOperatorAndIndex('op-06', 0).id, equipmentType: 'Placa conexiones', frequency: 'Trimestral', dueDate: new Date('2026-02-05T15:00:00'), status: 'Pendent' },
    { id: 'MT-P10', type: 'Preventiu', title: 'Manteniment 1A', vehicleId: findVehicleByOperatorAndIndex('op-09', 0).id, equipmentType: 'Limpieza Validadora', frequency: 'Anual', dueDate: new Date('2026-03-15T15:00:00'), status: 'Pendent' },


    // === EN PROGRESO (10) ===
    { id: 'MT-IP01', type: 'Preventiu', title: 'Manteniment 1A', vehicleId: findVehicleByOperatorAndIndex('op-01', 2).id, equipmentType: 'Bornes y Pupitre', frequency: 'Anual', dueDate: add(today, { days: 2 }), status: 'En Progrés', technician: 'Pau' },
    { id: 'MT-IP02', type: 'Preventiu', title: 'Manteniment 3M', vehicleId: findVehicleByOperatorAndIndex('op-02', 2).id, equipmentType: 'Placa conexiones', frequency: 'Trimestral', dueDate: add(today, { days: 1 }), status: 'En Progrés', technician: 'Xavier' },
    { id: 'MT-IP03', type: 'Preventiu', title: 'Manteniment 2A', vehicleId: findVehicleByOperatorAndIndex('op-08', 1).id, equipmentType: 'Baterías CPU', frequency: 'Bianual', dueDate: add(today, { days: 3 }), status: 'En Progrés', technician: 'Miquel' },
    { id: 'MT-IP04', type: 'Preventiu', title: 'Manteniment 1A', vehicleId: findVehicleByOperatorAndIndex('op-04', 1).id, equipmentType: 'Limpieza Validadora', frequency: 'Anual', dueDate: add(today, { days: 1 }), status: 'En Progrés', technician: 'Josep' },
    { id: 'MT-IP05', type: 'Preventiu', title: 'Manteniment 3M', vehicleId: findVehicleByOperatorAndIndex('op-11', 1).id, equipmentType: 'Placa conexiones', frequency: 'Trimestral', dueDate: today, status: 'En Progrés', technician: 'Carles' },
    { id: 'MT-IP06', type: 'Preventiu', title: 'Manteniment 1A', vehicleId: findVehicleByOperatorAndIndex('op-03', 1).id, equipmentType: 'Soporte y Barras', frequency: 'Anual', dueDate: add(today, { days: 4 }), status: 'En Progrés', technician: 'David' },
    { id: 'MT-IP07', type: 'Preventiu', title: 'Manteniment 2A', vehicleId: findVehicleByOperatorAndIndex('op-02', 3).id, equipmentType: 'Brida y Antena', frequency: 'Bianual', dueDate: add(today, { weeks: 1 }), status: 'En Progrés', technician: 'Bernat' },
    { id: 'MT-IP08', type: 'Preventiu', title: 'Manteniment 3M', vehicleId: findVehicleByOperatorAndIndex('op-01', 3).id, equipmentType: 'Placa conexiones', frequency: 'Trimestral', dueDate: add(today, { days: 2 }), status: 'En Progrés', technician: 'Quim' },
    { id: 'MT-IP09', type: 'Preventiu', title: 'Manteniment 1A', vehicleId: findVehicleByOperatorAndIndex('op-06', 1).id, equipmentType: 'Soporte y Barras', frequency: 'Anual', dueDate: add(today, { days: 3 }), status: 'En Progrés', technician: 'Toni' },
    { id: 'MT-IP10', type: 'Preventiu', title: 'Manteniment 2A', vehicleId: findVehicleByOperatorAndIndex('op-09', 1).id, equipmentType: 'Antena', frequency: 'Bianual', dueDate: add(today, { days: 5 }), status: 'En Progrés', technician: 'Ramon' },

    // === COMPLETADO (10) ===
    { id: 'MT-C01', type: 'Preventiu', title: 'Manteniment 1A', vehicleId: findVehicleByOperatorAndIndex('op-01', 4).id, equipmentType: 'Bornes y Pupitre', frequency: 'Anual', dueDate: sub(today, { days: 2 }), status: 'Completat', technician: 'Pau' },
    { id: 'MT-C02', type: 'Preventiu', title: 'Manteniment 3M', vehicleId: findVehicleByOperatorAndIndex('op-02', 4).id, equipmentType: 'Placa conexiones', frequency: 'Trimestral', dueDate: sub(today, { weeks: 1 }), status: 'Completat', technician: 'Xavier' },
    { id: 'MT-C03', type: 'Preventiu', title: 'Manteniment 2A', vehicleId: findVehicleByOperatorAndIndex('op-08', 2).id, equipmentType: 'Baterías CPU', frequency: 'Bianual', dueDate: sub(today, { weeks: 3 }), status: 'Completat', technician: 'Miquel' },
    { id: 'MT-C04', type: 'Preventiu', title: 'Manteniment 1A', vehicleId: findVehicleByOperatorAndIndex('op-04', 2).id, equipmentType: 'Limpieza Validadora', frequency: 'Anual', dueDate: sub(today, { days: 5 }), status: 'Completat', technician: 'Josep' },
    { id: 'MT-C05', type: 'Preventiu', title: 'Manteniment 3M', vehicleId: findVehicleByOperatorAndIndex('op-11', 2).id, equipmentType: 'Placa conexiones', frequency: 'Trimestral', dueDate: sub(today, { months: 1 }), status: 'Completat', technician: 'Carles' },
    { id: 'MT-C06', type: 'Preventiu', title: 'Manteniment 1A', vehicleId: findVehicleByOperatorAndIndex('op-03', 2).id, equipmentType: 'Soporte y Barras', frequency: 'Anual', dueDate: sub(today, { weeks: 2 }), status: 'Completat', technician: 'David' },
    { id: 'MT-C07', type: 'Preventiu', title: 'Manteniment 2A', vehicleId: findVehicleByOperatorAndIndex('op-02', 5).id, equipmentType: 'Brida y Antena', frequency: 'Bianual', dueDate: sub(today, { months: 1, days: 1 }), status: 'Completat', technician: 'Bernat' },
    { id: 'MT-C08', type: 'Preventiu', title: 'Manteniment 3M', vehicleId: findVehicleByOperatorAndIndex('op-01', 5).id, equipmentType: 'Placa conexiones', frequency: 'Trimestral', dueDate: sub(today, { days: 10 }), status: 'Completat', technician: 'Quim' },
    { id: 'MT-C09', type: 'Preventiu', title: 'Manteniment 1A', vehicleId: findVehicleByOperatorAndIndex('op-06', 2).id, equipmentType: 'Soporte y Barras', frequency: 'Anual', dueDate: sub(today, { weeks: 1 }), status: 'Completat', technician: 'Toni' },
    { id: 'MT-C10', type: 'Preventiu', title: 'Manteniment 2A', vehicleId: findVehicleByOperatorAndIndex('op-09', 2).id, equipmentType: 'Antena', frequency: 'Bianual', dueDate: sub(today, { weeks: 6 }), status: 'Completat', technician: 'Ramon' },
];

export const mockIncidents: Incident[] = [
    // VENCIDAS (Rojas) - Abiertas
    { id: 'AV-001', vehicleId: findVehicleByOperatorAndIndex('op-01', 0).id, issue: 'Pantalla pupitre completament negra', reportedBy: 'Conductor', assignedTo: 'Jordi', status: 'Obert', reportedAt: new Date('2026-01-10T10:00:00'), slaDays: 3, priority: 'Crítica', equipmentType: 'Pupitre' },
    { id: 'AV-002', vehicleId: findVehicleByOperatorAndIndex('op-02', 0).id, issue: 'Sistema no arrenca després de reinici', reportedBy: 'Conductor', assignedTo: 'Marc', status: 'Obert', reportedAt: new Date('2026-01-11T12:00:00'), slaDays: 3, priority: 'Alta', equipmentType: 'Pupitre' },
    { id: 'AV-003', vehicleId: findVehicleByOperatorAndIndex('op-03', 0).id, issue: 'Validadora INDRA sense resposta', reportedBy: 'Sistema', assignedTo: 'Pau', status: 'Obert', reportedAt: new Date('2026-01-09T08:00:00'), slaDays: 3, priority: 'Crítica', equipmentType: 'Validadora INDRA' },
    
    // URGENTES (Naranjas) - Abiertas
    { id: 'AV-004', vehicleId: findVehicleByOperatorAndIndex('op-10', 0).id, issue: 'Impressora de tiquets embussada', reportedBy: 'Conductor', assignedTo: 'Oriol', status: 'Obert', reportedAt: new Date('2026-01-12T19:00:00'), slaDays: 3, priority: 'Alta', equipmentType: 'Material auxiliar' },
    { id: 'AV-005', vehicleId: findVehicleByOperatorAndIndex('op-07', 0).id, issue: 'Cable d\'antena solt', reportedBy: 'Tècnic', assignedTo: 'Xavier', status: 'Obert', reportedAt: new Date('2026-01-12T21:00:00'), slaDays: 3, priority: 'Mitjana', equipmentType: 'Antena' },

    // ABIERTAS NORMALES
    { id: 'AV-006', vehicleId: findVehicleByOperatorAndIndex('op-08', 0).id, issue: 'Lectura lenta de targetes', reportedBy: 'Conductor', assignedTo: 'Miquel', status: 'Obert', reportedAt: new Date('2026-01-14T09:00:00'), slaDays: 3, priority: 'Mitjana', equipmentType: 'Validadora Inetum' },
    { id: 'AV-008', vehicleId: findVehicleByOperatorAndIndex('op-04', 0).id, issue: 'Error E041 a la validadora', reportedBy: 'Sistema', assignedTo: 'Carles', status: 'Obert', reportedAt: new Date('2026-01-13T22:30:00'), slaDays: 3, priority: 'Alta', equipmentType: 'Validadora INDRA' },

    // EN PROGRESO
    { id: 'AV-007', vehicleId: findVehicleByOperatorAndIndex('op-05', 0).id, issue: 'Llum LED intermitent', reportedBy: 'Tècnic', assignedTo: 'Josep', status: 'En Progrés', reportedAt: new Date('2026-01-13T10:00:00'), slaDays: 3, priority: 'Baixa', equipmentType: 'Material auxiliar' },
    { id: 'AV-009', vehicleId: findVehicleByOperatorAndIndex('op-09', 0).id, issue: 'So de validació baix', reportedBy: 'Conductor', assignedTo: 'David', status: 'En Progrés', reportedAt: new Date('2026-01-15T11:00:00'), slaDays: 3, priority: 'Mitjana', equipmentType: 'Validadora Inetum' },
    
    // RESUELTAS
    { id: 'AV-010', vehicleId: findVehicleByOperatorAndIndex('op-11', 0).id, issue: 'Pantalla amb píxels morts', reportedBy: 'Tècnic', assignedTo: 'Bernat', status: 'Resolt', reportedAt: new Date('2026-01-11T16:00:00'), slaDays: 3, priority: 'Baixa', equipmentType: 'Terminal de consulta INDRA' },
];


export const mockInventory: InventoryItem[] = [
  // Material específico SERMETRA (con trazabilidad)
  {
    id: 'INV-101', name: 'Pupitre Conductor v2.1', sku: 'PUP-V2.1-SRM',
    category: 'Material específic SERMETRA', stock: 5, minStock: 2,
    location: 'Magatzem Central (Cornellà)', value: 1200, serialNumber: 'SRM-PUP-0101'
  },
  {
    id: 'INV-102', name: 'Validadora Inetum v4', sku: 'VAL-INE-V4-SRM',
    category: 'Material específic SERMETRA', stock: 1, minStock: 5,
    location: 'Magatzem Central (Cornellà)', value: 850, serialNumber: 'SRM-VAL-2305'
  },
  {
    id: 'INV-103', name: 'Pupitre Conductor v2.1', sku: 'PUP-V2.1-SRM',
    category: 'Material específic SERMETRA', stock: 1, minStock: 0,
    location: 'Assignat', value: 1200, serialNumber: 'SRM-PUP-0089', assignedTo: mockVehicles[0].uniqueId
  },
   {
    id: 'INV-104', name: 'Pupitre Conductor v2.1', sku: 'PUP-V2.1-SRM',
    category: 'Material específic SERMETRA', stock: 1, minStock: 2,
    location: 'Magatzem Central (Cornellà)', value: 1200, serialNumber: 'SRM-PUP-0102'
  },
   {
    id: 'INV-105', name: 'Validadora INDRA v3', sku: 'VAL-IND-V3-SRM',
    category: 'Material específic SERMETRA', stock: 3, minStock: 2,
    location: 'Magatzem Central (Cornellà)', value: 800, serialNumber: 'SRM-VAL-IND-3001'
  },
   {
    id: 'INV-106', name: 'Validadora INDRA v3', sku: 'VAL-IND-V3-SRM',
    category: 'Material específic SERMETRA', stock: 3, minStock: 2,
    location: 'Magatzem Central (Cornellà)', value: 800, serialNumber: 'SRM-VAL-IND-3002'
  },

  // Material de adquisición libre (controlado por bolsa)
  {
    id: 'INV-201', name: 'Antena 4G/GPS', sku: 'ANT-4G-GPS-GEN',
    category: 'Material de adquisició lliure', stock: 12, minStock: 10,
    location: 'Magatzem Central (Cornellà)', value: 75
  },
  {
    id: 'INV-202', name: 'Switch Ethernet 8-port', sku: 'SW-ETH-8P-RGD',
    category: 'Material de adquisició lliure', stock: 8, minStock: 5,
    location: 'Magatzem Op. TUS', value: 150
  },
  {
    id: 'INV-203', name: 'Kit Connector HARTING', sku: 'CON-HAR-KIT',
    category: 'Material de adquisició lliure', stock: 2, minStock: 5,
    location: 'Magatzem Central (Cornellà)', value: 45
  },

  // Material genérico (consumibles)
  {
    id: 'INV-301', name: 'Rotlle Paper Tèrmic Pupitre', sku: 'PAP-PUP-58MM',
    category: 'Material genèric', stock: 250, minStock: 100,
    location: 'Magatzem Central (Cornellà)'
  },
  {
    id: 'INV-302', name: 'Fusible MiniATO 5A', sku: 'FUS-MATO-5A',
    category: 'Material genèric', stock: 450, minStock: 200,
    location: 'Magatzem Central (Cornellà)'
  },
  {
    id: 'INV-303', name: 'Brides de niló 20cm', sku: 'BRD-NYL-20CM-PK100',
    category: 'Material genèric', stock: 88, minStock: 50,
    location: 'Magatzem Op. JULIA'
  }
];


export const mockInstallations: Installation[] = [
    { id: 'INST-001', vehicleId: 'VEH-NUEVO-450', vehicleModel: 'Mercedes Citaro 3P', operatorId: 'op-01', scheduledDate: '25/01/2026', technician: 'Jordi', status: 'En Progrés', materials: ['Pupitre: SN-PUP-NEW-001', 'Validadoras: 2 unitats', 'Cablejat: Nou (carrosser)'] },
    { id: 'INST-002', vehicleId: 'VEH-NUEVO-451', vehicleModel: 'Solaris Urbino 12 Hybrid', operatorId: 'op-07', scheduledDate: '28/01/2026', technician: 'Pau', status: 'Programada', materials: ['Pupitre: SN-PUP-NEW-002', 'Validadoras: 3 unitats', 'Kit de connexió HARTING'] },
];

export const mockDecommissionings: Decommissioning[] = [
    { id: 'DECOM-001', vehicleId: 'VEH-BAJA-201', vehicleModel: 'Otokar Vectio LE', operatorId: 'op-02', reason: 'Fi de vida útil del vehicle', scheduledDate: '28/01/2026', status: 'Programada', materials: ['Pupitre: SN-PUP-JULIA-201', 'Validadoras: 3 unitats', 'Cablejat: NO recuperar'] },
];

export const mockTransfers: Transfer[] = [
    { id: 'TRANS-001', originVehicleId: 'VEH-ORIGEN-180', destinationVehicleId: 'VEH-DESTINO-480', originVehicleModel: 'Mercedes Citaro (2018)', destinationVehicleModel: 'Mercedes Citaro Hybrid', operatorId: 'op-08', status: 'Fase 1 OK', phase1_status: 'Completada', phase1_date: '15/12/2025', phase2_status: 'Programada', phase2_date: '02/02/2026' },
    { id: 'TRANS-002', originVehicleId: 'VEH-ORIGEN-190', destinationVehicleId: 'VEH-DESTINO-490', originVehicleModel: 'Otokar Vectio', destinationVehicleModel: 'Solaris Urbino', operatorId: 'op-04', status: 'Programada', phase1_status: 'Pendent', phase1_date: '27/01/2026', phase2_status: 'Pendent', phase2_date: '05/02/2026' },
];
    
export const mockDashboardData: DashboardData = {
    kpis: {
        slaCompliance: 98.2,
        criticalIncidents: 3,
        criticalStockItems: 2,
        totalVehicles: 2500,
    },
    maintenanceChartData: [
      { month: 'Ago', planned: 220, completed: 180 },
      { month: 'Set', planned: 210, completed: 190 },
      { month: 'Oct', planned: 250, completed: 230 },
      { month: 'Nov', planned: 240, completed: 240 },
      { month: 'Des', planned: 300, completed: 280 },
      { month: 'Gen', planned: 150, completed: 90 },
    ],
    operatorMetrics: mockOperators.slice(0, 5).map(op => ({
        operatorName: op.name,
        activeVehicles: Math.floor(Math.random() * 50) + 100,
        maintenanceVehicles: Math.floor(Math.random() * 10),
        slaCompliance: Math.floor(Math.random() * 6) + 94,
    }))
};

export const mockOperatorMetrics: OperatorMetrics[] = [
    {
        nombre: 'ALSINA GRAELLS',
        id: 'op-01',
        estado: 'Actiu',
        ubicacionPrincipal: 'Barcelona',
        vehiculosOperativos: 48,
        vehiculosTotal: 50,
        vehiculosMantenimiento: 2,
        vehiculosBaja: 0,
        equiposTMobilitat: 150,
        proximoMantenimiento: '2026-01-18T00:00:00.000Z',
        slaCorrectivos: 2.1,
        slaInstalaciones: 3.5,
        cumplimientoPreventivos: 98,
        calidadServicio: 'A',
        mantenimientosVencidos: 1,
        incidenciasAbiertas: 3,
        incidenciasEscaladas: 0,
        stockCritico: false,
    },
    {
        nombre: 'AUTOCARES JULIA',
        id: 'op-02',
        estado: 'Actiu',
        ubicacionPrincipal: 'Tarragona',
        vehiculosOperativos: 65,
        vehiculosTotal: 70,
        vehiculosMantenimiento: 5,
        vehiculosBaja: 0,
        equiposTMobilitat: 210,
        proximoMantenimiento: '2026-01-16T00:00:00.000Z',
        slaCorrectivos: 3.2,
        slaInstalaciones: 4.1,
        cumplimientoPreventivos: 85,
        calidadServicio: 'C',
        mantenimientosVencidos: 5,
        incidenciasAbiertas: 8,
        incidenciasEscaladas: 2,
        stockCritico: true,
    },
    {
        nombre: 'AUTOCARS DEL PENEDÈS',
        id: 'op-03',
        estado: 'Actiu',
        ubicacionPrincipal: 'Girona',
        vehiculosOperativos: 28,
        vehiculosTotal: 30,
        vehiculosMantenimiento: 1,
        vehiculosBaja: 1,
        equiposTMobilitat: 90,
        proximoMantenimiento: '2026-01-25T00:00:00.000Z',
        slaCorrectivos: 2.8,
        slaInstalaciones: 3.9,
        cumplimientoPreventivos: 92,
        calidadServicio: 'B',
        mantenimientosVencidos: 2,
        incidenciasAbiertas: 4,
        incidenciasEscaladas: 1,
        stockCritico: false,
    },
    {
        nombre: 'AUTOCARS R. FONT',
        id: 'op-05',
        estado: 'Inactiu',
        ubicacionPrincipal: 'Lleida',
        vehiculosOperativos: 0,
        vehiculosTotal: 15,
        vehiculosMantenimiento: 0,
        vehiculosBaja: 15,
        equiposTMobilitat: 0,
        proximoMantenimiento: new Date().toISOString(),
        slaCorrectivos: 0,
        slaInstalaciones: 0,
        cumplimientoPreventivos: 100,
        calidadServicio: 'A',
        mantenimientosVencidos: 0,
        incidenciasAbiertas: 0,
        incidenciasEscaladas: 0,
        stockCritico: false,
    },
    {
        nombre: 'TUS, SCCL',
        id: 'op-11',
        estado: 'Actiu',
        ubicacionPrincipal: 'Barcelona',
        vehiculosOperativos: 150,
        vehiculosTotal: 160,
        vehiculosMantenimiento: 8,
        vehiculosBaja: 2,
        equiposTMobilitat: 480,
        proximoMantenimiento: '2026-02-01T00:00:00.000Z',
        slaCorrectivos: 1.8,
        slaInstalaciones: 2.5,
        cumplimientoPreventivos: 99,
        calidadServicio: 'A',
        mantenimientosVencidos: 0,
        incidenciasAbiertas: 1,
        incidenciasEscaladas: 0,
        stockCritico: false,
    }
];
