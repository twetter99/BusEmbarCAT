// Tipos para Órdenes de Trabajo del Contracte C-4/2025

export type WorkStatus = 'pendent' | 'en_curs' | 'completada' | 'incidencia';

export type ChecklistItem = {
  id: string;
  pregunta: string;
  resposta: 'ok' | 'no_ok' | 'na';
  notes?: string;
  fotos?: number;
};

export type WorkChecklist = {
  otId: string;
  vehicle: string;
  operador: string;
  cotxera: string;
  adreça: string;
  tipus: string;
  status: WorkStatus;
  tecnic: string;
  iniciISO?: string;
  fiISO?: string;
  duracioMin?: number;
  firma?: boolean;
  items: ChecklistItem[];
  observacions?: string;
};

// DATOS MOCK - Órdenes de Trabajo Contracte C-4/2025
export const WORK_CHECKLISTS: WorkChecklist[] = [
  // ========== PENDENTS (7) ==========
  {
    otId: 'OT-CMG-26001',
    vehicle: 'VEH-TCC-1001',
    operador: 'TRANSPORTS CIUTAT COMTAL, SA',
    cotxera: 'Barcelona - Casablanca',
    adreça: 'C/. Casablanca, 8, Puerto de Barcelona',
    tipus: 'Revisió Trimestral',
    status: 'pendent',
    tecnic: 'Joan R.',
    items: [],
  },
  {
    otId: 'OT-CMG-26002',
    vehicle: 'VEH-SAG-2015',
    operador: 'EMPRESA SAGALÉS, SA',
    cotxera: 'Mollet del Vallès',
    adreça: 'Polígon Industrial Can Magarola, Mollet del Vallès',
    tipus: 'Revisió Anual',
    status: 'pendent',
    tecnic: 'Marta C.',
    items: [],
  },
  {
    otId: 'OT-CMG-26003',
    vehicle: 'VEH-MOV-3022',
    operador: 'MOVENTIA L\'HOSPITALET',
    cotxera: 'Barcelona - Sants',
    adreça: 'Carrer 60, 2, Sants-Montjuïc, Barcelona',
    tipus: 'Substitució Validador',
    status: 'pendent',
    tecnic: 'Eric P.',
    items: [],
  },
  {
    otId: 'OT-CMG-26004',
    vehicle: 'VEH-CAS-5008',
    operador: 'EMPRESA CASAS, SA',
    cotxera: 'Mataró',
    adreça: 'C/. Remallaire, 15-17, Mataró',
    tipus: 'Revisió Preventiva',
    status: 'pendent',
    tecnic: 'Nuria G.',
    items: [],
  },
  {
    otId: 'OT-CMG-26005',
    vehicle: 'VEH-HIS-6012',
    operador: 'LA HISPANO IGUALADINA, SL',
    cotxera: 'Igualada',
    adreça: 'Gabriel Castellà, 7, Igualada',
    tipus: 'Avaria Electrònica',
    status: 'pendent',
    tecnic: 'David S.',
    items: [],
  },
  {
    otId: 'OT-CMG-26006',
    vehicle: 'VEH-SOL-4005',
    operador: 'SOLER Y SAURET, SA',
    cotxera: 'Sant Feliu de Llobregat',
    adreça: 'Av. Carrilet, 232, Sant Feliu de Llobregat',
    tipus: 'Revisió Trimestral',
    status: 'pendent',
    tecnic: 'Joan R.',
    items: [],
  },
  {
    otId: 'OT-CMG-26007',
    vehicle: 'VEH-OSO-7003',
    operador: 'OSONA BUS, SA',
    cotxera: 'Vic',
    adreça: 'Polígon Industrial Els Dolors, Vic',
    tipus: 'Revisió Preventiva',
    status: 'pendent',
    tecnic: 'Marta C.',
    items: [],
  },

  // ========== COMPLETADES (2) ==========
  {
    otId: 'OT-CMG-26008',
    vehicle: 'VEH-HIS-6009',
    operador: 'LA HISPANO IGUALADINA, SL',
    cotxera: 'Reus',
    adreça: 'C/. Dues Aigües, 4-6, Reus',
    tipus: 'Revisió Trimestral',
    status: 'completada',
    tecnic: 'Marta C.',
    iniciISO: '2025-10-14T08:45:00Z',
    fiISO: '2025-10-14T09:30:00Z',
    duracioMin: 90,
    firma: true,
    items: [
      { id: 'CHK-1', pregunta: 'Desmuntar la validadora del vehicle', resposta: 'ok' },
      { id: 'CHK-2', pregunta: 'Realitzar la neteja de pols (interna i externa) [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-3', pregunta: 'Realitzar la neteja de les vies de pas dels bitllets [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-4', pregunta: 'Realitzar la neteja de fotocèl·lules [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-5', pregunta: 'Verificar els ajustos dels rodets de pressió contra el capçal magnètic [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-6', pregunta: 'Verificar la tensió de corretges [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-7', pregunta: 'Estrènyer els cargols de subjecció de motors [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-8', pregunta: 'Verificar/Substituir el capçal magnètic [FORA DEL VEHICLE]', resposta: 'ok', notes: 'Verificat - Estat OK' },
      { id: 'CHK-9', pregunta: 'Canviar les peces sotmeses a desgast [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-10', pregunta: 'Restituir l\'equip en el vehicle corresponent', resposta: 'ok' },
      { id: 'CHK-11', pregunta: 'Realitzar una verificació a bord (en condicions d\'explotació o test)', resposta: 'ok' },
    ],
    observacions: 'Manteniment N2 completat satisfactòriament segons PPT Sec. 2.1.2. Kit de peces de desgast substituït.',
  },
  {
    otId: 'OT-CMG-26009',
    vehicle: 'VEH-BAR-8021',
    operador: 'BARCELONA BUS, SL',
    cotxera: 'Mataró',
    adreça: 'Polígon Industrial Pla d\'en Boet, Mataró',
    tipus: 'Revisió Anual',
    status: 'completada',
    tecnic: 'Eric P.',
    iniciISO: '2025-10-20T09:15:00Z',
    fiISO: '2025-10-20T10:45:00Z',
    duracioMin: 90,
    firma: true,
    items: [
      { id: 'CHK-1', pregunta: 'Desmuntar la validadora del vehicle', resposta: 'ok' },
      { id: 'CHK-2', pregunta: 'Realitzar la neteja de pols (interna i externa) [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-3', pregunta: 'Realitzar la neteja de les vies de pas dels bitllets [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-4', pregunta: 'Realitzar la neteja de fotocèl·lules [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-5', pregunta: 'Verificar els ajustos dels rodets de pressió contra el capçal magnètic [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-6', pregunta: 'Verificar la tensió de corretges [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-7', pregunta: 'Estrènyer els cargols de subjecció de motors [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-8', pregunta: 'Verificar/Substituir el capçal magnètic [FORA DEL VEHICLE]', resposta: 'ok', notes: 'Capçal ajustat segons toleràncies' },
      { id: 'CHK-9', pregunta: 'Canviar les peces sotmeses a desgast [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-10', pregunta: 'Restituir l\'equip en el vehicle corresponent', resposta: 'ok' },
      { id: 'CHK-11', pregunta: 'Realitzar una verificació a bord (en condicions d\'explotació o test)', resposta: 'ok' },
    ],
    observacions: 'Revisió anual N2 completada segons PPT Sec. 2.1.2. Validadora en perfecte estat operatiu.',
  },

  // ========== INCIDÈNCIA (1) ==========
  {
    otId: 'OT-CMG-26010',
    vehicle: 'VEH-MAR-9014',
    operador: 'MARFINA BUS, SA',
    cotxera: 'Sabadell',
    adreça: 'C/. Vallès, 245, Sabadell',
    tipus: 'Avaria Electrònica',
    status: 'incidencia',
    tecnic: 'David S.',
    iniciISO: '2025-10-25T14:30:00Z',
    fiISO: '2025-10-25T15:15:00Z',
    duracioMin: 45,
    firma: false,
    items: [
      { id: 'CHK-1', pregunta: 'Desmuntar la validadora del vehicle', resposta: 'ok' },
      { id: 'CHK-2', pregunta: 'Realitzar la neteja de pols (interna i externa) [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-3', pregunta: 'Realitzar la neteja de les vies de pas dels bitllets [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-4', pregunta: 'Realitzar la neteja de fotocèl·lules [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-5', pregunta: 'Verificar els ajustos dels rodets de pressió contra el capçal magnètic [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-6', pregunta: 'Verificar la tensió de corretges [FORA DEL VEHICLE]', resposta: 'no_ok', notes: 'Corretja desgastada - necessita substitució', fotos: 2 },
      { id: 'CHK-7', pregunta: 'Estrènyer els cargols de subjecció de motors [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-8', pregunta: 'Verificar/Substituir el capçal magnètic [FORA DEL VEHICLE]', resposta: 'no_ok', notes: 'Capçal desgastat - SUBSTITUÏT', fotos: 3 },
      { id: 'CHK-9', pregunta: 'Canviar les peces sotmeses a desgast [FORA DEL VEHICLE]', resposta: 'no_ok', notes: 'Kit no disponible - pendent recepció' },
      { id: 'CHK-10', pregunta: 'Restituir l\'equip en el vehicle corresponent', resposta: 'na', notes: 'Pendent recepció components' },
      { id: 'CHK-11', pregunta: 'Realitzar una verificació a bord (en condicions d\'explotació o test)', resposta: 'na' },
    ],
    observacions: 'INCIDÈNCIA: Capçal magnètic substituït però kit de peces no disponible. Corretja necessita substitució. Validadora temporalment fora de servei fins recepció de components. Comanda urgent realitzada.',
  },

  // ========== EN CURS (10) ==========
  {
    otId: 'OT-CMG-26011',
    vehicle: 'VEH-CIN-1107',
    operador: 'CINTOI BUS, SL',
    cotxera: 'Vilanova i la Geltrú',
    adreça: 'Polígon Industrial El Garraf, Vilanova i la Geltrú',
    tipus: 'Revisió Trimestral',
    status: 'en_curs',
    tecnic: 'Nuria G.',
    iniciISO: '2025-10-28T10:00:00Z',
    items: [
      { id: 'CHK-1', pregunta: 'Desmuntar la validadora del vehicle', resposta: 'ok' },
      { id: 'CHK-2', pregunta: 'Realitzar la neteja de pols (interna i externa) [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-3', pregunta: 'Realitzar la neteja de les vies de pas dels bitllets [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-4', pregunta: 'Realitzar la neteja de fotocèl·lules [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-5', pregunta: 'Verificar els ajustos dels rodets de pressió contra el capçal magnètic [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-6', pregunta: 'Verificar la tensió de corretges [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-7', pregunta: 'Estrènyer els cargols de subjecció de motors [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-8', pregunta: 'Verificar/Substituir el capçal magnètic [FORA DEL VEHICLE]', resposta: 'ok', notes: 'En procés de verificació' },
    ],
  },
  {
    otId: 'OT-CMG-26012',
    vehicle: 'VEH-OLE-1202',
    operador: 'TRANSPORTES GENERALES DE OLESA, SA',
    cotxera: 'Olesa de Montserrat',
    adreça: 'C/. Sant Joan, 78, Olesa de Montserrat',
    tipus: 'Substitució Validador',
    status: 'en_curs',
    tecnic: 'Joan R.',
    iniciISO: '2025-10-29T08:30:00Z',
    items: [
      { id: 'CHK-1', pregunta: 'Desmuntar la validadora del vehicle', resposta: 'ok' },
      { id: 'CHK-10', pregunta: 'Restituir l\'equip en el vehicle corresponent', resposta: 'ok', notes: 'Nou validador instal·lat' },
      { id: 'CHK-11', pregunta: 'Realitzar una verificació a bord (en condicions d\'explotació o test)', resposta: 'ok', notes: 'Test en procés' },
    ],
  },
  {
    otId: 'OT-CMG-26013',
    vehicle: 'VEH-JUL-1305',
    operador: 'AUTOCARES JULIA, SL',
    cotxera: 'Hospitalet de Llobregat',
    adreça: 'C/. Motors, 94, Hospitalet de Llobregat',
    tipus: 'Revisió Preventiva',
    status: 'en_curs',
    tecnic: 'Marta C.',
    iniciISO: '2025-10-30T11:20:00Z',
    items: [
      { id: 'CHK-1', pregunta: 'Desmuntar la validadora del vehicle', resposta: 'ok' },
      { id: 'CHK-2', pregunta: 'Realitzar la neteja de pols (interna i externa) [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-3', pregunta: 'Realitzar la neteja de les vies de pas dels bitllets [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-4', pregunta: 'Realitzar la neteja de fotocèl·lules [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-5', pregunta: 'Verificar els ajustos dels rodets de pressió contra el capçal magnètic [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-6', pregunta: 'Verificar la tensió de corretges [FORA DEL VEHICLE]', resposta: 'ok' },
    ],
  },
  {
    otId: 'OT-CMG-26014',
    vehicle: 'VEH-PEN-1408',
    operador: 'AUTOCARS DEL PENEDÈS, SA',
    cotxera: 'Santa Oliva',
    adreça: 'Av. Catalunya, 45, Santa Oliva',
    tipus: 'Revisió Trimestral',
    status: 'en_curs',
    tecnic: 'Eric P.',
    iniciISO: '2025-10-30T13:45:00Z',
    items: [
      { id: 'CHK-1', pregunta: 'Desmuntar la validadora del vehicle', resposta: 'ok' },
      { id: 'CHK-2', pregunta: 'Realitzar la neteja de pols (interna i externa) [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-3', pregunta: 'Realitzar la neteja de les vies de pas dels bitllets [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-4', pregunta: 'Realitzar la neteja de fotocèl·lules [FORA DEL VEHICLE]', resposta: 'ok' },
    ],
  },
  {
    otId: 'OT-CMG-26015',
    vehicle: 'VEH-MAN-1511',
    operador: 'MANRESA BUS, SA',
    cotxera: 'Manresa',
    adreça: 'Av. Bases de Manresa, 78, Manresa',
    tipus: 'Actualització Firmware',
    status: 'en_curs',
    tecnic: 'David S.',
    iniciISO: '2025-10-31T09:00:00Z',
    items: [
      { id: 'CHK-1', pregunta: 'Desmuntar la validadora del vehicle', resposta: 'ok' },
      { id: 'CHK-2', pregunta: 'Realitzar la neteja de pols (interna i externa) [FORA DEL VEHICLE]', resposta: 'ok' },
    ],
    observacions: 'Actualització de firmware en procés',
  },
  {
    otId: 'OT-CMG-26016',
    vehicle: 'VEH-PUJ-1603',
    operador: 'TRANSPORTS PUJOL I PUJOL',
    cotxera: 'Malgrat de Mar',
    adreça: 'C/. Indústria, 12, Malgrat de Mar',
    tipus: 'Revisió Preventiva',
    status: 'en_curs',
    tecnic: 'Nuria G.',
    iniciISO: '2025-10-31T10:30:00Z',
    items: [
      { id: 'CHK-1', pregunta: 'Desmuntar la validadora del vehicle', resposta: 'ok' },
      { id: 'CHK-11', pregunta: 'Realitzar una verificació a bord (en condicions d\'explotació o test)', resposta: 'ok', notes: 'Test de lectura OK' },
    ],
  },
  {
    otId: 'OT-CMG-26017',
    vehicle: 'VEH-BAG-1704',
    operador: 'BAGES BUS, SA',
    cotxera: 'Manresa',
    adreça: 'Polígon Industrial Els Comtals, Manresa',
    tipus: 'Revisió Trimestral',
    status: 'en_curs',
    tecnic: 'Joan R.',
    iniciISO: '2025-10-31T14:00:00Z',
    items: [
      { id: 'CHK-1', pregunta: 'Desmuntar la validadora del vehicle', resposta: 'ok' },
      { id: 'CHK-2', pregunta: 'Realitzar la neteja de pols (interna i externa) [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-3', pregunta: 'Realitzar la neteja de les vies de pas dels bitllets [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-4', pregunta: 'Realitzar la neteja de fotocèl·lules [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-5', pregunta: 'Verificar els ajustos dels rodets de pressió contra el capçal magnètic [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-6', pregunta: 'Verificar la tensió de corretges [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-7', pregunta: 'Estrènyer els cargols de subjecció de motors [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-8', pregunta: 'Verificar/Substituir el capçal magnètic [FORA DEL VEHICLE]', resposta: 'ok', notes: 'Verificació en curs' },
    ],
  },
  {
    otId: 'OT-CMG-26018',
    vehicle: 'VEH-CIN-1805',
    operador: 'CINGLES BUS, SA',
    cotxera: 'El Tint',
    adreça: 'Ctra. Vic-Olot, Km 12, El Tint',
    tipus: 'Manteniment Correctiu',
    status: 'en_curs',
    tecnic: 'Marta C.',
    iniciISO: '2025-10-31T15:30:00Z',
    items: [
      { id: 'CHK-1', pregunta: 'Desmuntar la validadora del vehicle', resposta: 'ok' },
      { id: 'CHK-2', pregunta: 'Realitzar la neteja de pols (interna i externa) [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-3', pregunta: 'Realitzar la neteja de les vies de pas dels bitllets [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-4', pregunta: 'Realitzar la neteja de fotocèl·lules [FORA DEL VEHICLE]', resposta: 'ok', notes: 'Lectura lenta - fotocèl·lules netejades' },
    ],
  },
  {
    otId: 'OT-CMG-26019',
    vehicle: 'VEH-HLL-1902',
    operador: 'HISPANO LLACUNENSE, SL',
    cotxera: 'Sant Sadurní d\'Anoia',
    adreça: 'C/. Raval, 88, Sant Sadurní d\'Anoia',
    tipus: 'Revisió Anual',
    status: 'en_curs',
    tecnic: 'Eric P.',
    iniciISO: '2025-10-31T16:00:00Z',
    items: [
      { id: 'CHK-1', pregunta: 'Desmuntar la validadora del vehicle', resposta: 'ok' },
      { id: 'CHK-2', pregunta: 'Realitzar la neteja de pols (interna i externa) [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-3', pregunta: 'Realitzar la neteja de les vies de pas dels bitllets [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-4', pregunta: 'Realitzar la neteja de fotocèl·lules [FORA DEL VEHICLE]', resposta: 'ok' },
      { id: 'CHK-5', pregunta: 'Verificar els ajustos dels rodets de pressió contra el capçal magnètic [FORA DEL VEHICLE]', resposta: 'ok' },
    ],
  },
  {
    otId: 'OT-CMG-26020',
    vehicle: 'VEH-MAS-2006',
    operador: 'MASATS TRANSPORTS GENERALS, SA',
    cotxera: 'Igualada',
    adreça: 'Av. Andorra, 156, Igualada',
    tipus: 'Calibratge Sistema',
    status: 'en_curs',
    tecnic: 'David S.',
    iniciISO: '2025-10-31T17:15:00Z',
    items: [
      { id: 'CHK-1', pregunta: 'Desmuntar la validadora del vehicle', resposta: 'ok' },
      { id: 'CHK-5', pregunta: 'Verificar els ajustos dels rodets de pressió contra el capçal magnètic [FORA DEL VEHICLE]', resposta: 'ok', notes: 'Calibratge de rodets en procés' },
    ],
  },
];

// Utilidades para filtrar y agrupar
export const getWorkOrdersByStatus = (status: WorkStatus) => {
  return WORK_CHECKLISTS.filter(wo => wo.status === status);
};

export const getWorkOrdersByOperador = (operador: string) => {
  return WORK_CHECKLISTS.filter(wo => wo.operador === operador);
};

export const getWorkOrdersByCotxera = (cotxera: string) => {
  return WORK_CHECKLISTS.filter(wo => wo.cotxera === cotxera);
};

export const getUniqueOperadores = () => {
  return Array.from(new Set(WORK_CHECKLISTS.map(wo => wo.operador))).sort();
};

export const getUniqueCotxeras = () => {
  return Array.from(new Set(WORK_CHECKLISTS.map(wo => wo.cotxera))).sort();
};

// Estadísticas
export const getWorkOrdersStats = () => {
  const total = WORK_CHECKLISTS.length;
  const pendents = WORK_CHECKLISTS.filter(wo => wo.status === 'pendent').length;
  const enCurs = WORK_CHECKLISTS.filter(wo => wo.status === 'en_curs').length;
  const completades = WORK_CHECKLISTS.filter(wo => wo.status === 'completada').length;
  const incidencies = WORK_CHECKLISTS.filter(wo => wo.status === 'incidencia').length;

  return {
    total,
    pendents,
    enCurs,
    completades,
    incidencies,
    percentatgeComplert: total > 0 ? (completades / total) * 100 : 0,
  };
};
