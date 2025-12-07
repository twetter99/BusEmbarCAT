/**
 * Quality Gates - Control de Calidad C-5/2025
 * 
 * Implementa la lógica de puntos de control bloqueantes
 * requeridos por la licitación.
 * 
 * Tipos de control:
 * - Inbound QC: Recepción de mercancía
 * - Manufacturing QC: Ensamblaje de Kits
 * - Outbound QC: Cierre de Picking
 */

import type {
  TipoQualityGate,
  PlantillaChecklistQC,
  QualityGateC5,
  ChecklistItemQC,
  FirmaDigitalQC,
  EstadoQualityGate,
  LogActividadQA,
  KPIsSLAC5,
} from './contrato-c5-types';

// ============================================
// PLANTILLAS DE CHECKLISTS
// ============================================

/**
 * Checklist Inbound QC - Recepción de Mercancía
 * Se aplica al recibir Switch/Antena del proveedor
 */
export const CHECKLIST_INBOUND_QC: PlantillaChecklistQC = {
  tipo: 'inbound',
  nombre: 'Control de Recepción',
  descripcion: 'Verificaciones obligatorias al recibir mercancía del proveedor',
  items: [
    {
      id: 'INB-001',
      codigo: 'INB-001',
      descripcion: 'Verificación de albarán de entrega vs pedido de compra',
      obligatorio: true,
    },
    {
      id: 'INB-002',
      codigo: 'INB-002',
      descripcion: 'Inspección visual del embalaje (sin daños)',
      obligatorio: true,
    },
    {
      id: 'INB-003',
      codigo: 'INB-003',
      descripcion: 'Conteo de unidades recibidas',
      obligatorio: true,
    },
    {
      id: 'INB-004',
      codigo: 'INB-004',
      descripcion: 'Validación de Datasheet técnico del producto',
      obligatorio: true,
    },
    {
      id: 'INB-005',
      codigo: 'INB-005',
      descripcion: 'Registro de números de serie en sistema',
      obligatorio: true,
    },
    {
      id: 'INB-006',
      codigo: 'INB-006',
      descripcion: 'Verificación de certificados de conformidad',
      obligatorio: false,
    },
  ],
};

/**
 * Checklist Manufacturing QC - Ensamblaje de Kits
 * Se aplica al fabricar un Kit Integral
 */
export const CHECKLIST_MANUFACTURING_QC: PlantillaChecklistQC = {
  tipo: 'manufacturing',
  nombre: 'Control de Fabricación Kit Integral',
  descripcion: 'Verificaciones obligatorias para el ensamblaje del Kit Integral de Conexiones',
  items: [
    {
      id: 'MFG-001',
      codigo: 'MFG-001',
      descripcion: 'Continuidad eléctrica de la placa de conexiones verificada',
      obligatorio: true,
    },
    {
      id: 'MFG-002',
      codigo: 'MFG-002',
      descripcion: 'Par de apriete de bornas y fijación mecánica de relés verificado',
      obligatorio: true,
    },
    {
      id: 'MFG-003',
      codigo: 'MFG-003',
      descripcion: 'Verificación del pinout conectores Harting (módulos A, B, C, D)',
      obligatorio: true,
    },
    {
      id: 'MFG-004',
      codigo: 'MFG-004',
      descripcion: 'Comprobación de longitud y crimpado de "fuetones" de antena',
      obligatorio: true,
    },
    {
      id: 'MFG-005',
      codigo: 'MFG-005',
      descripcion: 'Inspección visual de soldaduras y conexiones',
      obligatorio: true,
    },
    {
      id: 'MFG-006',
      codigo: 'MFG-006',
      descripcion: 'Test funcional completo del kit',
      obligatorio: true,
    },
    {
      id: 'MFG-007',
      codigo: 'MFG-007',
      descripcion: 'Etiquetado con número de serie del kit',
      obligatorio: true,
    },
  ],
};

/**
 * Checklist Outbound QC - Cierre de Picking
 * Se aplica antes de enviar mercancía al operador
 */
export const CHECKLIST_OUTBOUND_QC: PlantillaChecklistQC = {
  tipo: 'outbound',
  nombre: 'Validación de Salida',
  descripcion: 'Verificaciones obligatorias antes del envío - REQUIERE FIRMA DIGITAL',
  items: [
    {
      id: 'OUT-001',
      codigo: 'OUT-001',
      descripcion: 'Escaneo de números de serie completado',
      obligatorio: true,
    },
    {
      id: 'OUT-002',
      codigo: 'OUT-002',
      descripcion: 'Coincidencia con reserva del pedido validada',
      obligatorio: true,
    },
    {
      id: 'OUT-003',
      codigo: 'OUT-003',
      descripcion: 'Inspección visual del embalaje',
      obligatorio: true,
    },
    {
      id: 'OUT-004',
      codigo: 'OUT-004',
      descripcion: 'Documentación incluida (albarán, manual, garantía)',
      obligatorio: true,
    },
    {
      id: 'OUT-005',
      codigo: 'OUT-005',
      descripcion: 'Verificación de etiquetas de envío',
      obligatorio: false,
    },
  ],
};

// Mapa de plantillas por tipo
export const PLANTILLAS_CHECKLIST: Record<TipoQualityGate, PlantillaChecklistQC> = {
  inbound: CHECKLIST_INBOUND_QC,
  manufacturing: CHECKLIST_MANUFACTURING_QC,
  outbound: CHECKLIST_OUTBOUND_QC,
};

// ============================================
// FUNCIONES DE VALIDACIÓN
// ============================================

/**
 * Verifica si todos los items obligatorios del checklist están verificados
 */
export function checklistCompleto(checklist: ChecklistItemQC[]): boolean {
  const obligatorios = checklist.filter(item => item.obligatorio);
  return obligatorios.every(item => item.verificado);
}

/**
 * Calcula el progreso del checklist (0-100%)
 */
export function progresoChecklist(checklist: ChecklistItemQC[]): number {
  if (checklist.length === 0) return 0;
  const verificados = checklist.filter(item => item.verificado).length;
  return Math.round((verificados / checklist.length) * 100);
}

/**
 * Calcula el progreso de items obligatorios (0-100%)
 */
export function progresoObligatorios(checklist: ChecklistItemQC[]): number {
  const obligatorios = checklist.filter(item => item.obligatorio);
  if (obligatorios.length === 0) return 100;
  const verificados = obligatorios.filter(item => item.verificado).length;
  return Math.round((verificados / obligatorios.length) * 100);
}

/**
 * Determina si se puede firmar el Quality Gate
 * Requiere que todos los items obligatorios estén verificados
 */
export function puedeFirear(qualityGate: QualityGateC5): boolean {
  return checklistCompleto(qualityGate.checklist) && !qualityGate.firma;
}

/**
 * Determina si el Quality Gate permite avanzar al siguiente estado
 * LÓGICA BLOQUEANTE: Requiere checklist completo + firma
 */
export function qualityGateAprobado(qualityGate: QualityGateC5): boolean {
  return (
    qualityGate.estado === 'aprobado' &&
    checklistCompleto(qualityGate.checklist) &&
    qualityGate.firma !== undefined &&
    qualityGate.firma.tipoFirma === 'aprobacion'
  );
}

/**
 * Calcula el estado del Quality Gate basado en el checklist y firma
 */
export function calcularEstadoQualityGate(qualityGate: QualityGateC5): EstadoQualityGate {
  // Si tiene firma de rechazo
  if (qualityGate.firma?.tipoFirma === 'rechazo') {
    return 'rechazado';
  }
  
  // Si tiene firma de aprobación y checklist completo
  if (qualityGate.firma?.tipoFirma === 'aprobacion' && checklistCompleto(qualityGate.checklist)) {
    return 'aprobado';
  }
  
  // Si hay algún item verificado pero no todos
  const progreso = progresoChecklist(qualityGate.checklist);
  if (progreso > 0 && progreso < 100) {
    return 'en_progreso';
  }
  
  // Si no hay progreso
  if (progreso === 0) {
    return 'pendiente';
  }
  
  // Checklist completo pero sin firma
  return 'en_progreso';
}

/**
 * Crea un nuevo Quality Gate a partir de una plantilla
 */
export function crearQualityGate(
  tipo: TipoQualityGate,
  referenciaId: string,
  referenciaTipo: QualityGateC5['referenciaTipo'],
  referenciaCodigo: string,
  creadoPor: string
): QualityGateC5 {
  const plantilla = PLANTILLAS_CHECKLIST[tipo];
  const ahora = new Date();
  
  const checklist: ChecklistItemQC[] = plantilla.items.map(item => ({
    ...item,
    verificado: false,
    fechaVerificacion: undefined,
    verificadoPor: undefined,
    observaciones: undefined,
    evidencias: undefined,
  }));
  
  return {
    id: `QG-${tipo.toUpperCase()}-${Date.now()}`,
    tipo,
    estado: 'pendiente',
    referenciaId,
    referenciaTipo,
    referenciaCodigo,
    checklist,
    firma: undefined,
    fechaCreacion: ahora,
    fechaInicio: undefined,
    fechaCierre: undefined,
    creadoPor,
  };
}

/**
 * Firma el Quality Gate
 */
export function firmarQualityGate(
  qualityGate: QualityGateC5,
  usuarioId: string,
  usuarioNombre: string,
  usuarioRol: string,
  tipoFirma: 'aprobacion' | 'rechazo',
  observaciones?: string
): QualityGateC5 {
  const firma: FirmaDigitalQC = {
    id: `FIRMA-${Date.now()}`,
    usuarioId,
    usuarioNombre,
    usuarioRol,
    fechaFirma: new Date(),
    tipoFirma,
    observaciones,
  };
  
  const nuevoEstado = calcularEstadoQualityGate({
    ...qualityGate,
    firma,
  });
  
  return {
    ...qualityGate,
    firma,
    estado: nuevoEstado,
    fechaCierre: tipoFirma === 'aprobacion' ? new Date() : undefined,
  };
}

// ============================================
// LABELS Y TRADUCCIONES
// ============================================

export const LABELS_TIPO_QG: Record<TipoQualityGate, string> = {
  inbound: 'Control de Recepció',
  manufacturing: 'Control de Fabricació',
  outbound: 'Validació de Sortida',
};

export const LABELS_ESTADO_QG: Record<EstadoQualityGate, string> = {
  pendiente: 'Pendent',
  en_progreso: 'En Progrés',
  aprobado: 'Aprovat',
  rechazado: 'Rebutjat',
  bloqueado: 'Bloquejat',
};

export const COLORES_ESTADO_QG: Record<EstadoQualityGate, string> = {
  pendiente: 'bg-gray-100 text-gray-700',
  en_progreso: 'bg-blue-100 text-blue-700',
  aprobado: 'bg-green-100 text-green-700',
  rechazado: 'bg-red-100 text-red-700',
  bloqueado: 'bg-orange-100 text-orange-700',
};

// ============================================
// MOCK DATA - KPIs SLA
// ============================================

export const mockKPIsSLA: KPIsSLAC5 = {
  calidadEntregaDOA: {
    objetivo: 0.5,
    actual: 0.1,
    tendencia: 'mejora',
    totalEntregas: 1250,
    entregasDefectuosas: 1,
  },
  conformidadPedidos: {
    objetivo: 100,
    actual: 99.8,
    tendencia: 'estable',
    totalPedidos: 487,
    pedidosConformes: 486,
  },
  cumplimientoPlazo: {
    objetivo: 100,
    actual: 100,
    tendencia: 'estable',
    entregasEnPlazo: 487,
    entregasFueraPlazo: 0,
  },
  tiempoRespuestaRMA: {
    objetivoHoras: 48,
    actualHoras: 24,
    tendencia: 'mejora',
    rmasCerrados: 12,
    tiempoMedioHoras: 24,
  },
};

// ============================================
// MOCK DATA - QUALITY GATES
// ============================================

export const mockQualityGatesC5: QualityGateC5[] = [
  {
    id: 'QG-OUT-001',
    tipo: 'outbound',
    estado: 'aprobado',
    referenciaId: 'PED-001',
    referenciaTipo: 'pedido',
    referenciaCodigo: 'PED-C5-2025-001',
    checklist: CHECKLIST_OUTBOUND_QC.items.map(item => ({
      ...item,
      verificado: true,
      fechaVerificacion: new Date('2025-12-05T10:30:00'),
      verificadoPor: 'gss-001',
    })),
    firma: {
      id: 'FIRMA-001',
      usuarioId: 'gss-001',
      usuarioNombre: 'G.S.S. (Jefe de Proyecto)',
      usuarioRol: 'Jefe de Proyecto',
      fechaFirma: new Date('2025-12-05T10:35:00'),
      tipoFirma: 'aprobacion',
      observaciones: 'Picking verificado correctamente',
    },
    fechaCreacion: new Date('2025-12-05T09:00:00'),
    fechaInicio: new Date('2025-12-05T10:00:00'),
    fechaCierre: new Date('2025-12-05T10:35:00'),
    creadoPor: 'sistema',
  },
  {
    id: 'QG-MFG-001',
    tipo: 'manufacturing',
    estado: 'en_progreso',
    referenciaId: 'LOT-KIT-001',
    referenciaTipo: 'orden_fabricacion',
    referenciaCodigo: 'OF-KIT-2025-015',
    checklist: CHECKLIST_MANUFACTURING_QC.items.map((item, index) => ({
      ...item,
      verificado: index < 4, // Primeros 4 verificados
      fechaVerificacion: index < 4 ? new Date('2025-12-06T14:00:00') : undefined,
      verificadoPor: index < 4 ? 'gss-001' : undefined,
    })),
    firma: undefined,
    fechaCreacion: new Date('2025-12-06T12:00:00'),
    fechaInicio: new Date('2025-12-06T14:00:00'),
    fechaCierre: undefined,
    creadoPor: 'gss-001',
  },
  {
    id: 'QG-OUT-002',
    tipo: 'outbound',
    estado: 'pendiente',
    referenciaId: 'PED-002',
    referenciaTipo: 'pedido',
    referenciaCodigo: 'PED-C5-2025-002',
    checklist: CHECKLIST_OUTBOUND_QC.items.map(item => ({
      ...item,
      verificado: false,
    })),
    firma: undefined,
    fechaCreacion: new Date('2025-12-07T08:00:00'),
    fechaInicio: undefined,
    fechaCierre: undefined,
    creadoPor: 'sistema',
  },
];

// ============================================
// LOG DE ACTIVIDAD QA
// ============================================

export const mockLogActividadQA: LogActividadQA[] = [
  {
    id: 'LOG-001',
    qualityGateId: 'QG-OUT-001',
    accion: 'creado',
    usuarioId: 'sistema',
    usuarioNombre: 'Sistema',
    fecha: new Date('2025-12-05T09:00:00'),
    detalles: 'Quality Gate creado automáticamente para pedido PED-C5-2025-001',
  },
  {
    id: 'LOG-002',
    qualityGateId: 'QG-OUT-001',
    accion: 'check_verificado',
    usuarioId: 'gss-001',
    usuarioNombre: 'G.S.S. (Jefe de Proyecto)',
    fecha: new Date('2025-12-05T10:30:00'),
    detalles: 'Todos los items del checklist verificados',
  },
  {
    id: 'LOG-003',
    qualityGateId: 'QG-OUT-001',
    accion: 'firmado',
    usuarioId: 'gss-001',
    usuarioNombre: 'G.S.S. (Jefe de Proyecto)',
    fecha: new Date('2025-12-05T10:35:00'),
    detalles: 'Firma digital de aprobación',
  },
  {
    id: 'LOG-004',
    qualityGateId: 'QG-OUT-001',
    accion: 'aprobado',
    usuarioId: 'gss-001',
    usuarioNombre: 'G.S.S. (Jefe de Proyecto)',
    fecha: new Date('2025-12-05T10:35:00'),
    detalles: 'Quality Gate aprobado - Pedido puede pasar a PREPARADO',
  },
  {
    id: 'LOG-005',
    qualityGateId: 'QG-MFG-001',
    accion: 'iniciado',
    usuarioId: 'gss-001',
    usuarioNombre: 'G.S.S. (Jefe de Proyecto)',
    fecha: new Date('2025-12-06T14:00:00'),
    detalles: 'Control de fabricación iniciado para lote de Kits',
  },
];

// Usuario por defecto para acciones de QA
export const USUARIO_QA_DEFAULT = {
  id: 'gss-001',
  nombre: 'G.S.S. (Jefe de Proyecto)',
  rol: 'Jefe de Proyecto',
};
