
import type { Vehicle, Equipment, MaintenanceTask, Incident, InventoryItem, User, EquipmentType, Operator, Installation, Decommissioning, Transfer, DashboardData, OperatorMetrics } from '@/lib/types';
import { add, sub, set } from 'date-fns';

export const mockOperators: Operator[] = [
    // Independientes (sin grupo)
    { id: 'op-01', name: 'ALSINA GRAELLS DE AUTO TRANSPORTES, SA', status: 'Actiu', grupo: 'Independiente', vehiculosContrato: 60 },
    { id: 'op-02', name: 'AUTOCARES JULIÀ, SL', status: 'Actiu', grupo: 'Independiente', vehiculosContrato: 3 },
    { id: 'op-03', name: 'AUTOCARS DEL PENEDÈS, SA', status: 'Actiu', grupo: 'Independiente', vehiculosContrato: 3 },
    { id: 'op-04', name: 'AUTOCARS PRAT, SA', status: 'Actiu', grupo: 'Independiente', vehiculosContrato: 4 },
    { id: 'op-05', name: 'AUTOCARS R. FONT, SAU', status: 'Actiu', grupo: 'Independiente', vehiculosContrato: 36 },
    { id: 'op-06', name: 'AUTOCARS VENDRELL, SL', status: 'Actiu', grupo: 'Independiente', vehiculosContrato: 19 },
    { id: 'op-07', name: 'AUTOCORB, SA', status: 'Actiu', grupo: 'Independiente', vehiculosContrato: 25 },
    { id: 'op-08', name: 'BUS CASTELLVI, SA', status: 'Actiu', grupo: 'Independiente', vehiculosContrato: 8 },
    { id: 'op-09', name: 'LA HISPANO DE FUENTE EN SEGURES SA', status: 'Actiu', grupo: 'Independiente', vehiculosContrato: 6 },
    { id: 'op-10', name: 'HISPANO LLACUNENSE, SL', status: 'Actiu', grupo: 'Independiente', vehiculosContrato: 26 },
    { id: 'op-11', name: 'MONTFERRI HERMANOS, SL', status: 'Actiu', grupo: 'Independiente', vehiculosContrato: 14 },
    { id: 'op-12', name: 'TRANSPORTS MIR', status: 'Actiu', grupo: 'Independiente', vehiculosContrato: 14 },
    { id: 'op-13', name: 'TUS, SCCL', status: 'Actiu', grupo: 'Independiente', vehiculosContrato: 70 },
    
    // Grupo Avanza
    { id: 'op-14', name: 'UTE BAIX LLOBREGAT', status: 'Actiu', grupo: 'Avanza', vehiculosContrato: 205 },
    { id: 'op-15', name: 'CTSA-Mataró Bus', status: 'Actiu', grupo: 'Avanza', vehiculosContrato: 30 },
    { id: 'op-16', name: 'RubíBus CTSL', status: 'Actiu', grupo: 'Avanza', vehiculosContrato: 22 },
    { id: 'op-17', name: 'TMESA', status: 'Actiu', grupo: 'Avanza', vehiculosContrato: 71 },
    
    // Grupo Direxis
    { id: 'op-18', name: 'MASATS TRANSPORTS GENERALS, SA', status: 'Actiu', grupo: 'Direxis', vehiculosContrato: 24 },
    { id: 'op-19', name: 'TRANSPORTES GENERALES DE OLESA, SA', status: 'Actiu', grupo: 'Direxis', vehiculosContrato: 38 },
    { id: 'op-20', name: 'TUSGSAL', status: 'Actiu', grupo: 'Direxis', vehiculosContrato: 346 },
    
    // Grupo Empresa Plana
    { id: 'op-21', name: 'CINTOI BUS, SL', status: 'Actiu', grupo: 'Empresa Plana', vehiculosContrato: 85 },
    { id: 'op-22', name: 'EMPRESA PLANA, SL', status: 'Actiu', grupo: 'Empresa Plana', vehiculosContrato: 27 },
    
    // Grupo Monbus
    { id: 'op-23', name: 'UTE HORTA I GRÀCIA', status: 'Actiu', grupo: 'Monbus', vehiculosContrato: 15 },
    { id: 'op-24', name: 'LA HISPANO IGUALADINA, SL', status: 'Actiu', grupo: 'Monbus', vehiculosContrato: 121 },
    { id: 'op-25', name: 'UTE Port', status: 'Actiu', grupo: 'Monbus', vehiculosContrato: 15 },
    { id: 'op-26', name: 'UTE SANT BOI, BARCELONA Y OTROS', status: 'Actiu', grupo: 'Monbus', vehiculosContrato: 96 },
    
    // Grupo Moventia
    { id: 'op-27', name: 'EMPRESA CASAS, SA', status: 'Actiu', grupo: 'Moventia', vehiculosContrato: 74 },
    { id: 'op-28', name: 'MARFINA BUS, SA - LA VALLESANA, SA', status: 'Actiu', grupo: 'Moventia', vehiculosContrato: 140 },
    { id: 'op-29', name: 'MOVENTIA L\'HOSPITALET', status: 'Actiu', grupo: 'Moventia', vehiculosContrato: 117 },
    { id: 'op-30', name: 'TRANSPORTS CIUTAT COMTAL, SA', status: 'Actiu', grupo: 'Moventia', vehiculosContrato: 25 },
    { id: 'op-31', name: 'TRANSPORTS PUJOL I PUJOL', status: 'Actiu', grupo: 'Moventia', vehiculosContrato: 5 },
    
    // Grupo Sagalés
    { id: 'op-32', name: 'OSONA BUS, SA', status: 'Actiu', grupo: 'Sagalés', vehiculosContrato: 72 },
    { id: 'op-33', name: 'BARCELONA BUS, SL', status: 'Actiu', grupo: 'Sagalés', vehiculosContrato: 86 },
    { id: 'op-34', name: 'CINGLES BUS, SA', status: 'Actiu', grupo: 'Sagalés', vehiculosContrato: 34 },
    { id: 'op-35', name: 'EMPRESA SAGALÉS, SA', status: 'Actiu', grupo: 'Sagalés', vehiculosContrato: 95 },
    { id: 'op-36', name: 'FERROCARRILES Y TRANSPORTES, SA', status: 'Actiu', grupo: 'Sagalés', vehiculosContrato: 74 },
    { id: 'op-37', name: 'MANRESA BUS, SA', status: 'Actiu', grupo: 'Sagalés', vehiculosContrato: 21 },
    { id: 'op-38', name: 'BAGES BUS, SA', status: 'Actiu', grupo: 'Sagalés', vehiculosContrato: 55 },
    
    // Grupo Soler i Sauret
    { id: 'op-39', name: 'UTE VALLDOREIX', status: 'Actiu', grupo: 'Soler i Sauret', vehiculosContrato: 5 },
    { id: 'op-40', name: 'SOLER Y SAURET, SA', status: 'Actiu', grupo: 'Soler i Sauret', vehiculosContrato: 109 },
    
    // Grupo TEISA
    { id: 'op-41', name: 'TEISA', status: 'Actiu', grupo: 'TEISA', vehiculosContrato: 36 },
    { id: 'op-42', name: 'HISPANO HILARIENCA, SAU', status: 'Actiu', grupo: 'TEISA', vehiculosContrato: 22 },
];

// Credenciales demo para login (en producción esto iría en backend)
export const demoCredentials: { [email: string]: { password: string; userId: string } } = {
    'juan@busembarcat.cat': { password: 'Consorcio2025*', userId: 'user-001' },
    'sermetra@busembarcat.cat': { password: 'Sermetra2025*', userId: 'user-003' },
};

export const mockUsers: User[] = [
    { id: 'user-001', name: 'Juan García', email: 'juan@busembarcat.cat', role: 'Administrador' },
    { id: 'user-002', name: 'Usuari Operador', email: 'operator@busembacat.com', role: 'Operador', operatorId: 'op-01' },
    { id: 'user-003', name: 'Sermetra Operacions', email: 'sermetra@busembarcat.cat', role: 'Sermetra' },
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
  createEquipment('Pupitre', undefined, null, 'En Stock', 'PUP-100', 'Magatzem Central (Cornellà)');
  createEquipment('Validadora INDRA', undefined, null, 'Requereix Reparació', 'IND-100', 'Taller Reparacions');
  createEquipment('Validadora Inetum', undefined, null, 'En Stock', 'INE-100', 'Magatzem Operador 2');
  createEquipment('Terminal de consulta INDRA', undefined, null, 'En Stock', 'CON-100', 'Magatzem Central (Cornellà)');
  
  // Create all subtypes of Material auxiliar
  createEquipment('Material auxiliar', 'MMC', mockVehicles[4], 'Operatiu', 'MMC-002');
  createEquipment('Material auxiliar', 'Placa de conexión', null, 'En Stock', 'PLC-101', 'Magatzem Central (Cornellà)');
  createEquipment('Material auxiliar', 'Soporte', mockVehicles[5], 'Requereix Reparació', 'SOP-001');
  createEquipment('Material auxiliar', 'Antena', null, 'En Stock', 'ANT-101', 'Magatzem Operador 1');
  createEquipment('Material auxiliar', 'Cambio de IP', mockVehicles[6], 'Operatiu', 'CIP-001');
  createEquipment('Material auxiliar', 'Kit de conexión HARTING', null, 'En Stock', 'HAR-101', 'Magatzem Central (Cornellà)');
  createEquipment('Material auxiliar', 'Cable de conexión', mockVehicles[7], 'Operatiu', 'CAB-001');
  createEquipment('Material auxiliar', 'Conector', null, 'Requereix Reparació', 'CON-102', 'Taller Reparacions');
  createEquipment('Material auxiliar', 'Fusible', mockVehicles[8], 'Operatiu', 'FUS-001');
  createEquipment('Material auxiliar', 'Perno', null, 'En Stock', 'PER-101', 'Magatzem Central (Cornellà)');
  createEquipment('Material auxiliar', 'Tanque', mockVehicles[9], 'Operatiu', 'TAN-001');
  createEquipment('Material auxiliar', 'Brida', null, 'En Stock', 'BRI-101', 'Magatzem Central (Cornellà)');
  createEquipment('Material auxiliar', 'Travesaño', mockVehicles[10], 'Operatiu', 'TRA-001');
  createEquipment('Material auxiliar', 'Barra', null, 'En Stock', 'BAR-101', 'Magatzem Central (Cornellà)');

  return equipmentList;
};

export const mockEquipment: Equipment[] = generateEquipment();

const today = new Date('2026-01-15T15:00:00'); // Consistent date for mocks

const technicians = ['Jordi', 'Pau', 'Marc', 'Oriol', 'Xavier', 'Miquel', 'Josep', 'Carles', 'David', 'Bernat', 'Quim', 'Toni', 'Ramon', 'Ferran', 'Albert'];
const validOperatorIds = ['op-01', 'op-02', 'op-03', 'op-05', 'op-11'];
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const findVehicleByOperatorAndIndex = (operatorId: string, index: number): Vehicle => {
    const operatorVehicles = mockVehicles.filter(v => v.operatorId === operatorId);
    if (operatorVehicles.length === 0) {
        // Fallback for operators with no vehicles in the list.
        const fallbackVehicles = mockVehicles.filter(v => v.operatorId === 'op-01');
        return fallbackVehicles[index % fallbackVehicles.length];
    }
    return operatorVehicles[index % operatorVehicles.length];
}

const activeInterventionTitles = [
    "Validadora no comunica",
    "Pupitre no s'encén",
    "Impressora no imprimeix tiquets",
    "Curtcircuit en cablejat",
    "Sistema KO",
    "Validadora vandalitzada",
    "Pupitre sense cobertura",
    "Impressora no talla el paper",
    "Fallada en fusibles",
];


// #############################################################
// # 1. DATOS PARA INTERVENCIONES ACTIVAS (MANTENIMIENTO PREVENTIVO)
// #############################################################
const activeInterventions: MaintenanceTask[] = [
    // 5 "En Progrés"
    { id: 'MT-ACT-001', type: 'Preventiu', title: getRandomItem(activeInterventionTitles), vehicleId: findVehicleByOperatorAndIndex('op-01', 0).id, equipmentType: 'Bornes y Pupitre', frequency: 'Trimestral', dueDate: add(today, { days: 1 }), status: 'En Progrés', technician: 'Jordi', operatorId: 'op-01', startDate: sub(today, { hours: 2 }), estimatedEndDate: add(today, { hours: 2 }), priority: 'Normal', location: 'Taller 1' },
    { id: 'MT-ACT-002', type: 'Preventiu', title: getRandomItem(activeInterventionTitles), vehicleId: findVehicleByOperatorAndIndex('op-02', 0).id, equipmentType: 'Placa conexiones', frequency: 'Anual', dueDate: add(today, { days: 2 }), status: 'En Progrés', technician: 'Miquel', operatorId: 'op-02', startDate: sub(today, { hours: 4 }), estimatedEndDate: add(today, { hours: 4 }), priority: 'Normal', location: 'Taller 2' },
    { id: 'MT-ACT-003', type: 'Preventiu', title: getRandomItem(activeInterventionTitles), vehicleId: findVehicleByOperatorAndIndex('op-11', 0).id, equipmentType: 'Limpieza Validadora', frequency: 'Trimestral', dueDate: add(today, { days: 3 }), status: 'En Progrés', technician: 'Carles', operatorId: 'op-11', startDate: sub(today, { hours: 1 }), estimatedEndDate: add(today, { hours: 1 }), priority: 'Normal', location: 'Taller 1' },
    { id: 'MT-ACT-004', type: 'Preventiu', title: getRandomItem(activeInterventionTitles), vehicleId: findVehicleByOperatorAndIndex('op-03', 0).id, equipmentType: 'Soporte y Barras', frequency: 'Anual', dueDate: add(today, { days: 4 }), status: 'En Progrés', technician: 'David', operatorId: 'op-03', startDate: sub(today, { hours: 3 }), estimatedEndDate: add(today, { hours: 5 }), priority: 'Normal', location: 'Taller 3' },
    { id: 'MT-ACT-005', type: 'Preventiu', title: getRandomItem(activeInterventionTitles), vehicleId: findVehicleByOperatorAndIndex('op-01', 1).id, equipmentType: 'Baterías CPU', frequency: 'Bianual', dueDate: add(today, { days: 5 }), status: 'En Progrés', technician: 'Bernat', operatorId: 'op-01', startDate: sub(today, { hours: 5 }), estimatedEndDate: add(today, { hours: 3 }), priority: 'Normal', location: 'Taller 2' },
    
    // 4 "Assignat"
    { id: 'MT-ASG-001', type: 'Preventiu', title: getRandomItem(activeInterventionTitles), vehicleId: findVehicleByOperatorAndIndex('op-05', 0).id, equipmentType: 'Antena', frequency: 'Anual', dueDate: add(today, { days: 1 }), status: 'Assignat', technician: 'Pau', operatorId: 'op-05', startDate: set(today, { hours: 9, minutes: 0, seconds: 0 }), estimatedEndDate: set(today, { hours: 17, minutes: 0, seconds: 0 }), priority: 'Alta', location: 'Taller 1' },
    { id: 'MT-ASG-002', type: 'Preventiu', title: getRandomItem(activeInterventionTitles), vehicleId: findVehicleByOperatorAndIndex('op-02', 1).id, equipmentType: 'Pupitre', frequency: 'Mensual', dueDate: add(today, { days: 2 }), status: 'Assignat', technician: 'Toni', operatorId: 'op-02', startDate: add(today, { days: 1 }), estimatedEndDate: add(today, { days: 1, hours: 4 }), priority: 'Normal', location: 'Taller 3' },
    { id: 'MT-ASG-003', type: 'Preventiu', title: getRandomItem(activeInterventionTitles), vehicleId: findVehicleByOperatorAndIndex('op-11', 1).id, equipmentType: 'Todos', frequency: 'Semestral', dueDate: add(today, { days: 3 }), status: 'Assignat', technician: 'Ferran', operatorId: 'op-11', startDate: add(today, { days: 2 }), estimatedEndDate: add(today, { days: 2, hours: 8 }), priority: 'Normal', location: 'Taller 2' },
    { id: 'MT-ASG-004', type: 'Preventiu', title: getRandomItem(activeInterventionTitles), vehicleId: findVehicleByOperatorAndIndex('op-01', 2).id, equipmentType: 'Validadora INDRA', frequency: 'Trimestral', dueDate: add(today, { days: 4 }), status: 'Assignat', technician: 'Ramon', operatorId: 'op-01', startDate: add(today, { days: 3 }), estimatedEndDate: add(today, { days: 3, hours: 2 }), priority: 'Baixa', location: 'Taller 1' },

    // 3 "Pendent" (en flota)
    { id: 'MT-PND-001', type: 'Preventiu', title: getRandomItem(activeInterventionTitles), vehicleId: findVehicleByOperatorAndIndex('op-03', 1).id, equipmentType: 'Placa conexiones', frequency: 'Trimestral', dueDate: add(today, { days: 5 }), status: 'Pendent', technician: undefined, operatorId: 'op-03', priority: 'Normal', location: 'En Ruta' },
    { id: 'MT-PND-002', type: 'Preventiu', title: getRandomItem(activeInterventionTitles), vehicleId: findVehicleByOperatorAndIndex('op-02', 2).id, equipmentType: 'Limpieza Validadora', frequency: 'Mensual', dueDate: add(today, { days: 6 }), status: 'Pendent', technician: undefined, operatorId: 'op-02', priority: 'Normal', location: 'En Ruta' },
    { id: 'MT-PND-003', type: 'Preventiu', title: getRandomItem(activeInterventionTitles), vehicleId: findVehicleByOperatorAndIndex('op-11', 2).id, equipmentType: 'Todos', frequency: 'Anual', dueDate: add(today, { days: 7 }), status: 'Pendent', technician: undefined, operatorId: 'op-11', priority: 'Alta', location: 'En Ruta' },
    
    // 3 "Retardat"
    { id: 'MT-RTD-001', type: 'Preventiu', title: getRandomItem(activeInterventionTitles), vehicleId: findVehicleByOperatorAndIndex('op-05', 1).id, equipmentType: 'Antena', frequency: 'Semestral', dueDate: sub(today, { days: 1 }), status: 'Retardat', technician: 'Josep', operatorId: 'op-05', startDate: sub(today, { days: 1, hours: 4 }), estimatedEndDate: sub(today, { hours: -4 }), priority: 'Alta', location: 'Taller 2' },
    { id: 'MT-RTD-002', type: 'Preventiu', title: getRandomItem(activeInterventionTitles), vehicleId: findVehicleByOperatorAndIndex('op-01', 3).id, equipmentType: 'Baterías CPU', frequency: 'Bianual', dueDate: today, status: 'Retardat', technician: 'Marc', operatorId: 'op-01', startDate: sub(today, { hours: 6 }), estimatedEndDate: sub(today, { hours: 1 }), priority: 'Alta', location: 'Taller 1' },
    { id: 'MT-RTD-003', type: 'Preventiu', title: getRandomItem(activeInterventionTitles), vehicleId: findVehicleByOperatorAndIndex('op-03', 2).id, equipmentType: 'Todos', frequency: 'Anual', dueDate: sub(today, { days: 2 }), status: 'Retardat', technician: 'Oriol', operatorId: 'op-03', startDate: sub(today, { days: 2, hours: 8 }), estimatedEndDate: sub(today, { days: 1 }), priority: 'Alta', location: 'Taller 3' },
];


// #############################################################
// # 2. DATOS PARA CONTROL DE VENCIMIENTOS
// #############################################################

const dueTasks: MaintenanceTask[] = [
    // 2 VENCIDOS
    { id: 'MT-VNC-001', type: 'Preventiu', title: 'Manteniment General del Pupitre', vehicleId: findVehicleByOperatorAndIndex('op-01', 4).id, equipmentType: 'Pupitre', frequency: 'Mensual', dueDate: sub(today, { days: 3 }), status: 'Vençut', operatorId: 'op-01', lastMaintenanceDate: sub(today, { days: 33 }), km: 125000 },
    { id: 'MT-VNC-002', type: 'Preventiu', title: 'Manteniment del Sistema de Validació', vehicleId: findVehicleByOperatorAndIndex('op-11', 3).id, equipmentType: 'Placa conexiones', frequency: 'Trimestral', dueDate: sub(today, { days: 8 }), status: 'Vençut', operatorId: 'op-11', lastMaintenanceDate: sub(today, { days: 98 }), km: 85000 },
    
    // 8 Mensuales (vencen en 1-15 días)
    ...Array.from({ length: 8 }, (_, i) => {
        const opId = getRandomItem(validOperatorIds);
        return {
            id: `MT-MNS-${i+1}`, type: 'Preventiu' as const, title: 'Manteniment General del Pupitre' as const, vehicleId: findVehicleByOperatorAndIndex(opId, i).id, equipmentType: 'Limpieza Validadora' as EquipmentType, frequency: 'Mensual' as const, 
            dueDate: add(today, { days: i + 2 }), status: 'Pendent' as const, operatorId: opId, lastMaintenanceDate: sub(today, { days: 28 - i }), km: 50000 + i * 1000
        }
    }),

    // 6 Trimestrales (vencen en 15-30 días)
    ...Array.from({ length: 6 }, (_, i) => {
        const opId = getRandomItem(validOperatorIds);
        return {
            id: `MT-TRS-${i+1}`, type: 'Preventiu' as const, title: "Manteniment del Sistema d'Informació a l'Usuari (Panells)" as const, vehicleId: findVehicleByOperatorAndIndex(opId, 8 + i).id, equipmentType: 'Soporte y Barras' as EquipmentType, frequency: 'Trimestral' as const,
            dueDate: add(today, { days: 15 + i*2 }), status: 'Pendent' as const, operatorId: opId, lastMaintenanceDate: sub(today, { days: 75 - i*2 }), km: 70000 + i * 2000
        }
    }),

    // 4 Semestrales (vencen en 30-60 días)
    ...Array.from({ length: 4 }, (_, i) => {
        const opId = getRandomItem(validOperatorIds);
        return {
            id: `MT-SMS-${i+1}`, type: 'Preventiu' as const, title: 'Manteniment del Sistema de Comunicacions' as const, vehicleId: findVehicleByOperatorAndIndex(opId, 14 + i).id, equipmentType: 'Antena' as EquipmentType, frequency: 'Semestral' as const,
            dueDate: add(today, { days: 30 + i*5 }), status: 'Pendent' as const, operatorId: opId, lastMaintenanceDate: sub(today, { days: 150 - i*5 }), km: 90000 + i * 5000
        }
    }),
];

// #############################################################
// # 3. DATOS PARA HISTORIAL
// #############################################################
const completedTasks: MaintenanceTask[] = [
    { id: 'MT-C01', type: 'Preventiu', title: "Sistema KO", vehicleId: findVehicleByOperatorAndIndex('op-01', 0).id, equipmentType: 'Pupitre', frequency: 'Mensual', dueDate: sub(today, { days: 32 }), status: 'Completat', technician: 'Jordi' },
    { id: 'MT-C02', type: 'Preventiu', title: "Validadora no comunica", vehicleId: findVehicleByOperatorAndIndex('op-02', 1).id, equipmentType: 'Limpieza Validadora', frequency: 'Trimestral', dueDate: sub(today, { days: 80 }), status: 'Completat', technician: 'Miquel' },
    { id: 'MT-C03', type: 'Preventiu', title: "Pupitre no s'encén", vehicleId: findVehicleByOperatorAndIndex('op-03', 1).id, equipmentType: 'Todos', frequency: 'Anual', dueDate: sub(today, { months: 11 }), status: 'Completat', technician: 'Pau' },
    { id: 'MT-C04', type: 'Preventiu', title: "Impressora no imprimeix", vehicleId: findVehicleByOperatorAndIndex('op-11', 1).id, equipmentType: 'Antena', frequency: 'Semestral', dueDate: sub(today, { months: 5 }), status: 'Completat', technician: 'Carles' },
    { id: 'MT-C05', type: 'Preventiu', title: "Curtcircuit de cablejat", vehicleId: findVehicleByOperatorAndIndex('op-05', 0).id, equipmentType: 'Baterías CPU', frequency: 'Bianual', dueDate: sub(today, { months: 2 }), status: 'Completat', technician: 'Oriol' },
    { id: 'MT-C06', type: 'Preventiu', title: "Validadora vandalitzada", vehicleId: findVehicleByOperatorAndIndex('op-03', 2).id, equipmentType: 'Soporte y Barras', frequency: 'Anual', dueDate: sub(today, { weeks: 2 }), status: 'Completat', technician: 'David' },
    { id: 'MT-C07', type: 'Preventiu', title: "Pupitre sense cobertura", vehicleId: findVehicleByOperatorAndIndex('op-02', 5).id, equipmentType: 'Brida y Antena', frequency: 'Bianual', dueDate: sub(today, { months: 1, days: 1 }), status: 'Completat', technician: 'Bernat' },
    { id: 'MT-C08', type: 'Preventiu', title: "Impressora no talla tiquets", vehicleId: findVehicleByOperatorAndIndex('op-01', 5).id, equipmentType: 'Placa conexiones', frequency: 'Trimestral', dueDate: sub(today, { days: 10 }), status: 'Completat', technician: 'Quim' },
    { id: 'MT-C09', type: 'Preventiu', title: "Fallada en fusibles", vehicleId: findVehicleByOperatorAndIndex('op-06', 2).id, equipmentType: 'Soporte y Barras', frequency: 'Anual', dueDate: sub(today, { weeks: 1 }), status: 'Completat', technician: 'Toni' },
    { id: 'MT-C10', type: 'Preventiu', title: "Validadora no s'encén", vehicleId: findVehicleByOperatorAndIndex('op-09', 2).id, equipmentType: 'Antena', frequency: 'Bianual', dueDate: sub(today, { weeks: 6 }), status: 'Completat', technician: 'Ramon' },
];

export const mockTasks: MaintenanceTask[] = [...activeInterventions, ...dueTasks, ...completedTasks];


// #############################################################
// # 4. DATOS PARA AVERÍAS (CORRECTIVO)
// #############################################################
export const mockIncidents: Incident[] = [
    { id: 'AV-001', vehicleId: '6916-HCR', issue: "Validadora no comunica", priority: 'Crítica', status: 'Obert', assignedTo: null, operatorId: 'op-01', reportedAt: sub(today, { hours: 2 }), slaDays: 1, equipmentType: 'Todos', location: 'Taller 1' },
    { id: 'AV-002', vehicleId: '7001-HCR', issue: "Pupitre no s'encén", priority: 'Crítica', status: 'Obert', assignedTo: null, operatorId: 'op-02', reportedAt: sub(today, { hours: 4 }), slaDays: 1, equipmentType: 'Pupitre', location: 'Taller 2' },
    { id: 'AV-003', vehicleId: '0816-NDV', issue: "Impressora no imprimeix", priority: 'Alta', status: 'Obert', assignedTo: null, operatorId: 'op-11', reportedAt: sub(today, { hours: 8 }), slaDays: 1, equipmentType: 'Validadora INDRA', location: 'Taller 1' },
    { id: 'AV-004', vehicleId: '4602-JKD', issue: "Curtcircuit de cablejat", priority: 'Alta', status: 'Obert', assignedTo: null, operatorId: 'op-03', reportedAt: sub(today, { hours: 10 }), slaDays: 2, equipmentType: 'Validadora Inetum', location: 'Taller 3' },
    { id: 'AV-005', vehicleId: '6917-HCR', issue: "Sistema KO", priority: 'Normal', status: 'Obert', assignedTo: null, operatorId: 'op-01', reportedAt: sub(today, { days: 1 }), slaDays: 3, equipmentType: 'Pupitre', location: 'En Ruta' },
    { id: 'AV-006', vehicleId: '5400-LFN', issue: "Validadora vandalitzada", priority: 'Normal', status: 'Obert', assignedTo: null, operatorId: 'op-05', reportedAt: sub(today, { days: 1, hours: 2 }), slaDays: 3, equipmentType: 'Validadora Inetum', location: 'En Ruta' },
    { id: 'AV-007', vehicleId: '7002-HCR', issue: "Pupitre sense cobertura", priority: 'Normal', status: 'Obert', assignedTo: null, operatorId: 'op-02', reportedAt: sub(today, { days: 1, hours: 5 }), slaDays: 2, equipmentType: 'Antena', location: 'Taller 2' },
    { id: 'AV-008', vehicleId: '3806-MBW', issue: 'Impressora no talla tiquets', priority: 'Normal', status: 'En Reparació', assignedTo: 'Jordi', operatorId: 'op-11', reportedAt: sub(today, { days: 2 }), slaDays: 4, equipmentType: 'Pupitre', location: 'Taller 1' },
    { id: 'AV-009', vehicleId: '3235-MCR', issue: 'Fallada en fusibles', priority: 'Baixa', status: 'En Reparació', assignedTo: 'Carles', operatorId: 'op-01', reportedAt: sub(today, { days: 2 }), slaDays: 5, equipmentType: 'Validadora INDRA', location: 'Taller 3' },
    { id: 'AV-010', vehicleId: '1399-MCY', issue: "Validadora no s'encén", priority: 'Alta', status: 'En Reparació', assignedTo: 'Pau', operatorId: 'op-03', reportedAt: sub(today, { days: 1 }), slaDays: 2, equipmentType: 'Validadora INDRA', location: 'Taller 2' },
    { id: 'AV-011', vehicleId: '7907-MNZ', issue: "El sistema no s'inicia (Sistema KO)", priority: 'Alta', status: 'Resolt', assignedTo: 'Miquel', operatorId: 'op-02', reportedAt: sub(today, { days: 3 }), slaDays: 2, equipmentType: 'Cablejat', location: 'Taller 2' },
    { id: 'AV-012', vehicleId: '0816-NDV', issue: "La validadora no s'encén", priority: 'Normal', status: 'Resolt', assignedTo: 'David', operatorId: 'op-09', reportedAt: sub(today, { days: 4 }), slaDays: 5, equipmentType: 'Validadora INDRA', location: 'Cotxera' },
];


export const mockInventory: InventoryItem[] = [
  // Material específico SERMETRA (amb traçabilitat)
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

  // Material d'adquisició lliure (controlat per bossa)
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

  // Material genèric (consumibles)
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
    // Independientes
    { nombre: 'ALSINA GRAELLS DE AUTO TRANSPORTES, SA', id: 'op-01', estado: 'Actiu', ubicacionPrincipal: 'Barcelona', vehiculosOperativos: 58, vehiculosTotal: 60, vehiculosMantenimiento: 2, vehiculosBaja: 0, equiposTMobilitat: 180, proximoMantenimiento: '2026-01-18T00:00:00.000Z', slaCorrectivos: 2.1, slaInstalaciones: 3.5, cumplimientoPreventivos: 98, calidadServicio: 'A', mantenimientosVencidos: 1, incidenciasAbiertas: 3, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'AUTOCARES JULIÀ, SL', id: 'op-02', estado: 'Actiu', ubicacionPrincipal: 'Barcelona', vehiculosOperativos: 3, vehiculosTotal: 3, vehiculosMantenimiento: 0, vehiculosBaja: 0, equiposTMobilitat: 9, proximoMantenimiento: '2026-01-20T00:00:00.000Z', slaCorrectivos: 1.5, slaInstalaciones: 2.8, cumplimientoPreventivos: 100, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 0, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'AUTOCARS DEL PENEDÈS, SA', id: 'op-03', estado: 'Actiu', ubicacionPrincipal: 'Vilafranca del Penedès', vehiculosOperativos: 3, vehiculosTotal: 3, vehiculosMantenimiento: 0, vehiculosBaja: 0, equiposTMobilitat: 9, proximoMantenimiento: '2026-01-22T00:00:00.000Z', slaCorrectivos: 2.0, slaInstalaciones: 3.2, cumplimientoPreventivos: 100, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 0, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'AUTOCARS PRAT, SA', id: 'op-04', estado: 'Actiu', ubicacionPrincipal: 'El Prat de Llobregat', vehiculosOperativos: 4, vehiculosTotal: 4, vehiculosMantenimiento: 0, vehiculosBaja: 0, equiposTMobilitat: 12, proximoMantenimiento: '2026-01-25T00:00:00.000Z', slaCorrectivos: 1.8, slaInstalaciones: 3.0, cumplimientoPreventivos: 100, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 0, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'AUTOCARS R. FONT, SAU', id: 'op-05', estado: 'Actiu', ubicacionPrincipal: 'Lleida', vehiculosOperativos: 34, vehiculosTotal: 36, vehiculosMantenimiento: 2, vehiculosBaja: 0, equiposTMobilitat: 108, proximoMantenimiento: '2026-01-28T00:00:00.000Z', slaCorrectivos: 2.5, slaInstalaciones: 3.8, cumplimientoPreventivos: 94, calidadServicio: 'B', mantenimientosVencidos: 1, incidenciasAbiertas: 2, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'AUTOCARS VENDRELL, SL', id: 'op-06', estado: 'Actiu', ubicacionPrincipal: 'El Vendrell', vehiculosOperativos: 18, vehiculosTotal: 19, vehiculosMantenimiento: 1, vehiculosBaja: 0, equiposTMobilitat: 57, proximoMantenimiento: '2026-01-30T00:00:00.000Z', slaCorrectivos: 2.2, slaInstalaciones: 3.5, cumplimientoPreventivos: 96, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 1, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'AUTOCORB, SA', id: 'op-07', estado: 'Actiu', ubicacionPrincipal: 'Corbera de Llobregat', vehiculosOperativos: 24, vehiculosTotal: 25, vehiculosMantenimiento: 1, vehiculosBaja: 0, equiposTMobilitat: 75, proximoMantenimiento: '2026-02-01T00:00:00.000Z', slaCorrectivos: 2.0, slaInstalaciones: 3.2, cumplimientoPreventivos: 97, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 1, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'BUS CASTELLVI, SA', id: 'op-08', estado: 'Actiu', ubicacionPrincipal: 'Castellví de Rosanes', vehiculosOperativos: 8, vehiculosTotal: 8, vehiculosMantenimiento: 0, vehiculosBaja: 0, equiposTMobilitat: 24, proximoMantenimiento: '2026-02-05T00:00:00.000Z', slaCorrectivos: 1.5, slaInstalaciones: 2.5, cumplimientoPreventivos: 100, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 0, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'LA HISPANO DE FUENTE EN SEGURES SA', id: 'op-09', estado: 'Actiu', ubicacionPrincipal: 'Girona', vehiculosOperativos: 6, vehiculosTotal: 6, vehiculosMantenimiento: 0, vehiculosBaja: 0, equiposTMobilitat: 18, proximoMantenimiento: '2026-02-08T00:00:00.000Z', slaCorrectivos: 1.8, slaInstalaciones: 3.0, cumplimientoPreventivos: 100, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 0, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'HISPANO LLACUNENSE, SL', id: 'op-10', estado: 'Actiu', ubicacionPrincipal: 'Igualada', vehiculosOperativos: 25, vehiculosTotal: 26, vehiculosMantenimiento: 1, vehiculosBaja: 0, equiposTMobilitat: 78, proximoMantenimiento: '2026-02-10T00:00:00.000Z', slaCorrectivos: 2.3, slaInstalaciones: 3.6, cumplimientoPreventivos: 95, calidadServicio: 'A', mantenimientosVencidos: 1, incidenciasAbiertas: 2, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'MONTFERRI HERMANOS, SL', id: 'op-11', estado: 'Actiu', ubicacionPrincipal: 'Reus', vehiculosOperativos: 13, vehiculosTotal: 14, vehiculosMantenimiento: 1, vehiculosBaja: 0, equiposTMobilitat: 42, proximoMantenimiento: '2026-02-12T00:00:00.000Z', slaCorrectivos: 2.0, slaInstalaciones: 3.3, cumplimientoPreventivos: 98, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 1, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'TRANSPORTS MIR', id: 'op-12', estado: 'Actiu', ubicacionPrincipal: 'Girona', vehiculosOperativos: 13, vehiculosTotal: 14, vehiculosMantenimiento: 1, vehiculosBaja: 0, equiposTMobilitat: 42, proximoMantenimiento: '2026-02-15T00:00:00.000Z', slaCorrectivos: 2.1, slaInstalaciones: 3.4, cumplimientoPreventivos: 97, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 1, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'TUS, SCCL', id: 'op-13', estado: 'Actiu', ubicacionPrincipal: 'Sabadell', vehiculosOperativos: 68, vehiculosTotal: 70, vehiculosMantenimiento: 2, vehiculosBaja: 0, equiposTMobilitat: 210, proximoMantenimiento: '2026-01-16T00:00:00.000Z', slaCorrectivos: 1.8, slaInstalaciones: 2.5, cumplimientoPreventivos: 99, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 1, incidenciasEscaladas: 0, stockCritico: false },
    
    // Grupo Avanza
    { nombre: 'UTE BAIX LLOBREGAT', id: 'op-14', estado: 'Actiu', ubicacionPrincipal: 'Sant Boi de Llobregat', vehiculosOperativos: 198, vehiculosTotal: 205, vehiculosMantenimiento: 5, vehiculosBaja: 2, equiposTMobilitat: 615, proximoMantenimiento: '2026-01-14T00:00:00.000Z', slaCorrectivos: 2.5, slaInstalaciones: 3.8, cumplimientoPreventivos: 92, calidadServicio: 'B', mantenimientosVencidos: 3, incidenciasAbiertas: 8, incidenciasEscaladas: 1, stockCritico: false },
    { nombre: 'CTSA-Mataró Bus', id: 'op-15', estado: 'Actiu', ubicacionPrincipal: 'Mataró', vehiculosOperativos: 29, vehiculosTotal: 30, vehiculosMantenimiento: 1, vehiculosBaja: 0, equiposTMobilitat: 90, proximoMantenimiento: '2026-01-20T00:00:00.000Z', slaCorrectivos: 2.0, slaInstalaciones: 3.2, cumplimientoPreventivos: 97, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 2, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'RubíBus CTSL', id: 'op-16', estado: 'Actiu', ubicacionPrincipal: 'Rubí', vehiculosOperativos: 21, vehiculosTotal: 22, vehiculosMantenimiento: 1, vehiculosBaja: 0, equiposTMobilitat: 66, proximoMantenimiento: '2026-01-22T00:00:00.000Z', slaCorrectivos: 1.9, slaInstalaciones: 3.0, cumplimientoPreventivos: 98, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 1, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'TMESA', id: 'op-17', estado: 'Actiu', ubicacionPrincipal: 'Terrassa', vehiculosOperativos: 68, vehiculosTotal: 71, vehiculosMantenimiento: 2, vehiculosBaja: 1, equiposTMobilitat: 213, proximoMantenimiento: '2026-01-18T00:00:00.000Z', slaCorrectivos: 2.2, slaInstalaciones: 3.5, cumplimientoPreventivos: 95, calidadServicio: 'A', mantenimientosVencidos: 1, incidenciasAbiertas: 3, incidenciasEscaladas: 0, stockCritico: false },
    
    // Grupo Direxis
    { nombre: 'MASATS TRANSPORTS GENERALS, SA', id: 'op-18', estado: 'Actiu', ubicacionPrincipal: 'Granollers', vehiculosOperativos: 23, vehiculosTotal: 24, vehiculosMantenimiento: 1, vehiculosBaja: 0, equiposTMobilitat: 72, proximoMantenimiento: '2026-01-25T00:00:00.000Z', slaCorrectivos: 2.0, slaInstalaciones: 3.2, cumplimientoPreventivos: 97, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 1, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'TRANSPORTES GENERALES DE OLESA, SA', id: 'op-19', estado: 'Actiu', ubicacionPrincipal: 'Olesa de Montserrat', vehiculosOperativos: 36, vehiculosTotal: 38, vehiculosMantenimiento: 2, vehiculosBaja: 0, equiposTMobilitat: 114, proximoMantenimiento: '2026-01-28T00:00:00.000Z', slaCorrectivos: 2.3, slaInstalaciones: 3.6, cumplimientoPreventivos: 94, calidadServicio: 'B', mantenimientosVencidos: 1, incidenciasAbiertas: 2, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'TUSGSAL', id: 'op-20', estado: 'Actiu', ubicacionPrincipal: 'Badalona', vehiculosOperativos: 338, vehiculosTotal: 346, vehiculosMantenimiento: 6, vehiculosBaja: 2, equiposTMobilitat: 1038, proximoMantenimiento: '2026-01-12T00:00:00.000Z', slaCorrectivos: 2.8, slaInstalaciones: 4.0, cumplimientoPreventivos: 90, calidadServicio: 'B', mantenimientosVencidos: 5, incidenciasAbiertas: 12, incidenciasEscaladas: 2, stockCritico: true },
    
    // Grupo Empresa Plana
    { nombre: 'CINTOI BUS, SL', id: 'op-21', estado: 'Actiu', ubicacionPrincipal: 'Vilanova i la Geltrú', vehiculosOperativos: 82, vehiculosTotal: 85, vehiculosMantenimiento: 2, vehiculosBaja: 1, equiposTMobilitat: 255, proximoMantenimiento: '2026-01-20T00:00:00.000Z', slaCorrectivos: 2.4, slaInstalaciones: 3.7, cumplimientoPreventivos: 93, calidadServicio: 'B', mantenimientosVencidos: 2, incidenciasAbiertas: 4, incidenciasEscaladas: 1, stockCritico: false },
    { nombre: 'EMPRESA PLANA, SL', id: 'op-22', estado: 'Actiu', ubicacionPrincipal: 'Vilanova i la Geltrú', vehiculosOperativos: 26, vehiculosTotal: 27, vehiculosMantenimiento: 1, vehiculosBaja: 0, equiposTMobilitat: 81, proximoMantenimiento: '2026-01-24T00:00:00.000Z', slaCorrectivos: 2.1, slaInstalaciones: 3.4, cumplimientoPreventivos: 96, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 2, incidenciasEscaladas: 0, stockCritico: false },
    
    // Grupo Monbus
    { nombre: 'UTE HORTA I GRÀCIA', id: 'op-23', estado: 'Actiu', ubicacionPrincipal: 'Barcelona', vehiculosOperativos: 14, vehiculosTotal: 15, vehiculosMantenimiento: 1, vehiculosBaja: 0, equiposTMobilitat: 45, proximoMantenimiento: '2026-01-26T00:00:00.000Z', slaCorrectivos: 1.8, slaInstalaciones: 2.9, cumplimientoPreventivos: 98, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 1, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'LA HISPANO IGUALADINA, SL', id: 'op-24', estado: 'Actiu', ubicacionPrincipal: 'Igualada', vehiculosOperativos: 117, vehiculosTotal: 121, vehiculosMantenimiento: 3, vehiculosBaja: 1, equiposTMobilitat: 363, proximoMantenimiento: '2026-01-15T00:00:00.000Z', slaCorrectivos: 2.6, slaInstalaciones: 3.9, cumplimientoPreventivos: 91, calidadServicio: 'B', mantenimientosVencidos: 3, incidenciasAbiertas: 6, incidenciasEscaladas: 1, stockCritico: false },
    { nombre: 'UTE Port', id: 'op-25', estado: 'Actiu', ubicacionPrincipal: 'Barcelona Port', vehiculosOperativos: 14, vehiculosTotal: 15, vehiculosMantenimiento: 1, vehiculosBaja: 0, equiposTMobilitat: 45, proximoMantenimiento: '2026-01-28T00:00:00.000Z', slaCorrectivos: 1.9, slaInstalaciones: 3.0, cumplimientoPreventivos: 97, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 1, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'UTE SANT BOI, BARCELONA Y OTROS', id: 'op-26', estado: 'Actiu', ubicacionPrincipal: 'Sant Boi de Llobregat', vehiculosOperativos: 93, vehiculosTotal: 96, vehiculosMantenimiento: 2, vehiculosBaja: 1, equiposTMobilitat: 288, proximoMantenimiento: '2026-01-17T00:00:00.000Z', slaCorrectivos: 2.4, slaInstalaciones: 3.7, cumplimientoPreventivos: 93, calidadServicio: 'B', mantenimientosVencidos: 2, incidenciasAbiertas: 5, incidenciasEscaladas: 1, stockCritico: false },
    
    // Grupo Moventia
    { nombre: 'EMPRESA CASAS, SA', id: 'op-27', estado: 'Actiu', ubicacionPrincipal: 'Mataró', vehiculosOperativos: 71, vehiculosTotal: 74, vehiculosMantenimiento: 2, vehiculosBaja: 1, equiposTMobilitat: 222, proximoMantenimiento: '2026-01-19T00:00:00.000Z', slaCorrectivos: 2.3, slaInstalaciones: 3.6, cumplimientoPreventivos: 94, calidadServicio: 'B', mantenimientosVencidos: 1, incidenciasAbiertas: 4, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'MARFINA BUS, SA - LA VALLESANA, SA', id: 'op-28', estado: 'Actiu', ubicacionPrincipal: 'Mollet del Vallès', vehiculosOperativos: 135, vehiculosTotal: 140, vehiculosMantenimiento: 4, vehiculosBaja: 1, equiposTMobilitat: 420, proximoMantenimiento: '2026-01-14T00:00:00.000Z', slaCorrectivos: 2.7, slaInstalaciones: 3.9, cumplimientoPreventivos: 91, calidadServicio: 'B', mantenimientosVencidos: 4, incidenciasAbiertas: 7, incidenciasEscaladas: 1, stockCritico: false },
    { nombre: 'MOVENTIA L\'HOSPITALET', id: 'op-29', estado: 'Actiu', ubicacionPrincipal: 'L\'Hospitalet de Llobregat', vehiculosOperativos: 113, vehiculosTotal: 117, vehiculosMantenimiento: 3, vehiculosBaja: 1, equiposTMobilitat: 351, proximoMantenimiento: '2026-01-16T00:00:00.000Z', slaCorrectivos: 2.5, slaInstalaciones: 3.8, cumplimientoPreventivos: 92, calidadServicio: 'B', mantenimientosVencidos: 2, incidenciasAbiertas: 5, incidenciasEscaladas: 1, stockCritico: false },
    { nombre: 'TRANSPORTS CIUTAT COMTAL, SA', id: 'op-30', estado: 'Actiu', ubicacionPrincipal: 'Barcelona', vehiculosOperativos: 24, vehiculosTotal: 25, vehiculosMantenimiento: 1, vehiculosBaja: 0, equiposTMobilitat: 75, proximoMantenimiento: '2026-01-22T00:00:00.000Z', slaCorrectivos: 2.0, slaInstalaciones: 3.2, cumplimientoPreventivos: 97, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 1, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'TRANSPORTS PUJOL I PUJOL', id: 'op-31', estado: 'Actiu', ubicacionPrincipal: 'Malgrat de Mar', vehiculosOperativos: 5, vehiculosTotal: 5, vehiculosMantenimiento: 0, vehiculosBaja: 0, equiposTMobilitat: 15, proximoMantenimiento: '2026-02-01T00:00:00.000Z', slaCorrectivos: 1.5, slaInstalaciones: 2.5, cumplimientoPreventivos: 100, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 0, incidenciasEscaladas: 0, stockCritico: false },
    
    // Grupo Sagalés
    { nombre: 'OSONA BUS, SA', id: 'op-32', estado: 'Actiu', ubicacionPrincipal: 'Vic', vehiculosOperativos: 69, vehiculosTotal: 72, vehiculosMantenimiento: 2, vehiculosBaja: 1, equiposTMobilitat: 216, proximoMantenimiento: '2026-01-18T00:00:00.000Z', slaCorrectivos: 2.2, slaInstalaciones: 3.5, cumplimientoPreventivos: 95, calidadServicio: 'A', mantenimientosVencidos: 1, incidenciasAbiertas: 3, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'BARCELONA BUS, SL', id: 'op-33', estado: 'Actiu', ubicacionPrincipal: 'Barcelona', vehiculosOperativos: 83, vehiculosTotal: 86, vehiculosMantenimiento: 2, vehiculosBaja: 1, equiposTMobilitat: 258, proximoMantenimiento: '2026-01-16T00:00:00.000Z', slaCorrectivos: 2.4, slaInstalaciones: 3.7, cumplimientoPreventivos: 93, calidadServicio: 'B', mantenimientosVencidos: 2, incidenciasAbiertas: 4, incidenciasEscaladas: 1, stockCritico: false },
    { nombre: 'CINGLES BUS, SA', id: 'op-34', estado: 'Actiu', ubicacionPrincipal: 'Tavertet', vehiculosOperativos: 33, vehiculosTotal: 34, vehiculosMantenimiento: 1, vehiculosBaja: 0, equiposTMobilitat: 102, proximoMantenimiento: '2026-01-24T00:00:00.000Z', slaCorrectivos: 2.1, slaInstalaciones: 3.4, cumplimientoPreventivos: 96, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 2, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'EMPRESA SAGALÉS, SA', id: 'op-35', estado: 'Actiu', ubicacionPrincipal: 'Caldes de Montbui', vehiculosOperativos: 92, vehiculosTotal: 95, vehiculosMantenimiento: 2, vehiculosBaja: 1, equiposTMobilitat: 285, proximoMantenimiento: '2026-01-15T00:00:00.000Z', slaCorrectivos: 2.5, slaInstalaciones: 3.8, cumplimientoPreventivos: 92, calidadServicio: 'B', mantenimientosVencidos: 2, incidenciasAbiertas: 5, incidenciasEscaladas: 1, stockCritico: false },
    { nombre: 'FERROCARRILES Y TRANSPORTES, SA', id: 'op-36', estado: 'Actiu', ubicacionPrincipal: 'Barcelona', vehiculosOperativos: 71, vehiculosTotal: 74, vehiculosMantenimiento: 2, vehiculosBaja: 1, equiposTMobilitat: 222, proximoMantenimiento: '2026-01-20T00:00:00.000Z', slaCorrectivos: 2.3, slaInstalaciones: 3.6, cumplimientoPreventivos: 94, calidadServicio: 'B', mantenimientosVencidos: 1, incidenciasAbiertas: 4, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'MANRESA BUS, SA', id: 'op-37', estado: 'Actiu', ubicacionPrincipal: 'Manresa', vehiculosOperativos: 20, vehiculosTotal: 21, vehiculosMantenimiento: 1, vehiculosBaja: 0, equiposTMobilitat: 63, proximoMantenimiento: '2026-01-26T00:00:00.000Z', slaCorrectivos: 1.9, slaInstalaciones: 3.1, cumplimientoPreventivos: 98, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 1, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'BAGES BUS, SA', id: 'op-38', estado: 'Actiu', ubicacionPrincipal: 'Manresa', vehiculosOperativos: 53, vehiculosTotal: 55, vehiculosMantenimiento: 2, vehiculosBaja: 0, equiposTMobilitat: 165, proximoMantenimiento: '2026-01-22T00:00:00.000Z', slaCorrectivos: 2.2, slaInstalaciones: 3.5, cumplimientoPreventivos: 95, calidadServicio: 'A', mantenimientosVencidos: 1, incidenciasAbiertas: 2, incidenciasEscaladas: 0, stockCritico: false },
    
    // Grupo Soler i Sauret
    { nombre: 'UTE VALLDOREIX', id: 'op-39', estado: 'Actiu', ubicacionPrincipal: 'Sant Cugat del Vallès', vehiculosOperativos: 5, vehiculosTotal: 5, vehiculosMantenimiento: 0, vehiculosBaja: 0, equiposTMobilitat: 15, proximoMantenimiento: '2026-02-02T00:00:00.000Z', slaCorrectivos: 1.5, slaInstalaciones: 2.5, cumplimientoPreventivos: 100, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 0, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'SOLER Y SAURET, SA', id: 'op-40', estado: 'Actiu', ubicacionPrincipal: 'Sant Feliu de Llobregat', vehiculosOperativos: 105, vehiculosTotal: 109, vehiculosMantenimiento: 3, vehiculosBaja: 1, equiposTMobilitat: 327, proximoMantenimiento: '2026-01-14T00:00:00.000Z', slaCorrectivos: 2.6, slaInstalaciones: 3.9, cumplimientoPreventivos: 91, calidadServicio: 'B', mantenimientosVencidos: 3, incidenciasAbiertas: 5, incidenciasEscaladas: 1, stockCritico: false },
    
    // Grupo TEISA
    { nombre: 'TEISA', id: 'op-41', estado: 'Actiu', ubicacionPrincipal: 'Girona', vehiculosOperativos: 35, vehiculosTotal: 36, vehiculosMantenimiento: 1, vehiculosBaja: 0, equiposTMobilitat: 108, proximoMantenimiento: '2026-01-25T00:00:00.000Z', slaCorrectivos: 2.0, slaInstalaciones: 3.3, cumplimientoPreventivos: 97, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 2, incidenciasEscaladas: 0, stockCritico: false },
    { nombre: 'HISPANO HILARIENCA, SAU', id: 'op-42', estado: 'Actiu', ubicacionPrincipal: 'Santa Coloma de Farners', vehiculosOperativos: 21, vehiculosTotal: 22, vehiculosMantenimiento: 1, vehiculosBaja: 0, equiposTMobilitat: 66, proximoMantenimiento: '2026-01-28T00:00:00.000Z', slaCorrectivos: 1.9, slaInstalaciones: 3.1, cumplimientoPreventivos: 98, calidadServicio: 'A', mantenimientosVencidos: 0, incidenciasAbiertas: 1, incidenciasEscaladas: 0, stockCritico: false },
];
